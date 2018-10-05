angular.module('worldCupScoresApp')
	.controller('HistoryCtrl', ['dataStore', '$scope', function(match, $scope) {
		this.playerData = {};

		/*
		* fetches player data so that it could be displayed on the screen
		* and stores that data into the playerData object.
		*/
		this.showPlayerData = () => {
			match.fetchPlayerData().then(data => {
				$scope.$apply(() => {
					this.playerData = data;
				});

					console.log(this.playerData);
					console.log('New Data Inserted..........');
			});
		}
		this.showPlayerData();

		/* delete player data icon */
		this.remove = (name, ids) => {
			match.removePlayerData(name, ids, true).then(data => {
				$scope.$apply(() => {
					this.playerData = data;
				});
			});
		}

	}]);