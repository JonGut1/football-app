angular.module('worldCupScoresApp')
	.controller('HistoryCtrl', ['dataStore', '$scope', function(match, $scope) {
		this.playerData = {};

		match.fetchPlayerData().then(data => {
			$scope.$apply(() => {
				this.playerData = data;
			});

				console.log(this.playerData);
				console.log('New Data Inserted..........');
		});

		this.remove = (name, ids) => {
			match.removePlayerData(name, ids, true).then(data => {
				$scope.$apply(() => {
					this.playerData = data;
				});
			});
		}

	}]);