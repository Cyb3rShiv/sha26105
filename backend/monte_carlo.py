from typing import List, Dict, Any, Optional
import numpy as np
from datetime import datetime

class MonteCarloSimulator:
    """
    NumPy-based High-Speed Stochastic Cyber Loss Simulation Engine.
    Executes stochastic loss trials across enterprise banking assets using
    Compound Bernoulli / Log-Normal severity distributions.
    """

    @classmethod
    def run_simulation(
        cls,
        assets: List[Dict[str, Any]],
        iterations: int = 10000,
        volatility_sigma: float = 0.35,
        loss_multiplier: float = 1.0,
        control_effectiveness: float = 0.0,
        probability_modifier: float = 1.0,
        time_horizon_years: int = 1,
        random_seed: Optional[int] = 26105
    ) -> Dict[str, Any]:
        """
        Runs Monte Carlo simulation and returns complete statistical percentiles,
        Value at Risk (VaR), exceedance probabilities, asset loss contributions, and histogram bins.
        """
        # Set seed if specified (default 26105 for reproducible audit baseline)
        if random_seed is not None:
            np.random.seed(int(random_seed))
        else:
            np.random.seed(None)

        # Validate input ranges
        iterations = max(100, min(int(iterations), 50000))
        volatility_sigma = max(0.1, min(float(volatility_sigma), 1.0))
        loss_multiplier = max(0.1, min(float(loss_multiplier), 5.0))
        control_effectiveness = max(0.0, min(float(control_effectiveness), 0.95))
        probability_modifier = max(0.1, min(float(probability_modifier), 3.0))
        time_horizon_years = max(1, min(int(time_horizon_years), 5))

        if not assets:
            return cls._get_empty_result(iterations)

        # Base probabilities adjusted for control effectiveness & time horizon
        # Multi-year compound probability: P_h = 1 - (1 - P_annual)^years
        adjusted_probs = []
        for a in assets:
            p_base = max(0.001, min(0.999, float(a.get("incident_probability", 0.05)))) * probability_modifier
            p_mitigated = p_base * (1.0 - control_effectiveness)
            if time_horizon_years > 1:
                p_horizon = 1.0 - (1.0 - p_mitigated) ** time_horizon_years
            else:
                p_horizon = p_mitigated
            adjusted_probs.append(max(0.001, min(0.999, p_horizon)))

        probs = np.array(adjusted_probs)
        impacts = np.array([max(100000.0, float(a.get("total_financial_impact", 10000000.0))) * loss_multiplier for a in assets])
        num_assets = len(assets)

        # 1. Simulate incident occurrences across iterations and assets (Bernoulli trials)
        uniform_draws = np.random.uniform(0.0, 1.0, size=(iterations, num_assets))
        incident_occurred = uniform_draws < probs

        # 2. Simulate conditional loss magnitudes using Log-Normal distributions
        simulated_losses_per_asset = np.zeros((iterations, num_assets))

        for i in range(num_assets):
            severity = impacts[i]
            # Mean-preserving LogNormal parameterization:
            # E[X] = exp(mu + sigma^2 / 2). Setting mu = ln(severity) - sigma^2 / 2 ensures E[X] = severity.
            mu = np.log(severity) - (volatility_sigma ** 2) / 2.0
            lognormal_samples = np.random.lognormal(mean=mu, sigma=volatility_sigma, size=iterations)
            simulated_losses_per_asset[:, i] = incident_occurred[:, i] * lognormal_samples

        # 3. Total enterprise loss per iteration
        total_enterprise_losses = np.sum(simulated_losses_per_asset, axis=1)

        # 4. Statistical Metrics & Full Percentile Ladder
        mean_loss = float(np.mean(total_enterprise_losses))
        median_loss = float(np.median(total_enterprise_losses))
        p10_loss = float(np.percentile(total_enterprise_losses, 10))
        p25_loss = float(np.percentile(total_enterprise_losses, 25))
        p50_loss = float(np.percentile(total_enterprise_losses, 50))
        p75_loss = float(np.percentile(total_enterprise_losses, 75))
        p90_loss = float(np.percentile(total_enterprise_losses, 90))
        p95_loss = float(np.percentile(total_enterprise_losses, 95))
        p99_loss = float(np.percentile(total_enterprise_losses, 99))
        worst_case_loss = float(np.max(total_enterprise_losses))
        var_95 = p95_loss  # Standard 95% Cyber VaR
        var_99 = p99_loss  # Tail 99% Cyber VaR
        std_dev = float(np.std(total_enterprise_losses))

        # 5. Asset Risk Driver Breakdown (Simulated Mean Contribution)
        asset_mean_losses = np.mean(simulated_losses_per_asset, axis=0)
        total_sim_mean = max(1.0, np.sum(asset_mean_losses))
        top_risk_drivers = []
        for idx in range(num_assets):
            asset_loss = float(asset_mean_losses[idx])
            contribution_pct = round((asset_loss / total_sim_mean) * 100, 1)
            top_risk_drivers.append({
                "asset_id": assets[idx].get("id", f"AST-00{idx+1}"),
                "asset_name": assets[idx].get("name", f"Asset {idx+1}"),
                "simulated_mean_loss": round(asset_loss, 2),
                "contribution_pct": contribution_pct,
                "exposure": assets[idx].get("exposure", "Internal"),
                "criticality": assets[idx].get("criticality", "High")
            })
        top_risk_drivers = sorted(top_risk_drivers, key=lambda x: x["simulated_mean_loss"], reverse=True)

        # 6. Dynamic Exceedance Probabilities (P(Loss > Threshold))
        thresholds = [
            {"label": "> ₹50 Lakhs", "amount": 5000000.0},
            {"label": "> ₹1.0 Crore", "amount": 10000000.0},
            {"label": "> ₹2.0 Crores", "amount": 20000000.0},
            {"label": "> ₹4.0 Crores", "amount": 40000000.0},
            {"label": "> ₹5.0 Crores", "amount": 50000000.0},
        ]
        exceedance_stats = []
        for t in thresholds:
            exceeded_count = int(np.sum(total_enterprise_losses > t["amount"]))
            exceedance_stats.append({
                "threshold_label": t["label"],
                "threshold_amount": t["amount"],
                "probability_pct": round((exceeded_count / iterations) * 100, 2),
                "occurrences": exceeded_count
            })

        # 7. Create 25 smooth histogram bins for visualization covering the entire distribution
        max_loss_view = float(np.percentile(total_enterprise_losses, 99.5))
        if max_loss_view <= 0:
            max_loss_view = float(np.max(total_enterprise_losses)) if np.max(total_enterprise_losses) > 0 else 1000000.0

        bin_counts, bin_edges = np.histogram(total_enterprise_losses, bins=25, range=(0.0, max_loss_view))
        # Include extreme tail trials (> max_loss_view) in the final bin so 100% of iterations are accounted for
        tail_count = int(np.sum(total_enterprise_losses > max_loss_view))
        bin_counts[-1] += tail_count
        
        distribution_bins = []
        for b_idx in range(len(bin_counts)):
            b_min = float(bin_edges[b_idx])
            b_max = float(bin_edges[b_idx + 1])
            count = int(bin_counts[b_idx])
            prob_pct = round((count / iterations) * 100, 2)
            
            # Label format in Lakhs or Crores
            if b_idx == len(bin_counts) - 1 and tail_count > 0:
                if b_min >= 10000000.0:
                    label = f"≥ ₹{b_min/10000000.0:.1f}Cr (Tail)"
                else:
                    label = f"≥ ₹{b_min/100000.0:.0f}L (Tail)"
            elif b_max >= 10000000.0:
                label = f"₹{b_min/10000000.0:.1f}Cr - ₹{b_max/10000000.0:.1f}Cr"
            else:
                label = f"₹{b_min/100000.0:.0f}L - ₹{b_max/100000.0:.0f}L"

            distribution_bins.append({
                "bin_index": b_idx,
                "loss_min": round(b_min, 2),
                "loss_max": round(b_max if b_idx < len(bin_counts) - 1 else max(b_max, worst_case_loss), 2),
                "label": label,
                "count": count,
                "probability": prob_pct,
                "is_tail": b_min >= p90_loss
            })

        # 8. Sample 5 drill-down scenario realizations
        sample_indices = np.random.choice(iterations, size=min(5, iterations), replace=False)
        sample_scenarios = []
        for s_idx, sim_idx in enumerate(sample_indices):
            hit_assets = [assets[j]["name"] for j in range(num_assets) if incident_occurred[sim_idx, j]]
            sample_scenarios.append({
                "scenario_id": f"SIM-{1000 + s_idx + 1}",
                "simulated_loss": round(float(total_enterprise_losses[sim_idx]), 2),
                "incidents_count": int(np.sum(incident_occurred[sim_idx])),
                "compromised_assets": hit_assets if hit_assets else ["None (No Breaches Occurred)"]
            })

        # Dynamic analytical insight text
        if var_95 >= 10000000.0:
            var_str = f"₹{var_95/10000000.0:.2f} Crores"
        else:
            var_str = f"₹{var_95/100000.0:.1f} Lakhs"

        if mean_loss >= 10000000.0:
            mean_str = f"₹{mean_loss/10000000.0:.2f} Crores"
        else:
            mean_str = f"₹{mean_loss/100000.0:.1f} Lakhs"

        top_driver_name = top_risk_drivers[0]["asset_name"] if top_risk_drivers else "Payment Server"
        top_driver_pct = top_risk_drivers[0]["contribution_pct"] if top_risk_drivers else 40.0

        summary_statement = (
            f"In 95% of simulated scenarios over a {time_horizon_years}-year horizon, "
            f"financial exposure remains below {var_str} (VaR 95%). "
            f"Expected average loss is {mean_str}. "
            f"Primary risk driver is {top_driver_name} accounting for {top_driver_pct}% of simulated loss."
        )

        return {
            "iterations": iterations,
            "mean_loss": round(mean_loss, 2),
            "median_loss": round(median_loss, 2),
            "p10_loss": round(p10_loss, 2),
            "p25_loss": round(p25_loss, 2),
            "p50_loss": round(p50_loss, 2),
            "p75_loss": round(p75_loss, 2),
            "p90_loss": round(p90_loss, 2),
            "p95_loss": round(p95_loss, 2),
            "p99_loss": round(p99_loss, 2),
            "worst_case_loss": round(worst_case_loss, 2),
            "var_95": round(var_95, 2),
            "var_99": round(var_99, 2),
            "std_dev": round(std_dev, 2),
            "volatility_sigma": volatility_sigma,
            "loss_multiplier": loss_multiplier,
            "control_effectiveness": control_effectiveness,
            "probability_modifier": probability_modifier,
            "time_horizon_years": time_horizon_years,
            "summary_statement": summary_statement,
            "random_seed": random_seed,
            "top_risk_drivers": top_risk_drivers,
            "distribution_bins": distribution_bins,
            "exceedance_stats": exceedance_stats,
            "sample_scenarios": sample_scenarios,
            "run_timestamp": datetime.now().isoformat()
        }

    @classmethod
    def _get_empty_result(cls, iterations: int) -> Dict[str, Any]:
        return {
            "iterations": iterations,
            "mean_loss": 0.0,
            "median_loss": 0.0,
            "p10_loss": 0.0,
            "p50_loss": 0.0,
            "p90_loss": 0.0,
            "p95_loss": 0.0,
            "p99_loss": 0.0,
            "worst_case_loss": 0.0,
            "var_95": 0.0,
            "var_99": 0.0,
            "std_dev": 0.0,
            "summary_statement": "Simulation returned empty baseline.",
            "top_risk_drivers": [],
            "distribution_bins": [],
            "exceedance_stats": [],
            "sample_scenarios": [],
            "run_timestamp": datetime.now().isoformat()
        }
