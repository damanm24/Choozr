/**
 * Created by daman on 5/31/2017.
 */
function NewPollCtrl($scope, $http, $location) {
    $scope.poll = {
        options: [{text: ''}, {text: ''}]
    };

    $scope.addChoice = function () {
        if ($scope.poll.answers.length > 3) {
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

function GetPollCtrl($scope, $http) {
    $http.get('/api/getPoll/:id').success(function(singlePoll) {
        $scope.poll = singlePoll;
    });
}

function PollListCtrl() {
    $http.get('/api/getPoll').success(function(singlePoll) {
       $scope.singlePoll = singlePoll;
    });
}

