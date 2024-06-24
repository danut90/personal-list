module.exports = (sequelize, DataTypes) => {
	let model = sequelize.define('UserError', {
		action: {
			type: DataTypes.STRING
		},
		details: {
			type: DataTypes.TEXT
		}
	}, {
		timestamps: true,
		indexes: [
			{
				name: 'userError_user_idx',
				method: 'BTREE',
				fields: ['id_user']
			}
		]
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user', onDelete: 'cascade'});
	return model;
};