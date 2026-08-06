// ============================================================
// الملف: tests/ajyal.test.js
// المسار: AJYAL/tests/ajyal.test.js
// الدور: اختبارات آلية للمنطق الأساسي
// ============================================================

const { authenticatePiUser, enrollStudent, updateProgress } = require('../ajyal-core');

describe('AJYAL Core Functions', () => {
    test('should authenticate a Pi user', () => {
        const user = authenticatePiUser('GABC123');
        expect(user).toHaveProperty('id');
        expect(user.piUserId).toBe('GABC123');
    });

    test('should enroll a student in a course', () => {
        const enrollment = enrollStudent('user_123', 1);
        expect(enrollment).toHaveProperty('id');
        expect(enrollment.status).toBe('active');
    });

    test('should update student progress', () => {
        const enrollment = enrollStudent('user_456', 2);
        const updated = updateProgress(enrollment.id, 50);
        expect(updated.progress).toBe(50);
    });
});