// AjyalSupportSystem.js - محرك الدعم متعدد اللغات ومستشار الذكاء الاصطناعي التربوي الشامل (Protocol 26)
// يدعم 11 لغة عالمية لإشعارات الطلاب وأولياء أمورهم والمنظمات الدولية المانحة بمناطق النزاع

const crypto = require('crypto');

class AjyalSupportSystem {
    constructor() {
        // قاموس اللغات الـ 11 المعتمدة رسمياً في مصفوفة أجيال الإنسانية والتعليمية
        this.locales = {
            ar: {
                welcome: "مرحباً بك في منصة أجيال التعليمية السيادية.",
                lesson_complete: "تهانينا! لقد أكملت بنجاح الدرس: {lessonId} في مساق {courseId}.",
                reward_issued: "🔒 تم قفل الحافز المالي بنجاح وصرف: {amount} Stroops إلى حسابك المشفر.",
                voucher_ready: "🎫 قسيمة الدعم العيني لـ [GAV - طريق البخور] جاهزة برقم: {voucherCode}. توجه لأقرب منفذ بيع معتمد مع قفل الأمان الجغرافي (YEM-887).",
                ai_advice: "🤖 مستشار أجيال الذكي: بناءً على أدائك، ننصحك بالتركيز على مهارات الحساب والمنطق اللامركزي لتأهيلك لسوق العمل السيادي."
            },
            en: {
                welcome: "Welcome to AJYAL Sovereign Educational Platform.",
                lesson_complete: "Congratulations! You successfully completed lesson: {lessonId} in course {courseId}.",
                reward_issued: "🔒 Financial micro-grant safely locked. Disbursed: {amount} Stroops to your cryptographic ledger.",
                voucher_ready: "🎫 In-kind aid voucher from [GAV] is active: {voucherCode}. Proceed to the nearest certified merchant under geofence (YEM-887).",
                ai_advice: "🤖 AJYAL AI Advisor: Based on your metrics, focus on cryptographic mathematics to enhance your readiness for the decentralized economy."
            },
            zh: { // الصينية
                welcome: "欢迎来到 AJYAL 主权教育平台。",
                lesson_complete: "恭喜！您成功完成了课程 {courseId} 中的第 {lessonId} 课。",
                reward_issued: "🔒 经济微型资助已安全锁定。已向您的加密账本发放：{amount} Stroops。",
                voucher_ready: "🎫 来自 [GAV] 的实物援助凭证已激活：{voucherCode}。请前往地理围栏（YEM-887）内最近的认证商户。"
            },
            th: { // التايلاندية
                welcome: "ยินดีต้อนรับสู่แพลตฟอร์มการศึกษาอธิปไตย AJYAL",
                lesson_complete: "ยินดีด้วย! คุณสำเร็จบทเรียน: {lessonId} ในหลักสูตร {courseId} แล้ว",
                reward_issued: "🔒 ทุนสนับสนุนทางการเงินถูกล็อคอย่างปลอดภัยแล้ว จ่าย: {amount} Stroops เข้าสู่บัญชีเข้ารหัสของคุณ"
            },
            tl: { // التاغالوغية - الفلبين
                welcome: "Maligayang pagdating sa AJYAL Sovereign Educational Platform.",
                lesson_complete: "Pagbati! Matagumpay mong natapos ang aralin: {lessonId} sa kurso {courseId}.",
                reward_issued: "🔒 Micro-grant na pinansyal ay ligtas na naka-lock. Ipinamahagi: {amount} Stroops sa iyong cryptographic ledger."
            },
            ms: { // الماليزية
                welcome: "Selamat datang ke Platform Pendidikan Berdaulat AJYAL.",
                lesson_complete: "Tahniah! Anda berjaya menyelesaikan pelajaran: {lessonId} dalam kursus {courseId}.",
                reward_issued: "🔒 Geran mikro kewangan dikunci dengan selamat. Disalurkan: {amount} Stroops ke lebel kriptografi anda."
            },
            tr: { // التركية
                welcome: "AJYAL Egemen Eğitim Platformuna Hoş Geldiniz.",
                lesson_complete: "Tebrikler! {courseId} kursundaki {lessonId} dersini başarıyla tamamladınız.",
                reward_issued: "🔒 Finansal mikro hibe güvenli bir şekilde kilitlendi. Kriptografik hesabınıza {amount} Stroops aktarıldı."
            },
            ko: { // الكورية
                welcome: "AJYAL 주권 교육 플랫폼에 오신 것을 환영합니다.",
                lesson_complete: "축하합니다! {courseId} 과정의 {lessonId} 과를 성공적으로 완료했습니다.",
                reward_issued: "🔒 재정적 마이크로 보조금이 안전하게 잠겼습니다. 귀하의 암호화 장부에 {amount} Stroops가 지급되었습니다."
            },
            ru: { // الروسية
                welcome: "Добро пожаловать на суверенную образовательную платформу AJYAL.",
                lesson_complete: "Поздравляем! Вы успешно завершили урок: {lessonId} в курсе {courseId}.",
                reward_issued: "🔒 Финансовый микрогрант надежно заблокирован. Выплачено: {amount} Stroops на ваш криптографический реестр."
            },
            hi: { // الهندية
                welcome: "AJYAL संप्रभु शैक्षिक मंच पर आपका स्वागत है।",
                lesson_complete: "बधाई हो! आपने {courseId} पाठ्यक्रम में पाठ: {lessonId} सफलतापूर्वक पूरा कर लिया है।",
                reward_issued: "🔒 वित्तीय माइक्रो-अनुदान सुरक्षित रूप से लॉक कर दिया गया है। आपके क्रिप्टोग्राफिक लेज़र में {amount} Stroops वितरित किए गए।"
            },
            ur: { // الأوردية
                welcome: "AJYAL مقتدر تعلیمی پلیٹ فارم پر خوش آمدید۔",
                lesson_complete: "مبارک ہو! آپ نے {courseId} کورس میں سبق: {lessonId} کامیابی کے ساتھ مکمل کر لیا ہے۔",
                reward_issued: "🔒 مالیاتی مائیکرو گرانٹ کو محفوظ طریقے سے لاک کر دیا گیا ہے۔ آپ کے کرپٹوگرافک لیجر میں {amount} Stroops منتقل کر دیے گئے۔"
            }
        };
    }

