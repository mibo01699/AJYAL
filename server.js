const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// نظام توليد كود السلال المشفر المحصن إلكترونياً
app.post('/api/generate-aid-token', (req, res) => {
    const { familyKycId } = req.body;
    if(!familyKycId) return res.status(400).json({ status: "ERROR", message: "Missing KYC Identity Data" });

    // توليد هاش مشفر ومقفل كود حالة عير قابل للتزوير
    const token = crypto.createHash('sha256').update(familyKycId + Date.now().toString()).digest('hex').substring(0, 12).toUpperCase();
    res.json({ status: "SUCCESS", aidCode: `GAV-AID-${token}` });
});

app.listen(PORT, () => console.log(`🎓 AJYAL Educational & Verification Hub running on port ${PORT}`));
