<%@ WebHandler Language="C#" Class="PBUserManager" %>

using System;
using System.Web;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.SessionState;
public class PBUserManager : IHttpHandler, IReadOnlySessionState
{
    ofcUser _ofcUser;
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    OfficeDataContext office;
    HttpContext context = HttpContext.Current;
    JavaScriptSerializer serializer = new JavaScriptSerializer();

    //----------------------------------------------------------------------
    public void ProcessRequest(HttpContext context)
    {
        string Url = context.Request.Url.Host.Trim().ToLower();
        string HTTP_REFERER = context.Request.ServerVariables["HTTP_REFERER"];
        if (HTTP_REFERER != null && HTTP_REFERER.IndexOf(Url) != -1)
        {
            if (context.Session["Office"] == null) context.Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)context.Session["Office"];
            int input = Convert.ToInt32(context.Request.Form["i"]);
            office = new OfficeDataContext(func.Officecstr.Trim());
            switch (input)
            {
                case 1:
                    GetUser();
                    break;
                case 2:
                    InsertNewUser();
                    break;
                case 3:
                    ChangeUserStatus();
                    break;
                case 4:
                    GetroleDrpdwn();
                    break;
                case 5:
                    SelectUserByUserCode();
                    break;
                case 10:
                    InsertNewUser();
                    break;
                case 13:
                    EditUserInfo();
                    break;
                case 14:
                    GetFuncUserAccess();
                    break;
                case 15:
                    UpdateUserAccess();
                    break;
                case 16:
                    GetRoles();
                    break;
                case 17:
                    GetroleAccess();
                    break;
                case 18:
                    ChangeRoleAccess();
                    break;
                case 19:
                    ChangeRoleName();
                    break;
                case 20:
                    InsertNewRoles();
                    break;
                case 21:
                    DeleteRoles();
                    break;
                case 22:
                    GetDrpDwnPageName();
                    break;
                case 23:
                    GetTabName();
                    break;
                case 24:
                    ChangeRoleAccessTabs();
                    break;
                case 25:
                    GetFuncUserTabAccess();
                    break;
                case 26:
                    UpdateUserTabAccess();
                    break;
                    //case 23:
                    //    NewInsertAccessPage();
                    //    break;
            }
        }
    }
    //----------------------------------------------------------------------
    public void GetUser()
    {
        string UserStatus = context.Request.Form["s"];
        string UserCode = context.Request.Form["c"];
        string json = "";
        if (UserCode != null)
        {
            if (UserCode != null && UserCode != "") UserCode = UserCode.Replace(" ", "");
            var q = from t in office.ofcUsers
                    join t1 in office.ofcRoles on t.numRoleRef equals t1.numRoleCode
                    where
                    (t.numStatus == Convert.ToInt32(UserStatus.Trim()) || UserStatus.Trim() == "-1")
                    &&
                    (t.strUserCode == UserCode || UserCode.Trim() == "")
                    orderby t.strUserName
                    select new
                    {
                        strUserCode = t.strUserCode.Trim(),
                        strUserName = t.strUserName.Trim(),
                        strUserTel = "",
                        strUserMob = "",
                        t1.strRoleName,
                        numUserStatus = t.numStatus,
                        t.numRoleRef
                    };
            json = serializer.Serialize((object)q);
        }
        else
        {
            json = serializer.Serialize((object)"");
        }
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void InsertNewUser()
    {
        HttpContext context = HttpContext.Current;
        string UserCode = context.Request.Form["c"];
        string UserName = context.Request.Form["n"];
        string UserPass = context.Request.Form["p"];
        string UserRole = context.Request.Form["r"];
        op_result _op_result = new op_result();
        try
        {
            var q = from t in office.ofcUsers
                    where t.strUserCode.Trim() == UserCode.Trim()
                    select t;
            if (q == null || q.Count() == 0)
            {
                office.ofcUsers.InsertOnSubmit(new ofcUser
                {
                    numRoleRef = Convert.ToByte(UserRole),
                    numStatus = 1,
                    strUserPassword = UserPass.Trim(),
                    strUserAccess = "",
                    strUserCode = UserCode.Trim(),
                    strUserName = UserName.Trim(),
                    strUserTabAccess = ""
                });
                office.SubmitChanges();
                _op_result.result = "1";
            }
            else
            {
                _op_result.result = "2";
            }
        }
        catch
        {
            _op_result.result = "0";
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void ChangeUserStatus()
    {
        op_result _op_result = new op_result();
        string UserCode = context.Request.Form["c"];
        string UserStatus = context.Request.Form["s"];
        ofcUser q = office.ofcUsers.SingleOrDefault(o => o.strUserCode.ToString() == UserCode.Trim());
        try
        {
            if (q != null)
            {
                q.numStatus = Convert.ToByte(UserStatus);
            }
            office.SubmitChanges();
            _op_result.result = "1";
        }
        catch
        {
            _op_result.result = "0";
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void GetroleDrpdwn()
    {
        var q = from t in office.ofcRoles
                select new
                {
                    t.numRoleCode,
                    t.strRoleName
                };
        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void SelectUserByUserCode()
    {
        string UserCode = context.Request.Form["c"];
        var q = (from t in office.ofcUsers
                 where t.strUserCode == UserCode
                 select new
                 {
                     strPassword = t.strUserPassword.Trim(),
                     strUserName = t.strUserName.Trim(),
                     strUserTel = "",
                     strUserMob = "",
                     t.numRoleRef,
                     strUserAddress = "",
                     strUserCode = t.strUserCode.Trim()
                 }).SingleOrDefault();
        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void EditUserInfo()
    {
        string UserCode = context.Request.Form["c"];
        string UserName = context.Request.Form["n"];
        string UserPass = context.Request.Form["p"];
        string UserRole = context.Request.Form["r"];
        op_result _op_result = new op_result();
        ofcUser q = office.ofcUsers.SingleOrDefault(o => o.strUserCode.ToString() == UserCode.Trim());
        try
        {
            if (q != null)
            {
                q.strUserPassword = UserPass.Trim();
                q.strUserName = UserName.Trim();

                if (q.numRoleRef != Convert.ToInt32(UserRole))
                {
                    q.numRoleRef = Convert.ToByte(UserRole);
                    q.strUserAccess = "";
                    q.strUserTabAccess = "";
                }
            }
            office.SubmitChanges();
            _op_result.result = "1";
        }
        catch
        {
            _op_result.result = "0";
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void GetFuncUserAccess()
    {
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        string UserCode = context.Request.Form["c"];
        string Access = "";
        var q = (from t in office.ofcUsers
                 join t1 in office.ofcRoles on t.numRoleRef equals t1.numRoleCode
                 where t.strUserCode == UserCode.Trim()
                 select new
                 {
                     t1.strRoleAccess,
                     t.strUserAccess,
                     t.numRoleRef
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

                        Access = ArrayRemoveByText(Access.Trim(), (Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString().Trim());



                        //if (Access.StartsWith((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString() + ",") == true)
                        //{
                        //    Access = Access.Replace((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString() + ",", "");
                        //}
                        //else if (Access.StartsWith((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString()) == true)
                        //{
                        //    Access = Access.Replace((Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString(), "");
                        //}
                        //else
                        //{
                        //    Access = Access.Replace("," + (Convert.ToInt32(strUserAccessCity[i].Trim()) * -1).ToString(), "");
                        //}
                    }
                }
            }
        }
        string[] UserAccess = Access.Trim().Split(',');
        var q1 = (from t in office.ofcFunctions
                  where
                  t.numStatus == 1
                  &&
                  ((UserAccess).Contains(t.numFunctionCode.ToString()) || Access == "Admin")
                  select new
                  {
                      t.strFunctionName,
                      t.numFunctionCode,
                      countTab = office.ofcFunctionTabs.Where(c => c.numFunctionRef == t.numFunctionCode).Count(),
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
                                countTab = office.ofcFunctionTabs.Where(c => c.numFunctionRef == t.numFunctionCode).Count(),
                                Access = "0"
                            });
        q1 = q1.Distinct().OrderBy(o => o.numFunctionCode);
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q1.Count();
        var query = q1.Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void UpdateUserAccess()
    {
        string json = String.Empty;
        string UserCode = context.Request.Form["c"];
        string FuncCode = context.Request.Form["f"];
        string FuncUserAccessStatus = context.Request.Form["s"];
        op_result _op_result = new op_result();
        ofcUser user = office.ofcUsers.SingleOrDefault(o => o.strUserCode.ToString() == UserCode.Trim());
        try
        {
            string userrole = user.strUserAccess.Trim();
            int rolecode = Convert.ToInt32(user.numRoleRef);
            if (rolecode != 1)
            {
                ofcRole role = office.ofcRoles.Single(_t => _t.numRoleCode == rolecode);

                string role_access = role.strRoleAccess.Trim();
                int flag = 0;
                string[] array_roletmp = role_access.Split(',');
                foreach (var temp in array_roletmp)
                {
                    if (temp == FuncCode.ToString())
                    {
                        flag = 1;
                    }
                }
                if (FuncUserAccessStatus == "1")
                {
                    if (flag == 0)
                    {

                        //if (userrole == "") userrole = FuncCode.ToString();
                        //else
                        //    userrole = userrole + "," + FuncCode.ToString();


                        userrole = userrole + FuncCode.ToString() + ",";
                    }
                    else if (flag == 1)
                    {
                        // userrole = userrole.Replace(",-" + FuncCode.ToString(), "").Replace("-" + FuncCode.ToString() + ",", "").Replace("-" + FuncCode.ToString(), "");
                        userrole = ArrayRemoveByText(userrole.Trim(), "-" + FuncCode.Trim());
                    }
                }
                else if (FuncUserAccessStatus == "0")
                {
                    if (flag == 0)
                    {
                        //userrole = userrole.Replace("," + FuncCode.ToString(), "").Replace(FuncCode.ToString() + ",", "").Replace(FuncCode.ToString(), "");
                        userrole = ArrayRemoveByText(userrole.Trim(), FuncCode.Trim());
                    }
                    else if (flag == 1)
                    {
                        userrole = userrole + "-" + FuncCode.ToString() + ",";
                        //if (userrole == "") userrole = "-" + FuncCode.ToString();
                        //else
                        //    userrole = userrole + ",-" + FuncCode.ToString();
                    }
                }
                user.strUserAccess = userrole.Trim();
                office.SubmitChanges();
                _op_result.result = "1";
            }
            else
            {
                _op_result.result = "2"; // یعنی ادمین هست و نمی توان دسترسی را تغییر داد
            }
        }
        catch
        {
            _op_result.result = "0";
        }
        json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void GetRoles()
    {
        op_result _op_result = new op_result();
        var q = from t in office.ofcRoles
                select t;
        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void GetroleAccess()
    {
        string RoleCode = context.Request.Form["c"];
        int page = Convert.ToInt32(context.Request.Form["page"]);
        int perpage = Convert.ToInt32(context.Request.Form["perpage"]);
        op_result _op_result = new op_result();
        var q = (from t in office.ofcRoles
                 where t.numRoleCode == Convert.ToInt32(RoleCode)
                 select new
                 {
                     t.strRoleAccess,
                     t.numRoleCode
                 }).SingleOrDefault();
        string[] strRoleAccess = q.strRoleAccess.Split(',');
        var q1 = (from t in office.ofcFunctions
                  where
                  t.numStatus == 1
                  &&
                  ((strRoleAccess).Contains(t.numFunctionCode.ToString()) || q.numRoleCode == 1)
                  select new
                  {
                      t.strFunctionName,
                      t.numFunctionCode,
                      countTab = office.ofcFunctionTabs.Where(c => c.numFunctionRef == t.numFunctionCode).Count(),
                      Access = "1"
                  }).Concat(from t in office.ofcFunctions
                            where
                            t.numStatus == 1
                            &&
                            (!(strRoleAccess).Contains(t.numFunctionCode.ToString()) && q.numRoleCode != 1)
                            select new
                            {
                                t.strFunctionName,
                                t.numFunctionCode,
                                countTab = office.ofcFunctionTabs.Where(c => c.numFunctionRef == t.numFunctionCode).Count(),
                                Access = "0"
                            });
        q1 = q1.OrderBy(o => o.numFunctionCode);
        int take = page * perpage;
        int skip = page == 1 ? 0 : take - perpage;
        int AllRecrdCount = q1.Count();
        var query = q1.Take(take).Skip(skip);
        string json = serializer.Serialize((object)query);
        string bothJson = "[" + json + "," + AllRecrdCount + "]";
        context.Response.Write(bothJson);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void ChangeRoleAccess()
    {
        string RoleCode = context.Request.Form["c"];
        string FuncCode = context.Request.Form["f"];
        string FuncRoleAccessStatus = context.Request.Form["s"];
        op_result _op_result = new op_result();
        ofcRole Role = office.ofcRoles.FirstOrDefault(o => o.numRoleCode.ToString() == RoleCode.Trim());
        try
        {
            if (Role != null && RoleCode.Trim() != "1")
            {
                string temp = Role.strRoleAccess.Trim();
                if (FuncRoleAccessStatus == "1")
                {
                    if (temp != "")
                    {
                        temp = ArrayRemoveByText(temp.Trim(), FuncCode.Trim());
                        temp = temp + FuncCode.ToString() + ",";
                        Role.strRoleAccess = temp.Trim();

                    }
                    else
                    {
                        Role.strRoleAccess = FuncCode.Trim() + ",";
                    }
                }
                else if (FuncRoleAccessStatus == "0")
                {
                    if (temp != "")
                    {
                        Role.strRoleAccess = ArrayRemoveByText(temp.Trim(), FuncCode.Trim());
                    }
                }
            }
            office.SubmitChanges();
            _op_result.result = "1";
        }
        catch
        {
            _op_result.result = "0";
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void ChangeRoleName()
    {
        string RoleCode = context.Request.Form["c"];
        string RoleName = context.Request.Form["n"];
        op_result _op_result = new op_result();
        ofcRole q = office.ofcRoles.SingleOrDefault(o => o.numRoleCode.ToString() == RoleCode.Trim());
        try
        {
            if (q != null)
            {
                q.strRoleName = RoleName.Trim();
            }
            office.SubmitChanges();
            _op_result.result = "1";
        }
        catch
        {
            _op_result.result = "0";
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void InsertNewRoles()
    {
        string rolename = context.Request.Form["rolename"];
        op_result _op_result = new op_result();

        int RolenameCheck = office.ofcRoles.Where(o => o.strRoleName.Trim() == rolename.Trim()).Count();
        try
        {
            if (RolenameCheck > 0)
            {
                _op_result.result = "5";
            }
            else
            {
                office.ofcRoles.InsertOnSubmit(new ofcRole
                {
                    strRoleName = rolename.Trim(),
                    strRoleAccess = "",
                    numStatus = 1,
                    strTabsAccess = "",
                });
                office.SubmitChanges();
                _op_result.result = "1";
            }
        }
        catch (Exception ex)
        {
            _op_result.result = "15";
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void DeleteRoles()
    {
        int roleCode = Convert.ToInt32(context.Request.Form["roleCode"]);
        op_result _op_result = new op_result();

        var Roles = office.ofcRoles.Where(o => o.numRoleCode == roleCode).FirstOrDefault();
        try
        {
            if (Roles != null)
            {

                int checkRoleCount = office.ofcUsers.Where(c => c.numRoleRef == roleCode).Count();
                if (checkRoleCount == 0)
                {
                    office.ofcRoles.DeleteOnSubmit(Roles);
                    office.SubmitChanges();
                    _op_result.result = "1"; // حذف شد
                }
                else
                {
                    _op_result.result = "2"; // این نقش استفاده شده است
                }

            }
            else
            {
                _op_result.result = "5"; // این نقش وجود ندارد
            }
        }
        catch
        {
            _op_result.result = "15"; // خطا
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void GetDrpDwnPageName()
    {
        var q = from t in office.ofcFunctions
                select new
                {
                    t.numFunctionCode,
                    t.strFunctionName
                };
        string json = serializer.Serialize((object)q);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void GetTabName()
    {
        string PageCode = context.Request.Form["pageCode"];
        string RoleCode = context.Request.Form["RoleCode"];

        op_result _op_result = new op_result();
        var q = (from t in office.ofcRoles
                 where t.numRoleCode == Convert.ToInt32(RoleCode)
                 select new
                 {
                     t.strTabsAccess,
                     t.numRoleCode
                 }).SingleOrDefault();

        // string[] strRoleAccess = q.strTabsAccess.Split(',');
        string RoleTabAccess = q.strTabsAccess == null || q.strTabsAccess == "" ? "" : q.strTabsAccess;
        string[] RoleTabAccessArray = RoleTabAccess.Split(',').Where(x => !string.IsNullOrEmpty(x) && x.Split('^')[0] == PageCode).Select(c => c.Replace(PageCode + "^", "")).ToArray();


        var q1 = (from t in office.ofcFunctionTabs
                  where
                  t.numStatus == 1
                  &&
                  ((RoleTabAccessArray).Contains(t.numPageTab.ToString()) || q.numRoleCode == 1)
                  &&
                  t.numFunctionRef == Convert.ToInt32(PageCode)
                  select new
                  {
                      t.strPageTabName,
                      t.numId,
                      t.numPageTab,
                      Access = "1"
                  }).Concat(from t in office.ofcFunctionTabs
                            where
                            t.numStatus == 1
                            &&
                            (!(RoleTabAccessArray).Contains(t.numPageTab.ToString()) && q.numRoleCode != 1)
                            &&
                            t.numFunctionRef == Convert.ToInt32(PageCode)

                            select new
                            {
                                t.strPageTabName,
                                t.numId,
                                t.numPageTab,
                                Access = "0"
                            });
        q1 = q1.OrderBy(o => o.numPageTab);

        string json = serializer.Serialize((object)q1);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void ChangeRoleAccessTabs()
    {
        string RoleCode = context.Request.Form["RoleCode"];
        string TabCode = context.Request.Form["TabCode"];
        string Status = context.Request.Form["Status"];
        string pageCode = context.Request.Form["pageCode"];

        string NumTabCode = office.ofcFunctionTabs.Where(c => c.numId == Convert.ToInt32(TabCode.Trim())).FirstOrDefault().numPageTab.ToString();
        string tabAccess = pageCode.Trim() + "^" + NumTabCode.Trim();

        op_result _op_result = new op_result();
        ofcRole Role = office.ofcRoles.SingleOrDefault(o => o.numRoleCode.ToString() == RoleCode.Trim());
        try
        {
            if (Role != null && RoleCode.Trim() != "1")
            {
                string temp = (Role.strTabsAccess == null || Role.strTabsAccess == "") ? "" : Role.strTabsAccess.Trim();
                if (Status == "1")
                {
                    if (temp != "")
                    {
                        temp = ArrayRemoveByText(temp.Trim(), tabAccess.Trim());
                        temp = temp + tabAccess + ",";
                        Role.strTabsAccess = temp.Trim();

                        //temp = temp.Replace("," + tabAccess, "").Replace(tabAccess + ",", "").Replace(tabAccess, "");
                        //temp = temp + "," + tabAccess;
                        //Role.strTabsAccess = temp.Trim();
                    }
                    else
                    {
                        Role.strTabsAccess = tabAccess+ ",";
                    }
                }
                else if (Status == "0")
                {
                    if (temp != "")
                    {
                        //temp = temp.Replace("," + tabAccess, "").Replace(tabAccess + ",", "").Replace(tabAccess, "");
                        //Role.strTabsAccess = temp.Trim();
                        Role.strTabsAccess = ArrayRemoveByText(temp.Trim(), tabAccess.Trim());

                    }
                }
            }
            office.SubmitChanges();
            _op_result.result = "1";
        }
        catch
        {
            _op_result.result = "0";
        }
        string json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void GetFuncUserTabAccess()
    {
        string PageCode = context.Request.Form["pageCode"];
        string UserCode = context.Request.Form["UserCode"];
        string Access = "";
        var q = (from t in office.ofcUsers
                 join t1 in office.ofcRoles on t.numRoleRef equals t1.numRoleCode
                 where t.strUserCode == UserCode.Trim()
                 select new
                 {
                     t1.strTabsAccess,
                     t.strUserTabAccess,
                     t.numRoleRef
                 }).SingleOrDefault();

        string[] RoleTabAccessArray1 = { "" };
        string[] RoleTabAccessArray = { "" };
        if (q.numRoleRef == 1)
        {
            Access = "Admin";
        }
        else
        {
            string[] TabAccessArray = { "" };
            string[] TabAccessArray1 = { "" };

            string UserTabAccess = q.strUserTabAccess == null || q.strUserTabAccess == "" ? "" : q.strUserTabAccess;
            string RoleTabAccess = q.strTabsAccess == null || q.strTabsAccess == "" ? "" : q.strTabsAccess;

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

        }
        var q1 = (from t in office.ofcFunctionTabs
                  where
                  t.numStatus == 1
                  &&
                  ((RoleTabAccessArray).Contains(t.numPageTab.ToString()) || Access == "Admin")
                  &&
                  t.numFunctionRef == Convert.ToInt32(PageCode)
                  select new
                  {
                      t.strPageTabName,
                      t.numId,
                      t.numPageTab,
                      Access = "1"
                  }).Concat(from t in office.ofcFunctionTabs
                            where
                            t.numStatus == 1
                            &&
                            (!(RoleTabAccessArray).Contains(t.numPageTab.ToString()) && Access != "Admin")
                            &&
                            t.numFunctionRef == Convert.ToInt32(PageCode)
                            select new
                            {
                                t.strPageTabName,
                                t.numId,
                                t.numPageTab,
                                Access = "0"
                            });
        q1 = q1.Distinct().OrderBy(o => o.numPageTab);

        string json = serializer.Serialize((object)q1);
        context.Response.Write(json);
        context.Response.End();
    }
    //----------------------------------------------------------------------
    public void UpdateUserTabAccess()
    {
        string json = String.Empty;
        string UserCode = context.Request.Form["UserCode"];
        string TabCode = context.Request.Form["TabCode"];
        string Status = context.Request.Form["Status"];
        string pageCode = context.Request.Form["pageCode"];

        op_result _op_result = new op_result();

        string NumTabCode = office.ofcFunctionTabs.Where(c => c.numId == Convert.ToInt32(TabCode.Trim())).FirstOrDefault().numPageTab.ToString();
        string tabAccess = pageCode.Trim() + "^" + NumTabCode.Trim();
        ofcUser user = office.ofcUsers.SingleOrDefault(o => o.strUserCode.ToString() == UserCode.Trim());
        try
        {
            string userrole = String.IsNullOrEmpty(user.strUserTabAccess) ? "" : user.strUserTabAccess;
            int rolecode = Convert.ToInt32(user.numRoleRef);
            if (rolecode != 1)
            {
                ofcRole role = office.ofcRoles.Single(_t => _t.numRoleCode == rolecode);

                string role_access = String.IsNullOrEmpty(role.strTabsAccess) ? "" : role.strTabsAccess;

                int flag = 0;
                string[] array_roletmp = role_access.Split(',');
                foreach (var temp in array_roletmp)
                {
                    if (temp == tabAccess)
                    {
                        flag = 1;
                    }
                }
                if (Status == "1")
                {
                    if (flag == 0)
                    {
                        // userrole = userrole + tabAccess + ",";
                        //userrole = userrole.Replace("," + tabAccess, "").Replace(tabAccess + ",", "").Replace(tabAccess, "") + tabAccess + ",";
                        userrole = ArrayRemoveByText(userrole.Trim(), tabAccess.Trim());
                        userrole = userrole + tabAccess + ",";
                    }
                    else if (flag == 1)
                    {
                        // userrole = userrole.Replace("," + pageCode.Trim() + "^-" + NumTabCode.Trim(), "").Replace(pageCode.Trim() + "^-" + NumTabCode.Trim() + ",", "").Replace(pageCode.Trim() + "^-" + NumTabCode.Trim(), "");
                        userrole = ArrayRemoveByText(userrole.Trim(), (pageCode.Trim() + "^-" + NumTabCode.Trim()));

                    }
                }
                else if (Status == "0")
                {
                    if (flag == 0)
                    {
                        //userrole = userrole.Replace("," + tabAccess, "").Replace(tabAccess + ",", "").Replace(tabAccess, "");
                        userrole = ArrayRemoveByText(userrole.Trim(), tabAccess.Trim());
                    }
                    else if (flag == 1)
                    {
                        //userrole = userrole + "," + pageCode.Trim() + "^-" + NumTabCode.Trim();
                        userrole = ArrayRemoveByText(userrole.Trim(), (pageCode.Trim() + "^-" + NumTabCode.Trim()));
                        userrole = userrole + pageCode.Trim() + "^-" + NumTabCode.Trim() + ",";
                    }
                }
                user.strUserTabAccess = userrole.Trim();
                office.SubmitChanges();
                _op_result.result = "1";
            }
            else
            {
                _op_result.result = "2"; // یعنی ادمین هست و نمی توان دسترسی را تغییر داد
            }
        }
        catch
        {
            _op_result.result = "0";
        }
        json = serializer.Serialize((object)_op_result);
        context.Response.Write(json);
        context.Response.End();
    }
    ////----------------------------------------------------------------------
    //=======================================================================
    public string ArrayRemoveByText(string temp, string code)
    {
        string ret = "";
        string[] array = temp.Split(',').Where(c => !String.IsNullOrEmpty(c) && c.Trim() != code.Trim()).ToArray();
        //var list = new List<string>(array);
        //int index = Array.IndexOf(array, code);
        //list.Remove(index.ToString());
        //array = list.ToArray();

        foreach (var item in array) ret = ret + item + ",";
        return ret;
    }
    //----------------------------------------------------------------------
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}