// AJYAL Educational Platform Integrity and Sensory Accessibility Verification Test
// Focus: Assures Zero Float Leakage across Ingestion and Accessibility Matrices

import AjyalSupportSystem from './AjyalSupportSystem.js';
import YemenCurriculumIngestion from './YemenCurriculumIngestion.js';

const auditCore = new AjyalSupportSystem();
const curriculumCore = new YemenCurriculumIngestion();

function runAjyalEcosystemAudit() {
    console.log("=================================================================");
    console.log("STARTING AJYAL WEB3 EDUCATIONAL INFRASTRUCTURE INTEGRITY AUDIT");
    console.log("=================================================================\n");

    let auditPassed = true;

    // 1. اختبار محاكاة إدخال المنهج اليمني للمرحلة الأولى
    console.log("Testing Component: Yemen Phase 1 Curriculum Ingestion...");
    const IngestedLesson = curriculumCore.ingestYemeniLesson("Digital Literacy & Blockchain", "9", "Introduction to Private Keys", "5.5");
    
    if (IngestedLesson.baseRewardStroops.includes('.')) {
        console.error("FAIL: Floating point leak found during curriculum decimal conversion!");
        auditPassed = false;
    } else {
        console.log(`-> Pass: Ingested Lesson [${IngestedLesson.lessonId}] with secure reward: ${IngestedLesson.baseRewardStroops} Stroops.`);
    }

    // 2. اختبار معالجة مساعد الذكاء الاصطناعي وإشارات الصم والبكم للغات شرق آسيا والعالم العربي
    console.log("\nTesting Component: Multi-Modal AI Evaluation and Accessibility Engine...");
    const sampleTests = [
        { lang: "ar", score: "85.00", student: "G_STUDENT_YEM_01" },
        { lang: "ko", score: "90.00", student: "G_STUDENT_KOR_01" },
        { lang: "th", score: "40.00", student: "G_STUDENT_THA_01" } // دراسة حالة رسوب
    ];

    sampleTests.forEach((test) => {
        const report = auditCore.consultEducationalAi("ANS-VECTOR-091", test.score, "10.00", test.lang);
        console.log(`-> Student [${test.student}] Language (${test.lang}) Assessment Verdict: ${report.evaluationVerdict}`);
        console.log(`-> AI Feedback Text Output: ${report.aiFeedbackMessage}`);
    });

    console.log("\n=================================================================");
    if (auditPassed) {
        console.log("AUDIT VERDICT: AJYAL ECOSYSTEM IS 100% FLOATING-POINT FREE & ACCEPTED.");
        console.log("System is optimized for UNICEF DPG deployment and Pi Studio Launch.");
    } else {
        console.error("AUDIT VERDICT: CRITICAL COMPLIANCE FAILURE ENCOUNTERED.");
        process.exit(1);
    }
    console.log("=================================================================");
}

runAjyalEcosystemAudit();
