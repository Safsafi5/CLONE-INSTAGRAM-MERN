import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const createEmail = (to, url, txt) => {
    return {
      from: process.env.MAIL_FROM,
      to: to,
      subject: "Activation Confirmation",
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase; color: teal;">Welcome to Joki Payton</h2>
          <p>Congratulations! You're almost set to start using Joki Payton. Please click the button below to validate your email address.</p>
          <a href="${url}" style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
          <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          <div>${url}</div>
          <p><strong>Note:</strong> This activation link is only valid for 5 minutes. If you do not activate your account within this time frame, you will need to request a new activation link.</p>
          <p>If you did not request this email, please ignore it.</p>
        </div>
        <img src="cid:unique@nodemailer.com" alt="Description image" style="display: block; margin: 0 auto; max-width: 100%; height: auto;">`,
      attachments: [{
        filename: 'sdo.jpeg',
        path: '../images/sdo.jpeg',
        cid: 'unique@nodemailer.com' // same cid value as in the html img src
      }]
    };
  };
  

const activateEmail = (email, token, txt) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(createEmail(email, token, txt), (err, info) => {
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

export default activateEmail;
