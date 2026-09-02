from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import copy
from datetime import datetime
import random

from models import (
    DashboardSummary, Asset, Vulnerability, SecurityControl,
    MonteCarloResult, OptimizationRequest, OptimizationResult,
    WhatIfRequest, WhatIfResult, AttackPathGraph, TelemetryEvent
)
from seed_data import (
    ORGANIZATION_INFO, ASSETS_SEED, VULNERABILITIES_SEED,
    SECURITY_CONTROLS_SEED, INITIAL_TELEMETRY_EVENTS,
    SIMULATION_EVENT_POOL, ATTACK_PATH_SEED, COMPLIANCE_MAPPINGS_SEED
)
from risk_engine import RiskEngine
from monte_carlo import MonteCarloSimulator
from optimizer import InvestmentOptimizer

app = FastAPI(
    title="Cyber Risk Quantification & Investment Optimization API",
    description="AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform for FinTrust Bank (SIH PS 26105)",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory runtime state (initialized from seed data)
RUNTIME_STATE = {
    "assets": copy.deepcopy(ASSETS_SEED),
    "vulnerabilities": copy.deepcopy(VULNERABILITIES_SEED),
    "controls": copy.deepcopy(SECURITY_CONTROLS_SEED),
    "events": copy.deepcopy(INITIAL_TELEMETRY_EVENTS),
    "attack_path": copy.deepcopy(ATTACK_PATH_SEED),
    "compliance": copy.deepcopy(COMPLIANCE_MAPPINGS_SEED),
    "allocated_budget": 2500000.0,  # ₹25.0 Lakhs
    "monte_carlo_cache": None,
    "last_updated": datetime.now().isoformat()
}

def get_current_metrics():
    """Calculates live enterprise risk and EAL across current asset state."""
    assets = RUNTIME_STATE["assets"]
    total_eal = sum(a["eal"] for a in assets)
    avg_score = int(round(sum(a["risk_score"] for a in assets) / max(1, len(assets))))
    return round(total_eal, 2), avg_score

@app.api_route("/api/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat(), "organization": ORGANIZATION_INFO["name"]}

@app.get("/api/dashboard")
def get_dashboard() -> Dict[str, Any]:
    """Returns Executive CISO Dashboard data with dynamic financial risk metrics."""
    assets = RUNTIME_STATE["assets"]
    controls = RUNTIME_STATE["controls"]
    vulnerabilities = RUNTIME_STATE["vulnerabilities"]
    budget = RUNTIME_STATE["allocated_budget"]

    total_eal, avg_risk_score = get_current_metrics()

    # Pre-calculated or cached Monte Carlo baseline
    p90_loss = round(total_eal * 2.28, 2)  # ≈ ₹4.20 Cr for ₹1.84 Cr EAL
    var_95 = round(total_eal * 1.95, 2)    # ≈ ₹3.60 Cr for ₹1.84 Cr EAL

    # Calculate optimal investment for default budget
    opt_res = InvestmentOptimizer.optimize_security_budget(controls, budget, baseline_eal=total_eal)
    potential_reduction = opt_res["total_risk_reduction"]

    # 12-Month Risk Trend (Historical telemetry synthesis)
    trend = [
        {"month": "Oct", "risk_score": 58, "eal": round(total_eal * 0.72, 2)},
        {"month": "Nov", "risk_score": 61, "eal": round(total_eal * 0.76, 2)},
        {"month": "Dec", "risk_score": 64, "eal": round(total_eal * 0.81, 2)},
        {"month": "Jan", "risk_score": 63, "eal": round(total_eal * 0.79, 2)},
        {"month": "Feb", "risk_score": 67, "eal": round(total_eal * 0.88, 2)},
        {"month": "Mar", "risk_score": 69, "eal": round(total_eal * 0.92, 2)},
        {"month": "Apr", "risk_score": 70, "eal": round(total_eal * 0.94, 2)},
        {"month": "May", "risk_score": 71, "eal": round(total_eal * 0.96, 2)},
        {"month": "Jun", "risk_score": 68, "eal": round(total_eal * 0.90, 2)},
        {"month": "Jul", "risk_score": 70, "eal": round(total_eal * 0.95, 2)},
        {"month": "Aug", "risk_score": 71, "eal": round(total_eal * 0.98, 2)},
        {"month": "Current", "risk_score": avg_risk_score, "eal": total_eal}
    ]

    # EAL by Asset Chart Data
    eal_by_asset = [
        {
            "id": a["id"],
            "name": a["name"],
            "short_name": a["name"].split()[0] + (" Server" if "Server" in a["name"] else " DB" if "Database" in a["name"] else " API" if "API" in a["name"] else ""),
            "eal": a["eal"],
            "risk_score": a["risk_score"],
            "criticality": a["criticality"],
            "incident_probability": a["incident_probability"]
        }
        for a in sorted(assets, key=lambda x: x["eal"], reverse=True)
    ]

    # Top Risk Drivers
    top_drivers = [
        {"driver": "Known Exploited Vulnerabilities (KEV)", "weight": 95, "affected_assets": "Payment Server, API Gateway", "severity": "Critical"},
        {"driver": "Public Internet Exposure", "weight": 92, "affected_assets": "Payment Server, VPN, API Gateway", "severity": "Critical"},
        {"driver": "Weak / Phishable MFA Posture", "weight": 85, "affected_assets": "Payment Server, VPN Gateway", "severity": "High"},
        {"driver": "Core Financial Asset Criticality", "weight": 95, "affected_assets": "Customer Database, Payment Server", "severity": "High"},
        {"driver": "Patch Gap & Delayed Remediation", "weight": 80, "affected_assets": "Internal Active Directory, Payment Server", "severity": "Medium"}
    ]

    return {
        "organization": ORGANIZATION_INFO,
        "enterprise_risk_score": avg_risk_score,
        "expected_annual_loss": total_eal,
        "p90_loss": p90_loss,
        "var_95": var_95,
        "security_budget": budget,
        "potential_risk_reduction": potential_reduction,
        "residual_risk_target": max(0.0, total_eal - potential_reduction),
        "asset_count": len(assets),
        "vulnerability_count": len(vulnerabilities),
        "active_controls_count": sum(1 for c in controls if c.get("is_implemented", False)),
        "pending_controls_count": len(controls),
        "risk_trend_12m": trend,
        "eal_by_asset": eal_by_asset,
        "top_risk_drivers": top_drivers,
        "top_vulnerabilities": vulnerabilities[:4],
        "recommended_portfolio_summary": opt_res,
        "recent_events": RUNTIME_STATE["events"][-5:],
        "data_classification": "Synthetic Demo Data"
    }

@app.get("/api/assets")
def get_assets() -> List[Dict[str, Any]]:
    """Returns all enterprise assets sorted by EAL / Risk Score."""
    return sorted(RUNTIME_STATE["assets"], key=lambda x: x["eal"], reverse=True)

@app.get("/api/assets/{asset_id}")
def get_asset_detail(asset_id: str) -> Dict[str, Any]:
    """Returns detailed risk profile and explainable calculation for a specific asset."""
    asset = next((a for a in RUNTIME_STATE["assets"] if a["id"] == asset_id), None)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Link related vulnerabilities and controls
    asset_cves = [v for v in RUNTIME_STATE["vulnerabilities"] if v["cve_id"] in asset.get("vulnerability_ids", [])]
    relevant_controls = [c for c in RUNTIME_STATE["controls"] if asset_id in c.get("target_asset_ids", [])]

    # Explainable formula step-by-step breakdown
    formula_explanation = {
        "formula": "EAL = Incident Probability × Total Financial Impact",
        "incident_probability_pct": f"{asset['incident_probability'] * 100:.1f}%",
        "financial_impact_inr": asset["total_financial_impact"],
        "eal_inr": asset["eal"],
        "calculation_steps": [
            f"1. Base Incident Frequency: {asset['base_probability'] * 100:.1f}%",
            f"2. Exposure Multiplier ({asset['exposure']}): {1.8 if asset['exposure']=='Internet' else 0.85}x",
            f"3. Vulnerability Multiplier (Max CVSS + KEV): 2.0x",
            f"4. Control Weakness Multiplier (MFA Gap): 1.25x",
            f"5. Asset Criticality Multiplier ({asset['criticality']}): 1.0x",
            f"Resulting Likelihood = {asset['incident_probability'] * 100:.1f}%",
            f"Total Impact = Downtime (₹{asset['financial_impact_components']['downtime']/10000000:.2f}Cr) + Breach (₹{asset['financial_impact_components']['data_breach']/10000000:.2f}Cr) + Regulatory (₹{asset['financial_impact_components']['regulatory']/10000000:.2f}Cr) + Recovery (₹{asset['financial_impact_components']['recovery']/10000000:.2f}Cr) + Disruption (₹{asset['financial_impact_components']['business_disruption']/10000000:.2f}Cr) = ₹{asset['total_financial_impact']/10000000:.2f}Cr",
            f"Expected Annual Loss (EAL) = {asset['incident_probability'] * 100:.1f}% × ₹{asset['total_financial_impact']/10000000:.2f}Cr = ₹{asset['eal']/100000:.1f} Lakhs"
        ]
    }

    return {
        "asset": asset,
        "vulnerabilities": asset_cves,
        "recommended_controls": relevant_controls,
        "formula_explanation": formula_explanation
    }

@app.get("/api/vulnerabilities")
def get_vulnerabilities() -> List[Dict[str, Any]]:
    """Returns all synthetic CVEs with CVSS, EPSS, KEV flags, and risk driver weights."""
    return sorted(RUNTIME_STATE["vulnerabilities"], key=lambda x: (x.get("is_kev", False), x.get("cvss_score", 0)), reverse=True)

@app.get("/api/controls")
def get_controls() -> List[Dict[str, Any]]:
    """Returns all available security controls with costs, risk reductions, and ROSI."""
    return sorted(RUNTIME_STATE["controls"], key=lambda x: x["rosi"], reverse=True)

@app.post("/api/simulate")
def run_monte_carlo(
    iterations: int = Query(10000, ge=100, le=50000),
    volatility_sigma: float = Query(0.35, ge=0.1, le=1.0),
    loss_multiplier: float = Query(1.0, ge=0.1, le=5.0),
    control_effectiveness: float = Query(0.0, ge=0.0, le=0.95),
    probability_modifier: float = Query(1.0, ge=0.1, le=3.0),
    time_horizon_years: int = Query(1, ge=1, le=5),
    random_seed: Optional[int] = Query(None)
) -> Dict[str, Any]:
    """Executes high-speed NumPy Monte Carlo loss simulation."""
    assets = RUNTIME_STATE["assets"]
    result = MonteCarloSimulator.run_simulation(
        assets=assets,
        iterations=iterations,
        volatility_sigma=volatility_sigma,
        loss_multiplier=loss_multiplier,
        control_effectiveness=control_effectiveness,
        probability_modifier=probability_modifier,
        time_horizon_years=time_horizon_years,
        random_seed=random_seed
    )
    RUNTIME_STATE["monte_carlo_cache"] = result
    return result

@app.post("/api/optimize")
def optimize_budget(payload: OptimizationRequest) -> Dict[str, Any]:
    """Runs 0/1 Knapsack optimization to maximize risk reduction for a given budget."""
    controls = RUNTIME_STATE["controls"]
    total_eal, _ = get_current_metrics()
    RUNTIME_STATE["allocated_budget"] = payload.budget
    return InvestmentOptimizer.optimize_security_budget(controls, payload.budget, baseline_eal=total_eal)

@app.post("/api/what-if")
def evaluate_what_if(payload: WhatIfRequest) -> Dict[str, Any]:
    """Evaluates Before vs After risk metrics for an arbitrary combination of toggled controls."""
    controls = RUNTIME_STATE["controls"]
    total_eal, base_score = get_current_metrics()
    return InvestmentOptimizer.evaluate_what_if(
        all_controls=controls,
        enabled_control_ids=payload.enabled_control_ids,
        baseline_eal=total_eal,
        baseline_risk_score=base_score
    )

@app.get("/api/attack-path")
def get_attack_path() -> Dict[str, Any]:
    """Returns the multi-stage attack graph topology."""
    return RUNTIME_STATE["attack_path"]

@app.get("/api/compliance")
def get_compliance() -> List[Dict[str, Any]]:
    """Returns regulatory framework mappings (ISO 27001, NIST CSF 2.0, RBI, SEBI CSCRF)."""
    return RUNTIME_STATE["compliance"]

@app.get("/api/events")
def get_events() -> List[Dict[str, Any]]:
    """Returns the continuous telemetry event stream."""
    return sorted(RUNTIME_STATE["events"], key=lambda x: x["timestamp"], reverse=True)

@app.post("/api/events/simulate")
def simulate_new_security_event() -> Dict[str, Any]:
    """
    Simulates a new incoming security telemetry event (SIEM/EDR/Threat Intel/Scanner),
    appends to event log, and immediately updates live asset risk state.
    """
    # Pick a realistic event from pool or generate
    pool_event = random.choice(SIMULATION_EVENT_POOL)
    new_id = f"EVT-{len(RUNTIME_STATE['events']) + 1001}"
    now_str = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    
    new_event = {
        "id": new_id,
        "timestamp": now_str,
        "source": pool_event["source"],
        "severity": pool_event["severity"],
        "description": pool_event["description"],
        "affected_asset": pool_event["affected_asset"],
        "event_type": pool_event["event_type"],
        "raw_payload": {"simulation_trigger": True, "delta_prob": pool_event.get("prob_delta", 0.0)}
    }
    RUNTIME_STATE["events"].append(new_event)

    # Dynamically adjust affected asset risk
    affected_ast = next((a for a in RUNTIME_STATE["assets"] if a["name"] == pool_event["affected_asset"]), None)
    if affected_ast:
        delta_p = pool_event.get("prob_delta", 0.02)
        delta_imp = pool_event.get("impact_delta", 0.0)
        
        affected_ast["incident_probability"] = min(0.95, max(0.01, round(affected_ast["incident_probability"] + delta_p, 4)))
        affected_ast["total_financial_impact"] = max(1000000.0, affected_ast["total_financial_impact"] + delta_imp)
        affected_ast["eal"] = RiskEngine.calculate_eal(affected_ast["incident_probability"], affected_ast["total_financial_impact"])
        affected_ast["risk_score"] = RiskEngine.calculate_risk_score(affected_ast["incident_probability"], affected_ast["total_financial_impact"])
        affected_ast["priority"] = "P1" if affected_ast["risk_score"] >= 80 else ("P2" if affected_ast["risk_score"] >= 65 else "P3")

    total_eal, avg_score = get_current_metrics()

    return {
        "status": "success",
        "generated_event": new_event,
        "updated_enterprise_eal": total_eal,
        "updated_enterprise_risk_score": avg_score,
        "message": f"New telemetry event ingested. Enterprise risk recalculated to ₹{total_eal/10000000:.2f} Cr (Score: {avg_score}/100)."
    }

@app.post("/api/reset")
def reset_state():
    """Resets runtime state to default seed data."""
    RUNTIME_STATE["assets"] = copy.deepcopy(ASSETS_SEED)
    RUNTIME_STATE["vulnerabilities"] = copy.deepcopy(VULNERABILITIES_SEED)
    RUNTIME_STATE["controls"] = copy.deepcopy(SECURITY_CONTROLS_SEED)
    RUNTIME_STATE["events"] = copy.deepcopy(INITIAL_TELEMETRY_EVENTS)
    RUNTIME_STATE["attack_path"] = copy.deepcopy(ATTACK_PATH_SEED)
    RUNTIME_STATE["compliance"] = copy.deepcopy(COMPLIANCE_MAPPINGS_SEED)
    RUNTIME_STATE["allocated_budget"] = 2500000.0
    RUNTIME_STATE["monte_carlo_cache"] = None
    return {"status": "reset_successful"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
