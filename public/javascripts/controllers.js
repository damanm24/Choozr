/**
 * Created by daman on 5/31/2017.
 */
function NewPollCtrl($scope, $http, $location) {
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
                //$scope.error("");
            } else {
                poll.options[i].votes = 0;
            }
        }

        if(isvalid) {
            $http.post('/api/pollPost', JSON.stringify(poll)).then(
                function successCallback(response) {
                    console.log(response.data);
                    $location.path('/getPoll/' + JSON.stringify(response.data));
                    //console.log(response);
                }, function failedCallback(response) {

                }
            );

        } else {
            console.log('Your poll is invalid');
        }

    };

    $scope.error = function () {

    }
}

function GetPollCtrl($scope, $http, $routeParams, $q, $rootScope) {

    $scope.poll = null;
    $scope.moduleState = "notVoted";

    $scope.loadPage = function() {
        var id = $routeParams.id;
        id = id.substring(3, (id.length-3));
        $http.get('/api/getPoll/' + id).success(function (singlePoll) {
            $scope.poll = singlePoll;
            //$scope.showPoll();
            $scope.calculatePercentage();
        });
        if($rootScope.pollsVotedIn.includes(id)) {
            $scope.moduleState = "voted";
        } else {
            $scope.moduleState = "notVoted";
        }
    };

    $scope.showPoll = function() {
        console.log($scope.poll);
    };

    $scope.calculatePercentage = function(){
      console.log($scope.poll.options);
      var sum = 0;
      for(var i = 0; i < $scope.poll.options.length; i++){
        sum = sum + $scope.poll.options[i].votes; i++
      }
      if(sum > 0){
        for(var i = 0; i < $scope.poll.options.length; i++){
          $scope.poll.options[i].percentage = ($scope.poll.options[i].votes/sum) * 100;
          console.log($scope.poll.options[i].percentage);
        }
      } else {
        for(var i = 0; i < $scope.poll.options.length; i++){
          console.log("sum less than 0");
          $scope.poll.options[i].percentage = 0;
        }
      }
    };

    $scope.submitVote = function(text, id){
        console.log("poll id is: " + id);
        var payload = {
            poll_id: id,
            choice_text: text
        };
        var defer = $q.defer();

        defer.promise.then(function() {
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

    $scope.loadPage = function(){
        $http.get('/api/viewPolls/').success(function(allPolls){
            $scope.polls = allPolls;
            $scope.showPolls();
          });
      };

      $scope.showPolls = function() {
          console.log($scope.polls);

      }

}
