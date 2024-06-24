angular.module('ml-app').controller('mainCtrl', mainCtrl);
mainCtrl.$inject = ['$scope', '$loading', '$localStorage', '$location', '$uibModal', 'toastr', 'mlUser'];
function mainCtrl($scope, $loading, $localStorage, $location, $uibModal, toastr, mlUser) {

	$localStorage.token = window.bootstrappedUser.token;
	$scope.isClient = window.bootstrappedUser.role === 'client';

	mlUser.bootstrappedUser.get().$promise.then(resp => {
		$scope.user = resp;
		// join to room with name bootstrappedUser.id
		//socket.emit('join', resp);
		//socket.on('reconnect', () => socket.emit('join', resp));
	}).catch(() => toastr.error('Eroare la preluarea utilizatorului'));

	if (!(!!$location.path())) {
		$location.path('/movie/');
	}

	$scope.startLoader = () => $loading.start('loading-container');
	$scope.stopLoader = () => $loading.finish('loading-container');

	$scope.editProfile = () => {
		$uibModal.open({
			templateUrl: 'app/client/main/profile/profile-modal',
			controller: 'profileCtrl',
			resolve: {user: () => $scope.user}
		}).result.then(resp => {
			$scope.user.first_name = resp.first_name;
			$scope.user.last_name = resp.last_name;
		}).catch(() => null);
	};

	$scope.resetPassword = () => {
		$uibModal.open({
			templateUrl: 'app/client/main/resetPassword/resetPassword-modal',
			controller: 'resetPasswordCtrl',
			resolve: {user: () => $scope.user}
		}).result.catch(() => null);
	};

	$scope.logOut = () => {
		$localStorage.$reset();
		let a = document.createElement('a');
		document.body.appendChild(a);
		a.href = '/auth/logout';
		a.click();
	};

}