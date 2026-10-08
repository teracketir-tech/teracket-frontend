$(document).ready(function () {
    $("#submitlogin").click(function () { loginToSite(); return false; });

    
    $("#UserName").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $("#Password").focus();
            return false;
        }
    });
    $("#Password").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $("#txtCaptcha").focus();

            return false;
        }
    });
    $("#txtCaptcha").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $("#submitlogin").focus();
            loginToSite();
            return false;
        }
    });
});
//=====================================================================================
function loginToSite()
{
    var username = $("#UserName").val();
    var password = $("#Password").val();
    var capchacode = $.trim($("#txtCaptcha").val());
    $("#DivError").hide();
    $("#DivError").html("");
    $("#divSpace").hide();
    
    if (username == "" && password == "")
    {
        $("#DivError").html("<i class='Small material-icons'>warning</i> لطفا اطلاعات نام کاربری و  رمز عبور را واد نمایید.");
        $("#DivError").show();
        $("#divSpace").show();
        return;
    }
    else if (username == "")
    {
        $("#DivError").html("<i class='Small material-icons'>warning</i> لطفا نام کاربری را واد نمایید.  ");
        $("#DivError").show();
        $("#divSpace").show();
        return;
    }
    else if (password == "") {
        $("#DivError").html("<i class='Small material-icons'>warning</i> لطفا رمز عبور را واد نمایید.  ");
        $("#DivError").show();
        $("#divSpace").show();
        return;
    }
    else if (window.location.hostname.toLowerCase()!="localhost" && capchacode == "") {
        $("#DivError").html("<i class='Small material-icons'>warning</i> لطفا متن تصویر را واد نمایید.  ");
        $("#DivError").show();
        $("#divSpace").show();
        return;
    }
    else
    {
        $("#DivError").hide();
        $("#DivError").html("");
        $("#divSpace").show();
        $("#DivLoading").show();
        $("#submitlogin").attr("disabled", "disabled");

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 1, username: username, password: password, capchacode: capchacode },
            url: "PostBack/PBLogin.ashx",
            success: function (data) {
         
                $("#divSpace").hide();
                $("#DivLoading").hide();
                $("#submitlogin").removeAttr("disabled");
                if (data == "1")
                {
                    $("#form2").submit();
                    location.replace("Default.aspx");
                    //window.open('/default.aspx', '_self');
                }
                else if (data == "2") {
                    $("#DivError").html('<span class="red-text text-darken-2"><i class="Small material-icons">warning</i> نام کاربری یا رمز عبور نامعتبر می باشد . </span>');
                    $("#DivError").show();
                    $("#divSpace").show();
                }
                else if (data == "3") {
                    $("#form2").submit();
                    location.replace("settingPrice.aspx");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
         
                $("#DivLoading").hide();
                $("#DivError").html("");
                $("#DivError").hide();
                $("#divSpace").hide();
                $("#submitlogin").removeAttr("disabled");
                $("#DivError").html('<div class="card-panel"><span class="blue-text text-darken-2"><i class="Small material-icons">error</i> خطا در بازیابی اطلاعات ، دوباره امتحان کنید. </span></div>');
                $("#DivError").show();
                $("#divSpace").show();
            }
        });

    }
}