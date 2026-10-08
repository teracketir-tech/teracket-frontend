using System;
using System.Web.UI;

public partial class Contract : System.Web.UI.Page
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
        SetTitlePage("امور قراردادها");
        if (func.CheckUserAccess("1", _ofcUser.strUserCode) == "-1")
        {
            Response.Redirect("AccessDenied.htm");
        }
        if (_ofcUser.numRoleRef != 1) lblAccess.Text = func.UserTabAccess("1", _ofcUser.strUserCode);

        PersianDateTime _PersianDateTime = new PersianDateTime(0);
        PersianDateAsDropDown _PersianDateAsDropDown = new PersianDateAsDropDown();
        lblDateFrom.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateFrom", "1395/01/01", "");
        lblDateTo.Text = _PersianDateAsDropDown.GetPersianDateAsDropDownFromCache("lblDateTo", _PersianDateTime.PersianDate, "");



        OfficeDataContext office = new OfficeDataContext(func.Officecstr.Trim());
        string datestart = "1396/05/01";
        string dateEnd = "1396/05/10";


        int DaykarkardInmonth = Convert.ToInt32(office.CountdateBetweenDate(datestart, dateEnd));

        int startMonth = Convert.ToInt32(datestart.Split('/')[1]);
        int startYear = Convert.ToInt32(datestart.Split('/')[0]);

        int endMonth = Convert.ToInt32(dateEnd.Split('/')[1]);
        int endYear = Convert.ToInt32(dateEnd.Split('/')[0]);

        DateTime Date1 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(datestart.Split('/')[0]), Convert.ToInt32(datestart.Split('/')[1]), Convert.ToInt32(datestart.Split('/')[2]))));
        DateTime Date2 = Convert.ToDateTime(office.UDF_Julian_To_Gregorian(office.UDF_Persian_To_Julian(Convert.ToInt32(dateEnd.Split('/')[0]), Convert.ToInt32(dateEnd.Split('/')[1]), Convert.ToInt32(dateEnd.Split('/')[2]))));
        int months = ((Date2.Year - Date1.Year) * 12) + Date2.Month - Date1.Month;
    }

    //--------------------------------------------------------------------------------
}