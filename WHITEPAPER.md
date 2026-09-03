# AJYAL Protocol: Decentralized Knowledge Economy

**Version:** 1.0.0 (Sandbox/Testnet)

---

## 1. Executive Summary

AJYAL (Arabic for "Generations") is an open-source, decentralized educational platform designed to empower youth and children in conflict-affected regions. It leverages blockchain technology to provide secure, immutable, and incentive-driven learning experiences.

> **Disclaimer:** This project is a **prototype** and operates **only** in a sandbox/testnet environment.  
> It does **NOT** claim any official partnership, certification, or funding from UNICEF, Mercy Corps, or the Pi Network Core Team.

---

## 2. Core Architectural Pillars

AJYAL integrates with two other core platforms:

| Component | Role |
|-----------|------|
| **AJYAL (Human Capital Engine)** | Tracks student identity, automates pedagogical progress, issues credentials, and releases micro-grants. |
| **BIGISH-YER (Financial Rail)** | Central clearing-house handling zero-float multi-currency conversions and ledger settlements. |
| **GAV (Asset Rail)** | Manages cryptographic physical asset distribution and in-kind voucher redemptions. |

---

## 3. Technical Innovations

### A. Zero Floating-Point Constraint

All financial calculations use **JavaScript BigInt Fixed-Point Arithmetic**:
- 1 Pi = 10^7 Stroops
- 1 YER = 10^10 Sub-units

### B. Geographical Ring-Fencing

`AjyalGrantControlBoard.js` enforces strict geographical targeting to prevent cross-border resource drainage.

### C. KYC Authentication

Student identity is verified using the official Pi Authentication SDK for sandbox testing.

---

## 4. Subsystem Specifications

| File | Description |
|------|-------------|
| `LmsCoreEngine.js` | Learning management engine |
| `SovereignScholarshipHub.js` | Credential verification |
| `voucher-system.js` | Aid voucher management |
| `AjyalSupportSystem.js` | Multilingual AI support |

---

## 5. The Learn-to-Earn (L2E) Cycle

1. **Enrollment:** Student signs in via Pi Browser.
2. **Milestone Tracking:** Progress is recorded.
3. **Escrow Liquidation:** Upon completion, a webhook triggers settlement.
4. **Economic Utility:** Student receives micro-grants or vouchers redeemable at local POS terminals.

---

## 6. Compliance & Testing

```bash
node ajyal-compliance-test.js
```

All components are engineered under the MIT License.

---

🦅 Developed by Arabian Eagle Technology Group (A.E.C.)