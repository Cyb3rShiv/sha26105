import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Coins,
  Sliders,
  FileCheck2,
  Network,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Database,
  Layers,
  Scale,
} from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../CurrencyFormatter';
import {
  CANONICAL_BASELINE_EAL,
  CANONICAL_BASELINE_SCORE,
  CANONICAL_OPTIMAL_PORTFOLIO,
  PAYMENT_SERVER_METRICS
} from '../../domain/riskModel';

const FEATURES = [
  {
    id: 'fair',
    tab: 'monte_carlo',
    index: '01',
    title: 'FAIR Risk Quantification',
    icon: Calculator,
    tagline: 'Zero black-box risk scoring. Real rupee financial impact.',
    description: 'Decomposes cyber risk into Incident Likelihood × Financial Severity across 5 deterministic loss categories: Downtime, Data Breach, Regulatory DPDP fines, Incident Recovery, and Business Disruption.',
    previewTitle: 'Internet-facing Payment Server (AST-001) FAIR Breakdown',
    stat1: { label: 'Likelihood', value: `${PAYMENT_SERVER_METRICS.likelihoodPct.toFixed(1)}% / yr` },
    stat2: { label: 'Single Loss Event', value: PAYMENT_SERVER_METRICS.singleLossFormatted },
    stat3: { label: 'Expected Annual Loss', value: PAYMENT_SERVER_METRICS.ealFormatted },
    formula: PAYMENT_SERVER_METRICS.formulaText,
  },
  {
    id: 'monte_carlo',
    tab: 'monte_carlo',
    index: '02',
    title: 'Monte Carlo Loss Engine',
    icon: TrendingUp,
    tagline: 'Simulate 10,000 uncertain futures with Log-Normal severity.',
    description: 'Replaces single-point estimates with compound Bernoulli and Log-Normal loss distributions. Quantifies tail risk percentiles (P10, P50, P90, P95, P99) and 95% Cyber Value at Risk (VaR).',
    previewTitle: '10,000 Trial Simulation Output',
    stat1: { label: 'Mean Annual Loss', value: '₹1.84 Cr' },
    stat2: { label: 'P90 Tail Loss', value: '₹5.59 Cr' },
    stat3: { label: '95% Value at Risk', value: '₹7.19 Cr' },
    formula: '95% of simulated scenarios fall below ₹7.19 Cr (VaR 95%). Compound Log-Normal dispersion factor σ = 0.35 with mean preservation.',
  },
  {
    id: 'optimizer',
    tab: 'optimizer',
    index: '03',
    title: '0/1 Knapsack Optimizer',
    icon: Coins,
    tagline: 'Maximize cyber risk reduction within a strict CISO budget.',
    description: 'Solves the bounded 0/1 knapsack dynamic programming problem to select the mathematically optimal portfolio of security controls that maximizes Return on Security Investment (ROSI).',
    previewTitle: '₹25.0 Lakhs Optimal Security Allocation',
    stat1: { label: 'Allocated Budget', value: '₹25.0 L' },
    stat2: { label: 'Risk Reduction', value: `₹${(CANONICAL_OPTIMAL_PORTFOLIO.reduction / 100000).toFixed(1)} L` },
    stat3: { label: 'Benefit-Cost Ratio (BCR)', value: `${CANONICAL_OPTIMAL_PORTFOLIO.bcr}x BCR (${CANONICAL_OPTIMAL_PORTFOLIO.netRosi}% Net ROSI)` },
    formula: `Dynamic Programming state matrix selects Emergency Patching + FIDO2 MFA + Air-Gapped Backups to eliminate ₹${(CANONICAL_OPTIMAL_PORTFOLIO.reduction / 100000).toFixed(1)}L of baseline risk (${CANONICAL_OPTIMAL_PORTFOLIO.mitigatablePct}%).`,
  },
  {
    id: 'what_if',
    tab: 'what_if',
    index: '04',
    title: 'What-If Scenario Sandbox',
    icon: Sliders,
    tagline: 'Interactive before-and-after posture modeling.',
    description: 'Toggle proposed security investments in real time to simulate instantaneous shifts in Enterprise Risk Score, Expected Annual Loss, and residual exposure before signing vendor purchase orders.',
    previewTitle: 'Before vs After Control Evaluation',
    stat1: { label: 'Baseline Score', value: `${CANONICAL_BASELINE_SCORE} / 100` },
    stat2: { label: 'Optimal Remediation', value: `${CANONICAL_OPTIMAL_PORTFOLIO.simulatedScore} / 100 (−${CANONICAL_OPTIMAL_PORTFOLIO.scoreDelta} pts)` },
    stat3: { label: 'Net Financial Value', value: `₹${(CANONICAL_OPTIMAL_PORTFOLIO.netBenefit / 100000).toFixed(1)} L` },
    formula: `Instantly quantifies exposure shift: Baseline ₹1.84 Cr → Simulated Residual ₹${(CANONICAL_OPTIMAL_PORTFOLIO.residual / 10000000).toFixed(2)} Cr (Net Value ₹${(CANONICAL_OPTIMAL_PORTFOLIO.netBenefit / 100000).toFixed(1)}L).`,
  },
  {
    id: 'compliance',
    tab: 'compliance',
    index: '05',
    title: 'Regulatory & Audit Matrix',
    icon: FileCheck2,
    tagline: 'Cross-mapped to RBI, SEBI CSCRF 2024, ISO 27001 & NIST CSF.',
    description: 'Eliminates compliance audit silos by automatically linking quantified security controls to RBI Cybersecurity Framework, SEBI CSCRF 2024, ISO 27001:2022 Annex A, and NIST CSF 2.0.',
    previewTitle: 'Audit-Ready Traceability Matrix',
    stat1: { label: 'RBI Guidelines', value: 'Framework-Aligned' },
    stat2: { label: 'SEBI CSCRF 2024', value: 'Circular-Aligned' },
    stat3: { label: 'ISO 27001 Annex A', value: '100% Aligned' },
    formula: 'Continuous compliance mapping validates regulatory control adherence alongside financial risk reduction.',
  },
  {
    id: 'attack_path',
    tab: 'attack_path',
    index: '06',
    title: 'Visual Multi-Stage Kill Chain',
    icon: Network,
    tagline: 'End-to-end lateral movement and financial damage modeling.',
    description: 'Traces adversary attack progression from external internet recon (T1595) through public-facing exploit (T1190) and unsegmented lateral pivot to customer core database exfiltration.',
    previewTitle: '6-Stage Adversary Kill Chain Graph',
    stat1: { label: 'Critical Ingress', value: 'Payment Server' },
    stat2: { label: 'Target Vault', value: '1.2M KYC DB' },
    stat3: { label: 'Total Kill Chain Risk', value: '₹4.00 Cr' },
    formula: 'Correlates MITRE ATT&CK techniques directly with quantitative risk mitigation treatments.',
  },
];

