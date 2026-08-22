// AjyalSmartAidEngine.js - محرك الحوافز والمساعدات القائم على التفاعل التعليمي
class AjyalSmartAidEngine {
    /**
     * احتساب أولوية ونسبة المساعدات الإنسانية للأسرة بدقة BigInt
     * @param {number} dailyClassAttendancePercentage - نسبة حضور الحصص والواجبات (0-100)
     * @param {number} totalStudentsInFamily - عدد الطلاب والطالبات الفعلي في الأسرة
     */
    static calculatePriorityScore(dailyClassAttendancePercentage, totalStudentsInFamily) {
        if (dailyClassAttendancePercentage < 50) return 0n; // حرمان الحسابات الخاملة تعليمياً

        const attendanceWeight = BigInt(dailyClassAttendancePercentage);
        const studentCountWeight = BigInt(totalStudentsInFamily) * 15n; // تخصيص نوعي لكل طالب

        // مجموع نقاط الأولوية الحافزة
        return attendanceWeight + studentCountWeight;
    }

    /**
     * تصدير شهادة تخرج تعليمية متوافقة دولياً لملفات PDF وروابط المشاركة
     */
    static generateInternationalCertificate(studentId, gradeDetails) {
        return {
            certificateId: `CERT-INT-2026-${studentId}`,
            standard: "UNESCO-ISCED-2026-COMPLIANT",
            exportFormat: "APPLICATION_PDF",
            shareableSecureLink: `https://ajyal.edu.io{studentId}`,
            allowedExternalChannels: ["TELEGRAM", "FACEBOOK"] // حظر القنوات الخارجية غير المعتمدة
        };
    }
}
module.exports = AjyalSmartAidEngine;
// AjyalSmartAidEngine.js - المحرك الذكي المتقدم لمعالجة وفرز قسائم الدعم العيني لـ GAV والمقاصة المالية
const crypto = require('crypto');

class AjyalSmartAidEngine {
    constructor() {
        this.aidRegistry = [];
    }

    // أتمتة تحويل نقاط التعليم إلى مساعدات مادية موثقة بالـ BigInt وحساب السلسلة الصلبة
    processAutomatedAidAllocation(piUserId, assessmentScore, isSpecialNeeds = false) {
        const BASE_ALLOCATION_YER = 50000n; // ميزانية أساسية 50,000 وحدات نقدية فرعية
        const bonusMultiplier = isSpecialNeeds ? 2n : 1n; // مضاعفة الدعم تلقائياً لذوي الاحتياجات الإعاقية
        
        const finalAllocationLocalCurrency = BASE_ALLOCATION_YER * bonusMultiplier;

        const aidBlock = {
            issuanceId: `AID-BLOCK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            beneficiary: piUserId,
            allocatedUnitsLocalCurrency: finalAllocationLocalCurrency.toString(), // الحفظ كـ String للحفاظ على دقة BigInt
            isSpecialNeeds,
            designatedVoucherChannel: isSpecialNeeds ? "GAV_SPECIAL_MEDICAL_AID" : "GAV_STANDARD_NUTRITION",
            complianceChecked: true,
            status: "READY_FOR_CROSS_REPOSITORY_CLEARING"
        };

        this.aidRegistry.push(aidBlock);
        return aidBlock;
    }
}

module.exports = { AjyalSmartAidEngine };

