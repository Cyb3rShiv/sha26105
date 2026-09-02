import { simulateMonteCarloClient, FINTRUST_FALLBACK_ASSETS } from './monteCarloFallback';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fintrust-backend-vmml.onrender.com/api';

// Generate or retrieve persistent demo session ID
function getSessionId() {
  if (typeof window === 'undefined') return 'server_session';
  let sid = window.sessionStorage?.getItem('cyberquant_session_id');
  if (!sid) {
    sid = `cq_sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    window.sessionStorage?.setItem('cyberquant_session_id', sid);
  }
  return sid;
}

// Global connectivity state listeners
let backendOnline = true;
const connectivityListeners = new Set();

function notifyConnectivity(isOnline) {
  if (backendOnline !== isOnline) {
    backendOnline = isOnline;
    connectivityListeners.forEach((cb) => cb(isOnline));
  }
}

export function subscribeConnectivity(callback) {
  connectivityListeners.add(callback);
  callback(backendOnline);
  return () => connectivityListeners.delete(callback);
}

export function isBackendOnline() {
  return backendOnline;
}

// Safe fetch wrapper with timeout and session header
async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    'X-Session-ID': getSessionId(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    notifyConnectivity(true);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn(`Request timed out after ${timeoutMs}ms: ${url}`);
    }
    notifyConnectivity(false);
    throw err;
  }
}

// Canonical FinTrust Security Controls Fallback
export const FINTRUST_FALLBACK_CONTROLS = [
  {
    id: "CTRL-001",
    name: "Patch Critical KEV Vulnerabilities (Payment & API)",
    description: "Automated patch deployment and emergency firmware upgrade across Internet-facing Payment servers and API Gateways.",
    category: "Vulnerability Mgmt",
    cost: 1500000.0,
    risk_reduction: 3500000.0,
    effectiveness: 0.75,
    target_asset_ids: ["AST-001", "AST-004"],
    is_implemented: false,
    rosi: 2.33,
    iso27001_mapping: "A.12.6.1 Management of technical vulnerabilities",
    nist_csf_mapping: "PR.IP-12 Vulnerability Management",
    rbi_mapping: "RBI Section 4: Patch Management",
    sebi_mapping: "SEBI CSCRF Chapter 3: Vulnerability Remediation"
  },
  {
    id: "CTRL-002",
    name: "Deploy Phishing-Resistant Hardware MFA (FIDO2)",
    description: "Enforce hardware security tokens (YubiKey/FIDO2) for all administrative logins and VPN access.",
    category: "Identity & Access",
    cost: 600000.0,
    risk_reduction: 1800000.0,
    effectiveness: 0.85,
    target_asset_ids: ["AST-001", "AST-003", "AST-005"],
    is_implemented: false,
    rosi: 3.00,
    iso27001_mapping: "A.9.4.2 Secure log-on procedures & MFA",
    nist_csf_mapping: "PR.AC-7 Multi-factor Authentication",
    rbi_mapping: "RBI Section 5: Two-Factor Authentication",
    sebi_mapping: "SEBI CSCRF Chapter 2: Identity & Privileged Access"
  },
  {
    id: "CTRL-003",
    name: "Next-Gen EDR & XDR Agent Upgrade",
    description: "Deploy behavioral Endpoint Detection and Response agents with real-time ransomware blocking on Domain Controllers and servers.",
    category: "Endpoint Security",
    cost: 1000000.0,
    risk_reduction: 1600000.0,
    effectiveness: 0.70,
    target_asset_ids: ["AST-001", "AST-002", "AST-005"],
    is_implemented: false,
    rosi: 1.60,
    iso27001_mapping: "A.12.2.1 Protection against malware",
    nist_csf_mapping: "DE.CM-4 Malicious Code Detection",
    rbi_mapping: "RBI Section 7: Endpoint Protection",
    sebi_mapping: "SEBI CSCRF Chapter 4: Endpoint Threat Detection"
  },
  {
    id: "CTRL-004",
    name: "Micro-segmentation & Zero Trust Network Architecture",
    description: "Isolate Core Database and Payment Server with granular East-West software-defined network segmentation.",
    category: "Network Security",
    cost: 1200000.0,
    risk_reduction: 2200000.0,
    effectiveness: 0.80,
    target_asset_ids: ["AST-001", "AST-002", "AST-004"],
    is_implemented: false,
    rosi: 1.83,
    iso27001_mapping: "A.13.1.3 Segregation in networks",
    nist_csf_mapping: "PR.AC-5 Network Segmentation",
    rbi_mapping: "RBI Section 3: Network Architecture",
    sebi_mapping: "SEBI CSCRF Chapter 2: Zero Trust Network"
  },
  {
    id: "CTRL-005",
    name: "Cloud SIEM & Automated SOAR Playbooks",
    description: "Centralized log ingestion with automated playbooks for immediate isolation of compromised accounts.",
    category: "Security Monitoring",
    cost: 800000.0,
    risk_reduction: 1100000.0,
    effectiveness: 0.65,
    target_asset_ids: ["AST-001", "AST-002", "AST-003", "AST-004", "AST-005"],
    is_implemented: false,
    rosi: 1.38,
    iso27001_mapping: "A.12.4.1 Event logging & SIEM",
    nist_csf_mapping: "DE.AE-1 Anomaly and Event Detection",
    rbi_mapping: "RBI Section 9: Security Operations Centre (SOC)",
    sebi_mapping: "SEBI CSCRF Chapter 4: Continuous Cyber Monitoring"
  },
  {
    id: "CTRL-006",
    name: "Database Activity Monitoring (DAM) & Field Encryption",
    description: "Real-time query inspection, masking, and field-level encryption for sensitive Aadhaar, PAN, and banking cardholder records.",
    category: "Data Protection",
    cost: 700000.0,
    risk_reduction: 1400000.0,
    effectiveness: 0.80,
    target_asset_ids: ["AST-002"],
    is_implemented: false,
    rosi: 2.00,
    iso27001_mapping: "A.10.1.1 Cryptographic controls",
    nist_csf_mapping: "PR.DS-1 Data-at-Rest Protection",
    rbi_mapping: "RBI Section 6: Data Protection Standards",
    sebi_mapping: "SEBI CSCRF Chapter 3: Sensitive Data Encryption"
  },
  {
    id: "CTRL-007",
    name: "API Security Gateway with Web Application Firewall (WAF)",
    description: "Deep API payload inspection, schema compliance enforcement, and DDoS protection for Internet Banking gateways.",
    category: "Application Security",
    cost: 500000.0,
    risk_reduction: 950000.0,
    effectiveness: 0.75,
    target_asset_ids: ["AST-004"],
    is_implemented: false,
    rosi: 1.90,
    iso27001_mapping: "A.14.1.2 Securing application services",
    nist_csf_mapping: "PR.PT-4 Network and Host Protection",
    rbi_mapping: "RBI Section 4: Web Application Security",
    sebi_mapping: "SEBI CSCRF Chapter 3: WAF & Perimeter Defenses"
  },
  {
    id: "CTRL-008",
    name: "Immutable Air-Gapped Ransomware Backups",
    description: "Write-Once-Read-Many (WORM) storage architecture with out-of-band dual authorization to guarantee recovery against destructive ransomware.",
    category: "Resilience & Recovery",
    cost: 400000.0,
    risk_reduction: 600000.0,
    effectiveness: 0.85,
    target_asset_ids: ["AST-006"],
    is_implemented: false,
    rosi: 1.50,
    iso27001_mapping: "A.12.3.1 Information backup",
    nist_csf_mapping: "RC.RP-1 Recovery Plan Execution",
    rbi_mapping: "RBI Section 8: Backup & Disaster Recovery",
    sebi_mapping: "SEBI CSCRF Chapter 5: Disaster Recovery"
  }
];

// Fallback 0/1 Knapsack Solver for resilient local optimization
function solveLocalKnapsack(budget = 2500000, controls = FINTRUST_FALLBACK_CONTROLS, baselineEal = 18400000) {
  const n = controls.length;
  if (budget <= 0) {
    return {
      budget,
      total_cost: 0,
      total_risk_reduction: 0,
      remaining_risk: baselineEal,
      overall_rosi: 0,
      baseline_eal: baselineEal,
      optimized_eal: baselineEal,
      selected_controls: [],
      unselected_controls: controls,
      optimization_summary: "No budget allocated."
    };
  }

  let bestCost = 0;
  let bestReduction = 0;
  let bestCombo = [];

  const numSubsets = 1 << n;
  for (let mask = 0; mask < numSubsets; mask++) {
    let currCost = 0;
    let currRed = 0;
    let currItems = [];

    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        currCost += controls[i].cost;
        currRed += controls[i].risk_reduction;
        currItems.push(controls[i]);
      }
    }

    if (currCost <= budget) {
      if (currRed > bestReduction || (currRed === bestReduction && currCost < bestCost)) {
        bestReduction = currRed;
        bestCost = currCost;
        bestCombo = currItems;
      }
    }
  }

  const selectedIds = new Set(bestCombo.map(c => c.id));
  const unselected = controls.filter(c => !selectedIds.has(c.id));
  const overallRosi = bestCost > 0 ? Number((bestReduction / bestCost).toFixed(2)) : 0;
  const remainingRisk = Math.max(0, baselineEal - bestReduction);

  return {
    budget,
    total_cost: bestCost,
    total_risk_reduction: bestReduction,
    remaining_risk: remainingRisk,
    overall_rosi: overallRosi,
    baseline_eal: baselineEal,
    optimized_eal: remainingRisk,
    selected_controls: bestCombo.sort((a, b) => b.rosi - a.rosi),
    unselected_controls: unselected.sort((a, b) => b.rosi - a.rosi),
    optimization_summary: `Optimized portfolio selected ${bestCombo.length} controls utilizing ₹${(bestCost/100000).toFixed(1)}L of ₹${(budget/100000).toFixed(1)}L budget, yielding ₹${(bestReduction/100000).toFixed(1)}L in risk reduction (ROSI ${overallRosi}x).`
  };
}

let activeOptimizeAbortController = null;

export const api = {
  async getDashboard() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/dashboard`);
      return await res.json();
    } catch (err) {
      console.warn('Backend connection failed, using local runtime fallback', err);
      // Canonical fallback data grounded in simulation
      const fallbackSim = simulateMonteCarloClient({ iterations: 10000 });
      const optRes = solveLocalKnapsack(2500000);
      return {
        organization: {
          name: "FinTrust Bank Ltd.",
          industry: "Banking & Financial Services",
          region: "India (RBI / SEBI Regulated)",
          annual_revenue_inr: 2500000000.0,
          allocated_security_budget_inr: 2500000.0,
          data_classification: "Synthetic Demo Data"
        },
        enterprise_risk_score: 70,
        expected_annual_loss: 18400000,
        p90_loss: fallbackSim.p90_loss,
        var_95: fallbackSim.var_95,
        p99_loss: fallbackSim.p99_loss,
        security_budget: 2500000,
        potential_risk_reduction: optRes.total_risk_reduction,
        residual_risk_target: 18400000 - optRes.total_risk_reduction,
        asset_count: 6,
        vulnerability_count: 8,
        active_controls_count: 0,
        pending_controls_count: 8,
        risk_trend_12m: [
          { month: "Oct", risk_score: 58, eal: 13248000 },
          { month: "Nov", risk_score: 61, eal: 13984000 },
          { month: "Dec", risk_score: 64, eal: 14904000 },
          { month: "Jan", risk_score: 63, eal: 14536000 },
          { month: "Feb", risk_score: 67, eal: 16192000 },
          { month: "Mar", risk_score: 69, eal: 16928000 },
          { month: "Apr", risk_score: 70, eal: 17296000 },
          { month: "May", risk_score: 71, eal: 17664000 },
          { month: "Jun", risk_score: 68, eal: 16560000 },
          { month: "Jul", risk_score: 70, eal: 17480000 },
          { month: "Aug", risk_score: 70, eal: 18032000 },
          { month: "Sep (Live)", risk_score: 70, eal: 18400000 }
        ],
        eal_by_asset: FINTRUST_FALLBACK_ASSETS,
        top_risk_drivers: [
          { driver: "Known Exploited Vulnerabilities (KEV)", weight: 95, affected_assets: "Payment Server, API Gateway", severity: "Critical" },
          { driver: "Public Internet Exposure", weight: 92, affected_assets: "Payment Server, VPN, API Gateway", severity: "Critical" },
          { driver: "Weak / Phishable MFA Posture", weight: 85, affected_assets: "Payment Server, VPN Gateway", severity: "High" },
          { driver: "Core Financial Asset Criticality", weight: 95, affected_assets: "Customer Database, Payment Server", severity: "High" },
          { driver: "Patch Gap & Delayed Remediation", weight: 80, affected_assets: "Internal Active Directory, Payment Server", severity: "Medium" }
        ],
        top_vulnerabilities: [],
        recommended_portfolio_summary: optRes,
        recent_events: [],
        data_classification: "Synthetic Demo Data (Offline Fallback Engine)"
      };
    }
  },

  async getAssets() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/assets`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch assets, returning fallback catalog', err);
      return FINTRUST_FALLBACK_ASSETS;
    }
  },

  async getAssetDetail(assetId) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/assets/${assetId}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch asset detail', err);
      const ast = FINTRUST_FALLBACK_ASSETS.find(a => a.id === assetId) || FINTRUST_FALLBACK_ASSETS[0];
      return {
        asset: ast,
        vulnerabilities: [],
        recommended_controls: FINTRUST_FALLBACK_CONTROLS.filter(c => c.target_asset_ids.includes(ast.id)),
        formula_explanation: {
          formula: "EAL = Incident Probability × Total Financial Impact",
          incident_probability_pct: `${(ast.incident_probability * 100).toFixed(1)}%`,
          financial_impact_inr: ast.total_financial_impact,
          eal_inr: ast.eal,
          calculation_steps: [
            `Likelihood = ${(ast.incident_probability * 100).toFixed(1)}%`,
            `Total Financial Impact = ₹${(ast.total_financial_impact / 10000000).toFixed(2)} Cr`,
            `Expected Annual Loss (EAL) = ₹${(ast.eal / 100000).toFixed(1)} Lakhs`
          ]
        }
      };
    }
  },

  async getVulnerabilities() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/vulnerabilities`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch vulnerabilities', err);
      return [];
    }
  },

  async getControls() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/controls`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch controls, returning fallback list', err);
      return FINTRUST_FALLBACK_CONTROLS;
    }
  },

  async runMonteCarlo(params = {}) {
    const iterations = params.iterations || 10000;
    const volatilitySigma = params.volatility_sigma !== undefined ? params.volatility_sigma : 0.35;
    const lossMultiplier = params.loss_multiplier !== undefined ? params.loss_multiplier : 1.0;
    const controlEffectiveness = params.control_effectiveness !== undefined ? params.control_effectiveness : 0.0;
    const probabilityModifier = params.probability_modifier !== undefined ? params.probability_modifier : 1.0;
    const timeHorizonYears = params.time_horizon_years !== undefined ? params.time_horizon_years : 1;

    const query = new URLSearchParams({
      iterations: iterations.toString(),
      volatility_sigma: volatilitySigma.toString(),
      loss_multiplier: lossMultiplier.toString(),
      control_effectiveness: controlEffectiveness.toString(),
      probability_modifier: probabilityModifier.toString(),
      time_horizon_years: timeHorizonYears.toString()
    });

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/simulate?${query.toString()}`, {
        method: 'POST'
      }, 15000);
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, executing resilient client-side Monte Carlo engine', err);
      return simulateMonteCarloClient({
        iterations,
        volatilitySigma,
        lossMultiplier,
        controlEffectiveness,
        probabilityModifier,
        timeHorizonYears
      });
    }
  },

  async optimizeBudget(budget) {
    if (activeOptimizeAbortController) {
      activeOptimizeAbortController.abort();
    }
    activeOptimizeAbortController = new AbortController();

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget }),
        signal: activeOptimizeAbortController.signal
      });
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') return null;
      console.warn('Backend optimization failed, using local knapsack engine', err);
      return solveLocalKnapsack(budget);
    }
  },

  async evaluateWhatIf(enabledControlIds) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/what-if`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled_control_ids: enabledControlIds })
      });
      return await res.json();
    } catch (err) {
      console.warn('Failed to evaluate what-if, computing locally', err);
      const active = FINTRUST_FALLBACK_CONTROLS.filter(c => enabledControlIds.includes(c.id));
      const totalCost = active.reduce((sum, c) => sum + c.cost, 0);
      const rawRed = active.reduce((sum, c) => sum + c.risk_reduction, 0);
      const cappedRed = Math.min(18400000, rawRed);
      const simEal = Math.max(0, 18400000 - cappedRed);
      const scoreRatio = cappedRed / 18400000;
      const simScore = Math.max(10, Math.round(70 * (1.0 - scoreRatio * 0.75)));
      const rosi = totalCost > 0 ? Number((cappedRed / totalCost).toFixed(2)) : 0;

      return {
        baseline_eal: 18400000,
        baseline_risk_score: 70,
        simulated_eal: simEal,
        simulated_risk_score: simScore,
        total_control_cost: totalCost,
        risk_reduction: cappedRed,
        net_benefit: cappedRed - totalCost,
        rosi,
        active_controls_count: active.length,
        asset_changes: []
      };
    }
  },

  async getAttackPath() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/attack-path`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch attack path', err);
      return null;
    }
  },

  async getCompliance() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/compliance`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch compliance mappings', err);
      return [];
    }
  },

  async getEvents() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/events`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch events', err);
      return [];
    }
  },

  async simulateEvent() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/events/simulate`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      console.warn('Failed to simulate event', err);
      // Local fallback simulation
      return {
        status: "success",
        generated_event: {
          id: `EVT-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          source: "Threat Intel (CISA KEV)",
          severity: "Critical",
          description: "Simulated Alert: Active exploit detected on Internet-facing Payment Server",
          affected_asset: "Internet-facing Payment Server",
          event_type: "exploit_signal",
          raw_payload: { simulation_trigger: true }
        },
        updated_enterprise_eal: 20400000,
        updated_enterprise_risk_score: 73,
        message: "New telemetry event ingested (Critical). Enterprise risk recalculated to ₹2.04 Cr (Score: 73/100)."
      };
    }
  },

  async resetState() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/reset`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      console.warn('Failed to reset state', err);
      return {
        status: "reset_successful",
        message: "Runtime state reset to default FinTrust Bank baseline (EAL ₹1.84 Cr, Score 70)."
      };
    }
  }
};
