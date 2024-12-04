import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [authType, setAuthType] = useState(null);
  const [articles, setArticles] = useState([]);

  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      axios.get('http://localhost:3000/api/user', {
        headers: { Authorization: `Bearer ${savedToken}` }
      }).then(response => {
        setUser(response.data);
        setStep(4);
  
        // Fetch articles after login
        axios.get('http://localhost:3000/articles', {
          headers: { Authorization: `Bearer ${savedToken}` }
        }).then(response => {
          console.log('Articles data:', response.data); // Debugging log
          setArticles(response.data); // Simpan artikel di state
        }).catch(error => {
          console.error("Error fetching articles", error);
        });
  
      }).catch(error => {
        console.error("Error fetching user data", error);
        setStep(1);
      });
    } else {
      setStep(1);
    }
  }, []);  

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !username || !password) {
      setError('Please fill all fields');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include upper, lower case letters and numbers');
      return;
    }
  
    try {
      await axios.post('http://localhost:3000/register', {
        email, username, password,
      });
      setStep(3); // Langsung ke form OTP setelah registrasi
      setAuthType('register');
      setError('');
    } catch (error) {
      setError('Failed to register: ' + error.response.data);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
  
    try {
          // eslint-disable-next-line
      const response = await axios.post('http://localhost:3000/login', {
        email, password,
      });
  
      // Langsung ke form OTP setelah login
      setStep(3);
      setAuthType('login');
      setError('');
    } catch (error) {
      setError('Login failed: ' + error.response.data);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
  
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/verify-otp', {
        email,
        otp,
      });
  
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setStep(4);
      setError('');
    } catch (error) {
      setError('Invalid OTP or OTP expired');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToken('');
      setUser(null);
      localStorage.removeItem('token');
      setStep(1);
      setAuthType(null);
    } catch (error) {
      setError('Logout failed');
    }
  };

  const handleChangeUsername = async () => {
    try {
      const response = await axios.put('http://localhost:3000/change-username', {
        newUsername // perbaiki key yang dikirim
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setNewUsername('');
      setError('Username updated successfully!');
    } catch (error) {
      setError('Failed to update username');
    }
  };  
  
  const handleChangePassword = async () => {
    try {
      const response = await axios.put('http://localhost:3000/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOldPassword('');
      setNewPassword('');
      setError('Password updated successfully!');
    } catch (error) {
      setError('Failed to update password');
    }
  };
  

  return (
    <div className="App">
      <div className="auth-container">
        {/* Initial Selection */}
        {step === 1 && (
          <div className="auth-selection">
            <h1>Welcome</h1>
            <p>Choose an authentication method</p>
            <div className="auth-buttons">
              <button 
                onClick={() => {
                  setStep(2);
                  setAuthType('register');
                }}
                className="register-btn"
              >
                Register
              </button>
              <button 
                onClick={() => {
                  setStep(2);
                  setAuthType('login');
                }}
                className="login-btn"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {step === 2 && authType === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="register-form">
            <h1>Create Account</h1>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
            </div>
            <button type="submit">Register</button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="back-btn"
            >
              Back to Options
            </button>
          </form>
        )}

        {/* Login Form */}
        {step === 2 && authType === 'login' && (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <h1>Login</h1>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit">Login</button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="back-btn"
            >
              Back to Options
            </button>
          </form>
        )}

        {/* OTP Verification Form */}
        {step === 3 && (
          <div className="otp-verification">
            <h1>OTP Verification</h1>
            <p>A verification code has been sent to {email}</p>
            <form onSubmit={handleOtpSubmit}>
              <div>
                <label>Enter OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>
              <button type="submit">Verify OTP</button>
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="back-btn"
              >
                Back to {authType === 'register' ? 'Registration' : 'Login'}
              </button>
            </form>
          </div>
        )}

        {/* Dashboard */}
{step === 4 && (
  <div className="dashboard">
    <h1>Welcome, {user?.username}</h1>
    <p>You are now logged in</p>
    <button onClick={handleLogout}>Logout</button>

    {/* Form untuk ganti username */}
    <div className="change-username">
  <h2>Change Username</h2>
  <input
    type="text"
    placeholder="New Username"
    value={newUsername}
    onChange={(e) => setNewUsername(e.target.value)}
  />
  <button onClick={handleChangeUsername}>Change Username</button>
</div>

    {/* Form untuk ganti password */}
    <div className="change-password">
  <h2>Change Password</h2>
  <input
    type="password"
    placeholder="Old Password"
    value={oldPassword}
    onChange={(e) => setOldPassword(e.target.value)}
  />
  <input
    type="password"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />
  <button onClick={handleChangePassword}>Change Password</button>
    </div>

    {/* Tampilkan daftar artikel */}
    <div className="articles">
      <h2>Latest Articles</h2>
      {articles.length > 0 ? (
        <ul>
          {articles.map((article) => (
            <li key={article.article_id}>
              <h3>{article.title}</h3>
              <p>{article.abstract}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles available</p>
      )}
    </div>
  </div>
)}



        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default App;