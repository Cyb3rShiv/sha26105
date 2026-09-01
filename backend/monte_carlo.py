from typing import List, Dict, Any
import numpy as np
from datetime import datetime

class MonteCarloSimulator:
    """
    NumPy-based High-Speed Stochastic Loss Simulation Engine.
    Executes 10,000 risk trials across all enterprise banking assets.
    """

    @classmethod
    def run_simulation(
        cls,
        assets: List[Dict[str, Any]],
        iterations: int = 10000,
        random_seed: int = 42
    ) -> Dict[str, Any]:
        """
        Runs Monte Carlo simulation and returns loss percentiles, VaR, and distribution histogram.
        """
        np.random.seed(random_seed)
        
        # Collect asset parameters
        probs = np.array([a.get("incident_probability", 0.05) for a in assets])
        impacts = np.array([a.get("total_financial_impact", 10000000.0) for a in assets])
        num_assets = len(assets)

        # 1. Simulate incident occurrences across iterations and assets (Bernoulli trials)
        # Shape: (iterations, num_assets)
        uniform_draws = np.random.uniform(0.0, 1.0, size=(iterations, num_assets))
        incident_occurred = uniform_draws < probs

        # 2. Simulate conditional loss magnitudes using Log-Normal distributions
        # We parameterize each asset's log-normal so the median equals total_financial_impact
        # with a dispersion factor sigma = 0.35 representing real-world impact volatility
        sigma = 0.35
        simulated_losses_per_asset = np.zeros((iterations, num_assets))

        for i in range(num_assets):
            median_impact = impacts[i]
            mu = np.log(median_impact)
            # Sample log-normal values
            lognormal_samples = np.random.lognormal(mean=mu, sigma=sigma, size=iterations)
            simulated_losses_per_asset[:, i] = incident_occurred[:, i] * lognormal_samples

        # 3. Total enterprise loss per iteration
        total_enterprise_losses = np.sum(simulated_losses_per_asset, axis=1)

        # 4. Statistical Metrics
        mean_loss = float(np.mean(total_enterprise_losses))
        median_loss = float(np.median(total_enterprise_losses))
        p90_loss = float(np.percentile(total_enterprise_losses, 90))
        p95_loss = float(np.percentile(total_enterprise_losses, 95))
        var_95 = float(np.percentile(total_enterprise_losses, 95))  # Standard Cyber VaR at 95% confidence
        std_dev = float(np.std(total_enterprise_losses))

        # 5. Create 25 histogram bins for frontend visualization
        # Filter out 0 losses for smoother positive distribution visualization, but include zero bin
        max_loss_view = float(np.percentile(total_enterprise_losses, 99.5))
        min_loss_view = 0.0
        
        bin_counts, bin_edges = np.histogram(total_enterprise_losses, bins=25, range=(min_loss_view, max_loss_view))
        
        distribution_bins = []
        for b_idx in range(len(bin_counts)):
            b_min = float(bin_edges[b_idx])
            b_max = float(bin_edges[b_idx + 1])
            count = int(bin_counts[b_idx])
            prob_pct = round((count / iterations) * 100, 2)
            
            # Format label in Lakhs/Crores for clean UI
            if b_max >= 10000000.0:
                label = f"₹{b_min/10000000.0:.1f}Cr - ₹{b_max/10000000.0:.1f}Cr"
            else:
                label = f"₹{b_min/100000.0:.0f}L - ₹{b_max/100000.0:.0f}L"

            distribution_bins.append({
                "bin_index": b_idx,
                "loss_min": b_min,
                "loss_max": b_max,
                "label": label,
                "count": count,
                "probability": prob_pct
            })

        # 6. Sample 5 scenario realizations for demo drill-down
        sample_indices = np.random.choice(iterations, size=5, replace=False)
        sample_scenarios = []
        for s_idx, sim_idx in enumerate(sample_indices):
            hit_assets = [assets[j]["name"] for j in range(num_assets) if incident_occurred[sim_idx, j]]
            sample_scenarios.append({
                "scenario_id": f"SIM-{1000 + s_idx + 1}",
                "simulated_loss": float(total_enterprise_losses[sim_idx]),
                "incidents_count": int(np.sum(incident_occurred[sim_idx])),
                "compromised_assets": hit_assets if hit_assets else ["None (No Breaches Occurred)"]
            })

        return {
            "iterations": iterations,
            "mean_loss": round(mean_loss, 2),
            "median_loss": round(median_loss, 2),
            "p90_loss": round(p90_loss, 2),
            "p95_loss": round(p95_loss, 2),
            "var_95": round(var_95, 2),
            "std_dev": round(std_dev, 2),
            "distribution_bins": distribution_bins,
            "sample_scenarios": sample_scenarios,
            "run_timestamp": datetime.now().isoformat()
        }
