module.exports = function initJWTRoutes(app) {
	const authenticate = require('./authentication').authenticate;
	const updateLastLogin = require('./utilsDb')(app.locals.db).updateLastLogin;
	const jwt = require('jsonwebtoken');
	const router = require('express').Router();
	const _ = require('lodash');

	router.post('/', function authRoute(req, res) {
		app.locals.db.query(`
		SELECT id, first_name, last_name, email, phone, role, active, role, salt, password
		FROM "User"
		WHERE email = '${req.body.email}'`, {type: app.locals.db.QueryTypes.SELECT}).then(user => {
			if (user.length) {
				if (user[0].active) {
					if (authenticate(req.body.password, user[0].salt, user[0].password)) {
						delete user[0].salt;
						delete user[0].password;
						let obj = {
							id: user[0].id,
							last_name: user[0].last_name,
							first_name: user[0].first_name,
							email: user[0].email,
							phone: user[0].phone,
							role: user[0].role
						};
						let token = jwt.sign(obj, global.config.sKey, {expiresIn: 86400});
						obj.token = token;
						if (_.includes([config.roles.admin], user[0].role)) {
							res.render('admin', {bootstrappedUser: obj});
						} else if (_.includes([config.roles.client, config.roles.guest], user[0].role)) {
							res.render('client', {bootstrappedUser: obj});
							updateLastLogin(user[0].id);
						} else {
							res.render('login', {success: true, message: 'Authentication failed. No such role', token: token});
						}
						app.locals.db.query(`SELECT id, activity FROM "User" WHERE id = ${user[0].id}`, {type: app.locals.db.QueryTypes.SELECT}).then(r => {
							if (r.length) {
								if (!r[0].activity) {
									r[0].activity = {log: []};
								}
								if (r[0].activity.log.length > 30) {
									r[0].activity.log = r[0].activity.log.slice(1);
								}
								r[0].activity.log.push({data: new Date().toISOString()});
								app.locals.db.models.User.update({last_login: new Date(), activity: r[0].activity}, {where: {id: r[0].id}});
							}
						}).catch(err => console.log('update last login & activity', err));
					} else {
						res.render('login', {success: false, message: 'Wrong password'});
					}
				} else {
					res.render('login', {success: false, message: 'Inactive account'});
				}
			} else {
				res.render('login', {success: false, message: 'Authentication failed. No such user'});
			}
		}).catch(err => console.log('find user jwt init', err));
	});

	router.get('/secret', function test(req, res) {
		res.json(req.user);
	});

	return router;
};
