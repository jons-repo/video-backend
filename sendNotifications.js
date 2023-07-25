const nodemailer = require('nodemailer');

async function sendEmailNotification(emails, subject, text, hostEmail) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.elasticemail.com',
            port: 2525,
            auth: {
                user: 's.jonathan4252@gmail.com',
                pass: 'F20B35C1488975822809CAC73EEF648C1360', 
            },
        });

        const mailOptions = {
            from: hostEmail,
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
