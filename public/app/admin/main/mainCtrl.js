angular.module('ml-app').controller('mainCtrl', mainCtrl);
mainCtrl.$inject = ['$scope', '$loading', '$localStorage', '$uibModal', 'toastr', 'utils', 'mlUserError'];
function mainCtrl($scope, $loading, $localStorage, $uibModal, toastr, utils, mlUserError) {

	$localStorage.token = window.bootstrappedUser.token;
	$scope.userName = window.bootstrappedUser.userName;

	mlUserError.count.get().$promise.then(resp => {
		$scope.logs = resp.count;
	}).catch(() => toastr.error('An error occurred'));

	$scope.startLoader = () => $loading.start('loading-container');
	$scope.stopLoader = () => $loading.finish('loading-container');

	$scope.editProfile = () => {
		$uibModal.open({
			templateUrl: 'app/admin/views/modals/profile-modal',
			controller: 'profileCtrl',
			backdrop: 'static',
			size: 'md',
			scope: $scope
		}).result.then(resp => {
				$scope.userName = resp.userName;
			});
	};

	$scope.resetPw = () => {
		$uibModal.open({
			templateUrl: 'app/admin/views/modals/resetPassword-modal',
			controller: 'resetPasswordCtrl',
			backdrop: 'static',
			size: 'md'
		});
	};

	$scope.logOut = () => {
		utils.resetLS();
	};
}