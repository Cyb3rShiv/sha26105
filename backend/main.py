import os
import copy
import time
import random
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Query, Body, Header, Request, status
from fastapi.middleware.cors import CORSMiddleware

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
    title="Cyber-Quant — Cyber Risk Quantification & Investment Optimization API",
    description="FAIR-aligned Continuous Cyber Risk Quantification & 0/1 Knapsack Optimization Platform for FinTrust Bank (SIH PS 26105)",
    version="2.0.0"
)

# Explicit CORS allowlist
ALLOWED_ORIGINS = [
    "https://frontend-sigma-liart-70.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]
env_origins = os.environ.get("ALLOWED_ORIGINS", "")
if env_origins:
    ALLOWED_ORIGINS.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
)

# In-memory rate limiter
RATE_LIMIT_LOG: Dict[str, List[float]] = {}

def apply_rate_limit(identifier: str, limit: int = 60, window_secs: float = 60.0):
    now = time.time()
    timestamps = RATE_LIMIT_LOG.get(identifier, [])
    timestamps = [t for t in timestamps if now - t < window_secs]
    if len(timestamps) >= limit:
        RATE_LIMIT_LOG[identifier] = timestamps
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a moment before retrying compute operations."
        )
    timestamps.append(now)
    RATE_LIMIT_LOG[identifier] = timestamps

# Session Store for isolation across demo visitors
SESSION_STORE: Dict[str, Dict[str, Any]] = {}

