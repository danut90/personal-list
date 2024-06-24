angular.module('ml-app').controller('addDraftGenderCtrl', addDraftGenderCtrl);
addDraftGenderCtrl.$inject = ['$scope', '$uibModalInstance', 'toastr', 'mlDraftGender'];
function addDraftGenderCtrl($scope, $uibModalInstance, toastr, mlDraftGender) {

	$scope.modal = {};

	let validation = ob => {
		if (!ob.name) {
			toastr.error('Enter gender name');
			return false;
		}
		return true;
	};

	$scope.save = () => {
		if (validation($scope.modal)) {
			mlDraftGender.simple.save($scope.modal).$promise.then(() => {
				toastr.success('Draft gender created');
				$uibModalInstance.close();
			}).catch(() => {
				toastr.error('An error occurred');
				$uibModalInstance.dismiss();
			});
		}
	};
}