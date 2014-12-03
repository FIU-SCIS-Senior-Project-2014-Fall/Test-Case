﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace TestFlow.Controllers
{
    public class CollectionsController : Controller
    {
        // GET: Collections
        public ActionResult Index()
        {
            TestFlowManager serviceFacade = new TestFlowManager(User, true);
            return View(serviceFacade.GetCollections());
        }

        // GET: Collections/Details/5
        public ActionResult Details(int? id)
        {
            TestFlowManager serviceFacade = new TestFlowManager(User, true);
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Collection tF_Collections = serviceFacade.GetCollection(id.Value);
            if (tF_Collections == null)
            {
                return HttpNotFound();
            }
            return View(tF_Collections);
        }

        // GET: Collections/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Collections/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,Host,Type")] Collection collection)
        {
            TestFlowManager serviceFacade = new TestFlowManager(User, true);
            if (ModelState.IsValid)
            {
                serviceFacade.CreateCollection(collection, collection.Type);
                return RedirectToAction("Index");
            }

            return View(collection);
        }

        // GET: Collections/Edit/5
        public ActionResult Edit(int? id)
        {
            TestFlowManager serviceFacade = new TestFlowManager(User, true);
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Collection collection = serviceFacade.GetCollection(id.Value);
            if (collection == null)
            {
                return HttpNotFound();
            }
            return View(collection);
        }

        // POST: Collections/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Host,Type")] Collection collection)
        {
            TestFlowManager serviceFacade = new TestFlowManager(User, true);
            if (ModelState.IsValid)
            {
                serviceFacade.EditCollection(collection);
                return RedirectToAction("Index");
            }
            return View(collection);
        }

        // GET: Collections/Delete/5
        public ActionResult Delete(int? id)
        {
            /*if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            TF_Collections tF_Collections = db.TF_Collections.Find(id);
            if (tF_Collections == null)
            {
                return HttpNotFound();
            }
             * */
            return HttpNotFound();
            //return View(tF_Collections);
        }

        // POST: Collections/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            
            return RedirectToAction("Index");
        }
    }
}