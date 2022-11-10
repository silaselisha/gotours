const nodemailer = require('nodemailer');

const sendMail = async ({email, message}) => {
    const trasnport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'admin@gotours.io',
        to: email,
        subject: 'Reset user password',
        text: message
    }

    await trasnport.sendMail(mailOptions);
}

module.exports = sendMail;