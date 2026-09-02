/**
 * FinTrust Bank / Cyber-Quant Canonical Fallback Dataset
 * Generated directly from backend seed_data.py to guarantee 100% data parity.
 */

export const CANONICAL_ASSETS = [
  {
    "id": "AST-001",
    "name": "Internet-facing Payment Server",
    "type": "Transaction Processing Server",
    "criticality": "Critical",
    "exposure": "Internet",
    "ip_address": "103.21.144.12",
    "owner": "Payment Operations Team",
    "business_unit": "Retail Digital Banking",
    "base_probability": 0.04,
    "financial_impact_components": {
      "downtime": 12000000.0,
      "data_breach": 16000000.0,
      "regulatory": 6000000.0,
      "recovery": 4000000.0,
      "business_disruption": 2000000.0
    },
    "total_financial_impact": 40000000.0,
    "incident_probability": 0.18,
    "eal": 7200000.0,
    "risk_score": 91,
    "priority": "P1",
    "vulnerability_ids": [
      "CVE-2024-3094",
      "CVE-2024-21413",
      "CVE-2024-1709"
    ],
    "existing_controls": [
      "Basic Firewall",
      "Legacy Antivirus"
    ],
    "missing_controls": [
      "Patch Critical KEV Vulnerabilities",
      "Deploy Phishing-Resistant Hardware MFA",
      "Next-Gen EDR"
    ],
    "risk_drivers": {
      "kev_weight": 95.0,
      "internet_exposure": 90.0,
      "weak_mfa": 85.0,
      "asset_criticality": 95.0,
      "patch_gap": 80.0
    },
    "attack_surface_desc": "Exposed directly to public internet without WAF, running vulnerable OpenSSH payload with single-factor administrative fallback.",
    "recommended_treatment": "Immediately apply emergency security patch for CVE-2024-3094 and mandate hardware token MFA for all administrative sessions."
  },
  {
    "id": "AST-002",
    "name": "Customer Core Database",
    "type": "Primary Relational Cluster (PostgreSQL/Oracle)",
    "criticality": "Critical",
    "exposure": "Internal",
    "ip_address": "172.16.20.45",
    "owner": "Database Administration Group",
    "business_unit": "Core Banking Technology",
    "base_probability": 0.03,
    "financial_impact_components": {
      "downtime": 10000000.0,
      "data_breach": 24000000.0,
      "regulatory": 5000000.0,
      "recovery": 3000000.0,
      "business_disruption": 1636363.0
    },
    "total_financial_impact": 43636363.0,
    "incident_probability": 0.11,
    "eal": 4800000.0,
    "risk_score": 84,
    "priority": "P1",
    "vulnerability_ids": [
      "CVE-2024-27198",
      "CVE-2023-48795"
    ],
    "existing_controls": [
      "Internal VLAN",
      "Role-Based Access Control"
    ],
    "missing_controls": [
      "Database Activity Monitoring (DAM)",
      "Micro-segmentation"
    ],
    "risk_drivers": {
      "kev_weight": 70.0,
      "internet_exposure": 30.0,
      "weak_mfa": 75.0,
      "asset_criticality": 98.0,
      "patch_gap": 65.0
    },
    "attack_surface_desc": "Contains unencrypted KYC and account records accessible from adjacent internal payment tiers.",
    "recommended_treatment": "Deploy Database Activity Monitoring (DAM), field-level tokenization, and strict microsegmentation from application tiers."
  },
  {
    "id": "AST-003",
    "name": "Employee VPN Gateway",
    "type": "Remote Access Appliance (Pulse/Fortinet)",
    "criticality": "High",
    "exposure": "Internet",
    "ip_address": "103.21.144.5",
    "owner": "Infrastructure & Networking",
    "business_unit": "Corporate IT",
    "base_probability": 0.035,
    "financial_impact_components": {
      "downtime": 8000000.0,
      "data_breach": 15000000.0,
      "regulatory": 4000000.0,
      "recovery": 4000000.0,
      "business_disruption": 3444444.0
    },
    "total_financial_impact": 34444444.0,
    "incident_probability": 0.09,
    "eal": 3100000.0,
    "risk_score": 78,
    "priority": "P2",
    "vulnerability_ids": [
      "CVE-2024-21887",
      "CVE-2024-21893"
    ],
    "existing_controls": [
      "SMS OTP MFA",
      "Basic Geo-blocking"
    ],
    "missing_controls": [
      "Deploy Phishing-Resistant Hardware MFA",
      "EDR Device Posture Check"
    ],
    "risk_drivers": {
      "kev_weight": 85.0,
      "internet_exposure": 95.0,
      "weak_mfa": 80.0,
      "asset_criticality": 80.0,
      "patch_gap": 75.0
    },
    "attack_surface_desc": "Publicly discoverable VPN portal prone to credential stuffing and legacy SMS-based MFA interception.",
    "recommended_treatment": "Upgrade to FIDO2 WebAuthn authentication and enforce Zero-Trust device health posture validation before tunnel establishment."
  },
  {
    "id": "AST-004",
    "name": "Internet Banking API Gateway",
    "type": "API Microservices Gateway (Kong/Envoy)",
    "criticality": "High",
    "exposure": "Internet",
    "ip_address": "103.21.144.88",
    "owner": "Digital Channels Engineering",
    "business_unit": "Retail Banking",
    "base_probability": 0.03,
    "financial_impact_components": {
      "downtime": 15000000.0,
      "data_breach": 10000000.0,
      "regulatory": 3500000.0,
      "recovery": 2500000.0,
      "business_disruption": 1307692.0
    },
    "total_financial_impact": 32307692.0,
    "incident_probability": 0.065,
    "eal": 2100000.0,
    "risk_score": 71,
    "priority": "P2",
    "vulnerability_ids": [
      "CVE-2024-3400",
      "CVE-2023-38606"
    ],
    "existing_controls": [
      "Rate Limiting",
      "TLS 1.3"
    ],
    "missing_controls": [
      "API Security Gateway with WAF",
      "Micro-segmentation"
    ],
    "risk_drivers": {
      "kev_weight": 65.0,
      "internet_exposure": 90.0,
      "weak_mfa": 50.0,
      "asset_criticality": 85.0,
      "patch_gap": 60.0
    },
    "attack_surface_desc": "High request volume REST/JSON endpoints handling fund transfer authorization tokens.",
    "recommended_treatment": "Deploy automated API schema validation, behavioral WAF anomaly detection, and mTLS service mesh."
  },
  {
    "id": "AST-005",
    "name": "Internal Active Directory (Domain Controller)",
    "type": "Identity & Access Directory (Windows Server 2022)",
    "criticality": "High",
    "exposure": "Internal",
    "ip_address": "172.16.10.10",
    "owner": "Identity & Directory Services",
    "business_unit": "Corporate IT",
    "base_probability": 0.02,
    "financial_impact_components": {
      "downtime": 6000000.0,
      "data_breach": 8000000.0,
      "regulatory": 2500000.0,
      "recovery": 2500000.0,
      "business_disruption": 1000000.0
    },
    "total_financial_impact": 20000000.0,
    "incident_probability": 0.04,
    "eal": 800000.0,
    "risk_score": 58,
    "priority": "P3",
    "vulnerability_ids": [
      "CVE-2024-21410",
      "CVE-2023-36884"
    ],
    "existing_controls": [
      "Domain Password Policy",
      "LAPS"
    ],
    "missing_controls": [
      "Next-Gen EDR",
      "Privileged Access Management (PAM)"
    ],
    "risk_drivers": {
      "kev_weight": 60.0,
      "internet_exposure": 20.0,
      "weak_mfa": 70.0,
      "asset_criticality": 85.0,
      "patch_gap": 50.0
    },
    "attack_surface_desc": "Target for Kerberoasting, NTLM relaying, and lateral movement privilege escalation.",
    "recommended_treatment": "Enforce tier-0 administration isolation, disable NTLMv1, and implement real-time AD threat hunting telemetry."
  },
  {
    "id": "AST-006",
    "name": "Backup & Disaster Recovery Server",
    "type": "Immutable Storage / Veeam Repository",
    "criticality": "Medium",
    "exposure": "Restricted",
    "ip_address": "172.16.99.15",
    "owner": "Business Continuity Team",
    "business_unit": "Risk & Resilience",
    "base_probability": 0.015,
    "financial_impact_components": {
      "downtime": 8000000.0,
      "data_breach": 6000000.0,
      "regulatory": 2000000.0,
      "recovery": 3000000.0,
      "business_disruption": 1000000.0
    },
    "total_financial_impact": 20000000.0,
    "incident_probability": 0.02,
    "eal": 400000.0,
    "risk_score": 38,
    "priority": "P3",
    "vulnerability_ids": [
      "CVE-2023-27532"
    ],
    "existing_controls": [
      "Isolated Management VLAN",
      "Encrypted Snapshots"
    ],
    "missing_controls": [
      "Immutable Air-Gapped Ransomware Backups"
    ],
    "risk_drivers": {
      "kev_weight": 40.0,
      "internet_exposure": 10.0,
      "weak_mfa": 40.0,
      "asset_criticality": 70.0,
      "patch_gap": 35.0
    },
    "attack_surface_desc": "Targeted by ransomware operators in stage 4 to prevent enterprise disaster recovery.",
    "recommended_treatment": "Enforce Write-Once-Read-Many (WORM) storage immutability with out-of-band dual-custody authorization."
  }
];

