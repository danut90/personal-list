module.exports = app => {

	let express = require('express'),
		ctrl = require('../controllers/movieCtrl')(app.locals.db),
		router = express.Router();

	router.post('/', ctrl.createUpdate);
	router.get('/forAddEdit', ctrl.forAddEdit);
	router.get('/', ctrl.findAll);
	router.get('/byId/:id', ctrl.find);
	router.delete('/byId/:id', ctrl.destroy);

	return router;
};