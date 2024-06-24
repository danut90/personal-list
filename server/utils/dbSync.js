module.exports = app => {

	let query = '';
	if (query.length) {
		app.locals.db.sequelize.query(query).then(()=> {
			console.log('Sync DB');
		}).catch(e => console.log('Sync DB error: ', e));
	}
};
