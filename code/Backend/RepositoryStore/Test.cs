using LibGit2Sharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryStore
{
    public class Test
    {

        public void Connect(string url)
        {
            // Location on the disk where the local repository should be cloned
            string workingDirectory = "dddd";

            // Perform the initial clone
            if(!Repository.IsValid(workingDirectory))
                workingDirectory = Repository.Clone(url, workingDirectory);

            using (var repo = new Repository(workingDirectory))
            {
                Commit commit = repo.Head.Tip;
                foreach (TreeEntry treeEntry in commit.Tree)
                {
                    Console.WriteLine("Path:{0} || Type:{1} || Target:{2}", treeEntry.Path, treeEntry.TargetType, treeEntry.Target);
                    if(treeEntry.TargetType == TreeEntryTargetType.Tree)
                    {
                        foreach(TreeEntry treeChild in  (Tree)treeEntry.Target)
                            Console.WriteLine("        Path:{0} || Type:{1} || Target:{2}", treeChild.Path, treeChild.TargetType, treeChild.Target);
                    }
                        
                }
            }
        }
    }
}
