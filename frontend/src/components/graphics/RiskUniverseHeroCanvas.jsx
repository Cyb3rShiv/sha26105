import React, { useEffect, useRef } from 'react';

/**
 * RiskUniverseHeroCanvas — Signature Interactive Visual
 * Simulates uncertainty in real time.
 * Thousands of particles dynamically morph between enterprise assets and stochastic loss fields.
 * Fully respects prefers-reduced-motion and pauses when tab is hidden.
 */
export default function RiskUniverseHeroCanvas({ mode = 'constellation' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate particles representing stochastic trials & assets
    const particleCount = width < 640 ? 50 : 110;
    const particles = [];

    // 6 Primary Enterprise Cluster Anchors (FinTrust Bank)
    const anchors = [
      { xPct: 0.22, yPct: 0.38, name: 'Payment Gateway', color: 'rgba(225, 29, 72, 0.85)', radius: 7 },
      { xPct: 0.48, yPct: 0.28, name: 'Core Banking DB', color: 'rgba(15, 118, 110, 0.9)', radius: 8 },
      { xPct: 0.78, yPct: 0.42, name: 'Active Directory', color: 'rgba(217, 119, 6, 0.85)', radius: 6 },
      { xPct: 0.35, yPct: 0.68, name: 'Web Banking', color: 'rgba(14, 165, 233, 0.85)', radius: 6 },
      { xPct: 0.65, yPct: 0.72, name: 'API Microservices', color: 'rgba(99, 102, 241, 0.85)', radius: 7 },
      { xPct: 0.86, yPct: 0.22, name: 'Immutable Backups', color: 'rgba(16, 185, 129, 0.85)', radius: 5 },
    ];

    for (let i = 0; i < particleCount; i++) {
      const anchor = anchors[i % anchors.length];
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 85 + 15;

      particles.push({
        x: (anchor.xPct * width) + Math.cos(angle) * dist,
        y: (anchor.yPct * height) + Math.sin(angle) * dist,
        originX: anchor.xPct,
        originY: anchor.yPct,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.2 + 1.2,
        anchorIndex: i % anchors.length,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.4 + 0.35,
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = width / 2;
      mouseRef.current.targetY = height / 2;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let tick = 0;
    let isPaused = false;

    const onVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused && !reducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const render = () => {
      if (isPaused) return;
      tick += 0.016;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle coordinate grid lines
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Connections Between Anchors
      for (let a1 = 0; a1 < anchors.length; a1++) {
        for (let a2 = a1 + 1; a2 < anchors.length; a2++) {
          const x1 = anchors[a1].xPct * width;
          const y1 = anchors[a1].yPct * height;
          const x2 = anchors[a2].xPct * width;
          const y2 = anchors[a2].yPct * height;

          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, anchors[a1].color.replace('0.85', '0.2').replace('0.9', '0.2'));
          grad.addColorStop(1, anchors[a2].color.replace('0.85', '0.2').replace('0.9', '0.2'));

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 3. Draw & Animate Particles
      particles.forEach((p, idx) => {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Tether to anchor
          const anchor = anchors[p.anchorIndex];
          const ax = anchor.xPct * width;
          const ay = anchor.yPct * height;
          const dx = ax - p.x;
          const dy = ay - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 95) {
            p.vx += (dx / dist) * 0.02;
            p.vy += (dy / dist) * 0.02;
          }

          // Interactive cursor reaction
          if (mouseRef.current.isHovered) {
            const mx = p.x - mouseRef.current.x;
            const my = p.y - mouseRef.current.y;
            const mDist = Math.sqrt(mx * mx + my * my);
            if (mDist < 120 && mDist > 0) {
              const force = (120 - mDist) / 120;
              p.x += (mx / mDist) * force * 1.5;
              p.y += (my / mDist) * force * 1.5;
            }
          }
        }

        const pulse = reducedMotion ? 1 : Math.sin(tick * 3 + p.pulseOffset) * 0.3 + 0.7;
        ctx.fillStyle = anchors[p.anchorIndex].color.replace('0.85', (p.alpha * pulse).toString()).replace('0.9', (p.alpha * pulse).toString());
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Draw Core Anchor Nodes
      anchors.forEach((a) => {
        const ax = a.xPct * width;
        const ay = a.yPct * height;

        // Outer glow
        const glowRad = reducedMotion ? a.radius * 2 : a.radius * 2 + Math.sin(tick * 2) * 3;
        const grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, glowRad);
        grad.addColorStop(0, a.color.replace('0.85', '0.4').replace('0.9', '0.4'));
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ax, ay, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid core
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(ax, ay, a.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node label
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'center';
        ctx.fillText(a.name, ax, ay + a.radius + 14);
      });

      if (!reducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (reducedMotion) {
      render();
    } else {
      animFrameRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      <div className="absolute top-3 left-3 text-[10px] font-mono font-bold text-slate-400 bg-slate-50/90 px-2 py-1 rounded border border-slate-200 pointer-events-none">
        STOCHASTIC SIMULATION FIELD · 6 ENTERPRISE NODES
      </div>
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 pointer-events-none hidden sm:block">
        FAIR UNCERTAINTY DENSITY
      </div>
    </div>
  );
}
