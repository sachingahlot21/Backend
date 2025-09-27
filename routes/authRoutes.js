const express = require('express');
const router = express.Router();
const { 
  sendPhoneOTP, 
  verifyPhoneOTP, 
  registerUser, 
  resendOTP,
  sendCheckoutPhoneOTP,
  verifyCheckoutPhoneOTP
} = require('../controllers/authController');

router.post('/send-otp', sendPhoneOTP);
router.post('/verify-otp', verifyPhoneOTP);
router.post('/register', registerUser);
router.post('/resend-otp', resendOTP);
router.post('/checkout/send-otp', sendCheckoutPhoneOTP);
router.post('/checkout/verify-otp', verifyCheckoutPhoneOTP);

module.exports = router;