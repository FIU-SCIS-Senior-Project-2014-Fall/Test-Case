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
        templateUrl: 'views/workspace.html',
        controller: 'WorkspaceCtrl'
      })
      .when('/alternative', {
        templateUrl: 'views/alternative.html',
        controller: 'AlternativeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
