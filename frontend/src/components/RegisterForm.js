import React from 'react';

const RegisterForm = ({ email, setEmail, username, setUsername, password, setPassword, handleRegisterSubmit, setStep }) => (
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
);

export default RegisterForm;
