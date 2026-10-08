using System;
using System.Linq;
using System.Web;

public partial class MasterPage : System.Web.UI.MasterPage
{
    ofcUser _ofcUser;
    h8.h8 _h8 = new h8.h8();
    //--------------------------------------------------------------------------------
    protected void Page_Load(object sender, EventArgs e)
    {
        PersianDateTime _PersianDateTime = new PersianDateTime(0);
        Function func = new Function();
        OfficeDataContext office = new OfficeDataContext(func.Officecstr.Trim());
        int flag = 0;
        var checkSetting = (from t in office.ofcSettings
                            where
                            t.numStatus == 1
                            //&&
                           // t.numYear == Convert.ToInt16(_PersianDateTime.NowYear)
                            select new
                            {
                                numPriceSalary = t.numPriceSalary == null ? 0 : t.numPriceSalary,
                                numPriceHomeSalary = t.numPriceHomeSalary == null ? 0 : t.numPriceHomeSalary,
                                numPriceBon = t.numPriceBon == null ? 0 : t.numPriceBon,
                            }).FirstOrDefault();
        if (checkSetting != null)
        {
            flag = 1;
        }
        //string a = Context.Request.Cookies["BimehProjectAndSaati"].ToString();
        //string b = Context.Request.Cookies["hoghoghSabet"].ToString();
        if (Session["Office"] == null || (flag==1 && (Context.Request.Cookies["BimehProjectAndSaati"] == null || Context.Request.Cookies["BimehProjectAndSaati"].Value == "0" || Context.Request.Cookies["hoghoghSabet"] == null || Context.Request.Cookies["hoghoghSabet"].Value == "0")))
            Response.Redirect("login.aspx");
        else
            _ofcUser = (ofcUser)Session["Office"];

        if (_ofcUser.numRoleRef != 1)
        {
            if (func.CheckUserAccess("10", _ofcUser.strUserCode) == "-1")
            {
                divResaulContractAll.Visible = false;
            }
            else
            {
                divResaulContractAll.Visible = true;
            }
        }
        menu();

        lblName.Text = _ofcUser.strUserName;
        lblDate.Text = _PersianDateTime.NowDateWithDayWeek();
    }
    //--------------------------------------------------------------------------------
    public void menu()
    {
        Function func = new Function();

        OfficeDataContext office = new OfficeDataContext(func.Officecstr.Trim());
        string Access = "";
        var q = (from t in office.ofcUsers
                 join t1 in office.ofcRoles on t.numRoleRef equals t1.numRoleCode
                 where t.strUserCode == _ofcUser.strUserCode.Trim()
                 select new
                 {
                     t1.strRoleAccess,
                     t.strUserAccess,
                     t.numRoleRef,
                     t.strUserTabAccess,
                     t1.strTabsAccess
                 }).SingleOrDefault();
        if (q.numRoleRef == 1)
        {
            Access = "Admin";
        }
        else
        {
            Access = q.strRoleAccess.Trim();
            string[] strUserAccessCity = q.strUserAccess.Split(',').Where(c => !String.IsNullOrEmpty(c)).ToArray();
            for (int i = 0; i < strUserAccessCity.Length; i++)
            {
                if (strUserAccessCity[i].Trim() != "")
                {
                    if (Convert.ToInt32(strUserAccessCity[i]) > 0)
                    {
                        Access = Access + strUserAccessCity[i].Trim() + ",";
                    }
                    else
                    {
                        if (Access.StartsWith((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString() + ",") == true)
                        {
                            Access = Access.Replace((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString() + ",", "");
                        }
                        else if (Access.StartsWith((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString()) == true)
                        {
                            Access = Access.Replace((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString(), "");
                        }
                        else
                        {
                            Access = Access.Replace("," + (Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString(), "");
                        }
                    }
                }
            }
        }
        string[] UserAccess = Access.Trim().Split(',').Where(c=> !String.IsNullOrEmpty(c)).ToArray();
        var q1 = (from t in office.ofcFunctions
                  where
                  t.numStatus == 1
                  &&
                  ((UserAccess).Contains(t.numFunctionCode.ToString()) || Access == "Admin")
                  select new
                  {
                      t.strFunctionName,
                      t.numFunctionCode,
                      Access = "1"
                  }).Concat(from t in office.ofcFunctions
                            where
                            t.numStatus == 1
                            &&
                            (!(UserAccess).Contains(t.numFunctionCode.ToString()) && Access != "Admin")
                            select new
                            {
                                t.strFunctionName,
                                t.numFunctionCode,
                                Access = "0"
                            });
        q1 = q1.Distinct().OrderBy(o => o.numFunctionCode);
        string Menu = func.GetMenuContent("MenuHtml.htm");

        string UserTabAccess = q.strUserTabAccess == null || q.strUserTabAccess =="" ? "" : q.strUserTabAccess;
        string RoleTabAccess = q.strTabsAccess == null || q.strTabsAccess == "" ? "" : q.strTabsAccess;

        int TabCnt = 1 , cntTabFunc=0 ;
        //int MenuTabAll_27 = 0, MenuTabAll_31=0, MenuTabAll_13_12=0;
        string[] RoleTabAccessArray1 = { "" };
        string[] RoleTabAccessArray = { "" };
        string[] TabAccessArray = { "" };
        string[] TabAccessArray1 = { "" };
        foreach (var item in q1)
        {
            TabCnt = 1;
            if (Access != "Admin" && (UserTabAccess!="" || RoleTabAccess!=""))
            {
                TabAccessArray1 = UserTabAccess.Split(',').Where(x => !string.IsNullOrEmpty(x) && x.Split('^')[0] == item.numFunctionCode.ToString()).Select(c => c.Replace(item.numFunctionCode.ToString() + "^", "")).ToArray();
                TabAccessArray = TabAccessArray1.Where(c => Convert.ToInt32(c) < 0 || c=="-0").Select(c => (Convert.ToInt32(c) * -1).ToString()).ToArray();

                RoleTabAccessArray1 = RoleTabAccess.Split(',').Where(x => !string.IsNullOrEmpty(x) && x.Split('^')[0] == item.numFunctionCode.ToString()).Select(c => c.Replace(item.numFunctionCode.ToString() + "^", "")).ToArray();
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

                var tabs = office.ofcFunctionTabs.Where(c => c.numFunctionRef == item.numFunctionCode && !RoleTabAccessArray.Contains(c.numPageTab.ToString()));
                 cntTabFunc = office.ofcFunctionTabs.Where(c => c.numFunctionRef == item.numFunctionCode).Count();
                if (tabs.Count() > 0)
                    TabCnt = cntTabFunc - tabs.Count();
                foreach (var tabsItem in tabs)
                {
                    Menu = Menu.Replace("id=\"tab" + tabsItem.numId + "\"", "style=\"display: none\"");
                }
            }

            ////------------------------------------- برای دریافت وضعیت منوهایی که خودشان زیر منو هستند
            //if ((new int[] {27}).Contains((int)item.numFunctionCode))
            //{
            //    MenuTabAll_27 = MenuTabAll_27 + TabCnt;
            //}
            //if((new int[] { 31 }).Contains((int)item.numFunctionCode))
            //{
            //    MenuTabAll_31 = MenuTabAll_31 + TabCnt;
            //}
            //if ((new int[] {12,13}).Contains((int)item.numFunctionCode))
            //{
            //    MenuTabAll_13_12 = MenuTabAll_13_12 + TabCnt;
            //}

            //----------------------------------------------------------------------------------------------
            if (TabCnt == 0 && Access != "Admin" && (UserTabAccess != "" || RoleTabAccess != ""))
                Menu = Menu.Replace("id=\"link" + item.numFunctionCode + "\"", "style=\"display: none\"");
            else if(Access != "Admin" && (UserTabAccess == "" && RoleTabAccess == ""))
                Menu = Menu.Replace("id=\"link" + item.numFunctionCode + "\"", "style=\"display: none\"");

            //else if ((MenuTabAll_13_12 == 0 && item.numFunctionCode == 21)) //-----گزارشات را مخفی کند
            //    Menu = Menu.Replace("id=\"link" + item.numFunctionCode + "\"", "style=\"display: none\"");
            //else if(item.numFunctionCode!=22)
            //    Menu = Menu.Replace("id=\"link" + item.numFunctionCode + "\"", item.Access == "0" ? "style=\"display: none\"" : "");
        }
        //if ((MenuTabAll_27 == 0 && MenuTabAll_31==0)) //----- مکانیزه را مخفی کند
        //    Menu = Menu.Replace("id=\"link" + 22 + "\"", "style=\"display: none\"");

        lblMenu.Text = Menu;
    }
    //--------------------------------------------------------------------------------
    protected void nkbtnSignOut_Click(object sender, EventArgs e)
    {
        Session.Clear();
        Session.RemoveAll();
        Session.Abandon();
        Session.Remove("Office");
        if (Request.Cookies["BimehProjectAndSaati"] != null)
        {
            HttpCookie myCookie = new HttpCookie("BimehProjectAndSaati");
            myCookie.Expires = DateTime.Now.AddDays(-1d);
            Response.Cookies.Add(myCookie);
        }
        if (Request.Cookies["hoghoghSabet"] != null)
        {
            HttpCookie myCookie2 = new HttpCookie("hoghoghSabet");
            myCookie2.Expires = DateTime.Now.AddDays(-1d);
            Response.Cookies.Add(myCookie2);
        }
        
        System.Web.Security.FormsAuthentication.SignOut();
        Response.Redirect("login.aspx", false);
    }
}
