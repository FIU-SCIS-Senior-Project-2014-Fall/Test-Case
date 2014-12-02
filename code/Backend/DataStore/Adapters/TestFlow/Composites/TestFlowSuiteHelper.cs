using DataStore.Adapters.Composites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.TestFlow.Composites
{
    class TestFlowSuiteHelper : TestFlowCompositeBase, ISuiteHelper
    {
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
    }
}
