angular.module('ml-app').controller('editDraftGenderCtrl', editDraftGenderCtrl);
editDraftGenderCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlDraftGender'];
function editDraftGenderCtrl($scope, $uibModalInstance, toastr, mlDraftGender) {

	let oldModal = angular.copy($scope.modal);

	let validation = ob => {
		if (!ob.name) {
			toastr.error('Enter gender name');
			return false;
		}
		return true;
	};

	$scope.save = () => {
		if (!angular.equals(oldModal, $scope.modal)) {
			if (validation($scope.modal)) {
				mlDraftGender.simple.save($scope.modal).$promise.then(() => {
					toastr.success('Data has been saved');
					$uibModalInstance.close($scope.modal);
				}).catch(() => {
					toastr.error('An error occurred');
					$uibModalInstance.dismiss();
				});
			}
		} else {
			toastr.info('No changes has been made');
			$uibModalInstance.dismiss();
		}
	};
}