/**
 * Created by daman on 5/31/2017.
 */
var app = angular.module('Choozr', ["ngRoute", "ngCookies"]);

app.controller("NewPollCtrl", function NewPollCtrl($scope, $http, $location, $q) {
  $scope.poll = {
    options: [{
      text: '',
      votes: 0,
      imageURL: "",
      vState: "not-voted"
    }, {
      text: '',
      votes: 0,
      imageURL: "",
      vState: "not-voted"
    }]
  };

  $scope.inputs = "not-pressed";
  $scope.cbwidth = "45px";
  $scope.fsize = "200px";
  $scope.ccount = 2;

  inputTyped = function() {
    $scope.inputs = "pressed";
  }

  $scope.smartText = function() {


    var p1, p2;
    var w = 45 - ($scope.poll.options[0].text.length / 2) - ($scope.poll.options[1].text.length / 2);
    $scope.cbwidth = w + "px";
    $scope.poll.options[0].text === "" ? p1 = "____ " : p1 = $scope.poll.options[0].text.replace(/\b\w/g, function(l) {
      return l.toUpperCase()
    }) + " ";
    $scope.poll.options[1].text === "" ? p2 = "..." : p2 = " " + $scope.poll.options[1].text.replace(/\b\w/g, function(l) {
      return l.toUpperCase()
    });
    return p1 + "and" + p2;
  }

  $scope.addChoice = function() {
    $scope.poll.options.push({
      text: '',
      votes: 0,
      imageURL: "",
      vState: "not-voted"
    });
    $scope.ccount++;
    if ($scope.poll.options.length == 3) {
      $scope.fsize = "175px";
    }
    if ($scope.poll.options.length == 4) {
      $scope.fsize = "150px";
    }
  };

  $scope.subChoice = function() {
    $scope.poll.options.pop();
    $scope.ccount = $scope.ccount - 1;
    if ($scope.poll.options.length == 2) {
      $scope.fsize = "200px";
    }
  }



  function validatePoll() {
    var isValid = true;
    for (var i = 0; i < $scope.poll.options.length; i++) {
      if (!$scope.poll.options[i].text) {
        isValid = false;
        break;
      }
      for (var j = i + 1; j < $scope.poll.options.length; j++) {
        if ($scope.poll.options[i].text === $scope.poll.options[j].text) {
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  }

  let promiseURL = function(searchTerm) {
    return new Promise(function(resolve, reject) {
      $http.get('https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + searchTerm + '&count=1&offset=0&mkt=en-us&safeSearch=Moderate&freshness=month', {
          headers: {
            'Ocp-Apim-Subscription-Key': '7806128c275a4fe99a84ffc32e5b6026'
          }
        })
        .then(function(response) {
          resolve(response);
        })
        .catch(function(err, status) {
          reject(err);
        })
    })
  };

  function postPoll() {
    $http.post('/api/pollPost', JSON.stringify($scope.poll))
      .then(
        function successCallback(response) {
          console.log("response.data is " + response.data);
          $scope.$parent.$broadcast('pollMade', {pollId : response.data});
        },
        function failedCallback(response) {}
      );
  };

  $scope.submitChoice = function() {
    var isValid = validatePoll();
    var response = null;
    if (isValid) {
      var promises = [];
      for (var i = 0; i < $scope.poll.options.length; i++) {
        promises.push(promiseURL($scope.poll.options[i].text));
      }
      Promise.all(promises)
        .then(function(data) {
          console.log(data);
          for (var i = 0; i < $scope.poll.options.length; i++) {
            $scope.poll.options[i].imageURL = data[i].data.value[0].contentUrl;
            $scope.poll.options[i].text = $scope.poll.options[i].text.replace(/\b\w/g, function(l) {
              return l.toUpperCase()
            });
          }
          postPoll();
        });
    } else {
      console.log("Not Valid Poll");
    }
  }
});

app.controller("ViewPollsCtrl", function ViewPollsCtrl($q, $scope, $http, $cookies) {
  //This is the load page promise it sets the $scope.polls to the response it gets back
  let loadPage = function() {
    return new Promise((resolve, reject) => {
      $http.get('/api/getPolls/')
        .then(function(response) {
          $scope.polls = response.data.reverse();
          resolve(response.data);
        })
        .catch(function(err, status) {
          reject(err);
        })
    })
  };


  loadPage() //LoadPage gets called when the page loads.
    .then(function(data) {
      var pollsVotedIn = $cookies.get('votedIn');
      if (!pollsVotedIn) {
        pollsVotedIn = [];
        pollsVotedIn.push("firstVal");
        pollsVotedIn.push("secondVal");
        $cookies.putObject('votedIn', pollsVotedIn);
      }
      for (var i = 0; i < $scope.polls.length; i++) { //The outer for-loop adds a hasVoted property which is set to false by default

        if (pollsVotedIn.includes($scope.polls[i]._id)) {
          $scope.calculatePercentage(i);
          $scope.polls[i].hasVoted = "true";

        } else {
          $scope.polls[i].hasVoted = "false";
        }

        for (var j = 0; j < $scope.polls[i].options.length; j++) { //This for loop was copied from the GetPollCtrl and it gets the bgurl and the width
          $scope.polls[i].options[j].bgurl = "url('" + $scope.polls[i].options[j].imageURL + "')"; //NOTE its a nested forloop so it has to be polls[i] and then options[j]
          $scope.polls[i].options[j].width = 800 / ($scope.polls[i].options.length);
          $scope.$apply();
        }
      }
    });

  let sendVoteRequest = function(payload, currentPollIndex) {
    return new Promise((resolve, reject) => {
      $http.put("/api/vote/", payload)
        .then(function(response) { //NOTE we've set up the /api/vote/ route to return the latest version of the poll by default, so NOTE we don't need another function to do that
          response.data.hasVoted = "true"; //Adds the property hasVoted, but set to true
          $scope.polls[currentPollIndex] = response.data; //then sets the index of that poll to the updated poll
          resolve(response.data);
        })
        .catch(function(err) {
          reject(err);
        });
    })
  }

  $scope.submitVote = function(optionText, poll_id, currentPollIndex) {
    var payload = {
      choice_text: optionText,
      poll_id: poll_id
    }
    var pollsVotedIn = $cookies.get('votedIn');
    pollsVotedIn = JSON.parse(pollsVotedIn);
    pollsVotedIn.push(poll_id);
    $cookies.putObject('votedIn', pollsVotedIn);
    //DAMAN I moved this out btw, you can move it back if you want.

    sendVoteRequest(payload, currentPollIndex) //NOTE I haven't done anything with changing the view of a poll that has been voted on just an FYI
      .then(function(singlePoll) {
        $scope.calculatePercentage(currentPollIndex);
      })
      .then(function() {
        $scope.$apply();
      });

  }

  $scope.calculatePercentage = function(currentPollIndex) {
    var sum = 0;
    for (var i = 0; i < $scope.polls[currentPollIndex].options.length; i++) {
      sum += $scope.polls[currentPollIndex].options[i].votes;
    }
    if (sum > 0) {
      for (var i = 0; i < $scope.polls[currentPollIndex].options.length; i++) {
        $scope.polls[currentPollIndex].options[i].percentage = Math.round(($scope.polls[currentPollIndex].options[i].votes / sum) * 100);
        $scope.polls[currentPollIndex].options[i].height = $scope.polls[currentPollIndex].options[i].percentage * 3;
        $scope.polls[currentPollIndex].options[i].color = "black";
        $scope.polls[currentPollIndex].options[i].bgurl = "url('" + $scope.polls[currentPollIndex].options[i].imageURL + "')"; //NOTE its a nested forloop so it has to be polls[i] and then options[j]
        $scope.polls[currentPollIndex].options[i].width = 800 / ($scope.polls[currentPollIndex].options.length);
      }
    } else {
      for (var i = 0; i < $scope.poll.options.length; i++) {
        $scope.polls[currentPollIndex].options[i].percentage = 0;
      }
    }
    var maxValue = $scope.polls[currentPollIndex].options[0].percentage;
    var maxIndex = 0;
    var maxCount = 0;
    for (var i = 1; i < $scope.polls[currentPollIndex].options.length; i++) {
      if ($scope.polls[currentPollIndex].options[i].percentage > maxValue) {
        maxValue = $scope.polls[currentPollIndex].options[i].percentage;
        maxIndex = i;
      }
    }

    for (var i = 0; i < $scope.polls[currentPollIndex].options.length; i++) {
      if ($scope.polls[currentPollIndex].options[i].percentage == maxValue) {
        maxCount++;
      }
    }
    if (maxCount == 1) {
      $scope.polls[currentPollIndex].options[maxIndex].color = "#ff5765";
    }

  };

});

app.controller("GetPollCtrl", function GetPollCtrl($scope, $http, $routeParams, $q, $rootScope) {

  $scope.vState = "not-voted";
	$scope.poll = null;

    $scope.$on('pollMade', function (event, args){
      console.log("args.pollId are...");
      console.log(args.pollId);
      retrievePoll(args.pollId);
    });

	$scope.submitVote = function(text, id) {
    var payload = {
			poll_id: id,
			choice_text: text
		};

		var defer = $q.defer();

		defer.promise.then(function() {
				$http.put("/api/vote/", payload);
			})
			.then(function() {
				$scope.vState = "voted";
			})
			.then(function() {
				$rootScope.pollsVotedIn.push(id);
			})
			.then(function() {
				$scope.loadMadePoll();
			});

		defer.resolve();
	};

	$scope.calculatePercentage = function() {
	 var sum = 0;
	 for (var i = 0; i < $scope.poll.options.length; i++) {
		 sum += $scope.poll.options[i].votes;
	 }

	 if (sum > 0) {
		 for (var i = 0; i < $scope.poll.options.length; i++) {
			 $scope.poll.options[i].percentage = Math.round(($scope.poll.options[i].votes / sum) * 100);
			 $scope.poll.options[i].height = $scope.poll.options[i].percentage * 3;
			 $scope.poll.options[i].color = "black";
		 }
	 } else {
		 for (var i = 0; i < $scope.poll.options.length; i++) {
			 $scope.poll.options[i].percentage = 0;
		 }
	 }
	 var maxValue = $scope.poll.options[0].percentage;
	 var maxIndex = 0;
	 var maxCount = 0;
	 for (var i = 1; i < $scope.poll.options.length; i++) {
		 if ($scope.poll.options[i].percentage > maxValue) {
			 maxValue = $scope.poll.options[i].percentage;
			 maxIndex = i;
		 }
	 }

		for (var i = 0; i < $scope.poll.options.length; i++) {
			if ($scope.poll.options[i].percentage == maxValue) {
				maxCount++;
			}
		}

		if (maxCount == 1) {
			$scope.poll.options[maxIndex].color = "#ff5765";
		}
	};

	function retrievePoll(id) {
		$http.get('/api/getPoll/' + id)
			.then(function(singlePoll) {
				$scope.poll = singlePoll.data;
        console.log("scope.poll is...");
        console.log($scope.poll);
				$scope.calculatePercentage();
				for (var i = 0; i < $scope.poll.options.length; i++) {
					$scope.poll.options[i].bgurl = "url('" + $scope.poll.options[i].imageURL + "')";
					$scope.poll.options[i].width = 800 / ($scope.poll.options.length);
				}
			});
	}
});
