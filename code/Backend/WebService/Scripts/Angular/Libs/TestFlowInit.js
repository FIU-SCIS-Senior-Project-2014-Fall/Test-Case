// init javascript stuff which happens outside of angular.
var testManager = []; // global
$(document).ready(function () {
    testManager = new ProjectManager();
    testManager.getProjectList();
});