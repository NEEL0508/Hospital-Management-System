const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');

const startReminderJob = () => {
  // Runs every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const start = new Date(new Date(tomorrow).setHours(0, 0, 0, 0));
      const end = new Date(new Date(tomorrow).setHours(23, 59, 59, 999));

      const appointments = await Appointment.find({
        appointmentDate: { $gte: start, $lte: end },
        status: 'Approved'
      })
        .populate('patient', 'name email')
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

      console.log(`[Reminder Job] Found ${appointments.length} appointments for tomorrow`);

      for (const apt of appointments) {
        if (!apt.patient?.email) continue;

        // Send email reminder
        await sendEmail({
          to: apt.patient.email,
          subject: '⏰ Appointment Reminder - Tomorrow | Hospital Management',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
                <h1 style="color:white;margin:0;font-size:22px;">⏰ Appointment Reminder</h1>
                <p style="color:#ddd6fe;margin:6px 0 0;">Hospital Management System</p>
              </div>
              <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
                <p style="color:#1e293b;font-size:15px;">Dear <strong>${apt.patient.name}</strong>,</p>
                <p style="color:#64748b;">This is a reminder that you have an appointment <strong>tomorrow</strong>.</p>

                <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:20px;margin:20px 0;">
                  <div style="display:flex;flex-direction:column;gap:10px;">
                    <div style="display:flex;justify-content:space-between;">
                      <span style="color:#6d28d9;font-weight:600;font-size:14px;">Doctor</span>
                      <span style="color:#1e293b;font-size:14px;">Dr. ${apt.doctor?.user?.name || 'N/A'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                      <span style="color:#6d28d9;font-weight:600;font-size:14px;">Department</span>
                      <span style="color:#1e293b;font-size:14px;">${apt.department}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                      <span style="color:#6d28d9;font-weight:600;font-size:14px;">Date</span>
                      <span style="color:#1e293b;font-size:14px;">${new Date(apt.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                      <span style="color:#6d28d9;font-weight:600;font-size:14px;">Time</span>
                      <span style="color:#1e293b;font-size:14px;">${apt.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                <div style="background:#fef9c3;border-radius:8px;padding:14px;margin:16px 0;">
                  <p style="margin:0;color:#92400e;font-size:13px;">📋 Please arrive 10-15 minutes early. Bring any previous medical records if applicable.</p>
                </div>
              </div>
              <div style="background:#f8fafc;padding:14px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
                <p style="margin:0;color:#94a3b8;font-size:12px;">Hospital Management System &bull; Automated Reminder</p>
              </div>
            </div>
          `
        }).catch(e => console.error(`Reminder email failed for ${apt.patient.email}:`, e.message));

        // In-app notification
        await Notification.create({
          user: apt.patient._id,
          title: '⏰ Appointment Tomorrow',
          message: `Reminder: You have an appointment with Dr. ${apt.doctor?.user?.name} tomorrow at ${apt.appointmentTime}.`,
          type: 'appointment'
        }).catch(() => {});
      }

      console.log('[Reminder Job] Done');
    } catch (error) {
      console.error('[Reminder Job] Error:', error.message);
    }
  });

  console.log('[Reminder Job] Scheduled — runs daily at 8:00 AM');
};

module.exports = startReminderJob;
