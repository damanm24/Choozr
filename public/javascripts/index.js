/**
 * Created by daman on 5/31/2017.
 */
var app = angular.module('Choozr', ["ngRoute", "ngCookies"]);

app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/getPoll/:id', {templateUrl:'partials/getPoll.html', controller: GetPollCtrl}).
            when('/viewPolls', {templateUrl:'partials/viewPolls.html', controller: ViewPollsCtrl}).
            otherwise({redirectTo: '/viewPolls'});
}]);

app.controller("MainCtrl", function($scope, $location, $rootScope) {
    $scope.setRoute = function(route) {
        $location.path(route);
    };
    $rootScope.pollsVotedIn = [];
})
