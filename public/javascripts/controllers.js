/**
 * Created by daman on 5/31/2017.
 */
function NewPollCtrl($scope, $http, $location) {
    $scope.poll = {
        answers: [{text: ''}, {text: ''}]
    };

    $scope.addChoice = function () {
        if ($scope.poll.answers.length > 3) {
            //$scope.error;
            console.log("Too many choices");
        } else {
            $scope.poll.answers.push({text: ''});
        }
    };

    $scope.submitChoice = function () {
        var poll = $scope.poll;
        var isvalid = true;
        //validation
        for (var i = 0; i < poll.answers.length; i++) {
            if (poll.answers[i].text.length == 0) {
                isvalid = false;
                console.log("Error blank answers");
                //$scope.error("");
            } else {
                poll.answers[i].votes = 0;
            }
        }

        if(isvalid) {
            $http.post('/api/pollPost', JSON.stringify(poll)).then(
                function successCallback(response) {
                    //$location.path('/getPoll/' + response.id);
                    console.log(response);
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

function GetPollCtrl() {
    $scope.getPost = function() {
        $http.post('api/getPost')

    }
}

function PollListCtrl() {
    $http.get('/api/getPolls').success(function(singlePoll) {
       $scope.singlePoll = singlePoll;
    });
}

