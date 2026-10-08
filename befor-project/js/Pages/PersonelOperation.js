$(document).ready(function () {
    $(":button").button();
    $(":button").css("font-family", "tahoma");
    $(":button").css("font-weight", "normal");

    $("#divPersonelTabs").tabs();
    GetTabsDeActive("divPersonelTabs");
    $("#divPersonelMorakhsi").tabs();
    $("#divPersonelMisson").tabs();
    $("#divPersonelKarKardRozane,#divPersonelKarKard,#divPersonelMorakhsiRozaneh,#divPersonelMorakhsiMahianeh").tabs().tabs('disable', 1).tabs('enable', 0).tabs('select', 0).tabs("refresh");

    $("#monthlblMonthKarkardMahanehDate").hide();
    $("#daylblMonthKarkardMahanehDate").hide();

    $("#monthlblMorakhsiMonthDate").hide();
    $("#daylblMorakhsiMonthDate").hide();

    GetDrpdwnBaseAll();
    $("#btnReportPersonelSearch").click(function () { GetReportInfoPersonel(1); return false; });
    $("#btnSaveMorakhasi").click(function () { SaveMorakhasiInfo(); return false; });
    $("#btnSaveMamoriat").click(function () { SaveMamoriatInfo(); return false; });

    $("#btnReportMorakhasiPersonelSearch").click(function () { GetReportInfoMorakhasiPersonel(1); return false; });
    $("#btnReportMissonPersonelSearch").click(function () { GetReportInfoMissonPersonel(1); return false; });
    $("#btnReportKarkardPersonelSearch").click(function () { GetReportKarkardMonthly(1); return false; });
    $("#btnReportKarkardPersonelSearchRozane").click(function () { GetReportKarkardDaily(1); return false; });

    $("#btnSaveTimeWorkAllMonthe").click(function () { SaveTimejobAllMonthley(); return false; });
    $("#btnSaveNewMorakhasiKind").click(function () { SaveMorakhasiKindNew(); return false; });


    $("#btnReportPersonelSearchMorakhasiRozane").click(function () { GetReportMorakhasiDaily(1); return false; });
    $("#btnExcelErrorKarkarRozaneh").click(function () { ExcelReportTable("tableErrorKarkardRozaneh"); return false; });


    GetAllMorakhasi();
    GetReportInfoPersonel(1);

    //$("#txtStartTimeMorakhasi").timepicker({ 'timeFormat': 'H:i' });
    //$("#txtEndTimeMorakhasi").timepicker({ 'timeFormat': 'H:i' });

    //$("#txtStartTimeMamoriat").timepicker({ 'timeFormat': 'H:i' });
    //$("#txtEndTimeMamoriat").timepicker({ 'timeFormat': 'H:i' });

    //var objCal1 = new AMIB.persianCalendar('pcaldateStartMorakhasiDate', {
    //    extraInputID: 'pcaldateStartMorakhasiDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});

    //var objCal2 = new AMIB.persianCalendar('pcaldateEndMorakhasiDate', {
    //    extraInputID: 'pcaldateEndMorakhasiDate',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});

    var objCal3 = new AMIB.persianCalendar('pcaldateStartMamoriatDate', {
        extraInputID: 'pcaldateStartMamoriatDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal4 = new AMIB.persianCalendar('pcaldateEndMamoriatDate', {
        extraInputID: 'pcaldateEndMamoriatDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    //var objCal5 = new AMIB.persianCalendar('pcaldateStartjob', {
    //    extraInputID: 'pcaldateStartjob',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});

    //var objCal6 = new AMIB.persianCalendar('pcaldateEndjob', {
    //    extraInputID: 'pcaldateEndjob',
    //    extraInputFormat: 'yyyy/mm/dd'
    //});

    var objCal6 = new AMIB.persianCalendar('pcaldateStartjobUpFile', {
        extraInputID: 'pcaldateStartjobUpFile',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal6 = new AMIB.persianCalendar('pcaldateEndjobUpFile', {
        extraInputID: 'pcaldateEndjobUpFile',
        extraInputFormat: 'yyyy/mm/dd'
    });


    var objCal7 = new AMIB.persianCalendar('pcaldateStartjobUpFileEsfand', {
        extraInputID: 'pcaldateStartjobUpFileEsfand',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal8 = new AMIB.persianCalendar('pcaldateEndjobUpFileEsfand', {
        extraInputID: 'pcaldateEndjobUpFileEsfand',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal9 = new AMIB.persianCalendar('pcaldateStartjobUpFileRozane', {
        extraInputID: 'pcaldateStartjobUpFileRozane',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal10 = new AMIB.persianCalendar('pcaldateStartjobCalcRozaneh', {
        extraInputID: 'pcaldateStartjobCalcRozaneh',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal11 = new AMIB.persianCalendar('pcaldateEndjobCalcRozaneh', {
        extraInputID: 'pcaldateEndjobCalcRozaneh',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal12 = new AMIB.persianCalendar('pcaldateKarardEdit', {
        extraInputID: 'pcaldateKarardEdit',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal13 = new AMIB.persianCalendar('pcaldateMorakhasiRozaneh', {
        extraInputID: 'pcaldateMorakhasiRozaneh',
        extraInputFormat: 'yyyy/mm/dd'
    });

    $('input:text:first').focus();
    var $inp = $('input:text');
    $("#txtEzafekarEdit , #txtEzafekarVijehEdit ,#txtEzafekarInMissionEdit,#txtJomehkarEdit,#txtTatilkarEdit,#txtTakhirEdit,#txtTajilEdit ," +
       "#txtExitJobEdit,#txtMamoriatEdit,#txtGhibatEdit,#txtSumKarardEdit,#txtEndKarardEdit,#txtStartKarardEdit").keypress(function (e) {
           if (e.which == 32)  // the space key code
           {
               if ($(this).val().indexOf(':') > -1 || $(this).val() == "") {
                   return false;
               }
               else {
                   $(this).val($(this).val() + ":");
                   return false;
               }
           }

           var value = $(this).val();
           if ($(this).val().indexOf(':') > -1 && e.which != 8) {
               var array = value.split(':');
               if (array[0].length > 3) {
                   $(this).css("border", "1px solid #ff0000");
                   return false;
               }
               else {
                   $(this).css("border", "");
               }


               if (array[1].length > 2 || parseInt(array[1]) > 59) {
                   $(this).css("border", "1px solid #ff0000");
                   return false;
               }
               else {
                   $(this).css("border", "");
               }
           }
       });

});


//============================================================================
//============================================================================
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
var drpdwnMorakhasiKind = "";
var drpdwnMamoriatKind = "";
var drpdwnWorkJobKind = "";
var drpdwnContractKinds = "";

//============================================================================
//============================================================================
function GetDrpdwnBaseAll() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    drpdwnMorakhasiKind = "";
    drpdwnMamoriatKind = "";
    drpdwnWorkJobKind = "";
    drpdwnContractKinds = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 3 },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            drpdwnMorakhasiKind = data[0];
            drpdwnMamoriatKind = data[1];
            drpdwnWorkJobKind = data[2];
            drpdwnContractKinds = data[3];
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
    selectStart3 = "<select id='{dpdwnId}' class='InputSelectRightToLeftText'  style='width:155px;'  onchange = 'monthkarkardChange();'>";

    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}'>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (type == 1) {
        //--------------------------------------------------------------------------
        //--------------------- morakhasi -------------------------------------------
        allrow = "";
        $.each(drpdwnMorakhasiKind, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnMorakhasiKind");
        $("#TddrpdwnMorakhasiKind").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnSearchMorakhsiKind");
        $("#tddrpdwnSearchMorakhsiKind").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnSearchMorakhsiKindRozane");
        $("#tddrpdwnSearchMorakhsiKindRozane").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- Mamoriat -------------------------------------------
        allrow = "";
        $.each(drpdwnMamoriatKind, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnMamoriatKind");
        $("#TddrpdwnMamoriatKind").html(selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnSearchMissonKind");
        $("#tddrpdwnSearchMissonKind").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- workgroup -------------------------------------------
        allrow = "";
        $.each(drpdwnWorkJobKind, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnWorkJobKind");
        $("#tddrpdwnWorkJobKind").html(selectTemp + option0 + allrow + selectEnd);
        // $("#drpdwnWorkJobKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnSearchWorkJobKind");
        $("#tddrpdwnSearchWorkJobKind").html(selectTemp + allrow + selectEnd);
        $("#drpdwnSearchWorkJobKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnSearchWorkJobKindRozane");
        $("#tddrpdwnSearchWorkJobKindRozane").html(selectTemp + allrow + selectEnd);
        $("#drpdwnSearchWorkJobKindRozane").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });

        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnSearchWorkJobKindMorakhasiRozane");
        $("#tddrpdwnSearchWorkJobKindMorakhasiRozane").html(selectTemp + allrow + selectEnd);
        $("#drpdwnSearchWorkJobKindMorakhasiRozane").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });


        selectTemp = selectStart2.replaceAll("{dpdwnId}", "drpdwnSearchMorakhasiWorkGroupKind");
        $("#tddrpdwnSearchMorakhasiWorkGroupKind").html(selectTemp + allrow + selectEnd);
        $("#drpdwnSearchMorakhasiWorkGroupKind").multiselect({ minWidth: '164', noneSelectedText: 'همه گروه ها' });


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
        $("#DivdrpdwnContractKind").html("نوع قرارداد : " + selectTemp + option0 + allrow + selectEnd);

        selectTemp = selectStart1.replaceAll("{dpdwnId}", "drpdwnSearchContractKind");
        $("#tddrpdwnSearchContractKind").html(selectTemp + allrow + selectEnd);



    }
}
//---------------------------------------------------------------------------------
///=========================== گزارش ثبت اطلاعات کارکرد =========================
//---------------------------------------------------------------------------------
var CntInfoAll = 0;
function GetReportInfoPersonel(vpage) {
    $("#DivBtnSavePersonel").hide();
    $("#pcaldateStartjob").val('');
    $("#pcaldateEndjob").val('');
    $("#drpdwnMonthJob").val('-1');

    CntInfoAll = 0;
    var personelcode = $.trim($("#txtReportPersonelCode").val());
    var name = $.trim($("#txtReportPersonelName").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCode").val());
    var WorkJob = $.trim($("#drpdwnWorkJobKind").val());
    $("#ResultDivPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th>گروه کاری</th><th align='center'>روزهای کارکرد (روز)</th><th>اضافه کار (ساعت)</th><th>جمعه کار (ساعت)</th><th>تعطیل کار (ساعت)</th><th>ماموریت (روز)</th><th>تأخیر (ساعت)</th><th>تعجیل (ساعت)</th><th>غیبت (روز)</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td id='tdpersonelcode{Row}'>{personelcode}</td><td>{name}</td><td>{workgroup}</td><td>{CntRozkarkard}</td><td>{ezafekar}</td><td>{jomekar}</td><td>{tatilkar}</td><td>{mamoriat}</td><td>{takhir}</td><td>{tajil}</td><td>{ghibat}</td></tr>";
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

    var textBox = "<input id='txtWorkGroup{txtBoxName}{Row}' type='text' style='width: 80%;' class='InputTextLeftToRightText' />";
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
        data: { i: 1, personelcode: personelcode, name: name, mellicode: mellicode, WorkJob: WorkJob, page: vpage, perpage: vperpage },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));
                //row = row.replaceAll("{morakhasisaati}", (textBox.replaceAll("{txtBoxName}", "morakhasisaati")));
                //row = row.replaceAll("{estehghaghi}", (textBox.replaceAll("{txtBoxName}", "estehghaghi")));
                //row = row.replaceAll("{estilaji}", (textBox.replaceAll("{txtBoxName}", "estilaji")));
                row = row.replaceAll("{CntRozkarkard}", (textBox.replaceAll("{txtBoxName}", "CntRozkarkard")));
                row = row.replaceAll("{ezafekar}", (textBox.replaceAll("{txtBoxName}", "ezafekar")));
                row = row.replaceAll("{jomekar}", (textBox.replaceAll("{txtBoxName}", "jomekar")));
                row = row.replaceAll("{tatilkar}", (textBox.replaceAll("{txtBoxName}", "tatilkar")));
                row = row.replaceAll("{mamoriat}", (textBox.replaceAll("{txtBoxName}", "mamoriat")));
                row = row.replaceAll("{takhir}", (textBox.replaceAll("{txtBoxName}", "takhir")));
                row = row.replaceAll("{tajil}", (textBox.replaceAll("{txtBoxName}", "tajil")));
                row = row.replaceAll("{ghibat}", (textBox.replaceAll("{txtBoxName}", "ghibat")));
                // row = row.replaceAll("{jarime}", (textBox.replaceAll("{txtBoxName}", "jarime")));
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{Row}", i);
                allrow = allrow + row;
                i++;
                t = 1;
                CntInfoAll++;
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
                $("#DivBtnSavePersonel").show();

            }
            else {
                $("#ResultDivPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
                $("#DivBtnSavePersonel").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonel").html("");
            $("#ResultDivPersonel").hide();
            $("#DivBtnSavePersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== ثبت اطلاعات کارکرد پرسنل =========================
//---------------------------------------------------------------------------------
function SaveTimejobAllMonthley() {
    var infoAll = "";
    var check = 0;
    for (var i = 1; i <= CntInfoAll; i++) {
        if (
            //$.trim($("#txtWorkGroupmorakhasisaati" + i).val()) == ""
            //|| $.trim($("#txtWorkGroupestehghaghi" + i).val()) == "" ||
            //$.trim($("#txtWorkGroupestilaji" + i).val()) == ""  || 
            $.trim($("#txtWorkGroupCntRozkarkard" + i).val()) == "" ||
            $.trim($("#txtWorkGroupezafekar" + i).val()) == "" ||
            $.trim($("#txtWorkGroupjomekar" + i).val()) == "" ||
           $.trim($("#txtWorkGrouptatilkar" + i).val()) == "" ||
           $.trim($("#txtWorkGroupmamoriat" + i).val()) == "" ||
           $.trim($("#txtWorkGrouptakhir" + i).val()) == "" ||
           $.trim($("#txtWorkGrouptajil" + i).val()) == "" ||
           $.trim($("#txtWorkGroupghibat" + i).val()) == "" //||
            //  $.trim($("#txtWorkGroupjarime" + i).val()) =="" 
            ) {
            check = 1;
        }
        infoAll = infoAll + $.trim($("#tdpersonelcode" + i).html()) + "^" +
            //$.trim($("#txtWorkGroupmorakhasisaati" + i).val()) + "^" +
            //$.trim($("#txtWorkGroupestehghaghi" + i).val()) + "^" +
            //$.trim($("#txtWorkGroupestilaji" + i).val()) + "^" +
            $.trim($("#txtWorkGroupCntRozkarkard" + i).val()) + "^" +
            $.trim($("#txtWorkGroupezafekar" + i).val()) + "^" +
            $.trim($("#txtWorkGroupjomekar" + i).val()) + "^" +
            $.trim($("#txtWorkGrouptatilkar" + i).val()) + "^" +
            $.trim($("#txtWorkGroupmamoriat" + i).val()) + "^" +
            $.trim($("#txtWorkGrouptakhir" + i).val()) + "^" +
            $.trim($("#txtWorkGrouptajil" + i).val()) + "^" +
            $.trim($("#txtWorkGroupghibat" + i).val()) + "^";
        //  $.trim($("#txtWorkGroupjarime" + i).val()) + ",";
        // check=1;
    }
    if (check == 1) {
        ShowAlert("لطفا اطلاعات را وارد نمایید !");
        return;
    }
    else if (check == 0) {
        var startdate = $.trim($("#pcaldateStartjob").val());
        var enddate = $.trim($("#pcaldateEndjob").val());
        var month = $("#drpdwnMonthJob").val();

        if (startdate == "" && enddate == "" && month == "-1") {
            ShowAlert("لطفا تاریخ و ماه کارکرد را مشخص نمایید!");
            return;
        }
        else {
            $("#Note").html("آیا از ثبت اطلاعات اطمینان دارید ؟");
            $("#Note").dialog({
                modal: true,
                autoOpen: false,
                resizable: false,
                title: "ثبت کارکرد ماهانه",
                width: 380,
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
                            data: { i: 2, infoAll: infoAll, startdate: startdate, enddate: enddate, month: month },
                            url: "PostBack/PersonelOperation.ashx",
                            success: function (data) {
                                $("#CheckOut").fadeOut();
                                $("#Loading").fadeOut();
                                var arrayResult = data.split('^');
                                if (arrayResult[0] == "3") {
                                    GetReportInfoPersonel(1);
                                    ShowAlert("اطلاعات با موفقیت ثبت شد<br/>کد های پرسنلی زیر قرار دادشان فعال نمی باشد !<br/>" + arrayResult[1]);
                                }
                                else if (data == "1") {
                                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                                    GetReportInfoPersonel(1);
                                }
                                else if (data == "2")
                                    ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");

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
    }


}
//---------------------------------------------------------------------------------
///=========================== ثبت مرخصی =========================================
//---------------------------------------------------------------------------------
function SaveMorakhasiInfo() {
    var PersonelCode = $.trim($("#txtMorakhasiPersonelCode").val());
    var MorakhasiKind = $.trim($("#drpdwnMorakhasiKind").val());
    var dateStartMorakhasiDate = $.trim($("#pcaldateStartMorakhasiDate").val());
    var dateEndMorakhasiDate = $.trim($("#pcaldateEndMorakhasiDate").val());
    var StartTimeMorakhasi = $.trim($("#txtStartTimeMorakhasi").val());
    var EndTimeMorakhasi = $.trim($("#txtEndTimeMorakhasi").val());
    var Description = $.trim($("#txtMorakhasiDescription").val());
    if (PersonelCode == "" || MorakhasiKind == "-1" || dateStartMorakhasiDate == "" || dateEndMorakhasiDate == "" || StartTimeMorakhasi == "" || EndTimeMorakhasi == "" || Description == "") {
        ShowAlert("لطفا اطلاعات را وارد نمایید !");
        return;
    }
    else {
        $("#Note").html("آیا از ثبت اطلاعات اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "ثبت مرخصی",
            width: 380,
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
                        data: { i: 4, PersonelCode: PersonelCode, MorakhasiKind: MorakhasiKind, dateStartMorakhasiDate: dateStartMorakhasiDate, dateEndMorakhasiDate: dateEndMorakhasiDate, StartTimeMorakhasi: StartTimeMorakhasi, EndTimeMorakhasi: EndTimeMorakhasi, Description: Description },
                        url: "PostBack/PersonelOperation.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#txtMorakhasiPersonelCode").val('');
                                $("#drpdwnMorakhasiKind").val('-1');
                                $("#pcaldateStartMorakhasiDate").val('');
                                $("#pcaldateEndMorakhasiDate").val('');
                                $("#txtStartTimeMorakhasi").val('');
                                $("#txtEndTimeMorakhasi").val('');
                                $("#txtMorakhasiDescription").val('');

                                if ($.trim($("#ResultDivMorakhasiPersonel").html()) != "") GetReportInfoMorakhasiPersonel(1);
                            }
                            else if (data == "2")
                                ShowAlert("در این بازه قبلا مرخصی برای این شماره پرسنلی ثبت شده است!");

                            else if (data == "3")
                                ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                            else if (data == "4")
                                ShowAlert("کد پرسنلی وارد شده معتبر نمی باشد!");
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
}
//---------------------------------------------------------------------------------
///============================== ثبت ماموریت ===================================
//---------------------------------------------------------------------------------
function SaveMamoriatInfo() {
    var PersonelCode = $.trim($("#txtMamoriatPersonelCode").val());
    var MamoriatKind = $.trim($("#drpdwnMamoriatKind").val());
    var dateStartMamoriatDate = $.trim($("#pcaldateStartMamoriatDate").val());
    var dateEndMamoriatDate = $.trim($("#pcaldateEndMamoriatDate").val());
    var StartTimeMamoriat = $.trim($("#txtStartTimeMamoriat").val());
    var EndTimeMamoriat = $.trim($("#txtEndTimeMamoriat").val());
    var Description = $.trim($("#txtMamoriatDescription").val());
    if (PersonelCode == "" || MamoriatKind == "-1" || dateStartMamoriatDate == "" || dateEndMamoriatDate == "" || StartTimeMamoriat == "" || EndTimeMamoriat == "" || Description == "") {
        ShowAlert("لطفا اطلاعات را وارد نمایید !");
        return;
    }
    else {
        $("#Note").html("آیا از ثبت اطلاعات اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "ثبت مرخصی",
            width: 380,
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
                        data: { i: 5, PersonelCode: PersonelCode, MamoriatKind: MamoriatKind, dateStartMamoriatDate: dateStartMamoriatDate, dateEndMamoriatDate: dateEndMamoriatDate, StartTimeMamoriat: StartTimeMamoriat, EndTimeMamoriat: EndTimeMamoriat, Description: Description },
                        url: "PostBack/PersonelOperation.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                $("#txtMamoriatPersonelCode").val('');
                                $("#drpdwnMamoriatKind").val('-1');
                                $("#pcaldateStartMamoriatDate").val('');
                                $("#pcaldateEndMamoriatDate").val('');
                                $("#txtStartTimeMamoriat").val('');
                                $("#txtEndTimeMamoriat").val('');
                                $("#txtMamoriatDescription").val('');

                                if ($.trim($("#ResultDivMissonPersonel").html()) != "") GetReportInfoMissonPersonel(1);
                            }
                            else if (data == "2")
                                ShowAlert("در این بازه قبلا ماموریت برای این شماره پرسنلی ثبت شده است!");
                            else if (data == "3")
                                ShowAlert("خطا در ثبت اطلاعات، دوباره امتحان کنید");
                            else if (data == "4")
                                ShowAlert("کد پرسنلی وارد شده معتبر نمی باشد!");
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
}
//---------------------------------------------------------------------------------
///=========================== گزارش مرخصی ماهیانه=======================================
//---------------------------------------------------------------------------------
function GetReportInfoMorakhasiPersonel(vpage) {

    var personelcode = $.trim($("#txtReportMorakhasiPersonelCode").val());
    var name = $.trim($("#txtReportMorakhasiPersonelName").val());
    var mellicode = $.trim($("#txtReportMorakhasiPersonelMelliCode").val());
    var DateFrom = ""; //$("#yearlblMorakhasiDateFrom").val() + "/" + $("#monthlblMorakhasiDateFrom").val() + "/" + $("#daylblMorakhasiDateFrom").val();
    var DateTo = ""; //$("#yearlblMorakhasiDateTo").val() + "/" + $("#monthlblMorakhasiDateTo").val() + "/" + $("#daylblMorakhasiDateTo").val();

    var grohkari = $.trim($("#drpdwnSearchMorakhasiWorkGroupKind").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnSearchMorakhasiWorkGroupKind").val() + "\"";

    var month = $.trim($("#drpdwnMonthMorakhasiMahaneh").val());
    var year = $.trim($("#yearlblMorakhsiMonthDate").val());

    var drpdwnSearchMorakhsiKind = $.trim($("#drpdwnSearchMorakhsiKind").val());
    $("#ResultDivMorakhasiPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivMorakhasiPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    //var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نوع مرخصی</th><th align='center'>تاریخ شروع</th><th align='center'>تاریخ پایان</th><th align='center'>ساعت شروع</th><th>ساعت پایان</th><th>توضیحات</th><th>تاریخ ثبت</th></thead><tbody>";
    //var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{morakhasiKind}</td><td>{startdate}</td><td>{enddate}</td><td>{timestart}</td><td>{timeEnd}</td><td>{desc}</td><td>{dateRegister}</td></tr>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>سال</th><th align='center'>ماه</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th><th align='center'>نوع مرخصی</th><th align='center'>ساعت مرخصی </th><th>تاریخ ثبت</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{year}</td><td>{month}</td><td>{personelcode}</td><td>{name}</td><td>{workgroup}</td><td>{morakhasiKind}</td><td>{timeMorakhasi}</td><td>{dateRegister}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportInfoMorakhasiPersonel(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerMorakhasiPPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountMorakhasiPersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportInfoMorakhasiPersonel({lastpage})'>" +
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
        data: { i: 6, personelcode: personelcode, grohkari: grohkari, month: month, year: year, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, MorakhsiKind: drpdwnSearchMorakhsiKind, page: vpage, perpage: vperpage },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{morakhasiKind}", this['strLeaveName']);
                row = row.replaceAll("{workgroup}", this['strWorkGroupName']);
                row = row.replaceAll("{timeMorakhasi}", this['timeLeaveTime']);
                row = row.replaceAll("{dateRegister}", $.trim(this['dateRegisterDate']));
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{year}", this['numYear']);
                row = row.replaceAll("{month}", this['MonthName']);

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
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportInfoMorakhasiPersonel(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportInfoMorakhasiPersonel(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivMorakhasiPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountMorakhasiPersonel").html(allpage);
            }
            else {
                $("#ResultDivMorakhasiPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivMorakhasiPersonel").html("");
            $("#ResultDivMorakhasiPersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== گزارش ماموریت ====================================
//---------------------------------------------------------------------------------
function GetReportInfoMissonPersonel(vpage) {

    var personelcode = $.trim($("#txtReportMissonPersonelCode").val());
    var name = $.trim($("#txtReportMissonPersonelName").val());
    var mellicode = $.trim($("#txtReportMissonPersonelMelliCode").val());
    var DateFrom = $("#yearlblMissonDateFrom").val() + "/" + $("#monthlblMissonDateFrom").val() + "/" + $("#daylblMissonDateFrom").val();
    var DateTo = $("#yearlblMissonDateTo").val() + "/" + $("#monthlblMissonDateTo").val() + "/" + $("#daylblMissonDateTo").val();

    var drpdwnSearchMissonKind = $.trim($("#drpdwnSearchMissonKind").val());
    $("#ResultDivMissonPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivMissonPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نوع ماموریت</th><th align='center'>تاریخ شروع</th><th align='center'>تاریخ پایان</th><th align='center'>ساعت شروع</th><th>ساعت پایان</th><th>توضیحات</th><th>تاریخ ثبت</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{MissonKind}</td><td>{startdate}</td><td>{enddate}</td><td>{timestart}</td><td>{timeEnd}</td><td>{desc}</td><td>{dateRegister}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportInfoMissonPersonel(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerMissonPPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountMissonPersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportInfoMissonPersonel({lastpage})'>" +
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
        data: { i: 7, personelcode: personelcode, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, MissonKind: drpdwnSearchMissonKind, page: vpage, perpage: vperpage },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{MissonKind}", this['strMissionName']);
                row = row.replaceAll("{startdate}", this['dateStartMissionDate']);
                row = row.replaceAll("{enddate}", this['dateEndMissionDate']);
                row = row.replaceAll("{timestart}", this['timeStartMissionTime']);
                row = row.replaceAll("{timeEnd}", $.trim(this['timeEndMissionTime']));
                row = row.replaceAll("{desc}", $.trim(this['strMissionDescription']));
                row = row.replaceAll("{dateRegister}", $.trim(this['dateRegisterDate']));
                // row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='ShowInfoAllPersonel(\"{personelcode}\");'><img src='images/offline.png' /></a></div>");
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);

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
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportInfoMissonPersonel(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportInfoMissonPersonel(" + nextPage + ")");
            }
            if (t == 1) {
                $("#ResultDivMissonPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountMissonPersonel").html(allpage);
            }
            else {
                $("#ResultDivMissonPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivMissonPersonel").html("");
            $("#ResultDivMissonPersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== گزارش کارکرد ماهانه =============================
//---------------------------------------------------------------------------------
function GetReportKarkardMonthly(vpage) {
    var personelcode = $.trim($("#txtReportKarkardPersonelCode").val());
    var name = $.trim($("#txtReportKarkardPersonelName").val());
    var mellicode = $.trim($("#txtReportKarkardPersonelMelliCode").val());
    var DateFrom = ""; //$("#yearlblKarkardDateFrom").val() + "/" + $("#monthlblKarkardDateFrom").val() + "/" + $("#daylblKarkardDateFrom").val();
    var DateTo = ""; //$("#yearlblKarkardDateTO").val() + "/" + $("#monthlblKarkardDateTO").val() + "/" + $("#daylblKarkardDateTO").val();
    var drpdwnSearchWorkJobKind = $.trim($("#drpdwnSearchWorkJobKind").val());
    drpdwnSearchWorkJobKind = drpdwnSearchWorkJobKind == null || drpdwnSearchWorkJobKind == undefined || drpdwnSearchWorkJobKind == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKind").val() + "\"";

    var contractkind = $.trim($("#drpdwnSearchContractKind").val());


    var month = $.trim($("#drpdwnMonthKarkardMahaneh").val());
    var year = $.trim($("#yearlblMonthKarkardMahanehDate").val());
    //if (month == -1) {
    //    ShowAlert("ماه کارکرد باید مشخص شود !");
    //    return;
    //}

    $("#ResultDivKarkardPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivKarkardPersonel").show();

    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>سال</th><th align='center'>ماه</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th>قرارداد</th><th>گروه کاری</th><th align='center'>روزهای کارکرد (روز)</th><th>اضافه کار (ساعت)</th><th>اضافه کار ویژه (ساعت)</th><th>اضافه کار در ماموریت (ساعت)</th><th>جمعه کار (ساعت)</th><th>تعطیل کار (ساعت)</th><th>ماموریت (روز)</th><th>تأخیر (ساعت)</th><th>تعجیل (ساعت)</th><th>غیبت (روز)</th><th>خروج غیر مجاز (ساعت)</th><th {style}>تعداد فرآیند</th><th>تاریخ ثبت</th><th></th></thead><tbody>";
    var mainrow = "<tr><td id='tdRowRptMonthly{Row}'>{Row}</td><td id='tdYearRptMonthly{Row}'>{year}</td><td id='tdMonthRptMonthly{Row}'>{month}</td><td id='tdPerosnelCodeRptMonthly{Row}'>{personelcode}</td><td id='tdNameRptMonthly{Row}'>{name}</td><td>{contractkind}</td><td id='tdWorkGroupRptMonthly{Row}'>{workgroup}</td><td>{CntRozkarkard}</td><td id='tdEzafekarRptMonthly{Row}'>{ezafekar}</td><td id='tdEzafeKarvijehRptMonthly{Row}'>{ezafekarvijeh}</td><td id='tdEzafeKarInmissionRptMonthly{Row}'>{ezafekarinmission}</td><td id='tdJomehKarRptMonthly{Row}'>{jomekar}</td><td id='tdtatilkarRptMonthly{Row}'>{tatilkar}</td><td id='tdMamoriatRptMonthly{Row}'>{mamoriat}</td><td id='tdTakhirRptMonthly{Row}'>{takhir}</td><td id='tdTajilRptMonthly{Row}'>{tajil}</td><td id='tdGhibatRptMonthly{Row}'>{ghibat}</td><td id='tdExitJobRptMonthly{Row}'>{exitjob}</td><td id='tdCountFaraiandRptMonthly{Row}' {style}>{countFaraiand}</td><td>{dateReg}</td><td>{action}</td></tr>";

    var headerSaati = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>سال</th><th align='center'>ماه</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th>قرارداد</th><th>گروه کاری</th><th>کارکرد (ساعت)</th><th>تاریخ ثبت</th><th></th></thead><tbody>";
    var mainrowSaati = "<tr><td  id='tdRowRptMonthly{Row}'>{Row}</td><td id='tdYearRptMonthly{Row}'>{year}</td><td id='tdMonthRptMonthly{Row}'>{month}</td><td id='tdPerosnelCodeRptMonthly{Row}'>{personelcode}</td><td id='tdNameRptMonthly{Row}'>{name}</td><td>{contractkind}</td><td  id='tdWorkGroupRptMonthly{Row}'>{workgroup}</td><td id='tdTimeJobRptMonthly{Row}'>{timejob}</td><td>{dateReg}</td><td>{action}</td></tr>";


    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportKarkardMonthly(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerKarkardPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordKarkardCountPersonel' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportKarkardMonthly({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";

    var textBox = "<input id='txtWorkGroup{txtBoxName}{Row}' type='text' style='width: 80%;' class='InputTextLeftToRightText' />";
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
        data: { i: 8, personelcode: personelcode, contractkind: contractkind, month: month, year: year, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, WorkJob: drpdwnSearchWorkJobKind, page: vpage, perpage: vperpage },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            if (contractkind == "1" || contractkind == "3") {
                $.each(data[0], function (index) {
                    row = mainrow.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{mellicode}", this['strMelliCode']);
                    row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));
                    row = row.replaceAll("{CntRozkarkard}", $.trim(this['strJobDays']));
                    row = row.replaceAll("{ezafekar}", $.trim(this['strJobOverTime']));
                    row = row.replaceAll("{ezafekarvijeh}", $.trim(this['strJobOverTimeSpecial']));
                    row = row.replaceAll("{ezafekarinmission}", $.trim(this['strJobOverTimeInMission']));
                    row = row.replaceAll("{jomekar}", $.trim(this['strJobFriday']));
                    row = row.replaceAll("{tatilkar}", $.trim(this['strJobHoliDay']));
                    row = row.replaceAll("{mamoriat}", $.trim(this['strJobMission']));
                    row = row.replaceAll("{takhir}", $.trim(this['strJobDelay']));
                    row = row.replaceAll("{tajil}", $.trim(this['strJobEarly']));
                    row = row.replaceAll("{ghibat}", $.trim(this['strJobAbsent']));
                    row = row.replaceAll("{exitjob}", $.trim(this['strJobExit']));
                    row = row.replaceAll("{year}", $.trim(this['numYear']));
                    row = row.replaceAll("{month}", $.trim(this['strMonthName']));
                    row = row.replaceAll("{dateReg}", $.trim(this['dateRegisterDate']));
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{countFaraiand}", this['numCountFaraiandProject']);
                    row = row.replaceAll("{style}", contractkind == "3" ? "" : " style='display:none;'");
                    row = row.replaceAll("{contractkind}", this['strContractKindName']);
                    row = row.replaceAll("{action}", this['numStatus'] == 0 ?  "<a style='cursor:pointer;' onclick='ShowPnlEditItemMonthlyReport({Row},{code},1," + contractkind + ");'><img src='images/edit.png' ></a>"+
                                                                              "<a style='cursor:pointer;' onclick='DeleteItemMonthlyReport({Row},{code},1," + contractkind + ");'><img src='images/delete.png' ></a>" : "");
                    row = row.replaceAll("{code}", this['numMonthlyJobCode']);

                    row = row.replaceAll("{Row}", i);
                    allrow = allrow + row;
                    i++;
                    t = 1;
                });
            }
            else if (contractkind == "2") {
                $.each(data[0], function (index) {
                    row = mainrowSaati.replaceAll("{name}", this['PersonelName']);
                    row = row.replaceAll("{mellicode}", this['strMelliCode']);
                    row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));
                    row = row.replaceAll("{timejob}", $.trim(this['strJobTime']));
                    row = row.replaceAll("{year}", $.trim(this['numYear']));
                    row = row.replaceAll("{month}", $.trim(this['strMonthName']));
                    row = row.replaceAll("{dateReg}", $.trim(this['dateRegisterDate']));
                    row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                    row = row.replaceAll("{contractkind}", this['strContractKindName']);
                    row = row.replaceAll("{action}", this['numStatus'] == 0 ? //"<a style='cursor:pointer;' onclick='ShowPnlEditItemMonthlyReport({Row},{code},2," + contractkind + ");'><img src='images/edit.png' ></a>"+
                        "<a style='cursor:pointer;' onclick='DeleteItemMonthlyReport({Row},{code},2," + contractkind + ");'><img src='images/delete.png' ></a>" : "");
                    row = row.replaceAll("{code}", this['numMonthlyJobSaatiCode']);
                    row = row.replaceAll("{Row}", i);
                    allrow = allrow + row;
                    i++;
                    t = 1;
                });
            }
            var allpage;
            if (AllRecordCount % vperpage == 0) allpage = AllRecordCount / vperpage; else allpage = parseInt(AllRecordCount / vperpage) + 1;
            footerPager = footerPager.replaceAll("{lastpage}", allpage);

            if (parseInt(vpage) <= 1) {
                footerPager = footerPager.replaceAll("{link_prevPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportKarkardMonthly(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportKarkardMonthly(" + nextPage + ")");
            }
            if (t == 1) {
                if (contractkind == "1" || contractkind == "3") {
                    header2 = header2.replaceAll("{style}", contractkind == "3" ? "" : " style='display:none;'");

                    $("#ResultDivKarkardPersonel").html(header + header2 + allrow + footer + footerPager + endfooter);
                }
                else if (contractkind == "2") {
                    $("#ResultDivKarkardPersonel").html(header + headerSaati + allrow + footer + footerPager + endfooter);
                }
                $("#divAllRecordKarkardCountPersonel").html(allpage);

            }
            else {
                $("#ResultDivKarkardPersonel").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivKarkardPersonel").html("");
            $("#ResultDivKarkardPersonel").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//==================================================================================
//=====================================مشاهده دیالوگ ویرایش کارکرد ماهیانه=============================================
//==================================================================================
function ShowPnlEditItemMonthlyReport(row, code, type, contractkind) {
    $("#RozanehCodeEdit").html($("#tdPerosnelCodeRptMonthly" + row).html().trim());
    $("#RozanehNameEdit").html($("#tdNameRptMonthly" + row).html().trim());
    $("#RozanehWorkGroupEdit").html($("#tdWorkGroupRptMonthly" + row).html().trim());
    $("#RozanehMonthYearEdit").html($("#tdMonthRptMonthly" + row).html().trim() + "-" + $("#tdYearRptMonthly" + row).html().trim());
    if (contractkind == 2) {
        $("#trMonthYearRozaneh").hide();
        $("#trGhibatMonthly").hide();
        $("#trMamoriatMonthly").hide();

        $("#trdateKarardRozaneh").hide();
        $("#trStartKarardRozaneh").hide();
        $("#trEndKarardRozaneh").hide();
        $("#trSumKarardRozaneh").hide();
        $("#trGhibatRozaneh").hide();
        $("#trMamoriatRozaneh").hide();
    }
    else {
        $("#trMonthYearRozaneh").show();
        $("#trGhibatMonthly").show();
        $("#trMamoriatMonthly").show();
        if (contractkind == 3) {
            $("#trCountFaraiandMonthly").show();
            $("#txtCountFaraiandMonthlyEdit").val($("#tdCountFaraiandRptMonthly" + row).html().trim());
        }
        else {
            $("#trCountFaraiandMonthly").hide();
            $("#txtCountFaraiandMonthlyEdit").val("");
        }
        $("#trdateKarardRozaneh").hide();
        $("#trStartKarardRozaneh").hide();
        $("#trEndKarardRozaneh").hide();
        $("#trSumKarardRozaneh").hide();
        $("#trGhibatRozaneh").hide();
        $("#trMamoriatRozaneh").hide();

        $("#txtEzafekarEdit").val($("#tdEzafekarRptMonthly" + row).html().trim());
        $("#txtEzafekarVijehEdit").val($("#tdEzafeKarvijehRptMonthly" + row).html().trim());
        $("#txtEzafekarInMissionEdit").val($("#tdEzafeKarInmissionRptMonthly" + row).html().trim());
        $("#txtJomehkarEdit").val($("#tdJomehKarRptMonthly" + row).html().trim());
        $("#txtTatilkarEdit").val($("#tdtatilkarRptMonthly" + row).html().trim());
        $("#txtTakhirEdit").val($("#tdTakhirRptMonthly" + row).html().trim());
        $("#txtTajilEdit").val($("#tdTajilRptMonthly" + row).html().trim());
        $("#txtGhibatMonthlyEdit").val($("#tdGhibatRptMonthly" + row).html().trim());
        $("#txtMamoriatMonthlyEdit").val($("#tdMamoriatRptMonthly" + row).html().trim());
        $("#txtExitJobEdit").val($("#tdExitJobRptMonthly" + row).html().trim());
    }
    $("#pnlEditKarkardRozaneh").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش کارکرد ماهیانه",
        width: 400,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {
          
                SaveEditKarkardMonthly(row, code, contractkind);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });
    $("#pnlEditKarkardRozaneh").dialog("open");
}
//==================================================================================
function SaveEditKarkardMonthly(row, code, contractkind) {
    var personelcode=$("#tdPerosnelCodeRptMonthly"+row.toString()).html().trim();
 
    var ezafekar = $("#txtEzafekarEdit").val().trim();
    var jomehkar = $("#txtJomehkarEdit").val().trim();
    var tatilkar = $("#txtTatilkarEdit").val().trim();
    var takhir = $("#txtTakhirEdit").val().trim();
    var tajilkar = $("#txtTajilEdit").val().trim();
    var ghibat = $("#txtGhibatMonthlyEdit").val().trim();
    var mamoriat = $("#txtMamoriatMonthlyEdit").val().trim();
    var exitjob = $("#txtExitJobEdit").val().trim();
    var ezafekarspicial = $("#txtEzafekarVijehEdit").val().trim();
    var ezafekarInMission = $("#txtEzafekarInMissionEdit").val().trim();

    if (ezafekar == "" || jomehkar == "" || tatilkar == "" || takhir == ""
        || tajilkar == "" || ghibat == "" || mamoriat == "" || exitjob == "" || ezafekarspicial=="") {
        ShowAlert("لطفا اطلاعات را تکمیل نمایید !");
        return;
    }
    $("#pnlEditKarkardRozaneh").dialog("close");
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: {
            i: 19, code: code, personelcode: personelcode,   ezafekar: ezafekar, jomehkar: jomehkar, tatilkar: tatilkar, takhir: takhir
        , tajilkar: tajilkar, ghibat: ghibat, mamoriat: mamoriat, exitjob: exitjob, ezafekarspicial: ezafekarspicial, ezafekarInMission: ezafekarInMission, type: 2
        },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == '1') {
                GetReportKarkardMonthly(1);
                ShowAlert("اطلاعات با موفقیت ویرایش شد");

                //$("#tddatekarkard" + row).html($("#pcaldateKarardEdit").val());
                //$("#tdstartkarkard" + row).html($("#txtStartKarardEdit").val());
                //$("#tdEndkarkard" + row).html($("#txtEndKarardEdit").val());
                //$("#tdsumkarkard" + row).html($("#txtSumKarardEdit").val());
                //$("#tdEzafeKar" + row).html($("#txtEzafekarEdit").val());
                //$("#tdJomekar" + row).html($("#txtJomehkarEdit").val());
                //$("#tdTatilkar" + row).html($("#txtTatilkarEdit").val());
                //$("#tdTakhir" + row).html($("#txtTakhirEdit").val());
                //$("#tdTajil" + row).html($("#txtTajilEdit").val());
                //$("#tdGhibat" + row).html($("#txtGhibatEdit").val());
                //$("#tdMamoriat" + row).html($("#txtMamoriatEdit").val());
                //$("#tdExit" + row).html($("#txtExitJobEdit").val());
            }
            else if (data == '2') {
                ShowAlert("اطلاعات کارکرد یافت نشد !");
                $("#tdRowRptMonthly" + row).remove();
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
//==================================================================================
function DeleteItemMonthlyReport(row, code, type, contractkind)
{
    if(confirm("آیا از حذف کارکرد ماهانه این پرسنل اطمینان دارید ؟"))
    {
        var personelcode = $("#tdPerosnelCodeRptMonthly" + row.toString()).html().trim();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: {
                i: 22, code: code, personelcode: personelcode, contractkind: contractkind
            },
            url: "PostBack/PersonelOperation.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#tdRowRptMonthly" + row).remove();
                    ShowAlert("اطلاعات با موفقیت حذف شد");
                    GetReportKarkardMonthly(1);
                   
                }
                else if (data == '2') {
                    ShowAlert("اطلاعات کارکرد یافت نشد !");
                    $("#tdRowRptMonthly" + row).remove();
                    GetReportKarkardMonthly(1);
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
//==================================================================================
function changeValueUpFile(txtName, upfilename) {
    $("#" + txtName).val($("#" + upfilename).val());
}
//---------------------------------------------------------------------------------
///=================== اگر کارکرد فروردین بود 2 تا فایل باید آپلود شود =========
//---------------------------------------------------------------------------------
function monthkarkardChange() {
    var month = $("#drpdwnMonthJobUpFile").val();
    var contractKind = $("#drpdwnContractKind").val();

    if (month == -1 || contractKind == -1) {
        $("#divkarkardMonth").hide();
        $("#divkarkardMonthEsfand").hide();
        $("#DivbtnSaveKarkard").hide();
    }
    else {

        $("#divkarkardMonth").show();
        $("#DivbtnSaveKarkard").show();

        $("#pcaldateStartjobUpFile").val("");
        $("#pcaldateEndjobUpFile").val("");

        $("#txtUpkarkardPersonel").val("");
        $("#uploadFilekarkardPersonel").val("");

        $("#pcaldateStartjobUpFileEsfand").val("");
        $("#pcaldateEndjobUpFileEsfand").val("");
        $("#txtUpkarkardPersonelEsfand").val("");
        $("#uploadFilekarkardPersonelEsfand").val("");
        $("#DivErrorKarkardMahane").html("");
        $("#DivErrorKarkardMahane").hide();
    }

    if (month == 1) {
        $("#divkarkardMonthEsfand").hide();
        //$("#divkarkardMonthEsfand").show();
        //$("#pcaldateStartjobUpFileEsfand").val("");
        //$("#pcaldateEndjobUpFileEsfand").val("");
        //$("#txtUpkarkardPersonelEsfand").val("");
        //$("#uploadFilekarkardPersonelEsfand").val("");
    }
    else {
        $("#divkarkardMonthEsfand").hide();
    }
}
//---------------------------------------------------------------------------------
///==================== آپلود کارکرد ماهانه =====================================
//---------------------------------------------------------------------------------
function UpFileKarkard() {
    var month = $("#drpdwnMonthJobUpFile").val();
    var contractKind = $("#drpdwnContractKind").val();
    //if(month==1)
    //{
    //    var datefromesfand= $.trim($("#pcaldateStartjobUpFileEsfand").val());
    //    var datetoesfand = $.trim($("#pcaldateEndjobUpFileEsfand").val());
    //    var datefrom = $.trim($("#pcaldateStartjobUpFile").val());
    //    var dateto = $.trim($("#pcaldateEndjobUpFile").val());

    //    var filekarkardesfand = $.trim($("#txtUpkarkardPersonelEsfand").val());
    //    var filekarkard = $.trim($("#txtUpkarkardPersonel").val());


    //    if (datefromesfand == "" || datetoesfand == "" || datefrom == "" || dateto == "" || filekarkardesfand == "" || filekarkard == "")
    //    {
    //        ShowAlert("لطفا اطلاعات خواسته شده را به دقت وارد نمایید!");
    //        return;
    //    }
    //    var upfilename = "uploadFilekarkardPersonel";
    //    var upfilenameEsfand = "uploadFilekarkardPersonelEsfand";
    //    //alert($("#" + upfilename).val());
    //    //alert($("#" + upfilenameEsfand).val());
    //    if (($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null) && ($("#" + upfilenameEsfand).val() != "" && $("#" + upfilenameEsfand).val() != null)) {

    //            var fd = new FormData();

    //            fd.append("UpFilekarkard", document.getElementById(upfilename).files[0]);
    //            fd.append("UpFilekarkardEsfand", document.getElementById(upfilenameEsfand).files[0]);
    //            fd.append("i", 9);
    //            fd.append("month", month);
    //            fd.append("datefromesfand", datefromesfand);
    //            fd.append("datetoesfand", datetoesfand);
    //            fd.append("datefrom", datefrom);
    //            fd.append("dateto", dateto);

    //            $("#CheckOut").fadeIn();
    //            $("#Loading").fadeIn();

    //            $.ajax({
    //                type: "POST",
    //                async: true,
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //                dataType: "json",
    //                data: fd,
    //                url: "PostBack/PersonelOperation.ashx",
    //                success: function (data) {
    //                    $("#CheckOut").fadeOut();
    //                    $("#Loading").fadeOut();

    //                    if(data=="1")
    //                    {
    //                        ShowAlert("اطلاعات با موفقیت ثبت شد");
    //                        $("#drpdwnMonthJobUpFile").val(-1);
    //                        monthkarkardChange();
    //                    }
    //                    else if(data=="2")
    //                    {
    //                        ShowAlert("فرمت فایل اکسل نمی باشد!");
    //                    }
    //                    else if(data=="3")
    //                    {
    //                        ShowAlert("خطا در ثبت اطلاعات لطفا مجددا تلاش نمایید!");
    //                    }
    //                }
    //            });

    //    }
    //    else {
    //        ShowAlert("ابتدا فایل کارکرد مورد نظر را بارگزاری نمایید!");
    //    }
    //}
    //else
    //{
    $("#DivErrorKarkardMahane").hide();
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
        fd.append("i", 9);
        fd.append("month", month);
        fd.append("datefrom", datefrom);
        fd.append("dateto", dateto);
        fd.append("contractKind", contractKind);

        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();

        var header = "<table id='tableErrorKarkardMahane' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
        var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th></th></thead><tbody>";
        var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{errTitle}</td></tr>";
        var footer = "</tbody></table>";
        var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelErrorKarkarMahane' type='button' value='خروجی اکسل' onclick='ExcelReportTable('tableErrorKarkardMahane');'/></div>";

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: fd,
            url: "PostBack/PersonelOperation.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();

                if (data == "1") {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    $("#drpdwnMonthJobUpFile").val(-1);
                    monthkarkardChange();
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
                        row = row.replaceAll("{errTitle}", this['ErrorCode'] == "0" ? "کد پرسنلی یافت نشد" : this['ErrorCode'] == "1" ? "با موفقیت انجام شد" : this['ErrorCode'] == "2" ? "کد پرسنلی غیر فعال در سیستم" : this['ErrorCode'] == "3" ? "قطع همکاری" : this['ErrorCode'] == "4" ? "این کد پرسنلی قبلا در این سال و ماه<br/> تسویه حساب انجام داده است" : this['ErrorCode'] == "5" ? "قرارداد غیرفعال شده" : this['ErrorCode'] == "6" ? "قرارداد این کد پرسنلی با این قرارداد یکی نیست" : "");
                        i = i + 1;
                        allrow = allrow + row;
                        t = 1;
                    });

                    if (t == 1) {
                        $("#DivErrorKarkardMahane").html(header + header2 + allrow + footer + btnExcel);
                        $("#DivErrorKarkardMahane").show();
                        $("#btnExcelErrorKarkarMahane").buttons();
                    }
                    else {
                        $("#DivErrorKarkardMahane").hide();
                    }
                }
            }
        });

    }
    else {
        ShowAlert("ابتدا فایل کارکرد مورد نظر را بارگزاری نمایید!");
    }
    // }
}
//---------------------------------------------------------------------------------
///==================== آپلود کارکرد روزانه =====================================
//---------------------------------------------------------------------------------
function UpFileKarkardRozane() {
    $("#DivErrorKarkardRozaneh").hide();
    $("#DivButtonErrorKarkardRozaneh").hide();

    var date = $.trim($("#pcaldateStartjobUpFileRozane").val());
    var filekarkard = $.trim($("#txtUpkarkardPersonelRozane").val());
    if (date == "" || filekarkard == "") {
        ShowAlert("لطفا اطلاعات خواسته شده را به دقت وارد نمایید!");
        return;
    }
    var upfilename = "uploadFilekarkardPersonelRozane";
    if (($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null)) {

        var fd = new FormData();

        fd.append("UpFilekarkard", document.getElementById(upfilename).files[0]);
        fd.append("i", 10);
        fd.append("date", date);

        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();

        var header = "<table id='tableErrorKarkardRozaneh' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
        var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th></th></thead><tbody>";
        var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{errTitle}</td></tr>";
        var footer = "</tbody></table>";
        /// var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelErrorKarkarRozaneh' type='button' value='خروجی اکسل' onclick='ExcelReportTable('tableErrorKarkardRozaneh');'/></div>";

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: fd,
            url: "PostBack/PersonelOperation.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();

                if (data == "1") {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    $("#drpdwnMonthJobUpFile").val(-1);
                    monthkarkardChange();
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
                        row = row.replaceAll("{errTitle}", this['ErrorCode'] == "0" ? "کد پرسنلی یافت نشد" : this['ErrorCode'] == "1" ? "با موفقیت انجام شد" : this['ErrorCode'] == "2" ? "کد پرسنلی غیر فعال در سیستم" : this['ErrorCode'] == "3" ? "قطع همکاری" : this['ErrorCode'] == "4" ? "این کد پرسنلی قبلا در این سال و ماه<br/> تسویه حساب انجام داده است" : this['ErrorCode'] == "5" ? "قرارداد غیرفعال شده" : this['ErrorCode'] == "6" ? "قرارداد این کد پرسنلی با این قرارداد یکی نیست" : "");
                        i = i + 1;
                        allrow = allrow + row;
                        t = 1;
                    });

                    if (t == 1) {
                        $("#DivErrorKarkardRozaneh").html(header + header2 + allrow + footer);
                        $("#DivButtonErrorKarkardRozaneh").show();
                        $("#DivErrorKarkardRozaneh").show();
                        $("#btnExcelErrorKarkarRozaneh").buttons();
                    }
                    else {
                        $("#DivErrorKarkardRozaneh").hide();
                        $("#DivButtonErrorKarkardRozaneh").hide();
                    }
                }
            }
        });

    }
    else {
        ShowAlert("ابتدا فایل کارکرد مورد نظر را بارگزاری نمایید!");
    }

}
//---------------------------------------------------------------------------------
///=========================== گزارش کارکرد روزانه =============================
//---------------------------------------------------------------------------------
Number.prototype.padDigit = function () {
    return (this < 10) ? '0' + this : this;
}
//---------------------------------------------------------------------------------
function CalcTime(TimeAll, TimeOne) {
    var mins = 0;
    var hrs = 0;
    var t1 = TimeAll.split(':');
    var t2 = TimeOne.split(':');
    mins = Number(t1[1]) + Number(t2[1]);
    var minhrs = Math.floor(parseInt(mins / 60));
    hrs = Number(t1[0]) + Number(t2[0]) + minhrs;
    mins = mins % 60;
    return (hrs.padDigit() + ':' + mins.padDigit())
}
//---------------------------------------------------------------------------------
function GetReportKarkardDaily(vpage) {
    var personelcode = $.trim($("#txtReportKarkardPersonelCodeRozane").val());
    var name = $.trim($("#txtReportKarkardPersonelNameRozane").val());
    var mellicode = $.trim($("#txtReportKarkardPersonelMelliCodeRozane").val());
    var status = $.trim($("#drpdwnstatusDailyjob").val());
    
    var DateFrom = $("#yearlblDateFromRozane").val() + "/" + $("#monthlblDateFromRozane").val() + "/" + $("#daylblDateFromRozane").val();
    var DateTo = $("#yearlblDateToRozane").val() + "/" + $("#monthlblDateToRozane").val() + "/" + $("#daylblDateToRozane").val();
    var drpdwnSearchWorkJobKind = $.trim($("#drpdwnSearchWorkJobKindRozane").val());
    drpdwnSearchWorkJobKind = drpdwnSearchWorkJobKind == null || drpdwnSearchWorkJobKind == undefined || drpdwnSearchWorkJobKind == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKindRozane").val() + "\"";

    $("#ResultDivKarkardPersonelRozane").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivKarkardPersonelRozane").show();

    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th style='display:none;'>کد </th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th>گروه کاری</th><th align='center'>تاریخ کارکرد</th><th>ساعت شروع کارکرد</th><th>ساعت پایان کارکرد</th><th>مجموع ساعت کارکرد (ساعت)</th><th>اضافه کار (ساعت)</th><th>اضافه کار ویژه(ساعت)</th><th>اضافه کار در ماموریت (ساعت)</th><th>جمعه کار (ساعت)</th><th>تعطیل کار (ساعت)</th><th>تأخیر (ساعت)</th><th>تعجیل (ساعت)</th><th>غیبت (روز)</th><th>ماموریت (روز)</th><th>خروج غیر مجاز (ساعت)</th><th>تاریخ ثبت</th><th>وضعیت</th></thead><tbody>";  //<th></th></thead><tbody>";
    var mainrow = "<tr id='trRowKarkard{Row}'><td>{Row}</td><td style='display:none;' id='tdCodeKarkard{Row}'>{code}</td><td id='tdpersonelcode{Row}'>{personelcode}</td><td id='tdname{Row}'>{name}</td><td id='tdworkGroup{Row}'>{workgroup}</td><td id='tddatekarkard{Row}'>{datekarkard}</td><td id='tdstartkarkard{Row}'>{start}</td><td id='tdEndkarkard{Row}'>{end}</td><td id='tdsumkarkard{Row}'>{sumkarkard}</td><td id='tdEzafeKar{Row}'>{ezafekar}</td><td id='tdEzafeKarspecial{Row}'>{ezafekarvije}</td><td id='tdEzafeKarDarMamoriat{Row}'>{ezafekarDarMamoriat}</td><td id='tdJomekar{Row}'>{jomekar}</td><td id='tdTatilkar{Row}'>{tatilkar}</td><td id='tdTakhir{Row}'>{takhir}</td><td id='tdTajil{Row}'>{tajil}</td><td id='tdGhibat{Row}'>{ghibat}</td><td id='tdMamoriat{Row}'>{mamoriat}</td><td id='tdExit{Row}'>{exit}</td><td>{dateReg}</td><td>{statusdailyjob}</td></tr>"; // <td>{action}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportKarkardDaily(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerKarkardPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordKarkardCountPersonelRozane' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportKarkardDaily({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";
    var sumTimeShow = "<tr style='background-color:darkkhaki;' ><td colspan='7' align='left'>مجموع کارکرد ها :</td><td >{sumkarkard}</td><td >{sumezafekar}</td><td >{SumezafekarVijeh}</td><td >{SumezafekarInMission}</td><td>{sumjomekar}</td><td >{sumtatilkar}</td><td >{sumtakhir}</td><td >{sumtajil}</td><td >{sumghibat}</td><td >{summamoriat}</td><td >{sumexit}</td><td></td><td></td></tr>";

    var textBox = "<input id='txtWorkGroup{txtBoxName}{Row}' type='text' style='width: 80%;' class='InputTextLeftToRightText' />";
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
        data: { i: 11, personelcode: personelcode,status:status, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, WorkJob: drpdwnSearchWorkJobKind, page: vpage, perpage: vperpage },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var StartJobTime = "00:00";
            var EndJobTime = "00:00";
            var JobOverTime = "00:00";
            var JobMission = "00:00";
            var JobDelay = "00:00";
            var JobEarly = "00:00";
            var JobAbsent = "00:00";
            var JobExit = "00:00";
            var JobFriday = "00:00";
            var JobHoliDay = "00:00";
            var JobDays = "00:00";
            var JobOverTimeSpecial = "00:00";
            var JobInMission = "00:00";

            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{workgroup}", $.trim(this['strWorkGroupName']));
                row = row.replaceAll("{datekarkard}", $.trim(this['dateKarkardRozaneDate']));

                StartJobTime = CalcTime(StartJobTime, $.trim(this['strStartJobTime']));
                EndJobTime = CalcTime(EndJobTime, $.trim(this['strEndJobTime']));
                JobOverTime = CalcTime(JobOverTime, $.trim(this['strJobOverTime']));
                JobOverTimeSpecial = CalcTime(JobOverTimeSpecial, $.trim(this['strJobOverTimeSpecial']));
                JobInMission = CalcTime(JobInMission, $.trim(this['strJobOverTimeInMission']));
                JobMission = CalcTime(JobMission, $.trim(this['strJobMission']));
                JobDelay = CalcTime(JobDelay, $.trim(this['strJobDelay']));
                JobEarly = CalcTime(JobEarly, $.trim(this['strJobEarly']));
                JobAbsent = CalcTime(JobAbsent, $.trim(this['strJobAbsent']));
                JobExit = CalcTime(JobExit, $.trim(this['strJobExit']));
                JobFriday = CalcTime(JobFriday, $.trim(this['strJobFriday']));
                JobHoliDay = CalcTime(JobHoliDay, $.trim(this['strJobHoliDay']));
                JobDays = CalcTime(JobDays, $.trim(this['strJobDays']));
                
                row = row.replaceAll("{start}", ($.trim(this['strStartJobTime']) == "" && $.trim(this['strEndJobTime']) == "" &&
                                                ($.trim(this['strJobOverTime']) == "00:00" && $.trim(this['strJobOverTimeSpecial']) == "00:00" &&
                                                 $.trim(this['strJobOverTimeInMission']) == "00:00" &&
                                                 $.trim(this['strJobMission']) == "00:00" && $.trim(this['strJobDelay']) == "00:00" &&
                                                 $.trim(this['strJobEarly']) == "00:00" && $.trim(this['strJobAbsent']) == "00:00" &&
                                                 $.trim(this['strJobExit']) == "00:00" && $.trim(this['strJobFriday']) == "00:00" &&
                                                 $.trim(this['strJobHoliDay']) == "00:00" && $.trim(this['strJobDays']) == "00:00")) ?
                                                 "<font style='color:#ff0000;'>تعطیل </font>" :
                                                 ($.trim(this['strStartJobTime']) == "" && $.trim(this['strEndJobTime']) == "" &&
                                                ($.trim(this['strJobOverTime']) != "00:00" || $.trim(this['strJobOverTimeSpecial']) != "00:00" ||
                                                $.trim(this['strJobOverTimeInMission']) == "00:00" ||
                                                 $.trim(this['strJobMission']) != "00:00" || $.trim(this['strJobDelay']) != "00:00" ||
                                                 $.trim(this['strJobEarly']) != "00:00" || $.trim(this['strJobAbsent']) != "00:00" ||
                                                 $.trim(this['strJobExit']) != "00:00" || $.trim(this['strJobFriday']) != "00:00" ||
                                                 $.trim(this['strJobHoliDay']) != "00:00" || $.trim(this['strJobDays']) != "00:00")) ?
                                                  "<font style='color:#039be5;'>عدم حضور</font>" : ($.trim(this['strStartJobTime']) == "" && $.trim(this['strEndJobTime']) != "") ? "<font style='color:fuchsia;'>ثبت نشده </font>" : $.trim(this['strStartJobTime']));
                row = row.replaceAll("{end}", ($.trim(this['strStartJobTime']) == "" && $.trim(this['strEndJobTime']) == "" &&
                                                ($.trim(this['strJobOverTime']) == "00:00" && $.trim(this['strJobOverTimeSpecial']) == "00:00" &&
                                                $.trim(this['strJobOverTimeInMission']) == "00:00" &&
                                                 $.trim(this['strJobMission']) == "00:00" && $.trim(this['strJobDelay']) == "00:00" &&
                                                 $.trim(this['strJobEarly']) == "00:00" && $.trim(this['strJobAbsent']) == "00:00" &&
                                                 $.trim(this['strJobExit']) == "00:00" && $.trim(this['strJobFriday']) == "00:00" &&
                                                 $.trim(this['strJobHoliDay']) == "00:00" && $.trim(this['strJobDays']) == "00:00")) ?
                                                 "<font style='color:#ff0000;'>تعطیل </font>" :
                                                 ($.trim(this['strStartJobTime']) == "" && $.trim(this['strEndJobTime']) == "" &&
                                                ($.trim(this['strJobOverTime']) != "00:00" || $.trim(this['strJobOverTimeSpecial']) != "00:00" ||
                                                $.trim(this['strJobOverTimeInMission']) == "00:00" ||
                                                 $.trim(this['strJobMission']) != "00:00" || $.trim(this['strJobDelay']) != "00:00" ||
                                                 $.trim(this['strJobEarly']) != "00:00" || $.trim(this['strJobAbsent']) != "00:00" ||
                                                 $.trim(this['strJobExit']) != "00:00" || $.trim(this['strJobFriday']) != "00:00" ||
                                                 $.trim(this['strJobHoliDay']) != "00:00" || $.trim(this['strJobDays']) != "00:00")) ?
                                                  "<font style='color:#039be5;'>عدم حضور</font>" : ($.trim(this['strStartJobTime']) != "" && $.trim(this['strEndJobTime']) == "") ? "<font style='color:fuchsia;'>ثبت نشده </font>" : $.trim(this['strEndJobTime']));
                row = row.replaceAll("{ezafekar}", $.trim(this['strJobOverTime']));
                row = row.replaceAll("{ezafekarvije}", $.trim(this['strJobOverTimeSpecial']));
                row = row.replaceAll("{ezafekarDarMamoriat}", $.trim(this['strJobOverTimeInMission']));
                
                row = row.replaceAll("{mamoriat}", $.trim(this['strJobMission']));
                row = row.replaceAll("{takhir}", $.trim(this['strJobDelay']));
                row = row.replaceAll("{tajil}", $.trim(this['strJobEarly']));
                row = row.replaceAll("{ghibat}", $.trim(this['strJobAbsent']));
                row = row.replaceAll("{exit}", $.trim(this['strJobExit']));
                row = row.replaceAll("{jomekar}", $.trim(this['strJobFriday']));
                row = row.replaceAll("{tatilkar}", $.trim(this['strJobHoliDay']));
                row = row.replaceAll("{sumkarkard}", $.trim(this['strJobDays']));
                row = row.replaceAll("{dateReg}", $.trim(this['dateRegisterDate']));
                row = row.replaceAll("{action}", this['numStatus'] == 0 ? "<a onclick='EditKarkardRozaneh({Row}); return false;' style='cursor:pointer;'><img src='images/edit.png'/></a>" : "");
                row = row.replaceAll("{statusdailyjob}", this['numStatus'] == 0 ? "<font style='color:red;'>محاسبه نشده</font>" : "<font style='color:green;'>محاسبه شده</font>");
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{code}", this['numDailyJobCode']);
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportKarkardDaily(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportKarkardDaily(" + nextPage + ")");
            }
            if (t == 1) {
                sumTimeShow = sumTimeShow.replaceAll("{sumstart}", StartJobTime);
                sumTimeShow = sumTimeShow.replaceAll("{sumend}", EndJobTime);
                sumTimeShow = sumTimeShow.replaceAll("{sumezafekar}", JobOverTime);
                sumTimeShow = sumTimeShow.replaceAll("{summamoriat}", JobMission);
                sumTimeShow = sumTimeShow.replaceAll("{sumtakhir}", JobDelay);
                sumTimeShow = sumTimeShow.replaceAll("{sumtajil}", JobEarly);
                sumTimeShow = sumTimeShow.replaceAll("{sumghibat}", JobAbsent);
                sumTimeShow = sumTimeShow.replaceAll("{sumexit}", JobExit);
                sumTimeShow = sumTimeShow.replaceAll("{sumjomekar}", JobFriday);
                sumTimeShow = sumTimeShow.replaceAll("{sumtatilkar}", JobHoliDay);
                sumTimeShow = sumTimeShow.replaceAll("{sumkarkard}", JobDays);

                sumTimeShow = sumTimeShow.replaceAll("{SumezafekarVijeh}", JobOverTimeSpecial);
                sumTimeShow = sumTimeShow.replaceAll("{SumezafekarInMission}", JobInMission);

                $("#ResultDivKarkardPersonelRozane").html(header + header2 + allrow + sumTimeShow + footer + footerPager + endfooter);
                $("#divAllRecordKarkardCountPersonelRozane").html(allpage);
            }
            else {
                $("#ResultDivKarkardPersonelRozane").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivKarkardPersonelRozane").html("");
            $("#ResultDivKarkardPersonelRozane").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
//----------------------------------------ویرایش کارکرد روزانه-----------------------------------------
//---------------------------------------------------------------------------------
function EditKarkardRozaneh(row) {
    var code = $("#tdCodeKarkard" + row).html().trim();
    var personelcode = $("#tdpersonelcode" + row).html().trim();

    $("#trMonthYearRozaneh").hide();
    $("#trGhibatMonthly").hide();
    $("#trMamoriatMonthly").hide();
    $("#trCountFaraiandMonthly").hide();

    $("#trdateKarardRozaneh").show();
    $("#trStartKarardRozaneh").show();
    $("#trEndKarardRozaneh").show();
    $("#trSumKarardRozaneh").show();
    $("#trGhibatRozaneh").show();
    $("#trMamoriatRozaneh").show();

    $("#RozanehCodeEdit").html($("#tdpersonelcode" + row).html().trim());
    $("#RozanehNameEdit").html($("#tdname" + row).html().trim());
    $("#RozanehWorkGroupEdit").html($("#tdworkGroup" + row).html().trim());
    $("#pcaldateKarardEdit").val($("#tddatekarkard" + row).html().trim());
    $("#txtStartKarardEdit").val($("#tdstartkarkard" + row).html().trim());
    $("#txtEndKarardEdit").val($("#tdEndkarkard" + row).html().trim());
    $("#txtSumKarardEdit").val($("#tdsumkarkard" + row).html().trim());
    $("#txtEzafekarEdit").val($("#tdEzafeKar" + row).html().trim());
    $("#txtJomehkarEdit").val($("#tdJomekar" + row).html().trim());
    $("#txtTatilkarEdit").val($("#tdTatilkar" + row).html().trim());
    $("#txtTakhirEdit").val($("#tdTakhir" + row).html().trim());
    $("#txtTajilEdit").val($("#tdTajil" + row).html().trim());
    $("#txtGhibatEdit").val($("#tdGhibat" + row).html().trim());
    $("#txtMamoriatEdit").val($("#tdMamoriat" + row).html().trim());
    $("#txtExitJobEdit").val($("#tdExit" + row).html().trim());

    $("#pnlEditKarkardRozaneh").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش کارکرد روزانه",
        width: 400,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {
                $(this).dialog("close");
                $("#Loading").fadeIn();
                $("#CheckOut").fadeIn();
                SaveEditKarkardRozaneh(row, code, personelcode);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });



    $("#pnlEditKarkardRozaneh").dialog("open");

}
//---------------------------------------------------------------------------------
//------------------------------------sabte viraiesh karakrde rozaneh---------------------------------------------
//---------------------------------------------------------------------------------
function SaveEditKarkardRozaneh(row, code, personelcode) {
    var datekarkard = $("#pcaldateKarardEdit").val().trim();
    var startkarkard = $("#txtStartKarardEdit").val().trim();
    var endkarard = $("#txtEndKarardEdit").val().trim();
    var sumkarkard = $("#txtSumKarardEdit").val().trim();
    var ezafekar = $("#txtEzafekarEdit").val().trim();
    var jomehkar = $("#txtJomehkarEdit").val().trim();
    var tatilkar = $("#txtTatilkarEdit").val().trim();
    var takhir = $("#txtTakhirEdit").val().trim();
    var tajilkar = $("#txtTajilEdit").val().trim();
    var ghibat = $("#txtGhibatEdit").val().trim();
    var mamoriat = $("#txtMamoriatEdit").val().trim();
    var exitjob = $("#txtExitJobEdit").val().trim();
    var ezafekarspicial = $("#txtEzafekarVijehEdit").val().trim();
    var ezafekarInMission = $("#txtEzafekarInMissionEdit").val().trim();

    if (datekarkard == "" || startkarkard == "" || endkarard == "" || sumkarkard == "" || ezafekar == "" || jomehkar == "" || tatilkar == "" || takhir == ""
        || tajilkar == "" || ghibat == "" || mamoriat == "" || exitjob == "" || ezafekarspicial == "" || ezafekarInMission == "") {
        ShowAlert("لطفا اطلاعات را تکمیل نمایید !");
        return;
    }
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: {
            i: 19, code: code, personelcode: personelcode, datekarkard: datekarkard, startkarkard: startkarkard, endkarard: endkarard, sumkarkard: sumkarkard, ezafekar: ezafekar, jomehkar: jomehkar, tatilkar: tatilkar, takhir: takhir
        , tajilkar: tajilkar, ghibat: ghibat, mamoriat: mamoriat, exitjob: exitjob, ezafekarspicial: ezafekarspicial, ezafekarInMission: ezafekarInMission, type: 1
        },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == '1') {
                ShowAlert("اطلاعات با موفقیت ویرایش شد");
                $("#tddatekarkard" + row).html($("#pcaldateKarardEdit").val());
                $("#tdstartkarkard" + row).html($("#txtStartKarardEdit").val());
                $("#tdEndkarkard" + row).html($("#txtEndKarardEdit").val());
                $("#tdsumkarkard" + row).html($("#txtSumKarardEdit").val());
                $("#tdEzafeKar" + row).html($("#txtEzafekarEdit").val());
                $("#tdJomekar" + row).html($("#txtJomehkarEdit").val());
                $("#tdTatilkar" + row).html($("#txtTatilkarEdit").val());
                $("#tdTakhir" + row).html($("#txtTakhirEdit").val());
                $("#tdTajil" + row).html($("#txtTajilEdit").val());
                $("#tdGhibat" + row).html($("#txtGhibatEdit").val());
                $("#tdMamoriat" + row).html($("#txtMamoriatEdit").val());
                $("#tdExit" + row).html($("#txtExitJobEdit").val());
            }
            else if (data == '2') {
                ShowAlert("اطلاعات کارکرد یافت نشد !");
                $("#trRowKarkard" + row).remove();
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

//-----------------------------------اضافه کردن نوع مرخصی جدید------------------------------------
function SaveMorakhasiKindNew() {
    var MorakhsiKind = $("#txtNamekindMorakhasi").val();
    if ($.trim(MorakhsiKind) == '') {
        ShowAlert("نوع مرخصی را وارد نمایید!");
        return;
    }
    else {

        if (confirm("آیا از ثبت نوع مرخصی جدیداطمینان دارید ؟")) {
            $("#Loading").fadeIn();
            $("#CheckOut").fadeIn();
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                dataType: "json",
                data: { i: 12, MorakhsiKind: MorakhsiKind },
                url: "PostBack/PersonelOperation.ashx",
                success: function (data) {
                    $("#Loading").fadeOut();
                    $("#CheckOut").fadeOut();

                    if (data == '1') {
                        ShowAlert("نوع مرخصی جدید با موفقیت ثبت شد");
                        $("#txtNamekindMorakhasi").val("");
                        GetAllMorakhasi();
                    }
                    else if (data == '5') {
                        ShowAlert("این نوع مرخصی قبلا ثبت شده است");
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
//-----------------------------------گزارش نوع مرخصی جدید------------------------------------
var MorakhasiKindRow = 0;
var drpdwnMorakhasiKind = "";
function GetAllMorakhasi() {
    MorakhasiKindRow = 0;
    drpdwnMorakhasiKind = "";
    $("#ResultDivMorakhasiKindNew").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>نوع مرخصی</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>";
    var mainrow = "<tr id='trMorakhasiKindRow{Row}'><td>{Row}</td><td id='tdMorakhasiKindName{Row}'>{morakhasiKind}</td><td>{status}</td><td>{Action}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 13 },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            drpdwnMorakhasiKind = data;
            $.each(data, function (index) {
                row = mainrow.replaceAll("{morakhasiKind}", this['strLeaveName']);
                row = row.replaceAll("{status}", "<input id='chkMorakhasiKind{Row}' type='checkbox' {checked} onclick='SetActiveMorakhasiKind({Row},{code});' /><div id='divloadingStatusMorakhasiKind{Row}' style='display:none;'></div>");
                row = row.replaceAll("{checked}", this['numStatus'] == 1 ? " checked='checked' " : "");
                row = row.replaceAll("{Action}",  //"<img src='images/Edit.png' onclick='ShowEditMorakhasiKind({Row},{code});' style='cursor: pointer;' /> 
                                               "<img id='imgDelMorakhasiKind{Row}' src='images/delete.png' onclick='DeletetMorakhasiKind({Row},{code});' style='cursor: pointer;padding-right:5px;' /><img id='loadingDelMorakhasiKind{Row}' src='Images/loading.gif' style='width:20px; display:none;padding-right:5px;' /> ");
                row = row.replaceAll("{code}", this['numLeaveCode']);
                row = row.replaceAll("{Row}", i);
                i++;
                allrow = allrow + row;
                t = 1;
                MorakhasiKindRow = i - 1;
            });
            if (t == 1) {
                $("#ResultDivMorakhasiKindNew").html(header + header2 + allrow + footer);
                GetdrpdwnWorkGroup("drpdwnMorakhasiUpfile", "DivdrpdwnStatusMorakhasi");
                GetdrpdwnWorkGroup("drpdwnMorakhasiRozanehUpfile", "DivdrpdwnStatusMorakhasiRozaneh");
            }
            else {
                $("#ResultDivMorakhasiKindNew").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivMorakhasiKindNew").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------فعال یا غیر فعال کردن نوع مرخصی------------------------------------
function SetActiveMorakhasiKind(row, code) {
    var checkis = 0;
    if ($("#chkMorakhasiKind" + row.toString()).attr("checked")) checkis = 1
    else checkis = 0;
    $("#chkMorakhasiKind" + row.toString()).hide();
    $("#divloadingStatusMorakhasiKind" + row.toString()).html("<img src='Images/loading.gif' />");
    $("#divloadingStatusMorakhasiKind" + row.toString()).show();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 14, checkis: checkis, code: code },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            if (data == '1') {
                $("#chkMorakhasiKind" + row.toString()).show();
                $("#divloadingStatusMorakhasiKind" + row.toString()).html("");
                $("#divloadingStatusMorakhasiKind" + row.toString()).hide();
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");

                $("#chkMorakhasiKind" + row.toString()).show();
                $("#divloadingStatusMorakhasiKind" + row.toString()).html("");
                $("#divloadingStatusMorakhasiKind" + row.toString()).hide();

                if (checkis == 0) {
                    $("#chkMorakhasiKind" + row.toString()).attr("checked", "checked");
                }
                else {
                    $("#chkMorakhasiKind" + row.toString()).removeAttr("checked");
                }

            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#chkMorakhasiKind" + row.toString()).show();
            $("#divloadingStatusMorakhasiKind" + row.toString()).html("");
            $("#divloadingStatusMorakhasiKind" + row.toString()).hide();
            if (checkis == 0) {
                $("#chkMorakhasiKind" + row.toString()).attr("checked", "checked");
            }
            else {
                $("#chkMorakhasiKind" + row.toString()).removeAttr("checked");
            }
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------ویرایش نوع مرخصی------------------------------------
function ShowEditMorakhasiKind(row, code) {
    $("#pnlEditMorakhasiKindCode").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "ویرایش نوع مرخصی",
        width: 300,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "ثبت ویرایش": function () {
                $(this).dialog("close");
                $("#Loading").fadeIn();
                $("#CheckOut").fadeIn();
                SaveEditMorakhasiKind(row, code);
            },
            "انصراف": function () {
                $(this).focus();
                $(this).dialog("close");
            }
        }
    });
    $("#DivEditMorakhasiKindHide" + row.toString()).html(code);
    $("#txtNameMorakhasiKindNewEdit").val($.trim($("#tdMorakhasiKindName" + row.toString()).html()));
    $("#pnlEditMorakhasiKindCode").dialog("open");
}
//-----------------------------------ثبت ویرایش نوع مرخصی------------------------------------
function SaveEditMorakhasiKind(row, code) {
    var morakhasiKind = $.trim($("#txtNameMorakhasiKindNewEdit").val());
    if ($.trim(morakhasiKind) == '') {
        ShowAlert("نوع مرخصی  را وارد نمایید !");
        return;
    }
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 15, code: code, morakhasiKind: morakhasiKind },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == '1') {
                ShowAlert("اطلاعات با موفقیت ویرایش شد");
                $("#txtNameMorakhasiKindNewEdit").val("");
                $("#tdMorakhasiKindName" + row.toString()).html(morakhasiKind);
            }
            else if (data == '3') {
                ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#txtNameMorakhasiKindNewEdit").val("");
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//-----------------------------------حذف نوع مرخصی------------------------------------
function DeletetMorakhasiKind(row, code) {
    if (confirm("آیا از حذف نوع مرخصی اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 16, code: code },
            url: "PostBack/PersonelOperation.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#trMorakhasiKindRow" + row.toString()).remove();
                }
                else if (data == '2') {
                    ShowAlert("این نوع مرخصی قبلا به کار گرفته شده است");
                }
                else if (data == '5') {
                    ShowAlert("اطلاعات این نوع مرخصی وجود ندارد");
                    $("#trMorakhasiKindRow" + row.toString()).remove();
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
//-----------------------------------دراپ دان نوع مرخصی------------------------------------
function GetdrpdwnWorkGroup(drpdwnId, divName) {
    var selectStart = "<select id='{drpdwnId}' class='InputSelectRightToLeftText'  style='width:151px;' {onchange}>";
    var option0 = "<option value='-1'>انتخاب کنید...</option>";
    var option = "<option value='{value}' {selected}>{item}</option>";
    var selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    $.each(drpdwnMorakhasiKind, function (index) {
        row = option.replaceAll("{value}", this['numLeaveCode']);
        row = row.replaceAll("{item}", this['strLeaveName']);
        //if (this['numWorkGroupCode'] == workgroupCode)
        //     row = row.replaceAll("{selected}", " selected='selected'");
        //  else 
        row = row.replaceAll("{selected}", "");
        allrow = allrow + row;
    });
    selectTemp = selectStart.replaceAll("{drpdwnId}", drpdwnId);
    var ret = selectTemp + option0 + allrow + selectEnd;
    if (divName == "DivdrpdwnStatusMorakhasi") {
        ret = "نوع مرخصی : " + ret;
        ret = ret.replaceAll("{onchange}", " onchange = 'monthMorakhasiChange();'");
    }
    else if (divName == "DivdrpdwnStatusMorakhasiRozaneh") {
        ret = "نوع مرخصی : " + ret;
        ret = ret.replaceAll("{onchange}", " onchange = 'monthMorakhasiRozanehChange();'");
    }
    else {
        ret = ret.replaceAll("{onchange}", "");

    }
    $("#" + divName).html(ret);
}
//----------------------------------------------------------------------
//----------------------------------------------------------------------
function monthMorakhasiChange() {
    var month = $("#drpdwnMonthMorakhasiUpFile").val();
    var morakhsiKind = $("#drpdwnMorakhasiUpfile").val();

    if (month != "-1" && morakhsiKind != "-1") {
        $("#divMorakhasiMonth").show();
        $("#DivbtnSaveMorakhasi").show();
        $("#DivErrorKarkardMorakhasi").show();
    }
    else {
        $("#divMorakhasiMonth").hide();
        $("#DivbtnSaveMorakhasi").hide();
        $("#DivErrorKarkardMorakhasi").hide();
    }
    $("#txtUpMorakhasiPersonel").val("");
    $("#uploadFileMorakhasiPersonel").val("");

    $("#DivErrorKarkardMorakhasi").html("");
    $("#DivErrorKarkardMorakhasi").hide();
}
//----------------------------------------------------------------------
//----------------------------------------------------------------------
function monthMorakhasiRozanehChange() {
    var date = $("#pcaldateMorakhasiRozaneh").val();
    var morakhsiKind = $("#drpdwnMorakhasiRozanehUpfile").val();

    if (morakhsiKind != "-1") {
        $("#divMorakhasiRozaneh").show();
        $("#DivbtnSaveMorakhasiRozaneh").show();
        $("#DivErrorKarkardMorakhasiRozaneh").show();
    }
    else {
        $("#divMorakhasiRozaneh").hide();
        $("#DivbtnSaveMorakhasiRozaneh").hide();
        $("#DivErrorKarkardMorakhasiRozaneh").hide();
    }
    $("#txtUpMorakhasiRozanehPersonel").val("");
    $("#uploadFileMorakhasiRozanehPersonel").val("");

    $("#DivErrorKarkardMorakhasiRozaneh").html("");
    $("#DivErrorKarkardMorakhasiRozaneh").hide();
}
//=========================================================================================
//=========================================================================================
//=========================================================================================
function changeValueUpFile(txtName, upfilename) {
    $("#" + txtName).val($("#" + upfilename).val());
}

//---------------------------------------------------------------------------------
///==================== آپلود مرخصی ماهانه =====================================
//---------------------------------------------------------------------------------
function UpFileMorakhasi() {
    var month = $("#drpdwnMonthMorakhasiUpFile").val();
    var morakhsiKind = $("#drpdwnMorakhasiUpfile").val();

    $("#DivErrorKarkardMorakhasi").hide();

    var fileMorakhasi = $.trim($("#txtUpMorakhasiPersonel").val());


    if (fileMorakhasi == "") {
        ShowAlert("لطفا فایل مرخصی ماهیانه را وارد نمایید!");
        return;
    }
    var upfilename = "uploadFileMorakhasiPersonel";
    if (($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null)) {

        var fd = new FormData();

        fd.append("UpFileMorakhsi", document.getElementById(upfilename).files[0]);
        fd.append("i", 17);
        fd.append("month", month);
        fd.append("morakhasiKind", morakhsiKind);

        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();

        var header = "<table id='tableErrorMorakhasiMahane' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
        var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th></th></thead><tbody>";
        var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{errTitle}</td></tr>";
        var footer = "</tbody></table>";
        var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelErrorMorakhasiMahane' type='button' value='خروجی اکسل' onclick='ExcelReportTable('tableErrorMorakhasiMahane');'/></div>";

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: fd,
            url: "PostBack/PersonelOperation.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();

                if (data == "1") {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    $("#drpdwnMonthMorakhasiUpFile").val(-1);
                    $("#drpdwnMorakhasiUpfile").val(-1);
                    monthMorakhasiChange();
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
                        row = row.replaceAll("{errTitle}", this['ErrorCode'] == "0" ? "کد پرسنلی یافت نشد" : this['ErrorCode'] == "1" ? "با موفقیت انجام شد" : this['ErrorCode'] == "2" ? "کد پرسنلی غیر فعال در سیستم" : this['ErrorCode'] == "3" ? "قطع همکاری" : this['ErrorCode'] == "4" ? "این کد پرسنلی قبلا در این سال و ماه<br/> تسویه حساب انجام داده است" : "");
                        i = i + 1;
                        allrow = allrow + row;
                        t = 1;
                    });

                    if (t == 1) {
                        $("#DivErrorKarkardMorakhasi").html(header + header2 + allrow + footer + btnExcel);
                        $("#DivErrorKarkardMorakhasi").show();
                        $("#btnExcelErrorMorakhasiMahane").buttons();
                    }
                    else {
                        $("#DivErrorKarkardMorakhasi").hide();
                    }
                }
            }
        });

    }
    else {
        ShowAlert("ابتدا فایل مرخصی مورد نظر را بارگزاری نمایید!");
    }
    // }
}
//---------------------------------------------------------------------------------
///==================== تبدیل کارکرد/مرخصی ماهیانه به روزانه =====================================
//---------------------------------------------------------------------------------
function CalcJobMonthlyFromDaily() {
    $("#DivErrorCalcKarkardMahane").hide();
    $("#DivErrorCalcKarkardMahane").html('');
    var personelCode = $.trim($("#txtPersonelCodejobCalcRozaneh").val());
    var datefrom = $.trim($("#pcaldateStartjobCalcRozaneh").val());
    var dateTo = $.trim($("#pcaldateEndjobCalcRozaneh").val());
    var month = $("#drpdwnMonthJobCalcRozaneh").val();
    var checkKarkard = $("#chkKarkardRozaneh").attr("checked");
    var checkMorakhasi = $("#chkMorakhasidRozaneh").attr("checked");
    checkKarkard = checkKarkard == "checked" ? true : false;
    checkMorakhasi = checkMorakhasi == "checked" ? true : false;
    if (datefrom == "" || dateTo == "" || month == "-1" || (checkKarkard == false && checkMorakhasi == false)) {
        ShowAlert("لطفا اطلاعات را تکمیل نمایید !");
        return;
    }
    else {
        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();

        var header = "<table id='tableErrorKarkardMahane' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
        var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th>خطا</th><th>توضیحات خطا</th></thead><tbody>";
        var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{errTitle}</td><td>{descerrTitle}</td></tr>";
        var footer = "</tbody></table>";

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 18, personelCode: personelCode, datefrom: datefrom, dateTo: dateTo, month: month, checkKarkard: checkKarkard, checkMorakhasi: checkMorakhasi,year: $("#salmali").html().trim()},
            url: "PostBack/PersonelOperation.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();
                if (data == 1) {
                    if (checkKarkard == true && checkMorakhasi == false)
                        ShowAlert("کارکردهای روزانه در این بازه با موفقیت محاسبه و در کارکردهای ماهیانه ثبت شدند");
                    else if (checkKarkard == false && checkMorakhasi == true)
                        ShowAlert("مرخصی های روزانه در این بازه با موفقیت محاسبه و در مرخصی های ماهیانه ثبت شدند");
                    else if (checkKarkard == true && checkMorakhasi == true)
                        ShowAlert("کارکردهای روزانه و مرخصی های روزانه در این بازه با موفقیت محاسبه و در کارکرد های ماهیانه و مرخصی های ماهیانه ثبت شدند");
                    $("#txtPersonelCodejobCalcRozaneh").val("");
                    $("#pcaldateStartjobCalcRozaneh").val("");
                    $("#pcaldateEndjobCalcRozaneh").val("");
                    $("#drpdwnMonthJobCalcRozaneh").val("-1");
                    $("#chkKarkardRozaneh").attr("checked", "checked");
                    $("#chkMorakhasidRozaneh").attr("checked", "checked");

                }
                else if (data == 3) {
                    ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
                }
                else if (data == 2) {
                    ShowAlert("کارکرد/مرخصی روزانه ای برای محاسبه یافت نشد !");
                }
                else {
                    var row = "", allrow = "";
                    var i = 1;
                    var t = 0;
                    $.each(data, function (index) {
                        row = mainrow.replaceAll("{Row}", i);
                        row = row.replaceAll("{name}", this['strPersonelName']);
                        row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                        row = row.replaceAll("{errTitle}", this['ErrorCode'] == "0" ? "کد پرسنلی یافت نشد" : this['ErrorCode'] == "1" ? "با موفقیت انجام شد" : this['ErrorCode'] == "2" ? "کد پرسنلی غیر فعال در سیستم" : this['ErrorCode'] == "3" ? "قطع همکاری" : this['ErrorCode'] == "5" ? "قرارداد غیرفعال شده" : this['ErrorCode'] == "7" ? "مرخصی بیش از روز مجاز" : "");
                        row = row.replaceAll("{descerrTitle}", this['strDesc'] == "" || this['strDesc'] == null ? "-" : this['strDesc']);
                        i = i + 1;
                        allrow = allrow + row;
                        t = 1;
                    });
                    if (t == 1) {
                        $("#DivErrorCalcKarkardMahane").html(header + header2 + allrow + footer);
                        $("#DivErrorCalcKarkardMahane").show();
                    }
                    else {
                        $("#DivErrorCalcKarkardMahane").hide();
                    }
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
//---------------------------------------------------------------------------------
///==================== آپلود مرخصی روزانه =====================================
//---------------------------------------------------------------------------------
function UpFileMorakhasiRozaneh() {
    var date = $("#pcaldateMorakhasiRozaneh").val();
    var morakhsiKind = $("#drpdwnMorakhasiRozanehUpfile").val();

    $("#DivErrorKarkardMorakhasiRozaneh").hide();

    var fileMorakhasi = $.trim($("#txtUpMorakhasiRozanehPersonel").val());


    if (fileMorakhasi == "") {
        ShowAlert("لطفا فایل مرخصی روزانه را وارد نمایید!");
        return;
    }
    var upfilename = "uploadFileMorakhasiRozanehPersonel";
    if (($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null)) {

        var fd = new FormData();

        fd.append("UpFileMorakhsi", document.getElementById(upfilename).files[0]);
        fd.append("i", 20);
        fd.append("date", date);
        fd.append("morakhasiKind", morakhsiKind);

        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();

        var header = "<table id='tableErrorMorakhasiRozaneh' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
        var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th></th></thead><tbody>";
        var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{errTitle}</td></tr>";
        var footer = "</tbody></table>";
        var btnExcel = "<div style='padding:10px 0;'><input id='btnExcelErrorMorakhasiRozaneh' type='button' value='خروجی اکسل' onclick='ExcelReportTable('tableErrorMorakhasiRozaneh');'/></div>";

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: fd,
            url: "PostBack/PersonelOperation.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();

                if (data == "1") {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    $("#pcaldateMorakhasiRozaneh").val("");
                    $("#drpdwnMorakhasiRozanehUpfile").val(-1);
                    monthMorakhasiRozanehChange();
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
                        row = row.replaceAll("{errTitle}", this['ErrorCode'] == "0" ? "کد پرسنلی یافت نشد" : this['ErrorCode'] == "1" ? "با موفقیت انجام شد" : this['ErrorCode'] == "2" ? "کد پرسنلی غیر فعال در سیستم" : this['ErrorCode'] == "3" ? "قطع همکاری" : this['ErrorCode'] == "4" ? "این کد پرسنلی قبلا در این سال و ماه<br/> تسویه حساب انجام داده است" : "");
                        i = i + 1;
                        allrow = allrow + row;
                        t = 1;
                    });

                    if (t == 1) {
                        $("#DivErrorKarkardMorakhasiRozaneh").html(header + header2 + allrow + footer + btnExcel);
                        $("#DivErrorKarkardMorakhasiRozaneh").show();
                        $("#btnExcelErrorMorakhasiRozaneh").buttons();
                    }
                    else {
                        $("#DivErrorKarkardMorakhasiRozaneh").hide();
                    }
                }
            }
        });

    }
    else {
        ShowAlert("ابتدا فایل مرخصی مورد نظر را بارگزاری نمایید!");
    }
    // }
}

//---------------------------------------------------------------------------------
///=========================== گزارش مرخصی روزانه=======================================
//---------------------------------------------------------------------------------
function GetReportMorakhasiDaily(vpage) {

    var personelcode = $.trim($("#txtReporthPersonelCodeMorakhasiRozane").val());
    var name = $.trim($("#txtReportdPersonelNameMorakhasiRozane").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCodeMorakhasiRozane").val());
    var DateFrom = $("#yearlblDateFromMorakhasiRozaneh").val() + "/" + $("#monthlblDateFromMorakhasiRozaneh").val() + "/" + $("#daylblDateFromMorakhasiRozaneh").val();
    var DateTo = $("#yearlblDateToMorakhasiRozaneh").val() + "/" + $("#monthlblDateToMorakhasiRozaneh").val() + "/" + $("#daylblDateToMorakhasiRozaneh").val();

    var grohkari = $.trim($("#drpdwnSearchWorkJobKindMorakhasiRozane").val());
    grohkari = grohkari == null || grohkari == undefined || grohkari == '' ? "-1" : "\"" + $("#drpdwnSearchWorkJobKindMorakhasiRozane").val() + "\"";

    var drpdwnSearchMorakhsiKind = $.trim($("#drpdwnSearchMorakhsiKindRozane").val());

    $("#ResultDivPersonelMorakhasiRozane").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonelMorakhasiRozane").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    //var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نوع مرخصی</th><th align='center'>تاریخ شروع</th><th align='center'>تاریخ پایان</th><th align='center'>ساعت شروع</th><th>ساعت پایان</th><th>توضیحات</th><th>تاریخ ثبت</th></thead><tbody>";
    //var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{morakhasiKind}</td><td>{startdate}</td><td>{enddate}</td><td>{timestart}</td><td>{timeEnd}</td><td>{desc}</td><td>{dateRegister}</td></tr>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>تاریخ</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>گروه کاری</th><th align='center'>نوع مرخصی</th><th align='center'>ساعت مرخصی </th><th>تاریخ ثبت</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{dateleave}</td><td>{personelcode}</td><td>{name}</td><td>{workgroup}</td><td>{morakhasiKind}</td><td>{timeMorakhasi}</td><td>{dateRegister}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportMorakhasiDaily(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerMorakhasiPPersonelRozaneh' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountMorakhasiPersonelRozaneh' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='GetReportMorakhasiDaily({lastpage})'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></table></p>";
    var sumTimeShow = "<tr style='background-color:darkkhaki;' ><td colspan='6' align='left'>مجموع مرخصی ها :</td><td >{summorakhasi}</td><td></td></tr>";

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
        data: { i: 21, personelcode: personelcode, grohkari: grohkari, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, MorakhsiKind: drpdwnSearchMorakhsiKind, page: vpage, perpage: vperpage },
        url: "PostBack/PersonelOperation.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var Morakhasi = "00:00";

            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{morakhasiKind}", this['strLeaveName']);
                row = row.replaceAll("{workgroup}", this['strWorkGroupName']);
                row = row.replaceAll("{timeMorakhasi}", this['timeLeaveTime']);
                row = row.replaceAll("{dateRegister}", $.trim(this['dateRegisterDate']));
                row = row.replaceAll("{personelcode}", this['numPersonelCode']);
                row = row.replaceAll("{dateleave}", this['dateLeaveDate']);

                Morakhasi = CalcTime(Morakhasi, $.trim(this['timeLeaveTime']));

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
                footerPager = footerPager.replaceAll("{link_prevPage}", "GetReportMorakhasiDaily(" + prevPage + ")");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "GetReportMorakhasiDaily(" + nextPage + ")");
            }
            if (t == 1) {
                sumTimeShow = sumTimeShow.replaceAll("{summorakhasi}", Morakhasi);
                $("#ResultDivPersonelMorakhasiRozane").html(header + header2 + allrow + sumTimeShow + footer + footerPager + endfooter);
                $("#divAllRecordCountMorakhasiPersonelRozaneh").html(allpage);
            }
            else {
                $("#ResultDivPersonelMorakhasiRozane").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivPersonelMorakhasiRozane").html("");
            $("#ResultDivPersonelMorakhasiRozane").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}