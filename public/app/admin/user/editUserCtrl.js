(function () {
  'use strict';
  editUserCtrl.$inject = ['$scope', '$q', '$uibModalInstance', 'toastr', 'mlUser'];
  angular.module('ml-app').controller('editUserCtrl', editUserCtrl);
  function editUserCtrl($scope, $q, $uibModalInstance, toastr, mlUser) {
    let oldModal = angular.copy($scope.modal);

    $scope.verifyEmail = () => {
      return $q(resolve => {
        if (oldModal.email !== $scope.modal.email) {
          mlUser.verifyEmail.verify({email: $scope.modal.email}).$promise.then(resp => {
            if (resp.isEmail) {
              toastr.error('Entered email is not available');
              resolve({done: false});
            } else {
              resolve({done: true});
            }
          }).catch(() => {
            toastr.error('An error occurred');
          });
        } else {
          resolve({done: true});
        }
      });
    };

    let validation = ob => {
      if (!ob.first_name) {
        toastr.error('Enter first name');
        return false;
      }
      if (!ob.last_name) {
        toastr.error('Enter last name');
        return false;
      }
      if (!ob.email) {
        toastr.error('Enter email');
        return false;
      }
      let EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      if (EMAIL_REGEXP.test(ob.email) === false) {
        toastr.error('Email is incorrect');
        return false;
      }
      return true;
    };

    $scope.save = () => {
      if (!angular.equals(oldModal, $scope.modal)) {
        $scope.verifyEmail().then(a => {
          if (validation($scope.modal) && a.done) {
            mlUser.simple.update($scope.modal).$promise.then(() => {
              toastr.success('Data has been saved');
              $uibModalInstance.close($scope.modal);
            }).catch(() => {
              toastr.error('An error occurred');
              $uibModalInstance.dismiss();
            });
          }
        });
      } else {
        toastr.info('No changes has been made');
        $uibModalInstance.dismiss();
      }
    };
  }
}());