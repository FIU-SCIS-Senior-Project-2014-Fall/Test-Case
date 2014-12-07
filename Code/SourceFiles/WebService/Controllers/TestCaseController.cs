using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace TestFlow.Controllers
{
    public class TestCaseController : ApiController
    {
        // GET: api/TestCase
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [Route("api/TestCases/{ProjectId}/{TestPlanId}/{TestCaseId}")]
        public string Get(string ProjectId, int TestPlanId, int TestCaseId)
        {
            return CredentialCache.DefaultNetworkCredentials.UserName;
        }

        // POST: api/TestCase
        [Route("api/TestCases/{ProjectName}/{TestPlanId}/{TestCaseId}")]
        public void Post(string ProjectName, int TestPlanId, int TestCaseId,[FromBody]string value)
        {
        }

        // PUT: api/TestCase/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/TestCase/5
        public void Delete(int id)
        {
        }
    }
}
