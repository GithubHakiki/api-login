const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const changeController = require('./controllers/changeController');
const userController = require('./controllers/userController');
const otpController = require('./controllers/otpController');
const logoutController = require('./controllers/logoutController'); 
const userRouter = require('./routes/userRouter');  // Mengimpor userRouter
const { getArticles } = require('./controllers/articlesController');  // Pastikan path sudah benar
const authenticateJWT = require('./middleware/authenticateJWT');
const { sendOTPEmail } = require('./services/emailService');

dotenv.config();  // Memuat variabel lingkungan

const app = express();

// Gunakan CORS dengan konfigurasi khusus
app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['POST', 'GET', 'PUT'],
  credentials: true
}));

app.use(express.json()); // Untuk parsing JSON body

// Routes
app.use('/api', authenticateJWT, userRouter); // Menggunakan router untuk mendapatkan data user

// Routes lainnya
app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/verify-otp', otpController.verifyOtp);
app.post('/logout', authenticateJWT, logoutController.logout);

app.put('/change-username', authenticateJWT, changeController.changeUsername);
app.put('/change-password', authenticateJWT, changeController.changePassword);

app.get('/articles', getArticles);

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
