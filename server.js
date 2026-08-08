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


// ============================================================
// إضافات إلى server.js (واجهات برمجة التطبيقات لنظام ذوي الاحتياجات الخاصة)
// ============================================================

const {
    authenticatePiUser,
    enrollStudent,
    updateProgress,
    registerSpecialNeedsUser,
    verifySpecialNeedsDocument,
    getSpecialNeedsList,
    getSpecialNeedsRecordByPiId
} = require('./ajyal-core');

// ... (الكود الموجود سابقاً) ...

// ============================================================
// واجهات برمجة التطبيقات (APIs) الجديدة
// ============================================================

/**
 * API: تسجيل مستفيد جديد (ذوي احتياجات خاصة)
 * POST /api/special-needs/register
 * Body: { "piUserId": "GABC...", "fullName": "...", "disabilityType": "...", ... }
 */
app.post('/api/special-needs/register', (req, res) => {
    try {
        const { piUserId, ...data } = req.body;
        if (!piUserId) {
            return res.status(400).json({ error: 'معرف Pi مطلوب' });
        }
        const record = registerSpecialNeedsUser(piUserId, data);
        res.status(201).json({ success: true, record });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * API: التحقق من وثائق مستفيد
 * POST /api/special-needs/verify
 * Body: { "recordId": "sn_...", "docHash": "...", "gpsData": { "lat": 12.3, "lng": 44.5 } }
 */
app.post('/api/special-needs/verify', (req, res) => {
    try {
        const { recordId, docHash, gpsData, notes } = req.body;
        if (!recordId || !docHash || !gpsData) {
            return res.status(400).json({ error: 'بيانات التحقق غير مكتملة' });
        }
        const result = verifySpecialNeedsDocument(recordId, { docHash, gpsData, notes });
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * API: الحصول على قائمة المستفيدين
 * GET /api/special-needs/list?status=verified
 */
app.get('/api/special-needs/list', (req, res) => {
    try {
        const status = req.query.status || 'all';
        const list = getSpecialNeedsList(status);
        res.json({ success: true, list });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * API: الحصول على سجل مستفيد بواسطة معرف Pi
 * GET /api/special-needs/record/:piUserId
 */
app.get('/api/special-needs/record/:piUserId', (req, res) => {
    try {
        const { piUserId } = req.params;
        const record = getSpecialNeedsRecordByPiId(piUserId);
        res.json({ success: true, record });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
});