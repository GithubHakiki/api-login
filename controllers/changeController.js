const bcrypt = require('bcryptjs');
const connection = require('../db');
const { hashPassword } = require('../utils/helpers');

// Fungsi untuk mengganti username
const changeUsername = (req, res) => {
  const { newUsername } = req.body;
  const userId = req.user.userId;  // Ambil userId dari JWT

  if (!newUsername) {
    return res.status(400).json('New username is required');
  }

  connection.query('SELECT * FROM Users WHERE name = ?', [newUsername], (err, results) => {
    if (err) return res.status(500).json('Error checking username');
    if (results.length > 0) return res.status(400).json('Username already taken');
    
    // Update username
    connection.query('UPDATE Users SET name = ? WHERE id = ?', [newUsername, userId], (err, updateResult) => {
      if (err) return res.status(500).json('Error updating username');
      res.status(200).json('Username updated successfully');
    });
  });
};

// Fungsi untuk mengganti password
const changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;  // Ambil userId dari JWT

  if (!oldPassword || !newPassword) {
    return res.status(400).json('Both old and new passwords are required');
  }

  connection.query('SELECT * FROM Users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json('Error checking user');
    if (results.length === 0) return res.status(400).json('User not found');
    
    const user = results[0];
    
    // Cek apakah oldPassword cocok dengan password di database
    bcrypt.compare(oldPassword, user.password_hash, (err, isPasswordValid) => {
      if (err) return res.status(500).json('Error verifying old password');
      if (!isPasswordValid) return res.status(400).json('Invalid old password');
      
      // Hash password baru
      hashPassword(newPassword).then(hashedPassword => {
        connection.query('UPDATE Users SET password_hash = ? WHERE id = ?', [hashedPassword, userId], (err, updateResult) => {
          if (err) return res.status(500).json('Error updating password');
          res.status(200).json('Password updated successfully');
        });
      }).catch(err => res.status(500).json('Error hashing new password'));
    });
  });
};

module.exports = {
  changeUsername,
  changePassword
};
