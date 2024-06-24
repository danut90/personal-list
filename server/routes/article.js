module.exports = app => {

	let express = require('express'),
		ctrl = require('../controllers/articleCtrl')(app.locals.db),
		router = express.Router();

	router.post('/', ctrl.createUpdate);
	router.get('/', ctrl.findAll);
	router.get('/:id', ctrl.find);
	router.delete('/:id', ctrl.destroy);

	return router;
};