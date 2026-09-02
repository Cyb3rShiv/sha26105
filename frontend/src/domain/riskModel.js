/**
 * FinTrust Bank / Cyber-Quant Canonical Domain Risk Model
 * 
 * CORE ENGINEERING RULE:
 * ONE SOURCE OF TRUTH FOR EVERY NUMBER.
 * 
 * This module is the single authoritative source of truth for:
 * - Enterprise assets (6 assets, ₹1.84 Cr analytical baseline EAL)
 * - Security controls (8 controls, budget optimization)
 * - Vulnerability catalog (10 unique CVEs, 12 asset allocations)
 * - Authoritative FAIR loss breakdown (Payment Server 5 loss heads = ₹4.00 Cr)
 * - Pure calculation functions (Knapsack solver, portfolio evaluator, BCR, ROSI, Risk Score)
 */

// -------------------------------------------------------------
// 1. Authoritative Asset Inventory (6 Assets)
// -------------------------------------------------------------
export const ASSETS = [
  {
    id: "AST-001",
    name: "Internet-facing Payment Server",
    type: "Transaction Processing Server",
    criticality: "Critical",
    exposure: "Internet",
    ip_address: "103.21.144.12",
    owner: "Payment Operations Team",
    business_unit: "Retail Digital Banking",
    base_probability: 0.04,
    financial_impact_components: {
      downtime: 12000000.0,            // ₹1.20 Cr
      data_breach: 16000000.0,         // ₹1.60 Cr
      regulatory: 6000000.0,           // ₹60 L
      recovery: 4000000.0,             // ₹40 L
      business_disruption: 2000000.0   // ₹20 L (Customer Churn)
    },
    total_financial_impact: 40000000.0, // ₹4.00 Cr
    incident_probability: 0.18,        // 18.0%
    eal: 7200000.0,                    // ₹72.0 Lakhs
    risk_score: 91,
    priority: "P1",
    vulnerability_ids: ["CVE-2024-3094", "CVE-2024-21413", "CVE-2024-1709"],
    existing_controls: ["Basic Firewall", "Legacy Antivirus"],
    missing_controls: [
      "Patch Critical KEV Vulnerabilities",
      "Deploy Phishing-Resistant Hardware MFA",
      "Next-Gen EDR"
    ],
    risk_drivers: {
      kev_weight: 95.0,
      internet_exposure: 90.0,
      weak_mfa: 85.0,
      asset_criticality: 95.0,
      patch_gap: 80.0
    },
    attack_surface_desc: "Exposed directly to public internet without WAF, running vulnerable OpenSSH payload with single-factor administrative fallback.",
    recommended_treatment: "Immediately apply emergency security patch for CVE-2024-3094 and mandate hardware token MFA for all administrative sessions."
  },
  {
    id: "AST-002",
    name: "Customer Core Database",
    type: "Primary Relational Cluster (PostgreSQL/Oracle)",
    criticality: "Critical",
    exposure: "Internal",
    ip_address: "172.16.20.45",
    owner: "Database Administration Group",
    business_unit: "Core Banking Technology",
    base_probability: 0.03,
    financial_impact_components: {
      downtime: 10000000.0,            // ₹1.00 Cr
      data_breach: 24000000.0,         // ₹2.40 Cr
      regulatory: 5000000.0,           // ₹50 L
      recovery: 3000000.0,             // ₹30 L
      business_disruption: 1636363.0   // ₹16.4 L
    },
    total_financial_impact: 43636363.0, // ₹4.36 Cr
    incident_probability: 0.11,        // 11.0%
    eal: 4800000.0,                    // ₹48.0 Lakhs
    risk_score: 84,
    priority: "P1",
    vulnerability_ids: ["CVE-2024-27198", "CVE-2023-48795"],
    existing_controls: ["Internal VLAN", "Role-Based Access Control"],
    missing_controls: ["Database Activity Monitoring (DAM)", "Micro-segmentation"],
    risk_drivers: {
      kev_weight: 70.0,
      internet_exposure: 30.0,
      weak_mfa: 75.0,
      asset_criticality: 98.0,
      patch_gap: 65.0
    },
    attack_surface_desc: "Contains unencrypted KYC and account records accessible from adjacent internal payment tiers.",
    recommended_treatment: "Deploy Database Activity Monitoring (DAM), field-level tokenization, and strict microsegmentation from application tiers."
  },
  {
    id: "AST-003",
    name: "Employee VPN Gateway",
    type: "Remote Access Appliance (Pulse/Fortinet)",
    criticality: "High",
    exposure: "Internet",
    ip_address: "103.21.144.5",
    owner: "Infrastructure & Networking",
    business_unit: "Corporate IT",
    base_probability: 0.035,
    financial_impact_components: {
      downtime: 8000000.0,             // ₹80 L
      data_breach: 15000000.0,         // ₹1.50 Cr
      regulatory: 4000000.0,           // ₹40 L
      recovery: 4000000.0,             // ₹40 L
      business_disruption: 3444444.0   // ₹34.4 L
    },
    total_financial_impact: 34444444.0, // ₹3.44 Cr
    incident_probability: 0.09,        // 9.0%
    eal: 3100000.0,                    // ₹31.0 Lakhs
    risk_score: 78,
    priority: "P2",
    vulnerability_ids: ["CVE-2024-21887", "CVE-2024-21893"],
    existing_controls: ["SMS OTP MFA", "Basic Geo-blocking"],
    missing_controls: ["Deploy Phishing-Resistant Hardware MFA", "EDR Device Posture Check"],
    risk_drivers: {
      kev_weight: 85.0,
      internet_exposure: 95.0,
      weak_mfa: 80.0,
      asset_criticality: 80.0,
      patch_gap: 75.0
    },
    attack_surface_desc: "Publicly discoverable VPN portal prone to credential stuffing and legacy SMS-based MFA interception.",
    recommended_treatment: "Upgrade to FIDO2 WebAuthn authentication and enforce Zero-Trust device health posture validation before tunnel establishment."
  },
  {
    id: "AST-004",
    name: "Internet Banking API Gateway",
    type: "API Microservices Gateway (Kong/Envoy)",
    criticality: "High",
    exposure: "Internet",
    ip_address: "103.21.144.88",
    owner: "Digital Channels Engineering",
    business_unit: "Retail Banking",
    base_probability: 0.03,
    financial_impact_components: {
      downtime: 15000000.0,            // ₹1.50 Cr
      data_breach: 10000000.0,         // ₹1.00 Cr
      regulatory: 3500000.0,           // ₹35 L
      recovery: 2500000.0,             // ₹25 L
      business_disruption: 1307692.0   // ₹13.1 L
    },
    total_financial_impact: 32307692.0, // ₹3.23 Cr
    incident_probability: 0.065,       // 6.5%
    eal: 2100000.0,                    // ₹21.0 Lakhs
    risk_score: 71,
    priority: "P2",
    vulnerability_ids: ["CVE-2024-3400", "CVE-2024-1709"],
    existing_controls: ["Rate Limiting", "TLS 1.3"],
    missing_controls: ["API Security Gateway with WAF", "Micro-segmentation"],
    risk_drivers: {
      kev_weight: 65.0,
      internet_exposure: 90.0,
      weak_mfa: 50.0,
      asset_criticality: 85.0,
      patch_gap: 60.0
    },
    attack_surface_desc: "High request volume REST/JSON endpoints handling fund transfer authorization tokens.",
    recommended_treatment: "Deploy automated API schema validation, behavioral WAF anomaly detection, and mTLS service mesh."
  },
  {
    id: "AST-005",
    name: "Internal Active Directory (Domain Controller)",
    type: "Identity & Access Directory (Windows Server 2022)",
    criticality: "High",
    exposure: "Internal",
    ip_address: "172.16.10.10",
    owner: "Identity & Directory Services",
    business_unit: "Corporate IT",
    base_probability: 0.02,
    financial_impact_components: {
      downtime: 6000000.0,             // ₹60 L
      data_breach: 8000000.0,          // ₹80 L
      regulatory: 2500000.0,           // ₹25 L
      recovery: 2500000.0,             // ₹25 L
      business_disruption: 1000000.0   // ₹10 L
    },
    total_financial_impact: 20000000.0, // ₹2.00 Cr
    incident_probability: 0.04,        // 4.0%
    eal: 800000.0,                     // ₹8.0 Lakhs
    risk_score: 58,
    priority: "P3",
    vulnerability_ids: ["CVE-2024-21410", "CVE-2024-21413"],
    existing_controls: ["Domain Password Policy", "LAPS"],
    missing_controls: ["Next-Gen EDR", "Privileged Access Management (PAM)"],
    risk_drivers: {
      kev_weight: 60.0,
      internet_exposure: 20.0,
      weak_mfa: 70.0,
      asset_criticality: 85.0,
      patch_gap: 55.0
    },
    attack_surface_desc: "Kerberos ticket granting server vulnerable to pass-the-hash and privilege escalation across administrative accounts.",
    recommended_treatment: "Implement Tier-0 administrative credential isolation, enforce Privileged Access Management (PAM), and deploy honey tokens."
  },
  {
    id: "AST-006",
    name: "Offline Backup Repository",
    type: "Air-gapped Storage Appliance",
    criticality: "Medium",
    exposure: "Internal",
    ip_address: "172.16.99.100",
    owner: "Disaster Recovery Team",
    business_unit: "Enterprise IT",
    base_probability: 0.02,
    financial_impact_components: {
      downtime: 8000000.0,             // ₹80 L
      data_breach: 6000000.0,          // ₹60 L
      regulatory: 2000000.0,           // ₹20 L
      recovery: 3000000.0,             // ₹30 L
      business_disruption: 1000000.0   // ₹10 L
    },
    total_financial_impact: 20000000.0, // ₹2.00 Cr
    incident_probability: 0.02,        // 2.0%
    eal: 400000.0,                     // ₹4.0 Lakhs
    risk_score: 38,
    priority: "P3",
    vulnerability_ids: ["CVE-2023-27532"],
    existing_controls: ["Isolated Management VLAN", "Encrypted Snapshots"],
    missing_controls: ["Immutable Air-Gapped Ransomware Backups"],
    risk_drivers: {
      kev_weight: 40.0,
      internet_exposure: 10.0,
      weak_mfa: 40.0,
      asset_criticality: 70.0,
      patch_gap: 35.0
    },
    attack_surface_desc: "Targeted by ransomware operators in stage 4 to prevent enterprise disaster recovery.",
    recommended_treatment: "Enforce Write-Once-Read-Many (WORM) storage immutability with out-of-band dual-custody authorization."
  }
];

