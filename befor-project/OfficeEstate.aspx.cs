using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class OfficeEstate : System.Web.UI.Page
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
        SetTitlePage("مدیریت اموال");
        if (func.CheckUserAccess("12", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("12", _ofcUser.strUserCode);

        //PersianDateTime _PersianDateTime = new PersianDateTime(0);
        //PersianDateAsDropDown _PersianDateAsDropDown = new PersianDateAsDropDown();

        //lblDateKharid.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateKharid", _PersianDateTime.PersianDate, "");
        //lblDateOmrMofid.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateOmrMofid", _PersianDateTime.PersianDate, "");

    }
}