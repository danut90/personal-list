(function () {
	'use strict';
	angular.module('ml-app').directive('autoGrow', [() => {
		return {
			link: (scope, element, attr) => {
				let update = () => {
					let scrollLeft, scrollTop;
					scrollTop = window.pageYOffset;
					scrollLeft = window.pageXOffset;
					element.css('height', 'auto');
					let height = element[0].scrollHeight;
					if (height > 0) {
						element.css('height', (height + 2) + 'px');
					}
					window.scrollTo(scrollLeft, scrollTop);
				};
				scope.$watch(attr.ngModel, () => {
					update();
				});
				attr.$set('ngTrim', 'false');
			}
		};
	}]);
}());