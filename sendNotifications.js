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
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        for (const phoneNumber of phoneNumbers){
            client.messages
            .create({
                body: `Fuse Video: Someone you follow has started a new livestream. Livestream code: ${livestreamCode}`,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:${phoneNumber}`
            })
            .then(message => console.log(message.sid))
        }

        // for (const phoneNumber of phoneNumbers) {
        //     const message = await client.messages.create({
        //         body: text,
        //         from: process.env.TWILIO_PHONE_NUMBER,
        //         to:  'whatsapp:+16467059723',
        //     });
        //     console.log(message.sid)
        // }

        // console.log('Text sent');
    } catch (error) {
        console.error('Error sending text', error);
    }
}

module.exports = { sendEmailNotification, sendTextNotification};
