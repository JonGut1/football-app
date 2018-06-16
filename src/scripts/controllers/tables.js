angular.module('worldCupScoresApp')
	.controller('TablesCtrl', ['matchesStore', '$scope', function(match, $scope) {
		console.log(match);
		const t = this;
		this.name = 'Matas';
		this.insert = new Map();
		this.scoresNames = ['goalsMain', 'goalsAdded', 'penalties'];
		this.fixtureNames = ['fullTime', 'extraTime', 'penaltyShootout'];
		this.testing = 123;
		this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		this.names = [];
		this.penalties = [];
		this.winner = [];
		this.sortOf = [];
		this.fail = [];
		this.test = {
			name: '',
			goalsMain: {

			},
			goalsAdded: {

			},
			time: '',
			penalties: ' - ',
			winner: '',
			points: 0,
			accurate: 0,
			status: 'pending',
			current: [],
		};

		this.setAttrName = function() {
			if (t.test.current.length === 0) {
				$(".info-u-list *").attr("disabled", "disabled").off('click');
			} else {
				$(".info-u-list *").removeAttr("disabled", "disabled").off('click');
			}
		};
		//console.log(t.test.goalsAdded);
		//console.log(t.playerData);
		this.matchesDisplay = function(data) {
			//console.log(match.matches);
			//console.log(data);
			let names = data.keys();

			$scope.$apply(function() {
			for (let i = 0; i < data.size; i++) {
				//console.log(el.next().value);
				let value = names.next().value;
				//console.log(match.results);
				//console.log(value);
					t.matchesDisp.push(value.split(' - '));
					t.split = value.split(' - ');
					//console.log(t.split);
			}
					//console.log(match.playerData);

						//console.log(match.playerData);
						//console.log(match.playerData);




				});
			//console.log(t.split);
		};

		this.click = function() {

			console.log(t.test);
			if (Object.keys(t.test.goalsAdded).length === 0) {
				t.test.goalsAdded = ' - ';
			}
			if (Object.keys(t.test.goalsMain).length === 0) {
				t.test.goalsMain = ' - ';
			}
			if (Object.keys(t.test.penalties).length === 0) {
				t.test.penalties = ' - ';
			}
			//console.log(t.test);
			const time = new Date();
			const calcTime = `${time.getDate()} / ${time.getMonth()} / ${time.getFullYear()}`;
			t.test.time = calcTime;
			match.getData().then(response => {
				//console.log(response);
				match.insertData(response, t.test, t.test.name);
				t.test = {
					name: '',
					goalsMain: {

					},
					goalsAdded: {

					},
					time: '',
					penalties: '',
					teams: [],
					winner: '',
					points: 0,
					current: [],
				}
				location.reload();
			});
			//console.log(data);



			//console.log(t.test);
		};
		this.matchesDisp = [];
		this.split;

		match.promiseCheck.then(response => {
			match.getMatches(response._links).then(resp => {
				//console.log(match.matches);
				//console.log(resp);
				console.log(match.playerData);
				t.matchesDisplay(match.matches);
				t.checkResults(match.matches);
				//console.log(match.matches);
			});
    	});

    	this.checkResults = function(data) {
    		match.results.forEach(el => {
    		for (k in match.playerData.ScoresData) {
						//console.log(k);
							for (m in match.playerData.ScoresData[k]) {
								//console.log(match.results);
								//console.log(match.playerData.ScoresData[k]);
									//console.log(match.results);
									for (let incr = 0; incr < 3; incr++) {
									//console.log(incr);
										const first = t.fixtureNames[incr];
										const scoresNa = t.scoresNames[incr];
											if(Object.keys(match.playerData.ScoresData[k][m][scoresNa]).length >= 1){
												//console.log(Object.keys(match.playerData.ScoresData[k][m][t.scoresNames[incr]]).length);

												//console.log(el);
												const teamA = el[first]['teamA'];
												const teamH = el[first]['teamH'];
												if (first === "penaltyShootout") {
													if (teamA[1].length > 0 && teamH[1].length > 0) {

														console.log(teamA[0].length, teamH[0]);
														if (teamA[1] > teamH[1]) {
															if (match.playerData.ScoresData[k][m][scoresNa].penalties === teamA[1]) {
																match.insertPoints(match.playerData.ScoresData[k][m], 1, 'finished', t.test);
															}
														} else if (teamA[1] < teamH[1]) {
															if (match.playerData.ScoresData[k][m][scoresNa].penalties === teamH[1]) {
																match.insertPoints(match.playerData.ScoresData[k][m], 1, 'finished', t.test);
															}
														} else {
															match.insertPoints(match.playerData.ScoresData[k][m], 0, 'finished', t.test);
														}
														//if (match.playerData.ScoresData[k][m][scoresNa] === ) {

														//}
														console.log(teamA);
														//console.log(match.playerData.ScoresData[k][m]);
														console.log(match.playerData.ScoresData[k][m][scoresNa].penalties);
														return;
													}
												}
												//console.log(match.playerData.ScoresData[k][m][scoresNa]);


											if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] != undefined && match.playerData.ScoresData[k][m][scoresNa][teamH[0]] != undefined) {
												//console.log(match.playerData.ScoresData[k][m][t.scoresNames[0]][el.second[0]]);
												//console.log(match.playerData.ScoresData[k][m]);
												//console.log(66666666666666666);
												//console.log(match.playerData.ScoresData[k][m][scoresNa][teamA[0]]);
												//console.log();
												//console.log(66666666666666666);
												if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] === teamA[1] && match.playerData.ScoresData[k][m][scoresNa][teamH[0]] === teamH[1]) {
													console.log(77777777);
													t.test.accurate = 1;
													match.insertPoints(match.playerData.ScoresData[k][m], 3, 'finished', t.test);
													//console.log(77777777777777777777);
												} else if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] > match.playerData.ScoresData[k][m][scoresNa][teamH[0]] && teamA[1] > teamH[1]) {
													//console.log(44444444);
													match.insertPoints(match.playerData.ScoresData[k][m], 1, 'finished', t.test);

												} else if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] < match.playerData.ScoresData[k][m][scoresNa][teamH[0]] && teamA[1] < teamH[1]) {
													//console.log(55555555);
													match.insertPoints(match.playerData.ScoresData[k][m], 1, 'finished', t.test);
												} else if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] === match.playerData.ScoresData[k][m][scoresNa][teamH[0]] && teamA[1] === teamH[1]) {
													//console.log(66666666);
													match.insertPoints(match.playerData.ScoresData[k][m], 1, 'finished', t.test);
												} else if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] === match.playerData.ScoresData[k][m][scoresNa][teamH[0]] && teamA[1] != teamH[1]) {
													//console.log(66666666);
													match.insertPoints(match.playerData.ScoresData[k][m], 0, 'finished', t.test);
												} else if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] > match.playerData.ScoresData[k][m][scoresNa][teamH[0]] && teamA[1] < teamH[1]) {
													match.insertPoints(match.playerData.ScoresData[k][m], 0, 'finished', t.test);
												} else if (match.playerData.ScoresData[k][m][scoresNa][teamA[0]] < match.playerData.ScoresData[k][m][scoresNa][teamH[0]] && teamA[1] > teamH[1]) {
													match.insertPoints(match.playerData.ScoresData[k][m], 0, 'finished', t.test);
												}
											}
										}
										t.winner = [];
										t.sortOf = [];
										t.fail = [];

										}
											//console.log(el);

									//console.log(1234);


								//console.log(match.playerData.ScoresData[k][m][t.scoresNames[incr]]);
							}
						}
						});
    	};

		for(let i = 0; i < this.names.length; i++) {
			const addElement = document.createElement('option');
			addElement.classList.add('optionNames');
			addElement.setAttribute('value', this.names[i]);
			document.querySelector('#names').appendChild(addElement);
		}

		this.addScreen = function() {
			const history = document.querySelector('.history-table');
			const insert = document.querySelector('.info-table');
			if (history.style.display === 'none') {
				return;
			} else {
				const uList = document.querySelectorAll('.logItem');
				history.style.display = 'none';
				insert.style.display = 'block';
				uList.forEach(el => {
					el.remove();
				});

			}
		};

		this.historyScreen = function() {
			const history = document.querySelector('.history-table');
			const insert = document.querySelector('.info-table');
			if (insert.style.display === 'none') {
				const uList = document.querySelector('.logs');
				return;
			} else {
				history.style.display = 'block';
				insert.style.display = 'none';
				t.historyDOM(history);
			}
		};

		this.historyDOM = function(cont) {
			//console.log(match.playerData);
			const uList = document.querySelector('.logs');
			match.getData().then(response => {
				for (times in match.playerData['ScoresData']) {
					console.log(response);
					const logs = document.createElement('li');
					logs.classList.add('logItem');
					logs.id = match.playerData['ScoresData'][times]['1']['name'];
					logs.innerHTML = match.playerData['ScoresData'][times]['1']['name'];
					logs.addEventListener('click', t.playerDetails);
					uList.appendChild(logs);
					//console.log(1);
				}
			});
		};

		this.playerDetails = function(event) {
			 //console.log(2);
			//console.log(event);
			const body = document.querySelector('body');

			const modal = document.createElement('modal');
			modal.classList.add('modal');

			const xButton = document.createElement('button');
			xButton.classList.add('back');
			xButton.addEventListener('click', t.quitModal);
			modal.appendChild(xButton);

			const inside = document.createElement('div');
			inside.classList.add('inside');



				const uList = document.createElement('ul');
				uList.classList.add('infoUlist');
				uList.insertAdjacentHTML('afterbegin', '<span class="tableTitle">' + event.target.id + '</span>');
				inside.appendChild(uList);
				let resultsArray = [];
				let item = 1;
				const titles = ['Teams', 'Full-Time', 'Extra-Time', 'Penalties', 'Match-Date', 'Guessed-Winner', 'Given-Points'];
				for (goes in match.playerData.ScoresData[event.target.id]) {

					const current = match.playerData.ScoresData[event.target.id][goes]['current'];
					const goalsFullTime = match.playerData.ScoresData[event.target.id][goes]['goalsMain'];
					const goalsAdded = match.playerData.ScoresData[event.target.id][goes]['goalsAdded'];
					const penalties = match.playerData.ScoresData[event.target.id][goes]['penalties'];
					const time = match.playerData.ScoresData[event.target.id][goes]['time'];
					const winner = match.playerData.ScoresData[event.target.id][goes]['winner'];
					const points = match.playerData.ScoresData[event.target.id][goes]['points'];
					const font = match.playerData.ScoresData[event.target.id][goes]['font'];
					const seperateCurrent = current[0] + " - " + current[1];
					const newFullTime = [];
					const newAdded = [];
					console.log(goes);
					for(goals in goalsFullTime) {
						newFullTime.push(goalsFullTime[goals])
					}
					for(goals in goalsAdded) {
						//console.log(goals);
						//console.log(goalsAdded);
						newAdded.push(goalsAdded[goals]);
					}
					const separateFullTime = newFullTime[0] + " - " + newFullTime[1];
					const separateAdded = newAdded[0] + " - " + newAdded[1];

					resultsArray = [seperateCurrent, separateFullTime, separateAdded, penalties, time, winner, points];

					//console.log(resultsArray);

					let objectLength = Object.keys(match.playerData.ScoresData[event.target.id][goes]);
					const list = document.createElement('li');
					let idInsert;
					//console.log(document.getElementById("1"));
					console.log(match.playerData.ScoresData[event.target.id][goes].font);

					console.log(match.playerData.ScoresData[event.target.id][goes].status === 'finished');


					const ulList = document.createElement('li');
					ulList.classList.add('infoListItemTitles');

					//console.log(objectLength.length);
					list.classList.add('infoListItem');
					if (match.playerData.ScoresData[event.target.id][goes].status === 'finished') {
						if (match.playerData.ScoresData[event.target.id][goes].points == 3) {
							list.setAttribute('green', '');
							//console.log('green');
						}
						if (match.playerData.ScoresData[event.target.id][goes].points == 1) {
							list.setAttribute('orange', '');
							//console.log('orange');
						}
						if (match.playerData.ScoresData[event.target.id][goes].points == 0) {
							list.setAttribute('red', '');
							//console.log('red');
						}
					};

					for(let i = 6; i >= 0; i--) {
						const key = objectLength[i];
						ulList.insertAdjacentHTML('afterbegin', '<li class="playerDataTitlesCont"><span class="playerDataTitles">' + titles[i] + '</span></li>');
						//list.innerHTML = match.playerData.ScoresData[event.target.id][goes][key];
						list.insertAdjacentHTML('afterbegin', '<li class="playerDataCont"> \
							<span class="playerData">' + resultsArray[i] + '</span></li>');
						uList.insertBefore(list, uList.childNodes[1]);
						uList.insertBefore(ulList, uList.childNodes[1]);
						//uList.appendChild(ulList);
						//uList.appendChild(list);
						//console.log(t.winner);

					}


				}



			modal.appendChild(inside);

			body.appendChild(modal);




		};

		this.quitModal = function() {
			const remove = document.querySelector('.modal');
			remove.parentElement.removeChild(remove);
		};

		this.addDOM = function() {

		};

		this.changeClass = function() {
			const winner = document.querySelector('#first');
			const loser = document.querySelector('#second');
			const inputF = document.querySelector('#fullFirst');
			const inputS = document.querySelector('#fullSecond');
			const inputFAdded = document.querySelector('#addedFirst');
			const inputSAdded = document.querySelector('#addedSecond');
			const inputFPenalties = document.querySelector('#penalties');
			const valueF = inputF.value.split('number:')[1];
			const valueS = inputS.value.split('number:')[1];
			const valueFAdded = inputFAdded.value.split('number:')[1];
			const valueSAdded = inputSAdded.value.split('number:')[1];
			const valuePenalties = inputFPenalties.value.split('string:')[1];
			//console.log(inputFPenalties.value);
			let arrValues = [];
			let arrNum = [];

				if (t.test.goalsMain != undefined) {
					const arr = Object.keys(t.test.goalsMain);
					const arrAdded = Object.keys(t.test.goalsAdded);
					//console.log(valuePenalties);
					if(arr.length === 2 || arrAdded === 2) {
						if (arrAdded.length === 2) {
							arrNum = arrAdded;
							arrValues = [valueFAdded, valueSAdded];
							//console.log(arr);
						} else {
							arrValues = [valueF, valueS];
							//console.log(arr);
							arrNum = arr;
						}
						//console.log(arrValues);
						//console.log(arrNum);
						if(arrValues[0] === arrValues[1]) {
							loser.removeAttribute('winner', '');
							winner.removeAttribute('winner', '');
							if (valuePenalties != undefined && valuePenalties != null) {
								if (arrNum[0] === valuePenalties) {
									winner.setAttribute('winner', '');
									t.test.winner = arrNum[0];
								} else if (arrNum[1] === valuePenalties) {
									loser.setAttribute('winner', '');
									t.test.winner = arrNum[1];
								}
							}
						}
						if(JSON.parse(arrValues[0]) > JSON.parse(arrValues[1])) {
								loser.removeAttribute('winner', '');
								winner.removeAttribute('loser', '');
								winner.setAttribute('winner', '');
								t.test.winner = arrNum[0];
							//console.log(t.test.winner);
							//console.log("firstt");
							return true;
						}
						if (JSON.parse(arrValues[0]) < JSON.parse(arrValues[1])) {
								winner.removeAttribute('winner', '');
								loser.removeAttribute('loser', '');
								loser.setAttribute('winner', '');
								t.test.winner = arrNum[1];
							//console.log(t.test.winner);
							//console.log("firstt");
							return true;
						}
					}
				}
		};
	}]);