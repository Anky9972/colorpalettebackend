const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS, 
  },
});

exports.forgotPassword = async (req, res) => {
  console.log('API hit');
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = jwt.sign({ resetToken }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetURL = `https://colorpalettegenerate.vercel.app/reset-password/${resetPasswordToken}`;
    const message = `You requested a password reset.\n\nLink will be expired in 1hr.\n\n Here is your reset password url: \n\n ${resetURL}`;

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in sending email:', error);
    res.status(500).json({ message: 'Error in sending email', error });
  }
};
exports.resetPassword = async (req, res) => {
  console.log('reset api hit')
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
   
    jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }


    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error });
  }
};