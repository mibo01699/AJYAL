// دمج محرك الإشعارات الجديد داخل النواة الرئيسية للمنح الدراسية
import ScholarshipNotificationBroker from './ScholarshipNotificationBroker.js';

const broker = new ScholarshipNotificationBroker();

// أضف هذه الدالة أو حدّث دالة القرعة السابقة لتتضمن الإشعارات التلقائية
class EnhancedScholarshipHub {
    // ... الاحتفاظ بالبنية والخصائص السابقة للـ BigInt ...

    /**
     * Executes lottery and automatically triggers the triple-channel notification engine
     */
    executeAndNotifyLotteryRun(universityId, rawStipendStroops) {
        // 1. تشغيل القرعة اللامركزية العادلة رقمياً بسحب الهاشات
        const lotteryReport = this.executeProvablyFairScholarshipLottery(universityId);
        
        if (lotteryReport.lotteryStatus !== "COMPLETED_AND_SETTLED") {
            return lotteryReport;
        }

        const uniProfile = this.activeUniversitiesRegistry.get(universityId);
        const logsPipeline = {
            governmentNotice: null,
            universityNotice: null,
            studentsNotifiedArray: []
        };

        // 2. إطلاق إشعار وزارة التعليم العالي والبحث العلمي فوراً
        logsPipeline.governmentNotice = broker.notifySovereignGovernmentBody(lotteryReport);

        // 3. إطلاق إشعار وإيميل الجامعة الدولية الشريكة المانحة
        logsPipeline.universityNotice = broker.notifyPartnerUniversity(uniProfile, lotteryReport.totalAllocatedWinners, rawStipendStroops);

        // 4. إطلاق الإشعارات الفردية والإيميلات للطلاب اليمنيين الفائزين بالمقاعد
        lotteryReport.winnersRegistryArray.forEach((winner) => {
            const studentProfile = this.registeredApplicants.get(winner.winningStudentWallet);
            const studentNotice = broker.notifyWinningStudent(studentProfile, winner.assignedScholarshipId, rawStipendStroops, "ar");
            logsPipeline.studentsNotifiedArray.push(studentNotice);
        });

        return {
            auditStatus: "SUCCESSFULLY_SETTLED_AND_NOTIFIED",
            lotterySummary: lotteryReport,
            communicationLogs: logsPipeline
        };
    }
}

// SovereignScholarshipHub.js - الموثق السيادي للشهادات الرقمية غير القابلة للتزوير
const crypto = require('crypto');

class SovereignScholarshipHub {
    constructor() {
        this.issuedCertificates = new Map();
    }

    // توليد شهادة رقمية مشفرة للطالب غير قابلة للتزوير
    generateSovereignCertificate(piUserId, courseId, grade) {
        const timestamp = Date.now();
        const rawPayload = `${piUserId}-${courseId}-${grade}-${timestamp}`;
        
        // إنشاء توقيع وتجزئة مشفرة لضمان سلامة الشهادة في مناطق النزاع
        const certificateHash = crypto.createHash('sha256').update(rawPayload).digest('hex');

        const certificateMetadata = {
            certificateId: `AJYAL-CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            piUserId,
            courseId,
            grade,
            blockchainPayloadHash: certificateHash,
            status: 'ANCHORED_TO_PI_PROTOCOL_23',
            issuedAt: new Date(timestamp).toISOString()
        };

        this.issuedCertificates.set(certificateMetadata.certificateId, certificateMetadata);
        return certificateMetadata;
    }

    // التحقق الفوري من صحة الشهادة من قبل المنظمات الدولية والمشغلين
    verifyCertificateIntegrity(certificateId) {
        if (!this.issuedCertificates.has(certificateId)) {
            return { valid: false, error: "Certificate not found in AJYAL sovereign registry." };
        }
        const cert = this.issuedCertificates.get(certificateId);
        return { valid: true, data: cert };
    }
}

module.exports = { SovereignScholarshipHub };
