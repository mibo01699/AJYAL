// ============================================================
// الملف: server.js
// المسار: AJYAL/server.js
// الدور: الخادم الرئيسي لتطبيق AJYAL التعليمي (نسخة موحدة)
// ============================================================

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { authenticatePiUser, enrollStudent, updateProgress } = require('./ajyal-core');

const app = express();
const PORT = process.env.PORT || 3001; // استخدام منفذ واحد فقط

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================
// واجهات API التعليمية
// ============================================================

/**
 * API: تسجيل الدخول عبر Pi Auth SDK
 * POST /api/auth/pi
 */
app.post('/api/auth/pi', async (req, res) => {
    try {
        const { piUserId } = req.body;
        if (!piUserId) {
            return res.status(400).json({ error: 'Pi User ID مطلوب' });
        }

        const user = await authenticatePiUser(piUserId);
        if (!user) {
            return res.status(401).json({ error: 'المستخدم غير مصرح به' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                role: user.role || 'student'
            }
        });
    } catch (error) {
        console.error('خطأ في مصادقة Pi:', error);
        res.status(500).json({ error: 'فشل في المصادقة' });
    }
});

/**
 * API: الحصول على قائمة الدورات
 * GET /api/courses
 */
app.get('/api/courses', (req, res) => {
    const courses = [
        { id: 1, title: 'مقدمة في البلوكشين', level: 'مبتدئ' },
        { id: 2, title: 'برمجة العقود الذكية', level: 'متقدم' },
        { id: 3, title: 'الاقتصاد الرقمي', level: 'متوسط' }
    ];
    res.json({ success: true, courses });
});

/**
 * API: التسجيل في دورة
 * POST /api/enroll
 */
app.post('/api/enroll', async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({ error: 'بيانات غير مكتملة' });
        }

        // استدعاء الدالة المستوردة من ajyal-core.js
        const enrollment = await enrollStudent(userId, courseId);
        res.json({
            success: true,
            message: 'تم التسجيل بنجاح',
            enrollment
        });
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        res.status(500).json({ error: 'فشل في التسجيل' });
    }
});

// ============================================================
// واجهات API لإدارة المساعدات (AID)
// ============================================================

/**
 * API: توليد كود مساعدة مشفر
 * POST /api/generate-aid-token
 */
app.post('/api/generate-aid-token', (req, res) => {
    const { familyKycId } = req.body;
    if (!familyKycId) {
        return res.status(400).json({ status: "ERROR", message: "Missing KYC Identity Data" });
    }

    const token = crypto
        .createHash('sha256')
        .update(familyKycId + Date.now().toString())
        .digest('hex')
        .substring(0, 12)
        .toUpperCase();

    res.json({ 
        status: "SUCCESS", 
        aidCode: `GAV-AID-${token}` 
    });
});

// ============================================================
// تشغيل الخادم (مرة واحدة فقط)
// ============================================================
app.listen(PORT, () => {
    console.log(`🚀 خادم AJYAL يعمل على المنفذ ${PORT}`);
    console.log(`📚 منصة التعليم اللامركزي جاهزة للاختبار`);
});