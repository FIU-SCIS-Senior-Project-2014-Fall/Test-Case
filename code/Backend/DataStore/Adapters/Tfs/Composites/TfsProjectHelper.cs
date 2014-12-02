using DataStore.Adapters.Composites;
using Microsoft.TeamFoundation.TestManagement.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.Tfs.Composites
{
    class TfsProjectHelper : TfsCompositeBase, IProjectHelper
    {

        public TfsProjectHelper(ITestManagementService testManagementService)
            : base(testManagementService)
        { }
        public int Create(Project item)
        {
            throw new NotImplementedException();
        }

        public bool Edit(Project item)
        {
            throw new NotImplementedException();
        }

        public Project Get(int id)
        {
            throw new NotImplementedException();
        }

        public List<Project> GetFromParent(int parentId)
        {
            throw new NotImplementedException();
        }
    }
}
