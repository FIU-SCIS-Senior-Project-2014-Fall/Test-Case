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
    
    public partial class TF_User_Permissions
    {
        public int Permission_Id { get; set; }
        public int User_Id { get; set; }
        public int Collection_Id { get; set; }
    
        public virtual TF_Collections TF_Collections { get; set; }
    }
}