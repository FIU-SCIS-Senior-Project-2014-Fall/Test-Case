using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TestCaseModel;

public class TestCase : IUserInformation
{
    public int Id
    {
        get;
        set;
    }

    public string Name
    {
        get;
        set;
    }
	public virtual List<TestStep> Steps
	{
		get;
		set;
	}

	public virtual string Description
	{
		get;
		set;
	}

	public virtual List<Attachment> Attachments
	{
		get;
		set;
	}

	public virtual List<Tag> Tags
	{
		get;
		set;
	}

	public virtual TestSuite TestSuite
	{
		get;
		set;
	}

    public int LastModifiedBy
    {
        get
        {
            throw new NotImplementedException();
        }
        set
        {
            throw new NotImplementedException();
        }
    }

    public int CreatedBy
    {
        get
        {
            throw new NotImplementedException();
        }
        set
        {
            throw new NotImplementedException();
        }
    }

    public DateTime Created
    {
        get
        {
            throw new NotImplementedException();
        }
        set
        {
            throw new NotImplementedException();
        }
    }

    public DateTime Modified
    {
        get
        {
            throw new NotImplementedException();
        }
        set
        {
            throw new NotImplementedException();
        }
    }

    public int ExternalId
    {
        get;
        set;
    }
}

