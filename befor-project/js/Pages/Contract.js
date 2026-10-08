var salaryMain = 0;
var BonMain = 0;
var HomeMain = 0;
var HaghOladMain = 0;

$(document).ready(function () {

    $("#divPersonelTabs,#EditdivPersonelTabs").tabs();
    $("#divPersonelWorkGroup").tabs();
    $("#divPersonelContractTadvin").tabs();

    $("#drpdwnSaatiZemanatKind,#drpdwnZemanatKind").multiselect({ minWidth: '176', noneSelectedText: 'ندارد' });

    GetTabsDeActive("divPersonelTabs");
    GetMainSalary();
    GetChangeHazineJari();
    GetChangePorsant();
    GetInfoOwner();
    GetInfoOwnerSaati();

    getInfoZemanat(1);
    getInfoZemanatSaati(1);
    getInfoTransportSaati(1);
    getInfoTransport(1);
    GetChangeSaatiPorsant();
    GetChangeSaatiHazineJari();

    GetDrpdwnBaseAll();
    GetReportInfoPersonelContract(1);
    GetAllPeikNew(1);

    $("#divPersonelContractTadvin").bind('tabsselect', function (event, ui) {
        getTabActiveForRecontract($('#divPersonelContractTadvin .ui-tabs-selected').index());
    });

    getTabActiveForRecontract2($('#divPersonelContractTadvin .ui-tabs-selected').index());

    var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
    var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();

    var objCal1 = new AMIB.persianCalendar('pcaldateContractFromDate', {
        extraInputID: 'pcaldateContractFromDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal2 = new AMIB.persianCalendar('pcaldateContractToDate', {
        extraInputID: 'pcaldateContractToDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal4 = new AMIB.persianCalendar('pcaldateContractUnValidDate', {
        extraInputID: 'pcaldateContractUnValidDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal5 = new AMIB.persianCalendar('pcaldateBrithdayDate', {
        extraInputID: 'pcaldateBrithdayDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal6 = new AMIB.persianCalendar('pcaldateDoreFromDate', {
        extraInputID: 'pcaldateDoreFromDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal7 = new AMIB.persianCalendar('pcaldateCDoreToDate', {
        extraInputID: 'pcaldateCDoreToDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal8 = new AMIB.persianCalendar('pcalSaatidateContractFromDate', {
        extraInputID: 'pcalSaatidateContractFromDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal9 = new AMIB.persianCalendar('pcalSaatidateContractToDate', {
        extraInputID: 'pcalSaatidateContractToDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal10 = new AMIB.persianCalendar('pcalSaatidateContractTavafoghDate', {
        extraInputID: 'pcalSaatidateContractTavafoghDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal11 = new AMIB.persianCalendar('pcaldateContractFromDateNewFrmOld', {
        extraInputID: 'pcaldateContractFromDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal12 = new AMIB.persianCalendar('pcaldateContractToDateNewFrmOld', {
        extraInputID: 'pcaldateContractToDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal13 = new AMIB.persianCalendar('pcaldateContractUnValidDateNewFrmOld', {
        extraInputID: 'pcaldateContractUnValidDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });


    var objCal14 = new AMIB.persianCalendar('pcalSaatidateContractFromDateNewFrmOld', {
        extraInputID: 'pcalSaatidateContractFromDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal15 = new AMIB.persianCalendar('pcalSaatidateContractToDateNewFrmOld', {
        extraInputID: 'pcalSaatidateContractToDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal16 = new AMIB.persianCalendar('pcalSaatidateContractTavafoghDateNewFrmOld', {
        extraInputID: 'pcalSaatidateContractTavafoghDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });


    var objCal17 = new AMIB.persianCalendar('pcalProjeidateContractFromDateNewFrmOld', {
        extraInputID: 'pcalProjeidateContractFromDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal18 = new AMIB.persianCalendar('pcalProjeidateContractToDateNewFrmOld', {
        extraInputID: 'pcalProjeidateContractToDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal19 = new AMIB.persianCalendar('pcalProjeidateContractTavafoghDateNewFrmOld', {
        extraInputID: 'pcalProjeidateContractTavafoghDateNewFrmOld',
        extraInputFormat: 'yyyy/mm/dd'
    });

    $("#btnCheckPersonelEndContract").click(function () { CheckPersonelForEndContract(); return false; });
    $("#btnExcelContractEnd").click(function () { tableToExcel('tblCheckContractEnd'); return false; });

    $("#btnSaveInfoContract").click(function () { RegisterInfoContract(1); return false; });
    $("#btnEditInfoContract").click(function () { RegisterInfoContract(3); return false; });
    $("#btnCancelEditInfoContract").click(function () { CancelEditContractMovaghat(1); return false; });

    $("#btnSaatiSaveInfoContract").click(function () { RegisterInfoContract(2); return false; });
    $("#btnProjectSaveInfoContract").click(function () { RegisterInfoContract(2); return false; });


    $("#btnSaatiEditInfoContract").click(function () { RegisterInfoContract(4); return false; });
    $("#btnProjectEditInfoContract").click(function () { RegisterInfoContract(5); return false; });
    $("#btnSaatiCancelEditInfoContract").click(function () { CancelEditContractMovaghat(2); return false; });
    $("#btnProjectCancelEditInfoContract").click(function () { CancelEditContractMovaghat(3); return false; });


    $("#btnReportPersonelSearch").click(function () { GetReportInfoPersonel(1); return false; });
    $("#btnReportPersonelSearchContract").click(function () { GetReportInfoPersonelContract(1); return false; });

    $("#btnSaveNewWorkGroupCode").click(function () { SaveWorkGroupNew(); return false; });
    $("#btnSearchPersonelCodeWorkGroupCode").click(function () { GetInfoPersonelWorKGroup(); return false; });
    $("#btnSearchPersonelCodeCutWork").click(function () { SearchGetPersonelInfoCutWork(); return false; });

    $("#btnSearchPersonelCodeReContract").click(function () { SearchPersonelInfoForReContract(); return false; });

    $("#btnReContractEndAction").click(function () { ShowPanelRecontractNewFromOldContract(); return false; });

    $("#btnPeikPersonelSearchContract").click(function () { GetAllPeikNew(1); return false; });

    // GetAllWorkGroup();


    $("#txtHoghogheSabet").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            GetHaghOladFromHoghogh();
            return false;
        }
    });

    $("#txtPersonelCodeForWorkGroup").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            GetInfoPersonelWorKGroup();
            return false;
        }
    });

    $("#txtPersonelCodeForCutWork").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            SearchGetPersonelInfoCutWork();
            return false;
        }
    });


    $("#txtPersonelCodeForReContract").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            SearchPersonelInfoForReContract();
            return false;
        }
    });


    $("#txtPostCode").keydown(function (e) {
        if (e.which == 9) {
            $("#txtTel1").focus();
            //e.preventDefault();
            return false;
        }
    });

    $("#txtTel1").keydown(function (e) {
        if (e.which == 9) {
            $("#txtTel").focus();
            //e.preventDefault();
            return false;
        }
    });

    $("#txtTel").keydown(function (e) {
        if (e.which == 9) {
            $("#txtMobile").focus();
            //e.preventDefault();
            return false;
        }
    });

    $("#txtMoarefFamily").keydown(function (e) {
        if (e.which == 9) {
            $("#txtMoarefTel1").focus();
            //e.preventDefault();
            return false;
        }
    });

    $("#txtMoarefTel1").keydown(function (e) {
        if (e.which == 9) {
            $("#txtMoarefTel").focus();
            //e.preventDefault();
            return false;
        }
    });

    $("#txtMoarefTel").keydown(function (e) {
        if (e.which == 9) {
            $("#txtMoarefMobile").focus();
            //e.preventDefault();
            return false;
        }
    });
    $("#titleEditInsertContract").html("تدوین");
    $("#btnSaveInfoContract").show();
    $("#btnEditInfoContract").hide();
    $("#btnCancelEditInfoContract").hide();

    $("#btnSaatiSaveInfoContract").show();
    $("#btnProjectSaveInfoContract").show();
    $("#btnSaatiEditInfoContract").hide();
    $("#btnSaatiCancelEditInfoContract").hide();
    $("#btnProjectEditInfoContract").hide();
    $("#btnProjectCancelEditInfoContract").hide();

    $("#yearlblDateFrom").val(DateFrom.split('/')[0]);
    $("#monthlblDateFrom").val(DateFrom.split('/')[1]);
    $("#daylblDateFrom").val(DateFrom.split('/')[2]);
    $("#yearlblDateTo").val(DateTo.split('/')[0]);
    $("#monthlblDateTo").val(DateTo.split('/')[1]);
    $("#daylblDateTo").val(DateTo.split('/')[2]);
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
var drpdwnAgent = "";
var drpdwncontractState = "";
var drpdwnorgchart = "";

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
    drpdwnAgent = "";
    drpdwncontractState = "";
    drpdwnorgchart = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            drpdwnMarrid = data[0];
            drpdwnProvince = data[1];
            drpdwnCity = data[2];
            drpdwnContractKinds = data[3];
            drpdwnEmployer = data[4];
            // drpdwnUnitOrganizations = data[5];
            drpdwnjensiat = data[6];
            drpdwnWorkgroup = data[7];
            drpdwnAgent = data[8];
            drpdwncontractState = data[9];
            drpdwnorgchart = data[10];

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
    selectStart1 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' onchange='ShowDrpDwnInRegisterPage(2); ShowDrpDwnInRegisterPage(4);' style='width:176px;'>";
    selectStart2 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;' onchange='CheckContractInputValue();'>";
    selectStart3 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:154px;' >";
    selectStart4 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;' onchange='showChildInfo();'>";
    selectStart5 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;' multiple='multiple' size='5'>";
    selectStart6 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' onchange='ShowDrpDwnInRegisterPage(3);ShowDrpDwnInRegisterPage(5);' style='width:176px;'>";

    selectStart7 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;' onchange='showitemorgposition(1);' multiple='multiple' size='5'>";
    selectStart8 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;' onchange='showitemorgpositionMovaghat(1);' multiple='multiple' size='5'>";

    selectStart9 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;' onchange='showChildInfosaati();'>";


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

        selectTemp = selectStart9.replaceAll("{dpdwnId}", "drpdwnsaatiMarrid");
        $("#divSaatidrpdwnMarrid").html(selectTemp + option0 + allrow + selectEnd);
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

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnTamdidContractkind");
        $("#tddrpdwnTamdidContractkind").html(selectTemp + option0 + allrow + selectEnd);
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

        selectTemp = selectStart5.replaceAll("{dpdwnId}", "drpdwnTamdidWorkgroup");
        $("#tddrpdwnTamdidWorkgroup").html(selectTemp + allrow + selectEnd);
        $("#drpdwnTamdidWorkgroup").multiselect({ minWidth: '154', noneSelectedText: 'همه گروه ها' });

        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------- Employer -------------------------------------------
        allrow = "";
        $.each(drpdwnEmployer, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnEmployer");
        $("#DivEmployer").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchEmployer");
        $("#tddrpdwnSearchEmployer").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchEmployerContract");
        $("#tddrpdwnSearchEmployerContract").html(selectTemp + option0 + allrow + selectEnd);

        //--------------------------------------------------------------------------
        //--------------------- agent name -------------------------------------------
        allrow = "";
        $.each(drpdwnAgent, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnPeikAgentNameSrch");
        $("#tddrpdwnNamaiandegi").html(selectTemp + option0 + allrow + selectEnd);

        //--------------------------------------------------------------------------
        //-----------------------------------contractstate---------------------------------------
        allrow = "";
        $.each(drpdwncontractState, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnStateContractkind");
        $("#divdrpdwnStateContractkind").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchContractState");
        $("#tddrpdwnSearchContractState").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchContractStateContract");
        $("#tddrpdwnSearchContractStateContract").html(selectTemp + option0 + allrow + selectEnd);


        //--------------------------------------------------------------------------
        //-----------------------------------orgchartposition---------------------------------------
        allrow = "";
        $.each(drpdwnorgchart, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });

        selectTemp = selectStart7.replaceAll("{dpdwnId}", "drpdwnorgposition");
        $("#tddrpdwnorgposition").html(selectTemp + allrow + selectEnd);
        $("#drpdwnorgposition").multiselect({ minWidth: '154', noneSelectedText: 'انتخاب کنید...' });


        selectTemp = selectStart8.replaceAll("{dpdwnId}", "drpdwnorgpositionMovaghat");
        $("#tddrpdwnorgpositionMovaghat").html(selectTemp + allrow + selectEnd);
        $("#drpdwnorgpositionMovaghat").multiselect({ minWidth: '154', noneSelectedText: 'انتخاب کنید...' });
        //selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchContractState");
        //$("#tddrpdwnSearchContractState").html(selectTemp + option0 + allrow + selectEnd);

        //selectTemp = selectStart3.replaceAll("{dpdwnId}", "drpdwnSearchContractStateContract");
        //$("#tddrpdwnSearchContractStateContract").html(selectTemp + option0 + allrow + selectEnd);

    }

    if (type == 1 || type == 2 || type == 3 || type == 4 || type == 5) {

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

        //----------------------------------------------------------------------------
        //--------------------- agent name -------------------------------------------
        if (type == 4 || (type == 5 && $("#drpdwnContractKind").val() == 3)) {
            allrow = "";
            var ostancode = "";
            var items = type == 4 ? $("#drpdwnProvince").val() : $("#drpdwnProvinceSaati").val();
            $.each(drpdwnProvince, function (index) {
                if (this['value'] == items) {
                    ostancode = this['value2'].trim();
                }
            });
            allrow = "";
            $.each(drpdwnAgent, function (index) {
                if (ostancode == this['value2'].trim()) {
                    row = option.replaceAll("{value}", this['value'].trim());
                    row = row.replaceAll("{item}", this['item']);
                    allrow = allrow + row;
                }
            });
            if ($("#drpdwnStateContractkind").val() == "2" && allrow != "") {
                if (type == 4) $(".hideAget").show();
                else $(".hideAgetproject").show();
            }
            else {
                if (type == 4) $(".hideAget").hide();
                else $(".hideAgetproject").hide();

            }

            if (type == 4) {
                selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnAgentMovaghat");
                $("#tddrpdwnAgentMovaghat").html(selectTemp + option0 + allrow + selectEnd);
            }
            else if (type == 5) {
                selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnAgentProject");
                $("#tddrpdwnAgentProject").html(selectTemp + option0 + allrow + selectEnd);
            }

        }
        //--------------------------------------------------------------------------
    }
}

//============================================================================
//============================================================================
//============================================================================
function showitemorgposition(type) {
    var items = $("#drpdwnorgposition").val();
    if (items == "-1" || items == null || items == undefined) {
        $(".hideLojesticInfoSaati1,.trPriceproject1").hide();
        // $("#txtSaatiPriceHaghMasoliat").val("");
        // $("#txtSaatiPriceHaghMasoliat").removeAttr("disabled");
    }
    else {
        items = items + ",";
        var array = items.split(',');
        var check = 0;

        for (var i = 0; i <= array.length - 1; i++) {
            if (array[i] != "") {
                $(".zemanatprojecthide").show();
                $(".porsantprojecthide").show();
                if (array[i] == "15") {
                    $(".hazinehprojecthide,.metrajprojecthide,.hidetransporter").show();
                    check = 1;
                }
                else if (array[i] == "17") {
                    $(".hidetransporter").show();
                    check = 1;
                }
                else {
                    if (check == 0) {
                        $(".hazinehprojecthide,.metrajprojecthide,.hidetransporter").hide();
                        $("#txtSaatiAgantMetraj").val("");
                        $("#txtSaatiAnbarMetraj").val("");
                        $("#drpdwnSaatipricejari").val("-1");
                        $("#drpdwnSaatiTransportKind").val("-1");
                        GetChangeSaatiHazineJari();
                    }
                }
            }
        }

        getInfoZemanatSaati(2);
        getInfoTransportSaati(2);
    }
}
//============================================================================
function showitemorgpositionMovaghat(type) {
    var items = $("#drpdwnorgpositionMovaghat").val();
    if (items == "-1" || items == null || items == undefined) {
        $(".hideLojesticInfo1").hide();
        // $("#txtSaatiPriceHaghMasoliat").val("");
        // $("#txtSaatiPriceHaghMasoliat").removeAttr("disabled");
    }
    else {
        items = items + ",";
        var array = items.split(',');
        var check = 0;

        for (var i = 0; i <= array.length - 1; i++) {
            if (array[i] != "") {
                $(".zemanatMovaghathide").show();
                $(".porsantMovaghathide").show();
                if (array[i] == "15") {
                    $(".hazinehMovaghathide,.metrajMovaghathide,.hidetransporterMovaghat").show();
                    check = 1;
                }
                else if (array[i] == "17") {
                    $(".hidetransporterMovaghat").show();
                    check = 1;
                }
                else {
                    if (check == 0) {
                        $(".hazinehMovaghathide,.metrajMovaghathide,.hidetransporterMovaghat").hide();
                        $("#txtAgantMetraj").val("");
                        $("#txtAnbarMetraj").val("");
                        $("#drpdwnpricejari").val("-1");
                        $("#drpdwnTransportKind").val("-1");
                        GetChangeHazineJari();
                    }
                }
            }
        }

        getInfoZemanat(2);
        getInfoTransport(2);
    }
}

