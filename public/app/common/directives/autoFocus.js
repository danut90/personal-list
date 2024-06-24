(function () {
  'use strict';
  angular.module('ml-app').directive('autoFocus', function ($timeout) {
    return {
      restrict: 'AC',
      link: function (_scope, _element) {
        $timeout(function () {
          _element[0].focus();
        }, 100);
      }
    };
  });
}());