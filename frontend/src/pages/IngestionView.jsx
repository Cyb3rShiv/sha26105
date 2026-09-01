import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Server, 
  Database, 
  Lock, 
  CheckCircle2, 
  Filter, 
  Clock,
  Flame,
  Terminal
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';

export default function IngestionView({ 
  events = [], 
  onSimulateEvent, 
  isSimulating = false, 
  lastSimulatedResponse = null 
}) {
  const [filterSource, setFilterSource] = useState('ALL');

  const filteredEvents = events.filter(evt => {
    return filterSource === 'ALL' || evt.source.includes(filterSource);
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h1 className="text-xl font-bold text-white">Continuous Security Telemetry Stream (OCSF / ECS)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time normalized ingestion pipeline aggregating SIEM, EDR, IAM, Vulnerability Scanners, and Threat Intel feeds.
          </p>
        </div>

        {/* Live Simulation Trigger Button */}
        <button
          onClick={onSimulateEvent}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-cyan transition-all transform active:scale-95 disabled:opacity-50"
        >
          {isSimulating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{isSimulating ? 'Ingesting & Recalculating...' : 'Simulate New Security Event'}</span>
        </button>
      </div>

      {/* Dynamic Recalculation Notification Banner */}
      {lastSimulatedResponse && (
        <div className="cyber-card border-cyan-500/50 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-cyan-950/40 p-4 flex items-start gap-3 animate-pulse-subtle">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-white font-mono text-sm">
              Live Continuous Risk Recalculation Triggered!
            </div>
            <p className="text-slate-300 mt-1">
              {lastSimulatedResponse.message}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">
                Updated Enterprise EAL: <strong className="text-rose-400">{formatINR(lastSimulatedResponse.updated_enterprise_eal)}</strong>
              </span>
              <span className="text-slate-400">
                Updated Score: <strong className="text-cyan-300">{lastSimulatedResponse.updated_enterprise_risk_score}/100</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stream Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-mono text-slate-400">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Telemetry Sources:</span>
          {['ALL', 'Vulnerability', 'SIEM', 'EDR', 'IAM', 'Threat Intel'].map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSource === src
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {src}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>100% Normalized to OCSF Canonical Schema</span>
        </div>
      </div>

      {/* Telemetry Stream Log Feed */}
      <div className="cyber-card p-0 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-cyber-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live Ingestion Audit Trail ({filteredEvents.length} Events)
          </h2>
          <span className="text-[10px] font-mono text-slate-400">Live Polling & Event Ingestion</span>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs max-h-[600px] overflow-y-auto">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">{evt.timestamp}</span>
                    <span className="px-2 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-bold text-[10px]">
                      {evt.source}
                    </span>
                    <RiskBadge level={evt.severity} />
                  </div>
                  <div className="font-semibold text-slate-200 mt-1 text-xs">{evt.description}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Affected Entity: <strong className="text-slate-300">{evt.affected_asset}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {evt.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
