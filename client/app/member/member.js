'use strict';

angular.module('meansampleApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('member', {
        url: '/member',
        templateUrl: 'app/member/member.html',
        controller: 'MemberCtrl'
      });
  });
