(function () {
	'use strict';
	resetPasswordCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlUser', 'user'];
	angular.module('ml-app').controller('resetPasswordCtrl', resetPasswordCtrl);
	function resetPasswordCtrl($scope, $uibModalInstance, toastr, mlUser, user) {

		$scope.modal = {};

		let validation = modal => {
			if (!modal.oldPass) {
				toastr.error('Enter old password');
				return false;
			}
			if (!modal.newPass) {
				toastr.error('Enter new password');
				return false;
			}
			if (!modal.checkPass) {
				toastr.error('Reenter new password');
				return false;
			}
			if (modal.oldPass === modal.newPass) {
				toastr.error('The old password is identical to the new password');
				return false;
			}
			if (modal.newPass !== modal.checkPass) {
				toastr.error('The verification password does not match the password you want to set');
				return false;
			}
			return true;
		};

		$scope.save = () => {
			if (validation($scope.modal)) {
				mlUser.verifyPassword.save({oldPass: $scope.modal.oldPass}).$promise.then(resp => {
					if (resp.isPass) {
						mlUser.resetPassword.save({id: user.id, pass: $scope.modal.newPass}).$promise.then(() => {
							toastr.success('Password has been reset');
							$uibModalInstance.dismiss();
						}).catch(() => {
							toastr.error('An error occurred');
							$uibModalInstance.dismiss();
						});
					} else {
						toastr.error('The old password is incorrect');
					}
				}).catch(() => {
					toastr.error('An error occurred');
					$uibModalInstance.dismiss();
				});
			}
		};
	}
}());