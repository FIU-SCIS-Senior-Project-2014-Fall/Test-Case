using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;

public class TestFlowManager
{
    private DataManagerFacade dataManager
	{
		get;
		set;
	}

    public TestFlowManager(IPrincipal user, int projectId)
    {
        dataManager = new DataManagerFacade(user, projectId);
    }

	private IPrincipal user
	{
		get;
		set;
	}

    // Project Stuff
    // *********************************************************************************
	public List<Project> getProjects()
	{
        return dataManager.GetProjects();
	}
    // *********************************************************************************
    // end Project Stuff

    // TestPlan Stuff
    // *********************************************************************************
	public TestPlan GetTestPlan(int testPlanId)
	{
        return dataManager.GetTestPlan(testPlanId);
	}

    public List<TestPlan> GetTestPlans(int projectId)
    {
        return dataManager.GetTestPlans(projectId);
    }

    public void EditTestPlan(TestPlan testPlan)
    {
        dataManager.EditTestPlan(testPlan);
    }

    public void CreateTestPlan(TestPlan testPlan)
    {
        dataManager.CreateTestPlan(testPlan);
    }
    // *********************************************************************************
    // end TestPlan Stuff

    // Suite Stuff
    // *********************************************************************************
    public TestSuite GetSuite(int suiteId)
    {
        return dataManager.GetSuite(suiteId);
    }

    public List<TestSuite> GetSuites(int testPlanId)
    {
        return dataManager.GetSuites(testPlanId);
    }

    public void EditSuite(TestSuite suite)
    {
        dataManager.EditSuite(suite);
    }

    public void CreateSuite(TestSuite suite)
    {
        dataManager.CreateSuite(suite);
    }
    // *********************************************************************************
    // end Suite Stuff

    // TestCase Stuff
    // *********************************************************************************
    public TestCase GetTestCase(int testCaseId)
    {
        return dataManager.GetTestCase(testCaseId);
    }

    public List<TestCase> GetTestCases(int suiteId)
    {
        return dataManager.GetTestCases(suiteId);
    }

    public void EditTestCase(TestCase testCase)
    {
        dataManager.EditTestCase(testCase);
    }

    public void CreateTestCase(TestCase testCase)
    {
        dataManager.CreateTestCase(testCase);
    }
    // *********************************************************************************
    // end TestCase Stuff

    // Step Stuff
    // *********************************************************************************
    public TestStep GetTestStep(int testStepId)
    {
        return dataManager.GetStep(testStepId);
    }

    public List<TestStep> GetTestSteps(int projectId)
    {
        return dataManager.GetSteps(projectId);
    }

    public void EditTestStep(TestStep step)
    {
        dataManager.EditStep(step);
    }

    public void CreateTestStep(TestStep step)
    {
        dataManager.CreateStep(step);
    }
    // *********************************************************************************
    // end Step Stuff

    // collection management metods

    public void EditCollection(Collection collection)
    {
        dataManager.EditCollection(collection);
    }

    public Collection GetCollection(int id)
    {
        return dataManager.GetCollection(id);
    }

    public List<Collection> GetCollections()
    {
        return dataManager.GetCollections();
    }

    public void CreateCollection(Collection collection, int type)
    {
        dataManager.CreateCollection(collection, type);
    }
}

