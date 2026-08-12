AJYAL - Decentralized Knowledge & Youth Empowerment Platform

An open-source Web3 capacity building and digital educational gateway designed to cultivate the knowledge economy among youth in fragile and conflict-affected regions, fully optimized for the Pi Network Layer 1 (Protocol 23) ecosystem.

---

🎯 Strategic Alignment & Mission

The AJYAL framework acts as the human capital engine for the integrated stabilization model established across our twin technical repositories:

1. BIGISH-YER (The Core Financial Rail): Where financial liquidity and micro-payroll infrastructure are managed.
2. GAV-The-Incense-Route (The Product Asset Rail): Where tracking logs for local independent agricultural producers are secured.

AJYAL directly trains, organizes, and incentivizes networks of young technical enumerators and operators on the ground to deploy and facilitate these specialized Web3 interfaces inside rural and disconnected Yemeni merchant markets.

---

AJYAL: Empowering Yemeni Youth Through Blockchain Literacy & Web3 Micro-Grants

AJYAL (Arabic for "Generations") is a digital public good framework designed to empower youth and children in conflict-affected areas like Yemen by introducing blockchain literacy, digital skills, and automated learning incentives powered by the Pi Network architecture.

---

💡 Mission & UNICEF Priority Alignment

The core objective of AJYAL is to combat youth unemployment and digital isolation. By leveraging an incentivized educational ecosystem, youth earn micro-rewards in Pi tokens upon achieving milestone competencies, bridging the gap between education and economic inclusion.

---

🛠️ Repository Logic & Architecture

· ajyal_rewards.py: A modular Python pipeline that simulates enrollment protocols, progress tracking, and secure micro-grant delivery to student wallets using Pi Network SDK hooks.
· Open Standard License: MIT Compliant digital framework.

---

🖥️ Run the Protocol Demonstration

To simulate the educational escrow and reward framework, execute:

```bash
python ajyal_rewards.py
```

---

📈 Socio-Economic Vision

This project functions as the human development pillar supporting the macroeconomic architectures outlined in Research Papers 11046 and 11129. It prepares the local workforce to manage the future decentralized infrastructure of Yemen.

---

🔒 Strict Technical Alignment (Pi Core Mandates)

· KYC Bound User Base: To assure strict compliance for international donor funding and eradicate fraud, access to the AJYAL peer-to-peer ecosystem is exclusively mapped via the Pi Authentication SDK. Every student and coach must be verified through the official Pi Biometric KYC system.
· Micro-Incentive Settlements: Learning achievements, micro-task verifications, and knowledge sharing fees are managed without cash or external tokens. The engine triggers localized service rewards using the hybrid YER/Pi settlement network operated by the BIGISH treasury backend.
· MIT Digital Public Good: Fully certified under the MIT License to run transparently as an accessible Digital Public Good (DPG) serving UN Sustainable Development Goal 4 (Quality Education) and Goal 8 (Decent Work & Economic Growth).

---

🧩 In-Kind Aid Voucher Management System

AJYAL includes an integrated system for managing encrypted in-kind aid vouchers, exclusively dedicated to people with special needs and congenital disabilities.

Key Features:

· Encrypted Voucher Generation: Unique codes for each beneficiary and each food basket.
· Validity Verification: Ensures vouchers are not expired or already redeemed.
· Goods Redemption: Vouchers can be exchanged for goods at point-of-sale (via GAV application).
· Integration with BIGISH-YER: Financial settlement of POS dues.

Core APIs:

· POST /api/voucher/generate – Issue a new voucher code.
· POST /api/voucher/verify – Verify voucher validity.
· POST /api/voucher/redeem – Redeem voucher (exchange for goods).
· GET /api/voucher/list/:piUserId – List all vouchers for a beneficiary.
· GET /api/voucher/stats – Voucher statistics and analytics.

Integration with Other Applications:

· GAV: Uses /api/voucher/verify and /api/voucher/redeem APIs for goods redemption.
· BIGISH-YER: Uses the clearing system (clearing-system.js) for payment settlement.

---

AJYAL - Sovereign Educational Governance & Multi-Grant Control Infrastructure

The decentralized knowledge economy engine and capacity-building gateway optimized for Pi Network Layer 1 (Protocol 23) and aligned with UNICEF Innovation Fund 2026 standards. This repository acts as the human development pillar supporting the macroeconomic architectures outlined in Research Papers 11046 and 11129.

