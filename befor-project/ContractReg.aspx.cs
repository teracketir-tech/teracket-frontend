using System;
using System.Web.UI;

public partial class ContractReg : System.Web.UI.Page
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
        SetTitlePage("اطلاعات پرسنل");
        if (func.CheckUserAccess("3", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("3", _ofcUser.strUserCode);


        PersianDateTime _PersianDateTime = new PersianDateTime(0);
        PersianDateAsDropDown _PersianDateAsDropDown = new PersianDateAsDropDown();
        lblDateFrom.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateFrom", _PersianDateTime.PersianDate, "");
        lblDateTo.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateTo", _PersianDateTime.PersianDate, "");

    }
    //--------------------------------------------------------------------------------
}