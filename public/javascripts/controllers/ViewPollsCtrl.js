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
			console.log($scope.polls)
		});

	let sendVoteRequest = function(payload, currentPollIndex) {
		console.log("inside sendVoteRequest");
		return new Promise((resolve, reject) => {
				$http.put("/api/vote/", payload);
			})
			.then(function(response) { //NOTE we've set up the /api/vote/ route to return the latest version of the poll by default, so NOTE we don't need another function to do that
				response.data.hasVoted = "true"; //Adds the property hasVoted, but set to true
				$scope.polls[currentPollIndex] = response.data; //then sets the index of that poll to the updated poll
				resolve(response.data);
			})
			.catch(function(err) {
				reject(err);
			});
	}

	$scope.submitVote = function(optionText, poll_id, currentPollIndex) {
		console.log("inside submitVote");
		var payload = {
			choice_text: optionText,
			poll_id: poll_id
		}
		sendVoteRequest(payload, currentPollIndex) //NOTE I haven't done anything with changing the view of a poll that has been voted on just an FYI
			.then(function(singlePoll) {
				//NOTE calculatePercentage should go here
			});

	}
}