export const CANONICAL_VULNERABILITIES = [
  {
    "cve_id": "CVE-2024-3094",
    "title": "XZ Utils Malicious Backdoor & Pre-auth RCE",
    "description": "Upstream malicious code backdoor allowing unauthorized remote code execution bypassing SSH authentication.",
    "cvss_score": 10.0,
    "severity": "Critical",
    "epss_score": 0.942,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-001"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-001",
    "risk_driver_weights": {
      "kev_weight": 98.0,
      "internet_exposure": 95.0,
      "weak_mfa": 80.0,
      "asset_criticality": 95.0,
      "patch_gap": 90.0
    }
  },
  {
    "cve_id": "CVE-2024-21413",
    "title": "Microsoft Outlook / Office NTLM Hash Disclosure (MonikerLink)",
    "description": "Allows remote unauthenticated attackers to bypass Protected View and leak NTLM credential hashes.",
    "cvss_score": 9.8,
    "severity": "Critical",
    "epss_score": 0.812,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-001",
      "AST-005"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-001",
    "risk_driver_weights": {
      "kev_weight": 90.0,
      "internet_exposure": 85.0,
      "weak_mfa": 75.0,
      "asset_criticality": 90.0,
      "patch_gap": 85.0
    }
  },
  {
    "cve_id": "CVE-2024-1709",
    "title": "ConnectWise ScreenConnect Authentication Bypass",
    "description": "Authentication bypass vulnerability allowing remote attackers to create administrative accounts and execute arbitrary commands.",
    "cvss_score": 9.8,
    "severity": "Critical",
    "epss_score": 0.885,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-001"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-001",
    "risk_driver_weights": {
      "kev_weight": 92.0,
      "internet_exposure": 90.0,
      "weak_mfa": 85.0,
      "asset_criticality": 95.0,
      "patch_gap": 80.0
    }
  },
  {
    "cve_id": "CVE-2024-21887",
    "title": "Ivanti Connect Secure Command Injection",
    "description": "Command injection vulnerability in web components of Ivanti Connect Secure allowing authenticated admins to execute arbitrary commands.",
    "cvss_score": 9.1,
    "severity": "Critical",
    "epss_score": 0.91,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-003"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-001",
    "risk_driver_weights": {
      "kev_weight": 94.0,
      "internet_exposure": 95.0,
      "weak_mfa": 85.0,
      "asset_criticality": 80.0,
      "patch_gap": 85.0
    }
  },
  {
    "cve_id": "CVE-2024-21893",
    "title": "Ivanti SAML Component SSRF Vulnerability",
    "description": "Server-Side Request Forgery vulnerability in the SAML component allowing unauthenticated access to restricted resources.",
    "cvss_score": 8.2,
    "severity": "High",
    "epss_score": 0.74,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-003"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-002",
    "risk_driver_weights": {
      "kev_weight": 85.0,
      "internet_exposure": 90.0,
      "weak_mfa": 80.0,
      "asset_criticality": 80.0,
      "patch_gap": 75.0
    }
  },
  {
    "cve_id": "CVE-2024-27198",
    "title": "JetBrains TeamCity Auth Bypass & Remote Code Execution",
    "description": "Authentication bypass in web component allowing arbitrary administrator user creation and remote code execution.",
    "cvss_score": 9.8,
    "severity": "Critical",
    "epss_score": 0.835,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-002"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-004",
    "risk_driver_weights": {
      "kev_weight": 88.0,
      "internet_exposure": 40.0,
      "weak_mfa": 75.0,
      "asset_criticality": 95.0,
      "patch_gap": 70.0
    }
  },
  {
    "cve_id": "CVE-2024-3400",
    "title": "Palo Alto PAN-OS GlobalProtect Command Injection",
    "description": "Command injection vulnerability in PAN-OS GlobalProtect feature enabling unauthenticated remote attackers to execute arbitrary code with root privileges.",
    "cvss_score": 10.0,
    "severity": "Critical",
    "epss_score": 0.925,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-004"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-007",
    "risk_driver_weights": {
      "kev_weight": 95.0,
      "internet_exposure": 92.0,
      "weak_mfa": 50.0,
      "asset_criticality": 85.0,
      "patch_gap": 80.0
    }
  },
  {
    "cve_id": "CVE-2024-21410",
    "title": "Microsoft Exchange Server Privilege Escalation via NTLM Relay",
    "description": "Allows remote attackers to relay NTLM credentials to target Exchange servers and gain elevated privileges.",
    "cvss_score": 9.8,
    "severity": "Critical",
    "epss_score": 0.76,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-005"
    ],
    "attack_vector": "Adjacent / Network",
    "remediation_control_id": "CTRL-003",
    "risk_driver_weights": {
      "kev_weight": 80.0,
      "internet_exposure": 25.0,
      "weak_mfa": 70.0,
      "asset_criticality": 85.0,
      "patch_gap": 65.0
    }
  },
  {
    "cve_id": "CVE-2023-48795",
    "title": "Terrapin Attack: SSH Protocol Prefix Truncation",
    "description": "Cryptographic attack allowing MitM adversary to manipulate sequence numbers and compromise SSH channel integrity.",
    "cvss_score": 5.9,
    "severity": "Medium",
    "epss_score": 0.12,
    "is_kev": false,
    "affected_asset_ids": [
      "AST-002"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-006",
    "risk_driver_weights": {
      "kev_weight": 30.0,
      "internet_exposure": 20.0,
      "weak_mfa": 50.0,
      "asset_criticality": 90.0,
      "patch_gap": 45.0
    }
  },
  {
    "cve_id": "CVE-2023-27532",
    "title": "Veeam Backup & Replication API Information Disclosure",
    "description": "Vulnerability in Veeam.Backup.Service allowing unauthenticated users on network to request encrypted credentials.",
    "cvss_score": 7.5,
    "severity": "High",
    "epss_score": 0.45,
    "is_kev": true,
    "affected_asset_ids": [
      "AST-006"
    ],
    "attack_vector": "Network",
    "remediation_control_id": "CTRL-008",
    "risk_driver_weights": {
      "kev_weight": 70.0,
      "internet_exposure": 15.0,
      "weak_mfa": 40.0,
      "asset_criticality": 70.0,
      "patch_gap": 60.0
    }
  }
];

