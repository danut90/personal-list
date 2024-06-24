(function () {
  'use strict';
  resetPasswordCtrl.$inject = ['$scope', '$q', '$uibModalInstance'];
  angular.module('ml-app').controller('resetPasswordCtrl', resetPasswordCtrl);
  function resetPasswordCtrl($scope, $q, $uibModalInstance) {
    //$scope.modal = {};
    //
    //$scope.checkPassword = (pw) => {
    //	return $q((resolve) => {
    //		if (pw) {
    //			regUser.verifyPwd.check({oldPass: pw}).$promise.then(resp => {
    //				$scope.isPass = resp.isPass;
    //				if (!$scope.isPass) {
    //					toastr.error('Parola veche introdusă nu corespunde cu parola dumneavoastră');
    //					resolve({status: false});
    //				} else {
    //					resolve({status: true});
    //				}
    //			}).catch(() => {
    //				toastr.error('A apărut o eroare');
    //			});
    //		} else {
    //			resolve({status: false});
    //		}
    //	});
    //};
    //
    //$scope.save = () => {
    //	$scope.checkPassword($scope.modal.oldPass).then((result) => {
    //		if(result.status) {
    //			if ($scope.validation($scope.modal)) {
    //				regUser.resetPwdSelf.reset({pass: $scope.modal.newPass}).$promise.then(resp => {
    //					if (resp.success) {
    //						toastr.success('Parola a fost resetată');
    //					} else {
    //						toastr.error('Parola nu a fost resetată');
    //					}
    //					$uibModalInstance.dismiss();
    //				}).catch(() => {
    //					toastr.error('A apărut o eroare');
    //				});
    //			}
    //		} else if (!$scope.modal.oldPass) {
    //			toastr.error('Introduceţi parola veche');
    //		}
    //	});
    //};
    //
    //$scope.validation = (modal) => {
    //	if(!modal.newPass) {
    //		toastr.error('Introduceţi parola nouă');
    //		return false;
    //	}
    //	if(!modal.checkPass) {
    //		toastr.error('Reintroduceţi parola nouă');
    //		return false;
    //	}
    //	if (modal.oldPass === modal.newPass) {
    //		toastr.error('Parola veche este identică cu parola nouă');
    //		return false;
    //	}
    //	if (modal.newPass !== modal.checkPass) {
    //		toastr.error('Parola de verificare nu coincide cu parola pe care doriţi să o setaţi');
    //		return false;
    //	}
    //	if (!$scope.isPass) {
    //		return false;
    //	}
    //	return true;
    //};

    $scope.cancel = () => {
      $uibModalInstance.dismiss();
    };
  }
}());