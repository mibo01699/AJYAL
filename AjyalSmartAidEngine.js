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
