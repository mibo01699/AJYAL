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

// ============================================================
// إضافات إلى server.js (واجهات برمجة التطبيقات لإدارة الأكواد)
// ============================================================

const {
    generateVoucher,
    verifyVoucher,
    redeemVoucher,
    getVouchersForBeneficiary,
    getVoucherStats
} = require('./voucher-system');

// ... (الكود الموجود سابقاً) ...

// ============================================================
// واجهات برمجة التطبيقات (APIs) للأكواد
// ============================================================

/**
 * API: توليد كود جديد لمستفيد من ذوي الاحتياجات الخاصة
 * POST /api/voucher/generate
 * Body: { "piUserId": "GABC...", "items": [{"name": "أرز", "quantity": 5}], "value": 25 }
 */
app.post('/api/voucher/generate', (req, res) => {
    try {
        const { piUserId, items, value, expiryDays } = req.body;

        if (!piUserId || !items || !value) {
            return res.status(400).json({ error: 'بيانات غير مكتملة' });
        }

        // 1. التأكد من أن المستخدم مسجل في نظام ذوي الاحتياجات الخاصة
        const { getSpecialNeedsRecordByPiId } = require('./ajyal-core');
        const record = getSpecialNeedsRecordByPiId(piUserId);

        if (!record || record.status !== 'verified') {
            return res.status(403).json({
                error: 'المستخدم غير مؤهل. يجب أن يكون مسجلاً وموثقاً في نظام ذوي الاحتياجات الخاصة'
            });
        }

        // 2. توليد الكود
        const voucher = generateVoucher(
            piUserId,
            record.fullName || 'مستفيد',
            items,
            value,
            expiryDays || 30
        );

        // 3. إرسال إشعار للمستفيد (يمكن تنفيذه لاحقاً)
        console.log(`📨 تم إصدار كود جديد للمستفيد ${record.fullName}: ${voucher.code}`);

        res.status(201).json({
            success: true,
            message: 'تم توليد الكود بنجاح',
            voucher: {
                code: voucher.code,
                items: voucher.items,
                value: voucher.value,
                expiryDate: voucher.expiryDate
            }
        });

    } catch (error) {
        console.error('خطأ في توليد الكود:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * API: التحقق من صحة كود (لنقاط البيع)
 * POST /api/voucher/verify
 * Body: { "code": "ABCD1234...", "redeemerPiId": "GABC..." }
 */
app.post('/api/voucher/verify', (req, res) => {
    try {
        const { code, redeemerPiId } = req.body;
        if (!code || !redeemerPiId) {
            return res.status(400).json({ error: 'الكود ومعرف نقطة البيع مطلوبان' });
        }

        const result = verifyVoucher(code, redeemerPiId);
        if (!result.valid) {
            return res.status(400).json({ success: false, message: result.message });
        }

        res.json({
            success: true,
            voucher: result.voucher
        });

    } catch (error) {
        console.error('خطأ في التحقق من الكود:', error);
        res.status(500).json({ error: 'فشل في التحقق من الكود' });
    }
});

/**
 * API: استبدال كود (صرف السلع)
 * POST /api/voucher/redeem
 * Body: { "code": "ABCD1234...", "redeemerPiId": "GABC..." }
 */
app.post('/api/voucher/redeem', (req, res) => {
    try {
        const { code, redeemerPiId } = req.body;
        if (!code || !redeemerPiId) {
            return res.status(400).json({ error: 'الكود ومعرف نقطة البيع مطلوبان' });
        }

        const result = redeemVoucher(code, redeemerPiId);
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }

        res.json({
            success: true,
            message: result.message,
            voucher: result.voucher
        });

    } catch (error) {
        console.error('خطأ في استبدال الكود:', error);
        res.status(500).json({ error: 'فشل في استبدال الكود' });
    }
});

/**
 * API: الحصول على قائمة الأكواد لمستفيد
 * GET /api/voucher/list/:piUserId
 */
app.get('/api/voucher/list/:piUserId', (req, res) => {
    try {
        const { piUserId } = req.params;
        const vouchers = getVouchersForBeneficiary(piUserId);
        res.json({ success: true, vouchers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * API: الحصول على إحصائيات الأكواد
 * GET /api/voucher/stats
 */
app.get('/api/voucher/stats', (req, res) => {
    try {
        const stats = getVoucherStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const languageManager = require('./locales/languageManager');

// مسار استقبال طلبات واجهة المستخدم وتزويدها باللغة الصحيحة تلقائياً
app.get('/api/localization', (req, res) => {
    // قراءة لغة المتصفح تلقائياً من ترويسات الطلب (Request Headers)
    const userBrowserLang = req.headers['accept-language'];
    const localizationData = languageManager.detectAndGetTranslation(userBrowserLang);
    
    res.json(localizationData);
});

const ajyalRouter = require('./ajyal-server-router');
app.use('/', ajyalRouter);


