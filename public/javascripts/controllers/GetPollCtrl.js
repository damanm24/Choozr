function GetPollCtrl($scope, $http, $routeParams, $q, $rootScope) {

    $scope.poll = null;
    $scope.moduleState = "notVoted";

    $scope.loadPage = function () {
        var id = ($routeParams.id).substring(3, ($routeParams.id.length - 3));
        retrievePoll(id);
        $rootScope.pollsVotedIn.includes(id) ? $scope.moduleState = "voted" : $scope.moduleState = "notVoted";
    };

    $scope.submitVote = function (text, id) {
        var payload = {
            poll_id: id,
            choice_text: text
        };

        var defer = $q.defer();

        defer.promise.then(function () {
            $http.put("/api/vote/", payload);
        }).then(function () {
            $scope.moduleState = "voted";
        }).then(function () {
            $rootScope.pollsVotedIn.push(id);
        }).then(function () {
            $scope.loadPage();
        });

        defer.resolve();
    };

    $scope.calculatePercentage = function () {
        var sum = 0;
        for (var i = 0; i < $scope.poll.options.length; i++) {
            sum += $scope.poll.options[i].votes;
        }

        if (sum > 0) {
            for (var i = 0; i < $scope.poll.options.length; i++) {
                $scope.poll.options[i].percentage = Math.round(($scope.poll.options[i].votes / sum) * 100);
                $scope.poll.options[i].height = $scope.poll.options[i].percentage * 3;
              }
        } else {
            for (var i = 0; i < $scope.poll.options.length; i++) {
                $scope.poll.options[i].percentage = 0;
            }
        }

        if ($scope.poll.options.length = 2) {
            $scope.poll.options[0].color = "#000"
            $scope.poll.options[1].color = "#000"
            if($scope.poll.options[0].percentage > $scope.poll.options[1].percentage) ($scope.poll.options[0].color = "#ff5765");
            if ($scope.poll.options[0].percentage < $scope.poll.options[1].percentage) ($scope.poll.options[1].color = "#ff5765");
            }
        };

    function retrievePoll(id){
        $http.get('/api/getPoll/' + id).success(function (singlePoll) {
            $scope.poll = singlePoll;
            console.log(singlePoll);
            $scope.calculatePercentage();
            $scope.poll.options[0].bgurl = "url('http://www.conradnewyork.com/assets/img/Special-Offers/new-york-skyline-720x565.jpg')";
            $scope.poll.options[1].bgurl = "url('http://2.bp.blogspot.com/-D3UB8Nz30zM/USv8WYmvSdI/AAAAAAAAB5o/S8rA7KrQYdM/s1600/seattle+skyline.jpg')";
        });
    }
  };
