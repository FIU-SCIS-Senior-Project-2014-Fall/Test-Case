using DataStore.Adapters.Composites;
using Microsoft.TeamFoundation.TestManagement.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.Tfs.Composites
{
    public class TfsSuiteHelper : TfsCompositeBase, ISuiteHelper
    {
        public TfsSuiteHelper(ITestManagementService testManagementService)
            : base(testManagementService)
        { }
    
        public int Create(TestSuite item)
        {
            throw new NotImplementedException();
        }

        public bool Edit(TestSuite item)
        {
            throw new NotImplementedException();
        }

        public TestSuite Get(int id)
        {
            throw new NotImplementedException();
        }

        public List<TestSuite> GetFromParent(int parentId)
        {
            throw new NotImplementedException();
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
                suite.ExternalId = tfsSuite.Id;
                suite.Description = tfsSuite.Description;
                suite.Parent = parentId;
                // recursively get children
                if (tfsSuite.SubSuites.Count > 0)
                    suite.SubSuites = getSuites(tfsSuite.SubSuites, suite.ExternalId);
                suites.Add(suite);
            }
            return suites;
        }
    }
}
