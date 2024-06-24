(function () {
	'use strict';
	angular.module('ml-app').factory('mlUser', $resource => {
		return {
			simple: $resource('/api/user', {}, {
				'update': {method: 'PUT'}
			}),
			byId: $resource('/api/user/:id', {id: '@id'}),
			activeInactive: $resource('/api/user/client/set/activeInactive'),
			verifyEmail: $resource('/api/user/verifyEmail'),
			verifyPassword: $resource('/api/user/verifyPassword'),
			resetPassword: $resource('/api/user/resetPassword'),
			sendContactMail: $resource('/api/user/mailContact/send'),
			bootstrappedUser: $resource('/api/user/bootstrapped/user')
		};
	});
})();