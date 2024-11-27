const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const { sendOTPEmail } = require('../services/emailService');
const { generateOTP, hashPassword } = require('../utils/helpers');

// Fungsi untuk registrasi
const register = async (req, res) => {
    const { email, username, password } = req.body;
  
    connection.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
      if (err) return res.status(500).json('Error checking email');
      if (results.length > 0) return res.status(400).json('Email already registered');
  
      // Hash password
      hashPassword(password).then(hashedPassword => {
        connection.query('INSERT INTO Users (email, name, password_hash) VALUES (?, ?, ?)', 
          [email, username, hashedPassword], 
          (err, result) => {
            if (err) return res.status(500).json('Error registering user');
  
            const otp = generateOTP();
            connection.query('INSERT INTO OTP (user_id, otp, expired_at) VALUES (?, ?, ?)', 
              [result.insertId, otp, new Date(Date.now() + 5 * 60 * 1000)], 
              (err, otpResult) => {
                if (err) return res.status(500).json('Error saving OTP');
                sendOTPEmail(email, otp);
  
                // Generate JWT token
                const token = jwt.sign(
                  { userId: result.insertId, email: email },
                  process.env.JWT_SECRET, // Secret key for JWT
                  { expiresIn: '1h' }  // Token expires in 1 hour
                );
  
                // Kirim token beserta pesan sukses
                res.status(200).json({
                  message: 'Registration successful! Please check your email for OTP.',
                  token: token
                });
              });
          });
      }).catch(err => res.status(500).json('Error hashing password'));
    });
  };

// Fungsi untuk login
const login = (req, res) => {
    const { email, password } = req.body;

    // Cek apakah email ada di database
    connection.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json('Error checking user');
        if (results.length === 0) return res.status(400).json('User not found');
        
        const user = results[0];

        // Verifikasi password yang dimasukkan
        bcrypt.compare(password, user.password_hash, (err, isPasswordValid) => {
            if (err) return res.status(500).json('Error verifying password');
            if (!isPasswordValid) return res.status(400).json('Invalid password');

            // Generate OTP
            const otp = generateOTP();
            
            // Simpan OTP di database (dengan masa berlaku 5 menit)
            connection.query('INSERT INTO OTP (user_id, otp, expired_at) VALUES (?, ?, ?)', 
                [user.id, otp, new Date(Date.now() + 5 * 60 * 1000)], (err, otpResult) => {
                    if (err) return res.status(500).json('Error saving OTP');
                    
                    // Kirim OTP via email
                    sendOTPEmail(email, otp);
                    
                    // Generate JWT token untuk login
                    const token = jwt.sign(
                        { userId: user.id, email: user.email },
                        process.env.JWT_SECRET, // Secret key untuk JWT
                        { expiresIn: '1h' }  // Token kadaluarsa dalam 1 jam
                    );

                    // Kirim pesan login berhasil dan OTP ke email
                    res.status(200).json({
                        message: 'Login successful. OTP sent to your email.',
                        token: token
                    });
                });
        });
    });
};

module.exports = {
  register,
  login
};
