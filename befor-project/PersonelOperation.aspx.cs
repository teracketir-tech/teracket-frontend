using System;
using System.Web.UI;

public partial class PersonelOperation : System.Web.UI.Page
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
        SetTitlePage("کارکرد پرسنل");
        if (func.CheckUserAccess("5", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("5", _ofcUser.strUserCode);


        PersianDateTime _PersianDateTime = new PersianDateTime(0);
        PersianDateTime _PersianDateTime30 = new PersianDateTime(-30);
        PersianDateTime _PersianDateTime60 = new PersianDateTime(-60);
        PersianDateAsDropDown _PersianDateAsDropDown = new PersianDateAsDropDown();

        lblMissonDateFrom.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblMissonDateFrom", _PersianDateTime.PersianDate, "");
        lblMissonDateTo.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblMissonDateTo", _PersianDateTime.PersianDate, "");

        lblDateFromMorakhasiRozaneh.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateFromMorakhasiRozaneh", _PersianDateTime.PersianDate, "");
        lblDateToMorakhasiRozaneh.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateToMorakhasiRozaneh", _PersianDateTime.PersianDate, "");

        lblDateFromRozane.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateFromRozane", _PersianDateTime60.NowYear+"/"+ _PersianDateTime60.NowMonth+"/21", "");
        lblDateToRozane.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateToRozane", _PersianDateTime30.NowYear + "/" + _PersianDateTime30.NowMonth + "/20", "");

        lblMonthKarkardMahanehDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblMonthKarkardMahanehDate", _PersianDateTime.PersianDate, "");
        lblMorakhsiMonthDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblMorakhsiMonthDate", _PersianDateTime.PersianDate, "");
        
    }
    //--------------------------------------------------------------------------------
}