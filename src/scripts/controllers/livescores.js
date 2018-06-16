angular.module('worldCupScoresApp')
  .controller('LivescoresCtrl', ['matchesStore', '$scope', function(match, $scope) {
  	const t = this;
  	//console.log($scope);
    this.currentMatchDay;
    this.tableAD;
    this.tableEH;
    this.leftLast16 = [];
    this.rightLast16 = [];
    this.leftLast8 = [];
    this.rightLast8 = [];
    this.leftLast4 = [];
    this.rightLast4 = [];
    this.last2 = [];
    this.final = [];


    	match.promiseCheck.then(response => {
        match.getFixtures(response._links).then(resp => {
          //console.log(resp);
          $scope.$apply(function() {
            t.tableAD = match.table.standingsAD;
            t.tableEH = match.table.standingsEH;
            //console.log(t.tableAD);
          });
          //console.log(match.table);
          //console.log(response);
        });
        match.getTimes(response._links).then(resp => {

        });
    	});
      match.promiseCheck.then(response => {
        match.getMatches(response._links).then(resp => {
          let counter = 0;
          let counter1 = 0;
          let counter2 = 0;
          //console.log(resp);
          const day = match.resul;
          for (d in day) {
            //console.log(match.resul[d].scores.teamA);
            if (match.resul[d].matchday === 4 && counter < 4) {
                $scope.$apply(function() {
                  t.leftLast16.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
                });
                counter++;
            } else if (match.resul[d].matchday === 4) {
              $scope.$apply(function() {
                  t.rightLast16.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
                });
            }
            if (match.resul[d].matchday === 5 && counter1 < 2) {
              $scope.$apply(function() {
                t.rightLast8.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
              });
              counter1++;
            } else if (match.resul[d].matchday === 5) {
              $scope.$apply(function() {
                t.leftLast8.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
              });
            }
            if (match.resul[d].matchday === 6 && counter2 < 1) {
              $scope.$apply(function() {
                t.leftLast4.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
              });
              counter2++;
            } else if (match.resul[d].matchday === 6) {
              $scope.$apply(function() {
                t.rightLast4.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
              });
            }
            if (match.resul[d].matchday === 7) {
              $scope.$apply(function() {
                t.last2.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
              });
            }
            if (match.resul[d].matchday === 8) {
              $scope.$apply(function() {
                t.final.push([match.resul[d].scores.teamA, match.resul[d].scores.teamH]);
              });
            }
          }
          //console.log(t.rightLast4);
          //console.log(t.leftLast4);
        });
      });
  }]);
