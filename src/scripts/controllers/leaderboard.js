angular.module('worldCupScoresApp')
  .controller('LeaderBoardCtrl', ['matchesStore', '$scope', function(match, $scope) {
  	const t = this;
  	this.points = [];
  	this.suming = {

  	};
  	match.promiseCheck.then(response => {
  		console.log(match.playerData);
  		for (key in match.playerData.ScoresData) {
  			//console.log(key);
  			for (k in match.playerData.ScoresData[key]) {
  				//console.log(match.playerData.ScoresData[key][k]);
  				t.points.push([match.playerData.ScoresData[key][k].name, match.playerData.ScoresData[key][k].points, match.playerData.ScoresData[key][k].accurate])
  				//console.log(t.points);
  			}
  		}
  		for (let i = 0; i < t.points.length; i++) {
  			if (t.suming[t.points[i][0]] === undefined) {
  				t.suming[t.points[i][0]] = {};
  				t.suming[t.points[i][0]].points = 0;
  				t.suming[t.points[i][0]].accurate = 0;
  				t.suming[t.points[i][0]].points += t.points[i][1];
  				t.suming[t.points[i][0]].accurate += t.points[i][2];

  			} else {
  				t.suming[t.points[i][0]].points += t.points[i][1];
  				t.suming[t.points[i][0]].accurate += t.points[i][2];
  			}
  		}


  		console.log(t.suming);
  	});

  }]);