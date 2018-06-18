angular.module('worldCupScoresApp')
  .controller('LeaderBoardCtrl', ['matchesStore', '$scope', function(match, $scope) {
  	const t = this;
  	this.points = [];
  	this.suming = {

  	};
    this.calc = [];
    this.calcClone = [];

    this.max = [];
    this.check = [];
    this.counting = 0;
    this.positions = [];
    this.groupPositions = [];
    this.acc = [];
    this.accClone = [];
    this.accPos = [];
    this.combined = [];
    this.cou = 0;
    this.namingLead = ['Position', 'Name', 'Times-Correct', 'Points'];
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

      for (key in t.suming) {
        //console.log(t.suming[key]);
        t.calc.push([key, t.suming[key]]);
        t.calcClone.push([key, t.suming[key]]);
      }
      console.log(t.calc.length);
      console.log(t.suming);

        for (let i = 0; i < t.calc.length; i++) {
          t.max.push(t.calc[i][1].points);
          t.acc.push(t.calc[i][1].accurate);
        }




          t.checkHighest(false);


        //console.log(length);
  	});
    this.checkHighest = function(c) {
      console.log(t.calc);
      const high = t.calcClone;
      let maxNum;
        let length = t.calc.length;
        let checker = false;
        let check = true;
        let container = [];
        let i = 0;
        let a = 0;
      for (i = 0; i < length; i++) {
        //console.log(t.calc[i]);
           for (a = 0; a < length; a++) {
              if (t.calc[i] != false && t.calc[a] != false && t.calc[i] != undefined) {
                  if (t.calc[i][0] != t.calc[a][0]) {
                    if (t.calc[i][1].points > t.calc[a][1].points) {
                      //console.log(t.calc[i], t.calc[a]);
                      checker = true;
                      //console.log(t.calc[i][1], t.calc[a][1]);
                    } else {
                      //console.log(t.calc[i][1], t.calc[a][1]);
                      //console.log(t.calc[i]);
                      check = false;
                    }
                  }
              }
            }
            console.log(check, checker);
            if (check === true && checker === true) {
              console.log(t.calc[i]);
              t.positions.push(t.calc[i]);
              console.log(t.positions);
              const index = t.calc.indexOf(t.calc[i]);
              t.calc.splice(index, 1, false);
              const ind = high.indexOf(t.calc[i]);
              high.splice(ind, 1);
              i = -1;
            }
            //console.log(t.calc[i]);
            check = true;
            checker = false;
            if (high.length === 1 && t.calc[i] != false && t.calc[i] != undefined) {
              //console.log(high);
              t.positions.push(t.calc[i]);
              const index = t.calc.indexOf(t.calc[i]);
              t.calc.splice(index, 1, false);
              const ind = high.indexOf(t.calc[i]);
              high.splice(ind, 1);
            }
          }
      //console.log(t.positions);
      //console.log(t.calc[i]);
      if (high.length > 1 && c === false) {
        t.calcEqual();
      }
      check = true;
      checker = false;
      if (high.length === 0) {
        t.sort(1);
      }
    };
    this.calcEqual = function() {
      const high = t.calcClone;
      let maxNum;
        const length = t.calc.length;
        let checker;
        let check;
        let container = [];
        let i = 0;
        let a = 0;
      for (i = 0; i < length; i++) {
        //console.log(t.calc[i]);
           for (a = 0; a < length; a++) {
              if (t.calc[i] != false && t.calc[a] != false) {
                  if (t.calc[i][0] != t.calc[a][0]) {
                    if (t.calc[i][1].points === t.calc[a][1].points) {
                      if (t.calc[i][1].accurate > t.calc[a][1].accurate) {
                          checker = true;

                          console.log(t.calc[i][1], t.calc[a][1]);
                      } else {
                        check = false;
                      }
                    }
                  }
              }
            }
            if (check === true && checker === true) {
              //console.log(1);
              $scope.$apply(function() {
                t.positions.push(t.calc[i]);
              });
              const index = t.calc.indexOf(t.calc[i]);
              t.calc.splice(index, 1, false);
              const ind = high.indexOf(t.calc[i]);
              high.splice(ind, 1);
              t.checkHighest(true, t.calc);
              i = -1;
            }
            //console.log(t.calc[i]);
            check = true;
            checker = false;
            if (high.length === 1 && t.calc[i] != false && t.calc[i] != undefined) {
              console.log(high);
              $scope.$apply(function() {
                t.positions.push(t.calc[i]);
              });
              const index = t.calc.indexOf(t.calc[i]);
              t.calc.splice(index, 1, false);
              const ind = high.indexOf(t.calc[i]);
              high.splice(ind, 1);
            }
          }
          if (high.length > 1) {
            t.calcEqualEqual();
          }
      check = true;
      checker = false;
      //console.log(t.calc[i]);
      if (high.length === 0) {
        t.sort(1);
      }
    };


          this.calcEqualEqual= function() {
            const high = t.calcClone;
      let maxNum;
        const length = t.calc.length;
        let checker;
        let check;
        let container = [];
        let i = 0;
        let a = 0;
      for (i = 0; i < length; i++) {
        //console.log(t.calc[i]);
           for (a = 0; a < length; a++) {
              if (t.calc[i] != false && t.calc[a] != false) {
                  if (t.calc[i][0] != t.calc[a][0]) {
                    if (t.calc[i][1].points === t.calc[a][1].points) {
                      if (t.calc[i][1].accurate === t.calc[a][1].accurate) {
                          checker = true;
                          t.combined.push(t.calc[a]);
                          console.log(t.calc[i][1], t.calc[a][1]);
                      }
                    }
                  }
              }
            }
            if (checker === true) {
              //console.log(1);
              t.combined.push(t.calc[i]);
              $scope.$apply(function() {
                t.positions.push(t.combined);
              });
              for (let c = 0; c < t.combined.length; c++) {
                const index = t.calc.indexOf(t.combined[c]);
                t.calc.splice(index, 1, false);
                const ind = high.indexOf(t.combined[c]);
                high.splice(ind, 1);
              }

              t.checkHighest(true);
              i = -1;
              t.combined = [];
            }
            //console.log(t.calc[i]);
            check = true;
            checker = false;
            if (high.length === 1 && t.calc[i] != false && t.calc[i] != undefined) {
              console.log(high);
              $scope.$apply(function() {
                t.positions.push(t.calc[i]);
              });
              const index = t.calc.indexOf(t.calc[i]);
              t.calc.splice(index, 1, false);
              const ind = high.indexOf(t.calc[i]);
              high.splice(ind, 1);
            }
          }
          if (high.length > 1) {
            t.calcEqualEqual();
          }
      check = true;
      checker = false;
      console.log(t.calc[i]);
      if (high.length === 0) {
        t.sort(1);
      }
          };

          this.sort = function(a) {
            t.cou += a;
            if (t.cou > 1) {
              return;
            }
            let lastPlace = 1;
            for (let i = 0; i < t.positions.length; i++) {
              console.log(typeof t.positions[i][0]);
              if (typeof t.positions[i][0] === 'object') {
                for (let b = 0; b < t.positions[i].length; b++) {
                  const numbering = `${lastPlace} - ${lastPlace + t.positions[i].length}`;
                  $scope.$apply(function() {
                    t.groupPositions.push([numbering, t.positions[i][b][0], t.positions[i][b][1].accurate, t.positions[i][b][1].points]);
                  });
                }
                  lastPlace = lastPlace + t.positions[i].length;
              } else {
                $scope.$apply(function() {
                  t.groupPositions.push([lastPlace, t.positions[i][0], t.positions[i][1].accurate, t.positions[i][1].points]);
                });
              }
              lastPlace++;
              //console.log(t.positions[i]);
            }
          }
                    console.log(t.groupPositions);


  }]);