export const CANONICAL_CONTROLS = [
  {
    "id": "CTRL-001",
    "name": "Patch Critical KEV Vulnerabilities (Payment & API)",
    "description": "Automated patch deployment and emergency firmware upgrade across Internet-facing Payment servers and API Gateways.",
    "category": "Vulnerability Mgmt",
    "cost": 1500000.0,
    "risk_reduction": 3500000.0,
    "effectiveness": 0.75,
    "target_asset_ids": [
      "AST-001",
      "AST-004"
    ],
    "target_cve_ids": [
      "CVE-2024-3094",
      "CVE-2024-21413",
      "CVE-2024-1709",
      "CVE-2024-3400"
    ],
    "is_implemented": false,
    "rosi": 2.33,
    "iso27001_mapping": "A.12.6.1 Management of technical vulnerabilities",
    "nist_csf_mapping": "PR.IP-12 Vulnerability Management",
    "rbi_mapping": "RBI Annex 1 - Section 4: Vulnerability Assessment & Patching",
    "sebi_mapping": "SEBI CSCRF Chapter 3: Vulnerability Remediation Mandate"
  },
  {
    "id": "CTRL-002",
    "name": "Deploy Phishing-Resistant Hardware MFA (FIDO2)",
    "description": "Enforce hardware security tokens (YubiKey/FIDO2) for all administrative logins, remote VPN access, and server SSH sessions.",
    "category": "Identity & Access",
    "cost": 600000.0,
    "risk_reduction": 1800000.0,
    "effectiveness": 0.85,
    "target_asset_ids": [
      "AST-001",
      "AST-003",
      "AST-005"
    ],
    "target_cve_ids": [
      "CVE-2024-21893",
      "CVE-2024-21410"
    ],
    "is_implemented": false,
    "rosi": 3.0,
    "iso27001_mapping": "A.9.4.2 Secure log-on procedures & MFA",
    "nist_csf_mapping": "PR.AC-7 Multi-factor Authentication",
    "rbi_mapping": "RBI Section 5: Access Control & Two-Factor Authentication",
    "sebi_mapping": "SEBI CSCRF Chapter 2: Identity & Privileged Access Control"
  },
  {
    "id": "CTRL-003",
    "name": "Next-Gen EDR & XDR Agent Upgrade",
    "description": "Deploy behavioral Endpoint Detection and Response agents with real-time ransomware blocking on Domain Controllers and servers.",
    "category": "Endpoint Security",
    "cost": 1000000.0,
    "risk_reduction": 1600000.0,
    "effectiveness": 0.7,
    "target_asset_ids": [
      "AST-001",
      "AST-002",
      "AST-005"
    ],
    "target_cve_ids": [
      "CVE-2024-21410",
      "CVE-2024-21413"
    ],
    "is_implemented": false,
    "rosi": 1.6,
    "iso27001_mapping": "A.12.2.1 Protection against malware",
    "nist_csf_mapping": "DE.CM-4 Malicious Code Detection",
    "rbi_mapping": "RBI Section 7: Anti-malware & Endpoint Protection",
    "sebi_mapping": "SEBI CSCRF Chapter 4: Endpoint Threat Detection & Response"
  },
  {
    "id": "CTRL-004",
    "name": "Micro-segmentation & Zero Trust Network Architecture",
    "description": "Isolate Core Database and Payment Server with granular East-West software-defined network segmentation.",
    "category": "Network Security",
    "cost": 1200000.0,
    "risk_reduction": 2200000.0,
    "effectiveness": 0.8,
    "target_asset_ids": [
      "AST-001",
      "AST-002",
      "AST-004"
    ],
    "target_cve_ids": [
      "CVE-2024-27198"
    ],
    "is_implemented": false,
    "rosi": 1.83,
    "iso27001_mapping": "A.13.1.3 Segregation in networks",
    "nist_csf_mapping": "PR.AC-5 Network Segmentation",
    "rbi_mapping": "RBI Section 3: Network Architecture & Sub-netting",
    "sebi_mapping": "SEBI CSCRF Chapter 2: Zero Trust Network Segregation"
  },
  {
    "id": "CTRL-005",
    "name": "Cloud SIEM & Automated SOAR Playbooks",
    "description": "Centralized log ingestion with automated playbooks for immediate isolation of compromised accounts and suspicious lateral movement.",
    "category": "Security Monitoring",
    "cost": 800000.0,
    "risk_reduction": 1100000.0,
    "effectiveness": 0.65,
    "target_asset_ids": [
      "AST-001",
      "AST-002",
      "AST-003",
      "AST-004",
      "AST-005"
    ],
    "target_cve_ids": [],
    "is_implemented": false,
    "rosi": 1.38,
    "iso27001_mapping": "A.12.4.1 Event logging & SIEM",
    "nist_csf_mapping": "DE.AE-1 Anomaly and Event Detection",
    "rbi_mapping": "RBI Section 9: Security Operations Centre (SOC) & Alerting",
    "sebi_mapping": "SEBI CSCRF Chapter 4: Continuous Cyber Monitoring & SOC"
  },
  {
    "id": "CTRL-006",
    "name": "Database Activity Monitoring (DAM) & Field Encryption",
    "description": "Real-time query inspection, masking, and field-level encryption for sensitive Aadhaar, PAN, and banking cardholder records.",
    "category": "Data Protection",
    "cost": 700000.0,
    "risk_reduction": 1400000.0,
    "effectiveness": 0.8,
    "target_asset_ids": [
      "AST-002"
    ],
    "target_cve_ids": [
      "CVE-2023-48795"
    ],
    "is_implemented": false,
    "rosi": 2.0,
    "iso27001_mapping": "A.10.1.1 Cryptographic controls & tokenization",
    "nist_csf_mapping": "PR.DS-1 Data-at-Rest Protection",
    "rbi_mapping": "RBI Section 6: Data Protection & Tokenization Standards",
    "sebi_mapping": "SEBI CSCRF Chapter 3: Sensitive Data Encryption Mandate"
  },
  {
    "id": "CTRL-007",
    "name": "API Security Gateway with Web Application Firewall (WAF)",
    "description": "Deep API payload inspection, schema compliance enforcement, and DDoS protection for Internet Banking gateways.",
    "category": "Application Security",
    "cost": 500000.0,
    "risk_reduction": 950000.0,
    "effectiveness": 0.75,
    "target_asset_ids": [
      "AST-004"
    ],
    "target_cve_ids": [
      "CVE-2024-3400"
    ],
    "is_implemented": false,
    "rosi": 1.9,
    "iso27001_mapping": "A.14.1.2 Securing application services on public networks",
    "nist_csf_mapping": "PR.PT-4 Network and Host Protection",
    "rbi_mapping": "RBI Section 4: Web Application Security Controls",
    "sebi_mapping": "SEBI CSCRF Chapter 3: WAF and Perimeter Application Defenses"
  },
  {
    "id": "CTRL-008",
    "name": "Immutable Air-Gapped Ransomware Backups",
    "description": "Write-Once-Read-Many (WORM) storage architecture with out-of-band dual authorization to guarantee recovery against destructive ransomware.",
    "category": "Resilience & Recovery",
    "cost": 400000.0,
    "risk_reduction": 600000.0,
    "effectiveness": 0.85,
    "target_asset_ids": [
      "AST-006"
    ],
    "target_cve_ids": [
      "CVE-2023-27532"
    ],
    "is_implemented": false,
    "rosi": 1.5,
    "iso27001_mapping": "A.12.3.1 Information backup & immutability",
    "nist_csf_mapping": "RC.RP-1 Recovery Plan Execution",
    "rbi_mapping": "RBI Section 8: Backup, BCP & Disaster Recovery Management",
    "sebi_mapping": "SEBI CSCRF Chapter 5: Disaster Recovery & Air-Gapped Snapshots"
  }
];

