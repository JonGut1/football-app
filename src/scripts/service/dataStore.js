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
        this.playerResults = {
            "playerResults": {

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
                console.log(response);
		      return response.json();
		    })
		    .then(frontData => {

                t.insertMatches(frontData.fixtures);
                t.insertResults(frontData.fixtures);
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
                t.evaluateData(da, null).then(response => {
                    t.sortScores(this.playerScores)
                }).catch(err => {
                    console.log('Empty database........');
                });
                return data;
            }

            t.fetchPlayerData().then(item => {
                t.evaluateData(item, true).then(response => {
                    t.sortScores(this.playerScores);
                }).catch(err => {
                    console.log('Empty database........');
                });
            });
        }

        this.evaluateData = (data, action) => {
            return new Promise((resolve, reject) => {
                const scores = {};
                for (datas in data.playerData) {
                    data.playerData[datas].forEach(inst => {
                        const match = `${inst.match[0]} - ${inst.match[1]}`;

                        if (inst.status === 'PENDING' && this.results.results[match]) {
                            inst.outcome = this.results.results[match].outcome;
                            if (t.checkOutcomes(inst, 'fullTime') === 'Stop') {
                                return;
                            } else if (t.checkOutcomes(inst, 'fullTime') === 'Accurate') {
                                inst.accurate = 1;
                                inst.points += 3;
                                inst.color = 'green';
                                if (t.checkOutcomes(inst, 'extraTime') === 'Stop') {
                                    inst.accurate = 1;
                                } else if (t.checkOutcomes(inst, 'extraTime') === 'Inaccurate') {
                                    inst.accurate = 0;
                                    inst.color = 'orange';
                                } else if (t.checkOutcomes(inst, 'extraTime') === 'Semi Accurate') {
                                    inst.accurate = 0;
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
                                    inst.accurate = 1;
                                    inst.color = 'green';
                                    if (t.checkOutcomes(inst, 'penalties') === 'Accurate') {
                                        inst.points += 1;
                                        inst.accurate = 1;
                                        inst.color = 'green';
                                    } else if (t.checkOutcomes(inst, 'penalties') === 'Inaccurate') {
                                        inst.accurate = 0;
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
                                        inst.color = 'orange';
                                    }
                                }
                            } else if (t.checkOutcomes(inst, 'fullTime') === 'Inaccurate') {
                                inst.color = 'red';
                            }
                            inst.status = 'FINISHED';
                        }
                        t.sumScores(inst);
                    });
                }

                this.playerData.playerData = data.playerData;
                if (action) {
                    t.insertEvaluatedPlayerData(this.playerData);
                }
                if (Object.keys(this.playerData.playerData).length === 0) {
                    reject();
                }
                resolve('Evaluated');
            });
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
                return items;
            });
        };

        /* sort the places of players based on there score */
        this.sumScores = (inst) => {
            if (this.playerScores.playerScores[inst.name] === undefined) {
                this.playerScores.playerScores[inst.name] = {};
                this.playerScores.playerScores[inst.name].place = '';
                this.playerScores.playerScores[inst.name].name = inst.name;
                this.playerScores.playerScores[inst.name].points = inst.points;
                this.playerScores.playerScores[inst.name].accurate = inst.accurate;
            } else {
                this.playerScores.playerScores[inst.name].points += inst.points;
                this.playerScores.playerScores[inst.name].accurate += inst.accurate;
            }
            console.log('Sumed the scores.........');
        }

        /* sorts the scores into the correct rankings */
        this.sortScores = (data) => {
            const scores = {
                equals: {},
                biggest: {},
                biggestArr: [],
                equalsArr: [],
                biggestArrSorted: [],
                final: {},
            }

            for (names in data.playerScores) {
                if (scores.biggest[data.playerScores[names].points] === undefined) {
                    scores.biggest[data.playerScores[names].points] = {};
                    scores.biggestArr.push(data.playerScores[names].points);
                    scores.biggest[data.playerScores[names].points][names] = data.playerScores[names];
                } else {
                    scores.biggest[data.playerScores[names].points][names] = data.playerScores[names];
                }
            }


            t.getMaxNum(scores).then(response => {
                this.playerResults.playerResults = response;
                t.insertPlayerResults(response);
            });

        }

        this.insertPlayerResults = (data) => {
            const ins = {};
            ins.playerResults = data;
            jQuery.post('/scripts/php/insert.php', {
                newData: JSON.stringify(ins),
                checker: 'playerResults',
            }, function(response){
                console.log('Player results inserted.............');
            }).catch(err => {
                console.log(err, 'Failed to insert player results..............');
            });
        }

        this.getMaxNum = (data) => {
            return new Promise((resolve) => {
                let count = 0;
                const final = [];
                const int = setInterval(() => {
                    const max = Math.max(...data.biggestArr);
                    if (data.biggestArrSorted.indexOf(max) === -1) {
                        if (Object.keys(data.biggest[max]).length > 1) {
                            const acc = [];
                            const accCopy = [];
                            const nam = {};
                            for (keys in data.biggest[max]) {
                                const num = data.biggest[max][keys].points + data.biggest[max][keys].points;
                                if (nam[num] === undefined) {
                                    nam[num] = {};
                                    nam[num][keys] = data.biggest[max][keys];
                                } else {
                                    nam[num][keys] = data.biggest[max][keys];
                                }
                                if (acc.indexOf(num === -1)) {
                                    acc.push(num);
                                    accCopy.push(num);
                                }
                            }
                            for (key in nam) {
                                let pla;
                                const maxEquals = Math.max(...acc);
                                for (ke in nam[maxEquals]) {
                                    let placeNaming = '';
                                    let placeNaming2 = '';
                                    pla = (count + Object.keys(nam[maxEquals]).length);
                                        if (count + 1 === 1) {
                                            placeNaming = 'st';
                                        } else if (count + 1 === 2) {
                                            placeNaming = 'nd';
                                        } else if (count + 1 === 3) {
                                            placeNaming = 'rd';
                                        } else {
                                            placeNaming = 'th';
                                        }

                                        if (pla === 1) {
                                            placeNaming2 = 'st';
                                        } else if (pla === 2) {
                                            placeNaming2 = 'nd';
                                        } else if (pla === 3) {
                                            placeNaming2 = 'rd';
                                        } else {
                                            placeNaming2 = 'th';
                                        }

                                        nam[maxEquals][ke].place = `${count + 1}${placeNaming} - ${pla}${placeNaming2}`;

                                    const obj = {
                                        [ke]: nam[maxEquals][ke],
                                    }

                                    final.push(obj);
                                }
                                count += (pla - 1);
                                const index = acc.indexOf(max);
                                acc.splice(index, 1);

                            }

                        } else {
                            let placeNaming = '';
                            count++
                            if (count === 1) {
                                placeNaming = 'st';
                            } else if (count === 2) {
                                placeNaming = 'nd';
                            } else if (count === 3) {
                                placeNaming = 'rd';
                            } else {
                                placeNaming = 'th';
                            }
                            data.biggest[max][Object.keys(data.biggest[max])].place = `${count}${placeNaming}`;
                            final.push(data.biggest[max]);
                            data.biggestArrSorted.push(max);
                        }

                    }
                    const index = data.biggestArr.indexOf(max);
                    data.biggestArr.splice(index, 1);
                        if (data.biggestArr.length === 0) {
                            clearInterval(int);
                            resolve(final);
                        }
                },100);
            });

        }

        /* insert calculated scores into the database */
        this.insertPlayerScores = () => {

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

        /* fetch player results */
        this.fetchPlayerResults = () => {
            return fetch('/scripts/data/playerResults.json')
            .then(response => response.json())
            .then(items => items);
        };

        this.cacheData = (data) => {

        }
	});