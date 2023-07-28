const nodemailer = require('nodemailer');
const twilio = require('twilio');

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

async function sendTextNotification(phoneNumbers, livestreamCode) {
    console.log(process.env.TWILIO_SID, "string");
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log(process.env.TWILIO_SID, "string");
    const text = `A new livestream has started! http://localhost:3000/livestream/${livestreamCode}`;
    try {

        for (const phoneNumber of phoneNumbers) {
            await client.messages.create({
                body: text,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });
        }

        console.log('Text sent');
    } catch (error) {
        console.error('Error sending text', error);
    }
}

module.exports = { sendEmailNotification, sendTextNotification};
