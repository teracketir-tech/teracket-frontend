<%@ WebHandler Language="C#" Class="PBPersonelWorkGroup" %>

using System;
using System.Web;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;

public class PBPersonelWorkGroup : IHttpHandler, IReadOnlySessionState
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);

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
                    saveNewWorkGroup();//ثبت گروه کاری جدید
                    break;
                case 3:
                    GetAllWorkGroup();//دریافت کل گروه کاری
                    break;
                case 4:
                    SetActiveAndDeActive();//
                    break;
                case 5:
                    EditWorkGroupName();//
                    break;
                case 6:
                    DeleteWorkGroupName();//
                    break;
                case 7:
                    GetInfoPersonelForWorkGroup();//
                    break;
                case 8:
                    SaveChangeWorkGroupPersonel();//
                    break;
                case 9:
                    GetAllBakhshWorkGroup();//دریافت کل بخش گروه کاری
                    break;
                case 10:
                    saveBakhshNewWorkGroup();//ثبت بخش گروه کاری جدید
                    break;
                case 11:
                    SetActiveAndDeActiveBakhsh();//
                    break;
                case 12:
                    EditBakhshWorkGroupName();//
                    break;
                case 13:
                    DeleteBakhshWorkGroupName();//
                    break;
                case 14:
                    saveGhesmatNewWorkGroup();//ثبت قسمت گروه کاری جدید
                    break;
                case 15:
                    SetActiveAndDeActiveGhesmat();//
                    break;
                case 16:
                    EditGhesmatWorkGroupName();//
                    break;
                case 17:
                    DeleteGhesmatWorkGroupName();//
                    break;
                case 18:
                    GetAllGhesmatWorkGroup();//دریافت کل قسمت گروه کاری
                    break;
                case 19:
                    GetCountPersonelWorkGroupNon();// تعداد پرسنلی که گروه کاری ندارند
                    break;
                case 20:
                    saveOnvanNewWorkGroup();//ثبت عنوان گروه کاری جدید
                    break;
                case 21:
                    SetActiveAndDeActiveOnvan();//
                    break;
                case 22:
                    EditOnvanWorkGroupName();//
                    break;
                case 23:
                    DeleteOnvanWorkGroupName();//
                    break;
                case 24:
                    GetAllOnvanWorkGroup();//دریافت کل عنوان گروه کاری
                    break;
                case 25:
                    GetAllPersonelWorkGroup();//دریافت کل پرسنل گروه کاری
                    break;

            }

        }
    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراپ دان ها----------------
    //---------------------------------------------------------------------
    public void GetAlldrpdwnRegisterPersonel()
    {
        var workgroup = (from t in office.ofcBWorkGroups
                         where t.numStatus == 1
                         orderby t.strWorkGroupName
                         select new
                         {
                             value = t.numWorkGroupCode,
                             item = t.strWorkGroupName
                         }).ToList();

        var Bakhshworkgroup = from t in office.ofcBWorkGroupBakhshes
                              where t.numStatus == 1
                              orderby t.strBakhshName
                              select new
                              {
                                  value = t.numBakhshWorkGroupCode,
                                  item = t.strBakhshName,
                                  groupcode = t.numWorkGroupRef
                              };

        var Ghesmatworkgroup = from t in office.ofcBWorkGroupGhesmats
                               where t.numStatus == 1
                               orderby t.strGhesmatName
                               select new
                               {
                                   value = t.numGhesmatWorkgroupCode,
                                   item = t.strGhesmatName,
                                   groupcode = t.numWorkGroupRef,
                                   bakhshgroup = t.numBakhshWorkGroupRef
                               };
        var Onvanworkgroup = from t in office.ofcBWorkGroupOnvans
                             where t.numStatus == 1
                             orderby t.strOnvanName
                             select new
                             {
                                 value = t.numOnvanWorkGroupCode,
                                 item = t.strOnvanName,
                                 groupcode = t.numWorkGroupRef,
                                 bakhshgroup = t.numBakhshWorkGroupRef,
                                 ghesmatcode = t.numGhesmatWorkgroupRef
                             };

        var ContractKinds = from t in office.ofcBContractKinds
                            select new
                            {
                                value = t.numContractKindCode,
                                item = t.strContractKindName,
                            };

        string json2 = serializer.Serialize((object)workgroup);
        string json3 = serializer.Serialize((object)Bakhshworkgroup);
        string json4 = serializer.Serialize((object)Ghesmatworkgroup);
        string json5 = serializer.Serialize((object)Onvanworkgroup);
        string json6 = serializer.Serialize((object)ContractKinds);

        string json = "[" + json2 + "," + json3 + "," + json4 + "," + json5 + "," + json6 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ثبت گروه کاری جدید-----------------------
    //---------------------------------------------------------------------
    public void saveNewWorkGroup()
    {
        string groupName = context.Request.Form["groupName"];
        string json = "";
        int RolenameCheck = office.ofcBWorkGroups.Where(o => o.strWorkGroupName.Trim() == groupName.Trim()).Count();
        try
        {
            if (RolenameCheck > 0)
            {
                json = serializer.Serialize((object)"5");
            }
            else
            {
                office.ofcBWorkGroups.InsertOnSubmit(new ofcBWorkGroup
                {
                    strWorkGroupName = groupName.Trim(),
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
    //--------------------------دریافت کل گروه کاری-----------------------
    //---------------------------------------------------------------------
    public void GetAllWorkGroup()
    {
        var q = from t in office.ofcBWorkGroups
                select new
                {
                    t.numStatus,
                    t.numWorkGroupCode,
                    t.strWorkGroupName
                };
        string json = serializer.Serialize((object)q.OrderBy(c => c.strWorkGroupName));
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    public void SetActiveAndDeActive()
    {
        string checkis = context.Request.Form["checkis"];
        string code = context.Request.Form["code"];

        string json = "";
        var q = office.ofcBWorkGroups.Where(c => c.numWorkGroupCode == Convert.ToInt32(code)).FirstOrDefault();
        if (checkis == "1")
        {
            q.numStatus = 1;
        }
        else
        {
            q.numStatus = 0;
        }

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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void EditWorkGroupName()
    {
        string code = context.Request.Form["code"];
        string groupName = context.Request.Form["groupName"];

        string json = "";
        var q = office.ofcBWorkGroups.Where(c => c.numWorkGroupCode == Convert.ToInt32(code)).FirstOrDefault();
        q.strWorkGroupName = groupName;

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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void DeleteWorkGroupName()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        var workgroup = office.ofcBWorkGroups.Where(o => o.numWorkGroupCode == code).FirstOrDefault();
        string json = "";
        try
        {
            if (workgroup != null)
            {

                int checkWorkGroupCount = office.ofcPersonelContracts.Where(c => c.numWorkGroupRef == code).Count();
                if (checkWorkGroupCount == 0)
                {
                    office.ofcBWorkGroups.DeleteOnSubmit(workgroup);
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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void GetInfoPersonelForWorkGroup()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        string json = "";
        var check = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode).FirstOrDefault();
        if (check != null)
        {
            var q1 = (from t in office.ofcPersonels
                      join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                      where
                           t1.numStatus == 1
                           &&
                           t.numPersonelCode == personelcode
                           &&
                           //(
                           t1.numWorkGroupRef == null
                           &&
                           (t.numStatus == 1 || t.numStatus == 2)
                      //||
                      //t1.numBakhshWorkGroupRef==null)
                      select new
                      {
                          numPersonelCode = t.numPersonelCode,
                          strPersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                          dateCutWorkDate = t1.dateCutWorkDate,
                          dateEndContractDate = t1.dateEndContractDate,
                          dateStartContractDate = t1.dateStartContractDate,
                          StrContractUniqCode = t1.StrContractUniqCode,
                          numWorkGroupRef = getlastWorkgroup((int)t.numPersonelCode),
                          strWorkGroupName = "",
                          dateRegisterDate = "-",
                          timeRegisterTime = "-",
                          flag = 1,
                          numBakhshWorkGroupRef = getlastBakhshWorkgroup((int)t.numPersonelCode),
                          numGhesmatWorkgroupRef = getlastGhesmatWorkgroup((int)t.numPersonelCode),
                          numOnvanWorkGroupRef = getlastOnvanWorkgroup((int)t.numPersonelCode),
                          strBakhshName = "",
                          strGhesmatName = "",
                          strOnvanName = ""
                      }).ToList().AsQueryable();
            int CheckNew = q1.Count();
            var q2 = (from t in office.ofcPersonelWorkGroupLogs
                      join t1 in office.ofcPersonelContracts on t.numContractRef equals t1.numContractCode
                      join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                      join t3 in office.ofcBWorkGroups on t.numWorkGroupRef equals t3.numWorkGroupCode
                      join t4 in office.ofcBWorkGroupBakhshes on t.numBakhshWorkGroupRef equals t4.numBakhshWorkGroupCode into join_t4
                      from t4 in join_t4.DefaultIfEmpty()
                      join t5 in office.ofcBWorkGroupGhesmats on t.numGhesmatWorkgroupRef equals t5.numGhesmatWorkgroupCode into join_t5
                      from t5 in join_t5.DefaultIfEmpty()
                      join t6 in office.ofcBWorkGroupOnvans on t.numOnvanWorkGroupRef equals t6.numOnvanWorkGroupCode into join_t6
                      from t6 in join_t6.DefaultIfEmpty()
                      where
                            t.numPersonelRef == personelcode
                      //&&
                      //t.numBakhshWorkGroupRef!=null
                      //&&
                      //t1.numStatus == 1
                      select new
                      {
                          numPersonelCode = Convert.ToInt32(t.numPersonelRef),
                          strPersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                          dateCutWorkDate = t1.dateCutWorkDate,
                          dateEndContractDate = t1.dateEndContractDate,
                          dateStartContractDate = t1.dateStartContractDate,
                          StrContractUniqCode = t1.StrContractUniqCode,
                          numWorkGroupRef = t2.numWorkGroupRef,
                          strWorkGroupName = t3.strWorkGroupName,
                          dateRegisterDate = t.dateRegisterDate,
                          timeRegisterTime = t.timeRegisterTime,
                          flag = 0,
                          numBakhshWorkGroupRef = t.numBakhshWorkGroupRef,
                          numGhesmatWorkgroupRef = t.numGhesmatWorkgroupRef,
                          numOnvanWorkGroupRef = t.numOnvanWorkGroupRef,
                          strBakhshName = t4.strBakhshName == null || t4.strBakhshName == "" ? "-" : t4.strBakhshName,
                          strGhesmatName = t5.strGhesmatName == null || t5.strGhesmatName == "" ? "-" : t5.strGhesmatName,
                          strOnvanName = t6.strOnvanName == null || t6.strOnvanName == "" ? "-" : t6.strOnvanName
                      }).Distinct().ToList().AsQueryable();
            var q = q1.Concat(q2).OrderBy(c => c.flag);
            json = serializer.Serialize((object)q); // 
            json = "[" + json + "," + CheckNew + "]";
        }
        else
        {
            json = serializer.Serialize((object)"2"); // 
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    private short? getlastWorkgroup(int personelcode)
    {
        short? res = office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == personelcode).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numWorkGroupRef;

        return (res == null ? -1 : res);
    }
    //---------------------------------------------------------------------
    private int? getlastBakhshWorkgroup(int personelcode)
    {
        int? res = office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == personelcode).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numBakhshWorkGroupRef;

        return (res == null ? -1 : res);
    }
    //---------------------------------------------------------------------
    private int? getlastGhesmatWorkgroup(int personelcode)
    {
        int? res = office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == personelcode).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numGhesmatWorkgroupRef;

        return (res == null ? -1 : res);
    }
    //---------------------------------------------------------------------
    private int? getlastOnvanWorkgroup(int personelcode)
    {
        int? res = office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == personelcode).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numOnvanWorkGroupRef;

        return (res == null ? -1 : res);
    }

    //---------------------------------------------------------------------
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void SaveChangeWorkGroupPersonel()
    {
        string strtemp = context.Request.Form["strtemp"];
        string json = "";
        string[] array = strtemp.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        foreach (var item in array)
        {
            var q = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(item.Split('^')[0])).FirstOrDefault();
            if (q != null)
            {
                var contract = office.ofcPersonelContracts.Where(c => c.numStatus == 1 && c.numPersonelRef == Convert.ToInt32(item.Split('^')[0])).FirstOrDefault();
                if (contract.numWorkGroupRef != Convert.ToInt16(item.Split('^')[1]))
                {
                    q.numWorkGroupRef = Convert.ToInt16(item.Split('^')[1]);
                    contract.numWorkGroupRef = Convert.ToInt16(item.Split('^')[1]);
                    contract.numBakhshWorkGroupRef = Convert.ToInt16(item.Split('^')[2]);
                    contract.numGhesmatWorkgroupRef = Convert.ToInt16(item.Split('^')[3]);
                    int? onvanValue = null;
                    if (item.Split('^')[4] != "-1")
                    {
                        contract.numOnvanWorkGroupRef = Convert.ToInt16(item.Split('^')[4]);
                        onvanValue = Convert.ToInt16(item.Split('^')[4]);
                    }


                    office.ofcPersonelWorkGroupLogs.InsertOnSubmit(new ofcPersonelWorkGroupLog
                    {
                        numOnvanWorkGroupRef = onvanValue,
                        numGhesmatWorkgroupRef = Convert.ToInt16(item.Split('^')[3]),
                        numBakhshWorkGroupRef = Convert.ToInt16(item.Split('^')[2]),
                        numWorkGroupRef = Convert.ToInt16(item.Split('^')[1]),
                        numPersonelRef = Convert.ToInt32(item.Split('^')[0]),
                        strRegisterUserRef = _ofcUser.strUserCode,
                        dateRegisterDate = _PDate.PersianDate,
                        timeRegisterTime = _PDate.PersianTime,
                        numContractRef = contract.numContractCode

                    });
                }

            }
        }

        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1");// 
        }
        catch
        {
            json = serializer.Serialize((object)"2"); // 
        }
        context.Response.Write(json);
        context.Response.End();
    }

    //---------------------------------------------------------------------
    //--------------------------دریافت کل بخش گروه کاری-----------------------
    //---------------------------------------------------------------------
    public void GetAllBakhshWorkGroup()
    {
        var q = from t in office.ofcBWorkGroupBakhshes
                join t1 in office.ofcBWorkGroups on t.numWorkGroupRef equals t1.numWorkGroupCode
                select new
                {
                    t.numStatus,
                    t.numBakhshWorkGroupCode,
                    t.strBakhshName,
                    t1.strWorkGroupName,
                    t.numWorkGroupRef
                };
        string json = serializer.Serialize((object)q.OrderBy(c => c.strWorkGroupName));
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ثبت بخش گروه کاری جدید-----------------------
    //---------------------------------------------------------------------
    public void saveBakhshNewWorkGroup()
    {
        string groupcode = context.Request.Form["groupcode"];
        string BakhshgroupName = context.Request.Form["BakhshgroupName"];
        string json = "";
        int RolenameCheck = office.ofcBWorkGroupBakhshes.Where(o => o.numWorkGroupRef == Convert.ToInt32(groupcode) && o.strBakhshName.Trim() == BakhshgroupName.Trim()).Count();
        try
        {
            if (RolenameCheck > 0)
            {
                json = serializer.Serialize((object)"5");
            }
            else
            {
                office.ofcBWorkGroupBakhshes.InsertOnSubmit(new ofcBWorkGroupBakhsh
                {
                    strBakhshName = BakhshgroupName.Trim(),
                    numWorkGroupRef = Convert.ToInt32(groupcode),
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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void SetActiveAndDeActiveBakhsh()
    {
        string checkis = context.Request.Form["checkis"];
        string code = context.Request.Form["code"];

        string json = "";
        var q = office.ofcBWorkGroupBakhshes.Where(c => c.numBakhshWorkGroupCode == Convert.ToInt32(code)).FirstOrDefault();
        if (checkis == "1")
        {
            q.numStatus = 1;
        }
        else
        {
            q.numStatus = 0;
        }

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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void EditBakhshWorkGroupName()
    {
        string code = context.Request.Form["code"];
        string BakhshgroupName = context.Request.Form["BakhshgroupName"];
        string groupcode = context.Request.Form["groupcode"];

        string json = "";
        var q = office.ofcBWorkGroupBakhshes.Where(c => c.numBakhshWorkGroupCode == Convert.ToInt32(code)).FirstOrDefault();
        q.strBakhshName = BakhshgroupName;
        q.numWorkGroupRef = Convert.ToInt32(groupcode);

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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void DeleteBakhshWorkGroupName()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        var workgroup = office.ofcBWorkGroupBakhshes.Where(o => o.numBakhshWorkGroupCode == code).FirstOrDefault();
        string json = "";
        try
        {
            if (workgroup != null)
            {

                int checkWorkGroupCount = office.ofcPersonelContracts.Where(c => c.numBakhshWorkGroupRef == code).Count();
                if (checkWorkGroupCount == 0)
                {
                    office.ofcBWorkGroupBakhshes.DeleteOnSubmit(workgroup);
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
    //--------------------------ثبت قسمت گروه کاری جدید-----------------------
    //---------------------------------------------------------------------
    public void saveGhesmatNewWorkGroup()
    {
        string groupcode = context.Request.Form["groupcode"];
        string GhesmatgroupName = context.Request.Form["GhesmatgroupName"];
        string bakhsh = context.Request.Form["bakhsh"];
        string json = "";
        int RolenameCheck = office.ofcBWorkGroupGhesmats.Where(o => o.numWorkGroupRef == Convert.ToInt32(groupcode) && o.numBakhshWorkGroupRef == Convert.ToInt32(bakhsh) && o.strGhesmatName.Trim() == GhesmatgroupName.Trim()).Count();
        try
        {
            if (RolenameCheck > 0)
            {
                json = serializer.Serialize((object)"5");
            }
            else
            {
                office.ofcBWorkGroupGhesmats.InsertOnSubmit(new ofcBWorkGroupGhesmat
                {
                    strGhesmatName = GhesmatgroupName.Trim(),
                    numWorkGroupRef = Convert.ToInt32(groupcode),
                    numBakhshWorkGroupRef = Convert.ToInt32(bakhsh),
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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void SetActiveAndDeActiveGhesmat()
    {
        string checkis = context.Request.Form["checkis"];
        string code = context.Request.Form["code"];

        string json = "";
        var q = office.ofcBWorkGroupGhesmats.Where(c => c.numGhesmatWorkgroupCode == Convert.ToInt32(code)).FirstOrDefault();
        if (checkis == "1")
        {
            q.numStatus = 1;
        }
        else
        {
            q.numStatus = 0;
        }

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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void EditGhesmatWorkGroupName()
    {
        string code = context.Request.Form["code"];
        string GhesmatgroupName = context.Request.Form["GhesmatgroupName"];
        string groupcode = context.Request.Form["groupcode"];
        string Bakhsh = context.Request.Form["groupcodeBakhsh"];

        string json = "";
        var q = office.ofcBWorkGroupGhesmats.Where(c => c.numGhesmatWorkgroupCode == Convert.ToInt32(code)).FirstOrDefault();
        q.strGhesmatName = GhesmatgroupName;
        q.numWorkGroupRef = Convert.ToInt32(groupcode);
        q.numBakhshWorkGroupRef = Convert.ToInt32(Bakhsh);

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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void DeleteGhesmatWorkGroupName()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        var workgroup = office.ofcBWorkGroupGhesmats.Where(o => o.numGhesmatWorkgroupCode == code).FirstOrDefault();
        string json = "";
        try
        {
            if (workgroup != null)
            {

                int checkWorkGroupCount = office.ofcPersonelContracts.Where(c => c.numGhesmatWorkgroupRef == code).Count();
                if (checkWorkGroupCount == 0)
                {
                    office.ofcBWorkGroupGhesmats.DeleteOnSubmit(workgroup);
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
    //--------------------------دریافت کل قسمت گروه کاری-----------------------
    //---------------------------------------------------------------------
    public void GetAllGhesmatWorkGroup()
    {
        var q = from t in office.ofcBWorkGroupGhesmats
                join t1 in office.ofcBWorkGroups on t.numWorkGroupRef equals t1.numWorkGroupCode
                join t2 in office.ofcBWorkGroupBakhshes on t.numBakhshWorkGroupRef equals t2.numBakhshWorkGroupCode
                select new
                {
                    t.numStatus,
                    t.numGhesmatWorkgroupCode,
                    t.strGhesmatName,
                    t1.strWorkGroupName,
                    t.numWorkGroupRef,
                    t.numBakhshWorkGroupRef,
                    t2.strBakhshName
                };
        string json = serializer.Serialize((object)q.OrderBy(c => c.strWorkGroupName));
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------تعداد پرسنلی که گروه کاری ندارند-------------
    //---------------------------------------------------------------------
    private void GetCountPersonelWorkGroupNon()
    {
        string personelcode = context.Request.Form["personelcode"];
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        var q = (from t in office.ofcPersonelContracts
                 join t1 in office.ofcPersonels on t.numPersonelRef equals t1.numPersonelCode
                 where
                     (t1.numStatus == 1 || t1.numStatus == 2)
                     &&
                     t.numStatus == 1
                     &&
                     t.numWorkGroupRef == null
                     &&
                     (t1.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                 select new
                 {
                     t.numPersonelRef,
                     strPersonelName = t1.strPersonelName + " " + t1.strPersonelFamily,
                     t.dateCutWorkDate,
                     t.dateEndContractDate,
                     t.dateStartContractDate,
                     t.StrContractUniqCode,
                     numWorkGroupRef = (office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numWorkGroupRef == null ? -1 : office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numWorkGroupRef),
                     numBakhshWorkGroupRef = (office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numBakhshWorkGroupRef == null ? -1 : office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numBakhshWorkGroupRef),
                     numGhesmatWorkgroupRef = (office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numGhesmatWorkgroupRef == null ? -1 : office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numGhesmatWorkgroupRef),
                     numOnvanWorkGroupRef = (office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numOnvanWorkGroupRef == null ? -1 : office.ofcPersonelWorkGroupLogs.Where(c => c.numPersonelRef == t.numPersonelRef).OrderByDescending(c => c.numWorkgroupLogCode).Take(1).FirstOrDefault().numOnvanWorkGroupRef)
                 });
        string json = serializer.Serialize((object)q.ToList());
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ثبت عنوان گروه کاری جدید-----------------------
    //---------------------------------------------------------------------
    public void saveOnvanNewWorkGroup()
    {
        string groupcode = context.Request.Form["groupcode"];
        string OnvangroupName = context.Request.Form["OnvangroupName"];
        string bakhsh = context.Request.Form["bakhsh"];
        string ghesmat = context.Request.Form["ghesmat"];
        string json = "";
        int RolenameCheck = office.ofcBWorkGroupOnvans.Where(o => o.numWorkGroupRef == Convert.ToInt32(groupcode) && o.numBakhshWorkGroupRef == Convert.ToInt32(bakhsh) && o.numGhesmatWorkgroupRef == Convert.ToInt32(ghesmat) && o.strOnvanName.Trim() == OnvangroupName.Trim()).Count();
        try
        {
            if (RolenameCheck > 0)
            {
                json = serializer.Serialize((object)"5");
            }
            else
            {
                office.ofcBWorkGroupOnvans.InsertOnSubmit(new ofcBWorkGroupOnvan
                {
                    strOnvanName = OnvangroupName.Trim(),
                    numWorkGroupRef = Convert.ToInt32(groupcode),
                    numBakhshWorkGroupRef = Convert.ToInt32(bakhsh),
                    numStatus = 1,
                    numGhesmatWorkgroupRef = Convert.ToInt32(ghesmat)
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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void SetActiveAndDeActiveOnvan()
    {
        string checkis = context.Request.Form["checkis"];
        string code = context.Request.Form["code"];

        string json = "";
        var q = office.ofcBWorkGroupOnvans.Where(c => c.numOnvanWorkGroupCode == Convert.ToInt32(code)).FirstOrDefault();
        if (checkis == "1")
        {
            q.numStatus = 1;
        }
        else
        {
            q.numStatus = 0;
        }

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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void EditOnvanWorkGroupName()
    {
        string code = context.Request.Form["code"];
        string OnvangroupName = context.Request.Form["OnvangroupName"];
        string groupcode = context.Request.Form["groupcode"];
        string Bakhsh = context.Request.Form["groupcodeBakhsh"];
        string Ghesmat = context.Request.Form["groupcodeGhesmat"];


        string json = "";
        var q = office.ofcBWorkGroupOnvans.Where(c => c.numOnvanWorkGroupCode == Convert.ToInt32(code)).FirstOrDefault();
        q.strOnvanName = OnvangroupName;
        q.numWorkGroupRef = Convert.ToInt32(groupcode);
        q.numBakhshWorkGroupRef = Convert.ToInt32(Bakhsh);
        q.numGhesmatWorkgroupRef = Convert.ToInt32(Ghesmat);
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
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void DeleteOnvanWorkGroupName()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        var workgroup = office.ofcBWorkGroupOnvans.Where(o => o.numOnvanWorkGroupCode == code).FirstOrDefault();
        string json = "";
        try
        {
            if (workgroup != null)
            {
                int checkWorkGroupCount = office.ofcPersonelContracts.Where(c => c.numGhesmatWorkgroupRef == code).Count();
                if (checkWorkGroupCount == 0)
                {
                    office.ofcBWorkGroupOnvans.DeleteOnSubmit(workgroup);
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
    //--------------------------دریافت کل عنوان گروه کاری-----------------------
    //---------------------------------------------------------------------
    public void GetAllOnvanWorkGroup()
    {
        var q = from t in office.ofcBWorkGroupOnvans
                join t1 in office.ofcBWorkGroups on t.numWorkGroupRef equals t1.numWorkGroupCode
                join t2 in office.ofcBWorkGroupBakhshes on t.numBakhshWorkGroupRef equals t2.numBakhshWorkGroupCode
                join t3 in office.ofcBWorkGroupGhesmats on t.numGhesmatWorkgroupRef equals t3.numGhesmatWorkgroupCode
                select new
                {
                    t.numStatus,
                    t.numOnvanWorkGroupCode,
                    t.strOnvanName,
                    t1.strWorkGroupName,
                    t.numWorkGroupRef,
                    t.numBakhshWorkGroupRef,
                    t.numGhesmatWorkgroupRef,
                    t2.strBakhshName,
                    t3.strGhesmatName
                };
        string json = serializer.Serialize((object)q.OrderBy(c => c.strWorkGroupName));
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------دریافت کل پرسنل گروه کاری-----------------------
    //---------------------------------------------------------------------
    private void GetAllPersonelWorkGroup()
    {
        string personelcode = context.Request.Form["personelcode"];
        string ContractKind = context.Request.Form["ContractKind"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string workgroup = context.Request.Form["workgroup"];
        string Bakhsh = context.Request.Form["Bakhsh"];
        string Ghesmat = context.Request.Form["Ghesmat"];
        string Onvan = context.Request.Form["Onvan"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        var personel = (from t in office.ofcPersonels
                        join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                        join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                        join t33 in office.ofcBWorkGroups on t.numWorkGroupRef equals t33.numWorkGroupCode
                        join t4 in office.ofcBWorkGroupBakhshes on t2.numBakhshWorkGroupRef equals t4.numBakhshWorkGroupCode into join_t4
                        from t4 in join_t4.DefaultIfEmpty()
                        join t5 in office.ofcBWorkGroupGhesmats on t2.numGhesmatWorkgroupRef equals t5.numGhesmatWorkgroupCode into join_t5
                        from t5 in join_t5.DefaultIfEmpty()
                        join t6 in office.ofcBWorkGroupOnvans on t2.numOnvanWorkGroupRef equals t6.numOnvanWorkGroupCode into join_t6
                        from t6 in join_t6.DefaultIfEmpty()
                        where
                             (t2.numContractKindRef == Convert.ToInt32(ContractKind) || ContractKind == "-1")
                             &&
                             ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                             ||
                             (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                             ||
                             name == "")
                             &&
                             (t2.numWorkGroupRef == Convert.ToInt16(workgroup) || workgroup == "-1")
                             &&
                             (t.strMelliCode == mellicode || mellicode == "")
                             &&
                             (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                             &&
                             t2.numStatus == 1
                             &&
                             (t.numStatus == 1 || t.numStatus == 2)
                             &&
                             (t2.numBakhshWorkGroupRef == Convert.ToInt16(Bakhsh) || Bakhsh == "-1")
                             &&
                             (t2.numGhesmatWorkgroupRef == Convert.ToInt16(Ghesmat) || Ghesmat == "-1")
                             &&
                             (t2.numOnvanWorkGroupRef == Convert.ToInt16(Onvan) || Onvan == "-1")
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t.strMelliCode,
                            t3.strContractKindName,
                            strBakhshName = t4.strBakhshName == null || t4.strBakhshName == "" ? "-" : t4.strBakhshName,
                            strGhesmatName = t5.strGhesmatName == null || t5.strGhesmatName == "" ? "-" : t5.strGhesmatName,
                            strOnvanName = t6.strOnvanName == null || t6.strOnvanName == "" ? "-" : t6.strOnvanName,
                            strWorkGroupName = t33.strWorkGroupName == null || t33.strWorkGroupName == "" ? "-" : t33.strWorkGroupName,
                            t2.StrContractUniqCode
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