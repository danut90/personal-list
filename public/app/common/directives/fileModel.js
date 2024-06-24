angular.module('ml-app').directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

angular.module('ml-app').directive("ngFileModel", [function () {
	return {
		scope: {
			ngFileModel: "="
		},
		link: function (scope, element) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.ngFileModel = {
							lastModified: changeEvent.target.files[0].lastModified,
							lastModifiedDate: changeEvent.target.files[0].lastModifiedDate,
							name: changeEvent.target.files[0].name,
							size: changeEvent.target.files[0].size,
							type: changeEvent.target.files[0].type,
							data: loadEvent.target.result
						};
					});
				};
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	};
}]);
