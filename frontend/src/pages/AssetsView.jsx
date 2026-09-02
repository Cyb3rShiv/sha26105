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
      ? 'badge-blue font-mono'
      : 'badge-slate font-mono';

  const assetIcon = (asset) =>
    asset.exposure === 'Internet' ? <Globe className="w-4 h-4 text-blue-600" /> : <Database className="w-4 h-4 text-slate-600" />;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Server}
        index="02"
        eyebrow="Exposure & Asset Inventory"
        title="Enterprise Asset Risk Inventory"
        description="Continuous financial quantification, FAIR multi-factor formulas, and explainable risk profiles across FinTrust Bank's infrastructure."
      />

      {/* Search & filters */}
      <Reveal delay={60} className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search assets"
            placeholder="Search asset name, IP, type…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-teal-700 shadow-sm"
          />
        </div>
        <select
          aria-label="Filter by exposure"
          value={filterExposure}
          onChange={(e) => setFilterExposure(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono focus:outline-teal-700 shadow-sm"
        >
          <option value="ALL">All Exposures</option>
          <option value="Internet">Internet Facing</option>
          <option value="Internal">Internal Subnets</option>
          <option value="Restricted">Restricted / Air-gapped</option>
        </select>
        <span className="text-xs font-mono text-slate-500 sm:ml-auto">
          {filteredAssets.length} of {assets.length} Assets
        </span>
      </Reveal>

      {/* ===== Desktop table ===== */}
      <Reveal delay={120} className="hidden md:block">
        <Panel flush>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Name &amp; Unit</th>
                  <th>Criticality</th>
                  <th>Exposure</th>
                  <th>CVEs</th>
                  <th>Incident Prob.</th>
                  <th>Impact</th>
                  <th>Expected Loss (EAL)</th>
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
                          ? 'bg-rose-50/50 hover:bg-rose-50 border-l-4 border-l-rose-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm shrink-0">
                            {assetIcon(asset)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                              {asset.name}
                              {isPayment && (
                                <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-mono font-bold tracking-wider">
                                  PRIMARY RISK
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {asset.ip_address} • {asset.business_unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><RiskBadge level={asset.criticality} /></td>
                      <td>
                        <span className={exposureChip(asset.exposure)}>{asset.exposure}</span>
                      </td>
                      <td className="font-mono">
                        <span className="text-amber-800 font-bold">{asset.vulnerability_ids?.length || 0} CVEs</span>
                      </td>
                      <td className="font-mono font-bold text-slate-900">
                        {(asset.incident_probability * 100).toFixed(1)}% / yr
                      </td>
                      <td className="font-mono text-slate-700">
                        <CurrencyFormatter value={asset.total_financial_impact} />
                      </td>
                      <td className="font-mono font-bold text-rose-600 text-[13px]">
                        <CurrencyFormatter value={asset.eal} />
                      </td>
                      <td>
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-[11px]">
                          {asset.risk_score} <span className="text-slate-400">/100</span>
                        </span>
                      </td>
                      <td><RiskBadge priority={asset.priority} /></td>
                      <td className="text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                          }}
                          className="btn btn-secondary !py-1 !px-2.5 text-xs shadow-sm"
                        >
                          Inspect Math
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
                className={`panel w-full text-left p-4 ${isPayment ? 'border-rose-200 bg-rose-50/40' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                      {assetIcon(asset)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">{asset.name}</div>
                      <div className="text-[10.5px] text-slate-500 font-mono">{asset.ip_address} • {asset.business_unit}</div>
                    </div>
                  </div>
                  <RiskBadge priority={asset.priority} />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">EAL / yr</div>
                    <div className="text-xs font-mono font-bold text-rose-600 mt-0.5">
                      <CurrencyFormatter value={asset.eal} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Prob.</div>
                    <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                      {(asset.incident_probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Score</div>
                    <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">{asset.risk_score}/100</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={asset.criticality} />
                    <span className={exposureChip(asset.exposure)}>{asset.exposure}</span>
                  </div>
                  <span className="text-xs font-mono text-teal-700 font-bold flex items-center gap-1">
                    Inspect Math <ArrowRight className="w-3 h-3" />
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
            message="Try adjusting search terms or exposure filters to browse enterprise assets."
            action={
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterExposure('ALL');
                }}
                className="btn btn-secondary text-xs"
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
          <div className="max-h-[85vh] overflow-y-auto bg-white rounded-xl">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900">{selectedAsset.name}</h2>
                    <RiskBadge level={selectedAsset.criticality} />
                    <RiskBadge priority={selectedAsset.priority} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {selectedAsset.id} • IP: {selectedAsset.ip_address} • Owner: {selectedAsset.owner}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                aria-label="Close asset details"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Top metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="tile p-3.5">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Incident Probability</div>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-1">
                    {(selectedAsset.incident_probability * 100).toFixed(1)}% / yr
                  </div>
                </div>
                <div className="tile p-3.5">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Estimated Impact</div>
                  <div className="text-lg font-mono font-bold text-amber-800 mt-1">
                    <CurrencyFormatter value={selectedAsset.total_financial_impact} />
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200">
                  <div className="text-[11px] font-mono uppercase text-rose-700 font-bold">Expected Annual Loss</div>
                  <div className="text-lg font-mono font-bold text-rose-600 mt-1">
                    <CurrencyFormatter value={selectedAsset.eal} />
                  </div>
                </div>
                <div className="tile p-3.5">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Risk Score</div>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-1">
                    {selectedAsset.risk_score} / 100
                  </div>
                </div>
              </div>

              {/* Explainable FAIR breakdown */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-mono uppercase font-bold text-teal-800 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    Explainable Risk Quantification (FAIR Standard)
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">ZERO BLACK-BOX SCORING</span>
                </div>

                <div className="space-y-2.5 text-xs font-mono bg-white p-3.5 rounded-md border border-slate-200">
                  <div className="text-slate-900 font-bold">
                    <span className="text-teal-800">Step 1 — Likelihood Calculation:</span>
                  </div>
                  <div className="text-slate-600 pl-3 leading-relaxed">
                    Base Probability ({selectedAsset.base_probability * 100}%) × Exposure Multiplier ({selectedAsset.exposure === 'Internet' ? '1.8x' : '0.85x'}) × Vuln Multiplier (2.0x) × MFA Gap (1.25x) ={' '}
                    <strong className="text-slate-900">{(selectedAsset.incident_probability * 100).toFixed(1)}% annual likelihood</strong>
                  </div>

                  <div className="text-slate-900 font-bold pt-1">
                    <span className="text-teal-800">Step 2 — Financial Loss Breakdown:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pl-3 text-[11px]">
                    <div>Downtime: <span className="font-bold text-slate-900">{formatINR(selectedAsset.financial_impact_components?.downtime)}</span></div>
                    <div>Data Breach: <span className="font-bold text-slate-900">{formatINR(selectedAsset.financial_impact_components?.data_breach)}</span></div>
                    <div>Regulatory Fines: <span className="font-bold text-slate-900">{formatINR(selectedAsset.financial_impact_components?.regulatory)}</span></div>
                    <div>Recovery &amp; Forensics: <span className="font-bold text-slate-900">{formatINR(selectedAsset.financial_impact_components?.recovery)}</span></div>
                    <div>Customer Churn: <span className="font-bold text-slate-900">{formatINR(selectedAsset.financial_impact_components?.business_disruption)}</span></div>
                    <div className="text-teal-800 font-bold">Total: {formatINR(selectedAsset.total_financial_impact)}</div>
                  </div>

                  <div className="text-slate-700 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <strong className="text-rose-700">Step 3 — Expected Annual Loss (EAL): </strong>
                      {(selectedAsset.incident_probability * 100).toFixed(1)}% × {formatINR(selectedAsset.total_financial_impact)} ={' '}
                      <span className="text-rose-600 font-bold text-sm">{formatINR(selectedAsset.eal)}/year</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threat Drivers */}
              <div>
                <h3 className="text-xs font-mono uppercase font-bold text-slate-600 mb-2">Key Threat Signals &amp; Drivers</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
                  {[
                    { label: 'CISA KEV Weight', value: selectedAsset.risk_drivers?.kev_weight || 95, cls: 'text-rose-600' },
                    { label: 'Internet Exposure', value: selectedAsset.risk_drivers?.internet_exposure || 90, cls: 'text-amber-700' },
                    { label: 'MFA Gap', value: selectedAsset.risk_drivers?.weak_mfa || 85, cls: 'text-rose-600' },
                    { label: 'Asset Criticality', value: selectedAsset.risk_drivers?.asset_criticality || 95, cls: 'text-teal-800' },
                    { label: 'Patch Gap', value: selectedAsset.risk_drivers?.patch_gap || 80, cls: 'text-amber-700' },
                  ].map((d) => (
                    <div key={d.label} className="tile p-2.5">
                      <div className="text-[10px] text-slate-500 leading-tight">{d.label}</div>
                      <div className={`text-sm font-bold font-mono mt-1 ${d.cls}`}>{d.value}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended treatment */}
              <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-teal-800">Recommended Treatment</div>
                  <div className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedAsset.recommended_treatment}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAsset(null);
                    onNavigate('optimizer');
                  }}
                  className="btn btn-primary text-xs whitespace-nowrap shrink-0 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Allocate in Optimizer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
