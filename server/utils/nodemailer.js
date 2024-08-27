import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1aab8ac9bc9b1d",
      pass: "a7da7100316af3"
    }
  });

const sendEmail = async (info) => {
    const mailOptions = {
        to: info.email,
        from: 'no-reply@mochasupport.com',
        subject: 'Password reset request',
        text: info.message
    }

    await transporter.sendMail(mailOptions);
}

export default sendEmail;