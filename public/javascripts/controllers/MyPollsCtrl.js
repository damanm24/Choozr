app.controller("MyPollsCtrl", function MyPollsCtrl($scope, $http, $cookies) {

  $scope.polls = {};

  let getPoll = function(id) {
    return new Promise(function(resolve, reject) {
        $http.get('/api/getPoll/' + id)
        .then(function(response) {
          resolve(response);
        })
        .catch(function(err, status) {
          reject(err);
        })
    });
  };

  let getCreatedPollIDs = function() {
    return new Promise(function(resolve, reject) {
      var pollsCreated = JSON.parse($cookies.get('pollsCreated'));
      console.log(pollsCreated);
      if(pollsCreated.length == 0) {
        resolve(1);
      } else if(pollsCreated.length >= 1) {
        resolve(pollsCreated);
      } else {
        resolve(0);
      }
    });
  };


  getCreatedPollIDs().then(function(response) {
    if(response == 1) {
      console.log(response);
    } else if (response == 0) {
      console.log(response);
    } else {
      var promises = [];
      for(var i = 0; i < response.length; i++) {
        promises.push(getPoll(response[i]));
      }
      Promise.all(promises).then(function(responses) {
        $scope.polls = responses;
        console.log(responses);
      })
    }
  });

});
