module.exports = db => {
	'use strict';
	const rhs = require('../utils/requestHandler').success,
		saveError = require('../utils/utilsDb')(db).saveError;

	return {
		findAll: (req, res) => {
			db.query('SELECT concat(u.first_name, \' \', u.last_name) AS user, u.email, a.action, a.date, a.details, is_report ' +
			'FROM "UserAction" a ' +
			'LEFT JOIN "User" u ON u.id = a.id_user ' +
			'WHERE action <> \'LogIn\' AND to_char(a.date, \'YYYY-MM-DD\') = \'' + req.params.date + '\' ' +
			'ORDER BY a.date DESC').then(resp => {
				res.json(resp[0]);
			}).catch(e => saveError(req.user, 'findAll UserAction', e, res));
		},

		historyByIdUser: (req, res) => {
			db.query('SELECT action, date, details, case when is_report is true then true else false end AS is_report ' +
			'FROM "UserAction" ' +
			'WHERE id_user = ' + req.params.id_user + ' AND action <> \'LogIn\' ' +
			'ORDER BY id DESC ' + req.params.clauseType + ' ' + req.params.limit).then(resp => {
				res.json(resp[0]);
			}).catch(e => saveError(req.user, 'historyByIdUser UserAction', e, res));
		},

		historyLogInByIdUser: (req, res) => {
			db.query('SELECT details FROM "UserAction" WHERE action = \'LogIn\' AND id_user = ' + req.params.id_user).then(resp => {
				if (resp[0].length) {
					let arr = resp[0][0].details.split(';'), tmp = [];
					for (let i = arr.length - 1; i >= 0; i--) {
						tmp.push({date: new Date(arr[i])});
					}
					res.json(tmp);
				} else {
					res.json([]);
				}
			}).catch(e => saveError(req.user, 'historyLogInByIdUser UserAction', e, res));
		},

		removeReportActions: (req, res) => {
			db.query('DELETE FROM "UserAction" WHERE is_report is true AND id_user = ' + req.params.id_user).then(() => {
				rhs(res);
			}).catch(e => saveError(req.user, 'removeReportActions UserAction', e, res));
		},

		removeLogInActions: (req, res) => {
			db.query('DELETE FROM "UserAction" WHERE action = \'LogIn\' AND id_user = ' + req.params.id_user).then(() => {
				rhs(res);
			}).catch(e => saveError(req.user, 'removeReportActions UserAction', e, res));
		}
	};
};