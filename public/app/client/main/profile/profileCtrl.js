(function () {
	'use strict';
	profileCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlUser', 'user'];
	angular.module('ml-app').controller('profileCtrl', profileCtrl);
	function profileCtrl($scope, $uibModalInstance, toastr, mlUser, user) {
		$scope.modal = _.cloneDeep(user);
		let oldUser = _.cloneDeep(user);

		let validation = user => {
			if (!user.first_name) {
				toastr.error('Enter first name');
				return false;
			}
			if (!user.last_name) {
				toastr.error('Enter last name');
				return false;
			}
			return true;
		};

		$scope.save = () => {
			if (!_.isEqual($scope.modal, oldUser)) {
				if (validation($scope.modal)) {
					mlUser.simple.update($scope.modal).$promise.then(() => {
						toastr.success('Data saved');
						$scope.savePressed = true;
						$uibModalInstance.close($scope.modal);
					}).catch(() => {
						toastr.error('An error occurred');
						$uibModalInstance.dismiss();
					});
				}
			} else {
				toastr.info('No changes have been made');
				$uibModalInstance.dismiss();
			}
		};
	}
}());