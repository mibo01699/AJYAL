// ============================================================
// الملف: server.js - بوابة AJYAL (متوافقة مع Vercel)
// الإصدار: 3.0.0 - مع أمان مدمج بدون حزم خارجية إضافية
// ============================================================

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ============================================================
// 🔒 طبقات الحماية الأساسية (بدون حزم إضافية)
// ============================================================

// 1. حماية رؤوس HTTP
app.use(helmet());

// 2. تحديد معدل الطلبات (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100,
    message: { error: 'تم تجاوز عدد الطلبات المسموح بها. يرجى المحاولة لاحقاً.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// 3. حماية إضافية للروابط الحساسة
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'تم تجاوز عدد المحاولات المسموح بها. تم حظر عنوان IP مؤقتاً.' }
});
app.use('/api/admin/curriculum/', strictLimiter);

// 4. منع هجمات XSS و SQL Injection (يدوياً)
app.use((req, res, next) => {
    // تنظيف مدخلات POST
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                // إزالة الأكواد الضارة
                req.body[key] = req.body[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '')
                    .replace(/eval\s*\(/gi, '')
                    .replace(/exec\s*\(/gi, '');
            }
        }
    }
    next();
});

// التفعيلات الأساسية
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// 🛡️ نظام كشف التهديدات الأمنية (مدمج)
// ============================================================

const threatDetector = {
    maliciousPatterns: [
        /<\s*script/i,
        /(\b)(on\w+)=/i,
        /(\b)javascript:/i,
        /eval\s*\(/i,
        /exec\s*\(/i,
        /system\s*\(/i,
        /\.\.\/\.\.\//i,
        /(\b)union\s+select/i,
        /(\b)select\s+.*\s+from/i,
        /(\b)drop\s+table/i,
    ],

    scanFileContent(buffer, filename) {
        try {
            const content = buffer.toString('utf8');
            for (const pattern of this.maliciousPatterns) {
                if (pattern.test(content)) {
                    return { detected: true, threat: pattern.toString(), reason: 'محتوى الملف يحتوي على أكواد ضارة محتملة' };
                }
            }
            const dangerousExtensions = ['.exe', '.bat', '.sh', '.cmd', '.vbs', '.js', '.jar', '.apk'];
            const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
            if (dangerousExtensions.includes(ext)) {
                return { detected: true, threat: 'executable_file', reason: `الملفات ذات الامتداد ${ext} غير مسموح بها` };
            }
            return { detected: false };
        } catch (error) {
            return { detected: false, warning: 'تعذر فحص المحتوى' };
        }
    },

    scanFile(buffer, filename, mimetype) {
        const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'image/jpeg', 'image/png', 'text/plain', 'text/csv'];
        if (!allowedMimes.includes(mimetype)) {
            return { detected: true, threat: 'invalid_mime_type', reason: `نوع الملف غير مسموح به: ${mimetype}` };
        }
        if (buffer.length > 50 * 1024 * 1024) {
            return { detected: true, threat: 'file_too_large', reason: 'حجم الملف يتجاوز الحد المسموح به (50 ميجابايت)' };
        }
        return this.scanFileContent(buffer, filename);
    },

    logThreat(ip, threatType, details) {
        console.warn(`🚨 تهديد أمني تم اكتشافه: IP=${ip}, النوع=${threatType}`, details);
    }
};

// ============================================================
// 📚 نظام إدارة رفع المناهج التعليمية
// ============================================================

const curriculumUploads = new Map();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.zip', '.jpg', '.jpeg', '.png', '.txt', '.csv'];
        const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error(`امتداد الملف غير مسموح به: ${ext}`));
        }
        cb(null, true);
    }
});

