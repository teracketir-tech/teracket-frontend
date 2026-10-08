<%@ WebHandler Language="C#" Class="PBPersonelCalcutPrice" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.IO;
using System.Data;
using Excel;
public class PBPersonelCalcutPrice : IHttpHandler, IReadOnlySessionState
{

    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    HttpContext context = HttpContext.Current;
    OfficeDataContext office;
    JavaScriptSerializer serializer = new JavaScriptSerializer();
    PersianDateTime _PDate = new PersianDateTime(0);
    FuncAllEdari EdariFunc = new FuncAllEdari();
    int BimehProjectAndSaati = 0; // 9421645; // hoghogh sabet + bon + hagh maskan sale  95
    int hoghoghSabet = 0; // hoghogh sabete sale 95
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
                    GetReportPersonel();//دریافت اطلاعات پرسنلی
                    break;
                case 3:
                    GetReportDescPersonel(); //دریافت اطلاعات شرح پرداخت
                    break;
                case 4:
                    SaveMosaede(); //ثبت مساعده
                    break;
                case 5:
                    ReportMosaede(); //گزارش مساعده
                    break;
                case 6:
                    SaveVam(); //ثبت وام
                    break;
                case 7:
                    ReportVam(); //گزارش وام
                    break;
                case 8:
                    ReportHoghogh(); //گزارش صورت حساب حقوق
                    break;
                case 9:
                    SavePadashAndJarimeh(); //ثبت پاداش و جریمه
                    break;
                case 10:
                    ReportPadashAndJarimeh(); //گزارش پاداش و جریمه
                    break;
                case 11:
                    CheckPreInvoice(); // چک کردن مشاهده آخرین بررسی
                    break;
                case 12:
                    SavePreInvoice(); // پیش ثبت صورت حساب کلی حقوق
                    break;
                case 13:
                    GetReportpreInvoice(); // گزارش پیش ثبت صورت حساب کلی حقوق
                    break;
                case 14:
                    SaveFinalInvoice(); // ثبت نهایی صورت حساب کلی حقوق
                    break;
                case 15:
                    GetRepotFinalVarizInvoice(); //گزارش سابقه واریز صورت حساب کلی حقوق
                    break;
                case 19:
                    GetReportKosorPersonel(); //دریافت اطلاعات کسور پرداخت
                    break;
                case 20:
                    ReClachoghogh(); //محاسبه مجدد صورت حساب حقوق
                    break;
                case 21:
                    DeleteClachoghogh(); //حذف محاسبه  صورت حساب حقوق
                    break;
                case 22:
                    CheckKarkardMahanehForHoghogh(); //check karkarde mahane for hoghogh
                    break;
                case 23:
                    SaveUploadFaraiand(); //بارگزاری فرایند قرارداد پیمانکاری
                    break;
                case 24:
                    ReportFaraiandha(); //گزارش صورت حساب فرآیند ها
                    break;
                case 25:
                    SavePreFaraiand(); // پیش ثبت فرآیند ها
                    break;
                case 26:
                    GetReportpreFaraiand(); // گزارش پیش ثبت فرآیند ها
                    break;
                case 27:
                    CheckPreFaraiand(); // چک کردن مشاهده آخرین بررسی فرایند
                    break;
                case 28:
                    SaveFinalFaraiand(); // ثبت نهایی فرایند
                    break;
                case 29:
                    GetRepotFinalVarizFaraiand(); //گزارش سابقه واریز فرایند
                    break;
                case 30:
                    GetRepotListPersonelFaraiand(); //check List Personeli ke Faraiandi hastan
                    break;
                case 31:
                    SetKarakardeSefrProjecti(); //sefr karadane karakarde personel projei ke entekhab shodeand
                    break;
                case 32:
                    ReClacFaraiand(); //محاسبه مجدد فرایند
                    break;
                case 33:
                    DeleteClacFaraiand(); //حذف محاسبه  فرایند
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
    //-----------------------دریافت اطلاعات پرسنلی ------------------------
    //----------------------------------------------------------------------
    private void GetReportPersonel()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        //string WorkJob = context.Request.Form["WorkJob"].Replace("\"", "");
        //WorkJob = String.IsNullOrEmpty(WorkJob) ? "-1" : WorkJob;
        string grohkari = context.Request.Form["WorkJob"].Replace("\"", "");
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
                        join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                        join t1 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t1.numWorkGroupCode into join_t1
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
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                            &&
                            (t.numStatus == 2 || t.numStatus == 1)
                            &&
                            t2.numStatus == 1
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            strWorkGroupName = (t1.strWorkGroupName == null || t1.strWorkGroupName == "" ? "نامشخص" : t1.strWorkGroupName),
                            t2.numPersonelSalary,
                            morakhasiBihoghoghSalary = (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash + t2.numPersonelChildSalary)
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
    //-----------------------دریافت اطلاعات شرح پرداخت --------------------
    //----------------------------------------------------------------------
    private void GetReportDescPersonel()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["WorkJob"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        int contractKind = Convert.ToInt32(context.Request.Form["contractKind"]);

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }
        if (contractKind == 1 || contractKind == 3) // movaghat and project
        {
            var personel = (from t in office.ofcPersonels
                            join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                            join t3 in office.ofcPersonelMonthlyJobs on t2.numContractCode equals t3.numContractRef
                            join t1 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t1.numWorkGroupCode into join_t1
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
                                ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                                &&
                                (t.numStatus == 2 || t.numStatus == 1)
                                 &&
                                (t3.numMonthJob == Convert.ToInt16(month))
                                 &&
                                 t3.numYear == Convert.ToInt16(year)
                                 &&
                                 t2.numStatus == 1
                                 &&
                                 t3.numContractKindRef == contractKind
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.numPersonelCode,
                                strWorkGroupName = (t1.strWorkGroupName == null || t1.strWorkGroupName == "" ? "نامشخص" : t1.strWorkGroupName),
                                numPersonelChildSalary = EdariFunc.GetPriceKarkard((int)t2.numPersonelChildSalary, t2.dateStartContractDate, (int)t3.numYear, (int)t3.numMonthJob, t2.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                                numPersonelSalary = EdariFunc.GetPriceKarkard((int)t2.numPersonelSalary, t2.dateStartContractDate, (int)t3.numYear, (int)t3.numMonthJob, t2.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                                numPersonelHomeSalary = (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t2.numPersonelHomeSalary, t2.dateStartContractDate, (int)t3.numYear, (int)t3.numMonthJob, t2.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                                numPersonelBon = (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t2.numPersonelBon, t2.dateStartContractDate, (int)t3.numYear, (int)t3.numMonthJob, t2.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                                ezafekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 1, (int)t2.numContractCode, 0),
                                jomekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobFriday, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 2, (int)t2.numContractCode, 0),
                                tatilkar = EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 3, (int)t2.numContractCode, 0),
                                mamoriat = EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobMission, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 4, (int)t2.numContractCode, 0),
                                padash = (contractKind == 3 ? (t2.numPersonelPadash * t3.numCountFaraiandProject) : EdariFunc.GetPriceKarkard((int)t2.numPersonelPadash, t2.dateStartContractDate, (int)t3.numYear, (int)t3.numMonthJob, t2.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                                padashsaier = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 0),// t2.numPersonelSaier,
                                sanavat = t2.numPersonelSanavat,
                                Moavaghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 0),// t2.numPersonelSaier,

                                ayabzahab = EdariFunc.GetAyabZahab((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t2.numPriceAyabZahab, 0), (int)t3.numYear, (int)t3.numMonthJob, t2.dateStartContractDate, t2.dateCutWorkDate, 0),
                                haghmodiriat = EdariFunc.GetHaghModiriat((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t2.numPriceHaghModiriat, 0), (int)t3.numYear, (int)t3.numMonthJob, t2.dateStartContractDate, t2.dateCutWorkDate, 0),
                                mah31roz = EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t2.numPersonelSalary), (int)t3.numYear, (int)t3.numMonthJob, t2.dateStartContractDate, t2.dateCutWorkDate, (int)t2.numContractKindRef, 0, 1),
                                eidi = 0,

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
        else if (contractKind == 2) // saati
        {
            var personel = (from t in office.ofcPersonels
                            join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                            join t3 in office.ofcPersonelMonthlyJobSaatis on t2.numContractCode equals t3.numContractRef
                            join t1 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t1.numWorkGroupCode into join_t1
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
                                ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                                &&
                                (t.numStatus == 2 || t.numStatus == 1)
                                 &&
                                (t3.numMonthJob == Convert.ToInt16(month))
                                 &&
                                 t3.numYear == Convert.ToInt16(year)
                                 &&
                                 t2.numStatus == 1
                                 &&
                                 t3.numContractKindRef == contractKind
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.numPersonelCode,
                                strWorkGroupName = (t1.strWorkGroupName == null || t1.strWorkGroupName == "" ? "نامشخص" : t1.strWorkGroupName),
                                numPersonelSalary = EdariFunc.GetPriceKarkardSaati(t3.strJobTime, (int)t2.numPersonelSalary, 1),
                                t2.numPersonelChildSalary,
                                t2.numPersonelHomeSalary,
                                t2.numPersonelBon,
                                ezafekar = 0,// Getkarkard(t3.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 1),
                                jomekar = 0,// Getkarkard(t3.strJobFriday, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 2),
                                tatilkar = 0,// Getkarkard(t3.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 3),
                                mamoriat = 0,// Getkarkard(t3.strJobMission, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 4),
                                padash = t2.numPersonelPadash,
                                padashsaier = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 0),// t2.numPersonelSaier,
                                ayabzahab = 0,
                                eidi = 0,
                                sanavat = t2.numPersonelSanavat,
                                haghmodiriat = 0,
                                Moavaghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 0),// t2.numPersonelSaier,

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
    }
    //----------------------------------------------------------------------
    //-----------------------ثبت مساعده ------------------------
    //----------------------------------------------------------------------
    private void SaveMosaede()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        int price = Convert.ToInt32(context.Request.Form["price"]);
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);

        var personelcheck = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode && (c.numStatus == 2 || c.numStatus == 1)).FirstOrDefault();
        string json = "";
        if (personelcheck != null)
        {
            var personelContract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == personelcode && c.numStatus == 1).FirstOrDefault();
            int hoghoghpersonel = personelContract.numContractKindRef == 1 ?
                                Convert.ToInt32(personelContract.numPersonelSalary) + Convert.ToInt32(personelContract.numPersonelHomeSalary) +
                                Convert.ToInt32(personelContract.numPersonelBon) + Convert.ToInt32(personelContract.numPersonelChildSalary) +
                                Convert.ToInt32(personelContract.numPersonelPadash) + Convert.ToInt32(personelContract.numPersonelSaier) +
                                Convert.ToInt32(personelContract.numPersonelSanavat) + Convert.ToInt32(personelContract.numPriceHaghModiriat) +
                                Convert.ToInt32(personelContract.numPriceAyabZahab) :
                                Convert.ToInt32(personelContract.numPersonelSalary) + Convert.ToInt32(personelContract.numPersonelPadash) +
                                Convert.ToInt32(personelContract.numPriceHaghModiriat) + Convert.ToInt32(personelContract.numPriceAyabZahab);

            if (price > hoghoghpersonel)
            {
                json = serializer.Serialize((object)"5"); // mosaede nabaiad az hoghogh bishtar bashe
            }
            else
            {
                var mosaedecheck = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0 && c.numMonth == month && c.numYear == year);
                int sumMosaede = Convert.ToInt32(mosaedecheck.Sum(c => c.numPriceMosaede));
                if ((price + sumMosaede) > hoghoghpersonel)
                {
                    json = serializer.Serialize((object)"5"); // mosaede nabaiad az hoghogh bishtar bashe
                }
                else
                {
                    //var mosaedecheck = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0 && c.numMonth == month && c.numYear == year).FirstOrDefault();
                    //if (mosaedecheck != null)
                    //{
                    //    json = serializer.Serialize((object)"4"); // mosaede tasvihe nashode darad
                    //}
                    //else
                    //{
                    try
                    {
                        office.ofcPersonelMosaedes.InsertOnSubmit(new ofcPersonelMosaede
                        {
                            numPersonelRef = personelcode,
                            numPriceMosaede = price,
                            numStatus = 0,
                            strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                            dateRegisterDate = _PDate.PersianDate,
                            numMonth = Convert.ToInt16(month),
                            numYear = Convert.ToInt16(year)
                        });
                        office.SubmitChanges();
                        json = serializer.Serialize((object)"1"); // sabt shod
                    }
                    catch
                    {
                        json = serializer.Serialize((object)"3"); // khata dar sabt
                    }
                    //}
                }
            }
        }
        else
        {
            json = serializer.Serialize((object)"2"); // codepersonel namotabar

        }
        context.Response.Write(json);
        context.Response.End();


    }
    //----------------------------------------------------------------------
    //-----------------------گزارش مساعده ------------------------
    //----------------------------------------------------------------------
    private void ReportMosaede()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int status = Convert.ToInt32(context.Request.Form["status"]);

        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);

        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcPersonelMosaedes on t.numPersonelCode equals t1.numPersonelRef
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
                            //(string.Compare(t1.dateRegisterDate, DateFrom) >= 0 && string.Compare(t1.dateRegisterDate, DateTo) <= 0)
                            &&
                            (t1.numStatus == Convert.ToInt16(status) || status == -1)
                            &&
                            (t1.numMonth == month || month == -1)
                            &&
                            t1.numYear == year
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t1.dateRegisterDate,
                            t1.numPriceMosaede,
                            t1.numStatus,
                            t1.numYear,
                            t1.numMonth,
                            Monthname = EdariFunc.GetMonthName(t1.numMonth.ToString())
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
    //-----------------------ثبت وام ------------------------
    //----------------------------------------------------------------------
    private void SaveVam()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        int pricevame = Convert.ToInt32(context.Request.Form["pricevame"]);
        int countGhest = Convert.ToInt32(context.Request.Form["countGhest"]);
        int PriceVamMontly = Convert.ToInt32(context.Request.Form["PriceVamMontly"]);
        var personelcheck = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode && (c.numStatus == 2 || c.numStatus == 1)).FirstOrDefault();
        string json = "";
        if (personelcheck != null)
        {
            var vamcheck = office.ofcPersonelVams.Where(c => c.numPersonelRef == personelcode && c.numStatus == 0).FirstOrDefault();
            if (vamcheck != null)
            {
                json = serializer.Serialize((object)"4"); // vam tasvihe nashode darad
            }
            else
            {
                try
                {
                    office.ofcPersonelVams.InsertOnSubmit(new ofcPersonelVam
                    {
                        numPersonelRef = personelcode,
                        numPriceVam = pricevame,
                        numAghsat = Convert.ToInt16(countGhest),
                        numPriceVamMontly = PriceVamMontly,
                        numStatus = 0,
                        strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                        dateRegisterDate = _PDate.PersianDate,
                    });
                    office.SubmitChanges();
                    json = serializer.Serialize((object)"1"); // sabt shod
                }
                catch
                {
                    json = serializer.Serialize((object)"3"); // khata dar sabt
                }
            }
        }
        else
        {
            json = serializer.Serialize((object)"2"); // codepersonel namotabar

        }
        context.Response.Write(json);
        context.Response.End();


    }
    //----------------------------------------------------------------------
    //-----------------------گزارش وام ------------------------
    //----------------------------------------------------------------------
    public class listVam
    {
        public string PersonelName { get; set; }
        public int numPersonelCode { get; set; }
        public string dateRegisterDate { get; set; }
        public int numAghsat { get; set; }
        public int numPriceVam { get; set; }
        public int numPriceVamMontly { get; set; }
        public int numStatus { get; set; }
        public int cntGhestPardakhtShode { get; set; }
        public int cntGhestMande { get; set; }
        public int MandeVam { get; set; }
        public int numVamCode { get; set; }

    }
    //----------------------------------------------------------------------
    //----------------------------------------------------------------------
    //----------------------------------------------------------------------
    private void ReportVam()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int status = Convert.ToInt32(context.Request.Form["status"]);

        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        List<listVam> lstvams = new List<listVam>();
        lstvams = (from t in office.ofcPersonels
                   join t1 in office.ofcPersonelVams on t.numPersonelCode equals t1.numPersonelRef
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
                       (t1.numStatus == Convert.ToInt16(status) || status == -1)
                   select new listVam
                   {
                       PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                       numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                       dateRegisterDate = t1.dateRegisterDate,
                       numAghsat = Convert.ToInt32(t1.numAghsat),
                       numPriceVam = Convert.ToInt32(t1.numPriceVam),
                       numPriceVamMontly = Convert.ToInt32(t1.numPriceVamMontly),
                       numStatus = Convert.ToInt32(t1.numStatus),
                       numVamCode = t1.numVamCode
                   }).ToList();

        foreach (var item in lstvams)
        {
            var checkpersonelVam = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == item.numPersonelCode && c.numVamRef == item.numVamCode);
            if (checkpersonelVam.Count() > 0)
            {
                item.MandeVam = item.numPriceVam - Convert.ToInt32(checkpersonelVam.Sum(c => c.numPriceGhestVam));
                item.MandeVam = item.MandeVam < 0 ? 0 : item.MandeVam;
                item.cntGhestPardakhtShode = checkpersonelVam.Count();
                item.cntGhestMande = item.numAghsat - checkpersonelVam.Count();
            }
            else
            {
                item.MandeVam = item.numPriceVam;
                item.cntGhestPardakhtShode = 0;
                item.cntGhestMande = 0;
            }
        }

        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = lstvams.Count();
        var query = lstvams.OrderBy(o => o.dateRegisterDate).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //--------------------------------گزارش صورت حساب حقوق----------------
    //----------------------------------------------------------------------
    private void ReportHoghogh()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        int checkkarkardonly = Convert.ToInt32(context.Request.Form["checkkarkardonly"]);
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

        // string datefromcalc = year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/01";
        // string daytoclac = "31";

        // var checkmonth = office.ofcDayWorkIntoMonths.Where(c => c.numMonthJob == month && c.numYear == year).FirstOrDefault();
        // if (checkmonth != null) daytoclac = checkmonth.numCountDay.ToString();

        string DateFrom = year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/01";
        string DateTo = year.ToString() + "/12/30";

        int[] personelendcontract = (from t in office.ofcPersonels
                                     join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                                     where
                                         (t.numStatus == 1 || t.numStatus == 2)
                                         &&
                                         t1.numStatus == 1
                                         &&
                                         !((string.Compare(t1.dateEndContractDate, DateFrom) >= 0 && string.Compare(t1.dateEndContractDate, DateTo) <= 0))

                                     select t.numPersonelCode).ToArray();
        if (personelcode != "-1" && personelendcontract.Contains(Convert.ToInt32(personelcode)))
        {
            string json = serializer.Serialize((object)"5");
            context.Response.Write(json);
            context.Response.End();
        }
        else
        {
            if (contractkindCheck == "1" || contractkindCheck == "3") // movaghat and project
            {
                int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoices
                                              join t9 in office.ofcPersonelMonthlyJobs on t8.numPersonelRef equals t9.numPersonelRef
                                              where
                                                   (new int[] { 2 }).Contains((int)t8.numStatus)
                                                   &&
                                                   t8.strInvoiceMonth == month.ToString()
                                                   &&
                                                   t8.strInvoiceYear == year.ToString()
                                                   &&
                                                   t9.numStatus == 0
                                              select t8.numPersonelRef).OrderBy(x=> x).ToArray();

                int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoices
                                           where
                                                (new int[] { 0, 1, 2 }).Contains((int)t8.numStatus)
                                                &&
                                                t8.strInvoiceMonth == month.ToString()
                                                &&
                                                t8.strInvoiceYear == year.ToString()
                                                &&
                                                !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                                &&
                                                checkkarkardonly == 0
                                           select t8.numPersonelRef).OrderBy(x=> x).ToArray();
                var q = (from t in office.ofcPersonels
                         join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                         join t2 in office.ofcPersonelMonthlyJobs on t1.numContractCode equals t2.numContractRef
                         join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                         from t5 in join_t5.DefaultIfEmpty()
                         join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                         where
                              (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                              &&
                              t1.numStatus == 1
                              &&
                              t2.numStatus == 0
                             &&
                             ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                             ||
                             (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                             ||
                             name == "")
                             &&
                             ((contractkindArray).Contains(t1.numContractKindRef.ToString()) || contractkind == "-1")
                             &&
                             (t.strMelliCode == mellicode || mellicode == "")
                             &&
                             (t2.numMonthJob == Convert.ToInt16(month))
                             &&
                             t2.numYear == Convert.ToInt16(year)
                             &&
                             (t.numStatus == 2 || t.numStatus == 1)
                             &&
                             ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                             &&
                             !
                             (numpersonelarray).Contains(t.numPersonelCode)
                             &&
                             !(personelendcontract).Contains(t.numPersonelCode)
                         select new
                         {
                             PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                             numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                             cntchild = (office.ofcPersonelChildInfos.Where(c => c.numPersonelRef == t.numPersonelCode).Count()),
                             t2.strJobDays,
                             t2.strJobOverTime,
                             t2.strJobOverTimeSpecial,
                             t2.strJobOverTimeInMission,

                             numPersonelSalary = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelSalary, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                             numPersonelPadash = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelPadash, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                             numPersonelHomeSalary = checkkarkardonly == 1 ? 0 : (contractkindCheck == "3" ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelHomeSalary, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                             numPersonelBon = checkkarkardonly == 1 ? 0 : (contractkindCheck == "3" ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelBon, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                             numPersonelChildSalary = checkkarkardonly == 1 ? 0 : (contractkindCheck == "3" ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelChildSalary, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                             numPersonelSanavat = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelSanavat, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),

                             ezafekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTime, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                             ezafekarVijeh = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeSpecial, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                             ezafekarinmission = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeInMission, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                             jomekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobFriday, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 2, (int)t1.numContractCode, 0),
                             tatilkar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobHoliDay, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 3, (int)t1.numContractCode, 0),

                             mamoriat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobMission, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 4, (int)t1.numContractCode, 0),

                             numPriceVamMontly = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 1),
                             numPriceMosaede = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                             takhir = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobDelay, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 5, (int)t1.numContractCode, 0),
                             tajil = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobEarly, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 6, (int)t1.numContractCode, 0),
                             ghibat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobAbsent, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 7, (int)t1.numContractCode, 0),
                             strBankAccount = EdariFunc.CheckIsNUll(t5.strBankAccount, "-"),
                             strBankName = EdariFunc.CheckIsNUll(t5.strBankName, "-"),
                             t7.strWorkGroupName,
                             khorojGhireMojaz = t2.strJobExit != null ? EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobExit, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 8, (int)t1.numContractCode, 0) : 0,
                             bimehKarmand = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkardBimeh((int)t.numPersonelCode, (contractkindCheck == "3" ? EdariFunc.GetPriceKarkard(BimehProjectAndSaati, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode)) : EdariFunc.GetPriceKarkard((int)(t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode))), (int)t2.numYear, (int)t2.numMonthJob, (int)t1.numContractKindRef, t1.dateCutWorkDate, t1.dateStartContractDate),
                             MorakhasiBiHoghogh = EdariFunc.GetPriceMorakhasiBiHoghogh((int)((contractkindCheck == "3" ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                             MorakhasiUniversal = EdariFunc.GetPriceMorakhasiUniversal((int)((contractkindCheck == "3" ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                             mandeHoghoghAzMaheGhabl = checkkarkardonly == 1 ? "0" : EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, "", 1, 0),

                             numPersonelSaier = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                             jarimeMotefareghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                             Moavaghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, (int)t2.numMonthJob, (int)t2.numYear, 0),
                             kharid = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, (int)t2.numMonthJob, (int)t2.numYear, 0),
                             kosormotefareghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t2.numMonthJob, (int)t2.numYear, 0),

                             ayabzahab = checkkarkardonly == 1 ? 0 : EdariFunc.GetAyabZahab((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                             haghmodiriat = checkkarkardonly == 1 ? 0 : EdariFunc.GetHaghModiriat((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceHaghModiriat, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),

                             hazinejari = checkkarkardonly == 1 ? 0 : EdariFunc.GetHazinehJari((int)t.numPersonelCode, (int)t1.numPriceJariAbogaz, (int)t1.numPriceJariEjareh, (int)t1.numPriceJariNet, (int)t1.numPriceJariTel, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                             porsanttozi = checkkarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantToziShode, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 1),
                             porsantkharejmahdode = checkkarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantKharejMahdode, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 2),
                             porsantmoadeli = checkkarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantMoadeli, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 3),


                             mah31roz = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t1.numPersonelSalary), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, (int)t1.numContractKindRef, 0, 1),
                             mah29roz = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t1.numPersonelSalary), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, (int)t1.numContractKindRef, 0, 2),
                             jarimehtakhir = EdariFunc.GetJarimehTakhir8Houer((int)t.numPersonelCode, t2.strJobDelay, (contractkindCheck == "3" ? hoghoghSabet : t1.numPersonelSalary), 5, (int)t1.numContractCode, 0),
                             maliathoghogh = 0,
                             bimetakmili = 0,

                             eidi = 0,
                             bazkharid = 0,
                         });

                int take = page * perpage;
                int skip = page == 1 ? 0 : take - perpage;
                int AllRecrdCount = q.Count();
                var query = q.OrderBy(o => o.numPersonelCode).Take(take).Skip(skip);
                string json = serializer.Serialize((object)query);
                string bothJson = "[" + json + "," + AllRecrdCount + "]";
                context.Response.Write(bothJson);
                context.Response.End();
            }
            else if (contractkindCheck == "2") // saati
            {

                int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                              join t9 in office.ofcPersonelMonthlyJobSaatis on t8.numPersonelRef equals t9.numPersonelRef
                                              where
                                                   (new int[] { 2 }).Contains((int)t8.numStatus)
                                                   &&
                                                   t8.strInvoiceMonth == month.ToString()
                                                   &&
                                                   t8.strInvoiceYear == year.ToString()
                                                   &&
                                                   t9.numStatus == 0
                                              select t8.numPersonelRef).ToArray();


                int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                           where
                                                (new int[] { 0, 1, 2 }).Contains((int)t8.numStatus)
                                                &&
                                                t8.strInvoiceMonth == month.ToString()
                                                &&
                                                t8.strInvoiceYear == year.ToString()
                                                &&
                                                !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                                &&
                                                checkkarkardonly == 0
                                           select t8.numPersonelRef).ToArray();
                var q = (from t in office.ofcPersonels
                         join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                         join t2 in office.ofcPersonelMonthlyJobSaatis on t1.numContractCode equals t2.numContractRef
                         join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                         from t5 in join_t5.DefaultIfEmpty()
                         join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                         where
                              (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                              &&
                              t1.numStatus == 1
                              &&
                              t2.numStatus == 0
                              &&
                              ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                              ||
                              (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                              ||
                              name == "")
                              &&
                              ((contractkindArray).Contains(t1.numContractKindRef.ToString()) || contractkind == "-1")
                              &&
                              (t.strMelliCode == mellicode || mellicode == "")
                              &&
                              (t2.numMonthJob == Convert.ToInt16(month))
                              &&
                              t2.numYear == Convert.ToInt16(year)
                              &&
                              (t.numStatus == 2 || t.numStatus == 1)
                              &&
                              ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                              &&
                              !
                              (numpersonelarray).Contains(t.numPersonelCode)
                               &&
                             !(personelendcontract).Contains(t.numPersonelCode)
                         select new
                         {
                             PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                             numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                             t2.strJobTime,
                             numPersonelSalary1 = checkkarkardonly == 1 ? 0 : t1.numPersonelSalary,
                             numPersonelSalary = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkardSaati(t2.strJobTime, (int)t1.numPersonelSalary, 1),
                             numPersonelSaier = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                             bimehKarmand = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkardBimeh((int)t.numPersonelCode, (EdariFunc.GetPriceKarkard((int)(BimehProjectAndSaati), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode))), (int)t2.numYear, (int)t2.numMonthJob, (int)t1.numContractKindRef, t1.dateCutWorkDate, t1.dateStartContractDate),
                             bimetakmili = 0,
                             numPriceVamMontly = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 1),
                             numPriceMosaede = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                             jarimeMotefareghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                             strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                             strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                             t7.strWorkGroupName,
                             mandeHoghoghAzMaheGhabl = EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, "", 1, 0),
                             Moavaghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                             kharid = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),

                             ayabzahab = checkkarkardonly == 1 ? 0 : EdariFunc.GetAyabZahab((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                             kosormotefareghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t2.numMonthJob, (int)t2.numYear, 0),
                             maliathoghogh = 0,
                         });

                int take = page * perpage;
                int skip = page == 1 ? 0 : take - perpage;
                int AllRecrdCount = q.Count();
                var query = q.OrderBy(o => o.numPersonelCode).Take(take).Skip(skip);
                string json = serializer.Serialize((object)query);
                string bothJson = "[" + json + "," + AllRecrdCount + "]";
                context.Response.Write(bothJson);
                context.Response.End();

            }
        }

    }
    //----------------------------------------------------------------------
    //-----------------------ثبت پاداش و جریمه ------------------------
    //----------------------------------------------------------------------
    private void SavePadashAndJarimeh()
    {
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        int Kind = Convert.ToInt32(context.Request.Form["Kind"]);
        int price = Convert.ToInt32(context.Request.Form["price"]);
        string PadashDesc = context.Request.Form["PadashDesc"];
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        var personelcheck = office.ofcPersonels.Where(c => c.numPersonelCode == personelcode && (c.numStatus == 2 || c.numStatus == 1)).FirstOrDefault();
        string json = "";
        if (personelcheck != null)
        {
            try
            {
                office.ofcPersonelPadashAndJarimehs.InsertOnSubmit(new ofcPersonelPadashAndJarimeh
                {
                    numPersonelRef = personelcode,
                    numSaveKind = Convert.ToInt16(Kind),
                    numPricePadashAndJarimeh = price,
                    strDesc = PadashDesc,
                    numStatus = 0,
                    strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                    dateRegisterDate = _PDate.PersianDate,
                    numMonth = Convert.ToInt16(month),
                    numYear = Convert.ToInt16(year)
                });
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // sabt shod
            }
            catch
            {
                json = serializer.Serialize((object)"3"); // khata dar sabt
            }
        }
        else
        {
            json = serializer.Serialize((object)"2"); // codepersonel namotabar

        }
        context.Response.Write(json);
        context.Response.End();


    }
    //----------------------------------------------------------------------
    //-----------------------گزارش پاداش و جریمه ------------------------
    //----------------------------------------------------------------------
    private void ReportPadashAndJarimeh()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string DateFrom = context.Request.Form["DateFrom"];
        string DateTo = context.Request.Form["DateTo"];
        int status = Convert.ToInt32(context.Request.Form["status"]);
        int kind = Convert.ToInt32(context.Request.Form["kind"]);
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);

        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        var q = (from t in office.ofcPersonels
                 join t1 in office.ofcPersonelPadashAndJarimehs on t.numPersonelCode equals t1.numPersonelRef
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
                     (t1.numStatus == Convert.ToInt16(status) || status == -1)
                     &&
                     (t1.numSaveKind == Convert.ToInt16(kind) || kind == -1)
                     &&
                     (t1.numMonth == month || month == -1)
                     &&
                     t1.numYear == year
                 select new
                 {
                     PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                     numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                     dateRegisterDate = t1.dateRegisterDate,
                     t1.numPricePadashAndJarimeh,
                     numSaveKind = (t1.numSaveKind == 1 ? "پاداش" : t1.numSaveKind == 2 ? "جریمه" : t1.numSaveKind == 3 ? "معوقه" : t1.numSaveKind == 4 ? "خرید از شرکت" : t1.numSaveKind == 5 ? "کسور متفرقه" : t1.numSaveKind == 6 ? "کمک ایاب و ذهاب" : "تعریف نشده"),
                     t1.strDesc,
                     numStatus = (t1.numStatus == 0 ? "<font style='color:red;'>تسویه نشده</font>" : "<font style='color:green;'>تسویه شده</font>"),
                     t1.numYear,
                     montName = EdariFunc.GetMonthName(t1.numMonth.ToString()),
                     t1.numMonth
                 });

        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.numYear).ThenBy(c => c.numMonth).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------چک کردن مشاهده آخرین بررسی ------------------
    //----------------------------------------------------------------------
    private void CheckPreInvoice()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(String.IsNullOrEmpty(context.Request.Form["month"]) ? "0" : context.Request.Form["month"]);
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

        if (contractkindCheck == "1" || contractkindCheck == "3") // movaghat and saati
        {
            int cntCheck = (from t in office.ofcPersonelPreInvoices
                            where
                            t.numStatus == 0
                            &&
                            ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                            select new
                            {
                                t.numInvoiceCode
                            }).Count();
            string json = serializer.Serialize((object)cntCheck);
            context.Response.Write(json);
            context.Response.End();
        }
        else if (contractkindCheck == "2") // saati
        {
            int cntCheck = (from t in office.ofcPersonelPreInvoiceSaatis
                            where
                            t.numStatus == 0
                            &&
                            ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                            select new
                            {
                                t.numInvoiceSaatiCode
                            }).Count();
            string json = serializer.Serialize((object)cntCheck);
            context.Response.Write(json);
            context.Response.End();
        }
    }
    //----------------------------------------------------------------------
    //-----------------------پیش ثبت صورت حساب کلی حقوق ------------------
    //----------------------------------------------------------------------
    private void SavePreInvoice()
    {
        string personelcode = context.Request.Form["PersonelCodeTemp"];
        string ItemSearch = context.Request.Form["ItemSearch"];
        string[] arrayPesonelCode = personelcode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string month = ItemSearch.Split(',')[0];
        string Year = ItemSearch.Split(',')[1];
        int contractKind = Convert.ToInt32(ItemSearch.Split(',')[2]);
        int CheckKarkardonly = Convert.ToInt32(ItemSearch.Split(',')[3]);

        string DateFrom = Year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/01";
        string DateTo = Year.ToString() + "/12/30";

        int[] personelendcontract = (from t in office.ofcPersonels
                                     join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                                     where
                                         (t.numStatus == 1 || t.numStatus == 2)
                                         &&
                                         t1.numStatus == 1
                                         &&
                                        !((string.Compare(t1.dateEndContractDate, DateFrom) >= 0 && string.Compare(t1.dateEndContractDate, DateTo) <= 0))

                                     select t.numPersonelCode).ToArray();

        if (contractKind == 1 || contractKind == 3) // movaghat and projecti
        {
            int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoices
                                          join t9 in office.ofcPersonelMonthlyJobs on t8.numPersonelRef equals t9.numPersonelRef
                                          where
                                               (new int[] { 2 }).Contains((int)t8.numStatus)
                                               &&
                                               t8.strInvoiceMonth == month
                                               &&
                                               t8.strInvoiceYear == Year
                                               &&
                                               t9.numStatus == 0
                                          select t8.numPersonelRef).ToArray();
            int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoices
                                       where
                                            (new int[] { 0, 1, 2 }).Contains((int)t8.numStatus)
                                            &&
                                            t8.strInvoiceMonth == month
                                            &&
                                            t8.strInvoiceYear == Year
                                            &&
                                            !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                            &&
                                            CheckKarkardonly == 0
                                       select t8.numPersonelRef).ToArray();

            var q = (from t in office.ofcPersonels
                     join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                     join t2 in office.ofcPersonelMonthlyJobs on t1.numContractCode equals t2.numContractRef
                     join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                     from t5 in join_t5.DefaultIfEmpty()
                     join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                     where
                         arrayPesonelCode.Contains(t.numPersonelCode.ToString())
                         &&
                         t1.numStatus == 1
                         &&
                         t2.numStatus == 0
                         &&
                         (t2.numMonthJob == Convert.ToInt16(month))
                         &&
                         t2.numYear == Convert.ToInt16(Year)
                         &&
                         (t.numStatus == 2 || t.numStatus == 1)
                         &&
                         !
                         (numpersonelarray).Contains(t.numPersonelCode)
                         &&
                         !(personelendcontract).Contains(t.numPersonelCode)
                         &&
                         t1.numContractKindRef == contractKind
                     select new
                     {
                         numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                         cntchild = (office.ofcPersonelChildInfos.Where(c => c.numPersonelRef == t.numPersonelCode).Count()),
                         t2.strJobDays,
                         t2.strJobOverTime,
                         t2.strJobOverTimeSpecial,
                         t2.strJobOverTimeInMission,
                         numPersonelSalary = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelSalary, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                         numPersonelHomeSalary = CheckKarkardonly == 1 ? 0 : (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelHomeSalary, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                         numPersonelBon = CheckKarkardonly == 1 ? 0 : (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelBon, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                         ezafekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                         ezafekarVijeh = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeSpecial, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                         ezafekarInMission = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeInMission, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                         jomekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobFriday, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 2, (int)t1.numContractCode, 0),
                         tatilkar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 3, (int)t1.numContractCode, 0),

                         numPersonelChildSalary = CheckKarkardonly == 1 ? 0 : (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelChildSalary, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                         mamoriat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobMission, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 4, (int)t1.numContractCode, 0),
                         numPersonelPadash = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelPadash, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                         numPersonelSaier = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),

                         numPersonelSanavat = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelSanavat, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),

                         numPriceVamMontly = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 1),
                         numPriceMosaede = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                         takhir = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobDelay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 5, (int)t1.numContractCode, 0),
                         tajil = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobEarly, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 6, (int)t1.numContractCode, 0),
                         ghibat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobAbsent, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 7, (int)t1.numContractCode, 0),
                         jarimeMotefareghe = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                         strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                         strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                         t7.numWorkGroupCode,
                         numVamCode = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 2),
                         numMosaedeCode = EdariFunc.GetPriceMosaedeCode((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                         numPadashCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                         numJarimehCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                         khorojGhireMojaz = t2.strJobExit != null ? EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobExit, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 8, (int)t1.numContractCode, 0) : 0,
                         bimehKarmand = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkardBimeh((int)t.numPersonelCode, (int)(contractKind == 3 ? EdariFunc.GetPriceKarkard((int)(BimehProjectAndSaati), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode)) : EdariFunc.GetPriceKarkard((int)(t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode))), Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t1.numContractKindRef, t1.dateCutWorkDate, t1.dateStartContractDate),
                         MorakhasiBiHoghogh = EdariFunc.GetPriceMorakhasiBiHoghogh((int)((contractKind == 3 ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                         MorakhasiUniversal = EdariFunc.GetPriceMorakhasiUniversal((int)((contractKind == 3 ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                         t1.numContractKindRef,
                         t2.numContractRef,
                         t2.numMonthlyJobCode,
                         mandeHoghoghAzMaheGhabl = EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, "", 2, 0),
                         numPriceMoavaghe = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                         numMoavagheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                         kharid = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                         numkharidCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                         ayabzahab = CheckKarkardonly == 1 ? 0 : EdariFunc.GetAyabZahab((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                         haghmodiriat = CheckKarkardonly == 1 ? 0 : EdariFunc.GetHaghModiriat((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceHaghModiriat, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),

                         hazinejari = CheckKarkardonly == 1 ? 0 : EdariFunc.GetHazinehJari((int)t.numPersonelCode, (int)t1.numPriceJariAbogaz, (int)t1.numPriceJariEjareh, (int)t1.numPriceJariNet, (int)t1.numPriceJariTel, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                         porsanttozi = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantToziShode, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 1),
                         porsantkharejmahdode = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantKharejMahdode, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 2),
                         porsantmoadeli = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantMoadeli, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 3),

                         kosormotefareghe = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t2.numMonthJob, (int)t2.numYear, 0),
                         numkosormotefaregheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 5, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                         mah31roz = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t1.numPersonelSalary), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, (int)t1.numContractKindRef, 0, 1),
                         mah29roz = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t1.numPersonelSalary), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, (int)t1.numContractKindRef, 0, 2),
                         jarimehtakhir = EdariFunc.GetJarimehTakhir8Houer((int)t.numPersonelCode, t2.strJobDelay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 5, (int)t1.numContractCode, 0),
                         maliathoghogh = 0,
                         eidi = 0,
                         bimetakmili = 0,
                         bazkharid = 0,

                     });
            int hoghoghpaie = 0, hoghoghPaie2 = 0, khalespardakhti = 0, sumkosor = 0;
            int sumMandeHoghogh = 0;
            double maliatkarmand = 0, hoghogheBime = 0;
            foreach (var item in q)
            {
                #region start
                sumMandeHoghogh = 0;
                if (CheckKarkardonly == 0 && item.mandeHoghoghAzMaheGhabl != "0")
                {
                    sumMandeHoghogh = EdariFunc.GetPriceMandeHoghoghInSplit(item.mandeHoghoghAzMaheGhabl);
                }

                hoghoghpaie = Convert.ToInt32(item.numPersonelSalary) +
                              Convert.ToInt32(item.numPersonelHomeSalary) +
                              Convert.ToInt32(item.numPersonelBon);

                hoghoghPaie2 = Convert.ToInt32(hoghoghpaie) +
                               Convert.ToInt32(sumMandeHoghogh) +
                               Convert.ToInt32(item.ezafekarVijeh) +
                               Convert.ToInt32(item.ezafekarInMission) +
                               Convert.ToInt32(item.jomekar) +
                               Convert.ToInt32(item.ezafekar) +
                               Convert.ToInt32(item.tatilkar) +
                               Convert.ToInt32(item.ayabzahab) +
                               Convert.ToInt32(item.haghmodiriat) +
                               Convert.ToInt32(item.hazinejari) +
                               Convert.ToInt32(item.porsanttozi) +
                               Convert.ToInt32(item.porsantkharejmahdode) +
                               Convert.ToInt32(item.porsantmoadeli) +
                               Convert.ToInt32(item.bazkharid) +
                               Convert.ToInt32(item.mah31roz) +
                               Convert.ToInt32(item.numPersonelChildSalary) +
                               Convert.ToInt32(item.mamoriat) +
                               Convert.ToInt32(item.numPersonelPadash) +
                               Convert.ToInt32(item.numPriceMoavaghe) +
                               Convert.ToInt32(item.numPersonelSaier) +
                               Convert.ToInt32(item.eidi) +
                               Convert.ToInt32(item.numPersonelSanavat);

                // maliatkarmand = hoghoghPaie2 > 11500000 ? hoghoghPaie2 * 0.1 : 0;
                // maliatkarmand = 0;
                hoghogheBime = item.bimehKarmand;//Convert.ToInt32(item.numPersonelSalary + item.numPersonelHomeSalary + item.numPersonelBon);
                hoghogheBime = (hoghogheBime * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1);

                sumkosor = Convert.ToInt32(Convert.ToInt32(Math.Round(hoghogheBime)) + item.bimetakmili +
                       item.numPriceVamMontly + item.jarimehtakhir + item.numPriceMosaede + item.takhir + item.tajil +
                       item.ghibat + item.jarimeMotefareghe + Convert.ToInt32(item.khorojGhireMojaz) +
                       Convert.ToInt32(item.MorakhasiBiHoghogh) + Convert.ToInt32(item.MorakhasiUniversal) + item.kharid +
                       item.kosormotefareghe + item.maliathoghogh + item.mah29roz);

                khalespardakhti = hoghoghPaie2 - sumkosor;


                office.ofcPersonelPreInvoices.InsertOnSubmit(new ofcPersonelPreInvoice
                {
                    numPersonelRef = item.numPersonelCode,
                    numCntChild = item.cntchild,
                    strJobDays = item.strJobDays,
                    strJobOverTime = item.strJobOverTime,
                    strJobOverTimeSpecial = item.strJobOverTimeSpecial,
                    strJobOverTimeInMission = item.strJobOverTimeInMission,
                    numPersonelSalary = item.numPersonelSalary,
                    numPersonelHomeSalary = item.numPersonelHomeSalary,
                    numPersonelBon = item.numPersonelBon,
                    numPriceEzafeKar = item.ezafekar,
                    numPriceEzafeKarVijeh = item.ezafekarVijeh,
                    numPriceEzafeKarInMission = item.ezafekarInMission,
                    numPriceJomeKar = item.jomekar,
                    numPriceTatilKar = item.tatilkar,
                    #endregion
                    numPriceCalcHoghogh1 = hoghoghpaie,
                    numPersonelChildSalary = item.numPersonelChildSalary,
                    numPriceMamoriat = item.mamoriat,
                    numPersonelPadash = item.numPersonelPadash,
                    numPersonelPadashSaier = item.numPersonelSaier,
                    numPersonelSanavat = item.numPersonelSanavat,
                    numPriceCalcHoghogh2 = hoghoghPaie2,
                    numPricePersonelBimeh = Convert.ToInt32(hoghogheBime),
                    numPriceBimeTakmili = item.bimetakmili,
                    numPriceVamMontly = item.numPriceVamMontly,
                    numPriceMosaede = item.numPriceMosaede,
                    numPriceTakhir = item.takhir,
                    numPriceTajil = item.tajil,
                    numPriceGhibat = item.ghibat,
                    numPriceJarimeMotefareghe = item.jarimeMotefareghe,
                    numPriceCalcHoghoghKhales = khalespardakhti,
                    strBankAccount = item.strBankAccount,
                    numWorkGroupCode = item.numWorkGroupCode,
                    strInvoiceMonth = month,
                    strInvoiceYear = Year,
                    dateRegisterDate = _PDate.PersianDate,
                    strRegisterUserRef = _ofcUser.strUserCode,
                    numStatus = 0,
                    strVamRef = item.numVamCode.ToString(),
                    strMosaedeRef = CheckKarkardonly == 1 ? "0" : item.numMosaedeCode,
                    strJarimehRef = CheckKarkardonly == 1 ? "0" : item.numJarimehCode,
                    strPadashRef = CheckKarkardonly == 1 ? "0" : item.numPadashCode,
                    numPriceKhorojGhireMojaz = item.khorojGhireMojaz,
                    numPriceMorakhasiBiHoghogh = Convert.ToInt32(item.MorakhasiBiHoghogh),
                    numPriceCalcKosorat = sumkosor,
                    numPriceMorakhasiUni = Convert.ToInt32(item.MorakhasiUniversal),
                    numContractKindRef = item.numContractKindRef,
                    numContractRef = item.numContractRef,
                    numMonthlyJobRef = item.numMonthlyJobCode,
                    strBankName = item.strBankName,
                    strMandeAzMaheGhablTafkiki = CheckKarkardonly == 1 ? "0" : item.mandeHoghoghAzMaheGhabl,
                    numPriceMoavaghe = item.numPriceMoavaghe,
                    strMoavagheRef = CheckKarkardonly == 1 ? "0" : item.numMoavagheCode,
                    numPriceSaier = 0,
                    numPriceBuyCo = item.kharid,
                    strBuyCoRef = CheckKarkardonly == 1 ? "0" : item.numkharidCode,
                    strDescSaier = "",

                    numPriceGhoboz = item.hazinejari,
                    numPriceKosorMotefareghe = item.kosormotefareghe,
                    strKosorMotefaregheRef = CheckKarkardonly == 1 ? "0" : item.numkosormotefaregheCode,

                    numPriceMonth29 = item.mah29roz,
                    numPriceMonth31 = item.mah31roz,
                    numPricePorsantKharjMahdode = item.porsantkharejmahdode,
                    numPricePorsantTozi = item.porsanttozi,
                    numPricePrintMoadeli = item.porsantmoadeli,

                    numPriceAyabzahab = item.ayabzahab,
                    numPriceHaghModiriat = item.haghmodiriat,
                    numPriceEidi = Convert.ToInt32(item.eidi),
                    numPricePersonelMaliat = Convert.ToInt32(maliatkarmand),
                    numPriceReBuyLeave = item.bazkharid,
                    numPriceJarimehTakhir8Saat = item.jarimehtakhir,
                    numIsKarakardPriceOnly = Convert.ToByte(CheckKarkardonly)

                });

                var montlyjobDeactive = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == item.numPersonelCode && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(Year) && c.numStatus == 0).FirstOrDefault();
                if (montlyjobDeactive != null)
                {
                    montlyjobDeactive.numStatus = 1;
                }
            }
            string json = "";
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
        else if (contractKind == 2) //saati
        {
            int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                          join t9 in office.ofcPersonelMonthlyJobSaatis on t8.numPersonelRef equals t9.numPersonelRef
                                          where
                                               (new int[] { 2 }).Contains((int)t8.numStatus)
                                               &&
                                               t8.strInvoiceMonth == month
                                               &&
                                               t8.strInvoiceYear == Year
                                               &&
                                               t9.numStatus == 0
                                          select t8.numPersonelRef).ToArray();


            int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                       where
                                            (new int[] { 0, 1, 2 }).Contains((int)t8.numStatus)
                                            &&
                                            t8.strInvoiceMonth == month
                                            &&
                                            t8.strInvoiceYear == Year
                                            &&
                                            !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                            &&
                                            CheckKarkardonly == 0
                                       select t8.numPersonelRef).ToArray();
            var q = (from t in office.ofcPersonels
                     join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                     join t2 in office.ofcPersonelMonthlyJobSaatis on t1.numContractCode equals t2.numContractRef
                     join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                     from t5 in join_t5.DefaultIfEmpty()
                     join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                     where
                         arrayPesonelCode.Contains(t.numPersonelCode.ToString())
                          &&
                          t1.numStatus == 1
                          &&
                          t2.numStatus == 0
                          &&
                          t1.numContractKindRef == contractKind
                          &&
                          (t2.numMonthJob == Convert.ToInt16(month))
                          &&
                          t2.numYear == Convert.ToInt16(Year)
                          &&
                          (t.numStatus == 2 || t.numStatus == 1)
                          &&
                          !
                          (numpersonelarray).Contains(t.numPersonelCode)
                           &&
                         !(personelendcontract).Contains(t.numPersonelCode)
                     select new
                     {
                         PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                         numPersonelCode = t.numPersonelCode,
                         strJobTime = t2.strJobTime,
                         numPersonelSalary1 = CheckKarkardonly == 1 ? 0 : t1.numPersonelSalary,
                         numPersonelSalary = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkardSaati(t2.strJobTime, (int)t1.numPersonelSalary, 1),
                         numPersonelSaier = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                         bimehKarmand = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkardBimeh((int)t.numPersonelCode, EdariFunc.GetPriceKarkard((int)(BimehProjectAndSaati), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode)), (int)t2.numYear, (int)t2.numMonthJob, (int)t1.numContractKindRef, t1.dateCutWorkDate, t1.dateStartContractDate),
                         bimetakmili = 0,
                         numPriceVamMontly = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 1),
                         numPriceMosaede = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                         jarimeMotefareghe = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                         strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                         strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                         strWorkGroupName = t7.strWorkGroupName,
                         numWorkGroupCode = t7.numWorkGroupCode,
                         numVamCode = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 2),
                         numMosaedeCode = EdariFunc.GetPriceMosaedeCode((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                         numPadashCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                         numJarimehCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                         numContractKindRef = t1.numContractKindRef,
                         numContractRef = t2.numContractRef,
                         numMonthlyJobSaatiCode = t2.numMonthlyJobSaatiCode,
                         mandeHoghoghAzMaheGhabl = EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, "", 2, 0),
                         numPriceMoavaghe = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                         numMoavagheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                         kharid = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                         numkharidCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                         ayabzahab = CheckKarkardonly == 1 ? 0 : EdariFunc.GetAyabZahab((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                         kosormotefareghe = CheckKarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t2.numMonthJob, (int)t2.numYear, 0),
                         numkosormotefaregheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 5, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                         maliathoghogh = 0,
                     });
            int hoghoghpaie = 0, khalespardakhti = 0, sumkosor = 0, sumMandeHoghogh = 0;
            double maliatkarmand = 0, hoghogheBime = 0;
            foreach (var item in q)
            {
                sumMandeHoghogh = 0;
                if (CheckKarkardonly == 0 && item.mandeHoghoghAzMaheGhabl != "0")
                {
                    sumMandeHoghogh = EdariFunc.GetPriceMandeHoghoghInSplit(item.mandeHoghoghAzMaheGhabl);

                }
                hoghoghpaie = Convert.ToInt32(item.numPersonelSalary) +
                              Convert.ToInt32(item.numPersonelSaier) +
                              Convert.ToInt32(sumMandeHoghogh) +
                              Convert.ToInt32(item.numPriceMoavaghe) +
                              Convert.ToInt32(item.ayabzahab);
                // maliatkarmand = hoghoghPaie2 > 11500000 ? hoghoghPaie2 * 0.1 : 0;
                maliatkarmand = 0;
                hoghogheBime = item.bimehKarmand;//Convert.ToInt32(item.numPersonelSalary + item.numPersonelHomeSalary + item.numPersonelBon);
                hoghogheBime = (hoghogheBime * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1);

                sumkosor = Convert.ToInt32(Math.Round(hoghogheBime)) +
                           Convert.ToInt32(item.bimetakmili) +
                           Convert.ToInt32(item.numPriceVamMontly) +
                           Convert.ToInt32(item.numPriceMosaede) +
                           Convert.ToInt32(item.jarimeMotefareghe) +
                           Convert.ToInt32(item.kharid) +
                           Convert.ToInt32(item.kosormotefareghe) +
                           Convert.ToInt32(item.maliathoghogh);

                khalespardakhti = hoghoghpaie - sumkosor;

                office.ofcPersonelPreInvoiceSaatis.InsertOnSubmit(new ofcPersonelPreInvoiceSaati
                {
                    numPersonelRef = item.numPersonelCode,
                    strJobTime = item.strJobTime,
                    numPriceSaati = item.numPersonelSalary1,
                    numPersonelSalary = item.numPersonelSalary,
                    numPriceCalcHoghogh1 = hoghoghpaie,
                    numPersonelPadashSaier = item.numPersonelSaier,
                    numPricePersonelMaliat = Convert.ToInt32(maliatkarmand),
                    numPricePersonelBimeh = Convert.ToInt32(hoghogheBime),
                    numPriceBimeTakmili = item.bimetakmili,
                    numPriceVamMontly = item.numPriceVamMontly,
                    numPriceMosaede = item.numPriceMosaede,
                    numPriceJarimeMotefareghe = item.jarimeMotefareghe,
                    numPriceCalcHoghoghKhales = khalespardakhti,
                    strBankAccount = item.strBankAccount,
                    numWorkGroupCode = item.numWorkGroupCode,
                    strInvoiceMonth = month,
                    strInvoiceYear = Year,
                    dateRegisterDate = _PDate.PersianDate,
                    strRegisterUserRef = _ofcUser.strUserCode,
                    numStatus = 0,
                    strVamRef = item.numVamCode.ToString(),
                    strMosaedeRef = CheckKarkardonly == 1 ? "0" : item.numMosaedeCode,
                    strJarimehRef = CheckKarkardonly == 1 ? "0" : item.numJarimehCode,
                    strPadashRef = CheckKarkardonly == 1 ? "0" : item.numPadashCode,
                    numPriceCalcKosorat = sumkosor,
                    numContractKindRef = item.numContractKindRef,
                    numContractRef = item.numContractRef,
                    numMonthlyJobSaatiRef = item.numMonthlyJobSaatiCode,
                    strBankName = item.strBankName,
                    strMandeAzMaheGhablTafkiki = CheckKarkardonly == 1 ? "0" : item.mandeHoghoghAzMaheGhabl,
                    numPriceMoavaghe = item.numPriceMoavaghe,
                    strMoavagheRef = CheckKarkardonly == 1 ? "0" : item.numMoavagheCode,
                    numPriceSaier = 0,
                    numPriceEidi = 0,
                    strDescSaier = "",
                    numPriceBuyCo = item.kharid,
                    strBuyCoRef = CheckKarkardonly == 1 ? "0" : item.numkharidCode,
                    numPriceReBuyLeave = 0,

                    numPriceAyabzahab = item.ayabzahab,
                    numPriceKosorMotefareghe = item.kosormotefareghe,
                    strKosorMotefaregheRef = CheckKarkardonly == 1 ? "0" : item.numkosormotefaregheCode,
                    numIsKarakardPriceOnly = Convert.ToByte(CheckKarkardonly)
                });

                var montlyjobDeactive = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == item.numPersonelCode && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(Year) && c.numStatus == 0).FirstOrDefault();
                if (montlyjobDeactive != null)
                {
                    montlyjobDeactive.numStatus = 1;
                }
            }
            string json = "";
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
    }
    //----------------------------------------------------------------------
    //-----------------------گزارش پیش ثبت صورت حساب کلی حقوق------------
    //----------------------------------------------------------------------
    private void GetReportpreInvoice()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        // int year = Convert.ToInt32(context.Request.Form["year"]);

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
        if (contractkindCheck == "1" || contractkindCheck == "3") // movaghat and Project
        {
            var q = (from t in office.ofcPersonelPreInvoices
                     join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                     join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                     join t3 in office.ofcPersonelBankInfos on t.numPersonelRef equals t3.numPersonelRef into join_t3
                     from t3 in join_t3.DefaultIfEmpty()
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
                           (t.strInvoiceMonth == month.ToString() || month == -1)
                           //  &&
                           //  t.strInvoiceYear == year.ToString()
                           &&
                           ((grohkariRoomArray).Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                           &&
                           t.numStatus == 0
                           &&
                           ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                     select new
                     {
                         PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                         numPersonelCode = Convert.ToInt32(t2.numPersonelCode),
                         cntchild = t.numCntChild,
                         t.strJobDays,
                         t.strJobOverTime,
                         t.strJobOverTimeSpecial,
                         t.strJobOverTimeInMission,
                         t.numPersonelSalary,
                         t.numPersonelHomeSalary,
                         t.numPersonelBon,
                         ezafekar = t.numPriceEzafeKar,
                         ezafekarvijeh = t.numPriceEzafeKarVijeh,
                         ezafekarInMission = t.numPriceEzafeKarInMission,
                         jomekar = t.numPriceJomeKar,
                         tatilkar = t.numPriceTatilKar,
                         ayabzahab = t.numPriceAyabzahab,
                         haghmodiriat = t.numPriceHaghModiriat,
                         t.numPersonelChildSalary,
                         mamoriat = t.numPriceMamoriat,
                         t.numPersonelPadash,
                         numPersonelSaier = t.numPersonelPadashSaier,
                         eidi = t.numPriceEidi,
                         t.numPersonelSanavat,
                         bimetakmili = t.numPriceBimeTakmili,
                         t.numPriceVamMontly,
                         t.numPriceMosaede,
                         takhir = t.numPriceTakhir,
                         tajil = t.numPriceTajil,
                         ghibat = t.numPriceGhibat,
                         jarimeMotefareghe = t.numPriceJarimeMotefareghe,
                         t.strBankAccount,
                         t1.strWorkGroupName,
                         t.numPriceCalcHoghogh1,
                         t.numPriceCalcHoghogh2,
                         t.numPriceCalcHoghoghKhales,
                         t.numPricePersonelBimeh,
                         t.numPriceKhorojGhireMojaz,
                         t.numPriceCalcKosorat,
                         t.numPriceMorakhasiBiHoghogh,
                         t.numPriceMorakhasiUni,
                         t.numInvoiceCode,
                         strInvoiceMonth = EdariFunc.GetMonthName(t.strInvoiceMonth),
                         strmonth = t.strInvoiceMonth,
                         t.strInvoiceYear,
                         t.strBankName,
                         strMandeAzMaheGhablTafkiki = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki),
                         t.numPriceMoavaghe,
                         strShebaBank = (t3.strShebaBank != null || t3.strShebaBank != "") ? t3.strShebaBank : "-",
                         t.numPriceBuyCo,

                         t.numPriceHaghModiriat,
                         t.numPriceAyabzahab,
                         t.numPriceGhoboz,
                         t.numPricePorsantTozi,
                         t.numPricePorsantKharjMahdode,
                         t.numPricePrintMoadeli,
                         t.numPriceMonth31,

                         t.numPriceKosorMotefareghe,
                         t.numPriceJarimehTakhir8Saat,
                         t.numPriceMonth29,
                         t.numPricePersonelMaliat,
                         numPriceBazkharidMorakhasi = t.numPriceReBuyLeave

                     }).ToList();


            string json = serializer.Serialize((object)q.OrderBy(c => c.numPersonelCode).ThenBy(c => c.strInvoiceYear).ThenBy(c => c.strmonth));
            context.Response.Write(json);
            context.Response.End();
        }
        else if (contractkindCheck == "2") //saati
        {
            var q = (from t in office.ofcPersonelPreInvoiceSaatis
                     join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                     join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                     join t3 in office.ofcPersonelBankInfos on t.numPersonelRef equals t3.numPersonelRef into join_t3
                     from t3 in join_t3.DefaultIfEmpty()
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
                           (t.strInvoiceMonth == month.ToString() || month == -1)
                           // &&
                           //  t.strInvoiceYear == year.ToString()
                           &&
                           ((grohkariRoomArray).Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                           &&
                           t.numStatus == 0
                           &&
                           ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")

                     select new
                     {
                         PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                         t2.numPersonelCode,
                         t.strJobTime,
                         t.numPriceSaati,
                         t.numPersonelSalary,
                         numPersonelSaier = t.numPersonelPadashSaier,
                         bimetakmili = t.numPriceBimeTakmili,
                         t.numPriceVamMontly,
                         t.numPriceMosaede,
                         jarimeMotefareghe = t.numPriceJarimeMotefareghe,
                         t.strBankAccount,
                         t1.strWorkGroupName,
                         t.numPriceCalcHoghogh1,
                         t.numPriceCalcHoghoghKhales,

                         t.numPricePersonelBimeh,
                         t.numPriceCalcKosorat,
                         t.numInvoiceSaatiCode,
                         strInvoiceMonth = EdariFunc.GetMonthName(t.strInvoiceMonth),
                         strmonth = t.strInvoiceMonth,
                         t.strInvoiceYear,
                         t.strBankName,
                         strMandeAzMaheGhablTafkiki = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki),
                         t.numPriceMoavaghe,
                         strShebaBank = (t3.strShebaBank != null || t3.strShebaBank != "") ? t3.strShebaBank : "-",
                         t.numPriceBuyCo,

                         t.numPricePersonelMaliat,
                         t.numPriceKosorMotefareghe,
                         t.numPriceAyabzahab,

                     }).ToList();


            string json = serializer.Serialize((object)q.OrderBy(c => c.numPersonelCode).ThenBy(c => c.strInvoiceYear).ThenBy(c => c.strmonth));
            context.Response.Write(json);
            context.Response.End();
        }
    }
    //----------------------------------------------------------------------
    //-----------------------ثبت نهایی صورت حساب کلی حقوق ----------------
    //----------------------------------------------------------------------
    private void SaveFinalInvoice()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string ContractKind = context.Request.Form["ContractKindPublic"];

        string[] invoiceCodearray = InvoiceCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        int checktasvieh = 0, month = 0, year = 0;
        if (ContractKind == "1" || ContractKind == "3") // movaghat and project
        {
            var preInvoice = office.ofcPersonelPreInvoices.Where(c => c.numStatus == 0 && invoiceCodearray.Contains(c.numInvoiceCode.ToString()));
            int sumVam = 0;
            foreach (var item in preInvoice)
            {
                item.numStatus = 1;
                item.dateVarizDate = _PDate.PersianDate;
                sumVam = 0; checktasvieh = 0;
                if (item.strMandeAzMaheGhablTafkiki != "0")
                {
                    if (Convert.ToInt32(item.strInvoiceMonth) == 1)
                    {
                        month = 12;
                        year = Convert.ToInt32(item.strInvoiceYear) - 1;
                    }
                    else
                    {
                        year = Convert.ToInt32(item.strInvoiceYear);
                        month = Convert.ToInt32(item.strInvoiceMonth) - 1;
                    }
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                    var VamCheck = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(item.strVamRef) && c.numStatus == 0 && c.numPersonelRef == item.numPersonelRef).FirstOrDefault();
                    if (VamCheck != null)
                    {
                        var SumVamVarizi = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == item.numPersonelRef && c.numVamRef == Convert.ToInt32(item.strVamRef));

                        sumVam = Convert.ToInt32(SumVamVarizi.Sum(c => c.numPriceGhestVam));
                        sumVam = sumVam + Convert.ToInt32(item.numPriceVamMontly);

                        if (sumVam >= Convert.ToInt32(VamCheck.numPriceVam))
                        {
                            checktasvieh = 1;
                            VamCheck.numStatus = 1; // tasvieh shode
                            VamCheck.dateTasviehDate = _PDate.PersianDate;
                        }

                        office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                        {
                            numPersonelRef = item.numPersonelRef,
                            numVamRef = Convert.ToInt32(item.strVamRef),
                            dateRegisterDate = _PDate.PersianDate,
                            numPriceGhestVam = Convert.ToInt32(item.numPriceVamMontly),
                            strRegisterUserRef = _ofcUser.strUserCode
                        });
                    }
                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                    var checkMosaede = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == item.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year));
                    if (checkMosaede.Any())
                    {
                        foreach (var itemmosaede in checkMosaede)
                        {
                            itemmosaede.numStatus = 1; // tasvieh shode
                            itemmosaede.dateTasviehDate = _PDate.PersianDate;
                        }
                    }
                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                    var checkPadash1 = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == item.numPersonelRef && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && c.numStatus == 0);// kasr / ezafe be hoghogh
                    if (checkPadash1.Any())
                    {
                        foreach (var itemPadash in checkPadash1)
                        {
                            itemPadash.numStatus = 1; // tasvieh shode
                            itemPadash.dateTasviehDate = _PDate.PersianDate;
                        }
                    }


                    try { office.SubmitChanges(); } catch { }

                }
                //*******************************************************************************
                if (item.numPriceVamMontly > 0)
                {
                    if (checktasvieh == 0)
                    {
                        var VamCheck1 = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(item.strVamRef) && c.numStatus == 0 && c.numPersonelRef == item.numPersonelRef).FirstOrDefault();
                        if (VamCheck1 != null)
                        {
                            var SumVamVarizi1 = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == item.numPersonelRef && c.numVamRef == Convert.ToInt32(item.strVamRef));
                            sumVam = Convert.ToInt32(SumVamVarizi1.Sum(c => c.numPriceGhestVam));
                            sumVam = sumVam + Convert.ToInt32(item.numPriceVamMontly);
                            if (sumVam >= Convert.ToInt32(VamCheck1.numPriceVam))
                            {
                                VamCheck1.numStatus = 1; // tasvieh shode
                                VamCheck1.dateTasviehDate = _PDate.PersianDate;
                            }
                            office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                            {
                                numPersonelRef = item.numPersonelRef,
                                numVamRef = Convert.ToInt32(item.strVamRef),
                                dateRegisterDate = _PDate.PersianDate,
                                numPriceGhestVam = item.numPriceVamMontly,
                                strRegisterUserRef = _ofcUser.strUserCode
                            });
                        }
                    }
                }

                //*******************************************************************************

                if (item.numPriceMosaede > 0)
                {
                    var checkMosaede1 = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == item.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt16(item.strInvoiceMonth) && c.numYear == Convert.ToInt16(item.strInvoiceYear));
                    if (checkMosaede1.Any())
                    {
                        foreach (var itemmosaede in checkMosaede1)
                        {
                            itemmosaede.numStatus = 1; // tasvieh shode
                            itemmosaede.dateTasviehDate = _PDate.PersianDate;
                        }
                    }

                }

                //*******************************************************************************
                var checkPadash = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == item.numPersonelRef && c.numMonth == Convert.ToInt16(item.strInvoiceMonth) && c.numYear == Convert.ToInt16(item.strInvoiceYear) && c.numStatus == 0);// kasr / ezafe be hoghogh
                if (checkPadash.Any())
                {
                    foreach (var itemPadash in checkPadash)
                    {
                        itemPadash.numStatus = 1; // tasvieh shode
                        itemPadash.dateTasviehDate = _PDate.PersianDate;
                    }
                }
                //*******************************************************************************
                var qleave = office.ofcPersonelLeaves.Where(c => c.numPersonelRef == item.numPersonelRef && c.numMonth == Convert.ToInt16(item.strInvoiceMonth) && c.numYear == Convert.ToInt16(item.strInvoiceYear) && (c.numStatus == 2 || c.numStatus == 1));
                if (qleave.Any())
                {
                    foreach (var itemleave in qleave)
                    {
                        itemleave.numStatus = 3;
                    }

                }

                var checkFaraiand = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == item.numPersonelRef && c.numStatus == 0 && c.numMonthJob == Convert.ToInt16(item.strInvoiceMonth) && c.numYear == Convert.ToInt16(item.strInvoiceYear));
                if (checkFaraiand.Any())
                {
                    foreach (var itemFaraiand in checkFaraiand)
                    {
                        itemFaraiand.numStatus = 1; // ok shod
                    }
                }
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
        else if (ContractKind == "2") // saati
        {
            var preInvoiceSaati = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numStatus == 0 && invoiceCodearray.Contains(c.numInvoiceSaatiCode.ToString()));
            int sumVam = 0;
            foreach (var item in preInvoiceSaati)
            {
                item.numStatus = 1;
                item.dateVarizDate = _PDate.PersianDate;
                sumVam = 0;
                checktasvieh = 0;
                if (item.strMandeAzMaheGhablTafkiki != "0")
                {
                    if (Convert.ToInt32(item.strInvoiceMonth) == 1)
                    {
                        month = 12;
                        year = Convert.ToInt32(item.strInvoiceYear) - 1;
                    }
                    else
                    {
                        year = Convert.ToInt32(item.strInvoiceYear);
                        month = Convert.ToInt32(item.strInvoiceMonth) - 1;
                    }
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                    var VamCheck = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(item.strVamRef) && c.numStatus == 0 && c.numPersonelRef == item.numPersonelRef).FirstOrDefault();
                    if (VamCheck != null)
                    {
                        var SumVamVarizi = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == item.numPersonelRef && c.numVamRef == Convert.ToInt32(item.strVamRef));

                        sumVam = Convert.ToInt32(SumVamVarizi.Sum(c => c.numPriceGhestVam));
                        sumVam = sumVam + Convert.ToInt32(item.numPriceVamMontly);

                        if (sumVam >= Convert.ToInt32(VamCheck.numPriceVam))
                        {
                            checktasvieh = 1;
                            VamCheck.numStatus = 1; // tasvieh shode
                            VamCheck.dateTasviehDate = _PDate.PersianDate;
                        }

                        office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                        {
                            numPersonelRef = item.numPersonelRef,
                            numVamRef = Convert.ToInt32(item.strVamRef),
                            dateRegisterDate = _PDate.PersianDate,
                            numPriceGhestVam = Convert.ToInt32(item.numPriceVamMontly),
                            strRegisterUserRef = _ofcUser.strUserCode
                        });
                    }
                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    var checkMosaede = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == item.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year));
                    if (checkMosaede.Any())
                    {
                        foreach (var itemmosaede in checkMosaede)
                        {
                            itemmosaede.numStatus = 1; // tasvieh shode
                            itemmosaede.dateTasviehDate = _PDate.PersianDate;
                        }
                    }
                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    var checkPadash1 = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == item.numPersonelRef && c.numMonth == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(year) && c.numStatus == 0);// kasr / ezafe be hoghogh
                    if (checkPadash1.Any())
                    {
                        foreach (var itemPadash in checkPadash1)
                        {
                            itemPadash.numStatus = 1; // tasvieh shode
                            itemPadash.dateTasviehDate = _PDate.PersianDate;
                        }
                    }


                    try { office.SubmitChanges(); } catch { }

                }
                //*******************************************************************************
                //*******************************************************************************
                if (item.numPriceVamMontly > 0)
                {
                    if (checktasvieh == 0)
                    {
                        var VamCheck1 = office.ofcPersonelVams.Where(c => c.numVamCode == Convert.ToInt32(item.strVamRef) && c.numStatus == 0 && c.numPersonelRef == item.numPersonelRef).FirstOrDefault();
                        var SumVamVarizi1 = office.ofcPersonelTasviehVams.Where(c => c.numPersonelRef == item.numPersonelRef && c.numVamRef == Convert.ToInt32(item.strVamRef));
                        sumVam = Convert.ToInt32(SumVamVarizi1.Sum(c => c.numPriceGhestVam));
                        sumVam = sumVam + Convert.ToInt32(item.numPriceVamMontly);
                        if (sumVam >= Convert.ToInt32(VamCheck1.numPriceVam))
                        {
                            VamCheck1.numStatus = 1; // tasvieh shode
                            VamCheck1.dateTasviehDate = _PDate.PersianDate;
                        }
                        office.ofcPersonelTasviehVams.InsertOnSubmit(new ofcPersonelTasviehVam
                        {
                            numPersonelRef = item.numPersonelRef,
                            numVamRef = Convert.ToInt32(item.strVamRef),
                            dateRegisterDate = _PDate.PersianDate,
                            numPriceGhestVam = item.numPriceVamMontly,
                            strRegisterUserRef = _ofcUser.strUserCode
                        });
                    }
                }

                //*******************************************************************************

                if (item.numPriceMosaede > 0)
                {
                    var checkMosaede1 = office.ofcPersonelMosaedes.Where(c => c.numPersonelRef == item.numPersonelRef && c.numStatus == 0 && c.numMonth == Convert.ToInt16(item.strInvoiceMonth) && c.numYear == Convert.ToInt16(item.strInvoiceYear));
                    if (checkMosaede1.Any())
                    {
                        foreach (var itemmosaede in checkMosaede1)
                        {
                            itemmosaede.numStatus = 1; // tasvieh shode
                            itemmosaede.dateTasviehDate = _PDate.PersianDate;
                        }
                    }

                }

                //*******************************************************************************
                var checkPadash = office.ofcPersonelPadashAndJarimehs.Where(c => c.numPersonelRef == item.numPersonelRef && c.numMonth == Convert.ToInt16(item.strInvoiceMonth) && c.numYear == Convert.ToInt16(item.strInvoiceYear) && c.numStatus == 0);// kasr / ezafe be hoghogh
                if (checkPadash.Any())
                {
                    foreach (var itemPadash in checkPadash)
                    {
                        itemPadash.numStatus = 1; // tasvieh shode
                        itemPadash.dateTasviehDate = _PDate.PersianDate;
                    }
                }
                //*******************************************************************************
            }
            //==============================================================================
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
    }
    //----------------------------------------------------------------------
    //---------------گزارش سابقه واریز صورت حساب کلی حقوق----------------
    //----------------------------------------------------------------------
    private void GetRepotFinalVarizInvoice()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
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
        if (contractkindCheck == "1" || contractkindCheck == "3") // movaghat and project
        {
            var q = (from t in office.ofcPersonelPreInvoices
                     join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                     join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                     join t3 in office.ofcPersonelBankInfos on t.numPersonelRef equals t3.numPersonelRef into join_t3
                     from t3 in join_t3.DefaultIfEmpty()
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
                           (t.strInvoiceMonth == month.ToString() || month == -1)
                           &&
                           t.strInvoiceYear == year.ToString()
                           &&
                           (grohkariRoomArray.Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                           &&
                           (t.numStatus == 1 || t.numStatus == 2 || t.numStatus == 3)
                           &&
                           (contractkindArray.Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                     select new
                     {
                         PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                         numPersonelCode = Convert.ToInt32(t2.numPersonelCode),
                         cntchild = t.numCntChild,
                         t.strJobDays,
                         t.strJobOverTime,
                         t.strJobOverTimeSpecial,
                         t.strJobOverTimeInMission,
                         t.numPersonelSalary,
                         t.numPersonelHomeSalary,
                         t.numPersonelBon,
                         ezafekar = t.numPriceEzafeKar,
                         ezafekarVijeh = t.numPriceEzafeKarVijeh,
                         ezafekarInMission = t.numPriceEzafeKarInMission,
                         jomekar = t.numPriceJomeKar,
                         tatilkar = t.numPriceTatilKar,
                         ayabzahab = t.numPriceAyabzahab,
                         haghmodiriat = t.numPriceHaghModiriat,
                         t.numPersonelChildSalary,
                         mamoriat = t.numPriceMamoriat,
                         t.numPersonelPadash,
                         numPersonelSaier = t.numPersonelPadashSaier,
                         eidi = t.numPriceEidi,
                         t.numPersonelSanavat,
                         bimetakmili = t.numPriceBimeTakmili,
                         t.numPriceVamMontly,
                         t.numPriceMosaede,
                         takhir = t.numPriceTakhir,
                         tajil = t.numPriceTajil,
                         ghibat = t.numPriceGhibat,
                         jarimeMotefareghe = t.numPriceJarimeMotefareghe,
                         t.strBankAccount,
                         t1.strWorkGroupName,
                         t.numPriceCalcHoghogh1,
                         t.numPriceCalcHoghogh2,
                         t.numPriceCalcHoghoghKhales,
                         t.numPricePersonelBimeh,
                         t.numPriceKhorojGhireMojaz,
                         t.numInvoiceCode,
                         t.numStatus,
                         t.dateVarizDate,
                         t.numPriceCalcKosorat,
                         t.numPriceMorakhasiBiHoghogh,
                         t.numPriceMorakhasiUni,
                         strInvoiceMonth = EdariFunc.GetMonthName(t.strInvoiceMonth),
                         t.strInvoiceYear,
                         t.strBankName,
                         strMandeAzMaheGhablTafkiki = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki),
                         t.numPriceMoavaghe,
                         strShebaBank = (t3.strShebaBank != null || t3.strShebaBank != "") ? t3.strShebaBank : "-",
                         t.numPriceBuyCo,

                         t.numPriceHaghModiriat,
                         t.numPriceAyabzahab,
                         t.numPriceGhoboz,
                         t.numPricePorsantTozi,
                         t.numPricePorsantKharjMahdode,
                         t.numPricePrintMoadeli,
                         t.numPriceMonth31,

                         t.numPriceKosorMotefareghe,
                         t.numPriceJarimehTakhir8Saat,
                         t.numPriceMonth29,
                         t.numPricePersonelMaliat,
                         numPriceBazkharidMorakhasi = t.numPriceReBuyLeave
                     });


            int take = page * perpage;
            int skip = page == 1 ? 0 : take - perpage;
            int AllRecrdCount = q.Count();
            var query = q.OrderBy(o => o.dateVarizDate).ThenBy(c => c.numInvoiceCode).Take(take).Skip(skip);
            string json = serializer.Serialize((object)query);
            string bothJson = "[" + json + "," + AllRecrdCount + "]";
            context.Response.Write(bothJson);
            context.Response.End();
        }
        else if (contractkindCheck == "2") //saati
        {
            var q = (from t in office.ofcPersonelPreInvoiceSaatis
                     join t1 in office.ofcBWorkGroups on t.numWorkGroupCode equals t1.numWorkGroupCode
                     join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                     join t3 in office.ofcPersonelBankInfos on t.numPersonelRef equals t3.numPersonelRef into join_t3
                     from t3 in join_t3.DefaultIfEmpty()
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
                           (t.strInvoiceMonth == month.ToString() || month == -1)
                           &&
                           t.strInvoiceYear == year.ToString()
                           &&
                           ((grohkariRoomArray).Contains(t.numWorkGroupCode.ToString()) || grohkari == "-1")
                           &&
                           (t.numStatus == 1 || t.numStatus == 2)
                           &&
                           ((contractkindArray).Contains(t.numContractKindRef.ToString()) || contractkind == "-1")
                     orderby t.numPersonelRef
                     select new
                     {
                         PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                         t2.numPersonelCode,
                         t.strJobTime,
                         t.numPriceSaati,
                         t.numPersonelSalary,
                         numPersonelSaier = t.numPersonelPadashSaier,
                         bimetakmili = t.numPriceBimeTakmili,
                         t.numPriceVamMontly,
                         t.numPriceMosaede,
                         jarimeMotefareghe = t.numPriceJarimeMotefareghe,
                         t.strBankAccount,
                         t1.strWorkGroupName,
                         t.numPriceCalcHoghogh1,
                         t.numPriceCalcHoghoghKhales,
                         t.numPricePersonelBimeh,
                         t.numPriceCalcKosorat,
                         t.numInvoiceSaatiCode,
                         t.dateVarizDate,
                         strInvoiceMonth = EdariFunc.GetMonthName(t.strInvoiceMonth),
                         t.strInvoiceYear,
                         t.strBankName,
                         t.numStatus,
                         strMandeAzMaheGhablTafkiki = EdariFunc.GetPriceMandeHoghoghInSplit(t.strMandeAzMaheGhablTafkiki),
                         t.numPriceMoavaghe,
                         strShebaBank = (t3.strShebaBank != null || t3.strShebaBank != "") ? t3.strShebaBank : "-",
                         t.numPriceBuyCo,

                         t.numPricePersonelMaliat,
                         t.numPriceKosorMotefareghe,
                         t.numPriceAyabzahab,
                     });


            int take = page * perpage;
            int skip = page == 1 ? 0 : take - perpage;
            int AllRecrdCount = q.Count();
            var query = q.OrderBy(o => o.dateVarizDate).ThenBy(c => c.numInvoiceSaatiCode).Take(take).Skip(skip);
            string json = serializer.Serialize((object)query);
            string bothJson = "[" + json + "," + AllRecrdCount + "]";
            context.Response.Write(bothJson);
            context.Response.End();
        }
    }
    //----------------------------------------------------------------------
    //-----------------------دریافت اطلاعات کسور پرداخت ------------------------
    //----------------------------------------------------------------------
    private void GetReportKosorPersonel()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["WorkJob"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        int contractKind = Convert.ToInt32(context.Request.Form["contractkind"]);

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };
        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        if (contractKind == 1 || contractKind == 3) // movaghat and project
        {

            var personel = (from t in office.ofcPersonels
                            join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                            join t3 in office.ofcPersonelMonthlyJobs on t2.numContractCode equals t3.numContractRef
                            join t1 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t1.numWorkGroupCode into join_t1
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
                                ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                                &&
                                (t.numStatus == 2 || t.numStatus == 1)
                                &&
                                t2.numStatus == 1
                                &&
                                (t3.numMonthJob == Convert.ToInt16(month))
                                &&
                                t3.numYear == Convert.ToInt16(year)
                                &&
                                t3.numContractKindRef == contractKind
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.numPersonelCode,
                                strWorkGroupName = (t1.strWorkGroupName == null || t1.strWorkGroupName == "" ? "نامشخص" : t1.strWorkGroupName),
                                //maliat = (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + Getkarkard(t3.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 1) + Getkarkard(t3.strJobFriday, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 2) + Getkarkard(t3.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 3) + 0 + 0 + t2.numPersonelChildSalary + 0 + t2.numPersonelPadash + t2.numPersonelSaier + 0 + t2.numPersonelSanavat) > 11500000 ? (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + Getkarkard(t3.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 1) + Getkarkard(t3.strJobFriday, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 2) + Getkarkard(t3.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 3) + 0 + 0 + t2.numPersonelChildSalary + 0 + t2.numPersonelPadash + t2.numPersonelSaier + 0 + t2.numPersonelSanavat) * 0.1 : 0,
                                bimeh = Math.Ceiling((Convert.ToDouble((contractKind == 3 ? BimehProjectAndSaati : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon))) * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1)),
                                bimetakmili = 0,
                                numPriceVamMontly = EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t3.numYear, (int)t3.numMonthJob, 1),
                                numPriceMosaede = EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t3.numYear, (int)t3.numMonthJob),
                                takhir = EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobDelay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 5, (int)t2.numContractCode, 0),
                                tajil = EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobEarly, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 6, (int)t2.numContractCode, 0),
                                ghibat = EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobAbsent, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 7, (int)t2.numContractCode, 0),
                                jarimeMotefareghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 1),
                                kharid = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 1),
                                khorojGhireMojaz = t3.strJobExit != null ? EdariFunc.Getkarkard((int)t.numPersonelCode, t3.strJobExit, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 8, (int)t2.numContractCode, 0) : 0,
                                MorakhasiBiHoghogh = EdariFunc.GetPriceMorakhasiBiHoghogh((int)((contractKind == 3 ? hoghoghSabet : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash + t2.numPersonelChildSalary))), (int)t.numPersonelCode, t3.numMonthJob.ToString(), t3.numYear.ToString()),
                                MorakhasiUni = EdariFunc.GetPriceMorakhasiUniversal((int)((contractKind == 3 ? hoghoghSabet : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash + t2.numPersonelChildSalary))), (int)t.numPersonelCode, t3.numMonthJob.ToString(), t3.numYear.ToString()),

                                kosormotefareghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t3.numMonthJob, (int)t3.numYear, 1),
                                mah29roz = EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t2.numPersonelSalary), (int)t3.numYear, (int)t3.numMonthJob, t2.dateStartContractDate, t2.dateCutWorkDate, (int)t2.numContractKindRef, 0, 2),

                                jarimehtakhir = EdariFunc.GetJarimehTakhir8Houer((int)t.numPersonelCode, t3.strJobDelay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 5, (int)t2.numContractCode, 0),
                                maliathoghogh = 0,
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
        else if (contractKind == 2) // saati
        {
            var personel = (from t in office.ofcPersonels
                            join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                            join t3 in office.ofcPersonelMonthlyJobSaatis on t2.numContractCode equals t3.numContractRef
                            join t1 in office.ofcBWorkGroups on t2.numWorkGroupRef equals t1.numWorkGroupCode into join_t1
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
                                ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                                &&
                                (t.numStatus == 2 || t.numStatus == 1)
                                &&
                                t2.numStatus == 1
                                &&
                                (t3.numMonthJob == Convert.ToInt16(month))
                                &&
                                t3.numYear == Convert.ToInt16(year)
                                &&
                                t3.numContractKindRef == contractKind
                            select new
                            {
                                PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                t.numPersonelCode,
                                strWorkGroupName = (t1.strWorkGroupName == null || t1.strWorkGroupName == "" ? "نامشخص" : t1.strWorkGroupName),
                                //maliat = (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + Getkarkard(t3.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 1) + Getkarkard(t3.strJobFriday, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 2) + Getkarkard(t3.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 3) + 0 + 0 + t2.numPersonelChildSalary + 0 + t2.numPersonelPadash + t2.numPersonelSaier + 0 + t2.numPersonelSanavat) > 11500000 ? (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + Getkarkard(t3.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 1) + Getkarkard(t3.strJobFriday, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 2) + Getkarkard(t3.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 3) + 0 + 0 + t2.numPersonelChildSalary + 0 + t2.numPersonelPadash + t2.numPersonelSaier + 0 + t2.numPersonelSanavat) * 0.1 : 0,
                                bimeh = Math.Ceiling((Convert.ToDouble(BimehProjectAndSaati) * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1)),
                                bimetakmili = 0,
                                numPriceVamMontly = EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t3.numYear, (int)t3.numMonthJob, 1),
                                numPriceMosaede = EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t3.numYear, (int)t3.numMonthJob),
                                takhir = 0,//Getkarkard(t3.strJobDelay, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 5),
                                tajil = 0, // Getkarkard(t3.strJobEarly, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 6),
                                ghibat = 0, // Getkarkard(t3.strJobAbsent, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 7),
                                jarimeMotefareghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 1),
                                kharid = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, Convert.ToInt32(t3.numMonthJob), Convert.ToInt32(t3.numYear), 1),
                                khorojGhireMojaz = 0,// t3.strJobExit != null ? Getkarkard(t3.strJobExit, (contractKind == 3 ? hoghoghSabet : t2.numPersonelSalary), 8) : 0,
                                MorakhasiBiHoghogh = 0, //GetPriceMorakhasiBiHoghogh((int)((contractKind == 3 ? hoghoghSabet : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash))), (int)t.numPersonelCode, t3.numMonthJob.ToString(), t3.numYear.ToString()),
                                MorakhasiUni = 0,// GetPriceMorakhasiUniversal((int)((contractKind == 3 ? hoghoghSabet : (t2.numPersonelSalary + t2.numPersonelHomeSalary + t2.numPersonelBon + t2.numPersonelPadash))), (int)t.numPersonelCode, t3.numMonthJob.ToString(), t3.numYear.ToString()),
                                kosormotefareghe = EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t3.numMonthJob, (int)t3.numYear, 1),
                                mah29roz = 0,
                                maliathoghogh = 0,

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
    }
    //----------------------------------------------------------------------
    //-----------------------محاسبه مجدد صورت حساب حقوق ------------------------
    //----------------------------------------------------------------------
    public class lstPersonelReCalc
    {
        public int numPersonelRef { get; set; }
        public string strInvoiceMonth { get; set; }
        public string strInvoiceYear { get; set; }
        public int numIsKarakardPriceOnly { get; set; }
    }
    //----------------------------------------------------------------------
    private void ReClachoghogh()
    {
        string InvoiceCode = context.Request.Form["Code"];
        int contractKind = Convert.ToInt32(context.Request.Form["ContractKindPublic"]);
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";
        List<lstPersonelReCalc> InvoiceTemp1 = new List<lstPersonelReCalc>();



        if (contractKind == 1 || contractKind == 3) // movaghat and projecti
        {
            InvoiceTemp1 = (from t in office.ofcPersonelPreInvoices
                            where t.numStatus == 0
                            &&
                            arrayInvoiceCode.Contains(t.numInvoiceCode.ToString())
                            select new lstPersonelReCalc
                            {
                                numPersonelRef = (int)t.numPersonelRef,
                                strInvoiceMonth = t.strInvoiceMonth,
                                strInvoiceYear = t.strInvoiceYear,
                                numIsKarakardPriceOnly = Convert.ToInt32(t.numIsKarakardPriceOnly)
                            }).ToList();

            var InvoiceTemp = office.ofcPersonelPreInvoices.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numInvoiceCode.ToString()));
            string month = "", Year = "";
            int checkkarkardonly = 0;
            foreach (var item in InvoiceTemp)
            {
                var montlyTemp = office.ofcPersonelMonthlyJobs.Where(c => c.numMonthlyJobCode == item.numMonthlyJobRef).FirstOrDefault();
                montlyTemp.numStatus = 0;
                if (item.numPriceBuyCo > 0)
                {
                    string[] arrayBuyCo = item.strBuyCoRef.Split(',').Where(c => !String.IsNullOrEmpty(c)).Distinct().ToArray();
                    var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => arrayBuyCo.Contains(c.numPadashCode.ToString()) && c.numPersonelRef == item.numPersonelRef && c.numStatus == 1);
                    foreach (var pp in checkPadashAndJarimeh) pp.numStatus = 0;
                }
            }



            office.ofcPersonelPreInvoices.DeleteAllOnSubmit(InvoiceTemp);
            int checkSubmit = 0;
            try
            {
                office.SubmitChanges();
                checkSubmit = 1;
            }
            catch { }

            if (checkSubmit == 1) // ok bod
            {
                foreach (var itemsss in InvoiceTemp1)
                {
                    month = itemsss.strInvoiceMonth;
                    Year = itemsss.strInvoiceYear;
                    checkkarkardonly = itemsss.numIsKarakardPriceOnly;

                    string DateFrom = Year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/01";
                    string DateTo = Year.ToString() + "/12/30";
                    int[] personelendcontract = (from t in office.ofcPersonels
                                                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                                                 where
                                                     (t.numStatus == 1 || t.numStatus == 2)
                                                     &&
                                                     t1.numStatus == 1
                                                     &&
                                                     !((string.Compare(t1.dateEndContractDate, DateFrom) >= 0 && string.Compare(t1.dateEndContractDate, DateTo) <= 0))
                                                 select t.numPersonelCode).ToArray();

                    int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoices
                                                  join t9 in office.ofcPersonelMonthlyJobs on t8.numPersonelRef equals t9.numPersonelRef
                                                  where
                                                       (new int[] { 2 }).Contains((int)t8.numStatus)
                                                       &&
                                                       t8.strInvoiceMonth == month
                                                       &&
                                                       t8.strInvoiceYear == Year
                                                       &&
                                                       t9.numStatus == 0
                                                  select t8.numPersonelRef).ToArray();
                    int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoices
                                               where
                                                    (new int[] { 0, 1, 2 }).Contains((int)t8.numStatus)
                                                    &&
                                                    t8.strInvoiceMonth == month
                                                    &&
                                                    t8.strInvoiceYear == Year
                                                    &&
                                                    !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                                    &&
                                                    checkkarkardonly == 0
                                               select t8.numPersonelRef).ToArray();

                    var q = (from t in office.ofcPersonels
                             join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                             join t2 in office.ofcPersonelMonthlyJobs on t1.numContractCode equals t2.numContractRef
                             join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                             from t5 in join_t5.DefaultIfEmpty()
                             join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                             where
                                 t.numPersonelCode == itemsss.numPersonelRef
                                 &&
                                 t1.numStatus == 1
                                 &&
                                 t2.numStatus == 0
                                 &&
                                 (t2.numMonthJob == Convert.ToInt16(month))
                                 &&
                                 t2.numYear == Convert.ToInt16(Year)
                                 &&
                                 (t.numStatus == 2 || t.numStatus == 1)
                                 &&
                                 !
                                 (numpersonelarray).Contains(t.numPersonelCode)
                                 &&
                                 !(personelendcontract).Contains(t.numPersonelCode)
                                 &&
                                 t1.numContractKindRef == contractKind
                             select new
                             {
                                 numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                                 cntchild = (office.ofcPersonelChildInfos.Where(c => c.numPersonelRef == t.numPersonelCode).Count()),
                                 t2.strJobDays,
                                 t2.strJobOverTime,
                                 t2.strJobOverTimeSpecial,
                                 t2.strJobOverTimeInMission,
                                 numPersonelSalary = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelSalary, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                                 numPersonelHomeSalary = checkkarkardonly == 1 ? 0 : (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelHomeSalary, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                                 numPersonelBon = checkkarkardonly == 1 ? 0 : (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelBon, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                                 ezafekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTime, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                                 ezafekarVijeh = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeSpecial, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                                 ezafekarinmission = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobOverTimeInMission, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 1, (int)t1.numContractCode, 0),
                                 jomekar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobFriday, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 2, (int)t1.numContractCode, 0),
                                 tatilkar = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobHoliDay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 3, (int)t1.numContractCode, 0),
                                 numPersonelChildSalary = checkkarkardonly == 1 ? 0 : (contractKind == 3 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelChildSalary, t1.dateStartContractDate, (int)t2.numYear, (int)t2.numMonthJob, t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode))),
                                 mamoriat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobMission, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 4, (int)t1.numContractCode, 0),

                                 numPersonelPadash = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelPadash, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),

                                 numPersonelSaier = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 numPersonelSanavat = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkard((int)t1.numPersonelSanavat, t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 0, Convert.ToInt32(t.numPersonelCode)),
                                 numPriceVamMontly = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 1),
                                 numPriceMosaede = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                 takhir = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobDelay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 5, (int)t1.numContractCode, 0),
                                 tajil = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobEarly, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 6, (int)t1.numContractCode, 0),
                                 ghibat = EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobAbsent, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 7, (int)t1.numContractCode, 0),
                                 jarimeMotefareghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                                 strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                                 t7.numWorkGroupCode,
                                 numVamCode = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 2),
                                 numMosaedeCode = EdariFunc.GetPriceMosaedeCode((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                 numPadashCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                 numJarimehCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                 khorojGhireMojaz = t2.strJobExit != null ? EdariFunc.Getkarkard((int)t.numPersonelCode, t2.strJobExit, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 8, (int)t1.numContractCode, 0) : 0,
                                 bimehKarmand = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceKarkardBimeh((int)t.numPersonelCode, (contractKind == 3 ? EdariFunc.GetPriceKarkard((int)(BimehProjectAndSaati), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode)) : EdariFunc.GetPriceKarkard((int)(t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode))), Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), (int)t1.numContractKindRef, t1.dateCutWorkDate, t1.dateStartContractDate),
                                 MorakhasiBiHoghogh = EdariFunc.GetPriceMorakhasiBiHoghogh((int)((contractKind == 3 ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                                 MorakhasiUniversal = EdariFunc.GetPriceMorakhasiUniversal((int)((contractKind == 3 ? hoghoghSabet : (t1.numPersonelSalary + t1.numPersonelHomeSalary + t1.numPersonelBon + t1.numPersonelPadash + t1.numPersonelChildSalary))), (int)t.numPersonelCode, t2.numMonthJob.ToString(), t2.numYear.ToString()),
                                 t1.numContractKindRef,
                                 t2.numContractRef,
                                 t2.numMonthlyJobCode,
                                 mandeHoghoghAzMaheGhabl = EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, "", 2, 0),
                                 numPriceMoavaghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 numMoavagheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                 kharid = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 numkharidCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),


                                 ayabzahab = checkkarkardonly == 1 ? 0 : EdariFunc.GetAyabZahab((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                                 haghmodiriat = checkkarkardonly == 1 ? 0 : EdariFunc.GetHaghModiriat((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceHaghModiriat, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),

                                 hazinejari = checkkarkardonly == 1 ? 0 : EdariFunc.GetHazinehJari((int)t.numPersonelCode, (int)t1.numPriceJariAbogaz, (int)t1.numPriceJariEjareh, (int)t1.numPriceJariNet, (int)t1.numPriceJariTel, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                                 porsanttozi = checkkarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantToziShode, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 1),
                                 porsantkharejmahdode = checkkarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantKharejMahdode, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 2),
                                 porsantmoadeli = checkkarkardonly == 1 ? 0 : EdariFunc.GetPorsantPriceAgent((int)t.numPersonelCode, (int)t1.numPricePorsantMoadeli, (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0, 3),

                                 kosormotefareghe = checkkarkardonly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t2.numMonthJob, (int)t2.numYear, 0),
                                 numkosormotefaregheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 5, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                                 mah31roz = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t1.numPersonelSalary), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, (int)t1.numContractKindRef, 0, 1),
                                 mah29roz = checkkarkardonly == 1 ? 0 : EdariFunc.GetPriceMonth29Or31((int)t.numPersonelCode, (int)(t1.numPersonelSalary), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, (int)t1.numContractKindRef, 0, 2),
                                 jarimehtakhir = EdariFunc.GetJarimehTakhir8Houer((int)t.numPersonelCode, t2.strJobDelay, (contractKind == 3 ? hoghoghSabet : t1.numPersonelSalary), 5, (int)t1.numContractCode, 0),
                                 maliathoghogh = 0,
                                 eidi = 0,
                                 bimetakmili = 0,
                                 bazkharid = 0,

                             });
                    int hoghoghpaie = 0, hoghoghPaie2 = 0, khalespardakhti = 0, sumkosor = 0, sumMandeHoghogh = 0;
                    double maliatkarmand = 0, hoghogheBime = 0;
                    foreach (var item in q)
                    {
                        sumMandeHoghogh = 0;
                        if (checkkarkardonly == 0 && item.mandeHoghoghAzMaheGhabl != "0")
                        {
                            sumMandeHoghogh = EdariFunc.GetPriceMandeHoghoghInSplit(item.mandeHoghoghAzMaheGhabl);

                        }

                        hoghoghpaie = Convert.ToInt32(item.numPersonelSalary) +
                                      Convert.ToInt32(item.numPersonelHomeSalary) +
                                      Convert.ToInt32(item.numPersonelBon);

                        hoghoghPaie2 = Convert.ToInt32(hoghoghpaie) +
                                       Convert.ToInt32(sumMandeHoghogh) +
                                       Convert.ToInt32(item.ezafekarVijeh) +
                                       Convert.ToInt32(item.ezafekarinmission) +
                                       Convert.ToInt32(item.jomekar) +
                                       Convert.ToInt32(item.ezafekar) +
                                       Convert.ToInt32(item.tatilkar) +
                                       Convert.ToInt32(item.ayabzahab) +
                                       Convert.ToInt32(item.haghmodiriat) +
                                       Convert.ToInt32(item.hazinejari) +
                                       Convert.ToInt32(item.porsanttozi) +
                                       Convert.ToInt32(item.porsantkharejmahdode) +
                                       Convert.ToInt32(item.porsantmoadeli) +
                                       Convert.ToInt32(item.bazkharid) +
                                       Convert.ToInt32(item.mah31roz) +
                                       Convert.ToInt32(item.numPersonelChildSalary) +
                                       Convert.ToInt32(item.mamoriat) +
                                       Convert.ToInt32(item.numPersonelPadash) +
                                       Convert.ToInt32(item.numPriceMoavaghe) +
                                       Convert.ToInt32(item.numPersonelSaier) +
                                       Convert.ToInt32(item.eidi) +
                                       Convert.ToInt32(item.numPersonelSanavat);

                        maliatkarmand = 0;
                        hoghogheBime = item.bimehKarmand;//Convert.ToInt32(item.numPersonelSalary + item.numPersonelHomeSalary + item.numPersonelBon);
                        hoghogheBime = (hoghogheBime * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1);

                        sumkosor = Convert.ToInt32(Convert.ToInt32(Math.Round(hoghogheBime)) + item.bimetakmili +
                                                    item.numPriceVamMontly + item.jarimehtakhir + item.numPriceMosaede + item.takhir + item.tajil +
                                                    item.ghibat + item.jarimeMotefareghe + Convert.ToInt32(item.khorojGhireMojaz) +
                                                    Convert.ToInt32(item.MorakhasiBiHoghogh) + Convert.ToInt32(item.MorakhasiUniversal) + item.kharid +
                                                    item.kosormotefareghe + item.maliathoghogh + item.mah29roz);

                        khalespardakhti = hoghoghPaie2 - sumkosor;

                        office.ofcPersonelPreInvoices.InsertOnSubmit(new ofcPersonelPreInvoice
                        {
                            numPersonelRef = item.numPersonelCode,
                            numCntChild = item.cntchild,
                            strJobDays = item.strJobDays,
                            strJobOverTime = item.strJobOverTime,
                            strJobOverTimeSpecial = item.strJobOverTimeSpecial,
                            strJobOverTimeInMission = item.strJobOverTimeInMission,
                            numPersonelSalary = item.numPersonelSalary,
                            numPersonelHomeSalary = item.numPersonelHomeSalary,
                            numPersonelBon = item.numPersonelBon,
                            numPriceEzafeKar = item.ezafekar,
                            numPriceEzafeKarVijeh = item.ezafekarVijeh,
                            numPriceEzafeKarInMission = item.ezafekarinmission,
                            numPriceJomeKar = item.jomekar,
                            numPriceTatilKar = item.tatilkar,
                            numPriceCalcHoghogh1 = hoghoghpaie,
                            numPersonelChildSalary = item.numPersonelChildSalary,
                            numPriceMamoriat = item.mamoriat,
                            numPersonelPadash = item.numPersonelPadash,
                            numPersonelPadashSaier = item.numPersonelSaier,
                            numPersonelSanavat = item.numPersonelSanavat,
                            numPriceCalcHoghogh2 = hoghoghPaie2,
                            numPricePersonelBimeh = Convert.ToInt32(hoghogheBime),
                            numPriceBimeTakmili = item.bimetakmili,
                            numPriceVamMontly = item.numPriceVamMontly,
                            numPriceMosaede = item.numPriceMosaede,
                            numPriceTakhir = item.takhir,
                            numPriceTajil = item.tajil,
                            numPriceGhibat = item.ghibat,
                            numPriceJarimeMotefareghe = item.jarimeMotefareghe,
                            numPriceCalcHoghoghKhales = khalespardakhti,
                            strBankAccount = item.strBankAccount,
                            numWorkGroupCode = item.numWorkGroupCode,
                            strInvoiceMonth = month,
                            strInvoiceYear = Year,
                            dateRegisterDate = _PDate.PersianDate,
                            strRegisterUserRef = _ofcUser.strUserCode,
                            numStatus = 0,
                            strVamRef = item.numVamCode.ToString(),
                            strMosaedeRef = checkkarkardonly == 1 ? "0" : item.numMosaedeCode,
                            strJarimehRef = checkkarkardonly == 1 ? "0" : item.numJarimehCode,
                            strPadashRef = checkkarkardonly == 1 ? "0" : item.numPadashCode,
                            numPriceKhorojGhireMojaz = item.khorojGhireMojaz,
                            numPriceMorakhasiBiHoghogh = Convert.ToInt32(item.MorakhasiBiHoghogh),
                            numPriceCalcKosorat = sumkosor,
                            numPriceMorakhasiUni = Convert.ToInt32(item.MorakhasiUniversal),
                            numContractKindRef = item.numContractKindRef,
                            numContractRef = item.numContractRef,
                            numMonthlyJobRef = item.numMonthlyJobCode,
                            strBankName = item.strBankName,
                            strMandeAzMaheGhablTafkiki = checkkarkardonly == 1 ? "0" : item.mandeHoghoghAzMaheGhabl,
                            numPriceMoavaghe = item.numPriceMoavaghe,
                            strMoavagheRef = checkkarkardonly == 1 ? "0" : item.numMoavagheCode,
                            numPriceSaier = 0,
                            numPriceBuyCo = item.kharid,
                            strBuyCoRef = checkkarkardonly == 1 ? "0" : item.numkharidCode,
                            strDescSaier = "",

                            numPriceGhoboz = item.hazinejari,
                            numPriceKosorMotefareghe = item.kosormotefareghe,
                            strKosorMotefaregheRef = checkkarkardonly == 1 ? "0" : item.numkosormotefaregheCode,

                            numPriceMonth29 = item.mah29roz,
                            numPriceMonth31 = item.mah31roz,
                            numPricePorsantKharjMahdode = item.porsantkharejmahdode,
                            numPricePorsantTozi = item.porsanttozi,
                            numPricePrintMoadeli = item.porsantmoadeli,

                            numPriceAyabzahab = item.ayabzahab,
                            numPriceHaghModiriat = item.haghmodiriat,
                            numPriceEidi = Convert.ToInt32(item.eidi),
                            numPricePersonelMaliat = Convert.ToInt32(maliatkarmand),
                            numPriceReBuyLeave = item.bazkharid,
                            numPriceJarimehTakhir8Saat = item.jarimehtakhir,
                            numIsKarakardPriceOnly = Convert.ToByte(checkkarkardonly)

                        });

                        var montlyjobDeactive = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == item.numPersonelCode && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(Year) && c.numStatus == 0).FirstOrDefault();
                        if (montlyjobDeactive != null)
                        {
                            montlyjobDeactive.numStatus = 1;
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
        else if (contractKind == 2) //saati
        {
            InvoiceTemp1 = (from t in office.ofcPersonelPreInvoiceSaatis
                            where t.numStatus == 0
                            &&
                            arrayInvoiceCode.Contains(t.numInvoiceSaatiCode.ToString())
                            select new lstPersonelReCalc
                            {
                                numPersonelRef = (int)t.numPersonelRef,
                                strInvoiceMonth = t.strInvoiceMonth,
                                strInvoiceYear = t.strInvoiceYear,
                                numIsKarakardPriceOnly = Convert.ToInt32(t.numIsKarakardPriceOnly)
                            }).ToList();

            var InvoiceTemp = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numInvoiceSaatiCode.ToString()));
            string month = "", Year = "";
            int checkKarkardOnly = 0;
            foreach (var item in InvoiceTemp)
            {
                var montlyTemp = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numMonthlyJobSaatiCode == item.numMonthlyJobSaatiRef).FirstOrDefault();
                montlyTemp.numStatus = 0;
                if (item.numPriceBuyCo > 0)
                {
                    string[] arrayBuyCo = item.strBuyCoRef.Split(',').Where(c => !String.IsNullOrEmpty(c)).Distinct().ToArray();
                    var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => arrayBuyCo.Contains(c.numPadashCode.ToString()) && c.numPersonelRef == item.numPersonelRef && c.numStatus == 1);
                    foreach (var pp in checkPadashAndJarimeh) pp.numStatus = 0;
                }
            }
            office.ofcPersonelPreInvoiceSaatis.DeleteAllOnSubmit(InvoiceTemp);
            int checkSubmit = 0;
            try
            {
                office.SubmitChanges();
                checkSubmit = 1;
            }
            catch { }

            if (checkSubmit == 1) // ok bod
            {
                foreach (var itemsss in InvoiceTemp1)
                {
                    month = itemsss.strInvoiceMonth;
                    Year = itemsss.strInvoiceYear;
                    checkKarkardOnly = itemsss.numIsKarakardPriceOnly;
                    string DateFrom = Year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/01";
                    string DateTo = Year.ToString() + "/12/30";

                    int[] personelendcontract = (from t in office.ofcPersonels
                                                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                                                 where
                                                     (t.numStatus == 1 || t.numStatus == 2)
                                                     &&
                                                     t1.numStatus == 1
                                                     &&
                                                   !((string.Compare(t1.dateEndContractDate, DateFrom) >= 0 && string.Compare(t1.dateEndContractDate, DateTo) <= 0))
                                                 select t.numPersonelCode).ToArray();

                    int?[] arrayPersonlCutWork = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                                  join t9 in office.ofcPersonelMonthlyJobSaatis on t8.numPersonelRef equals t9.numPersonelRef
                                                  where
                                                       (new int[] { 2 }).Contains((int)t8.numStatus)
                                                       &&
                                                       t8.strInvoiceMonth == month
                                                       &&
                                                       t8.strInvoiceYear == Year
                                                       &&
                                                       t9.numStatus == 0
                                                  select t8.numPersonelRef).ToArray();


                    int?[] numpersonelarray = (from t8 in office.ofcPersonelPreInvoiceSaatis
                                               where
                                                    (new int[] { 0, 1, 2 }).Contains((int)t8.numStatus)
                                                    &&
                                                    t8.strInvoiceMonth == month
                                                    &&
                                                    t8.strInvoiceYear == Year
                                                    &&
                                                    !(arrayPersonlCutWork).Contains(t8.numPersonelRef)
                                                    &&
                                                    checkKarkardOnly == 0
                                               select t8.numPersonelRef).ToArray();
                    var q = (from t in office.ofcPersonels
                             join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                             join t2 in office.ofcPersonelMonthlyJobSaatis on t1.numContractCode equals t2.numContractRef
                             join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                             from t5 in join_t5.DefaultIfEmpty()
                             join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                             where
                                  (t.numPersonelCode == itemsss.numPersonelRef)
                                  &&
                                  t1.numStatus == 1
                                  &&
                                  t2.numStatus == 0
                                  &&
                                  t1.numContractKindRef == contractKind
                                  &&
                                  (t2.numMonthJob == Convert.ToInt16(month))
                                  &&
                                  t2.numYear == Convert.ToInt16(Year)
                                  &&
                                  (t.numStatus == 2 || t.numStatus == 1)
                                  &&
                                  !
                                  (numpersonelarray).Contains(t.numPersonelCode)
                                  &&
                                  !(personelendcontract).Contains(t.numPersonelCode)
                             select new
                             {
                                 PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                                 numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                                 t2.strJobTime,
                                 numPersonelSalary1 = checkKarkardOnly == 1 ? 0 : t1.numPersonelSalary,
                                 numPersonelSalary = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPriceKarkardSaati(t2.strJobTime, (int)t1.numPersonelSalary, 1),
                                 numPersonelSaier = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 bimehKarmand = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPriceKarkardBimeh((int)t.numPersonelCode, EdariFunc.GetPriceKarkard((int)(BimehProjectAndSaati), t1.dateStartContractDate, Convert.ToInt32(t2.numYear), Convert.ToInt32(t2.numMonthJob), t1.dateCutWorkDate, 2, Convert.ToInt32(t.numPersonelCode)), (int)t2.numYear, (int)t2.numMonthJob, (int)t1.numContractKindRef, t1.dateCutWorkDate, t1.dateStartContractDate),
                                 bimetakmili = 0,
                                 numPriceVamMontly = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 1),
                                 numPriceMosaede = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPriceMosaede((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                 jarimeMotefareghe = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                                 strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                                 t7.strWorkGroupName,
                                 t7.numWorkGroupCode,
                                 numVamCode = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPriceVam((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, 2),
                                 numMosaedeCode = EdariFunc.GetPriceMosaedeCode((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob),
                                 numPadashCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 1, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                 numJarimehCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 2, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                 t1.numContractKindRef,
                                 t2.numContractRef,
                                 t2.numMonthlyJobSaatiCode,
                                 mandeHoghoghAzMaheGhabl = EdariFunc.GetMandeHoghoghAzMaheGhabl((int)t.numPersonelCode, (int)t2.numYear, (int)t2.numMonthJob, "", 2, 0),
                                 numPriceMoavaghe = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 numMoavagheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 3, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                 kharid = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear), 0),
                                 numkharidCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 4, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),

                                 ayabzahab = checkKarkardOnly == 1 ? 0 : EdariFunc.GetAyabZahab((int)t.numPersonelCode, EdariFunc.CheckIsNUll(t1.numPriceAyabZahab, 0), (int)t2.numYear, (int)t2.numMonthJob, t1.dateStartContractDate, t1.dateCutWorkDate, 0),
                                 kosormotefareghe = checkKarkardOnly == 1 ? 0 : EdariFunc.GetPadashAndJarimeh((int)t.numPersonelCode, 5, (int)t2.numMonthJob, (int)t2.numYear, 0),
                                 numkosormotefaregheCode = EdariFunc.GetPadashAndJarimehCode((int)t.numPersonelCode, 5, Convert.ToInt32(t2.numMonthJob), Convert.ToInt32(t2.numYear)),
                                 maliathoghogh = 0,
                             });
                    int hoghoghpaie = 0, khalespardakhti = 0, sumkosor = 0, sumMandeHoghogh = 0;
                    double maliatkarmand = 0, hoghogheBime = 0;
                    foreach (var item in q)
                    {
                        sumMandeHoghogh = 0;
                        if (checkKarkardOnly == 0 && item.mandeHoghoghAzMaheGhabl != "0")
                        {
                            sumMandeHoghogh = EdariFunc.GetPriceMandeHoghoghInSplit(item.mandeHoghoghAzMaheGhabl);

                        }
                        hoghoghpaie = Convert.ToInt32(item.numPersonelSalary) +
                                      Convert.ToInt32(item.numPersonelSaier) +
                                      Convert.ToInt32(sumMandeHoghogh) +
                                      Convert.ToInt32(item.numPriceMoavaghe) +
                                      Convert.ToInt32(item.ayabzahab);
                        // maliatkarmand = hoghoghPaie2 > 11500000 ? hoghoghPaie2 * 0.1 : 0;
                        maliatkarmand = 0;
                        hoghogheBime = item.bimehKarmand;//Convert.ToInt32(item.numPersonelSalary + item.numPersonelHomeSalary + item.numPersonelBon);
                        hoghogheBime = (hoghogheBime * Convert.ToDouble(0.07)) * Convert.ToDouble(1.1);

                        sumkosor = Convert.ToInt32(Math.Round(hoghogheBime)) +
                                                                                   Convert.ToInt32(item.bimetakmili) +
                                                                                   Convert.ToInt32(item.numPriceVamMontly) +
                                                                                   Convert.ToInt32(item.numPriceMosaede) +
                                                                                   Convert.ToInt32(item.jarimeMotefareghe) +
                                                                                   Convert.ToInt32(item.kharid) +
                                                                                   Convert.ToInt32(item.kosormotefareghe) +
                                                                                   Convert.ToInt32(item.maliathoghogh);

                        khalespardakhti = hoghoghpaie - sumkosor;

                        office.ofcPersonelPreInvoiceSaatis.InsertOnSubmit(new ofcPersonelPreInvoiceSaati
                        {
                            numPersonelRef = item.numPersonelCode,
                            strJobTime = item.strJobTime,
                            numPriceSaati = item.numPersonelSalary1,
                            numPersonelSalary = item.numPersonelSalary,
                            numPriceCalcHoghogh1 = hoghoghpaie,
                            numPersonelPadashSaier = item.numPersonelSaier,
                            numPricePersonelMaliat = Convert.ToInt32(maliatkarmand),
                            numPricePersonelBimeh = Convert.ToInt32(hoghogheBime),
                            numPriceBimeTakmili = item.bimetakmili,
                            numPriceVamMontly = item.numPriceVamMontly,
                            numPriceMosaede = item.numPriceMosaede,
                            numPriceJarimeMotefareghe = item.jarimeMotefareghe,
                            numPriceCalcHoghoghKhales = khalespardakhti,
                            strBankAccount = item.strBankAccount,
                            numWorkGroupCode = item.numWorkGroupCode,
                            strInvoiceMonth = month,
                            strInvoiceYear = Year,
                            dateRegisterDate = _PDate.PersianDate,
                            strRegisterUserRef = _ofcUser.strUserCode,
                            numStatus = 0,
                            strVamRef = item.numVamCode.ToString(),
                            strMosaedeRef = checkKarkardOnly == 1 ? "0" : item.numMosaedeCode,
                            strJarimehRef = checkKarkardOnly == 1 ? "0" : item.numJarimehCode,
                            strPadashRef = checkKarkardOnly == 1 ? "0" : item.numPadashCode,
                            numPriceCalcKosorat = sumkosor,
                            numContractKindRef = item.numContractKindRef,
                            numContractRef = item.numContractRef,
                            numMonthlyJobSaatiRef = item.numMonthlyJobSaatiCode,
                            strBankName = item.strBankName,
                            strMandeAzMaheGhablTafkiki = checkKarkardOnly == 1 ? "0" : item.mandeHoghoghAzMaheGhabl,
                            numPriceMoavaghe = item.numPriceMoavaghe,
                            strMoavagheRef = checkKarkardOnly == 1 ? "0" : item.numMoavagheCode,
                            numPriceSaier = 0,
                            strDescSaier = "",
                            numPriceEidi = 0,
                            numPriceBuyCo = item.kharid,
                            strBuyCoRef = checkKarkardOnly == 1 ? "0" : item.numkharidCode,
                            numPriceReBuyLeave = 0,

                            numPriceAyabzahab = item.ayabzahab,
                            numPriceKosorMotefareghe = item.kosormotefareghe,
                            strKosorMotefaregheRef = checkKarkardOnly == 1 ? "0" : item.numkosormotefaregheCode,
                            numIsKarakardPriceOnly = Convert.ToByte(checkKarkardOnly)
                        });

                        var montlyjobDeactive = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numPersonelRef == item.numPersonelCode && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(Year) && c.numStatus == 0).FirstOrDefault();
                        if (montlyjobDeactive != null)
                        {
                            montlyjobDeactive.numStatus = 1;
                        }
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
            context.Response.Write(json);
            context.Response.End();
        }
    }
    //----------------------------------------------------------------------
    //-----------------------حذف محاسبه  صورت حساب حقوق ------------------------
    //----------------------------------------------------------------------
    private void DeleteClachoghogh()
    {
        string InvoiceCode = context.Request.Form["Code"];
        int contractKind = Convert.ToInt32(context.Request.Form["ContractKindPublic"]);
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";

        if (contractKind == 1 || contractKind == 3) // movaghat and projecti
        {
            var InvoiceTemp = office.ofcPersonelPreInvoices.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numInvoiceCode.ToString()));
            foreach (var item in InvoiceTemp)
            {
                var montlyTemp = office.ofcPersonelMonthlyJobs.Where(c => c.numMonthlyJobCode == item.numMonthlyJobRef).FirstOrDefault();
                montlyTemp.numStatus = 0;
                if (item.numPriceBuyCo > 0)
                {
                    string[] arrayBuyCo = item.strBuyCoRef.Split(',').Where(c => !String.IsNullOrEmpty(c)).Distinct().ToArray();
                    var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => arrayBuyCo.Contains(c.numPadashCode.ToString()) && c.numPersonelRef == item.numPersonelRef && c.numStatus == 1);
                    foreach (var pp in checkPadashAndJarimeh) pp.numStatus = 0;
                }
            }
            office.ofcPersonelPreInvoices.DeleteAllOnSubmit(InvoiceTemp);

        }
        else if (contractKind == 2) //saati
        {
            var InvoiceTemp = office.ofcPersonelPreInvoiceSaatis.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numInvoiceSaatiCode.ToString()));
            var InvoiceTemp1 = InvoiceTemp;
            foreach (var item in InvoiceTemp)
            {
                var montlyTemp = office.ofcPersonelMonthlyJobSaatis.Where(c => c.numMonthlyJobSaatiCode == item.numMonthlyJobSaatiRef).FirstOrDefault();
                montlyTemp.numStatus = 0;
                if (item.numPriceBuyCo > 0)
                {
                    string[] arrayBuyCo = item.strBuyCoRef.Split(',').Where(c => !String.IsNullOrEmpty(c)).Distinct().ToArray();
                    var checkPadashAndJarimeh = office.ofcPersonelPadashAndJarimehs.Where(c => arrayBuyCo.Contains(c.numPadashCode.ToString()) && c.numPersonelRef == item.numPersonelRef && c.numStatus == 1);
                    foreach (var pp in checkPadashAndJarimeh) pp.numStatus = 0;
                }
            }
            office.ofcPersonelPreInvoiceSaatis.DeleteAllOnSubmit(InvoiceTemp);
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
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------check karkarde mahane for hoghogh------------------------
    //----------------------------------------------------------------------
    private void CheckKarkardMahanehForHoghogh()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
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

        int?[] numPeronelKarkard = (from t8 in office.ofcPersonelMonthlyJobs
                                    where
                                         (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                         &&
                                         t8.numMonthJob == month
                                         &&
                                         t8.numYear == year
                                    select t8.numPersonelRef).ToArray();
        int?[] numPeronelKarkardSaati = (from t8 in office.ofcPersonelMonthlyJobSaatis
                                         where
                                              (new int[] { 0, 1 }).Contains((int)t8.numStatus)
                                              &&
                                              t8.numMonthJob == month
                                              &&
                                              t8.numYear == year
                                         select t8.numPersonelRef).ToArray();
        string DateFrom = year.ToString() + "/" + (month.ToString().Length == 1 ? "0" + month.ToString() : month.ToString()) + "/31";
        // string DateTo = _PDate.PersianDate;
        var q = (from t in office.ofcPersonels
                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                 join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode into join_t7
                 from t7 in join_t7.DefaultIfEmpty()
                 where
                      (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                      &&
                      t1.numStatus == 1
                     &&
                     ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                     ||
                     (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                     ||
                     name == "")
                     &&
                     ((contractkindArray).Contains(t1.numContractKindRef.ToString()) || contractkind == "-1")
                     &&
                     (t.strMelliCode == mellicode || mellicode == "")
                     &&
                     (t.numStatus == 2 || t.numStatus == 1)
                     &&
                     ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                     &&
                     !
                     (numPeronelKarkard).Contains(t.numPersonelCode)
                     &&
                     !
                     (numPeronelKarkardSaati).Contains(t.numPersonelCode)
                     &&
                    string.Compare(t1.dateStartContractDate, DateFrom) <= 0
                 select new
                 {
                     PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                     t.numPersonelCode,
                     strWorkGroupName = (t7.strWorkGroupName == null || t7.strWorkGroupName == "" ? "نامشخص" : t7.strWorkGroupName),
                 });

        var query = q.OrderBy(o => o.numPersonelCode);
        string json = serializer.Serialize((object)query);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------ثبت فرایند قرارداد پیمانکاری ------------------------
    //----------------------------------------------------------------------
    public class lsterror
    {
        public int numPersonelCode { get; set; }
        public string strPersonelName { get; set; }
        public int ErrorCode { get; set; }
    }
    //----------------------------------------------------------------------
    private void SaveUploadFaraiand()
    {
        string month = context.Request.Form["month"];
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

            fname = "Faraiand_" + fname + System.DateTime.Now.ToString("_ddMMyyhhmmss") + extension;

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
                    FaraiandCount = result.Tables[0].Rows[i].ItemArray[1].ToString()
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

                        var contract = office.ofcPersonelContracts.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numStatus == 1).FirstOrDefault();

                        if (contract == null)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 5; // gharardade ghire faal shode
                            checkError = 1;
                        }
                        else if (contract.numContractKindRef != 3)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 4; //gharradad proje nemibashad
                            checkError = 1;
                        }
                        else if (contract.numPersonelPadash == 0 || contract.numPersonelPadash == null)
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 6; // mablagh faraiand set nashode
                            checkError = 1;
                        }
                        else
                        {
                            op.numPersonelCode = Convert.ToInt32(q.personelcode);
                            op.strPersonelName = checkPersonel.strPersonelName + " " + checkPersonel.strPersonelFamily;
                            op.ErrorCode = 1; // faal

                            var checkkarkard = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == Convert.ToInt32(q.personelcode) && c.numYear == Convert.ToInt16(_PDate.NowYear) && c.numMonthJob == Convert.ToInt16(month) && c.numStatus == 0).FirstOrDefault();


                            if (checkkarkard != null) office.ofcPersonelFaraiands.DeleteOnSubmit(checkkarkard);
                            office.ofcPersonelFaraiands.InsertOnSubmit(new ofcPersonelFaraiand
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
                                numCountFaraiandProject = Convert.ToInt32(String.IsNullOrEmpty(q.FaraiandCount) ? "0" : q.FaraiandCount.Trim()),
                                numWorkGroupRef = contract.numWorkGroupRef,

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
    //--------------------------------گزارش صورت حساب فرآیند ها--------------------------------------
    //----------------------------------------------------------------------
    private void ReportFaraiandha()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
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

        var q = (from t in office.ofcPersonels
                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                 join t2 in office.ofcPersonelFaraiands on t1.numContractCode equals t2.numContractRef
                 join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                 from t5 in join_t5.DefaultIfEmpty()
                 join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode
                 where
                      (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                      &&
                      t1.numStatus == 1
                      &&
                      t2.numStatus == 0
                     &&
                     ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                     ||
                     (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                     ||
                     name == "")
                     &&
                     t1.numContractKindRef == 3
                     &&
                     (t.strMelliCode == mellicode || mellicode == "")
                     &&
                     (t2.numMonthJob == Convert.ToInt16(month))
                     &&
                     t2.numYear == Convert.ToInt16(year)
                     &&
                     (t.numStatus == 2 || t.numStatus == 1)
                     &&
                     ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")

                 select new
                 {
                     PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                     numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                     numcountFaraiand = t2.numCountFaraiandProject,
                     numPriceOneFaraiand = t1.numPersonelPadash,
                     numCalcKhalesFaraiand = (t1.numPersonelPadash * t2.numCountFaraiandProject),
                     strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                     strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                     t7.strWorkGroupName,

                 });

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
    //-----------------------پیش ثبت فرآیند ها ------------------------
    //----------------------------------------------------------------------
    private void SavePreFaraiand()
    {
        string personelcode = context.Request.Form["PersonelCodeTemp"];
        string ItemSearch = context.Request.Form["ItemSearch"];
        string[] arrayPesonelCode = personelcode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string month = ItemSearch.Split(',')[0];
        string Year = ItemSearch.Split(',')[1];

        var q = (from t in office.ofcPersonels
                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                 join t2 in office.ofcPersonelFaraiands on t1.numContractCode equals t2.numContractRef
                 join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                 from t5 in join_t5.DefaultIfEmpty()
                 where
                        arrayPesonelCode.Contains(t.numPersonelCode.ToString())
                         &&
                         t1.numStatus == 1
                         &&
                         t2.numStatus == 0
                         &&
                         (t2.numMonthJob == Convert.ToInt16(month))
                         &&
                         t2.numYear == Convert.ToInt16(Year)
                         &&
                         (t.numStatus == 2 || t.numStatus == 1)
                 select new
                 {
                     PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                     numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                     numcountFaraiand = t2.numCountFaraiandProject,
                     numPriceOneFaraiand = t1.numPersonelPadash,
                     numCalcKhalesFaraiand = (t1.numPersonelPadash * t2.numCountFaraiandProject),
                     strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                     strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                     t1.numContractCode,
                     t1.numWorkGroupRef,
                     t2.numFaraiandCode
                 });

        foreach (var item in q)
        {
            office.ofcPersonelFaraiandCalcs.InsertOnSubmit(new ofcPersonelFaraiandCalc
            {
                numPersonelRef = item.numPersonelCode,
                dateRegisterDate = _PDate.PersianDate,
                strRegisterUserRef = _ofcUser.strUserCode,
                numStatus = 0,
                numContractRef = item.numContractCode,
                numCountFaraiandProject = item.numcountFaraiand,
                numFaraiandRef = item.numFaraiandCode,
                numMonthJob = Convert.ToInt16(month),
                numYear = Convert.ToInt16(Year),
                numPriceCalcFaraindKhales = Convert.ToInt32(item.numCalcKhalesFaraiand),
                numPriceOneFaraind = item.numPriceOneFaraiand,
                numWorkGroupRef = item.numWorkGroupRef,
                strBankAccount = item.strBankAccount,
                strBankName = item.strBankName
            });

            var faraiandDeactive = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == item.numPersonelCode && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(Year) && c.numStatus == 0).FirstOrDefault();
            if (faraiandDeactive != null)
            {
                faraiandDeactive.numStatus = 1;
            }

        }
        string json = "";
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
    //-----------------------گزارش پیش ثبت فرآیند ها------------------------
    //----------------------------------------------------------------------
    private void GetReportpreFaraiand()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        var q = (from t in office.ofcPersonelFaraiandCalcs
                 join t1 in office.ofcBWorkGroups on t.numWorkGroupRef equals t1.numWorkGroupCode
                 join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
                 join t3 in office.ofcPersonelBankInfos on t.numPersonelRef equals t3.numPersonelRef into join_t3
                 from t3 in join_t3.DefaultIfEmpty()
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
                       (t.numMonthJob == month || month == -1)
                       &&
                       t.numYear == year
                       &&
                       ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                       &&
                       t.numStatus == 0
                 orderby t.numPersonelRef
                 select new
                 {
                     PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                     numPersonelCode = t.numPersonelRef,
                     numcountFaraiand = t.numCountFaraiandProject,
                     numPriceOneFaraiand = t.numPriceOneFaraind,
                     numCalcKhalesFaraiand = t.numPriceCalcFaraindKhales,
                     strBankAccount = t.strBankAccount,
                     strBankName = t.strBankName,
                     t1.strWorkGroupName,
                     t.numFaraiandCalcCode,
                     strfaraiandMonth = EdariFunc.GetMonthName(t.numMonthJob.ToString()),
                     t.numYear,
                     strShebaBank = (t3.strShebaBank != null || t3.strShebaBank != "") ? t3.strShebaBank : "-"
                 });

        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------چک کردن مشاهده آخرین بررسی فرایند ------------------------
    //----------------------------------------------------------------------
    private void CheckPreFaraiand()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
        int year = Convert.ToInt32(context.Request.Form["year"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }


        int cntCheck = (from t in office.ofcPersonelFaraiandCalcs
                        where
                        t.numStatus == 0
                        select new
                        {
                            t.numFaraiandCalcCode
                        }).Count();
        string json = serializer.Serialize((object)cntCheck);
        context.Response.Write(json);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //-----------------------ثبت نهایی فرایند ------------------------
    //----------------------------------------------------------------------
    private void SaveFinalFaraiand()
    {
        string faraiandCode = context.Request.Form["Code"];

        string[] faraiandCodearray = faraiandCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();

        var prefaraiand = office.ofcPersonelFaraiandCalcs.Where(c => c.numStatus == 0 && faraiandCodearray.Contains(c.numFaraiandCalcCode.ToString()));
        foreach (var item in prefaraiand)
        {
            item.numStatus = 1;
            item.dateVarizDate = _PDate.PersianDate;
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
    //-----------------------گزارش سابقه واریز فرایند------------------------
    //----------------------------------------------------------------------
    private void GetRepotFinalVarizFaraiand()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int month = Convert.ToInt32(context.Request.Form["month"]);
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


        var q = (from t in office.ofcPersonelFaraiandCalcs
                 join t1 in office.ofcBWorkGroups on t.numWorkGroupRef equals t1.numWorkGroupCode
                 join t2 in office.ofcPersonels on t.numPersonelRef equals t2.numPersonelCode
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
                       (t.numMonthJob == month || month == -1)
                       &&
                       t.numYear == year
                       &&
                       ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                       &&
                       (t.numStatus == 1 || t.numStatus == 2)
                 select new
                 {
                     PersonelName = t2.strPersonelName + " " + t2.strPersonelFamily,
                     numPersonelCode = t.numPersonelRef,
                     numcountFaraiand = t.numCountFaraiandProject,
                     numPriceOneFaraiand = t.numPriceOneFaraind,
                     numCalcKhalesFaraiand = t.numPriceCalcFaraindKhales,
                     strBankAccount = t.strBankAccount,
                     strBankName = t.strBankName,
                     t1.strWorkGroupName,
                     t.numFaraiandCalcCode,
                     strfaraiandMonth = EdariFunc.GetMonthName(t.numMonthJob.ToString()),
                     t.numYear,
                     t.numStatus,
                     t.dateVarizDate

                 });


        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q.Count();
        var query = q.OrderBy(o => o.dateVarizDate).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();

    }
    //----------------------------------------------------------------------
    //----------------------check List Personeli ke Faraiandi hastan------------------------
    //----------------------------------------------------------------------
    private void GetRepotListPersonelFaraiand()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        //int month = Convert.ToInt32(context.Request.Form["month"]);
        //int year = Convert.ToInt32(context.Request.Form["year"]);
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;
        string[] grohkariRoomArray = { "" };
        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        var q = (from t in office.ofcPersonels
                 join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                 join t7 in office.ofcBWorkGroups on t1.numWorkGroupRef equals t7.numWorkGroupCode into join_t7
                 from t7 in join_t7.DefaultIfEmpty()
                 where
                      (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                      &&
                      t1.numStatus == 1
                     &&
                     ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                     ||
                     (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                     ||
                     name == "")
                     &&
                     (t.strMelliCode == mellicode || mellicode == "")
                     &&
                     (t.numStatus == 2 || t.numStatus == 1)
                     &&
                     ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                     &&
                     t1.numContractKindRef == 3
                     &&
                     t1.numPersonelPadash > 0
                 select new
                 {
                     PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                     t.numPersonelCode,
                     strWorkGroupName = (t7.strWorkGroupName == null || t7.strWorkGroupName == "" ? "نامشخص" : t7.strWorkGroupName),
                 });

        var query = q.OrderBy(o => o.numPersonelCode);
        string json = serializer.Serialize((object)query);
        context.Response.Write(json);
        context.Response.End();
    }

    //----------------------------------------------------------------------
    //-----------------------صفر کردن کارکرد پرسنل قرارداد پیمانکاری ------------------------
    //----------------------------------------------------------------------
    private void SetKarakardeSefrProjecti()
    {
        string PersonelCode = context.Request.Form["PersonelCode"];
        string ItemSearch = context.Request.Form["itemMonthSetKarKardProject"];

        string[] PersonelCodearray = PersonelCode.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();

        string Year = ItemSearch.Split(',')[0];
        string month = ItemSearch.Split(',')[1];

        string datefrom = "", dateTo = "";
        if (month == "1")
        {
            datefrom = (Convert.ToInt32(Year) - 1).ToString() + "/12/21";
            dateTo = Year + "/" + (month.Length == 1 ? "0" + month : month) + "/20";
        }
        else
        {
            datefrom = (Convert.ToInt32(Year) - 1).ToString() + "/" + ((Convert.ToInt32(month) - 1).ToString().Length == 1 ? "0" + (Convert.ToInt32(month) - 1).ToString() : (Convert.ToInt32(month) - 1).ToString()) + "/21";
            dateTo = Year + "/" + (month.Length == 1 ? "0" + month : month) + "/20";
        }

        foreach (var item in PersonelCodearray)
        {
            var contract = (from t in office.ofcPersonelContracts
                            where t.numPersonelRef == Convert.ToInt32(item)
                            &&
                            t.numStatus == 1
                            select new
                            {
                                t.numContractKindRef,
                                t.numContractCode,
                                t.numWorkGroupRef
                            }).FirstOrDefault();
            if (contract != null)
            {
                var checkkarkard = office.ofcPersonelMonthlyJobs.Where(c => c.numPersonelRef == Convert.ToInt32(item) && c.numYear == Convert.ToInt16(Year) && c.numMonthJob == Convert.ToInt16(month) && c.numStatus == 0).FirstOrDefault();
                if (checkkarkard != null) office.ofcPersonelMonthlyJobs.DeleteOnSubmit(checkkarkard);

                office.ofcPersonelMonthlyJobs.InsertOnSubmit(new ofcPersonelMonthlyJob
                {
                    dateStartJobDate = datefrom,
                    dateEndJobDate = dateTo,
                    dateRegisterDate = _PDate.PersianDate,
                    numContractRef = Convert.ToInt32(contract.numContractCode),
                    numMonthJob = Convert.ToInt16(month),
                    numPersonelRef = Convert.ToInt32(item),
                    numYear = Convert.ToInt16(Year),
                    strJobDays = "0",
                    strJobOverTime = "00:00",
                    strJobFriday = "00:00",
                    strJobHoliDay = "00:00",
                    strJobMission = "0",
                    strJobDelay = "00:00",
                    strJobEarly = "00:00",
                    strJobAbsent = "0",
                    strJobExit = "00:00",
                    strJobOverTimeSpecial = "00:00",
                    strJobOverTimeInMission = "00:00",
                    strRegisterUserRef = _ofcUser.strUserCode.Trim(),
                    numStatus = 0,
                    numContractKindRef = contract.numContractKindRef,
                    numCountFaraiandProject = 0,
                    numWorkGroupRef = contract.numWorkGroupRef
                });
            }
        }
        string json = "";
        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1"); // sabt shod
        }
        catch (Exception ex)
        {
            string a = ex.Message;
            json = serializer.Serialize((object)"3"); // khata dar sabt
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    //-----------------------محاسبه مجدد فرایند ------------------------
    //----------------------------------------------------------------------
    private void ReClacFaraiand()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";
        List<lstPersonelReCalc> InvoiceTemp1 = new List<lstPersonelReCalc>();

        InvoiceTemp1 = (from t in office.ofcPersonelFaraiandCalcs
                        where t.numStatus == 0
                        &&
                        arrayInvoiceCode.Contains(t.numFaraiandCalcCode.ToString())
                        select new lstPersonelReCalc
                        {
                            numPersonelRef = (int)t.numPersonelRef,
                            strInvoiceMonth = t.numMonthJob.ToString(),
                            strInvoiceYear = t.numYear.ToString()
                        }).ToList();

        var InvoiceTemp = office.ofcPersonelFaraiandCalcs.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numFaraiandCalcCode.ToString()));
        string month = "", Year = "";
        foreach (var item in InvoiceTemp)
        {
            var faraiandTemp = office.ofcPersonelFaraiands.Where(c => c.numFaraiandCode == item.numFaraiandRef).FirstOrDefault();
            faraiandTemp.numStatus = 0;
        }
        office.ofcPersonelFaraiandCalcs.DeleteAllOnSubmit(InvoiceTemp);
        int checkSubmit = 0;
        try
        {
            office.SubmitChanges();
            checkSubmit = 1;
        }
        catch { }

        if (checkSubmit == 1) // ok bod
        {
            foreach (var itemsss in InvoiceTemp1)
            {
                month = itemsss.strInvoiceMonth;
                Year = itemsss.strInvoiceYear;

                var q = (from t in office.ofcPersonels
                         join t1 in office.ofcPersonelContracts on t.numPersonelCode equals t1.numPersonelRef
                         join t2 in office.ofcPersonelFaraiands on t1.numContractCode equals t2.numContractRef
                         join t5 in office.ofcPersonelBankInfos on t.numPersonelCode equals t5.numPersonelRef into join_t5
                         from t5 in join_t5.DefaultIfEmpty()
                         where
                                 t.numPersonelCode == itemsss.numPersonelRef
                                 &&
                                 t1.numStatus == 1
                                 &&
                                 t2.numStatus == 0
                                 &&
                                 (t2.numMonthJob == Convert.ToInt16(month))
                                 &&
                                 t2.numYear == Convert.ToInt16(Year)
                                 &&
                                 (t.numStatus == 2 || t.numStatus == 1)
                         //&&
                         //!
                         //(numpersonelarray).Contains(t.numPersonelCode)
                         select new
                         {
                             PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                             numPersonelCode = Convert.ToInt32(t.numPersonelCode),
                             numcountFaraiand = t2.numCountFaraiandProject,
                             numPriceOneFaraiand = t1.numPersonelPadash,
                             numCalcKhalesFaraiand = (t1.numPersonelPadash * t2.numCountFaraiandProject),
                             strBankAccount = (t5.strBankAccount == null ? "-" : t5.strBankAccount),
                             strBankName = ((t5.strBankName == null || t5.strBankName == "") ? "-" : t5.strBankName),
                             t1.numContractCode,
                             t1.numWorkGroupRef,
                             t2.numFaraiandCode
                         });

                foreach (var item in q)
                {
                    office.ofcPersonelFaraiandCalcs.InsertOnSubmit(new ofcPersonelFaraiandCalc
                    {
                        numPersonelRef = item.numPersonelCode,
                        dateRegisterDate = _PDate.PersianDate,
                        strRegisterUserRef = _ofcUser.strUserCode,
                        numStatus = 0,
                        numContractRef = item.numContractCode,
                        numCountFaraiandProject = item.numcountFaraiand,
                        numFaraiandRef = item.numFaraiandCode,
                        numMonthJob = Convert.ToInt16(month),
                        numYear = Convert.ToInt16(Year),
                        numPriceCalcFaraindKhales = Convert.ToInt32(item.numCalcKhalesFaraiand),
                        numPriceOneFaraind = item.numPriceOneFaraiand,
                        numWorkGroupRef = item.numWorkGroupRef,
                        strBankAccount = item.strBankAccount,
                        strBankName = item.strBankName
                    });

                    var faraiandDeactive = office.ofcPersonelFaraiands.Where(c => c.numPersonelRef == item.numPersonelCode && c.numMonthJob == Convert.ToInt16(month) && c.numYear == Convert.ToInt16(Year) && c.numStatus == 0).FirstOrDefault();
                    if (faraiandDeactive != null)
                    {
                        faraiandDeactive.numStatus = 1;
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
    //-----------------------حذف محاسبه  فرایند ------------------------
    //----------------------------------------------------------------------
    private void DeleteClacFaraiand()
    {
        string InvoiceCode = context.Request.Form["Code"];
        string[] arrayInvoiceCode = InvoiceCode.Split(',').Where(c => !string.IsNullOrEmpty(c)).ToArray();
        string json = "";

        var InvoiceTemp = office.ofcPersonelFaraiandCalcs.Where(c => c.numStatus == 0 && arrayInvoiceCode.Contains(c.numFaraiandCalcCode.ToString()));
        foreach (var item in InvoiceTemp)
        {
            var faraiandTemp = office.ofcPersonelFaraiands.Where(c => c.numFaraiandCode == item.numFaraiandRef).FirstOrDefault();
            faraiandTemp.numStatus = 0;
        }
        office.ofcPersonelFaraiandCalcs.DeleteAllOnSubmit(InvoiceTemp);
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