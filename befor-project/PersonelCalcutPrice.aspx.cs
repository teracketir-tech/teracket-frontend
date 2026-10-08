using System;
using System.Web.UI;

public partial class PersonelCalcutPrice : System.Web.UI.Page
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
        SetTitlePage("پرداختی پرسنل");
        if (func.CheckUserAccess("6", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("6", _ofcUser.strUserCode);

        PersianDateTime _PersianDateTime = new PersianDateTime(0);
        PersianDateAsDropDown _PersianDateAsDropDown = new PersianDateAsDropDown();

        lblDateFromVam.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateFromVam", _PersianDateTime.PersianDate, "");
        lblDateToVam.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateToVam", _PersianDateTime.PersianDate, "");

        lblKarkardPriceDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblKarkardPriceDate", _PersianDateTime.PersianDate, "");
        lblReportDescYear.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblReportDescYear", _PersianDateTime.PersianDate, "");
        lblReportKosorYear.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblReportKosorYear", _PersianDateTime.PersianDate, "");


        lblDatePadashDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDatePadashDate", _PersianDateTime.PersianDate, "");
        lblSearchPadashDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblSearchPadashDate", _PersianDateTime.PersianDate, "");
        lblMosaedeDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblMosaedeDate", _PersianDateTime.PersianDate, "");
        lblSearchMosaedeDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblSearchMosaedeDate", _PersianDateTime.PersianDate, "");
        lblFaraiandKarkardhDate.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblFaraiandKarkardhDate", _PersianDateTime.PersianDate, "");
        
    }
}