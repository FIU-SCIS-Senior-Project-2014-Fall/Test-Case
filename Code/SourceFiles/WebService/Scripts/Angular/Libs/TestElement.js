// test flow managers a project's test plan in the UI
function TestFlow(scope, projectId, testPlanId) {
    var _this = this;                               // this instance because bind may go too deep.
	this.scope = scope;
	this.idStore = 0;
	this.elements = [];
	this.copyBuffer = "";
	this.active = 0;
	this.suite = -1;
	this.projectId = projectId;
	this.testPlanId = testPlanId;
	this.keys = {};
	this.dragId = -1;
	this.dragParent = {}
	this.zIndex = 5000;
	this.modalId = "#myModal";
	this.timeOut = 0;

	this.resourceText = {
	    "cpyChd": "Copy Children",
	    "ascFile": "Associate File",
	    "filesOk": "All files are OK!",
	    "filesChg": "A file has changed since last test!",
	    "filesRmv": "A file has been removed since last test!",
	    "tfs": "TFS",
	    "localStore": "Local",
	    "pasteSteps": "Paste Steps"
	};

    // gets testflow ready for editing, if it can't then it will return false.
	this.init = function () {
	    _this.assignStoredValues();
	    return false; // when 
	}

    // assign all default scope properties
	this.assignStoredValues = function () {
	    // grab the idStore incrementor
        // this is only used when the item is only stored locally
	    if (!_this.scope.idStore || _this.scope.idStore <= 0)
	        scope.idStore = 99999;

        // scope items for using the rich text interface
	    _this.scope.disabled = false;
	    _this.scope.canEdit = true;
	    _this.scope.viewType = 'ANYTHING';

        // ensure entries is an array
	    if (!_this.scope.entries || _this.scope.entries.length <= 0)
	        _this.scope.entries = [];

        // setup empty copy buffer
	    _this.scope.copyBuffer = false;

	    // currently active suite
	    _this.scope.active = { "index": 0 };
	    _this.scope.suite = _this.scope.entries[0];

        // ensure nothing is left over in the search box
	    _this.scope.search_box = "";
	}

    this.createId = function () {
        _this.scope.idStore++;
        return _this.scope.idStore;
    }

    // entity helper objects
    //*********************************************************
	this.PlanHelper = {};
	this.SuiteHelper = {};
	this.CaseHelper = {};
	this.StepHelper = {};
	this.BaseHelper = {};

    // Create methods

	this.SuiteHelper.createSuite = function(name) {
	    var newSuite = _this.BaseHelper.getAtomic(name);
		newSuite.toSuite();
		return newSuite;
	}

	this.CaseHelper.createCase = function(name) {
	    var newCase = _this.BaseHelper.getAtomic(name);
	    newCase.toCase();
		return newCase;
	}

	this.StepHelper.createSharedStep = function(name) {
	    var newSharedStep = _this.BaseHelper.getAtomic(name);
		newSharedStep.toSharedStep();
		return newSharedStep;
	}

	this.StepHelper.createStep = function (name) {
	    var newStep = _this.BaseHelper.getAtomic(name);
	    newStep.toStep();
	    return newStep;
	}

    // type dependant methods

    // suite stuff
	this.SuiteHelper.makeActive = function (index, parent, root) {
	    _this.scope.active = { "root": -1, "parent": -1, "index": -1 };
	    if (typeof parent === 'undefined' && typeof root === 'undefined') {
	        _this.scope.active.index = index;
	        _this.scope.suite = _this.scope.entries[index];
	    } else if (typeof root === 'undefined') {
	        _this.scope.active.parent = parent;
	        _this.scope.active.index = index;
	        _this.scope.suite = _this.scope.entries[parent].suites[index];
	    } else {
	        _this.scope.active.root = root;
	        _this.scope.active.parent = parent;
	        _this.scope.active.index = index;
	        _this.scope.suite = _this.scope.entries[root].suites[parent].suites[index];
	    }
	}

    // checks if a given id is that of the active suite
	this.SuiteHelper.isActive = function (id) {
	    if (id == _this.scope.suite.id)
	        return "active";
	};

	this.SuiteHelper.isSuiteToggle = function (suite) {
	    if (suite && typeof suite != "undefined" && suite.toggle)
	        return "down";
	    else
	        return "up";
	};

	this.SuiteHelper.toggleSuite = function (suite) {
	    if (suite)
	        suite.toggle = !suite.toggle;
	}

    // adds a suite to the current test plan, if parent is not null will add suite as a subsuite to the suite given
	this.SuiteHelper.addSuite = function (name, parent) {
	    var newSuite = _this.SuiteHelper.createSuite(name);
	    if(typeof parent === "undefined")
	        _this.scope.entries.push(newSuite);
	    else
	        parent.suites.push(newSuite);
	    return newSuite;
	};

    // test case methods
	this.CaseHelper.addCase = function (name, suite, index) {
	    var newCase = _this.CaseHelper.createCase(name);
	    if (index === "undefined")
	        suite.children.push(newCase);
	    else
	        suite.children.splice(index, 0, newCase);
	    return newCase;
	};

	this.CaseHelper.addStep = function (name, parent, index) {
	    var newStep = _this.StepHelper.createStep(name);
	    if (index === "undefined")
	        parent.children.push(newStep);
	    else
	        parent.children.splice(index, 0, newStep);
	    return newStep;
	}

    // test case toggles
	_this.CaseHelper.toggle = function (testCase, force) {
	    if (typeof force === "undefined") {
	        testCase.toggle = !testCase.toggle; // flip the bool
	        if (testCase.toggle && testCase.children.length <= 0) // add a step if one doesn't exist and we are opening the case
	            addSubEntry(0, index);
	    }
	    else
	        testCase.toggle = true;
	}

	_this.CaseHelper.toggleDetails = function (testCase) {
	    testCase.toggleDetails = !testCase.toggleDetails;
	}

	_this.CaseHelper.toggleClass = function (testCase) {
	    if (testCase.toggle)
	        return "test-expand";
	    else
	        return "test-in";
	}

	_this.CaseHelper.toggleDetailsClass = function (testCase) {
	    if (testCase.toggleDetails)
	        return " summary-expand";
	    else
	        return "";
	}

	_this.CaseHelper.toggleButton = function (testCase) {
	    if (testCase.toggle)
	        return "glyphicon-chevron-up";
	    else
	        return "glyphicon-chevron-down";
	}

	_this.CaseHelper.toggleDetailsButton = function (testCase) {
	    if (testCase.toggleDetails)
	        return "glyphicon-chevron-up";
	    else
	        return "glyphicon-chevron-down";
	}

	this.BaseHelper.Attributes = {
	    "types": ["suite", "test case", "step", "shared step"],    // types of items manipulated in the workspace
		"sizes" : ["-lg", "", "-sm", "-sm"]                         // suffix for css classes
	};

    // the atomic properties of a test item.
    this.BaseHelper.getAtomic =  function(name) { 
		return {
		    "id": _this.createId(),         // id from the persistant storage or idStore
		    "name": name,                  // name or title of the item
			"type" : null,                  // suite, testcase, or step
			"attributes" : {
				"parent" : -1,              // parent, -1 means it is a root element such as a root suite.
				"size" : "",                // css to be applied
				"toggle" : false,           // whither or not the item is toggled, or fully visible
				"order" : 0,            
				"changed": false,           // represents if the local item does not equal the persistant item
                "new": true                 // represents if an item only exist in local storage
			},
		    // conversion methods
			"toSharedStep": function () {
			    this.result = "";
			    this.children = [];
			    this.size = _this.BaseHelper.Attributes.sizes[2];
			    this.type = _this.BaseHelper.Attributes.types[3];
			},
			"toStep": function () {
			    this.result = "";
			    this.size = _this.BaseHelper.Attributes.sizes[2];
			    this.type = _this.BaseHelper.Attributes.types[2];
			},
			"toCase": function () {
			    this.children = [];
			    this.toggleDetails = false;
			    this.summary = "";
			    this.tags = [];
			    this.size = _this.BaseHelper.Attributes.sizes[1];
			    this.type = _this.BaseHelper.Attributes.types[1];
			},
			"toSuite": function () {
			    this.suites = [];
			    this.children = [];
			    this.toggleDetails = false;
			    this.summary = "";
			    this.size = _this.BaseHelper.Attributes.sizes[0];
			    this.type = _this.BaseHelper.Attributes.types[0];
			}
		};
    };

    this.changed = function (obj) {
        obj.attributes.changed = true;
    }

    //********************************************************************
    // End entity helper objects

    this.sync = function () {
        if (_this.syncSuite())
            console.log("it worked");
        else
            console.log("did didn't work");
    }

    this.syncSuite = function () {
        $.post('/api/Suites/create/' + _this.projectId + "/" + _this.testPlanId, "=" + JSON.stringify( _this.scope.suite ), function (data) {
            if (data > 0) {
                _this.scope.suite.id = data;
                return true;
            }
            else
                return false;
        }).fail(function () {
            return false;
        });
    }

    this.mergeTestPlan = function (data) {
        _this.REC_mergeTestPlan(_this.scope.entries, data);
        _this.scope.$apply();
    };

    this.REC_mergeTestPlan = function (destination, source, parent) {
        if (!source || source.length <= 0)
            return;
        $.each(source, function (index, srcSuite) {
            var hasMatching = false;
            if (destination && destination.length > 0)
                $.each(destination, function (destIndex, destSuite) {
                    if (destSuite.id == srcSuite.Id) {
                        destSuite.attributes.new = false;
                        if (destSuite.name != srcSuite.Name)
                            destSuite.attributes.changed = true;
                        hasMatching = true;

                        _this.REC_mergeTestPlan(destSuite.suites, srcSuite.SubSuites, destSuite);
                    }
                });
            if (!hasMatching) {
                var newSuite;
                if (typeof parent != "undefined")
                    newSuite = _this.SuiteHelper.addSuite(srcSuite.Name, parent);
                else
                    newSuite = _this.SuiteHelper.addSuite(srcSuite.Name);
                newSuite.id = srcSuite.Id;
                newSuite.summary = srcSuite.Description;
                newSuite.attributes.new = false

                _this.REC_mergeTestPlan(null, srcSuite.SubSuites, newSuite);
            }
        });
    };

    
    // Dialogs
    //********************************************************************
    this.dialogs = {};

    // quick toast notification
    this.dialogs.notify = function (title, text, error) {
        if (typeof error === "undefined")
            error = false;
        if (error)
            toastr.error(title, text);
        else
            toastr.success(title, text)
    }

    // modal dialog
    this.dialogs.modal = function (title, html) {
        $(_this.modalId).find(".modal-title").html(title);
        $(_this.modalId).find(".modal-body").html(html);
        $(_this.modalId).modal('show');
    }
    //********************************************************************
    // End Dialogs

    // JS Utilities
    //********************************************************************
    Array.prototype.clone = function () {
        return this.slice(0);
    };

    Array.prototype.deepClone = function () {
        return JSON.parse(JSON.stringify(this));
    };
    // *******************************************************************
    // End Utilities
};