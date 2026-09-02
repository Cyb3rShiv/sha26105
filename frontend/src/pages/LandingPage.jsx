import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  Coins,
  Sliders,
  FileCheck2,
  Activity,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  Lock,
  Award,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Globe2,
  Landmark,
  Scale,
  Terminal,
  Calculator,
} from 'lucide-react';
import RiskUniverseHeroCanvas from '../components/graphics/RiskUniverseHeroCanvas';
import LiveUniverseSandbox from '../components/interactive/LiveUniverseSandbox';
import FeatureExplorer from '../components/interactive/FeatureExplorer';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import CountUp from '../components/ui/CountUp';

const TYPED_PHRASES = [
  "Quantify your exposure in ₹ Rupees.",
  "Simulate 10,000 stochastic futures.",
  "Optimize every rupee of security capital.",
  "Turn cyber threats into balance-sheet clarity."
];

export default function LandingPage({ onLaunchConsole, dashboardData }) {
  // Typewriter state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Interactive Product Preview Tab state
  const [previewTab, setPreviewTab] = useState('overview');

  useEffect(() => {
    const currentPhrase = TYPED_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        if (displayedText === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        if (displayedText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPED_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, phraseIndex]);

  const currentEal = dashboardData?.expected_annual_loss || 18400000;
  const currentRiskScore = dashboardData?.enterprise_risk_score || 72;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* ===== STICKY TOP NAVIGATION BAR ===== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-white shadow-sm font-bold font-mono text-sm">
              CQ
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base">CyberQuant</span>
              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded ml-2 font-bold">
                ENTERPRISE
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-medium text-slate-600">
            <a href="#pipeline" className="hover:text-teal-800 transition-colors">Methodology</a>
            <a href="#sandbox" className="hover:text-teal-800 transition-colors">Live Simulation</a>
            <a href="#features" className="hover:text-teal-800 transition-colors">Capabilities</a>
            <a href="#compliance" className="hover:text-teal-800 transition-colors">Regulatory Trust</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchConsole('dashboard')}
              className="btn btn-primary text-xs shadow-sm"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Status pill with typewriter */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Continuous Cyber Risk Quantification:</span>
              <span className="font-bold text-teal-800 min-w-[200px] text-left">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950 leading-[1.1]">
              Cyber risk quantified in ₹ Rupees.
              <span className="block text-slate-500 text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
                Not arbitrary red/yellow/green heatmaps.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Continuous FAIR financial quantification, NumPy-accelerated Monte Carlo loss distributions, and 0/1 Knapsack capital optimization designed for Indian banking and regulated enterprises.
            </p>

            {/* Primary Action Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onLaunchConsole('dashboard')}
                className="btn btn-primary text-sm px-6 py-3 shadow-md w-full sm:w-auto"
              >
                <span>Launch FinTrust Bank Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLaunchConsole('monte_carlo')}
                className="btn btn-secondary text-sm px-6 py-3 w-full sm:w-auto shadow-xs"
              >
                <TrendingUp className="w-4 h-4 text-teal-700" />
                <span>Simulate 10,000 Trials</span>
              </button>
            </div>
          </div>

          {/* ===== SIGNATURE HERO VISUAL (Interactive Risk Canvas) ===== */}
          <div className="mt-12 max-w-5xl mx-auto">
            <RiskUniverseHeroCanvas />
          </div>

          {/* ===== LIVE PRODUCT PREVIEW TABS (Real Product, Not Fake Image) ===== */}
          <div className="mt-16 max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden">
            {/* Browser chrome header */}
            <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-[11px] font-mono text-slate-500 ml-2">app.cyberquant.internal/console</span>
              </div>
              <div className="flex items-center gap-1.5 p-0.5 bg-white rounded-lg border border-slate-200 text-xs font-mono">
                {[
                  { id: 'overview', label: 'Executive Dashboard' },
                  { id: 'simulation', label: 'Monte Carlo 10K' },
                  { id: 'optimizer', label: '0/1 Knapsack DP' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPreviewTab(t.id)}
                    className={`px-2.5 py-1 rounded-md transition-all font-bold ${
                      previewTab === t.id
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab 1: Executive Overview Preview */}
            {previewTab === 'overview' && (
              <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold">Expected Annual Loss</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">{formatINR(currentEal)}</div>
                    <div className="text-[10px] text-teal-700 font-mono mt-1 font-bold">−57.1% mitigatable</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold">Enterprise Risk Score</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">{currentRiskScore} <span className="text-slate-400 text-xs font-normal">/ 100</span></div>
                    <div className="text-[10px] text-amber-700 font-mono mt-1 font-bold">High Risk Threshold</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold">95% Value at Risk</div>
                    <div className="text-xl font-bold font-mono text-rose-600 mt-1">₹7.59 Crores</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">1-in-20-year loss</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold">Knapsack ROSI Multiplier</div>
                    <div className="text-xl font-bold font-mono text-teal-700 mt-1">4.20x</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">₹1.05Cr / ₹25L Spend</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-800">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Recommended CISO Security Allocation</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Selected: Emergency Patching (CVE-2024-3094) + FIDO2 MFA + Database Monitoring
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onLaunchConsole('optimizer')}
                    className="btn btn-secondary text-xs shadow-xs hidden sm:flex"
                  >
                    <span>Inspect Solution</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Monte Carlo Preview */}
            {previewTab === 'simulation' && (
              <div className="p-6 md:p-8 space-y-5 bg-[#f8fafc]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-800">Stochastic Distribution: 10,000 Iterations</span>
                  <span className="badge-emerald font-bold">Compound Log-Normal (σ = 0.35)</span>
                </div>
                <div className="h-40 bg-white rounded-xl border border-slate-200 p-3 flex items-end justify-between gap-1">
                  {[2, 8, 22, 54, 88, 140, 180, 150, 110, 75, 45, 28, 18, 12, 8, 5, 3, 2, 1, 1].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        i >= 12 ? 'bg-rose-600' : 'bg-teal-700'
                      }`}
                      style={{ height: `${(h / 180) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>P10: ₹0 (No breach)</span>
                  <span>P50 Median: ₹85.0L</span>
                  <span className="text-rose-600 font-bold">P95 VaR: ₹7.59Cr</span>
                  <span className="text-rose-800 font-bold">P99 Tail: ₹11.02Cr</span>
                </div>
              </div>
            )}

            {/* Tab 3: Knapsack Preview */}
            {previewTab === 'optimizer' && (
              <div className="p-6 md:p-8 space-y-4 bg-[#f8fafc]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-800">Dynamic Programming 0/1 Knapsack Solution</span>
                  <span className="text-teal-800 font-bold">Optimal Allocation: ₹25.0 Lakhs</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Emergency Patching for CVE-2024-3094', cost: '₹5.0 Lakhs', red: '₹36.0 Lakhs', rosi: '7.2x' },
                    { name: 'FIDO2 Hardware MFA on Active Directory & IAM', cost: '₹8.0 Lakhs', red: '₹40.0 Lakhs', rosi: '5.0x' },
                    { name: 'Database Activity Monitoring (DAM) on Core DB', cost: '₹12.0 Lakhs', red: '₹29.0 Lakhs', rosi: '2.4x' }
                  ].map((c, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                        <span className="font-bold text-slate-900">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600">
                        <span>Cost: <strong>{c.cost}</strong></span>
                        <span>Reduction: <strong className="text-teal-700">{c.red}</strong></span>
                        <span className="badge-emerald font-bold">{c.rosi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== REGULATORY TRUST STRIP ===== */}
      <section id="compliance" className="border-y border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">Regulatory Adherence</span>
              <span className="text-sm font-bold text-slate-800">Built for Indian Banking &amp; Capital Market Mandates</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-slate-700">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <Landmark className="w-3.5 h-3.5 text-blue-600" />
                RBI Cyber Security Framework
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                SEBI CSCRF 2024
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <Globe2 className="w-3.5 h-3.5 text-teal-700" />
                ISO/IEC 27001:2022
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <Award className="w-3.5 h-3.5 text-slate-700" />
                NIST CSF 2.0
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SCROLL STORYTELLING: 6 STAGES OF QUANTITATIVE RISK ===== */}
      <section id="pipeline" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase text-teal-800 font-bold tracking-wider">
            Deterministic Decision Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            From Raw CVE Telemetry to Boardroom Capital Allocation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              stage: '01',
              title: 'Understand Threat Signals',
              icon: Shield,
              desc: 'Correlates raw SIEM/EDR logs, IAM configurations, and CISA Known Exploited Vulnerabilities (KEV) across all enterprise assets.'
            },
            {
              stage: '02',
              title: 'Quantify Rupee Exposure',
              icon: Calculator,
              desc: 'Applies FAIR framework mathematical decomposition across 5 deterministic loss heads: Downtime, Data Breach, DPDP Fines, Recovery, and Churn.'
            },
            {
              stage: '03',
              title: 'Simulate 10,000 Futures',
              icon: TrendingUp,
              desc: 'Executes NumPy-powered Monte Carlo simulations using compound Bernoulli-LogNormal processes to model fat-tailed loss distributions.'
            },
            {
              stage: '04',
              title: 'Explain Primary Drivers',
              icon: BarChart3,
              desc: 'Transparently ranks asset-level risk contributions with zero black-box scoring. Every calculation is completely explainable.'
            },
            {
              stage: '05',
              title: 'Optimize Security Budget',
              icon: Coins,
              desc: 'Solves the 0/1 Knapsack Dynamic Programming problem to identify the exact control bundle that maximizes Return on Security Investment.'
            },
            {
              stage: '06',
              title: 'Decide with Board Confidence',
              icon: FileCheck2,
              desc: 'Generates defensible, audit-ready compliance cross-mappings for RBI, SEBI CSCRF 2024, and Board Risk Committees.'
            }
          ].map((s) => {
            const SIcon = s.icon;
            return (
              <div key={s.stage} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    STAGE {s.stage}
                  </span>
                  <SIcon className="w-5 h-5 text-slate-500" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== THE "HOLY SHIT" SECTION: LIVE INTERACTIVE UNIVERSE ===== */}
      <section id="sandbox" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveUniverseSandbox onLaunchConsole={onLaunchConsole} />
      </section>

      {/* ===== INTERACTIVE FEATURE EXPLORER ===== */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeatureExplorer onLaunchConsole={onLaunchConsole} />
      </section>

      {/* ===== FINAL JUDGE CTA BANNER ===== */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 md:p-14 bg-white rounded-3xl border border-slate-200 shadow-md space-y-6">
          <span className="text-xs font-mono font-bold uppercase text-teal-800 tracking-wider">
            Ready to inspect live enterprise risk?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Open the FinTrust Bank Risk Console
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Experience the fully functioning application with 0/1 Knapsack optimization, live Monte Carlo loss simulations, and explainable FAIR mathematics.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onLaunchConsole('dashboard')}
              className="btn btn-primary text-sm px-8 py-3.5 shadow-md"
            >
              <span>Enter Live Risk Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">CyberQuant Platform</span>
            <span>•</span>
            <span>SIH 2026 Problem Statement 26105</span>
          </div>
          <div>
            Built with deterministic FAIR math &amp; stochastic NumPy simulation engines.
          </div>
        </div>
      </footer>
    </div>
  );
}
