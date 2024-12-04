const connection = require('../db');
const jwt = require('jsonwebtoken');

// Fungsi untuk memverifikasi OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body; // Gunakan email dari body request

  try {
    // Cari user berdasarkan email dan OTP yang valid
    const [otpResults] = await connection.promise().query(
      'SELECT * FROM OTP JOIN Users ON OTP.user_id = Users.id WHERE Users.email = ? AND OTP.otp = ? AND OTP.expired_at > NOW() AND OTP.is_verified = FALSE',
      [email, otp]
    );

    if (otpResults.length === 0) {
      return res.status(400).json('Invalid OTP or OTP expired');
    }

    const user = otpResults[0];

    // Tandai OTP sebagai diverifikasi
    await connection.promise().query(
      'UPDATE OTP SET is_verified = TRUE WHERE user_id = ? AND otp = ?',
      [user.user_id, otp]
    );

    // Generate JWT token setelah OTP diverifikasi
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      token: token, // JWT token dikirimkan di sini
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Error verifying OTP');
  }
};

module.exports = {
  verifyOtp
};
