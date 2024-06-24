module.exports = app => {

	let express = require('express'),
		ctrl = require('../controllers/userActionCtrl')(app.locals.db),
		router = express.Router();

	router.get('/byDate/:date', ctrl.findAll);
	router.get('/history/byIdUser/:id_user/:clauseType/:limit', ctrl.historyByIdUser);
	router.get('/historyLogIn/byIdUser/:id_user', ctrl.historyLogInByIdUser);
	router.delete('/removeReportActions/:id_user', ctrl.removeReportActions);
	router.delete('/removeLogInActions/:id_user', ctrl.removeLogInActions);

	return router;
};