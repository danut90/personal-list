angular.module('ml-app').factory('mlArticle', $resource => {
	return {
		simple: $resource('/api/article'),
		byId: $resource('/api/article/:id')
	};
});