// -------------------------------------------------------------
// 2. Authoritative Security Controls Catalog (8 Controls)
// -------------------------------------------------------------
export const CONTROLS = [
  {
    id: "CTRL-001",
    name: "Patch Critical KEV Vulnerabilities (Payment & API)",
    description: "Automated patch deployment and emergency firmware upgrade across Internet-facing Payment servers and API Gateways.",
    category: "Vulnerability Mgmt",
    cost: 1500000.0,          // ₹15.0 Lakhs
    risk_reduction: 3500000.0, // ₹35.0 Lakhs
    effectiveness: 0.75,
    target_asset_ids: ["AST-001", "AST-004"],
    target_cve_ids: ["CVE-2024-3094", "CVE-2024-21413", "CVE-2024-1709", "CVE-2024-3400"],
    is_implemented: false,
    bcr: 2.33,
    net_rosi: 133.3,
    iso27001_mapping: "A.12.6.1 Management of technical vulnerabilities",
    nist_csf_mapping: "PR.IP-12 Vulnerability Management",
    rbi_mapping: "RBI Annex 1 - Section 4: Vulnerability Assessment & Patching",
    sebi_mapping: "SEBI CSCRF Chapter 3: Vulnerability Remediation Mandate"
  },
  {
    id: "CTRL-002",
    name: "Deploy Phishing-Resistant Hardware MFA (FIDO2)",
    description: "Enforce hardware security tokens (YubiKey/FIDO2) for all administrative logins, remote VPN access, and server SSH sessions.",
    category: "Identity & Access",
    cost: 600000.0,           // ₹6.0 Lakhs
    risk_reduction: 1800000.0, // ₹18.0 Lakhs
    effectiveness: 0.85,
    target_asset_ids: ["AST-001", "AST-003", "AST-005"],
    target_cve_ids: ["CVE-2024-21893", "CVE-2024-21410"],
    is_implemented: false,
    bcr: 3.00,
    net_rosi: 200.0,
    iso27001_mapping: "A.9.4.2 Secure log-on procedures & MFA",
    nist_csf_mapping: "PR.AC-7 Multi-factor Authentication",
    rbi_mapping: "RBI Section 5: Access Control & Two-Factor Authentication",
    sebi_mapping: "SEBI CSCRF Chapter 2: Identity & Privileged Access Control"
  },
  {
    id: "CTRL-003",
    name: "Next-Gen EDR & XDR Agent Upgrade",
    description: "Deploy behavioral Endpoint Detection and Response agents with real-time ransomware blocking on Domain Controllers and servers.",
    category: "Endpoint Security",
    cost: 1000000.0,          // ₹10.0 Lakhs
    risk_reduction: 1600000.0, // ₹16.0 Lakhs
    effectiveness: 0.70,
    target_asset_ids: ["AST-001", "AST-002", "AST-005"],
    target_cve_ids: ["CVE-2024-21410", "CVE-2024-21413"],
    is_implemented: false,
    bcr: 1.60,
    net_rosi: 60.0,
    iso27001_mapping: "A.12.2.1 Protection against malware",
    nist_csf_mapping: "DE.CM-4 Malicious Code Detection",
    rbi_mapping: "RBI Section 7: Anti-malware & Endpoint Protection",
    sebi_mapping: "SEBI CSCRF Chapter 4: Endpoint Threat Detection & Response"
  },
  {
    id: "CTRL-004",
    name: "Micro-segmentation & Zero Trust Network Architecture",
    description: "Isolate Core Database and Payment Server with granular East-West software-defined network segmentation.",
    category: "Network Security",
    cost: 1200000.0,          // ₹12.0 Lakhs
    risk_reduction: 2200000.0, // ₹22.0 Lakhs
    effectiveness: 0.80,
    target_asset_ids: ["AST-001", "AST-002", "AST-004"],
    target_cve_ids: ["CVE-2024-27198"],
    is_implemented: false,
    bcr: 1.83,
    net_rosi: 83.3,
    iso27001_mapping: "A.13.1.3 Segregation in networks",
    nist_csf_mapping: "PR.AC-5 Network Segmentation",
    rbi_mapping: "RBI Section 3: Network Architecture & Sub-netting",
    sebi_mapping: "SEBI CSCRF Chapter 2: Zero Trust Network Segregation"
  },
  {
    id: "CTRL-005",
    name: "Cloud SIEM & Automated SOAR Playbooks",
    description: "Centralized log ingestion with automated playbooks for immediate isolation of compromised accounts and suspicious lateral movement.",
    category: "Security Monitoring",
    cost: 800000.0,           // ₹8.0 Lakhs
    risk_reduction: 1100000.0, // ₹11.0 Lakhs
    effectiveness: 0.65,
    target_asset_ids: ["AST-001", "AST-002", "AST-003", "AST-004", "AST-005"],
    target_cve_ids: [],
    is_implemented: false,
    bcr: 1.38,
    net_rosi: 37.5,
    iso27001_mapping: "A.12.4.1 Event logging & SIEM",
    nist_csf_mapping: "DE.AE-1 Anomaly and Event Detection",
    rbi_mapping: "RBI Section 9: Security Operations Centre (SOC) & Alerting",
    sebi_mapping: "SEBI CSCRF Chapter 4: Continuous Cyber Monitoring & SOC"
  },
  {
    id: "CTRL-006",
    name: "Database Activity Monitoring (DAM) & Field Encryption",
    description: "Real-time query inspection, masking, and field-level encryption for sensitive Aadhaar, PAN, and banking cardholder records.",
    category: "Data Protection",
    cost: 700000.0,           // ₹7.0 Lakhs
    risk_reduction: 1400000.0, // ₹14.0 Lakhs
    effectiveness: 0.80,
    target_asset_ids: ["AST-002"],
    target_cve_ids: ["CVE-2023-48795"],
    is_implemented: false,
    bcr: 2.00,
    net_rosi: 100.0,
    iso27001_mapping: "A.10.1.1 Cryptographic controls & tokenization",
    nist_csf_mapping: "PR.DS-1 Data-at-Rest Protection",
    rbi_mapping: "RBI Section 6: Data Protection & Tokenization Standards",
    sebi_mapping: "SEBI CSCRF Chapter 3: Sensitive Data Encryption Mandate"
  },
  {
    id: "CTRL-007",
    name: "API Security Gateway with Web Application Firewall (WAF)",
    description: "Deep API payload inspection, schema compliance enforcement, and DDoS protection for Internet Banking gateways.",
    category: "Application Security",
    cost: 500000.0,           // ₹5.0 Lakhs
    risk_reduction: 950000.0,  // ₹9.5 Lakhs
    effectiveness: 0.75,
    target_asset_ids: ["AST-004"],
    target_cve_ids: ["CVE-2024-3400"],
    is_implemented: false,
    bcr: 1.90,
    net_rosi: 90.0,
    iso27001_mapping: "A.14.1.2 Securing application services on public networks",
    nist_csf_mapping: "PR.PT-4 Network and Host Protection",
    rbi_mapping: "RBI Section 4: Web Application Security Controls",
    sebi_mapping: "SEBI CSCRF Chapter 3: WAF and Perimeter Application Defenses"
  },
  {
    id: "CTRL-008",
    name: "Immutable Air-Gapped Ransomware Backups",
    description: "Write-Once-Read-Many (WORM) storage architecture with out-of-band dual authorization to guarantee recovery against destructive ransomware.",
    category: "Resilience & Recovery",
    cost: 400000.0,           // ₹4.0 Lakhs
    risk_reduction: 600000.0,  // ₹6.0 Lakhs
    effectiveness: 0.85,
    target_asset_ids: ["AST-006"],
    target_cve_ids: ["CVE-2023-27532"],
    is_implemented: false,
    bcr: 1.50,
    net_rosi: 50.0,
    iso27001_mapping: "A.12.3.1 Information backup & immutability",
    nist_csf_mapping: "RC.RP-1 Recovery Plan Execution",
    rbi_mapping: "RBI Section 8: Backup, BCP & Disaster Recovery Management",
    sebi_mapping: "SEBI CSCRF Chapter 5: Disaster Recovery & Air-Gapped Snapshots"
  }
];

