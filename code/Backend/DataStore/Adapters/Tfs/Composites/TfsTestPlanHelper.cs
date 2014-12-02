using DataStore.Adapters.Composites;
using DataStore.EntityData;
using Microsoft.TeamFoundation.TestManagement.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.Tfs.Composites
{
    class TfsTestPlanHelper : TfsCompositeBase, DataStore.Adapters.Composites.ITestPlanHelper
    {
        public TfsTestPlanHelper(ITestManagementService testManagementService)
            : base(testManagementService)
        { }
        public int Create(TestPlan item)
        {
            throw new NotImplementedException();
        }

        public bool Edit(TestPlan item)
        {
            throw new NotImplementedException();
        }

        public TestPlan Get(int id)
        {
            throw new NotImplementedException();
        }

        public List<TestPlan> GetFromParent(int parentId)
        {
            throw new NotImplementedException();
        }
    }
}
