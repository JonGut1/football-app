'use strict';

/**
 * @ngdoc function
 * @name worldCupScoresApp.controller:LivescoresCtrl
 * @description
 * # LivescoresCtrl
 * Controller of the worldCupScoresApp
 */
angular.module('worldCupScoresApp')
  .controller('LivescoresCtrl', ['matchesStore', '$scope', function(match, $scope) {
  	const t = this;
  	//console.log($scope);
    this.currentMatchDay;
    this.tableAD;
    this.tableEH;

    	match.promiseCheck.then(response => {
        match.getFixtures(response._links).then(resp => {
          console.log(resp);
          $scope.$apply(function() {
            t.tableAD = match.table.standingsAD;
            t.tableEH = match.table.standingsEH;
          });
          console.log(match.table);
          console.log(response);
        });
        match.getTimes(response._links).then(resp => {
          console.log(resp);
        });
    	});
  }]);