// -------------------------------------------------------------
// 3. Authoritative Vulnerability Catalog (10 Unique CVEs)
// -------------------------------------------------------------
export const VULNERABILITIES = [
  {
    cve_id: "CVE-2024-3094",
    title: "XZ Utils Malicious Backdoor & Pre-auth RCE",
    cvss_score: 10.0,
    severity: "Critical",
    epss_score: 0.942,
    is_kev: true,
    affected_asset_ids: ["AST-001"],
    remediation_control_id: "CTRL-001"
  },
  {
    cve_id: "CVE-2024-21413",
    title: "Microsoft Outlook / Office NTLM Hash Disclosure (MonikerLink)",
    cvss_score: 9.8,
    severity: "Critical",
    epss_score: 0.812,
    is_kev: true,
    affected_asset_ids: ["AST-001", "AST-005"],
    remediation_control_id: "CTRL-001"
  },
  {
    cve_id: "CVE-2024-1709",
    title: "ConnectWise ScreenConnect Authentication Bypass",
    cvss_score: 9.8,
    severity: "Critical",
    epss_score: 0.885,
    is_kev: true,
    affected_asset_ids: ["AST-001", "AST-004"],
    remediation_control_id: "CTRL-001"
  },
  {
    cve_id: "CVE-2024-21887",
    title: "Ivanti Connect Secure Command Injection",
    cvss_score: 9.1,
    severity: "Critical",
    epss_score: 0.910,
    is_kev: true,
    affected_asset_ids: ["AST-003"],
    remediation_control_id: "CTRL-001"
  },
  {
    cve_id: "CVE-2024-21893",
    title: "Ivanti Connect Secure SSRF in SAML Component",
    cvss_score: 8.2,
    severity: "High",
    epss_score: 0.790,
    is_kev: true,
    affected_asset_ids: ["AST-003"],
    remediation_control_id: "CTRL-002"
  },
  {
    cve_id: "CVE-2024-27198",
    title: "JetBrains TeamCity Authentication Bypass",
    cvss_score: 9.8,
    severity: "Critical",
    epss_score: 0.915,
    is_kev: true,
    affected_asset_ids: ["AST-002"],
    remediation_control_id: "CTRL-004"
  },
  {
    cve_id: "CVE-2024-3400",
    title: "Palo Alto Networks PAN-OS GlobalProtect Command Injection",
    cvss_score: 10.0,
    severity: "Critical",
    epss_score: 0.938,
    is_kev: true,
    affected_asset_ids: ["AST-004"],
    remediation_control_id: "CTRL-007"
  },
  {
    cve_id: "CVE-2024-21410",
    title: "Microsoft Exchange Server Privilege Escalation via NTLM Relay",
    cvss_score: 9.8,
    severity: "Critical",
    epss_score: 0.760,
    is_kev: true,
    affected_asset_ids: ["AST-005"],
    remediation_control_id: "CTRL-003"
  },
  {
    cve_id: "CVE-2023-48795",
    title: "Terrapin Attack: SSH Protocol Prefix Truncation",
    cvss_score: 5.9,
    severity: "Medium",
    epss_score: 0.120,
    is_kev: false,
    affected_asset_ids: ["AST-002"],
    remediation_control_id: "CTRL-006"
  },
  {
    cve_id: "CVE-2023-27532",
    title: "Veeam Backup & Replication API Information Disclosure",
    cvss_score: 7.5,
    severity: "High",
    epss_score: 0.450,
    is_kev: true,
    affected_asset_ids: ["AST-006"],
    remediation_control_id: "CTRL-008"
  }
];

