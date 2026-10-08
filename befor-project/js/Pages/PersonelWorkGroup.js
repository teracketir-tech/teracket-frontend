$(document).ready(function () {

    // $("#divPersonelTabs").tabs();
    $("#divPersonelWorkGroup").tabs();
    GetTabsDeActive("divPersonelWorkGroup");

    $("#txtPersonelCodeForWorkGroup").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            GetInfoPersonelWorKGroup();
            return false;
        }
    });
    $("#btnSaveNewWorkGroupCode").click(function () { SaveWorkGroupNew(); return false; });

    $("#btnSearchPersonelCodeWorkGroupCode").click(function () { GetInfoPersonelWorKGroup(); return false; });
    $("#btnSearchPersonelCodeWorkGroupCodeAll").click(function () { GetInfoPersonelWorKGroupAll(); return false; });

    $("#btnSearchPersonelCodeCutWork").click(function () { SearchGetPersonelInfoCutWork(); return false; });

    $("#btnSearchPersonelCodeReContract").click(function () { SearchPersonelInfoForReContract(); return false; });

    $("#btnSaveBakhshNewWorkGroupCode").click(function () { SaveBakhshWorkGroupNew(); return false; });

    $("#btnSaveGhesmatNewWorkGroupCode").click(function () { SaveGhesmatWorkGroupNew(); return false; });

    $("#btnSaveOnvanNewWorkGroupCode").click(function () { SaveOnvanWorkGroupNew(); return false; });

    $("#btnReportWorkGroupPersonelSearch").click(function () { GetReportInfoPersonelWorkGroup(1); return false; });
    

    GetAllWorkGroup();
    GetAllBakhshWorkGroup();
    GetAllGhesmatWorkGroup();
    GetAllOnvanWorkGroup();
    GetDrpdwnBaseAll();
});
//============================================================================
//============================================================================
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
var drpdwnBakhshWorkgroup = "";
var drpdwnghesmateWorkgroup = "";
var drpdwnWorkgroup = "";
var drpdwnOnvaneWorkgroup = "";
var drpdwnContractKinds = "";
//============================================================================
//============================================================================
function GetDrpdwnBaseAll() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    drpdwnBakhshWorkgroup = "";
    drpdwnWorkgroup = "";
    drpdwnghesmateWorkgroup = "";
    drpdwnOnvaneWorkgroup = "";
    drpdwnContractKinds = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            drpdwnWorkgroup = data[0];
            drpdwnBakhshWorkgroup = data[1];
            drpdwnghesmateWorkgroup = data[2];
            drpdwnOnvaneWorkgroup = data[3];
            drpdwnContractKinds = data[4];
            ShowDrpDwnInRegisterPage("", -1, 0);
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//============================================================================
function ShowDrpDwnInRegisterPage(drpdwnname, value, type) {
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' >";
    selectStart2 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' onchange='ShowDrpDwnInRegisterPage(\"{itemfor}\",this.value,1);' >";
    selectStart3 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' onchange='ShowDrpDwnInRegisterPage(\"{itemfor}\",this.value,2);' >";
    selectStart4 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' onchange='ShowDrpDwnInRegisterPage(\"{itemfor}\",this.value,3);' >";
    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}'>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";

    if (type == 0) {

        $.each(drpdwnContractKinds, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnSearchContractKind");
        $("#tddrpdwnSearchContractKind").html(selectTemp + option0 + allrow + selectEnd);

        //--------------------------------------------------------------------------
        //--------------------- workgroup -------------------------------------------
        allrow = "";
        $.each(drpdwnWorkgroup, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        var arraystr = "drpdwnWorkGroupPersonelContract,drpdwnGroupCode,drpdwnBakhshGroupCode,drpdwnGhesmatGroupCode,drpdwnGhesmatGroupCodeEdit,drpdwnOnvanGroupCodeEdit,drpdwnOnvanGroupCode,drpdwnSematGroupCode";
        var array = arraystr.split(',');

        for (var item = 0; item <= array.length; item++) {
            if (array[item] != undefined && array[item].trim() != "") {

                if (array[item].trim() == "drpdwnGroupCode" || array[item].trim() == "drpdwnBakhshGroupCode")

                    selectTemp = selectStart1.replaceAll("{dpdwnId}", array[item].trim().toString());
                else {
                    selectTemp = selectStart2.replaceAll("{dpdwnId}", array[item].trim().toString());
                    if (array[item].trim() == "drpdwnGhesmatGroupCodeEdit" || array[item].trim() == "drpdwnOnvanGroupCodeEdit")
                        selectTemp = selectTemp.replaceAll("{itemfor}", array[item].trim().toString().replace("Edit", "") + "BakhshEdit");
                    else
                        selectTemp = selectTemp.replaceAll("{itemfor}", array[item].trim().toString() + "Bakhsh");
                }

                $("#Div" + array[item].trim().toString()).html(selectTemp + option0 + allrow + selectEnd);
            }
        }
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var arraystr2 = "drpdwnWorkGroupPersonelContract,drpdwnGhesmatGroupCode,drpdwnOnvanGroupCode,drpdwnSematGroupCode,drpdwnGhesmatGroupCodeBakhshEdit,drpdwnOnvanGroupCodeBakhshEdit";
        var array2 = arraystr2.split(',');

        for (var item = 0; item <= array2.length; item++) {
            if (array2[item] != undefined && array2[item].trim() != "") {
                if (array2[item].trim() != "drpdwnGhesmatGroupCodeBakhshEdit" && array2[item].trim() != "drpdwnOnvanGroupCodeBakhshEdit") {
                    selectTemp = selectStart3.replaceAll("{dpdwnId}", array2[item].trim().toString() + "Bakhsh");
                    selectTemp = selectTemp.replaceAll("{itemfor}", array2[item].trim().toString() + "Ghesmat");
                    $("#Div" + array2[item].trim().toString() + "Bakhsh").html(selectTemp + option0 + selectEnd);
                }
                else {
                    selectTemp = selectStart3.replaceAll("{dpdwnId}", array2[item].trim().toString().replace("BakhshEdit", "") + "BakhshEdit");
                    selectTemp = selectTemp.replaceAll("{itemfor}", array2[item].trim().toString().replace("BakhshEdit", "") + "GhesmatEdit");
                    $("#Div" + array2[item].trim().toString().replace("BakhshEdit", "") + "BakhshEdit").html(selectTemp + option0 + selectEnd);
                }
            }
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        var arraystr3 = "drpdwnWorkGroupPersonelContract,drpdwnOnvanGroupCode,drpdwnSematGroupCode,drpdwnOnvanGroupCodeGhesmatEdit";
        var array3 = arraystr3.split(',');

        for (var item = 0; item <= array3.length; item++) {
            if (array3[item] != undefined && array3[item].trim() != "") {
                if (array3[item].trim() != "drpdwnOnvanGroupCodeGhesmatEdit") {
                    selectTemp = selectStart4.replaceAll("{dpdwnId}", array3[item].trim().toString() + "Ghesmat");
                    selectTemp = selectTemp.replaceAll("{itemfor}", array3[item].trim().toString() + "Onvan");
                    $("#Div" + array3[item].trim().toString() + "Ghesmat").html(selectTemp + option0 + selectEnd);
                }
                else {
                    selectTemp = selectStart4.replaceAll("{dpdwnId}", array3[item].trim().toString().replace("GhesmatEdit", "") + "GhesmatEdit");
                    selectTemp = selectTemp.replaceAll("{itemfor}", array3[item].trim().toString() + "OnvanEdit");
                    $("#Div" + array3[item].trim().toString().replace("GhesmatEdit", "") + "GhesmatEdit").html(selectTemp + option0 + selectEnd);
                }
            }
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        var arraystr4 = "drpdwnSematGroupCodeOnvan,drpdwnWorkGroupPersonelContractOnvan";
        var array4 = arraystr4.split(',');

        for (var item = 0; item <= array4.length; item++) {
            if (array4[item] != undefined && array4[item].trim() != "") {
                selectTemp = selectStart1.replaceAll("{dpdwnId}", array4[item].trim().toString());
                selectTemp = selectTemp.replaceAll("{itemfor}", array4[item].trim().toString());
                $("#Div" + array4[item].trim().toString()).html(selectTemp + option0 + selectEnd);
            }
        }

    }

    if (type == 1) {
        //--------------------- bakhsh -------------------------------------------
        allrow = "";
        $.each(drpdwnBakhshWorkgroup, function (index) {
            if (value == this['groupcode']) {
                row = option.replaceAll("{value}", this['value']);
                row = row.replaceAll("{item}", this['item']);
                allrow = allrow + row;
            }
        });
        if (allrow != "") {
            selectTemp = selectStart3.replaceAll("{dpdwnId}", drpdwnname.toString());
            selectTemp = selectTemp.replaceAll("{itemfor}", drpdwnname.toString().replaceAll("Bakhsh", "Ghesmat"));
            $("#Div" + drpdwnname.toString()).html(selectTemp + option0 + allrow + selectEnd);
        }
        else if (allrow == "") {
            selectTemp = selectStart3.replaceAll("{dpdwnId}", drpdwnname.toString());
            selectTemp = selectTemp.replaceAll("{itemfor}", drpdwnname.toString().replaceAll("Bakhsh", "Ghesmat"));
            $("#Div" + drpdwnname.toString()).html(selectTemp + option0 + selectEnd);
        }

    }
    else if (type == 2) //==ghesmat
    {
        allrow = "";
        $.each(drpdwnghesmateWorkgroup, function (index) {
            if (value == this['bakhshgroup']) {
                row = option.replaceAll("{value}", this['value']);
                row = row.replaceAll("{item}", this['item']);
                allrow = allrow + row;
            }
        });

        if (allrow != "") {
            selectTemp = selectStart4.replaceAll("{dpdwnId}", drpdwnname.toString());
            selectTemp = selectTemp.replaceAll("{itemfor}", drpdwnname.toString().replaceAll("Ghesmat", "Onvan"));
            $("#Div" + drpdwnname.toString()).html(selectTemp + option0 + allrow + selectEnd);
        }
        else if (allrow == "") {
            selectTemp = selectStart4.replaceAll("{dpdwnId}", drpdwnname.toString());
            selectTemp = selectTemp.replaceAll("{itemfor}", drpdwnname.toString().replaceAll("Ghesmat", "Onvan"));
            $("#Div" + drpdwnname.toString()).html(selectTemp + option0 + selectEnd);
        }
    }
    else if (type == 3) //==onvan shoghli
    {
        allrow = "";
        $.each(drpdwnOnvaneWorkgroup, function (index) {
            if (value == this['ghesmatcode']) {
                row = option.replaceAll("{value}", this['value']);
                row = row.replaceAll("{item}", this['item']);
                allrow = allrow + row;
            }
        });

        if (allrow != "") {
            selectTemp = selectStart1.replaceAll("{dpdwnId}", drpdwnname.toString());
            selectTemp = selectTemp.replaceAll("{itemfor}", drpdwnname.toString().replaceAll("Ghesmat", "Onvan"));
            $("#Div" + drpdwnname.toString()).html(selectTemp + option0 + allrow + selectEnd);
        }
        else if (allrow == "") {
            selectTemp = selectStart1.replaceAll("{dpdwnId}", drpdwnname.toString());
            selectTemp = selectTemp.replaceAll("{itemfor}", drpdwnname.toString().replaceAll("Ghesmat", "Onvan"));
            $("#Div" + drpdwnname.toString()).html(selectTemp + option0 + selectEnd);
        }
    }

    //===================================== ghesmat =========================
    //if (type == 5) {
    //    allrow = "";
    //    $.each(drpdwnghesmateWorkgroup, function (index) {
    //        if ($("#drpdwnOnvanGroupCode").val() == this['groupcode'] && $("#drpdwnOnvanGroupCodeBakhsh").val() == this['bakhshgroup']) {
    //            row = option.replaceAll("{value}", this['value']);
    //            row = row.replaceAll("{item}", this['item']);
    //            allrow = allrow + row;
    //        }
    //    });


    //    if (allrow != "") {
    //        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnOnvanGroupCodeGhesmat");
    //        $("#DivdrpdwnOnvanGroupCodeGhesmat").html(selectTemp + option0 + allrow + selectEnd);
    //    }
    //    else if (allrow == "") {
    //        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnOnvanGroupCodeGhesmat");
    //        $("#DivdrpdwnOnvanGroupCodeGhesmat").html(selectTemp + option0 + selectEnd);
    //    }
    //}

}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//-----------------------------------اضافه کردن گروه کاری جدید------------------------------------
function SaveWorkGroupNew() {
    var groupName = $("#txtNameGroupCodeNew").val();
    if ($.trim(groupName) == '') {
        ShowAlert("نام گروه کاری را وارد نمایید!");
        return;
    }
    else {

        if (confirm("آیا از ثبت گروه کاری جدیداطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 2, groupName: groupName },
                url: "PostBack/PBPersonelWorkGroup.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();

                    if (data == '1') {
                        ShowAlert("گروه کاری جدید با موفقیت ثبت شد");
                        $("#txtNameGroupCodeNew").val("");
                        GetAllWorkGroup();
                        GetDrpdwnBaseAll();
                    }
                    else if (data == '5') {
                        ShowAlert("این گروه کاری قبلا ثبت شده است");
                    }
                    else if (data == '15') {
                        ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");

                }
            });
        }
    }
}
//-----------------------------------گزارش گروه کاری جدید------------------------------------
var workGroupRow = 0;
var drpdwnWorkGroup = "";
function GetAllWorkGroup() {
    workGroupRow = 0;
    drpdwnWorkGroup = "";
    $("#ResultDivGroupCodeNew").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>گروه کاری</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>";
    var mainrow = "<tr id='trWorkGroupRow{Row}'><td>{Row}</td><td id='tdWorkgroupName{Row}'>{workgroup}</td><td>{status}</td><td>{Action}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 3 },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            drpdwnWorkGroup = data;
            $.each(data, function (index) {
                row = mainrow.replaceAll("{workgroup}", this['strWorkGroupName']);
                row = row.replaceAll("{status}", "<input id='chkWorkgroup{Row}' type='checkbox' {checked} onclick='SetActiveWorkGroup({Row},{code});' /><div id='divloadingStatusWorkGroup{Row}' style='display:none;'></div>");
                row = row.replaceAll("{checked}", this['numStatus'] == 1 ? " checked='checked' " : "");
                row = row.replaceAll("{Action}", "<img src='images/Edit.png' onclick='ShowEditWorkGroup({Row},{code});' style='cursor: pointer;' /> <img id='imgDelWorkGroup{Row}' src='images/delete.png' onclick='DeletetWorkGroup({Row},{code});' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelWorkGroup{Row}' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' /> ");
                row = row.replaceAll("{code}", this['numWorkGroupCode']);
                row = row.replaceAll("{Row}", i);
                i++;
                allrow = allrow + row;
                t = 1;
                workGroupRow = i - 1;
            });
            if (t == 1) {
                $("#ResultDivGroupCodeNew").html(header + header2 + allrow + footer);
            }
            else {
                $("#ResultDivGroupCodeNew").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivGroupCodeNew").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------فعال یا غیر فعال کردن گروه کاری------------------------------------
function SetActiveWorkGroup(row, code) {
    var checkis = 0;
    if ($("#chkWorkgroup" + row.toString()).attr("checked")) checkis = 1
    else checkis = 0;
    $("#chkWorkgroup" + row.toString()).hide();
    $("#divloadingStatusWorkGroup" + row.toString()).html("<img src='Images/loading.gif' />");
    $("#divloadingStatusWorkGroup" + row.toString()).show();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 4, checkis: checkis, code: code },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            if (data == '1') {
                $("#chkWorkgroup" + row.toString()).show();
                $("#divloadingStatusWorkGroup" + row.toString()).html("");
                $("#divloadingStatusWorkGroup" + row.toString()).hide();
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");

                $("#chkWorkgroup" + row.toString()).show();
                $("#divloadingStatusWorkGroup" + row.toString()).html("");
                $("#divloadingStatusWorkGroup" + row.toString()).hide();

                if (checkis == 0) {
                    $("#chkWorkgroup" + row.toString()).attr("checked", "checked");
                }
                else {
                    $("#chkWorkgroup" + row.toString()).removeAttr("checked");
                }

            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#chkWorkgroup" + row.toString()).show();
            $("#divloadingStatusWorkGroup" + row.toString()).html("");
            $("#divloadingStatusWorkGroup" + row.toString()).hide();
            if (checkis == 0) {
                $("#chkWorkgroup" + row.toString()).attr("checked", "checked");
            }
            else {
                $("#chkWorkgroup" + row.toString()).removeAttr("checked");
            }
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------ویرایش گروه کاری------------------------------------
function ShowEditWorkGroup(row, code) {
    $("#pnlEditWorkgroupCode").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش نام گروه کاری",
        width: 300,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {
                $(this).dialog("close");

                SaveEditWorkgroup(row, code);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });
    $("#DivEditworkGroupCodeHide" + row.toString()).html(code);
    $("#txtNameGroupCodeNewEdit").val($.trim($("#tdWorkgroupName" + row.toString()).html()));
    $("#pnlEditWorkgroupCode").dialog("open");
}
//-----------------------------------ثبت ویرایش گروه کاری------------------------------------
function SaveEditWorkgroup(row, code) {
    var groupName = $.trim($("#txtNameGroupCodeNewEdit").val());
    if ($.trim(groupName) == '') {
        ShowAlert("نام گروه کاری را وارد نمایید!");
        return;
    }
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 5, code: code, groupName: groupName },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == '1') {
                ShowAlert("اطلاعات با موفقیت ویرایش شد");
                $("#txtNameGroupCodeNewEdit").val("");
                $("#tdWorkgroupName" + row.toString()).html(groupName);
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#txtNameGroupCodeNewEdit").val("");
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------حذف گروه کاری------------------------------------
function DeletetWorkGroup(row, code) {
    if (confirm("آیا از حذف گروه کاری اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 6, code: code },
            url: "PostBack/PBPersonelWorkGroup.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#trWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '2') {
                    ShowAlert("این گروه کاری قبلا به کار گرفته شده است");
                }
                else if (data == '5') {
                    ShowAlert("اطلاعات این گروه کاری وجود ندارد");
                    $("#trWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '15') {
                    ShowAlert("خطا در حذف اطلاعات ، دوباره امتحان کنید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
            }
        });
    }
}
//-----------------------------------نمایش اطلاعات پرسنل برای گروه کاری------------------------------------
var personelRowWorkgroup = 0;
function GetInfoPersonelWorKGroup() {
    personelRowWorkgroup = 0;
    var personelcode = $.trim($("#txtPersonelCodeForWorkGroup").val());
    if (personelcode == "") {
        ShowAlert("کد پرسنلی را وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(personelcode)) {
        ShowAlert("لطفا کد پرسنلی را به صورت عددی وارد نمایید!");
        return;
    }

    $("#ResultDivGroupCodePersonelInfo").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>کد پرسنلی</th><th>نام و نام خانوادگی</th><th>شماره قرارداد</th><th>تاریخ شروع قرارداد</th><th>تاریخ پایان قرارداد</th><th>تاریخ قطع همکاری</th><th>تاریخ/ساعت ثبت گروه کاری</th><th>گروه کاری</th><th>بخش</th><th>قسمت</th><th>عنوان</th></tr></thead><tbody>";
    var mainrow = "<tr id='trWorkGroupPersonelRow{Row}'  {css2}><td {css1}>{Row}</td><td id='tdPersonelCodeforworkgroup{Row}' {css1}>{personelCode}</td><td {css1}>{Name}</td><td {css1}>{contractCode}</td><td {css1}>{datestart}</td><td {css1}>{dateEnd}</td><td {css1}>{dateCut}</td><td {css1}>{datereg}</td><td {css1}>{workgroup}</td><td id='tddrpdwnBakhsh{Row}' {css1} >{bakhsh}</td><td id='tddrpdwnGhesmat{Row}' {css1} >{ghesmat}</td><td id='tddrpdwnOnvan{Row}' {css1} >{onvan}</td></tr>";
    var footer = "</tbody></table>";
    var btn = "<div style='text-align:center;padding:10px 0;'><input id='btnSaveWorkGroupForPersonel' type='button' value='ثبت' onclick='SaveWorkGroupForPersonel();' /></div>"
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;


    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 7, personelcode: personelcode },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            if (data == "2") {
                ShowAlert("اطلاعاتی از این کد پرسنلی یافت نشد!");
            }
            else {
                var checkBtnSaveWorkGroup = data[1];
                $.each(data[0], function (index) {

                    row = mainrow.replaceAll("{Name}", this['strPersonelName']);
                    row = row.replaceAll("{datestart}", this['dateStartContractDate']);
                    row = row.replaceAll("{dateEnd}", this['dateEndContractDate']);
                    row = row.replaceAll("{dateCut}", this['dateCutWorkDate']);
                    row = row.replaceAll("{workgroup}", this['flag'] == 0 ? this["strWorkGroupName"] : GetdrpdwnWorkGroup(i, this['numWorkGroupRef']));
                    row = row.replaceAll("{bakhsh}", this['flag'] == 0 ? this["strBakhshName"] : GetdrpdwnBakhsh(1, this['numWorkGroupRef'], this['numBakhshWorkGroupRef'], i));
                    row = row.replaceAll("{ghesmat}", this['flag'] == 0 ? this["strGhesmatName"] : GetdrpdwnGhesmat(1, this['numWorkGroupRef'], this['numBakhshWorkGroupRef'], this['numGhesmatWorkgroupRef'], i));
                    row = row.replaceAll("{onvan}", this['flag'] == 0 ? this["strOnvanName"] : GetdrpdwnOnvan(1, this['numWorkGroupRef'], this['numBakhshWorkGroupRef'], this['numGhesmatWorkgroupRef'], this['numOnvanWorkGroupRef'], i));

                    row = row.replaceAll("{datereg}", this['flag'] == 0 ? this['dateRegisterDate'] + "<br/>" + this['timeRegisterTime'] : "--");
                    row = row.replaceAll("{css2}", ""); // this['flag'] == 0 ? "" : " style='background-color:#7266BA;'");
                    row = row.replaceAll("{css1}", ""); //this['flag'] == 0 ? "" : " style='color:#000000;'");
                    row = row.replaceAll("{personelCode}", this['numPersonelCode']);


                    row = row.replaceAll("{contractCode}", this['StrContractUniqCode']);
                    row = row.replaceAll("{Row}", i);
                    i++;
                    allrow = allrow + row;
                    t = 1;
                    personelRowWorkgroup = i - 1;
                });
                if (t == 1) {
                    $("#ResultDivGroupCodePersonelInfo").html(header + header2 + allrow + footer + (checkBtnSaveWorkGroup > 0 ? btn : ""));
                    $("#ResultDivGroupCodePersonelInfo").show();
                    $("#btnSaveWorkGroupForPersonel").button();
                }
                else {
                    $("#ResultDivGroupCodePersonelInfo").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                    $("#ResultDivGroupCodePersonelInfo").show();
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            $("#ResultDivGroupCodePersonelInfo").hide();
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
        }
    });

}
//-----------------------------------دراپ دان گروه کاری------------------------------------
function GetdrpdwnWorkGroup(RowId, workgroupCode) {
    var selectStart = "<select id='drpdwnWorkgroup{row}' class='InputSelectRightToLeftText'  style='width:100px;' onchange='GetdrpdwnBakhsh(2,this.value,-1,{row});GetdrpdwnGhesmat(3,this.value,-1,-1,{row});GetdrpdwnOnvan(4,this.value,-1,-1,-1,{row});'>";
    var option0 = "<option value='-1'>انتخاب کنید...</option>";
    var option = "<option value='{value}' {selected}>{item}</option>";
    var selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    $.each(drpdwnWorkGroup, function (index) {
        row = option.replaceAll("{value}", this['numWorkGroupCode']);
        row = row.replaceAll("{item}", this['strWorkGroupName']);
        if (this['numWorkGroupCode'] == workgroupCode)
            row = row.replaceAll("{selected}", " selected='selected'");
        else
            row = row.replaceAll("{selected}", "");
        allrow = allrow + row;
    });
    selectTemp = selectStart.replaceAll("{row}", RowId);
    var ret = selectTemp + option0 + allrow + selectEnd;
    return ret;
}
//-----------------------------------دراپ دان بخش گروه کاری------------------------------------
function GetdrpdwnBakhsh(type, value, value1, radif) {
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:100px;' onchange='GetdrpdwnGhesmat(2," + value + ",this.value,-1,{row});GetdrpdwnOnvan(3," + value + "," + value1 + ",this.value,-1,{row});'>";
    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}' {selected}>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (value != -1) {
        $.each(drpdwnBakhshWorkgroup, function (index) {
            if (this['groupcode'] == value) {
                row = option.replaceAll("{value}", this['value']);
                row = row.replaceAll("{item}", this['item']);
                if (this['value'] == value1)
                    row = row.replaceAll("{selected}", " selected='selected'");
                else
                    row = row.replaceAll("{selected}", "");
                allrow = allrow + row;
            }
        });
    }
    selectTemp = selectStart1.replaceAll("{row}", radif);
    selectTemp = selectTemp.replaceAll("{dpdwnId}", "drpdwnWorkgroupBakhsh" + radif);
    var ret = selectTemp + option0 + allrow + selectEnd;
    if (type == 1) return ret;
    else if (type == 2) $("#tddrpdwnBakhsh" + radif).html(ret);
}
//-----------------------------------دراپ دان قسمت گروه کاری------------------------------------
function GetdrpdwnGhesmat(type, value, value2, value3, radif) {
    if (type == 3) value2 = $("#drpdwnWorkgroupBakhsh" + radif).val();
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:100px;' onchange='GetdrpdwnOnvan(4," + value + "," + value2 + ",this.value,-1,{row});' >";
    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}' {selected}>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (value != -1 && value2 != -1) {
        $.each(drpdwnghesmateWorkgroup, function (index) {
            if (this['groupcode'] == value && this['bakhshgroup'] == value2) {
                row = option.replaceAll("{value}", this['value']);
                row = row.replaceAll("{item}", this['item']);

                if (this['value'] == value3)
                    row = row.replaceAll("{selected}", " selected='selected'");
                else
                    row = row.replaceAll("{selected}", "");

                allrow = allrow + row;
            }
        });
    }
    selectTemp = selectStart1.replaceAll("{row}", radif);
    selectTemp = selectTemp.replaceAll("{dpdwnId}", "drpdwnWorkgroupGhesmat" + radif);
    var ret = selectTemp + option0 + allrow + selectEnd;
    if (type == 1) return ret;
    else if (type == 2 || type == 3) $("#tddrpdwnGhesmat" + radif).html(ret);
}
//-----------------------------------دراپ دان عنوان گروه کاری------------------------------------
function GetdrpdwnOnvan(type, value, value2, value3, value4, radif) {
    if (type == 4) value3 = $("#drpdwnWorkgroupGhesmat" + radif).val();
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:100px;' >";
    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}' {selected}>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (value != -1 && value2 != -1 && value3 !=-1) {
        $.each(drpdwnOnvaneWorkgroup, function (index) {
            if (this['groupcode'] == value && this['bakhshgroup'] == value2 && this['ghesmatcode'] == value3) {
                row = option.replaceAll("{value}", this['value']);
                row = row.replaceAll("{item}", this['item']);

                if (this['value'] == value4)
                    row = row.replaceAll("{selected}", " selected='selected'");
                else
                    row = row.replaceAll("{selected}", "");

                allrow = allrow + row;
            }
        });
    }
    selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnWorkgroupOnvan" + radif);
    var ret = selectTemp + option0 + allrow + selectEnd;
    if (type == 1) return ret;
    else if (type == 2 || type == 3 || type == 4) $("#tddrpdwnOnvan" + radif).html(ret);
}
//-----------------------------------ذخیره گروه کاری برای پرسنل-----------------------------------
function SaveWorkGroupForPersonel() {
    var strtemp = "";
    var checkValue = 0;
    for (var i = 1; i <= personelRowWorkgroup; i++) {
        if (($("#drpdwnWorkgroup" + i.toString()).val() != null && $("#drpdwnWorkgroup" + i.toString()).val() != undefined && $("#drpdwnWorkgroup" + i.toString()).val() != "") &&
            ($("#drpdwnWorkgroupBakhsh" + i.toString()).val() != null && $("#drpdwnWorkgroupBakhsh" + i.toString()).val() != undefined && $("#drpdwnWorkgroupBakhsh" + i.toString()).val() != "") &&
            ($("#drpdwnWorkgroupGhesmat" + i.toString()).val() != null && $("#drpdwnWorkgroupGhesmat" + i.toString()).val() != undefined && $("#drpdwnWorkgroupGhesmat" + i.toString()).val() != "") &&
            ($("#drpdwnWorkgroupOnvan" + i.toString()).val() != null && $("#drpdwnWorkgroupOnvan" + i.toString()).val() != undefined && $("#drpdwnWorkgroupOnvan" + i.toString()).val() != "")
            ) {
            checkValue = 0;
            if ($("#drpdwnWorkgroup" + i.toString()).val() == "-1") checkValue = 1;
            if ($("#drpdwnWorkgroupBakhsh" + i.toString()).val() == "-1") checkValue = 2;
            if ($("#drpdwnWorkgroupGhesmat" + i.toString()).val() == "-1") checkValue = 4;
            if ($('#drpdwnWorkgroupOnvan' + i.toString() + ' > option').length > 1 && $("#drpdwnWorkgroupOnvan" + i.toString()).val() == "-1") checkValue = 5;

            strtemp = strtemp + $.trim($("#tdPersonelCodeforworkgroup" + i.toString()).html()) + "^" + $("#drpdwnWorkgroup" + i.toString()).val() + "^" + $("#drpdwnWorkgroupBakhsh" + i.toString()).val() + "^" + $("#drpdwnWorkgroupGhesmat" + i.toString()).val() + "^" + $("#drpdwnWorkgroupOnvan" + i.toString()).val() + ",";
        }
        else {
            checkValue = 3;
        }
    }

    if (checkValue == 1) {
        ShowAlert("لطفا گروه کاری جدید را مشخص نمایید !");
        return;
    }
    else if (checkValue == 2) {
        ShowAlert("لطفا بخش گروه کاری را مشخص نمایید !");
        return;
    }
    else if (checkValue == 4) {
        ShowAlert("لطفا قسمت گروه کاری را مشخص نمایید !");
        return;
    }
    else if (checkValue == 5) {
        ShowAlert("لطفا عنوان گروه کاری را مشخص نمایید !");
        return;
    }
    else if (checkValue == 3) {
        ShowAlert("لطفا اطلاعات خواسته شده را انتخاب نمایید !");
        return;
    }
    if (confirm("آیا از ثبت گروه کاری ها برای این پرسنل اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 8, strtemp: strtemp },
            url: "PostBack/PBPersonelWorkGroup.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                if (data == '1') {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    GetInfoPersonelWorKGroup();
                }
                else if (data == '2') {
                    ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
            }
        });
    }
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//-----------------------------------اضافه کردن بخش گروه کاری جدید------------------------------------
function SaveBakhshWorkGroupNew() {
    var BakhshgroupName = $.trim($("#txtNameBakhshGroupCodeNew").val());
    var groupcode = $("#drpdwnGroupCode").val();
    if ($.trim(BakhshgroupName) == '' || groupcode == "-1") {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }
    else {

        if (confirm("آیا از ثبت نام بخش گروه کاری اطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 10, groupcode: groupcode, BakhshgroupName: BakhshgroupName },
                url: "PostBack/PBPersonelWorkGroup.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();

                    if (data == '1') {
                        ShowAlert("بخش گروه کاری  با موفقیت ثبت شد");
                        $("#txtNameBakhshGroupCodeNew").val("");
                        GetAllBakhshWorkGroup();
                        GetDrpdwnBaseAll();
                    }
                    else if (data == '5') {
                        ShowAlert("این بخش گروه کاری قبلا ثبت شده است");
                    }
                    else if (data == '15') {
                        ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");

                }
            });
        }
    }
}
//-----------------------------------گزارش بخش گروه کاری جدید------------------------------------
var BakhshworkGroupRow = 0;
var BakhshdrpdwnWorkGroup = "";
function GetAllBakhshWorkGroup() {
    BakhshworkGroupRow = 0;
    BakhshdrpdwnWorkGroup = "";
    $("#ResultDivBakhshGroupCodeNew").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>گروه کاری</th><th>بخش</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>";
    var mainrow = "<tr id='trBakhshWorkGroupRow{Row}'><td>{Row}</td><td id='tdBakhshWorkgroupName{Row}'>{workgroup}</td><td id='tdBakhshWorkgroupNameBakhsh{Row}'>{bakhsh}</td><td>{status}</td><td>{Action}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 9 },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            BakhshdrpdwnWorkGroup = data;
            $.each(data, function (index) {
                row = mainrow.replaceAll("{workgroup}", this['strWorkGroupName']);
                row = row.replaceAll("{status}", "<input id='chkWorkgroupBakhsh{Row}' type='checkbox' {checked} onclick='SetActiveWorkGroupBakhsh({Row},{code});' /><div id='divloadingStatusWorkGroupBakhsh{Row}' style='display:none;'></div>");
                row = row.replaceAll("{checked}", this['numStatus'] == 1 ? " checked='checked' " : "");
                row = row.replaceAll("{Action}", "<img src='images/Edit.png' onclick='ShowEditWorkGroupBakhsh({Row},{code});' style='cursor: pointer;' /> <img id='imgDelWorkGroupBakhsh{Row}' src='images/delete.png' onclick='DeletetWorkGroupBakhsh({Row},{code});' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelWorkGroupBakhsh{Row}' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' /> ");
                row = row.replaceAll("{code}", this['numBakhshWorkGroupCode']);
                row = row.replaceAll("{bakhsh}", this['strBakhshName']);
                row = row.replaceAll("{Row}", i);
                i++;
                allrow = allrow + row;
                t = 1;
                BakhshworkGroupRow = i - 1;
            });
            if (t == 1) {
                $("#ResultDivBakhshGroupCodeNew").html(header + header2 + allrow + footer);
            }
            else {
                $("#ResultDivBakhshGroupCodeNew").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivBakhshGroupCodeNew").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------فعال یا غیر فعال کردن بخش گروه کاری------------------------------------
function SetActiveWorkGroupBakhsh(row, code) {
    var checkis = 0;
    if ($("#chkWorkgroupBakhsh" + row.toString()).attr("checked")) checkis = 1
    else checkis = 0;
    $("#chkWorkgroupBakhsh" + row.toString()).hide();
    $("#divloadingStatusWorkGroupBakhsh" + row.toString()).html("<img src='Images/loading.gif' />");
    $("#divloadingStatusWorkGroupBakhsh" + row.toString()).show();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 11, checkis: checkis, code: code },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            if (data == '1') {
                $("#chkWorkgroupBakhsh" + row.toString()).show();
                $("#divloadingStatusWorkGroupBakhsh" + row.toString()).html("");
                $("#divloadingStatusWorkGroupBakhsh" + row.toString()).hide();
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");

                $("#chkWorkgroupBakhsh" + row.toString()).show();
                $("#divloadingStatusWorkGroupBakhsh" + row.toString()).html("");
                $("#divloadingStatusWorkGroupBakhsh" + row.toString()).hide();

                if (checkis == 0) {
                    $("#chkWorkgroupBakhsh" + row.toString()).attr("checked", "checked");
                }
                else {
                    $("#chkWorkgroupBakhsh" + row.toString()).removeAttr("checked");
                }
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#chkWorkgroupBakhsh" + row.toString()).show();
            $("#divloadingStatusWorkGroupBakhsh" + row.toString()).html("");
            $("#divloadingStatusWorkGroupBakhsh" + row.toString()).hide();
            if (checkis == 0) {
                $("#chkWorkgroupBakhsh" + row.toString()).attr("checked", "checked");
            }
            else {
                $("#chkWorkgroupBakhsh" + row.toString()).removeAttr("checked");
            }
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------ویرایش بخش گروه کاری------------------------------------
function ShowEditWorkGroupBakhsh(row, code) {
    $("#pnlEditBakhshWorkgroupCode").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش نام بخش گروه کاری",
        width: 300,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {

                SaveEditBakhshWorkgroup(row, code);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });
    $("#DivEditBakhshworkGroupCodeHide" + row.toString()).html(code);
    $("#drpdwnBakhshGroupCode option").filter(function () {
        return $(this).text() == $.trim($("#tdBakhshWorkgroupName" + row.toString()).html());
    }).prop('selected', true);

    $("#txtNameBakhshGroupCodeNewEdit").val($.trim($("#tdBakhshWorkgroupNameBakhsh" + row.toString()).html()));
    $("#pnlEditBakhshWorkgroupCode").dialog("open");
}
//-----------------------------------ثبت ویرایش بخش گروه کاری------------------------------------
function SaveEditBakhshWorkgroup(row, code) {
    var BakhshgroupName = $.trim($("#txtNameBakhshGroupCodeNewEdit").val());
    var groupcode = $.trim($("#drpdwnBakhshGroupCode").val());
    var grouptext = $.trim($("#drpdwnBakhshGroupCode option:selected").text());
    if ($.trim(BakhshgroupName) == '' || groupcode == "-1") {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 12, code: code, BakhshgroupName: BakhshgroupName, groupcode: groupcode },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == '1') {
                ShowAlert("اطلاعات با موفقیت ویرایش شد");
                $("#txtNameBakhshGroupCodeNewEdit").val("");
                $("#drpdwnBakhshGroupCode").val("-1");
                $("#tdBakhshWorkgroupName" + row.toString()).html(grouptext);
                $("#tdBakhshWorkgroupNameBakhsh" + row.toString()).html(BakhshgroupName);
                $("#pnlEditBakhshWorkgroupCode").dialog("close");
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#txtNameBakhshGroupCodeNewEdit").val("");
            $("#drpdwnBakhshGroupCode").val("-1");
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------حذف بخش گروه کاری------------------------------------
function DeletetWorkGroupBakhsh(row, code) {
    if (confirm("آیا از حذف بخش گروه کاری اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 13, code: code },
            url: "PostBack/PBPersonelWorkGroup.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#trBakhshWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '2') {
                    ShowAlert("این بخش گروه کاری قبلا به کار گرفته شده است");
                }
                else if (data == '5') {
                    ShowAlert("اطلاعات این بخش گروه کاری وجود ندارد");
                    $("#trBakhshWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '15') {
                    ShowAlert("خطا در حذف اطلاعات ، دوباره امتحان کنید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
            }
        });
    }
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//-----------------------------------اضافه کردن قسمت گروه کاری جدید------------------------------------
function SaveGhesmatWorkGroupNew() {
    var GhesmatgroupName = $.trim($("#txtNameGhesmatGroupCodeNew").val());
    var groupcode = $("#drpdwnGhesmatGroupCode").val();
    var bakhsh = $("#drpdwnGhesmatGroupCodeBakhsh").val();
    if ($.trim(GhesmatgroupName) == '' || groupcode == "-1" || bakhsh == "-1") {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }
    else {

        if (confirm("آیا از ثبت نام قسمت گروه کاری اطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 14, groupcode: groupcode, GhesmatgroupName: GhesmatgroupName, bakhsh: bakhsh },
                url: "PostBack/PBPersonelWorkGroup.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();

                    if (data == '1') {
                        ShowAlert("قسمت گروه کاری  با موفقیت ثبت شد");
                        $("#txtNameGhesmatGroupCodeNew").val("");
                        GetAllGhesmatWorkGroup();
                        GetDrpdwnBaseAll();
                    }
                    else if (data == '5') {
                        ShowAlert("این قسمت گروه کاری قبلا ثبت شده است");
                    }
                    else if (data == '15') {
                        ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");

                }
            });
        }
    }
}
//-----------------------------------گزارش قسمت گروه کاری جدید------------------------------------
var GhesmatworkGroupRow = 0;
var GhesmatdrpdwnWorkGroup = "";
function GetAllGhesmatWorkGroup() {
    GhesmatworkGroupRow = 0;
    GhesmatdrpdwnWorkGroup = "";
    $("#ResultDivGhesmatGroupCodeNew").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>گروه کاری</th><th>بخش</th><th>قسمت</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>";
    var mainrow = "<tr id='trGhesmatWorkGroupRow{Row}'><td>{Row}</td><td id='tdGhesmatWorkgroupName{Row}'>{workgroup}</td><td id='tdGhesmatWorkgroupNameBakhsh{Row}'>{bakhsh}</td><td id='tdGhesmatWorkgroupNameGhesmat{Row}'>{ghesmat}</td><td>{status}</td><td>{Action}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 18 },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            GhesmatdrpdwnWorkGroup = data;
            $.each(data, function (index) {
                row = mainrow.replaceAll("{workgroup}", this['strWorkGroupName']);
                row = row.replaceAll("{status}", "<input id='chkWorkgroupGhesmat{Row}' type='checkbox' {checked} onclick='SetActiveWorkGroupGhesmat({Row},{code});' /><div id='divloadingStatusWorkGroupGhesmat{Row}' style='display:none;'></div>");
                row = row.replaceAll("{checked}", this['numStatus'] == 1 ? " checked='checked' " : "");
                row = row.replaceAll("{Action}", "<img src='images/Edit.png' onclick='ShowEditWorkGroupGhesmat({Row},{code});' style='cursor: pointer;' /> <img id='imgDelWorkGroupGhesmat{Row}' src='images/delete.png' onclick='DeletetWorkGroupGhesmat({Row},{code});' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelWorkGroupGhesmat{Row}' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' /> ");
                row = row.replaceAll("{code}", this['numGhesmatWorkgroupCode']);
                row = row.replaceAll("{ghesmat}", this['strGhesmatName']);
                row = row.replaceAll("{bakhsh}", this['strBakhshName']);
                row = row.replaceAll("{Row}", i);
                i++;
                allrow = allrow + row;
                t = 1;
                GhesmatworkGroupRow = i - 1;
            });
            if (t == 1) {
                $("#ResultDivGhesmatGroupCodeNew").html(header + header2 + allrow + footer);
            }
            else {
                $("#ResultDivGhesmatGroupCodeNew").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivGhesmatGroupCodeNew").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------فعال یا غیر فعال کردن قسمت گروه کاری------------------------------------
function SetActiveWorkGroupGhesmat(row, code) {
    var checkis = 0;
    if ($("#chkWorkgroupGhesmat" + row.toString()).attr("checked")) checkis = 1
    else checkis = 0;
    $("#chkWorkgroupGhesmat" + row.toString()).hide();
    $("#divloadingStatusWorkGroupGhesmat" + row.toString()).html("<img src='Images/loading.gif' />");
    $("#divloadingStatusWorkGroupGhesmat" + row.toString()).show();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 15, checkis: checkis, code: code },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            if (data == '1') {
                $("#chkWorkgroupGhesmat" + row.toString()).show();
                $("#divloadingStatusWorkGroupGhesmat" + row.toString()).html("");
                $("#divloadingStatusWorkGroupGhesmat" + row.toString()).hide();
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");

                $("#chkWorkgroupGhesmat" + row.toString()).show();
                $("#divloadingStatusWorkGroupGhesmat" + row.toString()).html("");
                $("#divloadingStatusWorkGroupGhesmat" + row.toString()).hide();

                if (checkis == 0) {
                    $("#chkWorkgroupGhesmat" + row.toString()).attr("checked", "checked");
                }
                else {
                    $("#chkWorkgroupGhesmat" + row.toString()).removeAttr("checked");
                }
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#chkWorkgroupGhesmat" + row.toString()).show();
            $("#divloadingStatusWorkGroupGhesmat" + row.toString()).html("");
            $("#divloadingStatusWorkGroupGhesmat" + row.toString()).hide();
            if (checkis == 0) {
                $("#chkWorkgroupGhesmat" + row.toString()).attr("checked", "checked");
            }
            else {
                $("#chkWorkgroupGhesmat" + row.toString()).removeAttr("checked");
            }
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------ویرایش قسمت گروه کاری------------------------------------
function ShowEditWorkGroupGhesmat(row, code) {
    $("#pnlEditGhesmatWorkgroupCode").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش نام قسمت گروه کاری",
        width: 300,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {

                SaveEditGhesmatWorkgroup(row, code);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });
    $("#DivEditGhesmatworkGroupCodeHide" + row.toString()).html(code);
    $("#drpdwnGhesmatGroupCodeEdit option").filter(function () {
        return $(this).text() == $.trim($("#tdGhesmatWorkgroupName" + row.toString()).html());
    }).prop('selected', true);

    ShowDrpDwnInRegisterPage("drpdwnGhesmatGroupCodeBakhshEdit", $("#drpdwnGhesmatGroupCodeEdit").val(), 1);

    $("#drpdwnGhesmatGroupCodeBakhshEdit option").filter(function () {
        return $(this).text() == $.trim($("#tdGhesmatWorkgroupNameBakhsh" + row.toString()).html());
    }).prop('selected', true);

    $("#txtNamGhesmatGroupCodeNewEdit").val($.trim($("#tdGhesmatWorkgroupNameGhesmat" + row.toString()).html()));
    $("#pnlEditGhesmatWorkgroupCode").dialog("open");
}
//-----------------------------------ثبت ویرایش قسمت گروه کاری------------------------------------
function SaveEditGhesmatWorkgroup(row, code) {
    var GhesmatgroupName = $.trim($("#txtNamGhesmatGroupCodeNewEdit").val());
    var groupcode = $.trim($("#drpdwnGhesmatGroupCodeEdit").val());
    var grouptext = $.trim($("#drpdwnGhesmatGroupCodeEdit option:selected").text());

    var groupcodeBakhsh = $.trim($("#drpdwnGhesmatGroupCodeBakhshEdit").val());
    var grouptextBakhsh = $.trim($("#drpdwnGhesmatGroupCodeBakhshEdit option:selected").text());

    if ($.trim(GhesmatgroupName) == '' || groupcode == "-1" || groupcodeBakhsh == "-1") {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }

    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 16, code: code, GhesmatgroupName: GhesmatgroupName, groupcode: groupcode, groupcodeBakhsh: groupcodeBakhsh },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == '1') {
                ShowAlert("اطلاعات با موفقیت ویرایش شد");
                $("#txtNamGhesmatGroupCodeNewEdit").val("");
                $("#drpdwnGhesmatGroupCodeEdit").val("-1");
                ShowDrpDwnInRegisterPage("", -1, 0);

                $("#drpdwnGhesmatGroupCodeBakhshEdit").val("-1");
                $("#tdGhesmatWorkgroupName" + row.toString()).html(grouptext);
                $("#tdGhesmatWorkgroupNameBakhsh" + row.toString()).html(grouptextBakhsh);
                $("#tdGhesmatWorkgroupNameGhesmat" + row.toString()).html(GhesmatgroupName);
                $("#pnlEditGhesmatWorkgroupCode").dialog("close");
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#txtNamGhesmatGroupCodeNewEdit").val("");
            $("#drpdwnGhesmatGroupCodeEdit").val("-1");
            ShowDrpDwnInRegisterPage("", -1, 0);
            $("#drpdwnGhesmatGroupCodeBakhshEdit").val("-1");
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------حذف قسمت گروه کاری------------------------------------
function DeletetWorkGroupGhesmat(row, code) {
    if (confirm("آیا از حذف قسمت گروه کاری اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 17, code: code },
            url: "PostBack/PBPersonelWorkGroup.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#trGhesmatWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '2') {
                    ShowAlert("این قسمت گروه کاری قبلا به کار گرفته شده است");
                }
                else if (data == '5') {
                    ShowAlert("اطلاعات این قسمت گروه کاری وجود ندارد");
                    $("#trGhesmatWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '15') {
                    ShowAlert("خطا در حذف اطلاعات ، دوباره امتحان کنید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
            }
        });
    }
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//-----------------------------------اضافه کردن عنوان گروه کاری جدید------------------------------------
function SaveOnvanWorkGroupNew() {
    var OnvangroupName = $.trim($("#txtNameOnvanGroupCodeNew").val());
    var groupcode = $("#drpdwnOnvanGroupCode").val();
    var bakhsh = $("#drpdwnOnvanGroupCodeBakhsh").val();
    var ghesmat = $("#drpdwnOnvanGroupCodeGhesmat").val();
    if ($.trim(OnvangroupName) == '' || groupcode == "-1" || bakhsh == "-1" || ghesmat == "-1") {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }
    else {

        if (confirm("آیا از ثبت نام عنوان گروه کاری اطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 20, groupcode: groupcode, OnvangroupName: OnvangroupName, bakhsh: bakhsh, ghesmat: ghesmat },
                url: "PostBack/PBPersonelWorkGroup.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();

                    if (data == '1') {
                        ShowAlert("عنوان گروه کاری  با موفقیت ثبت شد");
                        $("#txtNameOnvanGroupCodeNew").val("");
                        GetAllOnvanWorkGroup();
                        GetDrpdwnBaseAll();
                    }
                    else if (data == '5') {
                        ShowAlert("این عنوان گروه کاری قبلا ثبت شده است");
                    }
                    else if (data == '15') {
                        ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");

                }
            });
        }
    }
}
//-----------------------------------گزارش عنوان گروه کاری جدید------------------------------------
var OnvanworkGroupRow = 0;
var OnvandrpdwnWorkGroup = "";
function GetAllOnvanWorkGroup() {
    OnvanworkGroupRow = 0;
    OnvandrpdwnWorkGroup = "";
    $("#ResultDivOnvanGroupCodeNew").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>گروه کاری</th><th>بخش</th><th>قسمت</th><th>عنوان</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>";
    var mainrow = "<tr id='trOnvanWorkGroupRow{Row}'><td>{Row}</td><td id='tdOnvanWorkgroupName{Row}'>{workgroup}</td><td id='tdOnvanWorkgroupNameBakhsh{Row}'>{bakhsh}</td><td id='tdOnvanWorkgroupNameGhesmat{Row}'>{ghesmat}</td><td id='tdOnvanWorkgroupNameOnvan{Row}'>{onvan}</td><td>{status}</td><td>{Action}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 24 },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            OnvandrpdwnWorkGroup = data;
            $.each(data, function (index) {
                row = mainrow.replaceAll("{workgroup}", this['strWorkGroupName']);
                row = row.replaceAll("{status}", "<input id='chkWorkgroupOnvan{Row}' type='checkbox' {checked} onclick='SetActiveWorkGroupOnvan({Row},{code});' /><div id='divloadingStatusWorkGroupOnvan{Row}' style='display:none;'></div>");
                row = row.replaceAll("{checked}", this['numStatus'] == 1 ? " checked='checked' " : "");
                row = row.replaceAll("{Action}", "<img src='images/Edit.png' onclick='ShowEditWorkGroupOnvan({Row},{code});' style='cursor: pointer;' /> <img id='imgDelWorkGroupOnvan{Row}' src='images/delete.png' onclick='DeletetWorkGroupOnvan({Row},{code});' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelWorkGroupOnvan{Row}' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' /> ");
                row = row.replaceAll("{code}", this['numOnvanWorkGroupCode']);
                row = row.replaceAll("{ghesmat}", this['strGhesmatName']);
                row = row.replaceAll("{bakhsh}", this['strBakhshName']);
                row = row.replaceAll("{onvan}", this['strOnvanName']);
                row = row.replaceAll("{Row}", i);
                i++;
                allrow = allrow + row;
                t = 1;
                OnvanworkGroupRow = i - 1;
            });
            if (t == 1) {
                $("#ResultDivOnvanGroupCodeNew").html(header + header2 + allrow + footer);
            }
            else {
                $("#ResultDivOnvanGroupCodeNew").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivOnvanGroupCodeNew").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------فعال یا غیر فعال کردن عنوان گروه کاری------------------------------------
function SetActiveWorkGroupOnvan(row, code) {
    var checkis = 0;
    if ($("#chkWorkgroupOnvan" + row.toString()).attr("checked")) checkis = 1
    else checkis = 0;
    $("#chkWorkgroupOnvan" + row.toString()).hide();
    $("#divloadingStatusWorkGroupOnvan" + row.toString()).html("<img src='Images/loading.gif' />");
    $("#divloadingStatusWorkGroupOnvan" + row.toString()).show();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 21, checkis: checkis, code: code },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            if (data == '1') {
                $("#chkWorkgroupOnvan" + row.toString()).show();
                $("#divloadingStatusWorkGroupOnvan" + row.toString()).html("");
                $("#divloadingStatusWorkGroupOnvan" + row.toString()).hide();
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");

                $("#chkWorkgroupOnvan" + row.toString()).show();
                $("#divloadingStatusWorkGroupOnvan" + row.toString()).html("");
                $("#divloadingStatusWorkGroupOnvan" + row.toString()).hide();

                if (checkis == 0) {
                    $("#chkWorkgroupOnvan" + row.toString()).attr("checked", "checked");
                }
                else {
                    $("#chkWorkgroupOnvan" + row.toString()).removeAttr("checked");
                }
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#chkWorkgroupOnvan" + row.toString()).show();
            $("#divloadingStatusWorkGroupOnvan" + row.toString()).html("");
            $("#divloadingStatusWorkGroupOnvan" + row.toString()).hide();
            if (checkis == 0) {
                $("#chkWorkgroupOnvan" + row.toString()).attr("checked", "checked");
            }
            else {
                $("#chkWorkgroupOnvan" + row.toString()).removeAttr("checked");
            }
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------ویرایش عنوان گروه کاری------------------------------------
function ShowEditWorkGroupOnvan(row, code) {
    $("#pnlEditOnvanWorkgroupCode").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش نام عنوان گروه کاری",
        width: 300,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {

                SaveEditOnvanWorkgroup(row, code);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });
    $("#DivEditOnvanworkGroupCodeHide" + row.toString()).html(code);
    $("#drpdwnOnvanGroupCodeEdit option").filter(function () {
        return $(this).text() == $.trim($("#tdOnvanWorkgroupName" + row.toString()).html());
    }).prop('selected', true);

    ShowDrpDwnInRegisterPage("drpdwnOnvanGroupCodeBakhshEdit", $("#drpdwnOnvanGroupCodeEdit").val(), 1);

    $("#drpdwnOnvanGroupCodeBakhshEdit option").filter(function () {
        return $(this).text() == $.trim($("#tdOnvanWorkgroupNameBakhsh" + row.toString()).html());
    }).prop('selected', true);


    ShowDrpDwnInRegisterPage("drpdwnOnvanGroupCodeGhesmatEdit", $("#drpdwnOnvanGroupCodeBakhshEdit").val(), 2);

    $("#drpdwnOnvanGroupCodeGhesmatEdit option").filter(function () {
        return $(this).text() == $.trim($("#tdOnvanWorkgroupNameGhesmat" + row.toString()).html());
    }).prop('selected', true);


    $("#txtNamOnvanGroupCodeNewEdit").val($.trim($("#tdOnvanWorkgroupNameOnvan" + row.toString()).html()));
    $("#pnlEditOnvanWorkgroupCode").dialog("open");
}
//-----------------------------------ثبت ویرایش عنوان گروه کاری------------------------------------
function SaveEditOnvanWorkgroup(row, code) {
    var OnvangroupName = $.trim($("#txtNamOnvanGroupCodeNewEdit").val());
    var groupcode = $.trim($("#drpdwnOnvanGroupCodeEdit").val());
    var grouptext = $.trim($("#drpdwnOnvanGroupCodeEdit option:selected").text());

    var groupcodeBakhsh = $.trim($("#drpdwnOnvanGroupCodeBakhshEdit").val());
    var grouptextBakhsh = $.trim($("#drpdwnOnvanGroupCodeBakhshEdit option:selected").text());

    var groupcodeGhesmat = $.trim($("#drpdwnOnvanGroupCodeGhesmatEdit").val());
    var grouptextGhesmat = $.trim($("#drpdwnOnvanGroupCodeGhesmatEdit option:selected").text());

    if ($.trim(OnvangroupName) == '' || groupcode == "-1" || groupcodeBakhsh == "-1" || groupcodeGhesmat == "-1") {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }

    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 22, code: code, OnvangroupName: OnvangroupName, groupcode: groupcode, groupcodeBakhsh: groupcodeBakhsh, groupcodeGhesmat: groupcodeGhesmat },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == '1') {
                ShowAlert("اطلاعات با موفقیت ویرایش شد");
                $("#txtNamOnvanGroupCodeNewEdit").val("");
                $("#drpdwnOnvanGroupCodeEdit").val("-1");
                ShowDrpDwnInRegisterPage("", -1, 0);

                $("#drpdwnOnvanGroupCodeBakhshEdit").val("-1");
                $("#drpdwnOnvanGroupCodeGhesmatEdit").val("-1");
                $("#tdOnvanWorkgroupName" + row.toString()).html(grouptext);
                $("#tdOnvanWorkgroupNameBakhsh" + row.toString()).html(grouptextBakhsh);
                $("#tdOnvanWorkgroupNameGhesmat" + row.toString()).html(grouptextGhesmat);
                $("#tdOnvanWorkgroupNameOnvan" + row.toString()).html(OnvangroupName);
                $("#pnlEditOnvanWorkgroupCode").dialog("close");
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#txtNamOnvanGroupCodeNewEdit").val("");
            $("#drpdwnOnvanGroupCodeEdit").val("-1");
            ShowDrpDwnInRegisterPage("", -1, 0);
            $("#drpdwnOnvanGroupCodeBakhshEdit").val("-1");
            $("#drpdwnOnvanGroupCodeGhesmatEdit").val("-1");
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------حذف عنوان گروه کاری------------------------------------
function DeletetWorkGroupOnvan(row, code) {
    if (confirm("آیا از حذف عنوان گروه کاری اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 23, code: code },
            url: "PostBack/PBPersonelWorkGroup.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#trOnvanWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '2') {
                    ShowAlert("این عنوان گروه کاری قبلا به کار گرفته شده است");
                }
                else if (data == '5') {
                    ShowAlert("اطلاعات این عنوان گروه کاری وجود ندارد");
                    $("#trOnvanWorkGroupRow" + row.toString()).remove();
                }
                else if (data == '15') {
                    ShowAlert("خطا در حذف اطلاعات ، دوباره امتحان کنید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
            }
        });
    }
}
//------------------------------------------ -----------------------------------------------------------
var personelRowWorkgroupAll = 0;
function GetInfoPersonelWorKGroupAll() {
    personelRowWorkgroupAll = 0;

    var personelcode = $("#txtPersonelCodeForWorkGroup").val().trim();
    $("#ResultDivGroupCodePersonelInfo").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCode' checked='checked' onclick='CheckOnePersonelItems(1);'/></th><th width='50px'>ردیف</th><th>کد پرسنلی</th><th>نام و نام خانوادگی</th><th>شماره قرارداد</th><th>تاریخ شروع قرارداد</th><th>تاریخ پایان قرارداد</th><th>تاریخ قطع همکاری</th><th>گروه کاری</th><th>بخش</th><th>قسمت</th><th>عنوان</th></tr></thead><tbody>";
    var mainrow = "<tr id='trWorkGroupPersonelRow{Row}'  {css2}><td {css1} >{check}</td> <td {css1}>{Row}</td><td id='tdPersonelCodeforworkgroup{Row}' {css1}>{personelCode}</td><td {css1}>{Name}</td><td {css1}>{contractCode}</td><td {css1}>{datestart}</td><td {css1}>{dateEnd}</td><td {css1}>{dateCut}</td><td {css1}>{workgroup}</td><td id='tddrpdwnBakhsh{Row}' {css1} >{bakhsh}</td><td id='tddrpdwnGhesmat{Row}' {css1} >{ghesmat}</td><td id='tddrpdwnOnvan{Row}' {css1} >{onvan}</td></tr>";
    var footer = "</tbody></table>";
    var btn = "<div style='text-align:center;padding:10px 0;'><input id='btnSaveWorkGroupForPersonelAll' type='button' value='ثبت دسته ای' onclick='SaveWorkGroupForPersonelAll();' /></div>"
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 19, personelcode: personelcode },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            $.each(data, function (index) {
                row = mainrow.replaceAll("{Name}", this['strPersonelName']);
                row = row.replaceAll("{check}", "<input type='checkbox' id='chkOnePersonelCode{Row}' onclick='CheckOnePersonelItems(2,{Row});' checked='checked'/>");
                row = row.replaceAll("{datestart}", this['dateStartContractDate']);
                row = row.replaceAll("{dateEnd}", this['dateEndContractDate']);
                row = row.replaceAll("{dateCut}", this['dateCutWorkDate']);
                row = row.replaceAll("{workgroup}", GetdrpdwnWorkGroup(i, this['numWorkGroupRef']));
                row = row.replaceAll("{bakhsh}", GetdrpdwnBakhsh(1, this['numWorkGroupRef'], this['numBakhshWorkGroupRef'], i));
                row = row.replaceAll("{ghesmat}", GetdrpdwnGhesmat(1, this['numWorkGroupRef'], this['numBakhshWorkGroupRef'], this['numGhesmatWorkgroupRef'], i));
                row = row.replaceAll("{onvan}", GetdrpdwnOnvan(1, this['numWorkGroupRef'], this['numBakhshWorkGroupRef'], this['numGhesmatWorkgroupRef'], this['numOnvanWorkGroupRef'], i));
                row = row.replaceAll("{datereg}", "--");
                row = row.replaceAll("{css2}", "");
                row = row.replaceAll("{css1}", "");
                row = row.replaceAll("{personelCode}", this['numPersonelRef']);
                row = row.replaceAll("{contractCode}", this['StrContractUniqCode']);
                row = row.replaceAll("{Row}", i);
                i++;
                allrow = allrow + row;
                t = 1;
                personelRowWorkgroupAll = i - 1;
            });
            if (t == 1) {
                var title = "<div align='right' style='padding:10px 0;'>* توجه مهم : در صورتی که هر 5 گزینه ( گروه کاری - بخش - قسمت - عنوان - سمت ) انتخاب شده باشد اطلاعات آن پرسنل ثبت می شود.</div>";
                $("#ResultDivGroupCodePersonelInfo").html(title + header + header2 + allrow + footer + btn);
                $("#ResultDivGroupCodePersonelInfo").show();
                $("#btnSaveWorkGroupForPersonelAll").button();
            }
            else {
                $("#ResultDivGroupCodePersonelInfo").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#ResultDivGroupCodePersonelInfo").show();
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            $("#ResultDivGroupCodePersonelInfo").hide();
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
        }
    });

}
//------------------------------------------ -----------------------------------------------------------
//------------------------------------------ -----------------------------------------------------------
function CheckOnePersonelItems(type, row) {
    if (type == 1) {
        for (var i = 1; i <= personelRowWorkgroupAll; i++) {
            if ($("#chkAllPersonelCode").attr("checked"))
                $("#chkOnePersonelCode" + i).attr("checked", "checked");
            else
                $("#chkOnePersonelCode" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPersonelCode").removeAttr("checked");
    }
}
//-----------------------------------ذخیره دسته ای گروه کاری برای پرسنل-----------------------------------
function SaveWorkGroupForPersonelAll() {
    var Code = "";
    for (var i = 1; i <= personelRowWorkgroupAll; i++) {
        if ($("#chkOnePersonelCode" + i).attr("checked")) {
            Code = Code + $.trim($("#tdPersonelCodeforworkgroup" + i).html()) + ",";
        }
    }
    if (Code == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;
    }


    var strtemp = "";
    var checkValue = 0;
    for (var i = 1; i <= personelRowWorkgroupAll; i++) {
        if ($("#chkOnePersonelCode" + i).attr("checked")) {
            if (($("#drpdwnWorkgroup" + i.toString()).val() != null && $("#drpdwnWorkgroup" + i.toString()).val() != undefined && $("#drpdwnWorkgroup" + i.toString()).val() != "" && $("#drpdwnWorkgroup" + i.toString()).val() != "-1") &&
                ($("#drpdwnWorkgroupBakhsh" + i.toString()).val() != null && $("#drpdwnWorkgroupBakhsh" + i.toString()).val() != undefined && $("#drpdwnWorkgroupBakhsh" + i.toString()).val() != "" && $("#drpdwnWorkgroupBakhsh" + i.toString()).val() != "-1") &&
                ($("#drpdwnWorkgroupGhesmat" + i.toString()).val() != null && $("#drpdwnWorkgroupGhesmat" + i.toString()).val() != undefined && $("#drpdwnWorkgroupGhesmat" + i.toString()).val() != "" && $("#drpdwnWorkgroupGhesmat" + i.toString()).val() != "-1") &&
                ($("#drpdwnWorkgroupOnvan" + i.toString()).val() != null && $("#drpdwnWorkgroupOnvan" + i.toString()).val() != undefined && $("#drpdwnWorkgroupOnvan" + i.toString()).val() != "" && (($('#drpdwnWorkgroupOnvan' + i.toString() + ' > option').length > 1 && $("#drpdwnWorkgroupOnvan" + i.toString()).val() != "-1") || ($('#drpdwnWorkgroupOnvan' + i.toString() + ' > option').length == 1 && $("#drpdwnWorkgroupOnvan" + i.toString()).val() == "-1")))
                ) {
                strtemp = strtemp + $.trim($("#tdPersonelCodeforworkgroup" + i.toString()).html()) + "^" + $("#drpdwnWorkgroup" + i.toString()).val() + "^" + $("#drpdwnWorkgroupBakhsh" + i.toString()).val() + "^" + $("#drpdwnWorkgroupGhesmat" + i.toString()).val() + "^" + $("#drpdwnWorkgroupOnvan" + i.toString()).val() + ",";
                checkValue = 1;
            }
        }
    }
    if (checkValue == 0) {
        ShowAlert("حداقل اطلاعات یک پرسنل باید تکمیل شود !");
        return;
    }

    if (confirm("آیا از ثبت گروه کاری ها برای این پرسنل ها اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 8, strtemp: strtemp },
            url: "PostBack/PBPersonelWorkGroup.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                if (data == '1') {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    GetInfoPersonelWorKGroupAll();
                }
                else if (data == '2') {
                    ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
            }
        });
    }
}
//---------------------------------------------------------------------------------
///=========================== گزارش اطلاعات پرسنل در گروه کاری ها ================================
//---------------------------------------------------------------------------------
function GetReportInfoPersonelWorkGroup(vpage) {

    var personelcode = $.trim($("#txtReportPersonelCode").val());
    var name = $.trim($("#txtReportPersonelName").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCode").val());

    var ContractKind = $.trim($("#drpdwnSearchContractKind").val());
    var workgroup = $.trim($("#drpdwnWorkGroupPersonelContract").val());
    var Bakhsh = $.trim($("#drpdwnWorkGroupPersonelContractBakhsh").val());
    var Ghesmat = $.trim($("#drpdwnWorkGroupPersonelContractGhesmat").val());
    var Onvan = $.trim($("#drpdwnWorkGroupPersonelContractOnvan").val());
    var rows = $.trim($("#drpdwnShowRow").val());

    
    $("#ResultDivPersonelWorkGroup").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonelWorkGroup").show();
    var header = "<table id='tblReportWorkGroupRpt' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>شماره قرارداد</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>کد ملی</th><th>نوع قرارداد</th><th align='center'>گروه کاری</th><th align='center'>بخش</th><th align='center'>قسمت</th><th align='center'>عنوان</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{uniqcode}</td><td>{personelcode}</td><td>{name}</td><td>{mellicode}</td><td>{contract}</td><td >{workgroup}</td><td >{bakhsh}</td><td >{ghesmat}</td><td >{onvan}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportInfoPersonelWorkGroup(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelRpt'' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelRpt' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportInfoPersonelWorkGroup({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var btnexcel = "<div style='width:100%;text-align:center;padding:10px;'><input id='btnSaveExcelWorkgroupRpt' type='button' value='خروجی اکسل'  onclick='ExcelReportTable(\"tblReportWorkGroupRpt\"); return false;'/></div>"
    var btnexcel1 = "<div style='width:100%;text-align:center;padding:10px;'><input id='btnSaveExcelWorkgroupRpt1' type='button' value='خروجی اکسل'  onclick='ExcelReportTable(\"tblReportWorkGroupRpt\"); return false;'/></div>"

    var row = ""; var allrow = ""; var AllRecordCount;
    var vperpage = rows=="-1" ? "9000000" : rows;
    var t = 0;
    var i = (vpage - 1) * vperpage + 1;
    var nextPage, prevPage;
    nextPage = vpage + 1;
    prevPage = vpage - 1;
    // var S = 0;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 25, personelcode: personelcode, ContractKind: ContractKind, name: name, mellicode: mellicode,workgroup:workgroup,Bakhsh:Bakhsh,Ghesmat:Ghesmat,Onvan:Onvan, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelWorkGroup.ashx",
        success: function (data) {
       
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{contract}", $.trim(this['strContractKindName']));
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{workgroup}", this['strWorkGroupName'] );
                row = row.replaceAll("{bakhsh}", $.trim(this['strBakhshName']));
                row = row.replaceAll("{ghesmat}", $.trim(this['strGhesmatName']));
                row = row.replaceAll("{onvan}", $.trim(this['strOnvanName']));
                row = row.replaceAll("{mellicode}", this['strMelliCode'].trim());
                row = row.replaceAll("{uniqcode}", this['StrContractUniqCode']);
    
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportInfoPersonelWorkGroup(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportInfoPersonelWorkGroup(" + nextPage + ")");
            }
            if (t == 1) {

                $("#ResultDivPersonelWorkGroup").html(btnexcel1 + header + header2 + allrow + footer + footerPager + endfooter + btnexcel);
                $("#divAllRecordCountPersonelRpt").html(allpage);
                $("#btnSaveExcelWorkgroupRpt").button();
                $("#btnSaveExcelWorkgroupRpt1").button();
            }
            else {
                $("#ResultDivPersonelWorkGroup").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelWorkGroup").html("");
            $("#ResultDivPersonelWorkGroup").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}

//---------------------------------------------------------------------------------
///============================== خروجی اکسل از جدول =========================
//---------------------------------------------------------------------------------
function ExcelReportTable(tablename) {
    tableToExcel(tablename, 'W3C Example Table');
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})()