export const CANONICAL_ATTACK_PATH = {
  "nodes": [
    {
      "id": "node-1",
      "label": "External Threat Actor / Internet",
      "type": "threat_actor",
      "risk_level": "High",
      "details": "Nation-state or financially motivated cybercrime syndicate scanning Indian banking IP ranges.",
      "mitigation": "Perimeter geo-filtering & DDoS mitigation"
    },
    {
      "id": "node-2",
      "label": "Internet Payment Server (103.21.144.12)",
      "type": "entry_point",
      "asset_id": "AST-001",
      "risk_level": "Critical",
      "eal": 7200000.0,
      "details": "Publicly exposed port 22 & 443 with unpatched XZ backdoor (CVE-2024-3094) and legacy password login.",
      "mitigation": "Apply emergency patch & mandate FIDO2 MFA"
    },
    {
      "id": "node-3",
      "label": "Remote Code Execution & Priv-Esc",
      "type": "vulnerability",
      "cve_id": "CVE-2024-3094",
      "risk_level": "Critical",
      "details": "Attacker leverages pre-auth backdoor to establish reverse interactive shell with root privileges.",
      "mitigation": "Behavioral EDR process termination & automated isolation"
    },
    {
      "id": "node-4",
      "label": "Lateral Movement via Internal Network",
      "type": "intermediate_pivot",
      "risk_level": "High",
      "details": "Attacker dumps payment cache tokens and pivots across unsegmented VLAN toward Core Database.",
      "mitigation": "Enforce Zero Trust micro-segmentation"
    },
    {
      "id": "node-5",
      "label": "Customer Core Database (172.16.20.45)",
      "type": "target_asset",
      "asset_id": "AST-002",
      "risk_level": "Critical",
      "eal": 4800000.0,
      "details": "Direct access to 1.2M unencrypted customer bank records and transaction ledger history.",
      "mitigation": "Database Activity Monitoring (DAM) & field-level tokenization"
    },
    {
      "id": "node-6",
      "label": "Financial Fraud & Exfiltration Loss",
      "type": "impact",
      "risk_level": "Critical",
      "eal": 40000000.0,
      "details": "Estimated enterprise impact of \u20b94.0 Cr to \u20b94.36 Cr across downtime, data breach liabilities, and RBI penalties.",
      "mitigation": "Comprehensive security control portfolio within \u20b925L budget"
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "label": "Initial Discovery & Probe",
      "technique": "T1595 Active Scanning"
    },
    {
      "id": "edge-2",
      "source": "node-2",
      "target": "node-3",
      "label": "Backdoor Exploit Execution",
      "technique": "T1190 Exploit Public-Facing App"
    },
    {
      "id": "edge-3",
      "source": "node-3",
      "target": "node-4",
      "label": "Credential Dump & Lateral Hop",
      "technique": "T1003 OS Credential Dumping"
    },
    {
      "id": "edge-4",
      "source": "node-4",
      "target": "node-5",
      "label": "Database Connection Pivot",
      "technique": "T1021 Remote Services"
    },
    {
      "id": "edge-5",
      "source": "node-5",
      "target": "node-6",
      "label": "KYC Exfiltration & Ransom Demand",
      "technique": "T1048 Exfiltration Over Alternative Protocol"
    }
  ],
  "critical_path": [
    "node-1",
    "node-2",
    "node-3",
    "node-4",
    "node-5",
    "node-6"
  ],
  "attack_summary": "Unpatched Internet Payment Server serves as prime ingress point, allowing threat actors to exploit CVE-2024-3094, pivot laterally across unsegmented subnets, and exfiltrate KYC databases resulting in severe regulatory penalties and business disruption."
};

