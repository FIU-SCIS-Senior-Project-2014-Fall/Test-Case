using DataStore.Adapters.Composites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.TestFlow.Composites
{
    class TestFlowStepHelper : TestFlowCompositeBase, IStepHelper
    {
        public int Create(TestStep item)
        {
            throw new NotImplementedException();
        }

        public bool Edit(TestStep item)
        {
            throw new NotImplementedException();
        }

        public TestStep Get(int id)
        {
            throw new NotImplementedException();
        }

        public List<TestStep> GetFromParent(int parentId)
        {
            throw new NotImplementedException();
        }
    }
}
