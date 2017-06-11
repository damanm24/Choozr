function ViewPollsCtrl($q, $scope, $http) {

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


	loadPage()
		.then(function(data) {
			for (var i = 0; i < $scope.polls.length; i++) {
				$scope.polls[i].hasVoted = false;
			}
		});

	let sendVoteRequest = function(payload, currentPollIndex) {
		return new Promise((resolve, reject) => {
				$http.put("/api/vote/", payload);
			})
			.then(function(response) {
				response.data.hasVoted = true;
				$scope.polls[currentPollIndex] = response.data;
				resolve(response.data);
			});
	}

	$scope.submitVote = function(optionText, poll_id, currentPollIndex) {
		var payload = {
			choice_text: optionText,
			poll_id: poll_id
		}
		sendVoteRequest(payload, currentPollIndex)
			.then(function(singlePoll) {
				//calculatePercentage should go here
			});

	}
}
