﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool
//     Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class ConfigurationStore
{
	public virtual object List<Config> configurations
	{
		get;
		set;
	}

	public virtual DataStoreController DataStoreController
	{
		get;
		set;
	}

	public virtual void getUserConfiguration(object User user)
	{
		throw new System.NotImplementedException();
	}

	public virtual void getTestPlanConfiguration(object TestPlan testPlan)
	{
		throw new System.NotImplementedException();
	}

}

