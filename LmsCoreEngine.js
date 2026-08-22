// LmsCoreEngine.js - مصمم لمنصة AJYAL لربط المحتوى التعليمي بمحرك المكافآت الصغير
const { AjyalGrantControlBoard } = require('./AjyalGrantControlBoard');

class LmsCoreEngine {
    constructor() {
        this.courses = new Map();
        this.studentProgress = new Map(); // piUserId -> { courseId: { completedLessons: [], quizScores: {} } }
    }

    // إنشاء مساق تعليمي جديد متوافق مع معايير اليونيسيف والمنهج الوطني
    createCourse(courseId, title, description, totalLessons, rewardInStroops) {
        this.courses.set(courseId, {
            courseId,
            title,
            description,
            totalLessons,
            rewardInStroops: BigInt(rewardInStroops), // التزام صارم بـ BigInt لمنع ثغرات الحساب العشري
            lessons: [],
            quizzes: []
        });
        return `Course ${courseId} initialized successfully.`;
    }

    // تسجيل تقدم الطالب في درس معين
    trackLessonCompletion(piUserId, courseId, lessonId) {
        if (!this.studentProgress.has(piUserId)) {
            this.studentProgress.set(piUserId, {});
        }
        const progress = this.studentProgress.get(piUserId);
        if (!progress[courseId]) {
            progress[courseId] = { completedLessons: [], quizScores: {} };
        }

        if (!progress[courseId].completedLessons.includes(lessonId)) {
            progress[courseId].completedLessons.push(lessonId);
        }
        
        return this.verifyCourseMilestone(piUserId, courseId);
    }

    // التحقق من استحقاق المكافأة المالية عند استكمال معايير المساق
    verifyCourseMilestone(piUserId, courseId) {
        const course = this.courses.get(courseId);
        const progress = this.studentProgress.get(piUserId)?.[courseId];

        if (!course || !progress) return { eligible: false, reason: "Missing data" };

        const completionRate = (progress.completedLessons.length / course.totalLessons) * 100;
        
        // إذا أكمل الطالب المساق بنسبة 100%، يتم تحفيز نظام الحوافز في بيئة BIGISH-YER
        if (progress.completedLessons.length === course.totalLessons) {
            return {
                eligible: true,
                reward: course.rewardInStroops.toString(),
                 message: `Sovereign milestone achieved for user ${piUserId}`
            };
        }
        return { eligible: false, completionRate };
    }
}

module.exports = { LmsCoreEngine };
