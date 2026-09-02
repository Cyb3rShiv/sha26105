import { simulateMonteCarloClient } from './monteCarloFallback';
import {
  CANONICAL_ASSETS,
  CANONICAL_VULNERABILITIES,
  CANONICAL_CONTROLS,
  CANONICAL_ATTACK_PATH,
  CANONICAL_COMPLIANCE,
  CANONICAL_EVENTS,
  CANONICAL_DASHBOARD
} from '../data/fallback/canonicalData';

export const FINTRUST_FALLBACK_ASSETS = CANONICAL_ASSETS;
export const FINTRUST_FALLBACK_CONTROLS = CANONICAL_CONTROLS;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fintrust-backend-vmml.onrender.com/api';

export function getHealthUrl(baseUrl = API_BASE_URL) {
  const clean = (baseUrl || '').replace(/\/+$/, '');
  if (clean.endsWith('/api')) {
    return `${clean}/health`;
  }
  return `${clean}/api/health`;
}

const HEALTH_URL = getHealthUrl(API_BASE_URL);

// Normalization adapters ensuring schema stability and zero "undefined" renders
export function normalizeAsset(a) {
  if (!a) return null;
  const name = a.name || a.id || 'Asset';
  const shortName = a.short_name || (
    name.split(' ')[0] + (name.includes('Server') ? ' Server' : name.includes('Database') ? ' DB' : name.includes('API') ? ' API' : '')
  );
  return {
    ...a,
    id: a.id,
    name,
    short_name: shortName,
    eal: Number(a.eal || 0),
    risk_score: Number(a.risk_score || 0),
    criticality: a.criticality || 'Medium',
    incident_probability: Number(a.incident_probability || 0)
  };
}

export function normalizeVulnerability(v) {
  if (!v) return null;
  const cvssVal = Number(v.cvss ?? v.cvss_score ?? 0);
  const epssVal = Number(v.epss_score ?? 0);
  const isKev = Boolean(v.is_kev);

  let driver = v.risk_driver;
  if (!driver) {
    if (isKev) {
      driver = 'CISA Known Exploited';
    } else if (epssVal > 0.5) {
      driver = 'High EPSS Probability';
    } else if (cvssVal >= 9.0) {
      driver = 'Critical CVSS RCE';
    } else if (cvssVal >= 7.0) {
      driver = 'Elevated CVSS Exposure';
    } else {
      driver = 'Security Posture Gap';
    }
  }

  let threat = v.threat_factor;
  if (threat === undefined || threat === null) {
    if (isKev) {
      threat = (2.0 + epssVal * 2.0).toFixed(1);
    } else if (cvssVal >= 9.0) {
      threat = (1.5 + (cvssVal - 9.0) * 0.5).toFixed(1);
    } else {
      threat = (1.0 + (cvssVal / 10.0)).toFixed(1);
    }
  }

  const priorityVal = v.priority || (v.severity === 'Critical' || cvssVal >= 9.0 ? 'P1' : cvssVal >= 7.0 ? 'P2' : 'P3');

  return {
    ...v,
    id: v.id || v.cve_id,
    cve_id: v.cve_id || v.id,
    cvss: cvssVal,
    cvss_score: cvssVal,
    priority: priorityVal,
    risk_driver: driver,
    threat_factor: threat,
    is_kev: isKev,
    epss_score: epssVal,
    severity: v.severity || (cvssVal >= 9.0 ? 'Critical' : cvssVal >= 7.0 ? 'High' : 'Medium')
  };
}

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

// Connection State Management: 'ONLINE' | 'CONNECTING' | 'OFFLINE'
let connectionState = 'ONLINE';
let reconnectTimer = null;
let reconnectAttempt = 0;
const MAX_CONNECTING_RETRIES = 5;

const connectivityListeners = new Set();
const reconnectListeners = new Set();

function notifyConnectivity(isOnline, state = isOnline ? 'ONLINE' : 'OFFLINE', message = '') {
  connectionState = state;
  connectivityListeners.forEach((cb) => cb(isOnline, { state, message }));
}

export function subscribeConnectivity(callback) {
  connectivityListeners.add(callback);
  callback(connectionState === 'ONLINE', { state: connectionState, message: '' });
  return () => connectivityListeners.delete(callback);
}

