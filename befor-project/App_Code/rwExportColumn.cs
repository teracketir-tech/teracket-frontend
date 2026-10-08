using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for rwExportColumn
/// </summary>
public class rwExportColumn
{
	public rwExportColumn()
	{
		//
		// TODO: Add constructor logic here
		//
	}
    /// <summary>
    /// 
    /// </summary>
    /// <param name="ColumnName">form bind</param>
    /// <param name="ColumnTitle">for show</param>
    /// <param name="FormatColumn">"\@" : text , "Percent":	Percent - two decimal ... anvae an entehaye rwExportColumn amade ast </param>
    public rwExportColumn(string ColumnName, string ColumnTitle,string FormatColumn)
    {
        strColumnName = ColumnName;
        strColumnTitle = ColumnTitle;
        strFormatColumn = FormatColumn;
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="ColumnName">form bind</param>
    /// <param name="ColumnTitle">for show</param>
    public rwExportColumn(string ColumnName, string ColumnTitle)
    {
        strColumnName = ColumnName;
        strColumnTitle = ColumnTitle;
        
    }
    private string _strColumnName;
    private string _strColumnTitle;
    private string _strFormatColumn;

   
    public string strColumnName
    {
        set
        {
            _strColumnName = value;
        }
        get
        {
            return _strColumnName;
        }
    }
    //---------------
    public string strColumnTitle
    {
        set
        {
            _strColumnTitle = value;
        }
        get
        {
            return _strColumnTitle;
        }
    }
    //---------------
    public string strFormatColumn
    {
        set
        {
            _strFormatColumn = value;
        }
        get
        {
            return _strFormatColumn;
        }
    }
    //---------------
    

//mso-number-format:"0"	NO Decimals
//mso-number-format:"0\.000"	3 Decimals
//mso-number-format:"\#\,\#\#0\.000"	Comma with 3 dec
//mso-number-format:"mm\/dd\/yy"	Date7
//mso-number-format:"mmmm\ d\,\ yyyy"	Date9
//mso-number-format:"m\/d\/yy\ h\:mm\ AM\/PM"	D -T AMPM
//mso-number-format:"Short Date"	01/03/1998
//mso-number-format:"Medium Date"	01-mar-98
//mso-number-format:"d\-mmm\-yyyy"	01-mar-1998
//mso-number-format:"Short Time"	5:16
//mso-number-format:"Medium Time"	5:16 am
//mso-number-format:"Long Time"	5:16:21:00
//mso-number-format:"Percent"	Percent - two decimals
//mso-number-format:"0%"	Percent - no decimals
//mso-number-format:"0\.E+00"	Scientific Notation
//mso-number-format:"\@"	Text
//mso-number-format:"\#\ ???\/???"	Fractions - up to 3 digits (312/943)
//mso-number-format:"\0022£\0022\#\,\#\#0\.00"	£12.76
//mso-number-format:"\#\,\#\#0\.00_ \;\[Red\]\-\#\,\#\#0\.00\ "	 2 decimals, negative numbers in red and signed (1.56 -1.56)
//mso-number-format:”\\#\\,\\#\\#0\\.00_\\)\\;\\[Black\\]\\\\(\\#\\,\\#\\#0\\.00\\\\)”   Accounting Format –5,(5)
}
