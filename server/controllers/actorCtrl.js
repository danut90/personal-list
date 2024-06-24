module.exports = db => {
	'use strict';
	const {success: rhs} = require('../utils/requestHandler');
	const saveError = require('../utils/utilsDb')(db).saveError;

	return {
		createUpdate: (req, res) => {
			if (!req.body.id) {
				db.models.Actor.create(req.body).then(r => res.json(r)).catch(e => saveError(req.user, `actorCtrl create`, e, res));
			} else {
				db.models.Actor.update(req.body, {where: {id: req.body.id}}).then(r => {
					if (r[0] > 0) {
						rhs(res);
					} else {
						saveError(req.user, `actorCtrl update, id: ${req.body.id}`, 'not found', res);
					}
				}).catch(e => saveError(req.user, `actorCtrl update, id: ${req.body.id}`, e, res));
			}
		},

		findAll: (req, res) => {
			db.query(`
			SELECT *
			FROM "Actor"
			WHERE id_user = ${req.user.id}
			ORDER BY name
			`, {type: db.QueryTypes.SELECT}).then(r => {
				res.json(r);
			}).catch(e => saveError(req.user, `actorCtrl findAll`, e, res));
		},

		find: (req, res) => {
			db.query(`SELECT * FROM "Actor" WHERE id = ${req.params.id}`, {type: db.QueryTypes.SELECT}).then(r => {
				if (r.length) {
					res.json(r[0]);
				} else {
					saveError(req.user, `actorCtrl find, id: ${req.params.id}`, 'not found', res);
				}
			}).catch(e => saveError(req.user, `actorCtrl find, id: ${req.params.id}`, e, res));
		},

		destroy: (req, res) => {
			db.query(`DELETE FROM "Actor" WHERE id = ${req.params.id}`).then(r => {
				if (r[1].rowCount > 0) {
					rhs(res);
				} else {
					saveError(req.user, `actorCtrl destroy, id: ${req.params.id}`, 'not found', res);
				}
			}).catch(e => saveError(req.user, `actorCtrl destroy, id: ${req.params.id}`, e, res));
		}

	};
};
