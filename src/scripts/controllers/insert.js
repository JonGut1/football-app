angular.module('worldCupScoresApp')
	.controller('InsertCtrl', ['dataStore', '$scope', function(dataB, $scope) {
		const t = this;
		/* current form input */
		this.currentInput = {
			name: '',
			fullTime: [],
			extraTime: [],
			penalties: [],
			penalties: '-',
			winner: '-',
			points: 0,
			accurate: 0,
			status: 'pending',
			match: [],
		};

		this.currentMatch;
		this.names;
		this.fullTime = [];
		this.extraTime = [];
		this.penalties;
		this.winner;

		this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		this.dataNames;

		this.matchesSelection = [];

		/* selects the names of the matches from a json file */
		this.matchesSelect = () => {
			const interval = setInterval(() => {
				if (dataB.fetchedMatches === true) {
					clearInterval(interval);
					fetch('/src/scripts/data/allMatches.json')
					.then(response => response.json())
					.then(items => {
						console.log(items);
						items.allMatches.forEach(it => {
							$scope.$apply(() => {
								t.matchesSelection.push(it);
							});
						});
					});
				}
			}, 100);
		};
		t.matchesSelect();

		/* save player data on click */
		this.save = () => {
			const teams = `${t.currentMatch[0]} - ${t.currentMatch[1]}`
			if (t.fullTime.length === 0) {
				t.fullTime = '-';
			} else if (t.fullTime[0] > t.fullTime[1]) {
				t.winner = t.currentMatch[0];
			} else {
				t.winner = t.currentMatch[1];
			}

			if (t.extraTime.length === 0) {
				t.extraTime = '-';
			} else if (t.extraTime[0] > t.extraTime[1]) {
				t.winner = t.currentMatch[0];
			} else {
				t.winner = t.currentMatch[1];
			}

			if (t.penalties === undefined) {
				t.penalties = '-';
			} else {
				t.winner = t.penalties;
			}

			if (t.winner === undefined) {
				t.winner = 'draw';
			}

			t.currentInput.fullTime = t.fullTime;
			t.currentInput.extraTime = t.extraTime;
			t.currentInput.penalties = t.penalties;
			t.currentInput.winner = t.winner;
			t.currentInput.match = t.currentMatch;
			t.currentInput.name = t.names;

			dataB.insertPlayerData(t.currentInput);
			dataB.insertInputNames(t.currentInput.name);
		};

		/* checks which team is selected to be the winner and adds green coloring to that team */
		this.checkClass = () => {
			const firstTeam = document.querySelector('#first');
			const secondTeam = document.querySelector('#second');
			const inputF = document.querySelector('#fullFirst');
			const inputS = document.querySelector('#fullSecond');
			const inputFAdded = document.querySelector('#addedFirst');
			const inputSAdded = document.querySelector('#addedSecond');
			const inputFPenalties = document.querySelector('#penalties');

			if (t.fullTime.length > 1) {
				if (t.fullTime[0] === t.fullTime[1]) {
				firstTeam.removeAttribute('winner', '');
				secondTeam.removeAttribute('winner', '');
				}
				if (t.fullTime[0] > t.fullTime[1]) {
					firstTeam.setAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.fullTime[0] < t.fullTime[1]) {
					firstTeam.removeAttribute('winner', '');
					secondTeam.setAttribute('winner', '');
				}
			}

			if (t.extraTime.length > 1) {
				if (t.extraTime[0] === t.extraTime[1]) {
					firstTeam.removeAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.extraTime[0] > t.extraTime[1]) {
					firstTeam.setAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.extraTime[0] < t.extraTime[1]) {
					firstTeam.removeAttribute('winner', '');
					secondTeam.setAttribute('winner', '');
				}
			}

			if (t.penalties !== undefined) {
				if (t.penalties === t.currentMatch[0]) {
					firstTeam.setAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.penalties === t.currentMatch[1]) {
					firstTeam.removeAttribute('winner', '');
					secondTeam.setAttribute('winner', '');
				}
			}
		};

		this.getNames = () => {
			fetch('/src/scripts/data/inputNames.json')
				.then(response => response.json())
				.then(items => {
					$scope.$apply(() => {
						t.dataNames = items.inputNames;
					});
				});
		};

		t.getNames();
	}]);