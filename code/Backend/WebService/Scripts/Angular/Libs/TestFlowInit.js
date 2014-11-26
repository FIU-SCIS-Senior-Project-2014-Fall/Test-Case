// init javascript stuff which happens outside of angular.
var testManager = [], testFlow; // globals
$(document).ready(function () {
    testManager = new ProjectManager();
    testManager.getProjectList();
});