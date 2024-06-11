import nodemailer from 'nodemailer';
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const createConfirmationEmail = (to) => {
  return {
    from: process.env.MAIL_FROM,
    to: to,
    subject: "Your Password Has Been Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://your-logo-url.com/logo.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
          <h2 style="color: #333;">Password Reset Successful</h2>
        </div>
        <div style="padding: 20px; background-color: #fff; border-radius: 10px; border: 1px solid #ddd;">
          <p>Dear User,</p>
          <p>Your password has been successfully reset. If you did not perform this action, please contact our support team immediately.</p>
          <p>If you have any questions or need further assistance, please don't hesitate to reach out to our support team.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999;">
          <p>Thanks,<br>The Support Team</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>You’re receiving this email because a password reset was performed for your account.</p>
        <p>Company Inc., 1234 Example St, City, Country</p>
      </div>
    `,
  };
};

const sendPasswordResetConfirmationEmail = (email) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(createConfirmationEmail(email), (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Confirmation email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

export default sendPasswordResetConfirmationEmail;
