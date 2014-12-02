using DataStore.Adapters.Composites;
using DataStore.EntityData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Adapters.TestFlow.Composites
{
    class TestFlowProjectHelper : TestFlowCompositeBase, IProjectHelper
    {
        public int Create(Project item)
        {
            throw new NotImplementedException("Projects cannot be created from TestFlow at this time.");
        }

        public bool Edit(Project item)
        {
            throw new NotImplementedException("Projects cannot be edited in TestFlow at this time.");
        }

        public Project Get(int id)
        {
            TF_Projects tfProj = this.context.TF_Projects.Find(id);
            Project project = new Project();
            project.Id = tfProj.Project_Id;
            project.Name = tfProj.Name;
            return project;
        }

        public List<Project> GetFromParent(int parentId)
        {
            throw new NotImplementedException();
        }
    }
}
