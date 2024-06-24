(function () {
  'use strict';
  userActionCtrl.$inject = ['$scope', '$filter', 'toastr', 'utils', 'mlUserAction'];
  angular.module('ml-app').controller('userActionCtrl', userActionCtrl);
  function userActionCtrl($scope, $filter, toastr, utils, mlUserAction) {

    $scope.ob = {date: new Date()};
    $scope.limit = {max: 40};
    $scope.changeMaxLimit = utils.changeMaxLimit;
    utils.setViewHeight();
    $scope.search = {};
    let oldUserAction;
    $(window).resize(() => utils.setViewHeight());

    $scope.loadData = ob => {
      if (ob.date) {
        mlUserAction.byDate.query({date: $filter('date')(ob.date, 'yyyy-MM-dd')}).$promise.then(resp => {
          $scope.userAction = resp;
          oldUserAction = angular.copy(resp);
        }).catch(() => toastr.error('Eroare la preluarea datelor de pe server'));
      }
    };

    $scope.loadData($scope.ob);

    let filterDiacritics = item => {
      if ($scope.search.user && utils.replaceDiacritics(item.user).indexOf(utils.replaceDiacritics($scope.search.user)) === -1) {
        return false;
      }
      if ($scope.search.email && item.email.toLowerCase().indexOf($scope.search.email.toLowerCase()) === -1) {
        return false;
      }
      if ($scope.search.action && item.action.toLowerCase().indexOf($scope.search.action.toLowerCase()) === -1) {
        return false;
      }
      if ($scope.search.date && $filter('date')(item.date, 'HH:mm').indexOf($scope.search.date) === -1) {
        return false;
      }
      if ($scope.search.details && !item.details) {
        return false;
      } else if ($scope.search.details && item.details.toLowerCase().indexOf($scope.search.details.toLowerCase()) === -1) {
        return false;
      }
      return true;
    };

    $scope.changeFilter = (col, reset) => {
      if (col && (!(!!$scope.search[col]) || reset)) {
        delete $scope.search[col];
      }
      $scope.userAction = _.filter(oldUserAction, f => filterDiacritics(f));
    };
  }
}());