// Yemen National Curriculum Ingestion and Management Engine - Phase 1
// Structural Design: Strict Hierarchical Integer Mapping for Conflict-Zone Operations
// Links Lesson Progress directly to individual wallet micro-incentives via wallet-core.js

class YemenCurriculumIngestion {
    constructor() {
        // قاعدة بيانات هيكلية مصفوفة المنهج لليمن - المرحلة الأولى (أرقام صحيحة ومعرفات فريدة)
        this.yemenCurriculumRegistry = new Map();
        this.lessonCounter = 0n;
    }

    /**
     * Ingests a new certified educational module belonging to the Yemeni National Curriculum Framework
     * @param {string} subjectName - Name of the course (e.g., 'Digital Skills', 'Mathematics')
     * @param {string} gradeLevelInteger - Target academic grade expressed as absolute code
     * @param {string} topicTitle - Specific lesson theme
     * @param {string} rawBaseRewardPi - nominal Pi token allocation earned upon completion
     * @returns {object} Struct detailing the curriculum entry configuration
     */
    ingestYemeniLesson(subjectName, gradeLevelInteger, topicTitle, rawBaseRewardPi) {
        this.lessonCounter += 1n;
        const generatedLessonId = `YEM-CURRICULUM-ID-${this.lessonCounter.toString()}`;
        
        // Scale incentive immediately to 7 decimal places Stroops to avoid arithmetic float drift
        const PI_SCALE = 10000000n;
        const scaledRewardStroops = BigInt(Math.round(parseFloat(rawBaseRewardPi) * Number(PI_SCALE)));

        const curriculumEntry = {
            lessonId: generatedLessonId,
            subject: subjectName,
            gradeCode: BigInt(gradeLevelInteger).toString(),
            title: topicTitle,
            baseRewardStroops: scaledRewardStroops.toString(), // يتم الحفظ بصيغة نصية آمنة للرقم الصحيح الكبير
            governorateTargetRestriction: "ALL_YEMEN_REGIONS", // المرحلة الأولى: تغطية شاملة لكافة المحافظات اليمنية
            ingestedTimestamp: Date.now().toString()
        };

        this.yemenCurriculumRegistry.set(generatedLessonId, curriculumEntry);
        return curriculumEntry;
    }

    /**
     * Extracts lesson criteria to evaluate matching rewards for student progress
     */
    fetchLessonData(lessonId) {
        if (!this.yemenCurriculumRegistry.has(lessonId)) {
            throw new Error(`Curriculum Registry Exception: Lesson ID ${lessonId} is not recognized under Yemeni Phase 1 database.`);
        }
        return this.yemenCurriculumRegistry.get(lessonId);
    }
}

export default YemenCurriculumIngestion;
