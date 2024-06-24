(function () {
	'use strict';
	angular.module('ml-app').directive('localDate', [function () {
		return {
			restrict: 'A',
			priority: 1,
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				ctrl.$formatters.push(function (value) {
					let date = new Date(Date.parse(value));
					date = new Date(date.getTime() - date.getTimezoneOffset());
					return date;
				});

				ctrl.$parsers.push(function (value) {
					if (value) {
						return new Date(value.getTime() - (60000 * value.getTimezoneOffset()));
					} else {
						return null;
					}
				});
			}
		};
	}]);
}());