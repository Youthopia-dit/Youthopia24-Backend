const nodemailer = require("nodemailer");
const path = require("path");
require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.user,
    pass :  process.env.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.SendEmail = async (email, subject, content, attachmentPath) => {
  attachmentPath = attachmentPath || null;

  const mailOptions = {
    from: 'registration.youthopia@dituniversity.edu.in',
    to: email,
    subject: subject,
    text: content,
    attachments: attachmentPath
      ? [
          {
            filename: path.basename(attachmentPath),
            path: attachmentPath,
          },
        ]
      : [],
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return "Mail Sent Successfully";
  } catch (error) {
    console.log("Error occurred:", error);
    return "Mail Sending Failed";
  }
};
