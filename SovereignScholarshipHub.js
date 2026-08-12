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
