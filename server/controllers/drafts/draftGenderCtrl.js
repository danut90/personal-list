module.exports = db => {
	'use strict';
	const {success: rhs} = require('../../utils/requestHandler'),
		saveError = require('../../utils/utilsDb')(db).saveError;

	return {
		createUpdate: (req, res) => {
			if (!req.body.id) {
				db.models.DraftGender.create(req.body).then(resp => res.json(resp)).catch(e => saveError(req.user, 'create DraftGender', e, res));
			} else {
				db.models.DraftGender.update(req.body, {where: {id: req.body.id}}).then(resp => {
					if (resp[0] > 0) {
						rhs(res);
					} else {
						saveError(req.user, 'update DraftGender at id: ' + req.body.id, 'not found', res);
					}
				}).catch(e => saveError(req.user, 'update DraftGender at id: ' + req.body.id, e, res));
			}
		},

		findAll: (req, res) => {
			db.query('SELECT id, name FROM "DraftGender" ORDER BY name').then(resp => {
				res.json(resp[0]);
			}).catch(e => saveError(req.user, 'findAll DraftGender', e, res));
		},

		find: (req, res) => {
			db.query('SELECT id, name FROM "DraftGender" WHERE id = ' + req.params.id).then(resp => {
				if (resp[0].length) {
					res.json(resp[0][0]);
				} else {
					saveError(req.user, 'find DraftGender at id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'find DraftGender at id: ' + req.params.id, e, res));
		},

		destroy: (req, res) => {
			db.query('DELETE FROM "DraftGender" WHERE id = ' + req.params.id).then(resp => {
				if (resp[1].rowCount > 0) {
					rhs(res);
				} else {
					saveError(req.user, 'destroy DraftGender at id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'destroy DraftGender at id: ' + req.params.id, e, res));
		}
	};
};