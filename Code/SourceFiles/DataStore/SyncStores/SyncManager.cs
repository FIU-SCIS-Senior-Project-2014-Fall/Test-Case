using DataStore.Adapters;
using DataStore.Adapters.TestFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.SyncStores
{
    class SyncManager
    {
        public static void SyncProjects(List<IDataStoreAdapter> dStores, TestFlowManager tfStore)
        {
            // n^3, however relative to this context n should not be greater than 10
            foreach (IDataStoreAdapter da in dStores)
            {
                List<Project> tfProjects = tfStore.Projects.GetFromParent(da.Id);
                List<Project> daProjects = da.Projects.GetFromParent(0);
                foreach (Project p in daProjects)
                {
                    bool exist = false;
                    foreach (var ip in tfProjects)
                    {
                        if (ip.ExternalId == p.ExternalId)
                        {
                            exist = true;
                            if (!ip.Name.Equals(p.Name))
                            {
                                ip.Name = p.Name;  // only occasion where data flows in reverse besides data that doesn't exist
                                tfStore.Projects.Edit(ip);
                            }
                        }
                    }
                    if (!exist)
                    {
                        p.CollectionId = da.Id;
                        tfStore.Projects.Create(p);
                    }
                }
            }
        }

        public static void SyncTestPlans(List<TestPlan> testFlowPlans, List<TestPlan> externalPlans, TestFlowManager tfStore, int projectId)
        {
            foreach(TestPlan etp in externalPlans)
            {
                bool exist = false;
                foreach (TestPlan tp in testFlowPlans)
                {
                    if(etp.ExternalId == tp.ExternalId)
                    {
                        exist = true;
                        if (!etp.Name.Equals(tp.Name))
                        {
                            tp.Name = etp.Name;
                            tfStore.TestPlans.Edit(tp);
                        }
                    }
                }

                if(!exist)
                {
                    etp.Project = new Project();
                    etp.Project.Id = projectId;
                    tfStore.TestPlans.Create(etp);
                }
            }
        }

        public static void SyncSuites(List<TestSuite> testFlowSuites, List<TestSuite> externalSuites, TestFlowManager tfStore, int testPlanId)
        {
            foreach (TestSuite etp in externalSuites)
            {
                bool exist = false;
                foreach (TestSuite tp in testFlowSuites)
                {
                    if (etp.ExternalId == tp.ExternalId)
                    {
                        exist = true;
                        if (!etp.Name.Equals(tp.Name))
                        {
                            tp.Name = etp.Name;
                            tfStore.Suites.Edit(tp);
                        }

                        if (etp.SubSuites != null && etp.SubSuites.Count > 0)
                            SyncSuites(tp.SubSuites, etp.SubSuites, tfStore, testPlanId);
                    }
                }

                if (!exist)
                {
                    etp.Created = DateTime.Now;
                    etp.TestPlan = testPlanId;
                    etp.CreatedBy = tfStore.User.User_Id;
                    etp.LastModifiedBy = tfStore.User.User_Id;
                    etp.Modified = DateTime.Now;
                    tfStore.Suites.Create(etp);
                    if (etp.SubSuites != null && etp.SubSuites.Count > 0)
                        SyncSuites(new List<TestSuite>(), etp.SubSuites, tfStore, testPlanId);
                }
            }
        }

        public static void SyncTestCases(List<TestCase> testFlowProjects, List<TestCase> externalProjects)
        {

        }

        public static void SyncTestSteps(List<TestStep> testFlowProjects, List<TestStep> externalProjects)
        {

        }
    }
}
