(function () {
	'use strict';
	const nodemailer = require('nodemailer');

	exports.createTransport = () => {
		console.log('Init email transport');
		return nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				type: 'OAuth2',
				user: 'ostasuc.danut@gmail.com',
				clientId: '918980086257-84r9fmmhv7cfugsani4nip4t8gmj6tlo.apps.googleusercontent.com',
				clientSecret: 'hYP1q2vm6T11DZx1VWRS82EB',
				refreshToken: '1/ap_ki7CdbTvj8PPNNVFfSL7NVREzxYUJ5GO3xPobgBE',
				accessToken: 'ya29.GlvaBR_CGR461pQAyMsVsUSgqKaptgiFkE2oEEyLdzr401vTuFuq894mfiFAfB_Eoo3dxu2Zi4zfiCJAWYIPnRUGdNfaFg5lANC7pOzemPZtYL25fu07q-82w14K',
				expires: 1484314697598
			}
		});
	};
})();
