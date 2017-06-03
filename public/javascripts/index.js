/**
 * Created by daman on 5/31/2017.
 */
var app = angular.module('Choozr', []);

app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/addPoll', {templateUrl:'partials/addPoll.html', controller: NewPollCtrl}).
            when('/getPoll/:id', {templateUrl:'partials/getPoll.html', controller: GetPollCtrl}).
            when('/polls', {templateUrl:'partials/getPoll.html', controller: PollListCtrl}).
            otherwise({redirectTo: '/polls'});
}]);

function MainCtrl($scope, $location) {
    $scope.setRoute = function(route) {
        $location.path(route);
    }
}