angular.module('worldCupScoresApp')
	.service('matchesStore', function() {
		//console.log(1);

		const t = this;
		const header = new Headers({
			'X-Auth-Token': '80c6fdd4a03948d7a56a6fe6d94b29a2',
		});
    	this.general = new Map();
    	this.table = {};
        this.matches = new Map();

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
    		console.log(data);
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

                for(let i = 0; i < times.fixtures.length; i++) {
                    //console.log(times.fixtures[i].awayTeamName);
                    let team1 = times.fixtures[i].awayTeamName;
                    let team2 = times.fixtures[i].homeTeamName;
                    const obj = {
                       team1 : times.fixtures[i].result.goalsAwayTeam,
                       team2 : times.fixtures[i].result.goalsHomeTeam,
                    };
                    const name = times.fixtures[i].awayTeamName + " - " + times.fixtures[i].homeTeamName;
                    t.matches.set(name, obj);
                }
                return times;
            })
        };

        this.insertData = function(data) {
            const newData = JSON.stringify(data);
            jQuery.post('/src/scripts/php/insert.php', {
                newData: newData
            }, function(response){
                console.log(response);
                // response could contain the url of the newly saved file
            });
        };
        this.getData = function() {

        };
        this.fileCheck = function(check) {
            console.log(`The file is ${check}`);
        };
	});