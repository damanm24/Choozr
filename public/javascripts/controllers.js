/**
 * Created by daman on 5/31/2017.
 */
function NewPollCtrl($scope, $http, $location, $q) {
  $scope.cbstate = "not-pressed";

    $scope.poll = {
        options: [{text: ''}, {text: ''}]
    };

    $scope.queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=97c5cc1c6797a81ef3f7a6e50f591131&tags=";
    $scope.queryURLpt2 = "&content_type=true&per_page=1&format=json&nojsoncallback=1";

    $scope.addChoice = function () {

        if ($scope.poll.options.length > 3) {
            //$scope.error;
            console.log("Too many choices");
        } else {
            $scope.poll.options.push({text: ''});
        }
    };

    $scope.submitChoice = function () {
        var poll = $scope.poll;
        var isvalid = true;
        //validation
        for (var i = 0; i < poll.options.length; i++) {
            if (poll.options[i].text.length == 0) {
                isvalid = false;
                console.log("Error blank answers");
                break;
            }
        }

        if (isvalid) {
            var defer = $q.defer();

            function firstPromise(pollObject) {
                $scope.poll = $scope.addVotesProperty(pollObject);
            }

            function secondPromise(pollObject) {
                $scope.getRequest(pollObject);
            }

            defer.promise.then(firstPromise(poll)).then(secondPromise($scope.poll));

            defer.resolve();
        } else {
            console.log('Your poll is invalid');
        }

    };

    $scope.addVotesProperty = function (poll) {
        for(var i = 0; i < poll.options.length; i++) {
            poll.options[i].votes = 0;
        }
        return poll;
    };

    $scope.getRequest = function (poll) {
        $http.post('/api/pollPost', JSON.stringify(poll)).then(
            function successCallback(response) {
                console.log(response.data);
                $location.path('/getPoll/' + JSON.stringify(response.data));
                //console.log(response);
            }, function failedCallback(response) {

            }
        );
    };
}

function GetPollCtrl($scope, $http, $routeParams, $q, $rootScope) {

    $scope.poll = null;
    $scope.moduleState = "notVoted";

    $scope.loadPage = function () {
        var id = $routeParams.id;
        id = id.substring(3, (id.length - 3));
        $http.get('/api/getPoll/' + id).success(function (singlePoll) {
            $scope.poll = singlePoll;
            $scope.calculatePercentage();
            $scope.poll.options[0].bgurl = "url('http://www.rap-up.com/app/uploads/2014/12/kanye-west.jpg')";
            $scope.poll.options[1].bgurl = "url('http://images.fanpop.com/images/image_uploads/Eminem-eminem-227160_1024_768.jpg')";
        });
        if ($rootScope.pollsVotedIn.includes(id)) {
            $scope.moduleState = "voted";
        } else {
            $scope.moduleState = "notVoted";
        }

    };

    $scope.showPoll = function () {
        console.log($scope.poll);
    };

    $scope.calculatePercentage = function () {
        console.log($scope.poll.options);
        var sum = 0;
        for (var i = 0; i < $scope.poll.options.length; i++) {
            sum = sum + $scope.poll.options[i].votes;
            $scope.poll.options[i].color = "black";
        }
        if (sum > 0) {
            for (var i = 0; i < $scope.poll.options.length; i++) {
                $scope.poll.options[i].percentage = Math.round(($scope.poll.options[i].votes / sum) * 100);
                $scope.poll.options[i].height = $scope.poll.options[i].percentage * 3;
                console.log($scope.poll.options[i].height + "px");
            }
        } else {
            for (var i = 0; i < $scope.poll.options.length; i++) {
                console.log("Error: Sum < 0");
                $scope.poll.options[i].percentage = 0;
            }
        }

        if ($scope.poll.options.length = 2) {
            console.log("yeah");
            if ($scope.poll.options[0].percentage > $scope.poll.options[1].percentage) {
                $scope.poll.options[0].color = "#cba135";
                $scope.poll.options[1].color = "#d9d9d9";
            } else if ($scope.poll.options[0].percentage < $scope.poll.options[1].percentage) {
                $scope.poll.options[0].color = "#d9d9d9";
                $scope.poll.options[1].color = "#fff2cc";
            }
        }


    };

    function ViewPollCtrl($scope, $http, $routeParams, $q, $rootScope) {

        $scope.poll = null;
        $scope.moduleState = "notVoted";

        $scope.loadPage = function () {
            $http.get('/api/viewpolls/').success(function (polls) {
                $scope.polls = polls;
                console.log($scope.polls);
            });
        };
  };









    $scope.submitVote = function (text, id) {
        console.log("poll id is: " + id);
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


    }
}

function PollListCtrl($scope, $http) {
    $scope.polls = null;

    $scope.loadPage = function () {
        $http.get('/api/viewPolls/').success(function (allPolls) {
            $scope.polls = allPolls;
            $scope.showPolls();
        });
    };

    $scope.showPolls = function () {
        console.log($scope.polls);

    }

}
