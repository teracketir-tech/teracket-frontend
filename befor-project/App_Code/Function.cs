using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Text;
using System.Data.SqlClient;
using System.Data;

/// <summary>
/// Summary description for Function
/// </summary>
public class Function
{
    const int CachingTime = 180;
    h8.h8 _h8 = new h8.h8();
    public string setapcstr;
    public string usercstr;
    public string Officecstr;
    public int BimehProjectAndSaati = 0; // 9421645; // hoghogh sabet + bon + hagh maskan sale  jari
    public int hoghoghSabet = 0; // hoghogh sabete sale jari
    //--------------------------------------------------------------------------------
    public Function()
    {
        //-------------------------------------------------- asli ------------------------------------------------
        setapcstr = _h8.GetH8(GetCstrFromCache("ws_payeganltdConnectionString"));
        Officecstr = _h8.GetH8(GetCstrFromCache("Office_ConnectionString"));
        //-------------------------------------------------- test ------------------------------------------------
        //setapcstr = "Data Source=BAZIAR-PC\\MSSQLSERVER1;Initial Catalog=payeganltd;Integrated Security=True";
        //Officecstr = "Data Source=BAZIAR-PC\\MSSQLSERVER1;Initial Catalog=Office;Integrated Security=True";
        HttpContext context = HttpContext.Current;

        if (context.Request.Cookies["BimehProjectAndSaati"] != null)
            BimehProjectAndSaati = Convert.ToInt32(context.Request.Cookies["BimehProjectAndSaati"].Value);
        if (context.Request.Cookies["hoghoghSabet"] != null)
            hoghoghSabet = Convert.ToInt32(context.Request.Cookies["hoghoghSabet"].Value);
    }
    //--------------------------------------------------------------------------------
    public string GetCstrFromCache(string what)
    {
        HttpContext context = HttpContext.Current;
        string Cstr = context.Cache["Cstr11" + what.Trim()] as string;
        if (context.Cache["Cstr11" + what.Trim()] == null)
        {
            cstr.Service _cstr = new cstr.Service();
            Cstr = _cstr.GetCstr(what);
            context.Cache.Insert("Cstr11" + what.Trim(), Cstr, null, DateTime.Now.AddMinutes(CachingTime), TimeSpan.Zero);
        }
        return Cstr;
    }
    //-------------------------------------------------------------------------------- 
    private string GetFileContentFromFile(string path)
    {
        WebClient MyWebClient = new WebClient();
        Byte[] PageHTMLBytes;
        PageHTMLBytes = MyWebClient.DownloadData(path);
        UTF8Encoding oUTF8 = new UTF8Encoding();
        string content = oUTF8.GetString(PageHTMLBytes);
        return content;
    }
    //--------------------------------------------------------------------------------             
    public string GetFileContent(string path)
    {
        string IsCacheFileContent = "0"; string content = "";
        if (IsCacheFileContent == "1")
        {
            HttpContext context = HttpContext.Current;
            content = context.Cache[path] as string;
            if (context.Cache[path] == null)
            {
                content = GetFileContentFromFile(path);
                context.Cache.Insert(path, content, null, DateTime.Now.AddMinutes(CachingTime), TimeSpan.Zero);
            }
        }
        else content = GetFileContentFromFile(path);
        return content;
    }
    //--------------------------------------------------------------------------------             
    public string GetMenuContent(string input)
    {
        HttpServerUtility server = HttpContext.Current.Server;
        string MainFile = GetFileContent(server.MapPath("~") + "/Html/" + input);
        return MainFile.Trim();
    }
    //--------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------
    //public string GetUserAccess(string UserCode)
    //{
    //    ofcUser user = pltd.ofcUsers.SingleOrDefault(o => o.strUserCode.ToString() == UserCode.Trim());
    //    string UA = user.strUserAccessCity.Trim();
    //    if (user != null)
    //    {
    //        if (UA == "")
    //            return "-1";
    //        else
    //            return UA;
    //    }
    //    else
    //        return "-1";
    //}
    //--------------------------------------------------------------------------------
    public string InputKhat(string OrderCode)
    {
        OrderCode = OrderCode.Replace("-", "");
        string ret = OrderCode;
        if (OrderCode != "" && OrderCode.Length >= 10)
        {
            ret = OrderCode.Insert(2, "-");
            ret = ret.Insert(7, "-");
            ret = ret.Trim();
        }
        return ret;
    }
    //--------------------------------------------------------------------------------
    public string SetOrderDash(string OrderCode)
    {
        OrderCode = OrderCode.Replace("-", "");
        string ret = OrderCode;
        if (OrderCode != "" && OrderCode.Length >= 20)
        {
            ret = OrderCode.Insert(5, "-").Insert(11, "-").Insert(13, "-").Insert(18, "-").Insert(20, "-").Insert(22, "-").Insert(25, "-");
            ret = ret.Trim();
        }
        return ret;
    }
    //--------------------------------------------------------------------------------
    public string CheckUserAccess(string PageCode, string UserCode)
    {
        string Access = "";
        OfficeDataContext office = new OfficeDataContext(Officecstr.Trim());
        var q = (from t in office.ofcUsers
                 join t1 in office.ofcRoles on t.numRoleRef equals t1.numRoleCode
                 where t.strUserCode == UserCode.Trim()
                 select new
                 {
                     t1.strRoleAccess,
                     t.strUserAccess,
                     t.numRoleRef
                 }).SingleOrDefault();
        int[] UserAccInts = { };
        int[] RoleInts = { };
        string[] strUserAccess = q.strUserAccess.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        string[] strRoleAccess1 = q.strRoleAccess.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
        if (strUserAccess.Length >= 1)
        {
            strUserAccess = strUserAccess.Where(x => !string.IsNullOrEmpty(x)).ToArray();
            UserAccInts = Array.ConvertAll(strUserAccess, s => int.Parse(s));
        }
        //Dastrasihaye User
        if (q.numRoleRef == 1)
        {
            Access = "Admin";
        }
        else
        {
            strRoleAccess1 = strRoleAccess1.Where(x => !string.IsNullOrEmpty(x)).ToArray();
            RoleInts = Array.ConvertAll(strRoleAccess1, s => int.Parse(s));                  //Dastrasihaye Role
        }

        if (strUserAccess.Length >= 1)
        {
            for (int i = 0; i < UserAccInts.Length; i++)
            {
                if (UserAccInts[i] < 0)
                {
                    int numToRemove = ~UserAccInts[i] + 1;
                    RoleInts = RoleInts.Where(val => val != numToRemove).ToArray();
                }
            }
        }
        int[] PositiveFunc = UserAccInts.Where(i => i > 0).ToArray();
        string[] PositiveFunc1 = PositiveFunc.Select(x => x.ToString()).ToArray();
        string[] FinalRoleInts = RoleInts.Select(x => x.ToString()).ToArray();
        string[] FinalAccessFanc = PositiveFunc1.Union(FinalRoleInts).ToArray();

        if (FinalAccessFanc.Contains(PageCode) || q.numRoleRef == 1)
        {
            return "1";
        }
        else { return "-1"; }
    }
    //--------------------------------------------------------------------------------
    public string DrpDwnDesign(List<DropDownDes> DrpList, string DrpName, string DefOptText, string DefOptVal, string DrpWidth, string DrpClass, string OnChangeAct, string Multiple, string PlaceHolder)
    {
        string DefOpt = "";
        if (Multiple == "")
        {
            DefOpt = "<option value='" + DefOptVal + "'>" + DefOptText + "</option>";
        }
        string Result = "";
        string AgencyDrpHead = "<select name='" + DrpName + "' id='" + DrpName + "' {Multiple} {Class} {Width} {onchange} >";
        if (Multiple != "")
        {
            AgencyDrpHead = AgencyDrpHead.Replace("{Width}", "width='" + DrpWidth + "'").Replace("{Multiple}", "multiple='multiple' size='5' ");
        }
        else
        {
            AgencyDrpHead = AgencyDrpHead.Replace("{Width}", "style='width: " + DrpWidth + "'").Replace("{Multiple}", "");
        }
        if (OnChangeAct != "")
        {
            AgencyDrpHead = AgencyDrpHead.Replace("{onchange}", "onchange='" + OnChangeAct + "'");
        }
        else
        {
            AgencyDrpHead = AgencyDrpHead.Replace("{onchange}", "");
        }
        if (DrpClass != "")
        {
            AgencyDrpHead = AgencyDrpHead.Replace("{Class}", "class='" + DrpClass + "'");
        }
        else
        {
            AgencyDrpHead = AgencyDrpHead.Replace("{Class}", "");
        }
        string AgencyDrpMainRow = "<option value='<optValue>'><optText></option>";
        string AgencyDrpFooter = "</select>";
        string CopyRow = "";
        string AllRow = "";
        foreach (var item in DrpList)
        {
            CopyRow = AgencyDrpMainRow.Replace("<optValue>", item.drpdwnValue);
            CopyRow = CopyRow.Replace("<optText>", item.drpdwnText);
            AllRow = AllRow + CopyRow;
        }
        if (DefOptVal != "")
            Result = AgencyDrpHead + DefOpt + AllRow + AgencyDrpFooter;
        else
            Result = AgencyDrpHead + AllRow + AgencyDrpFooter;
        return Result;
    }
    //--------------------------------------------------------------------------------
    public string OrderLtdToOrderAbnama(string OrderCode)
    {
        if (OrderCode.Trim() != "")
        {
            OrderCode = OrderCode.Substring(2, OrderCode.Length - 2);
            OrderCode = "64" + OrderCode.Replace("-", "");
            return OrderCode;
        }
        else return OrderCode;
    }
    //--------------------------------------------------------------------------------
    public string OrderAbnamaToOrderLtd(string OrderCode)
    {
        if (OrderCode.Trim() != "")
        {
            OrderCode = OrderCode.Substring(2, OrderCode.Length - 2);
            OrderCode = "13" + OrderCode.Replace("-", "");
            OrderCode = InputKhat(OrderCode);
            return OrderCode;
        }
        else return OrderCode;

    }
    //----------------------------دریافت دو وضعیت جدید مکانیزه---------------------
    //public string GetNewStatusMekanize(string strordercode, int type)
    //{
    //    pltdDataContext pltd = new pltdDataContext(setapcstr.Trim());
    //    string title = "";
    //    title = pltd.GetNewStatusMekanize(strordercode, type);
    //    return title;
    //}
    //--------------------------------------------------------------------------------
    public int GetExtraPriceAndDiscount(int Type, int? numExtraPrice, int? numSendPrice, int? numOrderDiscountPrice, int? numOrderBazaryabRef, int? numOrderSalesRoomRef, int? numOrderBPayTypeRef, int? numAbnamaIncom, int? numOrderRegisterDate)
    {
        if (numAbnamaIncom == null) numAbnamaIncom = 0;
        if (numOrderDiscountPrice == null) numOrderDiscountPrice = 0;
        if (numSendPrice == null) numSendPrice = 0;
        if (numExtraPrice == null) numExtraPrice = 0;
        int result = 0;
        //*********************************************************************************************
        if (Type == 1 || Type == 3)  //calcute extra price
        {
            if (numOrderBPayTypeRef != 1 || numOrderSalesRoomRef == 9008 || numOrderSalesRoomRef == 9098)
            {

                if (numOrderSalesRoomRef == 9008 || numOrderBPayTypeRef != 1) result = Convert.ToInt32((-1) * (numSendPrice - numAbnamaIncom));
                else result = Convert.ToInt32(numAbnamaIncom);
            }
            else
            {
                if (((new int?[] { 6, 12, 7, 9, 10 }).Contains(numOrderBazaryabRef) || numOrderRegisterDate == 1) && numOrderDiscountPrice > 0)
                {
                    if (numExtraPrice + numSendPrice - numOrderDiscountPrice <= 0)
                    {
                        result = Convert.ToInt32(numAbnamaIncom - numSendPrice);
                    }
                    else if (numSendPrice - numAbnamaIncom + numOrderDiscountPrice > numExtraPrice + numSendPrice)
                    {
                        result = Convert.ToInt32((numExtraPrice + numSendPrice) - (numSendPrice - numAbnamaIncom + numOrderDiscountPrice));
                    }
                    else if (numExtraPrice + numSendPrice - numOrderDiscountPrice > 0 && numExtraPrice > numOrderDiscountPrice)
                    {
                        result = Convert.ToInt32(numExtraPrice + numAbnamaIncom - numOrderDiscountPrice);
                    }
                    else if (numExtraPrice + numSendPrice - numOrderDiscountPrice > 0 && numExtraPrice < numOrderDiscountPrice)
                    {
                        result = Convert.ToInt32(numExtraPrice + numAbnamaIncom - numOrderDiscountPrice);
                    }
                }
                else
                {
                    if (numExtraPrice - numOrderDiscountPrice <= 0 && numExtraPrice > 0)
                    {
                        result = Convert.ToInt32(numAbnamaIncom);
                    }
                    else
                    {
                        result = Convert.ToInt32(numExtraPrice + numAbnamaIncom - numOrderDiscountPrice);
                    }
                }
            }
        }
        else if (Type == 2)  //calcute send price
        {

            //if (((new int?[] { 6, 12, 7, 9, 10 }).Contains(numOrderBazaryabRef) || numOrderRegisterDate == 1) && numOrderDiscountPrice > 0)
            //{
            //    if (numExtraPrice + numSendPrice - numOrderDiscountPrice <= 0)
            //    {
            //        result = Convert.ToInt32(numAbnamaIncom - numSendPrice);
            //    }
            //    else if (numSendPrice - numAbnamaIncom + numOrderDiscountPrice > numExtraPrice + numSendPrice)
            //    {
            //        result = Convert.ToInt32((numExtraPrice + numSendPrice) - (numSendPrice - numAbnamaIncom + numOrderDiscountPrice));
            //    }
            //    else if (numExtraPrice + numSendPrice - numOrderDiscountPrice > 0 && numExtraPrice > numOrderDiscountPrice)
            //    {
            //        result = Convert.ToInt32(numExtraPrice + numAbnamaIncom - numOrderDiscountPrice);
            //    }
            //    else if (numExtraPrice + numSendPrice - numOrderDiscountPrice > 0 && numExtraPrice < numOrderDiscountPrice)
            //    {
            //        result = Convert.ToInt32(numExtraPrice + numAbnamaIncom - numOrderDiscountPrice);
            //    }
            //}
            //else
            //{
            result = Convert.ToInt32(numSendPrice - numAbnamaIncom);
            //}
        }

        //*********************************************************************************************
        if (Type == 3) //calcute send price + extra price
        {
            result = result + Convert.ToInt32(numSendPrice - numAbnamaIncom);
        }
        return result;
    }
    //--------------------------------------------------------------------------------
    public string UserTabAccess(string PageCode, string UserCode)
    {
        OfficeDataContext office = new OfficeDataContext(Officecstr.Trim());
        var q = (from t in office.ofcUsers
                 join t1 in office.ofcRoles on t.numRoleRef equals t1.numRoleCode
                 where t.strUserCode == UserCode.Trim()
                 select new
                 {
                     t1.strTabsAccess,
                     t.strUserTabAccess,
                 }).SingleOrDefault();

        //int[] UserTabInts = { };
        //int[] RoleTabInts = { };

        //string[] UserTab = q.strUserTabAccess.Split(',');
        //string[] RoleTab = q.strTabsAccess.Split(',');


        //if (RoleTab.Length >= 1)
        //{
        //    RoleTab = RoleTab.Where(x => !string.IsNullOrEmpty(x)).Select(c=> c.Replace(PageCode+"^","")).ToArray();
        //    RoleTabInts = Array.ConvertAll(RoleTab, s => int.Parse(s));
        //}

        //if (UserTab.Length >= 1)
        //{
        //    UserTab = UserTab.Where(x => !string.IsNullOrEmpty(x)).Select(c => c.Replace(PageCode + "^", "")).ToArray();
        //    UserTabInts = Array.ConvertAll(UserTab, s => int.Parse(s));

        //    for (int i = 0; i < UserTabInts.Length; i++)
        //    {
        //        if (UserTabInts[i] < 0)
        //        {
        //            int numToRemove = ~UserTabInts[i] + 1;
        //            RoleTabInts = RoleTabInts.Where(val => val != numToRemove).ToArray();
        //        }
        //    }
        //}
        //int[] PositiveFunc = UserTabInts.Where(i => i > 0).ToArray();
        //string[] PositiveFunc1 = PositiveFunc.Select(x => x.ToString()).ToArray();
        //string[] FinalRoleInts = RoleTabInts.Select(x => x.ToString()).ToArray();
        //string[] FinalAccessFanc = PositiveFunc1.Union(FinalRoleInts).ToArray();

        string UserTabAccess = q.strUserTabAccess == null || q.strUserTabAccess == "" ? "" : q.strUserTabAccess;
        string RoleTabAccess = q.strTabsAccess == null || q.strTabsAccess == "" ? "" : q.strTabsAccess;

        string result = "";

        if (UserTabAccess != "" || RoleTabAccess != "")
        {
            string[] RoleTabAccessArray1 = { "" };
            string[] RoleTabAccessArray = { "" };
            string[] TabAccessArray = { "" };
            string[] TabAccessArray1 = { "" };

            TabAccessArray1 = UserTabAccess.Split(',').Where(x => !string.IsNullOrEmpty(x) && x.Split('^')[0] == PageCode).Select(c => c.Replace(PageCode + "^", "")).ToArray();
            TabAccessArray = TabAccessArray1.Where(c => Convert.ToInt32(c) < 0 || c == "-0").Select(c => (Convert.ToInt32(c) * -1).ToString()).ToArray();

            RoleTabAccessArray1 = RoleTabAccess.Split(',').Where(x => !string.IsNullOrEmpty(x) && x.Split('^')[0] == PageCode).Select(c => c.Replace(PageCode + "^", "")).ToArray();
            // RoleTabAccessArray = RoleTabAccessArray.Where(c => Convert.ToInt32(c) < 0).Select(c => (Convert.ToInt32(c) * -1).ToString()).ToArray();

            RoleTabAccessArray = RoleTabAccessArray1.Where(c => !TabAccessArray.Contains(c)).ToArray();

            if (RoleTabAccessArray.Length == 0 && TabAccessArray1.Length != 0)
            {
                TabAccessArray = TabAccessArray1.Where(c => Convert.ToInt32(c) >= 0).Select(c => (Convert.ToInt32(c)).ToString()).ToArray();
                RoleTabAccessArray = TabAccessArray;
            }
            else if (RoleTabAccessArray.Length != 0 && TabAccessArray1.Length != 0)
            {
                TabAccessArray = TabAccessArray1.Where(c => Convert.ToInt32(c) >= 0).Select(c => (Convert.ToInt32(c)).ToString()).ToArray();
                RoleTabAccessArray = RoleTabAccessArray.Union(TabAccessArray).ToArray();
            }


            var tabs = office.ofcFunctionTabs.Where(c => c.numFunctionRef == Convert.ToInt32(PageCode) && !RoleTabAccessArray.Contains(c.numPageTab.ToString())).OrderByDescending(c => c.numPageTab);

            foreach (var item in tabs)
            {
                result = result + item.numPageTab.ToString() + ",";
            }
        }


        return result;
    }
    //--------------------------------------------------------------------------------
    public string GetUnicCode(int type, string InputCode)
    {
        string UnicCode = "";
        PersianDateTime _PDate = new PersianDateTime(0);

        if (type == 1) // ایجاد کد گروه دریافتی واحد جمع آوری
        {
            Random rnd = new Random();
            UnicCode = (rnd.Next(1, 9).ToString() + _PDate.NowYear + _PDate.NowMonth + _PDate.NowDay + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString()).Trim();
        }
        else if (type == 2)// ایجاد کد گروه برگشتی به واحد تجزیه مبادلات
        {
            Random rnd = new Random();
            UnicCode = (rnd.Next(100, 999).ToString() + _PDate.NowYear + _PDate.NowMonth + _PDate.NowDay + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString()).Trim();
        }
        else if (type == 3) // ایجاد کد گروه ارسالی به شهرستان
        {
            UnicCode = InputCode + _PDate.NowYear + _PDate.NowMonth + _PDate.NowDay + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString();
        }
        return UnicCode;
    }
}