export function onBackendReconnect(callback) {
  reconnectListeners.add(callback);
  return () => reconnectListeners.delete(callback);
}

export function isBackendOnline() {
  return connectionState === 'ONLINE';
}

export function getConnectionState() {
  return connectionState;
}

function handleConnectionSuccess() {
  const wasOffline = connectionState !== 'ONLINE';
  connectionState = 'ONLINE';
  reconnectAttempt = 0;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  notifyConnectivity(true, 'ONLINE');
  if (wasOffline) {
    reconnectListeners.forEach((cb) => {
      try { cb(); } catch (e) { console.error('Reconnect listener error', e); }
    });
  }
}

function handleConnectionFailure(reason = '') {
  if (connectionState === 'ONLINE') {
    connectionState = 'CONNECTING';
    notifyConnectivity(false, 'CONNECTING', 'Backend unavailable. Attempting auto-reconnect...');
  }
  scheduleHealthPoll();
}

function scheduleHealthPoll() {
  if (reconnectTimer) return;
  // Exponential backoff: 2s, 4s, 8s, 16s, capped at 30s
  const backoffSec = Math.min(30, Math.pow(2, reconnectAttempt) * 2);
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(HEALTH_URL, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        handleConnectionSuccess();
        return;
      }
    } catch {
      // Still unreachable
    }

    reconnectAttempt++;
    if (reconnectAttempt >= MAX_CONNECTING_RETRIES) {
      connectionState = 'OFFLINE';
      notifyConnectivity(false, 'OFFLINE', 'Backend offline. Operating in resilient local engine.');
    }
    // Continue periodic background polling every 30 seconds
    scheduleHealthPoll();
  }, backoffSec * 1000);
}

export class RequestCancelledError extends Error {
  constructor(message = 'Request cancelled by user action') {
    super(message);
    this.name = 'RequestCancelledError';
    this.isCancelled = true;
  }
}

// Safe fetch wrapper with timeout, combined cancellation and error classification
async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const timeoutController = new AbortController();
  let isTimedOut = false;
  const timeoutId = setTimeout(() => {
    isTimedOut = true;
    timeoutController.abort();
  }, timeoutMs);

  const callerSignal = options.signal;
  const onCallerAbort = () => {
    timeoutController.abort();
  };

  if (callerSignal) {
    if (callerSignal.aborted) {
      clearTimeout(timeoutId);
      throw new RequestCancelledError();
    }
    callerSignal.addEventListener('abort', onCallerAbort, { once: true });
  }

  const headers = {
    'X-Session-ID': getSessionId(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: timeoutController.signal,
    });
    clearTimeout(timeoutId);
    if (callerSignal) {
      callerSignal.removeEventListener('abort', onCallerAbort);
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    handleConnectionSuccess();
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (callerSignal) {
      callerSignal.removeEventListener('abort', onCallerAbort);
    }

    // Distinguish between intentional cancellation and genuine network failure
    if (callerSignal?.aborted) {
      throw new RequestCancelledError();
    }

    if (isTimedOut) {
      console.warn(`Request timed out after ${timeoutMs}ms: ${url}`);
      handleConnectionFailure('Timeout');
      const timeoutErr = new Error(`Request timed out after ${timeoutMs}ms`);
      timeoutErr.name = 'TimeoutError';
      throw timeoutErr;
    }

    // Network / Server failure
    handleConnectionFailure(err.message);
    throw err;
  }
}

