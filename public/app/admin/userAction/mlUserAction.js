(function () {
  'use strict';
  angular.module('ml-app').factory('mlUserAction', $resource => {
    return {
      byDate: $resource('/api/userAction/byDate/:date', {date: '@date'}),
      historyByIdUser: $resource('/api/userAction/history/byIdUser/:id_user/:clauseType/:limit', {id_user: '@id_user', clauseType: '@clauseType', limit: '@limit'}),
      historyLogInByIdUser: $resource('/api/userAction/historyLogIn/byIdUser/:id_user', {id_user: '@id_user'}),
      removeReportActions: $resource('/api/userAction/removeReportActions/:id_user', {id_user: '@id_user'}),
      removeLogInActions: $resource('/api/userAction/removeLogInActions/:id_user', {id_user: '@id_user'})
    };
  });
}());