import React, { useState } from 'react';
import {
  Server,
  Search,
  ArrowRight,
  Calculator,
  Globe,
  Database,
  X,
  ShieldCheck,
  Inbox,
} from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import RiskBadge from '../components/RiskBadge';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

export default function AssetsView({ assets = [], onNavigate }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExposure, setFilterExposure] = useState('ALL');

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.ip_address.includes(searchTerm) ||
                          a.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExposure = filterExposure === 'ALL' || a.exposure === filterExposure;
    return matchesSearch && matchesExposure;
  });

  const exposureChip = (exposure) =>
    exposure === 'Internet'
      ? 'bg-info-950 text-info-300 border border-info-800'
      : 'bg-ink-850 text-ink-300 border border-ink-700';

  const assetIcon = (asset) =>
    asset.exposure === 'Internet' ? <Globe className="w-4 h-4" /> : <Database className="w-4 h-4" />;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Server}
        eyebrow="Exposure / Asset Inventory"
        title="Enterprise Asset Risk Inventory"
        description="Quantified financial exposure and explainable risk profiles across FinTrust Bank's infrastructure."
      />

      {/* Search & filters */}
      <Reveal delay={60} className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search assets"
            placeholder="Search asset, IP, type…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <select
          aria-label="Filter by exposure"
          value={filterExposure}
          onChange={(e) => setFilterExposure(e.target.value)}
          className="select"
        >
          <option value="ALL">All Exposures</option>
          <option value="Internet">Internet Facing</option>
          <option value="Internal">Internal Subnets</option>
          <option value="Restricted">Restricted / Air-gap</option>
        </select>
        <span className="text-[11px] font-mono text-ink-500 sm:ml-auto">
          {filteredAssets.length} of {assets.length} assets
        </span>
      </Reveal>

      {/* ===== Desktop table ===== */}
      <Reveal delay={120} className="hidden md:block">
        <Panel flush>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Criticality</th>
                  <th>Exposure</th>
                  <th>Vulnerabilities</th>
                  <th>Incident Prob.</th>
                  <th>Financial Impact</th>
                  <th>EAL</th>
                  <th>Risk Score</th>
                  <th>Priority</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => {
                  const isPayment = asset.id === 'AST-001';
                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`cursor-pointer ${
                        isPayment
                          ? 'bg-danger-950/30 hover:bg-danger-950/50 border-l-2 border-l-danger-500'
                          : 'hover:bg-ink-850'
                      }`}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${isPayment ? 'bg-danger-950 text-danger-400 border-danger-800' : 'bg-ink-850 text-ink-300 border-ink-800'}`}>
                            {assetIcon(asset)}
                          </div>
                          <div>
                            <div className="font-semibold text-ink-50 flex items-center gap-2 whitespace-nowrap">
                              {asset.name}
                              {isPayment && (
                                <span className="text-[9px] px-1.5 py-px rounded bg-danger-950 text-danger-400 border border-danger-800 font-mono tracking-wider">
                                  PRIMARY RISK
                                </span>
                              )}
                            </div>
                            <div className="text-[10.5px] text-ink-400 font-mono mt-0.5">
                              {asset.ip_address} • {asset.business_unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><RiskBadge level={asset.criticality} /></td>
                      <td>
                        <span className={`chip ${exposureChip(asset.exposure)}`}>{asset.exposure}</span>
                      </td>
                      <td className="font-mono">
                        <span className="text-warn-400 font-bold">{asset.vulnerability_ids?.length || 0} CVEs</span>
                      </td>
                      <td className="font-mono font-semibold text-ink-100">
                        {(asset.incident_probability * 100).toFixed(1)}% / yr
                      </td>
                      <td className="font-mono text-ink-200"><CurrencyFormatter value={asset.total_financial_impact} /></td>
                      <td className="font-mono font-bold text-danger-400 text-[13px]">
                        <CurrencyFormatter value={asset.eal} />
                      </td>
                      <td>
                        <span className="font-mono font-bold text-ink-50 bg-ink-850 border border-ink-700 px-2 py-1 rounded-md text-[11px]">
                          {asset.risk_score} <span className="text-ink-500">/100</span>
                        </span>
                      </td>
                      <td><RiskBadge priority={asset.priority} /></td>
                      <td className="text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                          }}
                          className="btn btn-ghost !py-1 !px-2.5 text-[11px]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </Reveal>

      {/* ===== Mobile cards ===== */}
      <div className="md:hidden space-y-3">
        {filteredAssets.map((asset, idx) => {
          const isPayment = asset.id === 'AST-001';
          return (
            <Reveal key={asset.id} delay={idx * 50}>
              <button
                onClick={() => setSelectedAsset(asset)}
                className={`panel panel-hover w-full text-left p-4 ${isPayment ? 'border-danger-800 bg-danger-950/25' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border shrink-0 ${isPayment ? 'bg-danger-950 text-danger-400 border-danger-800' : 'bg-ink-850 text-ink-300 border-ink-800'}`}>
                      {assetIcon(asset)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] text-ink-50 truncate">{asset.name}</div>
                      <div className="text-[10px] text-ink-400 font-mono">{asset.ip_address} • {asset.business_unit}</div>
                    </div>
                  </div>
                  <RiskBadge priority={asset.priority} />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-ink-800 text-center">
                  <div>
                    <div className="eyebrow">EAL / yr</div>
                    <div className="text-[12px] font-mono font-bold text-danger-400 mt-1">
                      <CurrencyFormatter value={asset.eal} />
                    </div>
                  </div>
                  <div>
                    <div className="eyebrow">Prob.</div>
                    <div className="text-[12px] font-mono font-semibold text-ink-100 mt-1">
                      {(asset.incident_probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="eyebrow">Score</div>
                    <div className="text-[12px] font-mono font-semibold text-ink-100 mt-1">{asset.risk_score}/100</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={asset.criticality} />
                    <span className={`chip ${exposureChip(asset.exposure)}`}>{asset.exposure}</span>
                  </div>
                  <span className="text-[11px] font-mono text-brass-400 flex items-center gap-1">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <Panel>
          <EmptyState
            icon={Inbox}
            title="No assets match your filters"
            message="Try a different search term or exposure filter — the full inventory contains critical banking infrastructure."
            action={
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterExposure('ALL');
                }}
                className="btn btn-ghost"
              >
                Clear filters
              </button>
            }
          />
        </Panel>
      )}

      {/* ===== Inspection modal ===== */}
      <Modal open={!!selectedAsset} onClose={() => setSelectedAsset(null)} label="Asset risk inspection">
        {selectedAsset && (
          <div className="max-h-[85vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b border-ink-800 sticky top-0 bg-ink-900 z-10 rounded-t-[10px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-brass-950 border border-brass-800 text-brass-400 shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-ink-50">{selectedAsset.name}</h2>
                    <RiskBadge level={selectedAsset.criticality} />
                    <RiskBadge priority={selectedAsset.priority} />
                  </div>
                  <p className="text-[11px] text-ink-400 font-mono mt-1">
                    {selectedAsset.id} • IP: {selectedAsset.ip_address} • Owner: {selectedAsset.owner}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                aria-label="Close asset details"
                className="p-1.5 rounded-lg bg-ink-850 hover:bg-ink-800 text-ink-400 hover:text-ink-50 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Top metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="tile p-3.5">
                  <span className="eyebrow">Incident Probability</span>
                  <div className="text-lg font-mono font-bold text-ink-50 mt-1">
                    {(selectedAsset.incident_probability * 100).toFixed(1)}% / yr
                  </div>
                </div>
                <div className="tile p-3.5">
                  <span className="eyebrow">Estimated Impact</span>
                  <div className="text-lg font-mono font-bold text-warn-400 mt-1">
                    <CurrencyFormatter value={selectedAsset.total_financial_impact} />
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-danger-950/40 border border-danger-900">
                  <span className="eyebrow text-danger-400">Expected Annual Loss</span>
                  <div className="text-lg font-mono font-bold text-danger-400 mt-1">
                    <CurrencyFormatter value={selectedAsset.eal} />
                  </div>
                </div>
                <div className="tile p-3.5">
                  <span className="eyebrow">Risk Score</span>
                  <div className="text-lg font-mono font-bold text-brass-300 mt-1">
                    {selectedAsset.risk_score} / 100
                  </div>
                </div>
              </div>

              {/* Explainable FAIR breakdown */}
              <div className="p-4 rounded-lg bg-ink-950 border border-brass-900/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="eyebrow text-brass-400 flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5" />
                    Explainable Risk Quantification Breakdown (FAIR Standard)
                  </h3>
                  <span className="text-[9px] text-ink-500 font-mono whitespace-nowrap hidden sm:inline">ZERO BLACK-BOX SCORING</span>
                </div>

                <div className="space-y-2.5 text-xs font-mono bg-ink-900/80 p-3.5 rounded-md border border-ink-800">
                  <div className="text-ink-100 font-semibold">
                    <span className="text-brass-300">Step 1 — Incident Likelihood:</span>
                  </div>
                  <div className="text-ink-300 pl-3 leading-relaxed">
                    Base Probability ({selectedAsset.base_probability * 100}%) × Exposure Multiplier ({selectedAsset.exposure === 'Internet' ? '1.8x' : '0.85x'}) × Vuln Multiplier (2.0x) × MFA Weakness (1.25x) ={' '}
                    <strong className="text-ink-50">{(selectedAsset.incident_probability * 100).toFixed(1)}% annual likelihood</strong>
                  </div>

                  <div className="text-ink-100 font-semibold pt-1">
                    <span className="text-brass-300">Step 2 — Financial Impact Components:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pl-3 text-[11px]">
                    <div>Downtime: <span className="text-ink-100">{formatINR(selectedAsset.financial_impact_components?.downtime)}</span></div>
                    <div>Data Breach: <span className="text-ink-100">{formatINR(selectedAsset.financial_impact_components?.data_breach)}</span></div>
                    <div>Regulatory Fines: <span className="text-ink-100">{formatINR(selectedAsset.financial_impact_components?.regulatory)}</span></div>
                    <div>Forensics &amp; Recovery: <span className="text-ink-100">{formatINR(selectedAsset.financial_impact_components?.recovery)}</span></div>
                    <div>Business Disruption: <span className="text-ink-100">{formatINR(selectedAsset.financial_impact_components?.business_disruption)}</span></div>
                    <div className="text-brass-300 font-bold">Total: {formatINR(selectedAsset.total_financial_impact)}</div>
                  </div>

                  <div className="text-ink-300 pt-2.5 border-t border-ink-800 flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <strong className="text-danger-400">Step 3 — EAL: </strong>
                      {(selectedAsset.incident_probability * 100).toFixed(1)}% × {formatINR(selectedAsset.total_financial_impact)} ={' '}
                      <span className="text-danger-300 font-bold text-[13px]">{formatINR(selectedAsset.eal)}/year</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk drivers */}
              <div>
                <h3 className="eyebrow mb-2.5">Key Threat Signals &amp; Drivers</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
                  {[
                    { label: 'CISA KEV Weight', value: selectedAsset.risk_drivers?.kev_weight || 95, cls: 'text-danger-400' },
                    { label: 'Internet Exposure', value: selectedAsset.risk_drivers?.internet_exposure || 90, cls: 'text-warn-400' },
                    { label: 'MFA Gap', value: selectedAsset.risk_drivers?.weak_mfa || 85, cls: 'text-danger-400' },
                    { label: 'Asset Criticality', value: selectedAsset.risk_drivers?.asset_criticality || 95, cls: 'text-brass-300' },
                    { label: 'Patch Gap', value: selectedAsset.risk_drivers?.patch_gap || 80, cls: 'text-warn-400' },
                  ].map((d) => (
                    <div key={d.label} className="tile p-2.5">
                      <div className="text-[9.5px] text-ink-400 leading-tight">{d.label}</div>
                      <div className={`text-[13px] font-bold font-mono mt-1 ${d.cls}`}>{d.value}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended treatment */}
              <div className="p-4 rounded-lg bg-ok-950/40 border border-ok-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="eyebrow text-ok-400">Recommended Treatment</span>
                  <div className="text-xs text-ink-100 mt-1.5 leading-relaxed">{selectedAsset.recommended_treatment}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAsset(null);
                    onNavigate('optimizer');
                  }}
                  className="btn btn-ok whitespace-nowrap shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Allocate in Optimizer
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
