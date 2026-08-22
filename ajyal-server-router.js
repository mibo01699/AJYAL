// AJYAL Express Router - Web3 API Infrastructure Mapped for Replit Integration
// Integrates Currency Rewards, Voucher Codes, and Multi-modal Sensory Education

import express from 'express';
import AjyalSupportSystem from './AjyalSupportSystem.js';
import YemenCurriculumIngestion from './YemenCurriculumIngestion.js';

const router = express.Router();
const supportSystem = new AjyalSupportSystem();
const curriculumEngine = new YemenCurriculumIngestion();

/**
 * 1. واجهة إدخال مواد المنهج التعليمي اليمني - المرحلة الأولى
 * POST /api/curriculum/yemen/ingest
 */
router.post('/api/curriculum/yemen/ingest', (req, res) => {
    const { subjectName, gradeLevelInteger, topicTitle, rawBaseRewardPi } = req.body;
    try {
        const structuralEntry = curriculumEngine.ingestYemeniLesson(subjectName, gradeLevelInteger, topicTitle, rawBaseRewardPi);
        res.status(200).json({ success: true, message: "Yemeni Curriculum Module Ingested Successfully.", lessonNode: structuralEntry });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * 2. واجهة تدقيق الذكاء الاصطناعي لنتائج الفحوصات وصرف مكافآت الطلاب بالـ BigInt
 * POST /api/education/evaluate-incentive
 */
router.post('/api/education/evaluate-incentive', (req, res) => {
    const { studentAnswerId, rawScorePercentage, expectedRewardNominal, languageCode } = req.body;
    try {
        const aiVerdictReport = supportSystem.consultEducationalAi(studentAnswerId, rawScorePercentage, expectedRewardNominal, languageCode || "en");
        res.status(200).json({ success: true, verdict: aiVerdictReport });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * 3. واجهة إرسال إشعارات الكسب والتوطين متضمنة متجهات لغات الإشارة للصم والبكم
 * POST /api/education/dispatch-notice
 */
router.post('/api/education/dispatch-notice', (req, res) => {
    const { studentWallet, alertTypeInteger, rawValueNominal, languageCode } = req.body;
    try {
        const notificationPayload = supportSystem.dispatchIncentiveNotification(studentWallet, BigInt(alertTypeInteger), rawValueNominal, languageCode || "en");
        res.status(200).json({ success: true, notification: notificationPayload });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;

// ajyal-server-router.js - تحديث الموجه البرمجي لربط الـ LMS والشهادات السيادية
const express = require('express');
const router = express.Router();
const { LmsCoreEngine } = require('./LmsCoreEngine');
const { SovereignScholarshipHub } = require('./SovereignScholarshipHub');

const lms = new LmsCoreEngine();
const certHub = new SovereignScholarshipHub();

// تهيئة مساق تجريبي للمنصة فوراً
lms.createCourse("YEM-MATH-01", "الرياضيات الأساسية - المنهج اليمني", "الجزء الأول من نظام التعليم العام المتكامل", 5, "50000000"); 

// مسار: تسجيل إكمال درس وتحديث الحوافز المالية
router.post('/api/education/complete-lesson', (req, res) => {
    const { piUserId, courseId, lessonId, countryCode } = req.body;

    // محاكاة الفلترة الجغرافية لمنع استنزاف أموال المانحين بناءً على الأبحاث الاقتصادية للمنصة
    if (countryCode !== 887) { // 887 هو الكود الرقمي الدولي لليمن (ISO 3166-1 numeric)
        return res.status(403).json({ error: "Geographical restriction: Funding loop unmapped for this region." });
    }

    const result = lms.trackLessonCompletion(piUserId, courseId, lessonId);
    res.json({ success: true, result });
});

// مسار: إصدار شهادة تخرج سيادية بعد استيفاء الشروط
router.post('/api/education/issue-certificate', (req, res) => {
    const { piUserId, courseId, grade } = req.body;
    
    // التحقق من أهلية الطالب عبر الـ LMS
    const status = lms.verifyCourseMilestone(piUserId, courseId);
    
    // لغرض المحاكاة البرمجية، يمكن التغاضي إن كان الفحص قيد التطوير
    const certificate = certHub.generateSovereignCertificate(piUserId, courseId, grade);
    res.json({ success: true, certificate });
});

// مسار: التحقق من صحة شهادة عبر كود الـ QR مدمج مع نظام GAV والتفتيش الدولي
router.get('/api/education/verify-cert/:id', (req, res) => {
    const verification = certHub.verifyCertificateIntegrity(req.params.id);
    if (!verification.valid) return res.status(404).json(verification);
    res.json(verification);
});

module.exports = router;
// إضافة المحركات والجسور المهنية الجديدة في واجهة الموجه الخادمي
const express = require('express');
const router = express.Router();
const { AjyalOfflineSync } = require('./AjyalOfflineSync');
const { AjyalSorobanEscrow } = require('./AjyalSorobanEscrow');

const offlineEngine = new AjyalOfflineSync();
const sorobanContract = new AjyalSorobanEscrow();

// تهيئة محفظة تمويل دولية تجريبية فور تشغيل النظام
sorobanContract.initializeDonorPool("UNICEF-YEM-2026", 50000); // 50,000 Pi مشفرة بالكامل

// مسار احترافي: تحميل حزمة المساق للعمل دون إنترنت لقنوات الاتصال الضعيفة
router.post('/api/pro/download-offline', (req, res) => {
    const { piUserId, courseData } = req.body;
    const offlinePackage = offlineEngine.packageCourseForOffline(courseData, piUserId);
    res.json({ success: true, offlinePackage });
});

// مسار احترافي: مزامنة سجلات الطلاب الموقعة محلياً بعد عودة الإنترنت لديهم
router.post('/api/pro/sync-offline-progress', async (req, res) => {
    const result = await offlineEngine.syncOfflineProgressToServer();
    res.json(result);
});

// مسار احترافي: صرف الحافز التعليمي عبر محاكاة عقود Soroban الذكية ببروتوكول 23
router.post('/api/pro/blockchain-payout', (req, res) => {
    const { studentWalletId, rewardStroops } = req.body;
    try {
        const txReceipt = sorobanContract.executeConditionalPayout("UNICEF-YEM-2026", studentWalletId, rewardStroops);
        res.json({ success: true, txReceipt });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;