    // 1. نظام صياغة الإشعارات المرنة الفورية واستبدال المتغيرات الحسابية واللوجستية
    formatNotification(langCode, messageKey, variables = {}) {
        const selectedLang = this.locales[langCode] || this.locales['ar']; // العودة للعربية كخيار سيادي أساسي
        let messageString = selectedLang[messageKey] || "";

        // معالجة وحقن المتغيرات الذكية داخل نصوص السلاسل البرمجية
        for (const [key, value] of Object.entries(variables)) {
            messageString = messageString.replace(new RegExp(`{${key}}`, 'g'), value);
        }

        return {
            lang: langCode,
            key: messageKey,
            compiledText: messageString,
            hashIntegrity: crypto.createHash('sha256').update(messageString).digest('hex'),
            deliveryNetwork: "LOW_BANDWIDTH_SMS_AND_MESH_ROUTING"
        };
    }

    // 2. مستشار الذكاء الاصطناعي التربوي المدمج (Edge AI Pedagogical Consultant Simulation)
    // يقدم نصائح تربوية صلبة باللغات المختلفة دون استهلاك حزم الإنترنت
    getAIPedagogicalAdvice(langCode, currentAcademicScore) {
        const score = Number(currentAcademicScore);
        const selectedLang = this.locales[langCode] || this.locales['ar'];
        
        if (score >= 85) {
            return selectedLang.ai_advice || this.locales['ar'].ai_advice;
        } else {
            return langCode === 'en' 
                ? "🤖 AJYAL AI Advisor: Excellent effort. We suggest reviewing basic algebra loops to unlock higher level micro-grants."
                : "🤖 مستشار أجيال الذكي: مجهود رائع. نقترح عليك مراجعة حلقات الجبر الأساسية لفتح قنوات حوافز مالية أكبر في الدورات القادمة.";
        }
    }
}

module.exports = { AjyalSupportSystem };
