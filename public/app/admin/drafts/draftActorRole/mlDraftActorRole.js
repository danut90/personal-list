angular.module('ml-app').factory('mlDraftActorRole', $resource => {
	return {
		simple: $resource('/api/draftActorRole'),
		byId: $resource('/api/draftActorRole/:id')
	};
});