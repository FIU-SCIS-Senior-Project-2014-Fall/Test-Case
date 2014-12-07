using Newtonsoft.Json.Linq;
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
        [Route("api/Suites/{ProjectId}/{TestPlanId}")]
        public IEnumerable<TestSuite> Get(int ProjectId, int TestPlanId)
        {
            TestFlowManager tfManager = new TestFlowManager(User, ProjectId, TestPlanId);
            return tfManager.GetSuites(TestPlanId);
        }

        [Route("api/Suites/{ProjectId}/{TestPlanId}/{SuiteId}")]
        public string Get(int ProjectId, int TestPlanId, int SuiteId)
        {
            return "Not implemented";
        }

        // POST: api/Suites
        [Route("api/Suites/create/{ProjectId}/{TestPlanId}")]
        public void Post(int ProjectId, int TestPlanId, [FromBody]string value)
        {
            TestFlowManager tfManager = new TestFlowManager(User, ProjectId, TestPlanId);
            TestSuite suite = new TestSuite();
            JObject result = JObject.Parse(value);
            suite.Name = (string)result["name"];
            suite.Description = (string)result["summary"];
            suite.Parent = Convert.ToInt32(result["parent"]);
            suite.TestPlan = TestPlanId;
            tfManager.CreateSuite(suite);
        }

        // PUT: api/Suites/5
        [Route("api/Suites/edit/{ProjectId}/{TestPlanId}")]
        public void Put(int id, [FromBody]string value)
        {
            
        }

        // DELETE: api/Suites/5
        public void Delete(int id)
        {
        }
    }
}
