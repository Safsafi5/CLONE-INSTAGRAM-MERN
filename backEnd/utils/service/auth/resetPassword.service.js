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
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          
          <h2 style="color: #333;">Reset your Joki Payton password</h2>
        </div>
        <div style="padding: 20px; background-color: #fff; border-radius: 10px; border: 1px solid #ddd;">
          <h3 style="color: #333;">Joki Payton password reset</h3>
          <p>We heard that you lost your Joki Payton password. Sorry about that!</p>
          <p>But don’t worry! You can use the following button to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" style="background: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">${txt}</a>
          </div>
          <p>If the button above does not work, please use the following link:</p>
          <div style="word-wrap: break-word;">
            <a href="${url}" style="color: #007bff;">${url}</a>
          </div>
          <p><strong>Note:</strong> If you don’t use this link within ${expirationTime}, it will expire. To get a new password reset link, visit: </p>
          <p>If you did not request this email, please ignore it.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999;">
          <p>Thanks,<br>The Joki Payton Team</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>You’re receiving this email because a password reset was requested for your account.</p>
        <p>Joki Payton, Inc., 88 Colin P Kelly Jr Street, San Francisco, CA 94107</p>
      </div>
    `,
  };
};

const sendPasswordResetEmail = (email, url, txt, expirationTime) => {
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

export default sendPasswordResetEmail;
