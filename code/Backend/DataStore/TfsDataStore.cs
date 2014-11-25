﻿using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.TestManagement.Client;
using Microsoft.TeamFoundation.WorkItemTracking.Client;
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool
//     Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Text;

public class TfsDataStore : DataStoreAdapter
{
    private ICredentials credentials;

    public string Name
    {
        get;
        set;
    }
    public Uri Host
    {
        get;
        set;
    }

    public TfsDataStore()
    {
        credentials = new NetworkCredential("TFS", "test123"); //CredentialCache.DefaultNetworkCredentials;
    }

    public virtual void insertItem(TestPlan testPlan, TestItemBase testElement)
    {
        throw new System.NotImplementedException();
    }

    public virtual void editItem(TestItemBase item)
    {
        if(item.GetType() == typeof(TestPlan))
            editTestPlan((TestPlan) item);
    }

    private void editTestPlan(TestPlan plan)
    {
        var tpc = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(Host);
        //ICredentials crds = new NetworkCredential("TFS", "test123");
        tpc.Credentials = credentials;

        TfsTeamProjectCollection tfsCollection = new TfsTeamProjectCollection(Host, credentials);
        ITestManagementService tms = tpc.GetService<ITestManagementService>();

        // get the project and plan helper
        ITestManagementTeamProject project = tms.GetTeamProject(plan.Project);
        ITestPlanHelper planHelper = project.TestPlans;

        // find the right plan
        ITestPlan tfsPlan = planHelper.Find(plan.Id);

        tfsPlan.Name = plan.Name;
        tfsPlan.Save();
    }

    private void editTestSuite(TestSuite suite)
    {

    }

    public virtual void removeItem(TestStep step)
    {
        throw new System.NotImplementedException();
    }
    /// <summary>
    /// Retrieves all of the test plans under a given project
    /// </summary>
    /// <param name="projectName">Project name</param>
    /// <returns>list of test plans under a given project</returns>
    public List<TestPlan> getPlans(string projectName)
    {
        var tpc = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(Host);
        //ICredentials crds = new NetworkCredential("TFS", "test123");
        tpc.Credentials = credentials;

        TfsTeamProjectCollection tfsCollection = new TfsTeamProjectCollection(Host, credentials);
        ITestManagementService tms = tpc.GetService<ITestManagementService>();

        // setup project
        ITestManagementTeamProject project = tms.GetTeamProject(projectName);
        ITestPlanHelper planHelper = project.TestPlans;

        // query and import all test plans found
        List<TestPlan> planList = new List<TestPlan>();
        foreach (ITestPlan p in planHelper.Query("Select * From TestPlan"))
        {
            TestPlan tp = new TestPlan();
            tp.Id = p.Id;
            tp.Name = p.Name;
            tp.Project = projectName;
            planList.Add(tp);
        }

        return planList;
    }
    /// <summary>
    /// Retrieves all of the projects avaliable to this user for a given TFS Collection
    /// </summary>
    /// <returns>List of serializable projects</returns>
    public List<Project> getProjects()
    {
        var tpc = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(Host);
        //ICredentials crds = new NetworkCredential("TFS", "test123");
        tpc.Credentials = credentials;

        ITestManagementService testManagementService = tpc.GetService<ITestManagementService>();

        var workItemStore = new WorkItemStore(tpc);
        // returns list of tfs projects
        var tfsProjectList = (from Microsoft.TeamFoundation.WorkItemTracking.Client.Project pr in workItemStore.Projects select pr).ToList();

        // convert list into test flow project list
        List<Project> projectList = new List<Project>();
        foreach (Microsoft.TeamFoundation.WorkItemTracking.Client.Project tfsProj in tfsProjectList)
        {
            Project proj = new Project();
            proj.Name = tfsProj.Name;
            proj.Id = tfsProj.Id;
            proj.Store = Name;
            projectList.Add(proj);
        }

        return projectList;
    }
    /// <summary>
    /// Retrieves a test plan and all of its suites
    /// </summary>
    /// <param name="projectName">Project name the test plan resides in</param>
    /// <param name="id">Id of the desired test plan</param>
    /// <returns>Serializable test plan</returns>
    public TestPlan getPlan(string projectName, int id)
    {
        var tpc = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(Host);
        //ICredentials crds = new NetworkCredential("TFS", "test123");
        tpc.Credentials = credentials;

        TfsTeamProjectCollection tfsCollection = new TfsTeamProjectCollection(Host, credentials);
        ITestManagementService tms = tpc.GetService<ITestManagementService>();

        // get the project and plan helper
        ITestManagementTeamProject project = tms.GetTeamProject(projectName);
        ITestPlanHelper planHelper = project.TestPlans;

        // find the right plan
        ITestPlan tfsPlan = planHelper.Find(id);

        // import to our test model
        TestPlan plan = new TestPlan();
        plan.Name = tfsPlan.Name;
        plan.Id = tfsPlan.Id;
        plan.Project = projectName;

        // get the suites
        plan.Suites = getSuites(tfsPlan.RootSuite.SubSuites, -1);

        return plan;
    }
    /// <summary>
    /// Retrieves all child suites form a given suite collection
    /// </summary>
    /// <param name="parentSuite">the parent suite</param>
    /// <param name="parentId">the parents id</param>
    /// <returns>all sub suites down 1 level.</returns>
    private List<TestSuite> getSuites(ITestSuiteCollection parentSuite, int parentId)
    {
        List<TestSuite> suites = new List<TestSuite>();
        // iterate over the TFS Suite Sub Suite colleciton
        foreach (IStaticTestSuite tfsSuite in parentSuite)
        {
            // import into our test model
            TestSuite suite = new TestSuite();
            suite.Name = tfsSuite.Title;
            suite.Id = tfsSuite.Id;
            suite.Description = tfsSuite.Description;
            suite.Parent = parentId;
            // recursively get children
            if (tfsSuite.SubSuites.Count > 0)
                suite.SubSuites = getSuites(tfsSuite.SubSuites, suite.Id);
            suites.Add(suite);
        }
        return suites;
    }
}
