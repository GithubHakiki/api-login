import React from 'react';

const LoginForm = ({ email, setEmail, password, setPassword, handleLoginSubmit, setStep }) => (
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
);

export default LoginForm;
