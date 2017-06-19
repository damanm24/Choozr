/**
 * Created by daman on 5/31/2017.
 */
var app = angular.module('Choozr', ["ngCookies", "ui.router", "infinite-scroll"]);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/partials/home.html'
    })
    .state('myPolls', {
      url: '/myPolls',
      templateUrl: '/partials/myPolls.html'
    });

});
