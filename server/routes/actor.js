module.exports = app => {

	let express = require('express'),
		ctrl = require('../controllers/actorCtrl')(app.locals.db),
		router = express.Router();

	router.post('/', ctrl.createUpdate);
	router.get('/', ctrl.findAll);
	router.get('/byId/:id', ctrl.find);
	router.delete('/byId/:id', ctrl.destroy);

	return router;
};