export const CANONICAL_COMPLIANCE = [
  {
    "control_name": "Phishing-Resistant MFA & Privileged Access Control",
    "category": "Identity & Access Management",
    "iso27001": "Annex A.9.4.2 (Secure Log-on)",
    "nist_csf": "PR.AC-7 (Multi-factor Authentication)",
    "rbi_framework": "RBI Section 5 (Access Control & Two-Factor Authentication)",
    "sebi_cscrf": "SEBI CSCRF Ch. 2 (Identity & Privileged Access Governance)",
    "status": "Recommended (ROI: 3.00x)",
    "linked_control_id": "CTRL-002"
  },
  {
    "control_name": "Vulnerability Assessment & Rapid Patch Management",
    "category": "Threat & Vulnerability Management",
    "iso27001": "Annex A.12.6.1 (Technical Vulnerabilities)",
    "nist_csf": "PR.IP-12 (Vulnerability Management)",
    "rbi_framework": "RBI Annex 1, Sec 4 (Vulnerability Assessment & Remediation)",
    "sebi_cscrf": "SEBI CSCRF Ch. 3 (Vulnerability Remediation Timelines)",
    "status": "Recommended (ROI: 2.33x)",
    "linked_control_id": "CTRL-001"
  },
  {
    "control_name": "Zero Trust Micro-segmentation & Network Isolation",
    "category": "Network Security",
    "iso27001": "Annex A.13.1.3 (Network Segregation)",
    "nist_csf": "PR.AC-5 (Network Segmentation)",
    "rbi_framework": "RBI Section 3 (Network Architecture & Segmentation)",
    "sebi_cscrf": "SEBI CSCRF Ch. 2 (Zero Trust Network Segregation)",
    "status": "Recommended (ROI: 1.83x)",
    "linked_control_id": "CTRL-004"
  },
  {
    "control_name": "Database Activity Monitoring & Tokenization",
    "category": "Data Protection",
    "iso27001": "Annex A.10.1.1 (Cryptographic Controls)",
    "nist_csf": "PR.DS-1 (Data-at-Rest Protection)",
    "rbi_framework": "RBI Section 6 (Data Protection Standards)",
    "sebi_cscrf": "SEBI CSCRF Ch. 3 (Sensitive Financial Data Encryption)",
    "status": "Recommended (ROI: 2.00x)",
    "linked_control_id": "CTRL-006"
  },
  {
    "control_name": "Continuous SOC Log Monitoring & Threat Correlation",
    "category": "Security Monitoring",
    "iso27001": "Annex A.12.4.1 (Event Logging)",
    "nist_csf": "DE.AE-1 (Anomaly & Event Detection)",
    "rbi_framework": "RBI Section 9 (24x7 SOC Operations & Incident Handling)",
    "sebi_cscrf": "SEBI CSCRF Ch. 4 (Continuous Cyber Monitoring)",
    "status": "Recommended (ROI: 1.38x)",
    "linked_control_id": "CTRL-005"
  },
  {
    "control_name": "Immutable Air-Gapped Disaster Recovery Backups",
    "category": "Resilience & Recovery",
    "iso27001": "Annex A.12.3.1 (Information Backup)",
    "nist_csf": "RC.RP-1 (Recovery Plan Execution)",
    "rbi_framework": "RBI Section 8 (BCP & Disaster Recovery Management)",
    "sebi_cscrf": "SEBI CSCRF Ch. 5 (Disaster Recovery & Air-gapped Snapshots)",
    "status": "Recommended (ROI: 1.50x)",
    "linked_control_id": "CTRL-008"
  },
  {
    "control_name": "Next-Gen EDR & XDR Agent Upgrade",
    "category": "Endpoint Security",
    "iso27001": "Annex A.12.2.1 (Protection Against Malware)",
    "nist_csf": "DE.CM-4 (Malicious Code Detection)",
    "rbi_framework": "RBI Section 7 (Anti-malware & Endpoint Protection)",
    "sebi_cscrf": "SEBI CSCRF Ch. 4 (Endpoint Threat Detection & Response)",
    "status": "Recommended (ROI: 1.60x)",
    "linked_control_id": "CTRL-003"
  },
  {
    "control_name": "API Security Gateway with Web Application Firewall (WAF)",
    "category": "Application Security",
    "iso27001": "Annex A.14.1.2 (Securing Application Services)",
    "nist_csf": "PR.PT-4 (Network and Host Protection)",
    "rbi_framework": "RBI Section 4 (Web Application Security Controls)",
    "sebi_cscrf": "SEBI CSCRF Ch. 3 (WAF & Perimeter Application Defenses)",
    "status": "Recommended (ROI: 1.90x)",
    "linked_control_id": "CTRL-007"
  }
];