// -------------------------------------------------------------
// 4. Authoritative FAIR Loss Head Breakdown (Payment Server)
// -------------------------------------------------------------
export const PAYMENT_SERVER_LOSS_HEADS = [
  { name: "Downtime", amount: 12000000.0, formatted: "₹1.20 Cr", pct: 30.0 },
  { name: "Data Breach", amount: 16000000.0, formatted: "₹1.60 Cr", pct: 40.0 },
  { name: "Regulatory / DPDP fines", amount: 6000000.0, formatted: "₹60 L", pct: 15.0 },
  { name: "Recovery & Forensics", amount: 4000000.0, formatted: "₹40 L", pct: 10.0 },
  { name: "Customer Churn", amount: 2000000.0, formatted: "₹20 L", pct: 5.0 }
];

export const PAYMENT_SERVER_METRICS = {
  likelihoodPct: 18.0,
  likelihoodDecimal: 0.18,
  singleLossEvent: 40000000.0, // ₹4.00 Cr
  singleLossFormatted: "₹4.00 Cr",
  expectedAnnualLoss: 7200000.0, // ₹72.0 Lakhs
  ealFormatted: "₹72.0 L",
  formulaText: "EAL = 18.0% Likelihood × [ ₹1.20Cr Downtime + ₹1.60Cr Breach + ₹60L DPDP + ₹40L Recovery + ₹20L Disruption ] = ₹72.0 L/yr"
};

