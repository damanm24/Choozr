app.controller("NewPollCtrl", function NewPollCtrl($scope, $http, $location, $cookies) {

  $scope.aState = "not-asked";

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

    var pollsCreated = $cookies.get('pollsCreated');
    if(!pollsCreated) {
      $cookies.putObject('pollsCreated', []);
    }
    
    $scope.inputs = "not-pressed";
    $scope.cbwidth = "45px";
    $scope.fsize = "200px";
    $scope.ccount = 2;

    inputTyped = function() {
        $scope.inputs = "pressed";
    }

    $scope.smartText = function() {


        var p1, p2;
        var w = 45 - ($scope.poll.options[0].text.length / 2) - ($scope.poll.options[1].text.length / 2);
        $scope.cbwidth = w + "px";
        $scope.poll.options[0].text === "" ? p1 = "____ " : p1 = $scope.poll.options[0].text.replace(/\b\w/g, function(l) {
            return l.toUpperCase()
        }) + " ";
        $scope.poll.options[1].text === "" ? p2 = "..." : p2 = " " + $scope.poll.options[1].text.replace(/\b\w/g, function(l) {
            return l.toUpperCase()
        });
        return p1 + "and" + p2;
    }

    $scope.addChoice = function() {
        $scope.poll.options.push({
            text: '',
            votes: 0,
            imageURL: "",
            vState: "not-voted"
        });
        $scope.ccount++;
        if ($scope.poll.options.length == 3) {
            $scope.fsize = "175px";
        }
        if ($scope.poll.options.length == 4) {
            $scope.fsize = "150px";
        }
    };

    $scope.subChoice = function() {
        $scope.poll.options.pop();
        $scope.ccount = $scope.ccount - 1;
        if ($scope.poll.options.length == 2) {
            $scope.fsize = "200px";
        }
    }



    function validatePoll() {
        var isValid = true;
        for (var i = 0; i < $scope.poll.options.length; i++) {
            if (!$scope.poll.options[i].text) {
                isValid = false;
                break;
            }
            for (var j = i + 1; j < $scope.poll.options.length; j++) {
                if ($scope.poll.options[i].text === $scope.poll.options[j].text) {
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
                })
                .then(function(response) {
                    resolve(response);
                })
                .catch(function(err, status) {
                    reject(err);
                })
        })
    };

    let addIDToCookie = function(id) {
      return new Promise(function(resolve, reject) {
        var pollsCreated = $cookies.get("pollsCreated");
        pollsCreated = JSON.parse(pollsCreated);
        pollsCreated.push(id);
        console.log(id)
        $cookies.putObject("pollsCreated", pollsCreated);
        resolve(id);
      })
    }

    function postPoll() {
        $http.post('/api/pollPost', JSON.stringify($scope.poll))
            .then(
                function successCallback(response) {
                  addIDToCookie(response.data).then(function(data) {
                    $scope.$parent.$broadcast('pollMade', {
                        pollId: data
                    });
                    $scope.aState="asked";
                  }).catch(function() {
                    console.log("Error");
                  });
                },
                function failedCallback(response) {}
            );
    };

    $scope.submitChoice = function() {
        var isValid = validatePoll();
        var response = null;
        if (isValid) {
            var promises = [];
            for (var i = 0; i < $scope.poll.options.length; i++) {
                promises.push(promiseURL($scope.poll.options[i].text));
            }
            Promise.all(promises)
                .then(function(data) {
                    for (var i = 0; i < $scope.poll.options.length; i++) {
                        $scope.poll.options[i].imageURL = data[i].data.value[0].contentUrl;
                        $scope.poll.options[i].text = $scope.poll.options[i].text.replace(/\b\w/g, function(l) {
                            return l.toUpperCase()
                        });
                    }
                    postPoll();
                });
        } else {
            alert("Not Valid Poll");
        }
    }
});