// إنشاء رابط رفع
app.post('/api/admin/curriculum/create-upload-link', (req, res) => {
    try {
        const { gradeLevel, subject, description } = req.body;
        const adminId = req.headers['x-admin-id'];
        if (!adminId) return res.status(401).json({ error: 'غير مصرح: مطلوب معرف المسؤول' });
        if (!gradeLevel || !subject) return res.status(400).json({ error: 'المستوى الدراسي والمادة مطلوبان' });

        const linkId = crypto.randomBytes(32).toString('hex') + '-' + Date.now().toString(36);
        const uploadToken = crypto.randomBytes(64).toString('hex');
        const baseUrl = process.env.BASE_URL || 'https://ajyal.vercel.app';
        const uploadLink = `${baseUrl}/api/admin/curriculum/upload/${linkId}?token=${uploadToken}`;

        curriculumUploads.set(linkId, {
            gradeLevel, subject, description: description || '',
            status: 'pending', createdAt: new Date().toISOString(),
            createdBy: adminId, uploadToken, ipAddress: req.ip,
            attempts: 0, maxAttempts: 3,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.json({ success: true, linkId, uploadLink, expiresAt: curriculumUploads.get(linkId).expiresAt, message: 'تم إنشاء رابط الرفع بنجاح.' });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء رابط الرفع' });
    }
});

// استقبال ملفات المناهج
app.post('/api/admin/curriculum/upload/:linkId', upload.single('curriculumFile'), (req, res) => {
    try {
        const { linkId } = req.params;
        const { token } = req.query;
        const clientIP = req.ip;

        if (!curriculumUploads.has(linkId)) {
            return res.status(404).json({ error: 'رابط الرفع غير صالح أو منتهي الصلاحية.' });
        }

        const uploadData = curriculumUploads.get(linkId);
        if (new Date() > new Date(uploadData.expiresAt)) {
            uploadData.status = 'expired';
            curriculumUploads.set(linkId, uploadData);
            return res.status(410).json({ error: 'انتهت صلاحية رابط الرفع.' });
        }

        if (!token || token !== uploadData.uploadToken) {
            threatDetector.logThreat(clientIP, 'invalid_token', { linkId });
            return res.status(403).json({ error: 'رمز التحقق غير صحيح.' });
        }

        if (uploadData.status !== 'pending') {
            return res.status(400).json({ error: 'تم استخدام هذا الرابط بالفعل.' });
        }

        uploadData.attempts += 1;
        curriculumUploads.set(linkId, uploadData);

        if (uploadData.attempts > uploadData.maxAttempts) {
            uploadData.status = 'blocked';
            curriculumUploads.set(linkId, uploadData);
            return res.status(429).json({ error: 'تم تجاوز عدد المحاولات المسموح بها.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'لم يتم إرفاق أي ملف.' });
        }

        const securityCheck = threatDetector.scanFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        if (securityCheck.detected) {
            threatDetector.logThreat(clientIP, securityCheck.threat, { linkId, filename: req.file.originalname });
            uploadData.status = 'blocked';
            curriculumUploads.set(linkId, uploadData);
            return res.status(400).json({ error: 'تم اكتشاف محتوى ضار في الملف.', reason: securityCheck.reason });
        }

        const fileInfo = {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
            checksum: crypto.createHash('sha256').update(req.file.buffer).digest('hex')
        };

        uploadData.status = 'uploaded';
        uploadData.fileInfo = fileInfo;
        curriculumUploads.set(linkId, uploadData);

        res.json({
            success: true,
            message: 'تم استلام ملف المنهج بنجاح.',
            file: { name: fileInfo.filename, size: fileInfo.size, type: fileInfo.mimetype },
            curriculum: { gradeLevel: uploadData.gradeLevel, subject: uploadData.subject }
        });
    } catch (error) {
        console.error('❌ خطأ في رفع الملف:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء رفع الملف.' });
    }
});

// التحقق من حالة الرابط
app.get('/api/admin/curriculum/status/:linkId', (req, res) => {
    try {
        const { linkId } = req.params;
        const adminId = req.headers['x-admin-id'];
        if (!adminId) return res.status(401).json({ error: 'غير مصرح' });
        if (!curriculumUploads.has(linkId)) return res.status(404).json({ error: 'الرابط غير موجود.' });

        const data = curriculumUploads.get(linkId);
        res.json({
            success: true,
            data: {
                gradeLevel: data.gradeLevel,
                subject: data.subject,
                status: data.status,
                createdAt: data.createdAt,
                expiresAt: data.expiresAt,
                fileInfo: data.fileInfo || null
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء التحقق من حالة الرابط' });
    }
});

// إلغاء الرابط
app.delete('/api/admin/curriculum/revoke/:linkId', (req, res) => {
    try {
        const { linkId } = req.params;
        const adminId = req.headers['x-admin-id'];
        if (!adminId) return res.status(401).json({ error: 'غير مصرح' });
        if (!curriculumUploads.has(linkId)) return res.status(404).json({ error: 'الرابط غير موجود.' });

        const data = curriculumUploads.get(linkId);
        data.status = 'revoked';
        curriculumUploads.set(linkId, data);

        res.json({ success: true, message: 'تم إلغاء رابط الرفع بنجاح.' });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء إلغاء الرابط' });
    }
});

// ============================================================
// نقاط النهاية الأساسية
// ============================================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'online', service: 'AJYAL', version: '3.0.0', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.json({ message: '🦅 AJYAL API is running', version: '3.0.0', endpoints: ['/api/health', '/api/voucher/*', '/api/admin/curriculum/*'] });
});

// ============================================================
// معالج الأخطاء
// ============================================================

app.use((err, req, res, next) => {
    console.error('❌ خطأ:', err);
    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') return res.status(413).json({ error: 'حجم الملف كبير جداً.' });
        return res.status(400).json({ error: `خطأ في رفع الملف: ${err.message}` });
    }
    res.status(500).json({ error: 'حدث خطأ غير متوقع في الخادم.' });
});

// ============================================================
// ✅ نقطة الدخول لـ Vercel
// ============================================================
module.exports = app;