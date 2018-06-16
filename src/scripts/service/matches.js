angular.module('worldCupScoresApp')
	.service('matchesStore', function() {
		const t = this;
		const header = new Headers({
			'X-Auth-Token': '80c6fdd4a03948d7a56a6fe6d94b29a2',
		});
    	this.general = new Map();
    	this.table = {};
        this.matches = new Map();
        this.results = [];
        this.scores = [];
        this.resul = [];
        this.playerData = {
            ScoresData: {

            },

            General: {

            }
        };

    	this.promiseCheck =
    		fetch('http://api.football-data.org/v1/competitions/467', {
	      		headers: header,
		    })
		    .then(response => {
		      return response.json();
		    })
		    .then(frontData => {
		    	const promise = Promise.resolve(frontData._links);
	      		t.general.set("generalData", frontData);
	      		return frontData;
		    });

    	this.getFixtures = function(data) {
    		//console.log(data);
    		return this.matchTables = fetch(data.leagueTable.href, {
    			headers: header,
    		})
    		.then(response => {
    			return response.json();
    		})
    		.then(tables => {
    			const objAD = {};
    			const objEH = {};
    			//console.log(tables.standings.A);
    			for(let i = 65; i < 69; i++) {
    				objAD[String.fromCharCode(i)] = tables.standings[String.fromCharCode(i)];
    				t.table.standingsAD = objAD;
    			}
    			for(let i = 69; i < 73; i++) {
    				objEH[String.fromCharCode(i)] = tables.standings[String.fromCharCode(i)];
    				t.table.standingsEH = objEH;
    			}
    			return tables;
    		});
    	};

        this.getTimes = function(data) {
            return this.matchTimes = fetch("http://api.football-data.org/v1/competitions/467", {
                headers: header,
            })
            .then(response => {
                return response.json();
            })
            .then(times => {
                return times;
            })
        }
        this.getMatches = function(data) {
            return this.matchTimes = fetch(data.fixtures.href, {
                headers: header,
            })
            .then(response => {
                return response.json();
            })
            .then(times => {
                //console.log(times);
                for(let i = 0; i < times.fixtures.length; i++) {
                    let teamA = times.fixtures[i].awayTeamName;
                    let teamH = times.fixtures[i].homeTeamName;
                    //console.log(times.fixtures);

                    let matchd = times.fixtures[i].matchday;

                    let day = times.fixtures[i].date;

                    let aFlag;
                    let hFlag;

                    let tempA;
                    let tempH;

                    let tempExtraA;
                    let tempExtraH;

                    let penaltiesA;
                    let penaltiesH;

                    if(times.fixtures[i].result.extraTime != undefined && times.fixtures[i].result.extraTime != null) {
                        tempExtraA = times.fixtures[i].result.extraTime.goalsAwayTeam;
                        tempExtraH = times.fixtures[i].result.extraTime.goalsHomeTeam;
                    } else {
                        tempExtraA = '';
                        tempExtraH = '';
                    }

                    if(times.fixtures[i].result.penaltyShootout != undefined && times.fixtures[i].result.penaltyShootout != null) {
                        penaltiesA = times.fixtures[i].result.penaltyShootout.goalsAwayTeam;
                        penaltiesH = times.fixtures[i].result.penaltyShootout.goalsHomeTeam;
                    } else {
                        penaltiesA = '';
                        penaltiesH = '';
                    }

                    if(times.fixtures[i].result.goalsHomeTeam != undefined && times.fixtures[i].result.goalsHomeTeam != null || times.fixtures[i].result.goalsAwayTeam != undefined && times.fixtures[i].result.goalsAwayTeam != null) {
                        tempA = times.fixtures[i].result.goalsAwayTeam;
                        tempH = times.fixtures[i].result.goalsHomeTeam;
                    } else {
                        tempA = '';
                        tempH = '';
                    }

                    if (aFlag === undefined || aFlag === null) {
                        aFlag = 'https://images-na.ssl-images-amazon.com/images/I/41HPFwV%2BdYL._SY355_.jpg';
                    }
                    if (hFlag === undefined || hFlag === null) {
                        hFlag = 'https://images-na.ssl-images-amazon.com/images/I/41HPFwV%2BdYL._SY355_.jpg';
                    }

                    //console.log(times.fixtures[i]);
                    const obj = {
                        fullTime: {
                            teamA : [teamA, tempA],
                            teamH : [teamH, tempH],
                        },
                        extraTime: {
                            teamA : [teamA, tempExtraA],
                            teamH : [teamH, tempExtraH],
                        },
                        penaltyShootout: {
                            teamA: [teamA, penaltiesA],
                            teamH: [teamH, penaltiesH],
                        },
                    };
                    const o = {
                        scores: {
                            teamA : [teamA, tempA, tempExtraA, penaltiesA, aFlag],
                            teamH : [teamH, tempH, tempExtraH, penaltiesH, hFlag],
                        },
                        matchday: matchd,
                        date: day,
                    };
                    t.results.push(obj);
                    t.resul.push(o);
                    //console.log(t.resul);
                    const name = times.fixtures[i].awayTeamName + " - " + times.fixtures[i].homeTeamName;
                    t.matches.set(name, obj);
                }
                return times;
            })
        };

        this.insertData = function(data, cont, nam) {
            const arr = t.playerData.General.names;
            if(arr != undefined && arr != null) {
                arr.push(nam);
            } else {
                t.playerData.General.names = [];
                const ar = t.playerData.General.names;
                ar.push(nam);
                t.playerData.General.names = ar;
            }
            if (data.ScoresData[cont.name] != undefined) {
                    const pastNumber = t.playerData.ScoresData[cont.name];
                    const key = Object.keys(pastNumber);
                    const length = (key.length) - 1;
                    const number = JSON.parse(key[length]) + 1;
                    //console.log(length);
                    //console.log(number);
                    //console.log(key);
                    t.playerData.ScoresData[cont.name][number] = cont;
            } else {
                t.playerData.ScoresData[cont.name] = {}
                //console.log(t.playerData);
                t.playerData.ScoresData[cont.name]['1'] = cont;
            }
            const newData = JSON.stringify(t.playerData);
            jQuery.post('/src/scripts/php/insert.php', {
                newData: newData
            }, function(response){
                //console.log(response);
                // response could contain the url of the newly saved file
            });
        };
        this.insertPoints = function(key, value, font, tes) {
            //console.log(tes);
            if (key.accurate === undefined) {
                key.accurate = 0;
                key.accurate = tes.accurate;
            } else {
                key.accurate = tes.accurate;
            }

            //console.log(t.playerData);
            key.points = value;
            key.status = font;
            const newData = JSON.stringify(t.playerData);
            jQuery.post('/src/scripts/php/insert.php', {
                newData: newData
            }, function(response){
                //console.log(response);
                // response could contain the url of the newly saved file
            });
            //console.log(key);
        };

        this.insertNames = function(nam) {

        };
        this.getData = function() {
            return fetch("/src/scripts/data/data.json").then(response => {
                //console.log(response);
                return response.json();
            }).then(data => {
                t.playerData.ScoresData = data.ScoresData;
                t.playerData.General = data.General;
                //console.log(t.playerData);
                return Promise.resolve(data);
                console.log(t.playerData);
                console.log(data);
                console.log(data);
            });
        };
                this.getData();

        this.fileCheck = function(check) {
            //console.log(`The file is ${check}`);
        };
	});