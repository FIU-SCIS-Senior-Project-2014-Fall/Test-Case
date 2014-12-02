using DataStore.Adapters.Composites;
using DataStore.EntityData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.TestFlow.Composites
{
    class TestFlowTestPlanHelper : TestFlowCompositeBase, ITestPlanHelper
    {
        public TestFlowTestPlanHelper(testflowEntities context)
            : base(context)
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
