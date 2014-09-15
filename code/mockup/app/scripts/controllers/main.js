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
			"size" : sizeByType("suite"),
			"children" : []
		});
	}

	$scope.types = ['step', 'case', 'suite'];

	setTimeout(function() { $('.input-group-addon .glyphicon').tooltip();}, 1000);
	setTimeout(function() { 
		toastr.success('File Updated', 'The file "test.cs" has been updated since last tested.');
	}, 5000);
	setTimeout(function() { 
		toastr.error('File Removed', 'The file "test.cs" associated with "test case" has been removed.');
	}, 4000);

	$scope.clearStorage = function() {
		storage.clearAll();
		storage.bind($scope,'entries');
		$scope.entries = [];
	    addEntry({
			"id" : 0,
			"name" : "Default Suite after clear",
			"type" : "suite",
			"parent" : 0,
			"size" : sizeByType("suite"),
			"children" : []
		});
	}

	$scope.preventDefault = function(event) {
		event.preventDefault();
	};

    $scope.demoteClicked = function(index) {
    	var type = $scope.typeDownOne($scope.entries[index].type);
		if(type != false) {
			var copy = cloneEntry(index, true);
			copy.id = $scope.entries[index].children.length;
			copy.parent = findAdjacentSibling($scope.entries[index].id, $scope.entries[index].type).id;
			copy.type = $scope.typeDownOne($scope.entries[index].type);
			copy.size = sizeByType($scope.entries[index].type);
			console.log(copy);
			addChild(copy.parent, copy);
			$scope.entries.splice(index, 1);
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
    	console.log(copy);
    	addEntry(copy);
    };

    $scope.removeEntryClicked = function(index) {
    	$scope.entries.splice(index, 1);
    };

    function demoteEntry(entry, index, parent) {
			entry.id = $scope.entries[index].children.length;
			entry.parent = (parent >= 0) ? parent : findAdjacentSibling($scope.entries[index].id, $scope.entries[index].type).id;
			entry.type = $scope.typeDownOne($scope.entries[index].type);
			entry.size = sizeByType($scope.entries[index].type);
			return entry;
    }

	function cloneEntry(index, incChildren) {
		return {
			"id" : $scope.entries.length,
			"name" : $scope.entries[index].name,
			"type" : $scope.entries[index].type,
			"parent" : $scope.entries[index].id,
			"size" : sizeByType($scope.entries[index].type),
			"children" : [] // always clear children
		};
	};

	function addChild(parentId, child) {
		for(var i = 0, j = $scope.entries.length; i < j; i++) {
			if($scope.entries[i].id >= parentId)
				$scope.entries[i].children.push(child);
		}
	}

	function addEntry(entry) {
		$scope.entries.push( {
			"id" : entry.id,
			"name" : entry.name,
			"type" : entry.type,
			"parent" : entry.parent,
			"size" : entry.size,
			"children" : entry.children
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
