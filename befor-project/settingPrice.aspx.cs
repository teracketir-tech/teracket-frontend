using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class SettingPrice : System.Web.UI.Page
{
    Function func = new Function();
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
        SetTitlePage("تنظیمات مالی");
        if (func.CheckUserAccess("11", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("11", _ofcUser.strUserCode);

        PersianDateTime _PersianDateTime = new PersianDateTime(0);
        PersianDateAsDropDown _PersianDateAsDropDown = new PersianDateAsDropDown();

        lblSettingDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblSettingDate", _PersianDateTime.PersianDate, "");
        lblDateYearForMonth.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateYearForMonth", _PersianDateTime.PersianDate, "");

    }
}