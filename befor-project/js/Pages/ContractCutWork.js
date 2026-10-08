$(document).ready(function () {

    $("#divPersonelTabs").tabs();
    GetTabsDeActive("divPersonelTabs");
    GetDrpdwnBaseAll();

    $("#btnSearchPersonelCodeCutWork").click(function () { SearchGetPersonelInfoCutWork(); return false; });
    $("#btnReportPersonelSearch").click(function () { GetReportInfoPersonel(1); return false; });

    $("#txtPersonelCodeForCutWork").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            SearchGetPersonelInfoCutWork();
            return false;
        }
    });
});
//============================================================================
//============================================================================
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
var drpdwnMarrid = "";
var drpdwnProvince = "";
var drpdwnCity = "";
var drpdwnContractKinds = "";
var drpdwnEmployer = "";
var drpdwnjensiat = "";
var drpdwnWorkgroup = "";
//var drpdwnUnitOrganizations = "";
//============================================================================
//============================================================================
function GetDrpdwnBaseAll() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    drpdwnMarrid = "";
    drpdwnProvince = "";
    drpdwnCity = "";
    drpdwnContractKinds = "";
    drpdwnEmployer = "";
    drpdwnWorkgroup = "";
    // drpdwnUnitOrganizations = "";
    drpdwnjensiat = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 4 },
        url: "PostBack/PBContractCutWork.ashx",
        success: function (data) {
            drpdwnMarrid = data[0];
            drpdwnProvince = data[1];
            drpdwnCity = data[2];
            drpdwnContractKinds = data[3];
            drpdwnEmployer = data[4];
            // drpdwnUnitOrganizations = data[5];
            drpdwnjensiat = data[6];
            drpdwnWorkgroup = data[7];
            ShowDrpDwnInRegisterPage(1);
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//============================================================================
function ShowDrpDwnInRegisterPage(type) {
    selectStart = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;'>";
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' onchange='ShowDrpDwnInRegisterPage(2);' style='width:176px;'>";
    selectStart2 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;' onchange='GetTextContractKind();GetInfoByContractKind();'>";
    selectStart3 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:154px;' >";
    selectStart4 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;' onchange='showChildInfo();'>";
    selectStart5 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' multiple='multiple' size='5'>";
    selectStart6 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' onchange='ShowDrpDwnInRegisterPage(3);' style='width:176px;'>";

    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option1 = "<option value='-2'>نامشخص</option>";
    option = "<option value='{value}'>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (type == 1) {
        allrow = "";
        //--------------------- jensiat -------------------------------------------
        $.each(drpdwnjensiat, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnJensiat");
        $("#divdrpdwnJensiat").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart.replaceAll("{dpdwnId}", "SaatidrpdwnJensiat");
        $("#divSaatidrpdwnJensiat").html(selectTemp + option0 + allrow + selectEnd);

        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------- Marrid -------------------------------------------
        allrow = "";
        $.each(drpdwnMarrid, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart4.replaceAll("{dpdwnId}", "drpdwnMarrid");
        $("#divdrpdwnMarrid").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- privonce -------------------------------------------
        allrow = "";
        $.each(drpdwnProvince, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnProvince");
        $("#divdrpdwnProvince").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart6.replaceAll("{dpdwnId}", "drpdwnProvinceSaati");
        $("#divdrpdwnProvinceSaati").html(selectTemp + option0 + allrow + selectEnd);

        //--------------------------------------------------------------------------
        //--------------------- ContractKinds -------------------------------------------
        allrow = "";
        $.each(drpdwnContractKinds, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnContractKind");
        $("#divdrpdwnContractKind").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchContractKind");
        $("#tddrpdwnSearchContractKind").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchContractKindContract");
        $("#tddrpdwnSearchContractKindContract").html(selectTemp + option0 + allrow + selectEnd);

        //--------------------------------------------------------------------------
        //--------------------- workgroup -------------------------------------------
        allrow = "";
        $.each(drpdwnWorkgroup, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        selectTemp = selectStart5.replaceAll("{dpdwnId}", "drpdwnWorkGroupPersonelContract");
        $("#tddrpdwnWorkGroupPersonelContract").html(selectTemp + option1 + allrow + selectEnd);
        $("#drpdwnWorkGroupPersonelContract").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------- Employer -------------------------------------------
        allrow = "";
        $.each(drpdwnEmployer, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnEmployer");
        $("#DivEmployer").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchEmployer");
        $("#tddrpdwnSearchEmployer").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchEmployerContract");
        $("#tddrpdwnSearchEmployerContract").html(selectTemp + option0 + allrow + selectEnd);


        //--------------------------------------------------------------------------
        //--------------------- UnitOrganizations -------------------------------------------
        //allrow = "";
        //$.each(drpdwnUnitOrganizations, function (index) {
        //    row = option.replaceAll("{value}", this['value']);
        //    row = row.replaceAll("{item}", this['item']);
        //    allrow = allrow + row;
        //});
        //selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnUnitOrganization");
        //$("#divdrpdwnUnitOrganization").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
    }

    if (type == 1 || type == 2 || type == 3) {

        //--------------------- city -------------------------------------------

        if (type == 1 || type == 2) {
            allrow = "";
            $.each(drpdwnCity, function (index) {
                if (this['value2'] == $("#drpdwnProvince").val()) {
                    row = option.replaceAll("{value}", this['value']);
                    row = row.replaceAll("{item}", this['item']);
                    allrow = allrow + row;
                }
            });
            selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnCity");
            $("#divdrpdwnCity").html(selectTemp + option0 + allrow + selectEnd);
        }

        if (type == 1 || type == 3) {
            allrow = "";
            $.each(drpdwnCity, function (index) {
                if (this['value2'] == $("#drpdwnProvinceSaati").val()) {
                    row = option.replaceAll("{value}", this['value']);
                    row = row.replaceAll("{item}", this['item']);
                    allrow = allrow + row;
                }
            });
            selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnCitySaati");
            $("#divdrpdwnCitySaati").html(selectTemp + option0 + allrow + selectEnd);
        }
        //--------------------------------------------------------------------------
    }
}
//-----------------------------------نمایش اطلاعات پرسنل برای قطع همکاری-----------------------------------
var personelRowCutwork = 0;
function SearchGetPersonelInfoCutWork() {
    personelRowCutwork = 0;
    var personelcode = $.trim($("#txtPersonelCodeForCutWork").val());
    if (personelcode == "") {
        ShowAlert("کد پرسنلی را وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(personelcode)) {
        ShowAlert("لطفا کد پرسنلی را به صورت عددی وارد نمایید!");
        return;
    }

    $("#ResultDivCutWorkPersonelInfo").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>کد پرسنلی</th><th>نام و نام خانوادگی</th><th>کارکرد مورد محاسبه</th><th>نوع قرارداد</th><th>گروه کاری</th><th style='display:none;'>شماره قرارداد</th><th>تاریخ شروع قرارداد</th><th>تاریخ پایان قرارداد</th><th style='width:87px;'>تاریخ قطع همکاری</th><th>مبلغ سایر (ریال)</th><th>توضیحات سایر</th><th>محاسبه عیدی/بازخرید مرخصی</th></tr></thead><tbody>";
    var mainrow = "<tr id='trCutWorkPersonelRow{Row}'><td>{Row}</td><td id='tdPersonelCodeforCutWork{Row}'>{personelCode}</td><td>{Name}</td><td>{karkard}</td><td>{contractkind}</td><td>{workgroup}</td><td style='display:none;'>{contractCode}</td><td id='datestart{Row}'>{datestart}</td><td id='dateend{Row}'>{dateEnd}</td><td style='width:87px;'>{dateCut}</td><td >{pricesier}</td><td >{descsaier}</td><td >{Eidi}</td></tr>";
    var footer = "</tbody></table>";
    var btn = "<div style='text-align:center;padding:10px 0;'><input id='btnTasviehPersonel' type='button' value='پیش ثبت و پرینت فرم قطع همکاری' onclick='showPrintTasviehHesabPersonelCutWork(" + personelcode + ",1);' style='margin-left:55px;'/>" +
             // "<input id='btnSaveCutworkForPersonel' type='button' value='ثبت نهایی قطع همکاری' onclick='SaveCutWorkForPersonel();' />" +
              "</div>";
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
        data: { i: 2, personelcode: personelcode },
        url: "PostBack/PBContractCutWork.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            $("#ResultDivCutWorkPersonelInfo").html("");

            if (data == "2") {
                $("#ResultDivCutWorkPersonelInfo").html("");
                ShowAlert("اطلاعاتی از این کد پرسنلی یافت نشد!");
            }
            else if (data == "10") {
                $("#ResultDivCutWorkPersonelInfo").html("");
                ShowAlert("قرارداد این پرسنل در سیستم باید تمدید شود !");
            }
            else if (data == "11") {
                $("#ResultDivCutWorkPersonelInfo").html("");
                ShowAlert("کارکرد ماهیانه پرسنل را ابتدا محاسبه نمایید !");
            }
            else if (data == "12") {
                $("#ResultDivCutWorkPersonelInfo").html("");
                ShowAlert("قرارداد این پرسنل در سیستم یافت نشد !");
            }
            else if (data == "3") {
                $("#ResultDivCutWorkPersonelInfo").html("");
                ShowAlert("این کد پرسنلی در سیستم غیرفعال است !");
            }
            else if (data[1] == "1") {
                $.each(data[0], function (index) {
                    row = mainrow.replaceAll("{Name}", this['strPersonelName']);
                    row = row.replaceAll("{datestart}", this['dateStartContractDate']);
                    row = row.replaceAll("{dateEnd}", this['dateEndContractDate']);
                    row = row.replaceAll("{dateCut}", "<input id='pcaldateCutWorkDate{Row}' type='text'  class='InputTextRightToLeftText pdate' value='' style='width:60px;'/>");//value='" + this['dateCutWorkDate'] + "' />");
                    row = row.replaceAll("{workgroup}", this["strWorkGroupName"]);
                    row = row.replaceAll("{personelCode}", this['numPersonelCode']);
                    row = row.replaceAll("{contractCode}", this['StrContractUniqCode']);
                    row = row.replaceAll("{pricesier}", "<input id='txtPriceSaierCutWork{Row}' type='text'  class='InputTextLeftToRightText' value='0' style='width:65px;' />");
                    row = row.replaceAll("{descsaier}", "<input id='txtDescSaierCutWork{Row}' type='text'  class='InputTextLeftToRightText' value='' style='width:100px;' />");
                    row = row.replaceAll("{Eidi}", "<input id='ChkEidiCutWork{Row}' type='checkbox'  />");
                    row = row.replaceAll("{karkard}", "<font style='color:red;'>" + this["monthkarkard"] + "</font>");
                    row = row.replaceAll("{contractkind}", this['strContractKindName']);
                    
                    row = row.replaceAll("{Row}", i);
                    i++;
                    allrow = allrow + row;
                    t = 1;
                    personelRowCutwork = i - 1;
                });
                if (t == 1) {
                    $("#ResultDivCutWorkPersonelInfo").html(header + header2 + allrow + footer + btn);
                    $("#ResultDivCutWorkPersonelInfo").show();
                    // $("#btnSaveCutworkForPersonel").button();
                    $("#btnTasviehPersonel").button();

                    for (var j = 1; j <= personelRowCutwork; j++) {
                        var objCal122 = new AMIB.persianCalendar('pcaldateCutWorkDate' + j.toString(), {
                            extraInputID: 'pcaldateCutWorkDate' + j.toString(),
                            extraInputFormat: 'yyyy/mm/dd'
                        });

                        $("#txtPriceSaierCutWork" + j.toString()).keyup(function () { _Amount_onkeyup(this) });
                    }

                }
                else {
                    $("#ResultDivCutWorkPersonelInfo").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                    $("#ResultDivCutWorkPersonelInfo").show();
                }
            }
            else if (data[1] == "2") {
                header = "<table class='MainTbl'>";
                header2 = "<thead><tr><th><input type='checkbox' id='chkAllPrintPersonelCode' checked='checked' onclick='CheckOnePersonelItemsPrint(1);'/></th><th width='50px'>ردیف</th><th style='display:none;'>کد</th><th>سال</th><th>ماه</th><th>کد پرسنلی</th><th>نام و نام خانوادگی</th><th>کارکرد مورد محاسبه</th><th>نوع قرارداد</th><th>تاریخ شروع قرارداد</th><th>تاریخ قطع همکاری</th><th>مبلغ نهایی تسویه (ریال)</th></tr></thead><tbody>";
                mainrow = "<tr id='trCutWorkPersonelRowpre{Row}'><td>{Check}</td><td>{Row}</td><td style='display:none;' id='tdcodepreinvoice{Row}'>{code}</td><td>{sal}</td><td>{mah}</td><td id='tdPersonelCodeforCutWorkpre{Row}'>{personelCode}</td><td>{Name}</td><td>{karkard}</td><td>{contractkind}</td><td>{datestart}</td><td>{dateCut}</td><td>{pricetasvieh}</td></tr>";
                footer = "</tbody></table>";
                btn = "<div style='text-align:center;padding:10px 0;'>" +
                      "<input id='btndelTasviehPersonel' type='button' value='حذف محاسبه' onclick='showPrintTasviehHesabPersonelCutWork(" + personelcode + ",3);' style='margin-left:55px;'/>" +
                      "<input id='btnreclacTasviehPersonel' type='button' value='محاسبه مجدد' onclick='showPrintTasviehHesabPersonelCutWork(" + personelcode + ",2);' style='margin-left:55px;'/>" +
                      "<input id='btnprintTasviehPersonel' type='button' value='پرینت فرم قطع همکاری' onclick='printGhateHamkari(" + personelcode + ");' style='margin-left:55px;'/>" +
                      "<input id='btnSaveCutworkForPersonel' type='button' value='ثبت نهایی قطع همکاری' onclick='SaveCutWorkForPersonel();' />" +
                      "</div>";

                $.each(data[0], function (index) {
                    row = mainrow.replaceAll("{Name}", this['personelname']);
                    row = row.replaceAll("{Check}", "<input type='checkbox' id='chkOnePrintPersonelCode{Row}' onclick='CheckOnePersonelItemsPrint(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{datestart}", this['dateStartContractDate']);
                    row = row.replaceAll("{dateCut}", this['dateCutWorkDate']);
                    row = row.replaceAll("{personelCode}", this['numPersonelCode']);
                    row = row.replaceAll("{karkard}", "<font style='color:red;'>" + this["monthkarkard"] + "</font>");
                    row = row.replaceAll("{code}", this['numInvoiceCode']);
                    row = row.replaceAll("{sal}", this['strInvoiceYear']);
                    row = row.replaceAll("{mah}", this['monthname']);
                    row = row.replaceAll("{pricetasvieh}", addCommas(this['numPriceCalcHoghoghKhales']));
                    row = row.replaceAll("{contractkind}", this['strContractKindName']);

                    row = row.replaceAll("{Row}", i);
                    i++;
                    allrow = allrow + row;
                    t = 1;
                    personelRowCutwork = i - 1;
                });
                if (t == 1) {
                    $("#ResultDivCutWorkPersonelInfo").html(header + header2 + allrow + footer + btn);
                    $("#ResultDivCutWorkPersonelInfo").show();
                    $("#btnSaveCutworkForPersonel,#btnreclacTasviehPersonel,#btnprintTasviehPersonel,#btndelTasviehPersonel").button();
                }
                else {
                    $("#ResultDivCutWorkPersonelInfo").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                    $("#ResultDivCutWorkPersonelInfo").show();
                }
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            $("#ResultDivCutWorkPersonelInfo").hide();
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
        }
    });
}
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsPrint(type, row) {
    if (type == 1) {
        for (var i = 1; i <= personelRowCutwork; i++) {
            if ($("#chkAllPrintPersonelCode").attr("checked"))
                $("#chkOnePrintPersonelCode" + i).attr("checked", "checked");
            else
                $("#chkOnePrintPersonelCode" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPrintPersonelCode").removeAttr("checked");
    }
}
//---------------------------------------------------------------------------------
function printGhateHamkari() {
    for (var i = 1; i <= personelRowCutwork; i++) {
        var personelcode = $("#tdPersonelCodeforCutWorkpre" + i).html().trim();
    }

    window.open('PeikFactor.aspx?ofcutwork=' + personelcode, '_blank');
}
//-----------------------------------ثبت تاریخ برای قطع همکاری-----------------------------------
function SaveCutWorkForPersonel() {
    //var strtemp = "";
    //var checkValue = 0;
    //var personelcode = 0;
    //var SaierPrice = 0;
    //var date = "", datestart = "", dateEnd = "";
    //var checkValue2 = 0, checkValue3 = 0;
    //for (var i = 1; i <= personelRowCutwork; i++) {
    //    if ($("#pcaldateCutWorkDate" + i.toString()).val() != null && $("#pcaldateCutWorkDate" + i.toString()).val() != undefined && $("#pcaldateCutWorkDate" + i.toString()).val() != ""
    //        && $("#txtPriceSaierCutWork" + i.toString()).val() != "" && parseInt($("#txtPriceSaierCutWork" + i.toString()).val().replaceAll(",", "")) >= 0
    //        && $("#txtDescSaierCutWork" + i.toString()).val() != null && $("#txtDescSaierCutWork" + i.toString()).val() != undefined && $("#txtDescSaierCutWork" + i.toString()).val() != "") {
    //        // if ($("#pcaldateCutWorkDate" + i.toString()).val() == "") 

    //        if ($("#dateend" + i.toString()).html() >= $("#pcaldateCutWorkDate" + i.toString()).val() && $("#datestart" + i.toString()).html() <= $("#pcaldateCutWorkDate" + i.toString()).val()) {
    //            SaierPrice = $("#txtPriceSaierCutWork" + i.toString()).val();
    //            SaierPrice = parseInt(SaierPrice.replaceAll(",", ""));

    //            strtemp = strtemp + $.trim($("#tdPersonelCodeforCutWork" + i.toString()).html()) + "^" + $("#pcaldateCutWorkDate" + i.toString()).val() + "^" + SaierPrice + "^" + $("#txtDescSaierCutWork" + i.toString()).val() + "^" + $("#ChkEidiCutWork" + i.toString()).prop("checked") + ",";
    //            personelcode = $.trim($("#tdPersonelCodeforCutWork" + i.toString()).html());
    //            date = $("#pcaldateCutWorkDate" + i.toString()).val();
    //            datestart = $("#datestart" + i.toString()).html();
    //            dateEnd = $("#dateend" + i.toString()).html();
    //        }
    //        else if ($("#dateend" + i.toString()).html() < $("#pcaldateCutWorkDate" + i.toString()).val() && $("#datestart" + i.toString()).html() <= $("#pcaldateCutWorkDate" + i.toString()).val()) {
    //            checkValue2 = 1;

    //        }
    //        else if ($("#dateend" + i.toString()).html() >= $("#pcaldateCutWorkDate" + i.toString()).val() && $("#datestart" + i.toString()).html() > $("#pcaldateCutWorkDate" + i.toString()).val()) {
    //            checkValue3 = 1;
    //        }
    //    }
    //    else {
    //        checkValue = 1;
    //    }
    //}

    //if (checkValue == 1) {
    //    ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید !");
    //    return;
    //}
    //else if (checkValue2 == 1) {
    //    ShowAlert("تاریخ قطع همکاری از تاریخ پایان قرارداد بزرگتر می باشد !");
    //    return;
    //}
    //else if (checkValue3 == 1) {
    //    ShowAlert("تاریخ قطع همکاری از تاریخ شروع قرارداد کوچکتر می باشد !");
    //    return;
    //}
    //$.ajax({
    //    type: "POST",
    //    async: true,
    //    cache: false,
    //    dataType: "json",
    //    data: { i: 3, personelcode: personelcode, datestart: datestart, dateEnd: dateEnd, datecut: date },
    //    url: "PostBack/PBContractCutWork.ashx",
    //    success: function (data) {
    //        if (data == 1) {
                if (confirm("با ثبت نهایی قطع همکاری اطلاعات مالی آن در سابقه واریز ذخیره می گردد.\nآیا از ثبت نهایی قطع همکاری این پرسنل اطمینان دارید ؟")) {
                    $("#Loading").fadeIn();
                    $("#CheckOut").fadeIn();
                    var code = "";
                    for (var i = 1; i <= personelRowCutwork; i++) {
                        code = code + $("#tdcodepreinvoice" + i).html().trim() + "," + $("#tdPersonelCodeforCutWorkpre" + i).html().trim() + "^";
                    }

                    $.ajax({
                        type: "POST",
                        async: true,
                        cache: false,
                        dataType: "json",
                        data: { i: 1, code: code },
                        url: "PostBack/PBContractCutWork.ashx",
                        success: function (data) {
                            $("#Loading").fadeOut();
                            $("#CheckOut").fadeOut();
                            if (data == '1') {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                SearchGetPersonelInfoCutWork();
                            }
                            else if (data == '2') {
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
    //        }
    //        else if (data == 2)
    //            ShowAlert("لطفا کارکرد ماهیانه را آپلود نمایید!");
    //        else if (data == 3)
    //            ShowAlert("لطفا تاریخ قطع همکاری را بین بازه شروع و پایان قرارداد انتخاب نمایید !");
    //        else if (data == 4)
    //            ShowAlert("لطفا بازه تاریخی قطع همکاری را در ماه کارکرد ماهیانه ای که آپلود کرده اید مشخص نمایید !");
    //        else if(data==5)
    //            ShowAlert("خطا در ثبت مجددا تلاش نمایید !");

    //    },
    //    error: function (xhr, textStatus, errorThrown) {
    //        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
    //    }
    //});

}
//-----------------------------------فرم تسویه حساب برای قطع همکاری-----------------------------------
function showPrintTasviehHesabPersonelCutWork(personelcodemain, type) {
    //type=1 pish sabt
    //type=2 mohasebe mojadad
    var checkValue = 0;
    var checkValue2 = 0, checkValue3 = 0;
    var date = "", datestart = "", dateEnd = "";
    var strtemp = "";
    var SaierPrice = 0;
    if (type == 1) {
        //var personelcode = 0;
        for (var i = 1; i <= personelRowCutwork; i++) {

            if ($("#pcaldateCutWorkDate" + i.toString()).val() != null && $("#pcaldateCutWorkDate" + i.toString()).val() != undefined && $("#pcaldateCutWorkDate" + i.toString()).val() != ""
                && $("#txtPriceSaierCutWork" + i.toString()).val() != "" && parseInt($("#txtPriceSaierCutWork" + i.toString()).val().replaceAll(",", "")) >= 0
                && $("#txtDescSaierCutWork" + i.toString()).val() != null && $("#txtDescSaierCutWork" + i.toString()).val() != undefined && $("#txtDescSaierCutWork" + i.toString()).val() != "") {
                // alert($.trim($("#pcaldateCutWorkDate" + i.toString()).val()));
                //if ($.trim($("#pcaldateCutWorkDate" + i.toString()).val()) == "") checkValue = 1;
                // else {

                if ($("#dateend" + i.toString()).html() >= $("#pcaldateCutWorkDate" + i.toString()).val() && $("#datestart" + i.toString()).html() <= $("#pcaldateCutWorkDate" + i.toString()).val()) {

                    SaierPrice = $("#txtPriceSaierCutWork" + i.toString()).val();
                    SaierPrice = parseInt(SaierPrice.replaceAll(",", ""));

                    strtemp = strtemp + $.trim($("#tdPersonelCodeforCutWork" + i.toString()).html()) + "^" + $("#pcaldateCutWorkDate" + i.toString()).val() + "^" + SaierPrice + "^" + $("#txtDescSaierCutWork" + i.toString()).val() + "^" + $("#ChkEidiCutWork" + i.toString()).prop("checked") + "^" + $("#salmali").html().trim() + ",";
                    personelcodemain = $.trim($("#tdPersonelCodeforCutWork" + i.toString()).html());
                    date = $("#pcaldateCutWorkDate" + i.toString()).val();
                    datestart = $("#datestart" + i.toString()).html();
                    dateEnd = $("#dateend" + i.toString()).html();
                }
                else if ($("#dateend" + i.toString()).html() < $("#pcaldateCutWorkDate" + i.toString()).val() && $("#datestart" + i.toString()).html() <= $("#pcaldateCutWorkDate" + i.toString()).val()) {
                    checkValue2 = 1;
                }
                else if ($("#dateend" + i.toString()).html() >= $("#pcaldateCutWorkDate" + i.toString()).val() && $("#datestart" + i.toString()).html() > $("#pcaldateCutWorkDate" + i.toString()).val()) {
                    checkValue3 = 1;
                }
            }
            else {
                checkValue = 1;
            }
        }
    }

    if (checkValue == 1) {
        ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید !");
        return;
    }
    else if (checkValue2 == 1) {
        ShowAlert("تاریخ قطع همکاری از تاریخ پایان قرارداد بزرگتر می باشد !");
        return;
    }
    else if (checkValue3 == 1) {
        ShowAlert("تاریخ قطع همکاری از تاریخ شروع قرارداد کوچکتر می باشد !");
        return;
    }
    else {

        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 3, personelcode: personelcodemain, datestart: datestart, dateEnd: dateEnd, datecut: date, strtemp: strtemp, type: type },
            url: "PostBack/PBContractCutWork.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();
                if (data == 1) {
                    SearchGetPersonelInfoCutWork();
                    if (type == "1") window.open('PeikFactor.aspx?ofcutwork=' + personelcodemain, '_blank');
                }
                else if (data == 2)
                    ShowAlert("لطفا کارکرد ماهیانه را محاسبه نمایید!");
                else if (data == 3)
                    ShowAlert("لطفا تاریخ قطع همکاری را بین بازه شروع و پایان قرارداد انتخاب نمایید !");
                else if (data == 4)
                    ShowAlert("لطفا بازه تاریخی قطع همکاری را در ماه کارکرد ماهیانه ای که محاسبه کرده اید مشخص نمایید !");
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });



    }

}

//---------------------------------------------------------------------------------
///=========================== گزارش اطلاعات پرسنل ================================
//---------------------------------------------------------------------------------
function GetReportInfoPersonel(vpage) {

    var personelcode = $.trim($("#txtReportPersonelCode").val());
    var name = $.trim($("#txtReportPersonelName").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCode").val());
    var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
    var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();

    var Employer = $.trim($("#drpdwnSearchEmployer").val());
    var ContractKind = $.trim($("#drpdwnSearchContractKind").val());

    var checkCutwork = $("#chkIsCutwork").attr("checked");
    if (checkCutwork == "checked") checkCutwork = 1;
    else checkCutwork = 0;

    var grohkari = $.trim($("#drpdwnWorkGroupPersonelContract").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkGroupPersonelContract").val() + "\"";

    var rows = $.trim($("#drpdwnShowRow").val());

    $("#ResultDivPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonel").show();
    var header = "<table  id='tblcutWorkInfoAll' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    //var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th align='center'>شماره شناسنامه</th><th align='center'>تاریخ تولد</th><th>وضعیت تاهل</th><th>کارفرما</th><th>نوع قرارداد</th><th>تاریخ ثبت</th><th>فایل قرارداد</th></thead><tbody>";
    //var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{fathername}</td><td>{mellicode}</td><td>{shsh}</td><td>{datebrithday}</td><td>{marrid}</td><td>{employer}</td><td>{contract}</td><td>{dateRegister}</td><td>{img}</td></tr>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th>تاریخ شروع قرارداد</th><th>تاریخ قطع همکاری</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th><th align='center'>کد ملی</th><th>کارفرما</th><th>نوع قرارداد</th><th>وضعیت فعلی پرسنل</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{datestartContract}</td><td>{dateCutwork}</td><td>{personelcode}</td><td>{name}</td><td>{workgroup}</td><td>{mellicode}</td><td>{employer}</td><td>{contract}</td><td id='tdstatus{mellicode}'>{status}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportInfoPersonel(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportInfoPersonel({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelPersonel' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblcutWorkInfoAll\"); return false;'/></div>";

    var row = ""; var allrow = ""; var AllRecordCount;
    var vperpage = rows == "-1" ? "9000000" : rows;

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
        data: { i: 5,checkCutwork:checkCutwork, personelcode: personelcode, grohkari: grohkari, Employer: Employer, ContractKind: ContractKind, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, page: vpage, perpage: vperpage },
        url: "PostBack/PBContractCutWork.ashx",
        success: function (data) {
            var isvalid = 0;
            AllRecordCount = data[1];
            isvalid = data[2];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{datestartContract}", $.trim(this['dateStartContractDate']));
                row = row.replaceAll("{employer}", $.trim(this['strEmployerName']));
                row = row.replaceAll("{contract}", $.trim(this['strContractKindName']));
                row = row.replaceAll("{dateCutwork}", $.trim(this['dateCutWorkDate']));
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{status}", this['numStatus'] == "0" ? "قرارداد تایید نشده" : this['numStatus'] == "1" ? "نیمه فعال" : this['numStatus'] == "2" ? "فعال" : this['numStatus'] == "3" ? "قطع همکاری" : this['numStatus'] == "4" ? "معلق" : "-");
                row = row.replaceAll("{workgroup}", this['strWorkGroupName'] == null ? "نامشخص" : this['strWorkGroupName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{contractcode}", this['numContractCode']);
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportInfoPersonel(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportInfoPersonel(" + nextPage + ")");
            }
            if (t == 1) {

                header2 = header2.replaceAll("{style}", isvalid == 1 ? "" : " style='display:none;'");

                $("#ResultDivPersonel").html(header + header2 + allrow + footer + footerPager + endfooter + btnExcel);
                $("#divAllRecordCountPersonel").html(allpage);
                $("#btnExcelPersonel").button();

            }
            else {
                $("#ResultDivPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonel").html("");
            $("#ResultDivPersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
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