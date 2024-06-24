module.exports = db => {
	'use strict';
	const {success: rhs , error: rh} = require('../utils/requestHandler');
	const auth = require('../utils/authentication');
	const randomString = require('../utils/utilsDb')(db).randomString;
	const emailSender = require('../utils/emailSender')();
	const saveError = require('../utils/utilsDb')(db).saveError;

	return {
		create: (req, res) => {
			db.models.User.create(req.body).then(resp => {
				res.json(resp);
			}).catch(e => saveError(req.user, 'create User', e, res));
		},

		findAll: (req, res) => {
			db.query('SELECT id, first_name, last_name, email, phone, role FROM "User" ORDER BY id').then(resp => {
				res.json(resp[0]);
			}).catch(e => saveError(req.user, 'findAll User', e, res));
		},

		update: (req, res) => {
			db.models.User.update(req.body, {where: {id: req.body.id}}).then(resp => {
				if (resp[0] > 0) {
					rhs(res);
				} else {
					saveError(req.user, 'update User at id: ' + req.body.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'update User at id: ' + req.body.id, e, res));
		},

		destroy: (req, res) => {
			db.models.User.destroy({where: {id: req.params.id}}).then(resp => {
				if (resp > 0) {
					rhs(res);
				} else {
					saveError(req.user, 'destroy User at id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'destroy User at id: ' + req.params.id, e, res));
		},

		verifyEmail: (req, res) => {
			if (req.body.email) {
				db.query('SELECT id FROM "User" WHERE email = \'' + req.body.email + '\'').then(resp => {
					res.json({isEmail: resp[0].length > 0});
				}).catch(e => saveError(req.user, 'verifyEmail User', e, res));
			} else {
				saveError(req.user, 'verifyEmail User', 'no data received', res);
			}
		},

		verifyPassword: (req, res) => {
			db.query('Select salt from "User" where id = ' + req.user.id).then(resp => {
				if (resp[0].length) {
					let hashed_pwd = auth.hashPwd(resp[0][0].salt, req.body.oldPass);
					db.query('SELECT salt FROM "User" WHERE password = \'' + hashed_pwd + '\' AND id = ' + req.user.id).then(resp => {
						res.json({isPass: resp[0].length > 0});
					}).catch(e => saveError(null, 'get user for verify old pwd', e, res));
				} else {
					rh(res, 'No user found', null);
				}
			}).catch(e => saveError(null, 'get user for verify pwd', e, res));
		},

		resetPassword: (req, res) => {
			db.query(`SELECT id, salt FROM "User" WHERE id = + ${req.body.id}`).then(resp => {
				if (resp[0].length) {
					let pass = !!req.body.pass ? req.body.pass : randomString(6),
						user = resp[0][0];
					db.models.User.update({password: auth.hashPwd(user.salt, pass)}, {where: {id: user.id}}).then(resp => {
						if (resp[0] > 0) {
							emailSender.sentMailResetPWD(req.body.name, req.body.email, pass);
							rhs(res);
						} else {
							saveError(req.user, 'resetPassword User - update user at id: ' + req.body.id, 'not found', res);
						}
					}).catch(e => saveError(req.user, 'resetPassword User - update user at id: ' + req.body.id, e, res));
				} else {
					saveError(req.user, 'resetPassword User - find user at id: ' + req.body.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'resetPassword User - find user at id: ' + req.body.id, e, res));
		},

		//resetPasswordSelf: (req, res) => {
		//  db.query(`Select salt from "User" where id = + ${req.user.id}`).then(resp => {
		//    if (resp[0].length) {
		//      let hashed_pwd = auth.hashPwd(resp[0][0].salt, req.body.pass);
		//      db.models.User.update({password: hashed_pwd}, {where: {id: req.user.id}}).then(() => {
		//        emailSender.sentMailResetPWD(req.user.last_name, req.user.email, req.body.pass);
		//        rhs(res);
		//      });
		//    } else {
		//      rh(res, 'No user found', null);
		//    }
		//  }).catch(e => {
		//    saveError(null, 'get user for reset pwd self', e, res);
		//  });
		//},

		dbInfo: (req, res) => {
			db.query('SELECT count(*) FROM "Movie" WHERE id_user = ' + req.params.id).then(resp => {
				res.json({movies: resp[0][0].count});
			}).catch(e => saveError(req.user, 'dbInfo User', e, res));
		},

		activity: (req, res) => {
			db.query('SELECT ACTIVITY FROM "User" WHERE id = ' + req.params.id).then(resp => {
				if (resp[0].length && resp[0][0].activity) {
					res.json(resp[0][0].activity.log);
				} else {
					res.json([]);
				}
			}).catch(e => saveError(req.user, 'activity User', e, res));
		},

		history: (req, res) => {
			db.query('SELECT * FROM "UserAction" WHERE id_user = ' + req.params.id_user + ' ORDER BY id DESC').then(resp => {
				res.json(resp[0]);
			}).catch(e => saveError(req.user, 'history User', e, res));
		},

		sendMailContact: (req, res) => {
			emailSender.sentMailContact(req.body, res);
		}
	};
};