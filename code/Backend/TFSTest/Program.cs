using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;
using System.Threading.Tasks;

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

                ServiceFacade sf = new ServiceFacade();

                var results = sf.getProjects();

                foreach (Project s in results)
                {
                    Console.WriteLine(s.Name + "--" + s.Id);
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(e.InnerException.ToString());
            }
            Console.ReadLine();
        }
    }
}
