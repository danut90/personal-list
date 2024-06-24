module.exports = sequelize => {
	let model = sequelize.define('MovieActor', {}, {
		timestamps: true
	});
	model.belongsTo(sequelize.models.DraftActorRole, {foreignKey: 'id_draft_actor_role'});
	model.belongsTo(sequelize.models.Actor, {foreignKey: 'id_actor', onDelete: 'cascade'});
	model.belongsTo(sequelize.models.Movie, {foreignKey: 'id_movie', onDelete: 'cascade'});
	return model;
};