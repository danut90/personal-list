module.exports = db => {
	'use strict';
	//let emailSender = require('./emailSender')();
	let async = require('async');
	return {

		saveAction: (idUser, action, details, isReport) => {
			if (idUser) {
				db.models.UserAction.create({
					id_user: idUser,
					action: action,
					details: details,
					date: new Date(),
					is_report: (isReport !== null || isReport !== undefined ? isReport : null)
				}).catch(e => console.log('update user action', e));
			}
		},

		saveError: (user, action, e, res) => {
			console.log(action, e);
			if (user) {
				//let text = 'Error Date: ' + (new Date()) + '\n\n' +
				//	'User Id: ' + user.id + '\n\n' +
				//	'Action: ' + action + '\n\n' +
				//	'Error: ' + e.toString();
				//emailSender.sendMailErr(text);
				db.models.UserError.create({id_user: user.id, action: action, details: e.toString()}).then(() => {
					if (res) {
						res.status(500);
						res.end();
					}
				}).catch(() => {
					if (res) {
						res.status(500);
						res.end();
					}
				});
			}
		},

		updateLastLogin: idUser => {
			if (idUser) {
				let tasks = [];
				tasks.push(cb => {
					db.models.User.update({last_login: new Date()}, {where: {id: idUser}}).then(() => cb()).catch(e => cb(e));
				});
				tasks.push(cb => {
					db.query('UPDATE "UserAction" SET date=now(), details=details || \';\' || now()::text WHERE action=\'LogIn\' AND id_user = ' + idUser).then(resp => {
						if (resp[1].rowCount > 0) {
							cb();
						} else {
							db.query('INSERT INTO "UserAction"(action, date, details, "createdAt", "updatedAt", id_user) ' +
								'VALUES (\'LogIn\', now(), now(), now(), now(), ' + idUser + ')').then(() => cb()).catch(e => cb(e));
						}
					}).catch(e => cb(e));
				});
				async.parallel(tasks, () => null);
			}
		}
	};
};
