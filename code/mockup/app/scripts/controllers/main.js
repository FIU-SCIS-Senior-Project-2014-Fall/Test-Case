'use strict';

/**
 * @ngdoc function
 * @name initProjApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the initProjApp
 */
angular.module('initProjApp').controller('MainCtrl', function ($scope, storage) {

  	storage.bind($scope,'entries');

  	$scope.viewType = 'ANYTHING';

	if(!$scope.entries || $scope.entries.length <= 0) {
	    $scope.entries = [];
	    addEntry({
			"id" : 0,
			"name" : "Test Suite 1",
			"type" : "suite",
			"parent" : 0,
			"size" : sizeByType("suite")
		});
	}

	setTimeout(function() { $('.input-group-addon .glyphicon').tooltip();}, 1000);

	$scope.clearStorage = function() {
		storage.clearAll();
		storage.bind($scope,'entries');
		$scope.entries = [];
	    addEntry({
			"id" : 0,
			"name" : "Default Suite after clear",
			"type" : "suite",
			"parent" : 0,
			"size" : sizeByType("suite")
		});
	}

	$scope.preventDefault = function(event) {
		event.preventDefault();
	}

    $scope.keyAction = function(event, index) {
    	if(event.keyCode == '13')
    		addSubEntry(index);
    	else if(event.keyCode == '9') {
    		if($scope.entries[index].id > 0) {
		    	$scope.entries[index].parent = findParent($scope.entries[index].id, $scope.entries[index].type);
		    	$scope.entries[index].type = typeDownOne($scope.entries[index].type);
		    	$scope.entries[index].size = sizeByType($scope.entries[index].type);
	    	}
    	}
    };

	function addSubEntry(index) {
		var type = typeDownOne($scope.entries[index].type);
		addEntry({
			"id" : $scope.entries.length,
			"name" : "New Test " + type,
			"type" : type,
			"parent" : $scope.entries[index].id,
			"size" : sizeByType(type)
		});
	}

	function addEntry(entry) {
		$scope.entries.push( {
			"id" : entry.id,
			"name" : entry.name,
			"type" : entry.type,
			"parent" : entry.parent,
			"size" : entry.size
		});
	}


	function typeDownOne(parentType) {
		var newType = "";
		switch(parentType) {
			case "suite" :
				newType = "case";
				break;
			case "case" :
				newType = "step";
				break;
			case "step" :
				newType = "step";
				break;
			default :
				newType = "suite";
				break;
		}
		return newType;
	}

	function sizeByType(type) {
		var size = "";
		switch(type) {
			case "suite" :
				size = "-lg";
				break;
			case "step" :
				size = "-sm";
				break;
			default :
				size = "";
				break;
		}
		return size;
	}

	function findParent(index, type) {
		var lastSibling = 0;
		for(var i = 0, j = $scope.entries.length; i < j; i++) {
			if($scope.entries[i].id >= index)
				break;
			if($scope.entries[i].type == type)
				lastSibling = $scope.entries[i].id;
		}
		return lastSibling;
	}
  });