---

🌍 Sovereign Grant Control Board (Geographical Targeting)

To comply with international humanitarian funding regulations, strict geographical ring-fencing constraints are natively hardcoded into the architectural core. The AjyalGrantControlBoard gives administrative authorities atomic control over financial disbursement vectors:

1. Targeted Disbursement: Micro-rewards (Pi) and In-kind Assistance Vouchers (YER) can be dynamically activated or restricted per country/jurisdiction based on active donor funding loops.
2. Fraud Mitigation: Prevent cross-border capital drainage by automatically dropping requests originating from non-funded geographic zones through integer-based ISO country registry checks.
3. Zero Floating-Point Constraint: All total grant volumes, remaining allocations, and reward milestones are managed under a strict BigInt Fixed-Point Arithmetic standard ($1 \text{ Pi} = 10^7 \text{ Stroops}$ and $1 \text{ YER} = 10^{10}$ subunits) to prevent banking rounding exploits.

---

🛠️ Directory Structure & Autonomous Core Files

· manifest.json: Defines the Pi Browser ecosystem integration configurations and enforces biometric Pi KYC authentication requirements for all coaches and students.
· AjyalGrantControlBoard.js: The administrative security filter managing active international grants and validating geographic eligibility for resource allocation.
· AjyalSupportSystem.js: Combines the absolute float-free notification channel, the autonomous AI pedagogical consultant, and the multi-language support network across 11 core global languages (Arabic, English, Chinese, Thai, Tagalog, Malay, Turkish, Korean, Russian, Hindi, Urdu).
· YemenCurriculumIngestion.js: Implements the Phase 1 ingestion matrix of the Yemeni National Curriculum, mapping progress tracking nodes to strict integer wallet rewards.
· ajyal-server-router.js: Exposes secure REST endpoints for administrative, educational, and multi-modal sensory operations.
· ajyal-compliance-test.js: Local unit test pipeline validating integer processing limits and geographical safety blocks.

---

📂 Repository Structure Overview

```
AJYAL/
├── ajyal_rewards.py                # Core reward pipeline (Python)
├── AjyalGrantControlBoard.js       # Grant control and geographical filtering
├── AjyalSupportSystem.js           # AI support and multilingual engine
├── YemenCurriculumIngestion.js     # Curriculum mapping and progress tracking
├── ajyal-server-router.js          # Backend API router for Replit deployment
├── ajyal-compliance-test.js        # Unit tests for compliance validation
├── manifest.json                   # Pi Browser configuration
├── docs/
│   ├── WHITEPAPER.md               # Comprehensive protocol documentation
│   └── BUSINESS_PLAN.md            # Monetization and sustainability plan
└── README.md                       # Main entry point
```

---

🔗 Related Repositories

· BIGISH-YER: Financial Infrastructure → github.com/mibo01699/BIGISH-YER
· GAV-The-Incense-Route: Supply Chain & Trade → github.com/mibo01699/GAV-The-Incense-Route
· Suppliers Auction: Decentralized Bidding Protocol → github.com/mibo01699/suppliers-auction

---

🚀 Deployment on Replit

This project is designed to be easily deployed and run on Replit (https://replit.com). Follow these steps:

How to Deploy

1. Create a new Repl:
   · Log in to your Replit account.
   · Click on the "Create Repl" button.
   · Choose "Import from GitHub".
   · Paste the URL of this repository: https://github.com/mibo01699/AJYAL.
   · Click "Import".
2. Run the application:
   · After the import completes, Replit will automatically detect the configuration.
   · Click the "Run" button at the top.
3. Access the application:
   · Once the server starts, Replit will provide a webview or a URL to access the application.
   · The backend API will be available at the provided URL (e.g., https://ajyal.YOUR_USERNAME.repl.co).

---

📄 License

All AJYAL projects are released under the MIT License, ensuring they remain freely available as Digital Public Goods (DPGs) for the global community.

---

📬 Contact

· Official X: @Arabianeagleaec
· CEO X: @YemenPi
· GitHub: mibo01699

---

© 2026 Arabian Eagle Corporation (A.E.C.) – Building the Digital Future for Conflict-Affected Regions