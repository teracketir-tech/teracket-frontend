<%@ WebHandler Language="C#" Class="PBEndYears" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;

public class PBEndYears : IHttpHandler, IReadOnlySessionState
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    FuncAllEdari EdariFunc = new FuncAllEdari();
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);
    int BimehProjectAndSaati = 0; // 9421645; // hoghogh sabet + bon + hagh maskan sale  95
    int hoghoghSabet = 0; // hoghogh sabete sale 95
                          //---------------------------------------------------------------------
                          //---------------------------------------------------------------------
                          //---------------------------------------------------------------------
    public void ProcessRequest(HttpContext context)
    {
        string Url = context.Request.Url.Host.Trim().ToLower();
        string HTTP_REFERER = context.Request.ServerVariables["HTTP_REFERER"];
        if (HTTP_REFERER != null && HTTP_REFERER.IndexOf(Url) != -1)
        {
            if (context.Session["Office"] == null) context.Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)context.Session["Office"];
            BimehProjectAndSaati = func.BimehProjectAndSaati;
            hoghoghSabet = func.hoghoghSabet;
            office = new OfficeDataContext(func.Officecstr.Trim());
            int input = Convert.ToInt32(context.Request.Form["i"]);
            switch (input)
            {
                case 1:
                    GetAlldrpdwn();//دریافت کل دراپ دان ها
                    break;
                case 2:
                    ReportEidi();//محاسبه عیدی
                    break;
                case 3:
                    ReportMorakhasi();//محاسبه مرخصی
                    break;
                case 4:
                    PreSaveEidi();// پش ثبت عیدی
                    break;
                case 5:
                    CheckPreEidi(); //چک کردن مشاهده آخرین بررسی عیدی
                    break;
                case 6:
                    GetReportpreEidi(); //گزارش پیش ثبت صورت حساب عیدی
                    break;
                case 7:
                    SaveFinalEidi(); // ثبت نهایی صورت حساب کلی عیدی
                    break;
                case 8:
                    DeleteClacEidi(); //حذف محاسبه  صورت حساب عیدی
                    break;
                case 9:
                    ReClacEidi(); //محاسبه مجدد صورت حساب عیدی
                    break;
                case 10:
                    GetRepotFinalVarizEidi(); //گزارش سابقه واریز صورت حساب عیدی
                    break;
                case 11:
                    PreSaveMorakhasi();// پش ثبت مرخصی
                    break;
                case 12:
                    CheckPreMorakhasi(); //چک کردن مشاهده آخرین بررسی مرخصی
                    break;
                case 13:
                    GetReportpreMorakhasi(); //گزارش پیش ثبت صورت حساب مرخصی
                    break;
                case 14:
                    SaveFinalMorakhasi(); // ثبت نهایی صورت حساب کلی مرخصی
                    break;
                case 15:
                    DeleteClacMorakhasi(); //حذف محاسبه  صورت حساب مرخصی
                    break;
                case 16:
                    ReClacMorakhasi(); //محاسبه مجدد صورت حساب مرخصی
                    break;
                case 17:
                    GetRepotFinalVarizMorakhasi(); //گزارش سابقه واریز صورت حساب مرخصی
                    break;
            }
        }
    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراپ دان ها----------------
    //---------------------------------------------------------------------
    private void GetAlldrpdwn()
    {
        var workjob = from t in office.ofcBWorkGroups
                      where t.numStatus == 1
                      select new
                      {
                          value = t.numWorkGroupCode,
                          item = t.strWorkGroupName
                      };
        var ContractKinds = from t in office.ofcBContractKinds
                            select new
                            {
                                value = t.numContractKindCode,
                                item = t.strContractKindName,
                            };
        string json1 = serializer.Serialize((object)workjob);
        string json2 = serializer.Serialize((object)ContractKinds);
        string json = "[" + json1 + "," + json2 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //--------------------------------گزارش صورت حساب عیدی-----------------
    //----------------------------------------------------------------------
    private void ReportEidi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        int level = Convert.ToInt32(context.Request.Form["level"]);
        string year = context.Request.Form["date"];
        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;

        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        //=====================================================================================================
        int?[] numpersonelarray = (from t8 in office.ofcPersonelEidiEndYears
                                   where
                                        (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                        &&
                                        t8.numYear == Convert.ToInt32(year)
                                   select t8.numPersonelRef).ToArray();

        var q = (from t1 in office.ofcPersonels
                 join t2 in office.ofcPersonelContracts on t1.numPersonelCode equals t2.numPersonelRef
                 join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                 join t4 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t4.numWorkGroupCode
                 where
                       (t1.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                        &&
                        !(new int[] { 3, 4 }).Contains((int)t1.numStatus)
                        //&&
                        // (new int[] { 1 }).Contains((int)t2.numStatus)
                        &&
                        ((t1.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                        ||
                        (t1.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                        ||
                        name == "")
                        &&
                        (contractkindArray.Contains(t2.numContractKindRef.ToString()) || contractkind == "-1")
                        &&
                        (t1.strMelliCode == mellicode || mellicode == "")
                        &&
                        ((grohkariRoomArray).Contains(t1.numWorkGroupRef.ToString()) || grohkari == "-1")
                        &&
                        (t2.dateStartContractDate.StartsWith(year))
                         &&
                         !
                         (numpersonelarray).Contains(t1.numPersonelCode)
                                                 &&
                        ((from tt in office.ofcPersonelContracts
                          where
                          (tt.dateStartContractDate.StartsWith(year))
                          &&
                          tt.numPersonelRef == t1.numPersonelCode
                          &&
                          tt.numContractKindRef == 1
                          select new { tt.numContractCode }).OrderByDescending(c => c.numContractCode).FirstOrDefault().numContractCode) == t2.numContractCode
                 select new
                 {
                     t1.numPersonelCode,
                     strPersonelName = t1.strPersonelName.Trim() + " " + t1.strPersonelFamily.Trim(),
                     eidiAndrozkarkard = EdariFunc.GetEidiAndRozKarkard((int)t1.numPersonelCode, (int)(t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary), t2.dateStartContractDate, level, year),
                     t3.strContractKindName,
                     t4.strWorkGroupName,
                     hoghoghSabet = (t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 :t2.numPersonelSalary),
                     eidiYekroz = (t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 :t2.numPersonelSalary) / 365,
                     t2.numContractKindRef,
                     level = (level == 1 ? "به صورت کامل" : level == 2 ? "دو مرحله ای" : level == 3 ? "سه مرحله ای" : level == 4 ? "چهار مرحله ای" : "تعریف نشده")
                 });
        //===========================================================================
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.numPersonelCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //--------------------------------گزارش صورت حساب مرخصی---------------
    //----------------------------------------------------------------------
    private void ReportMorakhasi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string year = context.Request.Form["date"];

        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);

        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;

        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        //=====================================================================================================
        int?[] numpersonelarray = (from t8 in office.ofcPersonelLeaveEndYears
                                   where
                                        (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                        &&
                                        t8.numYear == Convert.ToInt32(year)
                                   select t8.numPersonelRef).ToArray();
        //=====================================================================================================

        var q = (from t1 in office.ofcPersonels
                 join t2 in office.ofcPersonelContracts on t1.numPersonelCode equals t2.numPersonelRef
                 join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                 join t4 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t4.numWorkGroupCode
                 where

                       (t1.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                        &&
                        !(new int[] { 3, 4 }).Contains((int)t1.numStatus)
                        //&&
                        //(new int[] { 1 }).Contains((int)t2.numStatus)
                        &&
                        ((t1.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                        ||
                        (t1.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                        ||
                        name == "")
                        &&
                        (contractkindArray.Contains(t2.numContractKindRef.ToString()) || contractkind == "-1")
                        &&
                        (t1.strMelliCode == mellicode || mellicode == "")
                        &&
                        ((grohkariRoomArray).Contains(t1.numWorkGroupRef.ToString()) || grohkari == "-1")
                        &&
                        (t2.dateStartContractDate.StartsWith(year))
                        &&
                        !
                        (numpersonelarray).Contains(t1.numPersonelCode)
                        &&
                        ((from tt in office.ofcPersonelContracts
                          where
                          (tt.dateStartContractDate.StartsWith(year))
                          &&
                          tt.numPersonelRef == t1.numPersonelCode
                          &&
                          tt.numContractKindRef == 1
                          select new { tt.numContractCode }).OrderByDescending(c => c.numContractCode).FirstOrDefault().numContractCode) == t2.numContractCode
                 select new
                 {

                     t1.numPersonelCode,
                     strPersonelName = t1.strPersonelName.Trim() + " " + t1.strPersonelFamily.Trim(),
                     t3.strContractKindName,
                     t4.strWorkGroupName,
                     hoghoghSabet = t2.numContractKindRef == 3 ? hoghoghSabet : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary,
                     //priceBazkharidMorakhasi = GetpriceBazkharidMorakhasi((int)t1.numPersonelCode, (t2.numContractKindRef == 3 ? hoghoghSabet : t2.numContractKindRef == 2 ? 0 : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash + t2.numPersonelChildSalary))),
                     morakhasiAndRozKarkardAndPrice = EdariFunc.GetMorakhasi((int)t2.numPersonelRef, (int)(t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary), (int)t2.numContractKindRef, year),
                     t2.numContractKindRef
                 });
        //===========================================================================
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.numPersonelCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //--------------------------------پیش ثبت صورت حساب عیدی-----------------
    //----------------------------------------------------------------------
    private void PreSaveEidi()
    {
        string personelcode = context.Request.Form["PersonelCodeTemp"];
        int level = Convert.ToInt32(context.Request.Form["level"]);

        string ItemSearch = context.Request.Form["ItemSearch"];
        string[] arrayPesonelCode = personelcode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string Year = ItemSearch.Split('^')[0];
        int contractKind = Convert.ToInt32(ItemSearch.Split('^')[1]);
        //=====================================================================================================
        var q = (from t1 in office.ofcPersonels
                 join t2 in office.ofcPersonelContracts on t1.numPersonelCode equals t2.numPersonelRef
                 join t5 in office.ofcPersonelBankInfos on t1.numPersonelCode equals t5.numPersonelRef into join_t5
                 from t5 in join_t5.DefaultIfEmpty()
                 where
                        t2.numContractKindRef == contractKind
                        &&
                        arrayPesonelCode.Contains(t1.numPersonelCode.ToString())
                        &&
                        !(new int[] { 3, 4 }).Contains((int)t1.numStatus)
                        //&&
                        //(new int[] { 1 }).Contains((int)t2.numStatus)
                        &&
                        (t2.dateStartContractDate.StartsWith(Year))
                        &&
                        ((from tt in office.ofcPersonelContracts
                          where
                          (tt.dateStartContractDate.StartsWith(Year))
                          &&
                          tt.numPersonelRef == t1.numPersonelCode
                          select new { tt.numContractCode }).OrderByDescending(c => c.numContractCode).FirstOrDefault().numContractCode) == t2.numContractCode
                 select new
                 {
                     strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                     strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                     t1.numPersonelCode,
                     eidiAndrozkarkard = EdariFunc.GetEidiAndRozKarkard((int)t1.numPersonelCode, (int)(t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary
                     ), t2.dateStartContractDate, level, Year),
                     t2.numContractKindRef,
                     t2.numWorkGroupRef,
                     hoghoghSabet = (t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 :t2.numPersonelSalary),
                     eidiYekroz = (t2.numContractKindRef == 3 ? Convert.ToDouble(0) : t2.numContractKindRef == 2 ? Convert.ToDouble(0) : Convert.ToDouble(Math.Round(Convert.ToDouble(t2.numPersonelSalary 
                     / 365), MidpointRounding.AwayFromZero))),
                     Year,
                     level
                 });
        string uniqcode = "";
        Random rnd = new Random();
        //=============================pish sabt==============================================
        foreach (var item in q)
        {
            uniqcode = _PDate.NowYear.Substring(2) + _PDate.NowMonth + item.numPersonelCode.ToString() + rnd.Next(1, 10).ToString();
            for (var levelNum = 1; levelNum <= item.level; levelNum++)
            {
                office.ofcPersonelEidiEndYears.InsertOnSubmit(new ofcPersonelEidiEndYear
                {
                    numPersonelRef = item.numPersonelCode,
                    numContractKindRef = item.numContractKindRef,
                    numPriceRoot = (new int[] { 2, 3 }).Contains((int)item.numContractKindRef) && Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[0]) > 0 ? Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[2]) : Convert.ToInt32(item.hoghoghSabet),
                    numPriceEidiOneDay = (new int[] { 2, 3 }).Contains((int)item.numContractKindRef) && Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[0]) > 0 ? Convert.ToInt32(Math.Round((decimal)(Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[2]) / 365))) : Convert.ToInt32(item.eidiYekroz),
                    numPriceSettleEidiEndYear = Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[0]),
                    numWorkGroupCode = item.numWorkGroupRef,
                    numYear = Convert.ToInt16(item.Year),
                    dateRegisterDate = _PDate.PersianDate,
                    strRegisterUserRef = _ofcUser.strUserCode,
                    numStatus = 0,
                    numDayInYear = Convert.ToInt16(item.eidiAndrozkarkard.Split('^')[1]),
                    numIsLevelVariz = Convert.ToByte(levelNum),
                    numCountLevel = Convert.ToByte(item.level),
                    strUniqCodeLevel = uniqcode,
                    strBankAccount = item.strBankAccount,
                    strBankName = item.strBankName
                });
            }
        }
        string json = "";
        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)1);
        }
        catch (Exception ex)
        {
            string a = ex.Message;
            json = serializer.Serialize((object)3);
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------چک کردن مشاهده آخرین بررسی عیدی------------------------
    //----------------------------------------------------------------------
    private void CheckPreEidi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int year = Convert.ToInt32(String.IsNullOrEmpty(context.Request.Form["year"]) ? "0" : context.Request.Form["year"]);

        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;
        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        int cntCheck = (from t in office.ofcPersonelEidiEndYears
                        where
                        t.numStatus == 0
                        &&
                        ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                        select new
                        {
                            t.numEidiEndYearCode
                        }).Count();
        string json = serializer.Serialize((object)cntCheck);
        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------گزارش پیش ثبت صورت حساب عیدی------------------------
    //----------------------------------------------------------------------
    private void GetReportpreEidi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        // int year = Convert.ToInt32(context.Request.Form["year"]);
        int levelvariz = Convert.ToInt32(context.Request.Form["levelvariz"]);

        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;
        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        var q = (from t in office.ofcPersonelEidiEndYears
                 join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                 join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                 join t3 in office.ofcBContractKinds on t.numContractKindRef equals t3.numContractKindCode
                 where
                       (t2.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                       &&
                       ((t2.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                        (t2.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                       name == "")
                       &&
                       (t2.strMelliCode == mellicode || mellicode == "")
                       // &&
                       //  t.numYear == Convert.ToInt16(year)
                       &&
                       ((grohkariRoomArray).Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                       &&
                       t.numStatus == 0
                       &&
                       ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                       &&
                       (t.numIsLevelVariz == Convert.ToByte(levelvariz))
                 orderby t.numPersonelRef
                 select new
                 {
                     strBankAccount = t.strBankAccount,
                     strBankName = t.strBankName,
                     PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                     t2.numPersonelCode,
                     t.numEidiEndYearCode,
                     t.numPriceEidiOneDay,
                     t.numPriceRoot,
                     t.numPriceSettleEidiEndYear,
                     t.numYear,
                     t1.strWorkGroupName,
                     t3.strContractKindName,
                     t.numDayInYear,
                     level = (t.numIsLevelVariz == 1 ? "مرحله اول واریز" : t.numIsLevelVariz == 2 ? "مرحله دوم واریز" : t.numIsLevelVariz == 3 ? "مرحله سوم واریز" : t.numIsLevelVariz == 4 ? "مرحله چهارم واریز" : "تعریف نشده"),
                     levelnumber = (t.numCountLevel == 1 ? "به صورت کامل" : t.numCountLevel == 2 ? "دو مرحله ای" : t.numCountLevel == 3 ? "سه مرحله ای" : t.numCountLevel == 4 ? "چهار مرحله ای" : "تعریف نشده"),
                 });


        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------ثبت نهایی صورت حساب کلی عیدی ------------------------
    //----------------------------------------------------------------------
    private void SaveFinalEidi()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] invoiceCodearray = InvoiceCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        var preInvoice = office.ofcPersonelEidiEndYears.Where(c => c.numStatus == 0 && invoiceCodearray.Contains(c.numEidiEndYearCode.ToString()));
        foreach (var item in preInvoice)
        {
            item.numStatus = 1;
            item.dateVerifiDate = _PDate.PersianDate;
        }

        string json = "";
        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1");
        }
        catch
        {
            json = serializer.Serialize((object)"3");
        }

        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------حذف محاسبه  صورت حساب عیدی ------------------------
    //----------------------------------------------------------------------
    private void DeleteClacEidi()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";

        var InvoiceTemp = office.ofcPersonelEidiEndYears.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numEidiEndYearCode.ToString()));
        string[] arrayuniqcode = (from t in InvoiceTemp
                                  select t.strUniqCodeLevel).Distinct().ToArray();
        office.ofcPersonelEidiEndYears.DeleteAllOnSubmit(InvoiceTemp);

        var InvoiceTemp2 = office.ofcPersonelEidiEndYears.Where(c => c.numStatus == 0 && arrayuniqcode.Contains(c.strUniqCodeLevel.ToString()));
        office.ofcPersonelEidiEndYears.DeleteAllOnSubmit(InvoiceTemp2);

        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)1);
        }
        catch
        {
            json = serializer.Serialize((object)3);
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------محاسبه مجدد صورت حساب عیدی ------------------
    //----------------------------------------------------------------------
    public class lstPersonelReCalc
    {
        public int numPersonelRef { get; set; }
        public string strInvoiceYear { get; set; }
        public int numIsLevelVariz { get; set; }
    }
    //----------------------------------------------------------------------
    private void ReClacEidi()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";
        List<lstPersonelReCalc> InvoiceTemp1 = new List<lstPersonelReCalc>();

        InvoiceTemp1 = (from t in office.ofcPersonelEidiEndYears
                        where t.numStatus == 0
                        &&
                        arrayInvoiceCode.Contains(t.numEidiEndYearCode.ToString())
                        select new lstPersonelReCalc
                        {
                            numPersonelRef = (int)t.numPersonelRef,
                            strInvoiceYear = t.numYear.ToString(),
                            numIsLevelVariz = (int)t.numCountLevel,
                        }).ToList();

        var InvoiceTemp = office.ofcPersonelEidiEndYears.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numEidiEndYearCode.ToString()));
        string[] arrayuniqcode = (from t in InvoiceTemp
                                  select t.strUniqCodeLevel).Distinct().ToArray();
        office.ofcPersonelEidiEndYears.DeleteAllOnSubmit(InvoiceTemp);

        var InvoiceTemp2 = office.ofcPersonelEidiEndYears.Where(c => c.numStatus == 0 && arrayuniqcode.Contains(c.strUniqCodeLevel.ToString()));
        office.ofcPersonelEidiEndYears.DeleteAllOnSubmit(InvoiceTemp2);

        int checkSubmit = 0;
        try
        {
            office.SubmitChanges();
            checkSubmit = 1;
        }
        catch { }

        if (checkSubmit == 1) // ok bod
        {
            string Year = "";
            int level = 1;
            foreach (var itemsss in InvoiceTemp1)
            {
                Year = itemsss.strInvoiceYear;
                level = itemsss.numIsLevelVariz;

                int?[] numpersonelarray = (from t8 in office.ofcPersonelEidiEndYears
                                           where
                                                (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                                &&
                                                t8.numYear == Convert.ToInt16(Year)
                                           select t8.numPersonelRef).ToArray();
                var q = (from t1 in office.ofcPersonels
                         join t2 in office.ofcPersonelContracts on t1.numPersonelCode equals t2.numPersonelRef
                         join t5 in office.ofcPersonelBankInfos on t1.numPersonelCode equals t5.numPersonelRef into join_t5
                         from t5 in join_t5.DefaultIfEmpty()
                         where
                                t1.numPersonelCode == itemsss.numPersonelRef
                                &&
                                !(new int[] { 3, 4 }).Contains((int)t1.numStatus)
                                //  &&
                                // (new int[] { 1 }).Contains((int)t2.numStatus)
                                &&
                                (t2.dateStartContractDate.StartsWith(Year))
                                                        &&
                        ((from tt in office.ofcPersonelContracts
                          where
                          (tt.dateStartContractDate.StartsWith(Year))
                          &&
                          tt.numPersonelRef == t1.numPersonelCode
                          select new { tt.numContractCode }).OrderByDescending(c => c.numContractCode).FirstOrDefault().numContractCode) == t2.numContractCode
                         select new
                         {
                             strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                             strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                             t1.numPersonelCode,
                             eidiAndrozkarkard = EdariFunc.GetEidiAndRozKarkard((int)t1.numPersonelCode, (int)(t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary), t2.dateStartContractDate, level, Year),
                             t2.numContractKindRef,
                             t2.numWorkGroupRef,
                             hoghoghSabet = (t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary),
                             eidiYekroz = (t2.numContractKindRef == 3 ? Convert.ToDouble(0) : t2.numContractKindRef == 2 ? Convert.ToDouble(0) : Convert.ToDouble(Math.Round(Convert.ToDouble(t2.numPersonelSalary / 365), MidpointRounding.AwayFromZero))),
                             Year,
                             level
                         });
                string uniqcode = "";
                Random rnd = new Random();

                foreach (var item in q)
                {
                    uniqcode = _PDate.NowYear.Substring(2) + _PDate.NowMonth + item.numPersonelCode.ToString() + rnd.Next(1, 10).ToString();
                    for (var levelNum = 1; levelNum <= item.level; levelNum++)
                    {
                        office.ofcPersonelEidiEndYears.InsertOnSubmit(new ofcPersonelEidiEndYear
                        {
                            numPersonelRef = item.numPersonelCode,
                            numContractKindRef = item.numContractKindRef,
                            numPriceRoot = (new int[] { 2, 3 }).Contains((int)item.numContractKindRef) && Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[0]) > 0 ? Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[2]) : item.hoghoghSabet,
                            numPriceEidiOneDay = (new int[] { 2, 3 }).Contains((int)item.numContractKindRef) && Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[0]) > 0 ? Convert.ToInt32(Math.Round((decimal)(Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[2]) / 365))) : Convert.ToInt32(item.eidiYekroz),
                            numPriceSettleEidiEndYear = Convert.ToInt32(item.eidiAndrozkarkard.Split('^')[0]),
                            numWorkGroupCode = item.numWorkGroupRef,
                            numYear = Convert.ToInt16(item.Year),
                            dateRegisterDate = _PDate.PersianDate,
                            strRegisterUserRef = _ofcUser.strUserCode,
                            numStatus = 0,
                            numDayInYear = Convert.ToInt16(item.eidiAndrozkarkard.Split('^')[1]),
                            numIsLevelVariz = Convert.ToByte(levelNum),
                            numCountLevel = Convert.ToByte(item.level),
                            strUniqCodeLevel = uniqcode,
                            strBankAccount = item.strBankAccount,
                            strBankName = item.strBankName
                        });
                    }
                }

            }

            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)1);
            }
            catch
            {
                json = serializer.Serialize((object)3);
            }
        }
        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------گزارش سابقه واریز صورت حساب کلی عیدی--------
    //----------------------------------------------------------------------
    private void GetRepotFinalVarizEidi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int year = Convert.ToInt32(context.Request.Form["year"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        int levelvariz = Convert.ToInt32(context.Request.Form["levelvariz"]);

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;
        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        var q = (from t in office.ofcPersonelEidiEndYears
                 join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                 join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                 join t3 in office.ofcBContractKinds on t.numContractKindRef equals t3.numContractKindCode
                 where
                       (t2.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                       &&
                       ((t2.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                        (t2.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                       name == "")
                       &&
                       (t2.strMelliCode == mellicode || mellicode == "")
                       &&
                       t.numYear == Convert.ToInt16(year)
                       &&
                       ((grohkariRoomArray).Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                       &&
                       (t.numStatus == 1 || t.numStatus == 2)
                       &&
                       (contractkindArray.Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                       &&
                       (t.numIsLevelVariz == Convert.ToByte(levelvariz) || levelvariz == 0)

                 select new
                 {
                     strBankAccount = t.strBankAccount,
                     strBankName = t.strBankName,
                     PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                     t2.numPersonelCode,
                     t.numEidiEndYearCode,
                     t.numPriceEidiOneDay,
                     t.numPriceRoot,
                     t.numPriceSettleEidiEndYear,
                     t.numYear,
                     t1.strWorkGroupName,
                     t3.strContractKindName,
                     t.numDayInYear,
                     t.dateVerifiDate,
                     strstatus = t.numStatus == 1 ? "تسویه شده" : t.numStatus == 2 ? "قطع همکاری" : "-",
                     level = (t.numIsLevelVariz == 1 ? "مرحله اول واریز" : t.numIsLevelVariz == 2 ? "مرحله دوم واریز" : t.numIsLevelVariz == 3 ? "مرحله سوم واریز" : t.numIsLevelVariz == 4 ? "مرحله چهارم واریز" : "تعریف نشده"),
                     levelnumber = (t.numCountLevel == 1 ? "به صورت کامل" : t.numCountLevel == 2 ? "دو مرحله ای" : t.numCountLevel == 3 ? "سه مرحله ای" : t.numCountLevel == 4 ? "چهار مرحله ای" : "تعریف نشده"),

                 });
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.dateVerifiDate).ThenBy(c => c.numEidiEndYearCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //------------------------پیش ثبت صورت حساب باز خرید مرخصی------------
    //----------------------------------------------------------------------
    private void PreSaveMorakhasi()
    {
        string personelcode = context.Request.Form["PersonelCodeTemp"];
        string ItemSearch = context.Request.Form["ItemSearch"];
        string[] arrayPesonelCode = personelcode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string Year = ItemSearch.Split('^')[0];
        int contractKind = Convert.ToInt32(ItemSearch.Split('^')[1]);
        //=====================================================================================================
        var q = (from t1 in office.ofcPersonels
                 join t2 in office.ofcPersonelContracts on t1.numPersonelCode equals t2.numPersonelRef
                 join t5 in office.ofcPersonelBankInfos on t1.numPersonelCode equals t5.numPersonelRef into join_t5
                 from t5 in join_t5.DefaultIfEmpty()
                 where
                        t2.numContractKindRef == contractKind
                        &&
                        arrayPesonelCode.Contains(t1.numPersonelCode.ToString())
                        &&
                       !(new int[] { 3, 4 }).Contains((int)t1.numStatus)
                        // &&
                        // (new int[] { 1 }).Contains((int)t2.numStatus)
                        &&
                        (t2.dateStartContractDate.StartsWith(Year))
                                                &&
                        ((from tt in office.ofcPersonelContracts
                          where
                          (tt.dateStartContractDate.StartsWith(Year))
                          &&
                          tt.numPersonelRef == t1.numPersonelCode
                          select new { tt.numContractCode }).OrderByDescending(c => c.numContractCode).FirstOrDefault().numContractCode) == t2.numContractCode
                 select new
                 {
                     strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                     strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                     t1.numPersonelCode,
                     strPersonelName = t1.strPersonelName.Trim() + " " + t1.strPersonelFamily.Trim(),
                     t2.numContractKindRef,
                     t2.numWorkGroupRef,
                     hoghoghSabet = (t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary),
                     morakhasiAndRozKarkardAndPrice = EdariFunc.GetMorakhasi((int)t2.numPersonelRef, (int)(t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary), (int)t2.numContractKindRef, Year),
                     Year
                 });
        //=============================pish sabt==============================================
        foreach (var item in q)
        {
            office.ofcPersonelLeaveEndYears.InsertOnSubmit(new ofcPersonelLeaveEndYear
            {
                numPersonelRef = item.numPersonelCode,
                numContractKindRef = item.numContractKindRef,
                strCountLeaveInYear = item.morakhasiAndRozKarkardAndPrice.Split('^')[0],
                strCountLeaveOut = item.morakhasiAndRozKarkardAndPrice.Split('^')[1],
                strCountLeaveRemained = item.morakhasiAndRozKarkardAndPrice.Split('^')[2],
                strCountPayableLeave = item.morakhasiAndRozKarkardAndPrice.Split('^')[3],
                strCountPayOffLeave = item.morakhasiAndRozKarkardAndPrice.Split('^')[4],
                numPriceRoot = (new int[] { 2, 3 }).Contains((int)item.numContractKindRef) ? Convert.ToInt32(item.morakhasiAndRozKarkardAndPrice.Split('^')[6]) : Convert.ToInt32(item.hoghoghSabet),
                numPriceSettleLeaveEndYear = Convert.ToInt32(item.morakhasiAndRozKarkardAndPrice.Split('^')[5]),
                numWorkGroupCode = item.numWorkGroupRef,
                numYear = Convert.ToInt16(item.Year),
                dateRegisterDate = _PDate.PersianDate,
                strRegisterUserRef = _ofcUser.strUserCode,
                numStatus = 0,
                strBankAccount = item.strBankAccount,
                strBankName = item.strBankName
            });
        }
        string json = "";
        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)1);
        }
        catch (Exception ex)
        {
            string a = ex.Message;
            json = serializer.Serialize((object)3);
        }
        context.Response.Write(json);
        context.Response.End();



    }
    //----------------------------------------------------------------------
    //-----------------------چک کردن مشاهده آخرین بررسی مرخصی------------------------
    //----------------------------------------------------------------------
    private void CheckPreMorakhasi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int year = Convert.ToInt32(String.IsNullOrEmpty(context.Request.Form["year"]) ? "0" : context.Request.Form["year"]);

        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;
        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        int cntCheck = (from t in office.ofcPersonelLeaveEndYears
                        where
                        t.numStatus == 0
                        &&
                        ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                        select new
                        {
                            t.numLeaveEndYearCode
                        }).Count();
        string json = serializer.Serialize((object)cntCheck);
        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------گزارش پیش ثبت صورت حساب مرخصی------------------------
    //----------------------------------------------------------------------
    private void GetReportpreMorakhasi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int year = Convert.ToInt32(context.Request.Form["year"]);

        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;
        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        var q = (from t in office.ofcPersonelLeaveEndYears
                 join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                 join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                 join t3 in office.ofcBContractKinds on t.numContractKindRef equals t3.numContractKindCode
                 where
                       (t2.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                       &&
                       ((t2.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                        (t2.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                       name == "")
                       &&
                       (t2.strMelliCode == mellicode || mellicode == "")
                         &&
                         t.numYear == Convert.ToInt16(year)
                       &&
                       ((grohkariRoomArray).Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                       &&
                       t.numStatus == 0
                       &&
                       ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                 orderby t.numPersonelRef
                 select new
                 {
                     PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                     t2.numPersonelCode,
                     t.numLeaveEndYearCode,
                     t.numPriceRoot,
                     t.numPriceSettleLeaveEndYear,
                     t.numYear,
                     t1.strWorkGroupName,
                     t3.strContractKindName,
                     t.strCountLeaveInYear,
                     t.strCountLeaveOut,
                     t.strCountLeaveRemained,
                     t.strCountPayableLeave,
                     t.strCountPayOffLeave,
                     t.strBankName,
                     t.strBankAccount
                 });


        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------ثبت نهایی صورت حساب کلی مرخصی ------------------------
    //----------------------------------------------------------------------
    private void SaveFinalMorakhasi()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] invoiceCodearray = InvoiceCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        var preInvoice = office.ofcPersonelLeaveEndYears.Where(c => c.numStatus == 0 && invoiceCodearray.Contains(c.numLeaveEndYearCode.ToString()));
        foreach (var item in preInvoice)
        {
            item.numStatus = 1;
            item.dateVerifiDate = _PDate.PersianDate;
        }

        string json = "";
        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1");
        }
        catch
        {
            json = serializer.Serialize((object)"3");
        }

        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------حذف محاسبه  صورت حساب مرخصی ------------------------
    //----------------------------------------------------------------------
    private void DeleteClacMorakhasi()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";

        var InvoiceTemp = office.ofcPersonelLeaveEndYears.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numLeaveEndYearCode.ToString()));
        office.ofcPersonelLeaveEndYears.DeleteAllOnSubmit(InvoiceTemp);

        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)1);
        }
        catch
        {
            json = serializer.Serialize((object)3);
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------محاسبه مجدد صورت حساب مرخصی ------------------
    //----------------------------------------------------------------------
    private void ReClacMorakhasi()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";
        List<lstPersonelReCalc> InvoiceTemp1 = new List<lstPersonelReCalc>();

        InvoiceTemp1 = (from t in office.ofcPersonelLeaveEndYears
                        where t.numStatus == 0
                        &&
                        arrayInvoiceCode.Contains(t.numLeaveEndYearCode.ToString())
                        select new lstPersonelReCalc
                        {
                            numPersonelRef = (int)t.numPersonelRef,
                            strInvoiceYear = t.numYear.ToString()
                        }).ToList();

        var InvoiceTemp = office.ofcPersonelLeaveEndYears.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numLeaveEndYearCode.ToString()));

        office.ofcPersonelLeaveEndYears.DeleteAllOnSubmit(InvoiceTemp);
        int checkSubmit = 0;
        try
        {
            office.SubmitChanges();
            checkSubmit = 1;
        }
        catch { }

        if (checkSubmit == 1) // ok bod
        {
            string Year = "";
            foreach (var itemsss in InvoiceTemp1)
            {
                Year = itemsss.strInvoiceYear;

                //============================================================================
                int?[] numpersonelarray = (from t8 in office.ofcPersonelLeaveEndYears
                                           where
                                                (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                                &&
                                                t8.numYear == Convert.ToInt16(Year)
                                           select t8.numPersonelRef).ToArray();
                var q = (from t1 in office.ofcPersonels
                         join t2 in office.ofcPersonelContracts on t1.numPersonelCode equals t2.numPersonelRef
                         join t5 in office.ofcPersonelBankInfos on t1.numPersonelCode equals t5.numPersonelRef into join_t5
                         from t5 in join_t5.DefaultIfEmpty()
                         where
                                t1.numPersonelCode == itemsss.numPersonelRef
                                &&
                                !(new int[] { 3, 4 }).Contains((int)t1.numStatus)
                                //&&
                                //(new int[] { 1 }).Contains((int)t2.numStatus)
                                &&
                                (t2.dateStartContractDate.StartsWith(Year))
                                                        &&
                        ((from tt in office.ofcPersonelContracts
                          where
                          (tt.dateStartContractDate.StartsWith(Year))
                          &&
                          tt.numPersonelRef == t1.numPersonelCode
                          select new { tt.numContractCode }).OrderByDescending(c => c.numContractCode).FirstOrDefault().numContractCode) == t2.numContractCode
                         select new
                         {
                             strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                             strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                             t1.numPersonelCode,
                             strPersonelName = t1.strPersonelName.Trim() + " " + t1.strPersonelFamily.Trim(),
                             t2.numContractKindRef,
                             t2.numWorkGroupRef,
                             hoghoghSabet = (t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary),
                             morakhasiAndRozKarkardAndPrice = EdariFunc.GetMorakhasi((int)t2.numPersonelRef, (int)(t2.numContractKindRef == 3 ? 0 : t2.numContractKindRef == 2 ? 0 : t2.numPersonelSalary), (int)t2.numContractKindRef, Year),
                             Year
                         });

                foreach (var item in q)
                {
                    office.ofcPersonelLeaveEndYears.InsertOnSubmit(new ofcPersonelLeaveEndYear
                    {
                        numPersonelRef = item.numPersonelCode,
                        numContractKindRef = item.numContractKindRef,
                        strCountLeaveInYear = item.morakhasiAndRozKarkardAndPrice.Split('^')[0],
                        strCountLeaveOut = item.morakhasiAndRozKarkardAndPrice.Split('^')[1],
                        strCountLeaveRemained = item.morakhasiAndRozKarkardAndPrice.Split('^')[2],
                        strCountPayableLeave = item.morakhasiAndRozKarkardAndPrice.Split('^')[3],
                        strCountPayOffLeave = item.morakhasiAndRozKarkardAndPrice.Split('^')[4],
                        numPriceRoot = (new int[] { 2, 3 }).Contains((int)item.numContractKindRef) ? Convert.ToInt32(item.morakhasiAndRozKarkardAndPrice.Split('^')[6]) : Convert.ToInt32(item.hoghoghSabet),
                        numPriceSettleLeaveEndYear = Convert.ToInt32(item.morakhasiAndRozKarkardAndPrice.Split('^')[5]),
                        numWorkGroupCode = item.numWorkGroupRef,
                        numYear = Convert.ToInt16(item.Year),
                        dateRegisterDate = _PDate.PersianDate,
                        strRegisterUserRef = _ofcUser.strUserCode,
                        numStatus = 0,
                        strBankAccount = item.strBankAccount,
                        strBankName = item.strBankName
                    });
                }

            }

            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)1);
            }
            catch
            {
                json = serializer.Serialize((object)3);
            }
        }
        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------گزارش سابقه واریز صورت حساب کلی مرخصی--------
    //----------------------------------------------------------------------
    private void GetRepotFinalVarizMorakhasi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int year = Convert.ToInt32(context.Request.Form["year"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        string contractkind = context.Request.Form["contractkind"].Replace("\"", "");
        string contractkindCheck = contractkind;
        string[] contractkindArray = { "" };
        if (contractkind != "-1")
        {
            contractkindArray = contractkind.Split(',');
            contractkind = "";
        }

        var q = (from t in office.ofcPersonelLeaveEndYears
                 join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                 join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                 join t3 in office.ofcBContractKinds on t.numContractKindRef equals t3.numContractKindCode
                 where
                       (t2.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                       &&
                       ((t2.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                        (t2.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                       ||
                       name == "")
                       &&
                       (t2.strMelliCode == mellicode || mellicode == "")
                       &&
                       t.numYear == Convert.ToInt16(year)
                       &&
                       ((grohkariRoomArray).Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                       &&
                       (t.numStatus == 1 || t.numStatus == 2)
                       &&
                       (contractkindArray.Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                 select new
                 {
                     t.strBankName,
                     t.strBankAccount,
                     PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                     t2.numPersonelCode,
                     t.numLeaveEndYearCode,
                     t.numPriceRoot,
                     t.numPriceSettleLeaveEndYear,
                     t.numYear,
                     t1.strWorkGroupName,
                     t3.strContractKindName,
                     t.strCountLeaveInYear,
                     t.strCountLeaveOut,
                     t.strCountLeaveRemained,
                     t.strCountPayableLeave,
                     t.strCountPayOffLeave,
                     t.dateVerifiDate,
                     strstatus = t.numStatus == 1 ? "تسویه شده" : t.numStatus == 2 ? "قطع همکاری" : "-"
                 });
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.dateVerifiDate).ThenBy(c => c.numLeaveEndYearCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
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