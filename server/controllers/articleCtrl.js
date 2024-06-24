module.exports = db => {
	'use strict';
	const {success: rhs , error: rh} = require('../utils/requestHandler');
	const saveError = require('../utils/utilsDb')(db).saveError;

	return {
		createUpdate: (req, res) => {
			if (!req.body.id) {
				db.models.Article.create(req.body).then(resp => res.json(resp)).catch(e => saveError(req.user, 'create Article', e, res));
			} else {
				db.models.Article.update(req.body, {where: {id: req.body.id}}).then(resp => {
					if (resp[0] > 0) {
						rhs(res);
					} else {
						saveError(req.user, 'update Article at id: ' + req.body.id, 'not found', res);
					}
				}).catch(e => saveError(req.user, 'update Article at id: ' + req.body.id, e, res));
			}
		},

		findAll: (req, res) => {
			db.query(`
			SELECT a.*, f.id AS id_file, f.name AS file_name, f.extension AS file_extension
			FROM "Article" a
			LEFT JOIN "File" f ON f.id_article = a.id
			WHERE a.id_user = ${req.user.id}
			ORDER BY a.id DESC`, {type: db.QueryTypes.SELECT}).then(r => {
				res.json(r);
			}).catch(e => saveError(req.user, `articleCtrl findAll`, e, res));
		},

		find: (req, res) => {
			db.query('SELECT a.*, case when f.content is not null then true else false end AS has_file ' +
			'FROM "Article" a ' +
			'LEFT JOIN "File" f ON f.id_article = a.id ' +
			'WHERE a.id = ' + req.params.id).then(resp => {
				if (resp[0].length) {
					res.json(resp[0][0]);
				} else {
					saveError(req.user, 'find Article at id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'find Article at id: ' + req.params.id, e, res));
		},

		destroy: (req, res) => {
			db.query('DELETE FROM "Article" WHERE id = ' + req.params.id).then(resp => {
				if (resp[1].rowCount > 0) {
					rhs(res);
				} else {
					rh(res, 'destroy Article at id: ' + req.params.id, 'not found');
				}
			}).catch(e => saveError(req.user, 'destroy Article at id: ' + req.params.id, e, res));
		}

	};
};
