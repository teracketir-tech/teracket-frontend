using System;
using System.Web.UI;

public partial class JobCalendar : System.Web.UI.Page
{
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    ofcUser _ofcUser;
    //--------------------------------------------------------------------------------
    private void SetTitlePage(string title)
    {
        Page.Title = "اداری | " + title.Trim();
    }
    //--------------------------------------------------------------------------------
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["Office"] == null) Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)Session["Office"];
        SetTitlePage("تقویم کاری");
        if (func.CheckUserAccess("1", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("1", _ofcUser.strUserCode);


    }
}