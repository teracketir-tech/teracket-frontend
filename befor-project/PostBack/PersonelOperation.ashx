<%@ WebHandler Language="C#" Class="PersonelOperation" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;
using System.Data;
using Excel;

public class PersonelOperation : IHttpHandler, IReadOnlySessionState
{

    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);
    FuncAllEdari EdariFunc = new FuncAllEdari();
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
                    GetReportPersonel();//دریافت اطلاعات پرسنلی
                    break;
                case 2:
                    RegisterTimeWorkMonthly();//ثبت کارکرد ماهانه
                    break;
                case 3:
                    GetAlldrpdwn();//دریافت کل دراپ دان ها
                    break;
                case 4:
                    SaveMorakhasiInfo();//ثبت مرخصی
                    break;
                case 5:
                    SaveMamoriatInfo();//ثبت ماموریت
                    break;
                case 6:
                    GetReportMorakhasi();//گزارش مرخصی mahianeh
                    break;
                case 7:
                    GetReportMisson();//گزارش ماموریت
                    break;
                case 8:
                    GetReportKarkardMontly();//گزارش کارکردماهانه
                    break;
                case 9:
                    SaveKarkardMahane();//ثبت کارکردماهانه
                    break;
                case 10:
                    SaveKarkardRozane();//ثبت کارکردروزانه
                    break;
                case 11:
                    GetReportKarkardDaily();//گزارش کارکردروزانه
                    break;
                case 12:
                    saveNewMorakhasiKind();//ثبت نوع مرخصی جدید
                    break;
                case 13:
                    GetAllMorakhasiKind();//دریافت کل نوع مرخصی
                    break;
                case 14:
                    SetActiveAndDeActiveMorakhasiKind();// faal ya ghire faal kardan morakhsi kind
                    break;
                case 15:
                    EditMorakhsikindName();// viraiesh morakhsi kind
                    break;
                case 16:
                    DeleteMorakhsikindName();// hazf morakhsi kind
                    break;
                case 17:
                    SaveMorakhasiMahane();//ثبت  مرخصی ماهانه
                    break;
                case 18:
                    CalcDailyToMonthly();//تبدیل کارکرد روزانه به ماهیانه
                    break;
                case 19:
                    SaveEditKarkardRozanehAndMahianeh();// viraiesh etalate karakrde rozaneh and mahinaeh
                    break;
                case 20:
                    SaveMorakhasiRozaneh();//ثبت  مرخصی روزانه
                    break;
                case 21:
                    GetReportMorakhasiRozaneh();//گزارش مرخصی rozaneh
                    break;
                case 22:
                    DeleteKarkardMahaineh();//hazf karakrde mahianeh
                    break;
            }
        }
    }
    //----------------------------------------------------------------------
    //-----------------------دریافت اطلاعات پرسنلی ------------------------
    //----------------------------------------------------------------------
    private void GetReportPersonel()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string WorkJob = context.Request.Form["WorkJob"];
        WorkJob = String.IsNullOrEmpty(WorkJob) ? "-1" : WorkJob;
        //string DateFrom = context.Request.Form["DateFrom"];
        //string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcBWorkGroups on t.numWorkGroupRef equals t1.numWorkGroupCode
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
                            &&
                            (t.numWorkGroupRef == Convert.ToInt16(WorkJob) || WorkJob == "-1")
                            &&
                            t.numStatus == 2
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t1.strWorkGroupName,
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
    //-----------------------ثبت کارکرد ماهانه ------------------------
    //----------------------------------------------------------------------
    private void RegisterTimeWorkMonthly()
    {
        string infoAll = context.Request.Form["infoAll"];
        string startdate = context.Request.Form["startdate"];
        string enddate = context.Request.Form["enddate"];
        string month = context.Request.Form["month"];

        string[] arrayInfo = infoAll.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        string error = "";
        foreach (var item in arrayInfo)
        {
            string[] arrayRes = item.Split('^');
            var qcheck = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == Convert.ToInt32(arrayRes[0]) && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(_PDate.NowYear)).FirstOrDefault();

            var CheckcontractCode = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(arrayRes[0]) && c.numStatus == 1).FirstOrDefault();
            if (CheckcontractCode != null)
            {
                if (qcheck == null)
                {
                    office.ofcPersonelMonthlyJobs.InsertOnSubmit(new ofcPersonelMonthlyJob
                    {
                        numPersonelRef = Convert.ToInt32(arrayRes[0]),
                        strJobDays = arrayRes[1].Trim(),
                        strJobOverTime = arrayRes[2],
                        strJobFriday = arrayRes[3],
                        strJobHoliDay = arrayRes[4],
                        strJobMission = arrayRes[5],
                        strJobDelay = arrayRes[6],
                        strJobEarly = arrayRes[7],
                        strJobAbsent = arrayRes[8],
                        dateEndJobDate = enddate,
                        dateStartJobDate = startdate,
                        numMonthJob = Convert.ToInt16(month),
                        numYear = Convert.ToInt16(_PDate.NowYear),
                        numContractRef = CheckcontractCode.numContractCode,
                        // strJobFine = arrayRes[9],
                        strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                        dateRegisterDate = _PDate.PersianDate,

                    });

                }
                else
                {
                    qcheck.strJobDays = arrayRes[1].Trim();
                    qcheck.strJobOverTime = arrayRes[2];
                    qcheck.strJobFriday = arrayRes[3];
                    qcheck.strJobHoliDay = arrayRes[4];
                    qcheck.strJobMission = arrayRes[5];
                    qcheck.strJobDelay = arrayRes[6];
                    qcheck.strJobEarly = arrayRes[7];
                    qcheck.strJobAbsent = arrayRes[8];
                    // qcheck.strJobFine = arrayRes[12];
                    qcheck.strRegisterUserRef = _ofcUser.strUserCode.Trim();
                }

                //=========================================================================
            }
            else
            {
                error = error + CheckcontractCode.numContractCode.ToString() + "<br/>,";
            }
        }

        string json = "";

        try
        {
            office.SubmitChanges();
            if (error == "")
            {
                json = serializer.Serialize((object)"1");
            }
            else
            {
                json = serializer.Serialize((object)"3^" + error);
            }
        }
        catch
        {
            json = serializer.Serialize((object)"2");
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراپ دان ها----------------
    //---------------------------------------------------------------------
    private void GetAlldrpdwn()
    {
        var leaves = from t in office.ofcBleaves
                     where t.numStatus == 1
                     select new
                     {
                         value = t.numLeaveCode,
                         item = t.strLeaveName
                     };
        var Missions = from t in office.ofcBMissions
                       where t.numStatus == 1
                       select new
                       {
                           value = t.numMissionCode,
                           item = t.strMissionName
                       };

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
        string json1 = serializer.Serialize((object)leaves);
        string json2 = serializer.Serialize((object)Missions);
        string json3 = serializer.Serialize((object)workjob);
        string json4 = serializer.Serialize((object)ContractKinds);

        string json = "[" + json1 + "," + json2 + "," + json3 + "," + json4 + "]";
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------ثبت مرخصی--------------------------
    //---------------------------------------------------------------------
    private void SaveMorakhasiInfo()
    {
        int PersonelCode = Convert.ToInt32(context.Request.Form["PersonelCode"]);
        string MorakhasiKind = context.Request.Form["MorakhasiKind"];
        string dateStartMorakhasiDate = context.Request.Form["dateStartMorakhasiDate"];
        string dateEndMorakhasiDate = context.Request.Form["dateEndMorakhasiDate"];
        string StartTimeMorakhasi = context.Request.Form["StartTimeMorakhasi"];
        string EndTimeMorakhasi = context.Request.Form["EndTimeMorakhasi"];
        string Description = context.Request.Form["Description"];
        string json = "";
        var chckPersonelCode = office.ofcPersonels.Where(c => c.numPersonelCode == PersonelCode && c.numStatus == 2).FirstOrDefault();
        if (chckPersonelCode == null)
        {
            json = serializer.Serialize((object)"4");
        }
        //else
        //{
        //var qCheck = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == PersonelCode && c.dateStartLeaveDate == dateStartMorakhasiDate && c.dateEndLeaveDate == dateEndMorakhasiDate).FirstOrDefault();
        //if (qCheck == null)
        //{
        //    office.ofcPersonelLeaves.InsertOnSubmit(new ofcPersonelLeave
        //    {
        //       // dateEndLeaveDate = dateEndMorakhasiDate,
        //      //  dateRegisterDate = _PDate.PersianDate,
        //      //  dateStartLeaveDate = dateStartMorakhasiDate,
        //        numLeaveRef = Convert.ToInt16(MorakhasiKind),
        //        numPersonelRef = PersonelCode,
        //      //  strLeaveDescription = Description,
        //        strRegisterUserRef = _ofcUser.strUserCode,
        //       // timeEndLeaveTime = EndTimeMorakhasi,
        //      //  timeStartLeaveTime = StartTimeMorakhasi,
        //        numStatus = 1
        //    });
        //    try
        //    {
        //        office.SubmitChanges();
        //        json = serializer.Serialize((object)"1");
        //    }
        //    catch
        //    {
        //        json = serializer.Serialize((object)"3");
        //        }
        //}
        //    else
        //    {
        //    json = serializer.Serialize((object)"2");
        //}
        //}
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //---------------------------------ثبت ماموریت--------------------------
    //---------------------------------------------------------------------
    private void SaveMamoriatInfo()
    {
        int PersonelCode = Convert.ToInt32(context.Request.Form["PersonelCode"]);
        string MamoriatKind = context.Request.Form["MamoriatKind"];
        string dateStartMamoriatDate = context.Request.Form["dateStartMamoriatDate"];
        string dateEndMamoriatDate = context.Request.Form["dateEndMamoriatDate"];
        string StartTimeMamoriat = context.Request.Form["StartTimeMamoriat"];
        string EndTimeMamoriat = context.Request.Form["EndTimeMamoriat"];
        string Description = context.Request.Form["Description"];
        string json = "";
        var chckPersonelCode = office.ofcPersonels.Where(c => c.numPersonelCode == PersonelCode && c.numStatus == 2).FirstOrDefault();
        if (chckPersonelCode == null)
        {
            json = serializer.Serialize((object)"4");
        }
        else
        {
            var qCheck = office.ofcPersonelMissions.Where(c => c.numPersonelRef == PersonelCode && c.dateStartMissionDate == dateStartMamoriatDate && c.dateEndMissionDate == dateEndMamoriatDate).FirstOrDefault();
            if (qCheck == null)
            {
                office.ofcPersonelMissions.InsertOnSubmit(new ofcPersonelMission
                {
                    dateEndMissionDate = dateEndMamoriatDate,
                    dateRegisterDate = _PDate.PersianDate,
                    dateStartMissionDate = dateStartMamoriatDate,
                    numMissionRef = Convert.ToInt16(MamoriatKind),
                    numPersonelRef = PersonelCode,
                    strMissionDescription = Description,
                    strRegisterUserRef = _ofcUser.strUserCode,
                    timeEndMissionTime = EndTimeMamoriat,
                    timeStartMissionTime = StartTimeMamoriat
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
            else
            {
                json = serializer.Serialize((object)"2");
            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------گزارش مرخصی mahianeh------------------------
    //----------------------------------------------------------------------
    private void GetReportMorakhasi()
    {
        string personelcode = context.Request.Form["personelcode"];
        string MorakhsiKind = context.Request.Form["MorakhsiKind"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        //string DateFrom = context.Request.Form["DateFrom"];
        //string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;


        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcPersonelLeaves on t.numPersonelCode equals t1.numPersonelRef
                        join t2 in office.ofcBleaves on t1.numLeaveRef equals t2.numLeaveCode
                        join t3 in office.ofcBWorkGroups on t.numWorkGroupRef equals t3.numWorkGroupCode
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
                            &&
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                            &&
                            (t1.numMonth == Convert.ToInt16(month) || month == -1)
                            &&
                            t1.numYear == Convert.ToInt16(year)
                            //&&
                            //(string.Compare(t1.dateRegisterDate, DateFrom) >= 0 && string.Compare(t1.dateRegisterDate, DateTo) <= 0)
                            &&
                            (t1.numLeaveRef == Convert.ToInt16(MorakhsiKind) || MorakhsiKind == "-1")
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t1.dateRegisterDate,
                            t1.timeLeaveTime,
                            //t1.strLeaveDescription,
                            //t1.dateEndLeaveDate,
                            //t1.dateStartLeaveDate,
                            //t1.timeEndLeaveTime,
                            //t1.timeStartLeaveTime,
                            t2.strLeaveName,
                            t3.strWorkGroupName,
                            t1.numYear,
                            MonthName = EdariFunc.GetMonthName(t1.numMonth.ToString()),
                            t1.numMonth
                        });


        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.numYear).ThenBy(c => c.numMonth).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------گزارش ماموریت ------------------------
    //----------------------------------------------------------------------
    private void GetReportMisson()
    {
        string personelcode = context.Request.Form["personelcode"];
        string MissonKind = context.Request.Form["MissonKind"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcPersonelMissions on t.numPersonelCode equals t1.numPersonelRef
                        join t2 in office.ofcBMissions on t1.numMissionRef equals t2.numMissionCode
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
                            &&
                            (string.Compare(t1.dateRegisterDate, DateFrom) >= 0 && string.Compare(t1.dateRegisterDate, DateTo) <= 0)
                            &&
                            (t1.numMissionRef == Convert.ToInt16(MissonKind) || MissonKind == "-1")
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t1.dateRegisterDate,
                            t1.strMissionDescription,
                            t1.dateEndMissionDate,
                            t1.dateStartMissionDate,
                            t1.timeEndMissionTime,
                            t1.timeStartMissionTime,
                            t2.strMissionName
                        });


        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.dateRegisterDate).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------گزارش کارکردماهانه ------------------------
    //----------------------------------------------------------------------
    private void GetReportKarkardMontly()
    {
        string personelcode = context.Request.Form["personelcode"];
        string grohkari = context.Request.Form["WorkJob"].Replace("\"", "");
        string name = context.Request.Form["name"];
        string contractkind = context.Request.Form["contractkind"];

        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        if (contractkind == "1" || contractkind == "3") //movaghat and projeie
        {

            var personel = (from t in office.ofcPersonels
                            join t2 in office.ofcPersonelMonthlyJobs on t.numPersonelCode equals t2.numPersonelRef
                            join t4 in office.ofcPersonelContracts on t2.numContractRef equals t4.numContractCode
                            join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                            join t1 in office.ofcBWorkGroups on t4.numWorkGroupRef equals t1.numWorkGroupCode into join_t1
                            from t1 in join_t1.DefaultIfEmpty()

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
                                &&
                                (t2.numMonthJob == Convert.ToInt16(month) || month == -1)
                                &&
                                t2.numYear == Convert.ToInt16(year)
                                &&
                                ((grohkariRoomArray).Contains(t4.numWorkGroupRef.ToString()) || grohkari == "-1")
                                &&
                                t2.numContractKindRef == Convert.ToInt16(contractkind)
                            //&&
                            //(string.Compare(t2.dateRegisterDate, DateFrom) >= 0 && string.Compare(t2.dateRegisterDate, DateTo) <= 0)
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.numPersonelCode,
                                strWorkGroupName = (t1.strWorkGroupName == null || t1.strWorkGroupName == "" ? "نامشخص" : t1.strWorkGroupName),
                                t2.strJobExit,
                                t2.strJobAbsent,
                                t2.strJobDelay,
                                t2.strJobEarly,
                                t2.strJobFriday,
                                t2.strJobHoliDay,
                                t2.strJobMission,
                                t2.strJobOverTime,
                                t2.strJobDays,
                                t2.dateRegisterDate,
                                strMonthName = EdariFunc.GetMonthName(t2.numMonthJob.ToString()),
                                t2.numMonthJob,
                                t2.numYear,
                                t2.numCountFaraiandProject,
                                t3.strContractKindName,
                                t2.strJobOverTimeSpecial,
                                t2.numStatus,
                                t2.numMonthlyJobCode,
                                t2.strJobOverTimeInMission
                            });
            int take = page * perpage;
            int skip = page == 1 ? 0 : take - perpage;
            int AllRecrdCount = personel.Count();
            var query = personel.OrderBy(o => o.numYear).ThenBy(c => c.numMonthJob).ThenBy(c=> c.numPersonelCode).Take(take).Skip(skip);
            string json = serializer.Serialize((object)query);
            string bothJson = "[" + json + "," + AllRecrdCount + "]";
            context.Response.Write(bothJson);
            context.Response.End();
        }
        else if (contractkind == "2")
        {
            var personel = (from t in office.ofcPersonels
                            join t2 in office.ofcPersonelMonthlyJobSaatis on t.numPersonelCode equals t2.numPersonelRef
                            join t4 in office.ofcPersonelContracts on t2.numContractRef equals t4.numContractCode
                            join t3 in office.ofcBContractKinds on t2.numContractKindRef equals t3.numContractKindCode
                            join t1 in office.ofcBWorkGroups on t4.numWorkGroupRef equals t1.numWorkGroupCode into join_t1
                            from t1 in join_t1.DefaultIfEmpty()
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
                                &&
                                (t2.numMonthJob == Convert.ToInt16(month) || month == -1)
                                &&
                                t2.numYear == Convert.ToInt16(year)
                                &&
                                ((grohkariRoomArray).Contains(t4.numWorkGroupRef.ToString()) || grohkari == "-1")
                                &&
                                t2.numContractKindRef == Convert.ToInt16(contractkind)
                            //&&
                            //(string.Compare(t2.dateRegisterDate, DateFrom) >= 0 && string.Compare(t2.dateRegisterDate, DateTo) <= 0)
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.numPersonelCode,
                                strWorkGroupName = (t1.strWorkGroupName == null || t1.strWorkGroupName == "" ? "نامشخص" : t1.strWorkGroupName),
                                t2.strJobTime,
                                t2.dateRegisterDate,
                                strMonthName = EdariFunc.GetMonthName(t2.numMonthJob.ToString()),
                                t2.numMonthJob,
                                t2.numYear,
                                t3.strContractKindName,
                                t2.numStatus,
                                t2.numMonthlyJobSaatiCode
                            });
            int take = page * perpage;
            int skip = page == 1 ? 0 : take - perpage;
            int AllRecrdCount = personel.Count();
            var query = personel.OrderBy(o => o.numYear).ThenBy(c => c.numMonthJob).Take(take).Skip(skip);
            string json = serializer.Serialize((object)query);
            string bothJson = "[" + json + "," + AllRecrdCount + "]";
            context.Response.Write(bothJson);
            context.Response.End();
        }


    }
    //----------------------------------------------------------------------
    //-----------------------ثبت کارکردماهانه ------------------------
    //----------------------------------------------------------------------
    public class lsterror
    {
        public int numPersonelCode { get; set; }
        public string strPersonelName { get; set; }
        public int ErrorCode { get; set; }
        public string strDesc { get; set; }
    }
    //----------------------------------------------------------------------
    private void SaveKarkardMahane()
    {
        string month = context.Request.Form["month"];
        string contractKind = context.Request.Form["contractKind"];
        string datefrom = context.Request.Form["datefrom"];
        string dateto = context.Request.Form["dateto"];
        HttpPostedFile postedFile = context.Request.Files["UpFilekarkard"];
        string json = "";
        List<lsterror> lstErr = new List<lsterror>();

        string savepath = HttpContext.Current.Server.MapPath("~/ExcelKarkard/");
        var extension = Path.GetExtension(postedFile.FileName).ToLower();
        if (extension.Trim() != ".xls" && extension.Trim() != ".xlsx")
        {
            json = serializer.Serialize((object)"2"); // format unvalid
        }
        else
        {
            string fname = postedFile.FileName.Remove((postedFile.FileName.Length - extension.Length));

            fname = "Month_" + fname + System.DateTime.Now.ToString("_ddMMyyhhmmss") + extension;

            if (!File.Exists(savepath + fname))
            {
                postedFile.SaveAs(savepath + fname);
            }
            else
            {
                File.Delete(savepath + fname);
                postedFile.SaveAs(savepath + fname);
            }

            //=================================================================
            FileStream stream = File.Open((savepath + fname).Trim(), FileMode.Open, FileAccess.Read);
            IExcelDataReader excelReader;
            if (extension.Trim() == ".xls")
            {
                excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
            }
            else //if (strFileType.Trim() == ".xlsx")
            {
                excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
            }

            DataSet result = excelReader.AsDataSet();
            int checkError = 0;
            if (contractKind == "1" || contractKind == "3") // upload gharardead movaghat ya projeie
            {
                for (int i = 1; i < result.Tables[0].Rows.Count; i++)
                {

                    var q = new
                    {
                        personelcode = result.Tables[0].Rows[i].ItemArray[0].ToString().Trim(),
                        rozkarkard = result.Tables[0].Rows[i].ItemArray[1].ToString().Trim(),
                        ezafekar = result.Tables[0].Rows[i].ItemArray[2].ToString().Trim(),
                        jomekar = result.Tables[0].Rows[i].ItemArray[3].ToString().Trim(),
                        tatilkar = result.Tables[0].Rows[i].ItemArray[4].ToString().Trim(),
                        rozmamoriat = result.Tables[0].Rows[i].ItemArray[5].ToString().Trim(),
                        takhir = result.Tables[0].Rows[i].ItemArray[6].ToString().Trim(),
                        tajil = result.Tables[0].Rows[i].ItemArray[7].ToString().Trim(),
                        ghibat = result.Tables[0].Rows[i].ItemArray[8].ToString().Trim(),
                        khorojGhirMojaz = result.Tables[0].Rows[i].ItemArray[9].ToString().Trim(),
                        FaraiandCount = (contractKind == "3" ? result.Tables[0].Rows[i].ItemArray[10].ToString() : ""),// baraie mohasebe padash gharardade projeie
                        ezafekarVijeh = result.Tables[0].Rows[i].ItemArray[11].ToString().Trim(),
                        ezafekarInMission = result.Tables[0].Rows[i].ItemArray[12].ToString().Trim(),
                        //MorakhasiEstehghaghi = result.Tables[0].Rows[i].ItemArray[10].ToString().Trim(),
                        //MorakhasiEstilaji = result.Tables[0].Rows[i].ItemArray[11].ToString().Trim(),
                    };
                    if (!String.IsNullOrEmpty(q.personelcode))
                    {
                        lsterror op = new lsterror();
                        var checkPersonel = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(q.personelcode)).FirstOrDefault();
                        if (checkPersonel == null)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = "";
                            op.ErrorCode = 0; // یافت نشد
                            checkError = 1;
                        }
                        else
                        {

                            if (checkPersonel.numStatus == 0)
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 2; // ghire faal
                                checkError = 1;
                            }
                            else if (checkPersonel.numStatus == 3)
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 3;// ghate hamkari
                                checkError = 1;
                            }


                            //var checkPreInvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.strInvoiceYear == _PDate.NowYear && c.strInvoiceMonth == month && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();

                            //if (checkPreInvoice != null)
                            //{
                            //    op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            //    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            //    op.ErrorCode = 4;// sabeghe tasvieh hesab dare dar in sal va mah
                            //    checkError = 1;
                            //}
                            //else
                            //{



                            var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numStatus == 1).FirstOrDefault();

                            if (contract == null)
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 5; // gharardade ghire faal shode
                                checkError = 1;
                            }
                            else if (contract.numContractKindRef != Convert.ToInt32(contractKind))
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 6; // noe gharardade baham yeki nist
                                checkError = 1;
                            }
                            else
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 1; // faal

                                var checkkarkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numYear == Convert.ToInt16(_PDate.NowYear) && c.numMonthJob == Convert.ToInt16(month) && c.numStatus == 0).FirstOrDefault();

                                if (checkkarkard != null) office.ofcPersonelMonthlyJobs.DeleteOnSubmit(checkkarkard);
                                office.ofcPersonelMonthlyJobs.InsertOnSubmit(new ofcPersonelMonthlyJob
                                {
                                    dateStartJobDate = datefrom,
                                    dateEndJobDate = dateto,
                                    dateRegisterDate = _PDate.PersianDate,
                                    numContractRef = Convert.ToInt32(contract.numContractCode),
                                    numMonthJob = Convert.ToInt16(month),
                                    numPersonelRef = Convert.ToInt32(q.personelcode),
                                    numYear = Convert.ToInt16(_PDate.NowYear),
                                    strJobDays = Math.Round((decimal)(((Convert.ToDouble(q.rozkarkard.Split(':')[0]) / 8) + ((Convert.ToDouble(q.rozkarkard.Split(':')[1]) / 60) / 8))), 2).ToString(),
                                    strJobOverTime = q.ezafekar.Trim().Length == 5 ? q.ezafekar.Trim() : (q.ezafekar.Trim().Length == 6 && q.ezafekar.Trim().Split(':')[0].Length == 3) ? (q.ezafekar.Trim().Split(':')[0].Replace("00", "") + ":" + q.ezafekar.Trim().Split(':')[1]) : "0" + q.ezafekar.Trim(),
                                    strJobOverTimeSpecial = q.ezafekarVijeh.Trim().Length == 5 ? q.ezafekarVijeh.Trim() : (q.ezafekarVijeh.Trim().Length == 6 && q.ezafekarVijeh.Trim().Split(':')[0].Length == 3) ? (q.ezafekarVijeh.Trim().Split(':')[0].Replace("00", "") + ":" + q.ezafekarVijeh.Trim().Split(':')[1]) : "0" + q.ezafekarVijeh.Trim(),
                                    strJobOverTimeInMission = q.ezafekarInMission.Trim().Length == 5 ? q.ezafekarInMission.Trim() : (q.ezafekarInMission.Trim().Length == 6 && q.ezafekarInMission.Trim().Split(':')[0].Length == 3) ? (q.ezafekarInMission.Trim().Split(':')[0].Replace("00", "") + ":" + q.ezafekarInMission.Trim().Split(':')[1]) : "0" + q.ezafekarInMission.Trim(),
                                    strJobFriday = q.jomekar.Trim().Length == 5 ? q.jomekar.Trim() : (q.jomekar.Trim().Length == 6 && q.jomekar.Trim().Split(':')[0].Length == 3) ? (q.jomekar.Trim().Split(':')[0].Replace("00", "") + ":" + q.jomekar.Trim().Split(':')[1]) : "0" + q.jomekar.Trim(),
                                    strJobHoliDay = q.tatilkar.Trim().Length == 5 ? q.tatilkar.Trim() : (q.tatilkar.Trim().Length == 6 && q.tatilkar.Trim().Split(':')[0].Length == 3) ? (q.tatilkar.Trim().Split(':')[0].Replace("00", "") + ":" + q.tatilkar.Trim().Split(':')[1]) : "0" + q.tatilkar.Trim(),
                                    strJobMission = Math.Round((decimal)((Convert.ToDouble(q.rozmamoriat.Split(':')[0]) / 8) + ((Convert.ToDouble(q.rozmamoriat.Split(':')[1]) / 60) / 8)), 2).ToString(),
                                    strJobDelay = q.takhir.Trim().Length == 5 ? q.takhir.Trim() : (q.takhir.Trim().Length == 6 && q.takhir.Trim().Split(':')[0].Length == 3) ? (q.takhir.Trim().Split(':')[0].Replace("00", "") + ":" + q.takhir.Trim().Split(':')[1]) : "0" + q.takhir.Trim(),
                                    strJobEarly = q.tajil.Trim().Length == 5 ? q.tajil.Trim() : (q.tajil.Trim().Length == 6 && q.tajil.Trim().Split(':')[0].Length == 3) ? (q.tajil.Trim().Split(':')[0].Replace("00", "") + ":" + q.tajil.Trim().Split(':')[1]) : "0" + q.tajil.Trim(),
                                    strJobAbsent = Math.Round((decimal)((Convert.ToDouble(q.ghibat.Split(':')[0]) / 8) + ((Convert.ToDouble(q.ghibat.Split(':')[1]) / 60) / 8)), 2).ToString(),
                                    strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                                    strJobExit = q.khorojGhirMojaz.Trim().Length == 5 ? q.khorojGhirMojaz.Trim() : (q.khorojGhirMojaz.Trim().Length == 6 && q.khorojGhirMojaz.Trim().Split(':')[0].Length == 3) ? (q.khorojGhirMojaz.Trim().Split(':')[0].Replace("00", "") + ":" + q.khorojGhirMojaz.Trim().Split(':')[1]) : "0" + q.khorojGhirMojaz.Trim(),
                                    numStatus = 0,
                                    numContractKindRef = Convert.ToInt16(contractKind),
                                    numCountFaraiandProject = (contractKind == "3" ? Convert.ToInt32(q.FaraiandCount.Trim()) : 0),
                                    numWorkGroupRef = contract.numWorkGroupRef
                                });


                            }

                        }
                        lstErr.Add(op);
                    }
                }
            }
            else if (contractKind == "2") // saati
            {
                for (int i = 1; i < result.Tables[0].Rows.Count; i++)
                {
                    var q = new
                    {
                        personelcode = result.Tables[0].Rows[i].ItemArray[0].ToString().Trim(),
                        Timekarkard = result.Tables[0].Rows[i].ItemArray[1].ToString().Trim(),
                    };

                    if (!String.IsNullOrEmpty(q.personelcode))
                    {
                        lsterror op = new lsterror();
                        var checkPersonel = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(q.personelcode)).FirstOrDefault();
                        if (checkPersonel == null)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = "";
                            op.ErrorCode = 0; // یافت نشد
                            checkError = 1;
                        }
                        else
                        {

                            if (checkPersonel.numStatus == 0)
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 2; // ghire faal
                                checkError = 1;
                            }
                            else if (checkPersonel.numStatus == 3)
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 3;// ghate hamkari
                                checkError = 1;
                            }


                            //var checkPreInvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.strInvoiceYear == _PDate.NowYear && c.strInvoiceMonth == month && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();

                            //if (checkPreInvoice != null)
                            //{
                            //    op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            //    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            //    op.ErrorCode = 4;// sabeghe tasvieh hesab dare dar in sal va mah
                            //    checkError = 1;
                            //}
                            //else
                            //{
                            var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numStatus == 1).FirstOrDefault();

                            if (contract == null)
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 5; // gharardade ghire faal shode
                                checkError = 1;
                            }
                            else if (contract.numContractKindRef != Convert.ToInt32(contractKind))
                            {
                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 6; // noe gharardade baham yeki nist
                                checkError = 1;
                            }
                            else
                            {

                                op.numPersonelCode = Convert.ToInt32(q.personelcode);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 1; // faal

                                var checkkarkard = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numYear == Convert.ToInt16(_PDate.NowYear) && c.numMonthJob == Convert.ToInt16(month) && c.numStatus == 0).FirstOrDefault();


                                if (checkkarkard != null) office.ofcPersonelMonthlyJobSaatis.DeleteOnSubmit(checkkarkard);
                                office.ofcPersonelMonthlyJobSaatis.InsertOnSubmit(new ofcPersonelMonthlyJobSaati
                                {
                                    dateStartJobDate = datefrom,
                                    dateEndJobDate = dateto,
                                    dateRegisterDate = _PDate.PersianDate,
                                    numContractRef = Convert.ToInt32(contract.numContractCode),
                                    numMonthJob = Convert.ToInt16(month),
                                    numPersonelRef = Convert.ToInt32(q.personelcode),
                                    numYear = Convert.ToInt16(_PDate.NowYear),
                                    strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                                    numStatus = 0,
                                    numContractKindRef = Convert.ToInt16(contractKind),
                                    strJobTime = q.Timekarkard.Trim().Length == 5 ? q.Timekarkard.Trim() : (q.Timekarkard.Trim().Length == 6 && q.Timekarkard.Trim().Split(':')[0].Length == 3) ? (q.Timekarkard.Trim().Split(':')[0].Replace("00", "") + ":" + q.Timekarkard.Trim().Split(':')[1]) : "0" + q.Timekarkard.Trim(),
                                    numWorkGroupRef = contract.numWorkGroupRef
                                });


                            }
                        }
                        lstErr.Add(op);
                    }
                }
            }
            excelReader.Close();

            try
            {

                if (checkError == 1)
                {
                    var qq = (from t1 in lstErr //office.ofcPersonels
                                                //join t1 in lstErr on t.numPersonelCode equals t1.numPersonelCode
                              select new
                              {
                                  t1.numPersonelCode,
                                  strPersonelName = t1.strPersonelName,
                                  t1.ErrorCode
                              }).ToList();

                    office.SubmitChanges();
                    json = serializer.Serialize((object)qq); // sabt shod
                }
                else
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // sabt shod
                }
            }
            catch (Exception ex)
            {
                string a = ex.Message;
                json = serializer.Serialize((object)"3"); // khata dar sabt
            }
        }
        //}

        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //----------------------- ------------------------
    //----------------------------------------------------------------------
    private void SaveKarkardRozane()
    {
        string date = context.Request.Form["date"];
        //string month = context.Request.Form["month"];
        HttpPostedFile postedFile = context.Request.Files["UpFilekarkard"];
        string json = "";
        List<lsterror> lstErr = new List<lsterror>();

        string savepath = HttpContext.Current.Server.MapPath("~/ExcelKarkard/");
        var extension = Path.GetExtension(postedFile.FileName).ToLower();
        if (extension.Trim() != ".xls" && extension.Trim() != ".xlsx")
        {
            json = serializer.Serialize((object)"2"); // format unvalid
        }
        else
        {
            string fname = postedFile.FileName.Remove((postedFile.FileName.Length - extension.Length));

            fname = "Rozane_" + fname + System.DateTime.Now.ToString("_ddMMyyhhmmss") + extension;

            if (!File.Exists(savepath + fname))
            {
                postedFile.SaveAs(savepath + fname);
            }
            else
            {
                File.Delete(savepath + fname);
                postedFile.SaveAs(savepath + fname);
            }

            //=================================================================
            FileStream stream = File.Open((savepath + fname).Trim(), FileMode.Open, FileAccess.Read);
            IExcelDataReader excelReader;
            if (extension.Trim() == ".xls")
            {
                excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
            }
            else //if (strFileType.Trim() == ".xlsx")
            {
                excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
            }

            DataSet result = excelReader.AsDataSet();
            int checkError = 0;
            for (int i = 1; i < result.Tables[0].Rows.Count; i++)
            {
                var q = new
                {
                    personelcode = result.Tables[0].Rows[i].ItemArray[0].ToString().Trim(),
                    starttime = result.Tables[0].Rows[i].ItemArray[1].ToString().Trim(),
                    endtime = result.Tables[0].Rows[i].ItemArray[2].ToString().Trim(),
                    ezafekar = result.Tables[0].Rows[i].ItemArray[3].ToString().Trim(),
                    takhir = result.Tables[0].Rows[i].ItemArray[4].ToString().Trim(),
                    tajil = result.Tables[0].Rows[i].ItemArray[5].ToString().Trim(),
                    ghibat = result.Tables[0].Rows[i].ItemArray[6].ToString().Trim(),
                    rozmamoriat = result.Tables[0].Rows[i].ItemArray[7].ToString().Trim(),
                    khorojGhirMojaz = result.Tables[0].Rows[i].ItemArray[8].ToString().Trim(),
                    strfriday = result.Tables[0].Rows[i].ItemArray[9].ToString().Trim(),
                    strholyday = result.Tables[0].Rows[i].ItemArray[10].ToString().Trim(),
                    strjobKarkard = result.Tables[0].Rows[i].ItemArray[11].ToString().Trim(),
                    ezafekarVijeh = result.Tables[0].Rows[i].ItemArray[12].ToString().Trim(),
                    ezafekarInMission = result.Tables[0].Rows[i].ItemArray[13].ToString().Trim(),
                };
                if (!String.IsNullOrEmpty(q.personelcode))
                {
                    lsterror op = new lsterror();
                    var checkPersonel = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(q.personelcode)).FirstOrDefault();
                    if (checkPersonel == null)
                    {
                        op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        op.strPersonelName = "";
                        op.ErrorCode = 0; // یافت نشد
                        checkError = 1;
                    }
                    else
                    {

                        if (checkPersonel.numStatus == 0)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 2; // ghire faal
                            checkError = 1;
                        }
                        else if (checkPersonel.numStatus == 3)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 3;// ghate hamkari
                            checkError = 1;
                        }


                        //var checkPreInvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.strInvoiceYear == _PDate.NowYear && c.strInvoiceMonth == month && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();

                        //if (checkPreInvoice != null)
                        //{
                        //    op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        //    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                        //    op.ErrorCode = 4;// sabeghe tasvieh hesab dare dar in sal va mah
                        //    checkError = 1;
                        //}
                        //else
                        //{

                        var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numStatus == 1).FirstOrDefault();
                        if (contract == null)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 5; // gharardade ghire faal shode
                            checkError = 1;
                        }
                        //else if (contract.numContractKindRef != Convert.ToInt32(contractKind))
                        //{
                        //    op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        //    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                        //    op.ErrorCode = 6; // noe gharardade baham yeki nist
                        //    checkError = 1;
                        //}
                        else
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 1; // faal

                            var checkkarkard = office.ofcPersonelDailyJobs.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.dateKarkardRozaneDate == date && c.numStatus == 0).FirstOrDefault();
                            if (checkkarkard != null) office.ofcPersonelDailyJobs.DeleteOnSubmit(checkkarkard);
                            office.ofcPersonelDailyJobs.InsertOnSubmit(new ofcPersonelDailyJob
                            {
                                dateKarkardRozaneDate = date,
                                dateRegisterDate = _PDate.PersianDate,
                                numContractRef = Convert.ToInt32(contract.numContractCode),
                                numPersonelRef = Convert.ToInt32(q.personelcode),
                                strStartJobTime = string.IsNullOrEmpty(q.starttime) || q.starttime.Trim() == "0" ? "00:00" : (q.starttime.Trim().Length == 5 ? q.starttime.Trim() : (q.starttime.Trim().Length == 6 && q.starttime.Trim().Split(':')[0].Length == 3) ? (q.starttime.Trim().Split(':')[0].Replace("00", "") + ":" + q.starttime.Trim().Split(':')[1]) : "0" + q.starttime.Trim()),
                                strEndJobTime = string.IsNullOrEmpty(q.endtime) || q.endtime.Trim() == "0" ? "00:00" : (q.endtime.Trim().Length == 5 ? q.endtime.Trim() : (q.endtime.Trim().Length == 6 && q.endtime.Trim().Split(':')[0].Length == 3) ? (q.endtime.Trim().Split(':')[0].Replace("00", "") + ":" + q.endtime.Trim().Split(':')[1]) : "0" + q.endtime.Trim()),
                                strJobOverTime = string.IsNullOrEmpty(q.ezafekar) || q.ezafekar.Trim() == "0" ? "00:00" : (q.ezafekar.Trim().Length == 5 ? q.ezafekar.Trim() : (q.ezafekar.Trim().Length == 6 && q.ezafekar.Trim().Split(':')[0].Length == 3) ? (q.ezafekar.Trim().Split(':')[0].Replace("00", "") + ":" + q.ezafekar.Trim().Split(':')[1]) : "0" + q.ezafekar.Trim()),

                                strJobOverTimeSpecial = string.IsNullOrEmpty(q.ezafekarVijeh) || q.ezafekarVijeh.Trim() == "0" ? "00:00" : (q.ezafekarVijeh.Trim().Length == 5 ? q.ezafekarVijeh.Trim() : (q.ezafekarVijeh.Trim().Length == 6 && q.ezafekarVijeh.Trim().Split(':')[0].Length == 3) ? (q.ezafekarVijeh.Trim().Split(':')[0].Replace("00", "") + ":" + q.ezafekarVijeh.Trim().Split(':')[1]) : "0" + q.ezafekarVijeh.Trim()),
                                strJobOverTimeInMission = string.IsNullOrEmpty(q.ezafekarInMission) || q.ezafekarInMission.Trim() == "0" ? "00:00" : (q.ezafekarInMission.Trim().Length == 5 ? q.ezafekarInMission.Trim() : (q.ezafekarInMission.Trim().Length == 6 && q.ezafekarInMission.Trim().Split(':')[0].Length == 3) ? (q.ezafekarInMission.Trim().Split(':')[0].Replace("00", "") + ":" + q.ezafekarInMission.Trim().Split(':')[1]) : "0" + q.ezafekarInMission.Trim()),

                                strJobDelay = string.IsNullOrEmpty(q.takhir) || q.takhir.Trim() == "0" ? "00:00" : (q.takhir.Trim().Length == 5 ? q.takhir.Trim() : (q.takhir.Trim().Length == 6 && q.takhir.Trim().Split(':')[0].Length == 3) ? (q.takhir.Trim().Split(':')[0].Replace("00", "") + ":" + q.takhir.Trim().Split(':')[1]) : "0" + q.takhir.Trim()),
                                strJobEarly = string.IsNullOrEmpty(q.tajil) || q.tajil.Trim() == "0" ? "00:00" : (q.tajil.Trim().Length == 5 ? q.tajil.Trim() : (q.tajil.Trim().Length == 6 && q.tajil.Trim().Split(':')[0].Length == 3) ? (q.tajil.Trim().Split(':')[0].Replace("00", "") + ":" + q.tajil.Trim().Split(':')[1]) : "0" + q.tajil.Trim()),
                                // strJobAbsent = Math.Round((decimal)((Convert.ToDouble(q.ghibat.Split(':')[0]) / 8) + ((Convert.ToDouble(q.ghibat.Split(':')[1]) / 60) / 8)), 2).ToString(),
                                strJobAbsent = string.IsNullOrEmpty(q.ghibat) || q.ghibat.Trim() == "0" ? "00:00" : (q.ghibat.Trim().Length == 5 ? q.ghibat.Trim() : (q.ghibat.Trim().Length == 6 && q.ghibat.Trim().Split(':')[0].Length == 3) ? (q.ghibat.Trim().Split(':')[0].Replace("00", "") + ":" + q.ghibat.Trim().Split(':')[1]) : "0" + q.ghibat.Trim()),
                                //  strJobMission = Math.Round((decimal)((Convert.ToDouble(q.rozmamoriat.Split(':')[0]) / 8) + ((Convert.ToDouble(q.rozmamoriat.Split(':')[1]) / 60) / 8)), 2).ToString(),
                                strJobMission = string.IsNullOrEmpty(q.rozmamoriat) || q.rozmamoriat.Trim() == "0" ? "00:00" : (q.rozmamoriat.Trim().Length == 5 ? q.rozmamoriat.Trim() : (q.rozmamoriat.Trim().Length == 6 && q.rozmamoriat.Trim().Split(':')[0].Length == 3) ? (q.rozmamoriat.Trim().Split(':')[0].Replace("00", "") + ":" + q.rozmamoriat.Trim().Split(':')[1]) : "0" + q.rozmamoriat.Trim()),
                                strJobExit = string.IsNullOrEmpty(q.khorojGhirMojaz) || q.khorojGhirMojaz.Trim() == "0" ? "00:00" : (q.khorojGhirMojaz.Trim().Length == 5 ? q.khorojGhirMojaz.Trim() : (q.khorojGhirMojaz.Trim().Length == 6 && q.khorojGhirMojaz.Trim().Split(':')[0].Length == 3) ? (q.khorojGhirMojaz.Trim().Split(':')[0].Replace("00", "") + ":" + q.khorojGhirMojaz.Trim().Split(':')[1]) : "0" + q.khorojGhirMojaz.Trim()),
                                strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                                numStatus = 0,
                                numContractKindRef = Convert.ToInt16(contract.numContractKindRef),
                                numWorkGroupRef = contract.numWorkGroupRef,
                                //numMonth = Convert.ToInt16(month),
                                numYear = Convert.ToInt16(_PDate.NowYear),
                                //strJobDays = Math.Round((decimal)((Convert.ToDouble(q.strjobKarkard.Split(':')[0]) / 8) + ((Convert.ToDouble(q.strjobKarkard.Split(':')[1]) / 60) / 8)), 2).ToString(),
                                strJobDays = string.IsNullOrEmpty(q.strjobKarkard) || q.strjobKarkard.Trim() == "0" ? "00:00" : (q.strjobKarkard.Trim().Length == 5 ? q.strjobKarkard.Trim() : (q.strjobKarkard.Trim().Length == 6 && q.strjobKarkard.Trim().Split(':')[0].Length == 3) ? (q.strjobKarkard.Trim().Split(':')[0].Replace("00", "") + ":" + q.strjobKarkard.Trim().Split(':')[1]) : "0" + q.strjobKarkard.Trim()),
                                strJobFriday = string.IsNullOrEmpty(q.strfriday) || q.strfriday.Trim() == "0" ? "00:00" : (q.strfriday.Trim().Length == 5 ? q.strfriday.Trim() : (q.strfriday.Trim().Length == 6 && q.strfriday.Trim().Split(':')[0].Length == 3) ? (q.strfriday.Trim().Split(':')[0].Replace("00", "") + ":" + q.strfriday.Trim().Split(':')[1]) : "0" + q.strfriday.Trim()),
                                strJobHoliDay = string.IsNullOrEmpty(q.strholyday) || q.strholyday.Trim() == "0" ? "00:00" : (q.strholyday.Trim().Length == 5 ? q.strholyday.Trim() : (q.strholyday.Trim().Length == 6 && q.strholyday.Trim().Split(':')[0].Length == 3) ? (q.strholyday.Trim().Split(':')[0].Replace("00", "") + ":" + q.strholyday.Trim().Split(':')[1]) : "0" + q.strholyday.Trim()),
                            });
                        }
                    }
                    lstErr.Add(op);
                }

            }
            excelReader.Close();

            try
            {

                if (checkError == 1)
                {
                    var qq = (from t1 in lstErr //office.ofcPersonels
                                                //join t1 in lstErr on t.numPersonelCode equals t1.numPersonelCode
                              select new
                              {
                                  t1.numPersonelCode,
                                  strPersonelName = t1.strPersonelName,
                                  t1.ErrorCode
                              }).ToList();

                    office.SubmitChanges();
                    json = serializer.Serialize((object)qq); // sabt shod
                }
                else
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // sabt shod
                }
            }
            catch
            {
                json = serializer.Serialize((object)"3"); // khata dar sabt
            }
        }

        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------گزارش کارکردروزانه ------------------------
    //----------------------------------------------------------------------
    private void GetReportKarkardDaily()
    {
        string personelcode = context.Request.Form["personelcode"];
        string status = context.Request.Form["status"];

        string grohkari = context.Request.Form["WorkJob"].Replace("\"", "");
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcBWorkGroups on t.numWorkGroupRef equals t1.numWorkGroupCode
                        join t2 in office.ofcPersonelDailyJobs on t.numPersonelCode equals t2.numPersonelRef
                        where
                             (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                             &&
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            (t2.numStatus == Convert.ToInt16(status) || status == "-1")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                            &&
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                            &&
                            (string.Compare(t2.dateKarkardRozaneDate, DateFrom) >= 0 && string.Compare(t2.dateKarkardRozaneDate, DateTo) <= 0)
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t1.strWorkGroupName,
                            t2.strStartJobTime,
                            t2.strEndJobTime,
                            t2.strJobAbsent,
                            t2.strJobDelay,
                            t2.strJobEarly,
                            t2.strJobMission,
                            t2.strJobOverTime,
                            t2.strJobExit,
                            t2.dateRegisterDate,
                            t2.dateKarkardRozaneDate,
                            t2.strJobFriday,
                            t2.strJobHoliDay,
                            t2.strJobDays,
                            t2.numStatus,
                            t2.numDailyJobCode,
                            t2.strJobOverTimeSpecial,
                            t2.strJobOverTimeInMission
                        });


        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.dateKarkardRozaneDate).ThenBy(c=> c.numPersonelCode).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //--------------------------ثبت نوع مرخصی جدید----------------------
    //---------------------------------------------------------------------
    public void saveNewMorakhasiKind()
    {
        string MorakhsiKind = context.Request.Form["MorakhsiKind"];
        string json = "";
        int MorakhasiCheck = office.ofcBleaves.Where(o => o.strLeaveName.Trim() == MorakhsiKind.Trim()).Count();
        try
        {
            if (MorakhasiCheck > 0)
            {
                json = serializer.Serialize((object)"5");
            }
            else
            {
                office.ofcBleaves.InsertOnSubmit(new ofcBleave
                {
                    strLeaveName = MorakhsiKind.Trim(),
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
    //--------------------------دریافت کل نوع مرخصی-----------------------
    //---------------------------------------------------------------------
    public void GetAllMorakhasiKind()
    {
        var q = from t in office.ofcBleaves
                select new
                {
                    t.numStatus,
                    t.numLeaveCode,
                    t.strLeaveName
                };
        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }

    //---------------------------------------------------------------------
    //-------------------------------------------------
    //---------------------------------------------------------------------
    public void SetActiveAndDeActiveMorakhasiKind()
    {
        string checkis = context.Request.Form["checkis"];
        string code = context.Request.Form["code"];

        string json = "";
        var q = office.ofcBleaves.Where(c => c.numLeaveCode == Convert.ToInt32(code)).FirstOrDefault();
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
    public void EditMorakhsikindName()
    {
        string code = context.Request.Form["code"];
        string morakhasiKind = context.Request.Form["morakhasiKind"];

        string json = "";
        var q = office.ofcBleaves.Where(c => c.numLeaveCode == Convert.ToInt32(code)).FirstOrDefault();
        q.strLeaveName = morakhasiKind;

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
    public void DeleteMorakhsikindName()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        var morakhsikind = office.ofcBleaves.Where(o => o.numLeaveCode == code).FirstOrDefault();
        string json = "";
        try
        {
            if (morakhsikind != null)
            {

                int checkMorakhsiKindCount = office.ofcPersonelLeaves.Where(c => c.numLeaveRef == code).Count();
                if (checkMorakhsiKindCount == 0)
                {
                    office.ofcBleaves.DeleteOnSubmit(morakhsikind);
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
    //----------------------------------------------------------------------
    //-----------------------ثبت  مرخصی ماهانه ------------------------
    //----------------------------------------------------------------------
    private void SaveMorakhasiMahane()
    {
        string month = context.Request.Form["month"];
        string morakhasiKind = context.Request.Form["morakhasiKind"];
        HttpPostedFile postedFile = context.Request.Files["UpFileMorakhsi"];
        string json = "";
        List<lsterror> lstErr = new List<lsterror>();

        string savepath = HttpContext.Current.Server.MapPath("~/ExcelKarkard/");
        var extension = Path.GetExtension(postedFile.FileName).ToLower();
        if (extension.Trim() != ".xls" && extension.Trim() != ".xlsx")
        {
            json = serializer.Serialize((object)"2"); // format unvalid
        }
        else
        {
            string fname = postedFile.FileName.Remove((postedFile.FileName.Length - extension.Length));

            fname = "Morakhasi_" + fname + System.DateTime.Now.ToString("_ddMMyyhhmmss") + extension;

            if (!File.Exists(savepath + fname))
            {
                postedFile.SaveAs(savepath + fname);
            }
            else
            {
                File.Delete(savepath + fname);
                postedFile.SaveAs(savepath + fname);
            }

            //=================================================================
            FileStream stream = File.Open((savepath + fname).Trim(), FileMode.Open, FileAccess.Read);
            IExcelDataReader excelReader;
            if (extension.Trim() == ".xls")
            {
                excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
            }
            else //if (strFileType.Trim() == ".xlsx")
            {
                excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
            }

            DataSet result = excelReader.AsDataSet();
            int checkError = 0;
            for (int i = 1; i < result.Tables[0].Rows.Count; i++)
            {
                var q = new
                {
                    personelcode = result.Tables[0].Rows[i].ItemArray[0].ToString().Trim(),
                    morakhsiTime = result.Tables[0].Rows[i].ItemArray[1].ToString().Trim(),
                };
                if (!String.IsNullOrEmpty(q.personelcode))
                {
                    lsterror op = new lsterror();
                    var checkPersonel = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(q.personelcode)).FirstOrDefault();
                    if (checkPersonel == null)
                    {
                        op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        op.strPersonelName = "";
                        op.ErrorCode = 0; // یافت نشد
                        checkError = 1;
                    }
                    else
                    {

                        if (checkPersonel.numStatus == 0)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 2; // ghire faal
                            checkError = 1;
                        }
                        else if (checkPersonel.numStatus == 3)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 3;//ghate hamkari
                            checkError = 1;
                        }


                        //var checkPreInvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.strInvoiceYear == _PDate.NowYear && c.strInvoiceMonth == month && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();

                        //if (checkPreInvoice != null)
                        //{
                        //    op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        //    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                        //    op.ErrorCode = 4;// sabeghe tasvieh hesab dare dar in sal va mah
                        //    checkError = 1;
                        //}
                        //else
                        //{

                        op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                        op.ErrorCode = 1; // faal

                        var checkMorakhasi = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numLeaveRef == Convert.ToInt16(morakhasiKind) && c.numYear == Convert.ToInt16(_PDate.NowYear) && c.numMonth == Convert.ToInt16(month) && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();
                        if (checkMorakhasi != null) office.ofcPersonelLeaves.DeleteOnSubmit(checkMorakhasi);
                        office.ofcPersonelLeaves.InsertOnSubmit(new ofcPersonelLeave
                        {
                            dateRegisterDate = _PDate.PersianDate,
                            numPersonelRef = Convert.ToInt32(q.personelcode),
                            numYear = Convert.ToInt16(_PDate.NowYear),
                            strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                            numMonth = Convert.ToInt16(month),
                            numStatus = 2,
                            numLeaveRef = Convert.ToInt16(morakhasiKind),
                            timeLeaveTime = q.morakhsiTime.Trim().Length == 5 ? q.morakhsiTime.Trim() : (q.morakhsiTime.Trim().Length == 6 && q.morakhsiTime.Trim().Split(':')[0].Length == 3) ? (q.morakhsiTime.Trim().Split(':')[0].Replace("00", "") + ":" + q.morakhsiTime.Trim().Split(':')[1]) : "0" + q.morakhsiTime.Trim(),
                        });
                    }
                    lstErr.Add(op);
                }
                //}
            }
            excelReader.Close();

            try
            {

                if (checkError == 1)
                {
                    var qq = from t1 in lstErr
                             select new
                             {
                                 t1.numPersonelCode,
                                 strPersonelName = t1.strPersonelName,
                                 t1.ErrorCode
                             };
                    office.SubmitChanges();
                    json = serializer.Serialize((object)qq); // sabt shod
                }
                else
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // sabt shod
                }
            }
            catch (Exception ex)
            {
                string a = ex.Message;
                json = serializer.Serialize((object)"3"); // khata dar sabt
            }
        }
        //}

        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------تبدیل کارکرد روزانه به ماهیانه ------------------------
    //----------------------------------------------------------------------
    private void CalcDailyToMonthly()
    {
        string personelCode = context.Request.Form["personelCode"];
        string datefrom = context.Request.Form["datefrom"];
        string dateTo = context.Request.Form["dateTo"];
        string month = context.Request.Form["month"];
        string year = context.Request.Form["year"];
        string checkKarkard = context.Request.Form["checkKarkard"];
        string checkMorakhasi = context.Request.Form["checkMorakhasi"];
        string json = "";
        int ChecksaveKarkard = 0;
        int ChecksaveMorakhasi = 0;
        int checkError = 0;
        personelCode = String.IsNullOrEmpty(personelCode) ? "-1" : personelCode;
        List<lsterror> lstErr = new List<lsterror>();

        if (checkKarkard == "true")
        {
            var q = from t in office.ofcPersonelDailyJobs
                    where
                         (string.Compare(t.dateKarkardRozaneDate, datefrom) >= 0 && string.Compare(t.dateKarkardRozaneDate, dateTo) <= 0)
                         &&
                         t.numStatus == 0
                         &&
                         (t.numPersonelRef == Convert.ToInt32(personelCode) || personelCode == "-1")
                    select new
                    {
                        t.numPersonelRef,
                        t.dateKarkardRozaneDate,
                        t.dateRegisterDate,
                        t.numContractKindRef,
                        t.numContractRef,
                        t.numDailyJobCode,
                        t.numMonth,
                        t.numStatus,
                        t.numWorkGroupRef,
                        t.numYear,
                        t.strEndJobTime,
                        t.strJobAbsent,
                        t.strJobDelay,
                        t.strJobEarly,
                        t.strJobExit,
                        t.strJobMission,
                        t.strJobOverTime,
                        t.strRegisterUserRef,
                        t.strStartJobTime,
                        t.strJobDays,
                        t.strJobFriday,
                        t.strJobHoliDay,
                        t.strJobOverTimeSpecial,
                        t.strJobOverTimeInMission
                    };

            if (q.Any())
            {
                int?[] personelcodeArray = q.Select(c => c.numPersonelRef).Distinct().ToArray();
                double strJobDays = 0, strJobOverTime = 0, strJobFriday = 0, strJobHoliDay = 0, strJobOverTimeSepecial = 0, strJobOverTimeInMission = 0,
                    strJobMission = 0, strJobDelay = 0, strJobEarly = 0, strJobAbsent = 0, strJobExit = 0;

                double stime = 0;
                foreach (var item in personelcodeArray)
                {
                    if (item != null)
                    {
                        var checkitem = q.Where(c => c.numPersonelRef == item);
                        var contract = (from t in office.ofcPersonelContracts
                                        where t.numPersonelRef == item
                                        &&
                                        t.numStatus == 1
                                        select new
                                        {
                                            t.numContractKindRef,
                                            t.numContractCode,
                                            t.numWorkGroupRef
                                        }).FirstOrDefault();
                        lsterror op = new lsterror();
                        var checkPersonel = office.ofcPersonels.Where(c => c.numPersonelCode == item).FirstOrDefault();
                        if (checkPersonel == null)
                        {
                            op.numPersonelCode = Convert.ToInt32(item);
                            op.strPersonelName = "";
                            op.ErrorCode = 0; // یافت نشد
                            checkError = 1;
                        }
                        else
                        {
                            if (checkPersonel.numStatus == 0)
                            {
                                op.numPersonelCode = Convert.ToInt32(item);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 2; // ghire faal
                                checkError = 1;
                            }
                            else if (checkPersonel.numStatus == 3)
                            {
                                op.numPersonelCode = Convert.ToInt32(item);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 3; //ghate hamkari
                                checkError = 1;
                            }

                            if (contract == null)
                            {
                                op.numPersonelCode = Convert.ToInt32(item);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 5; // gharardade ghire faal shode
                                checkError = 1;
                            }
                            else if (contract != null)
                            {
                                op.numPersonelCode = Convert.ToInt32(item);
                                op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                op.ErrorCode = 1; // faal

                                strJobDays = 0; strJobOverTime = 0; strJobFriday = 0; strJobHoliDay = 0; strJobOverTimeSepecial = 0;
                                strJobMission = 0; strJobDelay = 0; strJobEarly = 0; strJobAbsent = 0; strJobExit = 0;
                                strJobOverTimeInMission = 0;

                                foreach (var karkard in checkitem)
                                {
                                    stime = TimeSpan.Parse(karkard.strJobDays).TotalSeconds;
                                    strJobDays = strJobDays + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobOverTime).TotalSeconds;
                                    strJobOverTime = strJobOverTime + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = Convert.ToInt32(karkard.strJobOverTimeSpecial.Split(':')[0]) > 23 ? TimeSpan.Parse("23:" + karkard.strJobOverTimeSpecial.Split(':')[1]).TotalSeconds + TimeSpan.Parse((Convert.ToInt32(karkard.strJobOverTimeSpecial.Split(':')[0]) - 23).ToString() + ":00").TotalSeconds : TimeSpan.Parse(karkard.strJobOverTimeSpecial).TotalSeconds;
                                    strJobOverTimeSepecial = strJobOverTimeSepecial + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobOverTimeInMission).TotalSeconds;
                                    strJobOverTimeInMission = strJobOverTimeInMission + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobFriday).TotalSeconds;
                                    strJobFriday = strJobFriday + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobHoliDay).TotalSeconds;
                                    strJobHoliDay = strJobHoliDay + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobMission).TotalSeconds;
                                    strJobMission = strJobMission + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobDelay).TotalSeconds;
                                    strJobDelay = strJobDelay + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobEarly).TotalSeconds;
                                    strJobEarly = strJobEarly + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobAbsent).TotalSeconds;
                                    strJobAbsent = strJobAbsent + stime;
                                    //=======================================
                                    stime = 0;
                                    stime = TimeSpan.Parse(karkard.strJobExit).TotalSeconds;
                                    strJobExit = strJobExit + stime;
                                }

                                if ((new int[] { 1, 3 }).Contains((int)contract.numContractKindRef)) // movaghat and projecti
                                {
                                    TimeSpan _strJobDays = TimeSpan.FromSeconds(strJobDays);
                                    TimeSpan _strJobOverTime = TimeSpan.FromSeconds(strJobOverTime);
                                    TimeSpan _strJobOverTimeSepicial = TimeSpan.FromSeconds(strJobOverTimeSepecial);
                                    TimeSpan _strJobOverTimeInMission = TimeSpan.FromSeconds(strJobOverTimeInMission);

                                    TimeSpan _strJobFriday = TimeSpan.FromSeconds(strJobFriday);
                                    TimeSpan _strJobHoliDay = TimeSpan.FromSeconds(strJobHoliDay);
                                    TimeSpan _strJobDelay = TimeSpan.FromSeconds(strJobDelay);
                                    TimeSpan _strJobEarly = TimeSpan.FromSeconds(strJobEarly);
                                    TimeSpan _strJobExit = TimeSpan.FromSeconds(strJobExit);

                                    TimeSpan _strJobMission = TimeSpan.FromSeconds(strJobMission);
                                    TimeSpan _strJobAbsent = TimeSpan.FromSeconds(strJobAbsent);

                                    string strJobDays2 = string.Format("{0:D2}:{1:D2}", (_strJobDays.Days * 24) + _strJobDays.Hours, _strJobDays.Minutes);

                                    string strJobMission2 = string.Format("{0:D2}:{1:D2}", (_strJobMission.Days * 24) + _strJobMission.Hours, _strJobMission.Minutes);
                                    string strJobAbsent2 = string.Format("{0:D2}:{1:D2}", (_strJobAbsent.Days * 24) + _strJobAbsent.Hours, _strJobAbsent.Minutes);

                                    string strJobDays5 = Math.Round((decimal)((Convert.ToDouble(strJobDays2.Split(':')[0]) / 8) + ((Convert.ToDouble(strJobDays2.Split(':')[1]) / 60) / 8)), 2).ToString();
                                    string strJobOverTime5 = string.Format("{0:D2}:{1:D2}", (_strJobOverTime.Days * 24) + _strJobOverTime.Hours, _strJobOverTime.Minutes);
                                    string strJobOverTimeSpecial5 = string.Format("{0:D2}:{1:D2}", (_strJobOverTimeSepicial.Days * 24) + _strJobOverTimeSepicial.Hours, _strJobOverTimeSepicial.Minutes);
                                    string strJobOverTimeInMission5 = string.Format("{0:D2}:{1:D2}", (_strJobOverTimeInMission.Days * 24) + _strJobOverTimeInMission.Hours, _strJobOverTimeInMission.Minutes);

                                    string strJobFriday5 = string.Format("{0:D2}:{1:D2}", (_strJobFriday.Days * 24) + _strJobFriday.Hours, _strJobFriday.Minutes);
                                    string strJobHoliDay5 = string.Format("{0:D2}:{1:D2}", (_strJobHoliDay.Days * 24) + _strJobHoliDay.Hours, _strJobHoliDay.Minutes);
                                    string strJobMission5 = Math.Round((decimal)((Convert.ToDouble(strJobMission2.Split(':')[0]) / 8) + ((Convert.ToDouble(strJobMission2.Split(':')[1]) / 60) / 8)), 2).ToString();
                                    string strJobDelay5 = string.Format("{0:D2}:{1:D2}", (_strJobDelay.Days * 24) + _strJobDelay.Hours, _strJobDelay.Minutes);
                                    string strJobEarly5 = string.Format("{0:D2}:{1:D2}", (_strJobEarly.Days * 24) + _strJobEarly.Hours, _strJobEarly.Minutes);
                                    string strJobAbsent5 = Math.Round((decimal)((Convert.ToDouble(strJobAbsent2.Split(':')[0]) / 8) + ((Convert.ToDouble(strJobAbsent2.Split(':')[1]) / 60) / 8)), 2).ToString();
                                    string strJobExit5 = string.Format("{0:D2}:{1:D2}", (_strJobExit.Days * 24) + _strJobExit.Hours, _strJobExit.Minutes);

                                    office.ofcPersonelMonthlyJobs.InsertOnSubmit(new ofcPersonelMonthlyJob
                                    {
                                        dateStartJobDate = datefrom,
                                        dateEndJobDate = dateTo,
                                        dateRegisterDate = _PDate.PersianDate,
                                        numContractRef = Convert.ToInt32(contract.numContractCode),
                                        numMonthJob = Convert.ToInt16(month),
                                        numPersonelRef = item,
                                        numYear = Convert.ToInt16(year),
                                        strJobDays = strJobDays5,
                                        strJobOverTime = strJobOverTime5,
                                        strJobFriday = strJobFriday5,
                                        strJobHoliDay = strJobHoliDay5,
                                        strJobMission = strJobMission5,
                                        strJobDelay = strJobDelay5,
                                        strJobEarly = strJobEarly5,
                                        strJobAbsent = strJobAbsent5,
                                        strJobExit = strJobExit5,
                                        strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                                        numStatus = 0,
                                        numContractKindRef = contract.numContractKindRef,
                                        numCountFaraiandProject = (contract.numContractKindRef == 3 ? 0 : 0),
                                        numWorkGroupRef = contract.numWorkGroupRef,
                                        strJobOverTimeSpecial = strJobOverTimeSpecial5,
                                        strJobOverTimeInMission = strJobOverTimeInMission5
                                    });
                                }
                                else if (contract.numContractKindRef == 2) // saati
                                {
                                    TimeSpan _strJobDays = TimeSpan.FromSeconds(strJobDays);
                                    string _JobTime = string.Format("{0:D2}:{1:D2}", (_strJobDays.Days * 24) + _strJobDays.Hours, _strJobDays.Minutes);
                                    office.ofcPersonelMonthlyJobSaatis.InsertOnSubmit(new ofcPersonelMonthlyJobSaati
                                    {
                                        dateStartJobDate = datefrom,
                                        dateEndJobDate = dateTo,
                                        dateRegisterDate = _PDate.PersianDate,
                                        numContractRef = Convert.ToInt32(contract.numContractCode),
                                        numMonthJob = Convert.ToInt16(month),
                                        numPersonelRef = item,
                                        numYear = Convert.ToInt16(year),
                                        strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                                        numStatus = 0,
                                        numContractKindRef = Convert.ToInt16(contract.numContractKindRef),
                                        strJobTime = _JobTime,
                                        numWorkGroupRef = contract.numWorkGroupRef
                                    });
                                }
                                foreach (var karkard in checkitem)
                                {
                                    var qcheck = office.ofcPersonelDailyJobs.Where(c => c.numPersonelRef == item && c.dateKarkardRozaneDate == karkard.dateKarkardRozaneDate).FirstOrDefault();
                                    if (qcheck != null)
                                    {
                                        qcheck.numStatus = 1;
                                    }
                                }
                            }


                        }
                        lstErr.Add(op);
                    }
                }
                ChecksaveKarkard = 1;
            }
            else
            {
                json = serializer.Serialize((object)"2"); // etelati yaft nashod
            }

        }

        if (checkMorakhasi == "true")
        {
            var q = from t in office.ofcPersonelLeaveDailies
                    where
                         (string.Compare(t.dateLeaveDate, datefrom) >= 0 && string.Compare(t.dateLeaveDate, dateTo) <= 0)
                         &&
                         t.numStatus == 0
                         &&
                         (t.numPersonelRef == Convert.ToInt32(personelCode) || personelCode == "-1")
                    select new
                    {
                        t.numPersonelRef,
                        t.dateRegisterDate,
                        t.numMonth,
                        t.numStatus,
                        t.numYear,
                        t.strRegisterUserRef,
                        t.dateLeaveDate,
                        t.numLeaveRef,
                        t.timeLeaveTime,
                    };
            if (q.Any())
            {
                int?[] personelcodeArray = q.Select(c => c.numPersonelRef).Distinct().ToArray();
                double timeLeaveTime = 0;
                double CheckMorakhasi = 0;
                string AllTimeMorakhasi = "";
                double stime = 0;
                foreach (var item in personelcodeArray)
                {
                    CheckMorakhasi = 0;
                    AllTimeMorakhasi = "";
                    if (item != null)
                    {
                        var contract = (from t in office.ofcPersonelContracts
                                        where t.numPersonelRef == item
                                        &&
                                        t.numStatus == 1
                                        select new
                                        {
                                            t.numContractKindRef,
                                            t.numContractCode,
                                            t.numWorkGroupRef
                                        }).FirstOrDefault();
                        if (ChecksaveKarkard == 0)
                        {
                            lsterror op = new lsterror();
                            var checkPersonel = office.ofcPersonels.Where(c => c.numPersonelCode == item).FirstOrDefault();
                            if (checkPersonel == null)
                            {
                                op.numPersonelCode = Convert.ToInt32(item);
                                op.strPersonelName = "";
                                op.ErrorCode = 0; // یافت نشد
                                checkError = 1;
                            }
                            else
                            {

                                if (checkPersonel.numStatus == 0)
                                {
                                    op.numPersonelCode = Convert.ToInt32(item);
                                    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                    op.ErrorCode = 2; // ghire faal
                                    checkError = 1;
                                }
                                if (checkPersonel.numStatus == 3)
                                {
                                    op.numPersonelCode = Convert.ToInt32(item);
                                    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                    op.ErrorCode = 3; // ghate hamkari
                                    checkError = 1;
                                }

                                if (contract == null)
                                {
                                    op.numPersonelCode = Convert.ToInt32(item);
                                    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                    op.ErrorCode = 5; // gharardade ghire faal shode
                                    checkError = 1;
                                }
                                else
                                {
                                    op.numPersonelCode = Convert.ToInt32(item);
                                    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                                    op.ErrorCode = 1; // faal
                                }
                            }
                            lstErr.Add(op);
                        }
                        //===============================================
                        if (contract != null)
                        {
                            var bleav = (from t in office.ofcBleaves
                                         select new { t.numLeaveCode });

                            foreach (var leaveKind in bleav)
                            {
                                timeLeaveTime = 0;
                                var checkitem = q.Where(c => c.numPersonelRef == item && c.numLeaveRef == leaveKind.numLeaveCode);
                                if (checkitem.Any())
                                {
                                    foreach (var morakhasi in checkitem)
                                    {
                                        stime = TimeSpan.Parse(morakhasi.timeLeaveTime).TotalSeconds;
                                        timeLeaveTime = timeLeaveTime + stime;
                                        //=======================================
                                    }
                                    TimeSpan _timeLeaveTime = TimeSpan.FromSeconds(timeLeaveTime);
                                    string timeLeaveTime5 = string.Format("{0:D2}:{1:D2}", (_timeLeaveTime.Days * 24) + _timeLeaveTime.Hours, _timeLeaveTime.Minutes);


                                    if (leaveKind.numLeaveCode == 4 || leaveKind.numLeaveCode == 5) // morakhas estehghaghi saaati va rozane
                                    {
                                        CheckMorakhasi = CheckMorakhasi + timeLeaveTime;
                                    }

                                    office.ofcPersonelLeaves.InsertOnSubmit(new ofcPersonelLeave
                                    {
                                        dateRegisterDate = _PDate.PersianDate,
                                        numPersonelRef = item,
                                        numYear = Convert.ToInt16(year),
                                        timeLeaveTime = timeLeaveTime5,
                                        strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                                        numStatus = 2,
                                        numLeaveRef = leaveKind.numLeaveCode,
                                        numMonth = Convert.ToInt16(month)
                                    });
                                }

                                foreach (var karkard in checkitem)
                                {
                                    var qcheck1 = office.ofcPersonelLeaveDailies.Where(c => c.numPersonelRef == item && c.dateLeaveDate == karkard.dateLeaveDate && c.numLeaveRef == karkard.numLeaveRef).FirstOrDefault();
                                    if (qcheck1 != null)
                                    {
                                        qcheck1.numStatus = 1;
                                    }
                                }
                            }
                        }
                    }
                    /// check kardane inke aya bish az andaze morakhasi rafte ya khir
                    if (CheckMorakhasi != 0) // morakhas estehghaghi saaati va rozane dare
                    {
                        string[] arraydatefromleave = datefrom.Split('/');
                        string dateFrom1 = arraydatefromleave[0] + "/" + arraydatefromleave[1] + "/01"; // ebtedai mahe ghabl
                        string dateFrom2 = arraydatefromleave[0] + "/" + arraydatefromleave[1] + "/31"; // entehai mahe ghabl

                        string[] arraydatetoleave = dateTo.Split('/');
                        string dateTo1 = arraydatetoleave[0] + "/" + arraydatetoleave[1] + "/01"; // ebtedai mahe feli

                        var qcheck = from t in office.ofcPersonelLeaveDailies
                                     where
                                          (string.Compare(t.dateLeaveDate, dateFrom1) >= 0 && string.Compare(t.dateLeaveDate, dateTo) <= 0)
                                          &&
                                          (t.numStatus == 0 || t.numStatus == 1)
                                          &&
                                          (t.numPersonelRef == Convert.ToInt32(personelCode) || personelCode == "-1")
                                          &&
                                          (new int[] { 4, 5 }).Contains((int)t.numLeaveRef)
                                     select new
                                     {
                                         t.numPersonelRef,
                                         t.dateRegisterDate,
                                         t.numMonth,
                                         t.numStatus,
                                         t.numYear,
                                         t.strRegisterUserRef,
                                         t.dateLeaveDate,
                                         t.numLeaveRef,
                                         t.timeLeaveTime,
                                     };

                        if (qcheck.Any())
                        {
                            timeLeaveTime = 0;
                            stime = 0;
                            var morakhasiMaheGhabl = qcheck.Where(c => (string.Compare(c.dateLeaveDate, dateFrom1) >= 0 && string.Compare(c.dateLeaveDate, dateFrom2) <= 0));
                            foreach (var morakhasi in morakhasiMaheGhabl)
                            {
                                stime = TimeSpan.Parse(morakhasi.timeLeaveTime).TotalSeconds;
                                timeLeaveTime = timeLeaveTime + stime;
                                //=======================================
                            }

                            TimeSpan _timeLeaveTime = TimeSpan.FromSeconds(CheckMorakhasi);
                            AllTimeMorakhasi = string.Format("{0:D2}:{1:D2}", (_timeLeaveTime.Days * 24) + _timeLeaveTime.Hours, _timeLeaveTime.Minutes);

                            double MorakhsiMaheghabl = Convert.ToDouble(Math.Round((decimal)(Convert.ToDouble(AllTimeMorakhasi.Split(':')[0])), 2) + Math.Round((decimal)((Convert.ToDouble(AllTimeMorakhasi.Split(':')[1]) / Convert.ToDouble(60))), 2));
                            double morakhasimojaz = Convert.ToDouble(Math.Round((decimal)(Convert.ToDouble(26 / 12))));

                            int checkMaheGhabl = 0;
                            int checkMaheFeli = 0;
                            if (MorakhsiMaheghabl > morakhasimojaz)
                                checkMaheGhabl = 1;
                            //=======================================================================
                            //================================mahe feli=======================================
                            timeLeaveTime = 0;
                            stime = 0;
                            AllTimeMorakhasi = "";
                            MorakhsiMaheghabl = 0;
                            var morakhasiMaheFeli = qcheck.Where(c => (string.Compare(c.dateLeaveDate, dateTo1) >= 0 && string.Compare(c.dateLeaveDate, dateTo) <= 0));
                            foreach (var morakhasi in morakhasiMaheFeli)
                            {
                                stime = TimeSpan.Parse(morakhasi.timeLeaveTime).TotalSeconds;
                                timeLeaveTime = timeLeaveTime + stime;
                                //=======================================
                            }

                            TimeSpan _timeLeaveTime2 = TimeSpan.FromSeconds(CheckMorakhasi);
                            AllTimeMorakhasi = string.Format("{0:D2}:{1:D2}", (_timeLeaveTime2.Days * 24) + _timeLeaveTime2.Hours, _timeLeaveTime2.Minutes);

                            double MorakhsiMahefeli = Convert.ToDouble(Math.Round((decimal)(Convert.ToDouble(AllTimeMorakhasi.Split(':')[0])), 2) + Math.Round((decimal)((Convert.ToDouble(AllTimeMorakhasi.Split(':')[1]) / Convert.ToDouble(60))), 2));
                            if (MorakhsiMahefeli > morakhasimojaz)
                                checkMaheFeli = 1;
                            //=======================================================================
                            //=======================================================================
                            //=======================================================================
                            if (checkMaheGhabl == 1 || checkMaheFeli == 1)
                            {
                                lsterror op = new lsterror();
                                var checkPersonel1 = office.ofcPersonels.Where(c => c.numPersonelCode == item).FirstOrDefault();
                                op.numPersonelCode = Convert.ToInt32(item);
                                op.strPersonelName = checkPersonel1.strPersonelName + " " + checkPersonel1.strPersonelFamily;
                                op.ErrorCode = 7; // gharardade ghire faal shode
                                op.strDesc = ((checkMaheGhabl == 1 && checkMaheFeli == 1) ? "با موفقیت کارکرد ثبت شد<br/> در ماه قبل " + MorakhsiMaheghabl.ToString() + " روز مرخصی استحقاقی <br/>و در این ماه " + MorakhsiMahefeli.ToString() + " روز مرخصی استحقاقی " :
                                            (checkMaheGhabl == 1 && checkMaheFeli == 0) ? "با موفقیت کارکرد ثبت شد<br/> در ماه قبل " + MorakhsiMaheghabl.ToString() + " روز مرخصی استحقاقی " :
                                            (checkMaheGhabl == 0 && checkMaheFeli == 1) ? "با موفقیت کارکرد ثبت شد<br/> در این ماه " + MorakhsiMahefeli.ToString() + " روز مرخصی استحقاقی " : "");
                                checkError = 1;
                                lstErr.Add(op);
                            }

                        }
                    }
                }
                ChecksaveMorakhasi = 1;
            }
            else
            {
                json = serializer.Serialize((object)"2"); // etelati yaft nashod
            }
        }

        if (ChecksaveMorakhasi == 1 || ChecksaveKarkard == 1)
        {
            try
            {
                if (checkError == 1)
                {
                    var qq = (from t1 in lstErr
                              select new
                              {
                                  t1.numPersonelCode,
                                  strPersonelName = t1.strPersonelName,
                                  t1.ErrorCode
                              }).ToList();

                    office.SubmitChanges();
                    json = serializer.Serialize((object)qq); // sabt shod
                }
                else
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // sabt shod
                }

            }
            catch
            {
                json = serializer.Serialize((object)"3"); // khata
            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //----------------------- viraiesh etalate karakrde rozaneh and mahinaeh ------------------------
    //----------------------------------------------------------------------
    private void SaveEditKarkardRozanehAndMahianeh()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        string datekarkard = context.Request.Form["datekarkard"];
        string startkarkard = context.Request.Form["startkarkard"];
        string endkarard = context.Request.Form["endkarard"];
        string sumkarkard = context.Request.Form["sumkarkard"];
        string ezafekar = context.Request.Form["ezafekar"];
        string jomehkar = context.Request.Form["jomehkar"];
        string tatilkar = context.Request.Form["tatilkar"];
        string takhir = context.Request.Form["takhir"];
        string tajilkar = context.Request.Form["tajilkar"];
        string ghibat = context.Request.Form["ghibat"];
        string mamoriat = context.Request.Form["mamoriat"];
        string exitjob = context.Request.Form["exitjob"];
        string type = context.Request.Form["type"];
        string ezafekarspicial = context.Request.Form["ezafekarspicial"];
        string ezafekarInMission = context.Request.Form["ezafekarInMission"];

        string json = "";
        if (type == "1")
        {
            var karkardrozaneh = office.ofcPersonelDailyJobs.Where(c => c.numPersonelRef == personelcode && c.numDailyJobCode == code).FirstOrDefault();
            if (karkardrozaneh != null)
            {
                karkardrozaneh.dateKarkardRozaneDate = datekarkard;
                karkardrozaneh.strStartJobTime = startkarkard;
                karkardrozaneh.strEndJobTime = endkarard;
                karkardrozaneh.strJobDays = sumkarkard;
                karkardrozaneh.strJobOverTime = ezafekar;
                karkardrozaneh.strJobFriday = jomehkar;
                karkardrozaneh.strJobHoliDay = tatilkar;
                karkardrozaneh.strJobDelay = takhir;
                karkardrozaneh.strJobEarly = tajilkar;
                karkardrozaneh.strJobAbsent = ghibat;
                karkardrozaneh.strJobMission = mamoriat;
                karkardrozaneh.strJobExit = exitjob;
                karkardrozaneh.strJobOverTimeSpecial = ezafekarspicial;
                karkardrozaneh.strJobOverTimeInMission = ezafekarInMission;
                try
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // ok
                }
                catch
                {

                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); // etelati yaft nashod

            }
        }
        else if (type == "2") // mahianeh
        {
            var karkardMahianeh = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == personelcode && c.numMonthlyJobCode == code).FirstOrDefault();
            if (karkardMahianeh != null)
            {
                // karkardMahianeh.strJobDays = sumkarkard;
                karkardMahianeh.strJobOverTime = ezafekar;
                karkardMahianeh.strJobFriday = jomehkar;
                karkardMahianeh.strJobHoliDay = tatilkar;
                karkardMahianeh.strJobDelay = takhir;
                karkardMahianeh.strJobEarly = tajilkar;
                karkardMahianeh.strJobAbsent = ghibat;
                karkardMahianeh.strJobMission = mamoriat;
                karkardMahianeh.strJobExit = exitjob;
                karkardMahianeh.strJobOverTimeSpecial = ezafekarspicial;
                karkardMahianeh.strJobOverTimeInMission = ezafekarInMission;

                try
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // ok
                }
                catch
                {

                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); // etelati yaft nashod

            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------ثبت  مرخصی روزانه ------------------------
    //----------------------------------------------------------------------
    private void SaveMorakhasiRozaneh()
    {
        string date = context.Request.Form["date"];
        string morakhasiKind = context.Request.Form["morakhasiKind"];
        HttpPostedFile postedFile = context.Request.Files["UpFileMorakhsi"];
        string json = "";
        List<lsterror> lstErr = new List<lsterror>();

        string savepath = HttpContext.Current.Server.MapPath("~/ExcelKarkard/");
        var extension = Path.GetExtension(postedFile.FileName).ToLower();
        if (extension.Trim() != ".xls" && extension.Trim() != ".xlsx")
        {
            json = serializer.Serialize((object)"2"); // format unvalid
        }
        else
        {
            string fname = postedFile.FileName.Remove((postedFile.FileName.Length - extension.Length));

            fname = "Morakhasi_" + fname + System.DateTime.Now.ToString("_ddMMyyhhmmss") + extension;

            if (!File.Exists(savepath + fname))
            {
                postedFile.SaveAs(savepath + fname);
            }
            else
            {
                File.Delete(savepath + fname);
                postedFile.SaveAs(savepath + fname);
            }

            //=================================================================
            FileStream stream = File.Open((savepath + fname).Trim(), FileMode.Open, FileAccess.Read);
            IExcelDataReader excelReader;
            if (extension.Trim() == ".xls")
            {
                excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
            }
            else //if (strFileType.Trim() == ".xlsx")
            {
                excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
            }

            DataSet result = excelReader.AsDataSet();
            int checkError = 0;
            for (int i = 1; i < result.Tables[0].Rows.Count; i++)
            {
                var q = new
                {
                    personelcode = result.Tables[0].Rows[i].ItemArray[0].ToString().Trim(),
                    morakhsiTime = result.Tables[0].Rows[i].ItemArray[1].ToString().Trim(),
                };
                if (!String.IsNullOrEmpty(q.personelcode))
                {
                    lsterror op = new lsterror();
                    var checkPersonel = office.ofcPersonels.Where(c => c.numPersonelCode == Convert.ToInt32(q.personelcode)).FirstOrDefault();
                    if (checkPersonel == null)
                    {
                        op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        op.strPersonelName = "";
                        op.ErrorCode = 0; // یافت نشد
                        checkError = 1;
                    }
                    else
                    {

                        if (checkPersonel.numStatus == 0)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 2; // ghire faal
                            checkError = 1;
                        }
                        else if (checkPersonel.numStatus == 3)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 3;// ghate hamkari
                            checkError = 1;
                        }


                        //var checkPreInvoice = office.ofcPersonelPreInvoices.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.strInvoiceYear == _PDate.NowYear && c.strInvoiceMonth == month && (c.numStatus == 1 || c.numStatus == 2)).FirstOrDefault();

                        //if (checkPreInvoice != null)
                        //{
                        //    op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        //    op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                        //    op.ErrorCode = 4;// sabeghe tasvieh hesab dare dar in sal va mah
                        //    checkError = 1;
                        //}
                        //else
                        //{

                        op.numPersonelCode = Convert.ToInt32(q.personelcode);
                        op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                        op.ErrorCode = 1; // faal

                        var checkMorakhasi = office.ofcPersonelLeaveDailies.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numLeaveRef == Convert.ToInt16(morakhasiKind) && c.dateLeaveDate == date && c.numStatus == 0).FirstOrDefault();
                        if (checkMorakhasi != null) office.ofcPersonelLeaveDailies.DeleteOnSubmit(checkMorakhasi);
                        office.ofcPersonelLeaveDailies.InsertOnSubmit(new ofcPersonelLeaveDaily
                        {
                            dateRegisterDate = _PDate.PersianDate,
                            numPersonelRef = Convert.ToInt32(q.personelcode),
                            numYear = Convert.ToInt16(_PDate.NowYear),
                            strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                            dateLeaveDate = date,
                            numStatus = 0,
                            numLeaveRef = Convert.ToInt16(morakhasiKind),
                            timeLeaveTime = q.morakhsiTime.Trim().Length == 5 ? q.morakhsiTime.Trim() : (q.morakhsiTime.Trim().Length == 6 && q.morakhsiTime.Trim().Split(':')[0].Length == 3) ? (q.morakhsiTime.Trim().Split(':')[0].Replace("00", "") + ":" + q.morakhsiTime.Trim().Split(':')[1]) : "0" + q.morakhsiTime.Trim(),
                        });
                    }
                    lstErr.Add(op);
                }
                //}
            }
            excelReader.Close();

            try
            {

                if (checkError == 1)
                {
                    var qq = from t1 in lstErr
                             select new
                             {
                                 t1.numPersonelCode,
                                 strPersonelName = t1.strPersonelName,
                                 t1.ErrorCode
                             };
                    office.SubmitChanges();
                    json = serializer.Serialize((object)qq); // sabt shod
                }
                else
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // sabt shod
                }
            }
            catch (Exception ex)
            {
                string a = ex.Message;
                json = serializer.Serialize((object)"3"); // khata dar sabt
            }
        }
        //}

        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------گزارش مرخصی rozaneh------------------------
    //----------------------------------------------------------------------
    private void GetReportMorakhasiRozaneh()
    {
        string personelcode = context.Request.Form["personelcode"];
        string MorakhsiKind = context.Request.Form["MorakhsiKind"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;


        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcPersonelLeaveDailies on t.numPersonelCode equals t1.numPersonelRef
                        join t2 in office.ofcBleaves on t1.numLeaveRef equals t2.numLeaveCode
                        join t3 in office.ofcBWorkGroups on t.numWorkGroupRef equals t3.numWorkGroupCode
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
                            &&
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                            &&
                            (string.Compare(t1.dateLeaveDate, DateFrom) >= 0 && string.Compare(t1.dateLeaveDate, DateTo) <= 0)
                            &&
                            (t1.numLeaveRef == Convert.ToInt16(MorakhsiKind) || MorakhsiKind == "-1")
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t1.dateRegisterDate,
                            t1.timeLeaveTime,
                            t2.strLeaveName,
                            t3.strWorkGroupName,
                            t1.dateLeaveDate
                        });


        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.dateLeaveDate).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //----------------------- hazf karakrde mahianeh ------------------------
    //----------------------------------------------------------------------
    private void DeleteKarkardMahaineh()
    {
        int code = Convert.ToInt32(context.Request.Form["code"]);
        string personelcode = context.Request.Form["personelcode"];
        string contractkind = context.Request.Form["contractkind"];

        string json = "";
        string datefrom = "";
        string dateto = "";
        if (contractkind == "1" || contractkind == "3")
        {
            var karkardMahaneh = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == Convert.ToInt32(personelcode) && c.numMonthlyJobCode == code && c.numStatus == 0).FirstOrDefault();
            if (karkardMahaneh != null)
            {
                datefrom = karkardMahaneh.dateStartJobDate;
                dateto = karkardMahaneh.dateEndJobDate;
                var checkleave = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == Convert.ToInt32(personelcode) && c.numStatus == 2 && c.numYear == karkardMahaneh.numYear && c.numMonth == karkardMahaneh.numMonthJob);

                office.ofcPersonelMonthlyJobs.DeleteOnSubmit(karkardMahaneh);

                var checkDaily = office.ofcPersonelDailyJobs.Where(t =>
                                        (string.Compare(t.dateKarkardRozaneDate, datefrom) >= 0 && string.Compare(t.dateKarkardRozaneDate, dateto) <= 0)
                                        &&
                                        t.numStatus == 1
                                        &&
                                        t.numPersonelRef == Convert.ToInt32(personelcode)
                                  );
                if (checkDaily.Any())
                {
                    var checkcontract = office.ofcPersonelContracts.Where(c => c.numStatus == 1 && c.numPersonelRef == Convert.ToInt32(personelcode)).FirstOrDefault();
                    foreach (var item in checkDaily)
                    {
                        item.numStatus = 0;
                        if (checkcontract != null)
                            item.numContractRef = checkcontract.numContractCode;
                    }
                }

                //====================================================================================
                if (checkleave.Any())
                {
                    office.ofcPersonelLeaves.DeleteAllOnSubmit(checkleave);
                    var checkleaveDaily = office.ofcPersonelLeaveDailies.Where(t =>
                                       (string.Compare(t.dateLeaveDate, datefrom) >= 0 && string.Compare(t.dateLeaveDate, dateto) <= 0)
                                       &&
                                       t.numStatus == 1
                                       &&
                                       t.numPersonelRef == Convert.ToInt32(personelcode)
                                 );
                    if (checkleaveDaily.Any())
                    {
                        foreach (var item in checkleaveDaily)
                        {
                            item.numStatus = 0;
                        }
                    }
                }
                //====================================================================================
                try
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // ok
                }
                catch
                {

                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); // etelati yaft nashod

            }
        }
        else if (contractkind == "2")
        {
            var karkardMahaneh = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == Convert.ToInt32(personelcode) && c.numMonthlyJobSaatiCode == code && c.numStatus == 0).FirstOrDefault();
            if (karkardMahaneh != null)
            {
                datefrom = karkardMahaneh.dateStartJobDate;
                dateto = karkardMahaneh.dateEndJobDate;
                var checkleave = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == Convert.ToInt32(personelcode) && c.numStatus == 2 && c.numYear == karkardMahaneh.numYear && c.numMonth == karkardMahaneh.numMonthJob);
                office.ofcPersonelMonthlyJobSaatis.DeleteOnSubmit(karkardMahaneh);

                var checkDaily = office.ofcPersonelDailyJobs.Where(t =>

                                        (string.Compare(t.dateKarkardRozaneDate, datefrom) >= 0 && string.Compare(t.dateKarkardRozaneDate, dateto) <= 0)
                                        &&
                                        t.numStatus == 1
                                        &&
                                        t.numPersonelRef == Convert.ToInt32(personelcode)
                                  );
                if (checkDaily.Any())
                {
                    var checkcontract = office.ofcPersonelContracts.Where(c => c.numStatus == 1 && c.numPersonelRef == Convert.ToInt32(personelcode)).FirstOrDefault();
                    foreach (var item in checkDaily)
                    {
                        item.numStatus = 0;
                        if (checkcontract != null)
                            item.numContractRef = checkcontract.numContractCode;
                    }
                }
                //====================================================================================
                if (checkleave.Any())
                {
                    office.ofcPersonelLeaves.DeleteAllOnSubmit(checkleave);
                    var checkleaveDaily = office.ofcPersonelLeaveDailies.Where(t =>
                                       (string.Compare(t.dateLeaveDate, datefrom) >= 0 && string.Compare(t.dateLeaveDate, dateto) <= 0)
                                       &&
                                       t.numStatus == 1
                                       &&
                                       t.numPersonelRef == Convert.ToInt32(personelcode)
                                 );
                    if (checkleaveDaily.Any())
                    {
                        foreach (var item in checkleaveDaily)
                        {
                            item.numStatus = 0;
                        }
                    }
                }
                //====================================================================================
                try
                {
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // ok
                }
                catch
                {

                    json = serializer.Serialize((object)"3"); // khata
                }

            }
            else
            {
                json = serializer.Serialize((object)"2"); // etelati yaft nashod

            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //----------------------------------------------------------------------
    //----------------------------------------------------------------------
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}