using System;
using System.Web.UI;

public partial class UserManager : System.Web.UI.Page
{
    ofcUser _ofcUser;
    Function func = new Function();
    //--------------------------------------------------------------------------------
    private void SetTitlePage(string title)
    {
        Page.Title = "اداری | " + title.Trim();
    }
    //--------------------------------------------------------------------------------
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["Office"] == null) Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)Session["Office"];
        SetTitlePage("مدیریت کاربر");
        if (func.CheckUserAccess("8", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("8", _ofcUser.strUserCode);
    }
    //--------------------------------------------------------------------------------
}