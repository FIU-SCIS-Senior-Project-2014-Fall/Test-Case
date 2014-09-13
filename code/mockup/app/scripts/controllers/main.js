'use strict';

/**
 * @ngdoc function
 * @name initProjApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the initProjApp
 */
angular.module('initProjApp')
  .controller('MainCtrl', function ($scope) {
    $scope.testArch = [
      { "id" : 0, "name" : 'Test Suite 1', "type" : "suite", "size" : "-lg" },
      { "id" : 1, "name" : 'Case 1', "type" : "case", "parent" : 0, "size" : "" },
      { "id" : 2, "name" : 'Step 1', "type" : "step", "parent" : 1, "size" : "-sm" }
    ];
  });
