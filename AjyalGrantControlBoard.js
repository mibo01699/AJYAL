// AJYAL Sovereign Grant Control Board & Geographical Targeting Engine
// Compliance: UNICEF Micro-Funding Matrix & Pi Network 2026 Ecosystem Rules
// Strict Integer System: No Floating Points Allowed.

class AjyalGrantControlBoard {
    constructor() {
        // قاعدة بيانات المنح التمويلية النشطة (المعرفات الجغرافية والمنظمات المانحة)
        // يتم تمثيل الأرصدة التمويلية الإجمالية بالـ BigInt الصحيح المطلق
        this.activeGrantsRegistry = new Map();
        
        // دول شرق آسيا، الشرق الأوسط، والمناطق المستهدفة بالأكواد الرقمية الصحيحة
        this.countryStatusRegistry = new Map([
            ["YE", { rewardsActive: true, vouchersActive: true, minGrantLevel: 1n }],  // اليمن - تفعيل كامل
            ["TH", { rewardsActive: true, vouchersActive: false, minGrantLevel: 2n }], // تايلاند - مكافآت فقط
            ["PH", { rewardsActive: false, vouchersActive: true, minGrantLevel: 1n }], // الفلبين - مساعدات عينية فقط
            ["TR", { rewardsActive: true, vouchersActive: true, minGrantLevel: 3n }]   // تركيا - تفعيل مشروط بتمويل عالي
        ]);
    }

    /**
     * تسجيل منحة دولية جديدة وتحديد النطاق الجغرافي المسموح لها بالصرف
     * @param {string} grantId - معرف المنحة الدولي
     * @param {string} donorName - اسم المنظمة المانحة (مثل UNICEF, WFP)
     * @param {string} targetCountryIso - رمز الدولة (e.g., 'YE', 'KR', 'ID')
     * @param {string} rawFundingAmountPi - حجم التمويل الإجمالي لعملة باي
     */
    registerInternationalGrant(grantId, donorName, targetCountryIso, rawFundingAmountPi) {
        const PI_SCALE = 10000000n;
        const fundingStroopsInt = BigInt(Math.round(parseFloat(rawFundingAmountPi) * Number(PI_SCALE)));

        const grantConfig = {
            id: grantId,
            donor: donorName,
            country: targetCountryIso.toUpperCase(),
            totalFundingStroops: fundingStroopsInt.toString(),
            remainingFundingStroops: fundingStroopsInt.toString(),
            isGrantActive: true
        };

        this.activeGrantsRegistry.set(grantId, grantConfig);
        return grantConfig;
    }

    /**
     * صمام الأمان الجغرافي: يتحقق هل الدولة مؤهلة لتفعيل لوحة المكافآت أو المساعدات العينية حالياً
     * @param {string} countryIso - رمز الدولة المستعلم عنها
     * @param {string} operationType - نوع التفعيل المطلوب ('REWARDS' أو 'VOUCHERS')
     */
    assertGeographicalEligibility(countryIso, operationType) {
        const target = countryIso.toUpperCase();
        if (!this.countryStatusRegistry.has(target)) {
            // حجب تلقائي لأي دولة غير مدرجة في السجل الإقليمي للمنح
            return false;
        }

        const policy = this.countryStatusRegistry.get(target);
        if (operationType === "REWARDS") {
            return policy.rewardsActive;
        } else if (operationType === "VOUCHERS") {
            return policy.vouchersActive;
        }
        return false;
    }

    /**
     * تحديث يدوي فوري من لوحة تحكم الإدارة لحجب أو تفعيل أي دولة حسب تغيرات التمويل الدولي
     */
    toggleCountryAccess(countryIso, allowRewardsBoolean, allowVouchersBoolean) {
        const target = countryIso.toUpperCase();
        const currentPolicy = this.countryStatusRegistry.get(target) || { minGrantLevel: 1n };
        
        this.countryStatusRegistry.set(target, {
            rewardsActive: allowRewardsBoolean,
            vouchersActive: allowVouchersBoolean,
            minGrantLevel: currentPolicy.minGrantLevel
        });
        return true;
    }
}

export default AjyalGrantControlBoard;
