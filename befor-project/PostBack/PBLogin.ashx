<%@ WebHandler Language="C#" Class="PBLogin" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;

public class PBLogin : IHttpHandler, IReadOnlySessionState
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    FuncAllEdari EdariFunc = new FuncAllEdari();
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);
    //--------------------------------------------------------------------------------
    public void ProcessRequest(HttpContext context)
    {
        string Url = context.Request.Url.Host.Trim().ToLower();
        string HTTP_REFERER = context.Request.ServerVariables["HTTP_REFERER"];
        if (HTTP_REFERER != null && HTTP_REFERER.IndexOf(Url) != -1)
        {
            office = new OfficeDataContext(func.Officecstr.Trim());

            int input = Convert.ToInt32(context.Request.Form["i"]);
            switch (input)
            {
                case 1:
                    LoginToWebSite();//لاگین وب سایت
                    break;
            }
        }
    }
    //--------------------------------------------------------------------------------
    //------------------------------/لاگین وب سایت--------------------------------------------------
    //--------------------------------------------------------------------------------
    protected void LoginToWebSite()
    {
        string username = context.Request.Form["username"];
        string password = context.Request.Form["password"];
        string capchacode = context.Request.Form["capchacode"];
        var json = "";

        string IP = context.Request.UserHostAddress;
        var q = (from t in office.ofcUsers
                 where
                 t.strUserCode == username.Trim()
                 &&
                 t.strUserPassword == password
                 &&
                 t.numStatus == 1
                 select t).FirstOrDefault();

        string SERVER_NAME = context.Request.ServerVariables["SERVER_NAME"].ToString();
        if (q != null && (SERVER_NAME.ToLower() == "localhost" || capchacode.ToLower() == context.Session["CaptchaImageText"].ToString().ToLower()))
        {
            var checkSetting = (from t in office.ofcSettings
                                where
                                t.numStatus == 1
                                &&
                                t.numYear == Convert.ToInt16(_PDate.NowYear)
                                select new
                                {
                                    numPriceSalary = t.numPriceSalary == null ? 0 : t.numPriceSalary,
                                    numPriceHomeSalary = t.numPriceHomeSalary == null ? 0 : t.numPriceHomeSalary,
                                    numPriceBon = t.numPriceBon == null ? 0 : t.numPriceBon,
                                }).FirstOrDefault();
            if (checkSetting != null)
            {
                DateTime now = DateTime.Now;
                if (context.Request.Cookies["BimehProjectAndSaati"] != null) context.Response.Cookies["BimehProjectAndSaati"].Expires = now.AddDays(-1);
                HttpCookie BimehProjectAndSaati = new HttpCookie("BimehProjectAndSaati");
                BimehProjectAndSaati.Value = Convert.ToInt32(checkSetting.numPriceSalary + checkSetting.numPriceBon + checkSetting.numPriceHomeSalary).ToString(); // 9421645; // hoghogh sabet + bon + hagh maskan sale  jari
                BimehProjectAndSaati.Expires = now.AddDays(1);
                context.Response.Cookies.Add(BimehProjectAndSaati);

                if (context.Request.Cookies["hoghoghSabet"] != null) context.Response.Cookies["hoghoghSabet"].Expires = now.AddDays(-1);
                HttpCookie hoghoghSabet = new HttpCookie("hoghoghSabet");
                hoghoghSabet.Value = Convert.ToInt32(checkSetting.numPriceSalary).ToString(); // hoghogh sabete sale jari
                hoghoghSabet.Expires = now.AddDays(1);
                context.Response.Cookies.Add(hoghoghSabet);

                context.Session["Office"] = q;
                json = serializer.Serialize((object)"1");
            }
            else
            {
                var checkSetting1 = (from t in office.ofcSettings
                                     where
                                     t.numStatus == 1
                                     select new
                                     {
                                         numPriceSalary = t.numPriceSalary == null ? 0 : t.numPriceSalary,
                                         numPriceHomeSalary = t.numPriceHomeSalary == null ? 0 : t.numPriceHomeSalary,
                                         numPriceBon = t.numPriceBon == null ? 0 : t.numPriceBon,
                                     }).FirstOrDefault();
                if (checkSetting1 != null)
                {
                    DateTime now = DateTime.Now;
                    if (context.Request.Cookies["BimehProjectAndSaati"] != null) context.Response.Cookies["BimehProjectAndSaati"].Expires = now.AddDays(-1);
                    HttpCookie BimehProjectAndSaati = new HttpCookie("BimehProjectAndSaati");
                    BimehProjectAndSaati.Value = Convert.ToInt32(checkSetting1.numPriceSalary + checkSetting1.numPriceBon + checkSetting1.numPriceHomeSalary).ToString(); // 9421645; // hoghogh sabet + bon + hagh maskan sale  jari
                    BimehProjectAndSaati.Expires = now.AddDays(1);
                    context.Response.Cookies.Add(BimehProjectAndSaati);

                    if (context.Request.Cookies["hoghoghSabet"] != null) context.Response.Cookies["hoghoghSabet"].Expires = now.AddDays(-1);
                    HttpCookie hoghoghSabet = new HttpCookie("hoghoghSabet");
                    hoghoghSabet.Value = Convert.ToInt32(checkSetting1.numPriceSalary).ToString(); // hoghogh sabete sale jari
                    hoghoghSabet.Expires = now.AddDays(1);
                    context.Response.Cookies.Add(hoghoghSabet);

                    context.Session["Office"] = q;
                    json = serializer.Serialize((object)"1");
                }
                else
                {
                    context.Session["Office"] = q;
                    json = serializer.Serialize((object)"3");
                }
            }

        }
        else
        {
            json = serializer.Serialize((object)"2");
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}