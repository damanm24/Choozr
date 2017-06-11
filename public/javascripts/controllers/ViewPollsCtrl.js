function ViewPollsCtrl($q, $scope, $http) {
  //This is the load page promise it sets the $scope.polls to the response it gets back
  let loadPage = function() {
    return new Promise((resolve, reject) => {
      $http.get('/api/getPolls/')
        .then(function(response) {
          $scope.polls = response.data;
          resolve(response.data);
        })
        .catch(function(err, status) {
          reject(err);
        })
    })
  };


  loadPage() //LoadPage gets called when the page loads.
    .then(function(data) {
      for (var i = 0; i < $scope.polls.length; i++) { //The outer for-loop adds a hasVoted property which is set to false by default
					$scope.polls[i].hasVoted = "false";
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
       //DAMAN I moved this out btw, you can move it back if you want.

      sendVoteRequest(payload, currentPollIndex) //NOTE I haven't done anything with changing the view of a poll that has been voted on just an FYI
        .then(function(singlePoll) {
					$scope.calculatePercentage(currentPollIndex);
        })
				.then(function(){
          $scope.$apply();
        });

    }

		$scope.calculatePercentage = function(currentPollIndex) {
	 var sum = 0;
	 for (var i = 0; i < $scope.polls[currentPollIndex].options.length; i++) {
		 sum +=  $scope.polls[currentPollIndex].options[i].votes;
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

  }
