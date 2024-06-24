module.exports = app => {

	let express = require('express'),
		ctrl = require('../controllers/userErrorCtrl')(app.locals.db),
		router = express.Router();

	router.get('/', ctrl.findAll);
	router.get('/count/all', ctrl.countAll);
	router.delete('/:id', ctrl.destroy);
	router.delete('/', ctrl.destroyAll);

	return router;
};