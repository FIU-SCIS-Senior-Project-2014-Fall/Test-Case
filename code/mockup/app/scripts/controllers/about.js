'use strict';

/**
 * @ngdoc function
 * @name initProjApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the initProjApp
 */
angular.module('initProjApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
