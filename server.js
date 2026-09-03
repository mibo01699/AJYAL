// ============================================================
// الملف: server.js - بوابة AJYAL (متوافقة مع Vercel)
// الدور: التعليم، المساعدات، الحوافز، ذوي الاحتياجات الخاصة
// الإصدار: 2.0.0 - مع دعم رفع المناهج الآمن
// ============================================================

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// ============================================================
// 🔒 طبقات الحماية المتقدمة (Security Layers)
// ============================================================

// 1. حماية رؤوس HTTP
app.use(helmet());

// 2. منع هجمات XSS
app.use(xss());

// 3. منع هجمات حقن NoSQL
app.use(mongoSanitize());

// 4. تحديد معدل الطلبات (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // حد أقصى 100 طلب لكل IP
    message: {
        error: 'تم تجاوز عدد الطلبات المسموح بها. يرجى المحاولة لاحقاً.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// 5. تحديات إضافية للروابط الحساسة
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // ساعة واحدة
    max: 5, // حد أقصى 5 محاولات
    message: {
        error: 'تم تجاوز عدد المحاولات المسموح بها. تم حظر عنوان IP مؤقتاً.'
    }
});
app.use('/api/admin/curriculum/', strictLimiter);

// ============================================================
// التفعيلات الأساسية
// ============================================================
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-id', 'x-upload-token']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// 🛡️ نظام كشف التهديدات الأمنية (Threat Detection)
// ============================================================

