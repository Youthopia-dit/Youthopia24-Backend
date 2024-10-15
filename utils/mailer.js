const nodemailer = require('nodemailer');

// Create a transporter for Outlook 365
let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587, // As per Outlook 365 SMTP settings
    secure: false, // True for 465, false for other ports
    auth: {
        user: 'youthopia@dit.edu.in', // Your Outlook 365 email address
        pass: 'P%808934281838at' // Your Outlook 365 password
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

exports.SendEmail=(email,subject,content)=>{
    const mailOptions = {
        from: 'Youthopia 2024', 
        to: email, 
        subject: subject, 
        text: content, 
        // html: '<b>Hello world?</b>'
    };
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
    return "Mail Sent Successfully"
}   

// Setup email data


