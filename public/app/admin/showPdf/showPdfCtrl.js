(function () {
  'use strict';
  showPdfCtrl.$inject = ['$scope'];
  angular.module('ml-app').controller('showPdfCtrl', showPdfCtrl);

  function showPdfCtrl($scope) {
    let isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    let chromeVersion = isChrome ? parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) : null;
    $scope.showIfrm = chromeVersion && chromeVersion <= 50 ? true : false;
  }
}());