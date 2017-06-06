
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
