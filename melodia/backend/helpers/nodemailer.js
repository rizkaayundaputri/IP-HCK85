require('dotenv').config();
const nodemailer = require('nodemailer');


async function sendEmail(to) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rizkaayunda1798@gmail.com', 
      pass: process.env.EMAIL_PASS // Use environment variable for security
    }
  });

  const mailOptions = {
    from: 'rizkaayunda1798@gmail.com', 
    to: to, 
    subject: 'Halo dari Team Noisely', 
    text: 'Terima kasih telah bergabung dengan Noisely!'
  };

  try {
    // Skip email sending in test environment
    if (process.env.NODE_ENV === 'test') {
      console.log('Email sending skipped in test environment');
      return;
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email berhasil dikirim:', info.response);
  } catch (error) {
    console.log('Gagal kirim email:', error);
  }
}

module.exports = sendEmail