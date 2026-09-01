# AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform

> **Smart India Hackathon (SIH 2026) · Internal Final Prototype**  
> **Problem Statement ID:** PS 26105  
> **Theme:** Blockchain & Cybersecurity  
> **Category:** Software  
> **Team Name:** Tech Crafters  
> **Institution:** IIT Madras BS Degree Programme  

---

## 🎯 Executive Summary & Core Value Proposition

Traditional cybersecurity dashboards tell the CISO and Board:
> **"Your risk is HIGH, and you have 420 vulnerabilities."**

This is unhelpful for business decision-makers who need to know:
1. **"How much money could this cyber risk cost the organization in Indian Rupees (₹)?"**
2. **"If we have a ₹25 Lakhs security budget, exactly which controls should we buy to eliminate the maximum amount of financial risk?"**

**Cyber-Quant** continuously ingests security telemetry (SIEM, EDR, Vulnerability Scanners, Threat Intelligence), translates technical indicators into an explainable **Expected Annual Loss (EAL)**, runs **Monte Carlo simulations** to quantify tail risk (P90 and VaR), and solves a **0/1 Knapsack optimization problem** to recommend the mathematically optimal security investment portfolio with provable **Return on Security Investment (ROSI)**.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY TELEMETRY SOURCES                            │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ Vulnerability Scanner │  │ SIEM / Network Logs  │  │ Endpoint EDR / XDR   │  │
│  │  (CVSS 10.0, EPSS)    │  │ (Failed Logins / SSH)│  │ (Process Anomalies)  │  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘  │
│              │                         │                         │              │
│  ┌───────────┴───────────┐  ┌──────────┴───────────┐  ┌──────────┴───────────┐  │
│  │ IAM / Auth Telemetry  │  │ Threat Intel (KEV)   │  │ Cloud / Asset CMDB   │  │
│  │  (Weak MFA / SMS OTP) │  │ (In-the-Wild Exploits│  │  (Asset Criticality) │  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘  │
└──────────────┼─────────────────────────┼─────────────────────────┼──────────────┘
               ▼                         ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      INGESTION & NORMALIZATION PIPELINE                         │
│   • OCSF / ECS Canonical Data Schema      • Entity Resolution (Asset IP/Hostname)│
│   • Threat Correlation & Deduplication    • Continuous Live Event Stream         │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    FAIR-INSPIRED QUANTITATIVE RISK ENGINE                       │
│                                                                                 │
│   Incident Likelihood = Base Prob × Exposure × Vulnerability × Control × Crit  │
│   Financial Impact    = Downtime + Data Breach + Regulatory + Recovery + Churn  │
│   Expected Loss (EAL) = Incident Likelihood × Total Financial Impact (in ₹)     │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                 SIMULATION & KNAPSACK OPTIMIZATION ENGINE                       │
│                                                                                 │
│   • Monte Carlo Simulator (10,000 Vectorized NumPy stochastic trials)            │
│     → Computes Mean, Median, P90 Loss, P95 Loss, and Value at Risk (VaR 95%)    │
│                                                                                 │
│   • 0/1 Knapsack Optimizer (Dynamic Programming)                                │
│     → Maximize ∑ RiskReduction_i  subject to ∑ Cost_i ≤ Security Budget         │
│     → Calculates Portfolio ROSI = (Total Risk Reduction) / (Total Cost)         │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       MODERN CISO SOC EXECUTIVE INTERFACE                       │
│  Executive Dashboard │ Asset Inventory │ Threats & CVEs │ Monte Carlo │         │
│  Knapsack Optimizer  │ What-If Sandbox │ Attack Path    │ Regulatory Compliance │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Mathematical Formulation & Explainability

### 1. Incident Probability Formula
$$P(\text{Incident}) = P_{\text{base}} \times F_{\text{exposure}} \times F_{\text{vulnerability}} \times F_{\text{control\_weakness}} \times F_{\text{criticality}}$$

*Example (Primary Payment Server Scenario):*
- $P_{\text{base}} = 0.04$ (4% base frequency)
- $F_{\text{exposure}} = 1.8$ (Direct public internet exposure)
- $F_{\text{vulnerability}} = 2.0$ (Critical CVSS 10.0 + Active CISA KEV exploitation)
- $F_{\text{control\_weakness}} = 1.25$ (Weak single-factor/SMS MFA)
- $F_{\text{criticality}} = 1.0$ (Tier-1 retail payment processing)
$$\mathbf{P(\text{Incident}) = 0.04 \times 1.8 \times 2.0 \times 1.25 \times 1.0 = 18.0\% / \text{year}}$$

### 2. Financial Loss Impact Formulation
$$\text{Total Impact} = \text{Downtime} + \text{Data Breach} + \text{Regulatory Penalties} + \text{Forensic Recovery} + \text{Business Disruption}$$
- Downtime: $₹1.20\text{ Cr}$
- Customer Data Breach (1.2M records): $₹1.60\text{ Cr}$
- RBI Regulatory Penalties & Fines: $₹0.60\text{ Cr}$
- Incident Forensics & System Recovery: $₹0.40\text{ Cr}$
- Brand Disruption & Customer Churn: $₹0.20\text{ Cr}$
$$\mathbf{\text{Total Financial Impact} = ₹4.00\text{ Crores}}$$

### 3. Expected Annual Loss (EAL)
$$\mathbf{\text{EAL} = 18.0\% \times ₹4.00\text{ Cr} = ₹72.0\text{ Lakhs / year}}$$

### 4. 0/1 Knapsack Budget Optimization
Given a security budget $B = ₹25,00,000$ and $N$ available security controls with costs $c_i$ and financial risk reductions $r_i$:
$$\max \sum_{i=1}^N r_i x_i \quad \text{subject to} \quad \sum_{i=1}^N c_i x_i \le B, \quad x_i \in \{0, 1\}$$

$$\mathbf{\text{ROSI (Return on Security Investment)}} = \frac{\sum r_i x_i}{\sum c_i x_i}$$

---

## 🎬 3-to-5 Minute Judge Demonstration Script

Follow this exact walkthrough during the hackathon evaluation:

| Step | Action | What to Tell the Judges | Key Screen Feature |
|---|---|---|---|
| **Step 1** | Open **Executive Dashboard** | *"Traditional dashboards show qualitative labels like 'High Risk'. Our platform calculates that FinTrust Bank faces **₹1.84 Cr Expected Annual Loss (EAL)** and a **₹4.20 Cr P90 tail risk**."* | Top 6 KPI Cards & 12M Financial Trend |
| **Step 2** | Navigate to **Asset Risk Inventory** & click **Payment Server** | *"Let's inspect our primary internet-facing Payment Server. Notice the explainable formula: KEV CVE-2024-3094 + Internet Exposure + Weak MFA leads to **18% Incident Probability** and **₹72L EAL**."* | Explainable Step-by-Step Math Drawer |
| **Step 3** | Navigate to **Attack Path Graph** | *"The visual kill chain maps adversary progression: from Internet reconnaissance $\to$ Payment Server RCE $\to$ unsegmented lateral pivot $\to$ Customer Core Database exfiltration."* | Interactive Multi-Stage Attack Nodes |
| **Step 4** | Navigate to **Monte Carlo Simulation** & click **"Run Simulation"** | *"We run 10,000 stochastic trials across log-normal impact distributions. The histogram proves that 90% of worst-case annual losses exceed **₹4.20 Cr** (Value at Risk at 95% is **₹3.60 Cr**)."* | 10K Simulation Histogram & Scenario Realizations |
| **Step 5** | Navigate to **Investment Optimizer** | *"The CISO has a **₹25 Lakh budget**. The 0/1 Knapsack optimizer selects the optimal control mix (Patching + FIDO2 MFA + Backups), achieving **₹59L in Risk Reduction** with a **2.36x ROSI**."* | Dynamic Budget Slider & Selected Knapsack Controls |
| **Step 6** | Navigate to **What-If Simulator** | *"Toggle 'Patch Critical KEV Vulnerabilities' and 'Deploy MFA'. The Before vs After panel immediately shows Risk Score dropping from **72 to 43** and EAL dropping from **₹1.84 Cr to ₹1.31 Cr**."* | Before vs After Dual Panel & ROSI Multiplier |
| **Step 7** | Click **"Simulate Security Event"** in top header | *"Watch what happens when a new telemetry alert arrives. The risk engine immediately recalculates enterprise EAL and posts an audit record in the Live Telemetry Stream."* | Dynamic Header Toast & Live Event Ingestion |
| **Step 8** | Navigate to **Regulatory Frameworks** | *"Every security control is mapped directly to **RBI Cyber Security Guidelines**, **SEBI CSCRF 2024**, **ISO 27001**, and **NIST CSF 2.0** for instant audit readiness."* | Regulatory Cross-Mapping Matrix |

---

## 🚀 Quick Local Startup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Option 1: 1-Click Launch (Windows)
Double click `run_all.bat` or execute in PowerShell:
```powershell
.\run_all.bat
```

### Option 2: Manual Terminal Execution

#### Terminal 1 — Backend (FastAPI):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend API will be live at: **http://127.0.0.1:8000**  
Interactive API Docs (Swagger UI): **http://127.0.0.1:8000/docs**

#### Terminal 2 — Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Application will be live at: **http://localhost:5173**

---

## 🐳 Docker Compose Deployment

To build and run the entire platform in isolated containers:
```bash
docker compose up --build
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 🔌 Complete REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Executive CISO KPI cards, risk trend, EAL distribution, top risk drivers |
| `GET` | `/api/assets` | Full enterprise asset inventory with quantified EAL and risk scores |
| `GET` | `/api/assets/{id}` | Detailed asset profile with step-by-step mathematical calculation |
| `GET` | `/api/vulnerabilities`| Synthetic CVE catalog with CVSS, KEV flags, and risk driver weights |
| `GET` | `/api/controls` | Available security controls with costs, risk reductions, and ROSI |
| `POST` | `/api/simulate` | Executes 10,000-run NumPy Monte Carlo loss simulation |
| `POST` | `/api/optimize` | Solves 0/1 Knapsack optimization for any user-specified budget |
| `POST` | `/api/what-if` | Multi-control Before vs After sandbox evaluation |
| `GET` | `/api/attack-path` | Interactive attack graph nodes and MITRE ATT&CK techniques |
| `GET` | `/api/compliance` | Regulatory mapping matrix (ISO 27001, NIST CSF, RBI, SEBI CSCRF) |
| `GET` | `/api/events` | Continuous telemetry event log |
| `POST` | `/api/events/simulate` | Ingests new telemetry event and triggers dynamic live risk recalculation |
| `POST` | `/api/reset` | Resets platform state to initial FinTrust Bank baseline |

---

## 🛡️ Demo Safety & Synthetic Data Disclaimer

- All banking data, network topologies, and financial figures are **Synthetic Demo Data** created specifically for the Smart India Hackathon prototype demonstration.
- The risk calculations and optimization algorithms demonstrate prototype architecture and quantitative cybersecurity concepts.
