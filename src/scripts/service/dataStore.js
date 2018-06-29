angular.module('worldCupScoresApp')
	.service('dataStore', function() {
		const t = this;
        this.fetchedMatches = false;
        this.fetchedResults = false;

        this.results = {
            "results": {},
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

        /* fetches fixtures */
    	this.fetchAllMatches = () => {
    		fetch(t.fixtures, {
	      		headers: t.header,
		    })
		    .then(response => {
		      return response.json();
		    })
		    .then(frontData => {
                t.insertMatches(frontData.fixtures);
                t.insertResults(frontData.fixtures);
		    	console.log(frontData);
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
                    jQuery.post('/src/scripts/php/insert.php', {
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
                    jQuery.post('/src/scripts/php/insert.php', {
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

        /* check whether there are changes between the database and an api fetch */
        this.checkChange = (eval, data) => {
            if (eval === 'matches') {
                return fetch('/src/scripts/data/allMatches.json')
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
                return fetch('/src/scripts/data/results.json')
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

        /* inserts player data */
        this.insertPlayerData = (data) => {
            t.fetchPlayerData().then(items => {
                items.playerData[data.name] = data;
                jQuery.post('/src/scripts/php/insert.php', {
                newData: JSON.stringify(items),
                checker: 'playerData',
                }, function(response){
                    console.log('Player data inserted.............');
                }).catch(err => {
                    console.log(err, 'Failed to insert player data..............');
                });
            });

        };

        /* fetch player data */
        this.fetchPlayerData = () => {
            return fetch('/src/scripts/data/playerData.json')
            .then(response => response.json())
            .then(items => items);
        };

        /* insert input name */
        this.insertInputNames = (data) => {
            t.fetchInputNames().then(items => {
                if (items.inputNames.includes(data)) {
                    return;
                }
                items.inputNames.push(data);
                jQuery.post('/src/scripts/php/insert.php', {
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
            return fetch('/src/scripts/data/inputNames.json')
            .then(response => response.json())
            .then(items => items);
        };
	});