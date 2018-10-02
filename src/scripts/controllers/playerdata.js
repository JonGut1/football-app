angular.module('worldCupScoresApp')
  .controller('PlayerdataCtrl', ['dataStore', '$scope', '$stateParams', '$state', function(match, $scope, $stateParams, $state) {
  	const t = this;
  	this.playerData = null;
  	this.playerDataString = null;
  	this.titles = ['Full-Time', 'Extra-Time', 'Penalties', 'Winner', 'Status', 'Match'];
  	console.log($state);
  	this.stringConvert = (string) => {
		const arr = string.map((item) => {
			for (items in item) {
				if (Array.isArray(item[items])) {
					item[items] = `${item[items][0]} - ${item[items][1]}`;
				}
			}
			return item;
		});

		return arr;
	}

	this.showData = () => {
		if (match.cachedPlayerData) {

			this.playerData = t.stringConvert(match.cachedPlayerData.playerData[$stateParams.name]);
			console.log('Old Data Inserted.........');
			console.log(this.playerData);
		}

		match.fetchPlayerData().then(result => {
			const results = t.stringConvert(result.playerData[$stateParams.name]);
			console.log(angular.equals(this.playerData, results));
			if (this.playerData && angular.equals(this.playerData, results)) {
				return;
			} else if (this.playerData === null || this.playerData !== results) {
				this.playerData = results;
				console.log('New Data Inserted.........');
			}
		});
	}

	t.showData();



	this.deleteData = (name, id) => {
		match.removePlayerData(name, id).then(response => {
			if (response === 'go back') {
				//$state.go('history');
				$state.reload('history');
				//location.reload();
			}
		});

	}

  }]);