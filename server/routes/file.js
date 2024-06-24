module.exports = app => {

	let express = require('express'),
		ctrl = require('../controllers/fileCtrl')(app.locals.db),
		router = express.Router();

	router.post('/', ctrl.create);
	router.put('/', ctrl.update);
	router.get('/print/:id', ctrl.findForPrint);
	router.get('/:id', ctrl.find);
	router.delete('/:id', ctrl.destroy);

	return router;
};