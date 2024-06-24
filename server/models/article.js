module.exports = (sequelize, DataType) => {
	let model = sequelize.define('Article', {
		order_code: {
			type: DataType.INTEGER
		},
		name: {
			type: DataType.STRING
		},
		category: {
			type: DataType.STRING
		},
		description: {
			type: DataType.TEXT
		},
		link: {
			type: DataType.TEXT
		},
		read_date: {
			type: DataType.DATE
		}
	}, {
		timestamps: true
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'cascade'});
	return model;
};