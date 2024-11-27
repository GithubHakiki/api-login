const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = (to, otp) => {
  const msg = {
    to: to,
    from: process.env.EMAIL_FROM,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  sgMail.send(msg).catch(error => console.error('Error sending OTP', error));
};

module.exports = {
  sendOTPEmail
};
