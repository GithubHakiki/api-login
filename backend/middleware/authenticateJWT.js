const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Ambil token dari header Authorization

  if (!token) return res.status(403).json('Access denied. No token provided.');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json('Invalid or expired token.');

    req.user = user;  // Menyimpan informasi user di request object
    next();  // Lanjutkan ke fungsi berikutnya
  });
};

module.exports = authenticateJWT;
