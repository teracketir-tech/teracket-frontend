$(document).ready(function () {

    $("#divPersonelTabs").tabs();
    GetTabsDeActive("divPersonelTabs");

    $("#monthlblDateEidi").hide();
    $("#daylblDateEidi").hide();

    $("#monthlblDateMorakhasi").hide();
    $("#daylblDateMorakhasi").hide();

    $("#btnReportReportPricePersonelSearch").click(function () { rptPersonelEidi(1); return false; });
    $("#btnPersonelPreInvoiceSearch").click(function () { GetAllPreEidi(); return false; });
    $("#btnPersonelGetAllInvoiceSearch").click(function () { ShowAllFinalEidi(1); return false; });

    $("#btnReportReportPricePersonelSearchMorakhsi").click(function () { rptPersonelMorakhasi(1); return false; });

    $("#btnPersonelPreInvoiceSearchMorakhsi").click(function () { GetAllPreMorakhasi(); return false; });
    $("#btnPersonelGetAllInvoiceSearchMorakhsi").click(function () { ShowAllFinalMorakhasi(1); return false; });


    GetDrpdwnBaseAll();
});
//============================================================================
//============================================================================
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
var drpdwnWorkJobKind = "";
var drpdwnContractKinds = "";
//============================================================================
//============================================================================
function GetDrpdwnBaseAll() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    drpdwnWorkJobKind = "";
    drpdwnContractKinds = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            drpdwnWorkJobKind = data[0];
            drpdwnContractKinds = data[1];
            ShowDrpDwnInPage(1);
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//=================================================================================
function ShowDrpDwnInPage(type) {
    selectStart = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:176px;'>";
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;'>";
    selectStart2 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' multiple='multiple' size='5'>";
    selectStart3 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' >";
    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}'>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (type == 1) {
        //--------------------------------------------------------------------------
        //--------------------- workgroup -------------------------------------------
        allrow = "";
        $.each(drpdwnWorkJobKind, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnWorkReportPriceJobKind");
        $("#tddrpdwnWorkReportPriceJobKind").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkReportPriceJobKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnWorkReportPriceJobKindMorakhsi");
        $("#tddrpdwnWorkReportPriceJobKindMorakhsi").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkReportPriceJobKindMorakhsi").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });


        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------- ContractKinds -------------------------------------------
        allrow = "";
        $.each(drpdwnContractKinds, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnContractKind");
        $("#divdrpdwnContractKind").html(selectTemp + option0 + allrow + selectEnd);
        $("#drpdwnContractKind").val("1");

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnContractKindMorakhsi");
        $("#divdrpdwnContractKindMorakhsi").html(selectTemp + option0 + allrow + selectEnd);

        $("#drpdwnContractKindMorakhsi").val("1");
    }

    CheckPreEidi();
    CheckPreMorakhasi();
}
//---------------------------------------------------------------------------------
///=========================== محاسبه عیدی =======================================
//---------------------------------------------------------------------------------
var InvoiceFileRow = 0;
var ItemSearch = "";
var _GLevel = 1;
function rptPersonelEidi(vpage) {
    $("#ResultDivReportPricePersonel2").html("");
    $("#ResultDivReportPricePersonel2").hide();
    _GLevel = 1;
    $("#titleSortHoghogh").html("* مرتب سازی براساس ، کد پرسنلی می باشد");
    InvoiceFileRow = 0;
    ItemSearch = "";
    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";
    var rows = $.trim($("#drpdwnShowRow").val());
    var date = $.trim($("#yearlblDateEidi").val());
    var level = $.trim($("#drpdwnvarizLevel").val());
    _GLevel = level;
    ItemSearch = date + "^" + contractkindCheck;

    $("#ResultDivReportPricePersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonel").show();
    var header = "<table id='tblVarizEidi1' class='MainTbl' style='border-collapse: collapse;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCodeEidi' checked='checked' onclick='CheckOnePersonelItemsEidi(1);'/></th>" +
                   "<th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                   "<th align='center'>نوع قرارداد</th><th align='center'>گروه کاری</th><th align='center'>تعداد روز کارکرد</th><th align='center'>حقوق ثابت (ریال)</th>" +
                   "<th align='center'>عیدی یک روز (ریال)</th><th align='center'>واریز به صورت</th><th align='center'>مجموع پرداختی عیدی (ریال)</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdPersonelCodeHoghoghEidi{Row}'>{personelcode}</td><td>{name}</td>" +
                   "<td>{contract}</td><td>{workGroup}</td><td>{cntrozkarkard}</td><td>{hoghoghsabet}</td><td>{eidi}</td><td>{level}</td><td>{sumeidi}</td>" +
                   "</tr>";

    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv' style='!important;'><div class='pageritem'><a onclick='rptPersonelEidi(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPricePPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPricePersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptPersonelEidi({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table>";
    var sum = "<tr><td colspan=10 align='left'>مجموع :</td><td>{sum}</td></tr>";
    var btnpreSave = "<div style='padding:10px 0;'><input id='btnPreSaveEidi' type='button' value='پیش ثبت' onclick='preSaveEidi(); return false;'/></div>";
    //var btnExcel = "<input id='btnExcelEidi' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblVarizEidi1\"); return false;'/>";
    var row = ""; var allrow = ""; var AllRecordCount;
    var vperpage = rows == "-1" ? "9000000" : rows;

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
        data: { i: 2, level: level, personelcode: personelcode, contractkind: contractkind, name: name, date: date, mellicode: mellicode, grohkari: grohkari, page: vpage, perpage: vperpage },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            var sumeidi = 0;
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                if (parseInt(this['eidiAndrozkarkard'].split('^')[0]) > 0) {
                    row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCodeEidi{Row}' onclick='CheckOnePersonelItemsEidi(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{name}", this['strPersonelName']);
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{cntrozkarkard}", addCommas(this['eidiAndrozkarkard'].split('^')[1]));
                    row = row.replaceAll("{hoghoghsabet}", (this['numContractKindRef'] == 2 || this['numContractKindRef'] == 3) && parseInt(this['eidiAndrozkarkard'].split('^')[0]) > 0 ? addCommas(this['eidiAndrozkarkard'].split('^')[2]) : addCommas(this['hoghoghSabet']));
                    row = row.replaceAll("{eidi}", (this['numContractKindRef'] == 2 || this['numContractKindRef'] == 3) && parseInt(this['eidiAndrozkarkard'].split('^')[0]) > 0 ? addCommas(Math.round(parseInt(this['eidiAndrozkarkard'].split('^')[2]) / 365)) : addCommas(Math.round(this['eidiYekroz'])));
                    row = row.replaceAll("{sumeidi}", addCommas(Math.round(this['eidiAndrozkarkard'].split('^')[0])));
                    row = row.replaceAll("{contract}", this['strContractKindName']);
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{level}", this['level']);

                    row = row.replaceAll("{Row}", i);
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFileRow = i - 1;
                    sumeidi = sumeidi + parseInt(Math.round(this['eidiAndrozkarkard'].split('^')[0]));
                }
            });

            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptPersonelEidi(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptPersonelEidi(" + nextPage + ")");
            }
            if (t == 1) {

                sum = sum.replaceAll("{sum}", addCommas(sumeidi) + " ریال");
                $("#ResultDivReportPricePersonel").html(header + header2 + allrow + sum + footer + endfooter + btnpreSave);
                $("#divAllRecordCountPricePersonel").html(allpage);
                $("#btnPreSaveEidi").button();
            }
            else {
                $("#ResultDivReportPricePersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonel").html("");
            $("#ResultDivReportPricePersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//----------------------------------پیش ثبت عیدی----------------------------------
//---------------------------------------------------------------------------------
function preSaveEidi() {
    var PersonelCodeTemp = "";
    for (var i = 1; i <= InvoiceFileRow; i++) {
        if ($("#chkOnePersonelCodeEidi" + i).attr("checked"))
            PersonelCodeTemp = PersonelCodeTemp + $.trim($("#tdPersonelCodeHoghoghEidi" + i).html()) + ","
    }
    if ($.trim(PersonelCodeTemp) == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;
    }
    else {
        $("#Note").html("آیا از پیش ثبت محاسبه عیدی آخر سال اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "پیش ثبت محاسبه عیدی",
            width: 380,
            dialogClass: 'RightToLeftText',
            closeOnEscape: true,
            buttons: {
                "خیر": function () {
                    $(this).focus();
                    $(this).dialog("close");
                },
                "بله": function () {
                    $("#CheckOut").fadeIn();
                    $("#Loading").fadeIn();
                    $(this).dialog("close");
                    $.ajax({
                        type: "POST",
                        async: true,
                        cache: false,
                        dataType: "json",
                        data: { i: 4, Level: _GLevel, PersonelCodeTemp: PersonelCodeTemp, ItemSearch: ItemSearch },
                        url: "PostBack/PBEndYears.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#btnPersonelPreInvoiceSearch").show();
                                rptPersonelEidi(1);
                            }
                            else if (data == "3") {
                                ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                        }
                    });

                }
            }
        });
        $("#Note").dialog("open");
    }
}
//---------------------------------------------------------------------------------
///=========================== چک و نمایش مشاهده آخرین بررسی عیدی================
//---------------------------------------------------------------------------------
function CheckPreEidi() {
    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";
    var rows = $.trim($("#drpdwnShowRow").val());
    var date = $.trim($("#yearlblDateEidi").val());


    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 5, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, year: date },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            if (parseInt(data) > 0)
                $("#btnPersonelPreInvoiceSearch").show();
            else {
                $("#btnPersonelPreInvoiceSearch").hide();
                $("#ResultDivReportPricePersonel").html("");
                $("#ResultDivReportPricePersonel").hide();
                $("#ResultDivReportPricePersonel2").html("");
                $("#ResultDivReportPricePersonel2").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== مشاهده گزارش آخرین بررسی عیدی=====================
//---------------------------------------------------------------------------------
var ContractKindPublic = 0;
function GetAllPreEidi() {
    $("#ResultDivReportPricePersonel2").html("");
    var selectlevel = "<div style='width:100%;margin:5px 0;'>" +
                        "<select id='drpdwnPrevarizLevel' class='InputSelectRightToLeftText' style='width:155px;' onchange='GetAllPreEidibyDrpdwn(this.value);return false;'>" +
                        "<option value='1' selected='selected'>مرحله اول واریز</option> " +
                        "<option value='2'>مرحله دوم واریز</option>  " +
                        "<option value='3'>مرحله سوم واریز</option>  " +
                        "<option value='4'>مرحله چهارم واریز</option>" +
                        "</select></div>";

    $("#ResultDivReportPricePersonel").html(selectlevel);
    $("#ResultDivReportPricePersonel").show();
    GetAllPreEidibyDrpdwn($("#drpdwnPrevarizLevel").val());
}
//---------------------------------------------------------------------------------
function GetAllPreEidibyDrpdwn(value) {
    $("#titleSortHoghogh").html("* مرتب سازی براساس ، کد پرسنلی می باشد");
    InvoiceFileRow = 0;

    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";
    var rows = $.trim($("#drpdwnShowRow").val());
    var year = $.trim($("#yearlblDateEidi").val());

    ItemSearch = year + "^" + contractkindCheck;
    ContractKindPublic = contractkindCheck;


    $("#ResultDivReportPricePersonel2").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonel2").show();

    var header = "<table id='tblVarizEidi2' class='MainTbl' style='border-collapse: collapse;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCodeEidi' checked='checked' onclick='CheckOnePersonelItemsPrintEidi(1);'/></th>" +
                   "<th align='center' >ردیف</th><th style='display:none;'>کد</th><th align='center'>سال</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                   "<th align='center'>نوع قرارداد</th><th align='center'>گروه کاری</th><th align='center'>تعداد روز کارکرد</th><th align='center'>حقوق ثابت (ریال)</th>" +
                   "<th align='center'>عیدی یک روز (ریال)</th><th align='center'>واریز به صورت</th><th align='center'>پرداخت مرحله</th><th align='center'>مجموع پرداختی عیدی (ریال)</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdEidiCodeHoghogh{Row}' style='display:none;'>{code}</td><td>{sal}</td>" +
                   "<td id='tdPersonelCodePrintHoghoghEidi{Row}'>{personelcode}</td><td>{name}</td>" +
                   "<td>{contract}</td><td>{workGroup}</td><td>{cntrozkarkard}</td><td>{hoghoghsabet}</td><td>{eidi}</td><td>{cntlevel}</td><td>{level}</td><td>{sumeidi}</td><td>{bankname}</td><td>{numberAccount}</td>" +
                   "</tr>";
    var footer = "</tbody></table>";
    var sum = "<tr><td colspan=12 align='left'>مجموع :</td><td>{sum}</td><td></td><td></td></tr>";

    var btnpreSave = "<div style='padding:10px 0;'>";
    if (value == 1) {
        btnpreSave = btnpreSave + "<input id='btnDeleteCalcEidi' type='button' value='حذف محاسبه عیدی' onclick='DeleteClacEidi(); return false;' style='margin-left:5px;'/>" +
        "<input id='btnReCalcEidi' type='button' value='محاسبه مجدد عیدی' onclick='ReClacEidi(); return false;' style='margin-left:5px;'/>";
    }
    btnpreSave = btnpreSave + "<input id='btnPrintCalcEidi' type='button' value='لیست عیدی' onclick='printClacEidi(); return false;' style='margin-left:5px;'/>" +
    "<input id='btnExcelEidi' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblVarizEidi2\"); return false;' style='margin-left:5px;'/>" +
    "<input id='btnSaveAllCalcEidi' type='button' value='ثبت نهایی' onclick='saveAllClacEidi(); return false;' style='margin-left:5px;'/></div>";

    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 6, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, year: year, levelvariz: value },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            var sumeidi = 0;

            $.each(data, function (index) {
                row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePrintPersonelCodeEidi{Row}' onclick='chkOnePrintPersonelCodeEidi(2,{Row});' checked='checked'/>");
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{cntrozkarkard}", addCommas(this['numDayInYear']));
                row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPriceRoot']));
                row = row.replaceAll("{eidi}", addCommas(this['numPriceEidiOneDay']));
                row = row.replaceAll("{sumeidi}", addCommas(this['numPriceSettleEidiEndYear']));
                row = row.replaceAll("{contract}", this['strContractKindName']);
                row = row.replaceAll("{sal}", this['numYear']);
                row = row.replaceAll("{level}", this['level']);
                row = row.replaceAll("{cntlevel}", this['levelnumber']);
                row = row.replaceAll("{bankname}", this['strBankName']);
                row = row.replaceAll("{numberAccount}", this['strBankAccount']);

                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{code}", this['numEidiEndYearCode']);

                row = row.replaceAll("{Row}", i);
                sumeidi = sumeidi + parseInt(this['numPriceSettleEidiEndYear']);

                i = i + 1;
                allrow = allrow + row;
                t = 1;
                InvoiceFileRow = i - 1;
            });

            if (t == 1) {
                sum = sum.replaceAll("{sum}", addCommas(sumeidi) + " ریال");
                $("#ResultDivReportPricePersonel2").html(header + header2 + allrow + sum + footer + btnpreSave);
                $("#btnDeleteCalcEidi,#btnReCalcEidi,#btnPrintCalcEidi,#btnExcelEidi,#btnSaveAllCalcEidi").button();
            }
            else {
                $("#ResultDivReportPricePersonel2").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonel2").html("");
            $("#ResultDivReportPricePersonel2").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsPrintEidi(type, row) {
    if (type == 1) {
        for (var i = 1; i <= InvoiceFileRow; i++) {
            if ($("#chkAllPersonelCodeEidi").attr("checked"))
                $("#chkOnePrintPersonelCodeEidi" + i).attr("checked", "checked");
            else
                $("#chkOnePrintPersonelCodeEidi" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPersonelCodeEidi").removeAttr("checked");
    }
}
//---------------------------------------------------------------------------------
//-------------------------------------حذف پیش ثبت عیدی---------------------------
//---------------------------------------------------------------------------------
function DeleteClacEidi() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRow; i++) {
        if ($("#chkOnePrintPersonelCodeEidi" + i).attr("checked"))
            Code = Code + $.trim($("#tdEidiCodeHoghogh" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای حذف محاسبه عیدی انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند به همراه تمامی مراحل واریز (در صورت چند مرحله ای بودن واریز) ایجاد شده در سیستم حذف می شوند <br/> آیا از حذف محاسبه عیدی این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "حذف محاسبه عیدی",
        width: 380,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#CheckOut").fadeIn();
                $("#Loading").fadeIn();
                $(this).dialog("close");
                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 8, Code: Code },
                    url: "PostBack/PBEndYears.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت حذف شد");
                            CheckPreEidi();
                            GetAllPreEidi();
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در حذف اطلاعات، دوباره امتحان کنید");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    }
                });
            }
        }
    });
    $("#Note").dialog("open");
}
//---------------------------------------------------------------------------------
//-------------------------------------محاسبه مجدد پیش ثبت عیدی------------------
//---------------------------------------------------------------------------------
function ReClacEidi() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRow; i++) {
        if ($("#chkOnePrintPersonelCodeEidi" + i).attr("checked"))
            Code = Code + $.trim($("#tdEidiCodeHoghogh" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای محاسبه مجدد عیدی انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند  به همراه تمامی مراحل واریز (در صورت چند مرحله ای بودن واریز)، مجددا محاسبه عیدی می شوند <br/> آیا از محاسبه مجدد عیدی این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "محاسبه مجدد عیدی",
        width: 380,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#CheckOut").fadeIn();
                $("#Loading").fadeIn();
                $(this).dialog("close");


                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 9, Code: Code },
                    url: "PostBack/PBEndYears.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت بازگردانده شد");
                            CheckPreEidi();
                            GetAllPreEidi();
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در بازگردانی اطلاعات، دوباره امتحان کنید");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    }
                });
            }
        }
    });
    $("#Note").dialog("open");
}
//---------------------------------------------------------------------------------
//-------------------------------------لیست پیش ثبت عیدی---------------------------
//---------------------------------------------------------------------------------
function printClacEidi() {
    var PersonelCode = "";
    //alert(contractFileRow);
    for (var i = 1; i <= InvoiceFileRow; i++) {
        if ($("#chkOnePrintPersonelCodeEidi" + i).attr("checked"))
            PersonelCode = PersonelCode + $.trim($("#tdEidiCodeHoghogh" + i).html()) + ",";
    }
    if (PersonelCode != "") {
        //var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
        //grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" :  $("#drpdwnWorkReportPriceJobKind").val() ;
        window.open('PeikFactor.aspx?itemsearch=' + ItemSearch + '&ofcEidi=' + PersonelCode, '_blank');
    }
    else {
        ShowAlert("لطفا یک کد پرسنلی را برای پرینت عیدی انتخاب نمایید");
        return;
    }
}
//---------------------------------------------------------------------------------
//--------------------------ثبت نهایی پیش ثبت عیدی------------------------------
//---------------------------------------------------------------------------------
function saveAllClacEidi() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRow; i++) {
        if ($("#chkOnePrintPersonelCodeEidi" + i).attr("checked"))
            Code = Code + $.trim($("#tdEidiCodeHoghogh" + i).html()) + ",";
    }
    if (Code == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;

    }
    $("#Note").html("آیا از ثبت نهایی محاسبه عیدی آخر سال اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ثبت نهایی محاسبه عیدی",
        width: 380,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#CheckOut").fadeIn();
                $("#Loading").fadeIn();
                $(this).dialog("close");

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 7, Code: Code },
                    url: "PostBack/PBEndYears.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت ثبت شد");
                            CheckPreEidi();
                            GetAllPreEidi();
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    }
                });
            }
        }
    });
    $("#Note").dialog("open");
}
//---------------------------------------------------------------------------------
///=========================== مشاهده گزارش سابقه واریز عیدی=========================
//---------------------------------------------------------------------------------
var InvoiceFinalFileRowPrint = 0;
function ShowAllFinalEidi(vpage) {

    $("#ResultDivReportPricePersonel2").html("");
    var selectlevel = "<div style='width:100%;margin:5px 0;'>" +
                      "<select id='drpdwnsabeghevarizLevel' class='InputSelectRightToLeftText' style='width:155px;' onchange='ShowAllFinalEidibyDrpdwn(this.value,1);return false;'>" +
                      "<option value='0' selected='selected'>همه مراحل واریز</option> " +
                      "<option value='1' >مرحله اول واریز</option> " +
                      "<option value='2'>مرحله دوم واریز</option>  " +
                      "<option value='3'>مرحله سوم واریز</option>  " +
                      "<option value='4'>مرحله چهارم واریز</option>" +
                      "</select></div>";

    $("#ResultDivReportPricePersonel").html(selectlevel);
    $("#ResultDivReportPricePersonel").show();
    ShowAllFinalEidibyDrpdwn($("#drpdwnsabeghevarizLevel").val(), vpage);

}
//---------------------------------------------------------------------------------
function ShowAllFinalEidibyDrpdwn(value, vpage) {

    $("#titleSortHoghogh").html("* مرتب سازی براساس ، تاریخ تایید تسویه حساب عیدی می باشد");

    InvoiceFinalFileRowPrint = 0;

    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";
    var rows = $.trim($("#drpdwnShowRow").val());
    var year = $.trim($("#yearlblDateEidi").val());

    ItemSearch = year + "^" + contractkindCheck;

    $("#ResultDivReportPricePersonel2").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonel2").show();


    var header = "<table id='tblVarizEidi3' class='MainTbl' style='border-collapse: collapse;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr>" +
                   "<th align='center' width='50px'>ردیف</th><th align='center'>تاریخ تایید</th><th align='center'>سال</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                   "<th align='center'>نوع قرارداد</th><th align='center'>گروه کاری</th><th align='center'>تعداد روز کارکرد</th><th align='center'>حقوق ثابت (ریال)</th>" +
                   "<th align='center'>عیدی یک روز (ریال)</th><th align='center'>واریز به صورت</th><th align='center'>پرداخت مرحله</th><th align='center'>مجموع پرداختی عیدی (ریال)</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th>وضعیت</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{date}</td><td>{sal}</td>" +
                   "<td >{personelcode}</td><td>{name}</td>" +
                   "<td>{contract}</td><td>{workGroup}</td><td>{cntrozkarkard}</td><td>{hoghoghsabet}</td><td>{eidi}</td><td>{cntlevel}</td><td>{level}</td><td>{sumeidi}</td><td>{bankname}</td><td>{numberAccount}</td><td>{status}</td>" +
                   "</tr>";
    var footer = "</tbody></table>";
    var sum = "<tr><td colspan=12 align='left'>مجموع :</td><td>{sum}</td><td></td><td></td><td></td></tr>";

    var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelEidiFinal' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblVarizEidi3\"); return false;' style='margin-left:5px;'/></div>";

    var footerPager = "<div><div class='pagerdiv' ><div class='pageritem'><a onclick='ShowAllFinalEidi(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPriceAllFinal' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountAllFinalPersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='ShowAllFinalEidi({lastpage})'>" +
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
        data: { i: 10, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, year: year, page: vpage, perpage: vperpage, levelvariz: value },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var sumeidi = 0;

            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{cntrozkarkard}", addCommas(this['numDayInYear']));
                row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPriceRoot']));
                row = row.replaceAll("{eidi}", addCommas(this['numPriceEidiOneDay']));
                row = row.replaceAll("{sumeidi}", addCommas(this['numPriceSettleEidiEndYear']));
                row = row.replaceAll("{contract}", this['strContractKindName']);
                row = row.replaceAll("{sal}", this['numYear']);
                row = row.replaceAll("{level}", this['level']);
                row = row.replaceAll("{cntlevel}", this['levelnumber']);
                row = row.replaceAll("{bankname}", this['strBankName']);
                row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{date}", this['dateVerifiDate']);
                row = row.replaceAll("{status}", this['strstatus']);
                row = row.replaceAll("{Row}", i);
                sumeidi = sumeidi + parseInt(this['numPriceSettleEidiEndYear']);

                i = i + 1;
                allrow = allrow + row;
                t = 1;
                InvoiceFileRow = i - 1;
            });

            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "ShowAllFinalEidi(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "ShowAllFinalEidi(" + nextPage + ")");
            }
            if (t == 1) {
                sum = sum.replaceAll("{sum}", addCommas(sumeidi) + " ریال");
                $("#ResultDivReportPricePersonel2").html(header + header2 + allrow + sum + footer + footerPager + btnExcel);
                $("#divAllRecordCountAllFinalPersonel").html(allpage);
                $("#btnExcelEidiFinal").button();
            }
            else {
                $("#ResultDivReportPricePersonel2").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonel2").html("");
            $("#ResultDivReportPricePersonel2").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsEidi(type, row) {
    if (type == 1) {
        for (var i = 1; i <= InvoiceFileRow; i++) {
            if ($("#chkAllPersonelCodeEidi").attr("checked"))
                $("#chkOnePersonelCodeEidi" + i).attr("checked", "checked");
            else
                $("#chkOnePersonelCodeEidi" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPersonelCodeEidi").removeAttr("checked");
    }
}
//---------------------------------------------------------------------------------
///=========================== محاسبه مرخصی =======================================
//---------------------------------------------------------------------------------
var InvoiceFileRowMorakhasi = 0;
var ItemSearchMorakhasi = "";
function rptPersonelMorakhasi(vpage) {
    $("#titleSortHoghoghMorakhsi").html("* مرتب سازی براساس ، کد پرسنلی می باشد");

    InvoiceFileRowMorakhasi = 0;
    ItemSearchMorakhasi = "";

    var personelcode = $.trim($("#txtReportPricePersonelCodeMorakhsi").val());
    var name = $.trim($("#txtReportPricePersonelNameMorakhsi").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCodeMorakhsi").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKindMorakhsi").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKindMorakhsi").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKindMorakhsi").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKindMorakhsi").val() + "\"";
    var rows = $.trim($("#drpdwnShowRowMorakhsi").val());
    var year = $.trim($("#yearlblDateMorakhasi").val());

    ItemSearchMorakhasi = year + "^" + contractkindCheck;

    $("#ResultDivReportPricePersonelMorakhsi").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonelMorakhsi").show();
    var header = "<table id='tblVarizMorakhsi1' class='MainTbl' style='border-collapse: collapse;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCodeMorakhasi' checked='checked' onclick='CheckOnePersonelItemsMorakhasi(1);'/></th>" +
                   "<th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                   "<th align='center'>نوع قرارداد</th><th align='center'>گروه کاری</th><th align='center'>تعداد روز مرخصی در سال</th><th align='center'>تعداد روز مرخصی رفته</th><th align='center'>تعداد روز مانده مرخصی</th>" +
                   "<th align='center'>تعداد روز قابل پرداخت (سال جاری)</th><th align='center'>تعداد روز محاسبه (سال جاری)</th><th align='center'>بر حسب حقوق (ریال)</th><th align='center'>مجموع پرداختی مرخصی (ریال)</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdPersonelCodeHoghoghMOrakhasi{Row}'>{personelcode}</td><td>{name}</td>" +
                   "<td>{contract}</td><td>{workGroup}</td><td>{cntrozMorakhsisal}</td><td>{cntrozMorakhsi}</td><td>{mandemorakhasi}</td>" +
                   "<td>{morakhasighabelpardakht}</td><td>{morakhasiMohasebe}</td><td>{hoghoghsabet}</td><td>{summorakhasi}</td>" +
                   "</tr>";

    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv' style='!important;'><div class='pageritem'><a onclick='rptPersonelMorakhasi(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPricePPersonelMorakhsi' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPricePersonelMorakhsi' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptPersonelMorakhasi({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table>";
    var sum = "<tr><td colspan=12 align='left'>مجموع :</td><td>{sum}</td></tr>";
    var btnpreSave = "<div style='padding:10px 0;'><input id='btnPreSaveMorakhasi' type='button' value='پیش ثبت' onclick='preSaveMorakhasi(); return false;'/></div>";


    var row = ""; var allrow = ""; var AllRecordCount;
    var vperpage = rows == "-1" ? "9000000" : rows;

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
        data: { i: 3, personelcode: personelcode, contractkind: contractkind, name: name, date: year, mellicode: mellicode, grohkari: grohkari, page: vpage, perpage: vperpage },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            var sumMorakhasi = 0;
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                if (parseInt(this['morakhasiAndRozKarkardAndPrice'].split('^')[5]) != 0) {
                    row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCodeMorakhasi{Row}' onclick='CheckOnePersonelItemsMorakhasi(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{name}", this['strPersonelName']);
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{cntrozMorakhsisal}", addCommas(this['morakhasiAndRozKarkardAndPrice'].split('^')[0]));
                    row = row.replaceAll("{cntrozMorakhsi}", addCommas(this['morakhasiAndRozKarkardAndPrice'].split('^')[1]));
                    row = row.replaceAll("{mandemorakhasi}", addCommas(this['morakhasiAndRozKarkardAndPrice'].split('^')[2]));
                    row = row.replaceAll("{morakhasighabelpardakht}", addCommas(this['morakhasiAndRozKarkardAndPrice'].split('^')[3]));
                    row = row.replaceAll("{morakhasiMohasebe}", addCommas(this['morakhasiAndRozKarkardAndPrice'].split('^')[4]));
                    row = row.replaceAll("{hoghoghsabet}", (this['numContractKindRef'] == 2 || this['numContractKindRef'] == 3) ? addCommas(this['morakhasiAndRozKarkardAndPrice'].split('^')[6]) : addCommas(this['hoghoghSabet']));
                    row = row.replaceAll("{summorakhasi}", addCommas(this['morakhasiAndRozKarkardAndPrice'].split('^')[5]));
                    row = row.replaceAll("{contract}", this['strContractKindName']);
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{Row}", i);
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFileRowMorakhasi = i - 1;
                    sumMorakhasi = sumMorakhasi + parseInt(Math.round(this['morakhasiAndRozKarkardAndPrice'].split('^')[5]));
                }
            });

            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptPersonelMorakhasi(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptPersonelMorakhasi(" + nextPage + ")");
            }
            if (t == 1) {
                sum = sum.replaceAll("{sum}", addCommas(sumMorakhasi) + " ریال");
                $("#ResultDivReportPricePersonelMorakhsi").html(header + header2 + allrow + sum + footer + endfooter + footerPager + btnpreSave);
                $("#divAllRecordCountPricePersonelMorakhsi").html(allpage);
                $("#btnPreSaveMorakhasi").button();
            }
            else {
                $("#ResultDivReportPricePersonelMorakhsi").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonelMorakhsi").html("");
            $("#ResultDivReportPricePersonelMorakhsi").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//----------------------------------پیش ثبت مرخصی----------------------------------
//---------------------------------------------------------------------------------
function preSaveMorakhasi() {
    var PersonelCodeTemp = "";
    for (var i = 1; i <= InvoiceFileRowMorakhasi; i++) {
        if ($("#chkOnePersonelCodeMorakhasi" + i).attr("checked"))
            PersonelCodeTemp = PersonelCodeTemp + $.trim($("#tdPersonelCodeHoghoghMOrakhasi" + i).html()) + ","
    }
    if ($.trim(PersonelCodeTemp) == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;
    }
    else {
        $("#Note").html("آیا از پیش ثبت محاسبه باز خرید مرخصی آخر سال اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "پیش ثبت محاسبه باز خرید مرخصی",
            width: 380,
            dialogClass: 'RightToLeftText',
            closeOnEscape: true,
            buttons: {
                "خیر": function () {
                    $(this).focus();
                    $(this).dialog("close");
                },
                "بله": function () {
                    $("#CheckOut").fadeIn();
                    $("#Loading").fadeIn();
                    $(this).dialog("close");
                    $.ajax({
                        type: "POST",
                        async: true,
                        cache: false,
                        dataType: "json",
                        data: { i: 11, PersonelCodeTemp: PersonelCodeTemp, ItemSearch: ItemSearchMorakhasi },
                        url: "PostBack/PBEndYears.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#btnPersonelPreInvoiceSearchMorakhsi").show();
                                rptPersonelMorakhasi(1);
                            }
                            else if (data == "3") {
                                ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                        }
                    });

                }
            }
        });
        $("#Note").dialog("open");
    }
}
//---------------------------------------------------------------------------------
///=========================== چک و نمایش مشاهده آخرین بررسی بازخرید مرخصی================
//---------------------------------------------------------------------------------
function CheckPreMorakhasi() {

    var personelcode = $.trim($("#txtReportPricePersonelCodeMorakhsi").val());
    var name = $.trim($("#txtReportPricePersonelNameMorakhsi").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCodeMorakhsi").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKindMorakhsi").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKindMorakhsi").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKindMorakhsi").val());
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKindMorakhsi").val() + "\"";
    var rows = $.trim($("#drpdwnShowRowMorakhsi").val());
    var year = $.trim($("#yearlblDateMorakhasi").val());

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 12, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, year: year },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            if (parseInt(data) > 0)
                $("#btnPersonelPreInvoiceSearchMorakhsi").show();
            else
                $("#btnPersonelPreInvoiceSearchMorakhsi").hide();
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== مشاهده گزارش آخرین بررسی بازخرید مرخصی=====================
//---------------------------------------------------------------------------------
var ContractKindPublicMorakhasi = 0;
function GetAllPreMorakhasi() {
    $("#titleSortHoghoghMorakhsi").html("* مرتب سازی براساس ، کد پرسنلی می باشد");
    InvoiceFileRowMorakhasi = 0;

    var personelcode = $.trim($("#txtReportPricePersonelCodeMorakhsi").val());
    var name = $.trim($("#txtReportPricePersonelNameMorakhsi").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCodeMorakhsi").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKindMorakhsi").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKindMorakhsi").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKindMorakhsi").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKindMorakhsi").val() + "\"";
    var rows = $.trim($("#drpdwnShowRowMorakhsi").val());
    var year = $.trim($("#yearlblDateMorakhasi").val());

    ItemSearchMorakhasi = year + "^" + contractkindCheck;
    ContractKindPublicMorakhasi = contractkindCheck;

    $("#ResultDivReportPricePersonelMorakhsi").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonelMorakhsi").show();

    var header = "<table id='tblVarizMorakhsi2' class='MainTbl' style='border-collapse: collapse;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCodeMorakhasi' checked='checked' onclick='CheckOnePersonelItemsMorakhasi(1);'/></th>" +
                   "<th align='center' width='50px'>ردیف</th><th style='display:none;'>کد</th><th align='center'>سال</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                   "<th align='center'>نوع قرارداد</th><th align='center'>گروه کاری</th><th align='center'>تعداد روز مرخصی در سال</th><th align='center'>تعداد روز مرخصی رفته</th><th align='center'>تعداد روز مانده مرخصی</th>" +
                   "<th align='center'>تعداد روز قابل پرداخت (سال جاری)</th><th align='center'>تعداد روز محاسبه (سال جاری)</th><th align='center'>بر حسب حقوق (ریال)</th><th align='center'>مجموع پرداختی مرخصی (ریال)</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdMorakhasiCodeHoghogh{Row}' style='display:none;'>{code}</td><td>{sal}</td><td id='tdPersonelCodeHoghoghMOrakhasi{Row}'>{personelcode}</td><td>{name}</td>" +
                   "<td>{contract}</td><td>{workGroup}</td><td>{cntrozMorakhsisal}</td><td>{cntrozMorakhsi}</td><td>{mandemorakhasi}</td>" +
                   "<td>{morakhasighabelpardakht}</td><td>{morakhasiMohasebe}</td><td>{hoghoghsabet}</td><td>{summorakhasi}</td><td>{bankname}</td><td>{numberAccount}</td>" +
                   "</tr>";
    var footer = "</table></td></tr><tr><td>";
    var sum = "<tr><td colspan=13 align='left'>مجموع :</td><td>{sum}</td><td></td><td></td></tr>";

    var btnpreSave = "<div style='padding:10px 0;'><input id='btnDeleteCalcMorakhasi' type='button' value='حذف محاسبه بازخرید مرخصی' onclick='DeleteClacMorakhasi(); return false;' style='margin-left:5px;'/>" +
                  "<input id='btnReCalcMorakhasi' type='button' value='محاسبه مجدد بازخرید مرخصی' onclick='ReClacMorakhasi(); return false;' style='margin-left:5px;'/>" +
                  "<input id='btnPrintCalcMorakhasi' type='button' value='لیست بازخرید مرخصی' onclick='printClacMorakhasi(); return false;' style='margin-left:5px;'/>" +
                  "<input id='btnExcelMorakhasi' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblVarizMorakhsi2\"); return false;' style='margin-left:5px;'/>" +
                  "<input id='btnSaveAllCalcMorakhasi' type='button' value='ثبت نهایی' onclick='saveAllClacMorakhasi(); return false;' style='margin-left:5px;'/></div>";

    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 13, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, year: year },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            var sumMorakhasi = 0;

            $.each(data, function (index) {
                row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCodeMorakhasi{Row}' onclick='CheckOnePersonelItemsMorakhasi(2,{Row});' checked='checked'/>");
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{cntrozMorakhsisal}", addCommas(this['strCountLeaveInYear']));
                row = row.replaceAll("{cntrozMorakhsi}", addCommas(this['strCountLeaveOut']));
                row = row.replaceAll("{mandemorakhasi}", addCommas(this['strCountLeaveRemained']));
                row = row.replaceAll("{morakhasighabelpardakht}", addCommas(this['strCountPayableLeave']));
                row = row.replaceAll("{morakhasiMohasebe}", addCommas(this['strCountPayOffLeave']));
                row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPriceRoot']));
                row = row.replaceAll("{summorakhasi}", addCommas(this['numPriceSettleLeaveEndYear']));
                row = row.replaceAll("{contract}", this['strContractKindName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{sal}", this['numYear']);

                row = row.replaceAll("{bankname}", this['strBankName']);
                row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                row = row.replaceAll("{code}", this['numLeaveEndYearCode']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                InvoiceFileRowMorakhasi = i - 1;
                sumMorakhasi = sumMorakhasi + parseInt(this['numPriceSettleLeaveEndYear']);

            });

            if (t == 1) {
                sum = sum.replaceAll("{sum}", addCommas(sumMorakhasi) + " ریال");
                $("#ResultDivReportPricePersonelMorakhsi").html(header + header2 + allrow + sum + footer + btnpreSave);
                $("#btnDeleteCalcMorakhasi,#btnReCalcMorakhasi,#btnPrintCalcMorakhasi,#btnExcelMorakhasi,#btnSaveAllCalcMorakhasi").button();
            }
            else {
                $("#ResultDivReportPricePersonelMorakhsi").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonelMorakhsi").html("");
            $("#ResultDivReportPricePersonelMorakhsi").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//-------------------------------------حذف پیش ثبت بازخرید مرخصی---------------------------
//---------------------------------------------------------------------------------
function DeleteClacMorakhasi() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRowMorakhasi; i++) {
        if ($("#chkOnePersonelCodeMorakhasi" + i).attr("checked"))
            Code = Code + $.trim($("#tdMorakhasiCodeHoghogh" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای حذف محاسبه بازخرید مرخصی انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند حذف می شوند \n آیا از حذف محاسبه بازخرید مرخصی این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "حذف محاسبه بازخرید مرخصی",
        width: 380,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#CheckOut").fadeIn();
                $("#Loading").fadeIn();
                $(this).dialog("close");
                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 15, Code: Code },
                    url: "PostBack/PBEndYears.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت حذف شد");
                            CheckPreMorakhasi();
                            GetAllPreMorakhasi();
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در حذف اطلاعات، دوباره امتحان کنید");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    }
                });
            }
        }
    });
    $("#Note").dialog("open");
}
//---------------------------------------------------------------------------------
//-------------------------------------محاسبه مجدد پیش ثبت بازخرید مرخصی------------------
//---------------------------------------------------------------------------------
function ReClacMorakhasi() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRowMorakhasi; i++) {
        if ($("#chkOnePersonelCodeMorakhasi" + i).attr("checked"))
            Code = Code + $.trim($("#tdMorakhasiCodeHoghogh" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای محاسبه مجدد بازخرید مرخصی انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند  مجددا محاسبه بازخرید مرخصی می شوند \n آیا از محاسبه مجدد بازخرید مرخصی این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "محاسبه مجدد بازخرید مرخصی",
        width: 380,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#CheckOut").fadeIn();
                $("#Loading").fadeIn();
                $(this).dialog("close");


                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 16, Code: Code },
                    url: "PostBack/PBEndYears.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت بازگردانده شد");
                            CheckPreMorakhasi();
                            GetAllPreMorakhasi();
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در بازگردانی اطلاعات، دوباره امتحان کنید");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    }
                });
            }
        }
    });
    $("#Note").dialog("open");
}
//---------------------------------------------------------------------------------
//-------------------------------------لیست پیش ثبت بازخرید مرخصی---------------------------
//---------------------------------------------------------------------------------
function printClacMorakhasi() {
    var PersonelCode = "";
    //alert(contractFileRow);
    for (var i = 1; i <= InvoiceFileRowMorakhasi; i++) {
        if ($("#chkOnePersonelCodeMorakhasi" + i).attr("checked"))
            PersonelCode = PersonelCode + $.trim($("#tdMorakhasiCodeHoghogh" + i).html()) + ",";
    }
    if (PersonelCode != "") {
        //var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
        //grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" :  $("#drpdwnWorkReportPriceJobKind").val() ;
        window.open('PeikFactor.aspx?itemsearch=' + ItemSearchMorakhasi + '&ofcMorakhasi=' + PersonelCode, '_blank');
    }
    else {
        ShowAlert("لطفا یک کد پرسنلی را برای پرینت بازخرید مرخصی انتخاب نمایید");
        return;
    }
}
//---------------------------------------------------------------------------------
//--------------------------ثبت نهایی پیش ثبت بازخرید مرخصی------------------------------
//---------------------------------------------------------------------------------
function saveAllClacMorakhasi() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRowMorakhasi; i++) {
        if ($("#chkOnePersonelCodeMorakhasi" + i).attr("checked"))
            Code = Code + $.trim($("#tdMorakhasiCodeHoghogh" + i).html()) + ",";
    }
    if (Code == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;

    }
    $("#Note").html("آیا از ثبت نهایی محاسبه بازخرید مرخصی آخر سال اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ثبت نهایی محاسبه بازخرید مرخصی",
        width: 380,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#CheckOut").fadeIn();
                $("#Loading").fadeIn();
                $(this).dialog("close");

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 14, Code: Code },
                    url: "PostBack/PBEndYears.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت ثبت شد");
                            CheckPreMorakhasi();
                            GetAllPreMorakhasi();
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    }
                });
            }
        }
    });
    $("#Note").dialog("open");
}
//---------------------------------------------------------------------------------
///=========================== مشاهده گزارش سابقه واریز بازخرید مرخصی=========================
//---------------------------------------------------------------------------------

