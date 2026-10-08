using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for PersianDateAsDropDown
/// </summary>
public class PersianDateAsDropDown
{
    const int CachingTime = 180;
    //--------------------------------------------------------------------------------     
    public PersianDateAsDropDown()
    {
    }
    //--------------------------------------------------------------------------------     
    public string GetPersianDateAsDropDownFromCache(string DropDownId, string DefaultDate, string Title)
    {
        HttpContext context = HttpContext.Current;
        string PersianDateAsDropDown = context.Cache["PersianDateAsDropDown"] as string;
        if (context.Cache["PersianDateAsDropDown"] == null)
        {
            PersianDateAsDropDown = GetPersianDateAsDropDownFromMain(DropDownId).Trim();
            context.Cache.Insert("PersianDateAsDropDown", PersianDateAsDropDown, null, DateTime.Now.AddMinutes(CachingTime), TimeSpan.Zero);
        }
        return SetDefaultDate(PersianDateAsDropDown, DefaultDate, Title, DropDownId).Trim();
    }
    //--------------------------------------------------------------------------------     
    private string SetDefaultDate(string PersianDateAsDropDown, string DefaultDate, string Title, string DropDownId)
    {
        char[] separator = { '/' };
        string[] ThisDate = DefaultDate.Split(separator);
        int SelectedPosItem = PersianDateAsDropDown.IndexOf("value=\"" + ThisDate[2] + "\"", PersianDateAsDropDown.IndexOf("<select id=\"day"));
        PersianDateAsDropDown = PersianDateAsDropDown.Insert(SelectedPosItem + 10, " selected=\"selected\" ");

        SelectedPosItem = PersianDateAsDropDown.IndexOf("value=\"" + ThisDate[1] + "\"", PersianDateAsDropDown.IndexOf("<select id=\"month"));
        PersianDateAsDropDown = PersianDateAsDropDown.Insert(SelectedPosItem + 10, " selected=\"selected\" ");

        SelectedPosItem = PersianDateAsDropDown.IndexOf("value=\"" + ThisDate[0] + "\"", PersianDateAsDropDown.IndexOf("<select id=\"year"));
        PersianDateAsDropDown = PersianDateAsDropDown.Insert(SelectedPosItem + 12, " selected=\"selected\" ");

        return PersianDateAsDropDown.Replace("{DropDownTitle}", Title).Replace("{DropDownId}", DropDownId).Trim();
    }
    //--------------------------------------------------------------------------------     
    private string GetPersianDateAsDropDownFromMain(string DropDownId)
    {
        string dayHeader = "<select id=\"day{DropDownId}\"  class=\"InputSelectLeftToRightText\">";
        string dayOption = "<option value=\"{item}\" >{item}</option>";
        string dayFooter = "</select>";
        string itemdayOption = ""; string itemdayOptionAll = "";
        for (int day = 1; day <= 31; day++)
        {
            if (day < 10) itemdayOption = dayOption.Replace("{item}", "0" + day.ToString().Trim());
            else itemdayOption = dayOption.Replace("{item}", day.ToString().Trim());
            itemdayOptionAll += itemdayOption.Trim();
            itemdayOption = "";
        }

        string monthHeader = "<select id=\"month{DropDownId}\"  class=\"InputSelectLeftToRightText\">";
        string monthOption = "<option value=\"{item}\" >{item}</option>";
        string monthFooter = "</select>";
        string itemmonthOption = ""; string itemmonthOptionAll = "";
        for (int month = 1; month <= 12; month++)
        {
            if (month < 10) itemmonthOption = monthOption.Replace("{item}", "0" + month.ToString().Trim());
            else itemmonthOption = monthOption.Replace("{item}", month.ToString().Trim());
            itemmonthOptionAll += itemmonthOption.Trim();
            itemmonthOption = "";
        }

        string yearHeader = "<select id=\"year{DropDownId}\"  class=\"InputSelectLeftToRightText\">";
        string yearOption = "<option value=\"{item}\" >{item}</option>";
        string yearFooter = "</select>";
        string itemyearOption = ""; string itemyearOptionAll = "";
        for (int year = 1392; year <= 1415; year++)
        {
            itemyearOption = yearOption.Replace("{item}", year.ToString().Trim());
            itemyearOptionAll += itemyearOption.Trim();
            itemyearOption = "";
        }
        string output = "<table style=\"width: 175px;\">" +
        "<tr>" +
        "<td>" +
        "{DropDownTitle}" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "{dropdown}" +
        "</td>" +
        "</tr>" +
        "</table>";
        return output.Replace("{dropdown}", dayHeader + itemdayOptionAll + dayFooter + monthHeader + itemmonthOptionAll + monthFooter + yearHeader + itemyearOptionAll + yearFooter);
    }
    //--------------------------------------------------------------------------------     
}