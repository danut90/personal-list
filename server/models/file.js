module.exports = (sequelize, DataTypes)=> {
	let model = sequelize.define('File', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		extension: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.BLOB
		}
	}, {
		timestamps: true,
		indexes: [
			{
				name: 'File_id_user_idx',
				method: 'BTREE',
				fields: ['id_user']
			},
			{
				name: 'File_id_article_idx',
				method: 'BTREE',
				fields: ['id_article']
			}
		]
	});
	model.belongsTo(sequelize.models.User, {foreignKey: 'id_user'});
	model.belongsTo(sequelize.models.Article, {foreignKey: 'id_article', onDelete: 'cascade'});
	return model;
};