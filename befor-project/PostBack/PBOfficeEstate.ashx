<%@ WebHandler Language="C#" Class="PBOfficeEstate" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;

public class PBOfficeEstate : IHttpHandler, IReadOnlySessionState
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
                    saveNewAmvalInfo();//ثبت اموال جدید
                    break;
                case 3:
                    GetPriceValue();//دریافت مبلغ اموال
                    break;
                case 4:
                    GetSearchInfoAmval();//جستجوی اموال
                    break;
                case 5:
                    EditWorkInfoAmval();//ویرایش اطلاعات اموال
                    break;
                case 6:
                    DeleteInfoAmvalName();//حذف اطلاعات اموال
                    break;
                case 7:
                    saveAmvalPersonel();//ثبت اطلاعات اموال پرسنل
                    break;
                case 8:
                    PreSavePersonelAmval();//پیش ثبت اطلاعات اموال پرسنل
                    break;
                case 9:
                    searchamvalPersonel();//جستجو اموال پرسنل
                    break;
                case 10:
                    DeleteamvalPersonel();//حذف اموال پرسنل
                    break;
                case 11:
                    saveHavalehInfo();//ثبت اطلاعات حواله اموال
                    break;
                case 12:
                    PreSaveVagozarAmval();//پیش ثبت واگذاری اموال
                    break;
                case 13:
                    SaveFinalVagozariAmval();// ثبت نهایی واگذاری اموال
                    break;
                case 14:
                    searchAmvalVagozar();// جستجو واگذاری اموال
                    break;
                case 15:
                    DetailsPersonelVagozar();// جزییات واگذاری اموال
                    break;

            }

        }
    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراپ دان ها----------------
    //---------------------------------------------------------------------
    private void GetAlldrpdwnRegisterPersonel()
    {
        var amval = (from t in office.ofcBAmvals
                     where t.numStatus == 1
                     select new
                     {
                         value = t.numAmvalCode,
                         item = t.strAmvalName
                     }).ToList();

        var workgroup = (from t in office.ofcBWorkGroups
                         where t.numStatus == 1
                         select new
                         {
                             value = t.numWorkGroupCode,
                             item = t.strWorkGroupName
                         }).ToList();

        var Bakhshworkgroup = from t in office.ofcBWorkGroupBakhshes
                              where t.numStatus == 1
                              select new
                              {
                                  value = t.numBakhshWorkGroupCode,
                                  item = t.strBakhshName,
                                  groupcode = t.numWorkGroupRef
                              };

        var Ghesmatworkgroup = from t in office.ofcBWorkGroupGhesmats
                               where t.numStatus == 1
                               select new
                               {
                                   value = t.numGhesmatWorkgroupCode,
                                   item = t.strGhesmatName,
                                   groupcode = t.numWorkGroupRef,
                                   bakhshgroup = t.numBakhshWorkGroupRef
                               };

        var havalehAmval = from t in office.ofcBHavalehAmvals
                           where t.numStatus == 1
                           select new
                           {
                               value = t.numAmvalHavalehCode,
                               item = t.strAmvalHavalehName,
                           };
        string json1 = serializer.Serialize((object)amval);
        string json2 = serializer.Serialize((object)workgroup);
        string json3 = serializer.Serialize((object)Bakhshworkgroup);
        string json4 = serializer.Serialize((object)Ghesmatworkgroup);
        string json5 = serializer.Serialize((object)havalehAmval);

        string json = "[" + json2 + "," + json3 + "," + json4 + "," + json1 + "," + json5 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ثبت اموال جدید-----------------------
    //---------------------------------------------------------------------
    private void saveNewAmvalInfo()
    {
        string AmvalNameInfo = context.Request.Form["AmvalNameInfo"];
        string JensInfo = context.Request.Form["JensInfo"];
        string PriceAmval = context.Request.Form["PriceAmval"];
        string json = "";
        int amvalCheck = office.ofcBAmvals.Where(o => o.strAmvalName.Trim() == AmvalNameInfo.Trim()).Count();
        try
        {
            if (amvalCheck > 0)
            {
                json = serializer.Serialize((object)"5");
            }
            else
            {
                office.ofcBAmvals.InsertOnSubmit(new ofcBAmval
                {
                    strAmvalName = AmvalNameInfo.Trim(),
                    dateResisterDate = _PDate.PersianDate,
                    numPriceAmval = Convert.ToInt32(PriceAmval),
                    strAmvalJens = JensInfo.Trim(),
                    strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                    numStatus = 1
                });
                office.SubmitChanges();
                json = serializer.Serialize((object)"1");
            }
        }
        catch
        {
            json = serializer.Serialize((object)"15");
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------دریافت مبلغ اموال-------------------------
    //---------------------------------------------------------------------
    private void GetPriceValue()
    {
        string value = context.Request.Form["value"];
        var q = office.ofcBAmvals.Where(c => c.numAmvalCode == Convert.ToInt32(value)).FirstOrDefault();
        string json = "";

        json = serializer.Serialize((object)q.numPriceAmval);

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------جستجوی اموال------------------------------
    //---------------------------------------------------------------------
    private void GetSearchInfoAmval()
    {
        string AmvalNameInfo = context.Request.Form["AmvalNameInfo"];
        string JensInfo = context.Request.Form["JensInfo"];
        string PriceAmval = context.Request.Form["PriceAmval"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        PriceAmval = String.IsNullOrEmpty(PriceAmval) ? "-1" : PriceAmval;
        var q = (from t in office.ofcBAmvals
                 where
                      ((t.strAmvalName.Replace("ي", "ی").Replace("ك", "ک").Contains(AmvalNameInfo.Replace("ي", "ی").Replace("ك", "ک"))) || AmvalNameInfo == "")
                      &&
                      ((t.strAmvalJens.Replace("ي", "ی").Replace("ك", "ک").Contains(JensInfo.Replace("ي", "ی").Replace("ك", "ک"))) || JensInfo == "")
                  &&
                   (t.numPriceAmval == Convert.ToInt32(PriceAmval) || PriceAmval == "-1")
                 select new
                 {
                     t.strAmvalJens,
                     t.strAmvalName,
                     t.numPriceAmval,
                     t.numAmvalCode,

                 });
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.strAmvalName).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ویرایش اطلاعات اموال-----------------------
    //---------------------------------------------------------------------
    public void EditWorkInfoAmval()
    {
        string code = context.Request.Form["code"];
        string AmvalNameInfo = context.Request.Form["AmvalNameInfo"];
        string JensInfo = context.Request.Form["JensInfo"];
        string PriceAmval = context.Request.Form["PriceAmval"];

        string json = "";
        var q = office.ofcBAmvals.Where(c => c.numAmvalCode == Convert.ToInt32(code)).FirstOrDefault();
        q.strAmvalName = AmvalNameInfo.Trim();
        q.strAmvalJens = JensInfo.Trim();
        q.numPriceAmval = Convert.ToInt32(PriceAmval);

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
    //---------------------------------------------------------------------
    //--------------------------حذف اطلاعات اموال--------------------------
    //---------------------------------------------------------------------
    public void DeleteInfoAmvalName()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        var amval = office.ofcBAmvals.Where(o => o.numAmvalCode == code).FirstOrDefault();
        string json = "";
        try
        {
            if (amval != null)
            {
                int checkamvalCount = office.ofcPersonelAmvals.Where(c => c.numAmvalRef == code).Count();
                if (checkamvalCount == 0)
                {
                    office.ofcBAmvals.DeleteOnSubmit(amval);
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1");// حذف شد
                }
                else
                {
                    json = serializer.Serialize((object)"2"); // این گروه کاری استفاده شده است
                }

            }
            else
            {
                json = serializer.Serialize((object)"5"); // این گروه کاری وجود ندارد
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
    //--------------------------ثبت اطلاعات اموال پرسنل-------------------
    //---------------------------------------------------------------------
    public void saveAmvalPersonel()
    {
        string dataInfo = context.Request.Form["dataInfo"];
        string[] arrayInfo = dataInfo.Split('^').Where(C => !String.IsNullOrEmpty(C)).ToArray();

        string json = "";
        foreach (var item in arrayInfo)
        {
            string[] arrayItem = item.Split(',').Where(C => !String.IsNullOrEmpty(C)).ToArray();

            office.ofcPersonelAmvals.InsertOnSubmit(new ofcPersonelAmval
            {
                numAmvalRef = Convert.ToInt32(arrayItem[1]),
                numCountPersonelAmval = Convert.ToInt32(arrayItem[3]),
                numPersonelRef = Convert.ToInt32(arrayItem[0]),
                numPricePersonelAmval = Convert.ToInt32(arrayItem[4]),
                strBarChasbCode = (arrayItem[2] == "-" ? "" : arrayItem[2]),
                strDesc = arrayItem[5] == "-" ? "" : arrayItem[5],
                dateResisterDate = _PDate.PersianDate,
                strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                numStatus = 1
            });
        }

        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1");
        }
        catch
        {
            json = serializer.Serialize((object)"15");
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------پیش ثبت اطلاعات اموال پرسنل---------------
    //---------------------------------------------------------------------
    public void PreSavePersonelAmval()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        int amvalcode = Convert.ToInt32(context.Request.Form["amvalcode"]);
        string json = "";

        int amvalCheck = office.ofcPersonelAmvals.Where(o => o.numPersonelRef == personelcode && o.numAmvalRef == amvalcode).Count();
        if (amvalCheck > 0)
        {
            json = serializer.Serialize((object)"5");
        }
        else
        {
            var personelinfo = (from t in office.ofcPersonels
                                join t1 in office.ofcPersonelWorkGroupLogs on t.numPersonelCode equals t1.numPersonelRef into join_t1
                                from t1 in join_t1.DefaultIfEmpty()
                                join t3 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t3.numWorkGroupCode into join_t3
                                from t3 in join_t3.DefaultIfEmpty()
                                join t4 in office.ofcBWorkGroupBakhshes on t1.numBakhshWorkGroupRef equals t4.numBakhshWorkGroupCode into join_t4
                                from t4 in join_t4.DefaultIfEmpty()
                                join t5 in office.ofcBWorkGroupGhesmats on t1.numGhesmatWorkgroupRef equals t5.numGhesmatWorkgroupCode into join_t5
                                from t5 in join_t5.DefaultIfEmpty()
                                where
                                           t.numPersonelCode == personelcode
                                select new
                                {
                                    strPersonelName = t.strPersonelName.Trim() + " " + t.strPersonelFamily.Trim(),
                                    strWorkGroupName = t3.strWorkGroupName == null ? "-" : t3.strWorkGroupName,
                                    strBakhshName = t4.strBakhshName == null ? "-" : t4.strBakhshName,
                                    strGhesmatName = t5.strGhesmatName == null ? "-" : t5.strGhesmatName,
                                    numWorkgroupLogCode = (t1.numWorkgroupLogCode == null ? t.numPersonelCode : t1.numWorkgroupLogCode)
                                }).OrderByDescending(c => c.numWorkgroupLogCode).Take(1);

            json = serializer.Serialize((object)personelinfo.ToList());
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------جستجو اموال پرسنل-------------------------
    //---------------------------------------------------------------------
    private void searchamvalPersonel()
    {
        string perosnelcode = context.Request.Form["perosnelcode"];
        string workgroup = context.Request.Form["workgroup"];
        string bakhsh = context.Request.Form["bakhsh"];
        string barchasb = context.Request.Form["barchasb"];
        string amvalcode = context.Request.Form["amvalcode"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);

        perosnelcode = String.IsNullOrEmpty(perosnelcode) ? "-1" : perosnelcode;
        amvalcode = String.IsNullOrEmpty(amvalcode) ? "-1" : amvalcode;
        workgroup = String.IsNullOrEmpty(workgroup) ? "-1" : workgroup;
        bakhsh = String.IsNullOrEmpty(bakhsh) ? "-1" : bakhsh;

        var info = (from t1 in office.ofcPersonelWorkGroupLogs
                    join t3 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t3.numWorkGroupCode into join_t3
                    from t3 in join_t3.DefaultIfEmpty()
                    join t4 in office.ofcBWorkGroupBakhshes on t1.numBakhshWorkGroupRef equals t4.numBakhshWorkGroupCode into join_t4
                    from t4 in join_t4.DefaultIfEmpty()
                    join t5 in office.ofcBWorkGroupGhesmats on t1.numGhesmatWorkgroupRef equals t5.numGhesmatWorkgroupCode into join_t5
                    from t5 in join_t5.DefaultIfEmpty()
                    where
                      (t1.numWorkGroupRef == Convert.ToInt32(workgroup) || workgroup == "-1")
                      &&
                      (t1.numBakhshWorkGroupRef == Convert.ToInt32(bakhsh) || bakhsh == "-1")
                    select new
                    {
                        strWorkGroupName = t3.strWorkGroupName == null ? "-" : t3.strWorkGroupName,
                        strBakhshName = t4.strBakhshName == null ? "-" : t4.strBakhshName,
                        strGhesmatName = t5.strGhesmatName == null ? "-" : t5.strGhesmatName,
                        t1.numPersonelRef,
                        t1.numWorkgroupLogCode
                    }).AsQueryable();

        int[] arraypersonelcode = info.Select(c => Convert.ToInt32(c.numPersonelRef)).ToArray();

        var q = (from t in office.ofcPersonelAmvals
                 join t0 in office.ofcPersonels on t.numPersonelRef equals t0.numPersonelCode
                 join t6 in office.ofcBAmvals on t.numAmvalRef equals t6.numAmvalCode

                 where
                      (t.numPersonelRef == Convert.ToInt32(perosnelcode) || perosnelcode == "-1")
                      &&
                      (t.strBarChasbCode == barchasb || barchasb == "")
                      &&
                      (t.numAmvalRef == Convert.ToInt32(amvalcode) || amvalcode == "-1")
                      &&
                      (((workgroup != "-1" || bakhsh!="-1") &&  arraypersonelcode.Contains((int) t.numPersonelRef)) || (workgroup == "-1" && bakhsh=="-1"))
                      &&
                      t.numStatus == 1
                 select new
                 {
                     t.numPersonelRef,
                     strPersonelName =t0.strPersonelName.Trim() + " " + t0.strPersonelFamily.Trim(),
                     strWorkGroupName =info.Where(c=> c.numPersonelRef==t.numPersonelRef).OrderByDescending(c=> c.numWorkgroupLogCode).Take(1).FirstOrDefault().strWorkGroupName == null ? "-" : info.Where(c=> c.numPersonelRef==t.numPersonelRef).OrderByDescending(c=> c.numWorkgroupLogCode).Take(1).FirstOrDefault().strWorkGroupName,
                     strBakhshName =info.Where(c=> c.numPersonelRef==t.numPersonelRef).OrderByDescending(c=> c.numWorkgroupLogCode).Take(1).FirstOrDefault().strBakhshName == null ? "-" : info.Where(c=> c.numPersonelRef==t.numPersonelRef).OrderByDescending(c=> c.numWorkgroupLogCode).Take(1).FirstOrDefault().strBakhshName, 
                     strGhesmatName =info.Where(c=> c.numPersonelRef==t.numPersonelRef).OrderByDescending(c=> c.numWorkgroupLogCode).Take(1).FirstOrDefault().strGhesmatName == null ? "-" : info.Where(c=> c.numPersonelRef==t.numPersonelRef).OrderByDescending(c=> c.numWorkgroupLogCode).Take(1).FirstOrDefault().strGhesmatName,
                     t6.strAmvalName,
                     t6.strAmvalJens,
                     t.numPricePersonelAmval,
                     t.numCountPersonelAmval,
                     t.numAmvalRef,
                     t.strDesc,
                     strBarChasbCode = t.strBarChasbCode == null || t.strBarChasbCode == "" ? "-" : t.strBarChasbCode
                 });
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.numPersonelRef).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------حذف اموال پرسنل--------------------------
    //---------------------------------------------------------------------
    public void DeleteamvalPersonel()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        int amvalcode = Convert.ToInt32(context.Request.Form["amvalcode"]);
        string json = "";
        try
        {
            var checkamvalCount = office.ofcPersonelAmvals.Where(c => c.numPersonelRef == personelcode && c.numAmvalRef == amvalcode).FirstOrDefault();
            if (checkamvalCount != null)
            {
                office.ofcPersonelAmvals.DeleteOnSubmit(checkamvalCount);
                office.SubmitChanges();
                json = serializer.Serialize((object)"1");// حذف شد
            }
            else
            {
                json = serializer.Serialize((object)"2"); //اطلاعاتی یافت نشد
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
    //--------------------------ثبت اطلاعات حواله اموال--------------------------
    //---------------------------------------------------------------------
    public void saveHavalehInfo()
    {
        int havalehcode = Convert.ToInt32(context.Request.Form["havalehcode"]);
        int amvalcode = Convert.ToInt32(context.Request.Form["amvalcode"]);
        int cntamval = Convert.ToInt32(context.Request.Form["cntamval"]);
        int priceamval = Convert.ToInt32(context.Request.Form["priceamval"]);
        string desc = context.Request.Form["desc"];

        var amval = office.ofcBAmvals.Where(o => o.numAmvalCode == amvalcode).FirstOrDefault();
        string json = "";

        if (amval != null)
        {
            //var zarbNumber = office.ofcBHavalehAmvals.Where(c => c.numAmvalHavalehCode == havalehcode).FirstOrDefault();
            //int mojodi = GetMojodiAmval(amvalcode);
            //mojodi = mojodi - Convert.ToInt32(cntamval * zarbNumber.numNumberZarb);
            //if (zarbNumber.numNumberZarb < 0 && mojodi < 0)
            //{
            //        json = serializer.Serialize((object)"2"); //   mojodi sefr mibashad
            //}
            //else
            //{
            office.ofcHavalehAmvalInfos.InsertOnSubmit(new ofcHavalehAmvalInfo
            {
                numAmvalHavalehRef = havalehcode,
                dateResisterDate = _PDate.PersianDate,
                numAmvalRef = amvalcode,
                numCountAmval = cntamval,
                numPriceAmval = priceamval,
                strDesc = desc,
                strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                timeRegisterTime = _PDate.PersianTime,
            });

            //-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-==-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-=-=-=-=-=
            var checkAmvalLog = office.ofcHavalehAmvalInfoLogs.Where(c => c.numAmvalRef == amvalcode && c.numPriceAmval == priceamval).FirstOrDefault();
            if (checkAmvalLog == null)
            {
                office.ofcHavalehAmvalInfoLogs.InsertOnSubmit(new ofcHavalehAmvalInfoLog
                {
                    numAmvalRef = amvalcode,
                    numCountMojodiAmval = cntamval,
                    numPriceAmval = priceamval,
                    dateResisterDate = _PDate.PersianDate,
                    strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                    timeRegisterTime = _PDate.PersianTime,
                    numStatus = 1,
                    numCountAssignAmval = 0
                });
            }
            else
            {
                int cnt = Convert.ToInt32(checkAmvalLog.numCountMojodiAmval) + cntamval;
                checkAmvalLog.numCountMojodiAmval = cnt;
                if (cnt > checkAmvalLog.numCountAssignAmval && checkAmvalLog.numStatus == 0) checkAmvalLog.numStatus = 1;

                checkAmvalLog.dateResisterDate = _PDate.PersianDate;
                checkAmvalLog.strRegisterUserRef = _ofcUser.strUserCode.Trim();
                checkAmvalLog.timeRegisterTime = _PDate.PersianTime;
            }

            //--------------------------------------------------
            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); //   ok
            }
            catch
            {
                json = serializer.Serialize((object)"15"); // خطا
            }

        }
        else
        {
            json = serializer.Serialize((object)"5"); //   وجود ندارد
        }


        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-----------------------دریافت موجودی فعلی اموال--------------------
    //---------------------------------------------------------------------
    private int GetMojodiAmval(int amvalcode)
    {
        int mojodi = Convert.ToInt32(office.ofcHavalehAmvalInfos.Where(c => c.numAmvalRef == amvalcode).Sum(c => c.numCountAmval));
        return mojodi;
    }
    //---------------------------------------------------------------------
    //--------------------------پیش ثبت واگذاری اموال---------------
    //---------------------------------------------------------------------
    public void PreSaveVagozarAmval()
    {
        int personelfrom = Convert.ToInt32(context.Request.Form["personelfrom"]);
        int personelto = Convert.ToInt32(context.Request.Form["personelto"]);
        int status = Convert.ToInt32(context.Request.Form["status"]);

        string json = "";
        int amvalCheck = 0;
        if (status == 1)
            amvalCheck = office.ofcPersonelAmvals.Where(o => o.numPersonelRef == personelfrom && o.numStatus == 1).Count();
        else if (status == 2)
            amvalCheck = office.ofcPersonelVagozarAmvals.Where(o => o.numPersonelRef == personelfrom && o.numStatus == 1).Count();
        if (amvalCheck == 0)
        {
            json = serializer.Serialize((object)"5");
        }
        else
        {
            string personelnamefrom = "";
            string personelnameTo = "";
            var personelfromCheck = office.ofcPersonels.Where(c => c.numPersonelCode == personelfrom).FirstOrDefault();
            if (personelfromCheck != null)
            {
                personelnamefrom = personelfromCheck.strPersonelName.Trim() + " " + personelfromCheck.strPersonelFamily.Trim();
                var personelToCheck = office.ofcPersonels.Where(c => c.numPersonelCode == personelto).FirstOrDefault();
                if (personelToCheck != null)
                {
                    personelnameTo = personelToCheck.strPersonelName.Trim() + " " + personelToCheck.strPersonelFamily.Trim();
                    if (status == 1) // vagozari amaval asli 
                    {
                        var personelinfo = (from t1 in office.ofcPersonelAmvals
                                            join t2 in office.ofcBAmvals on t1.numAmvalRef equals t2.numAmvalCode
                                            where
                                                 t1.numPersonelRef == personelfrom
                                                 &&
                                                 t1.numStatus == 1
                                            select new
                                            {
                                                strPersonelNamefrom = personelnamefrom,
                                                numPersonelCodefrom = personelfrom,
                                                strPersonelNameTo = personelnameTo,
                                                numPersonelCodeTo = personelto,
                                                t2.strAmvalName,
                                                t1.numPricePersonelAmval,
                                                t1.numCountPersonelAmval,
                                                t1.strDesc,
                                                t1.strBarChasbCode,
                                                t1.numAmvalRef
                                            });

                        json = serializer.Serialize((object)personelinfo.ToList());
                    }
                    else if (status == 2) // dar ekhtiar gozashtan amval vogozar shode
                    {
                        var personelinfo1 = (from t in office.ofcPersonelVagozarAmvals
                                             join t0 in office.ofcPersonels on t.numPersonelRef equals t0.numPersonelCode
                                             join t6 in office.ofcBAmvals on t.numAmvalRef equals t6.numAmvalCode
                                             where
                                                  t.numPersonelRef == personelfrom
                                                  &&
                                                  t.numStatus == 1
                                             group new { t, t0 } by new
                                             {
                                                 t.numPersonelRef,
                                                 t.numPersonelRefVagozar,
                                                 strPersonelName = t0.strPersonelName.Trim() + " " + t0.strPersonelFamily.Trim()
                                             } into g
                                             select new
                                             {
                                                 g.Key.numPersonelRef,
                                                 g.Key.strPersonelName,
                                                 g.Key.numPersonelRefVagozar,
                                                 strpersonelVagozarName = office.ofcPersonels.Where(c => c.numPersonelCode == g.Key.numPersonelRefVagozar).FirstOrDefault().strPersonelName.Trim() + " " + office.ofcPersonels.Where(c => c.numPersonelCode == g.Key.numPersonelRefVagozar).FirstOrDefault().strPersonelFamily.Trim(),
                                                 sumcnt = g.Sum(c => c.t.numCountPersonelAmval),
                                                 sumprice = g.Sum(c => c.t.numCountPersonelAmval * c.t.numPricePersonelAmval),
                                                 strPersonelNameTo = personelnameTo,
                                                 numPersonelCodeTo = personelto,
                                             });

                        json = serializer.Serialize((object)personelinfo1.ToList());
                    }
                }
                else
                {
                    json = serializer.Serialize((object)"2"); // personel to not found
                }
            }
            else
            {
                json = serializer.Serialize((object)"3"); // personel from not found
            }

        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ثبت نهایی واگذاری اموال---------------
    //---------------------------------------------------------------------
    public void SaveFinalVagozariAmval()
    {
        int personelfrom = Convert.ToInt32(context.Request.Form["personelfrom"]);
        int personelto = Convert.ToInt32(context.Request.Form["personelto"]);
        int status = Convert.ToInt32(context.Request.Form["status"]);
        int vagozari = Convert.ToInt32(context.Request.Form["vagozari"]);
        string amvalinfoSelected = context.Request.Form["amvalinfoSelected"];

        string[] arrayamvalcode = amvalinfoSelected.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();

        string json = "";
        if (status == 1) // vagozari amval dar ekhtiar
        {
            var amvalCheck = office.ofcPersonelAmvals.Where(o => o.numPersonelRef == personelfrom && o.numStatus == 1 && arrayamvalcode.Contains(o.numAmvalRef.ToString()));
            if (amvalCheck.Any())
            {
                foreach (var item in amvalCheck)
                {
                    office.ofcPersonelVagozarAmvals.InsertOnSubmit(new ofcPersonelVagozarAmval
                    {
                        numPersonelRef = personelto,
                        numPersonelRefVagozar = personelfrom,
                        numStatus = 1,
                        dateResisterDate = _PDate.PersianDate,
                        numAmvalRef = item.numAmvalRef,
                        numCountPersonelAmval = item.numCountPersonelAmval,
                        numPricePersonelAmval = item.numPricePersonelAmval,
                        strBarChasbCode = item.strBarChasbCode,
                        strDesc = item.strDesc,
                        strRegisterUserRef = _ofcUser.strUserCode
                    });
                }

                try
                {
                    office.ofcPersonelAmvals.DeleteAllOnSubmit(amvalCheck);
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1");
                }
                catch (Exception ex)
                {
                    string a = ex.Message;
                    json = serializer.Serialize((object)"15");

                }
            }
            else
            {
                json = serializer.Serialize((object)"5");
            }
        }
        else if (status == 2) // enteghal amval vagozar shode be dar ekhtiar
        {
            var amvalCheck = office.ofcPersonelVagozarAmvals.Where(o => o.numPersonelRef == personelfrom && o.numPersonelRefVagozar == vagozari && o.numStatus == 1 && arrayamvalcode.Contains(o.numAmvalRef.ToString()));
            if (amvalCheck.Any())
            {

                foreach (var item in amvalCheck)
                {

                    var checkAmvalInfo = office.ofcPersonelAmvals.Where(c => c.numPersonelRef == personelto && c.numStatus == 1 && c.numAmvalRef == item.numAmvalRef).FirstOrDefault();
                    if (checkAmvalInfo != null)
                    {
                        checkAmvalInfo.numCountPersonelAmval = checkAmvalInfo.numCountPersonelAmval + item.numCountPersonelAmval;
                    }
                    else
                    {
                        office.ofcPersonelAmvals.InsertOnSubmit(new ofcPersonelAmval
                        {
                            numPersonelRef = personelto,
                            numStatus = 1,
                            dateResisterDate = _PDate.PersianDate,
                            numAmvalRef = (int)item.numAmvalRef,
                            numCountPersonelAmval = item.numCountPersonelAmval,
                            numPricePersonelAmval = item.numPricePersonelAmval,
                            strBarChasbCode = item.strBarChasbCode,
                            strDesc = item.strDesc,
                            strRegisterUserRef = _ofcUser.strUserCode,
                        });
                    }
                }
                try
                {
                    office.ofcPersonelVagozarAmvals.DeleteAllOnSubmit(amvalCheck);
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1");
                }
                catch (Exception ex)
                {
                    string a = ex.Message;
                    json = serializer.Serialize((object)"15");

                }

            }
            else
            {
                json = serializer.Serialize((object)"5");
            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------جستجو واگذاری اموال-------------------------
    //---------------------------------------------------------------------
    private void searchAmvalVagozar()
    {
        string perosnelcode = context.Request.Form["perosnelcode"];
        string amvalcode = context.Request.Form["amvalcode"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);

        perosnelcode = String.IsNullOrEmpty(perosnelcode) ? "-1" : perosnelcode;
        amvalcode = String.IsNullOrEmpty(amvalcode) ? "-1" : amvalcode;

        var q = (from t in office.ofcPersonelVagozarAmvals
                 join t0 in office.ofcPersonels on t.numPersonelRef equals t0.numPersonelCode
                 join t6 in office.ofcBAmvals on t.numAmvalRef equals t6.numAmvalCode
                 where
                      (t.numPersonelRef == Convert.ToInt32(perosnelcode) || perosnelcode == "-1")
                      &&
                      (t.numAmvalRef == Convert.ToInt32(amvalcode) || amvalcode == "-1")
                      &&
                      t.numStatus == 1
                 group new { t, t0 } by new
                 {
                     t.numPersonelRef,
                     t.numPersonelRefVagozar,
                     strPersonelName = t0.strPersonelName.Trim() + " " + t0.strPersonelFamily.Trim()
                 } into g
                 select new
                 {
                     g.Key.numPersonelRef,
                     g.Key.strPersonelName,
                     g.Key.numPersonelRefVagozar,
                     strpersonelVagozarName = g.Key.numPersonelRefVagozar == null ? "" : (office.ofcPersonels.Where(c => c.numPersonelCode == g.Key.numPersonelRefVagozar).FirstOrDefault().strPersonelName.Trim() + " " + office.ofcPersonels.Where(c => c.numPersonelCode == g.Key.numPersonelRefVagozar).FirstOrDefault().strPersonelFamily.Trim()),
                     sumcnt = g.Sum(c => c.t.numCountPersonelAmval),
                     sumprice = g.Sum(c => c.t.numCountPersonelAmval * c.t.numPricePersonelAmval),

                 });
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.numPersonelRef).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------جزییات واگذاری اموال---------------
    //---------------------------------------------------------------------
    public void DetailsPersonelVagozar()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        int personelcodevagizar = Convert.ToInt32(context.Request.Form["personelcodevagizar"]);

        string json = "";
        int amvalCheck = office.ofcPersonelVagozarAmvals.Where(o => o.numPersonelRef == personelcode && o.numPersonelRefVagozar == personelcodevagizar && o.numStatus == 1).Count();
        if (amvalCheck == 0)
        {
            json = serializer.Serialize((object)"5");
        }
        else
        {

            var personelinfo1 = (from t1 in office.ofcPersonelVagozarAmvals
                                 join t2 in office.ofcBAmvals on t1.numAmvalRef equals t2.numAmvalCode
                                 where
                                      t1.numPersonelRef == personelcode
                                      &&
                                      t1.numPersonelRefVagozar == personelcodevagizar
                                      &&
                                      t1.numStatus == 1
                                 select new
                                 {
                                     t2.strAmvalName,
                                     t1.numPricePersonelAmval,
                                     t1.numCountPersonelAmval,
                                     t1.strDesc,
                                     t1.strBarChasbCode,
                                     t1.numAmvalRef
                                 });

            json = serializer.Serialize((object)personelinfo1.ToList());
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