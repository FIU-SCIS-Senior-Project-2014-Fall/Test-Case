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

public class TestSuite : TestItemBase
{
	public virtual list<TestCase> testCases
	{
		get;
		set;
	}

	public virtual string description
	{
		get;
		set;
	}

	public virtual GUID parent
	{
		get;
		set;
	}

	public virtual TestPlan TestPlan
	{
		get;
		set;
	}

}