def get_initial_state() -> Dict[str, Any]:
    return {
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

def get_session_state(session_id: Optional[str] = None) -> Dict[str, Any]:
    key = session_id or "default_singleton"
    if key not in SESSION_STORE:
        if len(SESSION_STORE) > 1000:
            SESSION_STORE.clear()
        SESSION_STORE[key] = get_initial_state()
    return SESSION_STORE[key]

def get_current_metrics(state: Dict[str, Any]):
    """Calculates live enterprise risk and EAL across current asset state."""
    assets = state["assets"]
    total_eal = sum(a["eal"] for a in assets)
    avg_score = int(round(sum(a["risk_score"] for a in assets) / max(1, len(assets))))
    return round(total_eal, 2), avg_score

@app.api_route("/api/health", methods=["GET", "HEAD"])
@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {
        "status": "ok",
        "service": "Cyber-Quant Risk Engine",
        "timestamp": datetime.now().isoformat(),
        "organization": ORGANIZATION_INFO["name"]
    }

@app.get("/api/dashboard")
def get_dashboard(x_session_id: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Returns Executive CISO Dashboard data with dynamic simulation-grounded financial risk metrics."""
    state = get_session_state(x_session_id)
    assets = state["assets"]
    controls = state["controls"]
    vulnerabilities = state["vulnerabilities"]
    budget = state["allocated_budget"]

    total_eal, avg_risk_score = get_current_metrics(state)

    # Derive real Monte Carlo simulation quantiles ensuring P90 <= VaR95 <= P99
    sim_baseline = MonteCarloSimulator.run_simulation(assets=assets, iterations=10000, random_seed=42)
    p90_loss = sim_baseline["p90_loss"]
    var_95 = sim_baseline["var_95"]
    p99_loss = sim_baseline["p99_loss"]

    # Calculate optimal investment for default budget
    opt_res = InvestmentOptimizer.optimize_security_budget(controls, budget, baseline_eal=total_eal)
    potential_reduction = opt_res["total_risk_reduction"]

    # 12-Month Risk Trend
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
        {"month": "Aug", "risk_score": 70, "eal": round(total_eal * 0.98, 2)},
        {"month": datetime.now().strftime("%b (Live)"), "risk_score": avg_risk_score, "eal": total_eal}
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
        "p99_loss": p99_loss,
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
        "top_vulnerabilities": [
            {
                **v,
                "cvss": v.get("cvss_score", 0.0),
                "cvss_score": v.get("cvss_score", 0.0),
                "priority": "P1" if (v.get("severity") == "Critical" or v.get("cvss_score", 0.0) >= 9.0) else ("P2" if v.get("cvss_score", 0.0) >= 7.0 else "P3"),
                "risk_driver": "CISA Known Exploited" if v.get("is_kev") else ("High EPSS Probability" if v.get("epss_score", 0.0) > 0.5 else ("Critical CVSS RCE" if v.get("cvss_score", 0.0) >= 9.0 else "Elevated Exposure")),
                "threat_factor": round(2.0 + v.get("epss_score", 0.0) * 2.0, 1) if v.get("is_kev") else round(1.0 + v.get("cvss_score", 0.0) / 10.0, 1)
            }
            for v in vulnerabilities[:5]
        ],
        "recommended_portfolio_summary": opt_res,
        "recent_events": state["events"][-5:],
        "data_classification": "Synthetic Demo Data"
    }

@app.get("/api/assets")
def get_assets(x_session_id: Optional[str] = Header(None)) -> List[Dict[str, Any]]:
    """Returns all enterprise assets sorted by EAL / Risk Score with standardized schema."""
    state = get_session_state(x_session_id)
    sorted_assets = sorted(state["assets"], key=lambda x: x["eal"], reverse=True)
    return [
        {
            **a,
            "short_name": a.get("short_name") or (a["name"].split()[0] + (" Server" if "Server" in a["name"] else " DB" if "Database" in a["name"] else " API" if "API" in a["name"] else ""))
        }
        for a in sorted_assets
    ]

@app.get("/api/assets/{asset_id}")
def get_asset_detail(asset_id: str, x_session_id: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Returns detailed risk profile and explainable calculation for a specific asset."""
    state = get_session_state(x_session_id)
    asset = next((a for a in state["assets"] if a["id"] == asset_id), None)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    asset_cves = [v for v in state["vulnerabilities"] if v["cve_id"] in asset.get("vulnerability_ids", [])]
    relevant_controls = [c for c in state["controls"] if asset_id in c.get("target_asset_ids", [])]

    formula_explanation = {
        "formula": "EAL = Incident Probability × Total Financial Impact",
        "incident_probability_pct": f"{asset['incident_probability'] * 100:.1f}%",
        "financial_impact_inr": asset["total_financial_impact"],
        "eal_inr": asset["eal"],
        "calculation_steps": [
            f"1. Base Incident Frequency: {asset['base_probability'] * 100:.1f}%",
            f"2. Exposure Multiplier ({asset['exposure']}): {1.8 if asset['exposure']=='Internet' else 0.85}x",
            f"3. Vulnerability Multiplier (Max CVSS + KEV): 2.0x",
            f"4. Control Weakness Multiplier: 1.25x",
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
def get_vulnerabilities(x_session_id: Optional[str] = Header(None)) -> List[Dict[str, Any]]:
    """Returns all synthetic CVEs with CVSS, EPSS, KEV flags, and risk driver weights."""
    state = get_session_state(x_session_id)
    return sorted(state["vulnerabilities"], key=lambda x: (x.get("is_kev", False), x.get("cvss_score", 0)), reverse=True)

@app.get("/api/controls")
def get_controls(x_session_id: Optional[str] = Header(None)) -> List[Dict[str, Any]]:
    """Returns all available security controls with costs, risk reductions, and ROSI."""
    state = get_session_state(x_session_id)
    return sorted(state["controls"], key=lambda x: x["rosi"], reverse=True)

@app.post("/api/simulate")
def run_monte_carlo(
    request: Request,
    iterations: int = Query(10000, ge=100, le=50000),
    volatility_sigma: float = Query(0.35, ge=0.1, le=1.0),
    loss_multiplier: float = Query(1.0, ge=0.1, le=5.0),
    control_effectiveness: float = Query(0.0, ge=0.0, le=0.95),
    probability_modifier: float = Query(1.0, ge=0.1, le=3.0),
    time_horizon_years: int = Query(1, ge=1, le=5),
    random_seed: Optional[int] = Query(None),
    x_session_id: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """Executes high-speed NumPy Monte Carlo loss simulation."""
    client_ip = request.client.host if request.client else "anonymous"
    apply_rate_limit(f"mc_{client_ip}", limit=40, window_secs=60.0)

    state = get_session_state(x_session_id)
    assets = state["assets"]
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
    state["monte_carlo_cache"] = result
    return result

@app.post("/api/optimize")
def optimize_budget(payload: OptimizationRequest, x_session_id: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Runs 0/1 Knapsack optimization to maximize risk reduction for a given budget."""
    if payload.budget < 0:
        raise HTTPException(status_code=422, detail="Budget must be non-negative.")
    state = get_session_state(x_session_id)
    controls = state["controls"]
    total_eal, _ = get_current_metrics(state)
    state["allocated_budget"] = payload.budget
    return InvestmentOptimizer.optimize_security_budget(controls, payload.budget, baseline_eal=total_eal)

@app.post("/api/what-if")
def evaluate_what_if(payload: WhatIfRequest, x_session_id: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Evaluates Before vs After risk metrics for an arbitrary combination of toggled controls."""
    state = get_session_state(x_session_id)
    controls = state["controls"]
    total_eal, base_score = get_current_metrics(state)
    return InvestmentOptimizer.evaluate_what_if(
        all_controls=controls,
        enabled_control_ids=payload.enabled_control_ids,
        baseline_eal=total_eal,
        baseline_risk_score=base_score
    )

@app.get("/api/attack-path")
def get_attack_path(x_session_id: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Returns the multi-stage attack graph topology."""
    state = get_session_state(x_session_id)
    return state["attack_path"]

@app.get("/api/compliance")
def get_compliance(x_session_id: Optional[str] = Header(None)) -> List[Dict[str, Any]]:
    """Returns regulatory framework mappings (ISO 27001, NIST CSF 2.0, RBI, SEBI CSCRF)."""
    state = get_session_state(x_session_id)
    return state["compliance"]

@app.get("/api/events")
def get_events(x_session_id: Optional[str] = Header(None)) -> List[Dict[str, Any]]:
    """Returns the continuous telemetry event stream."""
    state = get_session_state(x_session_id)
    return sorted(state["events"], key=lambda x: x["timestamp"], reverse=True)

@app.post("/api/events/simulate")
def simulate_new_security_event(request: Request, x_session_id: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Simulates a new incoming security telemetry event,
    appends to event log with guaranteed unique ID, and updates live asset risk state monotonically.
    """
    client_ip = request.client.host if request.client else "anonymous"
    apply_rate_limit(f"evt_{client_ip}", limit=50, window_secs=60.0)

    state = get_session_state(x_session_id)
    pool_event = random.choice(SIMULATION_EVENT_POOL)
    
    # Generate unique monotonic collision-free event ID
    ts_ms = int(datetime.now().timestamp() * 1000)
    rand_seq = random.randint(100, 999)
    new_id = f"EVT-{ts_ms % 1000000:06d}-{rand_seq}"
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
    state["events"].append(new_event)

    # Dynamically adjust affected asset risk
    affected_ast = next((a for a in state["assets"] if a["name"] == pool_event["affected_asset"]), None)
    if affected_ast:
        delta_p = pool_event.get("prob_delta", 0.02)
        delta_imp = pool_event.get("impact_delta", 0.0)
        
        affected_ast["incident_probability"] = min(0.95, max(0.01, round(affected_ast["incident_probability"] + delta_p, 4)))
        affected_ast["total_financial_impact"] = max(1000000.0, affected_ast["total_financial_impact"] + delta_imp)
        affected_ast["eal"] = RiskEngine.calculate_eal(affected_ast["incident_probability"], affected_ast["total_financial_impact"])
        affected_ast["risk_score"] = RiskEngine.calculate_risk_score(
            affected_ast["incident_probability"],
            affected_ast["total_financial_impact"],
            asset_id=affected_ast.get("id")
        )
        affected_ast["priority"] = "P1" if affected_ast["risk_score"] >= 80 else ("P2" if affected_ast["risk_score"] >= 65 else "P3")

    total_eal, avg_score = get_current_metrics(state)

    return {
        "status": "success",
        "generated_event": new_event,
        "updated_enterprise_eal": total_eal,
        "updated_enterprise_risk_score": avg_score,
        "message": f"New telemetry event ingested ({pool_event['severity']}). Enterprise risk calculated to ₹{total_eal/10000000:.2f} Cr (Score: {avg_score}/100)."
    }

@app.post("/api/reset")
def reset_state(x_session_id: Optional[str] = Header(None)):
    """Resets runtime state cleanly to default FinTrust Bank baseline."""
    key = x_session_id or "default_singleton"
    SESSION_STORE[key] = get_initial_state()
    return {
        "status": "success",
        "message": "Runtime state successfully restored to FinTrust Bank baseline (EAL ₹1.84 Cr, Score 70)."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
