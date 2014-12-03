using DataStore.Adapters.Composites;
using Microsoft.TeamFoundation.TestManagement.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.Tfs.Composites
{
    public class TfsTestCaseHelper : TfsCompositeBase, DataStore.Adapters.Composites.ITestCaseHelper
    {
        private ITestPlan testPlan;
        public TfsTestCaseHelper(ITestManagementService testManagementService, string projectName, int testPlanId)
            : base(testManagementService, projectName)
        {
            Microsoft.TeamFoundation.TestManagement.Client.ITestPlanHelper planHelper = this.testManagementProject.TestPlans;
            testPlan = planHelper.Find(testPlanId);
        }
    
        public int Create(TestCase item)
        {
            IStaticTestSuite suite = FindSuite(testPlan.RootSuite.Entries, item.TestSuite.Id);

            if (suite == null)
                return -1;
            ITestCase testCase = testManagementProject.TestCases.Create();
            testCase.Title = item.Name;
            testCase.Description = item.Description;

            suite.TestCases.Add(testCase);
            try
            {
                testPlan.Save();
                return testCase.Id;
            }
            catch(Exception e)
            {
                return -1;
            }
        }

        public bool Edit(TestCase item)
        {
            ITestCase testCase = testManagementProject.TestCases.Find(item.ExternalId);
            testCase.Title = item.Name;
            testCase.Description = item.Description;
            try
            {
                testPlan.Save();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public TestCase Get(int id)
        {
            ITestCase tfsCase = testManagementProject.TestCases.Find(id);

            if (tfsCase == null)
                return null;

            TestCase testCase = new TestCase();

            testCase.Name = tfsCase.Title;
            testCase.Description = tfsCase.Description;
            testCase.ExternalId = tfsCase.Id;


            return testCase;
        }

        public List<TestCase> GetFromParent(int parentId)
        {
            IStaticTestSuite suite = FindSuite(testPlan.RootSuite.Entries, parentId);

            List<TestCase> testCases = new List<TestCase>();

            foreach(ITestCase tc in suite.AllTestCases)
            {
                TestCase testCase = new TestCase();
                testCase.Name = tc.Title;
                testCase.Description = tc.Description;
                testCase.ExternalId = tc.Id;
                testCases.Add(testCase);
            }

            return testCases;
        }

        private IStaticTestSuite FindSuite(ITestSuiteEntryCollection collection, int id)
        {
            foreach (ITestSuiteEntry entry in collection)
            {
                IStaticTestSuite suite = entry.TestSuite as IStaticTestSuite;

                if (suite != null)
                {
                    if (suite.Id == id)
                        return suite;
                    else if (suite.Entries.Count > 0)
                        FindSuite(suite.Entries, id);
                }
            }
            return null;
        } 
    }
}
