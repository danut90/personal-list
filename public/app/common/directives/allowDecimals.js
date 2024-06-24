(function () {
	'use strict';
	angular.module('ml-app').directive('allowDecimals', () => {
		return {
			require: 'ngModel',
			link: (scope, element, attrs, modelCtrl) => {
				modelCtrl.$parsers.push(inputValue => {
					if (inputValue.toString().length > 0) {
						let transformedInput, re, decimals = parseInt(attrs.allowDecimals);
						if (decimals && !isNaN(decimals) && decimals < 7) {
							re = new RegExp('^[-]?((\\d+)\\.?(\\d{1,' + attrs.allowDecimals + '})?)', 'g');
						} else {
							re = new RegExp(/((\d+)\.?(\d{1,2})?)/g);
						}
						transformedInput = inputValue.toString().match(re);
						if (transformedInput === null) {
							transformedInput = [''];
						}
						if (transformedInput && transformedInput[0] !== inputValue) {
							modelCtrl.$setViewValue(transformedInput[0]);
							modelCtrl.$render();
						}
						if (transformedInput) {
							return transformedInput[0];
						}
						return '';
					} else {
						return null;
					}
				});
			}
		};
	});
})();
