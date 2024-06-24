angular.module('ml-app').controller('addDraftActorRoleCtrl', addDraftActorRoleCtrl);
addDraftActorRoleCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlDraftActorRole'];
function addDraftActorRoleCtrl($scope, $uibModalInstance, toastr, mlDraftActorRole) {

	$scope.modal = {};

	let validation = ob => {
		if (!ob.name) {
			toastr.error('Enter actor role');
			return false;
		}
		return true;
	};

	$scope.save = () => {
		if (validation($scope.modal)) {
			mlDraftActorRole.simple.save($scope.modal).$promise.then(() => {
				toastr.success('Draft actor role created');
				$uibModalInstance.close();
			}).catch(() => {
				toastr.error('An error occurred');
				$uibModalInstance.dismiss();
			});
		}
	};
}