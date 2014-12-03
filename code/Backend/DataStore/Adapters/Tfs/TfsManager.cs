﻿using DataStore.Adapters.Tfs.Composites;
using Microsoft.TeamFoundation.Client;
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

namespace DataStore.Adapters.Tfs
{
    public class TfsManager : IDataStoreAdapter
    {
        private ICredentials credentials;
        private ITestManagementService testManagementService;

        private TfsProjectHelper projectsHelper;
        private TfsTestPlanHelper testPlanHelper;
        private TfsSuiteHelper suiteHelper;
        private TfsTestCaseHelper testCaseHelper;
        private TfsStepHelper stepHelper;

        public DataStore.Adapters.Composites.IProjectHelper Projects
        {
            get { return projectsHelper; }
        }

        public DataStore.Adapters.Composites.ITestPlanHelper TestPlans
        {
            get { return testPlanHelper; }
        }

        public DataStore.Adapters.Composites.ISuiteHelper Suites
        {
            get { return suiteHelper; }
        }

        public DataStore.Adapters.Composites.ITestCaseHelper TestCases
        {
            get { return testCaseHelper; }
        }

        public DataStore.Adapters.Composites.IStepHelper Steps
        {
            get { return stepHelper; }
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public Uri Host { get; set; }

        internal DataStore.Adapters.Tfs.Composites.TfsStepHelper TfsStepHelper
        {
            get
            {
                throw new System.NotImplementedException();
            }
            set
            {
            }
        }

        internal DataStore.Adapters.Tfs.Composites.TfsSuiteHelper TfsSuiteHelper
        {
            get
            {
                throw new System.NotImplementedException();
            }
            set
            {
            }
        }

        internal DataStore.Adapters.Tfs.Composites.TfsTestCaseHelper TfsTestCaseHelper
        {
            get
            {
                throw new System.NotImplementedException();
            }
            set
            {
            }
        }

        internal DataStore.Adapters.Tfs.Composites.TfsTestPlanHelper TfsTestPlanHelper
        {
            get
            {
                throw new System.NotImplementedException();
            }
            set
            {
            }
        }

        internal DataStore.Adapters.Tfs.Composites.TfsProjectHelper TfsProjectHelper
        {
            get
            {
                throw new System.NotImplementedException();
            }
            set
            {
            }
        }

        public TfsManager(string projectName)
        {
            credentials = new NetworkCredential("TFS", "test123"); //CredentialCache.DefaultNetworkCredentials only works using digest;

            var tpc = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(Host);
            //ICredentials crds = new NetworkCredential("TFS", "test123");
            tpc.Credentials = credentials;

            TfsTeamProjectCollection tfsCollection = new TfsTeamProjectCollection(Host, credentials);
            testManagementService = tpc.GetService<ITestManagementService>();

            projectsHelper = new TfsProjectHelper(testManagementService, tpc);

            testPlanHelper = new TfsTestPlanHelper(testManagementService);
            testPlanHelper.ProjectName = projectName;

            suiteHelper = new TfsSuiteHelper(testManagementService);

            testCaseHelper = new TfsTestCaseHelper(testManagementService);

            stepHelper = new TfsStepHelper(testManagementService);

        }
    }
}