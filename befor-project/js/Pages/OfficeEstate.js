var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
$(document).ready(function () {
    $("#divUser").tabs();
    $("#divAmvalNew").tabs();
    $("#divAmvalPersonel").tabs();
    $("#divAmvalHavaleh").tabs();
    $("#divAmvalVagozari").tabs();


    GetTabsDeActive("divUser");

    $("#btnSaveAmvalInfo").click(function () { saveAmvalInfo(); return false; });
    $("#btnSearchAmvalInfo").click(function () { SearchAmvalInfo(1); return false; });
    $("#btnPreSaveAmval").click(function () { presaveAmvalPersonel(); return false; });
    $("#btnNewPewSaveAmval").click(function () { NewpresaveAmvalPersonel(); return false; });
    $("#btnsrchInfoPersonelAmval").click(function () { searchInfoPersonelAmval(1); return false; });

    $("#btnSaveAmvalHavaleh").click(function () { savehavalehAmval(); return false; });
    $("#btnPreSaveAmvalVagozar").click(function () { presaveVagozarAmval(); return false; });
    $("#btnNewPewSaveAmvalVagozar").click(function () { NewVagozarAmval(); return false; });
    $("#btnsrchInfoPersonelAmvalVagozar").click(function () { searchInfoPersonelAmvalVagozar(1); return false; });

    GetDrpdwnBaseAll();
    SearchAmvalInfo(1);
});
//============================================================================
var drpdwnBakhshWorkgroup = "";
var drpdwnghesmateWorkgroup = "";
var drpdwnWorkgroup = "";
var drpdwnAmvalMain = "";
var drpdwnHavalehAmvalMain = "";
//============================================================================
//============================================================================
function GetDrpdwnBaseAll() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    drpdwnBakhshWorkgroup = "";
    drpdwnWorkgroup = "";
    drpdwnAmvalMain = "";
    drpdwnghesmateWorkgroup = "";
    drpdwnHavalehAmvalMain = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBOfficeEstate.ashx",
        success: function (data) {
            drpdwnWorkgroup = data[0];
            drpdwnBakhshWorkgroup = data[1];
            drpdwnghesmateWorkgroup = data[2];
            drpdwnAmvalMain = data[3];
            drpdwnHavalehAmvalMain = data[4];
            ShowDrpDwnInRegisterPage(1, -1, -1);
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//============================================================================
function ShowDrpDwnInRegisterPage(type, value, radif) {
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' >";
    selectStart2 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' onchange='ShowDrpDwnInRegisterPage(2,this.value,-1);' >";
    selectStart3 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' onchange='ShowDrpDwnInRegisterPage(3,this.value,-1);' >";
    selectStart4 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' onchange='ShowPriceAmval(this.value);' >";
    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}'>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (type == 1) {
        //--------------------------------------------------------------------------
        //--------------------- workgroup -------------------------------------------
        allrow = "";
        $.each(drpdwnWorkgroup, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnWorkGroupsrch");
        $("#tddrpdwnWorkGroupsrch").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- amval info -------------------------------------------
        allrow = "";
        $.each(drpdwnAmvalMain, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart4.replaceAll("{dpdwnId}", "drpdwnAmvalName");
        $("#tddrpdwnAmvalName").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnAmvalNamesrch");
        $("#tddrpdwnAmvalNamesrch").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnAmvalHavaleh");
        $("#tddrpdwnAmvalHavaleh").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnAmvalVagozar");
        $("#tddrpdwnAmvalVagozar").html(selectTemp + option0 + allrow + selectEnd);


        //--------------------------------------------------------------------------
        //--------------------- amval hvaleh -------------------------------------------

        allrow = "";
        $.each(drpdwnHavalehAmvalMain, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnHavalehKind");
        $("#tddrpdwnHavalehKind").html(selectTemp + option0 + allrow + selectEnd);
    }

    if (type == 1 || type == 2 || type == 3) {

        //--------------------- bakhsh -------------------------------------------
        allrow = "";
        $.each(drpdwnBakhshWorkgroup, function (index) {
            if (($("#drpdwnWorkGroupsrch").val() == this['groupcode'] && type == 1) || (value == this['groupcode'] && (type == 2 || type == 3))) {
                row = option.replaceAll("{value}", this['value']);
                row = row.replaceAll("{item}", this['item']);
                allrow = allrow + row;
            }
        });

        if (allrow != "" && type == 2) {
            selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnBakhshsrch");
            $("#tddrpdwnBakhshsrch").html(selectTemp + option0 + allrow + selectEnd);
        }
        else if (allrow == "" && type == 2) {
            selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnBakhshsrch");
            $("#tddrpdwnBakhshsrch").html(selectTemp + option0 + selectEnd);
        }

        //--------------------------------------------------------------------------
        if (type == 1) {
            selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnBakhshsrch");
            $("#tddrpdwnBakhshsrch").html(selectTemp + option0 + selectEnd);
        }

    }

}
//============================================================================
//============================================================================
function ShowPriceAmval(value) {
    if (value == "-1") {
        $("#txtPriceAmval").val("");
        $("#txtPriceAmval").attr("disabled", "disabled");
    }
    else {
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 3, value: value },
            url: "PostBack/PBOfficeEstate.ashx",
            success: function (data) {
                $("#txtPriceAmval").val(addCommas(data));
                $("#txtPriceAmval").removeAttr("disabled");
            },
            error: function (xhr, textStatus, errorThrown) {
            }
        });
    }
}
//----------------------------------------------------------------------------
//-----------------------------------ثبت اموال جدید--------------------------
//----------------------------------------------------------------------------
function saveAmvalInfo() {
    var AmvalNameInfo = $("#txtAmvalNameInfo").val();
    var JensInfo = $("#txtJensInfo").val();
    var PriceAmvalInfo = $("#txtPriceAmvalInfo").val();
    if ($.trim(AmvalNameInfo) == '' || $.trim(JensInfo) == '' || $.trim(PriceAmvalInfo) == '') {
        ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید!");
        return;
    }
    else if ($.trim(PriceAmvalInfo) == '0') {
        ShowAlert("لطفا قیمت واحد را به درستی وارد نمایید!");
        return;
    }
    var PriceAmval = parseInt(PriceAmvalInfo.replaceAll(",", ""));

    if (!numbericFild.test(PriceAmval)) {
        ShowAlert("قیمت واحد باید به صورت عددی باشد!");
        return;
    }
    else {

        if (confirm("آیا از ثبت اموال جدیداطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 2, AmvalNameInfo: AmvalNameInfo, JensInfo: JensInfo, PriceAmval: PriceAmval },
                url: "PostBack/PBOfficeEstate.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    if (data == '1') {
                        ShowAlert("اموال جدید با موفقیت ثبت شد");
                        $("#txtAmvalNameInfo").val("");
                        $("#txtJensInfo").val("");
                        $("#txtPriceAmvalInfo").val("");

                        GetDrpdwnBaseAll();
                        $("#txtPriceAmval").val("");
                        $("#txtPriceAmval").attr("disabled", "disabled");
                    }
                    else if (data == '5') {
                        ShowAlert("این نام اموال قبلا ثبت شده است");
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
//----------------------------------------------------------------------------
//-----------------------------------جستجو اموال جدید------------------------
//----------------------------------------------------------------------------
var AmvalInfoFileRow = 0;
function SearchAmvalInfo(vpage) {
    AmvalInfoFileRow = 0;
    var AmvalNameInfo = $("#txtAmvalNameSrchInfo").val();
    var JensInfo = $("#txtJensSrchInfo").val();
    var PriceAmvalInfo = $("#txtPriceAmvalSrchInfo").val();
    $("#divResultAmvalSrchInfo").html("<img src='Images/loading.gif' />");
    $("#divResultAmvalSrchInfo").show();
    var PriceAmval = PriceAmvalInfo.trim() == "" ? "" : parseInt(PriceAmvalInfo.replaceAll(",", ""));

    var header = "<table  class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>نام اموال</th><th align='center'>جنس</th><th align='center'>قیمت واحد (ریال)</th><th>عملیات</th></thead><tbody>";
    var mainrow = "<tr id='trRowFileAmval{Row}'><td>{Row}</td><td id='tdNameAmval{Row}'>{name}</td><td id='tdJensAmval{Row}'>{jens}</td><td id='tdpriceAmval{Row}'>{price}</td><td>{action}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='SearchAmvalInfo(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerAmvalInfo' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountAmvalInfo' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='SearchAmvalInfo({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50";
    var t = 0;
    var i = (vpage - 1) * vperpage + 1;
    var nextPage, prevPage;
    nextPage = vpage + 1;
    prevPage = vpage - 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 4, AmvalNameInfo: AmvalNameInfo, JensInfo: JensInfo, PriceAmval: PriceAmval, page: vpage, perpage: vperpage },
        url: "PostBack/PBOfficeEstate.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", $.trim(this['strAmvalName']));
                row = row.replaceAll("{jens}", $.trim(this['strAmvalJens']));
                row = row.replaceAll("{price}", addCommas($.trim(this['numPriceAmval'])));
                row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditAmvalInfo({Row},{code});' ><img src='images/edit.png' style='width:23px;'/></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteAmvalInfo({Row},{code});' ><img src='images/delete.png' style='width:23px;'/></a></div>");
                row = row.replaceAll("{code}", this['numAmvalCode']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                AmvalInfoFileRow = i - 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "SearchAmvalInfo(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "SearchAmvalInfo(" + nextPage + ")");
            }
            if (t == 1) {
                $("#divResultAmvalSrchInfo").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountAmvalInfo").html(allpage);

            }
            else {
                $("#divResultAmvalSrchInfo").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#divResultAmvalSrchInfo").html("");
            $("#divResultAmvalSrchInfo").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function EditAmvalInfo(row, code) {
    $("#pnlEditAmvalInfo").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش مشخصات اموال",
        width: 300,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {
                $(this).dialog("close");

                SaveEditAmvalInfo(row, code);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });
    $("#txtAmvalNameSrchInfoEdit").val($("#tdNameAmval" + row.toString()).html().trim());
    $("#txtJensSrchInfoEdit").val($("#tdJensAmval" + row.toString()).html().trim());
    $("#txtPriceAmvalSrchInfoEdit").val($("#tdpriceAmval" + row.toString()).html().trim());


    $("#pnlEditAmvalInfo").dialog("open");
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function SaveEditAmvalInfo(row, code) {
    var AmvalNameInfo = $("#txtAmvalNameSrchInfoEdit").val();
    var JensInfo = $("#txtJensSrchInfoEdit").val();
    var PriceAmvalInfo = $("#txtPriceAmvalSrchInfoEdit").val();

    if ($.trim(AmvalNameInfo) == '' || $.trim(JensInfo) == '' || $.trim(PriceAmvalInfo) == '') {
        ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید!");
        return;
    }
    else if ($.trim(PriceAmvalInfo) == '0') {
        ShowAlert("لطفا قیمت واحد را به درستی وارد نمایید!");
        return;
    }
    var PriceAmval = parseInt(PriceAmvalInfo.replaceAll(",", ""));

    if (!numbericFild.test(PriceAmval)) {
        ShowAlert("قیمت واحد باید به صورت عددی باشد!");
        return;
    }
    else {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 5, code: code, AmvalNameInfo: AmvalNameInfo, JensInfo: JensInfo, PriceAmval: PriceAmval },
            url: "PostBack/PBOfficeEstate.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    ShowAlert("اطلاعات با موفقیت ویرایش شد");
                    GetDrpdwnBaseAll();
                    $("#txtPriceAmval").val("");
                    $("#txtPriceAmval").attr("disabled", "disabled");
                    $("#tdNameAmval" + row.toString()).html($("#txtAmvalNameSrchInfoEdit").val());
                    $("#tdJensAmval" + row.toString()).html($("#txtJensSrchInfoEdit").val());
                    $("#tdpriceAmval" + row.toString()).html($("#txtPriceAmvalSrchInfoEdit").val());
                }
                else if (data == '3') {
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
//----------------------------------------------------------------------------
//--------------------------------حذف اموال پرسنل----------------------------
//----------------------------------------------------------------------------
function DeleteAmvalInfo(row, code) {
    if (confirm("آیا از حذف مشخصات اموال مورد نظر اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 6, code: code },
            url: "PostBack/PBOfficeEstate.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#trRowFileAmval" + row.toString()).remove();
                    GetDrpdwnBaseAll();
                    $("#txtPriceAmval").val("");
                    $("#txtPriceAmval").attr("disabled", "disabled");
                }
                else if (data == '2') {
                    ShowAlert("این اموال قبلا به پرسنلی نسبت داده شده است");
                }
                else if (data == '5') {
                    ShowAlert("اطلاعات این اموال وجود ندارد");
                    $("#trRowFileAmval" + row.toString()).remove();
                    GetDrpdwnBaseAll();
                    $("#txtPriceAmval").val("");
                    $("#txtPriceAmval").attr("disabled", "disabled");
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
//----------------------------پیش ثبت اموال پرسنل----------------------------
//----------------------------------------------------------------------------
var rowPerosnelAmval = 1;
var dataPersonelInfo = "";
var sumpriceamval = 0;
function presaveAmvalPersonel() {
    var personelcode = $("#txtSearchUserCode").val();
    var barchasb = $("#txtBarchasb").val();
    var amvalcode = $("#drpdwnAmvalName").val();
    var priceamval = $("#txtPriceAmval").val();
    var cntamval = $("#txtCountAmval").val();
    var desc = $("#txtDescAmval").val();
    if ($.trim(personelcode) == '' || $.trim(amvalcode) == '-1' || $.trim(priceamval) == '' || $.trim(cntamval) == '') {
        ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید!");
        return;
    }
    else if ($.trim(priceamval) == '0') {
        ShowAlert("لطفا قیمت واحد را به درستی وارد نمایید!");
        return;
    }
    else if ($.trim(cntamval) == '0') {
        ShowAlert("لطفا تعداد اموال را به درستی وارد نمایید!");
        return;
    }
    var PriceAmvalNew = parseInt(priceamval.replaceAll(",", ""));
    var countNew = parseInt(cntamval.replaceAll(",", ""));
    var checkTekrari = checkrepeat(amvalcode);

    if (!numbericFild.test(PriceAmvalNew)) {
        ShowAlert("قیمت واحد باید به صورت عددی باشد!");
        return;
    }
    else if (!numbericFild.test(countNew)) {
        ShowAlert("تعداد اموال باید به صورت عددی باشد!");
        return;
    }
    else if (checkTekrari == false) {
        ShowAlert("این نام اموال قبلا پیش ثبت شده است !");
        return;
    }
    else {
        var header = "<table class='MainTbl' id='tblPersonelAmval'>";
        var header2 = "<thead><tr><th style='display:none;'></th><th>کد پرسنلی</th><th>نام پرسنل</th><th>گروه کاری</th><th>بخش</th><th>قسمت</th><th>شماره برچسب</th><th>نام اموال</th><th>تعداد اموال</th><th>قیمت واحد (ریال)</th><th>توضیحات</th><th>عملیات</th></tr></thead><tbody>";
        var mainrow = "<tr id='trPersonelAmvalRow{Row}'><td style='display:none;' id='drpdwncode{Row}'>{drpdwncode}</td><td id='tdpersonelcode{Row}'>{personelcode}</td><td>{personelname}</td><td>{workgroup}</td><td>{bakhsh}</td><td>{ghesmat}</td><td id='tdBarchasb{Row}'>{barchasb}</td><td >{amvalname}</td><td id='tdcntamval{Row}'>{cnt}</td><td id='tdpriceAmval{Row}'>{price}</td><td id='tdDescAmval{Row}'>{desc}</td><td>{Action}</td></tr>";
        var footer = "</tbody></table>";
        var btn = "<div style='padding:10px 0; text-align:center;'> <input  type='button' value='ثبت نهایی' id='btnSavefinelPersonelInfo' onclick='savefinalPersonelAmvalInfo();' /></div>";
        var row = "";
        var allrow = "";

        if (dataPersonelInfo == "") {
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 8, personelcode: personelcode, amvalcode: amvalcode },
                url: "PostBack/PBOfficeEstate.ashx",
                success: function (data) {
                    if (data == "5") {
                        ShowAlert("این اموال قبلا برای این پرسنل ثبت شده است !");
                    }
                    else {
                        var t = 0;
                        $.each(data, function (index) {
                            row = mainrow.replaceAll("{personelcode}", $.trim(personelcode));
                            row = row.replaceAll("{personelname}", $.trim(this['strPersonelName']));
                            row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));
                            row = row.replaceAll("{bakhsh}", $.trim(this['strBakhshName']));
                            row = row.replaceAll("{ghesmat}", $.trim(this['strGhesmatName']));
                            row = row.replaceAll("{barchasb}", $.trim(barchasb) == "" ? "-" : $.trim(barchasb));
                            row = row.replaceAll("{amvalname}", $.trim($("#drpdwnAmvalName option:selected").text()));
                            row = row.replaceAll("{cnt}", "<input type='text' id='txtcntPersonel{Row}' class='InputTextLeftToRightText setcamma' value='" + addCommas(cntamval) + "' style='width:35px;'/>");
                            row = row.replaceAll("{price}", "<input type='text' id='txtPricePersonel{Row}' class='InputTextLeftToRightText setcamma' value='" + addCommas(priceamval) + "' style='width:65px;'/>");
                            row = row.replaceAll("{desc}", $.trim(desc) == "" ? "-" : $.trim(desc));
                            row = row.replaceAll("{drpdwncode}", $.trim(amvalcode));

                            row = row.replaceAll("{Action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeletePrePersonelAmvalInfo({Row}); return false;' ><img src='images/delete.png' style='width:23px;'/></a></div>");
                            row = row.replaceAll("{Row}", rowPerosnelAmval);
                            sumpriceamval = sumpriceamval + +(parseInt(PriceAmvalNew) * parseInt(countNew));
                            t = 1;
                        });
                        if (t == 1) {
                            dataPersonelInfo = data;
                            rowPerosnelAmval++;
                            if ($("#divResultInfoPersonelAmval").html().trim() == "") {
                                $("#divResultInfoPersonelAmval").html(header + header2 + row + footer + btn);
                                $("#txtSearchUserCode").attr("disabled", "disabled");

                                $("#btnSavefinelPersonelInfo").button();
                            }
                            else
                                $("#tblPersonelAmval").append(row);

                            $("#sumPriceAmvalPersonel").html(addCommas(sumpriceamval) + " ریال");
                            $("#divSumPreSave").show();


                            $("#txtBarchasb").val("");
                            $("#drpdwnAmvalName").val(-1);
                            $("#txtPriceAmval").val("");
                            $("#txtCountAmval").val("");
                            $("#txtDescAmval").val("");
                            $("#txtPriceAmval").attr("disabled", "disabled");

                            $("#divResultInfoPersonelAmval").show();
                            $(".setcamma").keyup(function () { _Amount_onkeyup(this) });
                        }
                        else {
                            ShowAlert("کد پرسنلی در سیستم یافت نشد !");
                        }
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    ShowAlert("مجددا تلاش برای پیش ثبت نمایید !");
                }
            });
        }
        else {
            $.each(dataPersonelInfo, function (index) {
                row = mainrow.replaceAll("{personelcode}", $.trim(personelcode));
                row = row.replaceAll("{personelname}", $.trim(this['strPersonelName']));
                row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));
                row = row.replaceAll("{bakhsh}", $.trim(this['strBakhshName']));
                row = row.replaceAll("{ghesmat}", $.trim(this['strGhesmatName']));
                row = row.replaceAll("{barchasb}", $.trim(barchasb) == "" ? "-" : $.trim(barchasb));
                row = row.replaceAll("{amvalname}", $.trim($("#drpdwnAmvalName option:selected").text()));
                row = row.replaceAll("{cnt}", "<input type='text' id='txtcntPersonel{Row}' class='InputTextLeftToRightText setcamma' value='" + addCommas(cntamval) + "' style='width:35px;'/>");
                row = row.replaceAll("{price}", "<input type='text' id='txtPricePersonel{Row}' class='InputTextLeftToRightText setcamma' value='" + addCommas(priceamval) + "' style='width:65px;'/>");
                row = row.replaceAll("{desc}", $.trim(desc) == "" ? "-" : $.trim(desc));
                row = row.replaceAll("{drpdwncode}", $.trim(amvalcode));
                row = row.replaceAll("{Action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeletePrePersonelAmvalInfo({Row}); return false;' ><img src='images/delete.png' style='width:23px;'/></a></div>");
                row = row.replaceAll("{Row}", rowPerosnelAmval);
                sumpriceamval = sumpriceamval + (parseInt(PriceAmvalNew) * parseInt(countNew));
            });
            rowPerosnelAmval++;
            if ($("#divResultInfoPersonelAmval").html().trim() == "") {
                $("#divResultInfoPersonelAmval").html(header + header2 + row + footer + btn);
                $("#txtSearchUserCode").attr("disabled", "disabled");

                $("#btnSavefinelPersonelInfo").button();
            }
            else
                $("#tblPersonelAmval").append(row);

            $("#sumPriceAmvalPersonel").html(addCommas(sumpriceamval) + " ریال");
            $("#divSumPreSave").show();

            $("#txtBarchasb").val("");
            $("#drpdwnAmvalName").val(-1);
            $("#txtPriceAmval").val("");
            $("#txtCountAmval").val("");
            $("#txtDescAmval").val("");
            $("#txtPriceAmval").attr("disabled", "disabled");

            $("#divResultInfoPersonelAmval").show();
            $(".setcamma").keyup(function () { _Amount_onkeyup(this) });
        }
    }
}
//---------------------------------------------------------------------------//
//-----------------------------چک کردن تکراری-------------------------------//
//---------------------------------------------------------------------------//
function checkrepeat(code) {
    var success = 1;
    var trid = "";
    $('#tblPersonelAmval tr').each(function () {

        trid = $(this).attr('id');
        if (trid != '' && trid != undefined) {
            trid = trid.replaceAll("trPersonelAmvalRow", "");
            var code22 = $("#drpdwncode" + trid).html();
            if (trid.trim() === code.trim()) {
                success = 0;
            } else if (code.trim() === code22.trim()) {
                success = 0;
            } else {
                success = 1;
            }
        }
    });
    return success;
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function DeletePrePersonelAmvalInfo(row) {
    var valueprice = $("#txtPricePersonel" + row.toString()).val();
    var valueprice1 = valueprice == "" ? 0 : parseInt(valueprice.replaceAll(",", ""));

    var cntprice = $("#txtcntPersonel" + row.toString()).val();
    var cntprice1 = cntprice == "" ? 0 : parseInt(cntprice.replaceAll(",", ""));

    sumpriceamval = sumpriceamval - (valueprice1 * cntprice1);
    $("#sumPriceAmvalPersonel").html(addCommas(sumpriceamval) + " ریال");
    $("#divSumPreSave").show();

    rowPerosnelAmval = rowPerosnelAmval - 1;

    $("#trPersonelAmvalRow" + row.toString()).remove();

    if (rowPerosnelAmval == 1) {
        $("#divResultInfoPersonelAmval").html("");
        rowPerosnelAmval = 1;
        $("#txtSearchUserCode").removeAttr("disabled");
        dataPersonelInfo = "";
        sumpriceamval = 0;
        $("#sumPriceAmvalPersonel").html("");
        $("#divSumPreSave").hide();
    }
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function NewpresaveAmvalPersonel() {
    $("#txtSearchUserCode").val("");
    $("#txtBarchasb").val("");
    $("#drpdwnAmvalName").val(-1);
    $("#txtPriceAmval").val("");
    $("#txtCountAmval").val("");
    $("#txtDescAmval").val("");
    $("#txtPriceAmval").attr("disabled", "disabled");
    $("#txtSearchUserCode").removeAttr("disabled");
    $("#divResultInfoPersonelAmval").html("");
    rowPerosnelAmval = 1;
    dataPersonelInfo = "";
    sumpriceamval = 0;

    $("#sumPriceAmvalPersonel").html("");
    $("#divSumPreSave").hide();
}
//----------------------------------------------------------------------------
//----------------------------ثبت نهایی ثبت اموال پرسنل---------------------
//----------------------------------------------------------------------------
function savefinalPersonelAmvalInfo() {

    var trid = "";
    var dataInfo = "";
    var err1 = 0;
    var err2 = 0;
    var err3 = 0;
    var cnt = "";
    var price = "";
    $('#tblPersonelAmval tr').each(function () {
        trid = $(this).attr('id');
        if (trid != '' && trid != undefined) {
            trid = trid.replaceAll("trPersonelAmvalRow", "");
            if ($('#txtcntPersonel' + trid).val().trim() == "" ||
                $('#txtPricePersonel' + trid).val().trim() == "")
                err1 = 1;
            else
                if ($('#txtcntPersonel' + trid).val().trim() == "0" ||
                    $('#txtPricePersonel' + trid).val().trim() == "0")
                    err2 = 1;

            cnt = $('#txtcntPersonel' + trid).val().trim();
            price = $('#txtPricePersonel' + trid).val().trim();
            var cnt1 = cnt == "" ? 0 : parseInt(cnt.replaceAll(",", ""));
            var price1 = price == "" ? 0 : parseInt(price.replaceAll(",", ""));

            if ((!numbericFild.test(cnt1)) || (!numbericFild.test(price1)))
                err3 = 1;

            dataInfo = dataInfo + $('#tdpersonelcode' + trid).html().trim() + "," + $('#drpdwncode' + trid).html().trim() + "," + $('#tdBarchasb' + trid).html().trim() + "," + cnt1 + "," + price1 + "," + $('#tdDescAmval' + trid).html().trim() + "^";
        }
    });

    if (err1 == 1) {
        ShowAlert("لطفا اطلاعات خواسته شده را کامل نمایید!");
        return;
    }
    else if (err2 == 1) {
        ShowAlert("تعداد اموال نباید صفر باشد!");
        return;
    }
    else if (err3 == 1) {
        ShowAlert("قیمت واحد را به درستی وارد نمایید!");
        return;
    }
    else {
        if (confirm("آیا از ثبت اموال جدید پرسنل اطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 7, dataInfo: dataInfo },
                url: "PostBack/PBOfficeEstate.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    if (data == '1') {
                        ShowAlert("اطلاعات با موفقیت ثبت شد");
                        NewpresaveAmvalPersonel();
                    }
                        //else if (data == '5') {
                        //    ShowAlert("این اموال قبلا برای این پرسنل  ثبت شده است");
                        //}
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
//----------------------------------------------------------------------------
//-----------------------------------جستجو اموال پرسنل ----------------------
//----------------------------------------------------------------------------
function searchInfoPersonelAmval(vpage) {
    var perosnelcode = $("#txtUserCodesrch").val();
    var workgroup = $("#drpdwnWorkGroupsrch").val();
    var bakhsh = $("#drpdwnBakhshsrch").val();
    var barchasb = $("#txtBarchasbsrch").val();
    var amvalcode = $("#drpdwnAmvalNamesrch").val();

    $("#divsrchPersonelInfo").html("<img src='Images/loading.gif' />");
    $("#divsrchPersonelInfo").show();

    var header = "<table id='tblpersonelamvalInfo' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th>کد پرسنلی</th><th>نام پرسنل</th><th>گروه کاری</th><th>بخش</th><th>قسمت</th><th align='center'>شماره برچسب</th><th align='center'>نام اموال</th><th align='center'>جنس</th><th align='center'>تعداد اموال</th><th align='center'>قیمت واحد (ریال)</th><th align='center'>توضیحات</th><th>عملیات</th></thead><tbody>";
    var mainrow = "<tr id='trRowPersonelAmval{Row}'><td>{Row}</td><td id='tdPersonelcodeAmval{Row}'>{personelcode}</td><td id='tdPersonelNameAmval{Row}'>{namepersonel}</td><td>{workgroup}</td><td>{bakhsh}</td><td>{ghesmat}</td><td>{barchasb}</td><td>{amvalname}</td><td>{jens}</td><td id='tdcountPersonelAmval{Row}'>{count}</td><td id='tdPricePersonelAmval{Row}'>{price}</td><td>{desc}</td><td>{action}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var sum = "<tr style='background-color:#eee;'><td colspan='9' align='left'>مجموع :</td><td id='sumcntAll'>{sumcnt}</td><td id='sumPriceAll'>{sumprice}</td><td></td><td></td></tr>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='searchInfoPersonelAmval(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerpersonelAmvalInfo' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelAmvalInfo' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='searchInfoPersonelAmval({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelPersonelAmval' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblpersonelamvalInfo\"); return false;'/></div>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50";
    var t = 0;
    var i = (vpage - 1) * vperpage + 1;
    var nextPage, prevPage;
    nextPage = vpage + 1;
    prevPage = vpage - 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 9, perosnelcode: perosnelcode, workgroup: workgroup, bakhsh: bakhsh, barchasb: barchasb, amvalcode: amvalcode, page: vpage, perpage: vperpage },
        url: "PostBack/PBOfficeEstate.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var sumcnt = 0;
            var sumprice = 0;
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{namepersonel}", $.trim(this['strPersonelName']));
                row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));
                row = row.replaceAll("{bakhsh}", $.trim(this['strBakhshName']));
                row = row.replaceAll("{ghesmat}", $.trim(this['strGhesmatName']));
                row = row.replaceAll("{amvalname}", $.trim(this['strAmvalName']));
                row = row.replaceAll("{jens}", $.trim(this['strAmvalJens']));
                row = row.replaceAll("{desc}", $.trim(this['strDesc']));
                row = row.replaceAll("{barchasb}", $.trim(this['strBarChasbCode']));
                row = row.replaceAll("{count}", addCommas($.trim(this['numCountPersonelAmval'])));
                row = row.replaceAll("{price}", addCommas($.trim(this['numPricePersonelAmval'])));
                row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeletePersonelAmvalInfosrch({Row},{personelcode},{amvalcode});' ><img src='images/delete.png' style='width:23px;'/></a></div>");
                row = row.replaceAll("{amvalcode}", this['numAmvalRef']);
                row = row.replaceAll("{personelcode}", this['numPersonelRef']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                sumcnt = sumcnt + parseInt(this['numCountPersonelAmval']);
                sumprice = sumprice + parseInt(this['numPricePersonelAmval']);
                allrow = allrow + row;
                t = 1;
                AmvalInfoFileRow = i - 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "searchInfoPersonelAmval(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "searchInfoPersonelAmval(" + nextPage + ")");
            }
            if (t == 1) {
                sum = sum.replaceAll("{sumcnt}", addCommas(sumcnt));
                sum = sum.replaceAll("{sumprice}", addCommas(sumprice));
                $("#divsrchPersonelInfo").html(header + header2 + allrow + sum + footer + footerPager + endfooter + btnExcel);
                $("#divAllRecordCountPersonelAmvalInfo").html(allpage);

                $("#btnExcelPersonelAmval").button();
            }
            else {
                $("#divsrchPersonelInfo").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#divsrchPersonelInfo").html("");
            $("#divsrchPersonelInfo").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------------------------------------------------
//----------------------------------حذف اطلاعات پرسنل اموال-------------------
//-----------------------------------------------------------------------------
function DeletePersonelAmvalInfosrch(row, personelcode, amvalcode) {
    if (confirm("آیا از حذف مشخصات اموال پرسنل مورد نظر اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 10, personelcode: personelcode, amvalcode: amvalcode },
            url: "PostBack/PBOfficeEstate.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {

                    var cnt = $("#tdcountPersonelAmval" + row.toString()).html().trim();
                    var price = $("#tdPricePersonelAmval" + row.toString()).html().trim();

                    var cntAll = $("#sumcntAll").html();
                    var priceAll = $("#sumPriceAll").html();

                    var cnt1 = cnt == "" ? 0 : parseInt(cnt.replaceAll(",", ""));
                    var price1 = price == "" ? 0 : parseInt(price.replaceAll(",", ""));

                    var cntAll1 = cntAll == "" ? 0 : parseInt(cntAll.replaceAll(",", ""));
                    var priceAll1 = priceAll == "" ? 0 : parseInt(priceAll.replaceAll(",", ""));

                    cntAll1 = cntAll1 - cnt1;
                    priceAll1 = priceAll1 - price1;

                    $("#sumcntAll").html(addCommas(cntAll1));
                    $("#sumPriceAll").html(addCommas(priceAll1));

                    $("#trRowPersonelAmval" + row.toString()).remove();
                    ShowAlert("اطلاعات با موفقیت حذف شد.");
                }
                else if (data == '2') {

                    var cnt = $("#tdcountPersonelAmval" + row.toString()).html().trim();
                    var price = $("#tdPricePersonelAmval" + row.toString()).html().trim();

                    var cntAll = $("#sumcntAll").html();
                    var priceAll = $("#sumPriceAll").html();

                    var cnt1 = cnt == "" ? 0 : parseInt(cnt.replaceAll(",", ""));
                    var price1 = price == "" ? 0 : parseInt(price.replaceAll(",", ""));

                    var cntAll1 = cntAll == "" ? 0 : parseInt(cntAll.replaceAll(",", ""));
                    var priceAll1 = priceAll == "" ? 0 : parseInt(priceAll.replaceAll(",", ""));

                    cntAll1 = cntAll1 - cnt1;
                    priceAll1 = priceAll1 - price1;

                    $("#sumcntAll").html(addCommas(cntAll1));
                    $("#sumPriceAll").html(addCommas(priceAll1));

                    $("#trRowPersonelAmval" + row.toString()).remove();
                    ShowAlert("اطلاعات این اموال پرسنل وجود ندارد");
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
//------------------------------------------------------------------------------
///============================== خروجی اکسل از جدول ==========================
//------------------------------------------------------------------------------
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
//---------------------------------------------------------------------------------
//-------------------------------ثبت حواله اموال----------------------------------
//---------------------------------------------------------------------------------
function savehavalehAmval() {
    var havalehcode = $("#drpdwnHavalehKind").val();
    var amvalcode = $("#drpdwnAmvalHavaleh").val();
    var cntamval = $("#txtCntAmvalHavaleh").val();
    var priceamval = $("#txtPriceAmvalIHavaleh").val();
    var desc = $("#txtDescHavalehAmval").val();

    if (havalehcode == "-1" || amvalcode == "-1" || cntamval == "" || priceamval == "") {
        ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید!");
        return;
    }
    else if ($.trim(cntamval) == '0') {
        ShowAlert("لطفا تعداد اموال را به درستی وارد نمایید!");
        return;
    }
    else if ($.trim(priceamval) == '0') {
        ShowAlert("لطفا قیمت واحد اموال را به درستی وارد نمایید!");
        return;
    }

    var PriceAmvalhavaleh = parseInt(priceamval.replaceAll(",", ""));
    var cntamvalHavaleh = parseInt(cntamval.replaceAll(",", ""));

    if (!numbericFild.test(cntamvalHavaleh)) {
        ShowAlert("تعداد اموال باید به صورت عددی باشد!");
        return;
    }
    else if (!numbericFild.test(PriceAmvalhavaleh)) {
        ShowAlert("قیمت واحد اموال باید به صورت عددی باشد!");
        return;
    }
    else {
        if (confirm("آیا از ثبت حواله اموال جدیداطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: {
                    i: 11,
                    havalehcode: havalehcode,
                    amvalcode: amvalcode,
                    cntamval: cntamval,
                    priceamval: PriceAmvalhavaleh,
                    desc: desc
                },
                url: "PostBack/PBOfficeEstate.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    if (data == '1') {
                        ShowAlert("ثبت حواله با موفقیت انجام شد");

                        $("#drpdwnHavalehKind").val("-1");
                        $("#drpdwnAmvalHavaleh").val("-1");
                        $("#txtCntAmvalHavaleh").val("");
                        $("#txtPriceAmvalIHavaleh").val("");
                        $("#txtDescHavalehAmval").val("");
                    }
                    else if (data == '2') {
                        ShowAlert("این حواله را نمی توان ثبت کرد با ثبت آن موجودی منفی می شود !");
                    }
                    else if (data == '5') {
                        ShowAlert("این نام اموال در سیستم یافت نشد !");
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
//---------------------------------------------------------------------------------
//-------------------------------------پیش ثبت واگذاری اموال---------------------
//---------------------------------------------------------------------------------
var rowallvagozarAction = 0;
var rowallDarekhtiarAction = 0;
function presaveVagozarAmval() {
    rowallvagozarAction = 0;
    rowallDarekhtiarAction = 0;
    var personelfrom = $("#txtVagozarPersonelCodeFrom").val();
    var personelto = $("#txtVagozarPersonelCodeTo").val();
    var status = $("#drpdwnstatusVagozar").val();
    if (personelfrom.trim() == "" || personelto.trim() == "" || status == "-1") {
        ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید!");
        return;
    }

    else if ($.trim(personelfrom) == '0') {
        ShowAlert("لطفا از کد پرسنلی را به درستی وارد نمایید!");
        return;
    }
    else if ($.trim(personelto) == '0') {
        ShowAlert("لطفا به کد پرسنلی را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(personelfrom)) {
        ShowAlert("از کد پرسنلی باید به صورت عددی باشد!");
        return;
    }
    else if (!numbericFild.test(personelto)) {
        ShowAlert("به کد پرسنلی باید به صورت عددی باشد!");
        return;
    }
    else if (parseInt(personelfrom) < 1000) {
        ShowAlert("از کد پرسنلی در سیستم وجود ندارد!");
        return;
    }
    else if (parseInt(personelto) < 1000) {
        ShowAlert("به کد پرسنلی در سیستم وجود ندارد!");
        return;
    }
    else if (personelfrom == personelto) {
        ShowAlert("کد پرسنلی های وارد شده نباید مشابه باشد !");
        return;
    }
    else {
        $("#divResultInfoPersonelAmvalVagozar").html("<img src='Images/loading.gif' />");
        $("#divResultInfoPersonelAmvalVagozar").show();
        var header = "";
        var header2 = "";
        var mainrow = "";
        var footer = "";
        var sum1 = "";
        var sum2 = "";
        var btn = "";

        if (status == 1) {
            header = "<table class='MainTbl' id='tblPersonelAmvalVagozar'>";
            header2 = "<thead><tr><th style='display:none;'></th><th>از کد پرسنلی</th><th>نام پرسنل </th><th>به کد پرسنلی</th><th>نام پرسنل</th><th>شماره برچسب</th><th>نام اموال</th><th>تعداد اموال</th><th>قیمت واحد (ریال)</th><th>توضیحات</th><th>عملیات</th></tr></thead><tbody>";
            mainrow = "<tr id='trPersonelAmvalRowVagozar{Row}'><th style='display:none;' id='tdamvalcodevagozar{Row}'>{amvalcode}</th><td id='tdpersonelcodeVagozar{Row}' style='background-color:#ddd000;'>{personelcodefrom}</td><td style='background-color:#ddd000;'>{personelnamefrom}</td><td style='background-color:lawngreen;'>{personelcodeto}</td><td style='background-color:lawngreen;'>{personelnameto}</td><td id='tdBarchasbVagozar{Row}'>{barchasb}</td><td >{amvalname}</td><td id='tdcntamvalVagozar{Row}'>{cnt}</td><td id='tdpriceAmvalVagozar{Row}'>{price}</td><td id='tdDescAmvalVagozar{Row}'>{desc}</td><td>{action}</td></tr>";
            footer = "</tbody></table>";
            sum1 = "<tr style='background-color:#d9d9d9;'><td align='left' colspan='6'>مجموع :</td><td id='SumCntVagozar'>{sumcnt}</td><td id='SumPriceVagozar'>{sumprice}</td><td></td><td></td></tr>";
            sum2 = "<tr style='background-color:#c8c8c8;'><td align='left' colspan='6'>مجموع اموال واگذار شده :</td><td colspan='2' id='SumAllVagozar'>{sumprice}</td><td></td><td></td></tr>";
            btn = "<div style='padding:10px 0; text-align:center;'> <input  type='button' value='ثبت نهایی' id='btnSavefinelPersonelInfoAmvalVagozar' onclick='savefinalPersonelAmvalInfoVagozar({from},{to},{status},-1);' /></div>";
        }
        else if (status == 2) {
            header = "<table id='tblpersonelvagozarAcion' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
            header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th>کد پرسنلی</th><th>نام پرسنل</th><th>کد پرسنل واگذار کننده قبلی</th><th>نام پرسنل واگذر کننده  قبلی</th><th>کد پرسنل در اختیار گیرنده جدید</th><th>نام پرسنل در اختیار گیرنده جدید</th><th>تعداد اموال واگذار شده</th><th align='center'>مجموع اموال واگذار شده (ریال)</th><th></th></thead><tbody>";
            mainrow = "<tr ><td>{Row}</td><td style='background-color:lawngreen;'>{personelcode}</td><td style='background-color:lawngreen;'>{namepersonel}</td><td style='background-color:#ddd000;'>{personelcodevagozar}</td><td style='background-color:#ddd000;'>{personelnamevagozar}</td><td style='background-color:#80d8ff;'>{personelCodeto}</td><td style='background-color:#80d8ff;'>{personelnameto}</td><td>{cnt}</td><td>{price}</td><td>{action}</td></tr>" +
                      "<tr id='trRowVagozarAction{Row}' style='display:none;background-color:#ddd;'><td colspan='10' id='trInfoVagozarAction{Row}' style='text-align:center;'></td></tr>";
            footer = "</table></td></tr><tr><td>";
        }
        var row = "";
        var allrow = "";
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 12, personelfrom: personelfrom, personelto: personelto, status: status },
            url: "PostBack/PBOfficeEstate.ashx",
            success: function (data) {
                if (data == "5") {
                    if (status == "1")
                        ShowAlert("این پرسنل اموالی برای واگذاری ندارد !");
                    else if (status == "2")
                        ShowAlert("این پرسنل اموالی برای در اختیار گذاشتن ندارد !");
                    $("#divResultInfoPersonelAmvalVagozar").html("");
                }
                else if (data == "2") {
                    ShowAlert("به کد پرسنلی وارد شده در سیستم یافت نشد ! لطفا بررسی نمایید");
                    $("#divResultInfoPersonelAmvalVagozar").html("");
                }
                else if (data == "3") {
                    ShowAlert("از کد پرسنلی وارد شده در سیستم یافت نشد ! لطفا بررسی نمایید");
                    $("#divResultInfoPersonelAmvalVagozar").html("");
                }
                else {
                    var t = 0;
                    var sumpriceamval = 0;
                    var sumpric = 0;
                    var sumcnt = 0;
                    var i = 1;
                    if (status == 1) {
                        $.each(data, function (index) {
                            row = mainrow.replaceAll("{personelcodefrom}", $.trim(this['numPersonelCodefrom']));
                            row = row.replaceAll("{personelnamefrom}", $.trim(this['strPersonelNamefrom']));
                            row = row.replaceAll("{personelcodeto}", $.trim(this['numPersonelCodeTo']));
                            row = row.replaceAll("{personelnameto}", $.trim(this['strPersonelNameTo']));
                            row = row.replaceAll("{barchasb}", $.trim(this['strBarChasbCode']) == null || $.trim(this['strBarChasbCode']) == "" ? "-" : $.trim(this['strBarChasbCode']));
                            row = row.replaceAll("{amvalname}", $.trim(this['strAmvalName']));
                            row = row.replaceAll("{cnt}", addCommas($.trim(this['numCountPersonelAmval'])));
                            row = row.replaceAll("{price}", addCommas($.trim(this['numPricePersonelAmval'])));
                            row = row.replaceAll("{desc}", $.trim(this['strDesc']));
                            row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeleteItemAmvalVagozar({Row},{personelcode},{amvalcode},{status});' ><img src='images/delete.png' style='width:23px;'/></a></div>");
                            row = row.replaceAll("{personelcode}", $.trim(this['numPersonelCodefrom']));
                            row = row.replaceAll("{amvalcode}", $.trim(this['numAmvalRef']));
                            row = row.replaceAll("{status}", status);
                            row = row.replaceAll("{Row}", i);
                            sumpriceamval = sumpriceamval + +(parseInt(this['numPricePersonelAmval']) * parseInt(this['numCountPersonelAmval']));
                            sumpric = sumpric + parseInt(this['numPricePersonelAmval']);
                            sumcnt = sumcnt + parseInt(this['numCountPersonelAmval']);
                            t = 1;
                            i++;
                            allrow = allrow + row;
                            rowallDarekhtiarAction = i - 1;
                        });
                        if (t == 1) {
                            sum1 = sum1.replaceAll("{sumcnt}", addCommas(sumcnt));
                            sum1 = sum1.replaceAll("{sumprice}", addCommas(sumpric) + " ریال");

                            sum2 = sum2.replaceAll("{sumprice}", addCommas(sumpriceamval) + " ریال");

                            btn = btn.replaceAll("{from}", personelfrom);
                            btn = btn.replaceAll("{to}", personelto);
                            btn = btn.replaceAll("{status}", status);

                            $("#divResultInfoPersonelAmvalVagozar").html(header + header2 + allrow + sum1 + sum2 + footer + btn);
                            $("#btnSavefinelPersonelInfoAmvalVagozar").button();
                        }
                        else {
                            $("#divResultInfoPersonelAmvalVagozar").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                        }
                    }
                    else if (status == 2) {
                        $.each(data, function (index) {
                            row = mainrow.replaceAll("{namepersonel}", $.trim(this['strPersonelName']));
                            row = row.replaceAll("{personelnamevagozar}", $.trim(this['strpersonelVagozarName']));
                            row = row.replaceAll("{cnt}", addCommas($.trim(this['sumcnt'])));
                            row = row.replaceAll("{price}", addCommas($.trim(this['sumprice'])));
                            row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DetailsPersonelAmvalInfosrchVagozar({Row},{personelcode},{personelcodevagozar},2);' ><img src='images/details.png' style='width:23px;'/></a></div>");
                            row = row.replaceAll("{personelcode}", this['numPersonelRef']);
                            row = row.replaceAll("{personelcodevagozar}", this['numPersonelRefVagozar']);
                            row = row.replaceAll("{personelCodeto}", this['numPersonelCodeTo']);
                            row = row.replaceAll("{personelnameto}", this['strPersonelNameTo']);
                            row = row.replaceAll("{Row}", i);
                            i = i + 1;
                            allrow = allrow + row;
                            t = 1;
                            rowallvagozarAction = i - 1;
                        });

                        if (t == 1) {

                            btn = btn.replaceAll("{from}", personelfrom);
                            btn = btn.replaceAll("{to}", personelto);
                            btn = btn.replaceAll("{status}", status);
                            btn = btn.replaceAll("{vagozari}", status);

                            $("#divResultInfoPersonelAmvalVagozar").html(header + header2 + allrow + footer);
                            $("#btnSavefinelPersonelInfoAmvalVagozar").button();
                        }
                        else {
                            $("#divResultInfoPersonelAmvalVagozar").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                        }
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("مجددا تلاش برای پیش ثبت نمایید !");
                $("#divResultInfoPersonelAmvalVagozar").hide();
            }
        });
    }
}
//---------------------------------------------------------------------------------
//---------------------------------حذف اموال در حال واگذاری----------------------
//---------------------------------------------------------------------------------
function DeleteItemAmvalVagozar(Rows, personelcode, amvalcode, status) {
    if (confirm("آیا از حذف مشخصات اموال پرسنل مورد نظر از این لیست اطمینان دارید ؟")) {

        if (status == 1) {
            var sumprice = $("#SumPriceVagozar").html().trim();
            var sumcnt = $("#SumCntVagozar").html().trim();
            var sumall = $("#SumAllVagozar").html().trim();

            sumprice = sumprice == "" ? "0" : parseInt(sumprice.replaceAll(",", "").replaceAll("ریال", ""));
            sumcnt = sumcnt == "" ? "0" : parseInt(sumcnt.replaceAll(",", ""));
            sumall = sumall == "" ? "0" : parseInt(sumall.replaceAll(",", "").replaceAll("ریال", ""));

            var cntdel = $("#tdcntamvalVagozar" + Rows.toString()).html().trim();
            var pricedel = $("#tdpriceAmvalVagozar" + Rows.toString()).html().trim();
            cntdel = cntdel == "" ? "0" : parseInt(cntdel.replaceAll(",", "").replaceAll("ریال", ""));
            pricedel = pricedel == "" ? "0" : parseInt(pricedel.replaceAll(",", "").replaceAll("ریال", ""));


            $("#SumPriceVagozar").html(addCommas(parseInt(sumprice) - parseInt(pricedel)) + " ریال");
            $("#SumCntVagozar").html(addCommas(parseInt(sumcnt) - parseInt(cntdel)));
            $("#SumAllVagozar").html(addCommas(parseInt(sumall) - (parseInt(pricedel) * parseInt(cntdel))) + " ریال");

            $("#trPersonelAmvalRowVagozar" + Rows.toString()).remove();

            rowallDarekhtiarAction = rowallDarekhtiarAction - 1;

            if (rowallDarekhtiarAction == 0)
                $("#divResultInfoPersonelAmvalVagozar").html("");
        }
        else if (status == 2) {
            $("#trAmvalDetails2" + Rows.toString()).remove();
            rowdetailsAll = rowdetailsAll - 1;
            if (rowdetailsAll == 0)
                $("#divResultInfoPersonelAmvalVagozar").html("");
        }
    }
}
//---------------------------------------------------------------------------------
//--------------------------------------واگذاری اموال جدید------------------------
//---------------------------------------------------------------------------------
function NewVagozarAmval() {
    $("#txtVagozarPersonelCodeFrom").val("");
    $("#txtVagozarPersonelCodeTo").val("");
    $("#divResultInfoPersonelAmvalVagozar").html("");
    $("#drpdwnstatusVagozar").val("-1");
}
//---------------------------------------------------------------------------------
//--------------------------------ثبت نهایی واگذاری اموال------------------------
//---------------------------------------------------------------------------------
function savefinalPersonelAmvalInfoVagozar(personelfrom, personelto, status, vagozari) {
    if (personelfrom == personelto) {
        ShowAlert("کد پرسنلی های وارد شده نباید مشابه باشد !");
        return;
    }

    if (confirm("آیا از واگذاری اموال به پرسنل دیگر اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        var amvalinfoSelected = "";

        if (status == 1) {
            for (var i = 1; i <= rowallDarekhtiarAction; i++) {
                if ($("#tdamvalcodevagozar" + i.toString()).html().trim() != undefined && $("#tdamvalcodevagozar" + i.toString()).html().trim() != null) {
                    amvalinfoSelected = amvalinfoSelected + $("#tdamvalcodevagozar" + i.toString()).html().trim() + ",";
                }
            }
        }
        else if (status == 2) {
            for (var i = 1; i <= rowdetailsAll; i++) {
                if ($("#tdDetailsamvalcode2" + i.toString()).html().trim() != undefined && $("#tdDetailsamvalcode2" + i.toString()).html().trim() != null) {
                    amvalinfoSelected = amvalinfoSelected + $("#tdDetailsamvalcode2" + i.toString()).html().trim() + ",";
                }
            }
        }

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 13, personelfrom: personelfrom, personelto: personelto, status: status, vagozari: vagozari, amvalinfoSelected: amvalinfoSelected },
            url: "PostBack/PBOfficeEstate.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                if (data == '1') {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    NewVagozarAmval();
                    searchInfoPersonelAmvalVagozar(1);
                    searchInfoPersonelAmval(1);
                }
                else if (data == '5') {
                    if (status == 1)
                        ShowAlert("این پرسنل اموالی برای واگذاری ندارد !");
                    else if (status == 2)
                        ShowAlert("این پرسنل اموالی برای در اختیار گذاشتن ندارد !");
                }
                else if (data == '6') {
                    ShowAlert("به کد پرسنلی وارد شده اموال در اختیار دارد! لطفا ابتدا آنها را بررسی کنید");
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
//---------------------------------------------------------------------------------
//-------------------------------جستجوی اموال واگذار شده-------------------------
//---------------------------------------------------------------------------------
var rowallvagozar = 0;
function searchInfoPersonelAmvalVagozar(vpage) {
    rowallvagozar = 0;
    var perosnelcode = $("#txtUserCodesrchVagozar").val();
    var amvalcode = $("#drpdwnAmvalVagozar").val();

    $("#divsrchPersonelInfoVagozar").html("<img src='Images/loading.gif' />");
    $("#divsrchPersonelInfoVagozar").show();

    var header = "<table id='tblpersonelamvalInfovagozar' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th>کد پرسنلی</th><th>نام پرسنل</th><th>کد پرسنل واگذار کننده</th><th>نام پرسنل واگذر کننده</th><th>تعداد اموال واگذار شده</th><th align='center'>مجموع اموال واگذار شده (ریال)</th><th></th></thead><tbody>";
    var mainrow = "<tr ><td>{Row}</td><td style='background-color:lawngreen;'>{personelcode}</td><td style='background-color:lawngreen;'>{namepersonel}</td><td style='background-color:#ddd000;'>{personelcodevagozar}</td><td style='background-color:#ddd000;'>{personelnamevagozar}</td><td>{cnt}</td><td>{price}</td><td>{action}</td></tr>" +
                  "<tr id='trRowVagozarSrch{Row}' style='display:none;background-color:#ddd;'><td colspan='10' id='trInfoVagozarSrch{Row}' style='text-align:center;'></td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var sum = "<tr style='background-color:#eee;'><td colspan='9' align='left'>مجموع :</td><td id='sumcntAll'>{sumcnt}</td><td id='sumPriceAll'>{sumprice}</td><td></td><td></td></tr>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='searchInfoPersonelAmvalVagozar(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerpersonelAmvalInfovagozar1' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelAmvalInfovagozar1' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='searchInfoPersonelAmvalVagozar({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelPersonelAmvalVagozar' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblpersonelamvalInfovagozar\"); return false;'/></div>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50";
    var t = 0;
    var i = (vpage - 1) * vperpage + 1;
    var nextPage, prevPage;
    nextPage = vpage + 1;
    prevPage = vpage - 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 14, perosnelcode: perosnelcode, amvalcode: amvalcode, page: vpage, perpage: vperpage },
        url: "PostBack/PBOfficeEstate.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var sumcnt = 0;
            var sumprice = 0;
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{namepersonel}", $.trim(this['strPersonelName']));
                row = row.replaceAll("{personelnamevagozar}", $.trim(this['strpersonelVagozarName']));
                row = row.replaceAll("{cnt}", addCommas($.trim(this['sumcnt'])));
                row = row.replaceAll("{price}", addCommas($.trim(this['sumprice'])));
                row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DetailsPersonelAmvalInfosrchVagozar({Row},{personelcode},{personelcodevagozar},1);' ><img src='images/details.png' style='width:23px;'/></a></div>");
                row = row.replaceAll("{personelcode}", this['numPersonelRef']);
                row = row.replaceAll("{personelcodevagozar}", this['numPersonelRefVagozar']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                rowallvagozar = i - 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "searchInfoPersonelAmvalVagozar(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "searchInfoPersonelAmvalVagozar(" + nextPage + ")");
            }
            if (t == 1) {
                $("#divsrchPersonelInfoVagozar").html(header + header2 + allrow + footer + footerPager + endfooter + btnExcel);
                $("#divAllRecordCountPersonelAmvalInfovagozar1").html(allpage);

                $("#btnExcelPersonelAmvalVagozar").button();
            }
            else {
                $("#divsrchPersonelInfoVagozar").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#divsrchPersonelInfoVagozar").html("");
            $("#divsrchPersonelInfoVagozar").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//------------------------------مشاهده دیتیل اموال واگذار شده-------------------------
//---------------------------------------------------------------------------------
var rowdetailsAll = 0;
function DetailsPersonelAmvalInfosrchVagozar(Rows, personelcode, personelcodevagizar, type) {

    rowdetailsAll = 0;
    if ((type == 1 && $("#trRowVagozarSrch" + Rows.toString()).css("display") == "none") || (type == 2 && $("#trRowVagozarAction" + Rows.toString()).css("display") == "none")) {

        if (type == 1) {
            for (var i = 1; i <= rowallvagozar; i++) {
                if ($("#trRowVagozarSrch" + i.toString()).css("display") == "show") {
                    $("#trInfoVagozarSrch" + Rows.toString()).html("");
                    $("#trRowVagozarSrch" + Rows.toString()).hide();
                }
            }

            $("#trInfoVagozarSrch" + Rows.toString()).html("<img src='Images/loading.gif' />");
            $("#trRowVagozarSrch" + Rows.toString()).show();
        }
        else if (type == 2) {
            for (var i = 1; i <= rowallvagozarAction; i++) {
                if ($("#trRowVagozarAction" + i.toString()).css("display") == "show") {
                    $("#trInfoVagozarAction" + Rows.toString()).html("");
                    $("#trRowVagozarAction" + Rows.toString()).hide();
                }
            }

            $("#trInfoVagozarAction" + Rows.toString()).html("<img src='Images/loading.gif' />");
            $("#trRowVagozarAction" + Rows.toString()).show();
        }

        var header = "<table class='MainTbl' style='margin:10px;width:97%;'>";
        var header2 = "<thead><tr><th style='display:none;'></th><th>نام اموال</th><th>شماره برچسب</th><th>تعداد اموال</th><th>قیمت واحد (ریال)</th><th>توضیحات</th>";
        if (type == 1) header2 = header2 + "</tr></thead><tbody>";
        else if (type == 2) header2 = header2 + "<th>عملیات</th></tr></thead><tbody>";

        var mainrow = "<tr id='trAmvalDetails" + type.toString() + "{Row}'><td style='display:none;' id='tdDetailsamvalcode" + type.toString() + "{Row}'>{amvalcode}</td><td >{amvalname}</td><td >{barchasb}</td><td>{cnt}</td><td >{price}</td><td>{desc}</td>";

        if (type == 1) mainrow = mainrow + "</tr>";
        else if (type == 2) mainrow = mainrow + "<td>{action}</td></tr>";

        var footer = "</tbody></table>";

        var row = "";
        var allrow = "";

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 15, personelcode: personelcode, personelcodevagizar: personelcodevagizar },
            url: "PostBack/PBOfficeEstate.ashx",
            success: function (data) {
                if (data == "5") {
                    ShowAlert("این پرسنل اموالی که به آن واگذار شده باشد ، ندارد !");

                    if (type == 1)
                        searchInfoPersonelAmvalVagozar(1);
                    else if (type == 2)
                        NewVagozarAmval();
                }
                else {
                    var t = 0;
                    var i = 1;
                    $.each(data, function (index) {
                        row = mainrow.replaceAll("{barchasb}", $.trim(this['strBarChasbCode']) == null || $.trim(this['strBarChasbCode']) == "" ? "-" : $.trim(this['strBarChasbCode']));
                        row = row.replaceAll("{amvalname}", $.trim(this['strAmvalName']));
                        row = row.replaceAll("{cnt}", addCommas($.trim(this['numCountPersonelAmval'])));
                        row = row.replaceAll("{price}", addCommas($.trim(this['numPricePersonelAmval'])));
                        row = row.replaceAll("{desc}", $.trim(this['strDesc']) == "" ? "-" : $.trim(this['strDesc']));
                        row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeleteItemAmvalVagozar({Row},{personelcode},{amvalcode},{status});' ><img src='images/delete.png' style='width:23px;'/></a></div>");
                        row = row.replaceAll("{amvalcode}", $.trim(this['numAmvalRef']));
                        row = row.replaceAll("{status}", $("#drpdwnstatusVagozar").val());
                        row = row.replaceAll("{personelcode}", personelcode);
                        row = row.replaceAll("{Row}", i);
                        t = 1;
                        i++;
                        allrow = allrow + row;
                        rowdetailsAll = i - 1;
                    });
                    if (t == 1) {
                        if (type == 1) {
                            $("#trInfoVagozarSrch" + Rows.toString()).html(header + header2 + allrow + footer);
                            $("#trInfoVagozarSrch" + Rows.toString()).show();
                        }
                        else if (type == 2) {
                            var btn = "<div style='padding:10px 0; text-align:center;'> <input  type='button' value='ثبت نهایی انتقال اموال' id='btnSavefinelPersonelVagozar' onclick='savefinalPersonelAmvalInfoVagozar({from},{to},{status},{vagozar});' /></div>";

                            btn = btn.replaceAll("{from}", personelcode);
                            btn = btn.replaceAll("{to}", $("#txtVagozarPersonelCodeTo").val());
                            btn = btn.replaceAll("{vagozar}", personelcodevagizar);
                            btn = btn.replaceAll("{status}", $("#drpdwnstatusVagozar").val());

                            $("#trInfoVagozarAction" + Rows.toString()).html(header + header2 + allrow + footer + btn);
                            $("#trInfoVagozarAction" + Rows.toString()).show();

                            $("#btnSavefinelPersonelVagozar").button();
                        }
                    }
                    else {
                        if (type == 1)
                            $("#trInfoVagozarSrch" + Rows.toString()).html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                        else if (type == 2)
                            $("#trInfoVagozarAction" + Rows.toString()).html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                ShowAlert("مجددا تلاش برای پیش ثبت نمایید !");
                if (type == 1) {
                    $("#trInfoVagozarSrch" + Rows.toString()).html("");
                    $("#trRowVagozarSrch" + Rows.toString()).hide();
                }
                else if (type == 2) {
                    $("#trInfoVagozarAction" + Rows.toString()).html("");
                    $("#trRowVagozarAction" + Rows.toString()).hide();
                }
            }
        });
    }
    else {
        if (type == 1) {
            $("#trInfoVagozarSrch" + Rows.toString()).html("");
            $("#trRowVagozarSrch" + Rows.toString()).hide();
        }
        else if (type == 2) {
            $("#trInfoVagozarAction" + Rows.toString()).html("");
            $("#trRowVagozarAction" + Rows.toString()).hide();
        }
    }
}
