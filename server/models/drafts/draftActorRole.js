module.exports = (sequelize, DataTypes) => {
	return sequelize.define('DraftActorRole', {
		name: {
			type: DataTypes.STRING
		}
	}, {
		timestamps: true
	});
};