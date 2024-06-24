module.exports = db => {
	'use strict';
	const {success: rhs} = require('../../utils/requestHandler');
	const saveError = require('../../utils/utilsDb')(db).saveError;

	return {
		createUpdate: (req, res) => {
			if (!req.body.id) {
				db.models.DraftActorRole.create(req.body).then(resp => res.json(resp)).catch(e => saveError(req.user, 'create DraftActorRole', e, res));
			} else {
				db.models.DraftActorRole.update(req.body, {where: {id: req.body.id}}).then(resp => {
					if (resp[0] > 0) {
						rhs(res);
					} else {
						saveError(req.user, 'update DraftActorRole at id: ' + req.body.id, 'not found', res);
					}
				}).catch(e => saveError(req.user, 'update DraftActorRole at id: ' + req.body.id, e, res));
			}
		},

		findAll: (req, res) => {
			db.query('SELECT id, name FROM "DraftActorRole" ORDER BY id').then(resp => {
				res.json(resp[0]);
			}).catch(e => saveError(req.user, 'findAll DraftActorRole', e, res));
		},

		find: (req, res) => {
			db.query('SELECT id, name FROM "DraftActorRole" WHERE id = ' + req.params.id).then(resp => {
				if (resp[0].length) {
					res.json(resp[0][0]);
				} else {
					saveError(req.user, 'find DraftActorRole at id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'find DraftActorRole at id: ' + req.params.id, e, res));
		},

		destroy: (req, res) => {
			db.query('DELETE FROM "DraftActorRole" WHERE id = ' + req.params.id).then(resp => {
				if (resp[1].rowCount > 0) {
					rhs(res);
				} else {
					saveError(req.user, 'destroy DraftActorRole at id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'destroy DraftActorRole at id: ' + req.params.id, e, res));
		}
	};
};