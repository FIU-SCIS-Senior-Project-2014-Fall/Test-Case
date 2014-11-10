using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using vTeam.TfsApi;

namespace TFSTest
{
    class Program
    {
        static void Main(string[] args)
        {
            string Uri = "http://tc-dev.cis.fiu.edu:8080/tfs/";
            string Collection = "DefaultCollection";
            string Project = "HelloWorld";
            ICredentials crds = new NetworkCredential("TFS", "test123");

            try
            {
                //var mtmManager = new MtmManager(Uri, Collection, Project);
                var tfsManager = new TfsManager(Uri, Collection, Project, crds);

                var testSuite = tfsManager.CreateWorkItem(tfsManager.GetWorkItemType("Test Suite"), "FIU Hello Suite",
                    new Dictionary<WorkItemField, string>
                {
                });

                var testCase = tfsManager.CreateWorkItem(tfsManager.GetWorkItemType("Test Case"), "HelloHelloHello");

                tfsManager.LinkWorkItems(WorkItemLinkEndType.TestCase, testSuite, testCase.Id);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.InnerException.ToString());
            }
            Console.ReadLine();
            
        }
    }
}
