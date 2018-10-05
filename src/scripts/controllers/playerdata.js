angular.module('worldCupScoresApp')
  .controller('PlayerdataCtrl', ['dataStore', '$scope', '$stateParams', '$state', function(match, $scope, $stateParams, $state) {
  	const t = this;
  	this.playerData = null;
  	this.titles = ['Full-Time', 'Extra-Time', 'Penalties', 'Predicted Winner', 'Status', 'Match'];

  	/* converts the player data arrays into string */
  	this.stringConvert = (string) => {
  		if (string === undefined) {
  			return;
  		}
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


	/* fetches the player data and inserts into a playerData variable */
	this.showData = () => {
		match.fetchPlayerData().then(result => {
			const results = t.stringConvert(result.playerData[$stateParams.name]);
			$scope.$apply(() => {
				this.playerData = results;
			});
			console.log('New Data Inserted.........');
		});
	}

	t.showData();


	/* deletes player data */
	this.deleteData = (name, id) => {
		match.removePlayerData(name, id, null).then(data => {
			const results = t.stringConvert(data.playerData[$stateParams.name]);
			$scope.$apply(() => {
				this.playerData = results;
			});
		});
	}

  }]);