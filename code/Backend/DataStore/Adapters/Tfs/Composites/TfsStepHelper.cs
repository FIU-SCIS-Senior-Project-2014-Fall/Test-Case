using DataStore.Adapters.Composites;
using Microsoft.TeamFoundation.TestManagement.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.Tfs.Composites
{
    public class TfsStepHelper : TfsCompositeBase, IStepHelper
    {
        public TfsStepHelper(ITestManagementService testManagementService)
            : base(testManagementService)
        { }
    
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
