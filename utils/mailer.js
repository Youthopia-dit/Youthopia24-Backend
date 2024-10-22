const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "noreply.youthopia@dit.edu.in",
    pass: "C)618294122404ah",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.SendEmail = (email, subject, content) => {
  const mailOptions = {
    from: '"Youthopia" <noreply.youthopia@dit.edu.in>',
    to: email,
    subject: subject,
    text: content,
  };

  const flag = 0;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error);
      flag = 1;
      return "Mail Sending Failed";
    }
    console.log("Message sent: %s", info.messageId);
    return "Mail Sent Successfully";
  });
  if (flag == 0) {
    return "Mail Sent Successfully";
  }
  return "Error Occured";
};
