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
            serviceFacade = new ServiceFacade();
        }
        // GET: api/TestPlans/projectName/testPlanId
        [Route("api/TestPlans/{ProjectName}/{Id}")]
        public TestPlan Get(string ProjectName, int Id)
        {
            return serviceFacade.getTestPlan(ProjectName, Id);
        }

        // GET: api/TestPlans/projectName
        [Route("api/TestPlans/{ProjectName}")]
        public IEnumerable<TestPlan> Get(string ProjectName)
        {
            return serviceFacade.getTestPlans(ProjectName);
        }

        public string Get()
        {
            return "Please provide a project or project and test plan id";
        }

        // POST: api/TestPlans
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/TestPlans/5
        [Route("api/TestPlans/edit/{ProjectName}/{Id}")]
        public void Put(string ProjectName, int Id, [FromBody]string value)
        {
            TestPlan plan = new TestPlan();
            plan.Id = Id;
            plan.Name = value;
            plan.Project = ProjectName;
            serviceFacade.editTestItem(plan);
        }

        // DELETE: api/TestPlans/5
        public void Delete(int id)
        {
        }
    }
}