const threatDetector = {
    // قائمة بأنماط الهجمات المعروفة
    maliciousPatterns: [
        /<\s*script/i, // XSS
        /(\b)(on\w+)=/i, // XSS events
        /(\b)javascript:/i, // XSS protocol
        /(\b)data:/i, // Data URI attacks
        /(\b)vbscript:/i, // VBScript attacks
        /eval\s*\(/i, // eval() calls
        /exec\s*\(/i, // exec() calls
        /system\s*\(/i, // system() calls
        /\.\.\/\.\.\//i, // Path traversal
        /\%2e\%2e\%2f/i, // URL encoded path traversal
        /\%2e\%2e\\/i, // URL encoded path traversal (Windows)
        /(\b)union\s+select/i, // SQL Injection
        /(\b)select\s+.*\s+from/i, // SQL Injection
        /(\b)drop\s+table/i, // SQL Injection
        /(\b)insert\s+into/i, // SQL Injection
        /(\b)update\s+.*\s+set/i, // SQL Injection
        /(\b)delete\s+from/i, // SQL Injection
        /(\b)exec\s+.*\s+sp_/i, // SQL Injection (Stored Procedures)
    ],

    // الكشف عن الملفات الضارة (بالمحتوى)
    scanFileContent(buffer, filename) {
        // تحويل الملف إلى نص للفحص (للملفات النصية فقط)
        try {
            const content = buffer.toString('utf8');
            
            // فحص المحتوى ضد الأنماط الضارة
            for (const pattern of this.maliciousPatterns) {
                if (pattern.test(content)) {
                    return {
                        detected: true,
                        threat: pattern.toString(),
                        reason: 'محتوى الملف يحتوي على أكواد ضارة محتملة'
                    };
                }
            }

            // فحص إضافي للملفات القابلة للتنفيذ
            const dangerousExtensions = ['.exe', '.bat', '.sh', '.cmd', '.vbs', '.js', '.jar', '.apk', '.dmg', '.pkg', '.deb', '.rpm'];
            const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
            if (dangerousExtensions.includes(ext)) {
                return {
                    detected: true,
                    threat: 'executable_file',
                    reason: `الملفات ذات الامتداد ${ext} غير مسموح بها`
                };
            }

            // فحص إضافي للضغطات المزدوجة (ZIP Bombs)
            if (buffer.length > 0 && filename.endsWith('.zip')) {
                // فحص بسيط: إذا كان الملف صغيراً لكنه مضغوط بشكل مفرط
                // (في بيئة حقيقية، يمكن استخدام مكتبة متخصصة لفحص ZIP)
                if (buffer.length < 1024 * 1024) { // أقل من 1 ميجابايت
                    // قد يكون هجوماً، لكن لا نمنعه بشكل تام، فقط نسجل تحذيراً
                    console.warn(`⚠️ ملف مضغوط صغير الحجم: ${filename} (${buffer.length} bytes)`);
                }
            }

            return { detected: false };
        } catch (error) {
            // إذا فشل التحويل (ملف ثنائي)، نمرره مع تحذير
            console.warn(`⚠️ تعذر فحص محتوى الملف: ${filename}`);
            return { detected: false, warning: 'تعذر فحص المحتوى' };
        }
    },

    // فحص الملف للكشف عن الفيروسات (محاكاة)
    scanFile(buffer, filename, mimetype) {
        // 1. فحص الامتداد والاسم
        const nameCheck = this.scanFileName(filename);
        if (nameCheck.detected) {
            return nameCheck;
        }

        // 2. فحص نوع الملف المسموح به
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/zip',
            'application/x-zip-compressed',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'text/plain',
            'text/csv'
        ];

        if (!allowedMimes.includes(mimetype)) {
            return {
                detected: true,
                threat: 'invalid_mime_type',
                reason: `نوع الملف غير مسموح به: ${mimetype}`
            };
        }

        // 3. فحص حجم الملف (منع هجمات DoS)
        const MAX_SIZE = 50 * 1024 * 1024; // 50 ميجابايت
        if (buffer.length > MAX_SIZE) {
            return {
                detected: true,
                threat: 'file_too_large',
                reason: `حجم الملف (${(buffer.length / (1024 * 1024)).toFixed(2)} ميجابايت) يتجاوز الحد المسموح به (50 ميجابايت)`
            };
        }

        // 4. فحص المحتوى
        const contentCheck = this.scanFileContent(buffer, filename);
        if (contentCheck.detected) {
            return contentCheck;
        }

        return { detected: false };
    },

    // فحص اسم الملف
    scanFileName(filename) {
        // منع أسماء الملفات الضارة
        const dangerousNames = [
            /\.\.\./,
            /\.\.\//,
            /\%00/,
            /\\0/,
            /;/
        ];

        for (const pattern of dangerousNames) {
            if (pattern.test(filename)) {
                return {
                    detected: true,
                    threat: 'malicious_filename',
                    reason: `اسم الملف يحتوي على أحرف غير مسموح بها: ${pattern}`
                };
            }
        }

        // منع الملفات المخفية
        if (filename.startsWith('.')) {
            return {
                detected: true,
                threat: 'hidden_file',
                reason: 'الملفات المخفية غير مسموح بها'
            };
        }

        return { detected: false };
    },

    // فحص عناوين IP الضارة
    isMaliciousIP(ip) {
        // قائمة عناوين IP معروفة بالهجمات (مثال)
        const knownMaliciousIPs = [
            // يمكن إضافة قائمة محدثة من مصادر موثوقة
        ];

        // التحقق من عناوين IP الخاصة
        if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.')) {
            return false; // عناوين داخلية - نسمح بها
        }

        return knownMaliciousIPs.includes(ip);
    },

    // تسجيل الهجمات
    logThreat(ip, threatType, details) {
        console.warn(`🚨 تهديد أمني تم اكتشافه:`);
        console.warn(`   📍 IP: ${ip}`);
        console.warn(`   🛡️ النوع: ${threatType}`);
        console.warn(`   📝 التفاصيل:`, details);
        console.warn(`   🕒 الوقت: ${new Date().toISOString()}`);
        
        // في بيئة حقيقية، يتم تسجيل التهديد في قاعدة بيانات أو إرسال تنبيه
    }
};

// ============================================================
// 📚 نظام إدارة رفع المناهج التعليمية (مع الأمان المتقدم)
// ============================================================

// تخزين مؤقت للروابط (في بيئة حقيقية، يُستخدم قاعدة بيانات مشفرة)
const curriculumUploads = new Map();

// تكوين Multer مع إعدادات أمان متقدمة
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 ميجابايت
        files: 1 // ملف واحد فقط لكل طلب
    },
    // التحقق من الملف قبل التحميل (للكشف المبكر عن التهديدات)
    fileFilter: (req, file, cb) => {
        // التحقق من الامتدادات المسموح بها مسبقاً
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.txt', '.csv'];
        const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error(`امتداد الملف غير مسموح به: ${ext}`));
        }
        
        // التحقق من نوع MIME (تم بالفعل في threatDetector)
        cb(null, true);
    }
});

/**
 * API: إنشاء رابط لرفع المناهج (للاستخدام الإداري) - مع أمان متقدم
 * POST /api/admin/curriculum/create-upload-link
 */
