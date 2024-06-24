(function () {
  'use strict';
  resetPasswordUserCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlUser'];
  angular.module('ml-app').controller('resetPasswordUserCtrl', resetPasswordUserCtrl);
  function resetPasswordUserCtrl($scope, $uibModalInstance, toastr, mlUser) {
    $scope.modal = {randomPassword: true, pass: null};

    $scope.deletePassword = status => {
      if (status) {
        $scope.modal.pass = null;
      }
    };

    let validation = ob => {
      if (!ob.randomPassword && !ob.pass) {
        toastr.error('Enter new password');
        return false;
      }
      return true;
    };

    $scope.save = () => {
      if (validation($scope.modal)) {
        mlUser.resetPassword.save({id: $scope.row.id, unitName: $scope.row.name, unitCui: $scope.row.cui, email: $scope.row.email, pass: $scope.modal.pass}).$promise.then(() => {
          toastr.success('Password for user ' + $scope.row.first_name + ' ' + $scope.row.last_name + ' was reseted');
          $uibModalInstance.close();
        }).catch(() => {
          toastr.error('An error occurred');
          $uibModalInstance.dismiss();
        });
      }
    };
  }
}());