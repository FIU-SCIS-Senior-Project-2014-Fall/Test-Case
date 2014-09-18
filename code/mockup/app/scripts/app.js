'use strict';

/**
 * @ngdoc overview
 * @name initProjApp
 * @description
 * # initProjApp
 *
 * Main module of the application.
 */
angular
  .module('initProjApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularLocalStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/alternative', {
        templateUrl: 'views/alternative.html',
        controller: 'AlternativeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
