(function () {
	'use strict';
	angular.module('ml-app').directive('allowTab', function () {
		return function (scope, element) {
			element.bind('keydown', function (event) {
				if (event.which == 9) {
					event.preventDefault();
					let start = this.selectionStart;
					let end = this.selectionEnd;
					element.val(element.val().substring(0, start) + '\t' + element.val().substring(end));
					this.selectionStart = this.selectionEnd = start + 1;
					element.triggerHandler('change');
				}
			});
		};
	});
}());