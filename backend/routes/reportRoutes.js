const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const MedicalRecord = require('../models/MedicalRecord');
const sendEmail = require('../utils/sendEmail');
const { protect } = require('../middleware/authMiddleware');

// Setup upload folder
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, images, and Word documents are allowed'));
  }
});

// @route POST /api/reports/send
// @desc  Doctor uploads report, saves to DB, and sends to patient email
router.post('/send', protect, upload.single('report'), async (req, res) => {
  try {
    const { patientId, patientName, patientEmail, reportTitle, notes, reportType } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

    const doctorName = req.user.name;
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Find doctor profile to get doctor._id for MedicalRecord
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) {
      fs.unlinkSync(filePath);
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Determine report type
    const type = reportType || 'Lab Report';

    // Save a copy of the file as base64 for in-app viewing
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    const fileDataUrl = `data:${mimeType};base64,${base64File}`;

    // Save medical record to DB so patient can view it in the app
    await MedicalRecord.create({
      patient: patientId,
      doctor: doctorProfile._id,
      type,
      title: reportTitle,
      fileUrl: fileDataUrl,
      prescription: notes || '',
    });

    // Send email with attachment
    await sendEmail({
      to: patientEmail,
      subject: `📄 Medical Report from Dr. ${doctorName} - ${reportTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
          <div style="background:linear-gradient(135deg,#0f766e,#0d9488);padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
            <span style="font-size:40px;">📋</span>
            <h1 style="color:white;margin:12px 0 0;font-size:22px;">Medical Report</h1>
            <p style="color:#99f6e4;margin:6px 0 0;">Hospital Management System</p>
          </div>
          <div style="background:white;padding:28px 24px;border:1px solid #e2e8f0;border-top:none;">
            <p style="color:#1e293b;font-size:15px;">Dear <strong>${patientName}</strong>,</p>
            <p style="color:#64748b;line-height:1.6;">Dr. <strong>${doctorName}</strong> has shared a medical report with you. Please find the attached file below.</p>

            <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;padding:16px;margin:20px 0;">
              <p style="margin:0 0 8px;font-weight:700;color:#0f766e;font-size:14px;">📄 Report Details</p>
              <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>Title:</strong> ${reportTitle}</p>
              <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>Type:</strong> ${type}</p>
              <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
              <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
              <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>File:</strong> ${fileName}</p>
            </div>

            ${notes ? `
            <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:16px 0;">
              <p style="margin:0 0 6px;font-weight:700;color:#92400e;font-size:14px;">📝 Doctor's Notes</p>
              <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">${notes}</p>
            </div>` : ''}

            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin:16px 0;">
              <p style="margin:0;color:#1d4ed8;font-size:13px;">💡 You can also view this report in your <strong>Medical Records</strong> section on the website.</p>
            </div>

            <div style="background:#f8fafc;border-radius:10px;padding:16px;margin:16px 0;">
              <p style="margin:0;color:#64748b;font-size:13px;">⚠️ This report is confidential and intended only for the patient mentioned above. Please keep it safe for your medical records.</p>
            </div>
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">Hospital Management System &bull; Automated Report Delivery</p>
          </div>
        </div>
      `,
      attachments: [{ filename: fileName, path: filePath }]
    });

    // Delete temp file after sending
    fs.unlinkSync(filePath);

    res.json({ message: `Report sent successfully to ${patientEmail} and saved to patient records.` });
  } catch (error) {
    console.error('Report send error:', error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