//============================================================================
//================================نمایش تعداد فرزند==========================
//============================================================================
function showChildInfo() {
    if ($("#drpdwnMarrid").val() == "-1" || $("#drpdwnMarrid").val() == "1") {
        $("#trChildShow").hide();
        $("#drpdwnCntChild").val(0);
    }
    else {
        $("#trChildShow").show();
        $("#drpdwnCntChild").val(-1);
    }

}
//============================================================================
//================================نمایش تعداد فرزند==========================
//============================================================================
function showChildInfosaati() {
    if ($("#drpdwnsaatiMarrid").val() == "-1" || $("#drpdwnsaatiMarrid").val() == "1") {
        $("#trsaatiChildShow").hide();
        $("#drpdwnsaatiCntChild").val(0);
    }
    else {
        $("#trsaatiChildShow").show();
        $("#drpdwnsaatiCntChild").val(-1);
    }

}
//============================================================================
//====================================ثبت اطلاعات=============================
//============================================================================
function RegisterInfoContract(type) {
    var personelrecontractCode = 0;
    if (TabActiveReContract == 1) // Recontract
    {
        personelrecontractCode = $("#txtPersonelCodeForReContract").val();
    }

    if (type == 1 || type == 3) //movaghat
    {
        //type == 1  -->  insert
        //type == 3  -->  Edit
        G_ErrorCount = 0;
        var check = CheckItemRegister();
        if (G_ErrorCount == 0) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();

            var EmployerCode = $("#drpdwnEmployer").val();
            var name = $.trim($("#txtName").val());
            var family = $.trim($("#txtFamily").val());
            var fathername = $.trim($("#txtFatherName").val());
            var mellicode = $.trim($("#txtMelliCode").val());
            var NumberShenasname = $.trim($("#txtNumberShenasname").val());
            var dateBrithdayDate = $.trim($("#pcaldateBrithdayDate").val());
            // var BrithdayCityRef = $.trim($("#txtBrithdayCityRef").val());
            var ExportCityRef = $.trim($("#txtExportCityRef").val());
            var Marrids = $("#drpdwnMarrid").val();
            var CntChild = $("#drpdwnCntChild").val();

            var drpdwnMoaref = $("#drpdwnMoaref").val();
            var MoarefName = $.trim($("#txtMoarefName").val());
            var MoarefFamily = $.trim($("#txtMoarefFamily").val());
            var MoarefTel = $.trim($("#txtMoarefTel1").val()) + "-" + $.trim($("#txtMoarefTel").val());
            var MoarefMobile = $.trim($("#txtMoarefMobile").val());
            var MoarefNesbat = $.trim($("#txtMoarefNesbat").val());
            var MoarefAddress = $.trim($("#txtMoarefAddress").val());

            var Province = $("#drpdwnProvince").val();
            var City = $("#drpdwnCity").val();
            var PersonelAddress = $.trim($("#txtPersonelAddress").val());
            var PostCode = $.trim($("#txtPostCode").val());
            var tel = $.trim($("#txtTel1").val()) + "-" + $.trim($("#txtTel").val());
            var Mobile = $.trim($("#txtMobile").val());
            var jensiat = $("#drpdwnJensiat").val();
            // var UnitOrganization = $.trim($("#drpdwnUnitOrganization").val());
            var ContractKind = $.trim($("#drpdwnContractKind").val());
            var Contractstate = $.trim($("#drpdwnStateContractkind").val());
            var ContractFromDate = $.trim($("#pcaldateContractFromDate").val());
            var ContractToDate = $.trim($("#pcaldateContractToDate").val());
            var ContractUnValidDate = $.trim($("#pcaldateContractUnValidDate").val());
            var HoghogheSabet = $.trim($("#txtHoghogheSabet").val());
            var HaghMaskan = $.trim($("#txtHaghMaskan").val());
            var BonKharbar = $.trim($("#txtBonKharbar").val());
            var PadashAmalkard = $.trim($("#txtPadashAmalkard").val());
            var Saier = $.trim($("#txtSaier").val());
            var haghmasoliat = $.trim($("#txtHaghMasoliatSaier").val());
            var AyabZahab = $.trim($("#txtAyabZahab").val());

            var sanavat = $.trim($("#txtSanavat").val());
            var HaghOlad = $.trim($("#txtHaghOlad").val());

            var ContractMonth = $.trim($("#txtContractMonth").val());
            var ContractDay = $.trim($("#txtContractDay").val());

            var DoreFromDate = $.trim($("#pcaldateDoreFromDate").val());
            var DoreToDate = $.trim($("#pcaldateCDoreToDate").val());

            HoghogheSabet = parseInt(HoghogheSabet.replaceAll(",", ""));
            HaghMaskan = parseInt(HaghMaskan.replaceAll(",", ""));
            BonKharbar = parseInt(BonKharbar.replaceAll(",", ""));
            PadashAmalkard = parseInt(PadashAmalkard.replaceAll(",", ""));
            Saier = parseInt(Saier.replaceAll(",", ""));
            sanavat = parseInt(sanavat.replaceAll(",", ""));
            HaghOlad = parseInt(HaghOlad.replaceAll(",", ""));
            haghmasoliat = parseInt(haghmasoliat.replaceAll(",", ""));
            AyabZahab = parseInt(AyabZahab.replaceAll(",", ""));

            var companyname = "", shomaresabt = "";
            var CompanyKind = "-1", SematInCompany = "-1";
            var owner = $.trim($("#drpdwnOwner").val());

            var orgchart = "";
            var orgArray = [];

            if (owner == "2") {
                companyname = $.trim($("#txtCompayName").val());
                shomaresabt = $.trim($("#txtShomaresabt").val());
                CompanyKind = $.trim($("#drpdwnCompanyKind").val());
                SematInCompany = $.trim($("#drpdwnSematInCompany").val());
            }

            var jariEjareh = 0, jariTel = 0, jariNet = 0, jariAbogaz = 0, PorsantToziShode = 0, PorsantKharejMahdode = 0, PorsantMoadeli = 0, AgantMetraj = 0, AnbarMetraj = 0, PriceZemanatNameh = 0, CountZemanatSafte = 0, CountZemanatCheck = 0;
            var ischeckPriceJari = "0", ischeckPriceporsant = "0", zemanatkind = "0", strZemanatInfo = "", strZemanatInfoCheck = "", transporterkind = "0", transportName = "", transportmodel = "", transportcolor = "", transportsharhbani = "", transportshasi = "", transportbadaneh = "";
            var agent = "";

            if (Contractstate == "2") {
                agent = $("#drpdwnAgentMovaghat").val();

                orgchart = $.trim($("#drpdwnorgpositionMovaghat").val());
                orgchart = orgchart == null || orgchart == undefined || orgchart == '' ? "-1" : orgchart;
                var orgchart1 = orgchart + ",";
                orgArray = orgchart1.split(',');

                ischeckPriceJari = $.trim($("#drpdwnpricejari").val());
                ischeckPriceporsant = $.trim($("#drpdwnpricePorsant").val());
                if (orgArray.indexOf("15") > -1 && ischeckPriceJari == "1") {
                    jariEjareh = $.trim($("#txtjariEjareh").val());
                    jariTel = $.trim($("#txtjariTel").val());
                    jariNet = $.trim($("#txtjariNet").val());
                    jariAbogaz = $.trim($("#txtjariAbogaz").val());

                    jariEjareh = parseInt(jariEjareh.replaceAll(",", ""));
                    jariTel = parseInt(jariTel.replaceAll(",", ""));
                    jariNet = parseInt(jariNet.replaceAll(",", ""));
                    jariAbogaz = parseInt(jariAbogaz.replaceAll(",", ""));

                }

                if (ischeckPriceporsant == "1") {
                    PorsantToziShode = $.trim($("#txtPorsantToziShode").val());
                    PorsantKharejMahdode = $.trim($("#txtPorsantKharejMahdode").val());
                    PorsantMoadeli = $.trim($("#txtPorsantMoadeli").val());

                    PorsantToziShode = parseInt(PorsantToziShode.replaceAll(",", ""));
                    PorsantKharejMahdode = parseInt(PorsantKharejMahdode.replaceAll(",", ""));
                    PorsantMoadeli = parseInt(PorsantMoadeli.replaceAll(",", ""));
                }

                zemanatkind = $.trim($("#drpdwnZemanatKind").val());
                zemanatkind = zemanatkind == null || zemanatkind == undefined || zemanatkind == '' ? "-1" : "\"" + $("#drpdwnZemanatKind").val() + "\"";

                var array = zemanatkind.replaceAll("\"", "").split(',');
                for (var j = 0; j <= array.length; j++) {
                    if (array[j] == "1") {
                        PriceZemanatNameh = $.trim($("#txtPriceZemanatNameh").val());
                        PriceZemanatNameh = parseInt(PriceZemanatNameh.replaceAll(",", ""));
                    }
                    else if (array[j] == "2") {
                        CountZemanatCheck = $.trim($("#txtCountZemanatcheck").val());
                        CountZemanatCheck = parseInt(CountZemanatCheck.replaceAll(",", ""));

                        if (parseInt(CountZemanatCheck) > 0) {
                            var pricecheck = 0;
                            for (var i = 1; i <= parseInt(CountZemanatCheck) ; i++) {
                                pricecheck = $("#txtPricecheck" + i.toString()).val().trim();
                                pricecheck = parseInt(pricecheck.replaceAll(",", ""));
                                strZemanatInfoCheck = strZemanatInfoCheck + $("#txtNumbercheck" + i.toString()).val().trim() + "^" + pricecheck + ",";
                            }

                        }
                    }
                    else if (array[j] == "3") {
                        CountZemanatSafte = $.trim($("#txtCountZemanatSafte").val());
                        CountZemanatSafte = parseInt(CountZemanatSafte.replaceAll(",", ""));

                        if (parseInt(CountZemanatSafte) > 0) {
                            var price = 0;
                            for (var i = 1; i <= parseInt(CountZemanatSafte) ; i++) {
                                price = $("#txtPriceSafte" + i.toString()).val().trim();
                                price = parseInt(price.replaceAll(",", ""));
                                strZemanatInfo = strZemanatInfo + $("#txtNumberSafte" + i.toString()).val().trim() + "^" + price + ",";
                            }

                        }
                    }
                }

                if (orgArray.indexOf("15") > -1) {
                    AgantMetraj = $.trim($("#txtAgantMetraj").val());
                    AnbarMetraj = $.trim($("#txtAnbarMetraj").val());
                    AgantMetraj = parseInt(AgantMetraj.replaceAll(",", ""));
                    AnbarMetraj = parseInt(AnbarMetraj.replaceAll(",", ""));
                }

                transporterkind = $.trim($("#drpdwnTransportKind").val());
                if ((orgArray.indexOf("15") > -1 || orgArray.indexOf("17") > -1) && transporterkind != "0") {
                    transportName = $("#txtTransporterName").val();
                    transportmodel = $("#txtTransportModel").val();
                    transportcolor = $("#txtTransportColor").val();
                    transportsharhbani = $("#txtTransportShahrbani").val();
                    transportshasi = $("#txtTransportShasi").val();
                    transportbadaneh = $("#txtTransportBadaneh").val();
                }

            }

            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: {
                    i: 2,
                    name: name, family: family, fathername: fathername, mellicode: mellicode, NumberShenasname: NumberShenasname,
                    dateBrithdayDate: dateBrithdayDate, ExportCityRef: ExportCityRef,
                    Marrid: Marrids, Province: Province, City: City, PostCode: PostCode, tel: tel, mobile: Mobile, PersonelAddress: PersonelAddress,
                    ContractKind: ContractKind, dateContractFromDate: ContractFromDate, dateContractToDate: ContractToDate,
                    dateContractUnValidDate: ContractUnValidDate,
                    HoghogheSabet: HoghogheSabet, HaghMaskan: HaghMaskan, BonKharbar: BonKharbar, HaghOlad: HaghOlad, EmployerCode: EmployerCode,
                    MoarefName: MoarefName,
                    MoarefFamily: MoarefFamily,
                    MoarefTel: MoarefTel,
                    MoarefMobile: MoarefMobile,
                    MoarefNesbat: MoarefNesbat,
                    MoarefAddress: MoarefAddress,
                    PadashAmalkard: PadashAmalkard,
                    Saier: Saier,
                    haghmasoliat: haghmasoliat,
                    AyabZahab: AyabZahab,
                    ContractMonth: ContractMonth,
                    ContractDay: ContractDay,
                    DoreFromDate: DoreFromDate,
                    DoreToDate: DoreToDate,
                    CntChild: CntChild,
                    jensiat: jensiat,
                    sanavat: sanavat,
                    Moarefstatus: drpdwnMoaref,
                    type: type,
                    ReContract: TabActiveReContract,
                    PersonelCode: PersonelCodeReContractPublic,
                    contractcode: contractcodeForEditPublic,
                    CompletePeikInfo: CompletePeikInfo,
                    ischeckPriceJari: ischeckPriceJari,
                    jariEjareh: jariEjareh,
                    jariTel: jariTel,
                    jariNet: jariNet,
                    jariAbogaz: jariAbogaz,
                    ischeckPriceporsant: ischeckPriceporsant,
                    PorsantToziShode: PorsantToziShode,
                    PorsantKharejMahdode: PorsantKharejMahdode,
                    PorsantMoadeli: PorsantMoadeli,

                    Contractstate: Contractstate,
                    AgantMetraj: AgantMetraj,
                    AnbarMetraj: AnbarMetraj,
                    PriceZemanatNameh: PriceZemanatNameh,
                    CountZemanatSafte: CountZemanatSafte,
                    zemanatkind: zemanatkind,
                    strZemanatInfo: strZemanatInfo,
                    companyname: companyname,
                    shomaresabt: shomaresabt,
                    CompanyKind: CompanyKind,
                    SematInCompany: SematInCompany,
                    owner: owner,
                    CountZemanatCheck: CountZemanatCheck,
                    strZemanatInfoCheck: strZemanatInfoCheck,
                    orgchart: "\"" + orgchart + "\"",
                    agent: agent,
                    transporterkind: transporterkind,
                    transportName: transportName,
                    transportmodel: transportmodel,
                    transportcolor: transportcolor,
                    transportsharhbani: transportsharhbani,
                    transportshasi: transportshasi,
                    transportbadaneh: transportbadaneh
                },
                url: "/PostBack/PBContract.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    if (type == "1") {
                        var resultArray = data.split('^');
                        if (resultArray[0] == "1") {
                            if (TabActiveReContract == 1) // Recontract
                            {
                                ShowAlert("همکاری مجدد پرسنل در سیستم تایید و قرار داد جدید برای آن ایجاد شد");
                            }
                            else {
                                ShowAlert("اطلاعات پرسنل جدید با موفقیت ثبت شد");
                                if (CompletePeikInfo == 1) {
                                    GetAllPeikNew(1);
                                }
                            }
                            $("input[type=text], textarea").val("");
                            $("select").not("#daylblDateFrom,#monthlblDateFrom,#yearlblDateFrom,#daylblDateTo,#monthlblDateTo,#yearlblDateTo").val("-1");

                            $("#drpdwnorgpositionMovaghat").multiselect('refresh');


                            var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
                            var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();
                            $("#yearlblDateFrom").val(DateFrom.split('/')[0]);
                            $("#monthlblDateFrom").val(DateFrom.split('/')[1]);
                            $("#daylblDateFrom").val(DateFrom.split('/')[2]);
                            $("#yearlblDateTo").val(DateTo.split('/')[0]);
                            $("#monthlblDateTo").val(DateTo.split('/')[1]);
                            $("#daylblDateTo").val(DateTo.split('/')[2]);

                            $("#drpdwnEmployer").val(-1);
                            $("#drpdwnContractKind").val(-1);
                            $("#drpdwnStateContractkind").val(-1);

                            CheckContractInputValue();
                            if ($.trim($("#ResultDivPersonelContract").html()) != "") GetReportInfoPersonelContract(1);
                        }
                        else if (data == "2") {
                            if (TabActiveReContract == 1) // Recontract
                            {
                                ShowAlert("این کد پرسنلی در سیستم یافت نشد");
                            }
                            else {
                                ShowAlert("کد ملی وارد شده تکراری می باشد!");
                            }
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                        }
                    }
                    else if (type == 3) {
                        if (data == "6") {
                            //ShowAlert("اطلاعات پرسنل با موفقیت بروزرسانی شد");
                            CancelEditContractMovaghat(1);
                            if ($.trim($("#ResultDivPersonelContract").html()) != "") GetReportInfoPersonelContract(1);
                        }
                        else if (data == "4") {
                            ShowAlert("اطلاعات پرسنل یافت نشد!");
                            CancelEditContractMovaghat(1);
                            $("#trRowFileContract" + mellicod).remove();
                        }
                        else if (data == "5") {
                            ShowAlert("خطا در بروزرسانی اطلاعات ، لطفا مجددا تلاش نمایید!");
                            //CancelEditContractMovaghat(1);
                        }
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    //  CancelEditContractMovaghat(1);
                    ShowAlert("خطا در هنگام ثبت ، لطفا مجددا تلاش کنید.");
                }
            });

        }
    }
    else if (type == 2 || type == 4 || type == 5) // saati va projeie
    {
        //type == 2  -->  insert
        //type == 4,5  -->  Edit
        G_ErrorCount = 0;
        var check = CheckItemSaatiAndProjei();

        if (G_ErrorCount == 0) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();

            var EmployerCode = $("#drpdwnEmployer").val();
            var ContractKind = $.trim($("#drpdwnContractKind").val());
            var Contractstate = $.trim($("#drpdwnStateContractkind").val());

            var Province = $("#drpdwnProvinceSaati").val();
            var City = $("#drpdwnCitySaati").val();

            var name = $.trim($("#txtSaatiName").val());
            var family = $.trim($("#txtSaatiFamily").val());
            var mellicode = $.trim($("#txtSaatiMelliCode").val());
            var NumberShenasname = $.trim($("#txtSaatiNumberShenasname").val());
            var ExportCityRef = $.trim($("#txtSaatiExportCityRef").val());
            var jensiat = $("#SaatidrpdwnJensiat").val();
            var PersonelAddress = $.trim($("#txtSaatiPersonelAddress").val());
            var khadamat = $.trim($("#txtSaatiKhadamat").val());
            var tel = $.trim($("#txtSaatiTel1").val()) + "-" + $.trim($("#txtSaatiTel").val());
            var Mobile = $.trim($("#txtSaatiMobile").val());

            var fatehrName = $.trim($("#txtSaatiFatherName").val());
            var SaatiPriceEndKind = $.trim($("#drpdwnSaatiPriceEndKind").val());
            var TitlePadashContract = $.trim($("#txtSaatiTitlePadashContract").val());
            var Padash = $.trim($("#txtSaatiPricePadashContract").val());


            var TimeForMonth = $.trim($("#drpdwnTimeForMonth").val());
            var WeekForMonth = $.trim($("#drpdwnWeekForMonth").val());

            var ContractFromDate = $.trim($("#pcalSaatidateContractFromDate").val());
            var ContractToDate = $.trim($("#pcalSaatidateContractToDate").val());
            var ContractDateTavafogh = $.trim($("#pcalSaatidateContractTavafoghDate").val());
            var karkardRozane = $.trim($("#txtSaatiContractTime").val());
            var ContractMonth = $.trim($("#txtSaatiContractMonth").val());
            var ContractDay = $.trim($("#txtSaatiContractDay").val());

            Padash = Padash == "" || Padash == null || Padash == undefined ? "0" : Padash;
            Padash = parseInt(Padash.replaceAll(",", ""));
            //----------------------------------------------------------------------------------------

            var jariEjareh = 0, jariTel = 0, jariNet = 0, jariAbogaz = 0, PorsantToziShode = 0, PorsantKharejMahdode = 0, PorsantMoadeli = 0, AgantMetraj = 0, AnbarMetraj = 0, PriceZemanatNameh = 0, CountZemanatSafte = 0, CountZemanatCheck = 0;
            var ischeckPriceJari = "0", ischeckPriceporsant = "0", zemanatkind = "0", strZemanatInfo = "", strZemanatInfoCheck = "", transporterkind = "0", transportName = "", transportmodel = "", transportcolor = "", transportsharhbani = "", transportshasi = "", transportbadaneh = "";
            var companyname = "", shomaresabt = "";
            var CompanyKind = "-1", SematInCompany = "-1";
            var owner = $.trim($("#drpdwnOwner").val());
            var orgchart = "";
            var agent = "";
            var HoghogheSabet = 0, Marrids = 0, CntChild = 0, haghmodiriat = 0, AyabZahab = 0, padashamalkard = 0, homesalary = 0, bonsalary = 0, childsalary = 0, sanavat = 0, eydi = 0, morakhasi = 0;
            if (ContractKind == 2) {

                Marrids = $("#drpdwnsaatiMarrid").val();
                CntChild = $("#drpdwnsaatiCntChild").val();

                HoghogheSabet = parseInt($.trim($("#txtSaatiPriceSalary").val()).replaceAll(",", ""));
                homesalary = parseInt($.trim($("#txtSaatiPriceHomeSalary").val()).replaceAll(",", ""));
                bonsalary = parseInt($.trim($("#txtSaatiPriceBon").val()).replaceAll(",", ""));
                childsalary = parseInt($.trim($("#txtSaatiPriceChildSalary").val()).replaceAll(",", ""));
                sanavat = parseInt($.trim($("#txtSaatiPriceSanavat").val()).replaceAll(",", ""));
                eydi = parseInt($.trim($("#txtSaatiPriceEydi").val()).replaceAll(",", ""));
                morakhasi = parseInt($.trim($("#txtSaatiPriceMorakhasi").val()).replaceAll(",", ""));
                padashamalkard = parseInt($.trim($("#txtSaatiPriceContract2").val()).replaceAll(",", ""));
                AyabZahab = parseInt($.trim($("#txtSaatiAyabZahab").val()).replaceAll(",", ""));

                SaatiPriceEndKind = 0;

                if (owner == "2") {
                    companyname = $.trim($("#txtSaatiCompayName").val());
                    shomaresabt = $.trim($("#txtSaatiShomaresabt").val());
                    CompanyKind = $.trim($("#drpdwnSaatiCompanyKind").val());
                    SematInCompany = $.trim($("#drpdwnSaatiSematInCompany").val());
                }

            }
            else if (ContractKind == 3) {
                HoghogheSabet = $.trim($("#txtSaatiPriceContract").val());
                HoghogheSabet = parseInt(HoghogheSabet.replaceAll(",", ""));

                haghmodiriat = $.trim($("#txtSaatiPriceHaghMasoliat").val());
                haghmodiriat = parseInt(haghmodiriat.replaceAll(",", ""));

                AyabZahab = $.trim($("#txtProjectAyabZahab").val());
                AyabZahab = parseInt(AyabZahab.replaceAll(",", ""));

                padashamalkard = $.trim($("#txtProjectPadashAmalkard").val());
                padashamalkard = parseInt(padashamalkard.replaceAll(",", ""));

                //----------------------------------------
                if (owner == "2") {
                    companyname = $.trim($("#txtSaatiCompayName").val());
                    shomaresabt = $.trim($("#txtSaatiShomaresabt").val());
                    CompanyKind = $.trim($("#drpdwnSaatiCompanyKind").val());
                    SematInCompany = $.trim($("#drpdwnSaatiSematInCompany").val());
                }
                var orgArray = [];

                if (Contractstate == "2") {
                    agent = $("#drpdwnAgentProject").val();

                    orgchart = $.trim($("#drpdwnorgposition").val());
                    orgchart = orgchart == null || orgchart == undefined || orgchart == '' ? "-1" : orgchart;
                    var orgchart1 = orgchart + ",";
                    orgArray = orgchart1.split(',');

                    ischeckPriceJari = $.trim($("#drpdwnSaatipricejari").val());
                    ischeckPriceporsant = $.trim($("#drpdwnSaatipricePorsant").val());
                    if (orgArray.indexOf("15") > -1 && ischeckPriceJari == "1") {
                        jariEjareh = $.trim($("#txtSaatijariEjareh").val());
                        jariTel = $.trim($("#txtSaatijariTel").val());
                        jariNet = $.trim($("#txtSaatijariNet").val());
                        jariAbogaz = $.trim($("#txtSaatijariAbogaz").val());

                        jariEjareh = parseInt(jariEjareh.replaceAll(",", ""));
                        jariTel = parseInt(jariTel.replaceAll(",", ""));
                        jariNet = parseInt(jariNet.replaceAll(",", ""));
                        jariAbogaz = parseInt(jariAbogaz.replaceAll(",", ""));
                    }

                    if (ischeckPriceporsant == "1") {
                        PorsantToziShode = $.trim($("#txtSaatiPorsantToziShode").val());
                        PorsantKharejMahdode = $.trim($("#txtSaatiPorsantKharejMahdode").val());
                        PorsantMoadeli = $.trim($("#txtSaatiPorsantMoadeli").val());

                        PorsantToziShode = parseInt(PorsantToziShode.replaceAll(",", ""));
                        PorsantKharejMahdode = parseInt(PorsantKharejMahdode.replaceAll(",", ""));
                        PorsantMoadeli = parseInt(PorsantMoadeli.replaceAll(",", ""));
                    }

                    zemanatkind = $.trim($("#drpdwnSaatiZemanatKind").val());
                    zemanatkind = zemanatkind == null || zemanatkind == undefined || zemanatkind == '' ? "-1" : "\"" + $("#drpdwnSaatiZemanatKind").val() + "\"";

                    var array = zemanatkind.replaceAll("\"", "").split(',');
                    for (var j = 0; j <= array.length; j++) {
                        if (array[j] == "1") {
                            PriceZemanatNameh = $.trim($("#txtSaatiPriceZemanatNameh").val());
                            PriceZemanatNameh = parseInt(PriceZemanatNameh.replaceAll(",", ""));
                        }
                        else if (array[j] == "2") {
                            CountZemanatCheck = $.trim($("#txtSaatiCountZemanatcheck").val());
                            CountZemanatCheck = parseInt(CountZemanatCheck.replaceAll(",", ""));

                            if (parseInt(CountZemanatCheck) > 0) {
                                var pricecheck = 0;
                                for (var i = 1; i <= parseInt(CountZemanatCheck) ; i++) {
                                    pricecheck = $("#txtSaatiPricecheck" + i.toString()).val().trim();
                                    pricecheck = parseInt(pricecheck.replaceAll(",", ""));
                                    strZemanatInfoCheck = strZemanatInfoCheck + $("#txtSaatiNumbercheck" + i.toString()).val().trim() + "^" + pricecheck + ",";
                                }

                            }
                        }
                        else if (array[j] == "3") {
                            CountZemanatSafte = $.trim($("#txtSaatiCountZemanatSafte").val());
                            CountZemanatSafte = parseInt(CountZemanatSafte.replaceAll(",", ""));

                            if (parseInt(CountZemanatSafte) > 0) {
                                var price = 0;
                                for (var i = 1; i <= parseInt(CountZemanatSafte) ; i++) {
                                    price = $("#txtSaatiPriceSafte" + i.toString()).val().trim();
                                    price = parseInt(price.replaceAll(",", ""));
                                    strZemanatInfo = strZemanatInfo + $("#txtSaatiNumberSafte" + i.toString()).val().trim() + "^" + price + ",";
                                }

                            }
                        }
                    }

                    if (orgArray.indexOf("15") > -1) {
                        AgantMetraj = $.trim($("#txtSaatiAgantMetraj").val());
                        AnbarMetraj = $.trim($("#txtSaatiAnbarMetraj").val());
                        AgantMetraj = parseInt(AgantMetraj.replaceAll(",", ""));
                        AnbarMetraj = parseInt(AnbarMetraj.replaceAll(",", ""));
                    }

                    transporterkind = $.trim($("#drpdwnSaatiTransportKind").val());
                    if ((orgArray.indexOf("15") > -1 || orgArray.indexOf("17") > -1) && transporterkind != "0") {
                        transportName = $("#txtSaatiTransporterName").val();
                        transportmodel = $("#txtSaatiTransportModel").val();
                        transportcolor = $("#txtSaatiTransportColor").val();
                        transportsharhbani = $("#txtSaatiTransportShahrbani").val();
                        transportshasi = $("#txtSaatiTransportShasi").val();
                        transportbadaneh = $("#txtSaatiTransportBadaneh").val();
                    }
                }
            }

            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: {
                    i: 6,
                    Marrids: Marrids,
                    Cntchild: CntChild,
                    Province: Province,
                    City: City,
                    tel: tel,
                    Mobile: Mobile,
                    name: name,
                    family: family,
                    mellicode: mellicode,
                    NumberShenasname: NumberShenasname,
                    ExportCityRef: ExportCityRef,
                    PersonelAddress: PersonelAddress,
                    ContractKind: ContractKind,
                    dateContractFromDate: ContractFromDate,
                    dateContractToDate: ContractToDate,
                    ContractDateTavafogh: ContractDateTavafogh,
                    HoghogheSabet: HoghogheSabet,
                    EmployerCode: EmployerCode,
                    ContractMonth: ContractMonth,
                    ContractDay: ContractDay,
                    jensiat: jensiat,
                    khadamat: khadamat,
                    karkardRozane: karkardRozane,
                    TimeForMonth: TimeForMonth,
                    WeekForMonth: WeekForMonth,
                    Padash: Padash,
                    fatehrName: fatehrName,
                    SaatiPriceEndKind: SaatiPriceEndKind,
                    TitlePadashContract: TitlePadashContract,
                    ReContract: TabActiveReContract,
                    PersonelCode: PersonelCodeReContractPublic,
                    contractcode: contractcodeForEditPublic,
                    type: type,
                    CompletePeikInfo: CompletePeikInfo,
                    haghmodiriat: haghmodiriat,
                    AyabZahab: AyabZahab,

                    padashamalkard: padashamalkard,
                    homesalary: homesalary,
                    bonsalary: bonsalary,
                    childsalary: childsalary,
                    sanavat: sanavat,
                    eydi: eydi,
                    morakhasi: morakhasi,

                    ischeckPriceJari: ischeckPriceJari,
                    jariEjareh: jariEjareh,
                    jariTel: jariTel,
                    jariNet: jariNet,
                    jariAbogaz: jariAbogaz,
                    ischeckPriceporsant: ischeckPriceporsant,
                    PorsantToziShode: PorsantToziShode,
                    PorsantKharejMahdode: PorsantKharejMahdode,
                    PorsantMoadeli: PorsantMoadeli,

                    Contractstate: Contractstate,
                    AgantMetraj: AgantMetraj,
                    AnbarMetraj: AnbarMetraj,
                    PriceZemanatNameh: PriceZemanatNameh,
                    CountZemanatSafte: CountZemanatSafte,
                    CountZemanatCheck: CountZemanatCheck,
                    strZemanatInfoCheck: strZemanatInfoCheck,
                    zemanatkind: zemanatkind,
                    strZemanatInfo: strZemanatInfo,
                    companyname: companyname,
                    shomaresabt: shomaresabt,
                    CompanyKind: CompanyKind,
                    SematInCompany: SematInCompany,
                    owner: owner,

                    orgchart: "\"" + orgchart + "\"",
                    agent: agent,

                    transporterkind: transporterkind,
                    transportName: transportName,
                    transportmodel: transportmodel,
                    transportcolor: transportcolor,
                    transportsharhbani: transportsharhbani,
                    transportshasi: transportshasi,
                    transportbadaneh: transportbadaneh
                },
                url: "/PostBack/PBContract.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();
                    if (type == 2) {
                        var resultArray = data.split('^');
                        if (resultArray[0] == "1") {
                            if (TabActiveReContract == 1) // Recontract
                            {
                                ShowAlert("همکاری مجدد پرسنل در سیستم تایید و قرار داد جدید برای آن ایجاد شد");
                            }
                            else {
                                ShowAlert("اطلاعات پرسنل جدید با موفقیت ثبت شد");

                                if (CompletePeikInfo == 1) {
                                    GetAllPeikNew(1);
                                }
                            }

                            $("input[type=text], textarea").val("");
                            $("select").not("#daylblDateFrom,#monthlblDateFrom,#yearlblDateFrom,#daylblDateTo,#monthlblDateTo,#yearlblDateTo").val("-1");

                            $("#drpdwnorgposition").multiselect('refresh');

                            var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
                            var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();
                            $("#yearlblDateFrom").val(DateFrom.split('/')[0]);
                            $("#monthlblDateFrom").val(DateFrom.split('/')[1]);
                            $("#daylblDateFrom").val(DateFrom.split('/')[2]);
                            $("#yearlblDateTo").val(DateTo.split('/')[0]);
                            $("#monthlblDateTo").val(DateTo.split('/')[1]);
                            $("#daylblDateTo").val(DateTo.split('/')[2]);

                            $("#drpdwnEmployer").val(-1);
                            $("#drpdwnContractKind").val(-1);
                            $("#drpdwnStateContractkind").val(-1);

                            CheckContractInputValue();

                            if ($.trim($("#ResultDivPersonelContract").html()) != "") GetReportInfoPersonelContract(1);
                        }
                        else if (data == "2") {
                            if (TabActiveReContract == 1) // Recontract
                            {
                                ShowAlert("این کد پرسنلی در سیستم یافت نشد");
                            }
                            else {
                                ShowAlert("کد ملی وارد شده تکراری می باشد!");
                            }
                        }
                        else if (data == "3") {
                            ShowAlert("خطا در ثبت اطلاعات ، لطفا مجددا تلاش نمایید!");
                        }

                    }
                    else if (type == 4 || type == 5) {
                        if (data == "6") {
                            //ShowAlert("اطلاعات پرسنل با موفقیت بروزرسانی شد");
                            CancelEditContractMovaghat(parseInt(type) - 2);
                            if ($.trim($("#ResultDivPersonelContract").html()) != "") GetReportInfoPersonelContract(1);
                        }
                        else if (data == "4") {
                            ShowAlert("اطلاعات پرسنل یافت نشد!");
                            CancelEditContractMovaghat(parseInt(type) - 2);
                            $("#trRowFileContract" + mellicod).remove();
                        }
                        else if (data == "5") {
                            ShowAlert("خطا در بروزرسانی اطلاعات ، لطفا مجددا تلاش نمایید!");
                            //CancelEditContractMovaghat(parseInt(type)-2);
                        }
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
//============================================================================
//========================= چک کردن قرارداد موقت============================
//============================================================================
function CheckItemRegister() {
    var error = 1;
    var EmployerCode = $("#drpdwnEmployer").val();
    var name = $.trim($("#txtName").val());
    var family = $.trim($("#txtFamily").val());
    var fathername = $.trim($("#txtFatherName").val());
    var mellicode = $.trim($("#txtMelliCode").val());
    var NumberShenasname = $.trim($("#txtNumberShenasname").val());
    var dateBrithdayDate = $.trim($("#pcaldateBrithdayDate").val());
    var ExportCityRef = $.trim($("#txtExportCityRef").val());
    var Marrids = $("#drpdwnMarrid").val();
    var CntChild = $("#drpdwnCntChild").val();

    var drpdwnMoaref = $("#drpdwnMoaref").val();
    var MoarefName = $.trim($("#txtMoarefName").val());
    var MoarefFamily = $.trim($("#txtMoarefFamily").val());
    var MoarefTel = $.trim($("#txtMoarefTel").val());
    var MoarefTel1 = $.trim($("#txtMoarefTel1").val());
    var MoarefMobile = $.trim($("#txtMoarefMobile").val());
    var MoarefNesbat = $.trim($("#txtMoarefNesbat").val());
    var MoarefAddress = $.trim($("#txtMoarefAddress").val());

    var Province = $("#drpdwnProvince").val();
    var City = $("#drpdwnCity").val();
    var PersonelAddress = $.trim($("#txtPersonelAddress").val());
    var PostCode = $.trim($("#txtPostCode").val());
    var Tel = $.trim($("#txtTel").val());
    var Tel1 = $.trim($("#txtTel1").val());
    var Mobile = $.trim($("#txtMobile").val());
    var ContractKind = $.trim($("#drpdwnContractKind").val());
    var Contractstate = $.trim($("#drpdwnStateContractkind").val());

    var ContractFromDate = $.trim($("#pcaldateContractFromDate").val());
    var ContractToDate = $.trim($("#pcaldateContractToDate").val());
    var ContractUnValidDate = $.trim($("#pcaldateContractUnValidDate").val());
    var HoghogheSabet = $.trim($("#txtHoghogheSabet").val());
    var HaghMaskan = $.trim($("#txtHaghMaskan").val());
    var BonKharbar = $.trim($("#txtBonKharbar").val());
    var PadashAmalkard = $.trim($("#txtPadashAmalkard").val());
    var Saier = $.trim($("#txtSaier").val());
    var haghmasoliat = $.trim($("#txtHaghMasoliatSaier").val());
    var AyabZahab = $.trim($("#txtAyabZahab").val());

    var jensiat = $("#drpdwnJensiat").val();

    var ContractMonth = $.trim($("#txtContractMonth").val());
    var ContractDay = $.trim($("#txtContractDay").val());
    var DoreAzmaieshi = $.trim($("#drpdwnDoreAzmaieshi").val());
    var DoreFromDate = $.trim($("#pcaldateDoreFromDate").val());
    var DoreToDate = $.trim($("#pcaldateCDoreToDate").val());

    HoghogheSabet = parseInt(HoghogheSabet.replaceAll(",", ""));
    HaghMaskan = parseInt(HaghMaskan.replaceAll(",", ""));
    BonKharbar = parseInt(BonKharbar.replaceAll(",", ""));
    PadashAmalkard = parseInt(PadashAmalkard.replaceAll(",", ""));
    Saier = parseInt(Saier.replaceAll(",", ""));
    haghmasoliat = parseInt(haghmasoliat.replaceAll(",", ""));

    var companyname = "", shomaresabt = "";
    var CompanyKind = "-1", SematInCompany = "-1";
    var owner = $.trim($("#drpdwnOwner").val());

    if (owner == "2") {
        companyname = $.trim($("#txtCompayName").val());
        shomaresabt = $.trim($("#txtShomaresabt").val());
        CompanyKind = $.trim($("#drpdwnCompanyKind").val());
        SematInCompany = $.trim($("#drpdwnSematInCompany").val());
    }

    var jariEjareh = "", jariTel = "", jariNet = "", jariAbogaz = "", PorsantToziShode = "", PorsantKharejMahdode = "", PorsantMoadeli = "", AgantMetraj = "", AnbarMetraj = "", PriceZemanatNameh = "", CountZemanatSafte = "", transporterkind = "", transportName = "", transportmodel = "", transportcolor = "", transportsharhbani = "", transportshasi = "", transportbadaneh = "";
    var ischeckPriceJari = "", ischeckPriceporsant = "", zemanatkind = "", strZemanatInfo = "";
    var CountZemanatCheck = "";
    var strZemanatInfoCheck = "";
    var orgchart = "";
    var orgArray = [];
    var array = [];
    var agent = "";
    if (Contractstate == "2") {

        agent = $("#drpdwnAgentMovaghat").val();

        orgchart = $.trim($("#drpdwnorgpositionMovaghat").val());
        orgchart = orgchart == null || orgchart == undefined || orgchart == '' ? "-1" : orgchart;
        var orgchart1 = orgchart + ",";
        orgArray = orgchart1.split(',');

        ischeckPriceJari = $.trim($("#drpdwnpricejari").val());
        ischeckPriceporsant = $.trim($("#drpdwnpricePorsant").val());
        if (orgArray.indexOf("15") > -1 && ischeckPriceJari == "1") {
            jariEjareh = $.trim($("#txtjariEjareh").val());
            jariTel = $.trim($("#txtjariTel").val());
            jariNet = $.trim($("#txtjariNet").val());
            jariAbogaz = $.trim($("#txtjariAbogaz").val());

            jariEjareh = parseInt(jariEjareh.replaceAll(",", ""));
            jariTel = parseInt(jariTel.replaceAll(",", ""));
            jariNet = parseInt(jariNet.replaceAll(",", ""));
            jariAbogaz = parseInt(jariAbogaz.replaceAll(",", ""));
        }

        if (ischeckPriceporsant == "1") {
            PorsantToziShode = $.trim($("#txtPorsantToziShode").val());
            PorsantKharejMahdode = $.trim($("#txtPorsantKharejMahdode").val());
            PorsantMoadeli = $.trim($("#txtPorsantMoadeli").val());

            PorsantToziShode = parseInt(PorsantToziShode.replaceAll(",", ""));
            PorsantKharejMahdode = parseInt(PorsantKharejMahdode.replaceAll(",", ""));
            PorsantMoadeli = parseInt(PorsantMoadeli.replaceAll(",", ""));
        }

        zemanatkind = $.trim($("#drpdwnZemanatKind").val());
        zemanatkind = zemanatkind == null || zemanatkind == undefined || zemanatkind == '' ? "-1" : "\"" + $("#drpdwnZemanatKind").val() + "\"";

        array = zemanatkind.replaceAll("\"", "").split(',');
        for (var j = 0; j <= array.length; j++) {
            if (array[j] == "1") {
                PriceZemanatNameh = $.trim($("#txtPriceZemanatNameh").val());
                PriceZemanatNameh = parseInt(PriceZemanatNameh.replaceAll(",", ""));
            }
            else if (array[j] == "2") {
                CountZemanatCheck = $.trim($("#txtCountZemanatcheck").val());
                CountZemanatCheck = parseInt(CountZemanatCheck.replaceAll(",", ""));

                if (parseInt(CountZemanatCheck) > 0) {
                    var pricecheck = 0;
                    for (var i = 1; i <= parseInt(CountZemanatCheck) ; i++) {
                        pricecheck = $("#txtPricecheck" + i.toString()).val().trim();
                        pricecheck = parseInt(pricecheck.replaceAll(",", ""));
                        strZemanatInfoCheck = strZemanatInfoCheck + $("#txtNumbercheck" + i.toString()).val().trim() + "^" + pricecheck + ",";
                    }

                }
            }
            else if (array[j] == "3") {
                CountZemanatSafte = $.trim($("#txtCountZemanatSafte").val());
                CountZemanatSafte = parseInt(CountZemanatSafte.replaceAll(",", ""));

                if (parseInt(CountZemanatSafte) > 0) {
                    var price = 0;
                    for (var i = 1; i <= parseInt(CountZemanatSafte) ; i++) {
                        price = $("#txtPriceSafte" + i.toString()).val().trim();
                        price = parseInt(price.replaceAll(",", ""));
                        strZemanatInfo = strZemanatInfo + $("#txtNumberSafte" + i.toString()).val().trim() + "^" + price + ",";
                    }

                }
            }
        }
        if (orgArray.indexOf("15") > -1) {
            AgantMetraj = $.trim($("#txtAgantMetraj").val());
            AnbarMetraj = $.trim($("#txtAnbarMetraj").val());
            AgantMetraj = parseInt(AgantMetraj.replaceAll(",", ""));
            AnbarMetraj = parseInt(AnbarMetraj.replaceAll(",", ""));
        }

        transporterkind = $.trim($("#drpdwnTransportKind").val());
        if ((orgArray.indexOf("15") > -1 || orgArray.indexOf("17") > -1) && transporterkind != "0") {
            transportName = $("#txtTransporterName").val();
            transportmodel = $("#txtTransportModel").val();
            transportcolor = $("#txtTransportColor").val();
            transportsharhbani = $("#txtTransportShahrbani").val();
            transportshasi = $("#txtTransportShasi").val();
            transportbadaneh = $("#txtTransportBadaneh").val();
        }

    }
    //------------------------------------------------------------------------
    error = checkItemAllInPage(EmployerCode, "drpdwnEmployer", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(name, "txtName", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(family, "txtFamily", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(fathername, "txtFatherName", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(mellicode, "txtMelliCode", "", 2, 1, 1);
    error = DialogErrorAlert(error, "شماره ملی");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(NumberShenasname, "txtNumberShenasname", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره شناسنامه");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(dateBrithdayDate, "pcaldateBrithdayDate", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ExportCityRef, "txtExportCityRef", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Marrids, "drpdwnMarrid", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    if (Marrids == "2" || Marrids == "3") error = checkItemAllInPage(CntChild, "drpdwnCntChild", "-1", 1, 0, 0);
    else error = checkItemAllInPage("1", "drpdwnCntChild", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Province, "drpdwnProvince", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(City, "drpdwnCity", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(PersonelAddress, "txtPersonelAddress", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(PostCode, "txtPostCode", "", 2, 1, 0);
    error = DialogErrorAlert(error, "کد پستی");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Tel, "txtTel", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره تماس");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Tel1, "txtTel1", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره تماس");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Mobile, "txtMobile", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره موبایل");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(jensiat, "drpdwnJensiat", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractMonth, "txtContractMonth", "", 2, 1, 0);
    error = DialogErrorAlert(error, "مدت قرارداد ماه");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractDay, "txtContractDay", "", 2, 1, 0);
    error = DialogErrorAlert(error, "مدت قرارداد روز");
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    if (drpdwnMoaref == "1") {
        //------------------------------------------------------------------------
        error = checkItemAllInPage(MoarefName, "txtMoarefName", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(MoarefFamily, "txtMoarefFamily", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(MoarefTel, "txtMoarefTel", "", 2, 1, 0);
        error = DialogErrorAlert(error, "شماره تماس معرف");
        //------------------------------------------------------------------------
        error = checkItemAllInPage(MoarefTel1, "txtMoarefTel1", "", 2, 1, 0);
        error = DialogErrorAlert(error, "شماره تماس معرف");
        //------------------------------------------------------------------------
        error = checkItemAllInPage(MoarefMobile, "txtMoarefMobile", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(MoarefNesbat, "txtMoarefNesbat", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(MoarefAddress, "txtMoarefAddress", "", 2, 0, 0);
        //------------------------------------------------------------------------
    }
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractKind, "drpdwnContractKind", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractFromDate, "pcaldateContractFromDate", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractToDate, "pcaldateContractToDate", "", 2, 0, 0);
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    if (DoreAzmaieshi == "1") {
        //------------------------------------------------------------------------
        error = checkItemAllInPage(DoreFromDate, "pcaldateDoreFromDate", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(DoreToDate, "pcaldateCDoreToDate", "", 2, 0, 0);
        //------------------------------------------------------------------------
    }
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractUnValidDate, "pcaldateContractUnValidDate", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(HoghogheSabet.toString(), "txtHoghogheSabet", "", 2, 1, 0);
    error = DialogErrorAlert(error, "حقوق ثابت");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(HaghMaskan.toString(), "txtHaghMaskan", "", 2, 1, 0);
    error = DialogErrorAlert(error, "حق مسکن");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(BonKharbar.toString(), "txtBonKharbar", "", 2, 1, 0);
    error = DialogErrorAlert(error, "بن خواربار");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(PadashAmalkard.toString(), "txtPadashAmalkard", "", 2, 1, 0);
    error = DialogErrorAlert(error, "پاداش عملکرد");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Saier.toString(), "txtSaier", "", 2, 1, 0);
    error = DialogErrorAlert(error, "سایر");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(haghmasoliat.toString(), "txtHaghMasoliatSaier", "", 2, 1, 0);
    error = DialogErrorAlert(error, "حق مسئولیت");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(AyabZahab.toString(), "txtAyabZahab", "", 2, 1, 0);
    error = DialogErrorAlert(error, "کمک ایاب و ذهاب");
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    if (owner == "2") {
        //------------------------------------------------------------------------
        error = checkItemAllInPage(companyname, "txtCompayName", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(shomaresabt, "txtShomaresabt", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(CompanyKind, "drpdwnCompanyKind", "-1", 1, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(SematInCompany, "drpdwnSematInCompany", "-1", 1, 0, 0);
        //------------------------------------------------------------------------
    }
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    if (Contractstate == "2") {
        //------------------------------------------------------------------------
        if (Province != "-1") error = checkItemAllInPage(agent, "drpdwnAgentMovaghat", "-1", 1, 0, 0);
        else error = checkItemAllInPage("1", "drpdwnAgentMovaghat", "-1", 1, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(orgchart, "drpdwnorgposition", "-1", 3, 0, 0);
        if (error = 0) ShowAlert("موقعیت شغلی پرسنل را مشخص نمایید !");
        //------------------------------------------------------------------------
        //------------------------------------------------------------------------
        if (orgArray.indexOf("15") > -1 && ischeckPriceJari.toString() == "1") {
            //------------------------------------------------------------------------
            error = checkItemAllInPage(jariEjareh.toString(), "txtjariEjareh", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ اجاره");
            //------------------------------------------------------------------------
            error = checkItemAllInPage(jariTel.toString(), "txtjariTel", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ تلفن");
            //------------------------------------------------------------------------
            error = checkItemAllInPage(jariNet.toString(), "txtjariNet", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ اینترنت");
            //------------------------------------------------------------------------
            error = checkItemAllInPage(jariAbogaz.toString(), "txtjariAbogaz", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ آب/برق/گاز");
            //------------------------------------------------------------------------
        }
        //------------------------------------------------------------------------
        //------------------------------------------------------------------------
        if (ischeckPriceporsant == "1") {
            //------------------------------------------------------------------------
            error = checkItemAllInPage(PorsantToziShode.toString(), "txtPorsantToziShode", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ پورسانت سفارشات توزیع شده");
            //------------------------------------------------------------------------
            error = checkItemAllInPage(PorsantKharejMahdode.toString(), "txtPorsantKharejMahdode", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ پورسانت سفارشات خارج محدوده");
            //------------------------------------------------------------------------
            error = checkItemAllInPage(PorsantMoadeli.toString(), "txtPorsantMoadeli", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ پورسانت سفارشات معادلی");
            //------------------------------------------------------------------------
        }
        //------------------------------------------------------------------------
        //------------------------------------------------------------------------
        if (array.indexOf("1") > -1) {
            error = checkItemAllInPage(PriceZemanatNameh.toString(), "txtPriceZemanatNameh", "", 2, 1, 0);
            error = DialogErrorAlert(error, "مبلغ ضمانت نامه وجه نقد");
        }
        else error = checkItemAllInPage("1", "txtPriceZemanatNameh", "", 2, 0, 0);
        //------------------------------------------------------------------------
        if (array.indexOf("2") > -1) {
            error = checkItemAllInPage(CountZemanatCheck.toString(), "txtCountZemanatcheck", "", 2, 1, 0);
            error = DialogErrorAlert(error, "تعداد ضمانت نامه چک");
        }
        else error = checkItemAllInPage("1", "txtCountZemanatcheck", "", 2, 0, 0);
        //------------------------------------------------------------------------
        var sumzemanatcheck = 0;
        if (array.indexOf("2") > -1 && parseInt(CountZemanatCheck) > 0) {
            var price = 0;
            for (var i = 1; i <= parseInt(CountZemanatCheck) ; i++) {
                //------------------------------------------------------------------------
                error = checkItemAllInPage($("#txtNumbercheck" + i.toString()).val().trim(), "txtNumbercheck" + i.toString(), "", 2, 0, 0);
                //------------------------------------------------------------------------
                error = checkItemAllInPage($("#txtPricecheck" + i.toString()).val().trim().replaceAll(",", ""), "txtPricecheck" + i.toString(), "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ ضمانت نامه چک " + i.toString());
                if (error == 1) {
                    var pricecheck_temp = parseInt($("#txtPricecheck" + i.toString()).val().trim().replaceAll(",", ""));
                    sumzemanatcheck = sumzemanatcheck + parseInt(pricecheck_temp);
                }
                //------------------------------------------------------------------------
            }
        }
        //------------------------------------------------------------------------
        if (array.indexOf("3") > -1) {
            error = checkItemAllInPage(CountZemanatSafte.toString(), "txtCountZemanatSafte", "", 2, 1, 0);
            error = DialogErrorAlert(error, "تعداد ضمانت نامه سفته");
        }
        else error = checkItemAllInPage("1", "txtCountZemanatSafte", "", 2, 0, 0);
        //------------------------------------------------------------------------
        var sumzemanat = 0;
        if (array.indexOf("3") > -1 && parseInt(CountZemanatSafte) > 0) {
            var price = 0;
            for (var i = 1; i <= parseInt(CountZemanatSafte) ; i++) {
                //------------------------------------------------------------------------
                error = checkItemAllInPage($("#txtNumberSafte" + i.toString()).val().trim(), "txtNumberSafte" + i.toString(), "", 2, 0, 0);
                //------------------------------------------------------------------------
                error = checkItemAllInPage($("#txtPriceSafte" + i.toString()).val().trim().replaceAll(",", ""), "txtPriceSafte" + i.toString(), "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ ضمانت نامه سفته " + i.toString());
                if (error == 1) {
                    var PriceSafte_temp = parseInt($("#txtPriceSafte" + i.toString()).val().trim().replaceAll(",", ""));
                    sumzemanat = sumzemanat + parseInt(PriceSafte_temp)
                }
                //------------------------------------------------------------------------
            }

        }
        //------------------------------------------------------------------------
        if (orgArray.indexOf("15") > -1) {
            error = checkItemAllInPage(AgantMetraj.toString(), "txtAgantMetraj", "", 2, 1, 0);
            error = DialogErrorAlert(error, "متراژ دفتر نمایندگی");
        }
        else error = checkItemAllInPage("1", "txtAgantMetraj", "", 2, 0, 0);
        //------------------------------------------------------------------------
        if (orgArray.indexOf("15") > -1) {
            error = checkItemAllInPage(AnbarMetraj.toString(), "txtAnbarMetraj", "", 2, 1, 0);
            error = DialogErrorAlert(error, "متراژ انبار نمایندگی");
        }
        else error = checkItemAllInPage("1", "txtAnbarMetraj", "", 2, 0, 0);
        //------------------------------------------------------------------------
        //------------------------------------------------------------------------
        if ((orgArray.indexOf("15") > -1 || orgArray.indexOf("17") > -1) && transporterkind != "0") {
            //------------------------------------------------------------------------
            error = checkItemAllInPage(transportName, "txtTransporterName", "", 2, 0, 0);
            //------------------------------------------------------------------------
            error = checkItemAllInPage(transportmodel, "txtTransportModel", "", 2, 0, 0);
            //------------------------------------------------------------------------
            error = checkItemAllInPage(transportsharhbani, "txtTransportShahrbani", "", 2, 0, 0);
            //------------------------------------------------------------------------
            error = checkItemAllInPage(transportshasi, "txtTransportShasi", "", 2, 0, 0);
            //------------------------------------------------------------------------
            error = checkItemAllInPage(transportbadaneh, "txtTransportBadaneh", "", 2, 0, 0);
            //------------------------------------------------------------------------
            error = checkItemAllInPage(transportcolor, "txtTransportColor", "", 2, 0, 0);
            //------------------------------------------------------------------------
        }
    }
    //==============================================================================================

    return error;
}
//============================================================================
//=======================چک کردن قرارداد ساعتی و پیمانکاری=================
//============================================================================
function CheckItemSaatiAndProjei() {
    var error = 1;
    var EmployerCode = $("#drpdwnEmployer").val();
    var ContractKind = $.trim($("#drpdwnContractKind").val());
    var Contractstate = $.trim($("#drpdwnStateContractkind").val());

    var Province = $("#drpdwnProvinceSaati").val();
    var City = $("#drpdwnCitySaati").val();

    var name = $.trim($("#txtSaatiName").val());
    var family = $.trim($("#txtSaatiFamily").val());
    var mellicode = $.trim($("#txtSaatiMelliCode").val());
    var NumberShenasname = $.trim($("#txtSaatiNumberShenasname").val());
    var ExportCityRef = $.trim($("#txtSaatiExportCityRef").val());
    var jensiat = $("#SaatidrpdwnJensiat").val();
    var PersonelAddress = $.trim($("#txtSaatiPersonelAddress").val());
    var khadamat = $.trim($("#txtSaatiKhadamat").val());
    var Tel = $.trim($("#txtSaatiTel").val());
    var Tel1 = $.trim($("#txtSaatiTel1").val());
    var Mobile = $.trim($("#txtSaatiMobile").val());

    var Marrids = $("#drpdwnsaatiMarrid").val();
    var CntChild = $("#drpdwnsaatiCntChild").val();

    var ContractFromDate = $.trim($("#pcalSaatidateContractFromDate").val());
    var ContractToDate = $.trim($("#pcalSaatidateContractToDate").val());
    var ContractDateTavafogh = $.trim($("#pcalSaatidateContractTavafoghDate").val());
    var karkardRozane = $.trim($("#txtSaatiContractTime").val());
    var TimeForMonth = $.trim($("#drpdwnTimeForMonth").val());
    var WeekForMonth = $.trim($("#drpdwnWeekForMonth").val());

    var ContractMonth = $.trim($("#txtSaatiContractMonth").val());
    var ContractDay = $.trim($("#txtSaatiContractDay").val());

    var HoghogheSabet = "", haghmodiriat = "", Marrids = "", CntChild = "", AyabZahab = "", padashamalkard = "";
    if (ContractKind == 2) {
        Marrids = $("#drpdwnsaatiMarrid").val();
        CntChild = $("#drpdwnsaatiCntChild").val();

        HoghogheSabet = $.trim($("#txtSaatiPriceContract2").val());
        AyabZahab = $.trim($("#txtSaatiAyabZahab").val());
    }
    else if (ContractKind == 3) {
        HoghogheSabet = $.trim($("#txtSaatiPriceContract").val());
        haghmodiriat = $.trim($("#txtSaatiPriceHaghMasoliat").val());
        haghmodiriat = parseInt(haghmodiriat.replaceAll(",", ""));
        AyabZahab = $.trim($("#txtProjectAyabZahab").val());
        padashamalkard = $.trim($("#txtProjectPadashAmalkard").val());
        padashamalkard = parseInt(padashamalkard.replaceAll(",", ""));

    }
    HoghogheSabet = parseInt(HoghogheSabet.replaceAll(",", ""));
    AyabZahab = parseInt(AyabZahab.replaceAll(",", ""));

    var fatehrName = $.trim($("#txtSaatiFatherName").val());
    var SaatiPriceEndKind = $.trim($("#drpdwnSaatiPriceEndKind").val());
    var TitlePadashContract = $.trim($("#txtSaatiTitlePadashContract").val());
    var Padash = $.trim($("#txtSaatiPricePadashContract").val());
    var PadashAvilable = $.trim($("#drpdwnSaatiPricePadashAvilable").val());
    Padash = parseInt(Padash.replaceAll(",", ""));
    //------------------------------------------------------------
    var companyname = "", shomaresabt = "";
    var CompanyKind = "-1", SematInCompany = "-1";
    var owner = $.trim($("#drpdwnSaatiOwner").val());

    if (owner == "2") {
        companyname = $.trim($("#txtSaatiCompayName").val());
        shomaresabt = $.trim($("#txtSaatiShomaresabt").val());
        CompanyKind = $.trim($("#drpdwnSaatiCompanyKind").val());
        SematInCompany = $.trim($("#drpdwnSaatiSematInCompany").val());
    }

    var jariEjareh = "", jariTel = "", jariNet = "", jariAbogaz = "", PorsantToziShode = "", PorsantKharejMahdode = "", PorsantMoadeli = "", AgantMetraj = "", AnbarMetraj = "", PriceZemanatNameh = "", CountZemanatSafte = "";
    var ischeckPriceJari = "", ischeckPriceporsant = "", zemanatkind = "", strZemanatInfo = "", transporterkind = "", transportName = "", transportmodel = "", transportcolor = "", transportsharhbani = "", transportshasi = "", transportbadaneh = "";
    var CountZemanatCheck = "";
    var strZemanatInfoCheck = "";
    var orgchart = "";
    var orgArray = [];
    var array = [];
    var agent = "";
    if (ContractKind == 3 && Contractstate == "2") {

        agent = $("#drpdwnAgentProject").val();

        orgchart = $.trim($("#drpdwnorgposition").val());
        orgchart = orgchart == null || orgchart == undefined || orgchart == '' ? "-1" : orgchart;
        var orgchart1 = orgchart + ",";
        orgArray = orgchart1.split(',');

        ischeckPriceJari = $.trim($("#drpdwnSaatipricejari").val());
        ischeckPriceporsant = $.trim($("#drpdwnSaatipricePorsant").val());
        if (orgArray.indexOf("15") > -1 && ischeckPriceJari == "1") {
            jariEjareh = $.trim($("#txtSaatijariEjareh").val());
            jariTel = $.trim($("#txtSaatijariTel").val());
            jariNet = $.trim($("#txtSaatijariNet").val());
            jariAbogaz = $.trim($("#txtSaatijariAbogaz").val());

            jariEjareh = parseInt(jariEjareh.replaceAll(",", ""));
            jariTel = parseInt(jariTel.replaceAll(",", ""));
            jariNet = parseInt(jariNet.replaceAll(",", ""));
            jariAbogaz = parseInt(jariAbogaz.replaceAll(",", ""));
        }

        if (ischeckPriceporsant == "1") {
            PorsantToziShode = $.trim($("#txtSaatiPorsantToziShode").val());
            PorsantKharejMahdode = $.trim($("#txtSaatiPorsantKharejMahdode").val());
            PorsantMoadeli = $.trim($("#txtSaatiPorsantMoadeli").val());

            PorsantToziShode = parseInt(PorsantToziShode.replaceAll(",", ""));
            PorsantKharejMahdode = parseInt(PorsantKharejMahdode.replaceAll(",", ""));
            PorsantMoadeli = parseInt(PorsantMoadeli.replaceAll(",", ""));
        }

        zemanatkind = $.trim($("#drpdwnSaatiZemanatKind").val());
        zemanatkind = zemanatkind == null || zemanatkind == undefined || zemanatkind == '' ? "-1" : "\"" + $("#drpdwnSaatiZemanatKind").val() + "\"";

        array = zemanatkind.replaceAll("\"", "").split(',');
        for (var j = 0; j <= array.length; j++) {
            if (array[j] == "1") {
                PriceZemanatNameh = $.trim($("#txtSaatiPriceZemanatNameh").val());
                PriceZemanatNameh = parseInt(PriceZemanatNameh.replaceAll(",", ""));
            }
            else if (array[j] == "2") {
                CountZemanatCheck = $.trim($("#txtSaatiCountZemanatcheck").val());
                CountZemanatCheck = parseInt(CountZemanatCheck.replaceAll(",", ""));

                if (parseInt(CountZemanatCheck) > 0) {
                    var pricecheck = 0;
                    for (var i = 1; i <= parseInt(CountZemanatCheck) ; i++) {
                        pricecheck = $("#txtSaatiPricecheck" + i.toString()).val().trim();
                        pricecheck = parseInt(pricecheck.replaceAll(",", ""));
                        strZemanatInfoCheck = strZemanatInfoCheck + $("#txtSaatiNumbercheck" + i.toString()).val().trim() + "^" + pricecheck + ",";
                    }

                }
            }
            else if (array[j] == "3") {
                CountZemanatSafte = $.trim($("#txtSaatiCountZemanatSafte").val());
                CountZemanatSafte = parseInt(CountZemanatSafte.replaceAll(",", ""));

                if (parseInt(CountZemanatSafte) > 0) {
                    var price = 0;
                    for (var i = 1; i <= parseInt(CountZemanatSafte) ; i++) {
                        price = $("#txtSaatiPriceSafte" + i.toString()).val().trim();
                        price = parseInt(price.replaceAll(",", ""));
                        strZemanatInfo = strZemanatInfo + $("#txtSaatiNumberSafte" + i.toString()).val().trim() + "^" + price + ",";
                    }

                }
            }
        }

        if (orgArray.indexOf("15") > -1) {
            AgantMetraj = $.trim($("#txtSaatiAgantMetraj").val());
            AnbarMetraj = $.trim($("#txtSaatiAnbarMetraj").val());
            AgantMetraj = parseInt(AgantMetraj.replaceAll(",", ""));
            AnbarMetraj = parseInt(AnbarMetraj.replaceAll(",", ""));
        }

        transporterkind = $.trim($("#drpdwnSaatiTransportKind").val());
        if ((orgArray.indexOf("15") > -1 || orgArray.indexOf("17") > -1) && transporterkind != "0") {
            transportName = $("#txtSaatiTransporterName").val();
            transportmodel = $("#txtSaatiTransportModel").val();
            transportcolor = $("#txtSaatiTransportColor").val();
            transportsharhbani = $("#txtSaatiTransportShahrbani").val();
            transportshasi = $("#txtSaatiTransportShasi").val();
            transportbadaneh = $("#txtSaatiTransportBadaneh").val();
        }
    }

    //------------------------------------------------------------------------
    error = checkItemAllInPage(EmployerCode, "drpdwnEmployer", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractKind, "drpdwnContractKind", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(name, "txtSaatiName", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(family, "txtSaatiFamily", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(fatehrName, "txtSaatiFatherName", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(mellicode, "txtSaatiMelliCode", "", 2, 1, 1);
    error = DialogErrorAlert(error, "شماره ملی");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(NumberShenasname, "txtSaatiNumberShenasname", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره شناسنامه");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ExportCityRef, "txtSaatiExportCityRef", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(PersonelAddress, "txtSaatiPersonelAddress", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Tel, "txtSaatiTel", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره تماس");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Tel1, "txtSaatiTel1", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره تماس");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Mobile, "txtSaatiMobile", "", 2, 1, 0);
    error = DialogErrorAlert(error, "شماره موبایل");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(jensiat, "SaatidrpdwnJensiat", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    if (ContractKind == "2") {
        //------------------------------------------------------------------------
        error = checkItemAllInPage(Marrids, "drpdwnsaatiMarrid", "-1", 1, 0, 0);
        //------------------------------------------------------------------------
        if (Marrids == "2" || Marrids == "3") error = checkItemAllInPage(CntChild, "drpdwnsaatiCntChild", "-1", 1, 0, 0);
        else error = checkItemAllInPage("1", "drpdwnsaatiCntChild", "-1", 1, 0, 0);
    }
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractMonth, "txtSaatiContractMonth", "", 2, 1, 0);
    error = DialogErrorAlert(error, "مدت قرارداد ماه");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractDay, "txtSaatiContractDay", "", 2, 1, 0);
    error = DialogErrorAlert(error, "مدت قرارداد روز");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractFromDate, "pcalSaatidateContractFromDate", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractToDate, "pcalSaatidateContractToDate", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(ContractDateTavafogh, "pcalSaatidateContractTavafoghDate", "", 2, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(Province, "drpdwnProvinceSaati", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(City, "drpdwnCitySaati", "-1", 1, 0, 0);
    //------------------------------------------------------------------------
    error = checkItemAllInPage(HoghogheSabet.toString(), ContractKind == 3 ? "txtSaatiPriceContract" : "txtSaatiPriceContract2", "", 2, 1, 0);
    error = DialogErrorAlert(error, ContractKind == 3 ? "مبلغ قرارداد" : "مبلغ پاداش عملکرد");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(AyabZahab.toString(), ContractKind == 3 ? "txtProjectAyabZahab" : "txtSaatiAyabZahab", "", 2, 1, 0);
    error = DialogErrorAlert(error, "مبلغ مبلغ ایاب و ذهاب");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(karkardRozane, "txtSaatiContractTime", "", 2, 1, 0);
    error = DialogErrorAlert(error, "مدت قرارداد ماه");
    //------------------------------------------------------------------------
    error = checkItemAllInPage(khadamat, "txtSaatiKhadamat", "", 2, 0, 0);
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    if (PadashAvilable == 1) {
        //------------------------------------------------------------------------
        error = checkItemAllInPage(Padash, "txtSaatiPricePadashContract", "", 2, 1, 0);
        error = DialogErrorAlert(error, "مبلغ حق الزحمه فرآیند");
        //------------------------------------------------------------------------
        error = checkItemAllInPage(TitlePadashContract, "txtSaatiTitlePadashContract", "", 2, 0, 0);
        //------------------------------------------------------------------------
    }
    //------------------------------------------------------
    //------------------------------------------------------
    if (owner == "2") {
        //------------------------------------------------------------------------
        error = checkItemAllInPage(companyname, "txtSaatiCompayName", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(shomaresabt, "txtSaatiShomaresabt", "", 2, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(CompanyKind, "drpdwnSaatiCompanyKind", "-1", 1, 0, 0);
        //------------------------------------------------------------------------
        error = checkItemAllInPage(SematInCompany, "drpdwnSaatiSematInCompany", "-1", 1, 0, 0);
        //------------------------------------------------------------------------
    }
    //------------------------------------------------------------------------
    //------------------------------------------------------------------------
    if (ContractKind == 3) {
        //------------------------------------------------------------------------
        error = checkItemAllInPage(padashamalkard.toString(), "txtProjectPadashAmalkard", "", 2, 1, 0);
        error = DialogErrorAlert(error, "مبلغ پاداش عملکرد");
        //------------------------------------------------------------------------
        error = checkItemAllInPage(haghmodiriat.toString(), "txtSaatiPriceHaghMasoliat", "", 2, 1, 0);
        error = DialogErrorAlert(error, "مبلغ حق مسئولیت");
        //------------------------------------------------------------------------
        if (Contractstate == "2") {
            //------------------------------------------------------------------------
            if (Province != "-1") error = checkItemAllInPage(agent, "drpdwnAgentProject", "-1", 1, 0, 0);
            else error = checkItemAllInPage("1", "drpdwnAgentProject", "-1", 1, 0, 0);
            //------------------------------------------------------------------------
            error = checkItemAllInPage(orgchart, "drpdwnorgposition", "-1", 3, 0, 0);
            if (error = 0) ShowAlert("موقعیت شغلی پرسنل را مشخص نمایید !");
            //------------------------------------------------------------------------
            //------------------------------------------------------------------------
            if (orgArray.indexOf("15") > -1 && ischeckPriceJari.toString() == "1") {
                //------------------------------------------------------------------------
                error = checkItemAllInPage(jariEjareh.toString(), "txtSaatijariEjareh", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ اجاره");
                //------------------------------------------------------------------------
                error = checkItemAllInPage(jariTel.toString(), "txtSaatijariTel", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ تلفن");
                //------------------------------------------------------------------------
                error = checkItemAllInPage(jariNet.toString(), "txtSaatijariNet", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ اینترنت");
                //------------------------------------------------------------------------
                error = checkItemAllInPage(jariAbogaz.toString(), "txtSaatijariAbogaz", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ آب/برق/گاز");
                //------------------------------------------------------------------------
            }
            //------------------------------------------------------------------------
            //------------------------------------------------------------------------
            if (ischeckPriceporsant.toString() == "1") {
                //------------------------------------------------------------------------
                error = checkItemAllInPage(PorsantToziShode.toString(), "txtSaatiPorsantToziShode", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ پورسانت سفارشات توزیع شده");
                //------------------------------------------------------------------------
                error = checkItemAllInPage(PorsantKharejMahdode.toString(), "txtSaatiPorsantKharejMahdode", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ پورسانت سفارشات خارج محدوده");
                //------------------------------------------------------------------------
                error = checkItemAllInPage(PorsantMoadeli.toString(), "txtSaatiPorsantMoadeli", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ پورسانت سفارشات معادلی");
                //------------------------------------------------------------------------
            }
            //------------------------------------------------------------------------
            //------------------------------------------------------------------------
            if (array.indexOf("1") > -1) {
                error = checkItemAllInPage(PriceZemanatNameh.toString(), "txtSaatiPriceZemanatNameh", "", 2, 1, 0);
                error = DialogErrorAlert(error, "مبلغ ضمانت نامه وجه نقد");
            }
            else error = checkItemAllInPage("1", "txtSaatiPriceZemanatNameh", "", 2, 0, 0);
            //------------------------------------------------------------------------
            if (array.indexOf("2") > -1) {
                error = checkItemAllInPage(CountZemanatCheck.toString(), "txtSaatiCountZemanatcheck", "", 2, 1, 0);
                error = DialogErrorAlert(error, "تعداد ضمانت نامه چک");
            }
            else error = checkItemAllInPage("1", "txtSaatiCountZemanatcheck", "", 2, 0, 0);
            //------------------------------------------------------------------------
            var sumzemanatcheck = 0;
            if (array.indexOf("2") > -1 && parseInt(CountZemanatCheck) > 0) {
                var price = 0;
                for (var i = 1; i <= parseInt(CountZemanatCheck) ; i++) {
                    //------------------------------------------------------------------------
                    error = checkItemAllInPage($("#txtSaatiNumbercheck" + i.toString()).val().trim(), "txtSaatiNumbercheck" + i.toString(), "", 2, 0, 0);
                    //------------------------------------------------------------------------
                    error = checkItemAllInPage($("#txtSaatiPricecheck" + i.toString()).val().trim().replaceAll(",", ""), "txtSaatiPricecheck" + i.toString(), "", 2, 1, 0);
                    error = DialogErrorAlert(error, "مبلغ ضمانت نامه چک " + i.toString());
                    if (error == 1) {
                        var pricecheck_temp = parseInt($("#txtSaatiPricecheck" + i.toString()).val().trim().replaceAll(",", ""));
                        sumzemanatcheck = sumzemanatcheck + parseInt(pricecheck_temp);
                    }
                    //------------------------------------------------------------------------
                }
            }
            //------------------------------------------------------------------------
            if (array.indexOf("3") > -1) {
                error = checkItemAllInPage(CountZemanatSafte.toString(), "txtSaatiCountZemanatSafte", "", 2, 1, 0);
                error = DialogErrorAlert(error, "تعداد ضمانت نامه سفته");
            }
            else error = checkItemAllInPage("1", "txtSaatiCountZemanatSafte", "", 2, 0, 0);
            //------------------------------------------------------------------------
            var sumzemanat = 0;
            if (array.indexOf("3") > -1 && parseInt(CountZemanatSafte) > 0) {
                var price = 0;
                for (var i = 1; i <= parseInt(CountZemanatSafte) ; i++) {
                    //------------------------------------------------------------------------
                    error = checkItemAllInPage($("#txtSaatiNumberSafte" + i.toString()).val().trim(), "txtSaatiNumberSafte" + i.toString(), "", 2, 0, 0);
                    //------------------------------------------------------------------------
                    error = checkItemAllInPage($("#txtSaatiPriceSafte" + i.toString()).val().trim().replaceAll(",", ""), "txtSaatiPriceSafte" + i.toString(), "", 2, 1, 0);
                    error = DialogErrorAlert(error, "مبلغ ضمانت نامه سفته " + i.toString());
                    if (error == 1) {
                        var PriceSafte_temp = parseInt($("#txtSaatiPriceSafte" + i.toString()).val().trim().replaceAll(",", ""));
                        sumzemanat = sumzemanat + parseInt(PriceSafte_temp)
                    }
                    //------------------------------------------------------------------------
                }

            }
            //------------------------------------------------------------------------
            if (orgArray.indexOf("15") > -1) {
                error = checkItemAllInPage(AgantMetraj.toString(), "txtSaatiAgantMetraj", "", 2, 1, 0);
                error = DialogErrorAlert(error, "متراژ دفتر نمایندگی");
            }
            else error = checkItemAllInPage("1", "txtSaatiAgantMetraj", "", 2, 0, 0);
            //------------------------------------------------------------------------
            if (orgArray.indexOf("15") > -1) {
                error = checkItemAllInPage(AnbarMetraj.toString(), "txtSaatiAnbarMetraj", "", 2, 1, 0);
                error = DialogErrorAlert(error, "متراژ انبار نمایندگی");
            }
            else error = checkItemAllInPage("1", "txtSaatiAnbarMetraj", "", 2, 0, 0);
            //------------------------------------------------------------------------
            //------------------------------------------------------------------------
            if ((orgArray.indexOf("15") > -1 || orgArray.indexOf("17") > -1) && transporterkind != "0") {
                //------------------------------------------------------------------------
                error = checkItemAllInPage(transportName, "txtSaatiTransporterName", "", 2, 0, 0);
                //------------------------------------------------------------------------
                error = checkItemAllInPage(transportmodel, "txtSaatiTransportModel", "", 2, 0, 0);
                //------------------------------------------------------------------------
                error = checkItemAllInPage(transportsharhbani, "txtSaatiTransportShahrbani", "", 2, 0, 0);
                //------------------------------------------------------------------------
                error = checkItemAllInPage(transportshasi, "txtSaatiTransportShasi", "", 2, 0, 0);
                //------------------------------------------------------------------------
                error = checkItemAllInPage(transportbadaneh, "txtSaatiTransportBadaneh", "", 2, 0, 0);
                //------------------------------------------------------------------------
                error = checkItemAllInPage(transportcolor, "txtSaatiTransportColor", "", 2, 0, 0);
                //------------------------------------------------------------------------
            }
        }
    }
    //===========================================================================
    return error;
}
//============================================================================
//====================تابع چک کردن آیتم های صفحه============================
//============================================================================
var G_ErrorCount = 0;
function checkItemAllInPage(ElementName, ElementID, ChecKWithElementValue, ElementKind, IsCheckNumber, IsCheckMelliCode) {
    var error = 1;
    // IsCheckNumber -- > 1  یعنی شرط عددی بودن هم چک شود
    // IsCheckMelliCode --> 1 یعنی صحت کد ملی بررسی شود
    //3 halate khas
    if (ElementName == ChecKWithElementValue || (IsCheckMelliCode == 1 && !CheckValidMelliCode(ElementName)) || (IsCheckNumber == 1 && !numbericFild.test(ElementName))) {
        $("#" + ElementID).nextAll('.error-icon').remove();
        $("#" + ElementID).removeClass("input-err-border");
        if (ElementKind != 3) {
            if (ElementKind == 1) // drap down bod
                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#" + ElementID);
            else if (ElementKind == 2) // text bod
                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#" + ElementID);

            $("#" + ElementID).addClass("input-err-border");
        }
        error = IsCheckMelliCode == 1 ? 3 : IsCheckNumber == 1 ? 2 : 0;
        G_ErrorCount++;
    }
    else {
        $("#" + ElementID).nextAll('.error-icon').remove();
        $("#" + ElementID).removeClass("input-err-border");
        error = 1;
    }

    return error;
}
//============================================================================
//=========تابع نمایش پیغام های خطای آیتم های صفحه========================
//============================================================================
function DialogErrorAlert(errorId, textError) {
    var error = 1;
    if (errorId == 2) {
        ShowAlert(textError + " باید به صورت عددی باشد !");
        error = 0;
    }
    else if (error == 3) {
        ShowAlert(textError + " وارد شده معتبر نمی باشد !");
        error = 0;
    }
    return error;
}
//----------------------------------------------------------------------------
///=========================== ملی کد چک=====================================
//----------------------------------------------------------------------------
function CheckValidMelliCode(meli_code) {
    if (meli_code.length == 10) {
        if (meli_code == '1111111111' || meli_code == '0000000000' || meli_code == '2222222222' || meli_code == '3333333333' || meli_code == '4444444444' || meli_code == '5555555555' || meli_code == '6666666666' || meli_code == '7777777777' || meli_code == '8888888888' || meli_code == '9999999999') {
            return false;
        }
        c = parseInt(meli_code.charAt(9));
        n = parseInt(meli_code.charAt(0)) * 10 + parseInt(meli_code.charAt(1)) * 9 + parseInt(meli_code.charAt(2)) * 8 + parseInt(meli_code.charAt(3)) * 7 + parseInt(meli_code.charAt(4)) * 6 + parseInt(meli_code.charAt(5)) * 5 + parseInt(meli_code.charAt(6)) * 4 + parseInt(meli_code.charAt(7)) * 3 + parseInt(meli_code.charAt(8)) * 2;
        r = n - parseInt(n / 11) * 11;
        if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
//----------------------------------------------------------------------------
///=========================== ملی کد چک=====================================
//----------------------------------------------------------------------------
//==============================پاک کردن ارور================================
function ResetErrorIconInput(inputName) {
    inputName = inputName.trim();
    $("#" + inputName).nextAll('.error-icon').remove();
    $("#" + inputName).removeClass("input-err-border");

    $("#" + inputName).nextAll('.error-icon-marrid ').remove();
    $("#" + inputName).removeClass("input-err-border-marrid ");

    $("#" + inputName).nextAll('.error-icon-child').remove();
    $("#" + inputName).removeClass("input-err-border-child");
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
    var status = $.trim($("#drpdwnRptStatusPersonel").val());
    var Contractstate = $.trim($("#drpdwnSearchContractState").val());


    var grohkari = $.trim($("#drpdwnWorkGroupPersonelContract").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnWorkGroupPersonelContract").val() + "\"";

    $("#ResultDivPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    //var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th align='center'>شماره شناسنامه</th><th align='center'>تاریخ تولد</th><th>وضعیت تاهل</th><th>کارفرما</th><th>نوع قرارداد</th><th>تاریخ ثبت</th><th>فایل قرارداد</th></thead><tbody>";
    //var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{fathername}</td><td>{mellicode}</td><td>{shsh}</td><td>{datebrithday}</td><td>{marrid}</td><td>{employer}</td><td>{contract}</td><td>{dateRegister}</td><td>{img}</td></tr>";
    var header2 = "<thead><tr><th>فعال/معلق</th><th align='center' width='50px'>ردیف</th><th>تاریخ شروع قرارداد</th><th>تاریخ قطع همکاری</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th><th align='center'>کد ملی</th><th align='center'>شماره شناسنامه</th><th align='center'>تاریخ تولد</th><th>کارفرما</th><th>نوع قرارداد</th><th>حالت قرارداد</th><th>وضعیت</th><th {style}>فایل قرارداد</th><th {style}>اطلاعات قرارداد</th></thead><tbody>";
    var mainrow = "<tr><td>{check}</td><td>{Row}</td><td>{datestartContract}</td><td>{dateCutwork}</td><td>{personelcode}</td><td>{name}</td><td>{workgroup}</td><td>{mellicode}</td><td>{shsh}</td><td>{datebrithday}</td><td>{employer}</td><td>{contract}</td><td>{contractstate}</td><td id='tdstatus{mellicode}'>{status}</td><td {style}>{contractfile}</td><td {style}>{contractinfo}</td></tr>";
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
        data: { i: 3, personelcode: personelcode, status: status, Contractstate: Contractstate, grohkari: grohkari, Employer: Employer, ContractKind: ContractKind, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, page: vpage, perpage: vperpage },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            var isvalid = 0;
            AllRecordCount = data[1];
            isvalid = data[2];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                // row = row.replaceAll("{fathername}", this['strFatherName'] == "null" || this['strFatherName'] == undefined ? "--" : this['strFatherName']);
                row = row.replaceAll("{shsh}", this['strNumberShenasname']);
                row = row.replaceAll("{datebrithday}", this['dateBrithdayDate']);
                // row = row.replaceAll("{marrid}", $.trim(this['strMarridName']));
                row = row.replaceAll("{datestartContract}", $.trim(this['dateStartContractDate']));
                row = row.replaceAll("{employer}", $.trim(this['strEmployerName']));
                row = row.replaceAll("{contract}", $.trim(this['strContractKindName']));
                row = row.replaceAll("{contractstate}", $.trim(this['strContractStateName']));

                row = row.replaceAll("{dateCutwork}", $.trim(this['dateCutWorkDate']));

                // row = row.replaceAll("{img}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' href='Images/PersonelImge/" + $.trim(this['strUploadImage']) + "' target='_blank'><img src='images/Preview.png' /></a></div>");

                // row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' href='PeikFactor.aspx?ofc={mellicode}' target='_blank'><img src='images/REprint.png' /></a></div>");
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                if (parseInt(this['cntcontract']) > 1 && this['numStatusContract'] == 0) {
                    row = row.replaceAll("{status}", "قطع همکاری");
                }
                else if (this["laststatuscontract"] == "0" && this['numStatus'] != "3" && this['numStatusContract'] == 0) {
                    row = row.replaceAll("{status}", "<font style='color:#ff0000;'>قرارداد غیر فعال</font>");
                }
                else {
                    row = row.replaceAll("{status}", this['numStatus'] == "1" ? "نیمه فعال" : this['numStatus'] == "2" ? "فعال" : this['numStatus'] == "3" ? "قطع همکاری" : this['numStatus'] == "4" ? "معلق" : "-");
                }
                row = row.replaceAll("{workgroup}", this['strWorkGroupName'] == null ? "نامشخص" : this['strWorkGroupName']);
                row = row.replaceAll("{check}", ((this['numStatus'] == "1" || this['numStatus'] == "2" || this['numStatus'] == "4") && this['numStatusContract'] != 0) ? "<div style='float:right;width:100%'><input type='checkbox' id='chkStatus{mellicode}' onclick='changestatusUser(\"{mellicode}\");' " + (this['numStatus'] == "1" || this['numStatus'] == "2" ? "checked='checked'" : "") + "/></div>" : "");


                row = row.replaceAll("{style}", isvalid == 1 ? "" : " style='display:none;'");
                row = row.replaceAll("{contractfile}", isvalid == 1 ? "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' href='PeikFactor.aspx?ofc={contractcode}' target='_blank'><img src='images/REprint.png' style='width:25px;'/></a></div>" : "");
                row = row.replaceAll("{contractinfo}", isvalid == 1 ? "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='EditPersonelCode(\"{mellicode}\",{contractcode},2);'><img src='images/Edit.png' style='width:25px;'/></a></div>" : "");

                row = row.replaceAll("{mellicode}", this['strMelliCode'].trim());
                row = row.replaceAll("{contractcode}", this['numContractCode']);

                //S = this['numStatus'];
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

                $("#ResultDivPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonel").html(allpage);
                $("#ResultDivPersonel").show();
            }
            else {
                $("#ResultDivPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#ResultDivPersonel").show();
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
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function changestatusUser(mellicode) {
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();

    var isbool = $("#chkStatus" + mellicode.toString()).attr("checked");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 16, isbool: isbool, mellicode: mellicode },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            if (data == "1") {
                ShowAlert("اطلاعات با موفقیت ثبت شد !");

                GetReportInfoPersonel(1);
            }
            else if (data == "2") {
                ShowAlert("اطلاعاتی از پرسنل یافت نشد !");
                GetReportInfoPersonel(1);
            }
            else if (data == "3") {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                if ($("#chkStatus" + mellicode.toString()).attr("checked") == "checked")
                    $("#chkStatus" + mellicode.toString()).removeAttr("checked");
                else
                    $("#chkStatus" + mellicode.toString()).attr("checked", "checked");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            if ($("#chkStatus" + mellicode.toString()).attr("checked") == "checked")
                $("#chkStatus" + mellicode.toString()).removeAttr("checked");
            else
                $("#chkStatus" + mellicode.toString()).attr("checked", "checked");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== دوره آزمایشی دارد یا ندارد ======================
//---------------------------------------------------------------------------------
function GetInfoDoreAzmaieshi() {
    var value = $("#drpdwnDoreAzmaieshi").val();
    if (value == "0") {
        $("#trDoreAzmaieshi1").hide();
        //$("#trDoreAzmaieshi2").hide();
    }
    else {
        $("#trDoreAzmaieshi1").show();
        //  $("#trDoreAzmaieshi2").show();
    }
    $("#pcaldateDoreFromDate").val('');
    $("#pcaldateCDoreToDate").val('');
    // $("#pcaldateContractUnValidDate").val('');
}
//---------------------------------------------------------------------------------
///=========================== معرف دارد یا ندارد ===============================
//---------------------------------------------------------------------------------
function GetMoarefInfo() {
    var value = $("#drpdwnMoaref").val();
    if (value == "0") {
        $("#trMoaref1").hide();
        $("#trMoaref2").hide();
        $("#trMoaref3").hide();
    }
    else {
        $("#trMoaref1").show();
        $("#trMoaref2").show();
        $("#trMoaref3").show();
    }
    $("#txtMoarefName").val('');
    $("#txtMoarefFamily").val('');
    $("#txtMoarefTel").val('');
    $("#txtMoarefMobile").val('');
    $("#txtMoarefNesbat").val('');
    $("#txtMoarefAddress").val('');
}
//============================================================================
//=================================نمایش اطلاعات شخصیت ======================
//============================================================================
function GetInfoOwnerSaati() {
    var items = $("#drpdwnSaatiOwner").val();
    if (items == "-1") {
        $(".hideCompanySaati").hide();
    }
    else if (items == "1") {
        $(".hideCompanySaati").hide();
    }
    else if (items == "2") {
        $(".hideCompanySaati").show();
    }

    $("#txtSaatiCompayName").val("");
    $("#txtSaatiShomaresabt").val("");
    $("#drpdwnSaatiCompanyKind").val("-1");
    $("#drpdwnSaatiSematInCompany").val("-1");
}
//============================================================================
//============================================================================
function GetInfoOwner() {
    var items = $("#drpdwnOwner").val();
    if (items == "-1") {
        $(".hideCompany").hide();
    }
    else if (items == "1") {
        $(".hideCompany").hide();
    }
    else if (items == "2") {
        $(".hideCompany").show();
    }

    $("#txtCompayName").val("");
    $("#txtShomaresabt").val("");
    $("#drpdwnCompanyKind").val("-1");
    $("#drpdwnSematInCompany").val("-1");
}
//============================================================================
//==================================تعداد ضمانت ایجاد ======================
//======================================سفته======================================
var lastZemanatRow = 0;
function createZemanatInfo() {
    var item = $("#txtCountZemanatSafte").val().trim();
    item = parseInt(item.replaceAll(",", ""));
    if (item != "") {
        var all = "", row = "";
        var main = "<tr class='hideLojesticInfo1 hidezemanat hideInfoCount' id='trzemanatInfo{i}'>" +
                   "<td align='left'>شماره سفته {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtNumberSafte{i}' type='text' style='width: 170px;' maxlength='15' class='InputTextLeftToRightText' onfocus='ResetErrorIconInput(\"txtNumberSafte{i}\"); return false;' />" +
                   "</td>" +
                   "<td align='left'>مبلغ سفته {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtPriceSafte{i}' type='text' style='width: 170px;' maxlength='15' class='InputTextLeftToRightText setcamma' onfocus='ResetErrorIconInput(\"txtPriceSafte{i}\"); return false;' /> ریال" +
                   "</td>" +
               "</tr>";

        for (var z = 1; z <= parseInt(lastZemanatRow) ; z++) {
            $("#trzemanatInfo" + z.toString()).remove();
        }

        for (var i = 1; i <= parseInt(item) ; i++) {
            row = main.replaceAll("{i}", i)
            all = all + row;
        }

        lastZemanatRow = i - 1;

        $(all).insertAfter("#trzemanatInfo");
        $("#trzemanatInfo").html("");
        $("#trzemanatInfo").hide();

        $(".setcamma").keyup(function () { _Amount_onkeyup(this) });


    }
    else {
        for (var z = 1; z <= parseInt(lastZemanatRow) ; z++) {
            $("#trzemanatInfo" + z.toString()).remove();
        }
        lastZemanatRow = 0;
        $("#trzemanatInfo").html("");
        $("#trzemanatInfo").hide();
    }
}
//=========================================چک===================================
var lastZemanatCheckRow = 0;
function createZemanatInfocheck() {
    var item = $("#txtCountZemanatcheck").val().trim();
    item = parseInt(item.replaceAll(",", ""));
    if (item != "") {
        var all = "", row = "";
        var main = "<tr class='hideLojesticInfo1 hidezemanat hideInfoCount' id='trzemanatInfocheck{i}'>" +
                   "<td align='left'>شماره چک {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtNumbercheck{i}' type='text' style='width: 170px;'  class='InputTextLeftToRightText' onfocus='ResetErrorIconInput(\"txtNumbercheck{i}\"); return false;' />" +
                   "</td>" +
                   "<td align='left'>مبلغ چک {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtPricecheck{i}' type='text' style='width: 170px;' maxlength='15' class='InputTextLeftToRightText setcamma' onfocus='ResetErrorIconInput(\"txtPricecheck{i}\"); return false;' /> ریال" +
                   "</td>" +
               "</tr>";

        for (var z = 1; z <= parseInt(lastZemanatCheckRow) ; z++) {
            $("#trzemanatInfocheck" + z.toString()).remove();
        }

        for (var i = 1; i <= parseInt(item) ; i++) {
            row = main.replaceAll("{i}", i)
            all = all + row;
        }

        lastZemanatCheckRow = i - 1;

        $(all).insertAfter("#trzemanatInfocheck");
        $("#trzemanatInfocheck").html("");
        $("#trzemanatInfocheck").hide();
        $(".setcamma").keyup(function () { _Amount_onkeyup(this) });

    }
    else {
        for (var z = 1; z <= parseInt(lastZemanatCheckRow) ; z++) {
            $("#trzemanatInfocheck" + z.toString()).remove();
        }
        lastZemanatCheckRow = 0;
        $("#trzemanatInfocheck").html("");
        $("#trzemanatInfocheck").hide();
    }
}
//===================================سفته=========================================
var lastZemanatRowSaati = 0;
function createZemanatInfoSaati() {
    var item = $("#txtSaatiCountZemanatSafte").val().trim();
    item = parseInt(item.replaceAll(",", ""));
    if (item != "") {
        var all = "", row = "";
        var main = "<tr class='hideLojesticInfoSaati1 hidezemanatSaati hideInfoCountSaati' id='trzemanatInfoSaati{i}'>" +
                   "<td align='left'>شماره سفته {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtSaatiNumberSafte{i}' type='text' style='width: 170px;' maxlength='15' class='InputTextLeftToRightText' onfocus='ResetErrorIconInput(\"txtSaatiNumberSafte{i}\"); return false;' />" +
                   "</td>" +
                   "<td align='left'>مبلغ سفته {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtSaatiPriceSafte{i}' type='text' style='width: 170px;' maxlength='15' class='InputTextLeftToRightText setcamma' onfocus='ResetErrorIconInput(\"txtSaatiPriceSafte{i}\"); return false;' /> ریال" +
                   "</td>" +
               "</tr>";

        for (var z = 1; z <= parseInt(lastZemanatRowSaati) ; z++) {
            $("#trzemanatInfoSaati" + z.toString()).remove();
        }

        for (var i = 1; i <= parseInt(item) ; i++) {
            row = main.replaceAll("{i}", i)
            all = all + row;
        }

        lastZemanatRowSaati = i - 1;

        $(all).insertAfter("#trzemanatInfoSaati");
        $("#trzemanatInfoSaati").html("");
        $("#trzemanatInfoSaati").hide();
        $(".setcamma").keyup(function () { _Amount_onkeyup(this) });

    }
    else {
        for (var z = 1; z <= parseInt(lastZemanatRowSaati) ; z++) {
            $("#trzemanatInfoSaati" + z.toString()).remove();
        }
        lastZemanatRowSaati = 0;
        $("#trzemanatInfoSaati").html("");
        $("#trzemanatInfoSaati").hide();
    }
}
//======================================چک======================================
var lastZemanatRowcheckSaati = 0;
function createZemanatInfocheckSaati() {
    var item = $("#txtSaatiCountZemanatcheck").val().trim();
    item = parseInt(item.replaceAll(",", ""));
    if (item != "") {
        var all = "", row = "";
        var main = "<tr class='hideLojesticInfoSaati1 hidezemanatcheckSaati hideInfoCountcheckSaati' id='trzemanatInfocheckSaati{i}'>" +
                   "<td align='left'>شماره چک {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtSaatiNumbercheck{i}' type='text' style='width: 170px;'  class='InputTextLeftToRightText' onfocus='ResetErrorIconInput(\"txtSaatiNumbercheck{i}\"); return false;' />" +
                   "</td>" +
                   "<td align='left'>مبلغ چک {i} :</td>" +
                   "<td align='right'>" +
                       "<input id='txtSaatiPricecheck{i}' type='text' style='width: 170px;' maxlength='15' class='InputTextLeftToRightText setcamma' onfocus='ResetErrorIconInput(\"txtSaatiPricecheck{i}\"); return false;' /> ریال" +
                   "</td>" +
               "</tr>";

        for (var z = 1; z <= parseInt(lastZemanatRowcheckSaati) ; z++) {
            $("#trzemanatInfocheckSaati" + z.toString()).remove();
        }

        for (var i = 1; i <= parseInt(item) ; i++) {
            row = main.replaceAll("{i}", i)
            all = all + row;
        }

        lastZemanatRowcheckSaati = i - 1;

        $(all).insertAfter("#trzemanatInfocheckSaati");
        $("#trzemanatInfocheckSaati").html("");
        $("#trzemanatInfocheckSaati").hide();
        $(".setcamma").keyup(function () { _Amount_onkeyup(this) });

    }
    else {
        for (var z = 1; z <= parseInt(lastZemanatRowcheckSaati) ; z++) {
            $("#trzemanatInfocheckSaati" + z.toString()).remove();
        }
        lastZemanatRowcheckSaati = 0;
        $("#trzemanatInfocheckSaati").html("");
        $("#trzemanatInfocheckSaati").hide();
    }
}
//============================================================================
//=================================نمایش اطلاعات وسیله نقلیه ================
//============================================================================
function getInfoTransport(type) {
    var items = $("#drpdwnTransportKind").val();

    if (items == "0") {
        $(".hideItemsMovaghatTransport").hide();

        $("#txtTransporterName").val("");
        $("#txtTransportModel").val("");
        $("#txtTransportColor").val("");
        $("#txtTransportShahrbani").val("");
        $("#txtTransportShasi").val("");
        $("#txtTransportBadaneh").val("");
    }
    else {
        $(".hideItemsMovaghatTransport").show();
    }

    if (type == 1) {
        $("#txtTransporterName").val("");
        $("#txtTransportModel").val("");
        $("#txtTransportColor").val("");
        $("#txtTransportShahrbani").val("");
        $("#txtTransportShasi").val("");
        $("#txtTransportBadaneh").val("");
    }
}
//============================================================================
//=================================نمایش اطلاعات وسیله نقلیه ================
//============================================================================
function getInfoTransportSaati(type) {
    var items = $("#drpdwnSaatiTransportKind").val();

    if (items == "0") {
        $(".hideItemsTransport").hide();

        $("#txtSaatiTransporterName").val("");
        $("#txtSaatiTransportModel").val("");
        $("#txtSaatiTransportColor").val("");
        $("#txtSaatiTransportShahrbani").val("");
        $("#txtSaatiTransportShasi").val("");
        $("#txtSaatiTransportBadaneh").val("");
    }
    else {
        $(".hideItemsTransport").show();
    }

    if (type == 1) {
        $("#txtSaatiTransporterName").val("");
        $("#txtSaatiTransportModel").val("");
        $("#txtSaatiTransportColor").val("");
        $("#txtSaatiTransportShahrbani").val("");
        $("#txtSaatiTransportShasi").val("");
        $("#txtSaatiTransportBadaneh").val("");
    }
}
//============================================================================
//=================================نمایش اطلاعات ضمانت ======================
//============================================================================
function getInfoZemanatSaati(type) {
    var items = $("#drpdwnSaatiZemanatKind").val();
    items = items == null || items == undefined || items == '' ? "-1" : "\"" + $("#drpdwnSaatiZemanatKind").val() + "\"";

    if (items == "0" || items == "-1") {

        $(".hidezemanatSaati,.hidezemanatcheckSaati,.zemanatpriceSaati").hide();
        $("#trzemanatInfoSaati,#trzemanatInfocheckSaati").html("");
        $("#trzemanatInfoSaati,#trzemanatInfocheckSaati").hide();
    }
    else {
        $(".hidezemanatSaati,.hidezemanatcheckSaati,.zemanatpriceSaati").hide();
        var array = items.replaceAll("\"", "").split(',');
        for (var i = 0; i <= array.length; i++) {
            if (array[i] == "1") {
                $(".zemanatpriceSaati").show();
            }
            else if (array[i] == "2") {
                $(".hidezemanatcheckSaati").show();
            }
            else if (array[i] == "3") {
                $(".hidezemanatSaati").show();
            }
        }
    }

    if (type == 1) {
        $("#txtSaatiPriceZemanatNameh").val("");
        $("#txtSaatiCountZemanatcheck").val("");
        $("#txtSaatiCountZemanatSafte").val("");
    }

    createZemanatInfoSaati();
    createZemanatInfocheckSaati();
}
//============================================================================
function getInfoZemanat(type) {
    var items = $("#drpdwnZemanatKind").val();
    items = items == null || items == undefined || items == '' ? "-1" : "\"" + $("#drpdwnZemanatKind").val() + "\"";

    if (items == "0" || items == "-1") {
        $(".hidezemanat,.hidezemanatcheck,.zemanatprice").hide();
        $("#trzemanatInfo,#trzemanatInfocheck").html("");
        $("#trzemanatInfo,#trzemanatInfocheck").hide();

    }
    else {
        $(".hidezemanat,.hidezemanatcheck,.zemanatprice").hide();
        $(".hidezemanatSaati,.hidezemanatcheckSaati,.zemanatpriceSaati").hide();

        var array = items.replaceAll("\"", "").split(',');
        for (var i = 0; i <= array.length; i++) {
            if (array[i] == "1") {
                $(".zemanatprice").show();
            }
            else if (array[i] == "2") {
                $(".hidezemanatcheck").show();
            }
            else if (array[i] == "3") {
                $(".hidezemanat").show();
            }
        }
    }

    if (type == 1) {
        $("#txtPriceZemanatNameh").val("");
        $("#txtCountZemanatcheck").val("");
        $("#txtCountZemanatSafte").val("");
    }
    createZemanatInfo();
    createZemanatInfocheck();
}
//---------------------------------------------------------------------------------
///=========================== نوع قرارداد عوض شود================================
//---------------------------------------------------------------------------------
function GetTextContractKind() {

    var karfarma = $("#drpdwnEmployer").val();
    var contract = $("#drpdwnContractKind").val();
    var contractstate = $("#drpdwnStateContractkind").val();
    if (karfarma == "-1" && contract == "-1" && contractstate == "-1") {
        ShowAlert("اطلاعات عنوان قرارداد را مشخص نمایید !");
        $("#divlblContractKind").html('');
        $("#divSaatilblContractKind").html('');
        return 0;
    }
    else if (karfarma == "-1") {
        ShowAlert("لطفا کارفرما را مشخص نمایید !");
        $("#divlblContractKind").html('');
        $("#divSaatilblContractKind").html('');
        return 0;
    }
    else if (contract == "-1") {
        ShowAlert("لطفا نوع قرارداد را مشخص نمایید !");
        $("#divlblContractKind").html('');
        $("#divSaatilblContractKind").html('');
        return 0;
    }
    else if (contractstate == "-1") {
        ShowAlert("لطفا حالت قراردادی را مشخص نمایید !");
        $("#divlblContractKind").html('');
        $("#divSaatilblContractKind").html('');
        return 0;
    }
    else {

        if (contract == "1")
            $("#divlblContractKind").html($("#drpdwnContractKind option:selected").text());
        else
            $("#divSaatilblContractKind").html($("#drpdwnContractKind option:selected").text());


        if (contractstate == "2" && contract == "1") {
            $(".hideLojesticInfo").show();

            $(".hideAget").hide();
            $(".hideLojesticInfo1").hide();

            if ($("#drpdwnorgpositionMovaghat").val() == "-1" || $("#drpdwnorgpositionMovaghat").val() == null || $("#drpdwnorgpositionMovaghat").val() == undefined)
                showitemorgpositionMovaghat(1);

            $(".hidezemanat,.hidezemanatcheck").hide();

        }
        else if (contractstate == "1" && contract == "1") {
            $(".hideLojesticInfo").hide();
            $(".hideAget").hide();
            $(".hideLojesticInfo1").hide();
        }


        if (contractstate == "2" && contract == "3") {
            $(".hideLojesticInfoSaati").show();
            $(".hideAgetproject").hide();
            $(".hideLojesticInfoSaati1").hide();
            if ($("#drpdwnorgposition").val() == "-1" || $("#drpdwnorgposition").val() == null || $("#drpdwnorgposition").val() == undefined)
                showitemorgposition(1);
            else $(".trPriceproject1").show();
            $(".hidezemanatSaati,.hidezemanatcheckSaati").hide();

        }
        else if (contractstate == "1" && contract == "3") {

            $(".trPriceproject1").hide();
            $(".hideAgetproject").hide();
            $(".hideLojesticInfoSaati").hide();
            $(".hideLojesticInfoSaati1").hide();
        }

        if (contract == "2") {
            $(".trPriceproject1").hide();
            $(".hideAgetproject").hide();
            $(".hideLojesticInfoSaati").hide();
            $(".hideLojesticInfoSaati1").hide();
        }
        return 1;

    }
}
//---------------------------------------------------------------------------------
//----------------------------------نمایش آیتم های قرارداد-----------------------
//---------------------------------------------------------------------------------
function CheckContractInputValue() {
    var karfarma = $("#drpdwnEmployer").val();
    var contract = $("#drpdwnContractKind").val();
    var value = $("#drpdwnStateContractkind").val();

    if (karfarma != "-1" && contract != "-1" && value != "-1")
        GetInfoByContractKind(1);
    else {
        $("#tblContractInfo1").hide();
        $("#tblContractInfo2").hide();
    }

}
//---------------------------------------------------------------------------------
///=========================== دریافت حق اولاد موقت=====================================
//---------------------------------------------------------------------------------
function GetHaghOladFromHoghogh() {
    var cntChild = $("#drpdwnCntChild").val();
    var hoghogh = $("#txtHoghogheSabet").val();
    if (cntChild != "-1" && cntChild != "0" && $.trim(hoghogh) != "") {
        hoghogh = parseInt(hoghogh.replaceAll(",", ""));
        var Mablagh = "";
        if (parseInt(cntChild) == 1) {
            Mablagh = parseInt(hoghogh) * 0.1;
            $("#txtHaghOlad").val(addCommas(Math.round(Mablagh)));
        }
        else if (parseInt(cntChild) > 1) {
            Mablagh = parseInt(hoghogh) * 0.2;
            $("#txtHaghOlad").val(addCommas(Math.round(Mablagh)));
        }
    }
    else if ((cntChild == "-1" || cntChild == "0") && $.trim(hoghogh) != "") {
        $("#txtHaghOlad").val(0);
    }

    if ($.trim(hoghogh) != "") {
        hoghogh = $("#txtHoghogheSabet").val();
        hoghogh = parseInt(hoghogh.replaceAll(",", ""));
        $("#txtSanavat").val(addCommas(Math.round((parseInt($.trim(hoghogh)) / 12))));
    }

    GetKolDaramad();
}
//---------------------------------------------------------------------------------
///=========================== دریافت حق اولاد ساعتی=====================================
//---------------------------------------------------------------------------------
function GetHaghOladFromHoghoghsaati() {
    var cntChild = $("#drpdwnsaatiCntChild").val();
    var hoghogh = addCommas(salaryMain);
    if (cntChild != "-1" && cntChild != "0" && $.trim(hoghogh) != "") {
        hoghogh = parseInt(hoghogh.replaceAll(",", ""));
        var Mablagh = "";
        if (parseInt(cntChild) == 1) {
            Mablagh = parseInt(hoghogh) * 0.1;
            Mablagh = Math.round(Mablagh / 190.58);
            $("#txtSaatiPriceChildSalary").val(addCommas(Math.round(Mablagh)));
        }
        else if (parseInt(cntChild) > 1) {
            Mablagh = parseInt(hoghogh) * 0.2;
            Mablagh = Math.round(Mablagh / 190.58);
            $("#txtSaatiPriceChildSalary").val(addCommas(Math.round(Mablagh)));
        }
    }
    else if ((cntChild == "-1" || cntChild == "0") && $.trim(hoghogh) != "") {
        $("#txtSaatiPriceChildSalary").val(0);
    }

    //if ($.trim(hoghogh) != "") {
    //    hoghogh = salaryMain;
    //    hoghogh = parseInt(hoghogh.replaceAll(",", ""));
    //    $("#txtSanavat").val(addCommas(Math.round((parseInt($.trim(hoghogh)) / 12))));
    //}

    GetKolDaramadsaati();
}
//----------------------------------------------------------------------------
//---------------دریافت اطلاعات قرار داد براساس نوع قرار داد--------------
//----------------------------------------------------------------------------
function GetInfoByContractKind(checkDrpdwn) {
    $(".error-icon").remove();
    $("input,select").removeClass("input-err-border");
    ResetErrorIconInput('txtSaatiKhadamat');
    var personelrecontractCode = 0;
    var codeMelli = "0";
    if (TabActiveReContract == 1) // Recontract
    {
        personelrecontractCode = $("#txtPersonelCodeForReContract").val();
        codeMelli = $("#txtCodeMelliForReContract").val();
    }
    var employer = $("#drpdwnEmployer").val();
    var contractKind = $("#drpdwnContractKind").val();
    var contractState = $("#drpdwnStateContractkind").val();

    $("select").not("#daylblDateFrom,#monthlblDateFrom,#yearlblDateFrom,#daylblDateTo,#monthlblDateTo,#yearlblDateTo").val("-1");
    $("#drpdwnSaatiZemanatKind,#drpdwnZemanatKind,#drpdwnorgposition,#drpdwnorgpositionMovaghat").multiselect('refresh');

    $("#drpdwnEmployer").val(employer);
    $("#drpdwnContractKind").val(contractKind);
    $("#drpdwnStateContractkind").val(contractState);

    GetInfoOwner();
    getInfoZemanat(1);
    getInfoZemanatSaati(1);
    getInfoTransportSaati(1);
    getInfoTransport(1);


    if (checkDrpdwn == 0 && (contractKind == "-1" && contractState == "-1" && employer == "-1")) {
        $("#tblContractInfo1").hide();
        $("#tblContractInfo2").hide();
    }

    if (GetTextContractKind() == 1 && checkDrpdwn == 1) {
        var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
        var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();
        $("#yearlblDateFrom").val(DateFrom.split('/')[0]);
        $("#monthlblDateFrom").val(DateFrom.split('/')[1]);
        $("#daylblDateFrom").val(DateFrom.split('/')[2]);
        $("#yearlblDateTo").val(DateTo.split('/')[0]);
        $("#monthlblDateTo").val(DateTo.split('/')[1]);
        $("#daylblDateTo").val(DateTo.split('/')[2]);

        $("#titleEditInsertContract").html("تدوین");

        if (contractKind == "-1") {
            $("#tblContractInfo1").hide();
            $("#tblContractInfo2").hide();
        }
        else if (contractKind == "1") {
            $("#btnSaveInfoContract").show();
            $("#btnEditInfoContract").hide();
            $("#btnCancelEditInfoContract").hide();

            $("#tblContractInfo1").show();
            $("#tblContractInfo2").hide();

            GetInfoDoreAzmaieshi();
            GetMoarefInfo();

            GetChangeHazineJari();
            GetChangePorsant();

            //if ($("#drpdwnorgpositionMovaghat").val() == "-1" || $("#drpdwnorgpositionMovaghat").val() == null || $("#drpdwnorgpositionMovaghat").val() == undefined)
            //    showitemorgpositionMovaghat(1);

        }
        else if (contractKind == "2" || contractKind == "3") {
            $("#tblContractInfo1").hide();
            $("#tblContractInfo2").show();

            GetChangeSaatiPorsant();
            GetChangeSaatiHazineJari();

            if (contractKind == "2") {
                $("#btnSaatiSaveInfoContract").show();
                $("#btnProjectSaveInfoContract").hide();

                $("#btnSaatiEditInfoContract").hide();
                $("#btnSaatiCancelEditInfoContract").hide();
                $("#btnProjectEditInfoContract").hide();
                $("#btnProjectCancelEditInfoContract").hide();

                $(".trPriceSaati").show();
                $("#trPriceproject,.trPriceproject1,#trPriceproject1").hide();
                $("#txtSaatiPriceContract").val("");
                $("#txtSaatiPriceHaghMasoliat").val("");
                $("#txtSaatiPriceContract2").val("");
                $("#txtSaatiAyabZahab").val("");
            }
            else {
                $("#btnSaatiSaveInfoContract").hide();
                $("#btnProjectSaveInfoContract").show();

                $("#btnSaatiEditInfoContract").hide();
                $("#btnSaatiCancelEditInfoContract").hide();
                $("#btnProjectEditInfoContract").hide();
                $("#btnProjectCancelEditInfoContract").hide();

                if (contractState == "2") {
                    if ($("#drpdwnorgposition").val() == "-1" || $("#drpdwnorgposition").val() == null || $("#drpdwnorgposition").val() == undefined)
                        showitemorgposition(1);

                    else $(".trPriceproject1").show();
                }
                else {
                    $(".trPriceproject1").hide();

                }
                $(".trPriceSaati").hide();
                $("#trPriceproject,#trPriceproject1").show();
                $("#txtSaatiPriceContract").val("");
                $("#txtSaatiPriceHaghMasoliat").val("");
                $("#txtSaatiPriceContract").val("");
                $("#txtProjectAyabZahab").val("");
                $("#txtProjectPadashAmalkard").val("");


            }
        }
        showChildInfo();
        showChildInfosaati();

        $("input[type=text], textarea").val("");

        //========================================== movaghat ==================================================
        $("#txtHoghogheSabet").val(addCommas(salaryMain));
        $("#txtHaghMaskan").val(addCommas(HomeMain));
        $("#txtHaghOlad").val(HaghOladMain);
        $("#txtBonKharbar").val(addCommas(BonMain));
        var hoghogh = $("#txtHoghogheSabet").val();
        hoghogh = parseInt(hoghogh.replaceAll(",", ""));
        $("#txtSanavat").val(addCommas(Math.round((parseInt($.trim(hoghogh)) / 12))));

        //========================================= saati ===================================================
        $("#tdSalaryMainsaati").html(addCommas(salaryMain) + " ریال");

        $("#txtSaatiPriceSalary").val(addCommas(Math.round((parseInt($.trim(salaryMain)) / 190.58))));
        $("#txtSaatiPriceHomeSalary").val(addCommas(Math.round((parseInt($.trim(HomeMain)) / 190.58))));
        $("#txtSaatiPriceBon").val(addCommas(Math.round((parseInt($.trim(BonMain)) / 190.58))));
        $("#txtSaatiPriceChildSalary").val(addCommas(Math.round((parseInt($.trim(HaghOladMain)) / 190.58))));
        $("#txtSaatiPriceSanavat").val(addCommas(Math.round(((parseInt($.trim(salaryMain)) / 12) / 190.58))));
        $("#txtSaatiPriceEydi").val(addCommas(Math.round(((parseInt($.trim(salaryMain)) / 12) / 190.58) * 2)));
        $("#txtSaatiPriceMorakhasi").val(addCommas(Math.round(((2.17 * 7.33) / 190.58) * (parseInt($.trim(salaryMain)) / 190.58))));
        $("#txtSaatiPriceContract2").val("");


        if (contractKind == "1") GetKolDaramad();
        if (contractKind == "2" || contractKind == "3") {
            $("#txtSaatiPricePadashContract").val('0');
            $("#drpdwnSaatiPricePadashAvilable").val('0');
            $("#drpdwnSaatiPriceEndKind").val('1');
            $("#drpdwnTimeForMonth").val('1');
            $("#drpdwnWeekForMonth").val('1');
            GetChangePadashSaati();
            if (contractKind == "2") GetKolDaramadsaati();
        }

        if (TabActiveReContract == 1) // Recontract
        {
            $("#txtPersonelCodeForReContract").val(personelrecontractCode);
            $("#txtCodeMelliForReContract").val(codeMelli);

            var contractKind = 0;
            var cntchild = 0;
            var childsalary = 0;
            contractKind = $("#drpdwnContractKind").val();
            //=========================================================================
            $.each(LastcontractReContractInfo, function (index) {
                if (contractKind == "1") {
                    if (this["numContractKindRef"] == contractKind) {

                        if (flagReadPrice == 1) {
                            $("#txtHoghogheSabet").val(addCommas(salaryMain));
                            $("#txtHaghMaskan").val(addCommas(HomeMain));
                            $("#txtBonKharbar").val(addCommas(BonMain));
                            var hoghogh = salaryMain;
                            $("#txtSanavat").val(addCommas(Math.round((parseInt($.trim(hoghogh)) / 12))));
                        }
                        else if (flagReadPrice == 2) {
                            $("#txtHoghogheSabet").val(addCommas(this['numPersonelSalary']));
                            $("#txtHaghMaskan").val(addCommas(this['numPersonelHomeSalary']));
                            $("#txtBonKharbar").val(addCommas(this['numPersonelBon']));
                            $("#txtSanavat").val(addCommas(this['numPersonelSanavat']));
                        }

                        $("#txtPadashAmalkard").val(addCommas(this['numPersonelPadash']));
                        $("#txtHaghOlad").val(addCommas(this['numPersonelChildSalary']));
                        $("#txtSaier").val(addCommas(this['numPersonelSaier']));
                        $("#txtHaghMasoliatSaier").val(addCommas(this['numPriceHaghModiriat']));
                        $("#txtAyabZahab").val(addCommas(this['numPriceAyabZahab']));

                        if (contractState == "2") {
                            var arrayorg = this['chartposition'].split(',');
                            $("#drpdwnorgpositionMovaghat").val(arrayorg);
                            $("#drpdwnorgpositionMovaghat").multiselect('refresh');
                            showitemorgpositionMovaghat(2);

                            if (arrayorg.indexOf("15") > -1) {
                                if (parseInt(this['numPriceJariEjareh']) > 0 || parseInt(this['numPriceJariTel']) > 0 || parseInt(this['numPriceJariNet']) > 0 || parseInt(this['numPriceJariAbogaz']) > 0) {
                                    $("#drpdwnpricejari").val("1");
                                }
                                else {
                                    $("#drpdwnpricejari").val("0");
                                }
                                GetChangeHazineJari();

                                $("#txtjariEjareh").val(addCommas(this['numPriceJariEjareh']));
                                $("#txtjariTel").val(addCommas(this['numPriceJariTel']));
                                $("#txtjariNet").val(addCommas(this['numPriceJariNet']));
                                $("#txtjariAbogaz").val(addCommas(this['numPriceJariAbogaz']));

                                $("#txtAgantMetraj").val(this['numAgentArea']);
                                $("#txtAnbarMetraj").val(this['numAnbarArea']);
                            }

                            $("#drpdwnTransportKind").val(this["numTransporterKind"]);
                            getInfoTransport();
                            if ((arrayorg.indexOf("15") > -1 || arrayorg.indexOf("17") > -1) && $("#drpdwnTransportKind").val() != "0") {
                                $("#txtTransporterName").val(this["strOwnerName"]);
                                $("#txtTransportModel").val(this["strModel"]);
                                $("#txtTransportColor").val(this["strColor"]);
                                $("#txtTransportShahrbani").val(this["strNumShahrbani"]);
                                $("#txtTransportShasi").val(this["strNumShasi"]);
                                $("#txtTransportBadaneh").val(this["strNumBody"]);
                            }

                            if (parseInt(this['numPricePorsantToziShode']) > 0 || parseInt(this['numPricePorsantKharejMahdode']) > 0 || parseInt(this['numPricePorsantMoadeli']) > 0) {
                                $("#drpdwnpricePorsant").val("1");
                            }
                            else {
                                $("#drpdwnpricePorsant").val("0");
                            }
                            GetChangePorsant();

                            $("#txtPorsantToziShode").val(addCommas(this['numPricePorsantToziShode']));
                            $("#txtPorsantKharejMahdode").val(addCommas(this['numPricePorsantKharejMahdode']));
                            $("#txtPorsantMoadeli").val(addCommas(this['numPricePorsantMoadeli']));


                            $("#drpdwnZemanatKind").val(this['strZemanatType']);
                            $("#drpdwnZemanatKind").multiselect('refresh');
                            getInfoZemanat(1);

                            var array = this['strZemanatType'].split(',');

                            for (var j = 0; j <= array.length; j++) {
                                if (array[j] == "1") {
                                    $("#txtPriceZemanatNameh").val(this['numZemanatPrice']);

                                }
                                else if (array[j] == "2") {
                                    $("#txtCountZemanatcheck").val(this['numCountZemanatCheck']);
                                    createZemanatInfocheck();
                                    if (parseInt(this['numCountZemanatCheck']) > 0) {
                                        var price = 0;
                                        var info = this['strZemanatAllInfoCheck'].split(',');
                                        for (var i = 0; i <= (parseInt(this['numCountZemanatCheck']) - 1) ; i++) {
                                            var zemanat = info[i].split('^');
                                            $("#txtNumbercheck" + (i + 1).toString()).val(zemanat[0].trim());
                                            $("#txtPricecheck" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                        }
                                    }
                                }
                                else if (array[j] == "3") {
                                    $("#txtCountZemanatSafte").val(this['numCountZemanatSafteh']);
                                    createZemanatInfo();
                                    if (parseInt(this['numCountZemanatSafteh']) > 0) {
                                        var price = 0;
                                        var info = this['strZemanatAllInfoSafteh'].split(',');
                                        for (var i = 0; i <= (parseInt(this['numCountZemanatSafteh']) - 1) ; i++) {
                                            var zemanat = info[i].split('^');
                                            $("#txtNumberSafte" + (i + 1).toString()).val(zemanat[0].trim());
                                            $("#txtPriceSafte" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                        }
                                    }
                                }
                            }


                        }

                    }
                    //==========================================================================================
                    childsalary = this['numPersonelChildSalary'];
                    if (childsalary != 0) {
                        if (Math.round(this['numPersonelChildSalary'] / 0.2) == this['numPersonelSalary'])
                            childsalary = 2;
                        else childsalary = 1;
                    }
                    //=========================================================================
                    GetKolDaramad();
                }
                else if (contractKind == "2" || contractKind == "3") {
                    if (this["numContractKindRef"] == contractKind) {
                        $("#drpdwnSaatiPriceEndKind").val(this['numEndOfKind']);

                        if (contractKind == "3") {
                            $("#txtSaatiPriceContract").val(addCommas(this['numPersonelSalary']));
                            $("#txtSaatiPriceHaghMasoliat").val(addCommas(this['numPriceHaghModiriat']));
                            $("#txtProjectAyabZahab").val(addCommas(this['numPriceAyabZahab']));
                            $("#txtProjectPadashAmalkard").val(addCommas(this['numPersonelPadash']));

                            //var pricepadash = this['numPersonelPadash'];
                            //if (pricepadash != null && parseInt(pricepadash) > 0) {
                            //    $("#drpdwnSaatiPricePadashAvilable").val(1);
                            //    GetChangePadashSaati();
                            //    $("#txtSaatiTitlePadashContract").val(this['strTitleFaraiand']);
                            //    $("#txtSaatiPricePadashContract").val(addCommas(pricepadash));

                            //}
                            //else {
                            //    $("#drpdwnSaatiPricePadashAvilable").val(0);
                            //    GetChangePadashSaati();
                            //    $("#txtSaatiTitlePadashContract").val("");
                            //    $("#txtSaatiPricePadashContract").val("");
                            //}

                            if (contractState == "2") {
                                var arrayorg = this['chartposition'].split(',');
                                $("#drpdwnorgposition").val(arrayorg);
                                $("#drpdwnorgposition").multiselect('refresh');
                                showitemorgposition(2);

                                if (arrayorg.indexOf("15") > -1) {
                                    if (parseInt(this['numPriceJariEjareh']) > 0 || parseInt(this['numPriceJariTel']) > 0 || parseInt(this['numPriceJariNet']) > 0 || parseInt(this['numPriceJariAbogaz']) > 0) {
                                        $("#drpdwnSaatipricejari").val("1");
                                    }
                                    else {
                                        $("#drpdwnSaatipricejari").val("0");
                                    }
                                    GetChangeSaatiHazineJari();

                                    $("#txtSaatijariEjareh").val(addCommas(this['numPriceJariEjareh']));
                                    $("#txtSaatijariTel").val(addCommas(this['numPriceJariTel']));
                                    $("#txtSaatijariNet").val(addCommas(this['numPriceJariNet']));
                                    $("#txtSaatijariAbogaz").val(addCommas(this['numPriceJariAbogaz']));

                                    $("#txtSaatiAgantMetraj").val(this['numAgentArea']);
                                    $("#txtSaatiAnbarMetraj").val(this['numAnbarArea']);
                                }

                                $("#drpdwnSaatiTransportKind").val(this["numTransporterKind"]);
                                getInfoTransportSaati();
                                if ((arrayorg.indexOf("15") > -1 || arrayorg.indexOf("17") > -1) && $("#drpdwnSaatiTransportKind").val() != "0") {
                                    $("#txtSaatiTransporterName").val(this["strOwnerName"]);
                                    $("#txtSaatiTransportModel").val(this["strModel"]);
                                    $("#txtSaatiTransportColor").val(this["strColor"]);
                                    $("#txtSaatiTransportShahrbani").val(this["strNumShahrbani"]);
                                    $("#txtSaatiTransportShasi").val(this["strNumShasi"]);
                                    $("#txtSaatiTransportBadaneh").val(this["strNumBody"]);
                                }

                                if (parseInt(this['numPricePorsantToziShode']) > 0 || parseInt(this['numPricePorsantKharejMahdode']) > 0 || parseInt(this['numPricePorsantMoadeli']) > 0) {
                                    $("#drpdwnSaatipricePorsant").val("1");
                                }
                                else {
                                    $("#drpdwnSaatipricePorsant").val("0");
                                }
                                GetChangeSaatiPorsant();

                                $("#txtSaatiPorsantToziShode").val(addCommas(this['numPricePorsantToziShode']));
                                $("#txtSaatiPorsantKharejMahdode").val(addCommas(this['numPricePorsantKharejMahdode']));
                                $("#txtSaatiPorsantMoadeli").val(addCommas(this['numPricePorsantMoadeli']));


                                $("#drpdwnSaatiZemanatKind").val(this['strZemanatType']);
                                $("#drpdwnSaatiZemanatKind").multiselect('refresh');
                                getInfoZemanatSaati(1);

                                var array = this['strZemanatType'].split(',');

                                for (var j = 0; j <= array.length; j++) {
                                    if (array[j] == "1") {
                                        $("#txtSaatiPriceZemanatNameh").val(this['numZemanatPrice']);

                                    }
                                    else if (array[j] == "2") {
                                        $("#txtSaatiCountZemanatcheck").val(this['numCountZemanatCheck']);
                                        createZemanatInfocheckSaati();
                                        if (parseInt(this['numCountZemanatCheck']) > 0) {
                                            var price = 0;
                                            var info = this['strZemanatAllInfoCheck'].split(',');
                                            for (var i = 0; i <= (parseInt(this['numCountZemanatCheck']) - 1) ; i++) {
                                                var zemanat = info[i].split('^');
                                                $("#txtSaatiNumbercheck" + (i + 1).toString()).val(zemanat[0].trim());
                                                $("#txtSaatiPricecheck" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                            }
                                        }
                                    }
                                    else if (array[j] == "3") {
                                        $("#txtSaatiCountZemanatSafte").val(this['numCountZemanatSafteh']);
                                        createZemanatInfoSaati();
                                        if (parseInt(this['numCountZemanatSafteh']) > 0) {
                                            var price = 0;
                                            var info = this['strZemanatAllInfoSafteh'].split(',');
                                            for (var i = 0; i <= (parseInt(this['numCountZemanatSafteh']) - 1) ; i++) {
                                                var zemanat = info[i].split('^');
                                                $("#txtSaatiNumberSafte" + (i + 1).toString()).val(zemanat[0].trim());
                                                $("#txtSaatiPriceSafte" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                            }
                                        }
                                    }
                                }
                            }

                            $(".trPriceSaati").hide();
                            $("#trPriceproject,#trPriceproject1").show();

                            if (contractState == "2") {
                                if ($("#drpdwnorgposition").val() == "-1" || $("#drpdwnorgposition").val() == null || $("#drpdwnorgposition").val() == undefined)
                                    showitemorgposition(1);

                                else
                                    $(".trPriceproject1").show();
                            }
                            else $(".trPriceproject1").hide();
                        }
                        else {
                            $("#tdSalaryMainsaati").html(addCommas(salaryMain) + " ریال");

                            $("#txtSaatiPriceSalary").val(addCommas(this['numPersonelSalary']));

                            $("#txtSaatiPriceHomeSalary").val(addCommas(this['numPersonelHomeSalary']));
                            $("#txtSaatiPriceBon").val(addCommas(this['numPersonelBon']));
                            $("#txtSaatiPriceChildSalary").val(addCommas(this['numPersonelChildSalary']));
                            $("#txtSaatiPriceSanavat").val(addCommas(this['numPersonelSanavat']));
                            $("#txtSaatiPriceEydi").val(addCommas(this['numPriceEidi']));
                            $("#txtSaatiPriceMorakhasi").val(addCommas(this['numPriceLeave']));
                            $("#txtSaatiPriceContract2").val(addCommas(this['numPersonelPadash']));

                            $("#txtSaatiAyabZahab").val(addCommas(this['numPriceAyabZahab']));
                            GetKolDaramadsaati();

                            $(".trPriceSaati").show();
                            if (contractState == "2") {
                                if ($("#drpdwnorgposition").val() == "-1" || $("#drpdwnorgposition").val() == null || $("#drpdwnorgposition").val() == undefined)
                                    showitemorgposition(1);

                                else
                                    $(".trPriceproject1").show();

                            }
                            else $(".trPriceproject1").hide();
                            $("#trPriceproject,#trPriceproject1").hide();

                            //==========================================================================================
                            childsalary = this['numPersonelChildSalary'];
                            if (childsalary != 0) {
                                if (Math.round(this['numPersonelChildSalary'] / 0.2) == this['numPersonelSalary'])
                                    childsalary = 2;
                                else childsalary = 1;
                            }
                            //=========================================================================
                            GetKolDaramadsaati();
                        }
                    }
                }

            });
            //=========================================================================
            $.each(PersonelReContractInfo, function (index) {
                $("#drpdwnEmployer").val(this['numEmployerRef']);
                if (contractKind == 1) {
                    $("#txtName").val(this['strPersonelName']);
                    $("#txtFamily").val(this['strPersonelFamily']);
                    $("#txtFatherName").val(this['strFatherName']);
                    $("#txtMelliCode").val(this['strMelliCode']);
                    $("#txtNumberShenasname").val(this['strNumberShenasname']);
                    $("#pcaldateBrithdayDate").val(this['dateBrithdayDate']);
                    $("#txtExportCityRef").val(this['strExportCityRef']);
                    $("#drpdwnMarrid").val(this['numMarridRef']);
                    showChildInfo();
                    $("#drpdwnCntChild").val(childsalary);

                    GetHaghOladFromHoghogh();
                    GetKolDaramad();

                    $("#drpdwnProvince").val(this['strWorkProvinceRef']);
                    ShowDrpDwnInRegisterPage(2);
                    ShowDrpDwnInRegisterPage(4);
                    $("#drpdwnAgentMovaghat").val(this['agentcode']);

                    $("#drpdwnCity").val(this['strWorkCityRef']);
                    $("#txtPersonelAddress").val(this['strPersonelAddress']);
                    $("#txtPostCode").val(this['strPostCode']);
                    $("#txtTel1").val(this['strTel'].split('-')[0]);
                    $("#txtTel").val(this['strTel'].split('-')[1]);
                    $("#txtMobile").val(this['strMobile']);
                    $("#drpdwnJensiat").val(this['numJensiatRef']);
                    $("#drpdwnOwner").val(this['numPerosnelCharacter']);
                    GetInfoOwner();
                    if (this['numPerosnelCharacter'] == "2") {
                        $("#txtCompayName").val(this['strCompanyName']);
                        $("#txtShomaresabt").val(this['strCompanyRegNumber']);
                        $("#drpdwnCompanyKind").val(this['numCompanyType']);
                        $("#drpdwnSematInCompany").val(this['numSematInCompany']);
                    }

                }
                else if (contractKind == "2" || contractKind == "3") {
                    $("#txtSaatiName").val(this['strPersonelName']);
                    $("#txtSaatiFamily").val(this['strPersonelFamily']);
                    $("#txtSaatiFatherName").val(this['strFatherName']);
                    $("#txtSaatiMelliCode").val(this['strMelliCode']);
                    $("#txtSaatiNumberShenasname").val(this['strNumberShenasname']);
                    $("#txtSaatiExportCityRef").val(this['strExportCityRef']);
                    $("#txtSaatiPersonelAddress").val(this['strPersonelAddress']);
                    $("#SaatidrpdwnJensiat").val(this['numJensiatRef']);
                    $("#txtSaatiTel1").val(this['strTel'].split('-')[0]);
                    $("#txtSaatiTel").val(this['strTel'].split('-')[1]);
                    $("#txtSaatiMobile").val(this['strMobile']);

                    $("#drpdwnSaatiOwner").val(this['numPerosnelCharacter']);
                    GetInfoOwnerSaati();
                    if (this['numPerosnelCharacter'] == "2") {
                        $("#txtSaatiCompayName").val(this['strCompanyName']);
                        $("#txtSaatiShomaresabt").val(this['strCompanyRegNumber']);
                        $("#drpdwnSaatiCompanyKind").val(this['numCompanyType']);
                        $("#drpdwnSaatiSematInCompany").val(this['numSematInCompany']);
                    }


                    $("#drpdwnProvinceSaati").val(this['strWorkProvinceRef']);
                    ShowDrpDwnInRegisterPage(3);
                    $("#drpdwnCitySaati").val(this['strWorkCityRef']);

                    if (contractKind == "3") {
                        ShowDrpDwnInRegisterPage(5);
                        $("#drpdwnAgentProject").val(this['agentcode']);
                    }

                    if (contractKind == "2") {
                        $("#drpdwnsaatiMarrid").val(this['numMarridRef']);
                        showChildInfosaati();
                        $("#drpdwnsaatiCntChild").val(childsalary);

                        GetHaghOladFromHoghoghsaati();
                        GetKolDaramadsaati();
                    }
                }
            });
            //=========================================================================
            $.each(MorefReContractInfo, function (index) {
                if (contractKind == 1) {
                    if (this['strReagentName'] == undefined || this['strReagentName'] == null || this['strReagentName'] == "") {
                        $("#drpdwnMoaref").val(0);
                        GetMoarefInfo();
                    }
                    else {
                        $("#drpdwnMoaref").val(1);
                        GetMoarefInfo();
                        $("#txtMoarefName").val(this['strReagentName']);
                        $("#txtMoarefFamily").val(this['strReagentFamily']);
                        $("#txtMoarefTel1").val(this['strReagentTel'].split('-')[0]);
                        $("#txtMoarefTel").val(this['strReagentTel'].split('-')[1]);
                        $("#txtMoarefMobile").val(this['strReagentMobile']);
                        $("#txtMoarefNesbat").val(this['strReagentRelation']);
                        $("#txtMoarefAddress").val(this['strReagentAddress']);
                    }
                }

            });

            //=========================================================================
            $('input[type=text], textarea').each(function () {
                if ($(this).val() == "null") $(this).val('');
            });
        }
    }
}
//---------------------------------------------------------------------------------
///============= گزارش اطلاعات پرسنل برای بارگزاری قرارداد ======================
//---------------------------------------------------------------------------------
var contractFileRow = 0;
function GetReportInfoPersonelContract(vpage) {
    contractFileRow = 0;

    var name = $.trim($("#txtReportPersonelNameContract").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCodeContract").val());
    var Employer = $.trim($("#drpdwnSearchEmployerContract").val());
    var ContractKind = $.trim($("#drpdwnSearchContractKindContract").val());
    var ContractState = $.trim($("#drpdwnSearchContractStateContract").val());

    var header = "<table id='tableFileContract' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var headerTitle = "<thead><tr><th colspan='15' align='right'><input id='btnPrintAllContract' type='button' value='پرینت دسته ای' onclick='PrintAllContractFile();'/></th></tr></thead>";
    //var header2 = "<thead><tr><th><input type='checkbox' id='chkAllFileContract' onclick='CheckPrintContractFile(1);'/></th><th align='center' width='50px'>ردیف</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th>کارفرما</th><th>نوع قرارداد</th><th>شماره قرارداد</th><th>تاریخ ثبت</th><th>پرینت</th><th>بارگذاری</th><th></th></thead><tbody>";
    //var mainrow = "<tr id='trRowFileContract{mellicode}'><td>{check}</td><td>{Row}</td><td>{name}</td><td>{fathername}</td><td id='tdCodeMelliFileUpload{Row}'>{mellicode}</td><td>{employer}</td><td>{contract}</td><td>{numbercontract}</td><td>{dateRegister}</td><td>{action}</td><td style='width:186px;'>{action1}</td><td style='width:45px;'>{action2}</td></tr>";
    var header2 = "<thead><tr><th style='display:none;'></th><th><input type='checkbox' id='chkAllFileContract' onclick='CheckPrintContractFile(1);'/></th><th align='center' width='50px'>ردیف</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th>کارفرما</th><th>نوع قرارداد</th><th>حالت قرارداد</th><th>شماره قرارداد</th><th>تاریخ ثبت</th><th>پرینت</th><th>تایید نهایی</th><th></th></thead><tbody>";
    var mainrow = "<tr id='trRowFileContract{mellicode}'><td  style='display:none;' id='tdcontractCodeFileUpload{Row}'>{contractCode}</td><td>{check}</td><td>{Row}</td><td>{name}</td><td>{fathername}</td><td id='tdCodeMelliFileUpload{Row}'>{mellicode}</td><td>{employer}</td><td>{contract}</td><td>{contractstate}</td><td>{numbercontract}</td><td>{dateRegister}</td><td>{action}</td><td>{action1}</td><td style='width:45px;'>{action2}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportInfoPersonelContract(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelContract' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportInfoPersonelContract({lastpage})'>" +
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
        data: { i: 4, Employer: Employer, ContractState: ContractState, ContractKind: ContractKind, name: name, mellicode: mellicode, page: vpage, perpage: vperpage },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{fathername}", this['strFatherName'] == null || this['strFatherName'] == undefined ? "--" : this['strFatherName']);
                // row = row.replaceAll("{shsh}", this['strNumberShenasname']);
                row = row.replaceAll("{dateRegister}", $.trim(this['dateRegisterDate']));
                row = row.replaceAll("{employer}", $.trim(this['strEmployerName']));
                row = row.replaceAll("{contract}", $.trim(this['strContractKindName']));
                row = row.replaceAll("{contractstate}", $.trim(this['strContractStateName']));

                row = row.replaceAll("{numbercontract}", $.trim(this['StrContractUniqCode']));
                row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' href='PeikFactor.aspx?ofc={contractCode}' target='_blank'><img src='images/REprint.png' style='width:23px;'/></a></div>");
                row = row.replaceAll("{action1}", this['isPeik'] == 1 ? "<font style='color:red;'>با تایید نمایندگی</font>" : "<div id='divContractFile{mellicode}' ><input id='btnSaveContractFile{mellicode}' type='button'  value='تایید نهایی' onclick='SaveContractFileFinal(\"{mellicode}\",\"{name}\",\"loadingContractFile{mellicode}\");'/></div><div id='loadingContractFile{mellicode}' style='display:none;'></div>");
                //row = row.replaceAll("{action1}", "<div style='float:right;width:76%;'><div class='custom_file_upload' style='margin-right: 61px;margin-top:0px;width:58%;'>" +
                //                                  "<input type='text' class='file' name='file_info' id='txtUpImagePersonel{mellicode}' disabled='disabled' style='width:77px !important;'/>" +
                //                                  "<div class='file_upload' style='width:57px !important;'>" +
                //                                  "<input id='uploadFileImagePersonel{mellicode}' type='file' onchange='changeValueUpFile(\"txtUpImagePersonel{mellicode}\",\"uploadFileImagePersonel{mellicode}\");' /></div></div></div>" +
                //                                  "<div id='divContractFile{mellicode}' style='float:right; width:24%;'><input id='btnSaveContractFile{mellicode}' type='button' style='width:42px;' value='ثبت' onclick='SaveContractFile(\"{mellicode}\",\"txtUpImagePersonel{mellicode}\",\"uploadFileImagePersonel{mellicode}\", \"loadingContractFile{mellicode}\");'/></div><div id='loadingContractFile{mellicode}' style='float:right; width:24%;display:none;'><div>");
                row = row.replaceAll("{action2}", this['isPeik'] == 1 ? "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditPersonelCode(\"{mellicode}\",{contractCode},1);'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'></div>" : "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditPersonelCode(\"{mellicode}\",{contractCode},1);'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeletePersonelCode(\"{mellicode}\",{contractCode});'><img src='images/delete.png' /></a></div>");
                row = row.replaceAll("{check}", "<input type='checkbox' id='chkOneContractFile{Row}' onclick='CheckPrintContractFile(2,{Row});'/>");
                row = row.replaceAll("{Row}", i);
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{mellicode}", $.trim(this['strMelliCode']));
                row = row.replaceAll("{contractCode}", $.trim(this['numContractCode']));


                //S = this['numStatus'];
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                contractFileRow = i - 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportInfoPersonelContract(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportInfoPersonelContract(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivPersonelContract").html(header + headerTitle + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonelContract").html(allpage);
                $("#ResultDivPersonelContract").show();
                $("#tableFileContract :button").button();
            }
            else {
                $("#ResultDivPersonelContract").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#ResultDivPersonelContract").show();

            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelContract").html("");
            $("#ResultDivPersonelContract").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//=========================================================================================
//=========================================حذف پرسنل======================================
//=========================================================================================
function DeletePersonelCode(mellicode, contractcode) {
    $("#Note").html("آیا از حذف این پرسنل اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "حذف پرسنل",
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
                    data: { i: 7, mellicode: mellicode, contractcode: contractcode },
                    url: "PostBack/PBContract.ashx",
                    success: function (data) {

                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            $("#trRowFileContract" + mellicode).remove();
                            ShowAlert("اطلاعات پرسنل با موفقیت  حذف شد");

                            GetAllPeikNew(1);
                        }
                        else if (data == "2") {
                            ShowAlert("اطلاعات این پرسنل یافت نشد!");
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
//=========================================================================================
//=========================================================================================
function changeValueUpFile(txtName, upfilename) {
    $("#" + txtName).val($("#" + upfilename).val());
}
//=========================================================================================
//==========================================ثبت نهایی قرارداد========================
//=========================================================================================
function SaveContractFileFinal(mellicode, name, loading) {

    $("#Note").html("آیا از تایید قرارداد این پرسنل (" + name + ") اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "تایید نهایی پرسنل",
        width: 350,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {

                $("#" + loading).html("<img src='images/loading.gif'/>");
                $("#" + loading).show();
                $("#divContractFile" + mellicode).hide();

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 9, mellicode: mellicode },
                    url: "PostBack/PBContract.ashx",
                    success: function (data) {
                        var arrayResult = data.split('^');
                        if (arrayResult[0] == "1") {
                            $("#trRowFileContract" + mellicode).remove();
                            ShowAlert("پرسنل جدید در سیستم تایید شد.<br/> کد پرسنلی ایجاد شده : " + arrayResult[1]);
                            if ($.trim($("#ResultDivPersonel").html()) != "") GetReportInfoPersonel(1);
                        }
                        else if (data == "2") {
                            $("#trRowFileContract" + mellicode).remove();
                            ShowAlert("قرارداد همکاری مجدد پرسنل در سیستم تایید شد.");
                            if ($.trim($("#ResultDivPersonel").html()) != "") GetReportInfoPersonel(1);
                        }
                        else if (data == "3") {
                            $("#trRowFileContract" + mellicode).remove();
                            ShowAlert("مشخصات این پرسنل یافت نشد!");
                        }
                        else if (data == "4") {
                            $("#" + loading).html("");
                            $("#" + loading).hide();
                            $("#divContractFile" + mellicode).show();
                            ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $("#" + loading).html("");
                        $("#" + loading).hide();
                        $("#divContractFile" + mellicode).show();
                        ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                    }
                });
                $(this).dialog("close");
            }
        }
    });
    $("#Note").dialog("open");
}
//=========================================================================================
//==========================================بارگزاری فایل قرارداد========================
//=========================================================================================
function SaveContractFile(melliCode, txtName, upfilename, loading) {
    if (($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null)) {

        var fd = new FormData();
        if ($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null) {
            fd.append("UpFile", document.getElementById(upfilename).files[0]);
            fd.append("i", 5);
            fd.append("melliCode", melliCode);
        }

        if ($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null) {
            $("#" + loading).html("<img src='images/loading.gif'/>");
            $("#" + loading).show();
            $("#divContractFile" + melliCode).hide();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                processData: false,
                contentType: false,
                dataType: "json",
                data: fd,
                url: "PostBack/PBContract.ashx",
                success: function (data) {
                    var arrayResult = data.split('^');
                    if (arrayResult[0] == "1") {
                        $("#trRowFileContract" + melliCode).remove();
                        ShowAlert("فایل قرارداد با موفقیت آپلود شد.<br/> و کد پرسنلی ایجاد شده : " + arrayResult[1]);
                        if ($.trim($("#ResultDivPersonel").html()) != "") GetReportInfoPersonel(1);
                    }
                    else if (data == "2") {
                        ShowAlert("فرمت عکس ارسالی اشتباه می باشد!");
                    }
                    else if (data == "3") {
                        $("#trRowFileContract" + melliCode).remove();
                        ShowAlert("مشخصات این پرسنل یافت نشد!");
                    }
                    else if (data == "4") {
                        $("#" + loading).html("");
                        $("#" + loading).hide();
                        $("#divContractFile" + melliCode).show();

                        ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#" + loading).html("");
                    $("#" + loading).hide();
                    $("#divContractFile" + melliCode).show();
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                }
            });
        }
    }
    else {

        ShowAlert("ابتدا تصویر مورد نظر را بارگزاری نمایید!");
    }
}
//=========================================================================================
//============================================چک مارک کلی یا تکی==========================
//=========================================================================================
function CheckPrintContractFile(type, row) {
    if (type == 1) {
        for (var i = 1; i <= contractFileRow; i++) {
            if ($("#chkAllFileContract").attr("checked"))
                $("#chkOneContractFile" + i).attr("checked", "checked");
            else
                $("#chkOneContractFile" + i).removeAttr("checked");
        }
    }
    else if (type == 2) {
        $("#chkAllFileContract").removeAttr("checked");
    }
}
//----------------------------------------------------------------------------
//--------------------------------------پرینت دسته ای قرارداد---------------
//----------------------------------------------------------------------------
function PrintAllContractFile() {
    // "<a style='cursor:pointer;display:block;' href='PeikFactor.aspx?ofc={mellicode}' target='_blank'>"
    var contractcode = "";
    //alert(contractFileRow);
    for (var i = 1; i <= contractFileRow; i++) {
        if ($("#chkOneContractFile" + i).attr("checked"))
            contractcode = contractcode + $.trim($("#tdcontractCodeFileUpload" + i).html()) + ",";
    }
    if (contractcode != "") {
        window.open('PeikFactor.aspx?ofc=' + contractcode, '_blank');
    }
}
//----------------------------------------------------------------------------
//--------------------------------------ویرایش اطلاعات قرارداد---------------
//----------------------------------------------------------------------------
var contractcodeForEditPublic = 0;
function EditPersonelCode(mellicode, contractCode, type) {
    contractcodeForEditPublic = contractCode;
    if (type == 1)  // ویرایش اطلاعات
    {
        $("#Note").html("آیا از ویرایش اطلاعات این پرسنل اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "ویرایش اطلاعات پرسنل",
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

                    GetInfoEditContract(mellicode, contractCode, type);

                    $(this).dialog("close");
                }
            }
        });
        $("#Note").dialog("open");
    }
    else if (type == 2) // خوانده شدن اطلاعات و نمایش
    {
        GetInfoEditContract(mellicode, contractCode, type);
    }
}
//----------------------------------------------------------------------------
//----------------------------دریافت اطلاعات ویرایش---------------------------
//----------------------------------------------------------------------------
function GetInfoEditContract(mellicode, contractCode, type) {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 8, mellicode: mellicode, contractCode: contractCode, type: type },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
            if (data == "2") {
                ShowAlert("اطلاعاتی از این پرسنل یافت نشد!");
                $("#trRowFileContract" + mellicode).remove();
            }
            else {
                var contractKind = 0, contractState = 0;
                var cntchild = 0;
                var childsalary = 0;
                $.each(data[0], function (index) {
                    $("#drpdwnEmployer").val(this['numEmployerRef']);
                });

                $.each(data[1], function (index) {
                    //=========================================================================
                    if (this['numContractKindRef'] == "1") {
                        $("#drpdwnContractKind").val(this['numContractKindRef']);
                        $("#drpdwnStateContractkind").val(this['numContractStateRef']);

                        GetInfoByContractKind(1);
                        contractKind = this['numContractKindRef'];
                        contractState = this['numContractStateRef'];

                        //=========================================================================
                        $("#pcaldateContractFromDate").val(this['dateStartContractDate']);
                        $("#pcaldateContractToDate").val(this['dateEndContractDate']);
                        $("#pcaldateContractUnValidDate").val(this['dateUnvalidContractDate']);
                        $("#txtHoghogheSabet").val(addCommas(this['numPersonelSalary']));
                        $("#txtHaghMaskan").val(addCommas(this['numPersonelHomeSalary']));
                        $("#txtBonKharbar").val(addCommas(this['numPersonelBon']));
                        $("#txtPadashAmalkard").val(addCommas(this['numPersonelPadash']));
                        $("#txtSaier").val(addCommas(this['numPersonelSaier']));
                        $("#txtHaghMasoliatSaier").val(addCommas(this['numPriceHaghModiriat']));
                        $("#txtAyabZahab").val(addCommas(this['numPriceAyabZahab']));

                        $("#txtSanavat").val(addCommas(this['numPersonelSanavat']));
                        $("#txtHaghOlad").val(addCommas(this['numPersonelChildSalary']));

                        //----------------------------
                        if (contractState == "2") {

                            var arrayorg = this['chartposition'].split(',');
                            $("#drpdwnorgpositionMovaghat").val(arrayorg);
                            $("#drpdwnorgpositionMovaghat").multiselect('refresh');
                            showitemorgpositionMovaghat(2);

                            if (arrayorg.indexOf("15") > -1) {

                                if (parseInt(this['numPriceJariEjareh']) > 0 || parseInt(this['numPriceJariTel']) > 0 || parseInt(this['numPriceJariNet']) > 0 || parseInt(this['numPriceJariAbogaz']) > 0) {
                                    $("#drpdwnpricejari").val("1");
                                }
                                else {
                                    $("#drpdwnpricejari").val("0");
                                }
                                GetChangeHazineJari();

                                $("#txtjariEjareh").val(addCommas(this['numPriceJariEjareh']));
                                $("#txtjariTel").val(addCommas(this['numPriceJariTel']));
                                $("#txtjariNet").val(addCommas(this['numPriceJariNet']));
                                $("#txtjariAbogaz").val(addCommas(this['numPriceJariAbogaz']));

                                $("#txtAgantMetraj").val(addCommas(this['numAgentArea']));
                                $("#txtAnbarMetraj").val(addCommas(this['numAnbarArea']));
                            }

                            $("#drpdwnTransportKind").val(this["numTransporterKind"]);
                            getInfoTransport();
                            if ((arrayorg.indexOf("15") > -1 || arrayorg.indexOf("17") > -1) && $("#drpdwnTransportKind").val() != "0") {
                                $("#txtTransporterName").val(this["strOwnerName"]);
                                $("#txtTransportModel").val(this["strModel"]);
                                $("#txtTransportColor").val(this["strColor"]);
                                $("#txtTransportShahrbani").val(this["strNumShahrbani"]);
                                $("#txtTransportShasi").val(this["strNumShasi"]);
                                $("#txtTransportBadaneh").val(this["strNumBody"]);
                            }

                            if (parseInt(this['numPricePorsantToziShode']) > 0 || parseInt(this['numPricePorsantKharejMahdode']) > 0 || parseInt(this['numPricePorsantMoadeli']) > 0) {
                                $("#drpdwnpricePorsant").val("1");
                            }
                            else {
                                $("#drpdwnpricePorsant").val("0");
                            }
                            GetChangePorsant();

                            $("#txtPorsantToziShode").val(addCommas(this['numPricePorsantToziShode']));
                            $("#txtPorsantKharejMahdode").val(addCommas(this['numPricePorsantKharejMahdode']));
                            $("#txtPorsantMoadeli").val(addCommas(this['numPricePorsantMoadeli']));


                            var array = this['strZemanatType'].split(',');
                            $("#drpdwnZemanatKind").val(array);
                            $("#drpdwnZemanatKind").multiselect('refresh');
                            getInfoZemanat(1);

                            for (var j = 0; j <= array.length; j++) {
                                if (array[j] == "1") {
                                    $("#txtPriceZemanatNameh").val(addCommas(this['numZemanatPrice']));
                                }
                                else if (array[j] == "2") {
                                    $("#txtCountZemanatcheck").val(addCommas(this['numCountZemanatCheck']));
                                    createZemanatInfocheck();
                                    if (parseInt(this['numCountZemanatCheck']) > 0) {
                                        var price = 0;
                                        var info = this['strZemanatAllInfoCheck'].split(',');
                                        for (var i = 0; i <= (parseInt(this['numCountZemanatCheck']) - 1) ; i++) {
                                            var zemanat = info[i].split('^');
                                            $("#txtNumbercheck" + (i + 1).toString()).val(zemanat[0].trim());
                                            $("#txtPricecheck" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                        }
                                    }
                                }
                                else if (array[j] == "3") {
                                    $("#txtCountZemanatSafte").val(addCommas(this['numCountZemanatSafteh']));
                                    createZemanatInfo();
                                    if (parseInt(this['numCountZemanatSafteh']) > 0) {
                                        var price = 0;
                                        var info = this['strZemanatAllInfoSafteh'].split(',');
                                        for (var i = 0; i <= (parseInt(this['numCountZemanatSafteh']) - 1) ; i++) {
                                            var zemanat = info[i].split('^');
                                            $("#txtNumberSafte" + (i + 1).toString()).val(zemanat[0].trim());
                                            $("#txtPriceSafte" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                        }
                                    }
                                }
                            }
                        }
                        //----------------------------
                        $("#txtContractMonth").val(this['strContractMonth']);
                        $("#txtContractDay").val(this['strContractDay']);

                        if (this['dateDoreFromDate'] == undefined || this['dateDoreFromDate'] == null || this['dateDoreFromDate'] == "") {
                            $("#drpdwnDoreAzmaieshi").val(0);
                            GetInfoDoreAzmaieshi();
                            $("#pcaldateDoreFromDate").val("");
                            $("#pcaldateCDoreToDate").val("");
                        }
                        else {
                            $("#drpdwnDoreAzmaieshi").val(1);
                            GetInfoDoreAzmaieshi();
                            $("#pcaldateDoreFromDate").val(this['dateDoreFromDate']);
                            $("#pcaldateCDoreToDate").val(this['dateDoreToDate']);
                        }


                        //=========================================================================
                        childsalary = this['numPersonelChildSalary'];
                        if (childsalary != 0) {
                            if (Math.round(this['numPersonelChildSalary'] / 0.2) == this['numPersonelSalary'])
                                childsalary = 2;
                            else childsalary = 1;
                        }
                        //=========================================================================
                    }
                    else if (this['numContractKindRef'] == "2" || this['numContractKindRef'] == "3") {
                        $("#drpdwnContractKind").val(this['numContractKindRef']);
                        $("#drpdwnStateContractkind").val(this['numContractStateRef']);

                        GetInfoByContractKind(1);
                        contractKind = this['numContractKindRef'];
                        contractState = this['numContractStateRef'];

                        //=========================================================================
                        $("#txtSaatiKhadamat").val(this['strKhadamatDescription']);
                        $("#txtSaatiContractMonth").val(this['strContractMonth']);
                        $("#txtSaatiContractDay").val(this['strContractDay']);
                        $("#pcalSaatidateContractFromDate").val(this['dateStartContractDate']);
                        $("#pcalSaatidateContractToDate").val(this['dateEndContractDate']);
                        $("#pcalSaatidateContractTavafoghDate").val(this['dateRegisterContractDate']);
                        var karkardtime = this['StrKarKardTime'];
                        $("#txtSaatiContractTime").val(karkardtime.split('-')[0]);
                        $("#drpdwnTimeForMonth").val(karkardtime.split('-')[1]);
                        $("#drpdwnWeekForMonth").val(karkardtime.split('-')[2]);
                        $("#drpdwnSaatiPriceEndKind").val(this['numEndOfKind']);

                        if (this['numContractKindRef'] == "3") {
                            $("#txtSaatiPriceContract").val(addCommas(this['numPersonelSalary']));
                            $("#txtSaatiPriceHaghMasoliat").val(addCommas(this['numPriceHaghModiriat']));
                            $("#txtProjectAyabZahab").val(addCommas(this['numPriceAyabZahab']));
                            $("#txtProjectPadashAmalkard").val(addCommas(this['numPersonelPadash']));
                            //var pricepadash = this['numPersonelPadash'];
                            //if (pricepadash != null && parseInt(pricepadash) > 0) {
                            //    $("#drpdwnSaatiPricePadashAvilable").val(1);
                            //    GetChangePadashSaati();
                            //    $("#txtSaatiTitlePadashContract").val(this['strTitleFaraiand']);
                            //    $("#txtSaatiPricePadashContract").val(addCommas(pricepadash));

                            //}
                            //else {
                            //    $("#drpdwnSaatiPricePadashAvilable").val(0);
                            //    GetChangePadashSaati();
                            //    $("#txtSaatiTitlePadashContract").val("");
                            //    $("#txtSaatiPricePadashContract").val("");
                            //}
                            //----------------------------
                            if (contractState == "2") {

                                var arrayorg = this['chartposition'].split(',');
                                $("#drpdwnorgposition").val(arrayorg);
                                $("#drpdwnorgposition").multiselect('refresh');
                                showitemorgposition(2);

                                if (arrayorg.indexOf("15") > -1) {
                                    if (parseInt(this['numPriceJariEjareh']) > 0 || parseInt(this['numPriceJariTel']) > 0 || parseInt(this['numPriceJariNet']) > 0 || parseInt(this['numPriceJariAbogaz']) > 0) {
                                        $("#drpdwnSaatipricejari").val("1");
                                    }
                                    else {
                                        $("#drpdwnSaatipricejari").val("0");
                                    }
                                    GetChangeSaatiHazineJari();

                                    $("#txtSaatijariEjareh").val(addCommas(this['numPriceJariEjareh']));
                                    $("#txtSaatijariTel").val(addCommas(this['numPriceJariTel']));
                                    $("#txtSaatijariNet").val(addCommas(this['numPriceJariNet']));
                                    $("#txtSaatijariAbogaz").val(addCommas(this['numPriceJariAbogaz']));

                                    $("#txtSaatiAgantMetraj").val(addCommas(this['numAgentArea']));
                                    $("#txtSaatiAnbarMetraj").val(addCommas(this['numAnbarArea']));
                                }
                                else {
                                    $(".hazinehprojecthide,.metrajprojecthide").hide();
                                }



                                $("#drpdwnSaatiTransportKind").val(this["numTransporterKind"]);
                                getInfoTransportSaati();
                                if ((arrayorg.indexOf("15") > -1 || arrayorg.indexOf("17") > -1) && $("#drpdwnSaatiTransportKind").val() != "0") {
                                    $("#txtSaatiTransporterName").val(this["strOwnerName"]);
                                    $("#txtSaatiTransportModel").val(this["strModel"]);
                                    $("#txtSaatiTransportColor").val(this["strColor"]);
                                    $("#txtSaatiTransportShahrbani").val(this["strNumShahrbani"]);
                                    $("#txtSaatiTransportShasi").val(this["strNumShasi"]);
                                    $("#txtSaatiTransportBadaneh").val(this["strNumBody"]);
                                }



                                if (parseInt(this['numPricePorsantToziShode']) > 0 || parseInt(this['numPricePorsantKharejMahdode']) > 0 || parseInt(this['numPricePorsantMoadeli']) > 0) {
                                    $("#drpdwnSaatipricePorsant").val("1");
                                }
                                else {
                                    $("#drpdwnSaatipricePorsant").val("0");
                                }
                                GetChangeSaatiPorsant();

                                $("#txtSaatiPorsantToziShode").val(addCommas(this['numPricePorsantToziShode']));
                                $("#txtSaatiPorsantKharejMahdode").val(addCommas(this['numPricePorsantKharejMahdode']));
                                $("#txtSaatiPorsantMoadeli").val(addCommas(this['numPricePorsantMoadeli']));

                                var array = this['strZemanatType'].split(',');
                                $("#drpdwnSaatiZemanatKind").val(array);
                                $("#drpdwnSaatiZemanatKind").multiselect('refresh');
                                getInfoZemanatSaati(1);

                                for (var j = 0; j <= array.length; j++) {
                                    if (array[j] == "1") {
                                        $("#txtSaatiPriceZemanatNameh").val(addCommas(this['numZemanatPrice']));
                                    }
                                    else if (array[j] == "2") {
                                        $("#txtSaatiCountZemanatcheck").val(addCommas(this['numCountZemanatCheck']));
                                        createZemanatInfocheckSaati();
                                        if (parseInt(this['numCountZemanatCheck']) > 0) {
                                            var price = 0;
                                            var info = this['strZemanatAllInfoCheck'].split(',');
                                            for (var i = 0; i <= (parseInt(this['numCountZemanatCheck']) - 1) ; i++) {
                                                var zemanat = info[i].split('^');
                                                $("#txtSaatiNumbercheck" + (i + 1).toString()).val(zemanat[0].trim());
                                                $("#txtSaatiPricecheck" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                            }
                                        }
                                    }
                                    else if (array[j] == "3") {
                                        $("#txtSaatiCountZemanatSafte").val(addCommas(this['numCountZemanatSafteh']));
                                        createZemanatInfoSaati();
                                        if (parseInt(this['numCountZemanatSafteh']) > 0) {
                                            var price = 0;
                                            var info = this['strZemanatAllInfoSafteh'].split(',');
                                            for (var i = 0; i <= (parseInt(this['numCountZemanatSafteh']) - 1) ; i++) {
                                                var zemanat = info[i].split('^');
                                                $("#txtSaatiNumberSafte" + (i + 1).toString()).val(zemanat[0].trim());
                                                $("#txtSaatiPriceSafte" + (i + 1).toString()).val(addCommas(zemanat[1].trim()));
                                            }
                                        }
                                    }
                                }
                            }
                            //----------------------------

                            $(".trPriceSaati").hide();
                            if (contractState == "2") {
                                if ($("#drpdwnorgposition").val() == "-1" || $("#drpdwnorgposition").val() == null || $("#drpdwnorgposition").val() == undefined)
                                    showitemorgposition(1);
                            }
                            else $(".trPriceproject1").hide();
                            $("#trPriceproject,#trPriceproject1").show();
                        }
                        else {
                            $("#txtSaatiPriceSalary").val(addCommas(this['numPersonelSalary']));

                            $("#txtSaatiPriceHomeSalary").val(addCommas(this['numPersonelHomeSalary']));
                            $("#txtSaatiPriceBon").val(addCommas(this['numPersonelBon']));
                            $("#txtSaatiPriceChildSalary").val(addCommas(this['numPersonelChildSalary']));
                            $("#txtSaatiPriceSanavat").val(addCommas(this['numPersonelSanavat']));
                            $("#txtSaatiPriceEydi").val(addCommas(this['numPriceEidi']));
                            $("#txtSaatiPriceMorakhasi").val(addCommas(this['numPriceLeave']));
                            $("#txtSaatiPriceContract2").val(addCommas(this['numPersonelPadash']));

                            $("#txtSaatiAyabZahab").val(addCommas(this['numPriceAyabZahab']));

                            GetKolDaramadsaati();

                            $(".trPriceSaati").show();
                            $("#trPriceproject,#trPriceproject1,.trPriceproject1").hide();

                            //=========================================================================
                            childsalary = this['numPersonelChildSalary'];
                            if (childsalary != 0) {
                                if (Math.round(this['numPersonelChildSalary'] / 0.2) == this['numPersonelSalary'])
                                    childsalary = 2;
                                else childsalary = 1;
                            }
                            //=========================================================================
                        }



                    }
                });
                //=========================================================================
                $.each(data[0], function (index) {
                    //$("#drpdwnEmployer").val(this['numEmployerRef']);
                    //$("#drpdwnStateContractkind").val(this['numContractStateRef']);

                    if (contractKind == 1) {
                        $("#txtName").val(this['strPersonelName']);
                        $("#txtFamily").val(this['strPersonelFamily']);
                        $("#txtFatherName").val(this['strFatherName']);
                        $("#txtMelliCode").val(this['strMelliCode']);
                        $("#txtNumberShenasname").val(this['strNumberShenasname']);
                        $("#pcaldateBrithdayDate").val(this['dateBrithdayDate']);
                        $("#txtExportCityRef").val(this['strExportCityRef']);
                        $("#drpdwnMarrid").val(this['numMarridRef']);
                        showChildInfo();
                        $("#drpdwnCntChild").val(childsalary);

                        $("#drpdwnProvince").val(this['strWorkProvinceRef']);
                        ShowDrpDwnInRegisterPage(2);
                        ShowDrpDwnInRegisterPage(4);
                        $("#drpdwnAgentMovaghat").val(this['agentcode']);

                        $("#drpdwnCity").val(this['strWorkCityRef']);
                        $("#txtPersonelAddress").val(this['strPersonelAddress']);
                        $("#txtPostCode").val(this['strPostCode']);
                        $("#txtTel1").val(this['strTel'].split('-')[0]);
                        $("#txtTel").val(this['strTel'].split('-')[1]);
                        $("#txtMobile").val(this['strMobile']);
                        $("#drpdwnJensiat").val(this['numJensiatRef']);

                        $("#drpdwnOwner").val(this['numPerosnelCharacter']);
                        GetInfoOwner();
                        if (this['numPerosnelCharacter'] == "2") {
                            $("#txtCompayName").val(this['strCompanyName']);
                            $("#txtShomaresabt").val(this['strCompanyRegNumber']);
                            $("#drpdwnCompanyKind").val(this['numCompanyType']);
                            $("#drpdwnSematInCompany").val(this['numSematInCompany']);
                        }
                    }
                    else if (contractKind == "2" || contractKind == "3") {

                        $("#txtSaatiName").val(this['strPersonelName']);
                        $("#txtSaatiFamily").val(this['strPersonelFamily']);
                        $("#txtSaatiFatherName").val(this['strFatherName']);
                        $("#txtSaatiMelliCode").val(this['strMelliCode']);
                        $("#txtSaatiNumberShenasname").val(this['strNumberShenasname']);
                        $("#txtSaatiExportCityRef").val(this['strExportCityRef']);
                        $("#txtSaatiPersonelAddress").val(this['strPersonelAddress']);
                        $("#SaatidrpdwnJensiat").val(this['numJensiatRef']);
                        $("#txtSaatiTel1").val(this['strTel'].split('-')[0]);
                        $("#txtSaatiTel").val(this['strTel'].split('-')[1]);
                        $("#txtSaatiMobile").val(this['strMobile']);

                        $("#drpdwnSaatiOwner").val(this['numPerosnelCharacter']);
                        GetInfoOwnerSaati();
                        if (this['numPerosnelCharacter'] == "2") {
                            $("#txtSaatiCompayName").val(this['strCompanyName']);
                            $("#txtSaatiShomaresabt").val(this['strCompanyRegNumber']);
                            $("#drpdwnSaatiCompanyKind").val(this['numCompanyType']);
                            $("#drpdwnSaatiSematInCompany").val(this['numSematInCompany']);
                        }

                        $("#drpdwnProvinceSaati").val(this['strWorkProvinceRef']);
                        ShowDrpDwnInRegisterPage(3);
                        $("#drpdwnCitySaati").val(this['strWorkCityRef']);

                        if (contractKind == "3") {
                            ShowDrpDwnInRegisterPage(5);
                            $("#drpdwnAgentProject").val(this['agentcode']);
                        }

                        if (contractKind == "2") {
                            $("#drpdwnsaatiMarrid").val(this['numMarridRef']);
                            showChildInfosaati();
                            $("#drpdwnsaatiCntChild").val(childsalary);
                        }
                    }
                });

                //=========================================================================
                $.each(data[2], function (index) {
                    if (contractKind == 1) {
                        if (this['strReagentName'] == undefined || this['strReagentName'] == null || this['strReagentName'] == "") {
                            $("#drpdwnMoaref").val(0);
                            GetMoarefInfo();
                        }
                        else {
                            $("#drpdwnMoaref").val(1);
                            GetMoarefInfo();
                            $("#txtMoarefName").val(this['strReagentName']);
                            $("#txtMoarefFamily").val(this['strReagentFamily']);
                            $("#txtMoarefTel1").val(this['strReagentTel'].split('-')[0]);
                            $("#txtMoarefTel").val(this['strReagentTel'].split('-')[1]);
                            $("#txtMoarefMobile").val(this['strReagentMobile']);
                            $("#txtMoarefNesbat").val(this['strReagentRelation']);
                            $("#txtMoarefAddress").val(this['strReagentAddress']);
                        }
                    }

                });

                if (contractKind == 1) GetKolDaramad();
                //=========================================================================
                $('input[type=text], textarea').each(function () {
                    if ($(this).val() == "null") $(this).val('');
                });


                $("#titleEditInsertContract").html("بروزرسانی قرارداد");

                if (contractKind == 1) {
                    $("#btnSaveInfoContract").hide();
                    if (type == 1) $("#btnEditInfoContract").show();
                    else $("#btnEditInfoContract").hide();
                    $("#btnCancelEditInfoContract").show();
                }
                else if (contractKind == 2) {
                    $("#btnSaatiSaveInfoContract").hide();
                    if (type == 1) $("#btnSaatiEditInfoContract").show();
                    else $("#btnSaatiEditInfoContract").hide();
                    $("#btnSaatiCancelEditInfoContract").show();
                }
                else if (contractKind == 3) {
                    $("#btnProjectSaveInfoContract").hide();
                    if (type == 1) $("#btnProjectEditInfoContract").show();
                    else $("#btnProjectEditInfoContract").hide();
                    $("#btnProjectCancelEditInfoContract").show();
                }
                $("#DivResultCheckContractEnd").html("");
                $("#DivResultCheckContractEnd").hide();
                $("#DivExcelCheckContractEnd").hide();
                $("#divPersonelTabs").tabs('enable', 0);
                $("#divPersonelTabs").tabs('select', 0);

                if (TabActiveReContract == 1) // Recontract
                {
                    $("#divPersonelContractTadvin").tabs('enable', 0);
                    $("#divPersonelContractTadvin").tabs('select', 0);
                    TabActiveReContract = 0;
                    $("#txtPersonelCodeForReContract").val("");
                    $("#tblContractInfo0").show();
                    if ($("#drpdwnContractKind").val() == "1") {
                        $("#tblContractInfo1").show();
                        $("#tblContractInfo2").hide();
                    }
                    else if ($("#drpdwnContractKind").val() == "2" || $("#drpdwnContractKind").val() == "3") {
                        $("#tblContractInfo1").hide();
                        $("#tblContractInfo2").show();
                    }
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات، دوباره امتحان کنید");
        }
    });
}
//----------------------------------------------------------------------------
//-----------------------انصراف از ویرایش قرارداد موقت---------------------
//----------------------------------------------------------------------------
function CancelEditContractMovaghat(type) {
    if (type == 1) {
        $("#btnSaveInfoContract").show();
        $("#btnEditInfoContract").hide();
        $("#btnCancelEditInfoContract").hide();
    }
    else if (type == 2) {
        $("#btnSaatiSaveInfoContract").show();
        $("#btnSaatiEditInfoContract").hide();
        $("#btnSaatiCancelEditInfoContract").hide();
    }
    else if (type == 3) {
        $("#btnProjectSaveInfoContract").show();
        $("#btnProjectEditInfoContract").hide();
        $("#btnProjectCancelEditInfoContract").hide();
    }
    $("#titleEditInsertContract").html("تدوین");
    $("#divPersonelTabs").tabs('enable', 1);
    $("#divPersonelTabs").tabs('select', 1);
    $("#drpdwnEmployer").val(-1);
    $("#drpdwnContractKind").val(-1);
    $("#drpdwnStateContractkind").val(-1);

    CheckContractInputValue();

    $('html, body').animate({
        scrollTop: $("#Main").offset().top
    }, 2000);
}
//----------------------------------------------------------------------------
//--------------------------------------محاسبه درامد کل موقت----------------------
//----------------------------------------------------------------------------
function GetKolDaramad() {
    var HoghogheSabet = $.trim($("#txtHoghogheSabet").val());
    var HaghMaskan = $.trim($("#txtHaghMaskan").val());
    var BonKharbar = $.trim($("#txtBonKharbar").val());
    var PadashAmalkard = $.trim($("#txtPadashAmalkard").val());
    var Saier = $.trim($("#txtSaier").val());
    var haghmasoliat = $.trim($("#txtHaghMasoliatSaier").val());
    var ayabzahab = $.trim($("#txtAyabZahab").val());

    var sanavat = $.trim($("#txtSanavat").val());
    var HaghOlad = $.trim($("#txtHaghOlad").val());

    HoghogheSabet = HoghogheSabet == "" ? "0" : HoghogheSabet;
    HaghMaskan = HaghMaskan == "" ? "0" : HaghMaskan;
    BonKharbar = BonKharbar == "" ? "0" : BonKharbar;
    PadashAmalkard = PadashAmalkard == "" ? "0" : PadashAmalkard;
    Saier = Saier == "" ? "0" : Saier;
    haghmasoliat = haghmasoliat == "" ? "0" : haghmasoliat;
    ayabzahab = ayabzahab == "" ? "0" : ayabzahab;
    sanavat = sanavat == "" ? "0" : sanavat;
    HaghOlad = HaghOlad == "" ? "0" : HaghOlad;

    HoghogheSabet = parseInt(HoghogheSabet.replaceAll(",", ""));
    HaghMaskan = parseInt(HaghMaskan.replaceAll(",", ""));
    BonKharbar = parseInt(BonKharbar.replaceAll(",", ""));
    PadashAmalkard = parseInt(PadashAmalkard.replaceAll(",", ""));
    Saier = parseInt(Saier.replaceAll(",", ""));
    haghmasoliat = parseInt(haghmasoliat.replaceAll(",", ""));
    ayabzahab = parseInt(ayabzahab.replaceAll(",", ""));
    sanavat = parseInt(sanavat.replaceAll(",", ""));
    HaghOlad = parseInt(HaghOlad.replaceAll(",", ""));

    $("#tdMajmoeKol").html(addCommas(parseInt(HoghogheSabet) + parseInt(HaghMaskan) + parseInt(BonKharbar) + parseInt(PadashAmalkard) + parseInt(Saier) + parseInt(haghmasoliat) + parseInt(ayabzahab) + parseInt(sanavat) + parseInt(HaghOlad)) + " ریال");
}

//----------------------------------------------------------------------------
//--------------------------------------محاسبه درامد کل ساعتی----------------------
//----------------------------------------------------------------------------
function GetKolDaramadsaati() {
    var HoghogheSabet = $.trim($("#txtSaatiPriceSalary").val());
    var HaghMaskan = $.trim($("#txtSaatiPriceHomeSalary").val());
    var BonKharbar = $.trim($("#txtSaatiPriceBon").val());
    var eidi = $.trim($("#txtSaatiPriceEydi").val());
    var sanavat = $.trim($("#txtSaatiPriceSanavat").val());
    var HaghOlad = $.trim($("#txtSaatiPriceChildSalary").val());
    var morakhasiprice = $.trim($("#txtSaatiPriceMorakhasi").val());
    var PadashAmalkard = $.trim($("#txtSaatiPriceContract2").val());

    HoghogheSabet = HoghogheSabet == "" ? "0" : HoghogheSabet;
    HaghMaskan = HaghMaskan == "" ? "0" : HaghMaskan;
    BonKharbar = BonKharbar == "" ? "0" : BonKharbar;
    PadashAmalkard = PadashAmalkard == "" ? "0" : PadashAmalkard;
    eidi = eidi == "" ? "0" : eidi;
    morakhasiprice = morakhasiprice == "" ? "0" : morakhasiprice;
    sanavat = sanavat == "" ? "0" : sanavat;
    HaghOlad = HaghOlad == "" ? "0" : HaghOlad;

    HoghogheSabet = parseInt(HoghogheSabet.replaceAll(",", ""));
    HaghMaskan = parseInt(HaghMaskan.replaceAll(",", ""));
    BonKharbar = parseInt(BonKharbar.replaceAll(",", ""));
    PadashAmalkard = parseInt(PadashAmalkard.replaceAll(",", ""));
    eidi = parseInt(eidi.replaceAll(",", ""));
    morakhasiprice = parseInt(morakhasiprice.replaceAll(",", ""));
    sanavat = parseInt(sanavat.replaceAll(",", ""));
    HaghOlad = parseInt(HaghOlad.replaceAll(",", ""));

    $("#tdMajmoeKolsaati").html(addCommas(parseInt(HoghogheSabet) + parseInt(HaghMaskan) + parseInt(BonKharbar) + parseInt(PadashAmalkard) + parseInt(eidi) + parseInt(morakhasiprice) + parseInt(sanavat) + parseInt(HaghOlad)));
}
//----------------------------------------------------------------------------
//--------------------------------------تغییر دراپ دان حق الزحمه----------------------
//----------------------------------------------------------------------------
function GetChangePadashSaati() {
    var value = $("#drpdwnSaatiPricePadashAvilable").val();
    if (value == 0) {
        $("#trPadashSaati").hide();
        $("#txtSaatiTitlePadashContract").val('');
        $("#txtSaatiPricePadashContract").val();
    }
    else {
        $("#trPadashSaati").show();
        $("#txtSaatiTitlePadashContract").val('');
        $("#txtSaatiPricePadashContract").val('');
    }
}
//-----------------------------------namaiesh etelate personel baraie hamkari mojadad-----------------------------------
var PersonelReContractInfo = "";
var MorefReContractInfo = "";
var LastcontractReContractInfo = "";
var PersonelCodeReContractPublic = 0;
function SearchPersonelInfoForReContract() {

    $(".error-icon").remove();
    $("input,select").removeClass("input-err-border");
    ResetErrorIconInput('txtSaatiKhadamat');

    $("#DivResultCheckContractEnd").html("");
    $("#DivExcelCheckContractEnd").hide();
    $("#DivResultCheckContractEnd").hide();

    PersonelReContractInfo = "";
    MorefReContractInfo = "";
    LastcontractReContractInfo = "";
    PersonelCodeReContractPublic = 0;
    var personelcode = $.trim($("#txtPersonelCodeForReContract").val());
    var melicode = $.trim($("#txtCodeMelliForReContract").val());

    if (personelcode == "" && melicode == "") {
        ShowAlert("کد ملی یا کد پرسنلی را وارد نمایید!");
        return;
    }
    else if (personelcode != "" && !numbericFild.test(personelcode)) {
        ShowAlert("لطفا کد پرسنلی را به صورت عددی وارد نمایید!");
        return;
    }
    else if (melicode != "" && !numbericFild.test(melicode)) {
        ShowAlert("لطفا کد ملی را به صورت عددی وارد نمایید!");
        return;
    }

    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 10, personelcode: personelcode, melicode: melicode },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            if (data == "2") {
                ShowAlert("اطلاعاتی از این کد پرسنلی یا کد ملی یافت نشد!");
                $("#tblContractInfo0").hide();
                $("#tblContractInfo1").hide();
                $("#tblContractInfo2").hide();
            }
            else if (data == "5") {
                ShowAlert("اطلاعاتی یافت نشد!");
                $("#tblContractInfo0").hide();
                $("#tblContractInfo1").hide();
                $("#tblContractInfo2").hide();
            }
            else if (data == "3") {
                ShowAlert("برای همکاری مجدد می بایست ابتدا قطع همکاری کنید یا تاریخ قرارداد قبلی از موعد آن گذشته باشد ! ");
                $("#tblContractInfo0").hide();
                $("#tblContractInfo1").hide();
                $("#tblContractInfo2").hide();
            }
            else {
                PersonelReContractInfo = data[0];
                MorefReContractInfo = data[1];
                LastcontractReContractInfo = data[2];
                $("#tblContractInfo0").show();
                $("#tblContractInfo1").hide();
                $("#tblContractInfo2").hide();
                PersonelCodeReContractPublic = personelcode;
                $("#drpdwnEmployer").val(-1);
                $("#drpdwnContractKind").val(-1);
                $("#drpdwnStateContractkind").val(-1);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            $("#tblContractInfo0").hide();
            $("#tblContractInfo1").hide();
            $("#tblContractInfo2").hide();

        }
    });
}
//-----------------------------------namaiesh tab faal-----------------------------------
var TabActiveReContract = 0;
function getTabActiveForRecontract(tabactive) {

    TabActiveReContract = 0;
    if (tabactive == 0) {
        $("#tblContractInfo0").hide();
        $("#tblContractInfo1").hide();
        $("#tblContractInfo2").hide();
        TabActiveReContract = 1;
    }
    else {
        $("#DivResultCheckContractEnd").html("");
        $("#DivExcelCheckContractEnd").hide();
        $("#DivResultCheckContractEnd").hide();

        TabActiveReContract = 0;
        $("#tblContractInfo0").show();
        GetInfoByContractKind(1);

        //if ($("#drpdwnContractKind").val() != "-1") {

        //    $("#tblContractInfo1").show();
        //    $("#tblContractInfo2").show();
        //}
        //else {
        //    $("#tblContractInfo1").hide();
        //    $("#tblContractInfo2").hide();
        //}


    }

}
//-----------------------------------namaiesh tab faal 2-----------------------------------
function getTabActiveForRecontract2(tabactive) {
    TabActiveReContract = 0;

    if (tabactive == 1) {
        TabActiveReContract = 1;

        $("#tblContractInfo0").hide();
        $("#tblContractInfo1").hide();
        $("#tblContractInfo2").hide();
        CheckPersonelForEndContract();
    }
}
//----------------------------------------------------------------------------
//------ چک کردن کسانی که تاریخ پایان قرارداداشان در سیستم اتمام شده است------
//----------------------------------------------------------------------------
var CheckProjectFileRow = 0;
function CheckPersonelForEndContract() {
    CheckProjectFileRow = 0;
    $("#tblContractInfo0").hide();
    $("#tblContractInfo1").hide();
    $("#tblContractInfo2").hide();
    var mellicode = $.trim($("#txtCodeMelliForReContract").val());
    var personelcode = $.trim($("#txtPersonelCodeForReContract").val());
    var contractkind = $.trim($("#drpdwnTamdidContractkind").val());
    var grohkari = $.trim($("#drpdwnTamdidWorkgroup").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnTamdidWorkgroup").val() + "\"";

    $("#DivExcelCheckContractEnd").hide();
    $("#DivResultCheckContractEnd").html("<img src='Images/progressindicator.gif' />");
    $("#DivResultCheckContractEnd").show();
    var header = "<table id='tblCheckContractEnd' class='MainTbl' style='border-collapse: collapse; width:100%;' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th><input type='checkbox' id='chkAllPersonelCode' checked='checked' onclick='CheckOnePersonelItems(1);'/></th><th style='display:none;'></th><th>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نوع قرارداد</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th><th align='center'>تاریخ پایان قرارداد</th><th align='center'>تمدید قرارداد</th><th align='center'>قطع همکاری</th></thead><tbody>";
    var mainrow = "<tr><td>{check}</td><td style='display:none;' id='tdcontractKindCode{Row}'>{contractKind}</td><td>{Row}</td><td id='tdPersonelCodeNewContract{Row}'>{personelcode}</td><td>{contractName}</td><td>{name}</td><td>{workGroup}</td><td>{dateendcontract}</td><td>{action}</td><td>{action1}</td></tr>";
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
        data: { i: 11, personelcode: personelcode, mellicode: mellicode, contractkind: contractkind, grohkari: grohkari },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{name}", this['strPersonelName']);
                row = row.replaceAll("{check}", "<input type='checkbox' id='chkOnePersonelCode{Row}' onclick='CheckOnePersonelItems(2,{Row});' checked='checked'/>");
                row = row.replaceAll("{workGroup}", this['strWorkGroupName']);
                row = row.replaceAll("{dateendcontract}", this['dateEndContractDate']);
                row = row.replaceAll("{action}", "<a onclick='RecontractPersonel({personelcode});' style='cursor:pointer;'><img src='images/business_user.png'/></a>");
                row = row.replaceAll("{action1}", "<a onclick='CutContractPersonel({personelcode});' style='cursor:pointer;'><img src='images/offline.png' style='width:22px;'/></a>");
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{contractName}", this['contractkindname']);
                row = row.replaceAll("{contractKind}", this['numContractKindRef']);

                row = row.replaceAll("{Row}", i);
                i = i + 1;
                allrow = allrow + row;
                t = 1;
                CheckProjectFileRow = i - 1;

            });

            if (t == 1) {
                $("#DivResultCheckContractEnd").html(header + header2 + allrow + footer);
                $("#DivExcelCheckContractEnd").show();
            }
            else {
                $("#DivResultCheckContractEnd").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivExcelCheckContractEnd").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#DivExcelCheckContractEnd").hide();
            $("#DivResultCheckContractEnd").html("");
            $("#DivResultCheckContractEnd").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function CheckOnePersonelItems(type, row) {
    if (type == 1) {
        for (var i = 1; i <= CheckProjectFileRow; i++) {
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
//-----------------------------------قرارداد مجدد---------------------------------
//---------------------------------------------------------------------------------
var flagReadPrice = 2;
function RecontractPersonel(personelcode) {

    ShowAlert("مبلغ قرارداد از کدام قسمت خوانده و نمایش داده شود ؟ <br/><br/><input id='btnsalemaliInfo' type='button' value='مبالغ از سال مالی جاری بخوان' onclick='readPriceMain(1);'/> &nbsp;&nbsp;&nbsp; <input id='btncontractPriceInfo' type='button' value='مبالغ از آخرین قرارداد بخوان' onclick='readPriceMain(2);'/>");
    $("#btnsalemaliInfo,#btncontractPriceInfo").button();

    $("#txtPersonelCodeForReContract").val(personelcode);
    SearchPersonelInfoForReContract();
    $("#txtPersonelCodeForReContract").val("");

}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function readPriceMain(type) {
    flagReadPrice = type;

    $("#divAlert").dialog("close");
}
//---------------------------------------------------------------------------------
//-----------------------------------قرارداد مجدد-----------------------------------
//---------------------------------------------------------------------------------
function CutContractPersonel(personelcode) {
    $("#Note").html("با تایید شما آخرین واریزی این پرسنل در سیستم به حالت واریز شد و قطع همکاری در میاید و قرار داد پرسنل مورد نظر در سیستم غیر فعال و قطع همکاری میگردد<br/> آیا از قطع همکاری این پرسنل اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "قطع همکاری پرسنل",
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
                    data: { i: 15, personelcode: personelcode },
                    url: "PostBack/PBContract.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            CheckPersonelForEndContract();
                            ShowAlert("آخرین پرداختی پرسنلی واریز و قطع همکاری شده است و وضعیت پرسنل در سیستم به قطع همکاری تغییر یافت.");
                        }
                        else if (data == "2") {
                            ShowAlert("اطلاعاتی از پرسنل یافت نشد !");
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
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function ShowPanelRecontractNewFromOldContract() {
    var Code = "";
    var cntMovaghat = 0;
    var cntSaati = 0;
    var cntProjei = 0;

    for (var i = 1; i <= CheckProjectFileRow; i++) {
        if ($("#chkOnePersonelCode" + i).attr("checked")) {
            Code = Code + $.trim($("#tdPersonelCodeNewContract" + i).html()) + ",";
            if ($.trim($("#tdcontractKindCode" + i).html()) == 1) cntMovaghat = cntMovaghat + 1;
            else if ($.trim($("#tdcontractKindCode" + i).html()) == 2) cntSaati = cntSaati + 1;
            else if ($.trim($("#tdcontractKindCode" + i).html()) == 3) cntProjei = cntProjei + 1;
        }
    }
    if (Code == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;
    }

    if (cntMovaghat > 0) $("#tblRecontractMovaghat").show();
    else $("#tblRecontractMovaghat").hide();

    if (cntSaati > 0) $("#tblRecontractSaati").show();
    else $("#tblRecontractSaati").hide();

    if (cntProjei > 0) $("#tblRecontractProjei").show();
    else $("#tblRecontractProjei").hide();


    $("#panelRecontractNew").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "همکاری مجدد پرسنل موقت / ساعتی / پیمانکاری",
        width: 500,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "تایید": function () {

                // $(this).dialog("close");
                ReContractFromOldContract();
            }
        }
    });
    $("#txtContractMonthNewFrmOld").val('');
    $("#txtContractDayNewFrmOld").val('');
    $("#pcaldateContractFromDateNewFrmOld").val('');
    $("#pcaldateContractToDateNewFrmOld").val('');
    $("#pcaldateContractUnValidDateNewFrmOld").val('');
    $("#drpdwnGetPriceMain").val('-1');

    // ------------------------ saati -----------------------------------
    $("#txtSaatiContractMonthNewFrmOld").val('');
    $("#txtSaatiContractDayNewFrmOld").val('');
    $("#pcalSaatidateContractFromDateNewFrmOld").val('');
    $("#pcalSaatidateContractToDateNewFrmOld").val('');
    $("#pcalSaatidateContractTavafoghDateNewFrmOld").val('');
    $("#txtSaatiContractTimeNewFrmOld").val('');
    $("#drpdwnTimeForMonthNewFrmOld").val(2);
    $("#drpdwnWeekForMonthNewFrmOld").val(2);

    // ------------------------ projei -----------------------------------
    $("#txtProjeiContractMonthNewFrmOld").val('');
    $("#txtProjeiContractDayNewFrmOld").val('');
    $("#pcalProjeidateContractFromDateNewFrmOld").val('');
    $("#pcalProjeidateContractToDateNewFrmOld").val('');
    $("#pcalProjeidateContractTavafoghDateNewFrmOld").val('');
    $("#txtProjeiContractTimeNewFrmOld").val('');
    $("#drpdwnProjeiTimeForMonthNewFrmOld").val(2);
    $("#drpdwnProjeiWeekForMonthNewFrmOld").val(2);

    $("#panelRecontractNew").dialog("open");
}
//---------------------------------------------------------------------------------
//-----------------------کپی از قرارداد فعلی و همکاری مجدد----------------------
//---------------------------------------------------------------------------------

function ReContractFromOldContract() {
    var Code = "";
    var cntMovaghat = 0;
    var cntSaati = 0;
    var cntProjei = 0;
    for (var i = 1; i <= CheckProjectFileRow; i++) {
        if ($("#chkOnePersonelCode" + i).attr("checked")) {
            Code = Code + $.trim($("#tdPersonelCodeNewContract" + i).html()) + ",";
            if ($.trim($("#tdcontractKindCode" + i).html()) == 1) cntMovaghat = cntMovaghat + 1;
            else if ($.trim($("#tdcontractKindCode" + i).html()) == 2) cntSaati = cntSaati + 1;
            else if ($.trim($("#tdcontractKindCode" + i).html()) == 3) cntProjei = cntProjei + 1;
        }
    }
    if (Code == "") {
        ShowAlert("حداقل یک پرسنل را انتخاب نمایید !");
        return;
    }
    $("#Note").html("آیا از تایید  نسخه مشابه قرارداد فعلی و همکاری مجدد پرسنل اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "همکاری مجدد پرسنل",
        width: 380,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
            },
            "بله": function () {

                // ------------------------ movaghat -----------------------------------
                var MovaghtMonth = $.trim($("#txtContractMonthNewFrmOld").val());
                var MovaghtDAy = $.trim($("#txtContractDayNewFrmOld").val());
                var MovaghtContractFromDate = $("#pcaldateContractFromDateNewFrmOld").val();
                var MovaghtContractToDate = $("#pcaldateContractToDateNewFrmOld").val();
                var MovaghtContractUnValidDate = $("#pcaldateContractUnValidDateNewFrmOld").val();
                var PriceTamdidMain = $("#drpdwnGetPriceMain").val();
                // ------------------------ saati -----------------------------------
                var SaatiMovaghtMonth = $.trim($("#txtSaatiContractMonthNewFrmOld").val());
                var SaatiMovaghtDAy = $.trim($("#txtSaatiContractDayNewFrmOld").val());
                var SaatiContractFromDate = $("#pcalSaatidateContractFromDateNewFrmOld").val();
                var SaatiContractToDate = $("#pcalSaatidateContractToDateNewFrmOld").val();
                var SaatiContractTavafoghDate = $("#pcalSaatidateContractTavafoghDateNewFrmOld").val();
                var SaatiContractTime = $.trim($("#txtSaatiContractTimeNewFrmOld").val());
                var SaatiTimeForMonth = $("#drpdwnTimeForMonthNewFrmOld").val();
                var SaatiWeekForMonth = $("#drpdwnWeekForMonthNewFrmOld").val();

                // ------------------------ projei -----------------------------------
                var ProjeiMovaghtMonth = $.trim($("#txtProjeiContractMonthNewFrmOld").val());
                var ProjeiMovaghtDAy = $.trim($("#txtProjeiContractDayNewFrmOld").val());
                var ProjeiContractFromDate = $("#pcalProjeidateContractFromDateNewFrmOld").val();
                var ProjeiContractToDate = $("#pcalProjeidateContractToDateNewFrmOld").val();
                var ProjeiContractTavafoghDate = $("#pcalProjeidateContractTavafoghDateNewFrmOld").val();
                var ProjeiContractTime = $.trim($("#txtProjeiContractTimeNewFrmOld").val());
                var ProjeiTimeForMonth = $("#drpdwnProjeiTimeForMonthNewFrmOld").val();
                var ProjeiWeekForMonth = $("#drpdwnProjeiWeekForMonthNewFrmOld").val();

                if (((cntMovaghat > 0) && (MovaghtMonth == "" || MovaghtDAy == "" || MovaghtContractFromDate == "" || MovaghtContractToDate == "" || MovaghtContractUnValidDate == "" || PriceTamdidMain == "-1"))
                    || ((cntSaati > 0) && (SaatiMovaghtMonth == "" || SaatiMovaghtDAy == "" || SaatiContractFromDate == "" || SaatiContractToDate == "" || SaatiContractTavafoghDate == "" || SaatiContractTime == ""))
                     || ((cntProjei > 0) && (ProjeiMovaghtMonth == "" || ProjeiMovaghtDAy == "" || ProjeiContractFromDate == "" || ProjeiContractToDate == "" || ProjeiContractTavafoghDate == "" || ProjeiContractTime == ""))) {

                    ShowAlert("لطفا تمامی اطلاعات را وارد نمایید !");
                    return;
                }

                $("#CheckOut").fadeIn();
                $("#Loading").fadeIn();
                $(this).dialog("close");

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: {
                        i: 13, Code: Code,
                        MovaghtMonth: MovaghtMonth,
                        MovaghtDAy: MovaghtDAy,
                        MovaghtContractFromDate: MovaghtContractFromDate,
                        MovaghtContractToDate: MovaghtContractToDate,
                        MovaghtContractUnValidDate: MovaghtContractUnValidDate,
                        PriceTamdidMain: PriceTamdidMain,

                        SaatiMovaghtMonth: SaatiMovaghtMonth,
                        SaatiMovaghtDAy: SaatiMovaghtDAy,
                        SaatiContractFromDate: SaatiContractFromDate,
                        SaatiContractToDate: SaatiContractToDate,
                        SaatiContractTavafoghDate: SaatiContractTavafoghDate,
                        SaatiContractTime: SaatiContractTime,
                        SaatiTimeForMonth: SaatiTimeForMonth,
                        SaatiWeekForMonth: SaatiWeekForMonth,

                        ProjeiMovaghtMonth: ProjeiMovaghtMonth,
                        ProjeiMovaghtDAy: ProjeiMovaghtDAy,
                        ProjeiContractFromDate: ProjeiContractFromDate,
                        ProjeiContractToDate: ProjeiContractToDate,
                        ProjeiContractTavafoghDate: ProjeiContractTavafoghDate,
                        ProjeiContractTime: ProjeiContractTime,
                        ProjeiTimeForMonth: ProjeiTimeForMonth,
                        ProjeiWeekForMonth: ProjeiWeekForMonth
                    },
                    url: "PostBack/PBContract.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "1") {
                            $("#panelRecontractNew").dialog("close");
                            CheckPersonelForEndContract();
                            if ($.trim($("#ResultDivPersonelContract").html()) != "") GetReportInfoPersonelContract(1);
                            ShowAlert("قراردادهای جدید با موفقیت در سیستم ثبت شده و قراردادهای قدیمی غیر فعال شدند");

                        }
                        else if (data == "2") {
                            ShowAlert("اطلاعاتی از پرسنل یافت نشد !");
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
//-----------------------موزعین جدید در سیستم----------------------
//---------------------------------------------------------------------------------
function GetAllPeikNew(vpage) {
    CompletePeikInfo = 0;
    var name = $.trim($("#txtPeikPersonelNameContract").val());
    var mellicode = $.trim($("#txtPeikPersonelMelliCodeContract").val());
    var agent = $.trim($("#drpdwnPeikAgentNameSrch").val());
    var ContractKind = $.trim($("#drpdownContractKindStatus").val());

    $("#ResultDivPeikPersonelContract").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPeikPersonelContract").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th>نمایندگی</th><th>نام و نام خانوادگی پیک</th><th align='center'>کد ملی پیک</th><th align='center'>نوع قرارداد</th><th align='center'>تاریخ ثبت</th><th></th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{agent}</td><td>{peikname}</td><td>{mellicode}</td><td>{contractkind}</td><td>{dateregister}</td><td>{Action}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetAllPeikNew(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelpeik' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelpeik' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetAllPeikNew({lastpage})'>" +
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
        data: { i: 18, name: name, mellicode: mellicode, agent: agent, ContractKind: ContractKind, page: vpage, perpage: vperpage },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                row = row.replaceAll("{agent}", this['strAgcNam']);
                row = row.replaceAll("{peikname}", this['strPersonelName']);
                row = row.replaceAll("{contractkind}", $.trim(this['numContractKindStatus']) == "1" ? "پورسانتی" : $.trim(this['numContractKindStatus']) == "2" ? "حقوق بگیر" : $.trim(this['numContractKindStatus']) == "3" ? "پورسانتی و حقوق بگیر" : "-");
                row = row.replaceAll("{dateregister}", this['dateRegisterDate']);
                row = row.replaceAll("{Action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='EditPersonelCodeNewPeik(\"{mellicode}\",{contractCode});'><img src='images/Edit.png' /></a></div>"); //<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeletePersonelCodeNewPeik(\"{mellicode}\",{contractCode});'><img src='images/delete.png' /></a></div>");
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{contractCode}", this['numContractKindStatus'] == "2" ? 1 : 3);
                allrow = allrow + row;
                i = i + 1;
                t = 1;
            });
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetAllPeikNew(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetAllPeikNew(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivPeikPersonelContract").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonelpeik").html(allpage);
            }
            else {
                $("#ResultDivPeikPersonelContract").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPeikPersonelContract").html("");
            $("#ResultDivPeikPersonelContract").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//----------------------------------------------------------------------------
//---------------------------تکمیل اطلاعات قرارداد موزعین--------------------
//----------------------------------------------------------------------------
var CompletePeikInfo = 0;
function EditPersonelCodeNewPeik(mellicode, contractCode) {
    CompletePeikInfo = 0;
    contractcodeForEditPublic = contractCode;
    $("#Note").html("آیا از تکمیل اطلاعات این پرسنل اطمینان دارید ؟");
    $("#Note").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "تکمیل اطلاعات پرسنل",
        width: 350,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "خیر": function () {
                $(this).focus();
                $(this).dialog("close");
                CompletePeikInfo = 0;
            },
            "بله": function () {
                $("#Loading").fadeIn();
                $("#CheckOut").fadeIn();

                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 19, mellicode: mellicode },
                    url: "PostBack/PBContract.ashx",
                    success: function (data) {
                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        if (data == "2") {
                            ShowAlert("اطلاعاتی از این پرسنل یافت نشد!");
                            $("#trRowFileContract" + mellicode).remove();
                        }
                        else {
                            if (TabActiveReContract == 1) // Recontract
                            {
                                $("#divPersonelContractTadvin").tabs('enable', 0);
                                $("#divPersonelContractTadvin").tabs('select', 0);
                                TabActiveReContract = 0;
                                $("#txtPersonelCodeForReContract").val("");
                                $("#tblContractInfo0").show();
                                if ($("#drpdwnContractKind").val() == "1") {
                                    $("#tblContractInfo1").show();
                                    $("#tblContractInfo2").hide();
                                }
                                else if ($("#drpdwnContractKind").val() == "2" || $("#drpdwnContractKind").val() == "3") {
                                    $("#tblContractInfo1").hide();
                                    $("#tblContractInfo2").show();
                                }
                            }

                            CompletePeikInfo = 1;

                            var contractKind = 0;
                            var cntchild = 0;
                            var childsalary = 0;

                            //=========================================================================
                            $.each(data, function (index) {
                                $("#drpdwnEmployer").val(this['numEmployerRef']);
                                $("#drpdwnContractKind").val(this['numContractKindRef']);
                                $("#drpdwnStateContractkind").val("2");

                                GetInfoByContractKind(1);
                                contractKind = this['numContractKindRef'];
                                //=========================================================================
                                childsalary = this['numPersonelChildSalary'];
                                if (childsalary != 0) {
                                    if (Math.round(this['numPersonelChildSalary'] / 0.2) == this['numPersonelSalary'])
                                        childsalary = 2;
                                    else childsalary = 1;
                                }
                                //=========================================================================

                                if (contractKind == 1) {

                                    $("#txtHoghogheSabet").val(addCommas(this['numPriceSalary']));
                                    $("#txtPadashAmalkard").val(addCommas(this['numPricePorsant']));

                                    $("#txtName").val(this['strPersonelName']);
                                    $("#txtFamily").val(this['strPersonelFamily']);
                                    $("#txtFatherName").val(this['strFatherName']);
                                    $("#txtMelliCode").val(this['strMelliCode']);
                                    $("#txtNumberShenasname").val(this['strNumberShenasname']);
                                    $("#pcaldateBrithdayDate").val(this['dateBrithdayDate']);
                                    $("#txtExportCityRef").val(this['strExportCityRef']);
                                    $("#drpdwnMarrid").val(this['numMarridRef']);
                                    showChildInfo();
                                    $("#drpdwnCntChild").val(childsalary);

                                    $("#drpdwnProvince").val(this['strWorkProvinceRef']);
                                    ShowDrpDwnInRegisterPage(2);
                                    ShowDrpDwnInRegisterPage(4);
                                    $("#drpdwnAgentMovaghat").val(this['agentcode']);

                                    $("#drpdwnCity").val(this['strWorkCityRef']);
                                    $("#txtPersonelAddress").val(this['strPersonelAddress']);
                                    $("#txtPostCode").val(this['strPostCode']);
                                    $("#txtTel1").val(this['strTel'].split('-')[0]);
                                    $("#txtTel").val(this['strTel'].split('-')[1]);
                                    $("#txtMobile").val(this['strMobile']);
                                    $("#drpdwnJensiat").val(this['numJensiatRef']);
                                }
                                else if (contractKind == "2" || contractKind == "3") {

                                    $("#txtSaatiName").val(this['strPersonelName']);
                                    $("#txtSaatiFamily").val(this['strPersonelFamily']);
                                    $("#txtSaatiFatherName").val(this['strFatherName']);
                                    $("#txtSaatiMelliCode").val(this['strMelliCode']);
                                    $("#txtSaatiNumberShenasname").val(this['strNumberShenasname']);
                                    $("#txtSaatiExportCityRef").val(this['strExportCityRef']);
                                    $("#txtSaatiPersonelAddress").val(this['strPersonelAddress']);
                                    $("#SaatidrpdwnJensiat").val(this['numJensiatRef']);
                                    $("#txtSaatiTel1").val(this['strTel'].split('-')[0]);
                                    $("#txtSaatiTel").val(this['strTel'].split('-')[1]);
                                    $("#txtSaatiMobile").val(this['strMobile']);

                                    $("#drpdwnProvinceSaati").val(this['strWorkProvinceRef']);
                                    ShowDrpDwnInRegisterPage(3);
                                    $("#drpdwnCitySaati").val(this['strWorkCityRef']);

                                    if (contractKind == "3") {
                                        ShowDrpDwnInRegisterPage(5);
                                        $("#drpdwnAgentProject").val(this['agentcode']);
                                    }

                                    $("#txtSaatiPriceContract").val(addCommas(this['numPriceSalary']));
                                    $("#txtSaatiPriceHaghMasoliat").val(0);

                                    //var pricepadash = this['numPricePorsant'];
                                    //if (pricepadash != null && parseInt(pricepadash) > 0) {
                                    //    $("#drpdwnSaatiPricePadashAvilable").val(1);
                                    //    GetChangePadashSaati();
                                    //    $("#txtSaatiTitlePadashContract").val("");
                                    //    $("#txtSaatiPricePadashContract").val(addCommas(pricepadash));

                                    //}
                                    //else {
                                    //    $("#drpdwnSaatiPricePadashAvilable").val(0);
                                    //    GetChangePadashSaati();
                                    //    $("#txtSaatiTitlePadashContract").val("");
                                    //    $("#txtSaatiPricePadashContract").val("");
                                    //}
                                    $(".trPriceSaati").hide();
                                    if ($("#drpdwnStateContractkind").val() == "2") {
                                        if ($("#drpdwnorgposition").val() == "-1" || $("#drpdwnorgposition").val() == null || $("#drpdwnorgposition").val() == undefined)
                                            showitemorgposition(1);
                                        else
                                            $(".trPriceproject1").show();
                                    }
                                    else $(".trPriceproject1").hide();
                                    $("#trPriceproject,#trPriceproject1").show();


                                    if (contractKind == "2") {
                                        $("#drpdwnsaatiMarrid").val(this['numMarridRef']);
                                        showChildInfosaati();
                                        $("#drpdwnsaatiCntChild").val(childsalary);
                                    }

                                }
                            });

                            if (contractKind == 1) GetKolDaramad();
                            //=========================================================================
                            $('input[type=text], textarea').each(function () {
                                if ($(this).val() == "null") $(this).val('');
                            });

                            $("#DivResultCheckContractEnd").html("");
                            $("#DivResultCheckContractEnd").hide();
                            $("#DivExcelCheckContractEnd").hide();
                            $("#divPersonelTabs").tabs('enable', 0);
                            $("#divPersonelTabs").tabs('select', 0);
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
//----------------------------------------------------------------------------
//---------------------------دریافت مبالغ سال جاری--------------------
//----------------------------------------------------------------------------
function GetMainSalary() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    var row = "", allrow = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1, year: "-1" },
        url: "PostBack/PBSettingPrice.ashx",
        success: function (data) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();

            $.each(data, function (index) {
                salaryMain = this["numPriceSalary"];
                BonMain = this["numPriceBon"];
                HomeMain = this["numPriceHomeSalary"];
                HaghOladMain = 0;
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });

}
//====================================================================
//====================================================================
//====================================================================
function GetChangeHazineJari() {
    var item = $("#drpdwnpricejari").val();
    if (item == 0) {
        $(".hidejari").hide();
    }
    else if (item == 1) {
        $(".hidejari").show();
    }
}
//====================================================================
//====================================================================
//====================================================================
function GetChangePorsant() {
    var item = $("#drpdwnpricePorsant").val();
    if (item == 0) {
        $(".hideporsant").hide();
    }
    else if (item == 1) {
        $(".hideporsant").show();

    }
}
//====================================================================
//====================================================================
//====================================================================

function GetChangeSaatiHazineJari() {
    var item = $("#drpdwnSaatipricejari").val();
    if (item == 0) {
        $(".hidejariSaati").hide();

    }
    else if (item == 1) {
        $(".hidejariSaati").show();

    }

    $("#txtSaatijariEjareh").val("");
    $("#txtSaatijariTel").val("");
    $("#txtSaatijariNet").val("");
    $("#txtSaatijariAbogaz").val("");
}
//====================================================================
//====================================================================
//====================================================================
function GetChangeSaatiPorsant() {
    var item = $("#drpdwnSaatipricePorsant").val();
    if (item == 0) {
        $(".hideporsantSaati").hide();

    }
    else if (item == 1) {
        $(".hideporsantSaati").show();

    }
    $("#txtSaatiPorsantToziShode").val("");
    $("#txtSaatiPorsantKharejMahdode").val("");
    $("#txtSaatiPorsantMoadeli").val("");
}