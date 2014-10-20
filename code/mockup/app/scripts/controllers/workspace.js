'use strict';

/**
 * @ngdoc function
 * @name initProjApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the initProjApp
 */
angular.module('initProjApp').controller('WorkspaceCtrl', function ($scope, storage) {

	$scope.timeOut = 0;

	$scope.resc = {
		"cpyChd": "Copy Children",
		"ascFile": "Associate File",
		"filesOk": "All files are OK!",
		"filesChg": "A file has changed since last test!",
		"filesRmv": "A file has been removed since last test!",
		"tfs": "TFS",
		"localStore": "Local",
		"pasteSteps": "Paste Steps"
	};
  	storage.bind($scope,'entries');

  	$scope.viewType = 'ANYTHING';

  	if(!$scope.types || $scope.types.length < 3)
		$scope.types = ['step', 'case', 'suite'];

	if(!$scope.entries || $scope.entries.length <= 0) {
	    $scope.entries = [];
	    addEntry({
			"id" : $scope.createId(),
			"name" : "Test Suite 1",
			"type" : "suite",
			"parent" : 0,
			"size" : sizeByType("suite"),
			"children" : []
		});
	}

	$scope.copyBuffer = false;
	$scope.active = 0;
	$scope.suite = $scope.entries[0];

	if(!$scope.idStore || $scope.idStore <= 0)
		$scope.idStore = 1;

	$scope.createId = function() {
		$scope.idStore++;
		return $scope.idStore;
	}

	setTimeout(function() { $('.input-group-addon .glyphicon').tooltip();}, 1000);

	$scope.clearStorage = function() {
		storage.clearAll();
		storage.bind($scope,'entries');
		$scope.entries = [];
	    addEntry({
			"id" : $scope.createId(),
			"name" : "Default Suite after clear",
			"type" : "suite",
			"parent" : 0,
			"size" : sizeByType("suite"),
			"store" : ["Local"],
			"children" : []
		});
		$scope.suite = $scope.entries[0];
	}

	$scope.copySteps = function(index) {
		$scope.copyBuffer = $scope.entries[$scope.active].children[index].children.deepClone();
		console.log($scope.copyBuffer);
	}

	$scope.pasteSteps = function(index) {
		if(!$scope.copyBuffer)
			return;
		var len = $scope.entries[$scope.active].children[index].children.length;
		var i = 0;
		// alter step parents, also attempt to give uniqueness to object, else repeater will fail.
		$scope.copyBuffer = $scope.copyBuffer.map(function(x) { x.name += " >> from " + $scope.entries[$scope.active].children[x.parent].name; x.parent = index; x.id = $scope.createId(); return x; });

		var len = $scope.entries[$scope.active].children[index].children.length;
		if(len > 0) {
			$scope.entries[$scope.active].children[index].children = $scope.entries[$scope.active].children[index].children.concat($scope.copyBuffer);
		}
		else
			$scope.entries[$scope.active].children[index].children = $scope.copyBuffer;
		if(len < $scope.entries[$scope.active].children[index].children.length) {
			$scope.copyBuffer = false;
			toastr.success('Copy Success!', 'The children were copied successfully.');
		} else {
			toastr.error('Copy Error', 'Copy operation was not successful, entries still in buffer.');
		}
	}

	$scope.hasCopyBuffer = function() {
		return $scope.copyBuffer != false;
	}

	$scope.preventDefault = function(event) {
		event.preventDefault();
	};

	$scope.makeActive = function(index) {
		$scope.active = index;
		$scope.suite = $scope.entries[index];
	}

	$scope.isActive = function(index) {
		if(index == $scope.active)
			return "active";
	}

	$scope.addStore = function(index, storeName) {
		var id = $.inArray(storeName, $scope.entries[index].store);
		if(id < 0)
			$scope.entries[index].store.push(storeName);
	}

	$scope.hasStore = function(index, storeName) {
		if($.inArray(storeName, $scope.entries[index].store) >= 0)
			return true;
		return false;
	}

	$scope.removeStore = function(index, storeName) {
		var id = $.inArray(storeName, $scope.entries[index].store);
		if(id >= 0)
			$scope.entries[index].store.splice(id, 1);
	}

	$scope.toggleStore = function(index, storeName) {
		if($scope.hasStore(index, storeName))
			$scope.removeStore(index, storeName);
		else
			$scope.addStore(index, storeName);
	}

	$scope.addSuite = function() {
		addEntry({
			"id" : $scope.createId(),
			"name" : "New Suite",
			"type" : "suite",
			"parent" : 0,
			"store" : ["Local"],
			"size" : sizeByType("suite"),
			"children" : []
		});
	}

	$scope.collapse = function(index) {
		$("#case-body"+index).toggle();
	}

    $scope.demoteClicked = function(index) {
    	var type = $scope.typeDownOne($scope.entries[index].type);
		if(type != false) {
			var copy = cloneEntry(index, true);
			copy.id = $scope.createId();
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

    $scope.addCaseClicked = function(index) {
    	addSubEntry(index, -1);
    };

    $scope.addStepClicked = function(index, parent) {
    	addSubEntry(index, parent);
    };

    $scope.removeEntryClicked = function(index) {
    	$scope.entries.splice(index, 1);
    	$scope.active = $scope.entries.length - 1;
    	$scope.suite = $scope.entries[$scope.active];
    };

    $scope.removeCaseEntryClicked = function(parent, index) {
    	$scope.entries[parent].children.splice(index, 1);
    }

    $scope.removeStepEntryClicked = function(suite, parent, index) {
    	$scope.entries[suite].children[parent].children.splice(index, 1);
    }

    $scope.saveEntry = function() {
    	clearTimeout($scope.timeOut);
    	$scope.timeOut = setTimeout(function() {

    	}, 1000);
    }

    function demoteEntry(entry, index, parent) {
		entry.id = $scope.createId();
		entry.parent = (parent >= 0) ? parent : findAdjacentSibling($scope.entries[index].id, $scope.entries[index].type).id;
		entry.type = $scope.typeDownOne($scope.entries[index].type);
		entry.size = sizeByType($scope.entries[index].type);
		return entry;
    }

	function cloneEntry(index, incChildren) {
		return {
			"id" : $scope.createId(),
			"name" : $scope.entries[index].name,
			"type" : $scope.entries[index].type,
			"parent" : $scope.entries[index].id,
			"store" : $scope.entries[index].store,
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

	function addEntry() {
		$scope.entries.push( {
			"id" : $scope.createId(),
			"name" : "New Suite",
			"type" : $scope.types[2],
			"parent" : 0,
			"store" : ["Local"],
			"size" : sizeByType($scope.types[2]),
			"children" : []
		});
	};

	function addSubEntry(index, parent) {
		if(parent >= 0) {
			var type = $scope.typeDownOne($scope.entries[parent].children[index].type);
			$scope.entries[parent].children[index].children.push( {
				"id" : $scope.createId(),
				"name" : "New " + type,
				"type" : type,
				"parent" : $scope.entries[parent].children[index].id,
				"size" : sizeByType(type),
				"children" : []
			});
		} else {
			var type = $scope.typeDownOne($scope.entries[index].type);
			$scope.entries[index].children.push( {
				"id" : $scope.createId(),
				"name" : "New " + type,
				"type" : type,
				"parent" : $scope.entries[index].id,
				"size" : sizeByType(type),
				"children" : []
			});
		}
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

	/* utilities */

	Array.prototype.clone = function() {
		return this.slice(0);
	};

	Array.prototype.deepClone = function() {
		return JSON.parse(JSON.stringify(this));
	};

  }).directive("saveEntry", function() {
	  var linkFunction = function(scope, element, attributes) {
	    var entry = element.children()[0];
	    $(paragraph).on("click", function() {
	      $(this).css({ "background-color": "red" });
	    });
	  };

	  return {
	    restrict: "E",
	    link: linkFunction
	  };
	});
