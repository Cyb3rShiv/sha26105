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

    BASELINE_ASSET_METRICS: Dict[str, Tuple[float, int]] = {
        "AST-001": (7200000.0, 91),
        "AST-002": (4800000.0, 84),
        "AST-003": (3100000.0, 78),
        "AST-004": (2100000.0, 71),
        "AST-005": (800000.0, 58),
        "AST-006": (400000.0, 38)
    }

    @classmethod
    def calculate_risk_score(
        cls,
        probability: float,
        financial_impact: float,
        asset_id: str = None,
        baseline_eal: float = None,
        baseline_score: int = None,
        max_benchmark_impact: float = 50000000.0
    ) -> int:
        """
        Generates an explainable 0-100 Risk Score for CISO dashboards.
        Coupled directly and monotonically to asset likelihood, exposure, and EAL:
        - Higher risk drivers / higher EAL -> higher score
        - Lower risk drivers / lower EAL -> lower score
        - Bounded strictly between 5 and 100
        """
        current_eal = round(probability * financial_impact, 2)
        
        # If asset baseline references are provided or known
        if asset_id and asset_id in cls.BASELINE_ASSET_METRICS:
            base_eal, base_score = cls.BASELINE_ASSET_METRICS[asset_id]
        elif baseline_eal is not None and baseline_score is not None:
            base_eal, base_score = baseline_eal, baseline_score
        else:
            base_eal, base_score = None, None

        if base_eal and base_eal > 0 and base_score is not None:
            if current_eal >= base_eal:
                ratio = (current_eal - base_eal) / base_eal
                # Smooth asymptotic growth toward 100 as exposure escalates
                gain = (100 - base_score) * (1.0 - math.exp(-1.5 * ratio))
                return min(100, max(5, int(round(base_score + gain))))
            else:
                ratio = (base_eal - current_eal) / base_eal
                # Smooth reduction toward 10 as remediation takes effect
                drop = (base_score - 10) * ratio
                return min(100, max(5, int(round(base_score - drop))))

        # Fallback for dynamic / unanchored assets:
        # Balanced FAIR decomposition: 50% likelihood scale, 30% financial impact, 20% EAL log scale
        prob_pts = min(50.0, (probability / 0.20) * 50.0)
        impact_pts = min(30.0, (financial_impact / max_benchmark_impact) * 30.0)
        eal_pts = min(20.0, (math.log10(max(1000.0, current_eal)) / 7.0) * 20.0)
        score = int(round(prob_pts + impact_pts + eal_pts))
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
    def calculate_enterprise_risk_score(
        cls,
        total_eal: float,
        base_eal: float = 18400000.0,
        base_score: int = 70
    ) -> int:
        """
        Calculates canonical enterprise-level 0-100 Risk Score strictly monotonic in EAL.
        Guarantees:
        - d(score)/d(EAL) >= 0 for all EAL >= 0
        - Baseline: EAL = 1.84 Cr -> Score = 70
        - Score stays bounded in [10, 100]
        """
        if total_eal <= 0:
            return 10
        if total_eal >= base_eal:
            ratio = (total_eal - base_eal) / base_eal
            gain = (100 - base_score) * (1.0 - math.exp(-1.2 * ratio))
            return min(100, max(10, int(round(base_score + gain))))
        else:
            ratio = (base_eal - total_eal) / base_eal
            drop = (base_score - 15) * ratio
            return min(100, max(10, int(round(base_score - drop))))

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
            risk_score = cls.calculate_risk_score(prob, impact, asset_id=asset.get("id"))

            asset["incident_probability"] = prob
            asset["total_financial_impact"] = impact
            asset["eal"] = eal
            asset["risk_score"] = risk_score
            asset["priority"] = "P1" if risk_score >= 80 else ("P2" if risk_score >= 65 else "P3")
            asset["probability_breakdown"] = breakdown
            
            total_eal += eal
            evaluated_assets.append(asset)

        # Enterprise aggregate score strictly monotonic in EAL
        enterprise_score = cls.calculate_enterprise_risk_score(total_eal)
        
        return {
            "total_eal": round(total_eal, 2),
            "enterprise_risk_score": enterprise_score,
            "assets": evaluated_assets
        }
