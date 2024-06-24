angular.module('ml-app').controller('draftGenderCtrl', draftGenderCtrl);
draftGenderCtrl.$inject = ['$scope', '$timeout', '$uibModal', 'dialogs', 'toastr', 'utils', 'mlDraftGender'];
function draftGenderCtrl($scope, $timeout, $uibModal, dialogs, toastr, utils, mlDraftGender) {

	let loadData = () => {
		mlDraftGender.simple.query().$promise.then(resp => {
			$scope.grid.data = resp;
			utils.setGridHeight('grid', resp.length);
		}).catch(() => toastr.error('An error occurred'));
	};
	loadData();

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
			templateUrl: 'app/admin/drafts/draftGender/draftGender-modal',
			controller: 'addDraftGenderCtrl',
			size: 'sm'
		}).result.then(() => loadData()).catch(() => null);
	};

	$scope.edit = row => {
		if (row.role === 'admin' && row.id !== window.bootstrappedUser.id) {
			toastr.warning('Not enough privileges');
		} else {
			$scope.modal = angular.copy(row);
			$uibModal.open({
				templateUrl: 'app/admin/drafts/draftGender/draftGender-modal',
				controller: 'editDraftGenderCtrl',
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
		dialogs.confirm('Confirms deletion', 'Want to delete draft gender?', {size: 'sm'}).result.then(() => {
			mlDraftGender.byId.remove({id: row.id}).$promise.then(() => {
				let ind = _.findIndex($scope.grid.data, f => f.id === row.id);
				if (ind > -1) {
					$scope.grid.data.splice(ind, 1);
					utils.setGridHeight('grid', $scope.grid.data.length);
				} else {
					loadData();
				}
				toastr.success('Draft gender has been deleted');
			}).catch(() => toastr.error('An error occurred'));
		}).catch(() => null);
	};
}