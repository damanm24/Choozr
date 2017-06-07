function ViewPollsCtrl($scope, $http) {
  $scope.loadPage = function() {
    $http.get('/api/getPolls/').success(function (allPolls) {
      console.log(allPolls);
    });
  };
}
