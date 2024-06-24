angular.module('ml-app').factory('mlFile', $resource => {
	'use strict';
	return {
		simple: $resource('/api/file', {}, {
			update: {method: 'PUT'}
		}),
		byCategory: $resource('/api/file/category/:id_category/:year'),
		years: $resource('/api/file/years/:id_category'),
		byId: $resource('/api/file/:id'),
		printById: $resource('/api/file/print/:id'),
		slim: $resource('/api/file/client/slim/:id_unit')
	};
});