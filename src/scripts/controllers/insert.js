angular.module('worldCupScoresApp')
	.controller('InsertCtrl', ['dataStore', '$scope', function(dataB, $scope) {
		const t = this;
		/* current form input */
		this.currentInput = {
			name: '',
			fullTime: [],
			extraTime: [],
			penalties: '-',
			winner: '-',
			points: 0,
			accurate: 0,
			status: 'PENDING',
			match: [],
			date: '',
			id: '',
			color: 'white',
			outcome: 'Not Known',
		};

		this.date = new Date();

		this.currentMatch;
		this.names;
		this.fullTime = [];
		this.extraTime = [];
		this.penalties;
		this.winner = '-';

		this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		this.dataNames;

		this.matchesSelection = [];

		/* selects the names of the matches from a json file */
		this.matchesSelect = () => {
			const interval = setInterval(() => {
				if (dataB.fetchedMatches === true) {
					clearInterval(interval);
					fetch('/scripts/data/allMatches.json')
					.then(response => response.json())
					.then(items => {
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
			if (t.currentMatch !== undefined && t.names !== undefined && t.fullTime.length >= 2) {
				console.log('Submited.......');
				const teams = `${t.currentMatch[0]} - ${t.currentMatch[1]}`
				if (t.fullTime.length === 0) {
					t.fullTime = '-';
				}

				if (t.extraTime.length === 0) {
					t.extraTime = '-';
				}

				if (t.penalties === undefined) {
					t.penalties = '-';
				} else {
					t.winner = t.penalties;
				}

				this.checkClass();

				t.currentInput.fullTime = t.fullTime;
				t.currentInput.extraTime = t.extraTime;
				t.currentInput.penalties = t.penalties;
				t.currentInput.winner = t.winner;
				t.currentInput.match = t.currentMatch;
				t.currentInput.name = t.names;
				t.currentInput.date = `${this.date.getDate()}/${this.date.getMonth()}/${this.date.getFullYear()}`;
				t.currentInput.id = t.names + t.winner + t.currentMatch[0] + t.fullTime[0] + t.extraTime[0] + t.penalties + Math.floor(Math.random() * 100);

				dataB.insertPlayerData(t.currentInput);
				dataB.insertInputNames(t.currentInput.name);
				this.currentMatch = '';
				this.fullTime = [];
				this.extraTime = [];
				this.penalties;
				this.winner = '-'

				this.currentInput = {
					name: '',
					fullTime: [],
					extraTime: [],
					penalties: '-',
					winner: '-',
					points: 0,
					accurate: 0,
					status: 'PENDING',
					match: [],
					date: '',
					id: '',
					color: 'white',
					outcome: 'Not Known',
				};

				this.removeAttr();
			} else {
				console.log('Missing fields..........');
			}
		};

		this.removeAttr = () => {
			const firstTeam = document.querySelector('#first');
			const secondTeam = document.querySelector('#second');
			firstTeam.removeAttribute('winner', '');
			secondTeam.removeAttribute('winner', '');
		}

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
				t.winner = 'draw';
				firstTeam.removeAttribute('winner', '');
				secondTeam.removeAttribute('winner', '');
				}
				if (t.fullTime[0] > t.fullTime[1]) {
					t.winner = firstTeam.textContent;
					firstTeam.setAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.fullTime[0] < t.fullTime[1]) {
					t.winner = secondTeam.textContent;
					firstTeam.removeAttribute('winner', '');
					secondTeam.setAttribute('winner', '');
				}
			}

			if (t.extraTime.length > 1) {
				if (t.extraTime[0] === t.extraTime[1]) {
					t.winner = 'draw';
					firstTeam.removeAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.extraTime[0] > t.extraTime[1]) {
					t.winner = firstTeam.textContent;
					firstTeam.setAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.extraTime[0] < t.extraTime[1]) {
					t.winner = secondTeam.textContent;
					firstTeam.removeAttribute('winner', '');
					secondTeam.setAttribute('winner', '');
				}
			}

			if (t.penalties !== undefined) {
				if (t.penalties === t.currentMatch[0]) {
					t.winner = firstTeam.textContent;
					firstTeam.setAttribute('winner', '');
					secondTeam.removeAttribute('winner', '');
				}
				if (t.penalties === t.currentMatch[1]) {
					t.winner = secondTeam.textContent;
					firstTeam.removeAttribute('winner', '');
					secondTeam.setAttribute('winner', '');
				}
			}
		};

		this.getNames = () => {
			fetch('/scripts/data/inputNames.json')
				.then(response => response.json())
				.then(items => {
					$scope.$apply(() => {
						t.dataNames = items.inputNames;
					});
				});
		};

		t.getNames();
	}]);