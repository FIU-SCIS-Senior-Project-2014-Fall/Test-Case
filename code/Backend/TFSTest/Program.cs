using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.WorkItemTracking.Client;
using RepositoryStore;
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
            
            
            //Test repoTest = new Test();
            //repoTest.Connect(@"https://github.com/FIU-SCIS-Senior-Project-2014-Fall/Test-Case.git");

            try
            {
                //var mtmManager = new MtmManager(Uri, Collection, Project);

                //var tfsManager = new TfsManager(Uri, Collection, Project, crds);

                var results = GetTfsProjects(new Uri(Uri + Collection));

                foreach (string s in results)
                {
                    Console.WriteLine(s);
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(e.InnerException.ToString());
            }
            Console.ReadLine();
        }

        private static List<string> GetTfsProjects(Uri tpcAddress)
        {
            var tpc = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(tpcAddress);
            ICredentials crds = new NetworkCredential("TFS", "test123");

            tpc.Credentials = crds;

            //tpc.Authenticate();

            var workItemStore = new WorkItemStore(tpc);
            var projectList = (from Project pr in workItemStore.Projects select pr.Id.ToString()).ToList();

            return projectList;
        }
    }
}
