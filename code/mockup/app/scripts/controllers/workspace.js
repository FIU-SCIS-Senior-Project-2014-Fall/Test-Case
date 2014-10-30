'use strict';

/**
 * @ngdoc function
 * @name initProjApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the initProjApp
 */
angular.module('initProjApp').controller('WorkspaceCtrl', function ($scope, storage) {

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
  	storage.bind($scope,'idStore');

  	$scope.disabled = false;
	$scope.canEdit = true;
	
	if(!$scope.idStore || $scope.idStore <= 0)
		$scope.idStore = 1;

	$scope.getEntryTemplate = function () { return {
		"id" : 0,
		"name" : "",
		"type" : "",
		"parent" : 0,
		"parentIndex" : -1,
		"size" : "",
		"order" : 0,
		"tags" : [],
		"result" : "",
		"toggle" : false,
		"summary" : "",
		"store" : ["Local"],
		"children" : [],
		"suites" : []
	}; };

	$scope.createId = function() {
		$scope.idStore++;
		return $scope.idStore;
	}

	$scope.timeOut = 0;

  	$scope.viewType = 'ANYTHING';

  	if(!$scope.types || $scope.types.length < 3)
		$scope.types = ['step', 'case', 'suite'];

	if(!$scope.entries || $scope.entries.length <= 0) {
	    $scope.entries = [];
	    var tmp = $scope.getEntryTemplate();
	    tmp.id = $scope.createId();
	    tmp.name = "New Test Suite";
	    tmp.type = "suite";
	    tmp. size = sizeByType("suite");
	    addEntry(tmp);
	}

	$scope.copyBuffer = false;
	$scope.active = { "index" : 0 };
	$scope.suite = $scope.entries[0];

	setTimeout(function() { $('.input-group-addon .glyphicon').tooltip();}, 1000);

	$scope.clearStorage = function() {
		storage.clearAll();
		storage.bind($scope,'entries');
		$scope.entries = [];
		var tmp = $scope.getEntryTemplate();
		tmp.id = $scope.createId();
		tmp.name = "Cleared";
		tmp.type = "suite";
		tmp.size = sizeByType("suite");
		tmp.store = ["Local"];
	    addEntry(tmp);
	}

	$scope.copySteps = function(index) {
		$scope.copyBuffer = index;
	}

	$scope.pasteSteps = function(index) {
		if($scope.copyBuffer === false)
			return;
		var len = $scope.suite.children[index].children.length;
		var tmp = $scope.suite.children[$scope.copyBuffer].children.deepClone();
		// alter step parents, also attempt to give uniqueness to object, else repeater will fail.
		tmp = tmp.map(function(x) { 
			x.name += " >> from " + $scope.suite.children[$scope.copyBuffer].name; 
			x.id = $scope.createId(); 
			x.parent = $scope.suite.children[index].id; 
			return x; 
		});
		var len = $scope.suite.children[index].children.length;
		if(len > 0) {
			$scope.suite.children[index].children = $scope.suite.children[index].children.concat(tmp);
		}
		else
			$scope.suite.children[index].children = tmp;
		if(len < $scope.suite.children[index].children.length) {
			$scope.copyBuffer = false;
			toastr.success('Copy Success!', 'The children were copied successfully.');
		} else {
			toastr.error('Copy Error', 'Copy operation was not successful, entries still in buffer.');
		}
	}

	$scope.hasCopyBuffer = function() {
		return $scope.copyBuffer !== false;
	}

	$scope.preventDefault = function(event) {
		event.preventDefault();
	};

	$scope.makeActive = function(index, parent, root) {
		$scope.active = {"root": -1, "parent": -1, "index" : -1};
		if(typeof parent === 'undefined' && typeof root === 'undefined') {
			$scope.active.index = index;
			$scope.suite = $scope.entries[index];
		} else if(typeof root === 'undefined') {
			$scope.active.parent = parent;
			$scope.active.index = index;
			$scope.suite = $scope.entries[parent].suites[index];
		} else {
			$scope.active.root = root;
			$scope.active.parent = parent;
			$scope.active.index = index;
			$scope.suite = $scope.entries[root].suites[parent].suites[index];
		}
	}

	$scope.isActive = function(id) {
		if(id == $scope.suite.id)
			return "active";
	}

	/* going to move
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

	end move */

	$scope.addSuite = function() {
		var tmp = $scope.getEntryTemplate();
	    tmp.id = $scope.createId();
	    tmp.name = "New Test Suite";
	    tmp.type = "suite";
	    tmp. size = sizeByType("suite");
	    addEntry(tmp);
	}

	$scope.toggle = function(index) {
		$scope.suite.children[index].toggle = !$scope.suite.children[index].toggle;
	}

	$scope.toggleClass = function(index) {
		if($scope.suite.children[index].toggle)
			return "test-expand";
		else
			return "test-in";
	}

	$scope.toggleButton = function(index) {
		if($scope.suite.children[index].toggle)
			return "glyphicon-chevron-up";
		else
			return "glyphicon-chevron-down";
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

    $scope.addStepClicked = function(index) {
    	addSubEntry(index);
    };

    $scope.removeEntryClicked = function(index) {
    	$scope.entries.splice(index, 1);
    	$scope.makeActive(0);
    };

    $scope.removeCaseEntryClicked = function(index) {
    	$scope.suite.children.splice(index, 1);
    }

    $scope.removeStepEntryClicked = function(parent, index) {
    	$scope.suite.children[parent].children.splice(index, 1);
    	for(var i = index, k = $scope.suite.children[parent].children.length; i < k ; i++)
    		$scope.suite.children[parent].children[i].order = $scope.suite.children[parent].children[i].order - 1;
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

	function addChild(parentId, child) {
		for(var i = 0, j = $scope.entries.length; i < j; i++) {
			if($scope.entries[i].id >= parentId)
				$scope.entries[i].children.push(child);
		}
	}

	$scope.createByEnterKey = function(index, type) {
		if(type == "step" || type == "case")
			addSubEntry(index);
		else
			addSubEntry();
	}

	function addEntry(entry) {
		if(!entry) {
			var tmp = $scope.getEntryTemplate();
		    tmp.id = $scope.createId();
		    tmp.name = "New Test Suite";
		    tmp.type = $scope.types[2];
		    tmp. size = sizeByType($scope.types[2]);
		    $scope.entries.push(tmp);
		} else {
			$scope.entries.push(entry);
		}
	};

	function addSubEntry(index) {
		var tmp = $scope.getEntryTemplate();
		tmp.id = $scope.createId();
		if(typeof index === "undefined") {
			var type = $scope.typeDownOne($scope.suite.type);
			tmp.name = "New " + type;
		    tmp.type = type;
		    tmp.order = $scope.suite.children.length + 1;
		    tmp.size = sizeByType(type);
		    tmp.parent = $scope.suite.id;
			$scope.suite.children.push(tmp);
		} else {
			var type = $scope.typeDownOne($scope.suite.children[index].type);
			tmp.name = "New " + type;
		    tmp.type = type;
		    tmp.order = $scope.suite.children[index].children.length + 1;
		    tmp.size = sizeByType(type);
		    tmp.parent = $scope.suite.children[index].id;
			$scope.suite.children[index].children.push(tmp);
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

	$scope.nestSuite = function (index, parent)
	{
		if(index <= 0)
			return;

		if(typeof parent === 'undefined' && $scope.entries[index].suites.length <= 0) {
			$scope.entries[index].parent = $scope.entries[index - 1].id;
			$scope.entries[index].parentIndex = index - 1;
			$scope.entries[index - 1].suites.push($scope.entries[index]);
			$scope.entries.splice(index, 1);
		} else if($scope.entries[parent].suites[index].suites.length <= 0) { // do not nest to bottom tier if there are children
			$scope.entries[parent].suites[index].parent = $scope.entries[parent].suites[index - 1].id; 
			$scope.entries[parent].suites[index].parentIndex = index - 1;
			$scope.entries[parent].suites[index - 1].suites.push($scope.entries[parent].suites[index]);
			$scope.entries[parent].suites.splice(index, 1);
		}
	};

	$scope.unNestSuite = function (index, parent, root)
	{
		if(index < 0)
			return;
		if(typeof root === 'undefined') {
			$scope.entries[parent].suites[index].parent = 0
			$scope.entries[parent].suites[index].parentIndex = -1;
			$scope.entries.push($scope.entries[parent].suites[index]);
			$scope.entries[parent].suites.splice(index, 1);
		} else {
			$scope.entries[root].suites[parent].suites[index].parent = $scope.entries[root].id;
			$scope.entries[root].suites[parent].suites[index].parentIndex = root;
			$scope.entries[root].suites.push($scope.entries[root].suites[parent].suites[index]);
			$scope.entries[root].suites[parent].suites.splice(index, 1);
		}
	};

	$scope.isSuiteToggle = function(index, parent) {
		if(index < 0)
			return;
		var toggle = false;
		if(typeof parent === 'undefined')
			toggle = $scope.entries[index].toggle;
		else
			toggle = $scope.entries[parent].suites[index].toggle;

		if(toggle)
			return "down";
		else
			return "up";
	};

	$scope.toggleSuite = function(index, parent) {
		if(index < 0)
			return;

		if(typeof parent === 'undefined')
			$scope.entries[index].toggle = !$scope.entries[index].toggle;
		else
			$scope.entries[parent].suites[index].toggle = !$scope.entries[parent].suites[index].toggle;
	}

	$scope.getActiveSuite = function() {
		if(typeof $scope.active.root < 0 && typeof $scope.active.parent < 0) 
			return $scope.getSuite($scope.active.index);
		else if(typeof $scope.active.root < 0)
			return $scope.getSuite($scope.active.index, $scope.active.parent);
		else
			return $scope.getSuite($scope.active.index, $scope.active.parent, $scope.active.root);
	};

	$scope.getSuite = function(index, parent, root) {
		if(typeof root === 'undefined' && typeof parent === 'undefined') 
			return $scope.entries[index];
		else if(typeof root === 'undefined' && parent)
			return $scope.entries[parent].suites[index];
		else
			return $scope.entries[root].suites[parent].suites[index];
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
	};

	/* utilities */

	Array.prototype.clone = function() {
		return this.slice(0);
	};

	Array.prototype.deepClone = function() {
		return JSON.parse(JSON.stringify(this));
	};

  });


angular.module('initProjApp').directive("tfContextmenu", function() {
	return function(scope, element, attributes) {
		$(element).bind("contextmenu", function(e) {
	    	e.preventDefault();
	    	$("<div class='custom-menu'>Custom menu</div>").appendTo("body").css({top: e.pageY + "px", left: e.pageX + "px"});
		});
		return false;
	};
});


// this is rough, still setup with debugging.
angular.module('initProjApp').directive("tfProcesskey", function() 
{
	return function(scope, element, attributes) {
		var className = attributes.tfProcesskey;
	  	element.bind("keydown keypress", function(e) {
	  		if(e.which == 13) {
	  			var id = $(element).attr("id");
	  			var likeElements = $("." + className);
	  			var eq = likeElements.index( $("#" + id) );
	  			var ele = likeElements.eq(eq + 1);
	  			if(ele.length > 0)
	  				ele.focus();
	  			else {
	  				var entry = $(element).attr("entry"), type = $(element).attr("e-type");
	  				scope.createByEnterKey(entry, type);
	  				scope.$apply();
	  				setTimeout(function() {
	  					var id = $(element).attr("id");
			  			var likeElements = $("." + className);
			  			var eq = likeElements.index( $("#" + id) );
			  			var ele = likeElements.eq(eq + 1);
			  			if(ele.length > 0)
			  				ele.focus();
	  				}, 300);
	  			}
	  			e.preventDefault();
	  		}
	  		else if(e.which == 9) {
	  			var id = $(element).attr("id");
	  			var likeElements = $('input.tf-proc-control');
	  			var eq = likeElements.index( $("#" + id) );
	  			var ele = likeElements.eq(eq + 1);
	  			if(ele.length > 0)
	  				ele.focus();
	  			else
	  				$(".edit-title").eq(0).focus()
	  			e.preventDefault();
	  		}
	  		
	  	});
	    
	};
});

