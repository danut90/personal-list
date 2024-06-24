(function () {
	'use strict';
	dashCtrl.$inject = ['$location'];
	angular.module('ml-app').controller('dashCtrl', dashCtrl);
	function dashCtrl($location) {
		$location.path('/movie/');
	}
}());