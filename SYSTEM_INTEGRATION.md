# AJYAL System Integration Overview (Sandbox/Testnet)

## 🧭 Purpose

This document outlines how AJYAL integrates with other components of the Arabian Eagle Ecosystem.

## 🔗 Integrated Services

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| **BIGISH-YER** | Financial settlement and clearing | REST API (`/api/yer/transfer`) |
| **GAV** | Voucher verification and goods redemption | REST API (`/api/pos/verify-voucher`, `/api/pos/redeem-voucher`) |

## 🏗️ Architecture

```

[AJYAL] → [BIGISH-YER API] → [YER Ledger]
↓
[GAV API] → [Voucher Redemption]

```

## 🛡️ Security Notes

- All integrations are simulated in sandbox environment.
- No real Pi Network transactions are executed.
- No private keys or sensitive data are stored in the codebase.

---

## ⚠️ Important Disclaimer

> This document describes a **sandbox/testnet prototype**.  
> It does **NOT** claim official integration with any third-party platform.

---

**🦅 Developed by Arabian Eagle Technology Group (A.E.C.)**