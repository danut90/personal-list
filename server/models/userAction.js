module.exports = (sequelize, DataTypes) => {
	let model = sequelize.define('UserAction', {
		action: {
			type: DataTypes.STRING
		},
		date: {
			type: DataTypes.DATE
		},
		details: {
			type: DataTypes.TEXT
		},
		is_report: {
			type: DataTypes.BOOLEAN
		}
	}, {
		timestamps: true,
		indexes: [
			{
				name: 'userAction_user_idx',
				method: 'BTREE',
				fields: ['id_user']
			}
		]
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'cascade'});
	return model;
};