// -------------------------------------------------------------
// 5. Canonical Constants
// -------------------------------------------------------------
export const CANONICAL_BASELINE_EAL = 18400000.0; // ₹1.84 Cr
export const CANONICAL_BASELINE_SCORE = 70; // 70 / 100

// -------------------------------------------------------------
// 6. Pure Calculation Functions
// -------------------------------------------------------------

/**
 * Sums EAL across enterprise assets.
 */
export function sumEal(assets = ASSETS) {
  return assets.reduce((sum, a) => sum + (Number(a.eal) || 0), 0);
}

/**
 * Benefit-Cost Ratio (BCR) = Total Risk Reduction / Total Control Cost
 */
export function calculateBcr(reduction, cost) {
  if (!cost || cost <= 0) return 0.0;
  return Number((reduction / cost).toFixed(2));
}

/**
 * Net Return on Security Investment (ROSI %) = ((Reduction - Cost) / Cost) * 100
 */
export function calculateRosi(reduction, cost) {
  if (!cost || cost <= 0) return 0.0;
  return Number((((reduction - cost) / cost) * 100.0).toFixed(1));
}

/**
 * Mitigatable Exposure Percentage = (Reduction / Baseline EAL) * 100
 */
export function calculateMitigatable(reduction, baselineEal = CANONICAL_BASELINE_EAL) {
  if (!baselineEal || baselineEal <= 0) return 0.0;
  return Number(((reduction / baselineEal) * 100.0).toFixed(1));
}

