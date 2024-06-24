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

  function config($routeProvider, $httpProvider, $locationProvider, $uibTooltipProvider, $translateProvider, uiSelectConfig) {
    $httpProvider.interceptors.push('RequestService');
    $locationProvider.hashPrefix('');
    uiSelectConfig.theme = 'select2';
    uiSelectConfig.appendToBody = true;
    $uibTooltipProvider.options({appendToBody: true, placement: 'left'});
    //$translateProvider.translations('ro', {
    //  DIALOGS_YES: "Da",
    //  DIALOGS_NO: "Nu"
    //});
    $routeProvider
      // admin
      .when('/', {
        templateUrl: 'app/admin/main/dash',
        controller: 'dashCtrl'
      })
      .when('/users', {
        templateUrl: 'app/admin/user/users',
        controller: 'usersCtrl'
      })
      .when('/userError', {
        templateUrl: 'app/admin/userError/userError',
        controller: 'userErrorCtrl'
      })
      .when('/userAction', {
        templateUrl: 'app/admin/userAction/userAction',
        controller: 'userActionCtrl'
      })
      // ---------------------------------------- App Drafts ----------------------------------------
      .when('/draftGender', {
        templateUrl: 'app/admin/drafts/draftGender/draftGender',
        controller: 'draftGenderCtrl'
      })
      .when('/draftActorRole', {
        templateUrl: 'app/admin/drafts/draftActorRole/draftActorRole',
        controller: 'draftActorRoleCtrl'
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
      var out = [];
      if (angular.isArray(items)) {
        items.forEach(function (item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
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
    .$inject = ['$routeProvider', '$httpProvider', '$locationProvider', '$uibTooltipProvider', '$translateProvider', 'uiSelectConfig'];

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
  'use strict';
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