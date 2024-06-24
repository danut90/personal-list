(function () {
  'use strict';
  angular.module('ml-app').directive('elastic', ['$timeout', $timeout => {
    return {
      restrict: 'A',
      link: ($scope, element) => {
        $scope.initialHeight = $scope.initialHeight || element[0].style.height;
        let resize = () => {
          element[0].style.height = $scope.initialHeight;
          element[0].style.height = '' + (element[0].scrollHeight + 2) + 'px';
        };
        element.on('input change', resize);
        $timeout(resize, 0);
      }
    };
  }]);
})();