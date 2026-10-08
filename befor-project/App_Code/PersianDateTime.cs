using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for PersianDateTime
/// </summary>
public class PersianDateTime
{
    public string PersianDate;
    public string PersianTime;
    public string NowDay;
    public string NowMonth;
    public string NowYear;
    //--------------------------------------------------------------------------------            
    public PersianDateTime(int AddedDay)
    {
        Function func = new Function();
        h8.h8 _h8 = new h8.h8();
        OfficeDataContext office = new OfficeDataContext(func.Officecstr.Trim());
        var PCal = office.wsGetPersianDateTimeFloat(AddedDay).FirstOrDefault();
        PersianDate = PCal.PersianDate.Trim();
        PersianTime = PCal.PersianTime.Trim();
        NowDay = PCal.PersianDate.Substring(8, 2);
        NowMonth = PCal.PersianDate.Substring(5, 2);
        NowYear = PCal.PersianDate.Substring(0, 4);
    }
    //--------------------------------------------------------------------------------            
    public string GetDayWeekBynumDayWeek(int DayOfweek)
    {
        string retVal = "";
        switch (DayOfweek)
        {
            case 1:
                retVal = "یکشنبه";
                break;
            case 2:
                retVal = "دوشنبه";
                break;
            case 3:
                retVal = "سه شنبه";
                break;
            case 4:
                retVal = "چهارشنبه";
                break;
            case 5:
                retVal = "پنجشنبه";
                break;
            case 6:
                retVal = "جمعه";
                break;
            case 7:
                retVal = "شنبه";
                break;
        }
        return retVal;
    }
    //--------------------------------------------------------------------------------
    public string NowDateWithDayWeek()
    {
        string retVal = "";
        DateTime thisDate = DateTime.Now;
        thisDate = thisDate.AddMinutes(150);
        DayOfWeek dayWeek = thisDate.DayOfWeek;
        switch (dayWeek)
        {
            case DayOfWeek.Sunday:
                retVal = "یکشنبه";
                break;
            case DayOfWeek.Monday:
                retVal = "دوشنبه";
                break;
            case DayOfWeek.Tuesday:
                retVal = "سه شنبه";
                break;
            case DayOfWeek.Wednesday:
                retVal = "چهارشنبه";
                break;
            case DayOfWeek.Thursday:
                retVal = "پنجشنبه";
                break;
            case DayOfWeek.Friday:
                retVal = "جمعه";
                break;
            case DayOfWeek.Saturday:
                retVal = "شنبه";
                break;
        }
        string strMonth = "";
        switch (NowMonth)
        {
            case "01":
                strMonth = "فروردین";
                break;
            case "02":
                strMonth = "اردیبهشت";
                break;
            case "03":
                strMonth = "خرداد";
                break;
            case "04":
                strMonth = "تیر";
                break;
            case "05":
                strMonth = "مرداد";
                break;
            case "06":
                strMonth = "شهریور";
                break;
            case "07":
                strMonth = "مهر";
                break;
            case "08":
                strMonth = "آبان";
                break;
            case "09":
                strMonth = "آذر";
                break;
            case "10":
                strMonth = "دی";
                break;
            case "11":
                strMonth = "بهمن";
                break;
            case "12":
                strMonth = "اسفند";
                break;

        }
        retVal = retVal + " " + NowDay + " " + strMonth + " " + NowYear;
        return retVal;
    }
    //--------------------------------------------------------------------------------

}