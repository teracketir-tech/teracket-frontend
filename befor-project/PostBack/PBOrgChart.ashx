<%@ WebHandler Language="C#" Class="PBOrgChart" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;

public class PBOrgChart : IHttpHandler, IReadOnlySessionState
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
                    GetOrgChart();//دریافت چارت سازمانی
                    break;
            }
        }
    }
    //--------------------------------------------------------------------------------
    //----------------------------------------دریافت چارت سازمانی----------------------------------------
    //--------------------------------------------------------------------------------
    protected void GetOrgChart()
    {
        string json = "";
        var q = (from t in office.ofcOrgCharts
                 select new
                 {
                     t.numOrgChartCode,
                     t.numOrgChartParentID,
                     t.strOrgChartName
                 });

        json = serializer.Serialize((object)q);

        context.Response.Write(json);
        context.Response.End();
    }
    //--------------------------------------------------------------------------------
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}