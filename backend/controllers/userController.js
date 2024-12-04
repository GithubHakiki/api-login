const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const { sendOTPEmail } = require('../services/emailService');
const { generateOTP, hashPassword } = require('../utils/helpers');

// Validasi password: minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka
const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Fungsi untuk registrasi
const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Cek apakah password valid
    if (!validatePassword(password)) {
      return res.status(400).json('Password must be at least 8 characters long and include upper, lower case letters and numbers');
    }

    // Cek apakah email sudah terdaftar
    const [existingUser] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUser.length > 0) return res.status(400).json('Email already registered');

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Masukkan data user baru
    const [result] = await connection.promise().query(
      'INSERT INTO Users (email, name, password_hash) VALUES (?, ?, ?)', 
      [email, username, hashedPassword]
    );
      
    const otp = generateOTP();
    
    // Simpan OTP
    await connection.promise().query(
      'INSERT INTO OTP (user_id, otp, expired_at) VALUES (?, ?, ?)', 
      [result.insertId, otp, new Date(Date.now() + 5 * 60 * 1000)]
    );

    // Kirim OTP ke email
    sendOTPEmail(email, otp);

    // Response tanpa token
    res.status(200).json({
      message: 'Registration successful! Please check your email for OTP.'
    });
  } catch (err) {
    console.error('Error in register:', err.message, err.stack);
    res.status(500).json('Error registering user');
  }
};

// Fungsi untuk login
const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [results] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
    if (results.length === 0) return res.status(400).json('User not found');
    
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(400).json('Invalid password');
    
    // Generate OTP
    const otp = generateOTP();
    await connection.promise().query('INSERT INTO OTP (user_id, otp, expired_at) VALUES (?, ?, ?)', 
      [user.id, otp, new Date(Date.now() + 5 * 60 * 1000)]);
    
    // Kirim OTP ke email
    sendOTPEmail(email, otp);
    
    res.status(200).json({
      message: 'Login successful. OTP sent to your email. Please verify OTP to proceed.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Error logging in');
  }
};

module.exports = {
  register,
  login
};
