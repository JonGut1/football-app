angular.module('worldCupScoresApp')
	.service('dataStore', function() {
		const t = this;
        this.fetchedMatches = false;
        this.fetchedResults = false;

        this.cachedPlayerData = null;

        this.results = {
            "results": {},
        }
        this.playerScores = {
            "playerScores": {

            }
        }
        this.playerData = {
            "playerData": {

            }
        }
        this.inputNames = {
            "inputNames": {

            },
        }
        this.matchesNames = {
            "allMatches": [],
        }

        /* Header token */
		this.header = new Headers({
			'X-Auth-Token': '80c6fdd4a03948d7a56a6fe6d94b29a2',
		});
        /* Links */
        this.general = 'http://api.football-data.org/v1/competitions/467';
        this.fixtures = 'http://api.football-data.org/v1/competitions/467/fixtures';
        this.leageTables = 'http://api.football-data.org/v1/competitions/467/leagueTable';
        this.self = 'http://api.football-data.org/v1/competitions/467';
        this.teams = 'http://api.football-data.org/v1/competitions/467/teams';

        fetch('/scripts/data/allMatches.json').then(response => {
            console.log(response);
            return response.json
        }).then(result => {
            console.log(result);
        })

        /* fetches fixtures */
    	this.fetchAllMatches = () => {
    		fetch(t.fixtures, {
	      		headers: t.header,
		    })
		    .then(response => {
		      return response.json();
		    })
		    .then(frontData => {
                console.log(Object.keys(this.results.results).length);
                t.insertMatches(frontData.fixtures);
                t.insertResults(frontData.fixtures);
		    	console.log(frontData);
		    }).then(i => {
                t.compareGuesses(null);
            });
        }
        t.fetchAllMatches();

        /* insert all matches into a json file */
        this.insertMatches = (data) => {
            t.checkChange('matches', data).then(item => {
                if (item === true) {
                    data.forEach((item) => {
                        t.matchesNames.allMatches.push([item.awayTeamName, item.homeTeamName]);
                    });
                    console.log(t.matchesNames);
                    jQuery.post('/scripts/php/insert.php', {
                        newData: JSON.stringify(t.matchesNames),
                        checker: 'matches',
                    }, function(response){
                        t.fetchedMatches = true;
                        console.log('Matches inserted.............');
                    }).catch(err => {
                        console.log('Failed to insert matches..........');
                    });
                }
            });
        }

        /* insert results */
        this.insertResults = (data) => {
            t.checkChange('results', data).then(item => {
                if (item === true) {
                    data.forEach((item) => {
                        let fullTimeSc;
                        let extraTimeSc;
                        let penaltiesSc;
                        let outcome;
                        if (item.status === 'FINISHED') {
                            const name = `${item.awayTeamName} - ${item.homeTeamName}`
                            if (item.result.goalsAwayTeam !== undefined) {
                                if (item.result.goalsAwayTeam > item.result.goalsHomeTeam) {
                                    outcome = item.awayTeamName;
                                } else if (item.result.goalsAwayTeam < item.result.goalsHomeTeam) {
                                    outcome = item.homeTeamName;
                                } else if (item.result.goalsAwayTeam === item.result.goalsHomeTeam) {
                                    outcome = 'Draw';
                                }
                                fullTimeSc = [item.result.goalsAwayTeam, item.result.goalsHomeTeam];
                            } else {
                                fullTimeSc = ['-', '-'];
                            }
                            if (item.result.extraTime !== undefined) {
                                if (item.result.extraTime.goalsAwayTeam > item.result.extraTime.goalsHomeTeam) {
                                    outcome = item.awayTeamName;
                                } else if (item.result.extraTime.goalsAwayTeam < item.result.extraTime.goalsHomeTeam) {
                                    outcome = item.homeTeamName;
                                } else if (item.result.extraTime.goalsAwayTeam === item.result.extraTime.goalsHomeTeam) {
                                    outcome = 'Draw';
                                }
                                extraTimeSc = [item.result.extraTime.goalsAwayTeam, item.result.extraTime.goalsHomeTeam];
                            } else {
                                extraTimeSc = ['-', '-'];
                            }
                            if (item.result.penaltyShootout !== undefined) {
                                if (item.result.penaltyShootout.goalsAwayTeam > item.result.penaltyShootout.goalsHomeTeam) {
                                    penaltiesSc = item.awayTeamName;
                                    outcome = item.awayTeamName;
                                } else if (item.result.penaltyShootout.goalsAwayTeam < item.result.penaltyShootout.goalsHomeTeam) {
                                    penaltiesSc = item.homeTeamName;
                                    outcome = item.homeTeamName;
                                }
                            } else {
                                penaltiesSc = '-';
                            }

                            t.results.results[name] = {
                                fullTime: fullTimeSc,
                                extraTime: extraTimeSc,
                                penalties: penaltiesSc,
                                outcome: outcome,
                            };
                        }
                    });
                    jQuery.post('/scripts/php/insert.php', {
                        newData: JSON.stringify(t.results),
                        checker: 'results',
                    }, function(response){
                        fetchedResults = true;
                        console.log('Results inserted................');
                    }).catch(err => {
                        console.log('Failed to insert results.............');
                    });
                }
            });
        }

        /* evaluates whether the guesses were correct */
        this.compareGuesses = (data) => {
            if (data) {
                const da = {};
                da.playerData = {};
                da.playerData[data.name] = [];
                da.playerData[data.name].push(data);
                t.evaluateData(da, null);
                return data;
            }

            t.fetchPlayerData().then(item => {
                t.evaluateData(item, true);
            });
        }

        this.evaluateData = (data, action) => {
            let accurateAll = 0;
            let pointsAll = 0;
            console.log(data);
            for (datas in data.playerData) {
                data.playerData[datas].forEach(inst => {
                    const match = `${inst.match[0]} - ${inst.match[1]}`;
                    console.log(this.results.results[match]);
                    console.log(inst);
                    if (inst.status === 'PENDING' && this.results.results[match]) {
                        inst.outcome = this.results.results[match].outcome;
                        if (t.checkOutcomes(inst, 'fullTime') === 'Stop') {
                            return;
                        } else if (t.checkOutcomes(inst, 'fullTime') === 'Accurate') {
                            inst.points += 3;
                            inst.color = 'green';
                            if (t.checkOutcomes(inst, 'extraTime') === 'Inaccurate') {
                                inst.color = 'orange';
                            } else if (t.checkOutcomes(inst, 'extraTime') === 'Semi Accurate') {
                                inst.points += 1;
                                inst.color = 'yellow';
                                if (t.checkOutcomes(inst, 'penalties') === 'Accurate') {
                                    inst.points += 1;
                                    inst.color = 'yellow';
                                } else if (t.checkOutcomes(inst, 'penalties') === 'Inaccurate') {
                                    inst.color = 'orange';
                                }
                            } else if (t.checkOutcomes(inst, 'extraTime') === 'Accurate') {
                                inst.points += 3;
                                inst.color = 'green';
                                if (t.checkOutcomes(inst, 'penalties') === 'Accurate') {
                                    inst.points += 1;
                                    inst.color = 'green';
                                } else if (t.checkOutcomes(inst, 'penalties') === 'Inaccurate') {
                                    inst.color = 'orange';
                                }
                            }
                        } else if (t.checkOutcomes(inst, 'fullTime') === 'Semi Accurate') {
                            inst.points += 1;
                            inst.color = 'yellow';
                            if (t.checkOutcomes(inst, 'extraTime') === 'Inaccurate') {
                                inst.color = 'orange';
                            } else if (t.checkOutcomes(inst, 'extraTime') === 'Semi Accurate') {
                                inst.points += 1;
                                inst.color = 'yellow';
                                if (t.checkOutcomes(inst, 'penalties') === 'Accurate') {
                                    inst.points += 1;
                                    inst.color = 'yellow';
                                } else if (t.checkOutcomes(inst, 'penalties') === 'Inaccurate') {
                                    inst.color = 'orange';
                                }
                            } else if (t.checkOutcomes(inst, 'extraTime') === 'Accurate') {
                                inst.points += 3;
                                inst.color = 'yellow';
                                if (t.checkOutcomes(inst, 'penalties') === 'Accurate') {
                                    inst.points += 1;
                                    inst.color = 'yellow';
                                } else if (t.checkOutcomes(inst, 'penalties') === 'Inaccurate') {
                                    console.log('penalties............');
                                    inst.color = 'orange';
                                }
                            }
                        } else if (t.checkOutcomes(inst, 'fullTime') === 'Inaccurate') {
                            inst.color = 'red';
                        }
                        inst.status = 'FINISHED';
                    }
                });
            }
            this.playerData.playerData = data.playerData;
            console.log(data.playerData);
            console.log(this.results);
            if (action) {
                console.log(data);
                t.insertEvaluatedPlayerData(this.playerData);
            }
        }

        /* evaluate the resulta based on fulltime extratime and penalties */
        this.checkOutcomes = (inst, type) => {
            const match = `${inst.match[0]} - ${inst.match[1]}`;
            if (type === 'penalties') {
                if (this.results.results[match][type] === '-') {
                    return 'Stop';
                }
                else if (this.results.results[match][type] === inst[type]) {
                    return 'Accurate';
                } else if (this.results.results[match][type] !== inst[type]) {
                    return 'Inaccurate';
                }
            }
            if (this.results.results[match][type][0] === '-') {
                return 'Stop';
            } else if (angular.equals(this.results.results[match][type], inst[type])) {
                return 'Accurate';
            } else if (this.results.results[match][type][0] > this.results.results[match][type][1] && inst[type][0] > inst[type][1] || this.results.results[match][type][0] < this.results.results[match][type][1] && inst[type][0] < inst[type][1] || this.results.results[match][type][0] === this.results.results[match][type][1] && inst[type][0] === inst[type][1]) {
                return 'Semi Accurate';
            } else {
                return 'Inaccurate';
            }
        }

        /* check whether there are changes between the database and an api fetch */
        this.checkChange = (eval, data) => {
            if (eval === 'matches') {
                return fetch('/scripts/data/allMatches.json')
                .then((response) => response.json())
                .then((obj) => {
                    for (let i = 0; i < data.length; i++) {
                        if (obj[i] === undefined || obj[i].awayTeamName === undefined) {
                            return true;
                        }
                        if (obj[i].awayTeamName !== data[i].awayTeamName) {
                            return true;
                        }
                        if (obj[i].homeTeamName !== data[i].homeTeamName) {
                            return true;
                        }
                    }
                    fetchedMatches = true;
                });
            }

            if (eval === 'results') {
                return fetch('/scripts/data/results.json')
                .then((response) => response.json())
                .then((obj) => {
                    console.log(obj);
                    for (let i = 0; i < data.length; i++) {
                        if (obj[i] === undefined || obj[i].goalsAwayTeam === undefined) {
                            return true;
                        }
                        if (obj[i].goalsAwayTeam !== data[i].goalsTeamName) {
                            return true;
                        }
                        if (obj[i].goalsHomeTeam !== data[i].goalsHomeTeam) {
                            return true;
                        }
                    }
                    fetchedResults = true;
                });
            }
        }

        /* insert calculated score */
        this.insertPlayerScore = (data) => {

        }

        /* inserts player data */
        this.insertPlayerData = (data) => {
            const dat = t.compareGuesses(data);
            t.fetchPlayerData().then(items => {

                if (items.playerData[dat.name] === undefined || items.playerData[dat.name].length < 1) {
                    items.playerData[dat.name] = [];
                }
                items.playerData[dat.name].push(dat);

                jQuery.post('/scripts/php/insert.php', {
                newData: JSON.stringify(items),
                checker: 'playerData',
                }, function(response){
                    console.log('Player data inserted.............');
                }).catch(err => {
                    console.log(err, 'Failed to insert player data..............');
                });
            });

        };

        /* inserts evaluated player data */
        this.insertEvaluatedPlayerData = (data) => {
            t.fetchPlayerData().then(items => {

                jQuery.post('/scripts/php/insert.php', {
                newData: JSON.stringify(data),
                checker: 'playerData',
                }, function(response){
                    console.log('Player data inserted.............');
                }).catch(err => {
                    console.log(err, 'Failed to insert player data..............');
                });
            });

        };

        /* removes player data */
        this.removePlayerData = (name, ids, all) => {
            const idName = `#${ids}`;
            return t.fetchPlayerData().then(data => {
                if (all) {
                    if (data.playerData[name][0].id === ids) {
                        delete data.playerData[name]
                        t.insertEvaluatedPlayerData(data);
                        console.log('Player data deleted.........');
                        return data;
                    }
                }
                if (data.playerData[name].length <= 1) {
                    console.log(123131231312);
                    data.playerData[name].splice(0, 1);
                    delete data.playerData[name]
                    t.insertEvaluatedPlayerData(data);
                    console.log('Player data deleted.........');
                    return data;
                }
                for (let i = 0; i < data.playerData[name].length; i++) {
                    if (data.playerData[name][i].id === ids) {
                            data.playerData[name].splice(i, 1);
                            t.insertEvaluatedPlayerData(data);
                            console.log('Player data deleted.........');
                            return data;
                    }
                }
            });
        }

        /* fetch player data */
        this.fetchPlayerData = () => {
            return fetch('/scripts/data/playerData.json')
            .then(response => response.json())
            .then(items => {
                console.log('fetching player data');
                this.cachedPlayerData = items;
                this.leaderboardSort(items);
                return items;
            });
        };

        /* sort the places of players based on there score */
        this.leaderboardSort = (data) => {

        }

        /* insert input name */
        this.insertInputNames = (data) => {
            t.fetchInputNames().then(items => {
                if (items.inputNames.includes(data)) {
                    return;
                }
                items.inputNames.push(data);
                jQuery.post('/scripts/php/insert.php', {
                newData: JSON.stringify(items),
                checker: 'inputNames',
                }, function(response){
                    console.log('Input names inserted..............');
                }).catch(err => {
                    console.log(err, 'Failed to insert input names.............');
                });
            });
        };

        /* fetch input names */
        this.fetchInputNames = () => {
            return fetch('/scripts/data/inputNames.json')
            .then(response => response.json())
            .then(items => items);
        };

        this.cacheData = (data) => {

        }
	});