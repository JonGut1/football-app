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
                t.compareGuesses();
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
                        if (item.status === 'FINISHED') {
                            const name = `${item.awayTeamName} - ${item.homeTeamName}`
                            if (item.result.goalsAwayTeam !== undefined) {
                                fullTimeSc = [item.result.goalsAwayTeam, item.result.goalsHomeTeam];
                            } else {
                                fullTimeSc = ['-', '-'];
                            }
                            if (item.result.extraTime !== undefined) {
                                extraTimeSc = [item.result.extraTime.goalsAwayTeam, item.result.extraTime.goalsHomeTeam];
                            } else {
                                extraTimeSc = ['-', '-'];
                            }
                            if (item.result.penaltyShootout !== undefined) {
                                penaltiesSc = [item.result.penaltyShootout.goalsAwayTeam, item.result.penaltyShootout.goalsHomeTeam];
                            } else {
                                penaltiesSc = ['-', '-'];
                            }

                            t.results.results[name] = {
                                fullTime: fullTimeSc,
                                extraTime: extraTimeSc,
                                penalties: penaltiesSc,
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
        this.compareGuesses = () => {
            let change = null;
            t.fetchPlayerData().then(item => {
                let accurateAll = 0;
                let pointsAll = 0;
                for (items in item.playerData) {
                    console.log(item);
                    item.playerData[items].forEach(inst => {
                        console.log(inst);
                        const match = `${inst.match[0]} - ${inst.match[1]}`;
                        console.log(angular.equals(this.results.results[match].fullTime, inst.fullTime));
                        if (angular.equals(this.results.results[match].fullTime, inst.fullTime)) {
                            if (this.results.results[match].extraTime[0] === '-' && inst.extraTime === '-') {
                                accurateAll++;
                                pointsAll += 3;
                                inst.accurate = 1;
                                inst.points = 3;
                                change = true;
                            }
                        }
                    });
                }
                this.playerData.playerData = item.playerData;
                console.log(item.playerData);
                console.log(this.results);
                if (change) {
                    console.log(item);
                    t.insertEvaluatedPlayerData(this.playerData);
                }
            });

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
            t.fetchPlayerData().then(items => {

                if (items.playerData[data.name] === undefined || items.playerData[data.name].length < 1) {
                    items.playerData[data.name] = [];
                }
                items.playerData[data.name].push(data);

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
        this.removePlayerData = (name, ids) => {
            const idName = `#${ids}`;
            return t.fetchPlayerData().then(data => {
                console.log(data.playerData[name]);
                for (let i = 0; i < data.playerData[name].length; i++) {
                    if (data.playerData[name][i].id === ids) {
                        if (data.playerData[name].length <= 1) {
                            delete data.playerData[name]
                            t.insertEvaluatedPlayerData(data);
                            const rem = angular.element(document.querySelector(idName));
                            const remIcon = angular.element(document.querySelector(name));
                            console.log(rem);
                            rem.remove();
                            remIcon.remove();
                            return 'go back';
                        } else {
                            data.playerData[name].splice(i, 1);
                            t.insertEvaluatedPlayerData(data);
                            const rem = angular.element(document.querySelector(idName));
                            rem.remove();
                        }
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
                return items;
            });
        };

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