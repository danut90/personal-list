angular.module('ml-app').controller('actorCtrl', actorCtrl);
actorCtrl.$inject = ['$loading', '$uibModal', 'dialogs', 'toastr', 'utils', 'actorModel'];
function actorCtrl($loading, $uibModal, dialogs, toastr, utils, actorModel) {

	let vm = this;

	const load = () => {
		$loading.start('loading-container');
		actorModel.simple.query().$promise.then(resp => {
			vm.grid.data = resp;
			utils.setGridHeight('grid', resp.length, true);
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
			{field: 'birth_date', displayName: 'Birth Date', width: 110, cellClass: 'text-center', cellFilter: 'date: "dd.MM.yyyy"', filterCellFiltered: true, enableHiding: false},
			{field: 'birth_place', displayName: 'Birth Place', minWidth: 250, enableHiding: false},
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
			templateUrl: 'app/client/actor/actorModal',
			controller: 'actorModalCtrl',
			controllerAs: 'mm',
			size: 'md',
			keyboard: false,
			backdrop: 'static',
			resolve: {option: () => ({})}
		}).result.then(() => load()).catch(() => null);
	};

	vm.edit = id => {
		$uibModal.open({
			templateUrl: 'app/client/actor/actorModal',
			controller: 'actorModalCtrl',
			controllerAs: 'mm',
			size: 'md',
			keyboard: false,
			backdrop: 'static',
			resolve: {option: () => ({idActor: id})}
		}).result.then(resp => {
			let index = _.findIndex(vm.grid.data, f => f.id === resp.id);
			if (index > -1) {
				vm.grid.data[index] = resp;
			}
		}).catch(() => null);
	};

	vm.openLink = utils.openLink;

	vm.destroy = row => {
		if (row.id_actor_from) {
			toastr.info('You can not delete existing actor');
			return;
		}
		dialogs.confirm('Confirms deletion', 'Want to delete the actor <b>' + row.name + '</b> ?', {size: 'sm'}).result.then(() => {
			actorModel.byId.remove({id: row.id}).$promise.then(() => {
				let index = _.findIndex(vm.grid.data, f => f.id === row.id);
				if (index > -1) {
					vm.grid.data.splice(index, 1);
					utils.setGridHeight('grid', vm.grid.data.length, true);
				}
			}).catch(() => toastr.error('An error occurred'));
		}).catch(() => null);
	};

}