app.post('/api/admin/curriculum/create-upload-link', (req, res) => {
    try {
        const { gradeLevel, subject, description } = req.body;
        const adminId = req.headers['x-admin-id'];
        
        // التحقق من وجود Admin ID
        if (!adminId) {
            return res.status(401).json({ error: 'غير مصرح: مطلوب معرف المسؤول' });
        }

        // التحقق من صحة البيانات
        if (!gradeLevel || !subject) {
            return res.status(400).json({ error: 'المستوى الدراسي والمادة مطلوبان' });
        }

        // إنشاء معرف فريد للرابط مع تشفير إضافي
        const linkId = crypto.randomBytes(32).toString('hex') + '-' + Date.now().toString(36);
        
        // إنشاء رمز تحقق إضافي للرابط
        const uploadToken = crypto.randomBytes(64).toString('hex');
        
        // إنشاء الرابط الخارجي (مع رمز التحقق)
        const baseUrl = process.env.BASE_URL || 'https://ajyal.vercel.app';
        const uploadLink = `${baseUrl}/api/admin/curriculum/upload/${linkId}?token=${uploadToken}`;

        // تخزين معلومات المنهج مع بيانات الأمان
        curriculumUploads.set(linkId, {
            gradeLevel,
            subject,
            description: description || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: adminId,
            uploadToken: uploadToken, // تخزين رمز التحقق
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            attempts: 0,
            maxAttempts: 3, // عدد المحاولات المسموح بها
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 أيام
        });

        // تسجيل العملية
        console.log(`🔑 تم إنشاء رابط رفع للمنهج: ${subject} (الصف ${gradeLevel}) بواسطة ${adminId}`);

        res.json({
            success: true,
            linkId,
            uploadLink,
            expiresAt: curriculumUploads.get(linkId).expiresAt,
            message: 'تم إنشاء رابط الرفع بنجاح. الرابط صالح لمدة 7 أيام.'
        });

    } catch (error) {
        console.error('❌ خطأ في إنشاء رابط الرفع:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء رابط الرفع' });
    }
});

/**
 * API: استقبال ملفات المناهج (رابط خارجي مع أمان متقدم)
 * POST /api/admin/curriculum/upload/:linkId
 */
app.post('/api/admin/curriculum/upload/:linkId', upload.single('curriculumFile'), async (req, res) => {
    try {
        const { linkId } = req.params;
        const { token } = req.query;
        const clientIP = req.ip;
        const userAgent = req.headers['user-agent'];

        // 1. التحقق من وجود الرابط
        if (!curriculumUploads.has(linkId)) {
            threatDetector.logThreat(clientIP, 'invalid_link', { linkId, reason: 'الرابط غير موجود' });
            return res.status(404).json({ error: 'رابط الرفع غير صالح أو منتهي الصلاحية.' });
        }

        const uploadData = curriculumUploads.get(linkId);

        // 2. التحقق من صلاحية الرابط (تاريخ الانتهاء)
        if (new Date() > new Date(uploadData.expiresAt)) {
            uploadData.status = 'expired';
            curriculumUploads.set(linkId, uploadData);
            threatDetector.logThreat(clientIP, 'expired_link', { linkId, reason: 'انتهت صلاحية الرابط' });
            return res.status(410).json({ error: 'انتهت صلاحية رابط الرفع. يرجى طلب رابط جديد.' });
        }

        // 3. التحقق من رمز التحقق (Token)
        if (!token || token !== uploadData.uploadToken) {
            threatDetector.logThreat(clientIP, 'invalid_token', { linkId, reason: 'رمز التحقق غير صحيح' });
            return res.status(403).json({ error: 'رمز التحقق غير صحيح. يرجى استخدام الرابط الصحيح.' });
        }

        // 4. التحقق من حالة الرابط
        if (uploadData.status !== 'pending') {
            threatDetector.logThreat(clientIP, 'link_already_used', { linkId, status: uploadData.status });
            return res.status(400).json({ error: 'تم استخدام هذا الرابط بالفعل.' });
        }

        // 5. تحديث عدد المحاولات
        uploadData.attempts += 1;
        curriculumUploads.set(linkId, uploadData);

        // 6. التحقق من عدد المحاولات المسموح به
        if (uploadData.attempts > uploadData.maxAttempts) {
            uploadData.status = 'blocked';
            curriculumUploads.set(linkId, uploadData);
            threatDetector.logThreat(clientIP, 'max_attempts_exceeded', { linkId, attempts: uploadData.attempts });
            return res.status(429).json({ error: 'تم تجاوز عدد المحاولات المسموح بها. تم حظر الرابط.' });
        }

        // 7. التحقق من وجود ملف
        if (!req.file) {
            threatDetector.logThreat(clientIP, 'no_file_uploaded', { linkId });
            return res.status(400).json({ error: 'لم يتم إرفاق أي ملف. يرجى إرفاق ملف المنهج (PDF, DOCX, ZIP).' });
        }

        // ============================================================
        // 🛡️ فحص الملف الأمني المتقدم
        // ============================================================

        // 8. فحص الملف للكشف عن التهديدات
        const securityCheck = threatDetector.scanFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        if (securityCheck.detected) {
            threatDetector.logThreat(clientIP, securityCheck.threat, {
                linkId,
                filename: req.file.originalname,
                reason: securityCheck.reason
            });
            
            // حظر الرابط بعد اكتشاف تهديد
            uploadData.status = 'blocked';
            uploadData.blockReason = securityCheck.reason;
            curriculumUploads.set(linkId, uploadData);
            
            return res.status(400).json({
                error: 'تم اكتشاف محتوى ضار في الملف.',
                reason: securityCheck.reason,
                threatType: securityCheck.threat
            });
        }

        // 9. معالجة الملف الآمن
        const fileInfo = {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
            uploadedFromIP: clientIP,
            securityPassed: true,
            checksum: crypto.createHash('sha256').update(req.file.buffer).digest('hex')
        };

        // 10. تحديث حالة الرابط
        uploadData.status = 'uploaded';
        uploadData.fileInfo = fileInfo;
        uploadData.uploadedAt = new Date().toISOString();
        uploadData.uploadedFromIP = clientIP;
        curriculumUploads.set(linkId, uploadData);

        // 11. تسجيل نجاح العملية
        console.log(`✅ تم استلام منهج ${uploadData.subject} للصف ${uploadData.gradeLevel} (${fileInfo.filename}) - آمن`);

        // 12. إرسال إشعار (في بيئة حقيقية، يمكن إرسال بريد إلكتروني)
        // mailer.sendNotification(...);

        res.json({
            success: true,
            message: 'تم استلام ملف المنهج بنجاح. سيتم مراجعته وإضافته إلى النظام.',
            file: {
                name: fileInfo.filename,
                size: fileInfo.size,
                type: fileInfo.mimetype,
                checksum: fileInfo.checksum
            },
            curriculum: {
                gradeLevel: uploadData.gradeLevel,
                subject: uploadData.subject
            }
        });

    } catch (error) {
        console.error('❌ خطأ في رفع الملف:', error);
        threatDetector.logThreat(req.ip, 'upload_error', { error: error.message });
        res.status(500).json({ error: 'حدث خطأ أثناء رفع الملف. يرجى المحاولة لاحقاً.' });
    }
});

