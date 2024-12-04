// logoutController.js
const connection = require('../db');

// Fungsi logout
const logout = async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });

  try {
    // Masukkan token ke tabel blacklist
    await connection.promise().query('INSERT INTO blacklisted_tokens (token) VALUES (?)', [token]);
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error blacklisting token' });
  }
};

module.exports = { 
    logout 
};
