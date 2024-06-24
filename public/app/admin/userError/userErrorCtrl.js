angular.module('ml-app').controller('userErrorCtrl', userErrorCtrl);
userErrorCtrl.$inject = ['$scope', '$timeout', '$uibModal', 'dialogs', 'toastr', 'utils', 'mlUserError'];
function userErrorCtrl($scope, $timeout, $uibModal, dialogs, toastr, utils, mlUserError) {

	mlUserError.simple.query().$promise.then(resp => {
		$scope.grid.data = resp;
		utils.setGridHeight('grid', resp.length);
	}).catch(() => toastr.error('An error occurred'));

	let destroy = '<div class="m-top-4 text-center"><a class="btn btn-xs btn-danger" ng-click="grid.appScope.destroy(row.entity)" uib-tooltip="Remove" tooltip-placement="left" tooltip-append-to-body="true"><i class="glyphicon glyphicon-trash"></i></a></div>';

	$scope.grid = {
		enableFiltering: true,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		showGridFooter: true,
		multiSelect: false,
		columnDefs: [
			{field: 'id_user', displayName: 'User ID', width: 100, enableHiding: false},
			{field: 'userName', displayName: 'User', minWidth: 100, maxWidth: 350, enableHiding: false},
			{field: 'action', displayName: 'Action', minWidth: 200, maxWidth: 850, enableHiding: false},
			{field: 'details', displayName: 'Error', minWidth: 650, maxWidth: 1650, enableHiding: false},
			{field: 'createdAt', displayName: 'Created', width: 150, cellClass: 'text-center', enableHiding: false, cellFilter: 'date: "dd.MM.yyyy - HH:mm"', filterCellFiltered: true},
			{field: 'sterge', displayName: '', width: 35, enableFiltering: false, cellTemplate: destroy, enableHiding: false}
		],
		onRegisterApi: gridApi => {
			$scope.gridApi = gridApi;
			$timeout(() => {
				$(window).trigger('resize');
			});
		},
		rowTemplate: "<div ng-dblclick='grid.appScope.showError(row.entity)' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
	};

	$scope.showError = row => {
		$scope.modal = row;
		$uibModal.open({
			templateUrl: 'app/admin/userError/errorInfo-modal',
			size: 'md',
			scope: $scope
		}).result.catch(() => null);
	};

	$scope.deleteAll = () => {
		dialogs.confirm('Confirmă ştergerea', '<b>Doriţi să ştergeţi log error-ul ?</b>', {size: 'sm'}).result.then(() => {
			mlUserError.simple.remove().$promise.then(resp => {
				if (resp.success) {
					toastr.success('Log-urile au fost şterse');
					location.reload();
				} else {
					toastr.error('Log-urile nu au fost şterse');
				}
			}).catch(() => toastr.error('An error occurred'));
		}).catch(() => null);
	};

	$scope.destroy = row => {
		dialogs.confirm('Confirmă ştergerea', '<b>Doriţi să ştergeţi log error-ul ?</b>', {size: 'sm'}).result.then(() => {
			mlUserError.byId.remove({id: row.id}).$promise.then(resp => {
				if (resp.success) {
					location.reload();
				} else {
					toastr.error('Log-ul nu a fost şters');
				}
			}).catch(() => {
				toastr.error('An error occurred');
			});
		}, () => null);
	};
}