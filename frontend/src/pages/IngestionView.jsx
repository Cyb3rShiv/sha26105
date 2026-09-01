import React, { useState } from 'react';
import { Radio, Sparkles, RefreshCw, Clock, Terminal, Inbox } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { formatINR } from '../components/CurrencyFormatter';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import EmptyState from '../components/ui/EmptyState';

const SOURCE_FILTERS = ['ALL', 'Vulnerability', 'SIEM', 'EDR', 'IAM', 'Threat Intel'];

const SEVERITY_RAIL = {
  critical: 'bg-danger-500',
  high: 'bg-warn-500',
  medium: 'bg-warn-400',
  low: 'bg-ok-500',
  info: 'bg-info-500',
};

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
        eyebrow="Operations / Telemetry"
        title="Continuous Security Telemetry Stream"
        description="Real-time normalized ingestion pipeline aggregating SIEM, EDR, IAM, Vulnerability Scanners, and Threat Intel feeds (OCSF / ECS)."
        actions={
          <button onClick={onSimulateEvent} disabled={isSimulating} className="btn btn-primary">
            {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isSimulating ? 'Ingesting & Recalculating…' : 'Simulate New Security Event'}</span>
          </button>
        }
      />

      {/* Recalculation banner */}
      {lastSimulatedResponse && (
        <Reveal className="panel border-brass-800/70 bg-brass-950/20 p-4 flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-brass-950 text-brass-400 border border-brass-800 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-ink-50 font-mono text-[13px] flex items-center gap-2">
              Live Continuous Risk Recalculation Triggered
              <span className="live-dot" />
            </div>
            <p className="text-ink-300 mt-1 text-xs leading-relaxed">{lastSimulatedResponse.message}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-mono">
              <span className="text-ink-400">
                Updated Enterprise EAL: <strong className="text-danger-400">{formatINR(lastSimulatedResponse.updated_enterprise_eal)}</strong>
              </span>
              <span className="text-ink-400">
                Updated Score: <strong className="text-brass-300">{lastSimulatedResponse.updated_enterprise_risk_score}/100</strong>
              </span>
            </div>
          </div>
        </Reveal>
      )}

      {/* Source filters */}
      <Reveal delay={60} className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-ink-900 border border-ink-800">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-400">
          <span className="mr-1 tracking-wider">SOURCES:</span>
          {SOURCE_FILTERS.map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              aria-pressed={filterSource === src}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                filterSource === src
                  ? 'bg-brass-500 text-ink-1000 font-bold'
                  : 'bg-ink-850 text-ink-400 hover:text-ink-100 border border-ink-800'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-ok-400">
          <span className="live-dot" />
          <span>100% NORMALIZED TO OCSF CANONICAL SCHEMA</span>
        </div>
      </Reveal>

      {/* Event stream */}
      <Reveal delay={120}>
        <Panel
          flush
          title="Live Ingestion Audit Trail"
          icon={Terminal}
          actions={
            <span className="text-[10px] font-mono text-ink-400">{filteredEvents.length} EVENTS</span>
          }
        >
          <div className="divide-y divide-ink-850 max-h-[620px] overflow-y-auto">
            {filteredEvents.map((evt) => {
              const rail = SEVERITY_RAIL[(evt.severity || '').toLowerCase()] || 'bg-ink-600';
              return (
                <div
                  key={evt.id}
                  className="relative pl-6 pr-4 md:pr-5 py-3.5 hover:bg-ink-850/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5"
                >
                  <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${rail} opacity-60`} aria-hidden="true" />

                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-1.5 rounded-md bg-ink-900 text-ink-400 border border-ink-800 shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-ink-500 text-[10.5px] font-mono">{evt.timestamp}</span>
                        <span className="chip !py-px text-brass-300 border-brass-800 bg-brass-950/70">{evt.source}</span>
                        <RiskBadge level={evt.severity} />
                      </div>
                      <div className="font-medium text-ink-100 mt-1 text-[12.5px] leading-snug">{evt.description}</div>
                      <div className="text-[10.5px] text-ink-500 mt-0.5 font-mono">
                        Affected Entity: <strong className="text-ink-300">{evt.affected_asset}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 md:text-right">
                    <span className="text-[9.5px] text-ink-500 bg-ink-950 px-2 py-1 rounded-md border border-ink-800 font-mono">
                      {evt.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <EmptyState
              icon={Inbox}
              title="No telemetry events for this source"
              message="Ingest a new synthetic security event to populate the live stream."
              action={
                filterSource !== 'ALL' ? (
                  <button onClick={() => setFilterSource('ALL')} className="btn btn-ghost">
                    Show all sources
                  </button>
                ) : (
                  <button onClick={onSimulateEvent} disabled={isSimulating} className="btn btn-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate Security Event</span>
                  </button>
                )
              }
            />
          )}

          {filteredEvents.length > 0 && (
            <div className="px-5 py-2.5 border-t border-ink-800 text-[9.5px] font-mono text-ink-500 flex items-center justify-between">
              <span>LIVE POLLING &amp; EVENT INGESTION</span>
              <span>END OF STREAM</span>
            </div>
          )}
        </Panel>
      </Reveal>
    </div>
  );
}
