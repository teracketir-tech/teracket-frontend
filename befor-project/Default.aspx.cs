using System;

public partial class _Default : System.Web.UI.Page
{
    ofcUser _ofcUser;
    //--------------------------------------------------------------------------------
    private void SetTitlePage(string title)
    {
        Page.Title = "اداری | " + title.Trim();
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["Office"] == null) Response.Redirect("login.aspx"); else _ofcUser = (ofcUser)Session["Office"];

        SetTitlePage("داشبورد");
     
    }
    //--------------------------------------------------------------------------------
}