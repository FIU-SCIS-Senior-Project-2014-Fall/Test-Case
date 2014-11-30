using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using TestFlow.Models;

namespace TestFlow.Controllers
{
    public class CollectionsController : Controller
    {
        private testflowEntities db = new testflowEntities();

        // GET: Collections
        public ActionResult Index()
        {
            return View(db.TF_Collections.ToList());
        }

        // GET: Collections/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            TF_Collections tF_Collections = db.TF_Collections.Find(id);
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
        public ActionResult Create([Bind(Include = "Collection_Id,Name,Host,Type_Id")] TF_Collections tF_Collections)
        {
            if (ModelState.IsValid)
            {
                db.TF_Collections.Add(tF_Collections);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(tF_Collections);
        }

        // GET: Collections/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            TF_Collections tF_Collections = db.TF_Collections.Find(id);
            if (tF_Collections == null)
            {
                return HttpNotFound();
            }
            return View(tF_Collections);
        }

        // POST: Collections/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Collection_Id,Name,Host,Type_Id")] TF_Collections tF_Collections)
        {
            if (ModelState.IsValid)
            {
                db.Entry(tF_Collections).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(tF_Collections);
        }

        // GET: Collections/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            TF_Collections tF_Collections = db.TF_Collections.Find(id);
            if (tF_Collections == null)
            {
                return HttpNotFound();
            }
            return View(tF_Collections);
        }

        // POST: Collections/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            TF_Collections tF_Collections = db.TF_Collections.Find(id);
            db.TF_Collections.Remove(tF_Collections);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
