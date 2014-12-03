using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace TestFlow.Controllers
{
    public class SuitesController : ApiController
    {
        // GET: api/Suites/projid/testplanid
        [Route("api/TestPlans/{ProjectId}/{TestPlanId}")]
        public IEnumerable<TestSuite> Get(int ProjectId, int TestPlanId)
        {
            TestFlowManager tfManager = new TestFlowManager(User, ProjectId, TestPlanId);
            return tfManager.GetSuites(TestPlanId);
        }

        // GET: api/Suites/5
        public string Get(int id)
        {
            return "Not implemented";
        }

        // POST: api/Suites
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Suites/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Suites/5
        public void Delete(int id)
        {
        }
    }
}