/**
 * Strictly Monotonic Enterprise Risk Score
 * Calibrated: EAL ₹1.84 Cr -> Score 70.
 * Optimal ₹25L EAL ₹1.25 Cr -> Score 53 (-17 pts).
 * All 8 Controls EAL ₹0.525 Cr -> Score 32.
 * Higher EAL strictly results in higher or equal risk score.
 */
export function calculateRiskScore(eal, baseEal = CANONICAL_BASELINE_EAL, baseScore = CANONICAL_BASELINE_SCORE) {
  const e = Math.max(0, Number(eal) || 0);
  const e0 = Math.max(1, Number(baseEal) || CANONICAL_BASELINE_EAL);
  
  if (e >= e0) {
    const deltaRatio = (e - e0) / e0;
    const score = baseScore + (100 - baseScore) * (1.0 - Math.exp(-1.2 * deltaRatio));
    return Math.min(100, Math.max(0, Math.round(score)));
  } else {
    // Monotonic scaling down to zero risk floor (score 17)
    const ratio = e / e0;
    const score = 17.0 + 53.0 * ratio;
    return Math.min(100, Math.max(0, Math.round(score)));
  }
}

/**
 * Evaluates any arbitrary portfolio of security controls against enterprise baseline.
 */
export function evaluatePortfolio(selectedControls = [], baselineEal = CANONICAL_BASELINE_EAL, baselineScore = CANONICAL_BASELINE_SCORE) {
  const cost = selectedControls.reduce((acc, c) => acc + (Number(c.cost) || 0), 0);
  const reduction = selectedControls.reduce((acc, c) => acc + (Number(c.risk_reduction || c.reduction) || 0), 0);
  const residual = Math.max(0.0, baselineEal - reduction);
  const bcr = calculateBcr(reduction, cost);
  const netRosi = calculateRosi(reduction, cost);
  const mitigatablePct = calculateMitigatable(reduction, baselineEal);
  const simulatedScore = calculateRiskScore(residual, baselineEal, baselineScore);
  const netBenefit = reduction - cost;

  return {
    cost,
    reduction,
    residual,
    bcr,
    netRosi,
    mitigatablePct,
    simulatedScore,
    scoreDelta: baselineScore - simulatedScore,
    netBenefit,
    selectedCount: selectedControls.length
  };
}

