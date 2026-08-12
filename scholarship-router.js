import express from 'express';
import SovereignScholarshipHub from './SovereignScholarshipHub.js';

const router = express.Router();
const scholarshipHub = new SovereignScholarshipHub();

/**
 * 1. واجهة استقبال الطلاب اليمنيين والتحقق من شهادات البلوكشين
 * POST /api/scholarship/apply
 */
router.post('/api/scholarship/apply', (req, res) => {
    const { studentWallet, rawGpaPercentage, blockchainCertificateHash, targetUniId, languageCode } = req.body;
    try {
        const application = scholarshipHub.registerYemeniApplicant(
            studentWallet, rawGpaPercentage, blockchainCertificateHash, targetUniId, languageCode || "en"
        );
        res.status(200).json({ success: true, message: "Application blockchain trace approved and logged.", profile: application });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * 2. واجهة مراسلات الجامعات الدولية لتسجيل وتحديث المقاعد المتاحة
 * POST /api/university/update-quota
 */
router.post('/api/university/update-quota', (req, res) => {
    const { universityId, seatIncrementAmount, rawLivingStipendPi } = req.body;
    try {
        const courierSync = scholarshipHub.transmitUniversityQuotaUpdate(universityId, seatIncrementAmount, rawLivingStipendPi);
        res.status(200).json({ success: true, courier: courierSync });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * 3. واجهة تشغيل القرعة اللامركزية الذكية لإعلان الفائزين بالمنح
 * POST /api/scholarship/execute-lottery
 */
router.post('/api/scholarship/execute-lottery', (req, res) => {
    const { universityId } = req.body;
    try {
        const lotteryReport = scholarshipHub.executeProvablyFairScholarshipLottery(universityId);
        res.status(200).json({ success: true, report: lotteryReport });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
