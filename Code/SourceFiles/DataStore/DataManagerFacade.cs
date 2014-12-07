using DataStore;
using DataStore.Adapters;
using DataStore.Adapters.TestFlow.Composites;
using DataStore.SyncStores;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Text;

public class DataManagerFacade
{
    private UserCollections dataStores;

    private IPrincipal User;

    public DataManagerFacade(IPrincipal user, int projectId)
    {
        User = user;
        dataStores = ConfigurationStore.getUserConfiguration(user, projectId);
    }

    public DataManagerFacade(IPrincipal user, int projectId, int testPlanId)
    {
        User = user;
        dataStores = ConfigurationStore.getUserConfiguration(user, projectId, testPlanId);
    }

    public DataManagerFacade(IPrincipal user, int projectId, int testPlanId, int testCaseId)
    {
        User = user;
        dataStores = ConfigurationStore.getUserConfiguration(user, projectId, testPlanId, testCaseId);
    }

    // Projects Stuff
    //*****************************************************************************

    public Project GetProject(int id)
    {
        return dataStores.tfStore.Projects.Get(id);
    }

    public List<Project> GetProjects()
    {
        List<IDataStoreAdapter> dStores = ConfigurationStore.GetAllUserStores(dataStores.tfStore.User.User_Id);
        SyncManager.SyncProjects(dStores, dataStores.tfStore);
        TestFlowProjectHelper tfph = (TestFlowProjectHelper)dataStores.tfStore.Projects;
        return tfph.GetAll(dataStores.tfStore.User.User_Id);
    }

    //*****************************************************************************
    // End Projects Stuff

    // TestPlan Stuff
    //*****************************************************************************

	public void CreateTestPlan(TestPlan testPlan)
    {
        testPlan.ExternalId = dataStores.collection.TestPlans.Create(testPlan);
        dataStores.tfStore.TestPlans.Create(testPlan);
    }

    public void EditTestPlan(TestPlan testPlan)
    {
        if (dataStores.collection.TestPlans.Edit(testPlan))
            dataStores.tfStore.TestPlans.Edit(testPlan);
    }

    public TestPlan GetTestPlan(int id)
    {
        return dataStores.tfStore.TestPlans.Get(id);
    }

    public List<TestPlan> GetTestPlans(int projectId)
    {
        List<TestPlan> externalPlans = dataStores.collection.TestPlans.GetFromParent(projectId); // this id doesn't matter because project is being set elsewhere
        List<TestPlan> internalPlans = dataStores.tfStore.TestPlans.GetFromParent(projectId);
        SyncManager.SyncTestPlans(internalPlans, externalPlans, dataStores.tfStore, projectId);
        return dataStores.tfStore.TestPlans.GetFromParent(projectId);
    }

    //*****************************************************************************
    // End TestPlan Stuff

    // Suite Stuff
    //*****************************************************************************

    public void CreateSuite(TestSuite Suite)
    {
        Suite.ExternalId = dataStores.collection.Suites.Create(Suite);
        dataStores.tfStore.Suites.Create(Suite);
    }

    public void EditSuite(TestSuite Suite)
    {
        if (dataStores.collection.Suites.Edit(Suite))
            dataStores.tfStore.Suites.Edit(Suite);
    }

    public TestSuite GetSuite(int id)
    {
        return dataStores.tfStore.Suites.Get(id);
    }

    public List<TestSuite> GetSuites(int testPlanId)
    {
        TestPlan testPlan = GetTestPlan(testPlanId);
        List<TestSuite> externalSuites = dataStores.collection.Suites.GetFromParent(testPlan.ExternalId);
        List<TestSuite> internalSuites = dataStores.tfStore.Suites.GetFromParent(testPlanId);
        SyncManager.SyncSuites(internalSuites, externalSuites, dataStores.tfStore, testPlanId);
        return dataStores.tfStore.Suites.GetFromParent(testPlanId);
    }

    //*****************************************************************************
    // End Suite Stuff

    // TestCase Stuff
    //*****************************************************************************

    public void CreateTestCase(TestCase TestCase)
    {
        TestCase.ExternalId = dataStores.collection.TestCases.Create(TestCase);
        dataStores.tfStore.TestCases.Create(TestCase);
    }

    public void EditTestCase(TestCase TestCase)
    {
        if (dataStores.collection.TestCases.Edit(TestCase))
            dataStores.tfStore.TestCases.Edit(TestCase);
    }

    public TestCase GetTestCase(int id)
    {
        return dataStores.tfStore.TestCases.Get(id);
    }

    public List<TestCase> GetTestCases(int projectId)
    {
        //call sync
        return dataStores.tfStore.TestCases.GetFromParent(projectId);
    }

    //*****************************************************************************
    // End TestCase Stuff

    // Step Stuff
    //*****************************************************************************

    public void CreateStep(TestStep Step)
    {
        Step.ExternalId = dataStores.collection.Steps.Create(Step);
        dataStores.tfStore.Steps.Create(Step);
    }

    public void EditStep(TestStep Step)
    {
        if (dataStores.collection.Steps.Edit(Step))
            dataStores.tfStore.Steps.Edit(Step);
    }

    public TestStep GetStep(int id)
    {
        return dataStores.tfStore.Steps.Get(id);
    }

    public List<TestStep> GetSteps(int projectId)
    {
        //call sync
        return dataStores.tfStore.Steps.GetFromParent(projectId);
    }

    //*****************************************************************************
    // End Step Stuff

}

