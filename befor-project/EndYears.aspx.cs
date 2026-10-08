using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class EndYears : System.Web.UI.Page
{
    Function func = new Function();
    h8.h8 _h8 = new h8.h8();
    ofcUser _ofcUser;
    //--------------------------------------------------------------------------------
    private void SetTitlePage(string title)
    {
        Page.Title = "اداری | " + title.Trim();
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["Office"] == null) Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)Session["Office"];
        SetTitlePage("تسویه حساب آخر سال");
        if (func.CheckUserAccess("13", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("13", _ofcUser.strUserCode);

        PersianDateTime _PersianDateTime = new PersianDateTime(0);
        PersianDateAsDropDown _PersianDateAsDropDown = new PersianDateAsDropDown();

         lblDateEidi.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateEidi", _PersianDateTime.PersianDate, "");
        lblDateMorakhasi.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateMorakhasi", _PersianDateTime.PersianDate, "");
    }
}