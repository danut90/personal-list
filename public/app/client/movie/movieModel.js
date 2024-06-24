angular.module('ml-app').factory('movieModel', $resource => {
	return {
		simple: $resource('/api/movie'),
		forAddEdit: $resource('/api/movie/forAddEdit'),
		byId: $resource('/api/movie/byId/:id', {id: '@id'})
	};
});
