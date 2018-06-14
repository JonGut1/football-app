angular.module('worldCupScoresApp')
	.controller('TablesCtrl', ['matchesStore', '$scope', function(match, $scope) {
		console.log(match);
		const t = this;
		this.name = 'Matas';
		this.insert = new Map();
		this.test = {
			name: '',
			goalsMain: {

			},
			goalsAdded: {

			},
			penalties: '',
			teams: [],
			current: [],
		};
		this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		this.names = ['Jonas', 'Matas', 'Greta', 'Rokas'];
		this.penalties = [];
		this.click = function() {
			console.log(t.test);
			match.insertData(t.test);
		};
		this.matchesDisp = [];
		this.split;

		match.promiseCheck.then(response => {
			match.getMatches(response._links).then(resp => {
				t.matchesDisplay(match.matches);
				//console.log(match.matches);
			});
    	});

		for(let i = 0; i < this.names.length; i++) {
			const addElement = document.createElement('option');
			addElement.classList.add('optionNames');
			addElement.setAttribute('value', this.names[i]);
			document.querySelector('#names').appendChild(addElement);
		}

		this.matchesDisplay = function(data) {
			let names = data.keys();
			//console.log(data.size);
			$scope.$apply(function() {
			for (let i = 0; i < data.size; i++) {
				//console.log(el.next().value);
				let value = names.next().value;
				//console.log(data);
					t.matchesDisp.push(value.split(' - '));
					t.split = value.split(' - ');
					//console.log(t.split);
			}

			});
			//console.log(t.split);
		};
	}]);