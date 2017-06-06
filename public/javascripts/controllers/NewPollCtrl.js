function NewPollCtrl($scope, $http, $location, $q) {
  $scope.cbstate = "not-pressed";



    activate1 = function(){
        if ($scope.cbstate === "second-pressed" || $scope.cbstate === "both-pressed"){
          $scope.cbstate = "both-pressed";
        } else {
          $scope.cbstate = "first-pressed";
        }
    }

    activate2 = function(){
        if ($scope.cbstate === "first-pressed" || $scope.cbstate === "both-pressed"){
          $scope.cbstate = "both-pressed";
        } else {
          $scope.cbstate = "second-pressed";
        }
    }


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

            function capitalize(pollObject){
              for(var i = 0; i < pollObject.options.length; i++) {
                pollObject.options[i].text = pollObject.options[i].text.charAt(0).toUpperCase() + pollObject.options[i].text.slice(1);
              }
            }

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
