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
