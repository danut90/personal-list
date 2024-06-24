module.exports = db => {
	'use strict';
	const saveError = require('../utils/utilsDb')(db).saveError;
	const rhs = require('../utils/requestHandler').success;

	return {
		create: (req, res) => {
			let ob = req.body;
			ob.id_user = req.user.id;
			ob.extension = req.files.file.extension;
			ob.content = req.files.file.buffer;
			db.models.File.create(ob).then(() => {
				//res.json({id: resp.id});
				rhs(res);
			}).catch(e => saveError(req.user, 'create File', e, res));
		},

		update: (req, res) => {
			if (req.body.number === 'undefined' || req.body.number === 'null') {
				delete req.body.number;
			}
			let ob = req.body;
			if (req.files.file) {
				ob.extension = req.files.file.extension;
				ob.content = req.files.file.buffer;
			}
			if (req.body.removeFile === 'true') {
				req.body.extension = null;
				req.body.content = null;
			}
			db.models.File.update(req.body, {where: {id: req.body.id}}).then(() => {
				rhs(res);
			}).catch(e => saveError(req.user, 'update File, id: ' + req.body.id, e, res));
		},

		findForPrint: (req, res) => {
			let content = {
				pdf: 'application/pdf',
				doc: 'application/msword',
				docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				xls: 'application/vnd.ms-excel',
				xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			};
			db.query('SELECT name, extension, content FROM "File" WHERE id = ' + req.params.id).then(resp => {
				if (resp[0].length) {
					if (content[resp[0][0].extension]) {
						res.contentType(content[resp[0][0].extension]);
					} else {
						res.contentType('application/' + content[resp[0][0].extension]);
					}
					res.send(resp[0][0].content);
				} else {
					res.sendStatus(404);
				}
			}).catch(e => saveError(req.user, 'findForPrint File, id: ' + req.params.id, e, res));
		},

		find: (req, res) => {
			db.query('SELECT id, id_user, name, extension FROM "File" WHERE id = ' + req.params.id).then(resp => {
				if (resp[0].length) {
					res.send(resp[0][0]);
				} else {
					saveError(req.user, 'find File, id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'find File, id: ' + req.params.id, e, res));
		},

		destroy: (req, res) => {
			db.query('DELETE FROM "File" WHERE id = ' + req.params.id).then(resp => {
				if (resp[1].rowCount > 0) {
					rhs(res);
				} else {
					saveError(req.user, 'destroy File, id: ' + req.params.id, 'not found', res);
				}
			}).catch(e => saveError(req.user, 'destroy File, id: ' + req.params.id, e, res));
		}
	};
};