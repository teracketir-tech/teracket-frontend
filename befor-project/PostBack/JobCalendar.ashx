<%@ WebHandler Language="C#" Class="JobCalendar" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;

public class JobCalendar : IHttpHandler, IReadOnlySessionState
{

    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    public void ProcessRequest(HttpContext context)
    {
        string Url = context.Request.Url.Host.Trim().ToLower();
        string HTTP_REFERER = context.Request.ServerVariables["HTTP_REFERER"];
        if (HTTP_REFERER != null && HTTP_REFERER.IndexOf(Url) != -1)
        {
            if (context.Session["Office"] == null) context.Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)context.Session["Office"];

            office = new OfficeDataContext(func.Officecstr.Trim());
            int input = Convert.ToInt32(context.Request.Form["i"]);
            switch (input)
            {
                case 1:
                    GetAlldrpdwnRegisterPersonel();//دریافت کل دراپ دان ها
                    break;
                case 2:
                    RegisterTimeWork();//ثبت ساعت کاری
                    break;
                case 3:
                    GetReportPersonel();//دریافت اطلاعات پرسنلی
                    break;
                case 4:
                    GetInfoEmployer();//دریافت اطلاعات گروه کاری
                    break;
            }

        }

    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراگ دان ها----------------
    //---------------------------------------------------------------------
    public void GetAlldrpdwnRegisterPersonel()
    {
        var Employers = from t in office.ofcBEmployers
                        select new
                        {
                            value = t.numEmployerCode,
                            item = t.strEmployerName,
                        };

        string json1 = serializer.Serialize((object)Employers);

        string json = "[" + json1 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------------ثبت ساعت کاری-------------------------
    //---------------------------------------------------------------------
    public void RegisterTimeWork()
    {
        int EmployerCode = Convert.ToInt32(context.Request.Form["employer"]);
        string TimeIn = context.Request.Form["TimeIn"];
        string TimeOut = context.Request.Form["TimeOut"];
        string TimeDelay = context.Request.Form["TimeDelay"];
        string json = "";
        var Employers = office.ofcBEmployers.Where(c => c.numEmployerCode == EmployerCode).FirstOrDefault();
        if (Employers != null)
        {
            //Employers.strTimeIn = TimeIn;
            //Employers.strTimeOut = TimeOut;
            //Employers.strTimeDelay = TimeDelay;
            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)"1");
            }
            catch
            {
                json = serializer.Serialize((object)"3");
            }
        }
        else
        {
            json = serializer.Serialize((object)"2");
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------دریافت اطلاعات پرسنلی ------------------------
    //----------------------------------------------------------------------
    private void GetReportPersonel()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        //string DateFrom = context.Request.Form["DateFrom"];
        //string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcBEmployers on Convert.ToInt32(t.numEmployerRef) equals t1.numEmployerCode
                        where
                             (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                             &&
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                        //&&
                        //(string.Compare(t.dateRegisterDate, DateFrom) >= 0 && string.Compare(t.dateRegisterDate, DateTo) <= 0)
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t.strFatherName,
                            t.strMelliCode,
                            t1.strEmployerName,
                            t1.numEmployerCode,
                            //t1.strTimeIn,
                            //t1.strTimeOut,
                            //t1.strTimeDelay
                        });


        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.numPersonelCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------دریافت اطلاعات گروه کاری------------------------
    //----------------------------------------------------------------------
    private void GetInfoEmployer()
    {
        int EmployerCode = Convert.ToInt32(context.Request.Form["employer"]);
        var q = (from t in office.ofcBEmployers
                 where t.numEmployerCode == EmployerCode
                 select new
                 {
                     //t.strTimeDelay,
                     //t.strTimeIn,
                     //t.strTimeOut
                 }).FirstOrDefault();
        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}