/**
 * API: التحقق من حالة رابط الرفع
 * GET /api/admin/curriculum/status/:linkId
 */
app.get('/api/admin/curriculum/status/:linkId', (req, res) => {
    try {
        const { linkId } = req.params;
        const adminId = req.headers['x-admin-id'];

        if (!adminId) {
            return res.status(401).json({ error: 'غير مصرح: مطلوب معرف المسؤول' });
        }

        if (!curriculumUploads.has(linkId)) {
            return res.status(404).json({ error: 'الرابط غير موجود.' });
        }

        const data = curriculumUploads.get(linkId);
        
        // إخفاء المعلومات الحساسة
        const safeData = {
            gradeLevel: data.gradeLevel,
            subject: data.subject,
            description: data.description,
            status: data.status,
            createdAt: data.createdAt,
            expiresAt: data.expiresAt,
            fileInfo: data.fileInfo || null
        };

        res.json({
            success: true,
            data: safeData
        });

    } catch (error) {
        console.error('❌ خطأ في التحقق من حالة الرابط:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء التحقق من حالة الرابط' });
    }
});

/**
 * API: إلغاء رابط الرفع
 * DELETE /api/admin/curriculum/revoke/:linkId
 */
app.delete('/api/admin/curriculum/revoke/:linkId', (req, res) => {
    try {
        const { linkId } = req.params;
        const adminId = req.headers['x-admin-id'];

        if (!adminId) {
            return res.status(401).json({ error: 'غير مصرح: مطلوب معرف المسؤول' });
        }

        if (!curriculumUploads.has(linkId)) {
            return res.status(404).json({ error: 'الرابط غير موجود.' });
        }

        const data = curriculumUploads.get(linkId);
        data.status = 'revoked';
        curriculumUploads.set(linkId, data);

        console.log(`🔒 تم إلغاء رابط الرفع للمنهج ${data.subject} بواسطة ${adminId}`);

        res.json({
            success: true,
            message: 'تم إلغاء رابط الرفع بنجاح.'
        });

    } catch (error) {
        console.error('❌ خطأ في إلغاء الرابط:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إلغاء الرابط' });
    }
});

// ============================================================
// نقاط النهاية الأساسية (APIs)
// ============================================================

// نقطة الصحة (Health Check)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'AJYAL',
        version: '2.0.0',
        security: 'active',
        timestamp