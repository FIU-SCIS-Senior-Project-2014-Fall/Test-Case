﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebService.Controllers
{
    public class ProjectsController : ApiController
    {
        private ServiceFacade serviceFacade;

        public ProjectsController()
        {
            serviceFacade = new ServiceFacade();
        }
        // GET: api/Project
        public IEnumerable<Project> Get()
        {
            return serviceFacade.getProjects();
        }

        // GET: api/Project/5
        public Project Get(int id)
        {
            return new Project();
        }
    }
}