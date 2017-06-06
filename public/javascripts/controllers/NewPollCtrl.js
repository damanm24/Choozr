function NewPollCtrl($scope, $http, $location, $q) {
  $scope.poll = {
    options: [{
      text: ''
    }, {
      text: ''
    }]
  };

  $scope.addChoice = function() {

    if ($scope.poll.options.length > 3) {
      //$scope.error;
      console.log("Too many choices");
    } else {
      $scope.poll.options.push({
        text: ''
      });
    }
  };

  $scope.getRequest = function() {
    $http.post('/api/pollPost', JSON.stringify($scope.poll)).then(
      function successCallback(response) {
        console.log(response.data);
        $location.path('/getPoll/' + JSON.stringify(response.data));
        //console.log(response);
      },
      function failedCallback(response) {

      }
    );
  };

  $scope.addVotesProperty = function() {
    for (var i = 0; i < $scope.poll.options.length; i++) {
      $scope.poll.options[i].votes = 0;
    }
  };

  $scope.textBoxValidation = function(poll) {
    var isValid = true;

    for (var i = 0; i < poll.options.length; i++) {
      if (poll.options[i].text.length == 0) {
        isValid = false;
        console.log("Error blank answers");
        break;
      }
    }
    return isValid
  };

  $scope.submitChoice = function() {
    var poll = $scope.poll;

    var isValid = $scope.textBoxValidation(poll);

    if (isValid) {
      var defer = $q.defer();

      defer.promise
        .then(function() {
          $scope.addVotesProperty();
        }).then(function() {
          $scope.getRequest();
        });

      defer.resolve();
    } else {
      console.log('Your poll is invalid');
    }
  };
}
