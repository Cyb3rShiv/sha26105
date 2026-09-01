from typing import List, Dict, Any, Tuple

class InvestmentOptimizer:
    """
    0/1 Knapsack & ROSI-driven Security Budget Optimizer.
    Finds the mathematically optimal security control mix that maximizes risk reduction under a budget constraint.
    """

    @classmethod
    def optimize_security_budget(
        cls,
        controls: List[Dict[str, Any]],
        budget: float,
        baseline_eal: float = 18400000.0  # ₹1.84 Cr
    ) -> Dict[str, Any]:
        """
        Solves the 0/1 Knapsack problem for security controls.
        Item Value = Risk Reduction (INR)
        Item Weight = Implementation Cost (INR)
        Capacity = Security Budget (INR)
        """
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
                "optimization_summary": "No budget allocated or no controls available."
            }

        # For exact 0/1 Knapsack with realistic budgets, use scale factor for discrete DP
        # Or exact bitmask enumeration since n <= 20 (n=8 here gives 2^8 = 256 subsets - instantaneous & exact!)
        best_combination = []
        best_reduction = 0.0
        best_cost = 0.0

        # Exact combinatorial evaluation for perfection
        num_subsets = 1 << n
        for mask in range(num_subsets):
            curr_cost = 0.0
            curr_reduction = 0.0
            curr_items = []
            
            for i in range(n):
                if (mask >> i) & 1:
                    curr_cost += controls[i]["cost"]
                    curr_reduction += controls[i]["risk_reduction"]
                    curr_items.append(controls[i])

            if curr_cost <= budget:
                if curr_reduction > best_reduction or (curr_reduction == best_reduction and curr_cost < best_cost):
                    best_reduction = curr_reduction
                    best_cost = curr_cost
                    best_combination = curr_items

        selected_ids = {c["id"] for c in best_combination}
        unselected_controls = [c for c in controls if c["id"] not in selected_ids]

        # Calculate ROSI metrics
        overall_rosi = round(best_reduction / max(1.0, best_cost), 2) if best_cost > 0 else 0.0
        remaining_risk = max(0.0, round(baseline_eal - best_reduction, 2))
        optimized_eal = remaining_risk

        # Sort selected by individual ROSI descending
        selected_sorted = sorted(best_combination, key=lambda x: x.get("rosi", 0.0), reverse=True)
        unselected_sorted = sorted(unselected_controls, key=lambda x: x.get("rosi", 0.0), reverse=True)

        # Generate explainable summary
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
            "optimization_summary": summary
        }

    @classmethod
    def evaluate_what_if(
        cls,
        all_controls: List[Dict[str, Any]],
        enabled_control_ids: List[str],
        baseline_eal: float = 18400000.0,
        baseline_risk_score: int = 72
    ) -> Dict[str, Any]:
        """
        Evaluates dynamic What-If scenario based on arbitrary user-selected controls.
        """
        enabled_set = set(enabled_control_ids)
        active_controls = [c for c in all_controls if c["id"] in enabled_set]

        total_cost = sum(c["cost"] for c in active_controls)
        total_reduction = sum(c["risk_reduction"] for c in active_controls)
        
        # Risk reduction cannot exceed baseline EAL
        capped_reduction = min(baseline_eal, total_reduction)
        simulated_eal = max(0.0, baseline_eal - capped_reduction)
        
        # Simulated risk score reduction proportional to EAL reduction
        score_reduction_ratio = capped_reduction / max(1.0, baseline_eal)
        simulated_risk_score = max(10, int(round(baseline_risk_score * (1.0 - score_reduction_ratio * 0.75))))

        net_benefit = capped_reduction - total_cost
        rosi = round(capped_reduction / max(1.0, total_cost), 2) if total_cost > 0 else 0.0

        # Asset-specific impact breakdown
        asset_impacts = []
        for c in active_controls:
            for target_ast in c.get("target_asset_ids", []):
                asset_impacts.append({
                    "asset_id": target_ast,
                    "applied_control": c["name"],
                    "control_cost": c["cost"],
                    "control_reduction": c["risk_reduction"]
                })

        return {
            "baseline_eal": baseline_eal,
            "baseline_risk_score": baseline_risk_score,
            "simulated_eal": round(simulated_eal, 2),
            "simulated_risk_score": simulated_risk_score,
            "total_control_cost": round(total_cost, 2),
            "risk_reduction": round(capped_reduction, 2),
            "net_benefit": round(net_benefit, 2),
            "rosi": rosi,
            "active_controls_count": len(active_controls),
            "asset_changes": asset_impacts
        }
