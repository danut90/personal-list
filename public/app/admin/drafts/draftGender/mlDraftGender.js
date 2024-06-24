angular.module('ml-app').factory('mlDraftGender', $resource => {
	return {
		simple: $resource('/api/draftGender'),
		byId: $resource('/api/draftGender/:id')
	};
});