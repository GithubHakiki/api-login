const connection = require('../db');
const jwt = require('jsonwebtoken');

// Fungsi untuk memverifikasi OTP
const verifyOtp = (req, res) => {
  const { otp } = req.body;
  const userId = req.user.userId; // Ambil userId dari JWT

  connection.query('SELECT * FROM OTP WHERE user_id = ? AND otp = ? AND expired_at > NOW() AND is_verified = FALSE', 
  [userId, otp], (err, otpResults) => {
    if (err) {
      console.log('Error verifying OTP:', err);
      return res.status(500).json('Error verifying OTP');
    }

    if (otpResults.length === 0) {
      console.log('Invalid OTP or OTP expired:', otp);
      return res.status(400).json('Invalid OTP or OTP expired');
    }

    // Lanjutkan untuk menandai OTP sebagai diverifikasi
    connection.query('UPDATE OTP SET is_verified = TRUE WHERE user_id = ? AND otp = ?', 
      [userId, otp], (err, updateResult) => {
        if (err) {
          console.log('Error updating OTP status:', err);
          return res.status(500).json('Error updating OTP');
        }

        console.log('OTP successfully verified');
        res.status(200).json('OTP verified successfully');
      });
  });
};

module.exports = {
  verifyOtp
};
