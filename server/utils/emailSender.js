module.exports = () => {

	const {success: rhs , error: rh} = require('../utils/requestHandler');

	return {
		sentMail: email => {
			if (config.env === 'production') {
				let mailOptions = {
					from: 'new-startup ✔ <mitrodanut@gmail.com>',
					to: [email, 'ostasuc.danut@gmail.com'],
					subject: 'New Startup',
					text: '\t Simple text content... \n\n'
				};
				global.smtpTransport.sendMail(mailOptions, err => {
					if (err) {
						console.log('Email send err: ', err);
					} else {
						console.log('Email send NS!!!');
					}
				});
			}
		},

		sentMailResetPWD: (unitate, email) => {
			unitate = !!unitate ? unitate : 'admin';
			if (config.env === 'production') {
				let mailOptions = {
					from: 'new-startup ✔ <mitrodanut@gmail.com>',
					to: [email, 'ostasuc.danut@gmail.com'],
					subject: 'new-startup - password reset',
					text: '\t Some details... \n'
				};
				global.smtpTransport.sendMail(mailOptions, err => {
					if (err) {
						console.log('Email send err: ', err);
					} else {
						console.log('Email send NS!!! ');
					}
				});
			}
		},

		sentMailContact: (mail, res) => {
			if (config.env === 'production') {
				var mailOptions = {
					from: 'new-startup ✔ ' + mail.email,
					to: ['ostasuc.danut@gmail.com'],
					subject: mail.subject,
					text: 'User name: ' + mail.userName + '\n\n' +
					'Email: ' + mail.email + '\n\n' +
					'Phone: ' + mail.phone + '\n\n' +
					'Message: \n' + mail.message
				};
				global.smtpTransport.sendMail(mailOptions, err => {
					if (err) {
						console.log('Email send err: ', err);
						rh(res, 'Email send er', err);
					} else {
						console.log('Email send NS contact!!! ');
						rhs(res);
					}
				});
			} else {
				rhs(res);
			}
		}
	};
};
