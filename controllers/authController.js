
const User = require('../modals/user');
const OTP = require('../modals/OTP');
const { generateOTP, getExpiryTime } = require('../utils/otpUtil');
const { sendOTP } = require('../utils/smsUtil');


const sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // const existingUser = await User.findOne({ phone, isVerified: true });
    // if (existingUser) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Phone number already registered'
    //   });
    // }

    //const otp = generateOTP();
    const otp = "221133"
    const otpExpiresAt = getExpiryTime();


    await OTP.findOneAndUpdate(
      { phone },
      { otp, expiresAt: otpExpiresAt },
      { upsert: true, new: true }
    );

    let username = "sachin"
    // const smsSent = await sendOTP(phone, otp, username);
    const smsSent = true;

    if (smsSent) {
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};


const verifyPhoneOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }


    const otpRecord = await OTP.findOne({ phone });
    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'OTP not found. Please request a new one.'
      });
    }


    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new one.'
      });
    }

    await OTP.deleteOne({ phone });

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone
        },
        isNewUser: false
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      phone: phone,
      isNewUser: true
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
};


const registerUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone already registered'
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      isVerified: true // User is verified since OTP was already verified
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};


const resendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = getExpiryTime();

    // Update or create OTP record
    await OTP.findOneAndUpdate(
      { phone },
      { otp, expiresAt: otpExpiresAt },
      { upsert: true, new: true }
    );

    // Send OTP via SMS
    const smsSent = await sendOTP(phone, otp);

    if (smsSent) {
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};

const sendCheckoutPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // const otp = "221133"; // In production, use generateOTP();
    generateOTP();
    const otpExpiresAt = getExpiryTime();

    await OTP.findOneAndUpdate(
      { phone },
      { otp, expiresAt: otpExpiresAt },
      { upsert: true, new: true }
    );

    // Replace with your SMS utility
    const smsSent = true;

    if (smsSent) {
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  } catch (error) {
    console.error('Send Checkout OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};


const verifyCheckoutPhoneOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const otpRecord = await OTP.findOne({ phone });
    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'OTP not found. Please request a new one.'
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new one.'
      });
    }

    await OTP.deleteOne({ phone });

    return res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
      phone
    });
  } catch (error) {
    console.error('Checkout OTP verification error:', error);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
};


module.exports = {
  sendPhoneOTP,
  verifyPhoneOTP,
  registerUser,
  resendOTP,
  sendCheckoutPhoneOTP,
  verifyCheckoutPhoneOTP
};