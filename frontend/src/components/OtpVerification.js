import React from 'react';

const OtpVerification = ({ otp, setOtp, handleOtpSubmit }) => (
  <div className="otp-verification">
    <h2>Enter OTP</h2>
    <form onSubmit={handleOtpSubmit}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button type="submit">Verify OTP</button>
    </form>
  </div>
);

export default OtpVerification;
