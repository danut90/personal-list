angular.module('ml-app').controller('draftActorRoleCtrl', draftActorRoleCtrl);
draftActorRoleCtrl.$inject = ['$scope', '$timeout', '$uibModal', 'dialogs', 'toastr', 'utils', 'mlDraftActorRole'];
function draftActorRoleCtrl($scope, $timeout, $uibModal, dialogs, toastr, utils, mlDraftActorRole) {

	let load = () => {
		mlDraftActorRole.simple.query().$promise.then(resp => {
			$scope.grid.data = resp;
			utils.setGridHeight('grid', resp.length);
		}).catch(() => toastr.error('An error occurred'));
	};
	load();

	let edit = '<div class="m-top-4 text-center"><a class="btn btn-xs text-primary" ng-click="grid.appScope.edit(row.entity)" uib-tooltip="Edit"><i class="glyphicon glyphicon-edit"></i></a></div>',
		destroy = '<div class="m-top-4 text-center" ><a class="btn btn-xs text-danger" ng-click="grid.appScope.destroy(row.entity)" uib-tooltip="Delete"><i class="glyphicon glyphicon-trash"></i></a></div>';
	$scope.grid = {
		enableFiltering: true,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		multiSelect: false,
		enableGridMenu: true,
		showGridFooter: true,
		columnDefs: [
			{field: 'id', displayName: 'ID', minWidth: 130, enableHiding: false},
			{field: 'name', displayName: 'Name', minWidth: 130, enableHiding: false},
			{field: 'edit', displayName: '', width: 30, enableFiltering: false, cellTemplate: edit, enableHiding: false},
			{field: 'destroy', displayName: '', width: 30, enableFiltering: false, cellTemplate: destroy, enableHiding: false}
		],
		onRegisterApi: gridApi => {
			$scope.gridApi = gridApi;
			$timeout(() => $(window).trigger('resize'));
		},
		rowTemplate: "<div ng-dblclick='grid.appScope.edit(row.entity)' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
	};

	$scope.add = () => {
		$uibModal.open({
			templateUrl: 'app/admin/drafts/draftActorRole/draftActorRoleModal',
			controller: 'addDraftActorRoleCtrl',
			size: 'sm'
		}).result.then(() => load()).catch(() => null);
	};

	$scope.edit = row => {
		if (row.role === 'admin' && row.id !== window.bootstrappedUser.id) {
			toastr.warning('Not enough privileges');
		} else {
			$scope.modal = angular.copy(row);
			$uibModal.open({
				templateUrl: 'app/admin/drafts/draftActorRole/draftActorRoleModal',
				controller: 'editDraftActorRoleCtrl',
				size: 'sm',
				scope: $scope
			}).result.then(resp => {
					let index = _.findIndex($scope.grid.data, f => f.id === resp.id);
					if (index > -1) {
						$scope.grid.data[index] = resp;
					}
				}).catch(() => null);
		}
	};

	$scope.destroy = row => {
		dialogs.confirm('Confirms deletion', 'Want to delete draft actro role?', {size: 'sm'}).result.then(() => {
			mlDraftActorRole.byId.remove({id: row.id}).$promise.then(() => {
				let ind = _.findIndex($scope.grid.data, f => f.id === row.id);
				if (ind > -1) {
					$scope.grid.data.splice(ind, 1);
					utils.setGridHeight('grid', $scope.grid.data.length);
				} else {
					load();
				}
				toastr.success('Draft actor role has been deleted');
			}).catch(() => toastr.error('An error occurred'));
		}).catch(() => null);
	};
}