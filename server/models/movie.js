module.exports = (sequelize, DataType) => {
	let model = sequelize.define('Movie', {
		order_code: {
			type: DataType.INTEGER
		},
		name: {
			type: DataType.STRING
		},
		year: {
			type: DataType.INTEGER
		},
		ids_gender: {
			type: DataType.ARRAY(DataType.INTEGER)
		},
		description: {
			type: DataType.TEXT
		},
		view_date: {
			type: DataType.DATEONLY
		},
		note_cinemarx: {
			type: DataType.NUMERIC
		},
		note_cinemagia: {
			type: DataType.NUMERIC
		},
		note_imdb: {
			type: DataType.NUMERIC
		},
		link_cinemarx: {
			type: DataType.TEXT
		},
		link_cinemagia: {
			type: DataType.TEXT
		},
		link_imdb: {
			type: DataType.TEXT
		}
	}, {
		timestamps: true
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'cascade'});
	model.belongsTo(sequelize.models.Movie, {foreignKey: 'id_movie_from', onDelete: 'cascade'});
	return model;
};
