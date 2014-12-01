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
    
    public partial class TF_Suites
    {
        public TF_Suites()
        {
            this.TF_TestCases = new HashSet<TF_TestCases>();
            this.TF_Suites1 = new HashSet<TF_Suites>();
        }
    
        public int Suite_Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CreatedBy { get; set; }
        public int LastModifiedBy { get; set; }
        public System.DateTime Created { get; set; }
        public System.DateTime Modified { get; set; }
        public int TestPlan_Id { get; set; }
        public int Parent { get; set; }
    
        public virtual TF_TestPlan TF_TestPlan { get; set; }
        public virtual ICollection<TF_TestCases> TF_TestCases { get; set; }
        public virtual ICollection<TF_Suites> TF_Suites1 { get; set; }
        public virtual TF_Suites TF_Suites2 { get; set; }
    }
}
