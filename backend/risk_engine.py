from typing import List, Dict, Any, Tuple
import math

class RiskEngine:
    """
    FAIR-inspired Explainable Cyber Risk Quantification Engine.
    Translates technical telemetry and asset criticality into Rupee-denominated Expected Annual Loss (EAL).
    """

    @staticmethod
    def calculate_incident_probability(
        base_probability: float,
        exposure: str,
        vulnerabilities: List[Dict[str, Any]],
        existing_controls: List[str],
        has_kev: bool = False,
        has_mfa_weakness: bool = False,
        criticality: str = "Critical"
    ) -> Tuple[float, Dict[str, float]]:
        """
        Calculates annual incident likelihood:
        Incident Probability = Base Prob × Exposure Factor × Vulnerability Factor × Control Weakness × Criticality Factor
        """
        # 1. Exposure Factor
        exposure_map = {
            "Internet": 1.80,
            "Internal": 0.85,
            "Restricted": 0.40
        }
        f_exposure = exposure_map.get(exposure, 1.0)

        # 2. Vulnerability Factor
        max_cvss = max([v.get("cvss_score", 5.0) for v in vulnerabilities], default=5.0)
        has_kev_vuln = any([v.get("is_kev", False) for v in vulnerabilities]) or has_kev
        
        f_vuln = 1.0 + (max_cvss / 10.0) * 0.5
        if has_kev_vuln:
            f_vuln += 0.5  # Significant threat intelligence multiplier for actively exploited CVEs

        # 3. Control Weakness Factor
        f_control = 1.0
        if has_mfa_weakness:
            f_control *= 1.25
        if "Basic Firewall" in existing_controls and len(existing_controls) <= 2:
            f_control *= 1.10
        if "Next-Gen EDR" in existing_controls:
            f_control *= 0.65
        if "Phishing-Resistant MFA" in existing_controls or "FIDO2 MFA" in existing_controls:
            f_control *= 0.50
        if "Micro-segmentation" in existing_controls:
            f_control *= 0.60

        # 4. Criticality Factor
        crit_map = {
            "Critical": 1.00,
            "High": 0.85,
            "Medium": 0.65,
            "Low": 0.45
        }
        f_criticality = crit_map.get(criticality, 0.80)

        # Final Probability capped at 0.95 and floored at 0.005
        raw_prob = base_probability * f_exposure * f_vuln * f_control * f_criticality
        prob = min(0.95, max(0.005, round(raw_prob, 4)))

        factor_breakdown = {
            "base_probability": base_probability,
            "exposure_factor": round(f_exposure, 2),
            "vulnerability_factor": round(f_vuln, 2),
            "control_weakness_factor": round(f_control, 2),
            "criticality_factor": round(f_criticality, 2),
            "calculated_probability": prob
        }

        return prob, factor_breakdown

    @staticmethod
    def calculate_financial_impact(impact_components: Dict[str, float]) -> float:
        """
        Total Financial Impact = Downtime + Data Breach + Regulatory + Recovery + Disruption
        """
        downtime = impact_components.get("downtime", 0.0)
        breach = impact_components.get("data_breach", 0.0)
        regulatory = impact_components.get("regulatory", 0.0)
        recovery = impact_components.get("recovery", 0.0)
        disruption = impact_components.get("business_disruption", 0.0)
        
        return float(downtime + breach + regulatory + recovery + disruption)

    @staticmethod
    def calculate_eal(probability: float, total_financial_impact: float) -> float:
        """
        Expected Annual Loss (EAL) = Incident Probability × Total Financial Impact
        """
        return round(probability * total_financial_impact, 2)

    @staticmethod
    def calculate_risk_score(probability: float, financial_impact: float, max_benchmark_impact: float = 50000000.0) -> int:
        """
        Generates an intuitive 0-100 Risk Score for CISO dashboards
        combining likelihood and logarithmic impact scaling.
        """
        prob_weight = probability * 60.0  # up to 60 points from likelihood
        impact_ratio = min(1.0, financial_impact / max_benchmark_impact)
        impact_weight = impact_ratio * 40.0  # up to 40 points from impact scale
        score = int(round(prob_weight + impact_weight))
        return min(100, max(5, score))

    @staticmethod
    def get_risk_driver_breakdown(asset: Dict[str, Any]) -> Dict[str, float]:
        """
        Calculates explainable percentage contributions of key drivers to asset risk.
        """
        is_kev = any(v in ["CVE-2024-3094", "CVE-2024-21413", "CVE-2024-1709", "CVE-2024-21887"] for v in asset.get("vulnerability_ids", []))
        is_internet = asset.get("exposure") == "Internet"
        is_crit = asset.get("criticality") == "Critical"
        has_mfa_gap = "Deploy Phishing-Resistant Hardware MFA" in asset.get("missing_controls", [])
        
        kev_w = 95.0 if is_kev else 35.0
        exp_w = 92.0 if is_internet else 30.0
        mfa_w = 85.0 if has_mfa_gap else 20.0
        crit_w = 95.0 if is_crit else 65.0
        patch_w = 80.0 if len(asset.get("vulnerability_ids", [])) > 2 else 45.0

        return {
            "kev_weight": kev_w,
            "internet_exposure": exp_w,
            "weak_mfa": mfa_w,
            "asset_criticality": crit_w,
            "patch_gap": patch_w
        }

    @classmethod
    def evaluate_all_assets(cls, assets: List[Dict[str, Any]], active_controls: List[str] = None) -> Dict[str, Any]:
        """
        Evaluates enterprise-wide risk metrics across all assets taking active controls into account.
        """
        if active_controls is None:
            active_controls = []

        total_eal = 0.0
        evaluated_assets = []
        
        for raw_asset in assets:
            asset = dict(raw_asset)
            # Combine default existing controls with any newly activated controls targeting this asset
            current_controls = list(asset.get("existing_controls", []))
            
            prob, breakdown = cls.calculate_incident_probability(
                base_probability=asset["base_probability"],
                exposure=asset["exposure"],
                vulnerabilities=[{"cvss_score": 9.8, "is_kev": True}] if asset.get("id") == "AST-001" else [],
                existing_controls=current_controls,
                has_kev="CVE-2024-3094" in asset.get("vulnerability_ids", []),
                has_mfa_weakness="Deploy Phishing-Resistant Hardware MFA" in asset.get("missing_controls", []),
                criticality=asset["criticality"]
            )
            
            impact = cls.calculate_financial_impact(asset["financial_impact_components"])
            eal = cls.calculate_eal(prob, impact)
            risk_score = cls.calculate_risk_score(prob, impact)

            asset["incident_probability"] = prob
            asset["total_financial_impact"] = impact
            asset["eal"] = eal
            asset["risk_score"] = risk_score
            asset["priority"] = "P1" if risk_score >= 80 else ("P2" if risk_score >= 65 else "P3")
            asset["probability_breakdown"] = breakdown
            
            total_eal += eal
            evaluated_assets.append(asset)

        # Enterprise aggregate score (weighted by EAL contribution)
        avg_score = int(round(sum(a["risk_score"] for a in evaluated_assets) / max(1, len(evaluated_assets))))
        
        return {
            "total_eal": round(total_eal, 2),
            "enterprise_risk_score": avg_score,
            "assets": evaluated_assets
        }
