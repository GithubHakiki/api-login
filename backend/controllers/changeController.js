const bcrypt = require('bcryptjs');
const connection = require('../db');
const { hashPassword } = require('../utils/helpers');

// Fungsi untuk mengganti username
const changeUsername = (req, res) => {
  const { newUsername } = req.body;
  const userId = req.user.userId;

  if (!newUsername) {
    return res.status(400).json({ error: 'New username is required' });
  }

  // Cek apakah username sudah digunakan
  connection.query('SELECT id FROM Users WHERE name = ?', [newUsername], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).json({ error: 'Error checking username' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Update username
    connection.query('UPDATE Users SET name = ? WHERE id = ?', [newUsername, userId], (err, updateResult) => {
      if (err) {
        console.error('Error updating username:', err);
        return res.status(500).json({ error: 'Error updating username' });
      }

      // Pastikan ada perubahan di data
      if (updateResult.affectedRows === 0) {
        return res.status(400).json({ error: 'Failed to update username' });
      }

      res.status(200).json({ message: 'Username updated successfully', userId });
    });
  });
};

// Fungsi untuk mengganti password
const changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Both old and new passwords are required' });
  }

  // Validasi panjang password baru
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Cek password lama
  connection.query('SELECT password_hash FROM Users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Error checking user' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];

    // Verifikasi password lama
    bcrypt.compare(oldPassword, user.password_hash, (err, isPasswordValid) => {
      if (err) {
        console.error('Error verifying old password:', err);
        return res.status(500).json({ error: 'Error verifying old password' });
      }

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid old password' });
      }

      // Hash password baru dan update
      hashPassword(newPassword)
        .then(hashedPassword => {
          connection.query('UPDATE Users SET password_hash = ? WHERE id = ?', [hashedPassword, userId], (err, updateResult) => {
            if (err) {
              console.error('Error updating password:', err);
              return res.status(500).json({ error: 'Error updating password' });
            }

            // Pastikan ada perubahan di data
            if (updateResult.affectedRows === 0) {
              return res.status(400).json({ error: 'Failed to update password' });
            }

            res.status(200).json({ message: 'Password updated successfully', userId });
          });
        })
        .catch(err => {
          console.error('Error hashing new password:', err);
          res.status(500).json({ error: 'Error hashing new password' });
        });
    });
  });
};

module.exports = {
  changeUsername,
  changePassword
};