/**
 * Solves the bounded 0/1 Knapsack problem for security controls under a budget constraint.
 * Uses exact combinatorial / dynamic programming evaluation for mathematical optimality.
 */
export function solveKnapsack(controls = CONTROLS, budget = 2500000.0, baselineEal = CANONICAL_BASELINE_EAL) {
  const n = controls.length;
  if (n === 0 || budget <= 0) {
    return {
      budget,
      cost: 0,
      reduction: 0,
      residual: baselineEal,
      bcr: 0,
      netRosi: 0,
      mitigatablePct: 0,
      simulatedScore: CANONICAL_BASELINE_SCORE,
      scoreDelta: 0,
      netBenefit: 0,
      selectedControls: [],
      selectedIds: []
    };
  }

  let bestReduction = -1.0;
  let bestCost = 0.0;
  let bestSubset = [];

  const totalSubsets = 1 << n;
  for (let mask = 0; mask < totalSubsets; mask++) {
    let currentCost = 0.0;
    let currentReduction = 0.0;
    const currentItems = [];

    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        currentCost += controls[i].cost;
        currentReduction += controls[i].risk_reduction;
        currentItems.push(controls[i]);
      }
    }

    if (currentCost <= budget) {
      if (
        currentReduction > bestReduction ||
        (currentReduction === bestReduction && currentCost < bestCost)
      ) {
        bestReduction = currentReduction;
        bestCost = currentCost;
        bestSubset = currentItems;
      }
    }
  }

  const evaluation = evaluatePortfolio(bestSubset, baselineEal, CANONICAL_BASELINE_SCORE);

  return {
    ...evaluation,
    budget,
    selectedControls: bestSubset,
    selectedIds: bestSubset.map((c) => c.id)
  };
}

// Precomputed Authoritative Optimal ₹25L Portfolio
export const CANONICAL_OPTIMAL_PORTFOLIO = solveKnapsack(CONTROLS, 2500000.0);

/**
 * Deterministic PRNG using Mulberry32 for reproducible Monte Carlo runs.
 */
export function mulberry32(seed = 26105) {
  let a = seed | 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// -------------------------------------------------------------
// 7. Reconciled CVE Inventory Counts
// -------------------------------------------------------------
export const CANONICAL_CVE_STATS = {
  uniqueCvesCount: VULNERABILITIES.length, // 10 Unique CVEs
  assetAllocationsCount: ASSETS.reduce((sum, a) => sum + (a.vulnerability_ids?.length || 0), 0), // 12 Asset Allocations
  kevCount: VULNERABILITIES.filter((v) => v.is_kev).length // 9 Active KEV
};
