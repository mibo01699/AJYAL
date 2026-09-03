// ============================================================
// الملف: server.js - بوابة AJYAL (متوافقة مع Vercel)
// الدور: التعليم، المساعدات، الحوافز، ذوي الاحتياجات الخاصة
// ============================================================

const express = require('express');
const cors = require('cors');
const app = express();

// التفعيلات الأساسية
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// نقاط النهاية الأساسية (APIs)
// ============================================================

// نقطة الصحة (Health Check)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'AJYAL',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// نظام إدارة أكواد المساعدات (محاكاة)
// ============================================================

// تخزين مؤقت للأكواد (في الذاكرة)
const vouchers = new Map();

// إنشاء كود مساعدة جديد
app.post('/api/voucher/generate', (req, res) => {
    const { beneficiaryId, amount, type } = req.body;
    if (!beneficiaryId || !amount) {
        return res.status(400).json({ error: 'بيانات غير مكتملة' });
    }

    const code = 'VCH-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    vouchers.set(code, {
        code,
        beneficiaryId,
        amount: BigInt(amount).toString(),
        type: type || 'food_basket',
        status: 'active',
        createdAt: new Date().toISOString()
    });

    res.json({
        success: true,
        code,
        message: 'تم إنشاء كود المساعدة بنجاح'
    });
});

// التحقق من صحة الكود
app.post('/api/voucher/verify', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'الكود مطلوب' });
    }

    const voucher = vouchers.get(code);
    if (!voucher) {
        return res.status(404).json({ error: 'الكود غير موجود' });
    }

    if (voucher.status !== 'active') {
        return res.status(400).json({ error: 'الكود غير صالح أو تم استخدامه' });
    }

    res.json({
        success: true,
        voucher: {
            code: voucher.code,
            amount: voucher.amount,
            type: voucher.type,
            beneficiaryId: voucher.beneficiaryId
        },
        message: 'الكود صالح للصرف'
    });
});

// صرف الكود
app.post('/api/voucher/redeem', (req, res) => {
    const { code, posId } = req.body;
    if (!code || !posId) {
        return res.status(400).json({ error: 'الكود ومعرف نقطة البيع مطلوبان' });
    }

    const voucher = vouchers.get(code);
    if (!voucher) {
        return res.status(404).json({ error: 'الكود غير موجود' });
    }

    if (voucher.status !== 'active') {
        return res.status(400).json({ error: 'الكود غير صالح أو تم استخدامه' });
    }

    // تحديث حالة الكود
    voucher.status = 'redeemed';
    voucher.redeemedAt = new Date().toISOString();
    voucher.posId = posId;
    vouchers.set(code, voucher);

    res.json({
        success: true,
        message: 'تم صرف الكود بنجاح',
        voucher: {
            code: voucher.code,
            amount: voucher.amount,
            type: voucher.type,
            redeemedAt: voucher.redeemedAt
        }
    });
});

// قائمة الأكواد لمستفيد معين
app.get('/api/voucher/list/:beneficiaryId', (req, res) => {
    const { beneficiaryId } = req.params;
    const userVouchers = [];
    for (const [code, data] of vouchers) {
        if (data.beneficiaryId === beneficiaryId) {
            userVouchers.push({ code, ...data });
        }
    }
    res.json({ success: true, vouchers: userVouchers });
});

// إحصائيات الأكواد
app.get('/api/voucher/stats', (req, res) => {
    let total = 0,
        active = 0,
        redeemed = 0;
    for (const [_, data] of vouchers) {
        total++;
        if (data.status === 'active') active++;
        else if (data.status === 'redeemed') redeemed++;
    }
    res.json({
        success: true,
        stats: {
            total,
            active,
            redeemed,
            timestamp: new Date().toISOString()
        }
    });
});

// ============================================================
// المسار الرئيسي
// ============================================================
app.get('/', (req, res) => {
    res.json({
        message: '🦅 AJYAL API is running',
        version: '1.0.0',
        endpoints: [
            '/api/health',
            '/api/voucher/generate',
            '/api/voucher/verify',
            '/api/voucher/redeem',
            '/api/voucher/list/:beneficiaryId',
            '/api/voucher/stats'
        ]
    });
});

// ============================================================
// ✅ نقطة الدخول لـ Vercel (تصدير التطبيق)
// ============================================================
module.exports = app;