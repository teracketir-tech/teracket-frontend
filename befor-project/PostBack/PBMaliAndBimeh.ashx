<%@ WebHandler Language="C#" Class="PBMaliAndBimeh" %>


using System;
using System.Web;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;

public class PBMaliAndBimeh : IHttpHandler, IReadOnlySessionState
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
                    SaveMaliInfoPersonel();// sabte etelate mali personel
                    break;
                case 2:
                    SaveBimehInfoPersonel();// sabte etelate Bimeh personel
                    break;
                case 3:
                    GetAlldrpdwnRegisterPersonel();//دریافت کل دراپ دان ها
                    break;
                case 4:
                    GetAllReportBankInfo();//Gozaresh Etelate shomare hesab
                    break;
                case 5:
                    DeletePersonelBankInfo();//حذف اطلاعات BankInfo
                    break;
                case 6:
                    GetAllReportBimeInfoByPersonelCode();//دریافت اطلاعات بیمه پرسنل
                    break;
                case 7:
                    DeletePersonelBimehInfo();//حذف اطلاعات BimehInfo
                    break;
                case 8:
                    EditPersonelBimehInfo();//edit اطلاعات BimehInfo
                    break;
                case 9:
                    EditPersonelBankInfo();//edit اطلاعات BankInfo
                    break;
                case 10:
                    CheckPersonelcodeForNumberAccount();// check kardane kasani ke shomare hesab nadaran
                    break;
                case 11:
                    CheckPersonelcodeForBimeh();// check kardane kasani ke shomare bimeh nadaran
                    break;
                case 12:
                    SaveBimehPricePersonel();// sabte etelate haghe bime 
                    break;
                case 13:
                    GetAllBimehPricePersonel();// Get All Haghe bime Info
                    break;
            }
        }
    }
    //---------------------------------------------------------------------
    //-------------------------sabte etelate mali personel--------------------------------------------
    //---------------------------------------------------------------------
    private void SaveMaliInfoPersonel()
    {
        string NumberAccont = context.Request.Form["NumberAccont"];
        string BankName = context.Request.Form["BankName"];
        string ShebaBank = context.Request.Form["ShebaBank"];
        string CartNumberBank = context.Request.Form["CartNumberBank"];
        int personelcode = Convert.ToInt32(context.Request.Form["Personelcode"]);
        string json = "";
        var check = office.ofcPersonelBankInfos.Where(c => c.numPersonelRef == personelcode).FirstOrDefault();
        if (check != null)
            json = serializer.Serialize((object)"2"); // ghablan sabt shode
        else
        {
            office.ofcPersonelBankInfos.InsertOnSubmit(new ofcPersonelBankInfo
            {
                numPersonelRef = personelcode,
                strCartNumberBank = CartNumberBank,
                dateRegisterDate = _PDate.PersianDate,
                strBankAccount = NumberAccont,
                strBankName = BankName,
                strRegisterUserRef = _ofcUser.strUserCode,
                strShebaBank = ShebaBank
            });
            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // save ok
            }
            catch
            {
                json = serializer.Serialize((object)"3"); // khata

            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------- sabte etelate Bimeh personel--------------------------------------------
    //---------------------------------------------------------------------
    private void SaveBimehInfoPersonel()
    {
        int BImehKind = Convert.ToInt32(context.Request.Form["BImehKind"]);
        string NumberBimeh = context.Request.Form["NumberBimeh"];
        string CodeGargah = context.Request.Form["CodeGargah"];
        string GargahName = context.Request.Form["GargahName"];
        string StartBimeDate = context.Request.Form["StartBimeDate"];
        string EndBimeDate = context.Request.Form["EndBimeDate"];
        int personelcode = Convert.ToInt32(context.Request.Form["personelcode"]);
        string json = "";
        int checkBimhenew = 0;
        if (BImehKind == 2)
        {
            var check = office.ofcPersonelBimehs.Where(c => c.numPersonelRef == personelcode && c.numStatus == 2).FirstOrDefault();
            if (check != null)
            {
                checkBimhenew = 1;
                json = serializer.Serialize((object)"2"); // ghablan sabt shode
            }
        }

        if (checkBimhenew == 0)
        {
            office.ofcPersonelBimehs.InsertOnSubmit(new ofcPersonelBimeh
            {
                numPersonelRef = personelcode,
                dateRegisterDate = _PDate.PersianDate,
                strRegisterUserRef = _ofcUser.strUserCode,
                dateStartBimehDate = StartBimeDate,
                dateEndBimehDate = (BImehKind == 2 ? "" : EndBimeDate),
                numStatus = Convert.ToInt16(BImehKind),
                strBimehNumber = NumberBimeh,
                strBimehWorkshopCode = CodeGargah,
                strWorkshopName = GargahName
            });
            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // save ok
            }
            catch
            {
                json = serializer.Serialize((object)"3"); // khata

            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------------دریافت کل دراپ دان ها----------------
    //---------------------------------------------------------------------
    private void GetAlldrpdwnRegisterPersonel()
    {

        var workgroup = from t in office.ofcBWorkGroups
                        where t.numStatus == 1
                        select new
                        {
                            value = t.numWorkGroupCode,
                            item = t.strWorkGroupName
                        };


        string json = serializer.Serialize((object)workgroup);
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-------------------------Gozaresh Etelate shomare hesab--------------------------------------------
    //---------------------------------------------------------------------
    private void GetAllReportBankInfo()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
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
                        join t1 in office.ofcPersonelBankInfos on t.numPersonelCode equals t1.numPersonelRef
                        //join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                        join t5 in office.ofcBWorkGroups on t.numWorkGroupRef equals t5.numWorkGroupCode into t5_joined
                        from t5 in t5_joined.DefaultIfEmpty()
                        where
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                            &&
                            (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                        //&&
                        //(string.Compare(t2.dateStartContractDate, DateFrom) >= 0 && string.Compare(t2.dateStartContractDate, DateTo) <= 0)
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t5.strWorkGroupName,
                            t1.strBankAccount,
                            t1.strBankName,
                            t1.strCartNumberBank,
                            t1.strShebaBank,
                            t1.dateRegisterDate,
                            t1.numBankInfoCode
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
    //-------------------------حذف اطلاعات BankInfo-------------------------
    //---------------------------------------------------------------------
    private void DeletePersonelBankInfo()
    {
        int BankInfocode = Convert.ToInt32(context.Request.Form["code"]);

        string json = "";

        var check = office.ofcPersonelBankInfos.Where(c => c.numBankInfoCode == BankInfocode).FirstOrDefault();
        if (check != null)
        {
            try
            {
                office.ofcPersonelBankInfos.DeleteOnSubmit(check);
                //======================================================================================
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // hazf shod
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                json = serializer.Serialize((object)"3"); // khata
            }

        }
        else
        {
            json = serializer.Serialize((object)"2"); // yaft nashod
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------دریافت اطلاعات بیمه پرسنل-------------------
    //---------------------------------------------------------------------
    private void GetAllReportBimeInfoByPersonelCode()
    {
        string personelcode = context.Request.Form["personelcode"];
        string mellicode = context.Request.Form["mellicode"];
        string bimehKind = context.Request.Form["bimehKind"];
        string name = context.Request.Form["PersonelName"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }


        string useraccess = (new string[] { "20800736", "0077567722", "2120264392", "0012937142" }).Contains(_ofcUser.strUserCode) ? "1" : "0";
        var personel = (from t in office.ofcPersonels
                        join t1 in office.ofcPersonelBimehs on t.numPersonelCode equals t1.numPersonelRef
                        // join t2 in office.ofcPersonelContracts on t.numPersonelCode equals t2.numPersonelRef
                        join t5 in office.ofcBWorkGroups on t.numWorkGroupRef equals t5.numWorkGroupCode into t5_joined
                        from t5 in t5_joined.DefaultIfEmpty()
                        where
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                             &&
                             (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                             &&
                             (t1.numStatus == Convert.ToInt32(bimehKind) || bimehKind == "-1")
                             &&
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t5.strWorkGroupName,
                            t1.strBimehNumber,
                            t1.strBimehWorkshopCode,
                            t1.strWorkshopName,
                            t1.dateStartBimehDate,
                            t1.dateEndBimehDate,
                            t1.numBimehCode,
                            t1.numStatus,
                            useraccess
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
    //-------------------------حذف اطلاعات BimehInfo-------------------------
    //---------------------------------------------------------------------
    private void DeletePersonelBimehInfo()
    {
        int BimehInfocode = Convert.ToInt32(context.Request.Form["code"]);

        string json = "";

        var check = office.ofcPersonelBimehs.Where(c => c.numBimehCode == BimehInfocode).FirstOrDefault();
        if (check != null)
        {
            try
            {
                office.ofcPersonelBimehs.DeleteOnSubmit(check);
                //======================================================================================
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // hazf shod
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                json = serializer.Serialize((object)"3"); // khata
            }

        }
        else
        {
            json = serializer.Serialize((object)"2"); // yaft nashod
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-------------------------edit اطلاعات BimehInfo-------------------------
    //---------------------------------------------------------------------
    private void EditPersonelBimehInfo()
    {
        int BImehKind = Convert.ToInt32(context.Request.Form["BImehKind"]);
        string NumberBimeh = context.Request.Form["NumberBimeh"];
        string CodeGargah = context.Request.Form["CodeGargah"];
        string GargahName = context.Request.Form["GargahName"];
        string StartBimeDate = context.Request.Form["StartBimeDate"];
        string EndBimeDate = context.Request.Form["EndBimeDate"];
        int code = Convert.ToInt32(context.Request.Form["code"]);
        string json = "";

        var bimeInfo = office.ofcPersonelBimehs.Where(c => c.numBimehCode == code).FirstOrDefault();
        if (bimeInfo == null)
        {
            json = serializer.Serialize((object)"2"); // yaftnashod
        }
        else
        {
            bimeInfo.strRegisterUserRef = _ofcUser.strUserCode;
            bimeInfo.dateStartBimehDate = StartBimeDate;
            bimeInfo.dateEndBimehDate = EndBimeDate;
            bimeInfo.numStatus = Convert.ToInt16(BImehKind);
            bimeInfo.strBimehNumber = NumberBimeh;
            bimeInfo.strBimehWorkshopCode = CodeGargah;
            bimeInfo.strWorkshopName = GargahName;

            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // save ok
            }
            catch
            {
                json = serializer.Serialize((object)"3"); // khata

            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //-------------------------edit اطلاعات BankInfo-------------------------
    //---------------------------------------------------------------------
    private void EditPersonelBankInfo()
    {
        string NumberAccont = context.Request.Form["NumberAccont"];
        string BankName = context.Request.Form["BankName"];
        string ShebaBank = context.Request.Form["ShebaBank"];
        string CartNumberBank = context.Request.Form["CartNumberBank"];
        int code = Convert.ToInt32(context.Request.Form["code"]);
        string json = "";
        var bankInfo = office.ofcPersonelBankInfos.Where(c => c.numBankInfoCode == code).FirstOrDefault();
        if (bankInfo == null)
            json = serializer.Serialize((object)"2"); // yaft nahod
        else
        {
            bankInfo.strCartNumberBank = CartNumberBank;
            bankInfo.strBankAccount = NumberAccont;
            bankInfo.strBankName = BankName;
            bankInfo.strRegisterUserRef = _ofcUser.strUserCode;
            bankInfo.strShebaBank = ShebaBank;

            try
            {
                office.SubmitChanges();
                json = serializer.Serialize((object)"1"); // save ok
            }
            catch
            {
                json = serializer.Serialize((object)"3"); // khata

            }
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------- check kardane kasani ke shomare hesab nadaran-------------------------
    //---------------------------------------------------------------------
    private void CheckPersonelcodeForNumberAccount()
    {
        string personelcode = context.Request.Form["personelcode"];
        string name = context.Request.Form["name"];
        string mellicode = context.Request.Form["mellicode"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");
        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }


        int?[] personelcodearray = (from t in office.ofcPersonelBankInfos
                                    where (t.strBankAccount != null && t.strBankAccount != "")
                                    select t.numPersonelRef).ToArray();


        var personel = (from t in office.ofcPersonels
                        join t5 in office.ofcBWorkGroups on t.numWorkGroupRef equals t5.numWorkGroupCode into t5_joined
                        from t5 in t5_joined.DefaultIfEmpty()
                        where
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                            &&
                            (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                            &&
                            !(personelcodearray.Contains((int)t.numPersonelCode))
                            &&
                            (t.numStatus == 1 || t.numStatus == 2)
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t5.strWorkGroupName,
                        });
        string json = serializer.Serialize((object)personel.OrderBy(c => c.numPersonelCode));
        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------check kardane kasani ke shomare bimeh nadaran-------------------
    //---------------------------------------------------------------------
    private void CheckPersonelcodeForBimeh()
    {
        string personelcode = context.Request.Form["personelcode"];
        string mellicode = context.Request.Form["mellicode"];
        string bimehKind = context.Request.Form["bimehKind"];
        string name = context.Request.Form["PersonelName"];
        string grohkari = context.Request.Form["grohkari"].Replace("\"", "");

        personelcode = String.IsNullOrEmpty(personelcode) ? "-1" : personelcode;

        string[] grohkariRoomArray = { "" };

        if (grohkari != "-1")
        {
            grohkariRoomArray = grohkari.Split(',');
            grohkari = "";
        }

        int?[] personelcodearray = (from t in office.ofcPersonelBimehs
                                    where (t.strBimehNumber != null && t.strBimehNumber != "")
                                          &&
                                          t.numStatus == 2
                                    select t.numPersonelRef).ToArray();

        var personel = (from t in office.ofcPersonels
                        join t5 in office.ofcBWorkGroups on t.numWorkGroupRef equals t5.numWorkGroupCode into t5_joined
                        from t5 in t5_joined.DefaultIfEmpty()
                        where
                            ((t.strPersonelName.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            (t.strPersonelFamily.Replace("ي", "ی").Replace("ك", "ک").Contains(name.Replace("ي", "ی").Replace("ك", "ک")))
                            ||
                            name == "")
                            &&
                            (t.strMelliCode == mellicode || mellicode == "")
                            &&
                            (t.numPersonelCode == Convert.ToInt32(personelcode) || personelcode == "-1")
                            &&
                            !(personelcodearray.Contains((int)t.numPersonelCode))
                            &&
                            (t.numStatus == 1 || t.numStatus == 2)
                            &&
                            ((grohkariRoomArray).Contains(t.numWorkGroupRef.ToString()) || grohkari == "-1")
                        select new
                        {
                            PersonelName = t.strPersonelName + " " + t.strPersonelFamily,
                            t.numPersonelCode,
                            t5.strWorkGroupName,
                        });
        string json = serializer.Serialize((object)personel.OrderBy(c => c.numPersonelCode));
        context.Response.Write(json);
        context.Response.End();
    }

    //---------------------------------------------------------------------
    //------------------------- sabte etelate Hagh Bimeh personel--------------------------------------------
    //---------------------------------------------------------------------
    private void SaveBimehPricePersonel()
    {
        string month = context.Request.Form["month"];
        string price = context.Request.Form["price"];
        string year = context.Request.Form["year"];
        string json = "";

        office.ofcPersonelHaghBimehs.InsertOnSubmit(new ofcPersonelHaghBimeh
        {
            numMonth = Convert.ToInt32(month),
            dateInsertDate = _PDate.PersianDate,
            numYear = Convert.ToInt32(year),
            numHaghBimehPrice = Convert.ToInt32(price),
            numUserInsertRef = Convert.ToInt32(_ofcUser.strUserCode)
        });
        try
        {
            office.SubmitChanges();
            json = serializer.Serialize((object)"1"); // save ok
        }
        catch
        {
            json = serializer.Serialize((object)"3"); // khata

        }

        context.Response.Write(json);
        context.Response.End();
    }
    //---------------------------------------------------------------------
    //------------------------دریافت اطلاعات حق  بیمه پرسنل-------------------
    //---------------------------------------------------------------------
    private void GetAllBimehPricePersonel()
    {
        string month = context.Request.Form["month"];
        string year = context.Request.Form["year"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        FuncAllEdari EdariFunc = new FuncAllEdari();


        string useraccess = (new string[] { "20800736", "0077567722", "2120264392", "0012937142" }).Contains(_ofcUser.strUserCode) ? "1" : "0";
        var personel = (from t in office.ofcPersonelHaghBimehs
                        where
                            (t.numMonth == Convert.ToInt32(month) || month == "-1")
                            &&
                            t.numYear == Convert.ToInt32(year)
                        select new
                        {
                            t.numHaghBimehPrice,
                            strMonth = EdariFunc.GetMonthName(t.numMonth.ToString()),
                            t.numYear,
                            t.numMonth,
                            useraccess
                        });

        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = personel.Count();
        var query = personel.OrderBy(o => o.numYear).ThenBy(x=> x.numMonth).Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //-----------------------------------------------
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