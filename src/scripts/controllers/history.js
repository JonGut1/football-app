angular.module('worldCupScoresApp')
	.controller('HistoryCtrl', ['dataStore', '$scope', function(match, $scope) {
		this.playerData = {};
		this.dataShown = null;

		this.showPlayerList = (() => {
			if (match.cachedPlayerData) {
				console.log('Loaded player data........');
				this.playerData = match.cachedPlayerData;
				this.dataShown = true;
			}
		})();

		match.fetchPlayerData().then(data => {
			console.log(this.playerData.playerData, data.playerData);
			console.log(angular.equals(this.playerData.playerData, data.playerData));
			if (angular.equals(this.playerData.playerData, data.playerData)) {
				return;
			} else {
				this.playerData = data;
				console.log(this.playerData);
				console.log('New Data Inserted..........');
			}
		});

		this.expandInfo = () => {

		}

	}]);