function ShowAllFinalMorakhasi(vpage) {
    $("#titleSortHoghoghMorakhsi").html("* مرتب سازی براساس ، تاریخ تایید تسویه حساب بازخرید مرخصی می باشد");

    InvoiceFileRowMorakhasi = 0;

    var personelcode = $.trim($("#txtReportPricePersonelCodeMorakhsi").val());
    var name = $.trim($("#txtReportPricePersonelNameMorakhsi").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCodeMorakhsi").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKindMorakhsi").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKindMorakhsi").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKindMorakhsi").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKindMorakhsi").val() + "\"";
    var rows = $.trim($("#drpdwnShowRowMorakhsi").val());
    var year = $.trim($("#yearlblDateMorakhasi").val());

    ItemSearchMorakhasi = year + "^" + contractkindCheck;
    ContractKindPublicMorakhasi = contractkindCheck;

    $("#ResultDivReportPricePersonelMorakhsi").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonelMorakhsi").show();

    var header = "<table id='tblVarizMorakhsi3' class='MainTbl' style='border-collapse: collapse;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr>" +
                   "<th align='center' width='50px'>ردیف</th><th align='center'>تاریخ تایید</th><th align='center'>سال</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                   "<th align='center'>نوع قرارداد</th><th align='center'>گروه کاری</th><th align='center'>تعداد روز مرخصی در سال</th><th align='center'>تعداد روز مرخصی رفته</th><th align='center'>تعداد روز مانده مرخصی</th>" +
                   "<th align='center'>تعداد روز قابل پرداخت (سال جاری)</th><th align='center'>تعداد روز محاسبه (سال جاری)</th><th align='center'>بر حسب حقوق (ریال)</th><th align='center'>مجموع پرداختی مرخصی (ریال)</th>" +
                   "<th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th>وضعیت</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{date}</td><td>{sal}</td><td>{personelcode}</td><td>{name}</td>" +
                   "<td>{contract}</td><td>{workGroup}</td><td>{cntrozMorakhsisal}</td><td>{cntrozMorakhsi}</td><td>{mandemorakhasi}</td>" +
                   "<td>{morakhasighabelpardakht}</td><td>{morakhasiMohasebe}</td><td>{hoghoghsabet}</td><td>{summorakhasi}</td><td>{bankname}</td><td>{numberAccount}</td><td>{status}</td>" +
                   "</tr>";
    var footer = "</table></td></tr><tr><td>";
    var sum = "<tr><td colspan=13 align='left'>مجموع :</td><td>{sum}</td><td></td><td></td><td></td></tr>";

    var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelMorakhasiFinal' type='button' value='خروجی اکسل' onclick='ExcelReportTable(\"tblVarizMorakhsi3\"); return false;' style='margin-left:5px;'/></div>";

    var footerPager = "<div><div class='pagerdiv' ><div class='pageritem'><a onclick='ShowAllFinalMorakhasi(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPriceAllFinalMorakhasi' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountAllFinalPersonelMorakhasi' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='ShowAllFinalMorakhasi({lastpage})'>" +
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
        data: { i: 17, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, year: year, page: vpage, perpage: vperpage },
        url: "PostBack/PBEndYears.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var sumMorakhasi = 0;

            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{cntrozMorakhsisal}", addCommas(this['strCountLeaveInYear']));
                row = row.replaceAll("{cntrozMorakhsi}", addCommas(this['strCountLeaveOut']));
                row = row.replaceAll("{mandemorakhasi}", addCommas(this['strCountLeaveRemained']));
                row = row.replaceAll("{morakhasighabelpardakht}", addCommas(this['strCountPayableLeave']));
                row = row.replaceAll("{morakhasiMohasebe}", addCommas(this['strCountPayOffLeave']));
                row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPriceRoot']));
                row = row.replaceAll("{summorakhasi}", addCommas(this['numPriceSettleLeaveEndYear']));
                row = row.replaceAll("{contract}", this['strContractKindName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{sal}", this['numYear']);
                row = row.replaceAll("{bankname}", this['strBankName']);
                row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                row = row.replaceAll("{date}", this['dateVerifiDate']);
                row = row.replaceAll("{status}", this['strstatus']);
                row = row.replaceAll("{Row}", i);
                sumMorakhasi = sumMorakhasi + parseInt(this['numPriceSettleLeaveEndYear']);

                i = i + 1;
                allrow = allrow + row;
                t = 1;
                InvoiceFileRowMorakhasi = i - 1;
            });

            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "ShowAllFinalMorakhasi(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "ShowAllFinalMorakhasi(" + nextPage + ")");
            }
            if (t == 1) {
                sum = sum.replaceAll("{sum}", addCommas(sumMorakhasi) + " ریال");
                $("#ResultDivReportPricePersonelMorakhsi").html(header + header2 + allrow + sum + footer + footerPager + btnExcel);
                $("#divAllRecordCountAllFinalPersonelMorakhasi").html(allpage);
                $("#btnExcelMorakhasiFinal").button();
            }
            else {
                $("#ResultDivReportPricePersonelMorakhsi").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonelMorakhsi").html("");
            $("#ResultDivReportPricePersonelMorakhsi").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}










//---------------------------------------------------------------------------------
function CheckOnePersonelItemsMorakhasi(type, row) {
    if (type == 1) {
        for (var i = 1; i <= InvoiceFileRowMorakhasi; i++) {
            if ($("#chkAllPersonelCodeMorakhasi").attr("checked"))
                $("#chkOnePersonelCodeMorakhasi" + i).attr("checked", "checked");
            else
                $("#chkOnePersonelCodeMorakhasi" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPersonelCodeMorakhasi").removeAttr("checked");
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