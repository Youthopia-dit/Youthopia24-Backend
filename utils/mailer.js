const nodemailer = require("nodemailer");
const path = require("path");

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "registration.youthopia@dituniversity.edu.in",
    pass: "Doz46319",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.SendEmail = async (email, subject, content, attachmentPath) => {
  // Set attachmentPath to null if undefined
  attachmentPath = attachmentPath || null;

  // Define mail options
  const mailOptions = {
    // from: 'registration.youthopia@dituniversity.edu.in',
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
    // Send mail and wait for the result
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return "Mail Sent Successfully";
  } catch (error) {
    console.log("Error occurred:", error);
    return "Mail Sending Failed";
  }
};
