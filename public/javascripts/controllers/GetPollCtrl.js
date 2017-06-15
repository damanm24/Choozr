function GetPollCtrl($scope, $http, $routeParams, $q, $rootScope) {


	$scope.pollMade = null;

	$scope.loadMadePoll = function() {
		var id = $routeParams.id.replace(/\"/g, "");
		retrievePoll(id);
		$rootScope.pollsVotedIn.includes(id) ? $scope.vState = "voted" : $scope.vState = "not-voted";
	};

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
				$scope.loadPage();
			});

		defer.resolve();
	};

	$scope.calculatePercentage = function() {
	 var sum = 0;
	 for (var i = 0; i < $scope.pollMade.options.length; i++) {
		 sum += $scope.pollMade.options[i].votes;
	 }

	 if (sum > 0) {
		 for (var i = 0; i < $scope.pollMade.options.length; i++) {
			 $scope.pollMade.options[i].percentage = Math.round(($scope.pollMade.options[i].votes / sum) * 100);
			 $scope.pollMade.options[i].height = $scope.pollMade.options[i].percentage * 3;
			 $scope.pollMade.options[i].color = "black";
		 }
	 } else {
		 for (var i = 0; i < $scope.pollMade.options.length; i++) {
			 $scope.pollMade.options[i].percentage = 0;
		 }
	 }
	 var maxValue = $scope.pollMade.options[0].percentage;
	 var maxIndex = 0;
	 var maxCount = 0;
	 for (var i = 1; i < $scope.pollMade.options.length; i++) {
		 if ($scope.pollMade.options[i].percentage > maxValue) {
			 maxValue = $scope.pollMade.options[i].percentage;
			 maxIndex = i;
		 }
	 }

		for (var i = 0; i < $scope.pollMade.options.length; i++) {
			if ($scope.pollMade.options[i].percentage == maxValue) {
				maxCount++;
			}
		}

		if (maxCount == 1) {
			$scope.pollMade.options[maxIndex].color = "#ff5765";
		}
	};

	function retrievePoll(id) {
		$http.get('/api/getPoll/' + id)
			.then(function(singlePoll) {
				$scope.pollMade = singlePoll.data;
				$scope.calculatePercentage();
				for (var i = 0; i < $scope.pollMade.options.length; i++) {
					$scope.pollMade.options[i].bgurl = "url('" + $scope.pollMade.options[i].imageURL + "')";
					$scope.pollMade.options[i].width = 800 / ($scope.pollMade.options.length);
				}
			});
	}
};
