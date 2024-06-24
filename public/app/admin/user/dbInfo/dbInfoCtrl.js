(function () {
  'use strict';
  dbInfoCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlUser', 'selectedUser'];
  angular.module('ml-app').controller('dbInfoCtrl', dbInfoCtrl);
  function dbInfoCtrl($scope, $uibModalInstance, toastr, mlUser, selectedUser) {

    $scope.title = selectedUser.first_name + ' ' + selectedUser.last_name;

    mlUser.dbInfo.get({id: selectedUser.id}).$promise.then(resp => {
      $scope.response = resp;
    }).catch(() => {
      toastr.error('An error occurred');
      $uibModalInstance.dismiss();
    });
  }
}());