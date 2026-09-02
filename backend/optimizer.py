from typing import List, Dict, Any, Tuple, Optional

class InvestmentOptimizer:
    """
    0/1 Knapsack & ROSI-driven Security Budget Optimizer.
    Finds the mathematically optimal security control mix that maximizes risk reduction under a budget constraint.
    
    Guarantees:
    1. Unified, single calculation model shared between /api/what-if and /api/optimize.
    2. Zero negative residuals for any asset under any combination of controls.
    3. Applied risk reduction per asset is strictly capped at that asset's Expected Annual Loss.
    4. Enterprise residual EAL = sum of individual asset residual EALs.
    """

    @classmethod
    def calculate_controlled_asset_eal(
        cls,
        assets: List[Dict[str, Any]],
        selected_controls: List[Dict[str, Any]],
        baseline_risk_score: int = 70
    ) -> Dict[str, Any]:
        """
        Single canonical, unified risk calculation shared across /api/what-if and /api/optimize.
        
        Guarantees:
        1. Applied reduction on any asset never exceeds that asset's EAL.
        2. Per-asset residual EAL is strictly non-negative (floored at 0.0).
        3. Enterprise applied reduction = sum(applied reduction across all assets).
        4. Enterprise residual EAL = sum(asset residuals) = baseline_eal - total_reduction.
        5. Zero negative residuals under any combination of controls.
        """
        total_cost = sum(c.get("cost", 0.0) for c in selected_controls)
        baseline_eal = sum(a.get("eal", 0.0) for a in assets)

        # Apportion control reductions to target assets
        asset_raw_reductions: Dict[str, float] = {a["id"]: 0.0 for a in assets}
        asset_impacts = []

        for c in selected_controls:
            targets = c.get("target_asset_ids", [])
            num_targets = max(1, len(targets))
            apportioned_cost = round(c.get("cost", 0.0) / num_targets, 2)
            apportioned_reduc = round(c.get("risk_reduction", 0.0) / num_targets, 2)

            for target_id in targets:
                if target_id in asset_raw_reductions:
                    asset_raw_reductions[target_id] += apportioned_reduc

                asset_impacts.append({
                    "asset_id": target_id,
                    "control_id": c.get("id"),
                    "applied_control": c.get("name"),
                    "control_cost": c.get("cost", 0.0),
                    "apportioned_cost": apportioned_cost,
                    "control_reduction": c.get("risk_reduction", 0.0),
                    "apportioned_reduction": apportioned_reduc
                })

        # Apply per-asset capping to prevent impossible negative residual risk
        per_asset_results = []
        total_applied_reduction = 0.0
        total_residual_eal = 0.0

        for a in assets:
            aid = a["id"]
            a_eal = a.get("eal", 0.0)
            raw_reduc = asset_raw_reductions.get(aid, 0.0)
            
            # Capped applied reduction cannot exceed the asset's own EAL
            applied_reduc = min(a_eal, raw_reduc)
            residual_eal = max(0.0, round(a_eal - applied_reduc, 2))
            
            total_applied_reduction += applied_reduc
            total_residual_eal += residual_eal

            per_asset_results.append({
                "asset_id": aid,
                "asset_name": a.get("name"),
                "baseline_eal": a_eal,
                "raw_reduction": round(raw_reduc, 2),
                "applied_reduction": round(applied_reduc, 2),
                "residual_eal": residual_eal
            })

        total_applied_reduction = round(total_applied_reduction, 2)
        total_residual_eal = round(total_residual_eal, 2)

        # Proportional risk score reduction
        score_ratio = total_applied_reduction / max(1.0, baseline_eal)
        simulated_risk_score = max(10, int(round(baseline_risk_score * (1.0 - score_ratio * 0.75))))

        overall_rosi = round(total_applied_reduction / max(1.0, total_cost), 2) if total_cost > 0 else 0.0
        net_benefit = round(total_applied_reduction - total_cost, 2)

        return {
            "baseline_eal": baseline_eal,
            "baseline_risk_score": baseline_risk_score,
            "simulated_eal": total_residual_eal,
            "remaining_risk": total_residual_eal,
            "simulated_risk_score": simulated_risk_score,
            "total_control_cost": round(total_cost, 2),
            "total_risk_reduction": total_applied_reduction,
            "risk_reduction": total_applied_reduction,
            "net_benefit": net_benefit,
            "rosi": overall_rosi,
            "overall_rosi": overall_rosi,
            "active_controls_count": len(selected_controls),
            "asset_changes": asset_impacts,
            "per_asset_results": per_asset_results
        }

    @classmethod
    def optimize_security_budget(
        cls,
        controls: List[Dict[str, Any]],
        budget: float,
        baseline_eal: float = 18400000.0,  # ₹1.84 Cr
        assets: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Solves the bounded 0/1 Knapsack problem for security controls under the
        mathematically rigorous per-asset capped reduction model.
        """
        if assets is None:
            from seed_data import ASSETS_SEED
            assets = ASSETS_SEED

        n = len(controls)
        if n == 0 or budget <= 0:
            return {
                "budget": budget,
                "total_cost": 0.0,
                "total_risk_reduction": 0.0,
                "remaining_risk": baseline_eal,
                "overall_rosi": 0.0,
                "baseline_eal": baseline_eal,
                "optimized_eal": baseline_eal,
                "selected_controls": [],
                "unselected_controls": controls,
                "optimization_summary": "No budget allocated or no controls available.",
                "per_asset_results": []
            }

        best_combination = []
        best_reduction = -1.0
        best_cost = 0.0

        # Exact combinatorial evaluation for perfection (n=8 -> 2^8 = 256 states)
        num_subsets = 1 << n
        for mask in range(num_subsets):
            curr_items = []
            curr_cost = 0.0
            
            for i in range(n):
                if (mask >> i) & 1:
                    curr_cost += controls[i]["cost"]
                    curr_items.append(controls[i])

            if curr_cost <= budget:
                # Evaluate real applied reduction under the unified model
                calc = cls.calculate_controlled_asset_eal(assets, curr_items)
                curr_reduction = calc["total_risk_reduction"]

                if curr_reduction > best_reduction or (curr_reduction == best_reduction and curr_cost < best_cost):
                    best_reduction = curr_reduction
                    best_cost = curr_cost
                    best_combination = curr_items

        selected_ids = {c["id"] for c in best_combination}
        unselected_controls = [c for c in controls if c["id"] not in selected_ids]

        calc = cls.calculate_controlled_asset_eal(assets, best_combination)
        overall_rosi = calc["overall_rosi"]
        remaining_risk = calc["remaining_risk"]
        optimized_eal = remaining_risk

        selected_sorted = sorted(best_combination, key=lambda x: x.get("rosi", 0.0), reverse=True)
        unselected_sorted = sorted(unselected_controls, key=lambda x: x.get("rosi", 0.0), reverse=True)

        cost_lakhs = best_cost / 100000.0
        reduc_lakhs = best_reduction / 100000.0
        budget_lakhs = budget / 100000.0
        
        summary = (
            f"Optimized portfolio selected {len(selected_sorted)} controls utilizing ₹{cost_lakhs:.1f}L of ₹{budget_lakhs:.1f}L budget, "
            f"yielding ₹{reduc_lakhs:.1f}L in financial risk reduction with an overall portfolio ROSI of {overall_rosi}x."
        )

        return {
            "budget": budget,
            "total_cost": best_cost,
            "total_risk_reduction": best_reduction,
            "remaining_risk": remaining_risk,
            "overall_rosi": overall_rosi,
            "baseline_eal": baseline_eal,
            "optimized_eal": optimized_eal,
            "selected_controls": selected_sorted,
            "unselected_controls": unselected_sorted,
            "per_asset_results": calc["per_asset_results"],
            "optimization_summary": summary
        }

    @classmethod
    def evaluate_what_if(
        cls,
        all_controls: List[Dict[str, Any]],
        enabled_control_ids: List[str],
        baseline_eal: float = 18400000.0,
        baseline_risk_score: int = 70,
        assets: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Evaluates dynamic What-If scenario using the exact same calculate_controlled_asset_eal model.
        """
        if assets is None:
            from seed_data import ASSETS_SEED
            assets = ASSETS_SEED

        enabled_set = set(enabled_control_ids)
        active_controls = [c for c in all_controls if c["id"] in enabled_set]

        return cls.calculate_controlled_asset_eal(
            assets=assets,
            selected_controls=active_controls,
            baseline_risk_score=baseline_risk_score
        )
