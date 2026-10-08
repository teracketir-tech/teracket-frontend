$(document).ready(function () {
    $("#divUser").tabs();
    GetTabsDeActive("divUser");
    $("#divUserAccess").tabs();
    $("#btnInsertCityAccess").click(function () { InsertCityAccess(); return false; });
    GetUser();
    $("#btnUserSearch").click(function () { GetUser(); return false; });
    $("#btnNewInsertRoles").click(function () { NewInsertRoles(); return false; });
    $("#btnNewInsertAccess").click(function () { NewInsertAccessMenu(); return false; });
    // DrpDwn(11, "PBDrpdwnDesign.ashx", "tdAgent", "drpdwnAgent", "InputSelectRightToLeftText", "230px", "", "multiple", "یک نماینده را انتخاب کنید ...");
    GetroleDrpdwn("DivdrpdwnRole", "drpdwnRole");
    // GetOstan("tdOstan", "drpdwnOstan");
    Getroles();
    //GetPageDrpdwn("tddrpdwnAccessMenu", "drpdwnAccessMenu");
});
//-----------------------------------------------------------------------
function GetUser() {
    $("#grdviwGetUser").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>نام کاربر</th><th>نقش</th><th>سطح دسترسی</th><th>وضعیت</th><th>ویرایش</th></tr></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{UserName}</td><td>{Role}</td><td>{Access}</td><td>{Status}</td><td>{Edit}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    var Userstatus = $("#drpdwnUserStatus").val();
    var UserCode = $("#txtSearchUserCode").val();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1, s: Userstatus, c: UserCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i++;
                row = row.replaceAll("{UserName}", this['strUserName']);
                row = row.replaceAll("{Role}", this['strRoleName']);
                row = row.replaceAll("{Access}", "<a style='cursor:pointer;' onclick=\"ShowUserAccess('{code}');\">سطح دسترسی</a>");
                row = row.replaceAll("{Status}", "<input id='chk{code}' type='checkbox' onchange=\"ChangeUserStatus(this.checked,'{code}');\" {checked} /><div id='changeStatusUsers{code}'></div>");

                if (this['numUserStatus'] == '1') {
                    row = row.replaceAll("{checked}", "checked='checked'");
                }
                else {
                    row = row.replaceAll("{checked}", "");
                }
                if (this['numRoleRef'] == '1') {
                    row = row.replaceAll("{Edit}", "<img src='images/business_user.png' onclick='ShowEditBox(\"{code}\");' style='cursor: pointer;' />");
                }
                else {
                    row = row.replaceAll("{Edit}", "<img src='images/user_edit.png' onclick='ShowEditBox(\"{code}\");' style='cursor: pointer;' />");
                }
                row = row.replaceAll("{code}", this['strUserCode']);
                allrow = allrow + row;
                t = 1;
            });
            if (t == 1) {
                $("#grdviwGetUser").html(header + header2 + allrow + footer);
            }
            else {
                $("#grdviwGetUser").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#grdviwGetUser").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function ChangeUserStatus(value, UserCode) {
    $("#chk" + UserCode).hide();
    $("#changeStatusUsers" + UserCode).html("<img src='Images/loading.gif' />");
    $("#changeStatusUsers" + UserCode).fadeIn();
    var Status = 0;
    if (value == true) {
        Status = 1;
        //active beshe
    }
    else if (value == false) {
        //not active beshe
        Status = 0;
    }
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 3, s: Status, c: UserCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $("#changeStatusUsers" + UserCode).html("");
            $("#changeStatusUsers" + UserCode).hide();
            $("#chk" + UserCode).fadeIn();
            if (data.result != '1') {
                if (Status == 1) $("#chk" + UserCode).attr('checked', '');
                else $("#chk" + UserCode).attr('checked', 'checked');
                ShowAlert("مشکل در تغییر وضعیت، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (Status == 1) $("#chk" + UserCode).attr('checked', '');
            else $("#chk" + UserCode).attr('checked', 'checked');
            $("#changeStatusUsers" + UserCode).html("");
            $("#changeStatusUsers" + UserCode).hide();
            $("#chk" + UserCode).fadeIn();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function ShowInsertUserBox() {
    $("#txtUserCode").removeAttr("readonly");
    $("#txtUserCode").val("");
    $("#txtUserName").val("");
    $("#txtUserPass").val("");
    $("#txtUserTel").val("");
    $("#txtUserMob").val("");
    $("#txtAddress").val("");
    $("#drpdwnRole").val("-1");
    $("#BackGround").fadeIn();
    $("#divUserInsertBox").dialog({
        autoOpen: false,
        resizable: false,
        title: "ثبت کاربر جدید",
        width: 600,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت کاربر": function () {
                InsertNewUser();

            },
            "انصراف": function () {
                $("#BackGround").fadeOut();
                $(this).dialog("close");
            }
        }
    });
    $("#msgInsertNewUsers").html("");
    $("#msgInsertNewUsers").hide();
    $("#divUserInsertBox").dialog("open");
}
//-----------------------------------------------------------------------
function ShowEditBox(UserCode) {
    $("#BackGround").fadeIn();
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 5, c: UserCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $("#txtUserCode").val(data.strUserCode);
            $("#txtUserCode").attr("readonly", "readonly");
            $("#txtUserName").val(data.strUserName);
            $("#txtUserPass").val(data.strPassword);
            $("#txtUserTel").val(data.strUserTel);
            $("#txtUserMob").val(data.strUserMob);
            $("#txtAddress").val(data.strUserAddress);
            $("#drpdwnRole").val(data.numRoleRef);
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            $("#divUserInsertBox").dialog({
                autoOpen: false,
                resizable: false,
                title: "ویرایش کاربر ",
                width: 600,
                dialogClass: 'RightToLeftText',
                closeOnEscape: true,
                buttons: {
                    "ویرایش": function () {
                        EditUser(UserCode);
                        //                        $("#BackGround").fadeOut();
                        //                        $(this).dialog("close");
                    },
                    "بستن": function () {
                        $("#BackGround").fadeOut();
                        $(this).dialog("close");
                    }
                }
            });
            $("#msgInsertNewUsers").html("");
            $("#msgInsertNewUsers").hide();
            $("#divUserInsertBox").dialog("open");
        }
    });
}
//-----------------------------------------------------------------------
function GetroleDrpdwn(Div, Name) {
    $("#" + Div).html("<img src='Images/loading.gif' style='width: 20px;' />");
    var Header = "<select id='" + Name + "' style='width: " + 155 + "px' name='" + Name + "' class='InputSelectRightToLeftText'>";
    var option = "<option value=\"{value}\">{item}</option>";
    var footer = "</select>";
    var row = ""; var t = 0;
    var allrow = "<option value=\"-1\" selected=\"selected\">--انتخاب کنید--</option>";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 4 },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $.each(data, function (index) {
                t = 1;
                row = option.replaceAll("{value}", this['numRoleCode']);
                row = row.replaceAll("{item}", this['strRoleName']);
                allrow = allrow + row;
            });
            $("#" + Div).html(Header + allrow + footer);
        }
    });
}
//-----------------------------------------------------------------------
function ShowUserAccess(UserCode) {
    //GetAccessCityByUserCode(UserCode);
    GetFunctionUser(UserCode, 1);
    $("#UserID").html(UserCode);
    $("#BackGround").fadeIn();
    $("#divUserAccess").dialog({
        autoOpen: false,
        resizable: false,
        title: "سطح دسترسی",
        width: 600,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "انصراف": function () {
                $("#BackGround").fadeOut();
                $(this).dialog("close");
            }
        }
    });
    $("#msgInsertCity").html("");
    $("#msgInsertCity").hide();
    $("#divUserAccess").dialog("open");
}
//-----------------------------------------------------------------------
function GetAccessCityByUserCode(UserCode) {
    $("#grdviwAccessCity").html("<img src='Images/progressindicator.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th>نمایندگی</th><th>نام نماینده</th><th>حذف</th></tr></thead><tbody>";
    var mainrow = "<tr><td>{Agent}</td><td>{AgentName}</td><td>{Delete}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var row = ""; var allrow = "";
    var t = 0;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 6, c: UserCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{Agent}", this['strAgcName']);
                row = row.replaceAll("{AgentName}", this['strPersonName']);
                row = row.replaceAll("{Delete}", "<img id='deleteCity" + $.trim(this['strPersonMelliCode']) + "' src='images/delete.png' onclick=\"DeleteCity('" + $.trim(this['strPersonMelliCode']) + "');\" style='cursor: pointer;' /><div id='deleteUserAccessCity" + $.trim(this['strPersonMelliCode']) + "' style='display:none;'></div>");
                allrow = allrow + row;
                t = 1;
            });
            if (t == 1) {
                $("#grdviwAccessCity").html(header + header2 + allrow + footer);
            }
            else {
                $("#grdviwAccessCity").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#grdviwAccessCity").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function DeleteCity(CityCode) {
    $("#deleteCity" + CityCode).hide();
    $("#deleteUserAccessCity" + CityCode).html("<img src='Images/loading.gif' />");
    $("#deleteUserAccessCity" + CityCode).fadeIn();
    var UserCode = $("#UserID").html().trim();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 12, c: UserCode, ci: CityCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $("#deleteUserAccessCity" + CityCode).html("");
            $("#deleteUserAccessCity" + CityCode).hide();
            $("#deleteCity" + CityCode).fadeIn();
            if (data.result == '0') {
                ShowAlert("مشکل در حذف شهر، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید ");
            }
            else if (data.result == '1') {
                GetAccessCityByUserCode(UserCode);
            }
            else if (data.result == '5') {
                ShowAlert("لطفا صفحه را مجدد بارگزاری کنید! ");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#deleteUserAccessCity" + CityCode).html("");
            $("#deleteUserAccessCity" + CityCode).hide();
            $("#deleteCity" + CityCode).fadeIn();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });

}
//-----------------------------------------------------------------------
function GetOstan(Div, Name) {
    $("#" + Div).html("<img src='Images/loading.gif' style='width: 20px;' />");
    var Header = "<select id='" + Name + "' style='width: " + 155 + "px' name='" + Name + "' class='InputSelectRightToLeftText' onchange=\"GetCity('tdCity','drpdwnCity','" + Name + "');\" >";
    var option = "<option value=\"{value}\">{item}</option>";
    var footer = "</select>";
    var row = ""; var t = 0;
    var allrow = "<option value=\"-1\" selected=\"selected\">--انتخاب کنید--</option>";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 7 },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $.each(data, function (index) {
                t = 1;
                row = option.replaceAll("{value}", this['strWorkPostCenterRef']);
                row = row.replaceAll("{item}", this['strPostCenterName']);
                allrow = allrow + row;
            });
            $("#" + Div).html(Header + allrow + footer);
        }
    });
}
//-----------------------------------------------------------------------
function GetCity(Div, Name, Input) {
    $("#" + Div).html("<img src='Images/loading.gif' style='width: 20px;' />");
    var Header = "<select id='" + Name + "' style='width: " + 155 + "px' name='" + Name + "' class='InputSelectRightToLeftText'>";
    var option = "<option value=\"{value}\">{item}</option>";
    var footer = "</select>";
    var row = ""; var t = 0;
    var allrow = "<option value=\"-1\" selected=\"selected\">--انتخاب کنید--</option>";
    var OstanCode = $("#" + Input).val();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 9, o: OstanCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $.each(data, function (index) {
                t = 1;
                row = option.replaceAll("{value}", this['strWorkCityPreTelCode']);
                row = row.replaceAll("{item}", this['strCityName']);
                allrow = allrow + row;
            });
            $("#" + Div).html(Header + allrow + footer);
        }
    });
}
//-----------------------------------------------------------------------
function InsertCityAccess() {
    var error = "<table class='errorMsg' align='center' cellpadding='2' width={width} dir='rtl'><tr><td width='50'><img src='Images/Notfound.png' /></td><td>{msg}</td></tr></table>";
    var flag = 0;
    var agent = $("#drpdwnAgent").val();
    agent = agent == null || agent == undefined || agent == '' ? "-1" : "\"" + $("#drpdwnAgent").val() + "\"";

    var UserCode = $("#UserID").html().trim();
    if ($.trim(UserCode) != '') {
        if (agent == '-1') {
            error = error.replaceAll("{msg}", "نمایندگی را مشخص نمایید").replaceAll("{width}", "250");
            flag = 1;
        }
        else {
            $("#msgInsertCity").html("<img src='Images/progressindicator.gif' />");
            $("#msgInsertCity").slideDown();
            flag = 0;
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 11, c: UserCode, agent: agent },
                url: "PostBack/PBUserManager.ashx",
                success: function (data) {
                    if (data.result == '0') {
                        error = error.replaceAll("{msg}", "مشکل در ثبت شهر، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید").replaceAll("{width}", "500");
                        $("#msgInsertCity").html(error);
                    }
                    else if (data.result == '1') {
                        $("#msgInsertCity").html("");
                        $("#msgInsertCity").slideUp();
                        GetAccessCityByUserCode(UserCode);
                    }
                    else if (data.result == '5') {
                        error = error.replaceAll("{msg}", "لطفا مجددا صفحه را بارگزاری نمایید!").replaceAll("{width}", "500");
                        $("#msgInsertCity").html(error);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    error = "";
                    $("#msgInsertCity").html("");
                    $("#msgInsertCity").slideUp();
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                }
            });
        }

        if (flag == 1) $("#msgInsertCity").html(error);
        $("#msgInsertCity").slideDown();
    }
}
//-----------------------------------------------------------------------
function InsertNewUser() {
    var UserCode = $("#txtUserCode").val();
    var UserName = $("#txtUserName").val();
    var UserPass = $("#txtUserPass").val();
    var UserRole = $("#drpdwnRole").val();

    var error = "<table class='errorMsg' align='center' cellpadding='2' width={width} dir='rtl'><tr><td width='50'><img src='Images/Notfound.png' /></td><td>{msg}</td></tr></table>";
    var accept = "<table class='errorMsg' align='center' cellpadding='2' width={width} dir='rtl'><tr><td width='50'><img src='Images/REUserAccept.png' /></td><td>{msg}</td></tr></table>";
    var flag = 0;
    if ($.trim(UserCode) == '') {
        error = error.replaceAll("{msg}", "کد ملی کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else if (!$.trim(UserCode).match(/^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/)) {
        error = error.replaceAll("{msg}", "کد ملی بایستی عددی باشد").replaceAll("{width}", "250");
        flag = 1;
    }
    else if ($.trim(UserName) == '') {
        error = error.replaceAll("{msg}", "نام کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else if ($.trim(UserRole) == '-1') {
        error = error.replaceAll("{msg}", "نقش کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else if ($.trim(UserPass) == '') {
        error = error.replaceAll("{msg}", "کلمه عبور کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else {
        $("#msgInsertNewUsers").html("<img src='Images/progressindicator.gif' />");
        $("#msgInsertNewUsers").slideDown();
        flag = 0;
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 2, c: UserCode, n: UserName, p: UserPass, r: UserRole },
            url: "PostBack/PBUserManager.ashx",
            success: function (data) {
                if (data.result == '1') {
                    accept = accept.replaceAll("{msg}", "کاربر جدید با موفقیت ثبت شد").replaceAll("{width}", "280");
                    $("#msgInsertNewUsers").html(accept);
                    GetUser();
                    setTimeout(function () { $("#BackGround").fadeOut(); $("#divUserInsertBox").dialog("close") }, 3000);
                }
                else if (data.result == '2') {
                    error = error.replaceAll("{msg}", "کاربر با این کد کاربری در سیستم وجود دارد").replaceAll("{width}", "310");
                    $("#msgInsertNewUsers").html(error);
                }
                else {
                    error = error.replaceAll("{msg}", "مشکل در ثبت کاربر جدید، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید ").replaceAll("{width}", "500");
                    $("#msgInsertNewUsers").html(error);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                error = "";
                $("#msgInsertNewUsers").html("");
                $("#msgInsertNewUsers").slideUp();
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });
    }

    if (flag == 1) $("#msgInsertNewUsers").html(error);
    $("#msgInsertNewUsers").slideDown();
}
//-----------------------------------------------------------------------
function EditUser() {
    var UserCode = $("#txtUserCode").val();
    var UserName = $("#txtUserName").val();
    var UserPass = $("#txtUserPass").val();
    var UserRole = $("#drpdwnRole").val();
    var error = "<table class='errorMsg' align='center' cellpadding='2' width={width} dir='rtl'><tr><td width='50'><img src='Images/Notfound.png' /></td><td>{msg}</td></tr></table>";
    var accept = "<table class='errorMsg' align='center' cellpadding='2' width={width} dir='rtl'><tr><td width='50'><img src='Images/REUserAccept.png' /></td><td>{msg}</td></tr></table>";
    var flag = 0;
    if ($.trim(UserCode) == '') {
        error = error.replaceAll("{msg}", "کد ملی کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else if (!$.trim(UserCode).match(/^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/)) {
        error = error.replaceAll("{msg}", "کد ملی بایستی عددی باشد").replaceAll("{width}", "250");
        flag = 1;
    }
    else if ($.trim(UserName) == '') {
        error = error.replaceAll("{msg}", "نام کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else if ($.trim(UserRole) == '-1') {
        error = error.replaceAll("{msg}", "نقش کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else if ($.trim(UserPass) == '') {
        error = error.replaceAll("{msg}", "کلمه عبور کاربر وارد نشده است").replaceAll("{width}", "250");
        flag = 1;
    }
    else {
        $("#msgInsertNewUsers").html("<img src='Images/progressindicator.gif' />");
        $("#msgInsertNewUsers").slideDown();
        flag = 0;
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 13, c: UserCode, n: UserName, p: UserPass, r: UserRole },
            url: "PostBack/PBUserManager.ashx",
            success: function (data) {
                if (data.result != '1') {
                    error = error.replaceAll("{msg}", "مشکل در ثبت کاربر جدید، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید ").replaceAll("{width}", "500");
                    $("#msgInsertNewUsers").html(error);
                }
                else {
                    accept = accept.replaceAll("{msg}", "ویرایش اطلاعات با موفقیت ثبت شد").replaceAll("{width}", "280");
                    $("#msgInsertNewUsers").html(accept);
                    GetUser();
                    setTimeout(function () { $("#BackGround").fadeOut(); $("#divUserInsertBox").dialog("close") }, 3000);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                error = "";
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });
    }

    if (flag == 1) $("#msgInsertNewUsers").html(error);
    $("#msgInsertNewUsers").slideDown();
}
//-----------------------------------------------------------------------
function GetFunctionUser(UserCode, vpage) {
    $("#grdviwGetFunc").html("<img src='Images/loading.gif' />");
    var nextPage, prevPage, lastPage, vpage, vperpage;
    nextPage = vpage + 1;
    prevPage = vpage - 1;
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1>";
    var header2 = "<thead><tr><th>ردیف</th><th>قسمت</th><th>دسترسی</th></tr></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{Func}</td><td {stylebtn}>{Access}</td></tr>" +
                  "<tr id='TrUserTabName{code}' style='background-color:#90EE90;display:none;'><td colspan='3' id='TdUserTabNameShow{code}' align='center'></td></tr>"
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick=\"GetFunctionUser('" + UserCode + "',1);\">" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPager' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountfunc' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick=\"GetFunctionUser('" + UserCode + "',{lastpage});\">" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";
    var row = ""; var allrow = ""; var AllRecordCount;
    var t = 0;
    vperpage = "30";
    var i = (vpage - 1) * vperpage + 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 14, c: UserCode, page: vpage, perpage: vperpage },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i++;
                row = row.replaceAll("{Func}", this['strFunctionName']);

                if (parseInt(this['countTab']) > 0) {
                    row = row.replaceAll("{Access}", "<input id='chkUserFunc{code}' type='checkbox' style='cursor:pointer;' onchange=\"ChangeUserFuncAccess(this.checked,{code});\" {checked} ><span id='ChangeStatusUsersRole{code}' style='display:none;'></span><a id='linkUserAdd{code}' onclick='showUserFunctionTab(1,{code},\"" + UserCode + "\");' style='cursor:pointer;'><img  src='images/add.png' style='width:15px;'/></a><a id='linkUserMinus{code}' onclick='showUserFunctionTab(2,{code},\"" + UserCode + "\");' style='cursor:pointer;display:none;'><img  src='images/minus.png' style=' width:15px;' /></a> ");
                    row = row.replaceAll("{stylebtn}", " style='padding-right:15px;'");
                }
                else {
                    row = row.replaceAll("{Access}", "<input id='chkUserFunc{code}' type='checkbox' style='cursor:pointer;' onchange=\"ChangeUserFuncAccess(this.checked,{code});\" {checked} ><span id='ChangeStatusUsersRole{code}' style='display:none;'></span>");
                    row = row.replaceAll("{stylebtn}", "");
                }

                if (this['Access'] == '1') {
                    row = row.replaceAll("{checked}", "checked='checked'");
                }
                else {
                    row = row.replaceAll("{checked}", "");
                }
                row = row.replaceAll("{code}", this['numFunctionCode']);
                allrow = allrow + row;
                t = 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetFunctionUser(\"" + UserCode + "\"," + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetFunctionUser(\"" + UserCode + "\"," + nextPage + ")");
            }
            if (t == 1) {
                $("#grdviwGetFunc").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountfunc").html(allpage);
            }
            else {
                $("#grdviwGetFunc").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#grdviwGetFunc").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function showUserFunctionTab(type, code, UserCode) {
    if (type == "1") {
        $("#linkUserAdd" + code).hide();
        $("#linkUserMinus" + code).show();
        $("#TrUserTabName" + code).show();
        GetinfoUserTabNames(code, UserCode);
    }
    else if (type == "2") {
        $("#TrUserTabName" + code).hide();
        $("#linkUserMinus" + code).hide();
        $("#linkUserAdd" + code).show();
    }
}
//-----------------------------------------------------------------------
function GetinfoUserTabNames(code, UserCode) {
    var mainRow = "<tr ><td width='110px'>{row}</td><td width='250px'>{tabname}</td><td {stylebtn}>{Access}</td></tr>";
    $("#TdUserTabNameShow" + code).html("<img src='images/loading.gif'/>");
    var allrow = "", row = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 25, pageCode: code, UserCode: UserCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $("#TdUserTabNameShow" + code).html("");

            $.each(data, function (index) {
                row = mainRow.replaceAll("{row}", "*");
                row = row.replaceAll("{tabname}", $.trim(this["strPageTabName"]));
                row = row.replaceAll("{Access}", "<input id='chkUserTab{code}' type='checkbox' style='cursor:pointer;' onchange='ChangeUserRolTabAccess(this.checked,{code},\"" + UserCode + "\"," + code + ");' {checked} ><span id='loadingUserCheckRoleTabChannge{code}' style='display:none;text-align:center;'></span>");
                row = row.replaceAll("{stylebtn}", "");
                row = row.replaceAll("{code}", this["numId"]);
                if (this['Access'] == '1') {
                    row = row.replaceAll("{checked}", "checked='checked'");
                }
                else {
                    row = row.replaceAll("{checked}", "");
                }

                allrow = allrow + row;
            });
            $("#TdUserTabNameShow" + code).html("<table style='width: 80%;'>" + allrow + "</table>");
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#TdUserTabNameShow" + code).html("");
            showUserFunctionTab(2, code, UserCode);
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function ChangeUserRolTabAccess(value, TabCode, UserCode, pageCode) {
    $("#chkUserTab" + TabCode).hide();
    $("#loadingUserCheckRoleTabChannge" + TabCode).html("<img src='Images/loading.gif' />");
    $("#loadingUserCheckRoleTabChannge" + TabCode).fadeIn();
    var Status = 0;
    if (value == true) {
        Status = 1;
    }
    else if (value == false) {
        Status = 0;
    }

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 26, Status: Status, UserCode: UserCode, TabCode: TabCode, pageCode: pageCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $("#loadingUserCheckRoleTabChannge" + TabCode).html("");
            $("#loadingUserCheckRoleTabChannge" + TabCode).hide();
            $("#chkUserTab" + TabCode).fadeIn();
            if (data.result != '1') {
                if (Status == 1) $("#chkUserTab" + TabCode).attr('checked', '');
                else $("#chkUserTab" + TabCode).attr('checked', 'checked');
                ShowAlert("مشکل در تغییر وضعیت، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید");
            }
            $("#loadingUserCheckRoleTabChannge" + TabCode).html("");
            $("#loadingUserCheckRoleTabChannge" + TabCode).hide();
            $("#chkUserTab" + TabCode).fadeIn();
            if (data.result == '0') {
                if (Status == 1) $("#chkUserTab" + TabCode).attr('checked', '');
                else $("#chkUserTab" + TabCode).attr('checked', 'checked');
                ShowAlert("مشکل در تغییر وضعیت، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید");
            }
            else if (data.result == '2') {
                if (Status == 1) $("#chkUserTab" + TabCode).attr('checked', '');
                else $("#chkUserTab" + TabCode).attr('checked', 'checked');
                $("#loadingUserCheckRoleTabChannge" + TabCode).html("");
                $("#loadingUserCheckRoleTabChannge" + TabCode).hide();
                $("#chkUserTab" + TabCode).fadeIn();
                ShowAlert("این کاربر مدیر می باشد و تغییر دسترسی آن امکان پذیر نیست");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (Status == 1) $("#chkUserTab" + TabCode).attr('checked', '');
            else $("#chkUserTab" + TabCode).attr('checked', 'checked');
            $("#loadingUserCheckRoleTabChannge" + TabCode).html("");
            $("#loadingUserCheckRoleTabChannge" + TabCode).hide();
            $("#chkUserTab" + TabCode).fadeIn();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });

}
//-----------------------------------------------------------------------
function ChangeUserFuncAccess(value, FuncCode) {
    $("#chkUserFunc" + FuncCode).hide();
    $("#ChangeStatusUsersRole" + FuncCode).html("<img src='Images/loading.gif' />");
    $("#ChangeStatusUsersRole" + FuncCode).fadeIn();
    var UserCode = $("#UserID").html().trim();
    var Status = 0;
    if (value == true) {
        Status = 1;
        //active beshe
    }
    else if (value == false) {
        //not active beshe
        Status = 0;
    }
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 15, s: Status, c: UserCode, f: FuncCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $("#ChangeStatusUsersRole" + FuncCode).html("");
            $("#ChangeStatusUsersRole" + FuncCode).hide();
            $("#chkUserFunc" + FuncCode).fadeIn();
            if (data.result == '0') {
                if (Status == 1) $("#chkUserFunc" + FuncCode).attr('checked', '');
                else $("#chkUserFunc" + FuncCode).attr('checked', 'checked');
                ShowAlert("مشکل در تغییر وضعیت، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید");
            }
            else if (data.result == '2') {
                if (Status == 1) $("#chkUserFunc" + FuncCode).attr('checked', '');
                else $("#chkUserFunc" + FuncCode).attr('checked', 'checked');
                $("#ChangeStatusUsersRole" + FuncCode).html("");
                $("#ChangeStatusUsersRole" + FuncCode).hide();
                $("#chkUserFunc" + FuncCode).fadeIn();
                ShowAlert("این کاربر مدیر می باشد و تغییر دسترسی آن امکان پذیر نیست");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (Status == 1) $("#chkUserFunc" + FuncCode).attr('checked', '');
            else $("#chkUserFunc" + FuncCode).attr('checked', 'checked');
            $("#ChangeStatusUsersRole" + FuncCode).html("");
            $("#ChangeStatusUsersRole" + FuncCode).hide();
            $("#chkUserFunc" + FuncCode).fadeIn();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });

}
//-----------------------------------------------------------------------
function Getroles() {
    $("#grdviwRoles").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>نقش</th><th>سطح دسترسی</th><th>ویرایش</th></tr></thead><tbody>";
    var mainrow = "<tr id='row{code}'><td>{Row}</td><td id='Role{code}'>{Role}</td><td>{Access}</td><td id='EditRole{code}'>{Edit}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 16 },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i++;
                row = row.replaceAll("{Role}", this['strRoleName']);
                row = row.replaceAll("{Access}", "<a style='cursor:pointer;' onclick=\"ShowRoleAccess({code});\">سطح دسترسی</a>");
                row = row.replaceAll("{Edit}", "<img src='images/Edit.png' onclick='ShowEditRole({code});' style='cursor: pointer;' /> <img id='imgDelRole{code}' src='images/delete.png' onclick='DeletetRole({code});' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelRole{code}' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' /> ");
                row = row.replaceAll("{code}", this['numRoleCode']);
                allrow = allrow + row;
                t = 1;
            });
            if (t == 1) {
                $("#grdviwRoles").html(header + header2 + allrow + footer);
            }
            else {
                $("#grdviwRoles").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#grdviwGetUser").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function ShowRoleAccess(RoleCode) {
    $("#BackGround").fadeIn();
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    GetAccessOfRole(RoleCode, 1);
    $("#divRoleBox").dialog({
        autoOpen: false,
        resizable: false,
        title: "سطح دسترسی نقش ",
        width: 600,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "بستن": function () {
                $("#BackGround").fadeOut();
                $(this).dialog("close");
            }
        }
    });
    $("#divRoleBox").dialog("open");
}
//-----------------------------------------------------------------------
function ShowEditRole(RoleCode) {
    var RoleName = $("#Role" + RoleCode).html();
    $("#Role" + RoleCode).html("<input id='txtEditRole" + RoleCode + "' class='InputTextRightToLeftText' type='text' value='" + RoleName + "' />");
    $("#EditRole" + RoleCode).html("<img src='images/Cancel.png' onclick='CancelEditRole(" + RoleCode + ",\"" + RoleName + "\");' style='cursor: pointer;' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='images/accept.png' onclick='AcceptEditRole(" + RoleCode + ");' style='cursor: pointer;' />");
}
//-----------------------------------------------------------------------
function GetAccessOfRole(RoleCode, vpage) {
    $("#DivFuncCode").html(RoleCode);
    $("#grdviewRoleAccess").html("<img src='Images/loading.gif' />");
    var nextPage, prevPage, lastPage, vpage, vperpage;
    nextPage = vpage + 1;
    prevPage = vpage - 1;
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th>ردیف</th><th>قسمت</th><th>دسترسی</th></tr></thead><tbody>";
    var mainrow = "<tr ><td>{Row}</td><td>{Func}</td><td {stylebtn}>{Access}</td></tr>" +
                  "<tr id='TrTabName{code}' style='background-color:#90EE90;display:none;'><td colspan='3' id='TdTabNameShow{code}' align='center'></td></tr>"
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick=\"GetAccessOfRole('" + RoleCode + "',1);\">" +
        "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
        "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
        "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
        "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
        "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
        "<input id='txtPager' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
        "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountFunc' class='pageritemlabel'>" +
        "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
        "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
        "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
        "</a></div><div class='pageritem'><a onclick=\"GetAccessOfRole('" + RoleCode + "',{lastpage});\">" +
        "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";
    var row = ""; var allrow = ""; var AllRecordCount;
    var t = 0;
    vperpage = "30";
    var i = (vpage - 1) * vperpage + 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 17, c: RoleCode, page: vpage, perpage: vperpage },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i++;
                row = row.replaceAll("{Func}", this['strFunctionName']);
                if (parseInt(this['countTab']) > 0) {
                    row = row.replaceAll("{Access}", "<input id='chkFunc{code}' type='checkbox' style='cursor:pointer;' onchange=\"ChangeRolAccess(this.checked,{code});\" {checked} ><span id='loadingCheckRoleChannge{code}' style='display:none;text-align:center;'></span><a id='linkAdd{code}' onclick='showFunctionTab(1,{code}," + RoleCode + ");' style='cursor:pointer;'><img  src='images/add.png' style='width:15px;'/></a><a id='linkMinus{code}' onclick='showFunctionTab(2,{code}," + RoleCode + ");' style='cursor:pointer;display:none;'><img  src='images/minus.png' style=' width:15px;' /></a>");
                    row = row.replaceAll("{stylebtn}", " style='padding-right:15px;'");
                }
                else {
                    row = row.replaceAll("{Access}", "<input id='chkFunc{code}' type='checkbox' style='cursor:pointer;' onchange=\"ChangeRolAccess(this.checked,{code});\" {checked} ><span id='loadingCheckRoleChannge{code}' style='display:none;text-align:center;'></span>");
                    row = row.replaceAll("{stylebtn}", "");
                }

                if (this['Access'] == '1') {
                    row = row.replaceAll("{checked}", "checked='checked'");
                }
                else {
                    row = row.replaceAll("{checked}", "");
                }
                row = row.replaceAll("{code}", this['numFunctionCode']);
                allrow = allrow + row;
                t = 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetAccessOfRole(\"" + RoleCode + "\"," + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetAccessOfRole(\"" + RoleCode + "\"," + nextPage + ")");
            }
            if (t == 1) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                $("#grdviewRoleAccess").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountFunc").html(allpage);
            }
            else {
                $("#grdviewRoleAccess").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#grdviewRoleAccess").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function showFunctionTab(type, code, RoleCode) {
    if (type == "1") {
        $("#linkAdd" + code).hide();
        $("#linkMinus" + code).show();
        $("#TrTabName" + code).show();
        GetinfoTabNames(code, RoleCode);
    }
    else if (type == "2") {
        $("#TrTabName" + code).hide();
        $("#linkMinus" + code).hide();
        $("#linkAdd" + code).show();
    }
}
//-----------------------------------------------------------------------
function GetinfoTabNames(code, RoleCode) {
    var mainRow = "<tr ><td width='133px'>{row}</td><td width='250px'>{tabname}</td><td {stylebtn}>{Access}</td></tr>";
    $("#TdTabNameShow" + code).html("<img src='images/loading.gif'/>");
    var allrow = "", row = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 23, pageCode: code, RoleCode: RoleCode },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            $("#TdTabNameShow" + code).html("");
            $.each(data, function (index) {
                row = mainRow.replaceAll("{row}", "*");
                row = row.replaceAll("{tabname}", $.trim(this["strPageTabName"]));
                row = row.replaceAll("{Access}", "<input id='chkTab{code}' type='checkbox' style='cursor:pointer;' onchange=\"ChangeRolTabAccess(this.checked,{code}," + RoleCode + "," + code + ");\" {checked} ><span id='loadingCheckRoleTabChannge{code}' style='display:none;text-align:center;'></span>");
                row = row.replaceAll("{stylebtn}", "");
                row = row.replaceAll("{code}", this["numId"]);
                if (this['Access'] == '1') {
                    row = row.replaceAll("{checked}", "checked='checked'");
                }
                else {
                    row = row.replaceAll("{checked}", "");
                }

                allrow = allrow + row;
            });
            $("#TdTabNameShow" + code).html("<table style='width: 80%;'>" + allrow + "</table>");
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#TdTabNameShow" + code).html("");
            showFunctionTab(2, code, RoleCode);
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------
function ChangeRolTabAccess(value, TabCode, RoleCode, pageCode) {
    $("#chkTab" + TabCode).hide();
    $("#loadingCheckRoleTabChannge" + TabCode).html("<img src='Images/loading.gif' />");
    $("#loadingCheckRoleTabChannge" + TabCode).fadeIn();
    var Status = 0;
    if (value == true) {
        Status = 1;
    }
    else if (value == false) {
        Status = 0;
    }
    if ($.trim(RoleCode) == "1") {
        if (Status == 1) $("#chkTab" + TabCode).attr('checked', '');
        else $("#chkTab" + TabCode).attr('checked', 'checked');
        $("#loadingCheckRoleTabChannge" + TabCode).html("");
        $("#loadingCheckRoleTabChannge" + TabCode).hide();
        $("#chkTab" + TabCode).fadeIn();
        ShowAlert("دسترسی های مدیر مایا را نمی توانید تغییر دهید");
    }
    else {
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 24, Status: Status, RoleCode: RoleCode, TabCode: TabCode, pageCode: pageCode },
            url: "PostBack/PBUserManager.ashx",
            success: function (data) {
                $("#loadingCheckRoleTabChannge" + TabCode).html("");
                $("#loadingCheckRoleTabChannge" + TabCode).hide();
                $("#chkTab" + TabCode).fadeIn();
                if (data.result != '1') {
                    if (Status == 1) $("#chkTab" + TabCode).attr('checked', '');
                    else $("#chkTab" + TabCode).attr('checked', 'checked');
                    ShowAlert("مشکل در تغییر وضعیت، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (Status == 1) $("#chkTab" + TabCode).attr('checked', '');
                else $("#chkTab" + TabCode).attr('checked', 'checked');
                $("#loadingCheckRoleTabChannge" + TabCode).html("");
                $("#loadingCheckRoleTabChannge" + TabCode).hide();
                $("#chkTab" + TabCode).fadeIn();
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });
    }
}
//-----------------------------------------------------------------------
function ChangeRolAccess(value, FuncCode) {
    $("#chkFunc" + FuncCode).hide();
    $("#loadingCheckRoleChannge" + FuncCode).html("<img src='Images/loading.gif' />");
    $("#loadingCheckRoleChannge" + FuncCode).fadeIn();
    var Status = 0;
    if (value == true) {
        Status = 1;
    }
    else if (value == false) {
        Status = 0;
    }
    var RoleCode = $("#DivFuncCode").html();
    if ($.trim(RoleCode) == "1") {
        if (Status == 1) $("#chkFunc" + FuncCode).attr('checked', '');
        else $("#chkFunc" + FuncCode).attr('checked', 'checked');
        $("#loadingCheckRoleChannge" + FuncCode).html("");
        $("#loadingCheckRoleChannge" + FuncCode).hide();
        $("#chkFunc" + FuncCode).fadeIn();
        ShowAlert("دسترسی های مدیر مایا را نمی توانید تغییر دهید");
    }
    else {
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 18, s: Status, c: RoleCode, f: FuncCode },
            url: "PostBack/PBUserManager.ashx",
            success: function (data) {
                $("#loadingCheckRoleChannge" + FuncCode).html("");
                $("#loadingCheckRoleChannge" + FuncCode).hide();
                $("#chkFunc" + FuncCode).fadeIn();
                if (data.result != '1') {
                    if (Status == 1) $("#chkFunc" + FuncCode).attr('checked', '');
                    else $("#chkFunc" + FuncCode).attr('checked', 'checked');
                    ShowAlert("مشکل در تغییر وضعیت، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (Status == 1) $("#chkFunc" + FuncCode).attr('checked', '');
                else $("#chkFunc" + FuncCode).attr('checked', 'checked');
                $("#loadingCheckRoleChannge" + FuncCode).html("");
                $("#loadingCheckRoleChannge" + FuncCode).hide();
                $("#chkFunc" + FuncCode).fadeIn();
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });
    }
}
//-----------------------------------------------------------------------
function CancelEditRole(RoleCode, RoleName) {
    $("#EditRole" + RoleCode).html("<img src='images/Edit.png' onclick='ShowEditRole(" + RoleCode + ");' style='cursor: pointer;' /><img id='imgDelRole" + RoleCode + "' src='images/delete.png' onclick='DeletetRole(" + RoleCode + ");' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelRole" + RoleCode + "' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' />");
    $("#Role" + RoleCode).html(RoleName);
}
//-----------------------------------------------------------------------
function AcceptEditRole(RoleCode) {
    var RoleName = $("#txtEditRole" + RoleCode).val();
    $("#Role" + RoleCode).html("<img src='Images/loading.gif' />");
    $("#EditRole" + RoleCode).html("<img src='Images/loading.gif' />");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 19, c: RoleCode, n: RoleName },
        url: "PostBack/PBUserManager.ashx",
        success: function (data) {
            if (data.result != '1') {
                ShowAlert("مشکل در تغییر وضعیت، مجدداً امتحان کنید در صورت تکرار به واحد برنامه نویسی اعلام نمائید");
            }
            else {
                GetUser();
                $("#Role" + RoleCode).html(RoleName);
                $("#EditRole" + RoleCode).html("<img src='images/Edit.png' onclick='ShowEditRole(" + RoleCode + ");' style='cursor: pointer;' /><img id='imgDelRole" + RoleCode + "' src='images/delete.png' onclick='DeletetRole(" + RoleCode + ");' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelRole" + RoleCode + "' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' />");
                GetroleDrpdwn("DivdrpdwnRole", "drpdwnRole");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------اضافه کردن نقش جدید------------------------------------
function NewInsertRoles() {
    var rolename = $("#txtRoleNames").val();
    if ($.trim(rolename) == '') {
        $("#loadingInsertRoles").html("<font style='color:#ff0000;'>نام نقش را وارد نمایید</font>");
        setTimeout(function () { $("#loadingInsertRoles").html(""); }, 3000);
    }
    else {
        if (confirm("آیا از ثبت اطمینان دارید ؟")) {
            $("#loadingInsertRoles").html("<img src='Images/loading.gif' />");
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 20, rolename: rolename },
                url: "PostBack/PBUserManager.ashx",
                success: function (data) {
                    if (data.result == '1') {
                        $("#loadingInsertRoles").html("<font style='color:green;'>با موفقیت ثبت شد</font>");
                        setTimeout(function () { $("#loadingInsertRoles").html(""); }, 3000);
                        $("#txtRoleNames").val("");
                        Getroles();
                    }
                    else if (data.result == '5') {
                        $("#loadingInsertRoles").html("<font style='color:#ff0000;'>این نقش قبلا ثبت شده است</font>");
                        setTimeout(function () { $("#loadingInsertRoles").html(""); }, 3000);
                    }
                    else if (data.result == '15') {
                        ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                        $("#loadingInsertRoles").html("");
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    $("#loadingInsertRoles").html("");
                }
            });
        }
    }
}
//-----------------------------------حذف نقش------------------------------------
function DeletetRole(roleCode) {
    if (confirm("آیا از حذف اطمینان دارید ؟")) {
        $("#imgDelRole" + roleCode).hide();
        $("#loadingDelRole" + roleCode).show();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 21, roleCode: roleCode },
            url: "PostBack/PBUserManager.ashx",
            success: function (data) {
                if (data.result == '1') {
                    $("#row" + roleCode).fadeOut();
                }
                else if (data.result == '2') {
                    ShowAlert("این نقش قبلا به کار گرفته شده است");
                    $("#loadingDelRole" + roleCode).hide();
                    $("#imgDelRole" + roleCode).show();
                }

                else if (data.result == '5') {
                    ShowAlert("اطلاعات این نقش وجود ندارد");
                    $("#row" + roleCode).fadeOut();
                }
                else if (data.result == '15') {
                    ShowAlert("خطا در حذف اطلاعات ، دوباره امتحان کنید");
                    $("#loadingDelRole" + roleCode).hide();
                    $("#imgDelRole" + roleCode).show();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                $("#loadingDelRole" + roleCode).hide();
                $("#imgDelRole" + roleCode).show();
            }
        });
    }
}
////-----------------------------------دریافت کمبو صفحات دسترسی------------------------------------
//function GetPageDrpdwn(Div, Name) {
//    $("#" + Div).html("<img src='Images/loading.gif' style='width: 20px;' />");
//    var Header = "<select id='" + Name + "' style='width: " + 155 + "px' name='" + Name + "' class='InputSelectRightToLeftText'>";
//    var option = "<option value=\"{value}\">{item}</option>";
//    var footer = "</select>";
//    var row = ""; var t = 0;
//    var allrow = "<option value=\"-1\" selected=\"selected\">--انتخاب کنید--</option>";
//    $.ajax({
//        type: "POST",
//        async: true,
//        cache: false,
//        dataType: "json",
//        data: { i: 22 },
//        url: "PostBack/PBUserManager.ashx",
//        success: function (data) {
//            $.each(data, function (index) {
//                row = option.replaceAll("{value}", this['numFunctionCode']);
//                row = row.replaceAll("{item}", this['strFunctionName']);
//                allrow = allrow + row;
//            });
//            $("#" + Div).html(Header + allrow + footer);
//        }
//    });
//}
////-----------------------------------ثبت منو جدید------------------------------------
//function NewInsertAccessMenu()
//{
//    var Accessname = $("#txtAccessMenu").val();
//    if ($.trim(Accessname) == '') {
//        $("#loadingInsertAccess").html("<font style='color:#ff0000;'>نام منو یا بخش را وارد نمایید</font>");
//        setTimeout(function () { $("#loadingInsertAccess").html(""); }, 3000);
//    }
//    else {
//        if (confirm("آیا از ثبت اطمینان دارید ؟")) {
//            $("#loadingInsertAccess").html("<img src='Images/loading.gif' />");
//            $.ajax({
//                type: "POST",
//                async: true,
//                cache: false,
//                dataType: "json",
//                data: { i: 23, Accessname: Accessname },
//                url: "PostBack/PBUserManager.ashx",
//                success: function (data) {
//                    if (data.result == '1') {
//                        $("#loadingInsertAccess").html("<font style='color:green;'>با موفقیت ثبت شد</font>");
//                        setTimeout(function () { $("#loadingInsertAccess").html(""); }, 3000);
//                        $("#txtAccessMenu").val("");
//                        Getroles();
//                    }
//                    else if (data.result == '5') {
//                        $("#loadingInsertAccess").html("<font style='color:#ff0000;'>این نقش قبلا ثبت شده است</font>");
//                        setTimeout(function () { $("#loadingInsertAccess").html(""); }, 3000);
//                    }
//                    else if (data.result == '15') {
//                        ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
//                        $("#loadingInsertAccess").html("");
//                    }
//                },
//                error: function (xhr, textStatus, errorThrown) {
//                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
//                    $("#loadingInsertAccess").html("");
//                }
//            });
//        }
//    }
//}