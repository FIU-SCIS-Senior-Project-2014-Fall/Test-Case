﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool
//     Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Text;

public class DataStoreController
{
	private UserCollections dataStores
	{
		get;
		set;
	}

    public DataStoreController(IPrincipal user)
    {
        ConfigurationStore cStore = new ConfigurationStore();
        dataStores = cStore.getUserConfiguration(user);
    }


	public virtual void insertItem(IPrincipal user, TestPlan testPlan, TestItemBase testElement)
	{
		throw new System.NotImplementedException();
	}

	public void insertNewFile(IPrincipal user, TestPlan testPlan, string file)
	{
		throw new System.NotImplementedException();
	}

    public void editTestItem(TestItemBase testItem)
    {
        foreach(DataStoreAdapter dsa in dataStores.adapters)
        {
            dsa.editItem(testItem);
        }
    }

	public List<Project> getProjects()
	{
        // ensure the model holds all external projects accessible
        // and these projects are up to date.
        foreach (DataStoreAdapter dsa in dataStores.adapters)
        {
            List<Project> temp = dsa.getProjects();
            dataStores.tfStore.SyncProjects(temp, dsa.Id);
        }

        return dataStores.tfStore.getProjects();
	}

    public List<TestPlan> getTestPlans(int projectId)
    {
        string projectName = dataStores.tfStore.getProjectName(projectId);
        if (projectName != null)
        {
            List<TestPlan> projects = new List<TestPlan>();
            foreach (DataStoreAdapter dsa in dataStores.adapters)
            {
                dataStores.tfStore.SyncPlans(dsa.getPlans(projectName), projectId);
            }

            return dataStores.tfStore.getPlans(projectId);
        }
        else
            return null;
    }

    public TestPlan getTestPlan(int projectId, int id)
    {
        TestPlan plan = null;
        string projectName = dataStores.tfStore.getProjectName(projectId);
        /*foreach (DataStoreAdapter dsa in dataStores.adapters)
        {
            plan = dsa.getPlan(projectName, id);
            if (plan != null)
                break;
        }*/
        plan = dataStores.tfStore.getPlan(projectId, id);

        return plan;
    }

    // Collections stuff
    public void EditCollection(Collection collection)
    {
        dataStores.tfStore.EditCollection(collection);
    }

    public Collection GetCollection(int id)
    {
        return dataStores.tfStore.GetCollection(id);
    }

    public List<Collection> GetCollections()
    {
        return dataStores.tfStore.GetCollections();
    }

    public void CreateCollection(Collection collection, int type)
    {
        dataStores.tfStore.CreateCollection(collection, type);
    }

}

