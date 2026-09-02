import React, { useState } from 'react';
import { Radio, Sparkles, RefreshCw, Clock, Terminal, Inbox } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { formatINR } from '../components/CurrencyFormatter';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import EmptyState from '../components/ui/EmptyState';

const SOURCE_FILTERS = ['ALL', 'Vulnerability', 'SIEM', 'EDR', 'IAM', 'Threat Intel'];

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
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Radio}
        index="09"
        eyebrow="Operations & Telemetry"
        title="Continuous Security Telemetry Stream"
        description="Real-time ingestion pipeline streaming and normalizing SIEM, EDR, IAM, Vulnerability Scanners, and Threat Intel feeds into OCSF / ECS schemas."
        actions={
          <button
            onClick={onSimulateEvent}
            disabled={isSimulating}
            className="btn btn-primary text-xs shadow-sm"
          >
            {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Ingesting & Recalculating…' : 'Simulate Telemetry Event'}</span>
          </button>
        }
      />

      {/* Recalculation banner */}
      {lastSimulatedResponse && (
        <Reveal className="panel border-teal-200 bg-teal-50/50 p-4 flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 font-mono text-xs flex items-center gap-2">
              Continuous Risk Recalculation Triggered
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-slate-600 mt-1 text-xs leading-relaxed">{lastSimulatedResponse.message}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-mono">
              <span className="text-slate-500">
                Updated Enterprise EAL: <strong className="text-rose-600 font-bold">{formatINR(lastSimulatedResponse.updated_enterprise_eal)}</strong>
              </span>
              <span className="text-slate-500">
                Updated Score: <strong className="text-teal-800 font-bold">{lastSimulatedResponse.updated_enterprise_risk_score}/100</strong>
              </span>
            </div>
          </div>
        </Reveal>
      )}

      {/* Source filters */}
      <Reveal delay={60} className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-500">
          <span className="font-semibold uppercase mr-1">Sources:</span>
          {SOURCE_FILTERS.map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              aria-pressed={filterSource === src}
              className={`px-2.5 py-1 rounded-md font-mono text-xs transition-all ${
                filterSource === src
                  ? 'bg-teal-700 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-teal-800 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>100% OCSF SCHEMA NORMALIZED</span>
        </div>
      </Reveal>

      {/* Event stream list */}
      <Reveal delay={120}>
        <Panel flush>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Timestamp</th>
                  <th>Source</th>
                  <th>Severity</th>
                  <th>Target Asset</th>
                  <th>Telemetry Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50">
                    <td className="font-mono font-bold text-slate-900 text-xs">{evt.id}</td>
                    <td className="font-mono text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-slate font-mono text-[10.5px]">
                        {evt.source}
                      </span>
                    </td>
                    <td>
                      <RiskBadge level={evt.severity} />
                    </td>
                    <td className="font-mono text-xs text-slate-800 font-semibold">{evt.target_asset || 'FinTrust Infrastructure'}</td>
                    <td className="text-xs text-slate-600 max-w-md font-mono">{evt.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </Reveal>

      {filteredEvents.length === 0 && (
        <Panel>
          <EmptyState
            icon={Inbox}
            title="No events matching source filter"
            message="Clear source filter or click Simulate Telemetry Event to ingest synthetic events."
            action={
              <button
                onClick={() => setFilterSource('ALL')}
                className="btn btn-secondary text-xs"
              >
                Show all events
              </button>
            }
          />
        </Panel>
      )}
    </div>
  );
}
