(function () {
  'use strict';
  angular.module('ml-app').factory('mlUser', $resource => {
    return {
      simple: $resource('/api/user', {}, {
        'update': {method: 'PUT'}
      }),
      byId: $resource('/api/user/:id', {id: '@id'}),
      byIdWithUnit: $resource('/api/user/withUnit/:id', {id: '@id'}),
      activeInactive: $resource('/api/user/admin/set/activeInactive'),
      verifyEmail: $resource('/api/user/verifyEmail'),
      verifyPassword: $resource('/api/user/verifyPassword'),
      resetPassword: $resource('/api/user/resetPassword'),
      bootstrappedUser: $resource('/api/user/bootstrapped/user'),
      dbInfo: $resource('/api/user/dbInfo/:id', {id: '@id'})
    };
  });
}());