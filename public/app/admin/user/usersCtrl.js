(function () {
  'use strict';
  usersCtrl.$inject = ['$scope', 'toastr', '$timeout', 'dialogs', '$uibModal', 'utils', 'mlUser'];
  angular.module('ml-app').controller('usersCtrl', usersCtrl);
  function usersCtrl($scope, toastr, $timeout, $dialogs, $uibModal, utils, mlUser) {
    mlUser.simple.query().$promise.then(resp => {
      $scope.gridUsers.data = resp;
      utils.setGridHeight('grUser', resp.length);
    }).catch(() => {
      toastr.error('An error occurred');
    });

    let active = '<div class="m-top-4 text-center"><a ng-if="row.entity.active === true" class="btn btn-xs btn-success" ng-click="grid.appScope.setActiveInactive(row.entity)" title="Deactivation" data-toggle="tooltip" data-placement="left">active</a>' +
        '<a ng-if="row.entity.active === false || row.entity.active === null" class="btn btn-xs btn-danger" ng-click="grid.appScope.setActiveInactive(row.entity)" title="Activation" data-toggle="tooltip" data-placement="left">Inactiv</a></div>',
      historyLogIn = '<div class="m-top-4 text-center"><a class="btn btn-info btn-xs" ng-click="grid.appScope.getHistoryLogIn(row.entity)" title="LogIn History" data-toggle="tooltip" data-placement="left"><i class="glyphicon glyphicon-barcode"></i></a></div>',
      historyAction = '<div class="m-top-4 text-center"><a class="btn btn-default btn-xs" ng-click="grid.appScope.getHistoryAction(row.entity)" title="Action History" data-toggle="tooltip" data-placement="left"><i class="glyphicon glyphicon-compressed"></i></a></div>',
      resetPwd = '<div class="m-top-4 text-center"><a class="btn btn-warning btn-xs" ng-click="grid.appScope.resetPassword(row.entity)" title="Reset password" data-toggle="tooltip" data-placement="left"><i class="glyphicon glyphicon-lock"></i></a></div>',
      dbInfo = '<div class="m-top-4 text-center"><a ng-if="row.entity.role !== \'admin\'" class="btn btn-default btn-xs" ng-click="grid.appScope.getDbInfo(row.entity)" title="Info DB" data-toggle="tooltip" data-placement="left"><i class="glyphicon glyphicon-hdd"></i></a>' +
        '<button ng-if="row.entity.role === \'admin\'" disabled class="btn btn-default btn-xs" ng-click="grid.appScope.getDbInfo(row.entity)"><i class="glyphicon glyphicon-hdd"></i></button></div>',
      destroy = '<div class="m-top-4 text-center" ><a class="btn btn-danger btn-xs" ng-click="grid.appScope.destroy(row.entity)" title="Delete account" data-toggle="tooltip" data-placement="left"><i class="glyphicon glyphicon-trash"></i></a></div>',
      edit = '<div class="m-top-4 text-center"><a class="btn btn-primary btn-xs " ng-click="grid.appScope.edit(row.entity)" title="Edit account" data-toggle="tooltip" data-placement="left"><i class="glyphicon glyphicon-edit"></i></a></div>';
    $scope.gridUsers = {
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      enableGridMenu: true,
      showGridFooter: true,
      columnDefs: [
        {field: 'first_name', displayName: 'First Name', minWidth: 130, enableHiding: false},
        {field: 'last_name', displayName: 'Last Name', minWidth: 130, enableHiding: false},
        {field: 'email', displayName: 'Email', minWidth: 150, enableHiding: false},
        {field: 'role', displayName: 'Rol', width: 90, enableHiding: true, visible: false},
        {field: 'last_login', displayName: 'Last login', width: 140, enableHiding: false, cellFilter: "date:\'dd.MM.yyyy - HH:mm\'", filterCellFiltered: true, cellClass: 'text-center'},
        {field: 'createdAt', displayName: 'Creat', width: 90, visible: false, cellFilter: "date:\'dd.MM.yyyy\'", filterCellFiltered: true, cellClass: 'text-center'},
        {field: 'phone', displayName: 'Phone', width: 100, enableHiding: true, visible: false, cellClass: 'text-center'},
        {field: 'active', displayName: 'Active', width: 60, enableFiltering: false, cellTemplate: active, enableHiding: false},
        {field: 'edit', displayName: '', width: 30, enableFiltering: false, cellTemplate: edit, enableHiding: false},
        {field: 'historyLogIn', displayName: '', width: 30, enableFiltering: false, cellTemplate: historyLogIn, enableHiding: true, visible: true},
        {field: 'historyAction', displayName: '', width: 30, enableFiltering: false, cellTemplate: historyAction, enableHiding: true, visible: true},
        {field: 'dbInfo', displayName: '', width: 30, enableFiltering: false, cellTemplate: dbInfo, enableHiding: true, visible: true},
        {field: 'resetPwd', displayName: '', width: 30, enableFiltering: false, enableHiding: false, cellTemplate: resetPwd},
        {field: 'destroy', displayName: '', width: 30, enableFiltering: false, cellTemplate: destroy, enableHiding: false}
      ],
      onRegisterApi: gridApi => {
        $scope.gridApi = gridApi;
        $timeout(() => {
          $(window).trigger('resize');
        });
      },
      rowTemplate: "<div ng-dblclick='grid.appScope.edit(row.entity)' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
    };

    $scope.addUser = () => {
      $uibModal.open({
        templateUrl: 'app/admin/user/user-modal',
        controller: 'addUserCtrl',
        size: 'md'
      }).result.then(resp => {
          $scope.gridUsers.data.push(resp);
        }).catch(() => null);
    };

    $scope.edit = row => {
      if (row.role === 'admin' && row.id !== window.bootstrappedUser.id) {
        toastr.warning('Not enough privileges');
      } else {
        $scope.modal = angular.copy(row);
        $uibModal.open({
          templateUrl: 'app/admin/user/user-modal',
          controller: 'editUserCtrl',
          size: 'md',
          scope: $scope
        }).result.then(resp => {
            let index = _.findIndex($scope.gridUsers.data, f => f.id === resp.id);
            if (index > -1) {
              $scope.gridUsers.data[index] = resp;
            }
          }).catch(() => null);
      }
    };

    $scope.getHistoryAction = row => {
      $scope.row = row;
      $uibModal.open({
        templateUrl: 'app/admin/user/historyAction/historyAction-modal',
        controller: 'historyActionCtrl',
        size: 'lg',
        scope: $scope
      }).result.catch(() => null);
    };

    $scope.getHistoryLogIn = row => {
      $scope.row = row;
      $uibModal.open({
        templateUrl: 'app/admin/user/historyLogIn/historyLogIn-modal',
        controller: 'historyLogInCtrl',
        size: 'md',
        scope: $scope
      }).result.catch(() => null);
    };

    $scope.getDbInfo = row => {
      $scope.row = row;
      $uibModal.open({
        templateUrl: 'app/admin/user/dbInfo/dbInfo-modal',
        controller: 'dbInfoCtrl',
        size: 'sm',
        resolve: {selectedUser: () => row}
      }).result.catch(() => null);
    };

    $scope.setActiveInactive = row => {
      if (row.role === 'admin') {
        toastr.warning('Not enough privileges');
      } else {
        let message = row.active ? 'Account has been disabled' : 'Account has been activated';
        mlUser.simple.update({id: row.id, active: !row.active}).$promise.then(() => {
          toastr.success(message);
          row.active = !row.active;
        }).catch(() => {
          toastr.error('An error occurred');
        });
      }
    };

    $scope.resetPassword = row => {
      $scope.row = row;
      $uibModal.open({
        templateUrl: 'app/admin/user/resetPasswordUser/resetPasswordUser-modal',
        controller: 'resetPasswordUserCtrl',
        size: 'sm',
        scope: $scope
      }).result.catch(() => null);
    };

    $scope.destroy = row => {
      $dialogs.confirm('Confirms deletion', 'Want to delete account for user <b>' + row.first_name + ' ' + row.last_name + '</b> ?', {size: 'sm'}).result.then(() => {
        mlUser.byId.remove({id: row.id}).$promise.then(() => {
          $scope.gridUsers.data.splice($scope.gridUsers.data.indexOf(row), 1);
          toastr.success('Account has been deleted');
        }).catch(() => {
          toastr.error('An error occurred');
        });
      }, () => null);
    };
  }
}());