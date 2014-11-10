'use strict';

/**
 * @ngdoc function
 * @name initProjApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the initProjApp
 */
 var keys = {}, dragId = -1, dragParent = {}, zIndex = 5000; // evil global and drag flag

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

	$scope.search_box = "";
	
	if(!$scope.idStore || $scope.idStore <= 0)
		$scope.idStore = 1;

	$scope.getEntryTemplate = function () { return {
		"id" : 0,
		"name" : "",
		"type" : "",
		"parent" : 0,
		"parentIndex" : -1,
		"size" : "",
		"tags" : [],
		"result" : "",
		"toggle" : false,
		"toggleDetails" : false,
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
	// currently active suite
	$scope.active = { "index" : 0 };
	$scope.suite = $scope.entries[0];

	$scope.clearStorage = function() {
		storage.clearAll();
		storage.bind($scope,'entries');
		$scope.entries = [];
		$scope.addSuite();
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
	$scope.addSuite = function(name, parent, root) {
		if(typeof name === "undefined" && $("#newSuiteText").val().length <= 0)
			return;
		var tmp = $scope.getEntryTemplate();
	    tmp.id = $scope.createId();
	    if(typeof name === "undefined" && $("#newSuiteText").val().length > 0) {
	    	tmp.name = $("#newSuiteText").val();
	    	$("#newSuiteText").val("");
	    } else
			tmp.name = "New Suite";
	    tmp.type = "suite";
	    tmp. size = sizeByType("suite");
	    if(typeof parent === "undefined") {
	    	addEntry(tmp);
	    	$scope.makeActive(0);
	    } else if(typeof root === "undefined") {
	    	addEntry(tmp, parent);
	    	if($scope.isSuiteToggle(parent) != "down")
	    		$scope.toggleSuite(parent);
	    	$scope.makeActive(0, parent);
	    } else {
	    	addEntry(tmp, parent, root);
	    	if($scope.isSuiteToggle(parent, root) != "down")
	    		$scope.toggleSuite(parent, root);
	    	$scope.makeActive(0, parent, root);
	    }
	}

	$scope.toggle = function(index, force) {
		if(typeof force === "undefined") {
			$scope.suite.children[index].toggle = !$scope.suite.children[index].toggle;
			if($scope.suite.children[index].toggle && $scope.suite.children[index].children.length <= 0)
				addSubEntry(index);
		}
		else
			$scope.suite.children[index].toggle = true;
	}

	$scope.toggleDetails = function(index) {
		$scope.suite.children[index].toggleDetails = !$scope.suite.children[index].toggleDetails;
	}

	$scope.toggleClass = function(index) {
		if($scope.suite.children[index].toggle)
			return "test-expand";
		else
			return "test-in";
	}

	$scope.toggleDetailsClass = function(index) {
		if($scope.suite.children[index].toggleDetails)
			return " summary-expand";
		else
			return "";
	}

	$scope.toggleButton = function(index) {
		if($scope.suite.children[index].toggle)
			return "glyphicon-chevron-up";
		else
			return "glyphicon-chevron-down";
	}

	$scope.toggleDetailsButton = function(index) {
		if($scope.suite.children[index].toggleDetails)
			return "glyphicon-chevron-up";
		else
			return "glyphicon-chevron-down";
	}

	$scope.isLast = function(index, arr, css) {
		console.log(index + " , " + arr + " , " + css);
		if(index >= arr.length - 1)
			return css;
		else
			return "";
	};

	$scope.isFirst = function(index, css) {
		if(index <= 0)
			return css;
		else
			return "";
	}

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
    }

    $scope.saveEntry = function() {
    	clearTimeout($scope.timeOut);
    	$scope.timeOut = setTimeout(function() {
    	}, 1000);
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

	function addEntry(entry, parent, root) {
		if(typeof parent === "undefined")
			$scope.entries.splice(0, 0, entry);
		else if(typeof root === "undefined")
			$scope.entries[parent].suites.splice(0, 0, entry);
		else
			$scope.entries[root].suites[parent].suites.splice(0, 0, entry);
	};

	function addSubEntry(index) {
		var tmp = $scope.getEntryTemplate();
		tmp.id = $scope.createId();
		if(typeof index === "undefined") {
			var type = $scope.typeDownOne($scope.suite.type);
		    tmp.type = type;
		    tmp.size = sizeByType(type);
		    tmp.parent = $scope.suite.id;
			$scope.suite.children.push(tmp);
		} else {
			var type = $scope.typeDownOne($scope.suite.children[index].type);
		    tmp.type = type;
		    tmp.size = sizeByType(type);
		    tmp.parent = $scope.suite.children[index].id;
		    $scope.toggle(index, true);
			$scope.suite.children[index].children.push(tmp);
		}
		return tmp.id;
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

	$scope.addNewCaseFromKeyPress = function() {
		var id = addSubEntry();
	  	setTimeout(function() {
			$("#c" + id).focus();
		}, 300);
	}

	$scope.addNewStepFromKeyPress = function(index) {
		var id = addSubEntry(index);
	  	setTimeout(function() {
			$("#st" + id).focus();
		}, 500);
	}

	$scope.changeSuiteOrder = function(id, newPosition) {
		var index = id.replace("suite", "");
		if(index == newPosition - 1)
			return;
		if(newPosition > index)
			newPosition--;
		var temp = $scope.entries[index];
		console.log(index + ", " + id + ", " + newPosition);
		$scope.entries.splice(index, 1);
		if($scope.entries <= newPosition)
			newPosition = $scope.entries.length;
		$scope.entries.splice(newPosition, 0, temp);
	};

	$scope.changeCaseOrder = function(id, newPosition) {
		var index = id.replace("case", "");
		if(index == newPosition - 1)
			return;
		if(newPosition > index)
			newPosition--;
		var temp = $scope.suite.children[index];
		console.log(index + ", " + id + ", " + newPosition);
		$scope.suite.children.splice(index, 1);
		if($scope.suite.children.length <= newPosition)
			newPosition = $scope.suite.children.length;
		$scope.suite.children.splice(newPosition, 0, temp);
	};

	$scope.changeStepOrder = function(id, newPosition, parent) {
		console.log(index + ", " + id + ", " + newPosition + ", " + parent);
		var index = id.replace("step", "");
		if(index == newPosition - 1)
			return;
		if(newPosition > index)
			newPosition--;
		var temp = $scope.suite.children[parent].children[index];
		$scope.suite.children[parent].children.splice(index, 1);
		if($scope.suite.children[parent].children.length <= newPosition)
			newPosition = $scope.suite.children[parent].children.length;
		$scope.suite.children[parent].children.splice(newPosition, 0, temp);
	};

	$scope.reverseZindex = function(e) {
		$(e).css({'z-index': zIndex--, 'position': 'relative'});
	}

	$scope.addIf = function(add, ifNum, compNum) {
		if(ifNum == compNum)
			return compNum + add;
		else
			return compNum;
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

angular.module('initProjApp').directive("tfTooltip", function() {
	return function(scope, element, attributes) {
		element.tooltip();
		return false;
	};
});

angular.module('initProjApp').directive("tfReversezorder", function() {
	return function(scope, element, attributes) {
		scope.reverseZindex(element);
		return false;
	};
});

angular.module('initProjApp').directive("tfDraggable", function() {
	return function(scope, element, attributes) {
		element.bind("dragstart", function(e) {
			var dragEle = $(element).closest(".data-drag");
			dragEle.addClass("dragging");
			dragParent = dragEle.attr("data-drag");
	    	dragId = e.target.id;
		});
		
		element.bind("dragend", function(e) {
			$(element).closest(".drag-container").removeClass("dragging");
			$(".droppable").removeClass("drag-hover");
	    	dragId = -1;
		});
		return false;
	};
});

angular.module('initProjApp').directive("tfDrop", function() {
	return function(scope, element, attributes) {
		element.bind("dragover", function(e) {
			if(dragParent == element.attr("data-drag")) {
				ignoreDrag(e);
				$(this).addClass("drag-hover");
			}
		});
		element.bind("dragleave", function(e) {
			if(dragParent == element.attr("data-drag")) {
				ignoreDrag(e);
				$(this).removeClass("drag-hover");
			}
		});
		element.bind("drop", function(e) {
			if(dragParent == element.attr("data-drag")) {
				ignoreDrag(e);
				if($("#" + dragId).hasClass("test-suite"))
					scope.changeSuiteOrder(dragId, attributes.tfDrop);
				else if($("#" + dragId).hasClass("test-case"))
					scope.changeCaseOrder(dragId, attributes.tfDrop);
				else if($("#" + dragId).hasClass("test-step"))
					scope.changeStepOrder(dragId, attributes.tfDrop, $("#" + dragId).attr("parent"));
				scope.$apply();
			}
		});
		return false;
	};
});

// this is rough, still setup with debugging.
angular.module('initProjApp').directive("tfProcesskey", function() 
{
	return function(scope, element, attributes) {
		var className = attributes.tfProcesskey;
	  	element.bind("keydown", function(e) {
	  		keys[e.which] = true; // add key to current press combo
	  		if(e.which == 13) {
	  			e.preventDefault();
	  			if($(element).attr("e-type") == "suite" && $(element).val().length > 0)
	  				scope.addNewCaseFromKeyPress();
	  			else if($(element).attr("e-type") == "case" && $(element).val().length > 0 && $(element).attr("entry") == $(element).attr("last")) {
	  				scope.addNewCaseFromKeyPress();
	  			} else if($(element).attr("e-type") == "step" && $(element).val().length > 0 && $(element).attr("step-entry") == $(element).attr("last")) {
	  				scope.addNewStepFromKeyPress($(element).attr("entry"));
	  			}
	  			else if($(element).val().length > 0)
	  			{
		  			var id = $(element).attr("id");
		  			var likeElements = $("." + className);
		  			var eq = likeElements.index( $("#" + id) );
		  			var ele = likeElements.eq(eq + 1);
		  			if(ele.length > 0)
		  				ele.focus();
		  		}
		  		scope.$apply();
	  		}
	  		else if(keys[9] && keys[16]) {
	  			e.preventDefault();
	  			if($(element).attr("e-type") == "step") {
	  				scope.addNewCaseFromKeyPress();
					scope.suite.children[$(element).attr("entry")].children.splice($(element).attr("step-entry"), 1);
					scope.suite.children[scope.suite.children.length - 1].name = $(element).val();
					scope.$apply();
	  			}
	  			keys = {};
	  		} else if(e.which == 9) {
	  			e.preventDefault();
	  			if($(element).attr("e-type") == "case" && $(element).attr("entry") > 0) {
	  				var title = $(element).val();
	  				scope.suite.children.splice($(element).attr("entry"), 1);
	  				scope.addNewStepFromKeyPress(($(element).attr("entry") - 1));
	  				scope.toggle($(element).attr("entry") - 1, true);
	  				scope.suite.children[$(element).attr("entry") - 1].children[scope.suite.children[$(element).attr("entry") - 1].children.length - 1].name = title;
	  				scope.$apply();
	  			} else {
		  			var id = $(element).attr("id");
		  			var likeElements = $('input.tf-proc-control');
		  			var eq = likeElements.index( $("#" + id) );
		  			var ele = likeElements.eq(eq + 1);
		  			if(ele.length > 0)
		  				ele.focus();
		  			else
		  				$(".edit-title").eq(0).focus();
		  		}
	  		}
	  	});

		element.bind("keyup", function() {
			keys = {};
		});
	    
	};
});


// drag utilities
function ignoreDrag(e) {
  e.stopPropagation();
  e.preventDefault();
}
