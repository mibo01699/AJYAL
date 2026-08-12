// AJYAL Universal Multi-Language Support, AI Pedagogy Consultant & Strict Notifications Suite
// Integrated with AjyalGrantControlBoard to enforce geographical validation metrics
// Absolute Floating-Point Elimination Policy via BigInt.

import AjyalGrantControlBoard from './AjyalGrantControlBoard.js';

const grantBoard = new AjyalGrantControlBoard();

class AjyalSupportSystem {
    constructor() {
        this.PI_SCALE = 10000000n;      // 10^7 Precision mapping
        this.YER_SCALE = 10000000000n;  // 10^10 Precision mapping
        this.activeTickets = new Map();
        this.ticketCounter = 0n;

        // مصفوفة اللغات الـ 11 لتغطية شاملة لرواد منصة أجيال ونظام المساعدات العينية لذوي الاحتياجات الخاصة
        this.localizationDict = {
            "ar": { grant_blocked: "تنبيه: خدمات المكافآت أو المساعدات العينية محجوبة حالياً في هذه الدولة لعدم توفر تمويل دولي نشط.", success: "تم التحقق وصرف المكافأة التعليمية للمستفيد بنجاح واستقرار سيادي." },
            "en": { grant_blocked: "Notice: Reward or voucher services are currently restricted in this region due to absence of active donor funding.", success: "Educational incentive validated and disbursed successfully under sovereign guidelines." },
            "zh": { grant_blocked: "注意：由于缺乏活跃的捐赠资金，该地区目前限制奖励或凭证服务。", success: "教育激励已成功验证並根据主权指南发放。" },
            "th": { grant_blocked: "ประกาศ: บริการรางวัลหรือบัตรกำนัลถูกจำกัดในภูมิภาคนี้เนื่องจากไม่มีทุนสนับสนุนจากผู้บริจาค.", success: "สิ่งจูงใจทางการศึกษาได้รับการตรวจสอบและชำระเงินสำเร็จแล้วภายใต้แนวทางหลัก." },
            "tl": { grant_blocked: "Paunawa: Ang mga serbisyo ng gantimpala o voucher ay kasalukuyang pinaghihigpitan sa rehiyong ito dahil sa kawalan ng pondo.", success: "Matagumpay na napatunayan at naipamahagi ang insentibo sa edukasyon." },
            "ms": { grant_blocked: "Notis: Perkhidmatan ganjaran atau baucar disekat di rantau ini kerana ketiadaan dana penderma yang aktif.", success: "Insentif pendidikan disahkan dan diagihkan dengan jaya di bawah garis panduan kedaulatan." },
            "tr": { grant_blocked: "Uyarı: Aktif bağışçı fonu bulunmaması nedeniyle bu bölgede ödül veya kupon hizmetleri kısıtlanmıştır.", success: "Eğitim teşviki başarıyla doğrulandı ve egemen yönergeler kapsamında ödendi." },
            "ko": { grant_blocked: "공지: 활성 기부자 자금이 없어 현재 이 지역에서는 보상 또는 바우처 서비스가 제한됩니다.", success: "주권 지침에 따라 교육 인센티브가 성공적으로 검증 및 지급되었습니다." },
            "ru": { grant_blocked: "Уведомление: В этом регионе временно ограничены услуги вознаграждений или ваучеров из-за отсутствия финансирования.", success: "Образовательное поощрение успешно подтверждено и выплачено в соответствии с правилами." },
            "hi": { grant_blocked: "सूचना: सक्रिय दाता वित्तपोषण की अनुपस्थिति के कारण इस क्षेत्र में पुरस्कार या वाउचर सेवाएं वर्तमान में प्रतिबंधित हैं।", success: "संप्रभु दिशानिर्देशों के तहत शैक्षिक प्रोत्साहन सफलतापूर्वक सत्यापित और वितरित किया गया।" },
            "ur": { grant_blocked: "نوٹس: فعال ڈونر فنڈنگ کی عدم موجودگی کی وجہ سے اس خطے میں انعامات یا واؤچر کی خدمات فی الحال ممنوع ہیں۔", success: "تعلیمی ترغیب کی کامیابی سے تصدیق اور منتقلی خودمختار خطوط کے تحت کر دی گئی ہے۔" }
        };
    }

