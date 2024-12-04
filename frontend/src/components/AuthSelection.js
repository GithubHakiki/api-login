import React from 'react';

const AuthSelection = ({ setStep, setAuthType }) => (
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
);

export default AuthSelection;
