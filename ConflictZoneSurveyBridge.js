// ConflictZoneSurveyBridge.js - جسر تقييم الاحتياجات الإنسانية في مناطق النزاع
const crypto = require('crypto');

class ConflictZoneSurveyBridge {
    constructor() {
        this.surveys = new Map(); // surveyId -> surveyDetails
        this.responses = [];
    }

    // إنشاء استطلاع احتياجات للمانحين الدوليين
    createAssessment(surveyId, title, targetRegionCode) {
        this.surveys.set(surveyId, {
            surveyId,
            title,
            targetRegionCode: Number(targetRegionCode),
            active: true
        });
        return `Assessment ${surveyId} activated for region ${targetRegionCode}`;
    }

    // تسجيل إجابة الطالب وتحديد مستوى الاحتياج (غذائي / طبي / تعليمي)
    submitResponse(piUserId, surveyId, infrastructureRating, needsSpecialAid = false) {
        const payload = {
            responseId: `SURVEY-RESP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            piUserId,
            surveyId,
            infrastructureRating: Number(infrastructureRating), // مقياس من 1 إلى 5 لجودة خدمات الاتصالات
            needsSpecialAid,
            processedForAid: false,
            timestamp: new Date().toISOString()
        };
        this.responses.push(payload);
        return payload;
    }

    // تصفية وحصر الطلاب ذوي الاحتياجات الحرجة لإرسال البيانات إلى محرك المساعدات GAV
    getHighPriorityAidTargets() {
        return this.responses.filter(resp => resp.needsSpecialAid && !resp.processedForAid);
    }
}

module.exports = { ConflictZoneSurveyBridge };
