(function () {
  'use strict';
  historyLogInCtrl.$inject = ['$scope', '$uibModal', '$http', '$sce', 'dialogs', 'toastr', 'utils', 'mlUserAction'];
  angular.module('ml-app').controller('historyLogInCtrl', historyLogInCtrl);
  function historyLogInCtrl($scope, $uibModal, $http, $sce, dialogs, toastr, utils, mlUserAction) {
    let gridApi;
    let loadData = () => {
      mlUserAction.historyLogInByIdUser.query({id_user: $scope.row.id}).$promise.then(resp => {
        $scope.gridHistoryLogIn.data = resp;
        utils.setGridHeight('gridHistoryLogIn', resp.length, true, 230);
      }).catch(() => {
        toastr.error('An error occurred');
      });
    };
    loadData();

    $scope.gridHistoryLogIn = {
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      showGridFooter: true,
      multiSelect: false,
      columnDefs: [
        {field: 'date', displayName: 'Istoric autentificare', enableHiding: false, cellFilter: "date:\'dd.MM.yyyy - hh:mm\'", filterCellFiltered: true}
      ],
      onRegisterApi: grApi => gridApi = grApi
    };

    $(window).resize(() => {
      utils.setGridHeight('gridHistoryLogIn', $scope.gridHistoryLogIn.data.length, false, 230);
      gridApi.core.refresh();
    });

    $scope.removeActions = () => {
      dialogs.confirm('Confirmă ștergerea', 'Sigur doriți să ștergeți istoricul autentificărilor ?', {size: 'sm'}).result.then(() => {
        $scope.disableBtn = true;
        mlUserAction.removeLogInActions.remove({id_user: $scope.row.id}).$promise.then(() => {
          loadData();
          toastr.success('Autentificările utilizatorului au fost șterse');
          $scope.disableBtn = false;
        }).catch(() => toastr.error('Eroare la ștergerea acțiunilor'));
      }).catch(() => null);
    };

    $scope.print = () => {
      $scope.pdfTitle = 'Istoric autentificare utilizator: ' + $scope.row.surname + ' ' + $scope.row.forename;
      let report = {
        template: 'historyLogIn',
        format: 'portrait',
        data: {
          logs: gridApi.core.getVisibleRows(gridApi.grid).map(e => e.entity),
          unit: $scope.row,
          title: $scope.pdfTitle
        },
        actionTitle: 'Istoric autentificare utilizator: ' + $scope.row.surname + ' ' + $scope.row.forename
      };
      $scope.disablePrint = true;
      $http.post('/generate/pdf/static', report, {responseType: 'arraybuffer'}).then(resp => {
        $scope.disablePrint = false;
        $scope.url = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([resp.data], {type: 'application/pdf'})));
        $uibModal.open({
          templateUrl: 'app/admin/showPdf/showPdf-modal',
          controller: 'showPdfCtrl',
          windowClass: 'full-screen',
          scope: $scope
        }).result.catch(() => null);
      }).catch(() => null);
    };
  }
}());