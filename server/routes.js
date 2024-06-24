module.exports = app => {

	let errors = require('./errors');
	let auth = require('./utils/authentication');

	app.post('/', require('./utils/jwtInit')(app));
	app.use('/auth', require('./routes/authentication'));

	// ----------------------------- APP - ADMIN -----------------------------
	app.use('/api/user', auth.requireLogin, require('./routes/user')(app));
	app.use('/api/userAction', require('./routes/userAction')(app));
	app.use('/api/userError', auth.requireLogin, require('./routes/userError')(app));

	// ----------------------------- DRAFTS -----------------------------
	app.use('/api/draftGender', auth.requireLogin, require('./routes/drafts/draftGender')(app));
	app.use('/api/draftActorRole', auth.requireLogin, require('./routes/drafts/draftActorRole')(app));

	// ----------------------------- APP - CLIENT -----------------------------
	app.use('/api/movie', auth.requireLogin, require('./routes/movie')(app));
	app.use('/api/actor', auth.requireLogin, require('./routes/actor')(app));
	app.use('/api/article', auth.requireLogin, require('./routes/article')(app));
	app.use('/api/file', auth.requireLogin, require('./routes/file')(app));

	//app.use('/reports', auth.requireLogin, require('./routes/reports')(app));
	//app.use('/download', auth.requireLogin, require('./routes/download')(app));

	app.get('/app/*', (req, res) => res.render('../../public/app/' + req.params['0']));

	app.route('*/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
	app.route('/').get((req, res) => res.render('login'));
	app.route('*').get(errors[404]);
};

