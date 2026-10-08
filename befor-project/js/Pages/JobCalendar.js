$(document).ready(function () {

    $("#divPersonelTabs").tabs();
    GetTabsDeActive("divPersonelTabs");
    GetDrpdwnBaseAll();

    $("#btnSaveTimeWork").click(function () { RegisterInfoTimeWork(); return false; });
    $("#btnReportPersonelSearch").click(function () { GetReportInfoPersonel(1); return false; });

    

    $("#txtTimeIn").timepicker({'timeFormat': 'H:i'});
    $("#txtTimeOut").timepicker({ 'timeFormat': 'H:i' });
    $("#txtTimeValid").timepicker({ 'timeFormat': 'H:i' });
});
//============================================================================
//============================================================================
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
var drpdwnEmployer = "";
//============================================================================
//============================================================================
function GetDrpdwnBaseAll() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    drpdwnEmployer = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/JobCalendar.ashx",
        success: function (data) {
            drpdwnEmployer = data[0];
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
    selectStart = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' style='width:176px;' onclick='GetInfoEmployerByValue();'>";

    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}'>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (type == 1) {
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
    }
  
}
//=================================================================================
function RegisterInfoTimeWork()
{
    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    var employer= $("#drpdwnEmployer").val();
    var TimeIn = $.trim($("#txtTimeIn").val());
    var TimeOut = $.trim($("#txtTimeOut").val());
    var TimeDelay = $.trim($("#txtTimeValid").val());

    if (employer == "-1" || TimeIn == "" || TimeOut == "" || TimeDelay == "")
    {
        ShowAlert("لطفا اطلاعات را تکمیل نمایید!");
        return;
    }
    else
    {
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 2, employer: employer, TimeIn: TimeIn, TimeOut: TimeOut, TimeDelay: TimeDelay },
            url: "/PostBack/JobCalendar.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == "1") {
                    ShowAlert("اطلاعات با موفقیت ثبت شد.");
                    $("input[type=text], textarea").val("");
                    $("select").val("-1");
                    if($("#ResultDivPersonel").css("display")=="none")
                    {
                        GetReportInfoPersonel(1);
                    }
                }
                else if (data == "2") {
                    ShowAlert("گروه کاری یافت نشد!");
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
//---------------------------------------------------------------------------------
///=========================== گزارش اطلاعات پرسنل ==============================
//---------------------------------------------------------------------------------
function GetReportInfoPersonel(vpage) {

    var personelcode = $.trim($("#txtReportPersonelCode").val());
    var name = $.trim($("#txtReportPersonelName").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCode").val());

    $("#ResultDivPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th align='center'>ساعت ورود</th><th align='center'>ساعت خروج</th><th>تاخیر مجاز</th><th>گروه کاری</th><th></th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{fathername}</td><td>{mellicode}</td><td>{timein}</td><td>{timeout}</td><td>{timedelay}</td><td>{workgroup}</td><td>{action}</td></tr>";
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
        data: { i: 3, personelcode: personelcode, name: name, mellicode: mellicode, page: vpage, perpage: vperpage },
        url: "PostBack/JobCalendar.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{fathername}", this['strFatherName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{timein}", $.trim(this['strTimeIn']) == "" ? "-" : $.trim(this['strTimeIn']));
                row = row.replaceAll("{timeout}", $.trim(this['strTimeOut']) == "" ? "-" : $.trim(this['strTimeOut']));
                row = row.replaceAll("{timedelay}", $.trim(this['strTimeDelay']) == "" ? "-" : $.trim(this['strTimeDelay']));
                row = row.replaceAll("{workgroup}", $.trim(this['strEmployerName']));
                row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='ShowInfoPrint(\"{personelcode}\");'><img src='images/edit.png' /></a></div>");
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
///============== دریافت اطلاعات ساعت کاری گروه کاری با کد آن =================
//---------------------------------------------------------------------------------
function GetInfoEmployerByValue()
{
    var employer = $("#drpdwnEmployer").val();
    if (employer == "-1") {
        $("input[type=text], textarea").val("");
        $("select").val("-1");
    }
    else {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 4, employer: employer },
            url: "/PostBack/JobCalendar.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                $("#txtTimeIn").val(data['strTimeIn']);
                $("#txtTimeOut").val(data['strTimeOut']);
                $("#txtTimeValid").val(data['strTimeDelay']);
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                ShowAlert("خطا بازیابی ، لطفا مجددا تلاش کنید.");
            }
        });
    }
}