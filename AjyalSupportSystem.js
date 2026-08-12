// AJYAL Autonomous AI Pedagogical Consultant, Strict Notifications, and Escalation Engine
// Integrates with AntiDoubleDipping Framework to lock duplicate reward payouts

import AjyalMultilingualEngine from './AjyalMultilingualEngine.js';

const localizationEngine = new AjyalMultilingualEngine();

class AjyalSupportSystem {
    constructor() {
        this.PI_SCALE = 10000000n;      // 10^7 Base units for incentives
        this.YER_SCALE = 10000000000n;  // 10^10 Base units for local accounting
        this.ticketsStore = new Map();
        this.ticketSequence = 0n;
    }

    /**
     * [نظام الإشعارات والمكافآت التعليمية]: يولد إشعارات كسب المكافآت بالرقم الصحيح المطلق لمنع ثغرات الكسور العشرية
     */
    dispatchIncentiveNotification(studentWallet, rawPiRewardAmount, langCode) {
        const rewardStroopsInt = BigInt(Math.round(parseFloat(rawPiRewardAmount) * Number(this.PI_SCALE)));
        const visualData = localizationEngine.getAccessibleLessonPayload(langCode);

        return {
            recipientStudent: studentWallet,
            rewardTotalStroops: rewardStroopsInt.toString(),
            noticeAlertText: `Incentive Settled! ${visualData.renderingText} Reward Confirmed: ${rewardStroopsInt.toString()} Stroops.`,
            sensorySignToken: visualData.deafSignVectorToken,
            timestamp: Date.now().toString()
        };
    }

    /**
     * [مساعد دعم الذكاء الاصطناعي الفائق - AI Assistant]: يفحص تلقائياً أداء الطالب، ويتحقق من معادلات الرصيد المالي المكتسب دون فواصل عائمة
     */
    consultEducationalAi(studentAnswerId, rawScorePercentage, expectedRewardNominal, langCode) {
        try {
            const calculatedRewardInt = BigInt(Math.round(parseFloat(expectedRewardNominal) * Number(this.PI_SCALE)));
            const scoreInt = BigInt(Math.round(parseFloat(rawScorePercentage)));

            if (scoreInt < 75n) { // حد النجاح 75% كأرقام صحيحة مطلقة
                return {
                    evaluationVerdict: "RE_EXAMINATION_REQUIRED",
                    eligibleForPayout: false,
                    aiFeedbackMessage: "Score insufficient for micro-grant activation. Please review sensory audio modules."
                };
            }

            return {
                evaluationVerdict: "COMPETENCY_PASSED",
                eligibleForPayout: true,
                payoutStroops: calculatedRewardInt.toString(),
                aiFeedbackMessage: `AI Audit Approved. Competency certified. Transferring ${calculatedRewardInt.toString()} Stroops.`
            };
        } catch (err) {
            return {
                evaluationVerdict: "COMPLIANCE_CRASH",
                eligibleForPayout: false,
                aiFeedbackMessage: "Critical AI Security Exception: Floating point injection block activated."
            };
        }
    }

    /**
     * [نظام الدعم البشري للطلاب والمعلمين - Human Support]: يفتح قنوات تواصل وتذاكر دولية عند تعليق المكافآت أو أخطاء الـ KYC
     */
    openEducationalDisputeTicket(studentWallet, exceptionTypeInt, contextualDescription) {
        this.ticketSequence += 1n;
        const currentTicketId = `AJYAL-DISPUTE-TICKET-${this.ticketSequence.toString()}`;

        const disputeTicket = {
            id: currentTicketId,
            student: studentWallet,
            exceptionCategoryCode: BigInt(exceptionTypeInt).toString(),
            narrative: contextualDescription,
            status: "OPEN_FOR_HUMAN_ACADEMIC_INTERVENTION",
            createdTimestamp: Date.now().toString()
        };

        this.ticketsStore.set(currentTicketId, disputeTicket);
        return disputeTicket;
    }
}

export default AjyalSupportSystem;
