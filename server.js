const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const changeController = require('./controllers/changeController');
const userController = require('./controllers/userController');
const otpController = require('./controllers/otpController');
const logoutController = require('./controllers/logoutController'); // Import controller logout
const authenticateJWT = require('./middleware/authenticateJWT');
const { sendOTPEmail } = require('./services/emailService');

dotenv.config();  // Memuat variabel lingkungan

const app = express();

// Gunakan CORS dengan konfigurasi khusus
app.use(cors({
  origin: 'http://127.0.0.1:5500',  // Ganti dengan origin frontend kamu
  methods: ['POST', 'PUT'],         // Hanya mengizinkan POST dan PUT
  credentials: true                 // Jika perlu mengirim cookies/auth headers
}));

app.use(express.json()); // Untuk parsing JSON body

// Routes
app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/verify-otp', authenticateJWT, otpController.verifyOtp);
app.post('/change-username', authenticateJWT, changeController.changeUsername);
app.post('/change-password', authenticateJWT, changeController.changePassword);
app.post('/logout', authenticateJWT, logoutController.logout);

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
