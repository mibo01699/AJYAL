// ============================================================
// الملف: ajyal-core.js (معدل)
// المسار: AJYAL/ajyal-core.js
// الدور: المنطق الأساسي لمنصة AJYAL مع إضافة نظام ذوي الاحتياجات الخاصة
// ============================================================

// ============================================================
// البيانات الحالية (محاكاة)
// ============================================================
let users = [];
let enrollments = [];
let specialNeedsRegistry = []; // سجل جديد لذوي الاحتياجات الخاصة

// ============================================================
// دوال المصادقة والتسجيل الأساسية (الموجودة)
// ============================================================

const authenticatePiUser = (piUserId) => {
    // ... (الكود الموجود سابقاً) ...
    let user = users.find(u => u.piUserId === piUserId);
    if (!user) {
        user = {
            id: `user_${Date.now()}`,
            piUserId: piUserId,
            name: `مستخدم ${piUserId.slice(0, 6)}`,
            role: 'student',
            created_at: new Date()
        };
        users.push(user);
    }
    return user;
};

const enrollStudent = (userId, courseId) => {
    // ... (الكود الموجود سابقاً) ...
    const existing = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (existing) throw new Error('المستخدم مسجل بالفعل في هذه الدورة');
    const enrollment = {
        id: `enroll_${Date.now()}`,
        userId,
        courseId,
        status: 'active',
        progress: 0,
        enrolled_at: new Date()
    };
    enrollments.push(enrollment);
    return enrollment;
};

const updateProgress = (enrollmentId, progress) => {
    // ... (الكود الموجود سابقاً) ...
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) throw new Error('التسجيل غير موجود');
    enrollment.progress = Math.min(100, Math.max(0, progress));
    return enrollment;
};

// ============================================================
// دوال جديدة: نظام ذوي الاحتياجات الخاصة والمعاقين وجرحى الحرب
// ============================================================

/**
 * تسجيل مستفيد جديد من فئة ذوي الاحتياجات الخاصة
 * @param {string} piUserId - معرف المستخدم من Pi Auth (يجب أن يكون قد أكمل KYC)
 * @param {Object} data - بيانات المستفيد
 * @param {string} data.fullName - الاسم الكامل
 * @param {string} data.disabilityType - نوع الإعاقة أو الإصابة
 * @param {string} data.medicalHistory - التاريخ الطبي المختصر
 * @param {string} data.documentsHash - هاش (تشفير) للوثائق المرفقة
 * @param {Object} data.gpsData - إحداثيات GPS لموقع التسجيل
 * @param {number} data.gpsData.lat - خط العرض
 * @param {number} data.gpsData.lng - خط الطول
 * @param {string} data.supportType - نوع الدعم المطلوب (تعليم، علاج، مساعدات)
 * @returns {Object} سجل المستفيد الجديد
 */
const registerSpecialNeedsUser = (piUserId, data) => {
    // 1. التحقق من أن المستخدم قد أكمل KYC (محاكاة)
    const user = authenticatePiUser(piUserId);
    if (!user) {
        throw new Error('المستخدم غير مصرح به أو لم يكمل KYC');
    }

    // 2. التأكد من عدم وجود تسجيل مسبق
    const existing = specialNeedsRegistry.find(r => r.piUserId === piUserId);
    if (existing) {
        throw new Error('هذا المستخدم مسجل بالفعل في نظام ذوي الاحتياجات الخاصة');
    }

    // 3. إنشاء سجل جديد
    const record = {
        id: `sn_${Date.now()}`,
        piUserId: piUserId,
        fullName: data.fullName,
        disabilityType: data.disabilityType,
        medicalHistory: data.medicalHistory || '',
        documentsHash: data.documentsHash,
        gpsData: data.gpsData || null,
        supportType: data.supportType || 'تعليم',
        status: 'pending', // pending, verified, rejected
        registrationDate: new Date().toISOString(),
        lastVerificationAttempt: null,
        verificationNotes: []
    };

    specialNeedsRegistry.push(record);
    return record;
};

/**
 * التحقق من صحة وثائق المستفيد (باستخدام الذكاء الاصطناعي - محاكاة)
 * @param {string} recordId - معرف سجل المستفيد
 * @param {Object} verificationData - بيانات التحقق
 * @param {string} verificationData.docHash - هاش الوثيقة المقدمة للتحقق
 * @param {Object} verificationData.gpsData - إحداثيات GPS الحالية
 * @param {string} verificationData.notes - ملاحظات إضافية (اختياري)
 * @returns {Object} نتيجة التحقق
 */
const verifySpecialNeedsDocument = (recordId, verificationData) => {
    const record = specialNeedsRegistry.find(r => r.id === recordId);
    if (!record) {
        throw new Error('سجل المستفيد غير موجود');
    }

    // محاكاة عملية تدقيق (AI):
    // - التحقق من تطابق هاش الوثيقة
    // - التحقق من موقع GPS
    // - التحقق من التناقضات الزمنية (محاكاة)

    const isDocValid = verificationData.docHash === record.documentsHash;
    const isGpsValid = verificationData.gpsData && 
                       Math.abs(record.gpsData.lat - verificationData.gpsData.lat) < 0.01 &&
                       Math.abs(record.gpsData.lng - verificationData.gpsData.lng) < 0.01;

    // تحديث سجل التحقق
    record.lastVerificationAttempt = new Date().toISOString();
    record.verificationNotes.push({
        date: record.lastVerificationAttempt,
        docMatch: isDocValid,
        gpsMatch: isGpsValid,
        notes: verificationData.notes || ''
    });

    // تحديث الحالة إذا نجح التحقق
    if (isDocValid && isGpsValid) {
        record.status = 'verified';
        return {
            success: true,
            status: 'verified',
            message: 'تم التحقق من المستندات والمعلومات بنجاح',
            recordId: recordId
        };
    } else {
        record.status = 'rejected';
        return {
            success: false,
            status: 'rejected',
            message: 'فشل التحقق: عدم تطابق الوثائق أو الموقع',
            recordId: recordId,
            reason: !isDocValid ? 'الوثائق غير متطابقة' : 'الموقع غير متطابق'
        };
    }
};

/**
 * الحصول على قائمة المستفيدين المسجلين (مع إمكانية التصفية)
 * @param {string} status - حالة التسجيل (pending, verified, rejected, all)
 * @returns {Array} قائمة المستفيدين
 */
const getSpecialNeedsList = (status = 'all') => {
    if (status === 'all') {
        return specialNeedsRegistry;
    }
    return specialNeedsRegistry.filter(r => r.status === status);
};

/**
 * الحصول على سجل مستفيد محدد بواسطة معرف Pi
 * @param {string} piUserId - معرف المستخدم من Pi Auth
 * @returns {Object} سجل المستفيد
 */
const getSpecialNeedsRecordByPiId = (piUserId) => {
    const record = specialNeedsRegistry.find(r => r.piUserId === piUserId);
    if (!record) {
        throw new Error('لا يوجد سجل لهذا المستخدم');
    }
    return record;
};

// ============================================================
// تصدير الدوال الجديدة والمحدثة
// ============================================================
module.exports = {
    authenticatePiUser,
    enrollStudent,
    updateProgress,
    registerSpecialNeedsUser,
    verifySpecialNeedsDocument,
    getSpecialNeedsList,
    getSpecialNeedsRecordByPiId
};