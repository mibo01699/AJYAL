// ============================================================
// الملف: voucher-system.js
// المسار: AJYAL/voucher-system.js
// الدور: إدارة الأكواد المشفرة للمساعدات العينية (لذوي الاحتياجات الخاصة فقط)
// ============================================================

const crypto = require('crypto');

// ============================================================
// قاعدة بيانات الأكواد (محاكاة)
// ============================================================
let vouchers = []; // { id, code, beneficiaryPiId, beneficiaryName, items, quantity, value, expiryDate, status, issuedAt, redeemedAt }

/**
 * توليد كود مشفر فريد
 * @param {string} beneficiaryPiId - معرف المستفيد من Pi Auth
 * @param {string} beneficiaryName - اسم المستفيد
 * @param {Array} items - قائمة السلع (مثلاً: [{ name: 'أرز', quantity: 5 }, { name: 'زيت', quantity: 2 }])
 * @param {number} value - القيمة النقدية للكود
 * @param {number} expiryDays - عدد أيام الصلاحية (افتراضي 30 يوماً)
 * @returns {Object} الكود المُنشأ
 */
const generateVoucher = (beneficiaryPiId, beneficiaryName, items, value, expiryDays = 30) => {
    // التحقق من أن المستفيد من فئة "ذوي الاحتياجات الخاصة" (سيتم التحقق من هذا في الدالة التي تستدعي هذه الوظيفة)
    // إنشاء معرف فريد للكود
    const voucherId = `VCH-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // إنشاء كود مشفر (مزيج من بيانات المستفيد والوقت)
    const codePayload = `${beneficiaryPiId}-${voucherId}-${Date.now()}`;
    const code = crypto.createHash('sha256').update(codePayload).digest('hex').substring(0, 16).toUpperCase();

    const voucher = {
        id: voucherId,
        code: code,
        beneficiaryPiId: beneficiaryPiId,
        beneficiaryName: beneficiaryName,
        items: items, // [{ name: 'أرز', quantity: 5, unit: 'كجم' }]
        value: value,
        expiryDate: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active', // active, redeemed, expired
        issuedAt: new Date().toISOString(),
        redeemedAt: null,
        redeemedBy: null // معرف نقطة البيع (من GAV)
    };

    vouchers.push(voucher);
    return voucher;
};

/**
 * التحقق من صحة كود (لمنع التزوير والانتهاء)
 * @param {string} code - الكود المشفر
 * @param {string} redeemerPiId - معرف نقطة البيع أو مندوب الصرف
 * @returns {Object} نتيجة التحقق
 */
const verifyVoucher = (code, redeemerPiId) => {
    const voucher = vouchers.find(v => v.code === code);
    if (!voucher) {
        return { valid: false, message: 'الكود غير صحيح' };
    }

    if (voucher.status === 'redeemed') {
        return { valid: false, message: 'تم استخدام هذا الكود سابقاً' };
    }

    if (new Date(voucher.expiryDate) < new Date()) {
        voucher.status = 'expired';
        return { valid: false, message: 'انتهت صلاحية الكود' };
    }

    // التحقق من أن المستفيد من فئة ذوي الاحتياجات الخاصة (يتم تمرير هذه المعلومة من المتصل)
    // يمكن إضافة منطق للتحقق من نوع المستفيد هنا

    return {
        valid: true,
        voucher: {
            id: voucher.id,
            beneficiaryName: voucher.beneficiaryName,
            items: voucher.items,
            value: voucher.value,
            expiryDate: voucher.expiryDate
        }
    };
};

/**
 * استبدال الكود (صرف السلع)
 * @param {string} code - الكود المشفر
 * @param {string} redeemerPiId - معرف نقطة البيع (من GAV)
 * @returns {Object} نتيجة عملية الصرف
 */
const redeemVoucher = (code, redeemerPiId) => {
    const verification = verifyVoucher(code, redeemerPiId);
    if (!verification.valid) {
        return { success: false, message: verification.message };
    }

    const voucher = vouchers.find(v => v.code === code);
    voucher.status = 'redeemed';
    voucher.redeemedAt = new Date().toISOString();
    voucher.redeemedBy = redeemerPiId;

    return {
        success: true,
        message: 'تم صرف السلع بنجاح',
        voucher: {
            id: voucher.id,
            beneficiaryName: voucher.beneficiaryName,
            items: voucher.items,
            value: voucher.value
        }
    };
};

/**
 * الحصول على قائمة الأكواد لمستفيد معين
 * @param {string} beneficiaryPiId - معرف المستفيد من Pi Auth
 * @returns {Array} قائمة الأكواد
 */
const getVouchersForBeneficiary = (beneficiaryPiId) => {
    return vouchers.filter(v => v.beneficiaryPiId === beneficiaryPiId);
};

/**
 * الحصول على إحصائيات الأكواد
 * @returns {Object} إحصائيات
 */
const getVoucherStats = () => {
    const total = vouchers.length;
    const active = vouchers.filter(v => v.status === 'active').length;
    const redeemed = vouchers.filter(v => v.status === 'redeemed').length;
    const expired = vouchers.filter(v => v.status === 'expired').length;
    const totalValue = vouchers.reduce((sum, v) => sum + v.value, 0);

    return { total, active, redeemed, expired, totalValue };
};

module.exports = {
    generateVoucher,
    verifyVoucher,
    redeemVoucher,
    getVouchersForBeneficiary,
    getVoucherStats
};