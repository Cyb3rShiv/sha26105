import { simulateMonteCarloClient } from './monteCarloFallback';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fintrust-backend-vmml.onrender.com/api';


// Fail-safe mock data for resilient offline execution
const FALLBACK_STATE = {
  organization: {
    name: "FinTrust Bank Ltd.",
    industry: "Banking & Financial Services",
    region: "India (RBI / SEBI Regulated)",
    annual_revenue_inr: 2500000000.0,
    allocated_security_budget_inr: 2500000.0,
    data_classification: "Synthetic Demo Data (For Hackathon Demonstration Only)"
  }
};

export const api = {
  async getDashboard() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend connection failed, using local runtime fallback', err);
      return null;
    }
  },

  async getAssets() {
    try {
      const res = await fetch(`${API_BASE_URL}/assets`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch assets', err);
      return [];
    }
  },

  async getAssetDetail(assetId) {
    try {
      const res = await fetch(`${API_BASE_URL}/assets/${assetId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch asset detail', err);
      return null;
    }
  },

  async getVulnerabilities() {
    try {
      const res = await fetch(`${API_BASE_URL}/vulnerabilities`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch vulnerabilities', err);
      return [];
    }
  },

  async getControls() {
    try {
      const res = await fetch(`${API_BASE_URL}/controls`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch controls', err);
      return [];
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
      const res = await fetch(`${API_BASE_URL}/simulate?${query.toString()}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    try {
      const res = await fetch(`${API_BASE_URL}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to optimize budget', err);
      return null;
    }
  },

  async evaluateWhatIf(enabledControlIds) {
    try {
      const res = await fetch(`${API_BASE_URL}/what-if`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled_control_ids: enabledControlIds })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to evaluate what-if', err);
      return null;
    }
  },

  async getAttackPath() {
    try {
      const res = await fetch(`${API_BASE_URL}/attack-path`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch attack path', err);
      return null;
    }
  },

  async getCompliance() {
    try {
      const res = await fetch(`${API_BASE_URL}/compliance`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch compliance mappings', err);
      return [];
    }
  },

  async getEvents() {
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch events', err);
      return [];
    }
  },

  async simulateEvent() {
    try {
      const res = await fetch(`${API_BASE_URL}/events/simulate`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to simulate event', err);
      return null;
    }
  },

  async resetState() {
    try {
      const res = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to reset state', err);
      return null;
    }
  }
};
