const User = require('../models/User');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Patient',
      phone
    });

    if (user) {
      // Send welcome email
      await sendEmail({
        to: user.email,
        subject: '🎉 Welcome to Hospital Management System!',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:40px 24px;border-radius:12px 12px 0 0;text-align:center;">
              <div style="width:70px;height:70px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="font-size:32px;">🏥</span>
              </div>
              <h1 style="color:white;margin:0;font-size:26px;font-weight:bold;">Welcome to Hospital Management!</h1>
              <p style="color:#bfdbfe;margin:8px 0 0;font-size:15px;">Your health is our priority</p>
            </div>

            <!-- Body -->
            <div style="background:white;padding:32px 24px;border:1px solid #e2e8f0;border-top:none;">
              <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">Hello <strong>${user.name}</strong> 👋</p>
              <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 24px;">
                We're thrilled to have you on board! Your account has been created successfully. Here's what you can do now:
              </p>

              <!-- Features -->
              <div style="display:grid;gap:12px;margin-bottom:24px;">
                ${[
                  ['📅', 'Book Appointments', 'Schedule consultations with our specialist doctors'],
                  ['👨‍⚕️', 'Find Doctors', 'Browse doctors by specialization and department'],
                  ['📋', 'Medical Records', 'View your prescriptions and health history'],
                  ['💳', 'Billing', 'Track and manage your hospital bills easily'],
                ].map(([icon, title, desc]) => `
                  <div style="display:flex;align-items:flex-start;gap:14px;background:#f8fafc;border-radius:10px;padding:14px;">
                    <span style="font-size:24px;line-height:1;">${icon}</span>
                    <div>
                      <p style="margin:0 0 2px;font-weight:700;color:#1e293b;font-size:14px;">${title}</p>
                      <p style="margin:0;color:#64748b;font-size:13px;">${desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Account Info -->
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin-bottom:24px;">
                <p style="margin:0 0 10px;font-weight:700;color:#1d4ed8;font-size:14px;">📌 Your Account Details</p>
                <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>Name:</strong> ${user.name}</p>
                <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin:4px 0;color:#1e293b;font-size:14px;"><strong>Role:</strong> ${user.role}</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:8px;">
                <a href="${process.env.FRONTEND_URL}/login" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
                  🚀 Login to Your Account
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#f8fafc;padding:20px 24px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e2e8f0;border-top:none;">
              <p style="margin:0 0 6px;color:#64748b;font-size:13px;">If you have any questions, feel free to contact us.</p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">© 2026 Hospital Management System &bull; All rights reserved</p>
            </div>

          </div>
        `
      }).catch(err => console.error('Welcome email error:', err));

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      let doctorData = null;
      if (user.role === 'Doctor') {
        doctorData = await Doctor.findOne({ user: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: doctorData ? doctorData.specialization : undefined,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      let doctorData = null;
      if (user.role === 'Doctor') {
        doctorData = await Doctor.findOne({ user: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        address: user.address,
        specialization: doctorData ? doctorData.specialization : undefined
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile & password
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        if (!req.body.currentPassword) {
          return res.status(400).json({ message: 'Current password is required to change password' });
        }
        
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect current password' });
        }

        user.password = req.body.password;
      }

      let doctorData = null;
      if (user.role === 'Doctor') {
        doctorData = await Doctor.findOne({ user: user._id });
        if (doctorData) {
          doctorData.specialization = req.body.specialization || doctorData.specialization;
          await doctorData.save();
        }
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        bloodGroup: updatedUser.bloodGroup,
        address: updatedUser.address,
        specialization: doctorData ? doctorData.specialization : undefined,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Hospital Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">This link will expire in <strong>30 minutes</strong>.</p>
          <p style="color: #64748b; font-size: 14px;">If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">Hospital Management System</p>
        </div>
      `
    });

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email could not be sent. Please try again.' });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
};
