using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using vTeam.TfsApi;

namespace TFSTest
{
    class Program
    {
        static void Main(string[] args)
        {
            string Uri = "http://tc-dev.cis.fiu.edu:8080/tfs";
            string Collection = "DefaultCollection";
            string Project = "HelloWorld";

            var mtmManager = new MtmManager(Uri, Collection, Project);
            var tfsManager = new TfsManager(Uri, Collection, Project);

            var testSuite = tfsManager.CreateWorkItem(tfsManager.GetWorkItemType("Test Suite"), "FIU Hello Suite",
                new Dictionary<WorkItemField, string>
                {
                    {WorkItemField.Stories, "ULV1511"},
                    {WorkItemField.Author1, "Justin Phillips"}
                });
        }
    }
}
