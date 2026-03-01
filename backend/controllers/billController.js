const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification');

// @desc  Create a bill (Admin or Doctor)
// @route POST /api/bills
const createBill = async (req, res) => {
  try {
    const { patient, appointment, doctor, items, dueDate, notes } = req.body;
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const bill = await Bill.create({ patient, appointment, doctor, items, totalAmount, dueDate, notes });

    // Populate for email
    const populatedBill = await Bill.findById(bill._id)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${item.description}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;">₹${item.amount.toLocaleString()}</td>
      </tr>
    `).join('');

    // 1. Send email to Patient
    if (populatedBill.patient?.email) {
      await sendEmail({
        to: populatedBill.patient.email,
        subject: `🧾 New Bill Generated - ₹${totalAmount.toLocaleString()} | Hospital Management`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:white;margin:0;font-size:22px;">🧾 New Bill Generated</h1>
              <p style="color:#bfdbfe;margin:6px 0 0;">Hospital Management System</p>
            </div>
            <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
              <p style="color:#1e293b;">Dear <strong>${populatedBill.patient.name}</strong>,</p>
              <p style="color:#64748b;">A bill has been generated for your consultation. Please review and make the payment.</p>

              <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;">
                <table style="width:100%;border-collapse:collapse;">
                  <thead><tr style="background:#eff6ff;">
                    <th style="padding:10px 12px;text-align:left;color:#2563eb;font-size:13px;">Description</th>
                    <th style="padding:10px 12px;text-align:right;color:#2563eb;font-size:13px;">Amount</th>
                  </tr></thead>
                  <tbody>${itemsHtml}</tbody>
                  <tfoot><tr style="background:#fef9c3;">
                    <td style="padding:12px;font-weight:bold;color:#92400e;">Total Amount</td>
                    <td style="padding:12px;font-weight:bold;color:#92400e;text-align:right;">₹${totalAmount.toLocaleString()}</td>
                  </tr></tfoot>
                </table>
              </div>

              <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:8px;padding:20px;margin:16px 0;text-align:center;">
                <p style="margin:0 0 8px;color:#166534;font-weight:700;font-size:15px;">💳 Pay via UPI</p>
                <p style="margin:0 0 12px;color:#64748b;font-size:14px;">Send ₹${totalAmount.toLocaleString()} to:</p>
                <div style="background:white;border:2px dashed #16a34a;border-radius:8px;padding:14px;">
                  <p style="margin:0;font-size:22px;font-weight:bold;color:#16a34a;">${process.env.HOSPITAL_UPI_ID}</p>
                </div>
                <p style="margin:10px 0 0;color:#64748b;font-size:13px;">Use GPay, PhonePe, Paytm, or BHIM</p>
              </div>

              <div style="background:#fef9c3;border-radius:8px;padding:14px;margin:16px 0;">
                <p style="margin:0;color:#92400e;font-size:13px;">After payment, click <strong>"Pay"</strong> button in your My Bills section to notify the admin for verification.</p>
                ${dueDate ? `<p style="margin:6px 0 0;color:#92400e;font-size:13px;">Due Date: <strong>${new Date(dueDate).toLocaleDateString('en-IN')}</strong></p>` : ''}
              </div>

              <p style="color:#64748b;font-size:13px;">Doctor: <strong>Dr. ${populatedBill.doctor?.user?.name || 'N/A'}</strong></p>
              ${notes ? `<p style="color:#64748b;font-size:13px;">Notes: ${notes}</p>` : ''}
            </div>
            <div style="background:#f8fafc;padding:14px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">Hospital Management System &bull; Automated Bill Notification</p>
            </div>
          </div>
        `
      }).catch(e => console.error('Patient email error:', e));
    }

    // 2. Send email to Admin
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `📋 New Bill Created - ${populatedBill.patient?.name} - ₹${totalAmount.toLocaleString()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0f766e;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">📋 New Bill Created</h1>
            <p style="color:#99f6e4;margin:6px 0 0;">Hospital Management System</p>
          </div>
          <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
            <p style="color:#1e293b;">A new bill has been generated. Please review and update the status once payment is received.</p>

            <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:16px 0;">
              <p style="margin:0 0 8px;font-weight:700;color:#92400e;">Patient Details</p>
              <p style="margin:4px 0;color:#78350f;font-size:14px;"><strong>Name:</strong> ${populatedBill.patient?.name}</p>
              <p style="margin:4px 0;color:#78350f;font-size:14px;"><strong>Email:</strong> ${populatedBill.patient?.email}</p>
              <p style="margin:4px 0;color:#78350f;font-size:14px;"><strong>Doctor:</strong> Dr. ${populatedBill.doctor?.user?.name || 'N/A'}</p>
            </div>

            <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <thead><tr style="background:#f0fdfa;">
                  <th style="padding:10px 12px;text-align:left;color:#0f766e;font-size:13px;">Description</th>
                  <th style="padding:10px 12px;text-align:right;color:#0f766e;font-size:13px;">Amount</th>
                </tr></thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot><tr style="background:#dcfce7;">
                  <td style="padding:12px;font-weight:bold;color:#166534;">Total</td>
                  <td style="padding:12px;font-weight:bold;color:#166534;text-align:right;">₹${totalAmount.toLocaleString()}</td>
                </tr></tfoot>
              </table>
            </div>

            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin:16px 0;">
              <p style="margin:0;color:#1d4ed8;font-size:13px;">💡 You can add extra charges or update this bill from <strong>Admin Panel → Billing</strong></p>
            </div>
          </div>
          <div style="background:#f8fafc;padding:14px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">Hospital Management System &bull; Admin Notification</p>
          </div>
        </div>
      `
    }).catch(e => console.error('Admin email error:', e));

    // 3. Create in-app notification for patient
    await Notification.create({
      user: patient,
      title: '🧾 New Bill Generated',
      message: `A bill of ₹${totalAmount.toLocaleString()} has been generated. Check My Bills to pay.`,
      type: 'bill'
    }).catch(e => console.error('Notification error:', e));

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all bills (Admin)
// @route GET /api/bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('appointment', 'appointmentDate department')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get bills created by logged-in doctor
// @route GET /api/bills/doctor-bills
const getDoctorBills = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) return res.status(404).json({ message: 'Doctor profile not found' });

    const bills = await Bill.find({ doctor: doctorProfile._id })
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('appointment', 'appointmentDate department')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('appointment', 'appointmentDate department')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update bill payment (Admin) - when marked Paid, send receipt to patient
// @route PUT /api/bills/:id
const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const { paidAmount, status, notes, items, totalAmount } = req.body;
    const wasNotPaid = bill.status !== 'Paid';

    if (paidAmount !== undefined) bill.paidAmount = paidAmount;
    if (status) bill.status = status;
    if (notes !== undefined) bill.notes = notes;
    if (items) bill.items = items;
    if (totalAmount) bill.totalAmount = totalAmount;

    if (status !== 'Payment Requested') {
      if (bill.paidAmount >= bill.totalAmount) bill.status = 'Paid';
      else if (bill.paidAmount > 0) bill.status = 'Partial';
      else if (bill.status !== 'Payment Requested') bill.status = 'Unpaid';
    }

    const updated = await bill.save();

    // If admin just marked as Paid, send receipt to patient
    if (wasNotPaid && updated.status === 'Paid' && bill.patient?.email) {
      const itemsHtml = bill.items.map(item => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${item.description}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;">₹${item.amount.toLocaleString()}</td>
        </tr>
      `).join('');

      await sendEmail({
        to: bill.patient.email,
        subject: '✅ Payment Confirmed - Receipt | Hospital Management',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:#16a34a;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
              <h1 style="color:white;margin:0;font-size:22px;">✅ Payment Confirmed!</h1>
              <p style="color:#bbf7d0;margin:6px 0 0;">Hospital Management System</p>
            </div>
            <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
              <p style="color:#1e293b;">Dear <strong>${bill.patient.name}</strong>,</p>
              <p style="color:#64748b;">Your payment has been verified and confirmed by the admin. Here is your receipt:</p>
              <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0;">
                <table style="width:100%;border-collapse:collapse;">
                  <thead>
                    <tr style="background:#f0fdf4;">
                      <th style="padding:10px 12px;text-align:left;color:#16a34a;font-size:13px;">Description</th>
                      <th style="padding:10px 12px;text-align:right;color:#16a34a;font-size:13px;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                  <tfoot>
                    <tr style="background:#dcfce7;">
                      <td style="padding:12px;font-weight:bold;color:#166534;">Total Paid</td>
                      <td style="padding:12px;font-weight:bold;color:#166534;text-align:right;">₹${bill.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div style="display:flex;gap:12px;margin:16px 0;flex-wrap:wrap;">
                <div style="flex:1;min-width:120px;background:#f8fafc;padding:12px;border-radius:6px;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Doctor</p>
                  <p style="margin:4px 0 0;font-weight:600;color:#1e293b;">Dr. ${bill.doctor?.user?.name || 'N/A'}</p>
                </div>
                <div style="flex:1;min-width:120px;background:#f8fafc;padding:12px;border-radius:6px;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Payment Date</p>
                  <p style="margin:4px 0 0;font-weight:600;color:#1e293b;">${new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div style="flex:1;min-width:120px;background:#dcfce7;padding:12px;border-radius:6px;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Status</p>
                  <p style="margin:4px 0 0;font-weight:600;color:#16a34a;">✓ Paid</p>
                </div>
              </div>
              <p style="color:#64748b;font-size:13px;">Thank you! Please keep this receipt for your records.</p>
            </div>
            <div style="background:#f8fafc;padding:16px;border-radius:0 0 8px 8px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">Hospital Management System &bull; Automated Receipt</p>
            </div>
          </div>
        `
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete bill (Admin)
// @route DELETE /api/bills/:id
const deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Patient requests payment - sends notification to admin email
// @route POST /api/bills/:id/pay
const payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    if (bill.patient._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (bill.status === 'Paid') {
      return res.status(400).json({ message: 'Bill is already paid' });
    }

    // Mark as Payment Requested
    bill.status = 'Payment Requested';
    await bill.save();

    const itemsHtml = bill.items.map(item => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${item.description}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;">₹${item.amount.toLocaleString()}</td>
      </tr>
    `).join('');

    // Send notification to Admin
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `💰 Payment Request from ${bill.patient.name} - ₹${bill.totalAmount.toLocaleString()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#f59e0b;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">💰 New Payment Request</h1>
            <p style="color:#fef3c7;margin:6px 0 0;">Hospital Management System</p>
          </div>
          <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
            <p style="color:#1e293b;font-size:16px;">A patient has requested to pay their bill. Please verify the payment in your bank account and update the status.</p>

            <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:16px 0;">
              <h3 style="margin:0 0 12px;color:#92400e;">Patient Details</h3>
              <p style="margin:4px 0;color:#78350f;"><strong>Name:</strong> ${bill.patient.name}</p>
              <p style="margin:4px 0;color:#78350f;"><strong>Email:</strong> ${bill.patient.email}</p>
              <p style="margin:4px 0;color:#78350f;"><strong>Phone:</strong> ${bill.patient.phone || 'N/A'}</p>
              <p style="margin:4px 0;color:#78350f;"><strong>Doctor:</strong> Dr. ${bill.doctor?.user?.name || 'N/A'}</p>
            </div>

            <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;">
              <h3 style="margin:0 0 12px;color:#1e293b;">Bill Details</h3>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#eff6ff;">
                    <th style="padding:10px 12px;text-align:left;color:#2563eb;font-size:13px;">Description</th>
                    <th style="padding:10px 12px;text-align:right;color:#2563eb;font-size:13px;">Amount</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr style="background:#fef9c3;">
                    <td style="padding:12px;font-weight:bold;color:#92400e;">Total Amount</td>
                    <td style="padding:12px;font-weight:bold;color:#92400e;text-align:right;">₹${bill.totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:8px;padding:20px;margin:16px 0;text-align:center;">
              <p style="margin:0 0 8px;color:#166534;font-weight:700;font-size:15px;">🏦 Your UPI ID (Patient will pay here)</p>
              <div style="background:white;border:2px dashed #16a34a;border-radius:8px;padding:14px;">
                <p style="margin:0;font-size:22px;font-weight:bold;color:#16a34a;letter-spacing:1px;">${process.env.HOSPITAL_UPI_ID}</p>
              </div>
              <p style="margin:10px 0 0;color:#64748b;font-size:13px;">Patient has been asked to pay on this UPI ID</p>
            </div>

            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0;">
              <p style="margin:0;color:#991b1b;font-weight:600;">⚠️ Action Required</p>
              <p style="margin:8px 0 0;color:#7f1d1d;">1. Check your UPI / bank account for payment of <strong>₹${bill.totalAmount.toLocaleString()}</strong> from ${bill.patient.name}</p>
              <p style="margin:4px 0 0;color:#7f1d1d;">2. Login to Admin Panel → Billing → Update bill status to <strong>"Paid"</strong></p>
            </div>
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:0 0 8px 8px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">Hospital Management System &bull; Admin Notification</p>
          </div>
        </div>
      `
    });

    // Send confirmation to patient
    await sendEmail({
      to: bill.patient.email,
      subject: 'Payment Request Submitted - Hospital Management',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#2563eb;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">Payment Request Submitted</h1>
            <p style="color:#bfdbfe;margin:6px 0 0;">Hospital Management System</p>
          </div>
          <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
            <p style="color:#1e293b;">Dear <strong>${bill.patient.name}</strong>,</p>
            <p style="color:#64748b;">Your payment request of <strong>₹${bill.totalAmount.toLocaleString()}</strong> has been submitted successfully.</p>

            <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:8px;padding:20px;margin:16px 0;text-align:center;">
              <p style="margin:0 0 8px;color:#166534;font-weight:700;font-size:16px;">💳 Pay via UPI</p>
              <p style="margin:0 0 12px;color:#64748b;font-size:14px;">Please send ₹${bill.totalAmount.toLocaleString()} to the following UPI ID:</p>
              <div style="background:white;border:2px dashed #16a34a;border-radius:8px;padding:16px;display:inline-block;min-width:250px;">
                <p style="margin:0;font-size:22px;font-weight:bold;color:#16a34a;letter-spacing:1px;">${process.env.HOSPITAL_UPI_ID}</p>
              </div>
              <p style="margin:12px 0 0;color:#64748b;font-size:13px;">Use any UPI app: GPay, PhonePe, Paytm, BHIM</p>
            </div>

            <div style="background:#fef9c3;border-radius:8px;padding:16px;margin:16px 0;">
              <p style="margin:0;color:#92400e;font-weight:600;">⏳ What happens next?</p>
              <p style="margin:8px 0 0;color:#78350f;">1. Pay ₹${bill.totalAmount.toLocaleString()} to the UPI ID above</p>
              <p style="margin:4px 0 0;color:#78350f;">2. Admin will verify your payment</p>
              <p style="margin:4px 0 0;color:#78350f;">3. Bill status will change to <strong>"Paid"</strong> in your My Bills section</p>
            </div>

            <p style="color:#64748b;font-size:13px;">Bill Amount: <strong>₹${bill.totalAmount.toLocaleString()}</strong></p>
            <p style="color:#64748b;font-size:13px;">Doctor: <strong>Dr. ${bill.doctor?.user?.name || 'N/A'}</strong></p>
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:0 0 8px 8px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">Hospital Management System &bull; This is an automated message</p>
          </div>
        </div>
      `
    });

    res.json({ message: 'Payment request sent. Admin will verify and update your bill status.' });
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBill, getAllBills, getDoctorBills, getMyBills, updateBill, deleteBill, payBill };
