using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using System.Configuration;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

/// <summary>
/// Summary description for ExportToExcel
/// </summary>
public class ExportToExcel
{
	 public ExportToExcel()
	{
		//
		// TODO: Add constructor logic here
		//
	}
    //-----------------------------------------------------------------
     public void ExportGridViewToExcel(GridView InputGridView , string ExcelFileName,Page P) 
    {
          P.Response.Clear();

          P.Response.AddHeader("content-disposition", string.Format("attachment;filename={0}.xls", ExcelFileName));
        P.Response.Charset = "";

        P.Response.ContentType = "application/vnd.xls";

        StringWriter stringWrite = new StringWriter();
        HtmlTextWriter htmlWrite = new HtmlTextWriter(stringWrite);

        InputGridView.DataBind();
        
        InputGridView.RenderControl(htmlWrite);
        P.Response.Write(stringWrite.ToString());
        P.Response.Flush();
        P.Response.End();
    
    }
    //-----------------------------------------------------------------------------------
     public void ExportDataTableToExcel(DataTable InputDataTable, string ExcelFileName, List<rwExportColumn> lstColumnName, Page P) 
    {
        P.Response.Clear();

        P.Response.AddHeader("content-disposition", string.Format("attachment;filename={0}.xls", ExcelFileName));
        P.Response.Charset = "";

        P.Response.ContentType = "application/vnd.xls";

        StringWriter stringWrite = new StringWriter();
        HtmlTextWriter htmlWrite = new HtmlTextWriter(stringWrite);

        string ss = ConvertDataTableToHtml(InputDataTable,  lstColumnName);
         
        P.Response.Write(ss);
        P.Response.Flush();
        P.Response.End();
    
    }
    //-----------------------------------------------------------------
      public void ExportListToExcel<T>(IEnumerable<T> InputList , string ExcelFileName,List<rwExportColumn> lstColumnName,Page P) 
    {
        P.Response.Clear();

        P.Response.AddHeader("content-disposition", string.Format("attachment;filename={0}.xls", ExcelFileName));
        P.Response.Charset = "";

        P.Response.ContentType = "application/vnd.xls";

        StringWriter stringWrite = new StringWriter();
        HtmlTextWriter htmlWrite = new HtmlTextWriter(stringWrite);

        string ss = ConvertListToHtml<T>(InputList, lstColumnName);
         
        P.Response.Write(ss);
        P.Response.Flush();
        P.Response.End();
    
    }
    //-----------------------------------------------------------------
    public static string ConvertDataTableToHtml(DataTable targetTable,List<rwExportColumn> lstColumnName)
    {
        string myHtmlFile = "";


        if (targetTable == null)
        {
            throw new System.ArgumentNullException("targetTable");
        }
        else
        {
            //Continue.
        }


        //Get a worker object.
        StringBuilder myBuilder = new StringBuilder();
          
        
        //Open tags and write the top portion.
        myBuilder.Append("<html xmlns='http://www.w3.org/1999/xhtml'>");
        myBuilder.Append("<head>");
        myBuilder.Append("<title>");
        myBuilder.Append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
        myBuilder.Append("Page-");
        myBuilder.Append(Guid.NewGuid().ToString());
        myBuilder.Append("</title>");
        myBuilder.Append("</head>");
        myBuilder.Append("<body>");
        myBuilder.Append("<table border='1px' cellpadding='5' cellspacing='0' ");
        myBuilder.Append("style='border: solid 1px Silver; font-size: x-small;'>");


        //Add the headings row.


        myBuilder.Append("<tr align='left' valign='top' >");


        //foreach (DataColumn myColumn in targetTable.Columns)
        //{
        //    myBuilder.Append("<td align='left' valign='top' >");
        //    myBuilder.Append(myColumn.ColumnName);
        //    myBuilder.Append("</td>");
        //}


        foreach (rwExportColumn Col in lstColumnName)
        {
            myBuilder.Append("<td align='left' valign='top' style='background-color:#31B880;'>");
            myBuilder.Append(Col.strColumnTitle);
            myBuilder.Append("</td>");
        }


        myBuilder.Append("</tr>");


        //Add the data rows.
        foreach (DataRow myRow in targetTable.Rows)
        {
            myBuilder.Append("<tr align='left' valign='top'>");


            //foreach (DataColumn myColumn in targetTable.Columns)
            //{
            //    myBuilder.Append("<td align='left' valign='top'>");
            //    myBuilder.Append(myRow[myColumn.ColumnName].ToString());
            //    myBuilder.Append("</td>");
            //}
            foreach (rwExportColumn Col in lstColumnName)
            {
               // 
                //mso-number-format:\"@\"
                if(Col.strFormatColumn ==null || Col.strFormatColumn =="")
                    myBuilder.Append("<td align='left' valign='top'>");
                else 
                    myBuilder.Append("<td align='left' valign='top' style='mso-number-format:\""+Col.strFormatColumn+"\";'>");
         

                myBuilder.Append(myRow[Col.strColumnName].ToString());

                myBuilder.Append("</td>");
            }


            myBuilder.Append("</tr>");
        }


        //Close tags.
        myBuilder.Append("</table>");
        myBuilder.Append("</body>");
        myBuilder.Append("</html>");


        //Get the string for return.
        myHtmlFile = myBuilder.ToString();


        return myHtmlFile;
    }
    //-----------------------------------------------------------------
    static string ConvertListToHtml<T>(IEnumerable<T> list, List<rwExportColumn> lstColumnName)
        {

         string myHtmlFile = "";

        //Get a worker object.
        StringBuilder myBuilder = new StringBuilder();
          
        
        //Open tags and write the top portion.
        myBuilder.Append("<html xmlns='http://www.w3.org/1999/xhtml'>");
        myBuilder.Append("<head>");
        myBuilder.Append("<title>");
        myBuilder.Append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
        myBuilder.Append("Page-");
        myBuilder.Append(Guid.NewGuid().ToString());
        myBuilder.Append("</title>");
        myBuilder.Append("</head>");
        myBuilder.Append("<body>");
        myBuilder.Append("<table border='1px' cellpadding='5' cellspacing='0' ");
        myBuilder.Append("style='border: solid 1px Silver; font-size: x-small;'>");


        //Add the headings row.


        myBuilder.Append("<tr align='left' valign='top' >");


         //foreach (var info in typeof(T).GetProperties())
         //   {
         //   myBuilder.Append("<td align='left' valign='top'>");
         //   myBuilder.Append(info.Name);
         //   myBuilder.Append("</td>");
         //   }

        foreach (rwExportColumn Col in lstColumnName) 
        {
            myBuilder.Append("<td align='left' valign='top' style='background-color:#31B880;'>");
               myBuilder.Append(Col.strColumnTitle);
               myBuilder.Append("</td>");
        }





        myBuilder.Append("</tr>");



        foreach (var t in list)
        {
            myBuilder.Append("<tr align='left' valign='top'>");

            foreach (rwExportColumn Col in lstColumnName)
            {
               
                if (Col.strFormatColumn == null || Col.strFormatColumn == "")
                    myBuilder.Append("<td align='left' valign='top'>");
                else
                    myBuilder.Append("<td align='left' valign='top' style='mso-number-format:\"" + Col.strFormatColumn + "\";'>");
                if (t.GetType().GetProperty(Col.strColumnName).GetValue(t, null) == null)
                    myBuilder.Append(" ");
                else
                myBuilder.Append(typeof(T).GetProperty(Col.strColumnName).GetValue(t,null).ToString());

                myBuilder.Append("</td>");
            }
            myBuilder.Append("</tr>");
        }


        //Add the data rows.
    
            //foreach (var t in list)
            //{
            //     myBuilder.Append("<tr align='left' valign='top'>");
            //    foreach (var info in typeof(T).GetProperties())
            //    {

            //     myBuilder.Append("<td align='left' valign='top'>");
            //     if (info.GetValue(t, null) != null)
            //         myBuilder.Append(info.GetValue(t, null).ToString());
            //     else
            //     {
            //         myBuilder.Append(" - ");
            //     }
            //     myBuilder.Append("</td>");
            //    }
            //     myBuilder.Append("</tr>");
            //}

        //Close tags.
        myBuilder.Append("</table>");
        myBuilder.Append("</body>");
        myBuilder.Append("</html>");


        //Get the string for return.
        myHtmlFile = myBuilder.ToString();

        return myHtmlFile;


    }
    //-------------------------------------------------------------
    public void ExportLinqToExcel(IQueryable InputLinq, string ExcelFileName, List<rwExportColumn> lstColumnName, Page P)
    {
        P.Response.Clear();

        P.Response.AddHeader("content-disposition", string.Format("attachment;filename={0}.xls", ExcelFileName));
        P.Response.Charset = "";

        P.Response.ContentType = "application/vnd.xls";

        StringWriter stringWrite = new StringWriter();
        HtmlTextWriter htmlWrite = new HtmlTextWriter(stringWrite);

        string ss = ConvertLinqToHtml(InputLinq, lstColumnName);

        P.Response.Write(ss);
        P.Response.Flush();
        P.Response.End();

    }
    //-----------------------------------------------------------------
    public static string ConvertLinqToHtml(IQueryable InputLinq, List<rwExportColumn> lstColumnName)
    {
        string myHtmlFile = "";


      

        //Get a worker object.
        StringBuilder myBuilder = new StringBuilder();


        //Open tags and write the top portion.
        myBuilder.Append("<html xmlns='http://www.w3.org/1999/xhtml'>");
        myBuilder.Append("<head>");
        myBuilder.Append("<title>");
        myBuilder.Append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
        myBuilder.Append("Page-");
        myBuilder.Append(Guid.NewGuid().ToString());
        myBuilder.Append("</title>");
        myBuilder.Append("</head>");
        myBuilder.Append("<body>");
        myBuilder.Append("<table border='1px' cellpadding='5' cellspacing='0' ");
        myBuilder.Append("style='border: solid 1px Silver; font-size: x-small;'>");


        //Add the headings row.


        myBuilder.Append("<tr align='left' valign='top' >");


        //foreach (DataColumn myColumn in targetTable.Columns)
        //{
        //    myBuilder.Append("<td align='left' valign='top' >");
        //    myBuilder.Append(myColumn.ColumnName);
        //    myBuilder.Append("</td>");
        //}


        foreach (rwExportColumn Col in lstColumnName)
        {
            myBuilder.Append("<td align='left' valign='top' style='background-color:#31B880;'>");
            myBuilder.Append(Col.strColumnTitle);
            myBuilder.Append("</td>");
        }


        myBuilder.Append("</tr>");


        //Add the data rows.

        foreach (var t in InputLinq)
        {
            myBuilder.Append("<tr align='left' valign='top'>");

            foreach (rwExportColumn Col in lstColumnName)
            {

                if (Col.strFormatColumn == null || Col.strFormatColumn == "")
                    myBuilder.Append("<td align='left' valign='top'>");
                else
                    myBuilder.Append("<td align='left' valign='top' style='mso-number-format:\"" + Col.strFormatColumn + "\";'>");

                   if (t.GetType().GetProperty(Col.strColumnName).GetValue(t, null) == null)
                    myBuilder.Append(" ");
                else
              //  myBuilder.Append(t.GetProperty(Col.strColumnName).GetValue(t,null).ToString());
                       myBuilder.Append(t.GetType().GetProperty(Col.strColumnName).GetValue(t, null));
                myBuilder.Append("</td>");
            }
            myBuilder.Append("</tr>");
        }



        //Close tags.
        myBuilder.Append("</table>");
        myBuilder.Append("</body>");
        myBuilder.Append("</html>");


        //Get the string for return.
        myHtmlFile = myBuilder.ToString();


        return myHtmlFile;
    }
    //-----------------------------------------------------------------
}

