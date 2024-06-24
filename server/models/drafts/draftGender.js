module.exports = (sequelize, DataTypes) => {
	return sequelize.define('DraftGender', {
		name: {
			type: DataTypes.STRING
		}
	}, {
		timestamps: true
	});
};