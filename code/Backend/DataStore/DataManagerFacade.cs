using DataStore;
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

    // Projects Stuff
    //*****************************************************************************

    public void CreateProject(Project project)
    {
        project.ExternalId = dataStores.collection.Projects.Create(project);
        dataStores.tfStore.Projects.Create(project);
    }

    public void EditProject(Project project)
    {
        if (dataStores.collection.Projects.Edit(project))
            dataStores.tfStore.Projects.Edit(project);
    }

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
        //call sync
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

    public List<TestSuite> GetSuites(int projectId)
    {
        //call sync
        return dataStores.tfStore.Suites.GetFromParent(projectId);
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


    // Collections stuff
    public void EditCollection(Collection collection)
    {
        CollectionHelper cHelper = new CollectionHelper(User.Identity.Name);
        cHelper.EditCollection(collection);
    }

    public Collection GetCollection(int id)
    {
        CollectionHelper cHelper = new CollectionHelper(User.Identity.Name);
        return cHelper.GetCollection(id);
    }

    public List<Collection> GetCollections()
    {
        CollectionHelper cHelper = new CollectionHelper(User.Identity.Name);
        return cHelper.GetCollections();
    }

    public void CreateCollection(Collection collection, int type)
    {
        CollectionHelper cHelper = new CollectionHelper(User.Identity.Name);
        cHelper.CreateCollection(collection, type);
    }

}

