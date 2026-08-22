# 📄 AJYAL Protocol: Decentralized Knowledge Economy & Sovereign Educational Infrastructure
**Optimized for Pi Network Layer 1 (Protocol 23) & Aligned with UN Sustainable Development Goals (SDG 4 & 8)**

---

## 1. Executive Summary & Socio-Economic Vision
In fragile, conflict-affected, and economically isolated regions like Yemen, traditional educational delivery and humanitarian deployment structures suffer from systemic vulnerability, capital flight, and lack of verified student incentive mechanisms.

**AJYAL** (Arabic for "Generations") functions as a decentralized Digital Public Good (DPG) designed to bypass compromised physical infrastructure. By utilizing the ultra-low barrier to entry of the **Pi Network**, AJYAL establishes a secure, transparent, and immutable gateway for digital literacy, capability-building, and localized micro-grants. The platform translates educational completion milestones directly into micro-economic liquidity, effectively fueling the human capital engine needed to operationalize the macroeconomic frameworks outlined in **Research Papers 11046 and 11129**.

---

## 2. Core Architectural Pillars
AJYAL does not operate in isolation; it functions as the human integration layer across a tripartite open-source Web3 ecosystem:

1. **AJYAL (The Human Capital Engine):** Tracks student identity, automates pedagogical progress, issues unforgeable academic credentials, and releases localized micro-grant escrow tokens.
2. **BIGISH-YER (The Core Financial Rail):** Acts as the central clearing-house and treasury system handling zero float-point multi-currency conversions and localized cross-border ledger settlements.
3. **GAV - The Incense Route (The Product Asset Rail):** Manages end-to-end cryptographic physical asset distribution logs, validating in-kind voucher redemptions at local supply terminals.

---

## 3. Strict Technical Alignment & Engineering Guardrails

To operate legally and safely within donor-funded humanitarian landscapes and ensure flawless deployment on Replit or self-hosted sovereign clusters, AJYAL embeds three core engineering innovations natively into its logic layer:

### A. Zero Floating-Point Constraint (Mathematical Precision)
To eliminate rounding exploits, arbitrary loss, and structural economic leakage across volatile currency conversions (YER / Pi), all financial tracking, milestone payouts, and voucher volumes are hardcoded via JavaScript **BigInt Fixed-Point Arithmetic**.
* $1 \text{ Pi Token} = 10^7 \text{ Stroops}$
* $1 \text{ YER Subunit} = 10^{10}$

### B. Geographical Ring-Fencing & Fraud Mitigation
The framework prevents illegal cross-border resource drainage through the `AjyalGrantControlBoard.js` mechanism. Every incoming execution request must bundle verified location payloads mapped against strict international integers (e.g., ISO 3166-1 numeric code `887` for the Republic of Yemen). If an entity requests donor-funded incentives from unmapped zones, the atomic router immediately drops the execution vector.

### C. Biometric KYC Authentication Mapping
To secure compliance for international development grants (e.g., UNICEF Innovation Fund 2026 guidelines) and eradicate synthetic user sybil attacks, user records are exclusively authenticated using the official **Pi Authentication SDK**. Every tutor, evaluator, and student profile must lock their asymmetric identity to a biometric Pi KYC status before the ledger activates their learning escrow channels.

---

## 4. Subsystem Specifications & File Routing

The repository is modularized to distribute operational burdens across dedicated execution loops:

* **`LmsCoreEngine.js`:** The learning management engine overseeing dynamic creation of custom localized syllabi, managing lesson completion checks, and notifying the reward layer upon graduation.
* **`SovereignScholarshipHub.js`:** The independent verification bridge that calculates a unique cryptographic hash (`SHA-256`) of a student's graduation payload, anchoring it immutably to the underlying blockchain layer to create a permanent verifiable credential.
* **`ajyal-server-router.js`:** The centralized Node.js/Express API layer exposing atomic endpoints for modern mobile sandboxes (e.g., Pi Browser ecosystem), preventing access to unauthenticated or non-geofenced traffic.
* **`ajyal_rewards.py`:** A secondary backend pipeline providing historical micro-grant delivery simulations and testing telemetry data hooks.
* **`voucher-system.js`:** Encrypts in-kind aid vouchers exclusively earmarked for individuals with special needs and congenital disabilities, bridging online milestones to localized merchant baskets via the GAV supply chain API.

---

## 5. Tokenomics & The Learn-to-Earn (L2E) Cycle
1. **Enrollment & Identity Lock:** The student signs in via the Pi Browser, providing their authenticated, geofenced profile signature.
2. **Milestone Tracking:** As lessons are completed, progress bars scale mathematically from 0% to 100%.
3. **Escrow Liquidation:** Upon satisfying full course evaluation conditions, the system fires an internal webhook to the `BIGISH-YER` settlement platform.
4. **Economic Utility / Local Redemption:** The student receives their immutable Stroops balance or an encrypted in-kind assistance voucher. These vouchers are presented seamlessly at localized registered point-of-sale terminals to collect physical aid baskets, injecting real-time purchasing power into disconnected local merchant networks.

---

## 6. Compliance, Security, & Testing
The system includes comprehensive compliance testing scripts (`ajyal-compliance-test.js`) to rigorously validate its mathematical and spatial defenses before network mainnet orchestration. Developers and auditors can invoke the compliance cycle instantly on Replit:

```bash
node ajyal-compliance-test.js
```
All components are engineered under the **MIT License**, ensuring complete structural alignment as a digital public good built to revitalize post-conflict generations through decentralized literacy and sovereign financial sovereignty.
