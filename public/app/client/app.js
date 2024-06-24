(function () {
	'use strict';

	angular.module('ml-app', [
		'ngResource',
		'ngRoute',
		'ngStorage',
		'ui.grid',
		'ui.grid.selection',
		'ui.grid.resizeColumns',
		'ui.bootstrap',
		'dialogs.main',
		'toastr',
		'ui.select',
		'ngSanitize',
		'darthwade.dwLoading'
	]);

	function RequestService($q, $location, $localStorage, $loading) {
		return {
			request: function (config) {
				config.headers = config.headers || {};
				if ($localStorage.token) {
					config.headers['x-access-token'] = $localStorage.token;
				}
				return config;
			},

			responseError: function (response) {
				if (response.status === 401 || response.status === 403) {
					$location.path('/');
				}
				$loading.finish('loading-container');
				return $q.reject(response);
			}
		};
	}

	function config($routeProvider, $httpProvider, $locationProvider, $uibTooltipProvider) {
		$httpProvider.interceptors.push('RequestService');
		$locationProvider.hashPrefix('');
		$uibTooltipProvider.options({appendToBody: true, placement: 'left'});

		$routeProvider
			.when('/', {
				templateUrl: 'app/client/views/dash',
				controller: 'dashCtrl'
			})
			.when('/movie', {
				templateUrl: 'app/client/movie/movie',
				controller: 'movieCtrl',
				controllerAs: 'vm'
			})
			.when('/actor', {
				templateUrl: 'app/client/actor/actor',
				controller: 'actorCtrl',
				controllerAs: 'vm'
			})
			.when('/article', {
				templateUrl: 'app/client/article/article',
				controller: 'articleCtrl',
				controllerAs: 'vm'
			})
			.otherwise({redirectTo: '/'});
	}

	function run($rootScope, $location, $route, $uibModalStack) {
		$rootScope.$on('$routeChangeError', function (evt, currentUser, previous, rejection) {
			if (rejection === 'not authorized') {
				$location.path('/');
			}
			$route.reload();
		});
		$rootScope.$on('$locationChangeStart', () => {
			$uibModalStack.dismissAll();
			$(window).unbind('resize');
		});
	}

	angular.module('ml-app').filter('propsFilter', function () {
		return function (items, props) {
			let out = [];
			if (angular.isArray(items)) {
				items.forEach(item => {
					let itemMatches = false;
					let keys = Object.keys(props);
					for (let i = 0; i < keys.length; i++) {
						let prop = keys[i];
						let text = props[prop].toLowerCase();
						if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
							itemMatches = true;
							break;
						}
					}
					if (itemMatches) {
						out.push(item);
					}
				});
			} else {
				// Let the output be the input untouched
				out = items;
			}
			return out;
		};
	});

	config
		.$inject = ['$routeProvider', '$httpProvider', '$locationProvider', '$uibTooltipProvider'];

	run
		.$inject = ['$rootScope', '$location', '$route', '$uibModalStack'];

	RequestService
		.$inject = ['$q', '$location', '$localStorage', '$loading'];

	angular
		.module('ml-app')
		.factory('RequestService', RequestService)
		.config(config)
		.run(run);
}());

angular.module('ml-app').config(function (toastrConfig) {
	angular.extend(toastrConfig, {
		autoDismiss: false,
		containerId: 'toast-container',
		maxOpened: 0,
		newestOnTop: true,
		positionClass: 'toast-top-right',
		preventDuplicates: false,
		preventOpenDuplicates: true,
		target: 'body'
	});
});