// Local 0/1 Knapsack fallback solver
// Uses Exhaustive Search for small sets, and DP array for sets > 16 to protect performance
export function solveLocalKnapsack(budget, controls = FINTRUST_FALLBACK_CONTROLS, baselineEal = 18400000) {
  const n = controls.length;
  let bestCombo = [];
  let bestReduction = 0;
  let bestCost = 0;
  let solverName = '0/1 Knapsack Exhaustive Search (Local Engine)';

  if (n <= 16) {
    // Safe exhaustive enumeration
    const totalSubsets = 1 << n;
    for (let mask = 0; mask < totalSubsets; mask++) {
      let currentCost = 0;
      let currentReduction = 0;
      const currentCombo = [];

      for (let i = 0; i < n; i++) {
        if ((mask & (1 << i)) !== 0) {
          currentCost += controls[i].cost;
          currentReduction += controls[i].risk_reduction;
          currentCombo.push(controls[i]);
        }
      }

      if (currentCost <= budget) {
        if (currentReduction > bestReduction || (currentReduction === bestReduction && currentCost < bestCost)) {
          bestReduction = currentReduction;
          bestCost = currentCost;
          bestCombo = currentCombo;
        }
      }
    }
  } else {
    // Dynamic Programming array for large control sets
    solverName = '0/1 Knapsack Dynamic Programming (Local Engine)';
    const scale = 50000;
    const scaledBudget = Math.floor(budget / scale);
    const dp = Array.from({ length: n + 1 }, () => new Float64Array(scaledBudget + 1));
    const keep = Array.from({ length: n + 1 }, () => new Uint8Array(scaledBudget + 1));

    for (let i = 1; i <= n; i++) {
      const c = controls[i - 1];
      const w = Math.ceil(c.cost / scale);
      const v = c.risk_reduction;
      for (let b = 0; b <= scaledBudget; b++) {
        if (w <= b && dp[i - 1][b - w] + v > dp[i - 1][b]) {
          dp[i][b] = dp[i - 1][b - w] + v;
          keep[i][b] = 1;
        } else {
          dp[i][b] = dp[i - 1][b];
          keep[i][b] = 0;
        }
      }
    }

    let b = scaledBudget;
    for (let i = n; i > 0; i--) {
      if (keep[i][b]) {
        bestCombo.push(controls[i - 1]);
        bestCost += controls[i - 1].cost;
        bestReduction += controls[i - 1].risk_reduction;
        b -= Math.ceil(controls[i - 1].cost / scale);
      }
    }
  }

  const unselected = controls.filter((c) => !bestCombo.some((s) => s.id === c.id));
  const remainingRisk = Math.max(0, baselineEal - bestReduction);
  const overallRosi = bestCost > 0 ? Number((bestReduction / bestCost).toFixed(2)) : 0;

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
    solver_engine: solverName,
    optimization_summary: `Optimized portfolio selected ${bestCombo.length} controls utilizing ₹${(bestCost / 100000).toFixed(1)}L of ₹${(budget / 100000).toFixed(1)}L budget, yielding ₹${(bestReduction / 100000).toFixed(1)}L in risk reduction (ROSI ${overallRosi}x).`
  };
}

let activeOptimizeAbortController = null;
let optimizeRequestSeq = 0;

