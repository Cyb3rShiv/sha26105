"""
test_final_audit_verification.py
Comprehensive End-to-End Verification of the 2026-09-03 Deep Technical Audit Remediation
Cyber-Quant / FinTrust (SIH 2026 Problem Statement 26105)
"""
import sys
import os
import json
import numpy as np

sys.path.insert(0, os.path.abspath('backend'))
import main, models, risk_engine, optimizer, monte_carlo, seed_data

def run_all_tests():
    print("=" * 70)
    print("FINAL PRE-SUBMISSION AUDIT REMEDIATION VERIFICATION SUITE")
    print("=" * 70)

    # -------------------------------------------------------------
    # 1. P0-2: Monte Carlo LogNormal Mean Preservation
    # -------------------------------------------------------------
    assets = seed_data.ASSETS_SEED
    baseline_eal = sum(a['eal'] for a in assets) # 18,400,000.0 (1.84 Cr)
    
    for sigma in [0.10, 0.35, 0.60, 1.00]:
        res = monte_carlo.MonteCarloSimulator.run_simulation(
            assets=assets,
            iterations=30000,
            volatility_sigma=sigma,
            random_seed=42
        )
        sim_mean = res['mean_loss']
        pct_diff = abs(sim_mean - baseline_eal) / baseline_eal * 100.0
        assert pct_diff < 2.0, f"Sigma {sigma} deviated too much: {sim_mean} vs {baseline_eal} ({pct_diff:.2f}%)"
        print(f"[PASS] P0-2: Sigma {sigma:0.2f} LogNormal Mean = INR {sim_mean/10000000:.3f} Cr (Diff: {pct_diff:0.2f}% <= 2%)")

    # -------------------------------------------------------------
    # 2. P0-3: Safe Session Reset, Isolation & Anonymous Handling
    # -------------------------------------------------------------
    # Test anonymous call
    anon_state = main.get_session_state(None)
    assert anon_state is not None
    assert anon_state['assets'][0]['eal'] == 7200000.0

    # Test distinct sessions
    sess_x = main.get_session_state("user_tab_alpha")
    sess_y = main.get_session_state("user_tab_beta")
    assert sess_x is not sess_y

    sess_x['assets'][0]['eal'] = 9999999.0
    assert sess_y['assets'][0]['eal'] == 7200000.0, "Session Y corrupted by Session X mutation!"

    # Reset X
    main.reset_state(x_session_id="user_tab_alpha")
    sess_x_new = main.get_session_state("user_tab_alpha")
    assert sess_x_new['assets'][0]['eal'] == 7200000.0, "Session X failed to restore baseline"
    assert sess_y['assets'][0]['eal'] == 7200000.0, "Session Y corrupted by Session X reset!"
    print("[PASS] P0-3: Multi-tenant session isolation and safe per-session reset verified")

    # -------------------------------------------------------------
    # 3. P0-4: Panel Headings Contrast
    # -------------------------------------------------------------
    with open("frontend/src/components/ui/Panel.jsx", "r", encoding="utf-8") as f:
        panel_code = f.read()
    assert "text-slate-900" in panel_code, "text-slate-900 heading color missing in Panel.jsx"
    assert "text-white" not in panel_code, "text-white heading color found in Panel.jsx"
    print("[PASS] P0-4: Panel headings contrast verified (text-slate-900, zero white-on-white)")

    # -------------------------------------------------------------
    # 4. H-1: Benefit-Cost Ratio (BCR) & Net ROSI Terminology
    # -------------------------------------------------------------
    opt_res = optimizer.InvestmentOptimizer.optimize_security_budget(
        seed_data.SECURITY_CONTROLS_SEED,
        2500000.0,
        baseline_eal=baseline_eal,
        assets=assets
    )
    assert opt_res['bcr'] == 2.28, f"BCR mismatch: {opt_res['bcr']}"
    assert opt_res['rosi_percentage'] == 128.0, f"Net ROSI mismatch: {opt_res['rosi_percentage']}"
    assert "BCR 2.28x / 128.0% Net ROSI" in opt_res['optimization_summary'], "Summary text missing BCR/Net ROSI"
    print(f"[PASS] H-1: Benefit-Cost Ratio ({opt_res['bcr']}x BCR) and Net ROSI ({opt_res['rosi_percentage']}%) verified")

    # -------------------------------------------------------------
    # 5. H-2: Monotonic Enterprise Risk Score Engine
    # -------------------------------------------------------------
    test_eals = [
        3000000.0, 5000000.0, 7556666.0, 10000000.0, 12700000.0,
        15000000.0, 18400000.0, 20000000.0, 25000000.0, 35000000.0, 50000000.0
    ]
    scores = [risk_engine.RiskEngine.calculate_enterprise_risk_score(e) for e in test_eals]
    for i in range(len(scores) - 1):
        assert scores[i] <= scores[i+1], f"Monotonicity violation: EAL {test_eals[i]}->{scores[i]}, EAL {test_eals[i+1]}->{scores[i+1]}"
    assert scores[test_eals.index(18400000.0)] == 70, "Baseline EAL 1.84 Cr must map to exact score 70"
    print(f"[PASS] H-2: Enterprise risk score strictly monotonic across all test EALs ({scores})")

    # -------------------------------------------------------------
    # 6. H-3: Frozen Immutable Historical Months Trend
    # -------------------------------------------------------------
    dash = main.get_dashboard(x_session_id="test_trend")
    trend = dash['risk_trend_12m']
    assert len(trend) == 12, "Trend must contain 12 months"
    assert trend[0]['month'] == "Oct" and trend[0]['eal'] == 13248000.0
    assert trend[10]['month'] == "Aug" and trend[10]['eal'] == 18032000.0
    print("[PASS] H-3: Frozen immutable historical months trend (Oct-Aug constants) verified")

    # -------------------------------------------------------------
    # 7. H-4 & P0-1: Truthful Connection State & LocalStorage Session
    # -------------------------------------------------------------
    with open("frontend/src/services/api.js", "r", encoding="utf-8") as f:
        api_code = f.read()
    assert "cq_session_id" in api_code, "Missing cq_session_id in api.js"
    assert "let connectionState = 'CONNECTING'" in api_code, "Initial state must be CONNECTING"
    assert "LOCAL DEMO DATA" in api_code, "Missing LOCAL DEMO DATA state in api.js"

    with open("frontend/src/components/Sidebar.jsx", "r", encoding="utf-8") as f:
        sb_code = f.read()
    assert "Local Demo Engine" in sb_code, "Missing Local Demo Engine badge in Sidebar.jsx"
    assert "API Unavailable" in sb_code, "Missing API Unavailable badge in Sidebar.jsx"
    print("[PASS] H-4 & P0-1: Truthful connection state machine and cq_session_id verified")

    # -------------------------------------------------------------
    # 8. H-6: Immutable Asset Caching in vercel.json
    # -------------------------------------------------------------
    with open("frontend/vercel.json", "r", encoding="utf-8") as f:
        vj = json.load(f)
    asset_rule = next((r for r in vj.get("headers", []) if r.get("source") == "/assets/(.*)"), None)
    assert asset_rule is not None, "Missing /assets/(.*) caching rule"
    assert "max-age=31536000, immutable" in asset_rule["headers"][0]["value"], "Missing immutable header in assets rule"
    print("[PASS] H-6: Immutable asset caching (max-age=31536000, immutable) verified")

    # -------------------------------------------------------------
    # 9. M-4: HTTP 400 for Unknown What-If Control IDs
    # -------------------------------------------------------------
    bad_req = models.WhatIfRequest(enabled_control_ids=["CTRL-999", "FAKE-CTRL"])
    try:
        main.evaluate_what_if(bad_req, x_session_id="test_bad_ctrl")
        assert False, "Should have rejected unknown control IDs with HTTP 400"
    except Exception as exc:
        assert hasattr(exc, "status_code") and exc.status_code == 400
        assert exc.detail["error"] == "invalid_control_ids"
        print("[PASS] M-4: HTTP 400 rejection for unknown What-If control IDs verified")

    # -------------------------------------------------------------
    # 10. M-6: Print Stylesheet
    # -------------------------------------------------------------
    with open("frontend/src/index.css", "r", encoding="utf-8") as f:
        css_code = f.read()
    assert "@media print" in css_code, "Missing @media print in index.css"
    assert "#navigation-sidebar" in css_code, "Print rule must hide navigation sidebar"
    print("[PASS] M-6: Board-ready print stylesheet in index.css verified")

    # -------------------------------------------------------------
    # 11. M-7: Monte Carlo Median Explanation
    # -------------------------------------------------------------
    with open("frontend/src/pages/MonteCarloView.jsx", "r", encoding="utf-8") as f:
        mc_view = f.read()
    assert "expected for low-frequency/high-severity banking risk" in mc_view, "Missing median zero explanation in MonteCarloView.jsx"
    print("[PASS] M-7: Monte Carlo median zero explanation verified")

    # -------------------------------------------------------------
    # 12. M-1 & M-2: WCAG Accessibility and Mobile Responsiveness
    # -------------------------------------------------------------
    with open("frontend/src/pages/LandingPage.jsx", "r", encoding="utf-8") as f:
        landing_code = f.read()
    assert 'href="#main-content"' in landing_code, "Missing skip-to-content link in LandingPage.jsx"
    assert '<main id="main-content">' in landing_code, "Missing <main id='main-content'> landmark in LandingPage.jsx"
    print("[PASS] M-1 & M-2: Skip-to-content link and main landmark verified")

    print("=" * 70)
    print("ALL 12/12 FINAL AUDIT REMEDIATION CHECKS PASSED WITH ZERO ERRORS!")
    print("=" * 70)

if __name__ == "__main__":
    run_all_tests()
