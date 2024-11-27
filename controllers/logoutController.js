// logoutController.js
const connection = require('../db');

// Fungsi logout
const logout = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });

  // Masukkan token ke tabel blacklist
  connection.query(
    'INSERT INTO blacklisted_tokens (token) VALUES (?)',
    [token],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error blacklisting token' });
      res.status(200).json({ message: 'Logout successful' });
    }
  );
};

module.exports = { 
    logout 
};
