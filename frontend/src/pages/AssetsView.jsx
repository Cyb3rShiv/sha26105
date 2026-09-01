import React, { useState } from 'react';
import { 
  Server, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  X, 
  Info,
  ExternalLink,
  Calculator,
  ArrowUpRight,
  Flame,
  Globe,
  Database,
  Shield,
  KeyRound
} from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import RiskBadge from '../components/RiskBadge';

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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Enterprise Asset Risk Inventory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantified financial exposure and explainable risk profiles across FinTrust Bank's infrastructure.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search asset, IP, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
            />
          </div>

          <select
            value={filterExposure}
            onChange={(e) => setFilterExposure(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Exposures</option>
            <option value="Internet">Internet Facing</option>
            <option value="Internal">Internal Subnets</option>
            <option value="Restricted">Restricted / Air-gap</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="cyber-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-cyber-border text-slate-400 font-mono uppercase tracking-wider">
                <th className="p-4">Asset Name & Details</th>
                <th className="p-4">Criticality</th>
                <th className="p-4">Exposure</th>
                <th className="p-4">Vulnerabilities</th>
                <th className="p-4">Incident Prob.</th>
                <th className="p-4">Financial Impact</th>
                <th className="p-4">Expected Loss (EAL)</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Priority</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                const isPayment = asset.id === 'AST-001';

                return (
                  <tr 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400' 
                        : isPayment 
                          ? 'bg-rose-950/20 hover:bg-rose-950/40 border-l-2 border-l-rose-500' 
                          : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isPayment ? 'bg-rose-950 text-rose-400 border border-rose-800/60' : 'bg-slate-800 text-slate-300'}`}>
                          {asset.exposure === 'Internet' ? <Globe className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {asset.name}
                            {isPayment && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-700/50 font-mono">
                                PRIMARY RISK
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {asset.ip_address} • {asset.business_unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <RiskBadge level={asset.criticality} />
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        asset.exposure === 'Internet' ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {asset.exposure}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="text-amber-400 font-bold">{asset.vulnerability_ids?.length || 0} CVEs</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">
                      {(asset.incident_probability * 100).toFixed(1)}% / yr
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      <CurrencyFormatter value={asset.total_financial_impact} />
                    </td>
                    <td className="p-4 font-mono font-bold text-rose-400 text-sm">
                      <CurrencyFormatter value={asset.eal} />
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded">
                        {asset.risk_score} <span className="text-[10px] text-slate-500">/100</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <RiskBadge priority={asset.priority} />
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAsset(asset);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-all text-[11px] font-mono"
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
      </div>

      {/* Asset Detail Inspection Modal / Drawer */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="cyber-card max-w-4xl w-full max-h-[90vh] overflow-y-auto border-cyan-500/40 relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-cyber-border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-700/50 text-cyan-400">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedAsset.name}</h2>
                    <RiskBadge level={selectedAsset.criticality} />
                    <RiskBadge priority={selectedAsset.priority} />
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedAsset.id} • IP: {selectedAsset.ip_address} • Owner: {selectedAsset.owner}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-5 space-y-6">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Incident Probability</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {(selectedAsset.incident_probability * 100).toFixed(1)}% / yr
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Estimated Impact</span>
                  <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                    <CurrencyFormatter value={selectedAsset.total_financial_impact} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-rose-900/40 bg-rose-950/20">
                  <span className="text-[10px] text-rose-400 uppercase font-mono">Expected Annual Loss</span>
                  <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
                    <CurrencyFormatter value={selectedAsset.eal} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Risk Score</span>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                    {selectedAsset.risk_score} / 100
                  </div>
                </div>
              </div>

              {/* Explainable Calculation Breakdown */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Explainable Risk Quantification Breakdown (FAIR Standard)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Zero Black-Box Scoring</span>
                </div>

                <div className="space-y-2 text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-300">
                    <strong className="text-cyan-300">Step 1 — Incident Likelihood:</strong>
                  </div>
                  <div className="text-slate-400 pl-3">
                    Base Probability ({selectedAsset.base_probability * 100}%) × Exposure Multiplier ({selectedAsset.exposure === 'Internet' ? '1.8x' : '0.85x'}) × Vuln Multiplier (2.0x) × MFA Weakness (1.25x) = <strong className="text-white">{(selectedAsset.incident_probability * 100).toFixed(1)}% annual likelihood</strong>
                  </div>

                  <div className="text-slate-300 mt-2">
                    <strong className="text-cyan-300">Step 2 — Financial Impact Components:</strong>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-3 pt-1 text-[11px]">
                    <div>Downtime: <span className="text-slate-200">{formatINR(selectedAsset.financial_impact_components?.downtime)}</span></div>
                    <div>Data Breach: <span className="text-slate-200">{formatINR(selectedAsset.financial_impact_components?.data_breach)}</span></div>
                    <div>Regulatory Fines: <span className="text-slate-200">{formatINR(selectedAsset.financial_impact_components?.regulatory)}</span></div>
                    <div>Forensics & Recovery: <span className="text-slate-200">{formatINR(selectedAsset.financial_impact_components?.recovery)}</span></div>
                    <div>Business Disruption: <span className="text-slate-200">{formatINR(selectedAsset.financial_impact_components?.business_disruption)}</span></div>
                    <div className="text-amber-400 font-bold">Total: {formatINR(selectedAsset.total_financial_impact)}</div>
                  </div>

                  <div className="text-slate-300 mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-rose-400">Step 3 — EAL: </strong> 
                      {(selectedAsset.incident_probability * 100).toFixed(1)}% × {formatINR(selectedAsset.total_financial_impact)} = <span className="text-rose-300 font-bold text-sm">{formatINR(selectedAsset.eal)}/year</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Drivers Weights */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase font-mono mb-2">Key Threat Signals & Drivers</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">CISA KEV Weight</div>
                    <div className="text-sm font-bold text-rose-400 font-mono mt-1">{selectedAsset.risk_drivers?.kev_weight || 95}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Internet Exposure</div>
                    <div className="text-sm font-bold text-amber-400 font-mono mt-1">{selectedAsset.risk_drivers?.internet_exposure || 90}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">MFA Gap</div>
                    <div className="text-sm font-bold text-rose-400 font-mono mt-1">{selectedAsset.risk_drivers?.weak_mfa || 85}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Asset Criticality</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono mt-1">{selectedAsset.risk_drivers?.asset_criticality || 95}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Patch Gap</div>
                    <div className="text-sm font-bold text-amber-400 font-mono mt-1">{selectedAsset.risk_drivers?.patch_gap || 80}%</div>
                  </div>
                </div>
              </div>

              {/* Recommended Treatment Plan */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Recommended Treatment</span>
                  <div className="text-xs text-slate-200 mt-1">{selectedAsset.recommended_treatment}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAsset(null);
                    onNavigate('optimizer');
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap shadow-glow-emerald transition-all"
                >
                  Allocate in Optimizer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