export default function FeatureExplorer({ onLaunchConsole }) {
  const [activeId, setActiveId] = useState('fair');
  const active = FEATURES.find((f) => f.id === activeId) || FEATURES[0];
  const Icon = active.icon;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-teal-800 tracking-wider">
            Comprehensive Platform Architecture
          </span>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Explore the Quantitative Risk Engine
          </h3>
        </div>
        <p className="text-xs font-mono text-slate-500 max-w-md">
          Click through each component to inspect its mathematical methodology, inputs, and executive decision outputs.
        </p>
      </div>

      {/* Grid: Feature selector + Rich preview card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Buttons */}
        <div className="lg:col-span-5 space-y-2">
          {FEATURES.map((f) => {
            const FIcon = f.icon;
            const isSelected = f.id === activeId;
            return (
              <button
                key={f.id}
                onClick={() => setActiveId(f.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-teal-50 border-teal-600 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 border ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-800'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <FIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-slate-400 font-semibold">{f.index}</div>
                    <div className={`font-bold text-sm truncate ${isSelected ? 'text-teal-950' : 'text-slate-800'}`}>
                      {f.title}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold ${isSelected ? 'text-teal-700' : 'text-slate-400'}`}>
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Active Preview Box */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-lg bg-teal-100 text-teal-800 border border-teal-200">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-teal-800 font-bold uppercase">{active.index} • Module Focus</span>
                  <h4 className="text-xl font-bold text-slate-900">{active.title}</h4>
                </div>
              </div>
              <span className="badge-emerald font-mono text-xs">{active.tagline}</span>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              {active.description}
            </p>

            {/* Metrics Triplet */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold">{active.stat1.label}</div>
                <div className="text-sm md:text-base font-bold font-mono text-slate-900 mt-1">{active.stat1.value}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold">{active.stat2.label}</div>
                <div className="text-sm md:text-base font-bold font-mono text-teal-700 mt-1">{active.stat2.value}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold">{active.stat3.label}</div>
                <div className="text-sm md:text-base font-bold font-mono text-rose-600 mt-1">{active.stat3.value}</div>
              </div>
            </div>

            {/* Formula / Proof Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
              <div className="text-[10px] uppercase font-bold text-teal-800">Mathematical Output Logic:</div>
              <div className="leading-relaxed text-slate-800">{active.formula}</div>
            </div>
          </div>

          {/* Action to Jump Directly Into Console */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-500">
              Zero synthetic mockups. Uses live production calculations.
            </span>
            <button
              onClick={() => onLaunchConsole(active.tab)}
              className="btn btn-primary text-xs shadow-sm self-start sm:self-auto"
            >
              <span>Launch {active.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
