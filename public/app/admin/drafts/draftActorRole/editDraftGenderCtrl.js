angular.module('ml-app').controller('editDraftActorRoleCtrl', editDraftActorRoleCtrl);
editDraftActorRoleCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlDraftActorRole'];
function editDraftActorRoleCtrl($scope, $uibModalInstance, toastr, mlDraftActorRole) {

	let oldModal = angular.copy($scope.modal);

	let validation = ob => {
		if (!ob.name) {
			toastr.error('Enter actor role');
			return false;
		}
		return true;
	};

	$scope.save = () => {
		if (!angular.equals(oldModal, $scope.modal)) {
			if (validation($scope.modal)) {
				mlDraftActorRole.simple.save($scope.modal).$promise.then(() => {
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