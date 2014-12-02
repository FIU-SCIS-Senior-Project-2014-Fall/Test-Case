using DataStore.Adapters.Composites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.TestFlow.Composites
{
    class TestFlowTestCaseHelper : TestFlowCompositeBase, ITestCaseHelper
    {
        public TestFlowTestCaseHelper(testflowEntities context)
            : base(context)
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
