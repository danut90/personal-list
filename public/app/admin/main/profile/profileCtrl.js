(function () {
  'use strict';
  profileCtrl.$inject = ['$scope', '$q', '$uibModalInstance'];
  angular.module('ml-app').controller('profileCtrl', profileCtrl);
  function profileCtrl($scope, $q, $uibModalInstance) {
    //let isEmail = false, oldModal;
    //regUser.profileById.get({id: window.bootstrappedUser.id}).$promise.then((resp) => {
    //	$scope.modal = resp;
    //	oldModal = angular.copy(resp);
    //}).catch(() => {
    //	toastr.error('A apărut o eroare');
    //});
    //
    //$scope.verifyCuiEmail = () => {
    //	return $q((resolve) => {
    //		let toVerify = {email: ($scope.modal.email === oldModal.email ? null : $scope.modal.email)};
    //		if (toVerify.email) {
    //			regUser.verifyCuiEmail.verify(toVerify).$promise.then((resp) => {
    //				isEmail = resp.isEmail;
    //				if (isEmail) {
    //					toastr.error('Email-ul introdus este utilizat');
    //					$scope.modal.email = null;
    //					resolve({done: false});
    //				} else {
    //					resolve({done: true});
    //				}
    //			}).catch(() => {
    //				toastr.error('A apărut o eroare');
    //			});
    //		} else {
    //			isEmail = false;
    //			resolve({done: true});
    //		}
    //	});
    //};
    //
    //let validation = (ob, isEmail) => {
    //	if (!ob.first_name) {
    //		toastr.error('Introduceţi numele');
    //		return false;
    //	}
    //	if (!ob.last_name) {
    //		toastr.error('Introduceţi penumele');
    //		return false;
    //	}
    //	if (!ob.email) {
    //		toastr.error('Introduceţi emailul');
    //		return false;
    //	}
    //	if (isEmail) {
    //		toastr.error('Email-ul introdus este utilizat');
    //		return false;
    //	}
    //	return true;
    //};
    //
    //$scope.save = () => {
    //	if (!angular.equals($scope.modal, oldModal)) {
    //		$scope.verifyCuiEmail().then((a) => {
    //			if (validation($scope.modal, isEmail) && a.done) {
    //				regUser.profile.update($scope.modal).$promise.then((resp) => {
    //					if (resp.success) {
    //						toastr.success('Datele au fost salvate');
    //						$uibModalInstance.close({userName: $scope.modal.first_name + ' ' + $scope.modal.last_name});
    //					} else {
    //						toastr.error('Datele nu au fost salvate');
    //						$uibModalInstance.dismiss();
    //					}
    //				}).catch(() => {
    //					toastr.error('A apărut o eroare');
    //				});
    //			}
    //		});
    //	} else {
    //		toastr.info('Nu există modificări');
    //		$uibModalInstance.dismiss();
    //	}
    //};

    $scope.cancel = () => {
      $uibModalInstance.dismiss();
    };
  }
}());