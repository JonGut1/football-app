angular.module('worldCupScoresApp')
  .controller('LeaderboardCtrl', ['dataStore', '$scope', function(match, $scope) {
  	console.log(match.cachedPlayerData);
  }]);