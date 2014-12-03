﻿using DataStore.Adapters.Composites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataStore.Adapters
{
    public interface IDataStoreAdapter
    {
        Uri Host { get; set; }
        int Id { get; set; }
        string Name { get; set; }

        // helper objects for each test item type
        IProjectHelper Projects { get; }
        ITestPlanHelper TestPlans { get; }
        ISuiteHelper Suites { get; }
        ITestCaseHelper TestCases { get; }
        IStepHelper Steps { get; }
    }
}

