module.exports = (sequelize, DataType) => {
	let model = sequelize.define('Actor', {
		order_code: {
			type: DataType.INTEGER
		},
		name: {
			type: DataType.STRING
		},
		birth_date: {
			type: DataType.DATEONLY
		},
		birth_place: {
			type: DataType.STRING
		},
		occupation: {
			type: DataType.TEXT
		},
		religion: {
			type: DataType.STRING
		},
		country: {
			type: DataType.STRING
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
	model.belongsTo(sequelize.models.Actor, {foreignKey: 'id_actor_from', onDelete: 'cascade'});
	return model;
};
