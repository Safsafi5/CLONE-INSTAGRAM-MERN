import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const createEmail = (to, url, txt, expirationTime) => {
  return {
    from: process.env.MAIL_FROM,
    to: to,
    subject: "Activation Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://your-logo-url.com/logo.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
          <h2 style="color: #333;">Activate Your Account</h2>
        </div>
        <div style="padding: 20px; background-color: #fff; border-radius: 10px; border: 1px solid #ddd;">
          <h3 style="color: #333;">Welcome to Joki Payton!</h3>
          <p>We are excited to have you get started. First, you need to activate your account. Just press the button below.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" style="background: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">${txt}</a>
          </div>
          <p>If the button above does not work, please use the following link:</p>
          <div style="word-wrap: break-word;">
            <a href="${url}" style="color: #007bff;">${url}</a>
          </div>
          <p><strong>Note:</strong> This activation link is only valid until ${expirationTime}. If you do not activate your account within this time frame, you will need to request a new activation link.</p>
          <p>If you did not request this email, please ignore it.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999;">
          <p>Thanks,<br>The Joki Payton Team</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>You’re receiving this email because you recently created a new account or requested a password reset. If this wasn’t you, please ignore this email.</p>
        <p>Joki Payton Inc., 1234 Example St, City, Country</p>
      </div>
    `,
  };
};

const sendActivationEmail = (email, url, txt, expirationTime) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(createEmail(email, url, txt, expirationTime), (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

export default sendActivationEmail;
