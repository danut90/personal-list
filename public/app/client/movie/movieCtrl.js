angular.module('ml-app').controller('movieCtrl', movieCtrl);
movieCtrl.$inject = ['$loading', '$uibModal', '$filter', 'dialogs', 'toastr', 'utils', 'excelFunction', 'movieModel'];
function movieCtrl($loading, $uibModal, $filter, dialogs, toastr, utils, excelFunction, movieModel) {

	let vm = this;

	const load = () => {
		$loading.start('loading-container');
		movieModel.simple.query().$promise.then(r => {
			vm.grid.data = r;
			utils.setGridHeight('grid', r.length, true);
			$loading.finish('loading-container');
		}).catch(() => toastr.error('An error occurred'));
	};

	load();

	let gridApi;
	let linkImdb = '<div ng-if="row.entity.link_imdb" class="m-top-4 text-center" ng-click="grid.appScope.vm.openLink(row.entity.link_imdb)"><a class="btn btn-xs glyphicon glyphicon-link text-info" uib-tooltip="Open link"></a></div>';
	let linkCinemagia = '<div ng-if="row.entity.link_cinemagia" class="m-top-4 text-center" ng-click="grid.appScope.vm.openLink(row.entity.link_cinemagia)"><a class="btn btn-xs glyphicon glyphicon-link text-info" uib-tooltip="Open link"></a></div>';
	let linkCinemarx = '<div ng-if="row.entity.link_cinemarx" class="m-top-4 text-center" ng-click="grid.appScope.vm.openLink(row.entity.link_cinemarx)"><a class="btn btn-xs glyphicon glyphicon-link text-info" uib-tooltip="Open link"></a></div>';
	let edit = '<div class="m-top-4 text-center" ng-click="grid.appScope.vm.edit(row.entity.id)"><a class="btn btn-xs glyphicon glyphicon-edit text-primary" uib-tooltip="Edit"></a></div>';
	let destroy = '<div class="m-top-4 text-center" ng-click="grid.appScope.vm.destroy(row.entity)"><a class="btn btn-xs glyphicon glyphicon-trash text-danger" uib-tooltip="Delete"></a></div>';

	vm.grid = {
		enableFiltering: true,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		showGridFooter: true,
		enableGridMenu: true,
		multiSelect: false,
		columnDefs: [
			{field: 'name', displayName: 'Name', minWidth: 150, enableHiding: false},
			{field: 'year', displayName: 'Year', width: 80, cellClass: 'text-center', type: 'number', enableHiding: false},
			{field: 'view_date', displayName: 'View Date', width: 110, cellClass: 'text-center', cellFilter: 'date: "dd.MM.yyyy"', filterCellFiltered: true, enableHiding: false},
			{field: 'gender', displayName: 'Gender', minWidth: 250, enableHiding: false},
			{field: 'note_imdb', displayName: 'IMDb', width: 100, cellClass: 'text-center', type: 'number'},
			{field: 'linkImdb', displayName: '', width: 25, enableFiltering: false, cellTemplate: linkImdb},
			{field: 'note_cinemagia', displayName: 'Cinemagia', cellClass: 'text-center', width: 110, type: 'number'},
			{field: 'linkCinemagia', displayName: '', width: 25, enableFiltering: false, cellTemplate: linkCinemagia},
			{field: 'note_cinemarx', displayName: 'Cinemarx', cellClass: 'text-center', width: 110, type: 'number'},
			{field: 'linkCinemarx', displayName: '', width: 25, enableFiltering: false, cellTemplate: linkCinemarx},
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
			templateUrl: 'app/client/movie/movieModal',
			controller: 'movieModalAddCtrl',
			controllerAs: 'mm',
			size: 'md',
			keyboard: false,
			backdrop: 'static'
		}).result.then(() => load()).catch(() => null);
	};

	vm.edit = id => {
		$uibModal.open({
			templateUrl: 'app/client/movie/movieModal',
			controller: 'movieModalEditCtrl',
			controllerAs: 'mm',
			size: 'md',
			keyboard: false,
			backdrop: 'static',
			resolve: {idMovie: () => id}
		}).result.then(() => load()).catch(() => null);
	};

	vm.openLink = utils.openLink;

	vm.destroy = row => {
		if (row.id_movie_from) {
			toastr.info('You can not delete existing movie');
			return;
		}
		dialogs.confirm('Confirms deletion', 'Want to delete the movie <b>' + row.name + '</b> ?', {size: 'sm'}).result.then(() => {
			movieModel.byId.remove({id: row.id}).$promise.then(() => {
				let index = _.findIndex(vm.grid.data, f => f.id === row.id);
				if (index > -1) {
					vm.grid.data.splice(index, 1);
					utils.setGridHeight('grid', vm.grid.data.length, true);
				}
			}).catch(() => toastr.error('An error occurred'));
		}).catch(() => null);
	};

	//const exportExcel = (arr, header, body) => {
	//	let colLength = header[0].length - 1;
	//	let rowCount = {value: 1};
	//	let sheet = {'!merges': []};
	//	let title = `${vm.ob.depot.name} - Stocuri curente pentru magazia ${vm.ob.magazine.activity} - ${vm.ob.magazine.name}`;
	//	excelFunction.addUnitHeader(sheet, rowCount);
	//	excelFunction.addTitle(sheet, title, rowCount, colLength);
	//	excelFunction.addHeader(sheet, header, rowCount);
	//	// create body
	//	for (let i = 0; i < arr.length; i++) {
	//		excelFunction.addRow(sheet, arr[i], rowCount, body);
	//	}
	//	excelFunction.makeRef(sheet, colLength, rowCount);
	//	utils.saveFile('octet-stream', excelFunction.createExcel(sheet, 'Sheet', 'xlsx'), title + '.xlsx');
	//};
	//
	//vm.excel = selectColumns => {
	//	let header = [
	//		[
	//			{wch: 80, ind: 0, name: 'Denumire', mandatory: true},
	//			{wch: 10, ind: 1, name: 'Cantitate', mandatory: true},
	//			{wch: 10, ind: 2, name: 'UM'},
	//			{wch: 10, ind: 3, name: 'Preț unitar'},
	//			{wch: 10, ind: 4, name: 'Valoare'},
	//			{wch: 10, ind: 5, name: 'Serie factură'},
	//			{wch: 10, ind: 6, name: 'Număr factură'},
	//			{wch: 10, ind: 7, name: 'Dată factură'}
	//		]
	//	];
	//	let body = [
	//		{type: 's', horizontal: 'left', ind: 0, columnName: 'name'},
	//		{type: 'n', horizontal: 'left', ind: 1, columnName: 'quantity'},
	//		{type: 's', horizontal: 'left', ind: 2, columnName: 'measure_unit'},
	//		{type: 'n', horizontal: 'right', ind: 3, columnName: 'unit_price'},
	//		{type: 'n', horizontal: 'right', ind: 4, columnName: 'amount'},
	//		{type: 's', horizontal: 'left', ind: 5, columnName: 'invoice_series'},
	//		{type: 'n', horizontal: 'right', ind: 6, columnName: 'invoice_number'},
	//		{type: 's', horizontal: 'center', ind: 7, columnName: 'date_text'}
	//	];
	//	if (selectColumns) {
	//		$uibModal.open({
	//			templateUrl: 'app/client/selectColumns/selectColumns',
	//			controller: 'selectColumnsCtrl',
	//			controllerAs: 'mm',
	//			size: 'sm',
	//			resolve: {header: () => header, body: () => body}
	//		}).result.then(r => {
	//			header = r.header;
	//			body = r.body;
	//			exportExcel(vm.data, header, body);
	//		}).catch(() => null);
	//	} else {
	//		exportExcel(vm.data, header, body);
	//	}
	//};

	let exportExcel = (header, body) => {
		let colLength = header[0].length - 1;
		let rowCount = {value: 1};
		let sheet = {'!merges': [], '!cols': []};
		let data = _.cloneDeep(vm.grid.data);
		excelFunction.addTitle(sheet, 'Movie List', rowCount, colLength);
		excelFunction.addHeader(sheet, header, rowCount);
		// create body
		for (let i = 0, ln = data.length; i < ln; i++) {
			data[i].index = i + 1;
			data[i].view_date = $filter('date')(data[i].view_date, 'dd.MM.yyyy');
			excelFunction.addRow(sheet, data[i], rowCount, body);
		}
		excelFunction.makeRef(sheet, colLength, rowCount);
		utils.saveFile('octet-stream', excelFunction.createExcel(sheet, 'Sheet', 'xlsx'), 'Movie List ' + data.length + '.xlsx');
	};

	vm.excel = selectColumns => {
		$loading.start('loading-container');
		let header = [
			[
				{wch: 6, ind: 0, name: 'Nr. Crt.'},
				{wch: 30, ind: 1, name: 'Name'},
				{wch: 6, ind: 2, name: 'Year'},
				{wch: 8, ind: 3, name: 'View Date'},
				{wch: 25, ind: 4, name: 'Gender'},
				{wch: 7, ind: 5, name: 'Note IMDB'},
				{wch: 25, ind: 6, name: 'Link IMDB'},
				{wch: 7, ind: 7, name: 'Note Cinemagia'},
				{wch: 25, ind: 8, name: 'Link Cinemagia'},
				{wch: 7, ind: 9, name: 'Note Cinemarx'},
				{wch: 25, ind: 10, name: 'Link Cinemarx'}
			]
		];
		let body = [
			{type: 'n', horizontal: 'center', ind: 0, columnName: 'index'},
			{type: 's', horizontal: 'left', ind: 1, columnName: 'name'},
			{type: 'n', horizontal: 'center', ind: 2, columnName: 'year'},
			{type: 's', horizontal: 'center', ind: 3, columnName: 'view_date'},
			{type: 's', horizontal: 'left', ind: 4, columnName: 'gender'},
			{type: 'n', horizontal: 'center', ind: 5, columnName: 'note_imdb'},
			{type: 's', horizontal: 'left', ind: 6, columnName: 'link_imdb'},
			{type: 'n', horizontal: 'center', ind: 7, columnName: 'note_cinemagia'},
			{type: 's', horizontal: 'left', ind: 8, columnName: 'link_cinemagia'},
			{type: 'n', horizontal: 'center', ind: 9, columnName: 'note_cinemarx'},
			{type: 's', horizontal: 'left', ind: 10, columnName: 'link_cinemarx'}
		];
		if (selectColumns) {
			$uibModal.open({
				templateUrl: 'app/client/selectColumns/selectColumns',
				controller: 'selectColumnsCtrl',
				controllerAs: 'mm',
				backdrop: 'static',
				size: 'sm',
				resolve: {header: () => header, body: () => body}
			}).result.then(resp => {
				header = resp.header;
				body = resp.body;
				exportExcel(header, body);
			}).catch(() => null);
		} else {
			exportExcel(header, body);
		}
		$loading.finish('loading-container');
	};

}
