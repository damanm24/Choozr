app.controller("GetPollCtrl", function GetPollCtrl($scope, $http, $cookies, $q) {

    //$scope.poll = null;

    $scope.$on('pollMade', function(event, args) {
        $scope.vState = "not-voted";
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
                var pollsVotedIn = $cookies.get('votedIn');
                pollsVotedIn = JSON.parse(pollsVotedIn);
                pollsVotedIn.push(id);
                $cookies.putObject('votedIn', pollsVotedIn);
            })
            .then(function() {
                retrievePoll(id);
            });

        defer.resolve();
    };

    $scope.calculatePercentage = function() {
        console.log($scope.poll);
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
                $scope.calculatePercentage();
                for (var i = 0; i < $scope.poll.options.length; i++) {
                    $scope.poll.options[i].bgurl = "url('" + $scope.poll.options[i].imageURL + "')";
                    $scope.poll.options[i].width = 800 / ($scope.poll.options.length);
                }
            });
    }
});
