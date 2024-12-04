import React, { useState } from 'react';
import axios from 'axios';

const ChangeUserDetail = () => {
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post(
        'http://localhost:3000/change-username',
        { newUsername },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setNewUsername('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating username');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post(
        'http://localhost:3000/change-password',
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating password');
    }
  };

  return (
    <div>
      <h2>Change Username</h2>
      <form onSubmit={handleChangeUsername}>
        <div>
          <label>New Username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Username</button>
      </form>

      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>

      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default ChangeUserDetail;
