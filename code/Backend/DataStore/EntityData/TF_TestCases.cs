//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DataStore.EntityData
{
    using System;
    using System.Collections.Generic;
    
    public partial class TF_TestCases
    {
        public TF_TestCases()
        {
            this.TF_Step = new HashSet<TF_Step>();
        }
    
        public int TestCase_Id { get; set; }
        public int Suite_Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CreatedBy { get; set; }
        public int LastModifiedBy { get; set; }
        public System.DateTime Created { get; set; }
        public System.DateTime Modified { get; set; }
    
        public virtual TF_Case_Metrics TF_Case_Metrics { get; set; }
        public virtual ICollection<TF_Step> TF_Step { get; set; }
        public virtual TF_Suites TF_Suites { get; set; }
    }
}
