angular.module('ml-app').factory('mlUserError', $resource => {
	return {
		simple: $resource('/api/userError'),
		byId: $resource('/api/userError/:id'),
		count: $resource('/api/userError/count/all')
	};
});