// The ProjectManager manages the selection of projects and test plans.
function ProjectManager() {
    var instance = this;
    this.projectList = {};
    this.currentProject = {};
    this.currentProjectTestPlans = {};
    this.currentTestPlan = {};

    // sets the dropdown list with the current avaliable projects from the backend
    this.getProjectList = function() {
        $.ajax({
            url: '/api/Projects',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                instance.registerProjects(data);
            },
            error: function () {
                $("#myModal").find(".modal-title").html("Error Requesting Projects");
                $("#myModal").find(".modal-body").html(
                    'An error occured when requesting the project list from TestFlow.');
                $("#myModal").modal('show');
            }
        });
    }

    // html stuff
    this.registerProjects = function(projectData) {
        $('[aria-labelledby="projectsDDM"] li.removable').remove();
        $.each(projectData, function (key, value) {
            $("<li/>")
                .attr("id", "p" + value.Id)
                .attr("role", "presentation")
                .addClass("removable")
                .html('<a role="menuitem"><strong>' + value.Name + '</strong></a>')
                .click(function () {
                    instance.selectProject(this, value);
                })
                .prependTo('[aria-labelledby="projectsDDM"]');
        });
    }

    // sets the testplans form a given project in the drop down
    this.getTestPlanList = function(projectName) {
        $.ajax({
            url: '/api/TestPlans/' + projectName,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                instance.registerTestPlans(data);
            },
            error: function () {
                $("#myModal").find(".modal-title").html("Error Requesting Project Test Plans");
                $("#myModal").find(".modal-body").html(
                    'An error occured when requesting the test plan list from TestFlow.');
                $("#myModal").modal('show');
            }
        });
    }

    // html stuff
    this.registerTestPlans = function(testPlansData) {
        $('[aria-labelledby="testplansDDM"] li.removable').remove();
        $.each(testPlansData, function (key, value) {
            $("<li/>")
                .attr("role", "presentation")
                .html('<a role="menuitem"><strong>' + value.Name + '</strong></a>')
                .addClass("removable")
                .click(function () {
                    instance.selectTestPlan(this, value);
                })
                .prependTo('[aria-labelledby="testplansDDM"]');
        });
    }

    // selection of a project
    this.selectProject = function(element, project) {
        instance.currentProject = project;
        $(element).parents().find(".active").removeClass("active");
        $(element).addClass("active");
        instance.getTestPlanList(project.Name);
    }

    // selection of a test plan
    this.selectTestPlan = function (element, testPlan) {
        instance.currentTestPlan = testPlan;
        $(element).parents().find(".active").removeClass("active");
        $(element).addClass("active");
        instance.reloadWorkspaceDelegate(instance.currentProject.Name, instance.currentTestPlan.Id);
    }

    // delegate which should be assigned a function from the controller to be find on test plan changes.
    this.reloadWorkspaceDelegate = function (projectName, testPlanId) { };
};