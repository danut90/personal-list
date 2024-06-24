angular.module('ml-app').controller('articleCtrl', articleCtrl);
articleCtrl.$inject = ['$loading', '$uibModal', '$http', 'dialogs', 'toastr', 'utils', 'mlArticle'];
function articleCtrl($loading, $uibModal, $http, dialogs, toastr, utils, mlArticle) {

	let vm = this;

	let load = () => {
		$loading.start('loading-container');
		mlArticle.simple.query().$promise.then(resp => {
			vm.grid.data = resp;
			utils.setGridHeight('grid', resp.length, true);
			$loading.finish('loading-container');
		}).catch(() => toastr.error('An error occurred'));
	};
	load();

	let gridApi;
	let accessLink = '<div ng-if="row.entity.link" class="m-top-4 text-center" ng-click="grid.appScope.vm.openLink(row.entity.link)"><a class="btn btn-xs glyphicon glyphicon-link text-info" uib-tooltip="Open link"></a></div>';
	let print = '<div ng-if="row.entity.id_file" class="m-top-4 text-center" ng-click="grid.appScope.vm.pdf(row.entity)"><a class="btn btn-xs glyphicon glyphicon-print text-success" uib-tooltip="Open file"></a></div>';
	let edit = '<div class="m-top-4 text-center" ng-click="grid.appScope.vm.edit(row.entity.id)"><a class="btn btn-xs glyphicon glyphicon-edit text-primary" uib-tooltip="Edit"></a></div>';
	let destroy = '<div class="m-top-4 text-center" ng-click="grid.appScope.vm.destroy(row.entity)"><a class="btn btn-xs glyphicon glyphicon-trash text-danger" uib-tooltip="Delete"></a></div>';

	vm.grid = {
		enableFiltering: true,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		showGridFooter: true,
		multiSelect: false,
		columnDefs: [
			{field: 'name', displayName: 'Name', minWidth: 550, maxWidth: 350, enableHiding: false},
			{field: 'read_date', displayName: 'Read Date', width: 120, enableHiding: false, cellClass: 'text-center', cellFilter: 'date: "dd.MM.yyyy"', filterCellFiltered: true},
			{field: 'category', displayName: 'Category', width: 170, enableHiding: false},
			{field: 'link', displayName: 'Link', minWidth: 250, enableHiding: false},
			{field: 'accessLink', displayName: '', width: 25, enableFiltering: false, cellTemplate: accessLink},
			{field: 'print', displayName: '', width: 25, enableFiltering: false, cellTemplate: print},
			{field: 'edit', displayName: '', width: 30, enableFiltering: false, cellTemplate: edit, enableHiding: false},
			{field: 'destroy', displayName: '', width: 30, enableFiltering: false, cellTemplate: destroy, enableHiding: false}
		],
		onRegisterApi: grApi => gridApi = grApi,
		rowTemplate: '<div ng-dblclick="grid.appScope.vm.edit(row.entity.id)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class=\'{ "ui-grid-row-header-cell": col.isRowHeader }\' ui-grid-cell></div>'
	};

	$(window).resize(() => {
		utils.setGridHeight('grid', vm.grid.data.length);
		gridApi.core.refresh();
	});

	vm.add = () => {
		$uibModal.open({
			templateUrl: 'app/client/article/articleModal',
			controller: 'addArticleCtrl',
			controllerAs: 'mm',
			size: 'md',
			keyboard: false,
			backdrop: 'static'
		}).result.then(() => load()).catch(() => null);
	};

	vm.edit = id => {
		$uibModal.open({
			templateUrl: 'app/client/article/articleModal',
			controller: 'editArticleCtrl',
			controllerAs: 'mm',
			size: 'md',
			keyboard: false,
			backdrop: 'static',
			resolve: {idOb: () => id}
		}).result.then(resp => {
				let index = _.findIndex(vm.grid.data, f => f.id === resp.id);
				if (index > -1) {
					vm.grid.data[index] = resp;
				}
			}).catch(() => null);
	};

	vm.openLink = utils.openLink;

	vm.pdf = ob => {
		if (ob.id) {
			$loading.start('loading-container');
			$http.get('/api/file/print/' + ob.id_file, {responseType: 'arraybuffer'}).then(resp => {
				let options = {
					fileName: ob.file_name,
					fileExtension: ob.file_extension,
					file: new Blob([resp.data], {type: 'application/pdf'})
				};
				utils.openPdfModal(options);
			}).catch(() => toastr.error('Generare pdf error'));
		}
	};

	vm.destroy = row => {
		dialogs.confirm('Confirms deletion', 'Want to delete the article <b>' + row.name + '</b> ?', {size: 'sm'}).result.then(() => {
			mlArticle.byId.remove({id: row.id}).$promise.then(() => {
				let index = _.findIndex(vm.grid.data, f => f.id === row.id);
				if (index > -1) {
					vm.grid.data.splice(index, 1);
					utils.setGridHeight('grid', vm.grid.data.length, true);
				}
			}).catch(() => toastr.error('An error occurred'));
		}).catch(() => null);
	};
}