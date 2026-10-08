<%@ WebHandler Language="C#" Class="PBSettingPrice" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;

public class PBSettingPrice : IHttpHandler, IReadOnlySessionState
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    FuncAllEdari EdariFunc = new FuncAllEdari();
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
                    GetinfoSettingActive();//daryaft tanzimat setting mali faal
                    break;
                case 2:
                    SaveSetting();//zakhire tanzimat
                    break;
                case 3:
                    GetReporlSetting();//report tanzimat
                    break;
                case 4:
                    ActiveSalMali();//Active sal mali
                    break;

                case 5:
                    SaveKarkardIntoMonth(); //ثبت تعداد روز کارکرد در ماه
                    break;
                case 6:
                    GetAllDayIntoMonth(); //گزارش تعداد روز کارکرد در ماه
                    break;
                case 7:
                    DeleteInfoDayIntoMonth(); //حذف تعداد روز کارکرد در ماه
                    break;
            }
        }
    }
    //---------------------------------------------------------------------
    //---------------------daryaft tanzimat setting mali faal--------------
    //---------------------------------------------------------------------
    private void GetinfoSettingActive()
    {
        string year = context.Request.Form["year"];
        year = String.IsNullOrEmpty(year) ? _PDate.NowYear : year;
        string json = "";
        var check = (from t in office.ofcSettings
                     where t.numStatus == 1
                     &&
                     (year == "-1" || t.numYear == Convert.ToInt16(year))
                     select new
                     {
                         t.numYear,
                         t.numPriceSalary,
                         t.numPriceBon,
                         t.numPriceHomeSalary
                     }).ToList();

        json = serializer.Serialize((object)check);
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------zakhire tanzimat--------------
    //---------------------------------------------------------------------
    private void SaveSetting()
    {
        int pricesalary = Convert.ToInt32(context.Request.Form["pricesalary"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        int pricebon = Convert.ToInt32(context.Request.Form["pricebon"]);
        int pricehomesalary = Convert.ToInt32(context.Request.Form["pricehomesalary"]);
        string json = "";
        var checkSetting1 = office.ofcSettings.Where(c => c.numYear == year).FirstOrDefault();
        if (checkSetting1 != null)
        {
            int cnt = 0;
            cnt = office.ofcPersonelPreInvoices.Where(c => c.strInvoiceYear == year.ToString()).Count();
            cnt = cnt + (office.ofcPersonelPreInvoiceSaatis.Where(c => c.strInvoiceYear == year.ToString()).Count());
            cnt = cnt + (office.ofcPersonelFaraiandCalcs.Where(c => c.numYear == year).Count());
            cnt = cnt + (office.ofcPersonelEidiEndYears.Where(c => c.numYear == year).Count());
            cnt = cnt + (office.ofcPersonelLeaveEndYears.Where(c => c.numYear == year).Count());

            if (cnt > 0)
            {
                var checkSetting = office.ofcSettings.Where(c => c.numStatus == 1).FirstOrDefault();
                if (checkSetting != null) checkSetting.numStatus = 0;

                office.ofcSettings.InsertOnSubmit(new ofcSetting
                {
                    dateRegisterDate = _PDate.PersianDate,
                    timeRegisterTime = _PDate.PersianTime,
                    numPriceBon = pricebon,
                    numPriceHomeSalary = pricehomesalary,
                    numPriceSalary = pricesalary,
                    numStatus = 1,
                    numYear = Convert.ToInt16(_PDate.NowYear),
                    strUserRegisterRef = _ofcUser.strUserCode.Trim()
                });

                try
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1");
                }
                catch
                {
                    json = serializer.Serialize((object)"3");
                }

                //json = serializer.Serialize((object)"4"); // emkane viraiesh vojod nadarad
            }
            else
            {
                checkSetting1.numPriceSalary = pricesalary;
                checkSetting1.numPriceBon = pricebon;
                checkSetting1.numPriceHomeSalary = pricehomesalary;
                try
                {
                    office.SubmitChanges();

                    json = serializer.Serialize((object)"2");
                }
                catch
                {
                    json = serializer.Serialize((object)"3");
                }
            }
        }
        else
        {
            var checkSetting = office.ofcSettings.Where(c => c.numStatus == 1).FirstOrDefault();
            if (checkSetting != null) checkSetting.numStatus = 0;

            office.ofcSettings.InsertOnSubmit(new ofcSetting
            {
                dateRegisterDate = _PDate.PersianDate,
                timeRegisterTime = _PDate.PersianTime,
                numPriceBon = pricebon,
                numPriceHomeSalary = pricehomesalary,
                numPriceSalary = pricesalary,
                numStatus = 1,
                numYear = Convert.ToInt16(_PDate.NowYear),
                strUserRegisterRef = _ofcUser.strUserCode.Trim()
            });

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

        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------دریافت اطلاعات تنظیمات ------------------------
    //----------------------------------------------------------------------
    private void GetReporlSetting()
    {
        string year = context.Request.Form["year"];
        string salary = context.Request.Form["salary"];
        string bon = context.Request.Form["bon"];
        string homesalary = context.Request.Form["homesalary"];

        salary = String.IsNullOrEmpty(salary) || year == "-1" ? "0" : salary.Replace(",", "");
        bon = String.IsNullOrEmpty(bon) || year == "-1" ? "0" : bon.Replace(",", "");
        homesalary = String.IsNullOrEmpty(homesalary) || year == "-1" ? "0" : homesalary.Replace(",", "");

        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);

        var personel = (from t in office.ofcSettings
                        where
                             (t.numYear == Convert.ToInt32(year) || year == "-1")
                             &&
                             (t.numPriceSalary == Convert.ToInt32(salary) || salary.Trim() == "0")
                             &&
                             (t.numPriceHomeSalary == Convert.ToInt32(homesalary) || homesalary.Trim() == "0")
                             &&
                             (t.numPriceBon == Convert.ToInt32(bon) || bon.Trim() == "0")
                        select new
                        {
                            t.numYear,
                            t.numPriceBon,
                            t.numPriceHomeSalary,
                            t.numPriceSalary,
                            dateRegisterDate = t.dateRegisterDate + "<br/>" + t.timeRegisterTime,
                            status = t.numStatus,
                            t.numSettingCode
                        });
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.numSettingCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------دریافت اطلاعات تنظیمات ------------------------
    //----------------------------------------------------------------------
    private void ActiveSalMali()
    {
        int id = Convert.ToInt32(context.Request.Form["id"]);
        string json = "";
        var checkSetting1 = office.ofcSettings.Where(c => c.numStatus == 1).FirstOrDefault();
        if (checkSetting1 != null) checkSetting1.numStatus = 0;
        try
        {
            var q = office.ofcSettings.Where(C => C.numSettingCode == id).FirstOrDefault();
            if (q != null)
            {
                q.numStatus = 1;
                office.SubmitChanges();

                DateTime now = DateTime.Now;
                if (context.Request.Cookies["BimehProjectAndSaati"] != null) context.Response.Cookies["BimehProjectAndSaati"].Expires = now.AddDays(-1);
                HttpCookie BimehProjectAndSaati = new HttpCookie("BimehProjectAndSaati");
                BimehProjectAndSaati.Value = Convert.ToInt32(q.numPriceSalary + q.numPriceBon + q.numPriceHomeSalary).ToString(); // 9421645; // hoghogh sabet + bon + hagh maskan sale  jari
                BimehProjectAndSaati.Expires = now.AddDays(1);
                context.Response.Cookies.Add(BimehProjectAndSaati);

                if (context.Request.Cookies["hoghoghSabet"] != null) context.Response.Cookies["hoghoghSabet"].Expires = now.AddDays(-1);
                HttpCookie hoghoghSabet = new HttpCookie("hoghoghSabet");
                hoghoghSabet.Value = Convert.ToInt32(q.numPriceSalary).ToString(); // hoghogh sabete sale jari
                hoghoghSabet.Expires = now.AddDays(1);
                context.Response.Cookies.Add(hoghoghSabet);

                json = serializer.Serialize((object)"1");

            }
            else
            {
                json = serializer.Serialize((object)"2");
            }
        }
        catch
        {
            json = serializer.Serialize((object)"3");
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------ثبت تعداد روز کارکرد در ماه------------------------
    //----------------------------------------------------------------------
    private void SaveKarkardIntoMonth()
    {
        int day = Convert.ToInt32(context.Request.Form["day"]);
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        string json = "";
        var check = office.ofcDayWorkIntoMonths.Where(c => c.numCountDay == day && c.numMonthJob == month && c.numYear == year).FirstOrDefault();
        if (check == null)
        {
            office.ofcDayWorkIntoMonths.InsertOnSubmit(new ofcDayWorkIntoMonth
            {
                numCountDay = Convert.ToInt16(day),
                numMonthJob = Convert.ToInt16(month),
                numYear = Convert.ToInt16(year),
                dateRegisterDate = _PDate.PersianDate,
                strRegisterUserRef = _ofcUser.strUserCode,
                timeRegisterTime = _PDate.PersianTime
            });
            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)"1");// 
            }
            catch
            {
                json = serializer.Serialize((object)"3"); // 
            }
        }
        else
        {
            json = serializer.Serialize((object)"2");// 
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------گزارش تعداد روز کارکرد در ماه------------------------
    //----------------------------------------------------------------------
    private void GetAllDayIntoMonth()
    {
        string json = "";
        int year = Convert.ToInt32(office.ofcSettings.Where(c => c.numStatus == 1).FirstOrDefault().numYear);
        var q = from t in office.ofcDayWorkIntoMonths
                where t.numYear == year
                orderby t.numMonthJob, t.numYear
                select new
                {
                    t.numCountDay,
                    MonthJob = EdariFunc.GetMonthName(t.numMonthJob.ToString()),
                    t.numYear,
                    t.numWorkMonthCode
                };
        json = serializer.Serialize((object)q);// 
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------حذف تعداد روز کارکرد در ماه------------------------
    //----------------------------------------------------------------------
    private void DeleteInfoDayIntoMonth()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        var dayintoMonth = office.ofcDayWorkIntoMonths.Where(o => o.numWorkMonthCode == code).FirstOrDefault();
        string json = "";
        try
        {
            if (dayintoMonth != null)
            {
                office.ofcDayWorkIntoMonths.DeleteOnSubmit(dayintoMonth);
                office.SubmitChanges();
                json = serializer.Serialize((object)"1");// حذف شد
            }
            else
            {
                json = serializer.Serialize((object)"5"); //  وجود ندارد
            }
        }
        catch
        {
            json = serializer.Serialize((object)"15"); // خطا
        }
        context.Response.Write(json);
        context.Response.End();
    }

    //---------------------------------------------------------------------
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