export const CANONICAL_EVENTS = [
  {
    "id": "EVT-1001",
    "timestamp": "2026-09-01T21:28:11Z",
    "source": "Vulnerability Scanner",
    "severity": "Critical",
    "description": "New Critical CVE-2024-3094 detected on Internet Payment Server (103.21.144.12)",
    "affected_asset": "Internet-facing Payment Server",
    "event_type": "vuln_scan_alert",
    "raw_payload": {
      "port": 22,
      "service": "OpenSSH 9.2p1",
      "exploit_available": true
    }
  },
  {
    "id": "EVT-1002",
    "timestamp": "2026-09-01T21:29:14Z",
    "source": "Threat Intel (CISA KEV)",
    "severity": "High",
    "description": "CVE-2024-3094 added to active CISA Known Exploited Vulnerabilities catalog",
    "affected_asset": "Internet-facing Payment Server",
    "event_type": "threat_intel_match",
    "raw_payload": {
      "kev_id": "KEV-2024-03",
      "in_the_wild_exploit": true
    }
  },
  {
    "id": "EVT-1003",
    "timestamp": "2026-09-01T21:30:02Z",
    "source": "SIEM / Auth Logs",
    "severity": "High",
    "description": "1,420 failed SSH login attempts detected from foreign IP block targeting admin account",
    "affected_asset": "Internet-facing Payment Server",
    "event_type": "brute_force_detected",
    "raw_payload": {
      "src_ip_range": "185.220.101.0/24",
      "auth_protocol": "SSH-Password"
    }
  },
  {
    "id": "EVT-1004",
    "timestamp": "2026-09-01T21:31:45Z",
    "source": "EDR Alert",
    "severity": "Medium",
    "description": "Suspicious PowerShell child process spawned by non-standard parent on Domain Controller",
    "affected_asset": "Internal Active Directory (Domain Controller)",
    "event_type": "process_anomaly",
    "raw_payload": {
      "process": "powershell.exe -enc ...",
      "mitre_technique": "T1059.001"
    }
  },
  {
    "id": "EVT-1005",
    "timestamp": "2026-09-01T21:33:10Z",
    "source": "IAM System",
    "severity": "High",
    "description": "Privileged credential usage detected outside regular business hours without MFA hardware token",
    "affected_asset": "Employee VPN Gateway",
    "event_type": "iam_anomaly",
    "raw_payload": {
      "user": "adm_svc_transfer",
      "mfa_method": "SMS_OTP"
    }
  },
  {
    "id": "EVT-1006",
    "timestamp": "2026-09-01T21:34:00Z",
    "source": "AI Risk Engine",
    "severity": "Critical",
    "description": "Continuous Risk Quantification updated: Payment Server EAL elevated to \u20b972.0 Lakhs (P1)",
    "affected_asset": "Internet-facing Payment Server",
    "event_type": "eal_recalculated",
    "raw_payload": {
      "previous_eal": 4500000.0,
      "new_eal": 7200000.0,
      "delta_percentage": "+60.0%"
    }
  }
];

