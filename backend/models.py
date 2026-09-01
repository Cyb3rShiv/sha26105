from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class FinancialImpactComponents(BaseModel):
    downtime: float = Field(..., description="Estimated downtime cost in INR")
    data_breach: float = Field(..., description="Data breach / record theft cost in INR")
    regulatory: float = Field(..., description="Regulatory fines (RBI/DPDP/SEBI) in INR")
    recovery: float = Field(..., description="Incident recovery & forensics cost in INR")
    business_disruption: float = Field(..., description="Customer churn & reputation damage in INR")

class RiskDriverBreakdown(BaseModel):
    kev_weight: float = Field(..., description="Contribution from Known Exploited Vulnerabilities (0-100)")
    internet_exposure: float = Field(..., description="Contribution from Public Internet Exposure (0-100)")
    weak_mfa: float = Field(..., description="Contribution from Inadequate IAM / Weak MFA (0-100)")
    asset_criticality: float = Field(..., description="Contribution from Core Business Criticality (0-100)")
    patch_gap: float = Field(..., description="Contribution from Unpatched Vulnerabilities (0-100)")

class Asset(BaseModel):
    id: str
    name: str
    type: str
    criticality: str  # Critical, High, Medium, Low
    exposure: str  # Internet, Internal, Restricted
    ip_address: str
    owner: str
    business_unit: str
    base_probability: float
    financial_impact_components: FinancialImpactComponents
    total_financial_impact: float
    incident_probability: float
    eal: float  # Expected Annual Loss in INR
    risk_score: int  # 0 to 100
    priority: str  # P1, P2, P3
    vulnerability_ids: List[str]
    existing_controls: List[str]
    missing_controls: List[str]
    risk_drivers: RiskDriverBreakdown
    attack_surface_desc: str
    recommended_treatment: str

class Vulnerability(BaseModel):
    cve_id: str
    title: str
    description: str
    cvss_score: float
    severity: str  # Critical, High, Medium, Low
    epss_score: float
    is_kev: bool  # CISA Known Exploited Vulnerability
    affected_asset_ids: List[str]
    attack_vector: str
    remediation_control_id: str
    risk_driver_weights: RiskDriverBreakdown

class SecurityControl(BaseModel):
    id: str
    name: str
    description: str
    category: str  # Identity, Vulnerability Mgmt, Endpoint, Network, Monitoring, Cloud
    cost: float  # Implementation + Operational cost in INR
    risk_reduction: float  # Estimated reduction in enterprise EAL in INR
    effectiveness: float  # Control effectiveness factor 0.0 - 1.0
    target_asset_ids: List[str]
    target_cve_ids: List[str]
    is_implemented: bool
    rosi: float  # Return on Security Investment (Risk Reduction / Cost)
    iso27001_mapping: str
    nist_csf_mapping: str
    rbi_mapping: str
    sebi_mapping: str

class MonteCarloBin(BaseModel):
    bin_index: int
    loss_min: float
    loss_max: float
    label: str
    count: int
    probability: float

class MonteCarloResult(BaseModel):
    iterations: int
    mean_loss: float
    median_loss: float
    p90_loss: float
    p95_loss: float
    var_95: float  # 95% Value at Risk
    std_dev: float
    distribution_bins: List[MonteCarloBin]
    sample_scenarios: List[Dict[str, Any]]
    run_timestamp: str

class OptimizationRequest(BaseModel):
    budget: float
    strategy: Optional[str] = "max_reduction"

class OptimizationResult(BaseModel):
    budget: float
    total_cost: float
    total_risk_reduction: float
    remaining_risk: float
    overall_rosi: float
    baseline_eal: float
    optimized_eal: float
    selected_controls: List[SecurityControl]
    unselected_controls: List[SecurityControl]
    optimization_summary: str

class WhatIfRequest(BaseModel):
    enabled_control_ids: List[str]

class WhatIfResult(BaseModel):
    baseline_eal: float
    baseline_risk_score: int
    simulated_eal: float
    simulated_risk_score: int
    total_control_cost: float
    risk_reduction: float
    net_benefit: float
    rosi: float
    asset_changes: List[Dict[str, Any]]

class AttackPathNode(BaseModel):
    id: str
    label: str
    type: str  # threat_actor, entry_point, vulnerability, intermediate_pivot, target_asset, impact
    asset_id: Optional[str] = None
    cve_id: Optional[str] = None
    risk_level: str
    eal: Optional[float] = None
    details: str
    mitigation: str

class AttackPathEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    technique: str  # MITRE ATT&CK ID

class AttackPathGraph(BaseModel):
    nodes: List[AttackPathNode]
    edges: List[AttackPathEdge]
    critical_path: List[str]
    attack_summary: str

class TelemetryEvent(BaseModel):
    id: str
    timestamp: str
    source: str  # Vulnerability Scanner, SIEM, EDR, IAM, Threat Intel, Asset Inventory, Risk Engine
    severity: str  # Critical, High, Medium, Low, Info
    description: str
    affected_asset: str
    raw_payload: Dict[str, Any]
    event_type: str

class DashboardSummary(BaseModel):
    enterprise_risk_score: int
    expected_annual_loss: float
    p90_loss: float
    var_95: float
    security_budget: float
    potential_risk_reduction: float
    residual_risk_target: float
    asset_count: int
    vulnerability_count: int
    active_controls_count: int
    pending_controls_count: int
    risk_trend_12m: List[Dict[str, Any]]
    eal_by_asset: List[Dict[str, Any]]
    top_risk_drivers: List[Dict[str, Any]]
    top_vulnerabilities: List[Dict[str, Any]]
    recommended_portfolio_summary: Dict[str, Any]
    data_classification: str = "Synthetic Demo Data"
