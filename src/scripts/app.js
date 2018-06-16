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
  	$urlRouterProvider.otherwise('/home');

  	$stateProvider
  	.state('home', {
  		url: '/home',
  		templateUrl: 'views/home.html',
 		  controller: 'HomeCtrl as home'
  	})
  	.state('scores', {
  		url: '/scores',
  		templateUrl: 'views/scores.html',
  		controller: 'LivescoresCtrl as scores'
  	})
    .state('tables', {
      url: '/tables',
      templateUrl: 'views/tables.html',
      controller: 'TablesCtrl as tables'
    })
    .state('leaderboard', {
      url: '/leaderboard',
      templateUrl: 'views/leaderBoard.html',
      controller: 'LeaderBoardCtrl as board'
    });
  }]);