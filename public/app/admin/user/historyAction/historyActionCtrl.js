angular.module('ml-app').controller('historyActionCtrl', historyActionCtrl);
historyActionCtrl.$inject = ['$scope', '$uibModal', '$http', '$sce', 'dialogs', 'toastr', 'utils', 'mlUserAction'];
function historyActionCtrl($scope, $uibModal, $http, $sce, dialogs, toastr, utils, mlUserAction) {
	let gridApi;

	let loadData = () => {
		let limit = 200;
		mlUserAction.historyByIdUser.query({id_user: $scope.row.id, clauseType: 'limit', limit: limit}).$promise.then(resp => {
			$scope.gridHistory.data = resp;
			utils.setGridHeight('gridHistory', resp.length, true, 230);
		}).finally(() => {
			if ($scope.gridHistory.data.length === limit) {
				mlUserAction.historyByIdUser.query({id_user: $scope.row.id, clauseType: 'offset', limit: limit}).$promise.then(resp => {
					$scope.gridHistory.data = _.concat($scope.gridHistory.data, resp);
				}).catch(() => toastr.error('An error occurred'));
			}
		}).catch(() => toastr.error('An error occurred'));
	};
	loadData();

	$scope.gridHistory = {
		enableFiltering: true,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		showGridFooter: true,
		multiSelect: false,
		columnDefs: [
			{field: 'action', displayName: 'Acţiune', minWidth: 150, enableHiding: false},
			{field: 'date', displayName: 'Data acţiunii', minWidth: 200, enableHiding: false, cellFilter: "date:\'dd.MM.yyyy - hh:mm\'", filterCellFiltered: true, cellClass: 'text-center'},
			{field: 'details', displayName: 'Detalii acţiune', minWidth: 1100, enableHiding: false}
		],
		onRegisterApi: grApi => gridApi = grApi
	};

	$(window).resize(() => {
		utils.setGridHeight('gridHistory', $scope.gridHistory.data.length, false, 230);
		gridApi.core.refresh();
	});

	$scope.removeReportActions = () => {
		dialogs.confirm('Confirmă ștergerea', 'Sigur doriți să ștergeți acțiunile de vizualizare a datelor ?', {size: 'sm'}).result.then(() => {
			$scope.disableBtn = true;
			mlUserAction.removeReportActions.remove({id_user: $scope.row.id}).$promise.then(() => {
				loadData();
				toastr.success('Acțiunile utilizatorului au fost șterse');
				$scope.disableBtn = false;
			}).catch(() => toastr.error('Eroare la ștergerea acțiunilor'));
		}).catch(() => null);
	};

	$scope.print = () => {
		let report = {
			template: 'history',
			format: 'landscape',
			data: {
				logs: gridApi.core.getVisibleRows(gridApi.grid).map(f => f.entity).slice(0, 500),
				unit: $scope.row
			},
			actionTitle: 'Istoric acțiuni utilizator: ' + $scope.row.first_name + ' ' + $scope.row.last_name
		};
		$scope.disablePrint = true;
		$http.post('/generate/pdf/static', report, {responseType: 'arraybuffer'}).then(resp => {
			$scope.disablePrint = false;
			$scope.url = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([resp.data], {type: 'application/pdf'})));
			$scope.pdfTitle = 'Istoric acțiuni utilizator: ' + $scope.row.first_name + ' ' + $scope.row.last_name;
			$uibModal.open({
				templateUrl: 'app/admin/showPdf/showPdf-modal',
				controller: 'showPdfCtrl',
				windowClass: 'full-screen',
				scope: $scope
			}).result.catch(() => null);
		}).catch(() => null);
	};
}