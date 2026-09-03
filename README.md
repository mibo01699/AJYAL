# 🦅 AJYAL - منصة المعرفة اللامركزية وتمكين الشباب

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)

> **⚠️ Important:** This is a **sandbox/testnet-only prototype**.  
> It does **NOT** claim official certification or funding from any organization.

---

## 📖 نبذة عن المشروع

**AJYAL** (أجيال) هي منصة تعليمية وتمكينية لامركزية مفتوحة المصدر، تستهدف **الشباب، الأطفال، والنساء** في مناطق النزاع. تقدم المنصة:
- نظام تعليمي تفاعلي مع حوافز رقمية.
- إدارة أكواد المساعدات العينية (مخصصة لذوي الاحتياجات الخاصة).
- تكامل مع `BIGISH-YER` للتسوية المالية و `GAV` لتوزيع المساعدات.

---

## 🎯 الرؤية والأهداف

| الهدف | الوصف |
|-------|-------|
| **تمكين الشباب** | توفير مهارات رقمية ومعرفية عبر منصة تعليمية مفتوحة. |
| **الحوافز التعليمية** | مكافآت رقمية (YER/Pi) مقابل إنجاز المهام التعليمية. |
| **المساعدات العينية** | إدارة أكواد مساعدة مشفرة لذوي الاحتياجات الخاصة. |
| **التكامل المنظومي** | الربط مع `BIGISH-YER` و `GAV` لضمان تسليم المساعدات. |

---

## 🛠️ المكونات الأساسية

| الملف | الوصف |
|-------|-------|
| `server.js` | نقطة الدخول الرئيسية (متوافقة مع Vercel) |
| `AjyalGrantControlBoard.js` | نظام التحكم في المنح والمساعدات الجغرافية |
| `AjyalSupportSystem.js` | دعم متعدد اللغات ونظام استشارات ذكي |
| `YemenCurriculumIngestion.js` | دمج المنهاج اليمني مع نظام التتبع |
| `ajyal_rewards.py` | نظام المكافآت التعليمية (بايثون) |
| `voucher-system.js` | نظام إدارة أكواد المساعدات |

---

## 🔌 واجهات برمجة التطبيقات (APIs)

| المسار | الطريقة | الوصف |
|--------|---------|-------|
| `/api/health` | GET | التحقق من صحة الخادم |
| `/api/voucher/generate` | POST | إنشاء كود مساعدة جديد |
| `/api/voucher/verify` | POST | التحقق من صحة الكود |
| `/api/voucher/redeem` | POST | صرف الكود (استبدال سلع) |
| `/api/voucher/list/:beneficiaryId` | GET | قائمة أكواد المستفيد |
| `/api/voucher/stats` | GET | إحصائيات الأكواد |

---

## 🚀 التشغيل والنشر

### التشغيل المحلي

```bash
# استنساخ المستودع
git clone https://github.com/mibo01699/AJYAL.git
cd AJYAL

# تثبيت الاعتماديات
npm install

# تشغيل الخادم
npm start
```

النشر على Vercel

المشروع مهيأ للنشر الفوري على Vercel. قم بربط المستودع بحساب Vercel وسيتم النشر تلقائياً.

---

🧪 الاختبارات

```bash
npm test
```

---

🔗 التكامل مع المشاريع الأخرى

المشروع الوصف الرابط
BIGISH-YER البنية التحتية المالية الأساسية GitHub
GAV سلسلة التوريد والتجارة GitHub
Suppliers Auction منصة المزادات والمشتريات GitHub

---

📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT، مما يجعله متاحاً كمنفعة عامة رقمية (Digital Public Good).

---

📬 التواصل

· Official X: @Arabianeagleaec
· CEO X: @YemenPi
· GitHub: mibo01699

---

🦅 Developed by Arabian Eagle Technology Group (A.E.C.)
Building the Digital Future for Conflict-Affected Regions