export const api = {
  async getDashboard() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/dashboard`);
      const data = await res.json();
      return {
        ...data,
        top_vulnerabilities: (data.top_vulnerabilities || []).map(normalizeVulnerability),
        eal_by_asset: (data.eal_by_asset || []).map(normalizeAsset),
        solver_engine: '0/1 Knapsack Dynamic Programming (Backend API)'
      };
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Backend connection failed, using canonical local fallback', err);
      const fallbackSim = simulateMonteCarloClient({ iterations: 10000 });
      const optRes = solveLocalKnapsack(2500000);
      return {
        ...CANONICAL_DASHBOARD,
        p90_loss: fallbackSim.p90_loss,
        var_95: fallbackSim.var_95,
        p99_loss: fallbackSim.p99_loss,
        potential_risk_reduction: optRes.total_risk_reduction,
        residual_risk_target: 18400000 - optRes.total_risk_reduction,
        recommended_portfolio_summary: optRes,
        top_vulnerabilities: CANONICAL_VULNERABILITIES.slice(0, 5).map(normalizeVulnerability),
        eal_by_asset: CANONICAL_ASSETS.map(normalizeAsset),
        data_classification: 'Synthetic Demo Data (Operating in Local Engine Mode)'
      };
    }
  },

  async getAssets() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/assets`);
      const data = await res.json();
      return Array.isArray(data) ? data.map(normalizeAsset) : [];
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to fetch assets, returning canonical catalog', err);
      return CANONICAL_ASSETS.map(normalizeAsset);
    }
  },

  async getAssetDetail(assetId) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/assets/${assetId}`);
      const data = await res.json();
      if (data && data.asset) {
        data.asset = normalizeAsset(data.asset);
      }
      return data;
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to fetch asset detail', err);
      const ast = normalizeAsset(CANONICAL_ASSETS.find((a) => a.id === assetId) || CANONICAL_ASSETS[0]);
      return {
        asset: ast,
        vulnerabilities: CANONICAL_VULNERABILITIES.filter((v) => v.affected_asset_ids?.includes(ast.id)).map(normalizeVulnerability),
        recommended_controls: CANONICAL_CONTROLS.filter((c) => c.target_asset_ids.includes(ast.id)),
        formula_explanation: {
          formula: 'EAL = Incident Probability × Total Financial Impact',
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
      const data = await res.json();
      return Array.isArray(data) ? data.map(normalizeVulnerability) : [];
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to fetch vulnerabilities, returning canonical catalog', err);
      return CANONICAL_VULNERABILITIES.map(normalizeVulnerability);
    }
  },

  async getControls() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/controls`);
      return await res.json();
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to fetch controls, returning canonical catalog', err);
      return CANONICAL_CONTROLS;
    }
  },

  async runMonteCarlo(params = {}) {
    const iterations = Math.min(50000, Math.max(100, params.iterations || 10000));
    const volatilitySigma = Math.min(1.0, Math.max(0.1, params.volatility_sigma !== undefined ? params.volatility_sigma : 0.35));
    const lossMultiplier = Math.min(5.0, Math.max(0.1, params.loss_multiplier !== undefined ? params.loss_multiplier : 1.0));
    const controlEffectiveness = Math.min(0.95, Math.max(0.0, params.control_effectiveness !== undefined ? params.control_effectiveness : 0.0));
    const probabilityModifier = Math.min(3.0, Math.max(0.1, params.probability_modifier !== undefined ? params.probability_modifier : 1.0));
    const timeHorizonYears = Math.min(5, Math.max(1, params.time_horizon_years !== undefined ? params.time_horizon_years : 1));

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
      const data = await res.json();
      return { ...data, engine: 'NumPy Vectorized Log-Normal Engine (Backend API)' };
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Backend unavailable, executing resilient client-side Monte Carlo engine', err);
      const fallback = simulateMonteCarloClient({
        iterations,
        volatilitySigma,
        lossMultiplier,
        controlEffectiveness,
        probabilityModifier,
        timeHorizonYears
      });
      return { ...fallback, engine: 'Client-Side Box-Muller Engine (Local Fallback)' };
    }
  },

  async optimizeBudget(budget) {
    const seqId = ++optimizeRequestSeq;

    if (activeOptimizeAbortController) {
      activeOptimizeAbortController.abort();
    }
    activeOptimizeAbortController = new AbortController();
    const signal = activeOptimizeAbortController.signal;

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget }),
        signal
      });
      const data = await res.json();
      if (seqId !== optimizeRequestSeq) return null; // Stale request superseded
      return { ...data, solver_engine: '0/1 Knapsack Dynamic Programming (Backend API)' };
    } catch (err) {
      if (err instanceof RequestCancelledError || signal.aborted || seqId !== optimizeRequestSeq) {
        return null;
      }
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
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to evaluate what-if, computing locally', err);
      const active = CANONICAL_CONTROLS.filter((c) => enabledControlIds.includes(c.id));
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
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to fetch attack path, using canonical fallback', err);
      return CANONICAL_ATTACK_PATH;
    }
  },

  async getCompliance() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/compliance`);
      return await res.json();
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to fetch compliance mappings, using canonical fallback', err);
      return CANONICAL_COMPLIANCE;
    }
  },

  async getEvents() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/events`);
      return await res.json();
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to fetch events, using canonical fallback', err);
      return CANONICAL_EVENTS;
    }
  },

  async simulateEvent() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/events/simulate`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to simulate event', err);
      const ts = Date.now();
      return {
        status: 'success',
        generated_event: {
          id: `EVT-${(ts % 1000000).toString().padStart(6, '0')}-999`,
          timestamp: new Date().toISOString(),
          source: 'Threat Intel (CISA KEV)',
          severity: 'Critical',
          description: 'Simulated Alert: Active exploit detected on Internet-facing Payment Server',
          affected_asset: 'Internet-facing Payment Server',
          event_type: 'exploit_signal',
          raw_payload: { simulation_trigger: true }
        },
        updated_enterprise_eal: 20400000,
        updated_enterprise_risk_score: 73,
        message: 'New telemetry event ingested (Critical). Enterprise risk recalculated to ₹2.04 Cr (Score: 73/100).'
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
      if (err instanceof RequestCancelledError) return null;
      console.warn('Failed to reset state on backend', err);
      throw err;
    }
  }
};
