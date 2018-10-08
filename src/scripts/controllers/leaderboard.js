angular.module('worldCupScoresApp')
  .controller('LeaderboardCtrl', ['dataStore', '$scope', function(match, $scope) {
  	const t = this;
  	this.playerLeaderboard;
  	this.playerLeadArrLength = [];
  	this.namingLead = ['Position', 'Name', 'Points', 'Accurate'];

  	this.showLeaderboard = () => {
  		match.fetchPlayerResults().then(data =>{
  			const arr = [];
  			this.playerLeadArrLength = Object.keys(data.playerResults).length;
  			for (let i = 0; i < Object.keys(data.playerResults).length; i++) {
  				arr.push(i);
  			}
  			$scope.$apply(() => {
  				this.playerLeadArrLength = arr;
  				t.playerLeaderboard = data.playerResults;
  			});
  		});
  	}
  	t.showLeaderboard();
  }]);