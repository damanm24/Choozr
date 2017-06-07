function ViewPollsCtrl($q, $scope, $http) {

  $scope.addStates = function() {
    for (var i = 0; i < $scope.polls.length; i++) {
      $scope.polls[i].moduleState = "notVoted";
    }
  }

  $scope.loadSinglePoll = function(id, currentPollIndex) {
    var id = ($routeParams.id).substring(3, ($routeParams.id.length - 3));
    getSinglePoll(id);
    $rootScope.pollsVotedIn.includes(id) ? $scope.polls[currentPollIndex].moduleState = "voted" : $scope.polls[currentPollIndex].moduleState = "notVoted";
  }

  $scope.submitVote = function(text, id, currentPollIndex) {
    var payload = {
      poll_id: id,
      choice_text: text
    };

    var defer = $q.defer();

    defer.promise.then(function() {
      $http.put("/api/vote/", payload);
    }).then(function() {
      $scope.polls[currentPollIndex].moduleState = "voted";
    }).then(function() {
      $rootScope.pollsVotedIn.push(id);
    }).then(function() {
      $scope.loadSinglePolls(id, currentPollIndex);
    });

    defer.resolve();
  };

  var defer = $q.defer();

  defer.promise
    .then(function() {
      $http.get('/api/getpolls/').success(function(allPolls) {
        console.log(allPolls);
        $scope.polls = allPolls;
        $scope.addStates();
      });
    })

    defer.resolve();




  function getSinglePoll(id, currentPollIndex) {
    $http.get('/api/getPoll/' + id).success(function(singlePoll) {
      $scope.polls[currentPollIndex] = singlePoll;
      console.log(singlePoll);
      $scope.calculatePercentage();
      $scope.polls[currentPollIndex].options[0].bgurl = "url('http://www.conradnewyork.com/assets/img/Special-Offers/new-york-skyline-720x565.jpg')";
      $scope.polls[currentPollIndex].options[1].bgurl = "url('http://2.bp.blogspot.com/-D3UB8Nz30zM/USv8WYmvSdI/AAAAAAAAB5o/S8rA7KrQYdM/s1600/seattle+skyline.jpg')";
    });
  }

}
