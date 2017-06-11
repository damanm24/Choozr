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

}
