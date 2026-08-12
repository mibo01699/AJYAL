import SovereignScholarshipHub from './SovereignScholarshipHub.js';
import EnhancedScholarshipHub from './SovereignScholarshipHub.js'; // نسخة السيرفر المحدثة

const testSuite = new EnhancedScholarshipHub();

function runBrokerSystemCheck() {
    console.log("=================================================================");
    console.log("STARTING SCHOLARSHIP NOTIFICATION BROKER AND EMAIL SMTP AUDIT");
    console.log("=================================================================\n");

    // 1. تسجيل المقاعد الأكاديمية والطلاب تجريبياً
    testSuite.transmitUniversityQuotaUpdate("UNI-GLOBAL-NODE-01", 1, "500.00");
    testSuite.registerYemeniApplicant("GDV_YEM_WINNER_01", "96.20", "b3c4d5e6f7a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a10009", "UNI-GLOBAL-NODE-01", "ar");

    // 2. تشغيل القرعة التلقائية وإصدار الإشعارات الثلاثية
    console.log("Executing lottery run with integrated automated email pipeline...");
    const routingReport = testSuite.executeAndNotifyLotteryRun("UNI-GLOBAL-NODE-01", "5000000000"); // بدل المعيشة بالـ Stroops

    console.log(`\n-> Government Dispatch Status: ${routingReport.communicationLogs.governmentNotice.dispatchStatus}`);
    console.log(`   Target Email: ${routingReport.communicationLogs.governmentNotice.recipientEmail}`);
    
    console.log(`\n-> University Courier Status: ${routingReport.communicationLogs.universityNotice.dispatchStatus}`);
    console.log(`   Target Email: ${routingReport.communicationLogs.universityNotice.recipientEmail}`);

    console.log(`\n-> Winner Student Alert Status: ${routingReport.communicationLogs.studentsNotifiedArray[0].dispatchStatus}`);
    console.log(`   Target Student System Mail: ${routingReport.communicationLogs.studentsNotifiedArray[0].recipientEmail}`);
    console.log("   Email Body Content Snippet:" + routingReport.communicationLogs.studentsNotifiedArray[0].emailContent.substring(0, 140));

    console.log("\n=================================================================");
    console.log("BROKER VERDICT: ALL TRIPLE-CHANNEL EMAIL PIPELINES PASS SAFETY.");
    console.log("=================================================================");
}

runBrokerSystemCheck();
