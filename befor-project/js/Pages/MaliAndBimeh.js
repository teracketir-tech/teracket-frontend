$(document).ready(function () {

    $("#divPersonelMaliAndBimehTabs").tabs();
    GetTabsDeActive("divPersonelMaliAndBimehTabs");
    $("#DivtabMali").tabs();
    $("#DivtabBimeh,#DivtabBimehPrice").tabs();


    $("#btnSaveMaliInfo").click(function () { SaveMaliInfo(); return false; });
    $("#btnSaveBimehInfo").click(function () { SaveBimehInfo(); return false; });
    $("#btnReportMaliPersonelSearch").click(function () { rptMaliInfo(1); return false; });
    $("#btnReportBimehPersonelSearch").click(function () { rptBimehInfo(1); return false; });
    $("#btnSaveBimehPriceInfo").click(function () { SaveBimePriceInfo(); return false; });
    $("#btnReportBimehPricePersonelSearch").click(function () { rptBimehPriceInfo(1); return false; });


    $("#btnCheckReportMaliPersonelSearch").click(function () { rptCheckMali(); return false; });
    $("#btnReportExcelCheckMali").click(function () { tableToExcel('tblReportCheckBankAccount'); return false; });

    $("#btnCheckReportBimehPersonelSearch").click(function () { rptCheckBimeh(); return false; });
    $("#btnReportExcelCheckBimeh").click(function () { tableToExcel('tblReportCheckBimeh'); return false; });


    $("#monthlblBimehPriceDateYear").hide();
    $("#daylblBimehPriceDateYear").hide();

    $("#monthlblBimePriceSrchDateYear").hide();
    $("#daylblBimePriceSrchDateYear").hide();

    $("#txtNumberAccont").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtShebaBank1").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtShebaBank1").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtShebaBank2").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtShebaBank2").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtShebaBank3").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtShebaBank3").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtShebaBank4").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtShebaBank4").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtShebaBank5").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtShebaBank5").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtShebaBank6").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtShebaBank6").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtShebaBank7").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtShebaBank7").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtCartNumberBank1").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtCartNumberBank1").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtCartNumberBank2").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtCartNumberBank2").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtCartNumberBank3").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtCartNumberBank3").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#txtCartNumberBank4").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#txtCartNumberBank4").keydown(function (e) {
        if (e.which == 9 || e.which == 13) {
            $("#btnSaveMaliInfo").focus();
            //e.preventDefault();
            return false;
        }
    });

    var objCal1 = new AMIB.persianCalendar('pcaldateNewStartBimeDate', {
        extraInputID: 'pcaldateNewStartBimeDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal2 = new AMIB.persianCalendar('pcaldateNewEndBimeDate', {
        extraInputID: 'pcaldateNewEndBimeDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal3 = new AMIB.persianCalendar('pcaldateStartBimehEdit', {
        extraInputID: 'pcaldateStartBimehEdit',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal4 = new AMIB.persianCalendar('pcaldateEndBimehEdit', {
        extraInputID: 'pcaldateEndBimehEdit',
        extraInputFormat: 'yyyy/mm/dd'
    });

    GetDrpdwnBaseAll();
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
    drpdwnWorkgroup = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 3 },
        url: "PostBack/PBMaliAndBimeh.ashx",
        success: function (data) {

            drpdwnWorkgroup = data;
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
    selectStart5 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' multiple='multiple' size='5'>";
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

        selectTemp = selectStart5.replaceAll("{dpdwnId}", "drpdwnWorkGroupPersonelMaliInfo");
        $("#tddrpdwnWorkGroupPersonelMaliInfo").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkGroupPersonelMaliInfo").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart5.replaceAll("{dpdwnId}", "drpdwnWorkGroupPersonelBimehInfo");
        $("#tddrpdwnWorkGroupPersonelBimehInfo").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkGroupPersonelBimehInfo").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });


        selectTemp = selectStart5.replaceAll("{dpdwnId}", "drpdwnWorkGroupPersonelBimehInfoPrice");
        $("#tddrpdwnWorkGroupPersonelBimehInfoPrice").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkGroupPersonelBimehInfoPrice").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
    }

}
//===============================================================================
//===============================================================================
//===============================================================================
function SaveMaliInfo() {
    var Personelcode = $.trim($("#txtCodePersoneliMali").val());
    var NumberAccont = $.trim($("#txtNumberAccont").val());
    var BankName = $("#drpdwnBankName").val();
    var ShebaBank1 = $.trim($("#txtShebaBank1").val());
    var ShebaBank2 = $.trim($("#txtShebaBank2").val());
    var ShebaBank3 = $.trim($("#txtShebaBank3").val());
    var ShebaBank4 = $.trim($("#txtShebaBank4").val());
    var ShebaBank5 = $.trim($("#txtShebaBank5").val());
    var ShebaBank6 = $.trim($("#txtShebaBank6").val());
    var ShebaBank7 = $.trim($("#txtShebaBank7").val());
    var CartNumberBank1 = $.trim($("#txtCartNumberBank1").val());
    var CartNumberBank2 = $.trim($("#txtCartNumberBank2").val());
    var CartNumberBank3 = $.trim($("#txtCartNumberBank3").val());
    var CartNumberBank4 = $.trim($("#txtCartNumberBank4").val());

    var ShebaBank = "IR" + $.trim($("#txtShebaBank1").val()) + "-" + $.trim($("#txtShebaBank2").val()) + "-" + $.trim($("#txtShebaBank3").val()) + "-" + $.trim($("#txtShebaBank4").val()) + "-" + $.trim($("#txtShebaBank5").val()) + "-" + $.trim($("#txtShebaBank6").val()) + "-" + $.trim($("#txtShebaBank7").val());
    var CartNumberBank = $.trim($("#txtCartNumberBank1").val()) + "-" + $.trim($("#txtCartNumberBank2").val()) + "-" + $.trim($("#txtCartNumberBank3").val()) + "-" + $.trim($("#txtCartNumberBank4").val());
    if (Personelcode == "" || BankName == "-1" || NumberAccont == "" || $.trim($("#txtShebaBank1").val()) == "" || $.trim($("#txtShebaBank2").val()) == "" || $.trim($("#txtShebaBank3").val()) == ""
        || $.trim($("#txtShebaBank4").val()) == "" || $.trim($("#txtShebaBank5").val()) == "" || $.trim($("#txtShebaBank6").val()) == "" || $.trim($("#txtShebaBank7").val()) == ""
        || $.trim($("#txtCartNumberBank1").val()) == "" || $.trim($("#txtCartNumberBank2").val()) == "" || $.trim($("#txtCartNumberBank3").val()) == "" || $.trim($("#txtCartNumberBank4").val()) == "") {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(Personelcode)) {
        ShowAlert("کد پرسنلی باید عددی باشد !");
        return;
    }
    else if (ShebaBank1 == "" || ShebaBank1.length < 2) {
        ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(ShebaBank4)) {
        ShowAlert("شماره شبا باید عددی باشد !");
        return;
    }
    else if (ShebaBank2 == "" || ShebaBank2.length < 4) {
        ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(ShebaBank2)) {
        ShowAlert("شماره شبا باید عددی باشد !");
        return;
    }
    else if (ShebaBank3 == "" || ShebaBank3.length < 4) {
        ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(ShebaBank3)) {
        ShowAlert("شماره شبا باید عددی باشد !");
        return;
    }
    else if (ShebaBank4 == "" || ShebaBank4.length < 4) {
        ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(ShebaBank4)) {
        ShowAlert("شماره شبا باید عددی باشد !");
        return;

    }
    else if (ShebaBank5 == "" || ShebaBank5.length < 4) {
        ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(ShebaBank5)) {
        ShowAlert("شماره شبا باید عددی باشد !");
        return;

    }
    else if (ShebaBank6 == "" || ShebaBank6.length < 4) {
        ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(ShebaBank6)) {
        ShowAlert("شماره شبا باید عددی باشد !");
        return;

    }
    else if (ShebaBank7 == "" || ShebaBank7.length < 2) {
        ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(ShebaBank7)) {
        ShowAlert("شماره شبا باید عددی باشد !");
        return;

    }
    else if (CartNumberBank1 == "" || CartNumberBank1.length < 4) {
        ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
        return;

    }
    else if (!numbericFild.test(CartNumberBank1)) {
        ShowAlert("شماره کارت باید عددی باشد !");
        return;
    }
    else if (CartNumberBank2 == "" || CartNumberBank2.length < 4) {
        ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(CartNumberBank2)) {
        ShowAlert("شماره کارت باید عددی باشد !");
        return;

    }
    else if (CartNumberBank3 == "" || CartNumberBank3.length < 4) {
        ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(CartNumberBank3)) {
        ShowAlert("شماره کارت باید عددی باشد !");
        return;

    }
    else if (CartNumberBank4 == "" || CartNumberBank4.length < 4) {
        ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(CartNumberBank4)) {
        ShowAlert("شماره کارت باید عددی باشد !");
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
            data: { i: 1, Personelcode: Personelcode, NumberAccont: NumberAccont, BankName: BankName, ShebaBank: ShebaBank, CartNumberBank: CartNumberBank },
            url: "/PostBack/PBMaliAndBimeh.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                if (data == "1") {
                    ShowAlert("اطلاعات حساب پرسنل با موفقیت ثبت شده است");
                    $("#txtCodePersoneliMali").val("");
                    $("#txtNumberAccont").val("");
                    $("#drpdwnBankName").val("-1");
                    $("#txtShebaBank1").val("");
                    $("#txtShebaBank2").val("");
                    $("#txtShebaBank3").val("");
                    $("#txtShebaBank4").val("");
                    $("#txtShebaBank5").val("");
                    $("#txtShebaBank6").val("");
                    $("#txtShebaBank7").val("");
                    $("#txtCartNumberBank1").val("");
                    $("#txtCartNumberBank2").val("");
                    $("#txtCartNumberBank3").val("");
                    $("#txtCartNumberBank4").val("");
                }
                else if (data == "2") {
                    ShowAlert("قبلا برای این پرسنل شماره حساب درج شده است !");
                }
                else if (data == "3") {
                    ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                ShowAlert("خطا در هنگام ثبت ، لطفا مجددا تلاش کنید.");
            }
        });
    }
}
//===============================================================================
//===============================================================================
//===============================================================================
function GetDateBimehInfo() {
    var kind = $("#drpdwnBimehKind").val();
    if (kind == "-1") {
        $("#tdbime9").hide();
        $("#pcaldateNewStartBimeDate").val("");
        $("#pcaldateNewEndBimeDate").val("");
    }
    else if (kind == "1") {
        $("#tdbime9").show();
        $("#pcaldateNewStartBimeDate").val("");
        $("#pcaldateNewEndBimeDate").val("");
        $("#TddateTobimehTitle").show();
        $("#TddateTobimehValue").show();

    }
    else if (kind == "2") {
        $("#tdbime9").show();
        $("#pcaldateNewStartBimeDate").val("");
        $("#pcaldateNewEndBimeDate").val("");
        $("#TddateTobimehTitle").hide();
        $("#TddateTobimehValue").hide();
    }
}
//===============================================================================
//===============================================================================
//===============================================================================
function SaveBimehInfo() {
    var BImehKind = $.trim($("#drpdwnBimehKind").val());
    var personelcode = $.trim($("#txtPersonelCodeBimeh").val());
    var NumberBimeh = $.trim($("#txtNewNumberBimeh").val());
    var CodeGargah = $.trim($("#txtNewCodeGargah").val());
    var GargahName = $.trim($("#txtNewGargahName").val());
    var StartBimeDate = $.trim($("#pcaldateNewStartBimeDate").val());
    var EndBimeDate = $.trim($("#pcaldateNewEndBimeDate").val());

    if (BImehKind == "-1" || personelcode == "" || NumberBimeh == "" || CodeGargah == "" || GargahName == "" || ((BImehKind == 1 && (StartBimeDate == "" || EndBimeDate == "")) || (BImehKind == 2 && StartBimeDate == ""))) {
        ShowAlert("لطفا اطلاعات را وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(personelcode)) {
        ShowAlert("کد پرسنلی باید عددی باشد !");
        return;
    }
    else if (!numbericFild.test(NumberBimeh)) {
        ShowAlert("شماره بیمه باید عددی باشد !");
        return;
    }
    else if (!numbericFild.test(CodeGargah)) {
        ShowAlert("کد کارگاه باید عددی باشد !");
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
            data: { i: 2, personelcode: personelcode, BImehKind: BImehKind, NumberBimeh: NumberBimeh, CodeGargah: CodeGargah, GargahName: GargahName, StartBimeDate: StartBimeDate, EndBimeDate: EndBimeDate },
            url: "/PostBack/PBMaliAndBimeh.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                if (data == "1") {
                    ShowAlert("اطلاعات بیمه پرسنل با موفقیت ثبت شده است");
                    $("#drpdwnBimehKind").val("-1");
                    GetDateBimehInfo();
                    $("#txtPersonelCodeBimeh").val("");
                    $("#txtNewNumberBimeh").val("");
                    $("#txtNewCodeGargah").val("");
                    $("#txtNewGargahName").val("");
                    $("#pcaldateNewStartBimeDate").val("");
                    $("#pcaldateNewEndBimeDate").val("");
                }
                else if (data == "2") {
                    ShowAlert("قبلا برای این پرسنل شماره بیمه درج شده است !");
                }
                else if (data == "3") {
                    ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                ShowAlert("خطا در هنگام ثبت ، لطفا مجددا تلاش کنید.");
            }
        });
    }
}
//===============================================================================
function SaveBimePriceInfo() {
    var month =$("#drpdwnBimePriceMonth").val()
    var priceBimeh = $.trim($("#txtPersonelNameBimehPrice").val());
    var year = $.trim($("#yearlblBimehPriceDateYear").val());

    if (month == -1) {
        ShowAlert("ماه واریز باید مشخص شود !");
        return;
    }
    else if (priceBimeh == "" || priceBimeh == "0") {
        ShowAlert("مبلغ واریزی را وارد نمایید !");
        return;
    }
    else if (!numbericFild.test(priceBimeh.replaceAll(",", ""))) {
        ShowAlert("مبلغ واریزی عددی می باشد");
        return;
    }

    var price = parseInt(priceBimeh.replaceAll(",", ""));

    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 12, month: month, price: price, year: year },
        url: "/PostBack/PBMaliAndBimeh.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            if (data == "1") {
                ShowAlert("اطلاعات حق بیمه با موفقیت ثبت شده است");
                rptBimehPriceInfo(1);
                $("#drpdwnBimePriceMonth").val("-1");
                $("#txtPersonelNameBimehPrice").val("");
            }
            else if (data == "3") {
                ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            ShowAlert("خطا در هنگام ثبت ، لطفا مجددا تلاش کنید.");
        }
    });

}
//===============================================================================
//===============================================================================
//===============================================================================
function rptMaliInfo(vpage) {

    $("#DivExcelMali").hide();
    $("#titleMali").html("* مرتب سازی براساس ،کد پرسنلی می باشد");
    var personelcode = $.trim($("#txtReportMaliPersonelCode").val());
    var name = $.trim($("#txtReportMaliPersonelName").val());
    var mellicode = $.trim($("#txtReportMaliPersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkGroupPersonelMaliInfo").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkGroupPersonelMaliInfo").val() + "\"";


    $("#ResultDivPersonelMali").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonelMali").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse;width:106%;' border=1 cellpadding='2'>";
    //var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th align='center'>شماره شناسنامه</th><th align='center'>تاریخ تولد</th><th>وضعیت تاهل</th><th>کارفرما</th><th>نوع قرارداد</th><th>تاریخ ثبت</th><th>فایل قرارداد</th></thead><tbody>";
    //var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{fathername}</td><td>{mellicode}</td><td>{shsh}</td><td>{datebrithday}</td><td>{marrid}</td><td>{employer}</td><td>{contract}</td><td>{dateRegister}</td><td>{img}</td></tr>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th align='center'>شماره شبا</th><th>شماره کارت</th><th>تاریخ ثبت</th><th style='width:47px;'></th></thead><tbody>";
    var mainrow = "<tr id='trBankInfoRow{Row}'><td>{Row}</td><td id='trBankPersonCode{Row}'>{personelcode}</td><td id='trBankPersonName{Row}'>{name}</td><td id='trBankWorkGroup{Row}'>{workgroup}</td><td id='trBankBankName{Row}'>{bankName}</td><td id='trBankAccNumber{Row}'>{accountNumber}</td><td id='trBankSheba{Row}'>{sheba}</td><td id='trBankCartNumber{Row}'>{cartNumber}</td><td>{datereg}</td><td>{action}</td></tr>";
    var footer = "</tbody></table></td></tr><tr><td>";
    var footerPager = "<div style='width:106%;'><div class='pagerdiv'><div class='pageritem'><a onclick='rptMaliInfo(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelMali' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelMali' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptMaliInfo({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50";
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
        data: { i: 4, personelcode: personelcode, grohkari: grohkari, name: name, mellicode: mellicode, page: vpage, perpage: vperpage },
        url: "PostBack/PBMaliAndBimeh.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{action}", "<a style='cursor:pointer;display:block;float:right;width:47%;' onclick='EditBankInfo({Row},{code});'><img src='images/edit.png' /></a><a style='cursor:pointer;display:block;float:right;width:46%;' onclick='DeleteBankInfo({Row},{code});'><img src='images/delete.png' /></a>");
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{workgroup}", this['strWorkGroupName'] == null ? "نامشخص" : this['strWorkGroupName']);
                row = row.replaceAll("{bankName}", this['strBankName']);
                row = row.replaceAll("{accountNumber}", this['strBankAccount']);
                row = row.replaceAll("{sheba}", this['strShebaBank']);
                row = row.replaceAll("{cartNumber}", this['strCartNumberBank']);
                row = row.replaceAll("{datereg}", this['dateRegisterDate']);
                row = row.replaceAll("{action}", "");
                row = row.replaceAll("{code}", this['numBankInfoCode']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptMaliInfo(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptMaliInfo(" + nextPage + ")");
            }
            if (t == 1) {

                $("#ResultDivPersonelMali").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonelMali").html(allpage);
            }
            else {
                $("#ResultDivPersonelMali").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelMali").html("");
            $("#ResultDivPersonelMali").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });

}
//=========================================================================================
//=========================================حذف bank info======================================
//=========================================================================================
function DeleteBankInfo(row, code) {
    $("#Note").html("آیا از حذف اطلاعات بانکی این پرسنل اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "حذف اطلاعات بانکی",
        width: 350,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#Loading").fadeIn();
                $("#CheckOut").fadeIn();

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 5, code: code },
                    url: "PostBack/PBMaliAndBimeh.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            $("#trBankInfoRow" + row).remove();
                            ShowAlert("اطلاعات بانکی این پرسنل با موفقیت  حذف شد");
                        }
                        else if (data == "2") {
                            ShowAlert("اطلاعات بانکی این پرسنل یافت نشد!");
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات، دوباره امتحان کنید");
                    }
                });
                $(this).dialog("close");
            }
        }
    });
    $("#Note").dialog("open");
}
//===============================================================================
//===============================================================================
//===============================================================================
function rptBimehInfo(vpage) {

    $("#DivExcelBimeh").hide();
    $("#titleBimeh").html("* مرتب سازی براساس ،کد پرسنلی می باشد");

    var personelcode = $.trim($("#txtReportBimehPersonelCode").val());
    var mellicode = $.trim($("#txtReportBimehMelliCode").val());
    var bimehKind = $.trim($("#drpdwnBimehKindSearch").val());
    var PersonelName = $.trim($("#txtReportBimehPersonelName").val());
    var grohkari = $.trim($("#drpdwnWorkGroupPersonelBimehInfo").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkGroupPersonelBimehInfo").val() + "\"";

    $("#ResultDivPersonelBimeh").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonelBimeh").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    //var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th align='center'>شماره شناسنامه</th><th align='center'>تاریخ تولد</th><th>وضعیت تاهل</th><th>کارفرما</th><th>نوع قرارداد</th><th>تاریخ ثبت</th><th>فایل قرارداد</th></thead><tbody>";
    //var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{fathername}</td><td>{mellicode}</td><td>{shsh}</td><td>{datebrithday}</td><td>{marrid}</td><td>{employer}</td><td>{contract}</td><td>{dateRegister}</td><td>{img}</td></tr>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th><th align='center'>شماره بیمه</th><th align='center'>نام کارگاه</th><th align='center'>کد کارگاه</th><th>تاریخ شروع بیمه</th><th>تاریخ پایان بیمه</th><th style='display:none;'>نوع بیمه</th><th align='center'>نوع بیمه</th><th style='width:47px;' class='hidetdtd'></th></thead><tbody>";
    var mainrow = "<tr id='trBimehInfoRow{Row}'><td>{Row}</td><td id='trBimehPersonCodeRow{Row}'>{personelcode}</td><td id='trBimehPersonNameRow{Row}'>{name}</td><td id='trBimehPersonWorkGroupRow{Row}'>{workgroup}</td><td id='trBimehNUmberBimehRow{Row}'>{numberbimeh}</td><td id='trBimehKargahNameRow{Row}'>{kargahname}</td><td id='trBimehKargahCodeRow{Row}'>{kargahcode}</td><td id='trdateStartRow{Row}'>{datestart}</td><td id='trdateEndRow{Row}'>{dateEnd}</td><td id='trstatusRow{Row}' style='display:none;'>{statusCode}</td><td id='trstatusNameRow{Row}'>{status}</td><td class='hidetdtd'>{action}</td></tr>";
    var footer = "</tbody></table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='rptBimehInfo(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelbimeh' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelbimeh' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptBimehInfo({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50";
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
        data: { i: 6, personelcode: personelcode, grohkari: grohkari, mellicode: mellicode, PersonelName: PersonelName, bimehKind: bimehKind, page: vpage, perpage: vperpage },
        url: "PostBack/PBMaliAndBimeh.ashx",
        success: function (data) {
            var access = "0";
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{action}", this['useraccess'] == "0" ? "" : "<a style='cursor:pointer;display:block;float:right;width:47%;' onclick='EditBimehInfo({Row},{code});'><img src='images/edit.png' /></a><a style='cursor:pointer;display:block;float:right;width:46%;' onclick='DeleteBimehInfo({Row},{code});'><img src='images/delete.png' /></a>");
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{workgroup}", this['strWorkGroupName'] == null ? "نامشخص" : this['strWorkGroupName']);
                row = row.replaceAll("{numberbimeh}", this['strBimehNumber']);
                row = row.replaceAll("{kargahname}", this['strWorkshopName']);
                row = row.replaceAll("{kargahcode}", this['strBimehWorkshopCode']);
                row = row.replaceAll("{datestart}", this['dateStartBimehDate']);
                row = row.replaceAll("{dateEnd}", this['dateEndBimehDate'] == null || $.trim(this['dateEndBimehDate']) == "" ? "--" : this['dateEndBimehDate']);
                row = row.replaceAll("{code}", this['numBimehCode']);
                row = row.replaceAll("{status}", this['numStatus'] == 1 ? "<font style='color:#ff0000;'>قبل از استخدام</font>" : this['numStatus'] == 2 ? "<font style='color:green;'>بعد از استخدام" : "--");
                row = row.replaceAll("{statusCode}", this['numStatus']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                access = this['useraccess'];
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptBimehInfo(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptBimehInfo(" + nextPage + ")");
            }
            if (t == 1) {

                $("#ResultDivPersonelBimeh").html(header + header2 + allrow + footer + footerPager + endfooter);
                if (access == "0") $(".hidetdtd").hide();
                else $(".hidetdtd").show();
                $("#divAllRecordCountPersonelbimeh").html(allpage);
            }
            else {
                $("#ResultDivPersonelBimeh").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelBimeh").html("");
            $("#ResultDivPersonelBimeh").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });

}
//===============================================================================
//===============================================================================
//===============================================================================
function rptBimehPriceInfo(vpage) {

    $("#DivExcelBimehPrice").hide();
    $("#titleBimehPrice").html("* مرتب سازی براساس ،سال و ماه می باشد");
    var month = $("#drpdwnBimePriceSrchMonth").val()
    var year = $.trim($("#yearlblBimePriceSrchDateYear").val());

    $("#ResultDivPersonelBimehPrice").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonelBimehPrice").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>ماه</th><th align='center'>سال</th><th>مبلغ پرداختی</th></thead><tbody>";
    var mainrow = "<tr id='trBimehPriceInfoRow{Row}'><td>{Row}</td><td id='trBimehPriceMonthRow{Row}'>{month}</td><td id='trBimehPriceYearRow{Row}'>{year}</td><td id='trBimehPrice{Row}'>{bimeprice}</td></tr>";
    var sumfooter = "<tr><td colspan='3' style='text-align:left;background-color:#c0f8af;'>مجموع پرداختی :</td><td style='text-align:center;background-color:#c0f8af;'>{sum}</td></tr>";
    var footer = "</tbody></table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='rptBimehPriceInfo(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelbimeh' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelbimehprice' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptBimehPriceInfo({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50";
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
        data: { i: 13, month: month, year: year, page: vpage, perpage: vperpage },
        url: "PostBack/PBMaliAndBimeh.ashx",
        success: function (data) {
            var access = "0";
            var sum = 0;
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                //  row = mainrow.replaceAll("{action}", this['useraccess'] == "0" ? "" : "<a style='cursor:pointer;display:block;float:right;width:47%;' onclick='EditBimehInfo({Row},{code});'><img src='images/edit.png' /></a><a style='cursor:pointer;display:block;float:right;width:46%;' onclick='DeleteBimehInfo({Row},{code});'><img src='images/delete.png' /></a>");
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{month}", this['strMonth']);
                row = row.replaceAll("{year}", this['numYear']);
                row = row.replaceAll("{bimeprice}", addCommas(this['numHaghBimehPrice']));
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                access = this['useraccess'];
                allrow = allrow + row;
                sum = sum + parseInt(this['numHaghBimehPrice']);
                t = 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptBimehPriceInfo(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptBimehPriceInfo(" + nextPage + ")");
            }
            if (t == 1) {
                sumfooter = sumfooter.replaceAll("{sum}", addCommas(sum));
                $("#ResultDivPersonelBimehPrice").html(header + header2 + allrow + sumfooter + footer + footerPager + endfooter);
                if (access == "0") $(".hidetdtd").hide();
                else $(".hidetdtd").show();
                $("#divAllRecordCountPersonelbimehprice").html(allpage);
            }
            else {
                $("#ResultDivPersonelBimehPrice").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelBimehPrice").html("");
            $("#ResultDivPersonelBimehPrice").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });

}
//=========================================================================================
//=========================================حذف bimeh info======================================
//=========================================================================================
function DeleteBimehInfo(row, code) {
    $("#Note").html("آیا از حذف اطلاعات بیمه این پرسنل اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "حذف اطلاعات بیمه",
        width: 350,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {
                $("#Loading").fadeIn();
                $("#CheckOut").fadeIn();

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 7, code: code },
                    url: "PostBack/PBMaliAndBimeh.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            $("#trBimehInfoRow" + row).remove();
                            ShowAlert("اطلاعات بیمه این پرسنل با موفقیت  حذف شد");
                        }
                        else if (data == "2") {
                            ShowAlert("اطلاعات بیمه این پرسنل یافت نشد!");
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        ShowAlert("خطا در بازیابی اطلاعات، دوباره امتحان کنید");
                    }
                });
                $(this).dialog("close");
            }
        }
    });
    $("#Note").dialog("open");
}
//=========================================================================================
//=========================================edit bimeh info======================================
//=========================================================================================
function EditBimehInfo(row, code) {

    $("#tdeditpersonelcode").html($("#trBimehPersonCodeRow" + row).html().trim());
    $("#tdeditpersonelname").html($("#trBimehPersonNameRow" + row).html().trim());
    $("#tdeditpersonelworkGroup").html($("#trBimehPersonWorkGroupRow" + row).html().trim());
    $("#txtEditBimehNumber").val($("#trBimehNUmberBimehRow" + row).html().trim());
    $("#txtEditCargahName").val($("#trBimehKargahNameRow" + row).html().trim());
    $("#txtEditCodeGargah").val($("#trBimehKargahCodeRow" + row).html().trim());
    $("#pcaldateStartBimehEdit").val($("#trdateStartRow" + row).html().trim());
    $("#pcaldateEndBimehEdit").val($("#trdateEndRow" + row).html().trim().replaceAll("--", ""));
    $("#drpdwnBimehKindEdit").val($("#trstatusRow" + row).html().trim());

    $("#pnlEDitBimeInfo").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش اطلاعات بیمه",
        width: 350,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بروزرسانی اطلاعات": function () {

                var BImehKind = $.trim($("#drpdwnBimehKindEdit").val());
                var NumberBimeh = $.trim($("#txtEditBimehNumber").val());
                var CodeGargah = $.trim($("#txtEditCodeGargah").val());
                var GargahName = $.trim($("#txtEditCargahName").val());
                var StartBimeDate = $.trim($("#pcaldateStartBimehEdit").val());
                var EndBimeDate = $.trim($("#pcaldateEndBimehEdit").val());

                if (NumberBimeh == "" || CodeGargah == "" || GargahName == "" || ((BImehKind == 1 && (StartBimeDate == "" || EndBimeDate == "")) || (BImehKind == 2 && StartBimeDate == ""))) {
                    ShowAlert("لطفا اطلاعات را وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(NumberBimeh)) {
                    ShowAlert("شماره بیمه باید عددی باشد !");
                    return;
                }
                else if (!numbericFild.test(CodeGargah)) {
                    ShowAlert("کد کارگاه باید عددی باشد !");
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
                        data: { i: 8, code: code, BImehKind: BImehKind, NumberBimeh: NumberBimeh, CodeGargah: CodeGargah, GargahName: GargahName, StartBimeDate: StartBimeDate, EndBimeDate: EndBimeDate },
                        url: "/PostBack/PBMaliAndBimeh.ashx",
                        success: function (data) {
                            $("#Loading").fadeOut();
                            $("#CheckOut").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات بیمه پرسنل با موفقیت بروزرسانی شده است");

                                $("#trBimehNUmberBimehRow" + row).html(NumberBimeh);
                                $("#trBimehKargahNameRow" + row).html(GargahName);
                                $("#trBimehKargahCodeRow" + row).html(CodeGargah);
                                $("#trdateStartRow" + row).html(StartBimeDate);
                                $("#trdateEndRow" + row).html((EndBimeDate == null || EndBimeDate == "" ? "--" : EndBimeDate));
                                $("#trstatusRow" + row).html(BImehKind);
                                $("#trstatusNameRow" + row).html((BImehKind == 1 ? "<font style='color:#ff0000;'>قبل از استخدام</font>" : BImehKind == 2 ? "<font style='color:green;'>بعد از استخدام" : "--"));
                            }
                            else if (data == "2") {
                                ShowAlert("اطلاعات بیمه مشخص شده از این پرسنل یافت نشده است !");
                                $(this).dialog("close");
                            }
                            else if (data == "3") {
                                ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                            }

                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#Loading").fadeOut();
                            $("#CheckOut").fadeOut();
                            ShowAlert("خطا در هنگام ثبت ، لطفا مجددا تلاش کنید.");
                        }
                    });
                }
            }
        }
    });
    $("#pnlEDitBimeInfo").dialog("open");
}
//=========================================================================================
//=========================================edit Bank info======================================
//=========================================================================================
function EditBankInfo(row, code) {

    $("#tdeditpersonelcodeBank").html($("#trBankPersonCode" + row).html().trim());
    $("#tdeditpersonelnameBank").html($("#trBankPersonName" + row).html().trim());
    $("#tdeditpersonelworkGroupBank").html($("#trBankWorkGroup" + row).html().trim());
    $("#drpdwnEditBankName").val($("#trBankBankName" + row).html().trim());
    $("#txtEditNumberAccont").val($("#trBankAccNumber" + row).html().trim());
    var sheba = $("#trBankSheba" + row).html().trim().replaceAll("IR", "");
    $("#txtEditShebaBank1").val(sheba.split('-')[0]);
    $("#txtEditShebaBank2").val(sheba.split('-')[1]);
    $("#txtEditShebaBank3").val(sheba.split('-')[2]);
    $("#txtEditShebaBank4").val(sheba.split('-')[3]);
    $("#txtEditShebaBank5").val(sheba.split('-')[4]);
    $("#txtEditShebaBank6").val(sheba.split('-')[5]);
    $("#txtEditShebaBank7").val(sheba.split('-')[6]);
    var cartNumber = $("#trBankCartNumber" + row).html().trim();
    $("#txtEditCartNumberBank1").val(cartNumber.split('-')[0]);
    $("#txtEditCartNumberBank2").val(cartNumber.split('-')[1]);
    $("#txtEditCartNumberBank3").val(cartNumber.split('-')[2]);
    $("#txtEditCartNumberBank4").val(cartNumber.split('-')[3]);

    $("#pnlEDitBankInfo").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش اطلاعات حساب",
        width: 450,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بروزرسانی اطلاعات": function () {
                var NumberAccont = $.trim($("#txtEditNumberAccont").val());
                var BankName = $("#drpdwnEditBankName").val();
                var ShebaBank1 = $.trim($("#txtEditShebaBank1").val());
                var ShebaBank2 = $.trim($("#txtEditShebaBank2").val());
                var ShebaBank3 = $.trim($("#txtEditShebaBank3").val());
                var ShebaBank4 = $.trim($("#txtEditShebaBank4").val());
                var ShebaBank5 = $.trim($("#txtEditShebaBank5").val());
                var ShebaBank6 = $.trim($("#txtEditShebaBank6").val());
                var ShebaBank7 = $.trim($("#txtEditShebaBank7").val());
                var CartNumberBank1 = $.trim($("#txtEditCartNumberBank1").val());
                var CartNumberBank2 = $.trim($("#txtEditCartNumberBank2").val());
                var CartNumberBank3 = $.trim($("#txtEditCartNumberBank3").val());
                var CartNumberBank4 = $.trim($("#txtEditCartNumberBank4").val());

                var ShebaBank = "IR" + $.trim($("#txtEditShebaBank1").val()) + "-" + $.trim($("#txtEditShebaBank2").val()) + "-" + $.trim($("#txtEditShebaBank3").val()) + "-" + $.trim($("#txtEditShebaBank4").val()) + "-" + $.trim($("#txtEditShebaBank5").val()) + "-" + $.trim($("#txtEditShebaBank6").val()) + "-" + $.trim($("#txtEditShebaBank7").val());
                var CartNumberBank = $.trim($("#txtEditCartNumberBank1").val()) + "-" + $.trim($("#txtEditCartNumberBank2").val()) + "-" + $.trim($("#txtEditCartNumberBank3").val()) + "-" + $.trim($("#txtEditCartNumberBank4").val());
                if (NumberAccont == "" || $.trim($("#txtEditShebaBank1").val()) == "" || $.trim($("#txtEditShebaBank2").val()) == "" || $.trim($("#txtEditShebaBank3").val()) == ""
                    || $.trim($("#txtEditShebaBank4").val()) == "" || $.trim($("#txtEditShebaBank5").val()) == "" || $.trim($("#txtEditShebaBank6").val()) == "" || $.trim($("#txtEditShebaBank7").val()) == ""
                    || $.trim($("#txtEditCartNumberBank1").val()) == "" || $.trim($("#txtEditCartNumberBank2").val()) == "" || $.trim($("#txtEditCartNumberBank3").val()) == "" || $.trim($("#txtEditCartNumberBank4").val()) == "") {
                    ShowAlert("لطفا اطلاعات را وارد نمایید!");
                    return;
                }
                else if (ShebaBank1 == "" || ShebaBank1.length < 2) {
                    ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(ShebaBank4)) {
                    ShowAlert("شماره شبا باید عددی باشد !");
                    return;
                }
                else if (ShebaBank2 == "" || ShebaBank2.length < 4) {
                    ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(ShebaBank2)) {
                    ShowAlert("شماره شبا باید عددی باشد !");
                    return;
                }
                else if (ShebaBank3 == "" || ShebaBank3.length < 4) {
                    ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(ShebaBank3)) {
                    ShowAlert("شماره شبا باید عددی باشد !");
                    return;
                }
                else if (ShebaBank4 == "" || ShebaBank4.length < 4) {
                    ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(ShebaBank4)) {
                    ShowAlert("شماره شبا باید عددی باشد !");
                    return;

                }
                else if (ShebaBank5 == "" || ShebaBank5.length < 4) {
                    ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(ShebaBank5)) {
                    ShowAlert("شماره شبا باید عددی باشد !");
                    return;

                }
                else if (ShebaBank6 == "" || ShebaBank6.length < 4) {
                    ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(ShebaBank6)) {
                    ShowAlert("شماره شبا باید عددی باشد !");
                    return;

                }
                else if (ShebaBank7 == "" || ShebaBank7.length < 2) {
                    ShowAlert("لطفا اطلاعات شبا را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(ShebaBank7)) {
                    ShowAlert("شماره شبا باید عددی باشد !");
                    return;

                }
                else if (CartNumberBank1 == "" || CartNumberBank1.length < 4) {
                    ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
                    return;

                }
                else if (!numbericFild.test(CartNumberBank1)) {
                    ShowAlert("شماره کارت باید عددی باشد !");
                    return;
                }
                else if (CartNumberBank2 == "" || CartNumberBank2.length < 4) {
                    ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(CartNumberBank2)) {
                    ShowAlert("شماره کارت باید عددی باشد !");
                    return;

                }
                else if (CartNumberBank3 == "" || CartNumberBank3.length < 4) {
                    ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(CartNumberBank3)) {
                    ShowAlert("شماره کارت باید عددی باشد !");
                    return;

                }
                else if (CartNumberBank4 == "" || CartNumberBank4.length < 4) {
                    ShowAlert("لطفا اطلاعات کارت بانکی را به درستی وارد نمایید!");
                    return;
                }
                else if (!numbericFild.test(CartNumberBank4)) {
                    ShowAlert("شماره کارت باید عددی باشد !");
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
                        data: { i: 9, code: code, NumberAccont: NumberAccont, BankName: BankName, ShebaBank: ShebaBank, CartNumberBank: CartNumberBank },
                        url: "/PostBack/PBMaliAndBimeh.ashx",
                        success: function (data) {
                            $("#Loading").fadeOut();
                            $("#CheckOut").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات حساب پرسنل با موفقیت بروزرسانی شده است");
                                $("#trBankBankName" + row).html(BankName);
                                $("#trBankAccNumber" + row).html(NumberAccont);
                                $("#trBankSheba" + row).html(ShebaBank);
                                $("#trBankCartNumber" + row).html(CartNumberBank);
                            }
                            else if (data == "2") {
                                ShowAlert("اطلاعات حساب مشخص شده پرسنل یافت نشد !");
                                $(this).dialog("close");
                            }
                            else if (data == "3") {
                                ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#Loading").fadeOut();
                            $("#CheckOut").fadeOut();
                            ShowAlert("خطا در هنگام ثبت ، لطفا مجددا تلاش کنید.");
                        }
                    });
                }
            }
        }
    });
    $("#pnlEDitBankInfo").dialog("open");
}
//=========================================================================================
//==========================================check kardan kasani ke shomare hesab nadaran ===============================================
//=========================================================================================
function rptCheckMali() {
    $("#DivExcelMali").hide();
    $("#titleMali").html("* مرتب سازی براساس ،کد پرسنلی می باشد <br/> * نمایش پرسنلی که هنوز شماره حساب آنها در سیستم تعریف نشده است");

    var personelcode = $.trim($("#txtReportMaliPersonelCode").val());
    var name = $.trim($("#txtReportMaliPersonelName").val());
    var mellicode = $.trim($("#txtReportMaliPersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkGroupPersonelMaliInfo").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkGroupPersonelMaliInfo").val() + "\"";


    $("#ResultDivPersonelMali").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonelMali").show();
    var header = "<table id='tblReportCheckBankAccount' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td >{personelcode}</td><td>{name}</td><td>{workgroup}</td></tr>";
    var footer = "</tbody></table>";

    var row = ""; var allrow = "";
    var t = 0;

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 10, personelcode: personelcode, grohkari: grohkari, name: name, mellicode: mellicode },
        url: "PostBack/PBMaliAndBimeh.ashx",
        success: function (data) {
            var i = 1;
            $.each(data, function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{workgroup}", this['strWorkGroupName'] == null ? "نامشخص" : this['strWorkGroupName']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
            });

            if (t == 1) {

                $("#ResultDivPersonelMali").html(header + header2 + allrow + footer);
                $("#DivExcelMali").show();
            }
            else {
                $("#ResultDivPersonelMali").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivExcelMali").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelMali").html("");
            $("#ResultDivPersonelMali").hide();
            $("#DivExcelMali").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//=========================================================================================
//==========================================check kardan kasani ke bimeh nadaran ===============================================
//=========================================================================================
function rptCheckBimeh() {
    $("#DivExcelBimeh").hide();
    $("#titleBimeh").html("* مرتب سازی براساس ،کد پرسنلی می باشد <br/> * نمایش پرسنلی که هنوز بیمه نشده اند");


    var personelcode = $.trim($("#txtReportBimehPersonelCode").val());
    var mellicode = $.trim($("#txtReportBimehMelliCode").val());
    var bimehKind = $.trim($("#drpdwnBimehKindSearch").val());
    var PersonelName = $.trim($("#txtReportBimehPersonelName").val());
    var grohkari = $.trim($("#drpdwnWorkGroupPersonelBimehInfo").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkGroupPersonelBimehInfo").val() + "\"";

    if (bimehKind != 2) {
        ShowAlert("لطفا نوع بیمه را بعد از استخدام در شرکت انتخاب نمایید!");
        return;
    }

    $("#ResultDivPersonelBimeh").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonelBimeh").show();
    var header = "<table id='tblReportCheckBimeh' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td >{personelcode}</td><td>{name}</td><td>{workgroup}</td></tr>";
    var footer = "</tbody></table>";

    var row = ""; var allrow = "";
    var t = 0;

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 11, personelcode: personelcode, grohkari: grohkari, mellicode: mellicode, PersonelName: PersonelName, bimehKind: bimehKind },
        url: "PostBack/PBMaliAndBimeh.ashx",
        success: function (data) {
            var i = 1;
            $.each(data, function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{workgroup}", this['strWorkGroupName'] == null ? "نامشخص" : this['strWorkGroupName']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
            });

            if (t == 1) {

                $("#ResultDivPersonelBimeh").html(header + header2 + allrow + footer);
                $("#DivExcelBimeh").show();
            }
            else {
                $("#ResultDivPersonelBimeh").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivExcelBimeh").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelBimeh").html("");
            $("#ResultDivPersonelBimeh").hide();
            $("#DivExcelBimeh").hide();
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