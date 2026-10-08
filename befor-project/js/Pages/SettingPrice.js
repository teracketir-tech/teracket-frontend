$(document).ready(function () {

    $("#divPersonelTabs").tabs();
    GetTabsDeActive("divPersonelTabs");

    $("#monthlblSettingDate").hide();
    $("#daylblSettingDate").hide();

    $("#monthlblDateYearForMonth").hide();
    $("#daylblDateYearForMonth").hide();
    
    $("#yearlblSettingDate").change(function () { resettext(); return false; });
    $("#btnSaveSetting").click(function () { SaveSetting(); return false; });
    $("#btnSrchSetting").click(function () { ReportSetting(1, 0); return false; });
    $("#btnSaveCountDayInMonth").click(function () { SaveCountDayIntoMonth(); return false; });
    
    $("#btnresetSetting").click(function () { resettext(); return false; });
    $("#btnAllSetting").click(function () { ReportSetting(1, -1); return false; });
    ReportSetting(1,-1);
    getAllDayIntoMonth();
    // GetInfoSetting();
    //$("#txtPersonelCodeForCutWork").keypress(function (e) {
    //    var key = e.which;
    //    if (key == 13)  // the enter key code
    //    {
    //        SearchGetPersonelInfoCutWork();
    //        return false;
    //    }
    //});
});
//============================================================================
//============================================================================
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
//============================================================================
//=========================دریافت اطلاعات تنظیمات مالی فعال==================
//============================================================================
function GetInfoSetting()
{
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    var row = "", allrow = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBSettingPrice.ashx",
        success: function (data) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();

            $.each(data, function (index) {
                $("#yearlblSettingDate").val(this["numYear"]);
                $("#txtPersonelSalary").val(addCommas(this["numPriceSalary"]));
                $("#txtPersonelBonSalary").val(addCommas(this["numPriceBon"]));
                $("#txtPersonelHomeSalary").val(addCommas(this["numPriceHomeSalary"]));
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//============================================================================
//==========================ثبت اطلاعات=======================================
//============================================================================
function SaveSetting()
{
    var year = $("#yearlblSettingDate").val();
    var pricesalary = $("#txtPersonelSalary").val().trim();
    var pricebon = $("#txtPersonelBonSalary").val().trim();
    var pricehomesalary = $("#txtPersonelHomeSalary").val().trim();

    pricesalary = pricesalary == "" ? 0 : parseInt(pricesalary.replaceAll(",", ""));
    pricebon = pricebon == "" ? 0 : parseInt(pricebon.replaceAll(",", ""));
    pricehomesalary = pricehomesalary == "" ? 0 : parseInt(pricehomesalary.replaceAll(",", ""));

    if(pricesalary=="" || pricebon=="" || pricehomesalary=="")
    {
        ShowAlert("لطفا اطلاعات خواسته شده را وارد نمایید !");
        return;
    }
    else if (!numbericFild.test(pricesalary)) {
        ShowAlert("حقوق ثابت باید عددی باشد !");
        return;
    }
    else if (!numbericFild.test(pricebon)) {
        ShowAlert("بن خوار و بار باید عددی باشد !");
        return;
    }
    else if (!numbericFild.test(pricehomesalary)) {
        ShowAlert("حق مسکن باید عددی باشد !");
        return;
    }
    else
    {
        $("#Note").html("آیا از ثبت تنظیمات مالی اطمینان دارید ؟");
        $("#Note").dialog({
            modal: true,
            autoOpen: false,
            resizable: false,
            title: "ثبت تنظیمات مالی",
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
                        data: { i: 2, year: year, pricesalary: pricesalary, pricebon: pricebon, pricehomesalary: pricehomesalary },
                        url: "PostBack/PBSettingPrice.ashx",
                        success: function (data) {
                            $("#CheckOut").fadeOut();
                            $("#Loading").fadeOut();
                            if (data == "1") {
                                $("#salmali").html(year);
                                ShowAlert("اطلاعات با موفقیت ثبت شد");
                                ReportSetting(1, -1);
                                resettext();
                            }
                            if (data == "2") {
                                ShowAlert("اطلاعات با موفقیت ویرایش شد");
                                ReportSetting(1, -1);
                                resettext();
                            }
                            else if (data == "4") {
                                ShowAlert("امکان ثبت یا ویرایش در این سال مالی وجود ندارد <br/> تنظیمات مبالغ این سال مالی در محاسبات صورت حساب ها آورده شده است !");
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
                    $(this).dialog("close");
                }
            }
        });
        $("#Note").dialog("open");
    }
}
//---------------------------------------------------------------------------------
///=========================== گزارش تنظیمات =========================
//---------------------------------------------------------------------------------
function ReportSetting(vpage, yearKind) {
    var year = -1;
    if (yearKind == 0) {
         year = $.trim($("#yearlblSettingDate").val());
    }
    else
    {
        year = yearKind;
    }
    var salary = $.trim($("#txtPersonelSalary").val());
    var bon = $.trim($("#txtPersonelBonSalary").val());
    var homesalary = $.trim($("#txtPersonelHomeSalary").val());

    $("#ResultSetting").html("<img src='Images/progressindicator.gif' />");
    $("#ResultSetting").show();
    var header = "<table id='tblReportsetting' class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th>وضعیت</th><th align='center'>سال مالی</th><th align='center'>حقوق ثابت (ریال)</th><th>بن خواروبار (ریال)</th><th align='center'>حق مسکن (ریال)</th><th align='center'>تاریخ و ساعت ثبت</th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{status}</td><td id='sal{Row}'>{year}</td><td id='salary{Row}'>{salary}</td><td id='bon{Row}'>{bon}</td><td id='home{Row}'>{home}</td><td>{date}</td></tr>";
    var footer = "</tbody></table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='ReportSetting(1,-1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonelsetting' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonelsetting' class='pageritemlabel'>" +
    "</div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritem'><a onclick='{link_nextPage}'>" +
    "<img id='gridarrow_next' title='صفحه بعد' src='images/gridarrow_next.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='ReportSetting({lastpage},-1)'>" +
    "<img id='gridarrow_last' title='صفحه آخر' src='images/gridarrow_last.jpg' /></a></div></div></div>";
    var endfooter = "</td></tr></p>";

    var title = "<div style='padding:10px 0; text-align:right;'>* برای تغییر سال مالی وضعیت آن را انتخاب کنید .</div>";

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
        data: { i: 3, year: year, salary: salary, bon: bon, homesalary: homesalary, page: vpage, perpage: vperpage },
        url: "PostBack/PBSettingPrice.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            var pricesalary = 0;
            var PriceMorakhasiBihoghogh = 0;
            var priceRozane = 0;
            var priceSaati = 0;
            var priceRozaneBiHoghogh = 0;
            var priceSaatiBiHoghogh = 0;
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{year}", this['numYear']);
                row = row.replaceAll("{salary}", addCommas(this['numPriceSalary']));
                row = row.replaceAll("{bon}", addCommas($.trim($.trim(this['numPriceBon']))));
                row = row.replaceAll("{home}", addCommas($.trim(this['numPriceHomeSalary'])));
                row = row.replaceAll("{date}", $.trim(this['dateRegisterDate']));
                row = row.replaceAll("{status}", ($.trim(this['status']) == 1) ? "<input id='chk{Row}' type='checkbox' checked='checked' onclick='changeSalMali({Row},{id});'/>" : "<input id='chk{Row}' type='checkbox'  onclick='changeSalMali({Row},{id});'/>");
                row = row.replaceAll("{id}", this['numSettingCode']);
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
                footerPager = footerPager.replaceAll("{link_prevPage}", "ReportSetting(" + prevPage + ",-1)");
            }

            if (parseInt(vpage) >= parseInt(allpage)) {
                footerPager = footerPager.replaceAll("{link_nextPage}", "");
            }
            else {
                footerPager = footerPager.replaceAll("{link_nextPage}", "ReportSetting(" + nextPage + ",-1)");
            }
            if (t == 1) {
                $("#ResultSetting").html(title+header + header2 + allrow + footer + footerPager + endfooter);
                $("#divAllRecordCountPersonelsetting").html(allpage);
            }
            else {
                $("#ResultSetting").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultSetting").html("");
            $("#ResultSetting").hide();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//============================================================================
//========================== تغییر سال مالی =======================================
//============================================================================
function changeSalMali(row,id)
{
    if ($("#chk" + row).attr("checked") == "checked") {
   
        $("#CheckOut").fadeIn();
        $("#Loading").fadeIn();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 4, id: id },
            url: "PostBack/PBSettingPrice.ashx",
            success: function (data) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();
                if (data == "1") {
                    $("#salmali").html($.trim($("#sal" + row).html()));
                    $("#yearlblSettingDate").val($.trim($("#sal" + row).html()));
                    $("#txtPersonelSalary").val($.trim($("#salary" + row).html()));
                    $("#txtPersonelBonSalary").val($.trim($("#bon" + row).html()));
                    $("#txtPersonelHomeSalary").val($.trim($("#home" + row).html()));

                    ReportSetting(1, -1);
                }
                else if(data=="2")
                {
                    resettext();
                    ReportSetting(1, -1);
                    ShowAlert("اطلاعاتی یافت نشد");
                }
                else if (data == "3") {
                    ShowAlert("خطا در ثبت اطلاعات ، دوباره امتحان کنید");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#CheckOut").fadeOut();
                $("#Loading").fadeOut();
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });
    }
    else
    {
        $("#chk" + row).attr("checked", "checked");
        ShowAlert("همین سال مالی فعال می باشد !");
    }
 
}
//============================================================================
//========================== ریست اطلاعات=======================================
//============================================================================
function resettext()
{
    $("#txtPersonelSalary").val("");
    $("#txtPersonelBonSalary").val("");
    $("#txtPersonelHomeSalary").val("");
}

//---------------------------------------------------------------------------------
///=========================== ثبت روز کاری در ماه =========================
//---------------------------------------------------------------------------------
function SaveCountDayIntoMonth() {

    var day = $.trim($("#txtCountDayInMonth").val());
    var month = $.trim($("#drpdwnCountDayIntoMonth").val());
    var year = $.trim($("#yearlblDateYearForMonth").val());

    if (day == "" || month == "-1") {
        ShowAlert("لطفا اطلاعات را وارد نمایید");
        return;
    }
    else if (!numbericFild.test(day)) {
        ShowAlert("تعداد روز در ماه باید به صورت عددی باشد !");
        return;
    }
    else if (parseInt(day) == 0 || parseInt(day) < 0 || parseInt(day) > 31) {
        ShowAlert("تعداد روز در ماه عددی نامعتبر می باشد !");
        return;
    }

    if (confirm("آیا از ثبت اطلاعات اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 5, day: day, month: month, year: year },
            url: "PostBack/PBSettingPrice.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();
                if (data == '1') {
                    ShowAlert("اطلاعات با موفقیت ثبت شد");
                    $("#txtCountDayInMonth").val("");
                    $("#drpdwnCountDayIntoMonth").val(-1);
                    getAllDayIntoMonth();
                }
                else if (data == '2') {
                    ShowAlert("این اطلاعات قبلا ثبت شده است !");
                }
                else if (data == '3') {
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
///=========================== دریافت اطلاعات روز کاری در ماه =========================
//---------------------------------------------------------------------------------
var countRowDayMonth = 0;
function getAllDayIntoMonth() {
    countRowDayMonth = 0;
    $("#ResultDivDayIntoMonthInfo").html("<img src='Images/loading.gif' />");
    var header = "<table class='MainTbl'>";
    var header2 = "<thead><tr><th width='50px'>ردیف</th><th>ماه</th><th>سال</th><th>تعداد روز کارکرد</th><th>عملیات</th></tr></thead><tbody>";
    var mainrow = "<tr id='trDayIntoMonthRow{Row}'><td>{Row}</td><td>{month}</td><td>{year}</td><td>{day}</td><td>{action}</td></tr>";
    var footer = "</tbody></table>";
    var row = ""; var allrow = "";
    var t = 0;
    var i = 1;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 6 },
        url: "PostBack/PBSettingPrice.ashx",
        success: function (data) {
            $.each(data, function (index) {
                row = mainrow.replaceAll("{month}", this['MonthJob']);
                row = row.replaceAll("{year}", this['numYear']);
                row = row.replaceAll("{day}", this['numCountDay']);
                row = row.replaceAll("{action}", "<img id='imgDelWorkGroup{Row}' src='images/delete.png' onclick='DeletetDayMonth({Row},{code});' style='cursor: pointer;padding-right:5px;' />");
                row = row.replaceAll("{code}", this['numWorkMonthCode']);
                row = row.replaceAll("{Row}", i);
                i++;
                allrow = allrow + row;
                t = 1;
                countRowDayMonth = i - 1;
            });
            if (t == 1) {
                $("#ResultDivDayIntoMonthInfo").html(header + header2 + allrow + footer);
            }
            else {
                $("#ResultDivDayIntoMonthInfo").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#ResultDivDayIntoMonthInfo").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}
//---------------------------------------------------------------------------------
///=========================== حذف اطلاعات روز کاری در ماه =========================
//---------------------------------------------------------------------------------
function DeletetDayMonth(row, code) {
    if (confirm("آیا از حذف اطلاعات اطمینان دارید ؟")) {
        $("#Loading").fadeIn();
        $("#CheckOut").fadeIn();

        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 7, code: code },
            url: "PostBack/PBSettingPrice.ashx",
            success: function (data) {
                $("#Loading").fadeOut();
                $("#CheckOut").fadeOut();

                if (data == '1') {
                    $("#trDayIntoMonthRow" + row.toString()).remove();
                }
                else if (data == '5') {
                    ShowAlert("اطلاعاتی وجود ندارد");
                    $("#trDayIntoMonthRow" + row.toString()).remove();
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

