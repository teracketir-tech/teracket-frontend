using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using iTextSharp.text;
using iTextSharp.text.html;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using System.IO;
using System.Web.UI;
using iTextSharp.text.pdf.draw;

/// <summary>
/// Summary description for MyPageEventHandler
/// </summary>
public class MyPageEventHandler : PdfPageEventHelper
{
    /*
     * We use a __single__ Image instance that's assigned __once__;
     * the image bytes added **ONCE** to the PDF file. If you create 
     * separate Image instances in OnEndPage()/OnEndPage(), for example,
     * you'll end up with a much bigger file size.
     */
    public Image ImageHeader { get; set; }
    public Image ImageFooter { get; set; }
    public Image imageline { get; set; }
    public string PageNumber { get; set; }
    public string pevast { get; set; }
    public int MemorandumCode { get; set; }
    public Font FontSmall2 { get; set; }
    public int numpage = 0;
    public override void OnEndPage(PdfWriter writer, Document document)
    {
        if (ImageHeader != null)
        {
            float cellHeight = document.TopMargin;
            Rectangle page = document.PageSize;
            PdfPTable head = new PdfPTable(1);
            head.TotalWidth = page.Width;
            PdfPCell c = new PdfPCell(ImageHeader, true);
            c.HorizontalAlignment = Element.ALIGN_RIGHT;
            c.FixedHeight = cellHeight;
            c.Border = PdfPCell.NO_BORDER;
            head.AddCell(c);
            c.Border = PdfPCell.NO_BORDER;
            c.VerticalAlignment = Element.ALIGN_BOTTOM;
            c.FixedHeight = cellHeight;
            head.AddCell(c);
            head.WriteSelectedRows(0, -1, 0, (page.Height - cellHeight + head.TotalHeight)+40, writer.DirectContent);
        }
        else if (ImageFooter != null)
        {
            float cellHeight = document.BottomMargin;           
            Rectangle page = document.PageSize;          
            PdfPTable head = new PdfPTable(1);
            head.TotalWidth = page.Width;         
            PdfPCell c = new PdfPCell(ImageFooter, true);
            c.HorizontalAlignment = Element.ALIGN_RIGHT;
            c.FixedHeight = cellHeight;
            c.Border = PdfPCell.NO_BORDER;
            head.AddCell(c);           
            c.Border = PdfPCell.NO_BORDER;
            c.VerticalAlignment = Element.ALIGN_BOTTOM;
            c.FixedHeight = cellHeight;
            head.AddCell(c);
            head.WriteSelectedRows(0, -1, 0, 80, writer.DirectContent);
        }

        else if (imageline!=null)
        {
            Rectangle page = document.PageSize;
            float cellHeight = page.Height;           
            PdfPTable head = new PdfPTable(1);
            head.TotalWidth = 7;           
            PdfPCell c = new PdfPCell(imageline, true);
            c.HorizontalAlignment = Element.ALIGN_RIGHT;
            c.FixedHeight = cellHeight;
            c.Border = PdfPCell.NO_BORDER;
            head.AddCell(c);           
            c.Border = PdfPCell.NO_BORDER;
            c.VerticalAlignment = Element.ALIGN_BOTTOM;
            c.FixedHeight = cellHeight;
            head.AddCell(c);          
            head.WriteSelectedRows(0, -1,9, 774, writer.DirectContent);
        }
        else if (PageNumber=="0")
        {
           numpage++;
           float cellHeight = document.BottomMargin;
           Rectangle page = document.PageSize;
           PdfPTable head = new PdfPTable(1);
           head.TotalWidth = page.Width;
           PdfPCell c = new PdfPCell(new Phrase(numpage.ToString()));
           c.HorizontalAlignment = Element.ALIGN_RIGHT;
           c.FixedHeight = cellHeight;
           c.Border = PdfPCell.NO_BORDER;
           head.AddCell(c);
           c.Border = PdfPCell.NO_BORDER;
           c.VerticalAlignment = Element.ALIGN_BOTTOM;
           c.FixedHeight = cellHeight;
           head.AddCell(c);
           head.WriteSelectedRows(0, -1, -280, 96, writer.DirectContent);
        }
        else if (MemorandumCode != null)
        {
            PersianDateTime _PersianDateTime = new PersianDateTime(0);
            string date =  _PersianDateTime.NowDay+"/" + _PersianDateTime.NowMonth + "/" + _PersianDateTime.NowYear ;
            float cellHeight = document.TopMargin;
            Rectangle page = document.PageSize;
            PdfPTable head = new PdfPTable(1);
            head.TotalWidth = page.Width;
            PdfPCell c = new PdfPCell(new Phrase("\n" + "تاریخ: " + date + "\n" + "شماره: " + MemorandumCode.ToString() + "\n" + "پیوست: " + pevast, FontSmall2));
            c.RunDirection = PdfWriter.RUN_DIRECTION_RTL;
            c.HorizontalAlignment = PdfPCell.ALIGN_JUSTIFIED;
            c.BorderWidth = 0;
            c.FixedHeight = 70f;
            head.AddCell(c);
            head.WriteSelectedRows(0, -1,-500,770, writer.DirectContent);
        }
    }
}
       
  