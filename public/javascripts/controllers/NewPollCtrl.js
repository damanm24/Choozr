function NewPollCtrl($scope, $http, $location, $q) {
  $scope.poll = {
    options: [{
      text: '',
      votes: 0,
      imageURL: "",
      vState: "not-voted"
    }, {
      text: '',
      votes: 0,
      imageURL: "",
      vState: "not-voted"
    }]
  };

  $scope.inputs = "not-pressed";
  $scope.cbwidth = "45px";
  $scope.fsize = "200px";

  inputTyped = function() {
    $scope.inputs = "pressed";
  }

  $scope.smartText = function(input1Text, input2Text) {
    var p1, p2;
    var w = 45 - (input1Text.length/2) - (input2Text.length/2);
    $scope.cbwidth = w + "px";
    input1Text === "" ? p1 = "____ " : p1 = input1Text.replace(/\b\w/g, function(l) {
      return l.toUpperCase()
    }) + " ";
    input2Text === "" ? p2 = "..." : p2 = " " + input2Text.replace(/\b\w/g, function(l) {
      return l.toUpperCase()
    });
    return p1 + "and" + p2;
  }

  $scope.addChoice = function() {
    if ($scope.poll.options.length > 3) {
      console.log("Too many choices");
    } else {
      $scope.poll.options.push({
        text: '',
        votes: 0,
        imageURL: "",
        vState: "not-voted"
      });
    }
    if ($scope.poll.options.length == 4) {
      $scope.fsize = "175px";
    }
    if ($scope.poll.options.length == 4) {
      $scope.fsize = "150px";
    }
  };


  function validatePoll() {
    var isValid = true;
    for (var i = 0; i < $scope.poll.options.length; i++) {
      if (!$scope.poll.options[i].text) {
        isValid = false;
        break;
      }
      for(var j = i + 1; j < $scope.poll.options.length; j++){
        if($scope.poll.options[i].text === $scope.poll.options[j].text){
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  }

  let promiseURL = function(searchTerm) {
    return new Promise(function(resolve, reject) {
      $http.get('https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + searchTerm + '&count=1&offset=0&mkt=en-us&safeSearch=Moderate&freshness=month', {
        headers: {
          'Ocp-Apim-Subscription-Key': '7806128c275a4fe99a84ffc32e5b6026'
        }
      }).success(function(response) {
        resolve(response);
      }).error(function(err, status) {
        reject(err);
      })
    })
  };

  function postPoll() {
    $http.post('/api/pollPost', JSON.stringify($scope.poll)).then(
      function successCallback(response) {
        console.log(response.data);
        $location.path('/getPoll/' + JSON.stringify(response.data));
        //console.log(response);
      },
      function failedCallback(response) {}
    );
  };

  $scope.submitChoice = function() {
    var isValid = validatePoll();
    var response = null;
    if (isValid) {
      var promises = [];
      for(var i = 0; i < $scope.poll.options.length; i++) {
        promises.push(promiseURL($scope.poll.options[i].text));
      }
      Promise.all(promises)
      .then(function(data) {
        console.log(data);
        for(var i = 0; i < $scope.poll.options.length; i++) {
          $scope.poll.options[i].imageURL = data[i].value[0].contentUrl;
          $scope.poll.options[i].text = $scope.poll.options[i].text.replace(/\b\w/g, function(l) {
            return l.toUpperCase()
          });
        }
        postPoll();
      });
    } else {
      console.log("Not Valid Poll");
    }
  }
}
