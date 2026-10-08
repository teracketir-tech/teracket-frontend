using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

/// <summary>
/// Summary description for TableCls
/// </summary>
public class TableCls
{
    //--------------------------------------------------------------------------------     
	public TableCls()
	{
    }
    //--------------------------------------------------------------------------------     
    public string ArrayToHtmlTable(string path, string[,] array, int w)
    {
        string retVal = "";
        try
        {
            using (StreamReader sr = new StreamReader(path))
            {
                String line;
                string style1 = "", style2 = "", title = "";
                int r = array.GetUpperBound(0);
                int c = array.GetUpperBound(1);
                while ((line = sr.ReadLine()) != null)
                {
                    if (line.IndexOf("context") != -1)
                    {
                        //title
                        retVal += "<tr>";
                        for (int j = 0; j <= c; j++) retVal = retVal + title + array[0,j] + "</td>";
                        retVal += "</tr>";
                        for (int i = 1; i <= r; i++)
                        {
                            retVal += "<tr>";
                            if (i % 2 == 1)
                            for (int j = 0; j <= c; j++) retVal = retVal + style1 + array[i, j] + "</td>";
                            else
                            for (int j = 0; j <= c; j++) retVal = retVal + style2 + array[i, j] + "</td>";
                            retVal += "</tr>";
                        }
                    }
                    else
                    {
                        if (line.IndexOf("style1") != -1)
                        {
                            int a1 = line.IndexOf("<td");
                            int a2 = line.IndexOf("</td>");
                            style1 = line.Substring(a1, a2 - a1);
                        }
                        else if (line.IndexOf("style2") != -1)
                        {
                            int a1 = line.IndexOf("<td");
                            int a2 = line.IndexOf("</td>");
                            style2 = line.Substring(a1, a2 - a1);
                        }
                        else if (line.IndexOf("title1") != -1)
                        {
                            int a1 = line.IndexOf("<td");
                            int a2 = line.IndexOf("</td>");
                            title = line.Substring(a1, a2 - a1);
                        }
                        else
                        { retVal += line; }
                    }
                }
            }
        }
        catch (Exception e)
        {
            retVal = "The file could not be read:" + e.Message;
        }
        retVal = retVal.Replace("width=", "width=" + w);
        return retVal;
    }
    //--------------------------------------------------------------------------------     
}