'use strict';

/**
 * @ngdoc overview
 * @name worldCupScoresApp
 * @description
 * # worldCupScoresApp
 *
 * Main module of the application.
 */
angular
  .module('worldCupScoresApp', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  	$urlRouterProvider.otherwise('/leaderboard');

  	$stateProvider
    .state('insert', {
      url: '/insert',
      templateUrl: 'views/insert.html',
      controller: 'InsertCtrl as insert'
    })
    .state('history', {
      url: '/history',
      templateUrl: 'views/history.html',
      controller: 'HistoryCtrl as history'
    })
    .state('leaderboard', {
      url: '/leaderboard',
      templateUrl: 'views/leaderboard.html',
      controller: 'LeaderboardCtrl as board'
    });
  }]);