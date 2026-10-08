using System;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

public partial class login : System.Web.UI.Page
{
    private void SetTitlePage(string title)
    {
        Page.Title = "اداری | " + title.Trim();
    }
    //--------------------------------------------------------------------------------
    protected void Page_Load(object sender, EventArgs e)
    {
        SetTitlePage("ورود به سامانه");

    }
    
    //--------------------------------------------------------------------------------


}
