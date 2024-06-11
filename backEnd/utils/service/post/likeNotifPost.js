import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const createLikeNotificationEmail = (to, postTitle, likerUsername) => {
    return {
      from: process.env.MAIL_FROM,
      to: to,
      subject: "Your Post Was Liked!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-logo-url.com/logo.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
            <h2 style="color: #333;">Your Post Was Liked!</h2>
          </div>
          <div style="padding: 20px; background-color: #fff; border-radius: 10px; border: 1px solid #ddd;">
            <p>Dear User,</p>
            <p>Your post titled "${postTitle}" was liked by ${likerUsername}.</p>
            <p>If you have any questions or need further assistance, please don't hesitate to reach out to our support team.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999;">
            <p>Thanks,<br>The Support Team</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>You’re receiving this email because your post received a new like.</p>
          <p>Company Inc., 1234 Example St, City, Country</p>
        </div>
      `,
    };
  };
  
  const sendLikeNotificationEmail = (email, postTitle, likerUsername) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(createLikeNotificationEmail(email, postTitle, likerUsername), (err, info) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("Like notification email sent: " + info.response);
          resolve(true);
        }
      });
    });
  };


  export default sendLikeNotificationEmail;