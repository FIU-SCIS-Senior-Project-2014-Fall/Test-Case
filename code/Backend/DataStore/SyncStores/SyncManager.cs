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
                foreach (Project p in tfProjects)
                {
                    bool exist = false;
                    foreach (var ip in daProjects)
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
                        tfStore.Projects.Create(p);
                    }
                }
            }
        }

        public static void SyncTestPlans(List<TestPlan> testFlowProjects, List<TestPlan> externalProjects)
        {

        }

        public static void SyncSuites(List<TestSuite> testFlowProjects, List<TestSuite> externalProjects)
        {

        }

        public static void SyncTestCases(List<TestCase> testFlowProjects, List<TestCase> externalProjects)
        {

        }

        public static void SyncTestSteps(List<TestStep> testFlowProjects, List<TestStep> externalProjects)
        {

        }
    }
}
