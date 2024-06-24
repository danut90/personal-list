module.exports = app => {

	let express = require('express'),
		requireLogin = require('../utils/authentication').requireLogin,
		ctrl = require('../controllers/userCtrl')(app.locals.db),
		router = express.Router();


	router.get('/bootstrapped/user', requireLogin, (req, res) => res.json(req.user));

	router.post('/', ctrl.create);
	router.get('/', ctrl.findAll);
	router.put('/', ctrl.update);

	router.delete('/:id', ctrl.destroy);


	router.post('/verifyEmail', requireLogin, ctrl.verifyEmail);
	router.post('/verifyPassword', requireLogin, ctrl.verifyPassword);
	router.post('/resetPassword', requireLogin, ctrl.resetPassword);

	//router.post('/admin/set/activeInactive', ctrl.setActiveInactiveFromAdmin);
	//router.post('/client/set/activeInactive', ctrl.setActiveInactiveFromClient);

	router.get('/dbInfo/:id', ctrl.dbInfo);
	router.get('/activity/:id', ctrl.activity);
	router.get('/history/:id', ctrl.history);

	router.post('/mailContact/send', ctrl.sendMailContact);

	return router;
};