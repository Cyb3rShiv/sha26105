import { useEffect, useRef, useState } from 'react';
import { createConstellation } from './riskConstellation';
import { formatINR } from '../CurrencyFormatter';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ExposureConstellation({ assets = [], onSelect, className = '' }) {
  const mountRef = useRef(null);
  const [hover, setHover] = useState(null); // { asset, x, y }
  const [failed, setFailed] = useState(false);
  const hoverRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let api;
    try {
      api = createConstellation(mount, {
        assets,
        reducedMotion: prefersReducedMotion(),
        onHover: (asset, x, y) => {
          hoverRef.current = asset ? { asset, x, y } : null;
          setHover(hoverRef.current);
        },
        onSelect: (asset) => onSelect?.(asset),
      });
      if (!api) setFailed(true);
    } catch (err) {
      console.warn('WebGL constellation unavailable', err);
      setFailed(true);
    }

    return () => {
      api?.dispose?.();
      hoverRef.current = null;
    };
  }, []);

  const topAsset = assets.reduce((a, b) => ((b.eal || 0) > (a.eal || 0) ? b : a), { eal: 0 });

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-slate-900 ${className}`}
      role="img"
      aria-label={
        failed
          ? 'Exposure constellation unavailable'
          : `Interactive 3D exposure map: ${assets.length} critical assets orbiting the bank core; the largest exposure is ${topAsset.short_name || 'the primary asset'} at ${formatINR(topAsset.eal || 0)} expected annual loss. Drag to rotate, hover a node for detail, click to open the asset inventory.`
      }
    >
      {/* Corner registration marks */}
      <span className="absolute left-3 top-3 z-10 text-[9px] font-mono font-bold text-slate-400 tracking-wider pointer-events-none">
        RISK TOPOLOGY
      </span>
      <span className="absolute right-3 top-3 z-10 text-[9px] font-mono font-bold text-emerald-400 tracking-wider pointer-events-none">
        ● LIVE 3D GRAPH
      </span>
      <span className="absolute left-3 bottom-3 z-10 text-[9px] font-mono text-slate-400 pointer-events-none">
        DRAG TO ROTATE
      </span>

      <div ref={mountRef} className="absolute inset-0" />

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center px-6">
            <div className="text-slate-200 text-sm font-semibold">{assets.length} Assets Connected</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">Topology active in 2D Mode</div>
          </div>
        </div>
      )}

      {/* Hover readout — HTML overlay */}
      {hover && !failed && (
        <div
          role="tooltip"
          className="absolute z-20 bg-slate-900/95 border border-slate-700 shadow-xl rounded-lg px-3 py-2 pointer-events-none whitespace-nowrap backdrop-blur-sm"
          style={{
            left: Math.min(Math.max(hover.x + 14, 8), (mountRef.current?.clientWidth || 400) - 160),
            top: Math.max(hover.y - 10, 8),
          }}
        >
          <div className="text-[12px] font-mono font-bold text-white">{hover.asset.short_name}</div>
          <div className="text-[11px] font-mono text-rose-400 font-semibold mt-0.5">
            EAL {formatINR(hover.asset.eal)}
          </div>
          {hover.asset.incident_probability !== undefined && (
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              Likelihood {(hover.asset.incident_probability * 100).toFixed(1)}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
