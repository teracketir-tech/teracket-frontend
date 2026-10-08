$(document).ready(function () {

    $("#divPersonelTabs,#divPersonelrpt,#divPersonelMosaede,#divPersonelVam,#divPersonelPadash,#divPersonelFaraiand").tabs();
    GetTabsDeActive("divPersonelTabs");

    $("#monthlblKarkardPriceDate").hide();
    $("#daylblKarkardPriceDate").hide();

    $("#monthlblReportDescYear").hide();
    $("#daylblReportDescYear").hide();

    $("#monthlblReportKosorYear").hide();
    $("#daylblReportKosorYear").hide();

    $("#monthlblDatePadashDate").hide();
    $("#daylblDatePadashDate").hide();

    $("#monthlblSearchPadashDate").hide();
    $("#daylblSearchPadashDate").hide();

    $("#monthlblMosaedeDate").hide();
    $("#daylblMosaedeDate").hide();

    $("#monthlblSearchMosaedeDate").hide();
    $("#daylblSearchMosaedeDate").hide();

    $("#monthlblFaraiandKarkardhDate").hide();
    $("#daylblFaraiandKarkardhDate").hide();


    GetDrpdwnBaseAll();

    $("#btnReportPersonelSearch").click(function () { GetReportInfoPersonel(1); return false; });
    // GetReportInfoPersonel(1);

    $("#btnReportReportDescPersonelSearch").click(function () { GetReportDescInfoPersonel(1); return false; });
    // GetReportDescInfoPersonel(1);

    $("#btnReportReportKosorPersonelSearch").click(function () { GetReportKosorInfoPersonel(1); return false; });
    // GetReportKosorInfoPersonel(1);

    $("#btnSaveMosaede").click(function () { saveMosaede(); return false; });
    $("#btnReportMosaedePersonelSearch").click(function () { rptMosaede(1); return false; });

    $("#btnSaveVam").click(function () { saveVam(); return false; });
    $("#btnReportVamPersonelSearch").click(function () { rptVam(1); return false; });

    $("#btnSavePadash").click(function () { savePadash(); return false; });
    $("#btnReportPadashPersonelSearch").click(function () { rptPadash(1); return false; });

    $("#btnPersonelPreInvoiceSearch").click(function () { GetAllPreInvoice(); return false; });
    $("#btnPreSaveHoghoghPersonel").click(function () { PreSaveHoghogh(); return false; });

    $("#btnSaveFinalHoghoghPersonel").click(function () { SaveFinalHoghogh(); return false; });
    $("#btnPersonelGetAllInvoiceSearch").click(function () { ShowAllFinalHoghogh(1); return false; });

    $("#PrintAllHoghogh").click(function () { PrintAllHoghoghPersonel(); return false; });
    $("#PrintAllFishHoghogh").click(function () { PrintAllFishHoghoghPersonel(); return false; });
    $("#ReCalcHoghogh").click(function () { ReCalcHoghogh(); return false; });
    $("#DeleteCalcHoghogh").click(function () { DeleteCalcHoghogh(); return false; });
    $("#btnReportCheckKarkardMonthlyPersonelSearch").click(function () { CheckKarkarMahaneForHoghgh(); return false; });

    $("#ReCalcFaraind").click(function () { ReCalcFaraiand(); return false; });
    $("#DeleteCalcFaraind").click(function () { DeleteCalcFaraiand(); return false; });

    $("#btnExcelReportDescPersonelSearch").click(function () { tableToExcel('tblReportDesc'); return false; });
    $("#btnExcelReportKosorPersonelSearch").click(function () { tableToExcel('tblReportKosor'); return false; });
    $("#btnExcelReportPersonelSearch").click(function () { tableToExcel('tblReportDastmozd'); return false; });

    $("#btnExcelReportVarizHoghogh1").click(function () { tableToExcel('tblVarizHoghogh1'); return false; });
    $("#btnExcelReportVarizHoghogh2").click(function () { tableToExcel('tblVarizHoghogh2'); return false; });
    $("#btnExcelReportVarizHoghogh3").click(function () { tableToExcel('tblVarizHoghogh3'); return false; });

    $("#btnExcelCheckKarkardhoghgh").click(function () { tableToExcel('tblCheckkarkardHoghogh'); return false; });

    $("#btnExcelReportVarizFaraind1").click(function () { tableToExcel('tblVarizFaraiand1'); return false; });
    $("#btnExcelReportVarizFaraind2").click(function () { tableToExcel('tblVarizFaraiand2'); return false; });
    $("#btnExcelReportVarizFaraind3").click(function () { tableToExcel('tblVarizFaraiand3'); return false; });

    $("#btnPreSaveFaraindPersonel").click(function () { PreSaveFaraind(); return false; });
    $("#btnReportCalcShowFaraiand").click(function () { rptPersonelFaraiandProject(1); return false; });
    $("#btnPersonelPreFaraiandSearch").click(function () { GetAllPreFaraind(1); return false; });
    $("#btnSaveFinalFaraindPersonel").click(function () { SaveFinalFaraind(); return false; });
    $("#btnPersonelGetAllFaraiandSearch").click(function () { ShowAllFinalFaraind(1); return false; });
    $("#btnReportCheckFaraiandPersonelSearch").click(function () { CheckListPersonelFaraiandi(); return false; });
    $("#btnExcelCheckKarkardFaraind").click(function () { tableToExcel('tblCheckListpersonelFaraiandi'); return false; });
    $("#PrintAllFaraind").click(function () { PrintAllPersonelFaraiandi(); return false; });

    $("#btnSetKarkardProjecti").click(function () { SetKarkardSefr(); return false; });

    $("#txtVamAghsatMonth").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            GetPriceGhest();
            return false;
        }
    });
    $("#txtPriceVam").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            GetPriceGhest();
            return false;
        }
    });

    $("#btnReportReportPricePersonelSearch").click(function () { rptPersonelhoghogh(1); return false; });


    var objCal1 = new AMIB.persianCalendar('pcaldateStartjobUpFile', {
        extraInputID: 'pcaldateStartjobUpFile',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal2 = new AMIB.persianCalendar('pcaldateEndjobUpFile', {
        extraInputID: 'pcaldateEndjobUpFile',
        extraInputFormat: 'yyyy/mm/dd'
    });

    CheckPreFaraind();
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
        url: "PostBack/PBPersonelCalcutPrice.ashx",
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
    selectStart3 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' onchange='CheckPreInvoice();'>";
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
        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnWorkJobKind");
        $("#tddrpdwnWorkJobKind").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkJobKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnWorkReportDescJobKind");
        $("#tddrpdwnWorkReportDescJobKind").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkReportDescJobKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnWorkReportKosorJobKind");
        $("#tddrpdwnWorkReportKosorJobKind").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkReportKosorJobKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });


        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnWorkReportPriceJobKind");
        $("#tddrpdwnWorkReportPriceJobKind").html(selectTemp + allrow + selectEnd);
        $("#drpdwnWorkReportPriceJobKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnSearchWorkJobKindFaraiand");
        $("#tddrpdwnSearchWorkJobKindFaraiand").html(selectTemp + allrow + selectEnd);
        $("#tddrpdwnSearchWorkJobKindFaraiand").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });


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
        $("#divdrpdwnContractKind").html(selectTemp + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnContractKindKosor");
        $("#divdrpdwnContractKindKosor").html(selectTemp + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnContractKindReportDesc");
        $("#divdrpdwnContractKindReportDesc").html(selectTemp + allrow + selectEnd);

        //$("#drpdwnContractKind").multiselect({ minWidth: '164', noneSelectedText: 'همه قرارداد ها' });
    }

    CheckPreInvoice();
}
//---------------------------------------------------------------------------------
///=========================== گزارش دستمزد و جریمه =========================
//---------------------------------------------------------------------------------
function GetReportInfoPersonel(vpage) {
    var personelcode = $.trim($("#txtReportPersonelCode").val());
    var name = $.trim($("#txtReportPersonelName").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCode").val());
    var WorkJob = $.trim($("#drpdwnWorkJobKind").val());
    WorkJob = WorkJob == null || WorkJob == undefined || WorkJob == '' ? "-1" : "\"" + $("#drpdwnWorkJobKind").val() + "\"";

    $("#ResultDivPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonel").show();
    var header = "<table id='tblReportDastmozd' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th>" +
                  "<th align='center'>نام و نام خانوادگی</th><th>گروه کاری</th><th align='center'>دستمزد ماهیانه (ریال)</th>" +
                  "<th align='center'>دستمزد روزانه (ریال)</th><th>مزد ساعتی (ریال)</th><th>حق اضافه کار/ویژه/در ماموریت (ریال)</th>" +
                  "<th>حق جمعه کار (ریال)</th><th>حق تعطیل کار (ریال)</th><th>حق ماموریت (ریال)</th><th>جریمه تاخیر (ریال)</th>" +
                  "<th>جریمه تعجیل (ریال)</th><th>جریمه غیبت (ریال)</th><th>جریمه خروج غیر مجاز (ریال)</th><th>جریمه مرخصی بدون حقوق/دانشجویی (ریال)</th>" +
                  "</thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td id='tdpersonelcodeDastmozd{Row}'>{personelcode}</td><td>{name}</td><td>{workgroup}</td>" +
                 "<td>{priceKol}</td><td>{priceRozane}</td><td>{Mozdsaati}</td><td>{ezafekar}</td><td>{jomehkar}</td><td>{tatilkar}</td>" +
                 "<td>{mamoriat}</td><td>{takhir}</td><td>{tajil}</td><td>{ghibat}</td><td>{khorojGhireMojz}</td><td>{MorakhasibiHoghogh}</td></tr>";
    var footer = "</tbody></table></td></tr><tr><td>";
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
    var endfooter = "</td></tr></p>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "1000";
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
        data: { i: 2, personelcode: personelcode, name: name, mellicode: mellicode, WorkJob: WorkJob, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var pricesalary = 0;
            var PriceMorakhasiBihoghogh = 0;
            var priceRozane = 0;
            var priceSaati = 0;
            var priceRozaneBiHoghogh = 0;
            var priceSaatiBiHoghogh = 0;
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));

                pricesalary = this['numPersonelSalary'];
                priceRozane = parseInt(pricesalary) / 30;
                priceSaati = priceRozane / 7.33;

                row = row.replaceAll("{priceKol}", addCommas(Math.round(pricesalary)));
                row = row.replaceAll("{priceRozane}", addCommas(Math.round(priceRozane)));
                row = row.replaceAll("{Mozdsaati}", addCommas(Math.round(priceSaati)));
                row = row.replaceAll("{ezafekar}", addCommas(Math.round(priceSaati * 1.4)));
                row = row.replaceAll("{jomehkar}", addCommas(Math.round(priceSaati * 1.8)));
                row = row.replaceAll("{tatilkar}", addCommas(Math.round(priceSaati * 1.4)));
                row = row.replaceAll("{mamoriat}", addCommas(Math.round(priceRozane)));
                row = row.replaceAll("{takhir}", addCommas(Math.round(priceSaati * 1.4)));
                row = row.replaceAll("{tajil}", addCommas(Math.round(priceSaati * 1.4)));
                row = row.replaceAll("{ghibat}", addCommas(Math.round(priceRozane * 2)));
                row = row.replaceAll("{khorojGhireMojz}", addCommas(Math.round(priceSaati * 1.4)));

                PriceMorakhasiBihoghogh = this['morakhasiBihoghoghSalary'];
                priceRozaneBiHoghogh = parseInt(PriceMorakhasiBihoghogh) / 30;
                priceSaatiBiHoghogh = priceRozaneBiHoghogh; /// 7.33;
                row = row.replaceAll("{MorakhasibiHoghogh}", addCommas(Math.round(priceSaatiBiHoghogh)));

                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{Row}", i);
                allrow = allrow + row;
                i++;
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
                $("#ResultDivPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonel").html(allpage);
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
//---------------------------------------------------------------------------------
///=========================== گزارش شرح پرداخت =========================
//---------------------------------------------------------------------------------
function GetReportDescInfoPersonel(vpage) {
    var personelcode = $.trim($("#txtReportDescPersonelCode").val());
    var name = $.trim($("#txtReportDescPersonelName").val());
    var mellicode = $.trim($("#txtReportDescPersonelMelliCode").val());
    var WorkJob = $.trim($("#drpdwnWorkReportDescJobKind").val());
    WorkJob = WorkJob == null || WorkJob == undefined || WorkJob == '' ? "-1" : "\"" + $("#drpdwnWorkReportDescJobKind").val() + "\"";

    var contractKind = $.trim($("#drpdwnContractKindReportDesc").val());

    var month = $.trim($("#drpdwnReportDescPriceJob").val());
    var year = $.trim($("#yearlblReportDescYear").val());
    if (month == -1) {
        ShowAlert("ماه کارکرد باید مشخص شود !");
        return;
    }

    $("#ResultDivReportDescPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportDescPersonel").show();
    var header = "<table id='tblReportDesc' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";

    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                  "<th>گروه کاری</th><th align='center' {style}>حق اولاد (ریال)</th><th align='center' {style}>حق مسکن (ریال)</th>" +
                  "<th {style}>بن خواروبار (ریال)</th><th {style1}>پرداختی اضافه کار (ریال)</th><th {style1}>پرداختی جمعه کار (ریال)</th>" +
                  "<th {style1}>پرداختی تعطیل کار (ریال)</th><th {style1}> ماموریت (ریال)</th><th {style1}>{titleFaraiand}</th><th>پاداش (ریال)</th>" +
                  "<th>معوقه (ریال)</th><th>کمک ایاب و ذهاب  (ریال)</th><th {style1}>حق مسئولیت  (ریال)</th><th {style1}>عیدی  (ریال)</th>" +
                  "<th {style}>حق سنوات  (ریال)</th><th {style}>جبران کارکرد ماه 31 روزه  (ریال)</th></thead><tbody>";

    var mainrow = "<tr><td>{Row}</td><td id='tdpersonelcode{Row}'>{personelcode}</td><td>{name}</td><td>{workgroup}</td>" +
                  "<td {style}>{olad}</td><td {style}>{maskan}</td><td {style}>{kharobar}</td><td {style1}>{ezafekar}</td>" +
                  "<td {style1}>{jomehkar}</td><td {style1}>{tatilkar}</td><td {style1}>{mamoriat}</td><td {style1}>{padash}</td>" +
                  "<td>{padashsaier}</td><td>{moavaghe}</td><td>{ayabzahab}</td><td {style1}>{modiriat}</td><td {style1}>{eidi}</td>" +
                  "<td {style}>{sanavat}</td><td {style}>{31roz}</td></tr>";

    var footer = "</tbody></table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportDescInfoPersonel(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelDesc' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelDesc' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportDescInfoPersonel({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></p>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "1000";
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
        data: { i: 3, personelcode: personelcode, contractKind: contractKind, name: name, mellicode: mellicode, WorkJob: WorkJob, page: vpage, perpage: vperpage, month: month, year: year },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var pricesalary = 0;
            var priceRozane = 0;
            var priceSaati = 0;
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));

                pricesalary = this['numPersonelSalary'];
                priceRozane = parseInt(pricesalary) / 30;
                priceSaati = priceRozane / 7.33;

                row = row.replaceAll("{olad}", addCommas(this['numPersonelChildSalary']));
                row = row.replaceAll("{maskan}", addCommas(this['numPersonelHomeSalary']));
                row = row.replaceAll("{kharobar}", addCommas(this['numPersonelBon']));
                row = row.replaceAll("{ezafekar}", addCommas(this['ezafekar']));
                row = row.replaceAll("{jomehkar}", addCommas(this['jomekar']));
                row = row.replaceAll("{tatilkar}", addCommas(this['tatilkar']));
                row = row.replaceAll("{mamoriat}", addCommas(this['mamoriat']));
                row = row.replaceAll("{padash}", addCommas(this['padash']));
                row = row.replaceAll("{padashsaier}", addCommas(this['padashsaier']));
                row = row.replaceAll("{moavaghe}", addCommas(this['Moavaghe']));

                row = row.replaceAll("{ayabzahab}", addCommas(this['ayabzahab']));
                row = row.replaceAll("{modiriat}", addCommas(this['haghmodiriat']));
                row = row.replaceAll("{31roz}", addCommas(this['mah31roz']));
                
                row = row.replaceAll("{eidi}", addCommas(this['eidi']));
                row = row.replaceAll("{sanavat}", addCommas(this['sanavat']));
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{Row}", i);
                if (contractKind == "3") {
                    row = row.replaceAll("{style}", "style='display:none;'");
                    row = row.replaceAll("{style1}", "");
                }
                else if (contractKind == "1") {
                    row = row.replaceAll("{style}", "");
                    row = row.replaceAll("{style1}", "");
                }
                else if (contractKind == "2") {
                    row = row.replaceAll("{style}", " style='display:none;'");
                    row = row.replaceAll("{style1}", " style='display:none;'");
                }
                allrow = allrow + row;
                i++;
                t = 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportDescInfoPersonel(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportDescInfoPersonel(" + nextPage + ")");
            }
            if (t == 1) {
                if (contractKind == "3" || contractKind == "1") {
                    header2 = header2.replaceAll("{style}", contractKind == 3 ? " style='display:none;'" : "");
                    header2 = header2.replaceAll("{titleFaraiand}", contractKind == 3 ? "حق الزحمه فرآیند (ریال)" : "پاداش ارزیابی عملکرد (ریال)");
                }
                else if (contractKind == "2") {
                    header2 = header2.replaceAll("{style}", " style='display:none;'");
                    header2 = header2.replaceAll("{style1}", " style='display:none;'");
                    header2 = header2.replaceAll("{titleFaraiand}", "پاداش ارزیابی عملکرد (ریال)");
                }

                $("#ResultDivReportDescPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonelDesc").html(allpage);
            }
            else {
                $("#ResultDivReportDescPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportDescPersonel").html("");
            $("#ResultDivReportDescPersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== ثبت مساعده =========================
//---------------------------------------------------------------------------------
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
function saveMosaede() {
    var personelcode = $.trim($("#txtMosaedePersonelCode").val());
    var price = $.trim($("#txtPriceMosaede").val());
    var month = $.trim($("#drpdwnMosaedePriceJob").val());
    var year = $.trim($("#yearlblMosaedeDate").val());

    if (personelcode == "" || price == "") {
        ShowAlert("لطفا اطلاعات خواسته شده را تکمیل نمایید!");
        return;
    }
    price = parseInt(price.replaceAll(",", ""));
    if (personelcode == "") {
        ShowAlert("لطفا کد پرسنلی را وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(personelcode)) {
        ShowAlert("کد پرسنلی عددی می باشد");
        return;
    }
    else if (!numbericFild.test(price)) {
        ShowAlert("مبلغ مساعده عددی می باشد");
        return;
    }
    else if (price == "0") {
        ShowAlert("مبلغ مساعده نباید صفر باشد!");
        return;
    }
    else if (parseInt(price) > 50000000) {
        ShowAlert("مبلغ مساعده نباید بیشتر از پنج میلیون تومان باشد!");
        return;
    }
    else if (month == -1) {
        ShowAlert("ماه ثبت مساعده باید مشخص شود !");
        return;
    }
    else {
        $("#Note").html("آیا از ثبت مساعده اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "ثبت مساعده",
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
                    $.ajax({
                        type: "POST",
                        async: true,
                        cache: false,
                        dataType: "json",
                        data: { i: 4, personelcode: personelcode, price: price, month: month, year: year },
                        url: "PostBack/PBPersonelCalcutPrice.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#txtMosaedePersonelCode").val("");
                                $("#txtPriceMosaede").val("");
                                $("#drpdwnMosaedePriceJob").val("-1");

                            }
                            else if (data == "2") {
                                ShowAlert("کد پرسنلی نامعتبر می باشد");
                            }
                            else if (data == "3") {
                                ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                            }
                            else if (data == "4") {
                                ShowAlert("این پرسنل در این سال و ماه مساعده تسویه نشده دارد!");
                            }
                            else if (data == "5") {
                                ShowAlert("مبلغ مساعده از مبلغ حقوق دریافتی این پرسنل بیشتر می باشد!");
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                        }
                    });
                    $(this).dialog("close");
                }
            }
        });
        $("#Note").dialog("open");
    }
}
//---------------------------------------------------------------------------------
///=========================== گزارش مساعده =========================
//---------------------------------------------------------------------------------
function rptMosaede(vpage) {
    var personelcode = $.trim($("#txtReportMosaedePersonelCode").val());
    var name = $.trim($("#txtReportMosaedePersonelName").val());
    var mellicode = $.trim($("#txtReportMosaedePersonelMelliCode").val());
    var DateFrom = "";// $("#yearlblDateFromMosaede").val() + "/" + $("#monthlblDateFromMosaede").val() + "/" + $("#daylblDateFromMosaede").val();
    var DateTo = "";// $("#yearlblDateToMosaede").val() + "/" + $("#monthlblDateToMosaede").val() + "/" + $("#daylblDateToMosaede").val();
    var status = $.trim($("#drpdwnStatusMosaede").val());
    var month = $.trim($("#drpdwnSearchMosaedePriceJob").val());
    var year = $.trim($("#yearlblSearchMosaedeDate").val());

    $("#ResultDivMosaedePersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivMosaedePersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>سال</th><th align='center'>ماه</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>مبلغ مساعده (ریال)</th><th align='center'>تاریخ ثبت</th><th align='center'>وضعیت مساعده</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{sal}</td><td>{mah}</td><td>{personelcode}</td><td>{name}</td><td>{price}</td><td>{dateregister}</td><td>{status}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='rptMosaede(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerMosaedePPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountMosaedePersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptMosaede({lastpage})'>" +
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
        data: { i: 5, personelcode: personelcode, month: month, year: year, name: name, status: status, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{price}", addCommas(this['numPriceMosaede']));
                row = row.replaceAll("{dateregister}", this['dateRegisterDate']);
                row = row.replaceAll("{status}", this['numStatus'] == "0" ? "<font style='color:red;'>تسویه نشده</font>" : "<font style='color:green;'>تسویه شده</font>");
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{sal}", this['numYear']);
                row = row.replaceAll("{mah}", this['Monthname']);
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptMosaede(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptMosaede(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivMosaedePersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountMosaedePersonel").html(allpage);
            }
            else {
                $("#ResultDivMosaedePersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivMosaedePersonel").html("");
            $("#ResultDivMosaedePersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== ثبت وام =========================
//---------------------------------------------------------------------------------
function saveVam() {
    var personelcode = $.trim($("#txtVamPersonelCode").val());
    var pricevame = $.trim($("#txtPriceVam").val());
    var countGhest = $.trim($("#txtVamAghsatMonth").val());
    var PriceVamMontly = $.trim($("#txtPriceVamMontly").val());

    if (personelcode == "" || pricevame == "" || countGhest == "") {
        ShowAlert("لطفا اطلاعات خواسته شده را تکمیل نمایید!");
        return;
    }
    pricevame = parseInt(pricevame.replaceAll(",", ""));
    PriceVamMontly = parseInt(PriceVamMontly.replaceAll(",", ""));

    if (!numbericFild.test(personelcode)) {
        ShowAlert("کد پرسنلی عددی می باشد");
        return;
    }
    else if (!numbericFild.test(pricevame)) {
        ShowAlert("مبلغ وام باید عددی می باشد");
        return;
    }
    else if (pricevame == "0") {
        ShowAlert("مبلغ وام نباید صفر باشد!");
        return;
    }
    else if (parseInt(pricevame) > 100000000) {
        ShowAlert("مبلغ وام نباید بیشتر از ده میلیون تومان باشد!");
        return;
    }
    else if (countGhest == "0") {
        ShowAlert("تعداد قسط نباید صفر باشد!");
        return;
    }
    else if (!numbericFild.test(countGhest)) {
        ShowAlert("تعداد قسط باید عددی باشد!");
        return;
    }
    else {
        $("#Note").html("آیا از ثبت وام اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "ثبت وام",
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
                    $.ajax({
                        type: "POST",
                        async: true,
                        cache: false,
                        dataType: "json",
                        data: { i: 6, personelcode: personelcode, pricevame: pricevame, countGhest: countGhest, PriceVamMontly: PriceVamMontly },
                        url: "PostBack/PBPersonelCalcutPrice.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#txtVamPersonelCode").val("");
                                $("#txtPriceVam").val("");
                                $("#txtVamAghsatMonth").val("");
                                $("#txtPriceVamMontly").val("0");
                            }
                            else if (data == "2") {
                                ShowAlert("کد پرسنلی نامعتبر می باشد");
                            }
                            else if (data == "3") {
                                ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                            }
                            else if (data == "4") {
                                ShowAlert("این پرسنل وام تسویه نشده دارد!");
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                        }
                    });
                    $(this).dialog("close");
                }
            }
        });
        $("#Note").dialog("open");
    }
}
//---------------------------------------------------------------------------------
///=========================== گزارش وام =========================
//---------------------------------------------------------------------------------
function rptVam(vpage) {
    var personelcode = $.trim($("#txtReportVamPersonelCode").val());
    var name = $.trim($("#txtReportVamPersonelName").val());
    var mellicode = $.trim($("#txtReportVamPersonelMelliCode").val());
    var DateFrom = $("#yearlblDateFromVam").val() + "/" + $("#monthlblDateFromVam").val() + "/" + $("#daylblDateFromVam").val();
    var DateTo = $("#yearlblDateToVam").val() + "/" + $("#monthlblDateToVam").val() + "/" + $("#daylblDateToVam").val();
    var status = $.trim($("#drpdwnStatusVam").val());

    $("#ResultDivVamPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivVamPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>مبلغ کل وام (ریال)</th><th align='center'>تعداد کل اقساط</th><th align='center'>مبلغ هر قسط (ریال)</th><th align='center'>تعداد اقساط پرداخت شده</th><th align='center'>تعداد اقساط باقی مانده</th><th align='center'>مانده وام (ریال)</th><th align='center'>وضعیت وام</th><th align='center'>تاریخ ثبت</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{pricevam}</td><td>{countvam}</td><td>{PriceGhest}</td><td>{TedadghestPardakhtshode}</td><td>{TedadGhestMande}</td><td>{Mandevam}</td><td>{status}</td><td>{dateRegister}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='rptVam(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerVamPPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountVamPersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptVam({lastpage})'>" +
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
        data: { i: 7, personelcode: personelcode, name: name, mellicode: mellicode, status: status, DateFrom: DateFrom, DateTo: DateTo, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{pricevam}", addCommas(this['numPriceVam']));
                row = row.replaceAll("{countvam}", this['numAghsat']);
                row = row.replaceAll("{PriceGhest}", addCommas(this['numPriceVamMontly']));
                row = row.replaceAll("{TedadghestPardakhtshode}", this['cntGhestPardakhtShode']);
                row = row.replaceAll("{TedadGhestMande}", this['cntGhestMande']);
                row = row.replaceAll("{Mandevam}", addCommas(this['MandeVam']));
                row = row.replaceAll("{dateRegister}", this['dateRegisterDate']);
                row = row.replaceAll("{status}", this['numStatus'] == "0" ? "<font style='color:red;'>تسویه نشده</font>" : "<font style='color:green;'>تسویه شده</font>");
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptVam(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptVam(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivVamPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountVamPersonel").html(allpage);
            }
            else {
                $("#ResultDivVamPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivVamPersonel").html("");
            $("#ResultDivVamPersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== مبلغ قسط =========================
//---------------------------------------------------------------------------------
function GetPriceGhest() {
    var pricevame = $.trim($("#txtPriceVam").val());
    var countGhest = $.trim($("#txtVamAghsatMonth").val());
    pricevame = parseInt(pricevame.replaceAll(",", ""));
    if (pricevame != "" && countGhest != "") {
        $("#txtPriceVamMontly").val(addCommas(Math.round(parseInt(pricevame) / parseInt(countGhest))));
    }
}
//---------------------------------------------------------------------------------
///=========================== محاسبه کارکرد =========================
//---------------------------------------------------------------------------------
var InvoiceFileRow = 0;
var ItemSearch = "";
function rptPersonelhoghogh(vpage) {
    $("#titleSortHoghogh").html("* مرتب سازی براساس ، کد پرسنلی می باشد");

    InvoiceFileRow = 0;
    $("#DivbtnPreSavePrice").hide();
    $("#DivbtnSaveFinalPrice").hide();
    $("#DivbtnPrintFishHoghogh").hide();
    $("#DivbtnCheckKarkard").hide();
    $("#DivbtnPrintAll").hide();
    ItemSearch = "";
    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    //var DateFrom = $("#yearlblDateFromVam").val() + "/" + $("#monthlblDateFromVam").val() + "/" + $("#daylblDateFromVam").val();
    //var DateTo = $("#yearlblDateToVam").val() + "/" + $("#monthlblDateToVam").val() + "/" + $("#daylblDateToVam").val();
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";

    var month = $.trim($("#drpdwnKarkardPriceJob").val());
    var year = $.trim($("#yearlblKarkardPriceDate").val());
    if (month == -1) {
        ShowAlert("ماه کارکرد باید مشخص شود !");
        return;
    }

    var checkkarkardonly = $("#chkOnlyKarkard").attr("checked") ? 1 : 0;
    ItemSearch = month + "," + year + "," + contractkindCheck + "," + checkkarkardonly.toString();

    $("#ResultDivReportPricePersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonel").show();
    var header = "<table id='tblVarizHoghogh1' class='MainTbl' style='border-collapse: collapse; width:400%;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCode' checked='checked' onclick='CheckOnePersonelItems(1);'/></th>" +
                  "<th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                  "<th align='center'>گروه کاری</th><th align='center'>تعداد فرزند</th><th align='center'>تعداد روز کارکرد</th>" +
                  "<th align='center'>ساعات اضافه کار</th><th align='center'>ساعات اضافه کار ویژه</th><th align='center'>ساعات اضافه کار در ماموریت</th>" +
                  "<th align='center'>حقوق ثابت</th><th align='center' {style}>حق مسکن</th>" +
                  "<th align='center' {style}>بن و خوار و بار</th><th align='center'>حقوق پایه مشمول بیمه</th><th align='center'>خالص حقوق مانده از ماه قبل</th><th align='center' >پرداختی اضافه کار</th><th align='center' >پرداختی اضافه کار ویژه</th>" +
                  "<th align='center' >پرداختی اضافه کار در ماموریت</th><th align='center'>پرداختی جمعه کار</th>" +
                  "<th align='center'>پرداختی تعطیل کار</th><th align='center'>کمک ایاب و ذهاب</th><th align='center'>حق مسئولیت</th>" +
                  "<th align='center'>هزینه های جاری ماه</th><th align='center'>پورسانت توزیع</th><th align='center'>پورسانت خارج محدوده</th>" +
                  "<th align='center'>پورسانت معادلی</th><th align='center' {style}>حق اولاد</th>" +
                  "<th align='center'>ماموریت</th><th align='center'>{padashAmakardTitle}</th><th align='center'>پاداش</th><th align='center' {style}>جبران کارکرد ماه 31 روزه</th><th align='center'>معوقه</th>" +
                  "<th align='center'>عیدی</th><th align='center'>بازخرید مرخصی</th><th align='center'>حق سنوات</th><th align='center'>حقوق پایه مشمول و غیر مشمول</th>" +
                  "<th align='center'>بیمه ی سهم کارمند <br/> (7% حقوق پایه مشمول بیمه)</th>" +
                  "<th align='center'>بیمه تکمیلی</th><th align='center' {style}>مالیات حقوق</th><th align='center'>قسط وام ها</th><th align='center'>مساعده</th><th align='center'>تاخیر</th>" +
                  "<th align='center'>تعجیل</th><th align='center'>غیبت</th><th align='center'>جریمه</th><th align='center'>خروج غیرمجاز</th>" +
                  "<th align='center'>مرخصی دانشجویی</th><th align='center'>مرخصی بدون حقوق</th><th align='center'>جریمه تاخیر بیش از 8 ساعت</th><th align='center'>خریدازشرکت</th><th align='center' {style}>کسر کارکرد ماه 29 روزه</th><th align='center'>کسور متفرقه</th><th align='center'>مجموع کسور</th> " +
                  "<th align='center'>خالص پرداختی</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th>" +
                  "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdPersonelCodeHoghogh{Row}'>{personelcode}</td><td>{name}</td><td>{workGroup}</td>" +
                  "<td>{cntchild}</td><td>{cntrozkarkard}</td><td>{timeOverJob}</td><td>{timeOverJobSpecial}</td><td>{timeOverJobInMission}</td>" +
                  "<td>{hoghoghsabet}</td><td {style}>{haghmaskan}</td><td {style}>{bon}</td><td>{hoghoghpaiemashmol}</td><td>{mandeAzMaheGhabl}</td><td>{ezafekarprice}</td>" +
                  "<td>{ezafekarvijehprice}</td><td>{ezafekarinmissionprice}</td><td>{jomekarprice}</td><td>{tatilkarprice}</td>" +
                  "<td>{ayabzahab}</td><td>{haghmodiriat}</td><td>{hazinejari}</td><td>{porsanttozi}</td><td>{porsantkharejmahdode}</td><td>{porsantmoadeli}</td>" +
                  "<td {style}>{hagholad}</td><td>{mamoriat}</td><td>{padashamalkar}</td><td>{padashsaier}</td><td {style}>{mah31roze}</td>" +
                  "<td>{moavaghe}</td><td>{eidi}</td><td>{morakhasibazkharid}</td><td>{sanavat}</td><td>{hoghoghpaieghiremashmol}</td>" +
                  "<td>{bimehkarmand}</td><td>{bimehtakmili}</td><td {style}>{maliathoghogh}</td>" +
                  "<td>{ghestvamha}</td><td>{mosaede}</td><td>{takhir}</td><td>{tajil}</td><td>{ghibat}</td><td>{jarimemotefareghe}</td><td>{exit}</td>" +
                  "<td>{morakhasiDaneshjoie}</td><td>{morakhasiBiHoghogh}</td><td>{jarimehtakhir}</td><td>{kharid}</td><td {style}>{mah29roze}</td>" +
                  "<td>{kosormotefareghe}</td><td>{sumkosor}</td><td>{khalespardakhti}</td><td>{bankName}</td>" +
                  "<td>{numberAccount}</td></tr>";

    var headerSaati = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCode' checked='checked' onclick='CheckOnePersonelItems(1);'/></th>" +
    "<th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th>" +
    "<th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th>" +
    "<th align='center'>ساعت کارکرد</th><th align='center'>خالص حقوق مانده از ماه قبل</th>" +
    "<th align='center'>حق الزحمه</th><th align='center'>حق الزحمه ساعتی</th>" +
    "<th align='center'>پاداش</th><th align='center'>کمک ایاب و ذهاب</th><th align='center'>معوقه</th>" +
    "<th align='center'>مجموع حق الزحمه پرداختی</th><th align='center'>بیمه ی سهم کارمند <br/> (7% حقوق پایه مشمول بیمه)</th>" +
    "<th align='center'>بیمه تکمیلی</th><th align='center'>مالیات حقوق</th><th align='center'>قسط وام ها</th>" +
    "<th align='center'>مساعده</th><th align='center'>جریمه</th><th align='center'>خریدازشرکت</th>" +
    "<th align='center'>کسور متفرقه</th><th align='center'>مجموع کسور</th> <th align='center'>خالص پرداختی</th>" +
    "<th align='center'>نام بانک</th><th align='center'>شماره حساب</th>" +
    "</thead><tbody>";
    var mainrowSaati = "<tr><td>{Check}</td><td>{Row}</td><td id='tdPersonelCodeHoghogh{Row}'>{personelcode}</td>" +
                       "<td>{name}</td><td>{workGroup}</td><td>{timeKarkard}</td><td>{mandeAzMaheGhabl}</td><td>{pricesaat}</td>" +
                       "<td>{hoghoghsabet}</td><td>{padashsaier}</td><td>{ayabzahab}</td><td>{moavaghe}</td><td>{SumHagholZahme}</td>" +
                       "<td>{bimehkarmand}</td><td>{bimehtakmili}</td><td>{maliat}</td><td>{ghestvamha}</td><td>{mosaede}</td>" +
                       "<td>{jarimemotefareghe}</td><td>{kharid}</td><td>{kosormotefareghe}</td><td>{sumkosor}</td>" +
                       "<td>{khalespardakhti}</td><td>{bankName}</td><td>{numberAccount}</td></tr>";

    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv' style='width:400% !important;'><div class='pageritem'><a onclick='rptPersonelhoghogh(1)'>" +
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
    "</a></div><div class='pageritem'><a onclick='rptPersonelhoghogh({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";
    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50000";
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
        data: { i: 8,checkkarkardonly:checkkarkardonly, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            if (data == "5")
            {
                $("#ResultDivReportPricePersonel").html("");
                $("#ResultDivReportPricePersonel").hide();
                ShowAlert("قرارداد این پرسنل در سیستم باید تمدید شود !");
            }
            else
            {
            AllRecordCount = data[1];
            var hoghogheBime = 0;
            var hoghoghpaie = 0;
            var hoghoghpaieMashmol = 0;
            var maliatkarmand = 0;
            var bimekarmand = 0;
            var bimekarfarma = 0;
            var bimebikari = 0;
            var khalespardakhti = 0;
            var sumKosor = 0;
            if (contractkindCheck == "1" || contractkindCheck == "3") {
                $.each(data[0], function (index) {
                    row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCode{Row}' onclick='CheckOnePersonelItems(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{cntchild}", this['cntchild']);
                    row = row.replaceAll("{cntrozkarkard}", this['strJobDays']);
                    row = row.replaceAll("{timeOverJob}", this['strJobOverTime']);
                    row = row.replaceAll("{timeOverJobSpecial}", this['strJobOverTimeSpecial']);
                    row = row.replaceAll("{timeOverJobInMission}", this['strJobOverTimeInMission']);
                    row = row.replaceAll("{mandeAzMaheGhabl}", addCommas(this['mandeHoghoghAzMaheGhabl']));
                    row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPersonelSalary']));
                    row = row.replaceAll("{haghmaskan}", addCommas(this['numPersonelHomeSalary']));
                    row = row.replaceAll("{bon}", addCommas(this['numPersonelBon']));
                    row = row.replaceAll("{ezafekarprice}", addCommas(this['ezafekar']));
                    row = row.replaceAll("{ezafekarvijehprice}", addCommas(this['ezafekarVijeh']));
                    row = row.replaceAll("{ezafekarinmissionprice}", addCommas(this['ezafekarinmission']));
                    row = row.replaceAll("{jomekarprice}", addCommas(this['jomekar']));
                    row = row.replaceAll("{tatilkarprice}", addCommas(this['tatilkar']));

                    row = row.replaceAll("{haghmodiriat}", addCommas(this['haghmodiriat']));
                    row = row.replaceAll("{ayabzahab}", addCommas(this['ayabzahab']));
                    row = row.replaceAll("{hazinejari}", addCommas(this['hazinejari']));
                    row = row.replaceAll("{porsanttozi}", addCommas(this['porsanttozi']));
                    row = row.replaceAll("{porsantkharejmahdode}", addCommas(this['porsantkharejmahdode']));
                    row = row.replaceAll("{porsantmoadeli}", addCommas(this['porsantmoadeli']));
                    row = row.replaceAll("{mah31roze}", addCommas(this['mah31roz']));

                    hoghoghpaie = parseInt(this['numPersonelSalary']) + parseInt(this['numPersonelHomeSalary']) + parseInt(this['numPersonelBon']);

                    row = row.replaceAll("{hoghoghpaiemashmol}", addCommas(Math.round(hoghoghpaie)));

                    row = row.replaceAll("{hagholad}", addCommas(this['numPersonelChildSalary']));
                    row = row.replaceAll("{mamoriat}", addCommas(this['mamoriat']));
                    row = row.replaceAll("{padashamalkar}", addCommas(this['numPersonelPadash']));
                    row = row.replaceAll("{padashsaier}", addCommas(this['numPersonelSaier']));
                    row = row.replaceAll("{moavaghe}", addCommas(this['Moavaghe']));
                    row = row.replaceAll("{eidi}", addCommas(this['eidi']));
                    row = row.replaceAll("{morakhasibazkharid}", addCommas(this['bazkharid']));
                    row = row.replaceAll("{sanavat}", addCommas(this['numPersonelSanavat']));


                    hoghoghpaieMashmol = hoghoghpaie + parseInt(this['ezafekar']) + parseInt(this['ezafekarVijeh']) + parseInt(this['ezafekarinmission']) + parseInt(this['jomekar']) +
                                         parseInt(this['tatilkar']) + parseInt(this['ayabzahab']) + parseInt(this['haghmodiriat']) + parseInt(this['hazinejari']) +
                                         parseInt(this['porsanttozi']) + parseInt(this['porsantkharejmahdode']) + parseInt(this['porsantmoadeli']) + parseInt(this['bazkharid']) +
                                         parseInt(this['mah31roz']) + parseInt(this['mandeHoghoghAzMaheGhabl']) + parseInt(this['numPersonelChildSalary']) +
                                         parseInt(this['mamoriat']) + parseInt(this['numPersonelPadash']) + parseInt(this['Moavaghe']) + parseInt(this['numPersonelSaier']) + parseInt(this['eidi']) + parseInt(this['numPersonelSanavat']);

                    row = row.replaceAll("{hoghoghpaieghiremashmol}", addCommas(hoghoghpaieMashmol));
                    // maliatkarmand = hoghoghpaieMashmol > 11500000 ? hoghoghpaieMashmol * 0.1 : 0;
                    maliatkarmand = 0;
                    // row = row.replaceAll("{maliatKarmand}", addCommas(Math.round(maliatkarmand)));
                    hoghogheBime = this['bimehKarmand'];
                    bimekarmand = Math.round((hoghogheBime * 0.07) * 1.1);
                    //bimekarmand = Math.round(this['bimehKarmand']);
                    row = row.replaceAll("{bimehkarmand}", addCommas(bimekarmand));
                    row = row.replaceAll("{bimehtakmili}", addCommas(this['bimetakmili']));
                    row = row.replaceAll("{ghestvamha}", addCommas(this['numPriceVamMontly']));
                    row = row.replaceAll("{mosaede}", addCommas(this['numPriceMosaede']));
                    row = row.replaceAll("{takhir}", addCommas(this['takhir']));
                    row = row.replaceAll("{tajil}", addCommas(this['tajil']));
                    row = row.replaceAll("{ghibat}", addCommas(this['ghibat']));
                    row = row.replaceAll("{jarimemotefareghe}", addCommas(this['jarimeMotefareghe']));
                    row = row.replaceAll("{kharid}", addCommas(this['kharid']));

                    row = row.replaceAll("{kosormotefareghe}", addCommas(this['kosormotefareghe']));
                    row = row.replaceAll("{maliathoghogh}", addCommas(this['maliathoghogh']));
                    row = row.replaceAll("{mah29roze}", addCommas(this['mah29roz']));
                    row = row.replaceAll("{jarimehtakhir}", addCommas(this['jarimehtakhir']));
                    
                    row = row.replaceAll("{exit}", addCommas(this['khorojGhireMojaz']));
                    row = row.replaceAll("{morakhasiBiHoghogh}", addCommas(this['MorakhasiBiHoghogh']));
                    row = row.replaceAll("{morakhasiDaneshjoie}", addCommas(this['MorakhasiUniversal']));

                    sumKosor = parseInt(bimekarmand) + parseInt(this['bimetakmili']) + parseInt(this['numPriceVamMontly']) + parseInt(this['jarimehtakhir']) +
                               parseInt(this['numPriceMosaede']) + parseInt(this['takhir']) + parseInt(this['tajil']) + parseInt(this['ghibat']) +
                               parseInt(this['jarimeMotefareghe']) + parseInt(this['khorojGhireMojaz']) + parseInt(this['MorakhasiBiHoghogh']) +
                               parseInt(this['MorakhasiUniversal']) + parseInt(this['kharid']) + parseInt(this['kosormotefareghe']) + parseInt(this['maliathoghogh']) + parseInt(this['mah29roz']);

                    row = row.replaceAll("{sumkosor}", addCommas(sumKosor));

                    bimekarfarma = hoghoghpaie * 0.2;
                    bimebikari = hoghoghpaie * 0.03;
                    //row = row.replaceAll("{bimekarfarma}", addCommas(Math.round(bimekarfarma)));
                    //row = row.replaceAll("{bimebikari}", addCommas(Math.round(bimebikari)));
                    khalespardakhti = hoghoghpaieMashmol - sumKosor;
                    row = row.replaceAll("{khalespardakhti}", addCommas(Math.round(khalespardakhti)));
                    row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                    row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{Row}", i);
                    row = row.replaceAll("{style}", contractkindCheck == "1" ? "" : " style='display:none;'");
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFileRow = i - 1;
                });
            }
            else if (contractkindCheck == "2") {
                $.each(data[0], function (index) {
                    row = mainrowSaati.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCode{Row}' onclick='CheckOnePersonelItems(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{timeKarkard}", this['strJobTime']);
                    row = row.replaceAll("{pricesaat}", addCommas(this['numPersonelSalary1']));
                    row = row.replaceAll("{mandeAzMaheGhabl}",checkkarkardonly==1 ? "0" : addCommas(this['mandeHoghoghAzMaheGhabl']));
                    row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPersonelSalary']));
                    row = row.replaceAll("{padashsaier}", addCommas(this['numPersonelSaier']));
                    row = row.replaceAll("{moavaghe}", addCommas(this['Moavaghe']));
                    row = row.replaceAll("{ayabzahab}", addCommas(this['ayabzahab']));

                    hoghoghpaieMashmol = parseInt(this['mandeHoghoghAzMaheGhabl']) + parseInt(this['numPersonelSalary']) + parseInt(this['numPersonelSaier']) + 
                                         parseInt(this['Moavaghe'])+ parseInt(this['ayabzahab']);

                    row = row.replaceAll("{SumHagholZahme}", addCommas(hoghoghpaieMashmol));
                    // maliatkarmand = hoghoghpaieMashmol > 11500000 ? hoghoghpaieMashmol * 0.1 : 0;
                    maliatkarmand = 0;
                    // row = row.replaceAll("{maliatKarmand}", addCommas(Math.round(maliatkarmand)));
                    hoghogheBime = this['bimehKarmand'];
                    bimekarmand = Math.round((hoghogheBime * 0.07) * 1.1);
                    //bimekarmand = Math.round(this['bimehKarmand']);
                    row = row.replaceAll("{bimehkarmand}", addCommas(bimekarmand));
                    row = row.replaceAll("{bimehtakmili}", addCommas(this['bimetakmili']));
                    row = row.replaceAll("{ghestvamha}", addCommas(this['numPriceVamMontly']));
                    row = row.replaceAll("{mosaede}", addCommas(this['numPriceMosaede']));
                    row = row.replaceAll("{jarimemotefareghe}", addCommas(this['jarimeMotefareghe']));
                    row = row.replaceAll("{kharid}", addCommas(this['kharid']));

                    row = row.replaceAll("{kosormotefareghe}", addCommas(this['kosormotefareghe']));
                    row = row.replaceAll("{maliat}", addCommas(this['maliathoghogh']));

                    sumKosor = parseInt(bimekarmand) + parseInt(this['bimetakmili']) +
                               parseInt(this['numPriceVamMontly']) + parseInt(this['numPriceMosaede']) +
                               parseInt(this['jarimeMotefareghe']) + parseInt(this['kharid']) + parseInt(this['kosormotefareghe']) + parseInt(this['maliathoghogh']);

                    row = row.replaceAll("{sumkosor}", addCommas(sumKosor));
                    khalespardakhti = hoghoghpaieMashmol - sumKosor;
                    row = row.replaceAll("{khalespardakhti}", addCommas(Math.round(khalespardakhti)));
                    row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                    row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{Row}", i);
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFileRow = i - 1;
                });
            }
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptPersonelhoghogh(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptPersonelhoghogh(" + nextPage + ")");
            }
            if (t == 1) {
                if (contractkindCheck == "1" || contractkindCheck == "3") {
                    header2 = header2.replaceAll("{padashAmakardTitle}", contractkindCheck == "1" ? "پاداش ارزیابی عملکرد" : "مجموع حق الزحمه فرآیند");
                    header2 = header2.replaceAll("{style}", contractkindCheck == "1" ? "" : " style='display:none;'");
                    $("#ResultDivReportPricePersonel").html(header + header2 + allrow + footer + endfooter);
                }
                else if (contractkindCheck == "2") {
                    $("#ResultDivReportPricePersonel").html(header + headerSaati + allrow + footer + endfooter);
                }
                $("#DivbtnPreSavePrice").show();
                $("#divAllRecordCountPricePersonel").html(allpage);
            }
            else {
                $("#ResultDivReportPricePersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnPreSavePrice").hide();
            }
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
function CheckOnePersonelItems(type, row) {
    if (type == 1) {
        for (var i = 1; i <= InvoiceFileRow; i++) {
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
//---------------------------------------------------------------------------------
///=========================== پیش ثبت محاسبه کارکرد حقوق پرسنل =========================
//---------------------------------------------------------------------------------
function PreSaveHoghogh() {
    var PersonelCodeTemp = "";
    for (var i = 1; i <= InvoiceFileRow; i++) {
        if ($("#chkOnePersonelCode" + i).attr("checked"))
            PersonelCodeTemp = PersonelCodeTemp + $.trim($("#tdPersonelCodeHoghogh" + i).html()) + ","
    }
    if ($.trim(PersonelCodeTemp) == "") {
        ShowAlert("لطفا کارمندی را انتخاب نمایید!");
        return;
    }
    else {
        $("#Note").html("آیا از پیش ثبت صورت حساب این دوره اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "پیش ثبت صورت حساب کلی حقوق",
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
                        data: { i: 12, PersonelCodeTemp: PersonelCodeTemp, ItemSearch: ItemSearch },
                        url: "PostBack/PBPersonelCalcutPrice.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#btnPersonelPreInvoiceSearch").show();
                                rptPersonelhoghogh(1);
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
///=========================== ثبت پاداش و  جریمه =========================
//---------------------------------------------------------------------------------
function savePadash() {
    var personelcode = $.trim($("#txtPadashPersonelCode").val());
    var Kind = $.trim($("#drpdwnPadashKind").val());
    var price = $.trim($("#txtPricePadash").val());
    var PadashDesc = $.trim($("#txtPadashDesc").val());
    var month = $.trim($("#drpdwnPadashPriceJob").val());
    var year = $.trim($("#yearlblDatePadashDate").val());


    if (personelcode == "" || price == "" || PadashDesc == "" || Kind == "-1") {
        ShowAlert("لطفا اطلاعات خواسته شده را تکمیل نمایید!");
        return;
    }
    price = parseInt(price.replaceAll(",", ""));
    if (personelcode == "") {
        ShowAlert("لطفا کد پرسنلی را وارد نمایید!");
        return;
    }
    else if (!numbericFild.test(personelcode)) {
        ShowAlert("کد پرسنلی عددی می باشد");
        return;
    }
    else if (!numbericFild.test(price)) {
        ShowAlert("مبلغ پاداش/جریمه عددی می باشد");
        return;
    }
    else if (price == "0") {
        ShowAlert("مبلغ پاداش/جریمه نباید صفر باشد!");
        return;
    }
    else if (parseInt(price) > 50000000) {
        ShowAlert("مبلغ پاداش/جریمه نباید بیشتر از پنج میلیون تومان باشد!");
        return;
    }
    else if (PadashDesc == "") {
        ShowAlert("لطفا توضیحات را تکمیل نمایید !");
        return;
    }
    else if (Kind == "-1") {
        ShowAlert("لطفا نوع ثبت را انتخاب نمایید !");
        return;
    }
    else if (month == -1) {
        ShowAlert("ماه ثبت پاداش/جریمه باید مشخص شود !");
        return;
    }
    else {
        $("#Note").html("آیا از ثبت پاداش/جریمه اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "ثبت پاداش/جریمه",
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
                    $.ajax({
                        type: "POST",
                        async: true,
                        cache: false,
                        dataType: "json",
                        data: { i: 9, personelcode: personelcode, Kind: Kind, price: price, PadashDesc: PadashDesc, month: month, year: year },
                        url: "PostBack/PBPersonelCalcutPrice.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#txtPadashPersonelCode").val("");
                                $("#txtPadashDesc").val("");
                                $("#txtPricePadash").val("");
                                $("#drpdwnPadashKind").val("-1");
                            }
                            else if (data == "2") {
                                ShowAlert("کد پرسنلی نامعتبر می باشد");
                            }
                            else if (data == "3") {
                                ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                            }
                            else if (data == "4") {
                                ShowAlert("این پرسنل پاداش یا جریمه تسویه نشده دارد!");
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                        }
                    });
                    $(this).dialog("close");
                }
            }
        });
        $("#Note").dialog("open");
    }
}
//---------------------------------------------------------------------------------
///=========================== گزارش پاداش و  جریمه =========================
//---------------------------------------------------------------------------------
function rptPadash(vpage) {
    var personelcode = $.trim($("#txtReportPadashPersonelCode").val());
    var name = $.trim($("#txtReportPadashPersonelName").val());
    var mellicode = $.trim($("#txtReportPadashPersonelMelliCode").val());
    var DateFrom = "";// $("#yearlblPadashDateFrom").val() + "/" + $("#monthlblPadashDateFrom").val() + "/" + $("#daylblPadashDateFrom").val();
    var DateTo = ""; // $("#yearlblPadashDateTo").val() + "/" + $("#monthlblPadashDateTo").val() + "/" + $("#daylblPadashDateTo").val();
    var kind = $.trim($("#drpdwnReportPadashKind").val());
    var status = $.trim($("#drpdwnReportPadashStatus").val());
    var month = $.trim($("#drpdwnSearchPadashPriceJob").val());
    var year = $.trim($("#yearlblSearchPadashDate").val());

    $("#ResultDivPadashPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPadashPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>سال</th><th align='center'>ماه</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>مبلغ (ریال)</th><th align='center'>نوع</th><th align='center'>توضیحات</th><th align='center'>وضعیت </th><th align='center'>تاریخ ثبت</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{year}</td><td>{month}</td><td>{personelcode}</td><td>{name}</td><td>{price}</td><td>{kind}</td><td>{desc}</td><td>{status}</td><td>{dateRegister}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='rptPadash(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPadashPPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPadashPersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptPadash({lastpage})'>" +
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
        data: { i: 10, personelcode: personelcode, month: month, year: year, name: name, mellicode: mellicode, status: status, kind: kind, DateFrom: DateFrom, DateTo: DateTo, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{price}", addCommas(this['numPricePadashAndJarimeh']));
                row = row.replaceAll("{kind}", this['numSaveKind']);
                row = row.replaceAll("{desc}", this['strDesc']);
                row = row.replaceAll("{dateRegister}", this['dateRegisterDate']);
                row = row.replaceAll("{status}", this['numStatus']);
                row = row.replaceAll("{year}", this['numYear']);
                row = row.replaceAll("{month}", this['montName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptPadash(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptPadash(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivPadashPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPadashPersonel").html(allpage);
            }
            else {
                $("#ResultDivPadashPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPadashPersonel").html("");
            $("#ResultDivPadashPersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== چک و نمایش مشاهده آخرین بررسی =========================
//---------------------------------------------------------------------------------
function CheckPreInvoice() {
    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    var month = $.trim($("#drpdwnKarkardPriceJob").val());
    var year = $.trim($("#yearlblKarkardPriceDate").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";


    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 11, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            if (parseInt(data) > 0)
                $("#btnPersonelPreInvoiceSearch").show();
            else
                $("#btnPersonelPreInvoiceSearch").hide();
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== مشاهده گزارش آخرین بررسی =========================
//---------------------------------------------------------------------------------
var InvoiceFileRowPrint = 0;
var ContractKindPublic = 0;
function GetAllPreInvoice() {
    $("#titleSortHoghogh").html("* مرتب سازی براساس ، کد پرسنلی می باشد");

    $("#DivbtnPreSavePrice").hide();
    $("#DivbtnSaveFinalPrice").hide();
    $("#DivbtnPrintFishHoghogh").hide();
    $("#DivbtnCheckKarkard").hide();
    $("#DivbtnPrintAll").hide();
    InvoiceFileRowPrint = 0;

    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    var month = $.trim($("#drpdwnKarkardPriceJob").val());
    var year = $.trim($("#yearlblKarkardPriceDate").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";

    ItemSearch = month + "," + year + "," + contractkindCheck;
    ContractKindPublic = contractkindCheck;

    $("#ResultDivReportPricePersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonel").show();
    var header = "<table id='tblVarizHoghogh2' class='MainTbl' style='border-collapse: collapse; width:400%;' border=1 cellpadding='2'>";
  
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPrintPersonelCode' checked='checked' onclick='CheckOnePersonelItemsPrint(1);'/></th>" +
                 "<th align='center' width='50px'>ردیف</th><th style='display:none;'>کد</th><th align='center'>سال</th><th align='center'>ماه</th>" +
                 "<th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
                 "<th align='center'>گروه کاری</th><th align='center'>تعداد فرزند</th><th align='center'>تعداد روز کارکرد</th>" +
                 "<th align='center'>ساعات اضافه کار</th><th align='center'>ساعات اضافه کار ویژه</th><th align='center'>ساعات اضافه کار در ماموریت</th>" +
                 "<th align='center'>حقوق ثابت</th><th align='center' {style}>حق مسکن</th>" +
                 "<th align='center' {style}>بن و خوار و بار</th><th align='center'>حقوق پایه مشمول بیمه</th>" +
                 "<th align='center'>خالص حقوق مانده از ماه قبل</th>" +
                 "<th align='center' >پرداختی اضافه کار</th><th align='center' >پرداختی اضافه کار ویژه</th>" +
                 "<th align='center' >پرداختی اضافه کار در ماموریت</th><th align='center'>پرداختی جمعه کار</th>" +
                 "<th align='center'>پرداختی تعطیل کار</th><th align='center'>کمک ایاب و ذهاب</th><th align='center'>حق مسئولیت</th>" +
                 "<th align='center'>هزینه های جاری ماه</th><th align='center'>پورسانت توزیع</th><th align='center'>پورسانت خارج محدوده</th>" +
                 "<th align='center'>پورسانت معادلی</th><th align='center' {style}>حق اولاد</th>" +
                 "<th align='center'>ماموریت</th><th align='center'>{padashAmakardTitle}</th><th align='center'>پاداش</th><th align='center' {style}>جبران کارکرد ماه 31 روزه</th><th align='center'>معوقه</th>" +
                 "<th align='center'>عیدی</th><th align='center' {style}>بازخرید مرخصی</th><th align='center'>حق سنوات</th><th align='center'>حقوق پایه مشمول و غیر مشمول</th>" +
                 "<th align='center'>بیمه ی سهم کارمند <br/> (7% حقوق پایه مشمول بیمه)</th>" +
                 "<th align='center'>بیمه تکمیلی</th><th align='center' {style}>مالیات حقوق</th><th align='center'>قسط وام ها</th><th align='center'>مساعده</th><th align='center'>تاخیر</th>" +
                 "<th align='center'>تعجیل</th><th align='center'>غیبت</th><th align='center'>جریمه</th><th align='center'>خروج غیرمجاز</th>" +
                 "<th align='center'>مرخصی دانشجویی</th><th align='center'>مرخصی بدون حقوق</th><th align='center'>جریمه تاخیر بیش از 8 ساعت</th>" +
                 "<th align='center'>خریدازشرکت</th><th align='center' {style}>کسر کارکرد ماه 29 روزه</th><th align='center'>کسور متفرقه</th>" +
                 "<th align='center'>مجموع کسور</th> " +
                 "<th align='center'>خالص پرداختی</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th style='display:none;'>شماره شبا</th>" +
                 "</thead><tbody>";

    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdInvoiceCodeHoghogh{Row}' style='display:none;'>{code}</td><td>{sal}</td><td>{mah}</td>" +
                 "<td id='tdPersonelCodePrintHoghogh{Row}'>{personelcode}</td><td>{name}</td><td>{workGroup}</td>" +
                 "<td>{cntchild}</td><td>{cntrozkarkard}</td><td>{timeOverJob}</td><td>{timeOverJobSpecial}</td><td>{timeOverJobInMission}</td>" +
                 "<td>{hoghoghsabet}</td><td {style}>{haghmaskan}</td><td {style}>{bon}</td><td>{hoghoghpaiemashmol}</td><td>{mandeAzMaheGhabl}</td><td>{ezafekarprice}</td>" +
                 "<td>{ezafekarvijehprice}</td><td>{ezafekarinmissionprice}</td><td>{jomekarprice}</td><td>{tatilkarprice}</td>" +
                 "<td>{ayabzahab}</td><td>{haghmodiriat}</td><td>{hazinejari}</td><td>{porsanttozi}</td><td>{porsantkharejmahdode}</td><td>{porsantmoadeli}</td>" +
                 "<td {style}>{hagholad}</td><td>{mamoriat}</td><td>{padashamalkar}</td><td>{padashsaier}</td><td {style}>{mah31roze}</td>" +
                 "<td>{moavaghe}</td><td>{eidi}</td><td {style}>{morakhasibazkharid}</td><td>{sanavat}</td><td>{hoghoghpaieghiremashmol}</td>" +
                 "<td>{bimehkarmand}</td><td>{bimehtakmili}</td><td {style}>{maliathoghogh}</td>" +
                 "<td>{ghestvamha}</td><td>{mosaede}</td><td>{takhir}</td><td>{tajil}</td><td>{ghibat}</td><td>{jarimemotefareghe}</td><td>{exit}</td>" +
                 "<td>{morakhasiDaneshjoie}</td><td>{morakhasiBiHoghogh}</td><td>{jarimehtakhir}</td><td>{kharid}</td><td {style}>{mah29roze}</td>" +
                 "<td>{kosormotefareghe}</td><td>{sumkosor}</td><td>{khalespardakhti}</td><td>{bankName}</td>" +
                 "<td>{numberAccount}</td><td style='display:none;'>{sheba}</td></tr>";

    var headerSaati = "<thead><tr><th><input type='checkbox' id='chkAllPrintPersonelCode' checked='checked' onclick='CheckOnePersonelItemsPrint(1);'/></th>" +
                     "<th align='center' width='50px'>ردیف</th><th style='display:none;'>کد</th><th align='center'>سال</th><th align='center'>ماه</th>" +
                     "<th align='center'>کد پرسنلی</th>" +
                     "<th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th>" +
                     "<th align='center'>ساعت کارکرد</th><th align='center'>خالص حقوق مانده از ماه قبل</th>" +
                     "<th align='center'>حق الزحمه</th><th align='center'>حق الزحمه ساعتی</th>" +
                     "<th align='center'>پاداش</th><th align='center'>کمک ایاب و ذهاب</th><th align='center'>معوقه</th>" +
                     "<th align='center'>مجموع حق الزحمه پرداختی</th><th align='center'>بیمه ی سهم کارمند <br/> (7% حقوق پایه مشمول بیمه)</th>" +
                     "<th align='center'>بیمه تکمیلی</th><th align='center'>مالیات حقوق</th><th align='center'>قسط وام ها</th>" +
                     "<th align='center'>مساعده</th><th align='center'>جریمه</th><th align='center'>خریدازشرکت</th>" +
                     "<th align='center'>کسور متفرقه</th><th align='center'>مجموع کسور</th> <th align='center'>خالص پرداختی</th>" +
                     "<th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th style='display:none;'>شماره شبا</th>" +
                     "</thead><tbody>";

    var mainrowSaati = "<tr><td>{Check}</td><td>{Row}</td><td id='tdInvoiceCodeHoghogh{Row}' style='display:none;'>{code}</td>" +
                       "<td>{sal}</td><td>{mah}</td><td id='tdPersonelCodePrintHoghogh{Row}'>{personelcode}</td>" +
                       "<td>{name}</td><td>{workGroup}</td><td>{timeKarkard}</td><td>{mandeAzMaheGhabl}</td><td>{pricesaat}</td>" +
                       "<td>{hoghoghsabet}</td><td>{padashsaier}</td><td>{ayabzahab}</td><td>{moavaghe}</td><td>{SumHagholZahme}</td>" +
                       "<td>{bimehkarmand}</td><td>{bimehtakmili}</td><td>{maliat}</td><td>{ghestvamha}</td><td>{mosaede}</td>" +
                       "<td>{jarimemotefareghe}</td><td>{kharid}</td><td>{kosormotefareghe}</td><td>{sumkosor}</td>" +
                       "<td>{khalespardakhti}</td><td>{bankName}</td><td>{numberAccount}</td><td style='display:none;'>{sheba}</td></tr>";


    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 13, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var hoghogheBime = 0;
            var hoghoghpaie = 0;
            var hoghoghpaieMashmol = 0;
            var maliatkarmand = 0;
            var bimekarmand = 0;
            var bimekarfarma = 0;
            var bimebikari = 0;
            var khalespardakhti = 0;
            if (contractkindCheck == "1" || contractkindCheck == "3") {
                $.each(data, function (index) {
                    row = mainrow.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{Check}", "<input type='checkbox' id='chkOnePrintPersonelCode{Row}' onclick='CheckOnePersonelItemsPrint(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{cntchild}", this['cntchild']);
                    row = row.replaceAll("{cntrozkarkard}", this['strJobDays']);
                    row = row.replaceAll("{timeOverJob}", this['strJobOverTime']);
                    row = row.replaceAll("{timeOverJobSpecial}", this['strJobOverTimeSpecial']);
                    row = row.replaceAll("{timeOverJobInMission}", this['strJobOverTimeInMission']);

                    row = row.replaceAll("{mandeAzMaheGhabl}", addCommas(this['strMandeAzMaheGhablTafkiki']));
                    row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPersonelSalary']));
                    row = row.replaceAll("{haghmaskan}", addCommas(this['numPersonelHomeSalary']));
                    row = row.replaceAll("{bon}", addCommas(this['numPersonelBon']));
                    row = row.replaceAll("{ezafekarprice}", addCommas(this['ezafekar']));
                    row = row.replaceAll("{ezafekarvijehprice}", addCommas(this['ezafekarvijeh']));
                    row = row.replaceAll("{ezafekarinmissionprice}", addCommas(this['ezafekarInMission']));

                    row = row.replaceAll("{jomekarprice}", addCommas(this['jomekar']));
                    row = row.replaceAll("{tatilkarprice}", addCommas(this['tatilkar']));

                    row = row.replaceAll("{haghmodiriat}", addCommas(this['numPriceHaghModiriat']));
                    row = row.replaceAll("{ayabzahab}", addCommas(this['numPriceAyabzahab']));
                    row = row.replaceAll("{hazinejari}", addCommas(this['numPriceGhoboz']));
                    row = row.replaceAll("{porsanttozi}", addCommas(this['numPricePorsantTozi']));
                    row = row.replaceAll("{porsantkharejmahdode}", addCommas(this['numPricePorsantKharjMahdode']));
                    row = row.replaceAll("{porsantmoadeli}", addCommas(this['numPricePrintMoadeli']));
                    row = row.replaceAll("{mah31roze}", addCommas(this['numPriceMonth31']));
                    
                    row = row.replaceAll("{morakhasibazkharid}", addCommas(this['numPriceBazkharidMorakhasi']));

                    row = row.replaceAll("{hoghoghpaiemashmol}", addCommas(this['numPriceCalcHoghogh1']));
                    row = row.replaceAll("{hagholad}", addCommas(this['numPersonelChildSalary']));
                    row = row.replaceAll("{mamoriat}", addCommas(this['mamoriat']));
                    row = row.replaceAll("{padashamalkar}", addCommas(this['numPersonelPadash']));
                    row = row.replaceAll("{padashsaier}", addCommas(this['numPersonelSaier']));
                    row = row.replaceAll("{moavaghe}", addCommas(this['numPriceMoavaghe']));
                    row = row.replaceAll("{eidi}", addCommas(this['eidi']));
                    row = row.replaceAll("{sanavat}", addCommas(this['numPersonelSanavat']));
                    row = row.replaceAll("{hoghoghpaieghiremashmol}", addCommas(this['numPriceCalcHoghogh2']));

                    row = row.replaceAll("{bimehkarmand}", addCommas(this['numPricePersonelBimeh']));
                    row = row.replaceAll("{bimehtakmili}", addCommas(this['bimetakmili']));
                    row = row.replaceAll("{ghestvamha}", addCommas(this['numPriceVamMontly']));
                    row = row.replaceAll("{mosaede}", addCommas(this['numPriceMosaede']));
                    row = row.replaceAll("{takhir}", addCommas(this['takhir']));
                    row = row.replaceAll("{tajil}", addCommas(this['tajil']));
                    row = row.replaceAll("{ghibat}", addCommas(this['ghibat']));
                    row = row.replaceAll("{jarimemotefareghe}", addCommas(this['jarimeMotefareghe']));
                    row = row.replaceAll("{kharid}", addCommas(this['numPriceBuyCo']));

                    row = row.replaceAll("{kosormotefareghe}", addCommas(this['numPriceKosorMotefareghe']));
                    row = row.replaceAll("{maliathoghogh}", addCommas(this['numPricePersonelMaliat']));
                    row = row.replaceAll("{mah29roze}", addCommas(this['numPriceMonth29']));
                    row = row.replaceAll("{jarimehtakhir}", addCommas(this['numPriceJarimehTakhir8Saat']));


                    row = row.replaceAll("{exit}", addCommas(this['numPriceKhorojGhireMojaz']));
                    row = row.replaceAll("{morakhasiBiHoghogh}", addCommas(this['numPriceMorakhasiBiHoghogh']));
                    row = row.replaceAll("{morakhasiDaneshjoie}", addCommas(this['numPriceMorakhasiUni']));

                    row = row.replaceAll("{sumkosor}", addCommas(this['numPriceCalcKosorat']));
                    row = row.replaceAll("{khalespardakhti}", addCommas(this['numPriceCalcHoghoghKhales']));
                    row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                    row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                    row = row.replaceAll("{sheba}", this['strShebaBank'] == null ? "-" : this['strShebaBank']);

                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{code}", this['numInvoiceCode']);

                    row = row.replaceAll("{Row}", i);
                    row = row.replaceAll("{style}", contractkindCheck == "1" ? "" : " style='display:none;'");
                    row = row.replaceAll("{sal}", this['strInvoiceYear']);
                    row = row.replaceAll("{mah}", this['strInvoiceMonth']);
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFileRowPrint = i - 1;

                });
            }
            else if (contractkindCheck == "2") {
                $.each(data, function (index) {
                    row = mainrowSaati.replaceAll("{Check}", "<input type='checkbox' id='chkOnePrintPersonelCode{Row}' onclick='CheckOnePersonelItemsPrint(2,{Row});' checked='checked'/>");

                    row = row.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{timeKarkard}", this['strJobTime']);
                    row = row.replaceAll("{pricesaat}", addCommas(this['numPriceSaati']));
                    row = row.replaceAll("{mandeAzMaheGhabl}", addCommas(this['strMandeAzMaheGhablTafkiki']));
                    row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPersonelSalary']));
                    row = row.replaceAll("{padashsaier}", addCommas(this['numPersonelSaier']));
                    row = row.replaceAll("{moavaghe}", addCommas(this['numPriceMoavaghe']));

                    row = row.replaceAll("{ayabzahab}", addCommas(this['numPriceAyabzahab']));

                    row = row.replaceAll("{SumHagholZahme}", addCommas(this['numPriceCalcHoghogh1']));
                    row = row.replaceAll("{bimehkarmand}", addCommas(this['numPricePersonelBimeh']));
                    row = row.replaceAll("{bimehtakmili}", addCommas(this['bimetakmili']));
                    row = row.replaceAll("{ghestvamha}", addCommas(this['numPriceVamMontly']));
                    row = row.replaceAll("{mosaede}", addCommas(this['numPriceMosaede']));
                    row = row.replaceAll("{jarimemotefareghe}", addCommas(this['jarimeMotefareghe']));
                    row = row.replaceAll("{kharid}", addCommas(this['numPriceBuyCo']));

                    row = row.replaceAll("{kosormotefareghe}", addCommas(this['numPriceKosorMotefareghe']));
                    row = row.replaceAll("{maliat}", addCommas(this['numPricePersonelMaliat']));

                    row = row.replaceAll("{sumkosor}", addCommas(this['numPriceCalcKosorat']));
                    row = row.replaceAll("{khalespardakhti}", addCommas(this['numPriceCalcHoghoghKhales']));
                    row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{code}", this['numInvoiceSaatiCode']);
                    row = row.replaceAll("{sal}", this['strInvoiceYear']);
                    row = row.replaceAll("{mah}", this['strInvoiceMonth']);
                    row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                    row = row.replaceAll("{sheba}", this['strShebaBank'] == null ? "-" : this['strShebaBank']);

                    row = row.replaceAll("{Row}", i);
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFileRowPrint = i - 1;

                });
            }

            if (t == 1) {
                if (contractkindCheck == "1" || contractkindCheck == "3") {
                    header2 = header2.replaceAll("{padashAmakardTitle}", contractkindCheck == "1" ? "پاداش ارزیابی عملکرد" : "مجموع حق الزحمه فرآیند");
                    header2 = header2.replaceAll("{style}", contractkindCheck == "1" ? "" : " style='display:none;'");
                    $("#ResultDivReportPricePersonel").html(header + header2 + allrow + footer);

                }
                else if (contractkindCheck == "2") {
                    $("#ResultDivReportPricePersonel").html(header + headerSaati + allrow + footer);
                }
                $("#DivbtnSaveFinalPrice").show();
                $("#DivbtnPrintAll").hide();
            }
            else {
                $("#ResultDivReportPricePersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnSaveFinalPrice").hide();
                $("#DivbtnPrintAll").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonel").html("");
            $("#ResultDivReportPricePersonel").hide();
            $("#DivbtnSaveFinalPrice").hide();
            $("#DivbtnPrintAll").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsPrint(type, row) {
    if (type == 1) {
        for (var i = 1; i <= InvoiceFileRowPrint; i++) {
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
///=========================== ثبت نهایی صورت حساب حقوق =========================
//---------------------------------------------------------------------------------
function SaveFinalHoghogh() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRowPrint; i++) {
        if ($("#chkOnePrintPersonelCode" + i).attr("checked"))
            Code = Code + $.trim($("#tdInvoiceCodeHoghogh" + i).html()) + ",";
    }
    if (Code == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;

    }
    $("#Note").html("آیا از ثبت نهایی صورت حساب این دوره اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ثبت نهایی صورت حساب کلی حقوق و دستمزد",
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
                    data: { i: 14, ContractKindPublic: ContractKindPublic, Code: Code },
                    url: "PostBack/PBPersonelCalcutPrice.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت ثبت شد");
                            CheckPreInvoice();
                            GetAllPreInvoice();
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
///=========================== مشاهده گزارش سابقه واریز =========================
//---------------------------------------------------------------------------------
var InvoiceFinalFileRowPrint = 0;
function ShowAllFinalHoghogh(vpage) {
    $("#titleSortHoghogh").html("* مرتب سازی براساس ، تاریخ ثبت نهایی تسویه حساب می باشد");

    InvoiceFinalFileRowPrint = 0;
    $("#DivbtnPreSavePrice").hide();
    $("#DivbtnSaveFinalPrice").hide();
    $("#DivbtnPrintFishHoghogh").hide();
    $("#DivbtnCheckKarkard").hide();
    $("#DivbtnPrintAll").hide();
    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    var month = $.trim($("#drpdwnKarkardPriceJob").val());
    var year = $.trim($("#yearlblKarkardPriceDate").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";

    ItemSearch = month + "," + year + "," + contractkindCheck;


    $("#ResultDivReportPricePersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonel").show();
    var header = "<table id='tblVarizHoghogh3' class='MainTbl' style='border-collapse: collapse; width:400%;' border=1 cellpadding='2'>";
 
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPrintFishPersonelCode' checked='checked' onclick='CheckOnePersonelItemsPrintFish(1);'/></th>" +
               "<th align='center' width='50px'>ردیف</th><th style='display:none;'>کد</th><th align='center'>سال</th><th align='center'>ماه</th><th>تاریخ ثبت نهایی</th>" +
               "<th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th>" +
               "<th align='center'>گروه کاری</th><th align='center'>تعداد فرزند</th><th align='center'>تعداد روز کارکرد</th>" +
               "<th align='center'>ساعات اضافه کار</th><th align='center'>ساعات اضافه کار ویژه</th><th align='center'>ساعات اضافه کار در ماموریت</th>" +
               "<th align='center'>حقوق ثابت</th><th align='center' {style}>حق مسکن</th>" +
               "<th align='center' {style}>بن و خوار و بار</th><th align='center'>حقوق پایه مشمول بیمه</th>" +
               "<th align='center'>خالص حقوق مانده از ماه قبل</th>" +
               "<th align='center' >پرداختی اضافه کار</th><th align='center' >پرداختی اضافه کار ویژه</th>" +
               "<th align='center' >پرداختی اضافه کار در ماموریت</th><th align='center'>پرداختی جمعه کار</th>" +
               "<th align='center'>پرداختی تعطیل کار</th><th align='center'>کمک ایاب و ذهاب</th><th align='center'>حق مسئولیت</th>" +
               "<th align='center'>هزینه های جاری ماه</th><th align='center'>پورسانت توزیع</th><th align='center'>پورسانت خارج محدوده</th>" +
               "<th align='center'>پورسانت معادلی</th><th align='center' {style}>حق اولاد</th>" +
               "<th align='center'>ماموریت</th><th align='center'>{padashAmakardTitle}</th><th align='center'>پاداش</th><th align='center' {style}>جبران کارکرد ماه 31 روزه</th><th align='center'>معوقه</th>" +
               "<th align='center'>عیدی</th><th align='center'>بازخرید مرخصی</th><th align='center'>حق سنوات</th><th align='center'>حقوق پایه مشمول و غیر مشمول</th>" +
               "<th align='center'>بیمه ی سهم کارمند <br/> (7% حقوق پایه مشمول بیمه)</th>" +
               "<th align='center'>بیمه تکمیلی</th><th align='center' {style}>مالیات حقوق</th><th align='center'>قسط وام ها</th><th align='center'>مساعده</th><th align='center'>تاخیر</th>" +
               "<th align='center'>تعجیل</th><th align='center'>غیبت</th><th align='center'>جریمه</th><th align='center'>خروج غیرمجاز</th>" +
               "<th align='center'>مرخصی دانشجویی</th><th align='center'>مرخصی بدون حقوق</th><th align='center'>جریمه تاخیر بیش از 8 ساعت</th>" +
               "<th align='center'>خریدازشرکت</th><th align='center' {style}>کسر کارکرد ماه 29 روزه</th><th align='center'>کسور متفرقه</th>" +
               "<th align='center'>مجموع کسور</th> " +
               "<th align='center'>خالص پرداختی</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th style='display:none;'>شماره شبا</th><th align='center'>وضعیت</th>" +
               "</thead><tbody>";

    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdInvoiceCodeFishHoghogh{Row}' style='display:none;'>{code}</td><td>{sal}</td><td>{mah}</td><td>{datevariz}</td>" +
                 "<td id='tdPersonelCodeFishHoghogh{Row}'>{personelcode}</td><td>{name}</td><td>{workGroup}</td>" +
                 "<td>{cntchild}</td><td>{cntrozkarkard}</td><td>{timeOverJob}</td><td>{timeOverJobSpecial}</td><td>{timeOverJobInMission}</td>" +
                 "<td>{hoghoghsabet}</td><td {style}>{haghmaskan}</td><td {style}>{bon}</td><td>{hoghoghpaiemashmol}</td><td>{mandeAzMaheGhabl}</td><td>{ezafekarprice}</td>" +
                 "<td>{ezafekarvijehprice}</td><td>{ezafekarinmissionprice}</td><td>{jomekarprice}</td><td>{tatilkarprice}</td>" +
                 "<td>{ayabzahab}</td><td>{haghmodiriat}</td><td>{hazinejari}</td><td>{porsanttozi}</td><td>{porsantkharejmahdode}</td><td>{porsantmoadeli}</td>" +
                 "<td {style}>{hagholad}</td><td>{mamoriat}</td><td>{padashamalkar}</td><td>{padashsaier}</td><td {style}>{mah31roze}</td>" +
                 "<td>{moavaghe}</td><td>{eidi}</td><td>{morakhasibazkharid}</td><td>{sanavat}</td><td>{hoghoghpaieghiremashmol}</td>" +
                 "<td>{bimehkarmand}</td><td>{bimehtakmili}</td><td {style}>{maliathoghogh}</td>" +
                 "<td>{ghestvamha}</td><td>{mosaede}</td><td>{takhir}</td><td>{tajil}</td><td>{ghibat}</td><td>{jarimemotefareghe}</td><td>{exit}</td>" +
                 "<td>{morakhasiDaneshjoie}</td><td>{morakhasiBiHoghogh}</td><td>{jarimehtakhir}</td><td>{kharid}</td><td {style}>{mah29roze}</td>" +
                 "<td>{kosormotefareghe}</td><td>{sumkosor}</td><td>{khalespardakhti}</td><td>{bankName}</td>" +
                 "<td>{numberAccount}</td><td style='display:none;'>{sheba}</td><td>{status}</td></tr>";


    var headerSaati = "<thead><tr><th><input type='checkbox' id='chkAllPrintFishPersonelCode' checked='checked' onclick='CheckOnePersonelItemsPrintFish(1);'/></th>" +
                    "<th align='center' width='50px'>ردیف</th><th style='display:none;'>کد</th><th align='center'>سال</th><th align='center'>ماه</th><th>تاریخ ثبت نهایی</th>" +
                    "<th align='center'>کد پرسنلی</th>" +
                    "<th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th>" +
                    "<th align='center'>ساعت کارکرد</th><th align='center'>خالص حقوق مانده از ماه قبل</th>" +
                    "<th align='center'>حق الزحمه</th><th align='center'>حق الزحمه ساعتی</th>" +
                    "<th align='center'>پاداش</th><th align='center'>کمک ایاب و ذهاب</th><th align='center'>معوقه</th>" +
                    "<th align='center'>مجموع حق الزحمه پرداختی</th><th align='center'>بیمه ی سهم کارمند <br/> (7% حقوق پایه مشمول بیمه)</th>" +
                    "<th align='center'>بیمه تکمیلی</th><th align='center'>مالیات حقوق</th><th align='center'>قسط وام ها</th>" +
                    "<th align='center'>مساعده</th><th align='center'>جریمه</th><th align='center'>خریدازشرکت</th>" +
                    "<th align='center'>کسور متفرقه</th><th align='center'>مجموع کسور</th> <th align='center'>خالص پرداختی</th>" +
                    "<th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th style='display:none;'>شماره شبا</th><th align='center'>وضعیت</th>" +
                    "</thead><tbody>";

    var mainrowSaati = "<tr><td>{Check}</td><td>{Row}</td><td id='tdInvoiceCodeFishHoghogh{Row}' style='display:none;'>{code}</td>" +
                       "<td>{sal}</td><td>{mah}</td><td>{datevariz}</td><td id='tdPersonelCodeFishHoghogh{Row}'>{personelcode}</td>" +
                       "<td>{name}</td><td>{workGroup}</td><td>{timeKarkard}</td><td>{mandeAzMaheGhabl}</td><td>{pricesaat}</td>" +
                       "<td>{hoghoghsabet}</td><td>{padashsaier}</td><td>{ayabzahab}</td><td>{moavaghe}</td><td>{SumHagholZahme}</td>" +
                       "<td>{bimehkarmand}</td><td>{bimehtakmili}</td><td>{maliat}</td><td>{ghestvamha}</td><td>{mosaede}</td>" +
                       "<td>{jarimemotefareghe}</td><td>{kharid}</td><td>{kosormotefareghe}</td><td>{sumkosor}</td>" +
                       "<td>{khalespardakhti}</td><td>{bankName}</td><td>{numberAccount}</td><td style='display:none;'>{sheba}</td><td>{status}</td></tr>";

    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv' style='width:400% !important;'><div class='pageritem'><a onclick='ShowAllFinalHoghogh(1)'>" +
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
    "</a></div><div class='pageritem'><a onclick='ShowAllFinalHoghogh({lastpage})'>" +
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
        data: { i: 15, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var hoghogheBime = 0;
            var hoghoghpaie = 0;
            var hoghoghpaieMashmol = 0;
            var maliatkarmand = 0;
            var bimekarmand = 0;
            var bimekarfarma = 0;
            var bimebikari = 0;
            var khalespardakhti = 0;
            if (contractkindCheck == "1" || contractkindCheck == "3") {
                $.each(data[0], function (index) {
                    row = mainrow.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{Check}", "<input type='checkbox' id='chkOnePrintFishPersonelCode{Row}' onclick='CheckOnePersonelItemsPrintFish(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{datevariz}", this['dateVarizDate']);
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{cntchild}", this['cntchild']);
                    row = row.replaceAll("{cntrozkarkard}", this['strJobDays']);
                    row = row.replaceAll("{timeOverJob}", this['strJobOverTime']);
                    row = row.replaceAll("{timeOverJobSpecial}", this['strJobOverTimeSpecial']);
                    row = row.replaceAll("{timeOverJobInMission}", this['strJobOverTimeInMission']);

                    row = row.replaceAll("{mandeAzMaheGhabl}", addCommas(this['strMandeAzMaheGhablTafkiki']));
                    row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPersonelSalary']));
                    row = row.replaceAll("{haghmaskan}", addCommas(this['numPersonelHomeSalary']));
                    row = row.replaceAll("{bon}", addCommas(this['numPersonelBon']));
                    row = row.replaceAll("{ezafekarprice}", addCommas(this['ezafekar']));
                    row = row.replaceAll("{ezafekarvijehprice}", addCommas(this['ezafekarVijeh']));
                    row = row.replaceAll("{ezafekarinmissionprice}", addCommas(this['ezafekarInMission']));

                    row = row.replaceAll("{haghmodiriat}", addCommas(this['numPriceHaghModiriat']));
                    row = row.replaceAll("{ayabzahab}", addCommas(this['numPriceAyabzahab']));
                    row = row.replaceAll("{hazinejari}", addCommas(this['numPriceGhoboz']));
                    row = row.replaceAll("{porsanttozi}", addCommas(this['numPricePorsantTozi']));
                    row = row.replaceAll("{porsantkharejmahdode}", addCommas(this['numPricePorsantKharjMahdode']));
                    row = row.replaceAll("{porsantmoadeli}", addCommas(this['numPricePrintMoadeli']));
                    row = row.replaceAll("{mah31roze}", addCommas(this['numPriceMonth31']));
                    row = row.replaceAll("{morakhasibazkharid}", addCommas(this['numPriceBazkharidMorakhasi']));

                    row = row.replaceAll("{jomekarprice}", addCommas(this['jomekar']));
                    row = row.replaceAll("{tatilkarprice}", addCommas(this['tatilkar']));
                    row = row.replaceAll("{hoghoghpaiemashmol}", addCommas(this['numPriceCalcHoghogh1']));
                    row = row.replaceAll("{hagholad}", addCommas(this['numPersonelChildSalary']));
                    row = row.replaceAll("{mamoriat}", addCommas(this['mamoriat']));
                    row = row.replaceAll("{padashamalkar}", addCommas(this['numPersonelPadash']));
                    row = row.replaceAll("{padashsaier}", addCommas(this['numPersonelSaier']));
                    row = row.replaceAll("{moavaghe}", addCommas(this['numPriceMoavaghe']));

                    row = row.replaceAll("{eidi}", addCommas(this['eidi']));
                    row = row.replaceAll("{sanavat}", addCommas(this['numPersonelSanavat']));
                    row = row.replaceAll("{hoghoghpaieghiremashmol}", addCommas(this['numPriceCalcHoghogh2']));
                    row = row.replaceAll("{bimehkarmand}", addCommas(this['numPricePersonelBimeh']));
                    row = row.replaceAll("{bimehtakmili}", addCommas(this['bimetakmili']));
                    row = row.replaceAll("{ghestvamha}", addCommas(this['numPriceVamMontly']));
                    row = row.replaceAll("{mosaede}", addCommas(this['numPriceMosaede']));
                    row = row.replaceAll("{takhir}", addCommas(this['takhir']));
                    row = row.replaceAll("{tajil}", addCommas(this['tajil']));
                    row = row.replaceAll("{ghibat}", addCommas(this['ghibat']));
                    row = row.replaceAll("{jarimemotefareghe}", addCommas(this['jarimeMotefareghe']));
                    row = row.replaceAll("{kharid}", addCommas(this['numPriceBuyCo']));
                    row = row.replaceAll("{exit}", addCommas(this['numPriceKhorojGhireMojaz']));

                    row = row.replaceAll("{kosormotefareghe}", addCommas(this['numPriceKosorMotefareghe']));
                    row = row.replaceAll("{maliathoghogh}", addCommas(this['numPricePersonelMaliat']));
                    row = row.replaceAll("{mah29roze}", addCommas(this['numPriceMonth29']));
                    row = row.replaceAll("{jarimehtakhir}", addCommas(this['numPriceJarimehTakhir8Saat']));

                    row = row.replaceAll("{morakhasiBiHoghogh}", addCommas(this['numPriceMorakhasiBiHoghogh']));
                row = row.replaceAll("{morakhasiDaneshjoie}", addCommas(this['numPriceMorakhasiUni']));
                    row = row.replaceAll("{sumkosor}", addCommas(this['numPriceCalcKosorat']));
                    row = row.replaceAll("{code}", this['numInvoiceCode']);
                    row = row.replaceAll("{khalespardakhti}", addCommas(this['numPriceCalcHoghoghKhales']));
                    row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                    row = row.replaceAll("{sheba}", this['strShebaBank'] == null ? "-" : this['strShebaBank']);
                    row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                    row = row.replaceAll("{status}", this['numStatus'] == "1" ? "واریز شده" : this['numStatus'] == "2" ? "واریز شده<br/>قطع همکاری" :this['numStatus'] == "3" ? "در انتظار قطع همکاری": "-");
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{Row}", i);
                    row = row.replaceAll("{style}", contractkindCheck == "1" ? "" : " style='display:none;'");
                    row = row.replaceAll("{sal}", this['strInvoiceYear']);
                    row = row.replaceAll("{mah}", this['strInvoiceMonth']);
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFinalFileRowPrint = i - 1;

                });
            }
            else if (contractkindCheck == "2") {
                $.each(data[0], function (index) {
                    row = mainrowSaati.replaceAll("{Check}", "<input type='checkbox' id='chkOnePrintFishPersonelCode{Row}' onclick='CheckOnePersonelItemsPrintFish(2,{Row});' checked='checked'/>");
                    row = row.replaceAll("{datevariz}", this['dateVarizDate']);
                    row = row.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                    row = row.replaceAll("{timeKarkard}", this['strJobTime']);
                    row = row.replaceAll("{pricesaat}", addCommas(this['numPriceSaati']));
                    row = row.replaceAll("{mandeAzMaheGhabl}", addCommas(this['strMandeAzMaheGhablTafkiki']));
                    row = row.replaceAll("{hoghoghsabet}", addCommas(this['numPersonelSalary']));
                    row = row.replaceAll("{padashsaier}", addCommas(this['numPersonelSaier']));

                    row = row.replaceAll("{ayabzahab}", addCommas(this['numPriceAyabzahab']));

                    row = row.replaceAll("{moavaghe}", addCommas(this['numPriceMoavaghe']));
                    row = row.replaceAll("{SumHagholZahme}", addCommas(this['numPriceCalcHoghogh1']));
                    row = row.replaceAll("{bimehkarmand}", addCommas(this['numPricePersonelBimeh']));
                    row = row.replaceAll("{bimehtakmili}", addCommas(this['bimetakmili']));
                    row = row.replaceAll("{ghestvamha}", addCommas(this['numPriceVamMontly']));
                    row = row.replaceAll("{mosaede}", addCommas(this['numPriceMosaede']));
                    row = row.replaceAll("{jarimemotefareghe}", addCommas(this['jarimeMotefareghe']));
                    row = row.replaceAll("{kharid}", addCommas(this['numPriceBuyCo']));

                    row = row.replaceAll("{kosormotefareghe}", addCommas(this['numPriceKosorMotefareghe']));
                    row = row.replaceAll("{maliat}", addCommas(this['numPricePersonelMaliat']));

                    row = row.replaceAll("{sumkosor}", addCommas(this['numPriceCalcKosorat']));
                    row = row.replaceAll("{khalespardakhti}", addCommas(this['numPriceCalcHoghoghKhales']));
                    row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{code}", this['numInvoiceSaatiCode']);
                    row = row.replaceAll("{Row}", i);
                    row = row.replaceAll("{sal}", this['strInvoiceYear']);
                    row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                    row = row.replaceAll("{sheba}", this['strShebaBank'] == null ? "-" : this['strShebaBank']);
                    row = row.replaceAll("{mah}", this['strInvoiceMonth']);
                    row = row.replaceAll("{status}", this['numStatus'] == "1" ? "واریز شده" : this['numStatus'] == "2" ? "واریز شده<br/>قطع همکاری" : this['numStatus'] == "3" ? "در انتظار قطع همکاری" : "-");
                    i = i + 1;
                    allrow = allrow + row;
                    t = 1;
                    InvoiceFinalFileRowPrint = i - 1;

                });
            }
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "ShowAllFinalHoghogh(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "ShowAllFinalHoghogh(" + nextPage + ")");
            }
            if (t == 1) {
                if (contractkindCheck == "1" || contractkindCheck == "3") {
                    header2 = header2.replaceAll("{padashAmakardTitle}", contractkindCheck == "1" ? "پاداش ارزیابی عملکرد" : "مجموع حق الزحمه فرآیند");
                    header2 = header2.replaceAll("{style}", contractkindCheck == "1" ? "" : " style='display:none;'");
                    $("#ResultDivReportPricePersonel").html(header + header2 + allrow + footer + footerPager);
                }
                else {
                    $("#ResultDivReportPricePersonel").html(header + headerSaati + allrow + footer + footerPager);
                }
                $("#divAllRecordCountAllFinalPersonel").html(allpage);
                $("#DivbtnPrintFishHoghogh").show();

            }
            else {
                $("#ResultDivReportPricePersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnPrintFishHoghogh").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportPricePersonel").html("");
            $("#ResultDivReportPricePersonel").hide();
            $("#DivbtnPrintFishHoghogh").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsPrintFish(type, row) {
    if (type == 1) {
        for (var i = 1; i <= InvoiceFinalFileRowPrint; i++) {
            if ($("#chkAllPrintFishPersonelCode").attr("checked"))
                $("#chkOnePrintFishPersonelCode" + i).attr("checked", "checked");
            else
                $("#chkOnePrintFishPersonelCode" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPrintFishPersonelCode").removeAttr("checked");
    }
}
//---------------------------------------------------------------------------------
///=========================== پرینت دسته ای صورت حساب کلی حقوق کارمندان =========================
//---------------------------------------------------------------------------------
function PrintAllHoghoghPersonel() {
    // "<a style='cursor:pointer;display:block;' href='PeikFactor.aspx?ofc={mellicode}' target='_blank'>"
    var PersonelCode = "";
    //alert(contractFileRow);
    for (var i = 1; i <= InvoiceFileRowPrint; i++) {
        if ($("#chkOnePrintPersonelCode" + i).attr("checked"))
            PersonelCode = PersonelCode + $.trim($("#tdInvoiceCodeHoghogh" + i).html()) + ",";
    }
    if (PersonelCode != "") {
        //var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
        //grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" :  $("#drpdwnWorkReportPriceJobKind").val() ;
        window.open('PeikFactor.aspx?itemsearch=' + ItemSearch + '&ofcPr=' + PersonelCode, '_blank');
    }
    else {
        ShowAlert("لطفا یک کد پرسنلی را برای پرینت صورت حساب انتخاب نمایید");
        return;
    }
}
//---------------------------------------------------------------------------------
///=========================== پرینت دسته ای فیش حقوق کارمندان =========================
//---------------------------------------------------------------------------------
function PrintAllFishHoghoghPersonel() {
    // "<a style='cursor:pointer;display:block;' href='PeikFactor.aspx?ofc={mellicode}' target='_blank'>"
    var Code = "";
    //alert(contractFileRow);
    for (var i = 1; i <= InvoiceFinalFileRowPrint; i++) {
        if ($("#chkOnePrintFishPersonelCode" + i).attr("checked"))
            Code = Code + $.trim($("#tdInvoiceCodeFishHoghogh" + i).html()) + ",";
    }
    if (Code != "") {
        //var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
        //grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" :  $("#drpdwnWorkReportPriceJobKind").val() ;
        window.open('PeikFactor.aspx?itemsearch=' + ItemSearch + '&ofcFish=' + Code, '_blank');
    }
    else {
        ShowAlert("لطفا یک کد پرسنلی را برای پرینت فیش حقوقی انتخاب نمایید");
        return;
    }
}
//---------------------------------------------------------------------------------
///=========================== گزارش شرح کسور =========================
//---------------------------------------------------------------------------------
function GetReportKosorInfoPersonel(vpage) {
    var personelcode = $.trim($("#txtReportKosorPersonelCode").val());
    var name = $.trim($("#txtReportKosorPersonelName").val());
    var mellicode = $.trim($("#txtReportKosorPersonelMelliCode").val());
    var WorkJob = $.trim($("#drpdwnWorkReportKosorJobKind").val());
    var contractkind = $.trim($("#drpdwnContractKindKosor").val());

    WorkJob = WorkJob == null || WorkJob == undefined || WorkJob == '' ? "-1" : "\"" + $("#drpdwnWorkReportKosorJobKind").val() + "\"";

    var month = $.trim($("#drpdwnReportKosorPriceJob").val());
    var year = $.trim($("#yearlblReportKosorYear").val());
    if (month == -1) {
        ShowAlert("ماه کارکرد باید مشخص شود !");
        return;
    }

    $("#ResultDivReportKosorPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportKosorPersonel").show();
    var header = "<table id='tblReportKosor' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";

    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th>" +
                  "<th align='center'>نام و نام خانوادگی</th><th>گروه کاری</th><th align='center'>بیمه سهم کارمند (ریال)</th>" +
                  "<th align='center'>بیمه تکمیلی (ریال)</th><th {style1}>مالیات حقوق (ریال)</th><th>قسط وام ها (ریال)</th><th>مساعده (ریال)</th><th {style}>تاخیر (ریال)</th>" +
                  "<th {style}>تعجیل (ریال)</th><th {style}> غیبت (ریال)</th><th>جریمه (ریال)</th><th >خریدازشرکت (ریال)</th>" +
                  "<th {style}>خروج غیرمجاز (ریال)</th><th {style}>مرخصی بدون حقوق (ریال)</th><th {style}>مرخصی دانشجویی (ریال)</th>" +
                  "<th {style}>کسور متفرقه (ریال)</th><th {style}>جریمه تاخیر بیش از 8 ساعت (ریال)</th><th {style1}>کسر کارکرد ماه 29 روزه (ریال)</th></thead><tbody>";

    var mainrow = "<tr><td>{Row}</td><td id='tdpersonelcode{Row}'>{personelcode}</td><td>{name}</td><td>{workgroup}</td>" +
                  "<td>{bimeh}</td><td>{bimehTakmili}</td><td {style1}>{maliat}</td><td>{vam}</td><td>{mosaede}</td><td {style}>{takhir}</td><td {style}>{tajil}</td>" +
                  "<td {style}>{ghibat}</td><td >{jarimeh}</td><td >{kharid}</td><td {style}>{exit}</td>" +
                  "<td {style}>{morakhasiBihogogh}</td><td {style}>{MorakhasiUni}</td><td {style}>{kosormotefareghe}</td><td {style}>{jarimehtakhir}</td>" +
                  "<td {style1}>{29roz}</td></tr>";

    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportKosorInfoPersonel(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelKosor' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelKosor' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportKosorInfoPersonel({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></p>";

    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "1000";
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
        data: { i: 19, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, WorkJob: WorkJob, page: vpage, perpage: vperpage, month: month, year: year },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));

                row = row.replaceAll("{bimeh}", addCommas(this['bimeh']));
                row = row.replaceAll("{bimehTakmili}", addCommas(this['bimetakmili']));
                row = row.replaceAll("{vam}", addCommas(this['numPriceVamMontly']));
                row = row.replaceAll("{mosaede}", addCommas(this['numPriceMosaede']));
                row = row.replaceAll("{takhir}", addCommas(this['takhir']));
                row = row.replaceAll("{tajil}", addCommas(this['tajil']));
                row = row.replaceAll("{ghibat}", addCommas(this['ghibat']));
                row = row.replaceAll("{jarimeh}", addCommas(this['jarimeMotefareghe']));
                row = row.replaceAll("{kharid}", addCommas(this['kharid']));

                row = row.replaceAll("{maliat}", addCommas(this['maliathoghogh']));
                row = row.replaceAll("{kosormotefareghe}", addCommas(this['kosormotefareghe']));
                row = row.replaceAll("{29roz}", addCommas(this['mah29roz']));
                row = row.replaceAll("{jarimehtakhir}", addCommas(this['jarimehtakhir']));

                row = row.replaceAll("{exit}", addCommas(this['khorojGhireMojaz']));
                row = row.replaceAll("{morakhasiBihogogh}", addCommas(this['MorakhasiBiHoghogh']));
                row = row.replaceAll("{MorakhasiUni}", addCommas(this['MorakhasiUni']));
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);

               // row = row.replaceAll("{style}", contractkind == 2 ? " style='display:none;'" : "");

                if (contractkind == "3") {
                    row = row.replaceAll("{style1}", "style='display:none;'");
                    row = row.replaceAll("{style}", "");
                }
                else if (contractkind == "1") {
                    row = row.replaceAll("{style1}", "");
                    row = row.replaceAll("{style}", "");
                }
                else if (contractkind == "2") {
                    row = row.replaceAll("{style1}", " style='display:none;'");
                    row = row.replaceAll("{style}", " style='display:none;'");
                }

                row = row.replaceAll("{Row}", i);
                allrow = allrow + row;
                i++;
                t = 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportKosorInfoPersonel(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportKosorInfoPersonel(" + nextPage + ")");
            }
            if (t == 1) {

                if (contractkind == 3 || contractkind == 1) {
                    header2 = header2.replaceAll("{style1}", contractkind == 3 ? " style='display:none;'" : "");
                }
                else if (contractkind == 2) {
                    header2 = header2.replaceAll("{style1}", " style='display:none;'");
                    header2 = header2.replaceAll("{style}", " style='display:none;'");
                }

                $("#ResultDivReportKosorPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonelKosor").html(allpage);
            }
            else {
                $("#ResultDivReportKosorPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivReportKosorPersonel").html("");
            $("#ResultDivReportKosorPersonel").hide();
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
//---------------------------------------------------------------------------------
///=========================== محاسبه مجدد حقوق کارمندان =========================
//---------------------------------------------------------------------------------
function ReCalcHoghogh() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRowPrint; i++) {
        if ($("#chkOnePrintPersonelCode" + i).attr("checked"))
            Code = Code + $.trim($("#tdInvoiceCodeHoghogh" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای محاسبه مجدد حقوق و دستمزد انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند  مجددا محاسبه حقوق می شوند \n آیا از محاسبه مجدد صورت حساب این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "محاسبه مجدد صورت حساب کلی حقوق و دستمزد",
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
                    data: { i: 20, ContractKindPublic: ContractKindPublic, Code: Code },
                    url: "PostBack/PBPersonelCalcutPrice.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت بازگردانده شد");
                            CheckPreInvoice();
                            GetAllPreInvoice();
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
///=========================== حذف محاسبه  حقوق کارمندان =========================
//---------------------------------------------------------------------------------
function DeleteCalcHoghogh() {
    var Code = "";
    for (var i = 1; i <= InvoiceFileRowPrint; i++) {
        if ($("#chkOnePrintPersonelCode" + i).attr("checked"))
            Code = Code + $.trim($("#tdInvoiceCodeHoghogh" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای حذف محاسبه حقوق و دستمزد انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند حذف می شوند \n آیا از حذف محاسبه صورت حساب این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "حذف محاسبه صورت حساب کلی حقوق و دستمزد",
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
                    data: { i: 21, ContractKindPublic: ContractKindPublic, Code: Code },
                    url: "PostBack/PBPersonelCalcutPrice.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت حذف شد");
                            CheckPreInvoice();
                            GetAllPreInvoice();
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
///=========================== چک کردن کارکرد ماهانه پرسنلی که وارد نشده اند =========================
//---------------------------------------------------------------------------------
var CheckProjectFileRow = 0;
var itemMonthSetKarKardProject = "";
function CheckKarkarMahaneForHoghgh() {
    CheckProjectFileRow = 0;
    $("#titleSortHoghogh").html("* مرتب سازی براساس ، کد پرسنلی می باشد");

    $("#DivbtnPreSavePrice").hide();
    $("#DivbtnSaveFinalPrice").hide();
    $("#DivbtnPrintFishHoghogh").hide();
    $("#DivbtnCheckKarkard").hide();
    $("#DivbtnPrintAll").hide();
    var personelcode = $.trim($("#txtReportPricePersonelCode").val());
    var name = $.trim($("#txtReportPricePersonelName").val());
    var mellicode = $.trim($("#txtReportPricePersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnWorkReportPriceJobKind").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkReportPriceJobKind").val() + "\"";
    var contractkind = $.trim($("#drpdwnContractKind").val());
    var contractkindCheck = contractkind;
    contractkind = contractkind == null || contractkind == undefined || contractkind == '' ? "-1" : "\"" + $("#drpdwnContractKind").val() + "\"";

    var month = $.trim($("#drpdwnKarkardPriceJob").val());
    var year = $.trim($("#yearlblKarkardPriceDate").val());
    if (month == -1) {
        ShowAlert("ماه کارکرد باید مشخص شود !");
        return;
    }
    itemMonthSetKarKardProject = year + "," + month;


    $("#ResultDivReportPricePersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivReportPricePersonel").show();
    var header = "<table id='tblCheckkarkardHoghogh' class='MainTbl' style='border-collapse: collapse; width:100%;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th {styleProject}><input type='checkbox' id='chkAllPersonelCodeProject' checked='checked' onclick='CheckOnePersonelItemsProject(1);'/></th><th>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th></thead><tbody>";
    var mainrow = "<tr><td {styleProject}>{check}</td><td>{Row}</td><td id='tdPersonelCodeProjecti{Row}'>{personelcode}</td><td>{name}</td><td>{workGroup}</td></tr>";
    var footer = "</tbody></table>";
    // var divbtnExcel = "<div style='padding:10px 0; text-align:center;'><input id='btnExcelCheckKarkardhoghgh' type='button'  value='خروجی اکسل'  onclcik='tableToExcel('tblCheckkarkardHoghogh'); return false;'/> </div>"
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 22, personelcode: personelcode, contractkind: contractkind, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{check}", contractkindCheck == "3" || contractkindCheck == "1" ? "<input type='checkbox' id='chkOnePersonelCodeProject{Row}' onclick='CheckOnePersonelItemsProject(2,{Row});' checked='checked'/>" : "");
                row = row.replaceAll("{styleProject}", contractkindCheck == "3" || contractkindCheck == "1" ? "" : " style='display:none;'");
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                CheckProjectFileRow = i - 1;
            });

            if (t == 1) {
                header2 = header2.replaceAll("{styleProject}", contractkindCheck == "3" || contractkindCheck == "1" ? "" : " style='display:none;'");
                $("#ResultDivReportPricePersonel").html(header + header2 + allrow + footer);

                if (contractkindCheck == "3" || contractkindCheck == "1") $("#btnSetKarkardProjecti").show();
                else $("#btnSetKarkardProjecti").hide();

                $("#DivbtnCheckKarkard").show();
            }
            else {
                $("#ResultDivReportPricePersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnCheckKarkard").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#DivbtnCheckKarkard").hide();
            $("#ResultDivReportPricePersonel").html("");
            $("#ResultDivReportPricePersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsProject(type, row) {
    if (type == 1) {
        for (var i = 1; i <= CheckProjectFileRow; i++) {
            if ($("#chkAllPersonelCodeProject").attr("checked"))
                $("#chkOnePersonelCodeProject" + i).attr("checked", "checked");
            else
                $("#chkOnePersonelCodeProject" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPersonelCodeProject").removeAttr("checked");
    }
}
//---------------------------------------------------------------------------------
//---------------------------------صفر کردن کارکرد پیمانکاری------------------------------------------------
//---------------------------------------------------------------------------------
function SetKarkardSefr() {
    var PersonelCode = "";
    for (var i = 1; i <= CheckProjectFileRow; i++) {
        if ($("#chkOnePersonelCodeProject" + i).attr("checked"))
            PersonelCode = PersonelCode + $.trim($("#tdPersonelCodeProjecti" + i).html()) + ",";
    }
    if (PersonelCode == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;
    }

    $("#Note").html("آیا از صفر کردن کارکرداین پرسنل اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "صفر کردن کارکرد پرسنل قرارداد پیمانکاری",
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
                    data: { i: 31, PersonelCode: PersonelCode, itemMonthSetKarKardProject: itemMonthSetKarKardProject },
                    url: "PostBack/PBPersonelCalcutPrice.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت ثبت شد");
                            CheckKarkarMahaneForHoghgh();
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
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function FaraiandkarkardChange() {
    var month = $("#drpdwnFaraiandJobUpFile").val();

    if (month == -1) {
        $("#divkarkardFaraiand").hide();
        $("#DivbtnSaveKarkard").hide();
    }
    else {

        $("#divkarkardFaraiand").show();
        $("#DivbtnSaveKarkard").show();

        $("#pcaldateStartjobUpFile").val("");
        $("#pcaldateEndjobUpFile").val("");

        $("#txtUpkarkardPersonel").val("");
        $("#uploadFilekarkardPersonel").val("");

        $("#DivErrorKarkardFaraiand").html("");
        $("#DivErrorKarkardFaraiand").hide();
    }


}
//==================================================================================
function changeValueUpFile(txtName, upfilename) {
    $("#" + txtName).val($("#" + upfilename).val());
}
//---------------------------------------------------------------------------------
///==================== آپلود فرایند قرارداد پیمانکاری ها =====================================
//---------------------------------------------------------------------------------
function UpFileKarkard() {
    var month = $("#drpdwnFaraiandJobUpFile").val();

    $("#DivErrorKarkardFaraiand").hide();
    var datefrom = $.trim($("#pcaldateStartjobUpFile").val());
    var dateto = $.trim($("#pcaldateEndjobUpFile").val());

    var filekarkard = $.trim($("#txtUpkarkardPersonel").val());


    if (datefrom == "" || dateto == "" || filekarkard == "") {
        ShowAlert("لطفا اطلاعات خواسته شده را به دقت وارد نمایید!");
        return;
    }
    var upfilename = "uploadFilekarkardPersonel";
    if (($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null)) {

        var fd = new FormData();

        fd.append("UpFilekarkard", document.getElementById(upfilename).files[0]);
        fd.append("i", 23);
        fd.append("month", month);
        fd.append("datefrom", datefrom);
        fd.append("dateto", dateto);

        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();

        var header = "<table id='tableErrorKarkardFaraiand' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
        var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th></th></thead><tbody>";
        var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{errTitle}</td></tr>";
        var footer = "</tbody></table>";
        var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelErrorKarkarFaraiand' type='button' value='خروجی اکسل' onclick='ExcelReportTable('tableErrorKarkardFaraiand');'/></div>";

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: fd,
            url: "PostBack/PBPersonelCalcutPrice.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();

                if (data == "1") {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    $("#drpdwnFaraiandJobUpFile").val(-1);
                    FaraiandkarkardChange();
                }
                else if (data == "2") {
                    ShowAlert("فرمت فایل اکسل نمی باشد!");
                }
                else if (data == "3") {
                    ShowAlert("خطا در ثبت اطلاعات لطفا مجددا تلاش نمایید!");
                }
                else {
                    var row = "", allrow = "";
                    var i = 1;
                    $.each(data, function (index) {
                        row = mainrow.replaceAll("{Row}", i);
                        row = row.replaceAll("{name}", this['strPersonelName']);
                        row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                        row = row.replaceAll("{errTitle}", this['ErrorCode'] == "0" ? "کد پرسنلی یافت نشد" : this['ErrorCode'] == "1" ? "با موفقیت انجام شد" : this['ErrorCode'] == "2" ? "کد پرسنلی غیر فعال در سیستم" : this['ErrorCode'] == "3" ? "کد پرسنلی نیمه فعال در سیستم" : this['ErrorCode'] == "4" ? "فرارداد این پرسنل پیمانکاری نمی باشد" : this['ErrorCode'] == "5" ? "قرارداد غیرفعال شده" : this['ErrorCode'] == "6" ? "مبلغ فرآیند برای این پرسنل درج نشده یا صفر می باشد" : "");
                        i = i + 1;
                        allrow = allrow + row;
                        t = 1;
                    });

                    if (t == 1) {
                        $("#DivErrorKarkardFaraiand").html(header + header2 + allrow + footer + btnExcel);
                        $("#DivErrorKarkardFaraiand").show();
                        $("#btnExcelErrorKarkarFaraiand").buttons();
                    }
                    else {
                        $("#DivErrorKarkardFaraiand").hide();
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();
                $("#DivErrorKarkardFaraiand").hide();
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });

    }
    else {
        ShowAlert("ابتدا فایل فرآیند مورد نظر را بارگزاری نمایید!");
    }
}
//---------------------------------------------------------------------------------
///=========================== محاسبه فرآیند =========================
//---------------------------------------------------------------------------------
var FaraiandFileRow = 0;
var ItemSearchFaraind = "";
function rptPersonelFaraiandProject(vpage) {
    FaraiandFileRow = 0;
    $("#DivbtnPreSavePriceFaraind").hide();
    $("#DivbtnCheckKarkardFaraind").hide();
    $("#DivbtnSaveFinalPriceFaraind").hide();
    $("#DivbtnPrintFishFaraind").hide();

    var personelcode = $.trim($("#txtReportKarkardPersonelCode").val());
    var name = $.trim($("#txtReportKarkardPersonelName").val());
    var mellicode = $.trim($("#txtReportKarkardPersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnSearchWorkJobKindFaraiand").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKindFaraiand").val() + "\"";


    var month = $.trim($("#drpdwnFaraiandKarkard").val());
    var year = $.trim($("#yearlblFaraiandKarkardhDate").val());
    if (month == -1) {
        ShowAlert("ماه فرآیند باید مشخص شود !");
        return;
    }
    ItemSearchFaraind = month + "," + year;

    $("#ResultDivKarkardPersonelFaraiand").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivKarkardPersonelFaraiand").show();
    var header = "<table id='tblVarizFaraiand1' class='MainTbl' style='border-collapse: collapse; width:100%;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCodeFaraind' checked='checked' onclick='CheckOnePersonelItemsFaraind(1);'/></th>" +
                  "<th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th>" +
                   "<th align='center'>حق الزحمه به ازای یک فرآیند (ریال)</th><th align='center'>تعداد فرآیند</th><th align='center'>خالص پرداختی حق الزحمه فرآیند (ریال)</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdPersonelCodeFaraiand{Row}'>{personelcode}</td><td>{name}</td><td>{workGroup}</td><td>{hagholzahmeOne}</td><td>{cntFaraiand}</td><td>{khalesPardakhtifaraiand}</td><td>{bankName}</td><td>{numberAccount}</td></tr>";

    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv' style='2702px;'><div class='pageritem'><a onclick='rptPersonelFaraiandProject(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPricePPersonelfaraiand' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPricePersonelFaraiand' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='rptPersonelFaraiandProject({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";
    var row = ""; var allrow = ""; var AllRecordCount;
    vperpage = "50000";
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
        data: { i: 24, personelcode: personelcode, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCodeFaraind{Row}' onclick='CheckOnePersonelItemsFaraind(2,{Row});' checked='checked'/>");
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{hagholzahmeOne}", addCommas(this['numPriceOneFaraiand']));
                row = row.replaceAll("{cntFaraiand}", addCommas(this['numcountFaraiand']));
                row = row.replaceAll("{khalesPardakhtifaraiand}", addCommas(this['numCalcKhalesFaraiand']));
                row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                FaraiandFileRow = i - 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "rptPersonelFaraiandProject(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "rptPersonelFaraiandProject(" + nextPage + ")");
            }
            if (t == 1) {

                $("#ResultDivKarkardPersonelFaraiand").html(header + header2 + allrow + footer + endfooter);
                $("#DivbtnPreSavePriceFaraind").show();
                $("#divAllRecordCountPricePersonelFaraiand").html(allpage);

            }
            else {
                $("#ResultDivKarkardPersonelFaraiand").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnPreSavePriceFaraind").hide();

            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivKarkardPersonelFaraiand").html("");
            $("#ResultDivKarkardPersonelFaraiand").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsFaraind(type, row) {
    if (type == 1) {
        for (var i = 1; i <= FaraiandFileRow; i++) {
            if ($("#chkAllPersonelCodeFaraind").attr("checked"))
                $("#chkOnePersonelCodeFaraind" + i).attr("checked", "checked");
            else
                $("#chkOnePersonelCodeFaraind" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPersonelCodeFaraind").removeAttr("checked");
    }
}
//---------------------------------------------------------------------------------
///=========================== پیش ثبت محاسبه فرآیند پرسنل =========================
//---------------------------------------------------------------------------------
function PreSaveFaraind() {
    var PersonelCodeTemp = "";
    for (var i = 1; i <= FaraiandFileRow; i++) {
        if ($("#chkOnePersonelCodeFaraind" + i).attr("checked"))
            PersonelCodeTemp = PersonelCodeTemp + $.trim($("#tdPersonelCodeFaraiand" + i).html()) + ","
    }
    if ($.trim(PersonelCodeTemp) == "") {
        ShowAlert("لطفا کارمندی را انتخاب نمایید!");
        return;
    }
    else {
        $("#Note").html("آیا از پیش ثبت فرآیند اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "پیش ثبت فرآیند",
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
                        data: { i: 25, PersonelCodeTemp: PersonelCodeTemp, ItemSearch: ItemSearchFaraind },
                        url: "PostBack/PBPersonelCalcutPrice.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#btnPersonelPreFaraiandSearch").show();
                                rptPersonelFaraiandProject(1);
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
///=========================== چک و نمایش مشاهده آخرین بررسی =========================
//---------------------------------------------------------------------------------
function CheckPreFaraind() {
    var personelcode = $.trim($("#txtReportKarkardPersonelCode").val());
    var name = $.trim($("#txtReportKarkardPersonelName").val());
    var mellicode = $.trim($("#txtReportKarkardPersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnSearchWorkJobKindFaraiand").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKindFaraiand").val() + "\"";
    var month = $.trim($("#drpdwnFaraiandKarkard").val());
    var year = $.trim($("#yearlblFaraiandKarkardhDate").val());

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 27, personelcode: personelcode, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            if (parseInt(data) > 0)
                $("#btnPersonelPreFaraiandSearch").show();
            else
                $("#btnPersonelPreFaraiandSearch").hide();
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== مشاهده گزارش آخرین بررسی فرآیند =========================
//---------------------------------------------------------------------------------
var FaraindFileRowPrint = 0;
function GetAllPreFaraind() {

    $("#DivbtnPreSavePriceFaraind").hide();
    $("#DivbtnCheckKarkardFaraind").hide();
    $("#DivbtnSaveFinalPriceFaraind").hide();
    $("#DivbtnPrintFishFaraind").hide();
    FaraindFileRowPrint = 0;

    var personelcode = $.trim($("#txtReportKarkardPersonelCode").val());
    var name = $.trim($("#txtReportKarkardPersonelName").val());
    var mellicode = $.trim($("#txtReportKarkardPersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnSearchWorkJobKindFaraiand").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKindFaraiand").val() + "\"";
    var month = $.trim($("#drpdwnFaraiandKarkard").val());
    var year = $.trim($("#yearlblFaraiandKarkardhDate").val());
    ItemSearchFaraind = month + "," + year;

    $("#ResultDivKarkardPersonelFaraiand").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivKarkardPersonelFaraiand").show();
    var header = "<table id='tblVarizFaraiand2' class='MainTbl' style='border-collapse: collapse; width:100%;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCodeFaraindPrint' checked='checked' onclick='CheckOnePersonelItemsFaraindPrint(1);'/></th>" +
                  "<th align='center' width='50px'>ردیف</th><th style='display:none;'></th><th align='center' width='50px'>سال</th><th align='center' width='50px'>ماه</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th>" +
                   "<th align='center'>حق الزحمه به ازای یک فرآیند (ریال)</th><th align='center'>تعداد فرآیند</th><th align='center'>خالص پرداختی حق الزحمه فرآیند (ریال)</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th style='display:none;'>شماره شبا</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdFaraiandCodePrint{Row}' style='display:none;'>{code}</td><td>{sal}</td><td>{mah}</td><td id='tdPersonelCodeFaraiandPrint{Row}'>{personelcode}</td><td>{name}</td><td>{workGroup}</td><td>{hagholzahmeOne}</td><td>{cntFaraiand}</td><td>{khalesPardakhtifaraiand}</td><td>{bankName}</td><td>{numberAccount}</td><td style='display:none;'>{sheba}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 26, personelcode: personelcode, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCodeFaraindPrint{Row}' onclick='CheckOnePersonelItemsFaraindPrint(2,{Row});' checked='checked'/>");
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{hagholzahmeOne}", addCommas(this['numPriceOneFaraiand']));
                row = row.replaceAll("{cntFaraiand}", addCommas(this['numcountFaraiand']));
                row = row.replaceAll("{khalesPardakhtifaraiand}", addCommas(this['numCalcKhalesFaraiand']));
                row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{sal}", this['numYear']);
                row = row.replaceAll("{mah}", this['strfaraiandMonth']);
                row = row.replaceAll("{sheba}", this['strShebaBank'] == null ? "-" : this['strShebaBank']);
                row = row.replaceAll("{code}", this['numFaraiandCalcCode']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                FaraindFileRowPrint = i - 1;
            });

            if (t == 1) {

                $("#ResultDivKarkardPersonelFaraiand").html(header + header2 + allrow + footer);
                $("#DivbtnSaveFinalPriceFaraind").show();
                $("#DivbtnPrintFishFaraind").hide();
            }
            else {
                $("#ResultDivKarkardPersonelFaraiand").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnSaveFinalPriceFaraind").hide();
                $("#DivbtnPrintFishFaraind").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivKarkardPersonelFaraiand").html("");
            $("#ResultDivKarkardPersonelFaraiand").hide();
            $("#DivbtnSaveFinalPriceFaraind").hide();
            $("#DivbtnPrintFishFaraind").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
function CheckOnePersonelItemsFaraindPrint(type, row) {
    if (type == 1) {
        for (var i = 1; i <= FaraindFileRowPrint; i++) {
            if ($("#chkAllPersonelCodeFaraindPrint").attr("checked"))
                $("#chkOnePersonelCodeFaraindPrint" + i).attr("checked", "checked");
            else
                $("#chkOnePersonelCodeFaraindPrint" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllPersonelCodeFaraindPrint").removeAttr("checked");
    }
}
//---------------------------------------------------------------------------------
///=========================== ثبت نهایی فرآیند =========================
//---------------------------------------------------------------------------------
function SaveFinalFaraind() {
    $("#Note").html("آیا از ثبت نهایی فرآیند اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ثبت نهایی فرآیند",
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
                var Code = "";
                for (var i = 1; i <= FaraindFileRowPrint; i++) {
                    if ($("#chkOnePersonelCodeFaraindPrint" + i).attr("checked"))
                        Code = Code + $.trim($("#tdFaraiandCodePrint" + i).html()) + ",";
                }

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 28, Code: Code },
                    url: "PostBack/PBPersonelCalcutPrice.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت ثبت شد");
                            CheckPreFaraind();
                            GetAllPreFaraind();
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
///=========================== مشاهده گزارش نهایی فرآیند =========================
//---------------------------------------------------------------------------------
var FaraindFinalFileRowPrint = 0;
function ShowAllFinalFaraind(vpage) {

    $("#DivbtnPreSavePriceFaraind").hide();
    $("#DivbtnCheckKarkardFaraind").hide();
    $("#DivbtnSaveFinalPriceFaraind").hide();
    $("#DivbtnPrintFishFaraind").hide();
    FaraindFinalFileRowPrint = 0;

    var personelcode = $.trim($("#txtReportKarkardPersonelCode").val());
    var name = $.trim($("#txtReportKarkardPersonelName").val());
    var mellicode = $.trim($("#txtReportKarkardPersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnSearchWorkJobKindFaraiand").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKindFaraiand").val() + "\"";
    var month = $.trim($("#drpdwnFaraiandKarkard").val());
    var year = $.trim($("#yearlblFaraiandKarkardhDate").val());
    ItemSearchFaraind = month + "," + year;

    $("#ResultDivKarkardPersonelFaraiand").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivKarkardPersonelFaraiand").show();
    var header = "<table id='tblVarizFaraiand3' class='MainTbl' style='border-collapse: collapse; width:100%;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCodeFaraindPrint' checked='checked' onclick='CheckOnePersonelItemsFaraindPrint(1);'/></th>" +
                  "<th align='center' width='50px'>ردیف</th><th align='center' width='50px'>سال</th><th align='center' width='50px'>ماه</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th>" +
                   "<th align='center'>حق الزحمه به ازای یک فرآیند (ریال)</th><th align='center'>تعداد فرآیند</th><th align='center'>خالص پرداختی حق الزحمه فرآیند (ریال)</th><th align='center'>نام بانک</th><th align='center'>شماره حساب</th><th align='center'>تاریخ واریز</th><th align='center'>وضعیت</th>" +
                   "</thead><tbody>";
    var mainrow = "<tr><td>{Check}</td><td>{Row}</td><td id='tdFaraiandCodePrint{Row}' style='display:none;'>{code}</td><td>{sal}</td><td>{mah}</td><td id='tdPersonelCodeFaraiandPrint{Row}'>{personelcode}</td><td>{name}</td><td>{workGroup}</td><td>{hagholzahmeOne}</td><td>{cntFaraiand}</td><td>{khalesPardakhtifaraiand}</td><td>{bankName}</td><td>{numberAccount}</td><td>{datevariz}</td><td>{status}</td></tr>";

    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='ShowAllFinalFaraind(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPriceAllFinalFaraiand' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountAllFinalPersonelFaraiand' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='ShowAllFinalFaraind({lastpage})'>" +
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
        data: { i: 29, personelcode: personelcode, name: name, mellicode: mellicode, grohkari: grohkari, month: month, year: year, page: vpage, perpage: vperpage },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Check}", "<input type='checkbox' id='chkOnePersonelCodeFaraindPrint{Row}' onclick='CheckOnePersonelItemsFaraindPrint(2,{Row});' checked='checked'/>");
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{hagholzahmeOne}", addCommas(this['numPriceOneFaraiand']));
                row = row.replaceAll("{cntFaraiand}", addCommas(this['numcountFaraiand']));
                row = row.replaceAll("{khalesPardakhtifaraiand}", addCommas(this['numCalcKhalesFaraiand']));
                row = row.replaceAll("{bankName}", this['strBankName'] == null ? "-" : this['strBankName']);
                row = row.replaceAll("{numberAccount}", this['strBankAccount']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{sal}", this['numYear']);
                row = row.replaceAll("{mah}", this['strfaraiandMonth']);
                row = row.replaceAll("{code}", this['numFaraiandCalcCode']);
                row = row.replaceAll("{datevariz}", this['dateVarizDate']);
                row = row.replaceAll("{status}", this['numStatus'] == "1" ? "واریز شده" : this['numStatus'] == "2" ? "واریز شده<br/>قطع همکاری" : "-");
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                FaraindFinalFileRowPrint = i - 1;

            });

            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "ShowAllFinalFaraind(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "ShowAllFinalFaraind(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivKarkardPersonelFaraiand").html(header + header2 + allrow + footer + footerPager);

                $("#divAllRecordCountAllFinalPersonelFaraiand").html(allpage);
                $("#DivbtnPrintFishFaraind").show();
            }
            else {
                $("#ResultDivKarkardPersonelFaraiand").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnPrintFishFaraind").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivKarkardPersonelFaraiand").html("");
            $("#ResultDivKarkardPersonelFaraiand").hide();
            $("#DivbtnPrintFishFaraind").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== چک کردن لیست پرسنل فرآیندی =========================
//---------------------------------------------------------------------------------
function CheckListPersonelFaraiandi() {

    $("#DivbtnPreSavePriceFaraind").hide();
    $("#DivbtnCheckKarkardFaraind").hide();
    $("#DivbtnSaveFinalPriceFaraind").hide();
    $("#DivbtnPrintFishFaraind").hide();

    var personelcode = $.trim($("#txtReportKarkardPersonelCode").val());
    var name = $.trim($("#txtReportKarkardPersonelName").val());
    var mellicode = $.trim($("#txtReportKarkardPersonelMelliCode").val());
    var grohkari = $.trim($("#drpdwnSearchWorkJobKindFaraiand").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKindFaraiand").val() + "\"";
    //var month = $.trim($("#drpdwnFaraiandKarkard").val());
    //var year = $.trim($("#yearlblFaraiandKarkardhDate").val());

    $("#ResultDivKarkardPersonelFaraiand").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivKarkardPersonelFaraiand").show();
    var header = "<table id='tblCheckListpersonelFaraiandi' class='MainTbl' style='border-collapse: collapse; width:100%;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{workGroup}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 30, personelcode: personelcode, name: name, mellicode: mellicode, grohkari: grohkari },
        url: "PostBack/PBPersonelCalcutPrice.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
            });

            if (t == 1) {
                $("#ResultDivKarkardPersonelFaraiand").html(header + header2 + allrow + footer);
                $("#DivbtnCheckKarkardFaraind").show();
            }
            else {
                $("#ResultDivKarkardPersonelFaraiand").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivbtnCheckKarkardFaraind").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#DivbtnCheckKarkardFaraind").hide();
            $("#ResultDivKarkardPersonelFaraiand").html("");
            $("#ResultDivKarkardPersonelFaraiand").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== پرینت دسته ای فرآیند =========================
//---------------------------------------------------------------------------------
function PrintAllPersonelFaraiandi() {

    var Code = "";

    for (var i = 1; i <= FaraindFileRowPrint; i++) {
        if ($("#chkOnePersonelCodeFaraindPrint" + i).attr("checked"))
            Code = Code + $.trim($("#tdFaraiandCodePrint" + i).html()) + ",";
    }

    if (Code != "") {
        window.open('PeikFactor.aspx?itemsearch=' + ItemSearchFaraind + '&ofcFaraiand=' + Code, '_blank');
    }
    else {
        ShowAlert("لطفا یک کد پرسنلی را برای پرینت فرآیند انتخاب نمایید");
        return;
    }
}
//---------------------------------------------------------------------------------
///=========================== محاسبه مجدد فرآیند کارمندان =========================
//---------------------------------------------------------------------------------
function ReCalcFaraiand() {
    var Code = "";
    for (var i = 1; i <= FaraindFileRowPrint; i++) {
        if ($("#chkOnePersonelCodeFaraindPrint" + i).attr("checked"))
            Code = Code + $.trim($("#tdFaraiandCodePrint" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای محاسبه مجدد فرآیند انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند  مجددا محاسبه فرآیند می شوند \n آیا از محاسبه مجدد فرآیند این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "محاسبه مجدد فرآیند",
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
                    data: { i: 32, Code: Code },
                    url: "PostBack/PBPersonelCalcutPrice.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت بازگردانده شد");
                            CheckPreFaraind();
                            GetAllPreFaraind();
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
///=========================== حذف محاسبه فرآیند کارمندان =========================
//---------------------------------------------------------------------------------
function DeleteCalcFaraiand() {
    var Code = "";
    for (var i = 1; i <= FaraindFileRowPrint; i++) {
        if ($("#chkOnePersonelCodeFaraindPrint" + i).attr("checked"))
            Code = Code + $.trim($("#tdFaraiandCodePrint" + i).html()) + ",";
    }

    if (Code == "") {
        ShowAlert("لطفا یک کد پرسنلی را برای حذف محاسبه فرآیند انتخاب نمایید");
        return;
    }

    $("#Note").html("کد های پرسنلی که تیک خورده اند حذف می شوند \n آیا از حذف محاسبه فرآیند این پرسنل ها اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "حذف محاسبه فرآیند",
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
                    data: { i: 33, Code: Code },
                    url: "PostBack/PBPersonelCalcutPrice.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            ShowAlert("اطلاعات با موفقیت حذف شد");
                            CheckPreFaraind();
                            GetAllPreFaraind();
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

