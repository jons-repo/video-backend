const nodemailer = require('nodemailer');

async function sendEmailNotification(emails, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.elasticemail.com',
            port: 2525,
            auth: {
                user: process.env.ELASTICEMAIL_USER,
                pass: process.env.ELASTICEMAIL_KEY, 
            },
        });

        const mailOptions = {
            from: process.env.ELASTICEMAIL_USER,
            to: emails.join(','),
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);

        console.log('Email notification sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmailNotification;