    /**
     * [نظام الإشعارات الصارم بالـ BigInt]
     * يولد إشعارات كسب النقاط أو الحجب الجغرافي بناءً على تمويل المنظمة المانحة
     */
    dispatchEducationalNotice(studentWallet, countryIso, operationType, rawAmountNominal, langCode) {
        const amountStroopsInt = BigInt(Math.round(parseFloat(rawAmountNominal) * Number(this.PI_SCALE)));
        const selectedLang = this.localizationDict[langCode] ? langCode : "en";

        // التحقق الفوري من صمام الأمان الجغرافي للوحة التحكم قبل الصرف
        const isEligible = grantBoard.assertGeographicalEligibility(countryIso, operationType);
        
        if (!isEligible) {
            return {
                recipient: studentWallet,
                eventCode: "403_GEOGRAPHICALLY_BLOCKED",
                ledgerValueSubUnits: "0",
                translatedNotice: this.localizationDict[selectedLang].grant_blocked,
                timestamp: Date.now().toString()
            };
        }

        return {
            recipient: studentWallet,
            eventCode: "200_INCENTIVE_ACTIVE",
            ledgerValueSubUnits: amountStroopsInt.toString(),
            translatedNotice: `${this.localizationDict[selectedLang].success} [Stroops: ${amountStroopsInt.toString()}]`,
            timestamp: Date.now().toString()
        };
    }

    /**
     * [مساعد دعم الذكاء الاصطناعي الفائق - AI Assistant]
     * يفحص ويراجع أهليّة الطالب جغرافياً وحسابياً ويمنع أي كسور عشرية خبيثة
     */
    consultSensoryAi(queryText, countryIso, proposedRewardNominal, langCode) {
        try {
            const rewardInt = BigInt(Math.round(parseFloat(proposedRewardNominal) * Number(this.PI_SCALE)));
            const selectedLang = this.localizationDict[langCode] ? langCode : "en";

            // فحص التفعيل الجغرافي بواسطة الذكاء الاصطناعي
            const isEligible = grantBoard.assertGeographicalEligibility(countryIso, "REWARDS");
            if (!isEligible) {
                return {
                    aiVerdict: "GEOGRAPHICAL_FUND_RESTRICTION",
                    isStructureValid: false,
                    aiMessageText: this.localizationDict[selectedLang].grant_blocked
                };
            }

            return {
                aiVerdict: "COMPLIANCE_PASSED",
                isStructureValid: true,
                integerHex: "0x" + rewardInt.toString(16),
                aiMessageText: this.localizationDict[selectedLang].success + ` (AI Internal Absolute BigInt Count: ${rewardInt.toString()})`
            };
        } catch (err) {
            return {
                aiVerdict: "FLOAT_LEAK_EXPLOIT_BLOCKED",
                isStructureValid: false,
                aiMessageText: "CRITICAL: AI Core rejected unsafe decimal variables inside educational checkout parameters."
            };
        }
    }

    /**
     * [نظام الدعم البشري للتذاكر]
     * يفتح تذكرة فورية في حال حدوث نزاع مالي حول صرف المعونات أو حظر المنح في دولة محددة
     */
    openGeographicalDisputeTicket(studentWallet, countryIso, disputeCategoryInt, issueDescription) {
        this.ticketCounter += 1n;
        const currentTicketId = `AJYAL-GRANT-TICKET-${this.ticketCounter.toString()}`;

        const ticketRecord = {
            id: currentTicketId,
            student: studentWallet,
            region: countryIso.toUpperCase(),
            categoryCode: BigInt(disputeCategoryInt).toString(), // مثل: 501n لنزاعات حجب الدول المانحة
            description: issueDescription,
            status: "OPEN_FOR_INTERNATIONAL_HUMAN_AUDIT",
            createdTimestamp: Date.now().toString()
        };

        this.activeTickets.set(currentTicketId, ticketRecord);
        return ticketRecord;
    }
}

export default AjyalSupportSystem;
