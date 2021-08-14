const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	const message = {
		from: process.env.SMTP_FROM_EMAIL,
		to: options.email,
		subject: options.subject,
		html: options.message,
	};

	transporter.verify(function (error, success) {
		if (error) {
			console.log(error);
		} else {
			console.log('Server ready to take message');
		}
	});

	await transporter.sendMail(message);
};

module.exports = sendEmail;