export const CANONICAL_DASHBOARD = {
  enterprise_risk_score: 70,
  expected_annual_loss: 18400000.0,
  p90_loss: 59500000.0,
  var_95: 76400000.0,
  security_budget: 2500000.0,
  potential_risk_reduction: 5700000.0,
  residual_risk_target: 12700000.0,
  asset_count: 6,
  vulnerability_count: 10,
  active_controls_count: 3,
  pending_controls_count: 5,
  risk_trend_12m: [
    { month: 'Oct', risk_score: 58, eal: 13248000.0 },
    { month: 'Nov', risk_score: 61, eal: 13984000.0 },
    { month: 'Dec', risk_score: 64, eal: 14904000.0 },
    { month: 'Jan', risk_score: 63, eal: 14536000.0 },
    { month: 'Feb', risk_score: 67, eal: 16192000.0 },
    { month: 'Mar', risk_score: 69, eal: 16928000.0 },
    { month: 'Apr', risk_score: 70, eal: 17296000.0 },
    { month: 'May', risk_score: 71, eal: 17664000.0 },
    { month: 'Jun', risk_score: 68, eal: 16560000.0 },
    { month: 'Jul', risk_score: 70, eal: 17480000.0 },
    { month: 'Aug', risk_score: 70, eal: 18032000.0 },
    { month: 'Sep (Live)', risk_score: 70, eal: 18400000.0 }
  ],
  eal_by_asset: [
    { id: 'AST-001', name: 'Internet-facing Payment Server', short_name: 'Payment Server', eal: 7200000.0, risk_score: 91, criticality: 'Critical', incident_probability: 0.18 },
    { id: 'AST-002', name: 'Customer Core Database (PostgreSQL)', short_name: 'Customer DB', eal: 4800000.0, risk_score: 84, criticality: 'Critical', incident_probability: 0.11 },
    { id: 'AST-003', name: 'Internal Active Directory (Domain Controller)', short_name: 'Active Directory', eal: 3100000.0, risk_score: 78, criticality: 'High', incident_probability: 0.09 },
    { id: 'AST-004', name: 'Internet Banking API Gateway', short_name: 'API Gateway', eal: 2100000.0, risk_score: 71, criticality: 'High', incident_probability: 0.065 },
    { id: 'AST-005', name: 'Employee Workstations (End-User Devices)', short_name: 'Workstations', eal: 800000.0, risk_score: 58, criticality: 'High', incident_probability: 0.04 },
    { id: 'AST-006', name: 'Branch Office VPN Gateway', short_name: 'VPN Gateway', eal: 400000.0, risk_score: 38, criticality: 'Medium', incident_probability: 0.02 }
  ],
  top_risk_drivers: [
    { driver: 'Known Exploited Vulnerabilities (KEV)', weight: 95, affected_assets: 'Payment Server, API Gateway', severity: 'Critical' },
    { driver: 'Public Internet Exposure', weight: 92, affected_assets: 'Payment Server, VPN, API Gateway', severity: 'Critical' },
    { driver: 'Weak / Phishable MFA Posture', weight: 85, affected_assets: 'Payment Server, VPN Gateway', severity: 'High' },
    { driver: 'Core Financial Asset Criticality', weight: 95, affected_assets: 'Customer Database, Payment Server', severity: 'High' },
    { driver: 'Patch Gap & Delayed Remediation', weight: 80, affected_assets: 'Internal Active Directory, Payment Server', severity: 'Medium' }
  ],
  top_vulnerabilities: CANONICAL_VULNERABILITIES.slice(0, 5),
  recommended_portfolio_summary: {
    budget: 2500000.0,
    total_cost: 2500000.0,
    risk_reduction: 5700000.0,
    rosi: 2.28,
    active_controls: 3
  },
  data_classification: 'Synthetic Demo Data'
};
