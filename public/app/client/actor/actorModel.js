angular.module('ml-app').factory('actorModel', $resource => {
	return {
		simple: $resource('/api/actor'),
		byId: $resource('/api/actor/byId/:id')
	};
});
