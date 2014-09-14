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

	$scope.types = ['step', 'case', 'suite'];

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
	};

    $scope.demoteClicked = function(index) {
    	var type = $scope.typeDownOne($scope.entries[index].type);
    	if(type != false) {
	    	$scope.entries[index].parent = findAdjacentSibling($scope.entries[index].id, $scope.entries[index].type);
			$scope.entries[index].type = $scope.typeDownOne($scope.entries[index].type);
			$scope.entries[index].size = sizeByType($scope.entries[index].type);
		}
    };

    $scope.promoteClicked = function(index) {
    	$scope.entries[index].parent = findParent($scope.entries[index].id, $scope.entries[index].type);
		$scope.entries[index].type = $scope.typeUpOne($scope.entries[index].type);
		$scope.entries[index].size = sizeByType($scope.entries[index].type);
    };

    $scope.addEntryClicked = function(index) {
    	var copy = cloneEntry(index);
    	copy.name = "New Test " + copy.type;
    	addEntry(copy);
    };

    $scope.removeEntryClicked = function(index) {
    	$scope.entries.splice(index, 1);
    };

	function cloneEntry(index) {
		return {
			"id" : $scope.entries.length,
			"name" : $scope.entries[index].name,
			"type" : $scope.entries[index].type,
			"parent" : $scope.entries[index].id,
			"size" : sizeByType($scope.entries[index].type)
		};
	};

	function addEntry(entry) {
		$scope.entries.push( {
			"id" : entry.id,
			"name" : entry.name,
			"type" : entry.type,
			"parent" : entry.parent,
			"size" : entry.size
		});
	};


	$scope.typeDownOne = function(parentType) {
		if(typeof parentType === 'string')
			parentType = $scope.types.indexOf(parentType);

		if(parentType < $scope.types.length && parentType > 0)
			return $scope.types[parentType - 1];
		else
			return $scope.types[parentType];
	};

	$scope.typeUpOne = function(parentType) {
		if(typeof parentType === 'string')
			parentType = $scope.types.indexOf(parentType);

		if(parentType < ($scope.types.length - 1) && parentType >= 0)
			return $scope.types[parentType + 1];
		else
			return $scope.types[parentType];
	};

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
	};
	// comments to come.
	function findAdjacentSibling(index, type) {
		var lastSibling = false;
		for(var i = 0, j = $scope.entries.length; i < j; i++) {
			if($scope.entries[i].id >= index)
				break;
			if($scope.entries[i].type == type)
				lastSibling = $scope.entries[i];
		}
		return lastSibling;
	};

	function findParent(index, type) {
		type = $scope.types.indexOf(type) - 1;
		if(type >= 0)
			return findAdjacentSibling(index, $scope.types[type]);
		else
			return false;

	};
  });
