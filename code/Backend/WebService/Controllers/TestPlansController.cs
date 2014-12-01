using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace TestFlow.Controllers
{
    public class TestPlansController : ApiController
    {
        private ServiceFacade serviceFacade;

        public TestPlansController()
        {
            serviceFacade = new ServiceFacade(User);
        }
        // GET: api/TestPlans/projectName/testPlanId
        [Route("api/TestPlans/{ProjectId}/{Id}")]
        public TestPlan Get(int ProjectId, int Id)
        {
            return serviceFacade.getTestPlan(ProjectId, Id);
        }

        // GET: api/TestPlans/projectName
        [Route("api/TestPlans/{ProjectId}")]
        public IEnumerable<TestPlan> Get(int ProjectId)
        {
            return serviceFacade.getTestPlans(ProjectId);
        }

        public string Get()
        {
            return "Please provide a project or project and test plan id";
        }

        // POST: api/TestPlans/14
        [Route("api/TestPlans/create/{ProjectId}")]
        public void Post(int ProjectId, [FromBody]string value)
        {
            serviceFacade.createTestPlan(ProjectId, value);
        }

        // PUT: api/TestPlans/5
        [Route("api/TestPlans/edit/{ProjectId}/{Id}")]
        public void Put(int ProjectId, int Id, [FromBody]string value)
        {
            TestPlan plan = new TestPlan();
            plan.Id = Id;
            plan.Name = value;
            plan.Project = new Project();
            plan.Project.Id = ProjectId;
            serviceFacade.editTestItem(plan);
        }

        // DELETE: api/TestPlans/5
        public void Delete(int id)
        {
        }
    }
}
