using DataStore.Adapters.Composites;
using Microsoft.TeamFoundation.TestManagement.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.Tfs.Composites
{
    class TfsTestCaseHelper : TfsCompositeBase, DataStore.Adapters.Composites.ITestCaseHelper
    {
        public TfsTestCaseHelper(ITestManagementService testManagementService)
            : base(testManagementService)
        { }
        public int Create(TestCase item)
        {
            throw new NotImplementedException();
        }

        public bool Edit(TestCase item)
        {
            throw new NotImplementedException();
        }

        public TestCase Get(int id)
        {
            throw new NotImplementedException();
        }

        public List<TestCase> GetFromParent(int parentId)
        {
            throw new NotImplementedException();
        }
    }
}
