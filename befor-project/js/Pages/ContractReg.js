$(document).ready(function () {

    $("#divPersonelTabs").tabs();
    GetTabsDeActive("divPersonelTabs");

    var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
    var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();


    var objCal1 = new AMIB.persianCalendar('pcaldateBrithdayDate', {
        extraInputID: 'pcaldateBrithdayDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal2 = new AMIB.persianCalendar('pcaldateStartUniversityDate', {
        extraInputID: 'pcaldateStartUniversityDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal3 = new AMIB.persianCalendar('pcaldateEndUniversityDate', {
        extraInputID: 'pcaldateEndUniversityDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal4 = new AMIB.persianCalendar('pcaldateMarridDate', {
        extraInputID: 'pcaldateMarridDate',
        extraInputFormat: 'yyyy/mm/dd'
    });


    var objCal4 = new AMIB.persianCalendar('pcaldateMarridBrithdayDate', {
        extraInputID: 'pcaldateMarridBrithdayDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal5 = new AMIB.persianCalendar('pcaldateChildBrithdayDate', {
        extraInputID: 'pcaldateChildBrithdayDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal6 = new AMIB.persianCalendar('pcaldateStartDoreDate', {
        extraInputID: 'pcaldateStartDoreDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal66 = new AMIB.persianCalendar('pcaldateEndDoreDate', {
        extraInputID: 'pcaldateEndDoreDate',
        extraInputFormat: 'yyyy/mm/dd'
    });

    var objCal652 = new AMIB.persianCalendar('pcaldateStartJobDate', {
        extraInputID: 'pcaldateStartJobDate',
        extraInputFormat: 'yyyy/mm/dd'
    });
    var objCal612 = new AMIB.persianCalendar('pcaldateEndJobDate', {
        extraInputID: 'pcaldateEndJobDate',
        extraInputFormat: 'yyyy/mm/dd'
    });



    $("#btnRegisterPersonel").click(function () { RegisterPersonel(); return false; });
    $("#btnNextPage1").click(function () { ShowNextPage(1); return false; });
    $("#btnNextPage2").click(function () { ShowNextPage(2); return false; });
    $("#btnPrevPage2").click(function () { ShowPrevPage(2); return false; });
    $("#btnNextPage3").click(function () { ShowNextPage(3); return false; });
    $("#btnPrevPage3").click(function () { ShowPrevPage(3); return false; });
    $("#btnNextPage4").click(function () { ShowNextPage(4); return false; });
    $("#btnPrevPage4").click(function () { ShowPrevPage(4); return false; });
    $("#btnNextPage5").click(function () { ShowNextPage(5); return false; });
    $("#btnPrevPage5").click(function () { ShowPrevPage(5); return false; });
    $("#btnNextPage6").click(function () { ShowNextPage(6); return false; });
    $("#btnPrevPage6").click(function () { ShowPrevPage(6); return false; });
    $("#btnNextPage7").click(function () { ShowNextPage(7); return false; });
    $("#btnPrevPage7").click(function () { ShowPrevPage(7); return false; });
    //$("#btnNextPage8").click(function () { ShowNextPage(8); return false; });
    //$("#btnPrevPage8").click(function () { ShowPrevPage(8); return false; });
    $("#btnNextPage8").click(function () { ShowNextPage(8); return false; });
    $("#btnPrevPage8").click(function () { ShowPrevPage(8); return false; });
    $("#btnPrevPage9").click(function () { ShowPrevPage(9); return false; });

    $("#btnSaveInfoMarrid").click(function () { SaveMarridInfo(); return false; });
    $("#btnSaveInfoChild").click(function () { SaveChildInfo(); return false; });
    $("#btnSaveUnivercity").click(function () { SaveUniversityInfo(); return false; });

    $("#btnSaveEditInfoMarrid").click(function () { SaveEditMarridInfo(); return false; });
    $("#btnSaveEditInfoChild").click(function () { SaveEditChildInfo(); return false; });
    $("#btnEditUnivercity").click(function () { SaveEditUniversityInfo(); return false; });
    $("#btnSaveDore").click(function () { SaveInfoDore(); return false; });
    $("#btnEditDore").click(function () { SaveEditDoreInfo(); return false; });
    $("#btnSaveLangauge").click(function () { SaveInfoLanguge(); return false; });

    $("#btnSaveMaharat").click(function () { SaveInfoMaharat(); return false; });
    $("#btnEditMaharat").click(function () { SaveEditMaharatInfo(); return false; });

    $("#btnSaveJobHistory").click(function () { SaveInfoJobHistory(); return false; });
    $("#btnEditJobHistory").click(function () { SaveEditJobHistoryInfo(); return false; });

    $("#btnSaveBime").click(function () { SaveInfoBimeh(); return false; });
    $("#btnEditBime").click(function () { SaveEditBimehInfo(); return false; });

    $("#step1").click(function () { ShowStepClick(1); return false; });
    $("#step2").click(function () { ShowStepClick(2); return false; });
    $("#step3").click(function () { ShowStepClick(3); return false; });
    $("#step4").click(function () { ShowStepClick(4); return false; });
    $("#step5").click(function () { ShowStepClick(5); return false; });
    $("#step6").click(function () { ShowStepClick(6); return false; });
    $("#step7").click(function () { ShowStepClick(7); return false; });
    $("#step8").click(function () { ShowStepClick(8); return false; });
    $("#step9").click(function () { ShowStepClick(9); return false; });

    GetDrpdwnBaseAll();
    $("#ResaultInfoMarrid").html('');
    $("#ResaultInfoMarrid").hide();
    DeleteImageTemp();


    $("#btnReportPersonelSearch").click(function () { GetReportInfoPersonel(1); return false; });
    //var d = new Date(),
    //todayJD = gregorian_to_jd(d.getFullYear(), d.getMonth() + 1, d.getDate());
    //var dateNow = jd_to_persian(todayJD);
    //$("#pcalReportdateFromDate").val(dateNow[0] + "/" + (Number(dateNow[1]) < 10 ? "0" + dateNow[1] : dateNow[1]) + "/" + (Number(dateNow[2]) < 10 ? "0" + dateNow[2] : dateNow[2]));
    //$("#pcalReportdateToDate").val(dateNow[0] + "/" + (Number(dateNow[1]) < 10 ? "0" + dateNow[1] : dateNow[1]) + "/" + (Number(dateNow[2]) < 10 ? "0" + dateNow[2] : dateNow[2]));

    $("#txtSearchPersonelCode").keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            GetInfoByPersonelCode(1);
            return false;
        }
    });
    $("#hrInfoAllPersonel").hide();
    $("#trInfoAllPersonel").hide();

    $("#yearlblDateFrom").val(DateFrom.split('/')[0]);
    $("#monthlblDateFrom").val(DateFrom.split('/')[1]);
    $("#daylblDateFrom").val(DateFrom.split('/')[2]);
    $("#yearlblDateTo").val(DateTo.split('/')[0]);
    $("#monthlblDateTo").val(DateTo.split('/')[1]);
    $("#daylblDateTo").val(DateTo.split('/')[2]);

});
//======================================یافتن اطلاعات براساس کدپرسنلی=====================================
var publicpersonelCode = "";
var tempImageFileTemp = "";
function GetInfoByPersonelCode(type) {
    var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
    var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();

    tempImageFileTemp = "";
    publicpersonelCode = "";
    ShowStepClick(1);
    var personelcode = $.trim($("#txtSearchPersonelCode").val());
    publicpersonelCode = personelcode;
    $("#hrInfoAllPersonel").hide();
    $("#trInfoAllPersonel").hide();
    $("input[type=text], textarea").val("");
    $("select").val("-1");

    $("#ResaultInfoMarrid").html("");
    $("#ResaultInfoChild").html("");
    $("#trShowUniversityInfo").html("");
    $("#trShowDoreInfo").html("");
    $("#trShowLangugeInfo").html("");
    $("#trShowMaharatInfo").html("");
    $("#trShowJobHistoryInfo").html("");
    $("#trShowBimeInfo").html("");

    $("#lblResaultInfoMarrid").html("");
    $("#lblResaultInfoChild").html("");
    $("#lblShowUniversityInfo").html("");
    $("#lblShowDoreInfo").html("");
    $("#lblShowBimehInfo").html("");
    $("#lblShowLangugeInfo").html("")
    $("#lblShowMaharatInfo").html("");
    $("#lblShowJobHistoryInfo").html("");
    $("#lblShowImageFile").html("");
    $("#tdPreViewImageUpFile").html("");
    $("#trPnlPersonelAllInfo").html("");
    $("#trPnlPersonelCodeInfo").html("");

    $("#trMarridInfo").hide();
    CountAllMarid = 0;
    CountAllMaridCounter = 0;
    CounterRowMarrid = 1;
    editRowMarrid = 0;
    CountAllChild = 0;
    CountAllChildCounter = 0;
    CounterRowChild = 1;
    editRowChild = 0;
    CounterRowUniversity = 1;
    editRowUniversity = 0;
    editRowJobHistory = 0;
    CounterRowJobHistory = 1;
    editRowMaharat = 0;
    CounterRowMaharat = 1;
    CounterRowLangauge = 1;
    editRowDore = 0;
    CounterRowDore = 1;
    $("#txtSearchPersonelCode").val(personelcode);
    $(".error-icon").remove();
    $("input,select").removeClass("input-err-border");

    if (personelcode == "") {
        ShowAlert("لطفا کد پرسنلی را وارد نمایید!");
    }
    else if (!numbericFild.test(personelcode)) {
        ShowAlert("لطفا کد پرسنلی را به صورت عددی وارد نمایید!");
    }
    else {
        $("#loadingSearchPersonelCode").html("<img src='images/loading.gif'/>");
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 5, personelcode: personelcode },
            url: "PostBack/PBContractReg.ashx",
            success: function (data) {
                $("#loadingSearchPersonelCode").html("");
                if (data[0] == "1") {
                    var marridCheck = "";

                    var cnt = 1;
                    var header = "", mainrow = "", footer = "", row = "", allrow = "";
                    var cartNumber = "", sheba = "";
                    $.each(data[1], function (index) {

                        //========================================================
                        $("#txtName").val(JSON.stringify(this['strPersonelName']).replaceAll("\"", ""));

                        $("#txtFamily").val(JSON.stringify(this['strPersonelFamily']).replaceAll("\"", ""));
                        $("#txtFatherName").val(JSON.stringify(this['strFatherName']).replaceAll("\"", ""));
                        $("#txtMelliCode").val(JSON.stringify(this['strMelliCode']).replaceAll("\"", ""));
                        $("#txtNumberShenasname").val(JSON.stringify(this['strNumberShenasname']).replaceAll("\"", ""));
                        var mosalsal = JSON.stringify(this['strMosalsalShenasname']).replaceAll("\"", "");
                        if (mosalsal != null) {
                            $("#drpdwnharf option:contains(" + mosalsal.split('/')[0] + ")").attr('selected', 'selected');
                            $("#txtMosalsalShenasname1").val(mosalsal.split('/')[1]);
                            $("#txtMosalsalShenasname2").val(mosalsal.split('/')[2]);
                        }
                        $("#pcaldateBrithdayDate").val(JSON.stringify(this['dateBrithdayDate']).replaceAll("\"", ""));
                        $("#txtBrithdayCityRef").val(JSON.stringify(this['strBrithdayCityRef']).replaceAll("\"", ""));
                        $("#txtExportCityRef").val(JSON.stringify(this['strExportCityRef']).replaceAll("\"", ""));
                        $("#drpdwnMeliat").val(JSON.stringify(this['numMeliat']).replaceAll("\"", "").toString());
                        $("#drpdwnJensiat").val(JSON.stringify(this['numJensiatRef']).replaceAll("\"", "").toString());
                        $("#drpdwnBlod").val(JSON.stringify(this['numBlodRef']).replaceAll("\"", "").toString());
                        $("#drpdwnReligion").val(JSON.stringify(this['numReligionRef']).replaceAll("\"", "").toString());
                        $("#txtGilder").val(JSON.stringify(this['strGilderName']).replaceAll("\"", ""));
                        $("#drpdwnMarrid").val(JSON.stringify(this['numMarridRef']).replaceAll("\"", "").toString());
                        ShowMilitaryInfo();

                        if (JSON.stringify(this['numJensiatRef']).replaceAll("\"", "").toString() == "1") {
                            $("#drpdwnMilitary").val(JSON.stringify(this['numMilitaryRef']).replaceAll("\"", "").toString());
                            $("#titleStatusMilitary").show();
                            $("#divdrpdwnMilitary").show();
                        }


                        //========================================================
                        $("#drpdwnProvince").val(JSON.stringify(this['strProvinceRef']).replaceAll("\"", "").toString());
                        ShowDrpDwnInRegisterPage(2);
                        $("#drpdwnCity").val(JSON.stringify(this['strCityRef']).replaceAll("\"", "").toString());
                        $("#drpdwnHosing").val(JSON.stringify(this['numHosingRef']).replaceAll("\"", "").toString());
                        $("#txtPostCode").val(JSON.stringify(this['strPostCode']).replaceAll("\"", ""));
                        var tel = JSON.stringify(this['strTel']).replaceAll("\"", "");
                        $("#txtTel1").val(tel.split('-')[0]);
                        $("#txtTel").val(tel.split('-')[1]);
                        $("#txtMobile").val(JSON.stringify(this['strMobile']).replaceAll("\"", ""));
                        $("#txtTelNecessary").val(JSON.stringify(this['strTelNecessary']).replaceAll("\"", ""));
                        $("#txtEmail").val(JSON.stringify(this['strEmail']).replaceAll("\"", ""));
                        $("#txtPersonelAddress").val(JSON.stringify(this['strPersonelAddress']).replaceAll("\"", ""));
                        //========================================================
                        marridCheck = JSON.stringify(this['numMarridRef']).replaceAll("\"", "");

                    });
                    //========================================================

                    if (marridCheck.toString() == "2" || marridCheck.toString() == "3") {
                        ShowMarridInfo();

                        if (marridCheck.toString() == "2" || marridCheck.toString() == "3") {
                            cnt = 1;
                            header = "<table class='MainTbl' border='1' bordercolor='#ffffff'>" +
                                        "<thead><tr><td colspan='12' align='center'>مشخصات فرزند</td></tr><tr align='center'><th>ردیف</th><th>نام </th><th>نام خانوادگی </th><th>کد ملی </th><th>شماره شناسنامه </th><th>تاریخ تولد </th><th>نوع فرزند </th><th style='display:none;'></th><th class='hideaction'></th></tr></thead><tbody>";
                            mainrow = "<tr id='trRowChild{row}' ><td>{row}</td><td id='tdnameChild{row}'>{name}</td><td id='tdfamilyChild{row}'>{family}</td><td id='tdcodemelliChild{row}'>{codemelli}</td><td id='tdshshChild{row}'>{shsh}</td><td id='tdDateBrithdayChild{row}'>{DateBrithdayChild}</td><td id='tdChildKind{row}'>{ChildKind}</td><td id='tdChildKindId{row}' style='display:none;'>{ChildKindId}</td><td class='hideaction'>{action}</td></tr>";
                            footer = "</tbody></table>";
                            row = "", allrow = "";
                            var childkindName = "";
                            var t1 = 0;
                            $.each(data[2], function (index) {
                                row = mainrow.replaceAll("{name}", JSON.stringify(this['strChildName']).replaceAll("\"", ""));
                                row = row.replaceAll("{family}", JSON.stringify(this['strChildFamily']).replaceAll("\"", ""));
                                row = row.replaceAll("{codemelli}", JSON.stringify(this['strChildMelliCode']).replaceAll("\"", ""));
                                row = row.replaceAll("{shsh}", JSON.stringify(this['strNumberShenasname']).replaceAll("\"", ""));
                                row = row.replaceAll("{DateBrithdayChild}", JSON.stringify(this['dateChildBrithDayDate']).replaceAll("\"", ""));
                                childkindName = JSON.stringify(this['numChildKind']).replaceAll("\"", "");
                                $("#drpdwnChildKind").val(childkindName.toString());
                                childkindName = $("#drpdwnChildKind option:selected").text();
                                $("#drpdwnChildKind").val(-1);
                                row = row.replaceAll("{ChildKind}", childkindName);
                                row = row.replaceAll("{ChildKindId}", JSON.stringify(this['numChildKind']).replaceAll("\"", ""));
                                row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoChild(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteChildInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                                row = row.replaceAll("{row}", cnt);
                                allrow = allrow + row;
                                CounterRowChild++;
                                cnt++;
                                t1 = 1;
                            });

                            if (t1 == 1) {
                                $("#drpdwnCntChild").val(cnt - 1);
                                if (cnt > 1) {

                                    $("#ResaultInfoChild").html(header + allrow + footer);
                                    $("#ResaultInfoChild").show();
                                }

                                showInputInfoChild();

                            }
                        }

                        if (marridCheck.toString() == "2") {
                            //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                            header = "<table class='MainTbl' border='1' bordercolor='#ffffff'>" +
                                        "<thead><tr><td colspan='12' align='center'>مشخصات همسر</td></tr><tr align='center'><th>ردیف</th><th>نام </th><th>نام خانوادگی </th><th>کد ملی </th><th>شماره شناسنامه </th><th>تاریخ تولد</th><th>تاریخ ازدواج</th><th class='hideaction'></th></tr></thead><tbody>";
                            mainrow = "<tr id='trRow{row}' ><td>{row}</td><td id='tdname{row}'>{name}</td><td id='tdfamily{row}'>{family}</td><td id='tdcodemelli{row}'>{codemelli}</td><td id='tdshsh{row}'>{shsh}</td><td id='tdDateBrithdayMarrid{row}'>{BrithdayMarrid}</td><td id='tdDateMarridDate{row}'>{MarridDate}</td><td class='hideaction'>{action}</td></tr>";
                            footer = "</tbody></table>";
                            row = "", allrow = "";
                            cnt = 1;
                            $.each(data[3], function (index) {
                                row = mainrow.replaceAll("{name}", JSON.stringify(this['strPersonName']).replaceAll("\"", ""));
                                row = row.replaceAll("{family}", JSON.stringify(this['strPersonFamily']).replaceAll("\"", ""));
                                row = row.replaceAll("{codemelli}", JSON.stringify(this['strPersonMelliCode']).replaceAll("\"", ""));
                                row = row.replaceAll("{shsh}", JSON.stringify(this['strNumberShenasname']).replaceAll("\"", ""));
                                row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoMarrid(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteMarridInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                                row = row.replaceAll("{BrithdayMarrid}", JSON.stringify(this['dateMarridBrithdayDate']).replaceAll("\"", ""));
                                row = row.replaceAll("{MarridDate}", JSON.stringify(this['dateMarridDate']).replaceAll("\"", ""));
                                row = row.replaceAll("{row}", cnt);
                                allrow = allrow + row;
                                CounterRowMarrid++;
                                cnt++;
                            });
                            if (cnt > 1) {
                                //$("#drpdwnCntChild").val(0);

                                $("#ResaultInfoMarrid").html(header + allrow + footer);
                                $("#ResaultInfoMarrid").show();
                            }
                        }
                    }
                    //========================================================
                    header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                                "<thead><tr><td colspan='12' align='center'>سوابق تحصیلی</td></tr><tr align='center'><th>ردیف</th><th>نام مرکز آموزشی</th><th>مدرک تحصیلی</th><th style='display:none;'>مقطع تحصیلی1</th><th>رشته تحصیلی</th><th>گرایش</th><th>تاریخ شروع تحصیل</th><th>تاریخ پایان تحصیل</th><th>معدل مدرک دریافتی</th><th class='hideaction'></th></tr></thead><tbody>";
                    mainrow = "<tr id='trRowUniversity{row}'><td>{row}</td><td id='tdUniverName{row}'>{UniverName}</td><td id='tdUniverMaghta{row}'>{UniverMaghta}</td><td id='tdUniverMaghtaId{row}' style='display:none;'>{UniverMaghtaId}</td><td id='tdUniverReshte{row}'>{UniverReshte}</td><td id='tdUniverGraiesh{row}'>{UniverGraiesh}</td><td id='tdStartDate{row}'>{StartDate}</td><td id='tdEndDate{row}'>{EndDate}</td><td id='tdUniverMoadel{row}'>{UniverMoadel}</td><td class='hideaction'>{action}</td></tr>";
                    footer = "</tbody></table>";
                    row = "", allrow = "";
                    cnt = 1;
                    var kind = "";

                    $.each(data[4], function (index) {
                        row = mainrow.replaceAll("{UniverName}", JSON.stringify(this['strUniversityName']).replaceAll("\"", ""));
                        $("#drpdwnUniversitySection").val(JSON.stringify(this['numUniversitySectionRef']));
                        kind = $("#drpdwnUniversitySection option:selected").text();
                        $("#drpdwnUniversitySection").val(-1);
                        row = row.replaceAll("{UniverMaghta}", kind);
                        row = row.replaceAll("{UniverMaghtaId}", JSON.stringify(this['numUniversitySectionRef']).replaceAll("\"", ""));
                        row = row.replaceAll("{UniverReshte}", JSON.stringify(this['strUniversityField']).replaceAll("\"", ""));
                        row = row.replaceAll("{UniverGraiesh}", JSON.stringify(this['strUniversityOrientation']).replaceAll("\"", ""));
                        row = row.replaceAll("{StartDate}", JSON.stringify(this['dateStartUniversityDate']).replaceAll("\"", ""));
                        row = row.replaceAll("{EndDate}", JSON.stringify(this['dateEndUniversityDate']).replaceAll("\"", ""));
                        row = row.replaceAll("{UniverMoadel}", JSON.stringify(this['strUniversityAvg']).replaceAll("\"", ""));
                        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoUniversity(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteUniversityInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                        row = row.replaceAll("{row}", cnt);
                        CounterRowUniversity++;
                        allrow = allrow + row;
                        cnt++;
                    });
                    if (cnt > 1) {

                        $("#trShowUniversityInfo").html(header + allrow + footer);
                        $("#trShowUniversityInfo").show();
                    }
                    //========================================================

                    header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                         "<thead><tr><td colspan='12' align='center'>دوره های آموزشی</td></tr><tr align='center'><th>ردیف</th><th>نام موسسه</th><th>نام دوره</th><th>تاریخ شروع دوره </th><th>تاریخ پایان دوره</th><th>مدت دوره </th><th>گواهینامه </th><th style='display:none;'>گواهینامه </th><th>عنوان گواهینامه </th><th class='hideaction'></th></tr></thead><tbody>";
                    mainrow = "<tr id='trRowDore{row}'><td>{row}</td><td id='tdMoseseName{row}'>{Mosese}</td><td id='tdDoreName{row}'>{dorename}</td><td id='tddateStartDore{row}'>{startdate}</td><td id='tddateEndDore{row}'>{enddate}</td><td id='tdTimeDore{row}'>{timedore}</td><td id='tdTimeDoreId{row}' style='display:none;'>{timedoreId}</td><td id='tdGovahiCheck{row}'>{govahiCheck}</td><td id='tdGovahiCheckId{row}' style='display:none;'>{govahiCheckId}</td><td id='tdGovahiName{row}'>{govahiname}</td><td class='hideaction'>{action}</td></tr>";
                    footer = "</tbody></table>";
                    row = "", allrow = "";
                    cnt = 1;
                    var govahiCheck = 0;
                    var govahiNametemp = "";
                    var timedore = "";
                    $.each(data[5], function (index) {
                        row = mainrow.replaceAll("{Mosese}", JSON.stringify(this['strEducationName']).replaceAll("\"", ""));
                        row = row.replaceAll("{dorename}", JSON.stringify(this['strLessonName']).replaceAll("\"", ""));
                        timedore = JSON.stringify(this['strEducationTime']).replaceAll("\"", "").toString();
                        $("#drpdwnTimeDore").val(timedore.split('-')[1]);
                        row = row.replaceAll("{timedore}", timedore.split('-')[0] + "-" + $("#drpdwnTimeDore option:selected").text());
                        row = row.replaceAll("{timedoreId}", timedore.split('-')[1]);
                        $("#drpdwnTimeDore").val(1);

                        row = row.replaceAll("{startdate}", JSON.stringify(this['dateStartLessonDate']).replaceAll("\"", ""));
                        row = row.replaceAll("{enddate}", JSON.stringify(this['dateEndLessonDate']).replaceAll("\"", ""));
                        if ($.trim(JSON.stringify(this['strGovahiNameTitle']).replaceAll("\"", "").toString()) == "" || $.trim(JSON.stringify(this['strGovahiNameTitle']).replaceAll("\"", "").toString()) == "null") {
                            govahiCheck = 0;
                            $("#govahiname1").hide();
                            $("#govahiname2").hide();
                            govahiNametemp = "----";
                        }
                        else {
                            govahiCheck = 1;
                            $("#govahiname1").show();
                            $("#govahiname2").show();
                            govahiNametemp = JSON.stringify(this['strGovahiNameTitle']).replaceAll("\"", "").toString();
                        }
                        $("#drpdwnGovahiCheck").val(govahiCheck);
                        row = row.replaceAll("{govahiCheck}", $("#drpdwnGovahiCheck option:selected").text());
                        $("#drpdwnGovahiCheck").val("0");
                        row = row.replaceAll("{govahiCheckId}", govahiCheck);
                        row = row.replaceAll("{govahiname}", govahiNametemp);
                        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoDore(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteDoreInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                        row = row.replaceAll("{row}", cnt);
                        allrow = allrow + row;
                        CounterRowDore++;
                        cnt++;
                    });
                    if (cnt > 1) {

                        $("#trShowDoreInfo").html(header + allrow + footer);
                        $("#trShowDoreInfo").show();
                    }
                    //========================================================

                    header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                   "<thead><tr><td colspan='12' align='center'>زبان های خارجی</td></tr><tr align='center'><th>ردیف</th><th>نام زبان</th><th>خواندن</th><th>نوشتن</th><th>صحبت کردن</th><th class='hideaction'></th></tr></thead><tbody>";
                    mainrow = "<tr id='trRowLangauge{row}'><td>{row}</td><td id='tdLangaugeName{row}'>{LangaugeName}</td><td id='tdreading{row}'>{reading}</td><td id='tdwriting{row}'>{writing}</td><td id='tdspiking{row}'>{spiking}</td><td class='hideaction'>{action}</td></tr>";
                    footer = "</tbody></table>";
                    row = "", allrow = "";
                    cnt = 1;
                    $.each(data[6], function (index) {
                        row = mainrow.replaceAll("{LangaugeName}", JSON.stringify(this['strLanguageName']).replaceAll("\"", ""));
                        row = row.replaceAll("{reading}", GetDropDownLanguageStates(cnt, "reading"));
                        $("#drpdwnLanguageStatesreading" + cnt).val(JSON.stringify(this['numReadingRef']).replaceAll("\"", ""));
                        row = row.replaceAll("{writing}", GetDropDownLanguageStates(cnt, "writing"));
                        $("#drpdwnLanguageStateswriting" + cnt).val(JSON.stringify(this['numWritingRef']).replaceAll("\"", ""));
                        row = row.replaceAll("{spiking}", GetDropDownLanguageStates(cnt, "spiking"));
                        $("#drpdwnLanguageStatesspiking" + cnt).val(JSON.stringify(this['numSpeakingRef']).replaceAll("\"", ""));
                        row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeleteLangugeInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                        row = row.replaceAll("{row}", cnt);
                        allrow = allrow + row;
                        CounterRowLangauge++;
                        cnt++;
                    });
                    if (cnt > 1) {

                        $("#trShowLangugeInfo").html(header + allrow + footer);
                        $("#trShowLangugeInfo").show();
                    }
                    //========================================================
                    header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                    "<thead><tr><td colspan='12' align='center'>توانایی و مهارت ها</td></tr><tr align='center'><th>ردیف</th><th>عنوان مهارت</th><th>توضیح مهارت</th><th>سطح مهارت</th><th style='display:none;'>سطح مهارت</th><th class='hideaction'></th></tr></thead><tbody>";
                    mainrow = "<tr id='trRowMaharat{row}'><td>{row}</td><td id='tdMaharatName{row}'>{MaharatName}</td><td id='tdMaharatDesc{row}'>{MaharatDesc}</td><td id='tdMaharatLevel{row}'>{MaharatLevel}</td><td id='tdMaharatLevelId{row}' style='display:none;'>{MaharatLevelId}</td><td class='hideaction'>{action}</td></tr>";
                    footer = "</tbody></table>";
                    row = "", allrow = "";
                    cnt = 1;
                    var maharatLevel = "";
                    $.each(data[7], function (index) {
                        row = mainrow.replaceAll("{MaharatName}", JSON.stringify(this['strSkillName']).replaceAll("\"", ""));
                        row = row.replaceAll("{MaharatDesc}", JSON.stringify(this['strSkillDesc']).replaceAll("\"", ""));
                        maharatLevel = JSON.stringify(this['numMaharatLevel']).replaceAll("\"", "").toString();
                        $("#drpdwnLevelMaharat").val(maharatLevel);
                        row = row.replaceAll("{MaharatLevel}", $("#drpdwnLevelMaharat option:selected").text());
                        $("#drpdwnLevelMaharat").val("-1");
                        row = row.replaceAll("{MaharatLevelId}", maharatLevel);
                        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoMaharat(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteMaharatInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                        row = row.replaceAll("{row}", cnt);
                        allrow = allrow + row;
                        CounterRowMaharat++;
                        cnt++;
                    });
                    if (cnt > 1) {

                        $("#trShowMaharatInfo").html(header + allrow + footer);
                        $("#trShowMaharatInfo").show();
                    }

                    //========================================================
                    header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                     "<thead><tr><td colspan='12' align='center'>سوابق کاری</td></tr><tr align='center'><th>ردیف</th><th>نام محل خدمت</th><th>سمت</th><th>مدت اشتغال از تاریخ</th><th>مدت اشتغال تا تاریخ</th><th>شرح وظیفه</th><th class='hideaction'></th></tr></thead><tbody>";
                    mainrow = "<tr id='trRowJob{row}'><td>{row}</td><td id='tdJobName{row}'>{jobname}</td><td id='tdMasoliat{row}'>{masoliat}</td><td id='tdModatFrom{row}'>{modatFrom}</td><td id='tdModatTo{row}'>{modatTo}</td><td id='tdvazife{row}'>{vazife}</td><td class='hideaction'>{action}</td></tr>";
                    footer = "</tbody></table>";
                    row = "", allrow = "";
                    cnt = 1;
                    $.each(data[8], function (index) {
                        row = mainrow.replaceAll("{jobname}", JSON.stringify(this['strJobPlaceName']).replaceAll("\"", ""));
                        row = row.replaceAll("{masoliat}", JSON.stringify(this['strResponsibilityName']).replaceAll("\"", ""));
                        row = row.replaceAll("{modatFrom}", JSON.stringify(this['dateResponsibilityFromDate']).replaceAll("\"", ""));
                        row = row.replaceAll("{modatTo}", JSON.stringify(this['dateResponsibilityToDate']).replaceAll("\"", ""));
                        row = row.replaceAll("{vazife}", JSON.stringify(this['strResponsibilityDesc']).replaceAll("\"", ""));
                        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoJobHistory(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteJobHistoryInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                        row = row.replaceAll("{row}", cnt);
                        allrow = allrow + row;
                        CounterRowJobHistory++;
                        cnt++;
                    });
                    if (cnt > 1) {
                        $("#trShowJobHistoryInfo").html(header + allrow + footer);
                        $("#trShowJobHistoryInfo").show();
                    }

                    //============================image============================
                    var imagename = "";
                    $.each(data[9], function (index) {
                        imagename = $.trim(JSON.stringify(this['strUploadImage']).replaceAll("\"", "").toString());
                        if (imagename != "") tempImageFileTemp = tempImageFileTemp + "<div style='float:right;width:20%;margin-left:10px;margin-top:10px;'><a style='cursor:pointer;display:block;' href='Images/PersonelImge/" + imagename + "' target='_blank'><img src='Images/PersonelImge/" + imagename + "' style='width:100%;height:100%;'/></a></div>";
                    });
                    //============================pak kardan null============================
                    $('input[type=text], textarea').each(function () {
                        if ($(this).val() == "null") $(this).val('');
                    });
                    //======================================================================
                    if (type == 1) // edit and insert info personel
                    {
                        $("#hrInfoAllPersonel").show();
                        $("#trInfoAllPersonel").show();
                    }
                    else if (type == 2) // namaiesh joziat dar ghesmate search
                    {
                        $("#pnlInfoPersonel").dialog({
                            modal: true,
                            autoOpen: false,
                            resizable: false,
                            title: "مشاهده جزئیات اطلاعات پرسنل",
                            width: 750,
                            dialogClass: 'RightToLeftText',
                            closeOnEscape: true,
                            buttons: {
                                "پرینت": function () {
                                    PrintElem('#pnlInfoPersonel');
                                    //$("#trPnlPersonelAllInfo").html("");
                                    //$("#trPnlPersonelCodeInfo").html("");

                                },
                                "بستن": function () {
                                    $(this).focus();
                                    $("#trPnlPersonelAllInfo").html("");
                                    $("#trPnlPersonelCodeInfo").html("");
                                    $(this).dialog("close");
                                }
                            }
                        });

                        $("#trPnlPersonelCodeInfo").html($("#txtSearchPersonelCode").val());
                        ShowNextPage(8);
                        $("#trPnlPersonelAllInfo").html($("#stepInfo9").html());
                        $("#trPnlPersonelAllInfo .wizard-actions").remove();

                        $("#txtSearchPersonelCode").val("");
                        publicpersonelCode = "";
                        tempImageFileTemp = "";

                        $("#hrInfoAllPersonel").hide();
                        $("#trInfoAllPersonel").hide();
                        $("input[type=text], textarea").val("");
                        $("select").val("-1");

                        $("#ResaultInfoMarrid").html("");
                        $("#ResaultInfoChild").html("");
                        $("#trShowUniversityInfo").html("");
                        $("#trShowDoreInfo").html("");
                        $("#trShowLangugeInfo").html("");
                        $("#trShowMaharatInfo").html("");
                        $("#trShowJobHistoryInfo").html("");
                        // $("#trShowBimeInfo").html("");

                        $("#lblResaultInfoMarrid").html("");
                        $("#lblResaultInfoChild").html("");
                        $("#lblShowUniversityInfo").html("");
                        $("#lblShowDoreInfo").html("");
                        $("#lblShowBimehInfo").html("");
                        $("#lblShowLangugeInfo").html("")
                        $("#lblShowMaharatInfo").html("");
                        $("#lblShowJobHistoryInfo").html("");
                        $("#lblShowImageFile").html("");
                        $("#tdPreViewImageUpFile").html("");

                        $("#trMarridInfo").hide();
                        CountAllMarid = 0;
                        CountAllMaridCounter = 0;
                        CounterRowMarrid = 1;
                        editRowMarrid = 0;
                        CountAllChild = 0;
                        CountAllChildCounter = 0;
                        CounterRowChild = 1;
                        editRowChild = 0;
                        CounterRowUniversity = 1;
                        editRowUniversity = 0;
                        editRowJobHistory = 0;
                        CounterRowJobHistory = 1;
                        editRowMaharat = 0;
                        CounterRowMaharat = 1;
                        CounterRowLangauge = 1;
                        editRowDore = 0;
                        CounterRowDore = 1;
                        $(".error-icon").remove();
                        $("input,select").removeClass("input-err-border");

                        $("#CheckOut").fadeOut();
                        $("#Loading").fadeOut();
                        $("#pnlInfoPersonel").dialog("open");
                    }

                    //======================================================
                    $("#yearlblDateFrom").val(DateFrom.split('/')[0]);
                    $("#monthlblDateFrom").val(DateFrom.split('/')[1]);
                    $("#daylblDateFrom").val(DateFrom.split('/')[2]);
                    $("#yearlblDateTo").val(DateTo.split('/')[0]);
                    $("#monthlblDateTo").val(DateTo.split('/')[1]);
                    $("#daylblDateTo").val(DateTo.split('/')[2]);
                }
                else {
                    $("#CheckOut").hide();
                    $("#Loading").hide();
                    $("#hrInfoAllPersonel").hide();
                    $("#trInfoAllPersonel").hide();
                    ShowAlert("کد پرسنلی وارد شده در سیستم یافت نشده است !");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#CheckOut").hide();
                $("#Loading").hide();
                $("#loadingSearchPersonelCode").html("");
                ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            }
        });
    }


}
//===========================================================================
var numbericFild = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
var drpdwnjensiat = "";
var drpdwnmilitary = "";
var drpdwnreligion = "";
var drpdwnblod = "";
var drpdwnMarrid = "";
var drpdwnhosing = "";
var drpdwnunivercitysection = "";
var drpdwnProvince = "";
var drpdwnCity = "";
var drpdwnLanguageStates = "";
var drpdwnUnitOrganizations = "";
//var drpdwnContractKinds = "";
//var drpdwnJobStatus = "";
function GetDrpdwnBaseAll() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    drpdwnjensiat = "";
    drpdwnmilitary = "";
    drpdwnreligion = "";
    drpdwnblod = "";
    drpdwnMarrid = "";
    drpdwnhosing = "";
    drpdwnunivercitysection = "";
    drpdwnProvince = "";
    drpdwnCity = "";
    drpdwnLanguageStates = "";
    drpdwnUnitOrganizations = "";
    //drpdwnContractKinds = "";
    //drpdwnJobStatus = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBContractReg.ashx",
        success: function (data) {
            drpdwnjensiat = data[0];
            drpdwnmilitary = data[1];
            drpdwnreligion = data[2];
            drpdwnblod = data[3];
            drpdwnMarrid = data[4];
            drpdwnhosing = data[5];
            drpdwnunivercitysection = data[6];
            drpdwnProvince = data[7];
            drpdwnCity = data[8];
            drpdwnLanguageStates = data[9];
            drpdwnUnitOrganizations = data[10];
            //drpdwnContractKinds = data[11];
            //drpdwnJobStatus = data[12];
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
    selectMarrid = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' onchange='ShowMarridInfo();' style='width:176px;'>";
    selectJensiat = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' onchange='ShowMilitaryInfo();' style='width:176px;'>";
    option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}'>{item}</option>";
    selectEnd = "</select>";
    var row = "", allrow = "";
    var selectTemp = "";
    if (type == 1) {
        //--------------------- jensiat -------------------------------------------
        $.each(drpdwnjensiat, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectJensiat.replaceAll("{dpdwnId}", "drpdwnJensiat");
        $("#divdrpdwnJensiat").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- military -------------------------------------------
        allrow = "";
        $.each(drpdwnmilitary, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnMilitary");
        $("#divdrpdwnMilitary").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- religion -------------------------------------------
        allrow = "";
        $.each(drpdwnreligion, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnReligion");
        $("#divdrpdwnReligion").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- blod -------------------------------------------
        allrow = "";
        $.each(drpdwnblod, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnBlod");
        $("#divdrpdwnBlod").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- Marrid -------------------------------------------
        allrow = "";
        $.each(drpdwnMarrid, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectMarrid.replaceAll("{dpdwnId}", "drpdwnMarrid");
        $("#divdrpdwnMarrid").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- hosingState -------------------------------------------
        allrow = "";
        $.each(drpdwnhosing, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnHosing");
        $("#divdrpdwnHosing").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
        //--------------------- univercitysection -------------------------------------------
        allrow = "";
        $.each(drpdwnunivercitysection, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnUniversitySection");
        $("#divdrpdwnUniversitySection").html(selectTemp + option0 + allrow + selectEnd);
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
        //--------------------------------------------------------------------------

        //--------------------------------------------------------------------------
        //--------------------- JobStatus -------------------------------------------
        //allrow = "";
        //$.each(drpdwnJobStatus, function (index) {
        //    row = option.replaceAll("{value}", this['value']);
        //    row = row.replaceAll("{item}", this['item']);
        //    allrow = allrow + row;
        //});
        //selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnjobStatus");
        //$("#divdrpdwnjobStatus").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------

        //--------------------------------------------------------------------------
        //--------------------- UnitOrganizations -------------------------------------------
        allrow = "";
        $.each(drpdwnUnitOrganizations, function (index) {
            row = option.replaceAll("{value}", this['value']);
            row = row.replaceAll("{item}", this['item']);
            allrow = allrow + row;
        });
        selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnUnitOrganization");
        $("#divdrpdwnUnitOrganization").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------

        //--------------------------------------------------------------------------
        //--------------------- ContractKinds -------------------------------------------
        //allrow = "";
        //$.each(drpdwnContractKinds, function (index) {
        //    row = option.replaceAll("{value}", this['value']);
        //    row = row.replaceAll("{item}", this['item']);
        //    allrow = allrow + row;
        //});
        //selectTemp = selectStart.replaceAll("{dpdwnId}", "drpdwnContractKind");
        //$("#divdrpdwnContractKind").html(selectTemp + option0 + allrow + selectEnd);
        //--------------------------------------------------------------------------
    }

    if (type == 1 || type == 2) {
        //--------------------- city -------------------------------------------
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
        //--------------------------------------------------------------------------
    }
}
//============================================================================
function ShowNextPage(id) {

    if (id == 8) {
        $("#lblName").html($("#txtName").val());
        $("#lblFamily").html($("#txtFamily").val());
        $("#lblFatherName").html($("#txtFatherName").val());
        $("#lblMelliCode").html($("#txtMelliCode").val());
        $("#lblNumberShenasname").html($("#txtNumberShenasname").val());
        $("#lblMosalsalShenasname").html($("#drpdwnharf option:selected").text() + "/" + $("#txtMosalsalShenasname1").val() + "/" + $("#txtMosalsalShenasname2").val());

        $("#lbldateBrithdayDate").html($("#pcaldateBrithdayDate").val());
        $("#lblBrithdayCityRef").html($("#txtBrithdayCityRef").val());

        $("#lblExportCityRef").html($("#txtExportCityRef").val());
        $("#lblMeliat").html($("#drpdwnMeliat option:selected").text());

        $("#lblJensiat").html($("#drpdwnJensiat option:selected").text());
        $("#lblBlod").html($("#drpdwnBlod option:selected").text());
        $("#lblReligion").html($("#drpdwnReligion option:selected").text());
        $("#lblGilder").html($("#txtGilder").val());
        $("#lblMarrid").html($("#drpdwnMarrid option:selected").text());
        if ($("#drpdwnMarrid").val() == 2) {
            $("#lbltrMarridBaseInfo1").show();
            $("#lbltrMarridBaseInfo2").show();
            $("#lbldateMarridDate").html($("#pcaldateMarridDate").val());
            $("#lblCntHasuband").html($("#drpdwnCntHasuband option:selected").text());
            $("#lblCntChild").html($("#drpdwnCntChild option:selected").text());
            $("#lblResaultInfoMarrid").html($("#ResaultInfoMarrid").html());
            $("#lblResaultInfoChild").html($("#ResaultInfoChild").html());
        }
        else if ($("#drpdwnMarrid").val() == 3) {
            $("#lblCntChild").html($("#drpdwnCntChild option:selected").text());
            $("#lblResaultInfoChild").html($("#ResaultInfoChild").html());
        }
        else {
            $("#lbldateMarridDate").html("");
            $("#lblCntHasuband").html("");
            $("#lblCntChild").html("");
            $("#lbltrMarridBaseInfo1").hide();
            $("#lbltrMarridBaseInfo2").hide();
            $("#lblResaultInfoMarrid").html("");
            $("#lblResaultInfoChild").html("");
        }

        if ($("#drpdwnJensiat").val() == 1) {
            $("#titleStatusMilitaryprint").show();
            $("#lblMilitary").html($("#drpdwnMilitary option:selected").text());
            $("#lblMilitary").show();
        }
        else {
            $("#titleStatusMilitaryprint").hide();
            $("#lblMilitary").html("");
            $("#lblMilitary").hide();
        }


        $("#lblProvince").html($("#drpdwnProvince option:selected").text());
        $("#lblCity").html($("#drpdwnCity option:selected").text());
        $("#lblHosing").html($("#drpdwnHosing option:selected").text());
        $("#lblPostCode").html($("#txtPostCode").val());
        $("#lblTel").html($.trim($("#txtTel1").val()) + "-" + $.trim($("#txtTel").val()));
        $("#lblMobile").html($("#txtMobile").val());
        $("#lblTelNecessary").html($("#txtTelNecessary").val());
        $("#lblEmail").html($("#txtEmail").val());
        $("#lblPersonelAddress").html($("#txtPersonelAddress").val());

        $("#lblShowUniversityInfo").html($("#trShowUniversityInfo").html());
        $("#lblShowDoreInfo").html($("#trShowDoreInfo").html());
        // $("#lblShowBimehInfo").html($("#trShowBimeInfo").html());

        if ($.trim($("#trShowLangugeInfo").html()) != "") {

            var header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                 "<thead><tr><td colspan='12' align='center'>زبان های خارجی</td></tr><tr align='center'><th>ردیف</th><th>نام زبان</th><th>خواندن</th><th>نوشتن</th><th>صحبت کردن</th></tr></thead><tbody>";
            var mainrow = "<tr id='trRowLangauge{row}'><td>{row}</td><td id='tdLangaugeName{row}'>{LangaugeName}</td><td id='tdreading{row}'>{reading}</td><td id='tdwriting{row}'>{writing}</td><td id='tdspiking{row}'>{spiking}</td></tr>";
            var footer = "</tbody></table>";
            var row = "", allrow = "";
            for (var i = 1; i <= (CounterRowLangauge - 1) ; i++) {
                if ($.trim($("#tdLangaugeName" + i).html()) != undefined && $.trim($("#tdLangaugeName" + i).html()) != null && $.trim($("#tdLangaugeName" + i).html()) != "") {
                    row = mainrow.replaceAll("{LangaugeName}", $.trim($("#tdLangaugeName" + i).html()));
                    row = row.replaceAll("{reading}", $("#drpdwnLanguageStatesreading" + i + " option:selected").text());
                    row = row.replaceAll("{writing}", $("#drpdwnLanguageStateswriting" + i + " option:selected").text());
                    row = row.replaceAll("{spiking}", $("#drpdwnLanguageStatesspiking" + i + " option:selected").text());
                    //row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeleteLangugeInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
                    row = row.replaceAll("{row}", i);
                    allrow = allrow + row;
                }
            }

            $("#lblShowLangugeInfo").html(header + allrow + footer);


        }
        else {
            $("#lblShowLangugeInfo").html("");
        }

        $("#lblShowMaharatInfo").html($("#trShowMaharatInfo").html());
        $("#lblShowJobHistoryInfo").html($("#trShowJobHistoryInfo").html());

        $("#lblShowImageFile").html($("#tdPreViewImageUpFile").html());
    }
    if (id == 7) {
        GetInfoForUpFile();
    }
    var Result = CheckItemsInPage(id);
    if (Result == 1) {
        $("#stepInfo" + id).removeClass("active");
        $("#step" + id).removeClass("active").addClass("complete");

        $("#stepInfo" + (id + 1)).addClass("active");
        $("#step" + (id + 1)).addClass("active");
    }

}
//============================================================================
function ShowPrevPage(id) {
    $(".hideaction").show();
    if (id < 8) { $("#tblUploadFiles").html(""); }
    $("#lblResaultInfoMarrid").html("");
    $("#lblResaultInfoChild").html("");
    $("#lblShowUniversityInfo").html("");
    $("#lblShowDoreInfo").html("");
    $("#lblShowLangugeInfo").html("");
    $("#lblShowMaharatInfo").html("");
    $("#lblShowJobHistoryInfo").html("");
    $("#lblShowBimehInfo").html("");

    $("#stepInfo" + id).removeClass("active");
    $("#step" + id).removeClass("active");

    $("#stepInfo" + (id - 1)).addClass("active");
    $("#step" + (id - 1)).removeClass("complete").addClass("active");
}
//============================================================================
function ShowStepClick(id) {

    $(".hideaction").show();
    var activeclasss = "";
    var check = 0;
    for (var i = 1; i <= 9; i++) {
        if ($("#stepInfo" + i).hasClass("active")) activeclasss = i;

    }
    if (id > activeclasss) {
        check = 1;
    }
    if (check == 0) {
        for (var i = 1; i <= 9; i++) {

            if (i == id) {
                $("#stepInfo" + id).addClass("active");
                $("#step" + id).removeClass("complete").addClass("active");
            }
            else if (i > id) {
                $("#stepInfo" + i).removeClass("active");
                $("#step" + i).removeClass("active").removeClass("complete");
            }
        }
    }

}
//===================================بررسی آیتم های صفحات=========================================
function CheckItemsInPage(id) {
    var error = 1;
    if (id == 1) {
        var name = $.trim($("#txtName").val());
        var family = $.trim($("#txtFamily").val());
        var fathername = $.trim($("#txtFatherName").val());
        var mellicode = $.trim($("#txtMelliCode").val());
        var NumberShenasname = $.trim($("#txtNumberShenasname").val());
        //var MosalsalShenasname = $.trim($("#txtMosalsalShenasname").val());
        var MosalsalShenasname1 = $.trim($("#txtMosalsalShenasname1").val());
        var MosalsalShenasname2 = $.trim($("#txtMosalsalShenasname2").val());
        var dateBrithdayDate = $.trim($("#pcaldateBrithdayDate").val());
        var BrithdayCityRef = $.trim($("#txtBrithdayCityRef").val());
        var ExportCityRef = $.trim($("#txtExportCityRef").val());
        var Meliat = $.trim($("#drpdwnMeliat").val());
        var Jensiat = $("#drpdwnJensiat").val();
        var Military = $("#drpdwnMilitary").val();
        var Religion = $("#drpdwnReligion").val();
        var Gilder = $.trim($("#txtGilder").val());
        var Blod = $("#drpdwnBlod").val();
        var Marrids = $("#drpdwnMarrid").val();
        if (name == "" && family == "" && fathername == "" && mellicode == "" && NumberShenasname == "" && MosalsalShenasname1 == "" && MosalsalShenasname2 == "" && dateBrithdayDate == "" && BrithdayCityRef == ""
            && ExportCityRef == "" && Meliat == "-1" && Jensiat == "-1" && (Jensiat == "1" && Military == "-1") && Religion == "-1" && Gilder == "" && Blod == "-1" && Marrids == "-1") {
            $(".error-icon").remove();
            $("input").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtName");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamily");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFatherName");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCode");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasname");
            //$("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMosalsalShenasname1");
            //$("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMosalsalShenasname2");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateBrithdayDate");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtBrithdayCityRef");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtExportCityRef");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnMeliat");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtGilder");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnJensiat");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnMilitary");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnReligion");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnBlod");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnMarrid");

            $("#txtName").addClass("input-err-border");
            $("#txtFamily").addClass("input-err-border");
            $("#txtFatherName").addClass("input-err-border");
            $("#txtMelliCode").addClass("input-err-border");
            $("#txtNumberShenasname").addClass("input-err-border");
            $("#txtMosalsalShenasname1").addClass("input-err-border");
            $("#txtMosalsalShenasname2").addClass("input-err-border");
            $("#pcaldateBrithdayDate").addClass("input-err-border");
            $("#txtBrithdayCityRef").addClass("input-err-border");
            $("#txtExportCityRef").addClass("input-err-border");
            $("#drpdwnMeliat").addClass("input-err-border");
            $("#txtGilder").addClass("input-err-border");
            $("#drpdwnJensiat").addClass("input-err-border");
            $("#drpdwnMilitary").addClass("input-err-border");
            $("#drpdwnReligion").addClass("input-err-border");
            $("#drpdwnBlod").addClass("input-err-border");
            $("#drpdwnMarrid").addClass("input-err-border");
            error = 0;
        }
        else {
            if (name == "") {
                $("#txtName").nextAll('.error-icon').remove();
                $("#txtName").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtName");
                $("#txtName").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtName").nextAll('.error-icon').remove();
                $("#txtName").removeClass("input-err-border");
            }
            if (family == "") {
                $("#txtFamily").nextAll('.error-icon').remove();
                $("#txtFamily").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamily");
                $("#txtFamily").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtFamily").nextAll('.error-icon').remove();
                $("#txtFamily").removeClass("input-err-border");
            }
            if (fathername == "") {
                $("#txtFatherName").nextAll('.error-icon').remove();
                $("#txtFatherName").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFatherName");
                $("#txtFatherName").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtFatherName").nextAll('.error-icon').remove();
                $("#txtFatherName").removeClass("input-err-border");
            }

            if (mellicode == "") {
                $("#txtMelliCode").nextAll('.error-icon').remove();
                $("#txtMelliCode").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCode");
                $("#txtMelliCode").addClass("input-err-border");
                error = 0;
            }
            else if (!CheckValidMelliCode(mellicode)) {
                ShowAlert("شماره ملی وارد شده معتبر نمی باشد!");
                $("#txtMelliCode").nextAll('.error-icon').remove();
                $("#txtMelliCode").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCode");
                $("#txtMelliCode").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(mellicode)) {
                ShowAlert("شماره ملی باید به صورت عددی باشد!");
                $("#txtMelliCode").nextAll('.error-icon').remove();
                $("#txtMelliCode").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCode");
                $("#txtMelliCode").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtMelliCode").nextAll('.error-icon').remove();
                $("#txtMelliCode").removeClass("input-err-border");
            }

            if (NumberShenasname == "") {
                $("#txtNumberShenasname").nextAll('.error-icon').remove();
                $("#txtNumberShenasname").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasname");
                $("#txtNumberShenasname").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(NumberShenasname)) {
                ShowAlert("شماره شناسنامه بایستی عددی باشد!");
                $("#txtNumberShenasname").nextAll('.error-icon').remove();
                $("#txtNumberShenasname").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasname");
                $("#txtNumberShenasname").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtNumberShenasname").nextAll('.error-icon').remove();
                $("#txtNumberShenasname").removeClass("input-err-border");
            }

            if (MosalsalShenasname1 == "") {
                $("#txtMosalsalShenasname1").nextAll('.error-icon').remove();
                $("#txtMosalsalShenasname1").removeClass("input-err-border");

                // $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMosalsalShenasname1");
                $("#txtMosalsalShenasname1").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(MosalsalShenasname1)) {
                ShowAlert("شماره سریال شناسنامه بایستی عددی باشد!");
                $("#txtMosalsalShenasname1").nextAll('.error-icon').remove();
                $("#txtMosalsalShenasname1").removeClass("input-err-border");

                // $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMosalsalShenasname1");
                $("#txtMosalsalShenasname1").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtMosalsalShenasname1").nextAll('.error-icon').remove();
                $("#txtMosalsalShenasname1").removeClass("input-err-border");
            }

            if (MosalsalShenasname2 == "") {
                $("#txtMosalsalShenasname2").nextAll('.error-icon').remove();
                $("#txtMosalsalShenasname2").removeClass("input-err-border");

                // $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMosalsalShenasname2");
                $("#txtMosalsalShenasname2").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(MosalsalShenasname2)) {
                ShowAlert("شماره سریال شناسنامه بایستی عددی باشد!");
                $("#txtMosalsalShenasname2").nextAll('.error-icon').remove();
                $("#txtMosalsalShenasname2").removeClass("input-err-border");

                // $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMosalsalShenasname2");
                $("#txtMosalsalShenasname2").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtMosalsalShenasname2").nextAll('.error-icon').remove();
                $("#txtMosalsalShenasname2").removeClass("input-err-border");
            }

            if (dateBrithdayDate == "") {
                $("#pcaldateBrithdayDate").nextAll('.error-icon').remove();
                $("#pcaldateBrithdayDate").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateBrithdayDate");
                $("#pcaldateBrithdayDate").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#pcaldateBrithdayDate").nextAll('.error-icon').remove();
                $("#pcaldateBrithdayDate").removeClass("input-err-border");
            }

            if (BrithdayCityRef == "") {
                $("#txtBrithdayCityRef").nextAll('.error-icon').remove();
                $("#txtBrithdayCityRef").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtBrithdayCityRef");
                $("#txtBrithdayCityRef").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtBrithdayCityRef").nextAll('.error-icon').remove();
                $("#txtBrithdayCityRef").removeClass("input-err-border");
            }

            if (ExportCityRef == "") {
                $("#txtExportCityRef").nextAll('.error-icon').remove();
                $("#txtExportCityRef").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtExportCityRef");
                $("#txtExportCityRef").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtExportCityRef").nextAll('.error-icon').remove();
                $("#txtExportCityRef").removeClass("input-err-border");
            }

            if (Meliat == "-1") {
                $("#drpdwnMeliat").nextAll('.error-icon').remove();
                $("#drpdwnMeliat").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnMeliat");
                $("#drpdwnMeliat").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnMeliat").nextAll('.error-icon').remove();
                $("#drpdwnMeliat").removeClass("input-err-border");
            }

            if (Jensiat == "-1") {
                $("#drpdwnJensiat").nextAll('.error-icon').remove();
                $("#drpdwnJensiat").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnJensiat");
                $("#drpdwnJensiat").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnJensiat").nextAll('.error-icon').remove();
                $("#drpdwnJensiat").removeClass("input-err-border");
            }

            if (Jensiat == "1" && Military == "-1") {
                $("#drpdwnMilitary").nextAll('.error-icon').remove();
                $("#drpdwnMilitary").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnMilitary");
                $("#drpdwnMilitary").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnMilitary").nextAll('.error-icon').remove();
                $("#drpdwnMilitary").removeClass("input-err-border");
            }

            if (Religion == "-1") {
                $("#drpdwnReligion").nextAll('.error-icon').remove();
                $("#drpdwnReligion").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnReligion");
                $("#drpdwnReligion").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnReligion").nextAll('.error-icon').remove();
                $("#drpdwnReligion").removeClass("input-err-border");
            }

            if (Gilder == "") {
                $("#txtGilder").nextAll('.error-icon').remove();
                $("#txtGilder").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtGilder");
                $("#txtGilder").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtGilder").nextAll('.error-icon').remove();
                $("#txtGilder").removeClass("input-err-border");
            }

            if (Blod == "-1") {
                $("#drpdwnBlod").nextAll('.error-icon').remove();
                $("#drpdwnBlod").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnBlod");
                $("#drpdwnBlod").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnBlod").nextAll('.error-icon').remove();
                $("#drpdwnBlod").removeClass("input-err-border");
            }

            if (Marrids == "-1") {
                $("#drpdwnMarrid").nextAll('.error-icon').remove();
                $("#drpdwnMarrid").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnMarrid");
                $("#drpdwnMarrid").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnMarrid").nextAll('.error-icon').remove();
                $("#drpdwnMarrid").removeClass("input-err-border");
            }
            //==============================================================================================

            if (Marrids == 2 || Marrids == 3) {
                var CntChild = $("#drpdwnCntChild").val();

                if (CntChild == "-1") {
                    $("#drpdwnCntChild").nextAll('.error-icon').remove();
                    $("#drpdwnCntChild").removeClass("input-err-border");

                    $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnCntChild");
                    $("#drpdwnCntChild").addClass("input-err-border");
                    error = 0;
                }
                else {
                    $("#drpdwnCntChild").nextAll('.error-icon').remove();
                    $("#drpdwnCntChild").removeClass("input-err-border");
                }


            }
            else {
                //$("#pcaldateMarridDate").nextAll('.error-icon').remove();
                //$("#pcaldateMarridDate").removeClass("input-err-border");
                //$("#drpdwnCntHasuband").nextAll('.error-icon').remove();
                //$("#drpdwnCntHasuband").removeClass("input-err-border");
                $("#drpdwnCntChild").nextAll('.error-icon').remove();
                $("#drpdwnCntChild").removeClass("input-err-border");
            }

            //===============================================================================================
            if (Marrids == 2 || Marrids == 3) {

                if (Marrids == 2) {
                    if ($("#ResaultInfoMarrid").css("display") == "none") {

                        var name = $.trim($("#txtNameMarird").val());
                        var family = $.trim($("#txtFamilyMarird").val());
                        var MelliCode = $.trim($("#txtMelliCodeMarird").val());
                        var NumberShenasname = $.trim($("#txtNumberShenasnameMarird").val());
                        var MarridBrithdayDate = $.trim($("#pcaldateMarridBrithdayDate").val());
                        var dateMarridDate = $.trim($("#pcaldateMarridDate").val());
                        if (name == "" && family == "" && MelliCode == "" && NumberShenasname == "" && MarridBrithdayDate == "" && dateMarridDate == "") {
                            $(".error-icon-marrid").remove();
                            $("input").removeClass("input-err-border-marrid ");

                            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameMarird");
                            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyMarird");
                            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
                            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
                            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridBrithdayDate");
                            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridDate");

                            $("#txtNameMarird").addClass("input-err-border-marrid ");
                            $("#txtFamilyMarird").addClass("input-err-border-marrid ");
                            $("#txtMelliCodeMarird").addClass("input-err-border-marrid ");
                            $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid ");
                            $("#pcaldateMarridBrithdayDate").addClass("input-err-border-marrid ");
                            $("#pcaldateMarridDate").addClass("input-err-border-marrid ");

                            error = 0;
                        }
                        else {
                            if (name == "") {
                                $("#txtNameMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtNameMarird").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameMarird");
                                $("#txtNameMarird").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else {
                                $("#txtNameMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtNameMarird").removeClass("input-err-border-marrid");
                            }

                            if (family == "") {
                                $("#txtFamilyMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtFamilyMarird").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyMarird");
                                $("#txtFamilyMarird").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else {
                                $("#txtFamilyMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtFamilyMarird").removeClass("input-err-border-marrid");
                            }

                            if (MelliCode == "") {
                                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
                                $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else if (!CheckValidMelliCode(MelliCode)) {
                                ShowAlert("شماره ملی همسر نامعتبر می باشد!");
                                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
                                $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else if (!numbericFild.test(MelliCode)) {
                                ShowAlert("شماره ملی همسر عددی باید باشد!");
                                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
                                $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else {
                                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");
                            }

                            if (NumberShenasname == "") {
                                $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
                                $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else if (!numbericFild.test(NumberShenasname)) {
                                ShowAlert("شماره شناسنامه همسر باید عددی باشد!");
                                $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
                                $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else {
                                $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
                                $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");
                            }


                            if (MarridBrithdayDate == "") {
                                $("#pcaldateMarridBrithdayDate").nextAll('.error-icon-marrid').remove();
                                $("#pcaldateMarridBrithdayDate").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridBrithdayDate");
                                $("#pcaldateMarridBrithdayDate").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else {
                                $("#pcaldateMarridBrithdayDate").nextAll('.error-icon-marrid').remove();
                                $("#pcaldateMarridBrithdayDate").removeClass("input-err-border-marrid");
                            }

                            if (dateMarridDate == "") {
                                $("#pcaldateMarridDate").nextAll('.error-icon-marrid').remove();
                                $("#pcaldateMarridDate").removeClass("input-err-border-marrid");

                                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridDate");
                                $("#pcaldateMarridDate").addClass("input-err-border-marrid");
                                error = 0;
                            }
                            else {
                                $("#pcaldateMarridDate").nextAll('.error-icon-marrid').remove();
                                $("#pcaldateMarridDate").removeClass("input-err-border-marrid");
                            }

                        }
                    }
                }
                if (Marrids == 2 || Marrids == 3) {
                    //===============================================================================================
                    if ($("#drpdwnCntChild").val() != "-1" && $("#drpdwnCntChild").val() != "0" && $("#TableInputInfoChild").css("display") != "none") {
                        var name = $.trim($("#txtNameChild").val());
                        var family = $.trim($("#txtFamilyChild").val());
                        var MelliCode = $.trim($("#txtMelliCodeChild").val());
                        var NumberShenasname = $.trim($("#txtNumberShenasnameChild").val());
                        var ChildBrithdayDate = $.trim($("#pcaldateChildBrithdayDate").val());
                        var ChildKind = $.trim($("#drpdwnChildKind").val());

                        if (name == "" && family == "" && MelliCode == "" && NumberShenasname == "" && ChildBrithdayDate == "" && ChildKind == "-1") {
                            $(".error-icon-child").remove();
                            $("input").removeClass("input-err-border-child");

                            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameChild");
                            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyChild");
                            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
                            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
                            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateChildBrithdayDate");
                            $("<i class='error-icon-child  error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnChildKind");

                            $("#txtNameChild").addClass("input-err-border-child");
                            $("#txtFamilyChild").addClass("input-err-border-child");
                            $("#txtMelliCodeChild").addClass("input-err-border-child");
                            $("#txtNumberShenasnameChild").addClass("input-err-border-child");
                            $("#pcaldateChildBrithdayDate").addClass("input-err-border-child");
                            $("#drpdwnChildKind").addClass("input-err-border-child");

                            error = 0;
                        }
                        else {
                            if (name == "") {
                                $("#txtNameChild").nextAll('.error-icon-child').remove();
                                $("#txtNameChild").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameChild");
                                $("#txtNameChild").addClass("input-err-border-child");
                                error = 0;
                            }
                            else {
                                $("#txtNameChild").nextAll('.error-icon-child').remove();
                                $("#txtNameChild").removeClass("input-err-border-child");
                            }

                            if (family == "") {
                                $("#txtFamilyChild").nextAll('.error-icon-child').remove();
                                $("#txtFamilyChild").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyChild");
                                $("#txtFamilyChild").addClass("input-err-border-child");
                                error = 0;
                            }
                            else {
                                $("#txtFamilyChild").nextAll('.error-icon-child').remove();
                                $("#txtFamilyChild").removeClass("input-err-border-child");
                            }

                            if (MelliCode == "") {
                                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                                $("#txtMelliCodeChild").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
                                $("#txtMelliCodeChild").addClass("input-err-border-child");
                                error = 0;
                            }
                            else if (!CheckValidMelliCode(MelliCode)) {
                                ShowAlert("شماره ملی فرزند معتبر نمی باشد !");
                                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                                $("#txtMelliCodeChild").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
                                $("#txtMelliCodeChild").addClass("input-err-border-child");
                                error = 0;
                            }
                            else if (!numbericFild.test(MelliCode)) {
                                ShowAlert("شماره ملی فرزند عددی باید باشد !");
                                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                                $("#txtMelliCodeChild").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
                                $("#txtMelliCodeChild").addClass("input-err-border-child");
                                error = 0;
                            }
                            else {
                                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                                $("#txtMelliCodeChild").removeClass("input-err-border-child");
                            }

                            if (NumberShenasname == "") {
                                $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
                                $("#txtNumberShenasnameChild").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
                                $("#txtNumberShenasnameChild").addClass("input-err-border-child");
                                error = 0;
                            }
                            else if (!numbericFild.test(NumberShenasname)) {
                                ShowAlert("شماره سریال شناسنامه فرزند باید عددی باشد!");
                                $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
                                $("#txtNumberShenasnameChild").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
                                $("#txtNumberShenasnameChild").addClass("input-err-border-child");
                                error = 0;
                            }
                            else {
                                $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
                                $("#txtNumberShenasnameChild").removeClass("input-err-border-child");
                            }

                            if (ChildBrithdayDate == "") {
                                $("#pcaldateChildBrithdayDate").nextAll('.error-icon-child').remove();
                                $("#pcaldateChildBrithdayDate").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateChildBrithdayDate");
                                $("#pcaldateChildBrithdayDate").addClass("input-err-border-child");
                                error = 0;
                            }
                            else {
                                $("#pcaldateChildBrithdayDate").nextAll('.error-icon-child').remove();
                                $("#pcaldateChildBrithdayDate").removeClass("input-err-border-child");
                            }

                            if (ChildKind == "") {
                                $("#drpdwnChildKind").nextAll('.error-icon-child').remove();
                                $("#drpdwnChildKind").removeClass("input-err-border-child");

                                $("<i class='error-icon-child  error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnChildKind");
                                $("#drpdwnChildKind").addClass("input-err-border-child");
                                error = 0;
                            }
                            else {
                                $("#drpdwnChildKind").nextAll('.error-icon-child').remove();
                                $("#drpdwnChildKind").removeClass("input-err-border-child");
                            }

                        }
                    }
                }
            }
        }
        return error;
    }
    else if (id == 2) {
        var Province = $("#drpdwnProvince").val();
        var City = $("#drpdwnCity").val();
        var Hosing = $("#drpdwnHosing").val();
        var PersonelAddress = $.trim($("#txtPersonelAddress").val());
        var PostCode = $.trim($("#txtPostCode").val());
        var Tel = $.trim($("#txtTel").val());
        var Tel1 = $.trim($("#txtTel1").val());
        var Mobile = $.trim($("#txtMobile").val());
        var TelNecessary = $.trim($("#txtTelNecessary").val());
        var Email = $.trim($("#txtEmail").val());
        if (Province == "-1" && City == "-1" && Hosing == "-1" && PersonelAddress == "" && PostCode == "" && Tel == "" && Tel1 == "" && Mobile == "" && TelNecessary == "" && Email == "") {
            $(".error-icon").remove();
            $("input").removeClass("input-err-border");

            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnProvince");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnCity");
            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnHosing");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtPersonelAddress");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtPostCode");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTel");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTel1");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMobile");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTelNecessary");
            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtEmail");
            $("#drpdwnProvince").addClass("input-err-border");
            $("#drpdwnCity").addClass("input-err-border");
            $("#drpdwnHosing").addClass("input-err-border");
            $("#txtPersonelAddress").addClass("input-err-border");
            $("#txtPostCode").addClass("input-err-border");
            $("#txtTel").addClass("input-err-border");
            $("#txtTel1").addClass("input-err-border");
            $("#txtMobile").addClass("input-err-border");
            $("#txtTelNecessary").addClass("input-err-border");
            $("#txtEmail").addClass("input-err-border");

            error = 0;
        }
        else {
            if (Province == "-1") {
                $("#drpdwnProvince").nextAll('.error-icon').remove();
                $("#drpdwnProvince").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnProvince");
                $("#drpdwnProvince").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnProvince").nextAll('.error-icon').remove();
                $("#drpdwnProvince").removeClass("input-err-border");
            }

            if (City == "-1") {
                $("#drpdwnCity").nextAll('.error-icon').remove();
                $("#drpdwnCity").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnCity");
                $("#drpdwnCity").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnCity").nextAll('.error-icon').remove();
                $("#drpdwnCity").removeClass("input-err-border");
            }

            if (Hosing == "-1") {
                $("#drpdwnHosing").nextAll('.error-icon').remove();
                $("#drpdwnHosing").removeClass("input-err-border");

                $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnHosing");
                $("#drpdwnHosing").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#drpdwnHosing").nextAll('.error-icon').remove();
                $("#drpdwnHosing").removeClass("input-err-border");
            }

            if (PersonelAddress == "") {
                $("#txtPersonelAddress").nextAll('.error-icon').remove();
                $("#txtPersonelAddress").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtPersonelAddress");
                $("#txtPersonelAddress").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtPersonelAddress").nextAll('.error-icon').remove();
                $("#txtPersonelAddress").removeClass("input-err-border");
            }

            if (PostCode == "") {
                $("#txtPostCode").nextAll('.error-icon').remove();
                $("#txtPostCode").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtPostCode");
                $("#txtPostCode").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(PostCode)) {
                ShowAlert("کد پستی باید عددی باشد !");
                $("#txtPostCode").nextAll('.error-icon').remove();
                $("#txtPostCode").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtPostCode");
                $("#txtPostCode").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtPostCode").nextAll('.error-icon').remove();
                $("#txtPostCode").removeClass("input-err-border");
            }

            if (Tel == "") {
                $("#txtTel").nextAll('.error-icon').remove();
                $("#txtTel").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTel");
                $("#txtTel").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(Tel)) {
                ShowAlert("شماره تماس باید عددی باشد");
                $("#txtTel").nextAll('.error-icon').remove();
                $("#txtTel").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTel");
                $("#txtTel").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtTel").nextAll('.error-icon').remove();
                $("#txtTel").removeClass("input-err-border");
            }

            if (Tel1 == "") {
                $("#txtTel1").nextAll('.error-icon').remove();
                $("#txtTel1").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTel1");
                $("#txtTel1").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(Tel1)) {
                ShowAlert("شماره تماس باید عددی باشد");
                $("#txtTel1").nextAll('.error-icon').remove();
                $("#txtTel1").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTel1");
                $("#txtTel1").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtTel1").nextAll('.error-icon').remove();
                $("#txtTel1").removeClass("input-err-border");
            }

            if (Mobile == "") {
                $("#txtMobile").nextAll('.error-icon').remove();
                $("#txtMobile").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMobile");
                $("#txtMobile").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(Mobile)) {
                ShowAlert("شماره موبایل باید عددی باشد");
                $("#txtMobile").nextAll('.error-icon').remove();
                $("#txtMobile").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMobile");
                $("#txtMobile").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtMobile").nextAll('.error-icon').remove();
                $("#txtMobile").removeClass("input-err-border");
            }

            if (TelNecessary == "") {
                $("#txtTelNecessary").nextAll('.error-icon').remove();
                $("#txtTelNecessary").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTelNecessary");
                $("#txtTelNecessary").addClass("input-err-border");
                error = 0;
            }
            else if (!numbericFild.test(TelNecessary)) {
                ShowAlert("شماره تماس ضروری، باید عددی باشد");
                $("#txtTelNecessary").nextAll('.error-icon').remove();
                $("#txtTelNecessary").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTelNecessary");
                $("#txtTelNecessary").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtTelNecessary").nextAll('.error-icon').remove();
                $("#txtTelNecessary").removeClass("input-err-border");
            }

            if (Email == "") {
                $("#txtEmail").nextAll('.error-icon').remove();
                $("#txtEmail").removeClass("input-err-border");

                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtEmail");
                $("#txtEmail").addClass("input-err-border");
                error = 0;
            }
            else if ((Email != "-" && Email != "") && !isValidEmailAddress(Email)) {
                ShowAlert("لطفا ایمیل را به درستی وارد نمایید!");
                $("#txtEmail").nextAll('.error-icon').remove();
                $("#txtEmail").removeClass("input-err-border");
                $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtEmail");
                $("#txtEmail").addClass("input-err-border");
                error = 0;
            }
            else {
                $("#txtEmail").nextAll('.error-icon').remove();
                $("#txtEmail").removeClass("input-err-border");
            }


        }
        return error;
    }
    else if (id == 3) {
        //if ($.trim($("#trShowUniversityInfo").html()) == "") {
        //    var UniversityName = $.trim($("#txtUniversityName").val());
        //    var UniversitySection = $("#drpdwnUniversitySection").val();
        //    var UniversityField = $.trim($("#txtUniversityField").val());
        //    var UniversityOrientation = $.trim($("#txtUniversityOrientation").val());
        //    var dateStartUniversityDate = $.trim($("#pcaldateStartUniversityDate").val());
        //    var dateEndUniversityDate = $.trim($("#pcaldateEndUniversityDate").val());
        //    var UniversityAvg = $.trim($("#txtUniversityAvg").val());
        //    if (UniversityName == "" && UniversitySection == "-1" && UniversityField == "" && UniversityOrientation == "" && dateStartUniversityDate == "" && dateEndUniversityDate == "" && UniversityAvg == "") {
        //        $(".error-icon").remove();
        //        $("input").removeClass("input-err-border");

        //        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityName");
        //        $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnUniversitySection");
        //        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityField");
        //        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityOrientation");
        //        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartUniversityDate");
        //        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndUniversityDate");
        //        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityAvg");
        //        $("#txtUniversityName").addClass("input-err-border");
        //        $("#drpdwnUniversitySection").addClass("input-err-border");
        //        $("#txtUniversityField").addClass("input-err-border");
        //        $("#txtUniversityOrientation").addClass("input-err-border");
        //        $("#pcaldateStartUniversityDate").addClass("input-err-border");
        //        $("#pcaldateEndUniversityDate").addClass("input-err-border");
        //        $("#txtUniversityAvg").addClass("input-err-border");

        //        error = 0;
        //    }
        //    else {
        //        if (UniversitySection == "-1") {
        //            $("#drpdwnUniversitySection").nextAll('.error-icon').remove();
        //            $("#drpdwnUniversitySection").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnUniversitySection");
        //            $("#drpdwnUniversitySection").addClass("input-err-border");
        //            error = 0;
        //        }
        //        else {
        //            $("#drpdwnUniversitySection").nextAll('.error-icon').remove();
        //            $("#drpdwnUniversitySection").removeClass("input-err-border");
        //        }

        //        if (UniversityName == "") {
        //            $("#txtUniversityName").nextAll('.error-icon').remove();
        //            $("#txtUniversityName").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityName");
        //            $("#txtUniversityName").addClass("input-err-border");
        //            error = 0;
        //        }
        //        else {
        //            $("#txtUniversityName").nextAll('.error-icon').remove();
        //            $("#txtUniversityName").removeClass("input-err-border");
        //        }

        //        if (UniversityField == "") {
        //            $("#txtUniversityField").nextAll('.error-icon').remove();
        //            $("#txtUniversityField").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityField");
        //            $("#txtUniversityField").addClass("input-err-border");
        //            error = 0;
        //        }
        //        else {
        //            $("#txtUniversityField").nextAll('.error-icon').remove();
        //            $("#txtUniversityField").removeClass("input-err-border");
        //        }

        //        if (UniversityOrientation == "") {
        //            $("#txtUniversityOrientation").nextAll('.error-icon').remove();
        //            $("#txtUniversityOrientation").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityOrientation");
        //            $("#txtUniversityOrientation").addClass("input-err-border");
        //            error = 0;
        //        }
        //        else {
        //            $("#txtUniversityOrientation").nextAll('.error-icon').remove();
        //            $("#txtUniversityOrientation").removeClass("input-err-border");
        //        }

        //        if (dateStartUniversityDate == "") {
        //            $("#pcaldateStartUniversityDate").nextAll('.error-icon').remove();
        //            $("#pcaldateStartUniversityDate").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartUniversityDate");
        //            $("#pcaldateStartUniversityDate").addClass("input-err-border");
        //            error = 0;
        //        }
        //        else {
        //            $("#pcaldateStartUniversityDate").nextAll('.error-icon').remove();
        //            $("#pcaldateStartUniversityDate").removeClass("input-err-border");
        //        }

        //        if (dateEndUniversityDate == "") {
        //            $("#pcaldateEndUniversityDate").nextAll('.error-icon').remove();
        //            $("#pcaldateEndUniversityDate").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndUniversityDate");
        //            $("#pcaldateEndUniversityDate").addClass("input-err-border");
        //            error = 0;
        //        }
        //        else {
        //            $("#pcaldateEndUniversityDate").nextAll('.error-icon').remove();
        //            $("#pcaldateEndUniversityDate").removeClass("input-err-border");
        //        }

        //        if (UniversityAvg == "") {
        //            $("#txtUniversityAvg").nextAll('.error-icon').remove();
        //            $("#txtUniversityAvg").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityAvg");
        //            $("#txtUniversityAvg").addClass("input-err-border");
        //            error = 0;
        //        }
        //        if (!numbericFild.test(UniversityAvg)) {
        //            ShowAlert("معدل باید عددی باشد!");
        //            $("#txtUniversityAvg").nextAll('.error-icon').remove();
        //            $("#txtUniversityAvg").removeClass("input-err-border");

        //            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityAvg");
        //            $("#txtUniversityAvg").addClass("input-err-border");
        //            error = 0;
        //        }
        //        else {
        //            $("#txtUniversityAvg").nextAll('.error-icon').remove();
        //            $("#txtUniversityAvg").removeClass("input-err-border");
        //        }
        //    }

        //    error = 0;
        //}
        error = 1;

        return error;
    }
    else if (id == 4) {

        error = 1;

        return error;
    }
    else if (id == 5) {
        error = 1;
        return error;
    }
    else if (id == 6) {
        error = 1;
        return error;
    }
    else if (id == 7) {
        $(".hideaction").show();
        error = 1;
        return error;
    }

    else if (id == 8) {
        $(".hideaction").hide();

        error = 1;
        return error;
    }
    else {

        return error;
    }
}
//==============================پاک کردن ارور==============================================
function ResetErrorIconInput(inputName) {
    $("#" + inputName).nextAll('.error-icon').remove();
    $("#" + inputName).removeClass("input-err-border");

    $("#" + inputName).nextAll('.error-icon-marrid').remove();
    $("#" + inputName).removeClass("input-err-border-marrid");

    $("#" + inputName).nextAll('.error-icon-child').remove();
    $("#" + inputName).removeClass("input-err-border-child");
}
//======================================ثبت اطلاعات کارمند======================================
function RegisterPersonel() {

    $("#Loading").fadeIn();
    $("#CheckOut").fadeIn();
    var name = $("#txtName").val();
    var family = $("#txtFamily").val();
    var fathername = $("#txtFatherName").val();
    var mellicode = $("#txtMelliCode").val();
    var NumberShenasname = $("#txtNumberShenasname").val();
    var MosalsalShenasname = $("#drpdwnharf option:selected").text() + "/" + $("#txtMosalsalShenasname1").val() + "/" + $("#txtMosalsalShenasname2").val();
    var dateBrithdayDate = $("#pcaldateBrithdayDate").val();
    var BrithdayCityRef = $("#txtBrithdayCityRef").val();
    var ExportCityRef = $("#txtExportCityRef").val();
    var Meliat = $("#drpdwnMeliat").val();
    var Jensiat = $("#drpdwnJensiat").val();
    var Blod = $("#drpdwnBlod").val();
    var Religion = $("#drpdwnReligion").val();
    var Gilder = $("#txtGilder").val();
    var Marrid = $("#drpdwnMarrid").val();
    var InfoMarrid = "";
    var InfoChild = "";
    if (Marrid == 2 || Marrid == 3) {
        //var dateMarridDate = $("#pcaldateMarridDate").val();
        //var CntHasuband = $("#drpdwnCntHasuband").val();
        var CntChild = $("#drpdwnCntChild").val();
        if ($("#drpdwnMarrid").val() == 2) {

            if ($.trim($("#ResaultInfoMarrid").html()) != "") {
                for (var i = 1; i <= (CounterRowMarrid - 1) ; i++) {
                    if ($.trim($("#tdname" + i).html()) != undefined && $.trim($("#tdname" + i).html()) != null && $.trim($("#tdname" + i).html()) != "") {
                        InfoMarrid = InfoMarrid + $.trim($("#tdname" + i).html()) + "^" + $("#tdfamily" + i).html() + "^" + $("#tdcodemelli" + i).html() + "^" + $("#tdshsh" + i).html() + "^" + $("#tdDateBrithdayMarrid" + i).html() + "^" + $("#tdDateMarridDate" + i).html() + ",";
                    }
                }
            }
        }

        if (Marrid == 2 || Marrid == 3) {
            if ($.trim($("#ResaultInfoChild").html()) != "") {
                for (var i = 1; i <= (CounterRowChild - 1) ; i++) {
                    if ($.trim($("#tdnameChild" + i).html()) != undefined && $.trim($("#tdnameChild" + i).html()) != null && $.trim($("#tdnameChild" + i).html()) != "") {
                        InfoChild = InfoChild + $.trim($("#tdnameChild" + i).html()) + "^" + $("#tdfamilyChild" + i).html() + "^" + $("#tdcodemelliChild" + i).html() + "^" + $("#tdshshChild" + i).html() + "^" + $("#tdDateBrithdayChild" + i).html() + "^" + $("#tdChildKindId" + i).html() + ",";
                    }
                }
            }
        }
    }
    var Military = "";
    if ($("#drpdwnJensiat").val() == 1) {
        Military = $("#drpdwnMilitary").val();
    }

    var Province = $("#drpdwnProvince").val();
    var City = $("#drpdwnCity").val();
    var Hosing = $("#drpdwnHosing").val();
    var PostCode = $("#txtPostCode").val();
    var tel = $.trim($("#txtTel1").val()) + "-" + $.trim($("#txtTel").val());
    var mobile = $("#txtMobile").val();
    var TelNecessary = $("#txtTelNecessary").val();
    var Email = $("#txtEmail").val();
    var PersonelAddress = $("#txtPersonelAddress").val();
    var UniversityInfo = "";
    if ($.trim($("#trShowUniversityInfo").html()) != "") {
        for (var i = 1; i <= (CounterRowUniversity - 1) ; i++) {
            if ($.trim($("#tdUniverName" + i).html()) != undefined && $.trim($("#tdUniverName" + i).html()) != null && $.trim($("#tdUniverName" + i).html()) != "") {
                UniversityInfo = UniversityInfo + $.trim($("#tdUniverName" + i).html()) + "^" + $("#tdUniverMaghtaId" + i).html() + "^" + $("#tdUniverReshte" + i).html() + "^" + $("#tdUniverGraiesh" + i).html() + "^" + $("#tdStartDate" + i).html() + "^" + $("#tdEndDate" + i).html() + "^" + $("#tdUniverMoadel" + i).html() + ",";
            }
        }
    }
    var DoreInfo = "";
    if ($.trim($("#trShowDoreInfo").html()) != "") {
        for (var i = 1; i <= (CounterRowDore - 1) ; i++) {
            if ($.trim($("#tdMoseseName" + i).html()) != undefined && $.trim($("#tdMoseseName" + i).html()) != null && $.trim($("#tdMoseseName" + i).html()) != "") {
                DoreInfo = DoreInfo + $.trim($("#tdMoseseName" + i).html()) + "^" + $("#tdDoreName" + i).html() + "^" + ($("#tdTimeDore" + i).html() + "-" + $("#tdTimeDoreId" + i).html()) + "^" + $("#tddateStartDore" + i).html() + "^" + $("#tddateEndDore" + i).html() + "^" + ($.trim($("#tdGovahiName" + i).html()) == "----" ? "" : $.trim($("#tdGovahiName" + i).html())) + ",";
            }
        }
    }
    var LangugeInfo = "";
    if ($.trim($("#trShowLangugeInfo").html()) != "") {
        for (var i = 1; i <= (CounterRowLangauge - 1) ; i++) {
            if ($.trim($("#tdLangaugeName" + i).html()) != undefined && $.trim($("#tdLangaugeName" + i).html()) != null && $.trim($("#tdLangaugeName" + i).html()) != "") {
                LangugeInfo = LangugeInfo + $.trim($("#tdLangaugeName" + i).html()) + "^" + $("#drpdwnLanguageStatesreading" + i).val() + "^" + $("#drpdwnLanguageStateswriting" + i).val() + "^" + $("#drpdwnLanguageStatesspiking" + i).val() + ",";
            }
        }
    }
    var MaharatInfo = "";
    if ($.trim($("#trShowMaharatInfo").html()) != "") {
        for (var i = 1; i <= (CounterRowMaharat - 1) ; i++) {
            if ($.trim($("#tdMaharatName" + i).html()) != undefined && $.trim($("#tdMaharatName" + i).html()) != null && $.trim($("#tdMaharatName" + i).html()) != "") {
                MaharatInfo = MaharatInfo + $.trim($("#tdMaharatName" + i).html()) + "^" + $("#tdMaharatDesc" + i).html() + "^" + $("#tdMaharatLevelId" + i).html() + ",";
            }
        }
    }
    var JobHistoryInfo = "";
    if ($.trim($("#trShowJobHistoryInfo").html()) != "") {
        for (var i = 1; i <= (CounterRowJobHistory - 1) ; i++) {
            if ($.trim($("#tdJobName" + i).html()) != undefined && $.trim($("#tdJobName" + i).html()) != null && $.trim($("#tdJobName" + i).html()) != "") {
                JobHistoryInfo = JobHistoryInfo + $.trim($("#tdJobName" + i).html()) + "^" + $("#tdMasoliat" + i).html() + "^" + $("#tdModatFrom" + i).html() + "^" + $("#tdModatTo" + i).html() + "^" + $("#tdvazife" + i).html() + ",";
            }
        }
    }

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: {
            i: 2,
            name: name, family: family, fathername: fathername, mellicode: mellicode, NumberShenasname: NumberShenasname, MosalsalShenasname: MosalsalShenasname,
            dateBrithdayDate: dateBrithdayDate, BrithdayCityRef: BrithdayCityRef, ExportCityRef: ExportCityRef, Meliat: Meliat,
            Jensiat: Jensiat, Blod: Blod, Religion: Religion, Gilder: Gilder, Marrid: Marrid,
            CntChild: CntChild, InfoMarrid: InfoMarrid, InfoChild: InfoChild, Military: Military, Province: Province, City: City, Hosing: Hosing, PostCode: PostCode,
            tel: tel, mobile: mobile, TelNecessary: TelNecessary, Email: Email, PersonelAddress: PersonelAddress, UniversityInfo: UniversityInfo,
            DoreInfo: DoreInfo, LangugeInfo: LangugeInfo, MaharatInfo: MaharatInfo, JobHistoryInfo: JobHistoryInfo,
            personelCode: publicpersonelCode
        },
        url: "/PostBack/PBContractReg.ashx",
        success: function (data) {
            $("#Loading").fadeOut();
            $("#CheckOut").fadeOut();

            if (data == "1") {
                ShowAlert("اطلاعات پرسنل جدید با موفقیت بروزرسانی شد.");
                ShowStepClick(1);

                $("#hrInfoAllPersonel").hide();
                $("#trInfoAllPersonel").hide();

                $("input[type=text], textarea").val("");
                $("select").val("-1");
                $("#ResaultInfoMarrid").html("");
                $("#ResaultInfoChild").html("");
                $("#trShowUniversityInfo").html("");
                $("#trShowDoreInfo").html("");
                $("#trShowLangugeInfo").html("");
                $("#trShowMaharatInfo").html("");
                $("#trShowJobHistoryInfo").html("");

                $("#tdPreViewImageUpFile").html("");

                $("#trMarridInfo").hide();

                CountAllMarid = 0;
                CountAllMaridCounter = 0;
                CounterRowMarrid = 1;
                editRowMarrid = 0;
                CountAllChild = 0;
                CountAllChildCounter = 0;
                CounterRowChild = 1;
                editRowChild = 0;
                CounterRowUniversity = 1;
                editRowUniversity = 0;
                editRowJobHistory = 0;
                CounterRowJobHistory = 1;
                editRowMaharat = 0;
                CounterRowMaharat = 1;
                CounterRowLangauge = 1;
                editRowDore = 0;
                CounterRowDore = 1;
                CounterRowBimeh = 1;
                editRowBimeh = 0;

            }
            else if (data == "2") {
                ShowAlert("کد ملی وارد شده با کد ملی قبلا ثبت شده یکی  نمی باشد!");
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
//============================================================================
function ShowMarridInfo() {
    var info = $("#drpdwnMarrid").val();
    if (info == 2 || info == 3) {
        $("#trMarridInfo").show();
        $("#drpdwnCntHasuband").val(-1);
        $("#drpdwnCntChild").val(-1);
        $("#pcaldateMarridDate").val("");
        $("#ResaultInfoChild").html("");
        $("#ResaultInfoChild").hide();
        $("#ResaultInfoMarrid").html("");
        $("#ResaultInfoMarrid").hide();
        if (info == 3)
            $("#trShowInputInfoMarrid").hide();
        else $("#trShowInputInfoMarrid").show();

      
        ResetErrorIconInput('drpdwnCntChild');
        ResetErrorIconInput('txtNameMarird');
        ResetErrorIconInput('txtFamilyMarird');
        ResetErrorIconInput('txtMelliCodeMarird');
        ResetErrorIconInput('txtNumberShenasnameMarird');
        ResetErrorIconInput('pcaldateMarridBrithdayDate');
        ResetErrorIconInput('pcaldateMarridDate');

        $("#trShowInputInfoChild").hide();
        $("#ResaultInfoChild").html('');
        $("#ResaultInfoChild").hide();
        CountAllChild = 0;
        CountAllChildCounter = 0;
        CounterRowChild = 1;
        ResetErrorIconInput('txtNameChild');
        ResetErrorIconInput('txtFamilyChild');
        ResetErrorIconInput('txtMelliCodeChild');
        ResetErrorIconInput('txtNumberShenasnameChild');
        ResetErrorIconInput('pcaldateChildBrithdayDate');
        ResetErrorIconInput('drpdwnChildKind');
        
    }
    else {
        $("#trMarridInfo").hide();
    }
}
//============================================================================
function showInputInfoMarrid() {
    var info = $("#drpdwnCntHasuband").val();
    if (info == -1) {
        $("#trShowInputInfoMarrid").hide();
        $("#ResaultInfoMarrid").html('');
        $("#ResaultInfoMarrid").hide();

        CountAllMarid = 0;
        CountAllMaridCounter = 0;
        CounterRowMarrid = 1;
    }
    else {
        $("#TableInputInfoMarrid").show();
        if (info > (CounterRowMarrid - 1) && CounterRowMarrid != 0) {
            $("#TableInputInfoMarrid").show();
        }
        else if (info < (CounterRowMarrid - 1) && CounterRowMarrid != 0) {
            $("#TableInputInfoMarrid").hide();

            for (var i = 1; i <= (CounterRowMarrid - 1) ; i++) {
                if (info < i) {
                    $("#trRow" + i).remove();
                    CounterRowMarrid = CounterRowMarrid - 1;
                    CountAllMaridCounter = CountAllMaridCounter - 1;
                    CountAllMarid = CountAllMarid - 1;
                }
            }

        }
        else if (info == (CounterRowMarrid - 1) && CounterRowMarrid != 0) {
            $("#TableInputInfoMarrid").hide();
        }
        $("#txtNameMarird").val('');
        $("#txtFamilyMarird").val('');
        $("#txtMelliCodeMarird").val('');
        $("#txtNumberShenasnameMarird").val('');
        $("#pcaldateMarridBrithdayDate").val('');
        $("#pcaldateMarridDate").val('');
        //$("#ResaultInfoMarrid").html('');
        //$("#ResaultInfoMarrid").hide();
        CountAllMarid = 0;
        CountAllMaridCounter = 0;
        //CounterRowMarrid = 1;
        $("#trShowInputInfoMarrid").show();
        // 
    }
}
//============================================================================
var CountAllMarid = 0;
var CountAllMaridCounter = 0;
var CounterRowMarrid = 1;
function SaveMarridInfo() {
    var Count = $("#drpdwnCntHasuband").val();
    if (CountAllMarid == 0) {
        CountAllMarid = Count;
        CountAllMaridCounter = Count;
    }
    if (Count == CountAllMarid) {
        var error = 0;
        var name = $.trim($("#txtNameMarird").val());
        var family = $.trim($("#txtFamilyMarird").val());
        var MelliCode = $.trim($("#txtMelliCodeMarird").val());
        var NumberShenasname = $.trim($("#txtNumberShenasnameMarird").val());
        var MarridBrithdayDate = $.trim($("#pcaldateMarridBrithdayDate").val());
        var dateMarridDate = $.trim($("#pcaldateMarridDate").val());
        if (name == "" && family == "" && MelliCode == "" && NumberShenasname == "" && MarridBrithdayDate == "" && dateMarridDate == "") {
            $(".error-icon-marrid").remove();
            $("input").removeClass("input-err-border-marrid ");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameMarird");
            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyMarird");
            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridBrithdayDate");
            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridDate");

            $("#txtNameMarird").addClass("input-err-border-marrid ");
            $("#txtFamilyMarird").addClass("input-err-border-marrid ");
            $("#txtMelliCodeMarird").addClass("input-err-border-marrid ");
            $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid ");
            $("#pcaldateMarridBrithdayDate").addClass("input-err-border-marrid ");
            $("#pcaldateMarridDate").addClass("input-err-border-marrid ");

            error = 1;
        }
        else {
            if (name == "") {
                $("#txtNameMarird").nextAll('.error-icon-marrid').remove();
                $("#txtNameMarird").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameMarird");
                $("#txtNameMarird").addClass("input-err-border-marrid");
                error = 1;
            }
            else {
                $("#txtNameMarird").nextAll('.error-icon-marrid').remove();
                $("#txtNameMarird").removeClass("input-err-border-marrid");
            }

            if (family == "") {
                $("#txtFamilyMarird").nextAll('.error-icon-marrid').remove();
                $("#txtFamilyMarird").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyMarird");
                $("#txtFamilyMarird").addClass("input-err-border-marrid");
                error = 1;
            }
            else {
                $("#txtFamilyMarird").nextAll('.error-icon-marrid').remove();
                $("#txtFamilyMarird").removeClass("input-err-border-marrid");
            }

            if (MelliCode == "") {
                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
                $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
                error = 1;
            }
            else if (!CheckValidMelliCode(MelliCode)) {
                ShowAlert("شماره ملی همسر معتبر نمی باشد !");
                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
                $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
                error = 1;
            }
            else if (!numbericFild.test(MelliCode)) {
                ShowAlert("شماره ملی همسر باید عددی باشد !");
                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
                $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
                error = 1;
            }
            else {
                $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
                $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");
            }

            if (NumberShenasname == "") {
                $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
                $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
                $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid");
                error = 1;
            }
            else if (!numbericFild.test(NumberShenasname)) {
                ShowAlert("شماره سریال شناسنامه همسر باید عددی باشد !");
                $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
                $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
                $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid");
                error = 1;
            }
            else {
                $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
                $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");
            }


            if (MarridBrithdayDate == "") {
                $("#pcaldateMarridBrithdayDate").nextAll('.error-icon-marrid').remove();
                $("#pcaldateMarridBrithdayDate").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridBrithdayDate");
                $("#pcaldateMarridBrithdayDate").addClass("input-err-border-marrid");
                error = 1;
            }
            else {
                $("#pcaldateMarridBrithdayDate").nextAll('.error-icon-marrid').remove();
                $("#pcaldateMarridBrithdayDate").removeClass("input-err-border-marrid");
            }

            if (dateMarridDate == "") {
                $("#pcaldateMarridDate").nextAll('.error-icon-marrid').remove();
                $("#pcaldateMarridDate").removeClass("input-err-border-marrid");

                $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridDate");
                $("#pcaldateMarridDate").addClass("input-err-border-marrid");
                error = 1;
            }
            else {
                $("#pcaldateMarridDate").nextAll('.error-icon-marrid').remove();
                $("#pcaldateMarridDate").removeClass("input-err-border-marrid");
            }

        }

        if (error == 0) {
            var header = "<table class='MainTbl' border='1' bordercolor='#ffffff'>" +
            "<thead><tr><td colspan='12' align='center'>مشخصات همسر</td></tr><tr align='center'><th>ردیف</th><th>نام </th><th>نام خانوادگی </th><th>کد ملی </th><th>شماره شناسنامه </th><th>تاریخ تولد</th><th>تاریخ ازدواج</th><th class='hideaction'></th></tr></thead><tbody>";
            var mainrow = "<tr id='trRow{row}' ><td>{row}</td><td id='tdname{row}'>{name}</td><td id='tdfamily{row}'>{family}</td><td id='tdcodemelli{row}'>{codemelli}</td><td id='tdshsh{row}'>{shsh}</td><td id='tdDateBrithdayMarrid{row}'>{BrithdayMarrid}</td><td id='tdDateMarridDate{row}'>{MarridDate}</td><td class='hideaction'>{action}</td></tr>";
            var footer = "</tbody></table>";
            var row = "", allrow = "";

            row = mainrow.replaceAll("{name}", name);
            row = row.replaceAll("{family}", family);
            row = row.replaceAll("{codemelli}", MelliCode);
            row = row.replaceAll("{shsh}", NumberShenasname);
            row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoMarrid(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteMarridInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
            row = row.replaceAll("{BrithdayMarrid}", MarridBrithdayDate);
            row = row.replaceAll("{MarridDate}", dateMarridDate);
            row = row.replaceAll("{row}", CounterRowMarrid);

            if ($.trim($("#ResaultInfoMarrid").html()) == "") {
                $("#ResaultInfoMarrid").html(header + row + footer);
                $("#ResaultInfoMarrid").show();
            }
            else {
                var tempRow = "";
                for (var i = 1; i <= CounterRowMarrid  ; i++) {
                    if ($("#trRow" + i).html() != null && $("#trRow" + i).html() != undefined && $("#trRow" + i).html() != "") {
                        tempRow = tempRow + "<tr id='trRow" + i + "'>" + $("#trRow" + i).html() + "</tr>";
                    }
                }
                $("#ResaultInfoMarrid").html(header + tempRow + row + footer);
                $("#ResaultInfoMarrid").show();
            }
            CounterRowMarrid++;
            $("#txtNameMarird").val('');
            $("#txtFamilyMarird").val('');
            $("#txtMelliCodeMarird").val('');
            $("#txtNumberShenasnameMarird").val('');
            $("#pcaldateMarridBrithdayDate").val('');
            $("#pcaldateMarridDate").val('');

            if (CountAllMaridCounter <= (CounterRowMarrid - 1)) {
                $("#TableInputInfoMarrid").hide();
            }
        }
    }
    else {
        CountAllMarid = 0;
        CountAllMaridCounter = 0;
        CounterRowMarrid = 1;
        $("#txtNameMarird").val('');
        $("#txtFamilyMarird").val('');
        $("#txtMelliCodeMarird").val('');
        $("#txtNumberShenasnameMarird").val('');
        $("#pcaldateMarridBrithdayDate").val('');
        $("#pcaldateMarridDate").val('');
        $("#TableInputInfoMarrid").show();
        $("#ResaultInfoMarrid").html("");
    }
}
//============================================================================
var editRowMarrid = 0;
function EditInfoMarrid(row) {
    editRowMarrid = 0;
    var name = $.trim($("#tdname" + row).html());
    var family = $.trim($("#tdfamily" + row).html());
    var codeMelli = $.trim($("#tdcodemelli" + row).html());
    var Shsh = $.trim($("#tdshsh" + row).html());
    var datebritdaymarrid = $.trim($("#tdDateBrithdayMarrid" + row).html());
    var marriddate = $.trim($("#tdDateMarridDate" + row).html());

    $("#txtNameMarird").val(name);
    $("#txtFamilyMarird").val(family);
    $("#txtMelliCodeMarird").val(codeMelli);
    $("#txtNumberShenasnameMarird").val(Shsh);
    $("#pcaldateMarridBrithdayDate").val(datebritdaymarrid);
    $("#pcaldateMarridDate").val(marriddate);

    $("#btnSaveInfoMarrid").hide();
    $("#btnSaveEditInfoMarrid").show();

    $("#TableInputInfoMarrid").show();
    editRowMarrid = row;
}
//============================================================================
function SaveEditMarridInfo() {
    var error = 0;
    var name = $.trim($("#txtNameMarird").val());
    var family = $.trim($("#txtFamilyMarird").val());
    var MelliCode = $.trim($("#txtMelliCodeMarird").val());
    var NumberShenasname = $.trim($("#txtNumberShenasnameMarird").val());
    var MarridBrithdayDate = $.trim($("#pcaldateMarridBrithdayDate").val());
    var dateMarridDate = $.trim($("#pcaldateMarridDate").val());

    if (name == "" && family == "" && MelliCode == "" && NumberShenasname == "" && MarridBrithdayDate == "" && dateMarridDate == "") {
        $(".error-icon-marrid").remove();
        $("input").removeClass("input-err-border-marrid ");

        $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameMarird");
        $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyMarird");
        $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
        $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
        $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridBrithdayDate");
        $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridDate");

        $("#txtNameMarird").addClass("input-err-border-marrid ");
        $("#txtFamilyMarird").addClass("input-err-border-marrid ");
        $("#txtMelliCodeMarird").addClass("input-err-border-marrid ");
        $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid ");
        $("#pcaldateMarridBrithdayDate").addClass("input-err-border-marrid ");
        $("#pcaldateMarridDate").addClass("input-err-border-marrid ");
        error = 1;
    }
    else {
        if (name == "") {
            $("#txtNameMarird").nextAll('.error-icon-marrid').remove();
            $("#txtNameMarird").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameMarird");
            $("#txtNameMarird").addClass("input-err-border-marrid");
            error = 1;
        }
        else {
            $("#txtNameMarird").nextAll('.error-icon-marrid').remove();
            $("#txtNameMarird").removeClass("input-err-border-marrid");
        }

        if (family == "") {
            $("#txtFamilyMarird").nextAll('.error-icon-marrid').remove();
            $("#txtFamilyMarird").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyMarird");
            $("#txtFamilyMarird").addClass("input-err-border-marrid");
            error = 1;
        }
        else {
            $("#txtFamilyMarird").nextAll('.error-icon-marrid').remove();
            $("#txtFamilyMarird").removeClass("input-err-border-marrid");
        }


        if (MelliCode == "") {
            $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
            $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
            $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
            error = 1;
        }
        else if (!CheckValidMelliCode(MelliCode)) {
            ShowAlert("شماره ملی همسر معتبر نمی باشد !");
            $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
            $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
            $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
            error = 1;
        }
        else if (!numbericFild.test(MelliCode)) {
            ShowAlert("شماره ملی همسر باید عددی باشد!");
            $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
            $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeMarird");
            $("#txtMelliCodeMarird").addClass("input-err-border-marrid");
            error = 1;
        }
        else {
            $("#txtMelliCodeMarird").nextAll('.error-icon-marrid').remove();
            $("#txtMelliCodeMarird").removeClass("input-err-border-marrid");
        }

        if (NumberShenasname == "") {
            $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
            $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
            $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid");
            error = 1;
        }
        else if (!numbericFild.test(NumberShenasname)) {
            ShowAlert("شماره سریال شناسنامه همسر باید عددی باشد!");
            $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
            $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameMarird");
            $("#txtNumberShenasnameMarird").addClass("input-err-border-marrid");
            error = 1;
        }
        else {
            $("#txtNumberShenasnameMarird").nextAll('.error-icon-marrid').remove();
            $("#txtNumberShenasnameMarird").removeClass("input-err-border-marrid");
        }

        if (MarridBrithdayDate == "") {
            $("#pcaldateMarridBrithdayDate").nextAll('.error-icon-marrid').remove();
            $("#pcaldateMarridBrithdayDate").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridBrithdayDate");
            $("#pcaldateMarridBrithdayDate").addClass("input-err-border-marrid");
            error = 1;
        }
        else {
            $("#pcaldateMarridBrithdayDate").nextAll('.error-icon-marrid').remove();
            $("#pcaldateMarridBrithdayDate").removeClass("input-err-border-marrid");
        }

        if (dateMarridDate == "") {
            $("#pcaldateMarridDate").nextAll('.error-icon-marrid').remove();
            $("#pcaldateMarridDate").removeClass("input-err-border-marrid");

            $("<i class='error-icon-marrid error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateMarridDate");
            $("#pcaldateMarridDate").addClass("input-err-border-marrid");
            error = 1;
        }
        else {
            $("#pcaldateMarridDate").nextAll('.error-icon-marrid').remove();
            $("#pcaldateMarridDate").removeClass("input-err-border-marrid");
        }
    }

    if (error == 0) {
        var row = editRowMarrid;
        $("#tdname" + row).html(name);
        $("#tdfamily" + row).html(family);
        $("#tdcodemelli" + row).html(MelliCode);
        $("#tdshsh" + row).html(NumberShenasname);
        $("#tdDateBrithdayMarrid" + row).html(MarridBrithdayDate);
        $("#tdDateMarridDate" + row).html(dateMarridDate);

        $("#btnSaveInfoMarrid").show();
        $("#btnSaveEditInfoMarrid").hide();
        $("#txtNameMarird").val('');
        $("#txtFamilyMarird").val('');
        $("#txtMelliCodeMarird").val('');
        $("#txtNumberShenasnameMarird").val('');
        $("#pcaldateMarridBrithdayDate").val('');
        $("#pcaldateMarridDate").val('');
        // $("#TableInputInfoMarrid").hide();
        editRowMarrid = 0;
    }
}
//============================================================================
function DeleteMarridInfo(row) {
    // var Count = $("#drpdwnCntHasuband").val();
    //if (row == Count) {
    //CountAllMarid = CountAllMarid - 1;
    //CountAllMaridCounter = CountAllMaridCounter - 1;
    //CounterRowMarrid = CounterRowMarrid - 1;
    $("#txtNameMarird").val('');
    $("#txtFamilyMarird").val('');
    $("#txtMelliCodeMarird").val('');
    $("#txtNumberShenasnameMarird").val('');
    $("#pcaldateMarridBrithdayDate").val('');
    $("#pcaldateMarridDate").val('');
    $("#TableInputInfoMarrid").show();
    $("#trRow" + row).remove();
    var flagdelete = 0;
    for (var i = 1; i <= CounterRowMarrid ; i++) {
        if ($("#trRow" + i).html() != null && $("#trRow" + i).html() != undefined && $("#trRow" + i).html() != "") {
            flagdelete = 1;
        }
    }
    if (flagdelete == 0) {
        $("#ResaultInfoMarrid").html('');
        $("#ResaultInfoMarrid").hide();

    }
    // }
}
//============================================================================
function showInputInfoChild() {
    var info = $("#drpdwnCntChild").val();
    if (info == -1 || info == 0) {
        $("#trShowInputInfoChild").hide();
        $("#ResaultInfoChild").html('');
        $("#ResaultInfoChild").hide();
        CountAllChild = 0;
        CountAllChildCounter = 0;
        CounterRowChild = 1;
        ResetErrorIconInput('txtNameChild');
        ResetErrorIconInput('txtFamilyChild');
        ResetErrorIconInput('txtMelliCodeChild');
        ResetErrorIconInput('txtNumberShenasnameChild');
        ResetErrorIconInput('pcaldateChildBrithdayDate');
        ResetErrorIconInput('drpdwnChildKind');
    }
    else {
        $("#TableInputInfoChild").show();
        if (info > (CounterRowChild - 1) && CounterRowChild != 0) {
            $("#TableInputInfoChild").show();
        }
        else if (info < (CounterRowChild - 1) && CounterRowChild != 0) {
            $("#TableInputInfoChild").hide();
            for (var i = 1; i <= (CounterRowChild - 1) ; i++) {
                if (info < i) {
                    $("#trRowChild" + i).remove();
                    CounterRowChild = CounterRowChild - 1;
                    CountAllChildCounter = CountAllChildCounter - 1;
                    CountAllChild = CountAllChild - 1;
                }
            }

        }
        else if (info == (CounterRowChild - 1) && CounterRowChild != 0) {
            $("#TableInputInfoChild").hide();
        }
        $("#txtNameChild").val('');
        $("#txtFamilyChild").val('');
        $("#txtMelliCodeChild").val('');
        $("#txtNumberShenasnameChild").val('');
        $("#pcaldateChildBrithdayDate").val('');
        $("#drpdwnChildKind").val('-1');
        CountAllChild = 0;
        CountAllChildCounter = 0;
        $("#trShowInputInfoChild").show();
    }
}
//============================================================================
var CountAllChild = 0;
var CountAllChildCounter = 0;
var CounterRowChild = 1;
function SaveChildInfo() {
    var Count = $("#drpdwnCntChild").val();
    if (CountAllChild == 0) {
        CountAllChild = Count;
        CountAllChildCounter = Count;
    }
    if (Count == CountAllChild) {
        var error = 0;
        var name = $.trim($("#txtNameChild").val());
        var family = $.trim($("#txtFamilyChild").val());
        var MelliCode = $.trim($("#txtMelliCodeChild").val());
        var NumberShenasname = $.trim($("#txtNumberShenasnameChild").val());
        var ChildBrithdayDate = $.trim($("#pcaldateChildBrithdayDate").val());
        var ChildKind = $.trim($("#drpdwnChildKind").val());

        if (name == "" && family == "" && MelliCode == "" && NumberShenasname == "" && ChildBrithdayDate == "" && ChildKind == "-1") {
            $(".error-icon-child").remove();
            $("input").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameChild");
            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyChild");
            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateChildBrithdayDate");
            $("<i class='error-icon-child  error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnChildKind");

            $("#txtNameChild").addClass("input-err-border-child");
            $("#txtFamilyChild").addClass("input-err-border-child");
            $("#txtMelliCodeChild").addClass("input-err-border-child");
            $("#txtNumberShenasnameChild").addClass("input-err-border-child");
            $("#pcaldateChildBrithdayDate").addClass("input-err-border-child");
            $("#drpdwnChildKind").addClass("input-err-border-child");

            error = 1;
        }
        else {
            if (name == "") {
                $("#txtNameChild").nextAll('.error-icon-child').remove();
                $("#txtNameChild").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameChild");
                $("#txtNameChild").addClass("input-err-border-child");
                error = 1;
            }
            else {
                $("#txtNameChild").nextAll('.error-icon-child').remove();
                $("#txtNameChild").removeClass("input-err-border-child");
            }

            if (family == "") {
                $("#txtFamilyChild").nextAll('.error-icon-child').remove();
                $("#txtFamilyChild").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyChild");
                $("#txtFamilyChild").addClass("input-err-border-child");
                error = 1;
            }
            else {
                $("#txtFamilyChild").nextAll('.error-icon-child').remove();
                $("#txtFamilyChild").removeClass("input-err-border-child");
            }

            if (MelliCode == "") {
                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                $("#txtMelliCodeChild").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
                $("#txtMelliCodeChild").addClass("input-err-border-child");
                error = 1;
            }
            else if (!CheckValidMelliCode(MelliCode)) {
                ShowAlert("شماره ملی فرزند معتبر نمی باشد!");
                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                $("#txtMelliCodeChild").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
                $("#txtMelliCodeChild").addClass("input-err-border-child");
                error = 1;
            }
            else if (!numbericFild.test(MelliCode)) {
                ShowAlert("شماره ملی فرزند باید عددی باشد!");
                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                $("#txtMelliCodeChild").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
                $("#txtMelliCodeChild").addClass("input-err-border-child");
                error = 1;
            }
            else {
                $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
                $("#txtMelliCodeChild").removeClass("input-err-border-child");
            }

            if (NumberShenasname == "") {
                $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
                $("#txtNumberShenasnameChild").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
                $("#txtNumberShenasnameChild").addClass("input-err-border-child");
                error = 1;
            }
            else if (!numbericFild.test(NumberShenasname)) {
                ShowAlert("شماره سریال شناسنامه فرزند باید عددی باشد!");
                $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
                $("#txtNumberShenasnameChild").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
                $("#txtNumberShenasnameChild").addClass("input-err-border-child");
                error = 1;
            }
            else {
                $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
                $("#txtNumberShenasnameChild").removeClass("input-err-border-child");
            }

            if (ChildBrithdayDate == "") {
                $("#pcaldateChildBrithdayDate").nextAll('.error-icon-child').remove();
                $("#pcaldateChildBrithdayDate").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateChildBrithdayDate");
                $("#pcaldateChildBrithdayDate").addClass("input-err-border-child");
                error = 1;
            }
            else {
                $("#pcaldateChildBrithdayDate").nextAll('.error-icon-child').remove();
                $("#pcaldateChildBrithdayDate").removeClass("input-err-border-child");
            }

            if (ChildKind == "") {
                $("#drpdwnChildKind").nextAll('.error-icon-child').remove();
                $("#drpdwnChildKind").removeClass("input-err-border-child");

                $("<i class='error-icon-child  error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnChildKind");
                $("#drpdwnChildKind").addClass("input-err-border-child");
                error = 1;
            }
            else {
                $("#drpdwnChildKind").nextAll('.error-icon-child').remove();
                $("#drpdwnChildKind").removeClass("input-err-border-child");
            }

        }

        if (error == 0) {
            var header = "<table class='MainTbl' border='1' bordercolor='#ffffff'>" +
            "<thead><tr><td colspan='12' align='center'>مشخصات فرزند</td></tr><tr align='center'><th>ردیف</th><th>نام </th><th>نام خانوادگی </th><th>کد ملی </th><th>شماره شناسنامه </th><th>تاریخ تولد </th><th>نوع فرزند </th><th style='display:none;'></th><th class='hideaction'></th></tr></thead><tbody>";
            var mainrow = "<tr id='trRowChild{row}' ><td>{row}</td><td id='tdnameChild{row}'>{name}</td><td id='tdfamilyChild{row}'>{family}</td><td id='tdcodemelliChild{row}'>{codemelli}</td><td id='tdshshChild{row}'>{shsh}</td><td id='tdDateBrithdayChild{row}'>{DateBrithdayChild}</td><td id='tdChildKind{row}'>{ChildKind}</td><td id='tdChildKindId{row}' style='display:none;'>{ChildKindId}</td><td class='hideaction'>{action}</td></tr>";
            var footer = "</tbody></table>";
            var row = "", allrow = "";

            row = mainrow.replaceAll("{name}", $("#txtNameChild").val());
            row = row.replaceAll("{family}", $("#txtFamilyChild").val());
            row = row.replaceAll("{codemelli}", $("#txtMelliCodeChild").val());
            row = row.replaceAll("{shsh}", $("#txtNumberShenasnameChild").val());
            row = row.replaceAll("{DateBrithdayChild}", $("#pcaldateChildBrithdayDate").val());
            row = row.replaceAll("{ChildKind}", $("#drpdwnChildKind option:selected").text());
            row = row.replaceAll("{ChildKindId}", $("#drpdwnChildKind").val());
            row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoChild(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteChildInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
            row = row.replaceAll("{row}", CounterRowChild);

            if ($.trim($("#ResaultInfoChild").html()) == "") {
                $("#ResaultInfoChild").html(header + row + footer);
                $("#ResaultInfoChild").show();
            }
            else {
                var tempRow = "";
                for (var i = 1; i <= CounterRowChild  ; i++) {
                    if ($("#trRowChild" + i).html() != null && $("#trRowChild" + i).html() != undefined && $("#trRowChild" + i).html() != "") {
                        tempRow = tempRow + "<tr id='trRowChild" + i + "'>" + $("#trRowChild" + i).html() + "</tr>";
                    }
                }

                $("#ResaultInfoChild").html(header + tempRow + row + footer);
                $("#ResaultInfoChild").show();
            }
            $("#txtNameChild").val('');
            $("#txtFamilyChild").val('');
            $("#txtMelliCodeChild").val('');
            $("#txtNumberShenasnameChild").val('');
            $("#pcaldateChildBrithdayDate").val('');
            $("#drpdwnChildKind").val('-1');

            CounterRowChild++;
            if (CountAllChildCounter <= (CounterRowChild - 1)) {
                $("#TableInputInfoChild").hide();
            }
        }
    }
    else {
        CountAllChild = 0;
        CountAllChildCounter = 0;
        CounterRowChild = 1;
        $("#txtNameChild").val('');
        $("#txtFamilyChild").val('');
        $("#txtMelliCodeChild").val('');
        $("#txtNumberShenasnameChild").val('');
        $("#pcaldateChildBrithdayDate").val('');
        $("#drpdwnChildKind").val('-1');
    }
}
//============================================================================
var editRowChild = 0;
function EditInfoChild(row) {
    editRowChild = 0;
    var name = $.trim($("#tdnameChild" + row).html());
    var family = $.trim($("#tdfamilyChild" + row).html());
    var codeMelli = $.trim($("#tdcodemelliChild" + row).html());
    var Shsh = $.trim($("#tdshshChild" + row).html());

    var BrithdayChild = $.trim($("#tdDateBrithdayChild" + row).html());
    var ChildKind = $.trim($("#tdChildKindId" + row).html());

    $("#txtNameChild").val(name);
    $("#txtFamilyChild").val(family);
    $("#txtMelliCodeChild").val(codeMelli);
    $("#txtNumberShenasnameChild").val(Shsh);
    $("#pcaldateChildBrithdayDate").val(BrithdayChild);
    $("#drpdwnChildKind").val(ChildKind);


    $("#btnSaveInfoChild").hide();
    $("#btnSaveEditInfoChild").show();

    $("#TableInputInfoChild").show();
    editRowChild = row;
}
//============================================================================
function SaveEditChildInfo() {
    var error = 0;
    var name = $.trim($("#txtNameChild").val());
    var family = $.trim($("#txtFamilyChild").val());
    var MelliCode = $.trim($("#txtMelliCodeChild").val());
    var NumberShenasname = $.trim($("#txtNumberShenasnameChild").val());
    var ChildBrithdayDate = $.trim($("#pcaldateChildBrithdayDate").val());
    var ChildKind = $.trim($("#drpdwnChildKind").val());

    if (name == "" && family == "" && MelliCode == "" && NumberShenasname == "" && ChildBrithdayDate == "" && ChildKind == "-1") {
        $(".error-icon-child").remove();
        $("input").removeClass("input-err-border-child");

        $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameChild");
        $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyChild");
        $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
        $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
        $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateChildBrithdayDate");
        $("<i class='error-icon-child  error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnChildKind");

        $("#txtNameChild").addClass("input-err-border-child");
        $("#txtFamilyChild").addClass("input-err-border-child");
        $("#txtMelliCodeChild").addClass("input-err-border-child");
        $("#txtNumberShenasnameChild").addClass("input-err-border-child");
        $("#pcaldateChildBrithdayDate").addClass("input-err-border-child");
        $("#drpdwnChildKind").addClass("input-err-border-child");
        error = 1;
    }
    else {
        if (name == "") {
            $("#txtNameChild").nextAll('.error-icon-child').remove();
            $("#txtNameChild").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNameChild");
            $("#txtNameChild").addClass("input-err-border-child");
            error = 1;
        }
        else {
            $("#txtNameChild").nextAll('.error-icon-child').remove();
            $("#txtNameChild").removeClass("input-err-border-child");
        }

        if (family == "") {
            $("#txtFamilyChild").nextAll('.error-icon-child').remove();
            $("#txtFamilyChild").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtFamilyChild");
            $("#txtFamilyChild").addClass("input-err-border-child");
            error = 1;
        }
        else {
            $("#txtFamilyChild").nextAll('.error-icon-child').remove();
            $("#txtFamilyChild").removeClass("input-err-border-child");
        }

        if (MelliCode == "") {
            $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
            $("#txtMelliCodeChild").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
            $("#txtMelliCodeChild").addClass("input-err-border-child");
            error = 1;
        }
        else if (!CheckValidMelliCode(MelliCode)) {
            ShowAlert("شماره ملی فرزند معتبر نمی باشد!");
            $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
            $("#txtMelliCodeChild").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
            $("#txtMelliCodeChild").addClass("input-err-border-child");
            error = 1;
        }
        else if (!numbericFild.test(MelliCode)) {
            ShowAlert("شماره ملی فرزند باید عددی باشد!");
            $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
            $("#txtMelliCodeChild").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMelliCodeChild");
            $("#txtMelliCodeChild").addClass("input-err-border-child");
            error = 1;
        }
        else {
            $("#txtMelliCodeChild").nextAll('.error-icon-child').remove();
            $("#txtMelliCodeChild").removeClass("input-err-border-child");
        }

        if (NumberShenasname == "") {
            $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
            $("#txtNumberShenasnameChild").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
            $("#txtNumberShenasnameChild").addClass("input-err-border-child");
            error = 1;
        }
        else if (!numbericFild.test(NumberShenasname)) {
            ShowAlert("شماره سریال شناسنامه فرزند باید عددی باشد!");
            $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
            $("#txtNumberShenasnameChild").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#txtNumberShenasnameChild");
            $("#txtNumberShenasnameChild").addClass("input-err-border-child");
            error = 1;
        }
        else {
            $("#txtNumberShenasnameChild").nextAll('.error-icon-child').remove();
            $("#txtNumberShenasnameChild").removeClass("input-err-border-child");
        }

        if (ChildBrithdayDate == "") {
            $("#pcaldateChildBrithdayDate").nextAll('.error-icon-child').remove();
            $("#pcaldateChildBrithdayDate").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateChildBrithdayDate");
            $("#pcaldateChildBrithdayDate").addClass("input-err-border-child");
            error = 1;
        }
        else {
            $("#pcaldateChildBrithdayDate").nextAll('.error-icon-child').remove();
            $("#pcaldateChildBrithdayDate").removeClass("input-err-border-child");
        }

        if (ChildKind == "") {
            $("#drpdwnChildKind").nextAll('.error-icon-child').remove();
            $("#drpdwnChildKind").removeClass("input-err-border-child");

            $("<i class='error-icon-child  error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnChildKind");
            $("#drpdwnChildKind").addClass("input-err-border-child");
            error = 1;
        }
        else {
            $("#drpdwnChildKind").nextAll('.error-icon-child').remove();
            $("#drpdwnChildKind").removeClass("input-err-border-child");
        }

    }

    if (error == 0) {
        var row = editRowChild;
        $("#tdnameChild" + row).html(name);
        $("#tdfamilyChild" + row).html(family);
        $("#tdcodemelliChild" + row).html(MelliCode);
        $("#tdshshChild" + row).html(NumberShenasname);
        $("#tdDateBrithdayChild" + row).html(ChildBrithdayDate);
        $("#tdChildKindId" + row).html(ChildKind);
        $("#tdChildKind" + row).html($("#drpdwnChildKind option:selected").text());

        $("#btnSaveInfoChild").show();
        $("#btnSaveEditInfoChild").hide();
        $("#TableInputInfoChild").hide();
        editRowChild = 0;
    }
}
//============================================================================
function DeleteChildInfo(row) {
    // var Count = $("#drpdwnCntChild").val();
    // if (row == Count) {
    //CountAllChild = CountAllChild - 1;
    //CountAllChildCounter = CountAllChildCounter - 1;
    //CounterRowChild = CounterRowChild - 1;
    $("#txtNameChild").val('');
    $("#txtFamilyChild").val('');
    $("#txtMelliCodeChild").val('');
    $("#txtNumberShenasnameChild").val('');
    $("#pcaldateChildBrithdayDate").val('');
    $("#drpdwnChildKind").val('-1');

    $("#TableInputInfoChild").show();
    $("#trRowChild" + row).remove();
    var flagdelete = 0;
    for (var i = 1; i <= CounterRowChild ; i++) {
        if ($("#trRowChild" + i).html() != null && $("#trRowChild" + i).html() != undefined && $("#trRowChild" + i).html() != "") {
            flagdelete = 1;
        }
    }
    if (flagdelete == 0) {
        $("#ResaultInfoChild").html('');
        $("#ResaultInfoChild").hide();

    }
    // }
}
//============================================================================
//================================نمایش دراپ دان وضعیت خدمت============================================
function ShowMilitaryInfo() {
    var value = $("#drpdwnJensiat").val();
    $("#drpdwnMilitary").val(-1);
    if (value == 1) {
        $("#titleStatusMilitary").show();
        $("#divdrpdwnMilitary").show();
    }
    else {
        $("#titleStatusMilitary").hide();
        $("#divdrpdwnMilitary").hide();
    }
}
//================================دخیره اطلاعات دانشگاهی در جدول موقت============================================
var CounterRowUniversity = 1;
function SaveUniversityInfo() {
    var error = 1;
    var UniversityName = $.trim($("#txtUniversityName").val());
    var UniversitySection = $("#drpdwnUniversitySection").val();
    var UniversityField = $.trim($("#txtUniversityField").val());
    var UniversityOrientation = $.trim($("#txtUniversityOrientation").val());
    var dateStartUniversityDate = $.trim($("#pcaldateStartUniversityDate").val());
    var dateEndUniversityDate = $.trim($("#pcaldateEndUniversityDate").val());
    var UniversityAvg = $.trim($("#txtUniversityAvg").val());
    if (UniversityName == "" && UniversitySection == "-1" && UniversityField == "" && UniversityOrientation == "" && dateStartUniversityDate == "" && dateEndUniversityDate == "" && UniversityAvg == "") {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityName");
        $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnUniversitySection");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityField");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityOrientation");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartUniversityDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndUniversityDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityAvg");
        $("#txtUniversityName").addClass("input-err-border");
        $("#drpdwnUniversitySection").addClass("input-err-border");
        $("#txtUniversityField").addClass("input-err-border");
        $("#txtUniversityOrientation").addClass("input-err-border");
        $("#pcaldateStartUniversityDate").addClass("input-err-border");
        $("#pcaldateEndUniversityDate").addClass("input-err-border");
        $("#txtUniversityAvg").addClass("input-err-border");

        error = 0;
    }
    else {
        if (UniversitySection == "-1") {
            $("#drpdwnUniversitySection").nextAll('.error-icon').remove();
            $("#drpdwnUniversitySection").removeClass("input-err-border");

            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnUniversitySection");
            $("#drpdwnUniversitySection").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#drpdwnUniversitySection").nextAll('.error-icon').remove();
            $("#drpdwnUniversitySection").removeClass("input-err-border");
        }

        if (UniversityName == "") {
            $("#txtUniversityName").nextAll('.error-icon').remove();
            $("#txtUniversityName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityName");
            $("#txtUniversityName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityName").nextAll('.error-icon').remove();
            $("#txtUniversityName").removeClass("input-err-border");
        }

        if (UniversityField == "") {
            $("#txtUniversityField").nextAll('.error-icon').remove();
            $("#txtUniversityField").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityField");
            $("#txtUniversityField").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityField").nextAll('.error-icon').remove();
            $("#txtUniversityField").removeClass("input-err-border");
        }

        if (UniversityOrientation == "") {
            $("#txtUniversityOrientation").nextAll('.error-icon').remove();
            $("#txtUniversityOrientation").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityOrientation");
            $("#txtUniversityOrientation").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityOrientation").nextAll('.error-icon').remove();
            $("#txtUniversityOrientation").removeClass("input-err-border");
        }

        if (dateStartUniversityDate == "") {
            $("#pcaldateStartUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateStartUniversityDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartUniversityDate");
            $("#pcaldateStartUniversityDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateStartUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateStartUniversityDate").removeClass("input-err-border");
        }

        if (dateEndUniversityDate == "") {
            $("#pcaldateEndUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateEndUniversityDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndUniversityDate");
            $("#pcaldateEndUniversityDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateEndUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateEndUniversityDate").removeClass("input-err-border");
        }

        if (UniversityAvg == "") {
            $("#txtUniversityAvg").nextAll('.error-icon').remove();
            $("#txtUniversityAvg").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityAvg");
            $("#txtUniversityAvg").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityAvg").nextAll('.error-icon').remove();
            $("#txtUniversityAvg").removeClass("input-err-border");
        }
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (error == 1) {
        var header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                     "<thead><tr><td colspan='12' align='center'>سوابق تحصیلی</td></tr><tr align='center'><th>ردیف</th><th>نام مرکز آموزشی</th><th>مدرک تحصیلی</th><th style='display:none;'>مقطع تحصیلی1</th><th>رشته تحصیلی</th><th>گرایش</th><th>تاریخ شروع تحصیل</th><th>تاریخ پایان تحصیل</th><th>معدل مدرک دریافتی</th><th class='hideaction'></th></tr></thead><tbody>";
        var mainrow = "<tr id='trRowUniversity{row}'><td>{row}</td><td id='tdUniverName{row}'>{UniverName}</td><td id='tdUniverMaghta{row}'>{UniverMaghta}</td><td id='tdUniverMaghtaId{row}' style='display:none;'>{UniverMaghtaId}</td><td id='tdUniverReshte{row}'>{UniverReshte}</td><td id='tdUniverGraiesh{row}'>{UniverGraiesh}</td><td id='tdStartDate{row}'>{StartDate}</td><td id='tdEndDate{row}'>{EndDate}</td><td id='tdUniverMoadel{row}'>{UniverMoadel}</td><td class='hideaction'>{action}</td></tr>";
        var footer = "</tbody></table>";
        var row = "", allrow = "";

        row = mainrow.replaceAll("{UniverName}", UniversityName);
        row = row.replaceAll("{UniverMaghta}", $("#drpdwnUniversitySection option:selected").text());
        row = row.replaceAll("{UniverMaghtaId}", UniversitySection);
        row = row.replaceAll("{UniverReshte}", UniversityField);
        row = row.replaceAll("{UniverGraiesh}", UniversityOrientation);
        row = row.replaceAll("{StartDate}", dateStartUniversityDate);
        row = row.replaceAll("{EndDate}", dateEndUniversityDate);
        row = row.replaceAll("{UniverMoadel}", UniversityAvg);
        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoUniversity(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteUniversityInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
        row = row.replaceAll("{row}", CounterRowUniversity);

        if ($.trim($("#trShowUniversityInfo").html()) == "") {
            $("#trShowUniversityInfo").html(header + row + footer);
            $("#trShowUniversityInfo").show();
        }
        else {
            var tempRow = "";
            for (var i = 1; i <= CounterRowUniversity  ; i++) {
                if ($("#trRowUniversity" + i).html() != null && $("#trRowUniversity" + i).html() != undefined && $("#trRowUniversity" + i).html() != "") {
                    tempRow = tempRow + "<tr id='trRowUniversity" + i + "'>" + $("#trRowUniversity" + i).html() + "</tr>";
                }
            }

            $("#trShowUniversityInfo").html(header + tempRow + row + footer);
            $("#trShowUniversityInfo").show();
        }

        $("#txtUniversityName").val('');
        $("#drpdwnUniversitySection").val(-1);
        $("#txtUniversityField").val('');
        $("#txtUniversityOrientation").val('');
        $("#pcaldateStartUniversityDate").val('');
        $("#pcaldateEndUniversityDate").val('');
        $("#txtUniversityAvg").val('');

        CounterRowUniversity++;

    }

}
//================================بروزرسانی اطلاعات دانشگاهی در جدول موقت============================================
var editRowUniversity = 0;
function EditInfoUniversity(row) {
    editRowUniversity = 0;
    var UniversityName = $.trim($("#tdUniverName" + row).html());
    var UniversitySection = $.trim($("#tdUniverMaghtaId" + row).html());
    var UniversityField = $.trim($("#tdUniverReshte" + row).html());
    var UniversityOrientation = $.trim($("#tdUniverGraiesh" + row).html());
    var dateStartUniversityDate = $.trim($("#tdStartDate" + row).html());
    var dateEndUniversityDate = $.trim($("#tdEndDate" + row).html());
    var UniversityAvg = $.trim($("#tdUniverMoadel" + row).html());

    $("#txtUniversityName").val(UniversityName);
    $("#drpdwnUniversitySection").val(UniversitySection);
    $("#txtUniversityField").val(UniversityField);
    $("#txtUniversityOrientation").val(UniversityOrientation);
    $("#pcaldateStartUniversityDate").val(dateStartUniversityDate);
    $("#pcaldateEndUniversityDate").val(dateEndUniversityDate);
    $("#txtUniversityAvg").val(UniversityAvg);

    $("#btnSaveUnivercity").hide();
    $("#btnEditUnivercity").show();

    editRowUniversity = row;
}
//=======================================ثبت ویرایش=====================================
function SaveEditUniversityInfo() {
    var error = 1;
    var UniversityName = $.trim($("#txtUniversityName").val());
    var UniversitySection = $("#drpdwnUniversitySection").val();
    var UniversityField = $.trim($("#txtUniversityField").val());
    var UniversityOrientation = $.trim($("#txtUniversityOrientation").val());
    var dateStartUniversityDate = $.trim($("#pcaldateStartUniversityDate").val());
    var dateEndUniversityDate = $.trim($("#pcaldateEndUniversityDate").val());
    var UniversityAvg = $.trim($("#txtUniversityAvg").val());
    if (UniversityName == "" && UniversitySection == "-1" && UniversityField == "" && UniversityOrientation == "" && dateStartUniversityDate == "" && dateEndUniversityDate == "" && UniversityAvg == "") {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityName");
        $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnUniversitySection");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityField");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityOrientation");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartUniversityDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndUniversityDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityAvg");
        $("#txtUniversityName").addClass("input-err-border");
        $("#drpdwnUniversitySection").addClass("input-err-border");
        $("#txtUniversityField").addClass("input-err-border");
        $("#txtUniversityOrientation").addClass("input-err-border");
        $("#pcaldateStartUniversityDate").addClass("input-err-border");
        $("#pcaldateEndUniversityDate").addClass("input-err-border");
        $("#txtUniversityAvg").addClass("input-err-border");

        error = 0;
    }
    else {
        if (UniversitySection == "-1") {
            $("#drpdwnUniversitySection").nextAll('.error-icon').remove();
            $("#drpdwnUniversitySection").removeClass("input-err-border");

            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnUniversitySection");
            $("#drpdwnUniversitySection").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#drpdwnUniversitySection").nextAll('.error-icon').remove();
            $("#drpdwnUniversitySection").removeClass("input-err-border");
        }

        if (UniversityName == "") {
            $("#txtUniversityName").nextAll('.error-icon').remove();
            $("#txtUniversityName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityName");
            $("#txtUniversityName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityName").nextAll('.error-icon').remove();
            $("#txtUniversityName").removeClass("input-err-border");
        }

        if (UniversityField == "") {
            $("#txtUniversityField").nextAll('.error-icon').remove();
            $("#txtUniversityField").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityField");
            $("#txtUniversityField").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityField").nextAll('.error-icon').remove();
            $("#txtUniversityField").removeClass("input-err-border");
        }

        if (UniversityOrientation == "") {
            $("#txtUniversityOrientation").nextAll('.error-icon').remove();
            $("#txtUniversityOrientation").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityOrientation");
            $("#txtUniversityOrientation").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityOrientation").nextAll('.error-icon').remove();
            $("#txtUniversityOrientation").removeClass("input-err-border");
        }

        if (dateStartUniversityDate == "") {
            $("#pcaldateStartUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateStartUniversityDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartUniversityDate");
            $("#pcaldateStartUniversityDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateStartUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateStartUniversityDate").removeClass("input-err-border");
        }

        if (dateEndUniversityDate == "") {
            $("#pcaldateEndUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateEndUniversityDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndUniversityDate");
            $("#pcaldateEndUniversityDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateEndUniversityDate").nextAll('.error-icon').remove();
            $("#pcaldateEndUniversityDate").removeClass("input-err-border");
        }

        if (UniversityAvg == "") {
            $("#txtUniversityAvg").nextAll('.error-icon').remove();
            $("#txtUniversityAvg").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtUniversityAvg");
            $("#txtUniversityAvg").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtUniversityAvg").nextAll('.error-icon').remove();
            $("#txtUniversityAvg").removeClass("input-err-border");
        }
    }

    if (error == 1) {
        var row = editRowUniversity;
        $("#tdUniverName" + row).html(UniversityName);
        $("#tdUniverMaghtaId" + row).html(UniversitySection);
        $("#tdUniverMaghta" + row).html($("#drpdwnUniversitySection option:selected").text());
        $("#tdUniverReshte" + row).html(UniversityField);
        $("#tdUniverGraiesh" + row).html(UniversityOrientation);
        $("#tdStartDate" + row).html(dateStartUniversityDate);
        $("#tdEndDate" + row).html(dateEndUniversityDate);
        $("#tdUniverMoadel" + row).html(UniversityAvg);

        $("#txtUniversityName").val('');
        $("#drpdwnUniversitySection").val(-1);
        $("#txtUniversityField").val('');
        $("#txtUniversityOrientation").val('');
        $("#pcaldateStartUniversityDate").val('');
        $("#pcaldateEndUniversityDate").val('');
        $("#txtUniversityAvg").val('');

        $("#btnSaveUnivercity").show();
        $("#btnEditUnivercity").hide();
        editRowUniversity = 0;
    }
}
//================================حذف اطلاعات دانشگاهی در جدول موقت============================================
function DeleteUniversityInfo(row) {

    $("#trRowUniversity" + row).remove();
    var flagdelete = 0;
    for (var i = 1; i <= CounterRowUniversity ; i++) {
        if ($("#trRowUniversity" + i).html() != null && $("#trRowUniversity" + i).html() != undefined && $("#trRowUniversity" + i).html() != "") {
            flagdelete = 1;
        }
    }
    if (flagdelete == 0) {
        $("#trShowUniversityInfo").html('');
        $("#trShowUniversityInfo").hide();
    }
}
//================================دخیره اطلاعات دوره در جدول موقت============================================
var CounterRowDore = 1;
function SaveInfoDore() {
    var error = 1;
    var MoaseseName = $.trim($("#txtMoaseseName").val());
    var DoreName = $.trim($("#txtDoreName").val());
    var TimeDore = $.trim($("#txtTimeDore").val());
    var drpdwnTimeDore = $.trim($("#drpdwnTimeDore").val());
    var StartDoreDate = $.trim($("#pcaldateStartDoreDate").val());
    var EndDoreDate = $.trim($("#pcaldateEndDoreDate").val());
    var drpdwnGovahiCheck = $("#drpdwnGovahiCheck").val();
    var GovahiName = $.trim($("#txtGovahiName").val());


    if (MoaseseName == "" && DoreName == "" && TimeDore == "" && StartDoreDate == "" && EndDoreDate == "" && (drpdwnGovahiCheck == "1" && GovahiName == "")) {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMoaseseName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtDoreName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTimeDore");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartDoreDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndDoreDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtGovahiName");

        $("#txtMoaseseName").addClass("input-err-border");
        $("#txtDoreName").addClass("input-err-border");
        $("#txtTimeDore").addClass("input-err-border");
        $("#pcaldateStartDoreDate").addClass("input-err-border");
        $("#pcaldateEndDoreDate").addClass("input-err-border");
        $("#txtGovahiName").addClass("input-err-border");

        error = 0;
    }
    else {
        if (MoaseseName == "") {
            $("#txtMoaseseName").nextAll('.error-icon').remove();
            $("#txtMoaseseName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMoaseseName");
            $("#txtMoaseseName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMoaseseName").nextAll('.error-icon').remove();
            $("#txtMoaseseName").removeClass("input-err-border");
        }

        if (DoreName == "") {
            $("#txtDoreName").nextAll('.error-icon').remove();
            $("#txtDoreName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtDoreName");
            $("#txtDoreName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtDoreName").nextAll('.error-icon').remove();
            $("#txtDoreName").removeClass("input-err-border");
        }

        if (TimeDore == "") {
            $("#txtTimeDore").nextAll('.error-icon').remove();
            $("#txtTimeDore").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTimeDore");
            $("#txtTimeDore").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtTimeDore").nextAll('.error-icon').remove();
            $("#txtTimeDore").removeClass("input-err-border");
        }

        if (StartDoreDate == "") {
            $("#pcaldateStartDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateStartDoreDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartDoreDate");
            $("#pcaldateStartDoreDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateStartDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateStartDoreDate").removeClass("input-err-border");
        }

        if (EndDoreDate == "") {
            $("#pcaldateEndDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateEndDoreDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndDoreDate");
            $("#pcaldateEndDoreDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateEndDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateEndDoreDate").removeClass("input-err-border");
        }

        if (drpdwnGovahiCheck == "1" && GovahiName == "") {
            $("#txtGovahiName").nextAll('.error-icon').remove();
            $("#txtGovahiName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtGovahiName");
            $("#txtGovahiName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtGovahiName").nextAll('.error-icon').remove();
            $("#txtGovahiName").removeClass("input-err-border");
        }
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (error == 1) {
        var header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                     "<thead><tr><td colspan='12' align='center'>دوره های آموزشی</td></tr><tr align='center'><th>ردیف</th><th>نام موسسه</th><th>نام دوره</th><th>تاریخ شروع دوره </th><th>تاریخ پایان دوره</th><th>مدت دوره </th><th>گواهینامه </th><th style='display:none;'>گواهینامه </th><th>عنوان گواهینامه </th><th class='hideaction'></th></tr></thead><tbody>";
        var mainrow = "<tr id='trRowDore{row}'><td>{row}</td><td id='tdMoseseName{row}'>{Mosese}</td><td id='tdDoreName{row}'>{dorename}</td><td id='tddateStartDore{row}'>{startdate}</td><td id='tddateEndDore{row}'>{enddate}</td><td id='tdTimeDore{row}'>{timedore}</td><td id='tdTimeDoreId{row}' style='display:none;'>{timedoreId}</td><td id='tdGovahiCheck{row}'>{govahiCheck}</td><td id='tdGovahiCheckId{row}' style='display:none;'>{govahiCheckId}</td><td id='tdGovahiName{row}'>{govahiname}</td><td class='hideaction'>{action}</td></tr>";
        var footer = "</tbody></table>";
        var row = "", allrow = "";

        row = mainrow.replaceAll("{Mosese}", MoaseseName);
        row = row.replaceAll("{dorename}", DoreName);
        row = row.replaceAll("{timedore}", TimeDore + "-" + $("#drpdwnTimeDore option:selected").text());
        row = row.replaceAll("{timedoreId}", drpdwnTimeDore);

        row = row.replaceAll("{startdate}", StartDoreDate);
        row = row.replaceAll("{enddate}", EndDoreDate);

        row = row.replaceAll("{govahiCheck}", $("#drpdwnGovahiCheck option:selected").text());
        row = row.replaceAll("{govahiCheckId}", drpdwnGovahiCheck);
        GovahiName = GovahiName == "" ? "----" : GovahiName;
        row = row.replaceAll("{govahiname}", GovahiName);
        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoDore(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteDoreInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
        row = row.replaceAll("{row}", CounterRowDore);

        if ($.trim($("#trShowDoreInfo").html()) == "") {
            $("#trShowDoreInfo").html(header + row + footer);
            $("#trShowDoreInfo").show();
        }
        else {
            var tempRow = "";
            for (var i = 1; i <= CounterRowDore  ; i++) {
                if ($("#trRowDore" + i).html() != null && $("#trRowDore" + i).html() != undefined && $("#trRowDore" + i).html() != "") {
                    tempRow = tempRow + "<tr id='trRowDore" + i + "'>" + $("#trRowDore" + i).html() + "</tr>";
                }
            }

            $("#trShowDoreInfo").html(header + tempRow + row + footer);
            $("#trShowDoreInfo").show();
        }

        //var MoaseseName = $.trim($("#txtMoaseseName").val());
        //var DoreName = $("#txtDoreName").val();
        //var TimeDore = $.trim($("#txtTimeDore").val());
        //var dateDoreDate = $.trim($("#pcaldateDoreDate").val());
        //var MadrakDore = $.trim($("#txtMadrakDore").val());

        $("#txtMoaseseName").val('');
        $("#txtDoreName").val('');
        $("#txtTimeDore").val('');
        $("#drpdwnTimeDore").val(1);
        $("#pcaldateStartDoreDate").val('');
        $("#pcaldateEndDoreDate").val('');

        $("#drpdwnGovahiCheck").val('0');
        $("#txtGovahiName").val('');

        $("#govahiname1").hide();
        $("#govahiname2").hide();

        CounterRowDore++;

    }
}
//================================بروزرسانی اطلاعات دوره در جدول موقت============================================
var editRowDore = 0;
function EditInfoDore(row) {
    editRowDore = 0;
    var MoseseName = $.trim($("#tdMoseseName" + row).html());
    var DoreName = $.trim($("#tdDoreName" + row).html());
    var TimeDore = $.trim($("#tdTimeDore" + row).html());
    var TimeDoreId = $.trim($("#tdTimeDoreId" + row).html());
    var StartDore = $.trim($("#tddateStartDore" + row).html());
    var EndDore = $.trim($("#tddateEndDore" + row).html());
    var GovahiCheckId = $.trim($("#tdGovahiCheckId" + row).html());
    var GovahiName = $.trim($("#tdGovahiName" + row).html());

    $("#txtMoaseseName").val(MoseseName);
    $("#txtDoreName").val(DoreName);
    $("#txtTimeDore").val(TimeDore.split('-')[0]);
    $("#drpdwnTimeDore").val(TimeDoreId);
    $("#pcaldateStartDoreDate").val(StartDore);
    $("#pcaldateEndDoreDate").val(EndDore);

    if (GovahiCheckId == "0") {
        $("#govahiname1").hide();
        $("#govahiname2").hide();
        $("#drpdwnGovahiCheck").val(GovahiCheckId);
        $("#txtGovahiName").val('');
    }
    else {
        $("#govahiname1").show();
        $("#govahiname2").show();
        $("#drpdwnGovahiCheck").val(GovahiCheckId);
        $("#txtGovahiName").val(GovahiName);
    }

    $("#btnSaveDore").hide();
    $("#btnEditDore").show();

    editRowDore = row;
}
//=======================================ثبت ویرایش دوره=====================================
function SaveEditDoreInfo() {
    var error = 1;
    var MoaseseName = $.trim($("#txtMoaseseName").val());
    var DoreName = $("#txtDoreName").val();
    var TimeDore = $.trim($("#txtTimeDore").val());
    var drpdwnTimeDore = $.trim($("#drpdwnTimeDore").val());
    var StartDoreDate = $.trim($("#pcaldateStartDoreDate").val());
    var EndDoreDate = $.trim($("#pcaldateEndDoreDate").val());
    var drpdwnGovahiCheck = $("#drpdwnGovahiCheck").val();
    var GovahiName = $.trim($("#txtGovahiName").val());

    if (MoaseseName == "" && DoreName == "" && TimeDore == "" && StartDoreDate == "" && EndDoreDate == "" && (drpdwnGovahiCheck == "1" && GovahiName == "")) {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMoaseseName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtDoreName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTimeDore");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartDoreDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndDoreDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#GovahiName");

        $("#GovahiName").addClass("input-err-border");
        $("#txtMoaseseName").addClass("input-err-border");
        $("#txtDoreName").addClass("input-err-border");
        $("#txtTimeDore").addClass("input-err-border");
        $("#pcaldateStartDoreDate").addClass("input-err-border");
        $("#pcaldateEndDoreDate").addClass("input-err-border");

        error = 0;
    }
    else {
        if (MoaseseName == "") {
            $("#txtMoaseseName").nextAll('.error-icon').remove();
            $("#txtMoaseseName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMoaseseName");
            $("#txtMoaseseName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMoaseseName").nextAll('.error-icon').remove();
            $("#txtMoaseseName").removeClass("input-err-border");
        }

        if (DoreName == "") {
            $("#txtDoreName").nextAll('.error-icon').remove();
            $("#txtDoreName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtDoreName");
            $("#txtDoreName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtDoreName").nextAll('.error-icon').remove();
            $("#txtDoreName").removeClass("input-err-border");
        }

        if (TimeDore == "") {
            $("#txtTimeDore").nextAll('.error-icon').remove();
            $("#txtTimeDore").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtTimeDore");
            $("#txtTimeDore").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtTimeDore").nextAll('.error-icon').remove();
            $("#txtTimeDore").removeClass("input-err-border");
        }

        if (StartDoreDate == "") {
            $("#pcaldateStartDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateStartDoreDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartDoreDate");
            $("#pcaldateStartDoreDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateStartDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateStartDoreDate").removeClass("input-err-border");
        }

        if (EndDoreDate == "") {
            $("#pcaldateEndDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateEndDoreDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndDoreDate");
            $("#pcaldateEndDoreDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateEndDoreDate").nextAll('.error-icon').remove();
            $("#pcaldateEndDoreDate").removeClass("input-err-border");
        }
        if (drpdwnGovahiCheck == "1" && GovahiName == "") {
            $("#txtGovahiName").nextAll('.error-icon').remove();
            $("#txtGovahiName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtGovahiName");
            $("#txtGovahiName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtGovahiName").nextAll('.error-icon').remove();
            $("#txtGovahiName").removeClass("input-err-border");
        }

    }

    if (error == 1) {
        var row = editRowDore;
        $("#tdMoseseName" + row).html(MoaseseName);
        $("#tdDoreName" + row).html(DoreName);
        $("#tdTimeDore" + row).html(TimeDore + "-" + $("#drpdwnTimeDore option:selected").text());
        $("#tdTimeDoreId" + row).html(drpdwnTimeDore);


        $("#tddateStartDore" + row).html(StartDoreDate);
        $("#tddateEndDore" + row).html(EndDoreDate);

        $("#tdGovahiCheckId" + row).html(drpdwnGovahiCheck);
        $("#tdGovahiCheck" + row).html($("#drpdwnGovahiCheck option:selected").text());
        GovahiName = GovahiName == "" ? "----" : GovahiName;
        $("#tdGovahiName" + row).html(GovahiName);


        $("#txtMoaseseName").val('');
        $("#txtDoreName").val('');
        $("#txtTimeDore").val('');
        $("#drpdwnTimeDore").val(1);
        $("#pcaldateStartDoreDate").val('');
        $("#pcaldateEndDoreDate").val('');

        $("#drpdwnGovahiCheck").val('0');
        $("#txtGovahiName").val('');

        $("#govahiname1").hide();
        $("#govahiname2").hide();

        $("#btnSaveDore").show();
        $("#btnEditDore").hide();
        editRowDore = 0;
    }
}
//================================حذف اطلاعات دوره در جدول موقت============================================
function DeleteDoreInfo(row) {

    $("#trRowDore" + row).remove();
    var flagdelete = 0;
    for (var i = 1; i <= CounterRowDore ; i++) {
        if ($("#trRowDore" + i).html() != null && $("#trRowDore" + i).html() != undefined && $("#trRowDore" + i).html() != "") {
            flagdelete = 1;
        }
    }
    if (flagdelete == 0) {
        $("#trShowDoreInfo").html('');
        $("#trShowDoreInfo").hide();
    }
}
//================================دخیره اطلاعات زبان در جدول موقت============================================
var CounterRowLangauge = 1;
function SaveInfoLanguge() {
    var error = 1;
    var drpdwnLangaugeName = $("#drpdwnLangaugeName").val();
    var LangaugeName = $.trim($("#txtLangaugeName").val());
    if (LangaugeName == "" && drpdwnLangaugeName == "-1") {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtLangaugeName");
        $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnLangaugeName");
        $("#txtLangaugeName").addClass("input-err-border");
        $("#drpdwnLangaugeName").addClass("input-err-border");

        error = 0;
    }
    else {
        if (LangaugeName == "" && drpdwnLangaugeName == "3") {
            $("#txtLangaugeName").nextAll('.error-icon').remove();
            $("#txtLangaugeName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtLangaugeName");
            $("#txtLangaugeName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtLangaugeName").nextAll('.error-icon').remove();
            $("#txtLangaugeName").removeClass("input-err-border");
        }

        if (drpdwnLangaugeName == "-1") {
            $("#drpdwnLangaugeName").nextAll('.error-icon').remove();
            $("#drpdwnLangaugeName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnLangaugeName");
            $("#drpdwnLangaugeName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#drpdwnLangaugeName").nextAll('.error-icon').remove();
            $("#drpdwnLangaugeName").removeClass("input-err-border");
        }

    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (error == 1) {
        var header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                     "<thead><tr><td colspan='12' align='center'>زبان های خارجی</td></tr><tr align='center'><th>ردیف</th><th>نام زبان</th><th>خواندن</th><th>نوشتن</th><th>صحبت کردن</th><th class='hideaction'></th></tr></thead><tbody>";
        var mainrow = "<tr id='trRowLangauge{row}'><td>{row}</td><td id='tdLangaugeName{row}'>{LangaugeName}</td><td id='tdreading{row}'>{reading}</td><td id='tdwriting{row}'>{writing}</td><td id='tdspiking{row}'>{spiking}</td><td class='hideaction'>{action}</td></tr>";
        var footer = "</tbody></table>";
        var row = "", allrow = "";

        row = mainrow.replaceAll("{LangaugeName}", drpdwnLangaugeName == "3" ? LangaugeName : $("#drpdwnLangaugeName option:selected").text());
        row = row.replaceAll("{reading}", GetDropDownLanguageStates(CounterRowLangauge, "reading"));
        row = row.replaceAll("{writing}", GetDropDownLanguageStates(CounterRowLangauge, "writing"));
        row = row.replaceAll("{spiking}", GetDropDownLanguageStates(CounterRowLangauge, "spiking"));
        row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='DeleteLangugeInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
        row = row.replaceAll("{row}", CounterRowLangauge);

        if ($.trim($("#trShowLangugeInfo").html()) == "") {
            $("#trShowLangugeInfo").html(header + row + footer);
            $("#trShowLangugeInfo").show();
        }
        else {
            var tempRow = "";
            for (var i = 1; i <= CounterRowLangauge  ; i++) {
                if ($("#trRowLangauge" + i).html() != null && $("#trRowLangauge" + i).html() != undefined && $("#trRowLangauge" + i).html() != "") {
                    tempRow = tempRow + "<tr id='trRowLangauge" + i + "'>" + $("#trRowLangauge" + i).html() + "</tr>";
                }
            }
            $("#trShowLangugeInfo").html(header + tempRow + row + footer);
            $("#trShowLangugeInfo").show();
        }

        $("#txtLangaugeName").val('');

        CounterRowLangauge++;

    }
}
//================================دریافت دراپ دان در جدول موقت============================================
function GetDropDownLanguageStates(rowcnt, nameid) {
    selectLanguageStates = "<select id='{dpdwnId}' class='InputSelectRightToLeftText' onfocus='ResetErrorIconInput(\"{dpdwnId}\");' style='width:176px;'>";
    // option0 = "<option value='-1'>انتخاب کنید...</option>";
    option = "<option value='{value}' {selected}>{item}</option>";
    selectEnd = "</select>";
    //--------------------- LanguageStates -------------------------------------------
    var allrow = "", row = "";
    $.each(drpdwnLanguageStates, function (index) {
        row = option.replaceAll("{value}", this['value']);
        row = row.replaceAll("{item}", this['item']);
        if (this['value'] == "3") row = row.replaceAll("{selected}", " selected='selected'");
        else row = row.replaceAll("{selected}", "");
        allrow = allrow + row;
    });
    var selectTemp = selectLanguageStates.replaceAll("{dpdwnId}", "drpdwnLanguageStates" + nameid + rowcnt);
    return (selectTemp + option0 + allrow + selectEnd);
    //--------------------------------------------------------------------------
}
//================================حذف اطلاعات زبان در جدول موقت============================================
function DeleteLangugeInfo(row) {

    $("#trRowLangauge" + row).remove();
    var flagdelete = 0;
    for (var i = 1; i <= CounterRowLangauge ; i++) {
        if ($("#trRowLangauge" + i).html() != null && $("#trRowLangauge" + i).html() != undefined && $("#trRowLangauge" + i).html() != "") {
            flagdelete = 1;
        }
    }
    if (flagdelete == 0) {
        $("#trShowLangugeInfo").html('');
        $("#trShowLangugeInfo").hide();
    }
}
//================================دخیره اطلاعات مهارت در جدول موقت============================================
var CounterRowMaharat = 1;
function SaveInfoMaharat() {
    var error = 1;
    var MaharatName = $.trim($("#txtMaharatName").val());
    var MaharatDesc = $.trim($("#txtMaharatDesc").val());
    var MaharatLevel = $.trim($("#drpdwnLevelMaharat").val());

    if (MaharatName == "" && MaharatDesc == "" && MaharatLevel == "-1") {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatDesc");
        $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnLevelMaharat");
        $("#txtMaharatName").addClass("input-err-border");
        $("#txtMaharatDesc").addClass("input-err-border");
        $("#drpdwnLevelMaharat").addClass("input-err-border");

        error = 0;
    }
    else {
        if (MaharatName == "") {
            $("#txtMaharatName").nextAll('.error-icon').remove();
            $("#txtMaharatName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatName");
            $("#txtMaharatName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMaharatName").nextAll('.error-icon').remove();
            $("#txtMaharatName").removeClass("input-err-border");
        }

        if (MaharatDesc == "") {
            $("#txtMaharatDesc").nextAll('.error-icon').remove();
            $("#txtMaharatDesc").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatDesc");
            $("#txtMaharatDesc").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMaharatDesc").nextAll('.error-icon').remove();
            $("#txtMaharatDesc").removeClass("input-err-border");
        }

        if (MaharatLevel == "-1") {
            $("#drpdwnLevelMaharat").nextAll('.error-icon').remove();
            $("#drpdwnLevelMaharat").removeClass("input-err-border");

            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnLevelMaharat");
            $("#drpdwnLevelMaharat").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#drpdwnLevelMaharat").nextAll('.error-icon').remove();
            $("#drpdwnLevelMaharat").removeClass("input-err-border");
        }

    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (error == 1) {
        var header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                     "<thead><tr><td colspan='12' align='center'>توانایی و مهارت ها</td></tr><tr align='center'><th>ردیف</th><th>عنوان مهارت</th><th>توضیح مهارت</th><th>سطح مهارت</th><th style='display:none;'>سطح مهارت</th><th class='hideaction'></th></tr></thead><tbody>";
        var mainrow = "<tr id='trRowMaharat{row}'><td>{row}</td><td id='tdMaharatName{row}'>{MaharatName}</td><td id='tdMaharatDesc{row}'>{MaharatDesc}</td><td id='tdMaharatLevel{row}'>{MaharatLevel}</td><td id='tdMaharatLevelId{row}' style='display:none;'>{MaharatLevelId}</td><td class='hideaction'>{action}</td></tr>";
        var footer = "</tbody></table>";
        var row = "", allrow = "";

        row = mainrow.replaceAll("{MaharatName}", MaharatName);
        row = row.replaceAll("{MaharatDesc}", MaharatDesc);
        row = row.replaceAll("{MaharatLevel}", $("#drpdwnLevelMaharat option:selected").text());
        row = row.replaceAll("{MaharatLevelId}", MaharatLevel);
        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoMaharat(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteMaharatInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
        row = row.replaceAll("{row}", CounterRowMaharat);

        if ($.trim($("#trShowMaharatInfo").html()) == "") {
            $("#trShowMaharatInfo").html(header + row + footer);
            $("#trShowMaharatInfo").show();
        }
        else {
            var tempRow = "";
            for (var i = 1; i <= CounterRowMaharat  ; i++) {
                if ($("#trRowMaharat" + i).html() != null && $("#trRowMaharat" + i).html() != undefined && $("#trRowMaharat" + i).html() != "") {
                    tempRow = tempRow + "<tr id='trRowMaharat" + i + "'>" + $("#trRowMaharat" + i).html() + "</tr>";
                }
            }
            $("#trShowMaharatInfo").html(header + tempRow + row + footer);
            $("#trShowMaharatInfo").show();
        }

        $("#txtMaharatName").val('');
        $("#txtMaharatDesc").val('');
        $("#drpdwnLevelMaharat").val('-1');

        CounterRowMaharat++;

    }
}
//================================بروزرسانی اطلاعات مهارت در جدول موقت============================================
var editRowMaharat = 0;
function EditInfoMaharat(row) {
    editRowMaharat = 0;
    var MaharatName = $.trim($("#tdMaharatName" + row).html());
    var MaharatDesc = $.trim($("#tdMaharatDesc" + row).html());
    var MaharatLevelId = $.trim($("#tdMaharatLevelId" + row).html());

    $("#txtMaharatName").val(MaharatName);
    $("#txtMaharatDesc").val(MaharatDesc);
    $("#drpdwnLevelMaharat").val(MaharatLevelId);

    $("#btnSaveMaharat").hide();
    $("#btnEditMaharat").show();

    editRowMaharat = row;
}
//=======================================ثبت ویرایش مهارت=====================================
function SaveEditMaharatInfo() {
    var error = 1;
    var MaharatName = $.trim($("#txtMaharatName").val());
    var MaharatDesc = $.trim($("#txtMaharatDesc").val());
    var MaharatLevel = $.trim($("#drpdwnLevelMaharat").val());

    if (MaharatName == "" && MaharatDesc == "" && MaharatLevel == "-1") {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatDesc");
        $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnLevelMaharat");
        $("#txtMaharatName").addClass("input-err-border");
        $("#txtMaharatDesc").addClass("input-err-border");
        $("#drpdwnLevelMaharat").addClass("input-err-border");

        error = 0;
    }
    else {
        if (MaharatName == "") {
            $("#txtMaharatName").nextAll('.error-icon').remove();
            $("#txtMaharatName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatName");
            $("#txtMaharatName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMaharatName").nextAll('.error-icon').remove();
            $("#txtMaharatName").removeClass("input-err-border");
        }

        if (MaharatDesc == "") {
            $("#txtMaharatDesc").nextAll('.error-icon').remove();
            $("#txtMaharatDesc").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMaharatDesc");
            $("#txtMaharatDesc").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMaharatDesc").nextAll('.error-icon').remove();
            $("#txtMaharatDesc").removeClass("input-err-border");
        }

        if (MaharatLevel == "-1") {
            $("#drpdwnLevelMaharat").nextAll('.error-icon').remove();
            $("#drpdwnLevelMaharat").removeClass("input-err-border");

            $("<i class='error-icon error-icon-drpdwn fa fa-times-circle'></i>").insertAfter("#drpdwnLevelMaharat");
            $("#drpdwnLevelMaharat").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#drpdwnLevelMaharat").nextAll('.error-icon').remove();
            $("#drpdwnLevelMaharat").removeClass("input-err-border");
        }

    }

    if (error == 1) {
        var row = editRowMaharat;
        $("#tdMaharatName" + row).html(MaharatName);
        $("#tdMaharatDesc" + row).html(MaharatDesc);
        $("#tdMaharatLevel" + row).html($("#drpdwnLevelMaharat option:selected").text());
        $("#tdMaharatLevelId" + row).html(MaharatLevel);

        $("#txtMaharatName").val('');
        $("#txtMaharatDesc").val('');
        $("#drpdwnLevelMaharat").val('-1');

        $("#btnSaveMaharat").show();
        $("#btnEditMaharat").hide();
        editRowMaharat = 0;
    }
}
//================================حذف اطلاعات مهارت در جدول موقت============================================
function DeleteMaharatInfo(row) {

    $("#trRowMaharat" + row).remove();
    var flagdelete = 0;
    for (var i = 1; i <= CounterRowMaharat ; i++) {
        if ($("#trRowMaharat" + i).html() != null && $("#trRowMaharat" + i).html() != undefined && $("#trRowMaharat" + i).html() != "") {
            flagdelete = 1;
        }
    }
    if (flagdelete == 0) {
        $("#trShowMaharatInfo").html('');
        $("#trShowMaharatInfo").hide();
    }
}
//================================دخیره اطلاعات سوابق کاری در جدول موقت============================================
var CounterRowJobHistory = 1;
function SaveInfoJobHistory() {
    var error = 1;
    var JobName = $.trim($("#txtJobName").val());
    var MasoliatName = $.trim($("#txtMasoliatName").val());
    var StartJobDate = $.trim($("#pcaldateStartJobDate").val());
    var EndJobDate = $.trim($("#pcaldateEndJobDate").val());
    var JobDesc = $.trim($("#txtJobDesc").val());

    if (JobName == "" && MasoliatName == "" && StartJobDate == "" && EndJobDate == "" && JobDesc == "") {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMasoliatName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartJobDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndJobDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobDesc");
        $("#txtJobName").addClass("input-err-border");
        $("#txtMasoliatName").addClass("input-err-border");
        $("#pcaldateStartJobDate").addClass("input-err-border");
        $("#pcaldateEndJobDate").addClass("input-err-border");
        $("#txtJobDesc").addClass("input-err-border");

        error = 0;
    }
    else {
        if (JobName == "") {
            $("#txtJobName").nextAll('.error-icon').remove();
            $("#txtJobName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobName");
            $("#txtJobName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtJobName").nextAll('.error-icon').remove();
            $("#txtJobName").removeClass("input-err-border");
        }

        if (MasoliatName == "") {
            $("#txtMasoliatName").nextAll('.error-icon').remove();
            $("#txtMasoliatName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMasoliatName");
            $("#txtMasoliatName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMasoliatName").nextAll('.error-icon').remove();
            $("#txtMasoliatName").removeClass("input-err-border");
        }

        if (StartJobDate == "") {
            $("#pcaldateStartJobDate").nextAll('.error-icon').remove();
            $("#pcaldateStartJobDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartJobDate");
            $("#pcaldateStartJobDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateStartJobDate").nextAll('.error-icon').remove();
            $("#pcaldateStartJobDate").removeClass("input-err-border");
        }

        if (EndJobDate == "") {
            $("#pcaldateEndJobDate").nextAll('.error-icon').remove();
            $("#pcaldateEndJobDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndJobDate");
            $("#pcaldateEndJobDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateEndJobDate").nextAll('.error-icon').remove();
            $("#pcaldateEndJobDate").removeClass("input-err-border");
        }

        if (JobDesc == "") {
            $("#txtJobDesc").nextAll('.error-icon').remove();
            $("#txtJobDesc").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobDesc");
            $("#txtJobDesc").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtJobDesc").nextAll('.error-icon').remove();
            $("#txtJobDesc").removeClass("input-err-border");
        }

    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (error == 1) {
        var header = "<table id='tblInfoUniversity' class='MainTbl' border='1' bordercolor='#ffffff' style='width:100%;'>" +
                     "<thead><tr><td colspan='12' align='center'>سوابق کاری</td></tr><tr align='center'><th>ردیف</th><th>نام محل خدمت</th><th>سمت</th><th>مدت اشتغال از تاریخ</th><th>مدت اشتغال تا تاریخ</th><th>شرح وظیفه</th><th class='hideaction'></th></tr></thead><tbody>";
        var mainrow = "<tr id='trRowJob{row}'><td>{row}</td><td id='tdJobName{row}'>{jobname}</td><td id='tdMasoliat{row}'>{masoliat}</td><td id='tdModatFrom{row}'>{modatFrom}</td><td id='tdModatTo{row}'>{modatTo}</td><td id='tdvazife{row}'>{vazife}</td><td class='hideaction'>{action}</td></tr>";
        var footer = "</tbody></table>";
        var row = "", allrow = "";

        row = mainrow.replaceAll("{jobname}", JobName);
        row = row.replaceAll("{masoliat}", MasoliatName);
        row = row.replaceAll("{modatFrom}", StartJobDate);
        row = row.replaceAll("{modatTo}", EndJobDate);
        row = row.replaceAll("{vazife}", JobDesc);
        row = row.replaceAll("{action}", "<div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='EditInfoJobHistory(\"{row}\");'><img src='images/Edit.png' /></a></div><div style='float:right;width:50%'><a style='cursor:pointer;display:block;' onclick='DeleteJobHistoryInfo(\"{row}\");'><img src='images/delete.png' /></a></div>");
        row = row.replaceAll("{row}", CounterRowJobHistory);

        if ($.trim($("#trShowJobHistoryInfo").html()) == "") {
            $("#trShowJobHistoryInfo").html(header + row + footer);
            $("#trShowJobHistoryInfo").show();
        }
        else {
            var tempRow = "";
            for (var i = 1; i <= CounterRowJobHistory; i++) {
                if ($("#trRowJob" + i).html() != null && $("#trRowJob" + i).html() != undefined && $("#trRowJob" + i).html() != "") {
                    tempRow = tempRow + "<tr id='trRowJob" + i + "'>" + $("#trRowJob" + i).html() + "</tr>";
                }
            }
            $("#trShowJobHistoryInfo").html(header + tempRow + row + footer);
            $("#trShowJobHistoryInfo").show();
        }

        $("#txtJobName").val('');
        $("#txtMasoliatName").val('');
        $("#pcaldateStartJobDate").val('');
        $("#pcaldateEndJobDate").val('');
        $("#txtJobDesc").val('');

        CounterRowJobHistory++;

    }
}
//================================بروزرسانی اطلاعات سوابق کاری در جدول موقت============================================
var editRowJobHistory = 0;
function EditInfoJobHistory(row) {
    editRowJobHistory = 0;
    var JobName = $.trim($("#tdJobName" + row).html());
    var Masoliat = $.trim($("#tdMasoliat" + row).html());
    var ModatFrom = $.trim($("#tdModatFrom" + row).html());
    var ModatTo = $.trim($("#tdModatTo" + row).html());
    var vazife = $.trim($("#tdvazife" + row).html());

    $("#txtJobName").val(JobName);
    $("#txtMasoliatName").val(Masoliat);
    $("#pcaldateStartJobDate").val(ModatFrom);
    $("#pcaldateEndJobDate").val(ModatTo);
    $("#txtJobDesc").val(vazife);

    $("#btnSaveJobHistory").hide();
    $("#btnEditJobHistory").show();

    editRowJobHistory = row;
}
//=======================================ثبت ویرایش سوابق کاری=====================================
function SaveEditJobHistoryInfo() {
    var error = 1;
    var JobName = $.trim($("#txtJobName").val());
    var MasoliatName = $.trim($("#txtMasoliatName").val());
    var ModatFrom = $.trim($("#pcaldateStartJobDate").val());
    var ModatTo = $.trim($("#pcaldateEndJobDate").val());
    var JobDesc = $.trim($("#txtJobDesc").val());

    if (JobName == "" && MasoliatName == "" && ModatFrom == "" && ModatTo == "" && JobDesc == "") {
        $(".error-icon").remove();
        $("input").removeClass("input-err-border");

        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMasoliatName");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartJobDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndJobDate");
        $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobDesc");
        $("#txtJobName").addClass("input-err-border");
        $("#txtMasoliatName").addClass("input-err-border");
        $("#pcaldateStartJobDate").addClass("input-err-border");
        $("#pcaldateEndJobDate").addClass("input-err-border");
        $("#txtJobDesc").addClass("input-err-border");

        error = 0;
    }
    else {
        if (JobName == "") {
            $("#txtJobName").nextAll('.error-icon').remove();
            $("#txtJobName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobName");
            $("#txtJobName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtJobName").nextAll('.error-icon').remove();
            $("#txtJobName").removeClass("input-err-border");
        }

        if (MasoliatName == "") {
            $("#txtMasoliatName").nextAll('.error-icon').remove();
            $("#txtMasoliatName").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtMasoliatName");
            $("#txtMasoliatName").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtMasoliatName").nextAll('.error-icon').remove();
            $("#txtMasoliatName").removeClass("input-err-border");
        }

        if (ModatFrom == "") {
            $("#pcaldateStartJobDate").nextAll('.error-icon').remove();
            $("#pcaldateStartJobDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateStartJobDate");
            $("#pcaldateStartJobDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateStartJobDate").nextAll('.error-icon').remove();
            $("#pcaldateStartJobDate").removeClass("input-err-border");
        }

        if (ModatTo == "") {
            $("#pcaldateEndJobDate").nextAll('.error-icon').remove();
            $("#pcaldateEndJobDate").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#pcaldateEndJobDate");
            $("#pcaldateEndJobDate").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#pcaldateEndJobDate").nextAll('.error-icon').remove();
            $("#pcaldateEndJobDate").removeClass("input-err-border");
        }

        if (JobDesc == "") {
            $("#txtJobDesc").nextAll('.error-icon').remove();
            $("#txtJobDesc").removeClass("input-err-border");

            $("<i class='error-icon error-icon-text fa fa-times-circle'></i>").insertAfter("#txtJobDesc");
            $("#txtJobDesc").addClass("input-err-border");
            error = 0;
        }
        else {
            $("#txtJobDesc").nextAll('.error-icon').remove();
            $("#txtJobDesc").removeClass("input-err-border");
        }

    }

    if (error == 1) {
        var row = editRowJobHistory;
        $("#tdJobName" + row).html(JobName);
        $("#tdMasoliat" + row).html(MasoliatName);

        $("#tdModatFrom" + row).html(ModatFrom);
        $("#tdModatTo" + row).html(ModatTo);

        $("#tdvazife" + row).html(JobDesc);

        $("#txtJobName").val('');
        $("#txtMasoliatName").val('');
        $("#pcaldateStartJobDate").val('');
        $("#pcaldateEndJobDate").val('');
        $("#txtJobDesc").val('');

        $("#btnSaveJobHistory").show();
        $("#btnEditJobHistory").hide();
        editRowJobHistory = 0;
    }
}
//================================حذف اطلاعات سوابق کاری در جدول موقت============================================
function DeleteJobHistoryInfo(row) {

    $("#trRowJob" + row).remove();
    var flagdelete = 0;
    for (var i = 1; i <= CounterRowJobHistory ; i++) {
        if ($("#trRowJob" + i).html() != null && $("#trRowJob" + i).html() != undefined && $("#trRowJob" + i).html() != "") {
            flagdelete = 1;
        }
    }
    if (flagdelete == 0) {
        $("#trShowJobHistoryInfo").html('');
        $("#trShowJobHistoryInfo").hide();
    }
}
//=========================================================================================
function SetLangugeNameSaier() {
    var value = $("#drpdwnLangaugeName").val();
    if (value != "3") {
        $("#tdSetLangaugeName1").hide();
        $("#tdSetLangaugeName").hide();
        $("#txtLangaugeName").val("");
    }
    else {
        $("#tdSetLangaugeName1").show();
        $("#tdSetLangaugeName").show();
        $("#txtLangaugeName").val("");
    }
}
//=========================================================================================
function changeValueUpFile(txtName, upfilename) {
    $("#" + txtName).val($("#" + upfilename).val());
}
//=========================================================================================
function GetInfoForUpFile() {
    var table = "<table style='width:100%'>"
    var rowMain = "<tr style='height:40px;'><td align='left' style='width:130px;'>{title}</td><td align='right' style='width:200px;'><div class='custom_file_upload' style='margin-right:82px;'>" +
                  "<input type='text' class='file' name='file_info' id='{txtImage}' disabled='disabled'/><div class='file_upload'>" +
                  "<input id='{UpImage}' type='file' onchange='changeValueUpFile(\"{txtImage}\",\"{UpImage}\");' /></div></div></td>" +
                  "<td align='right' style='width: 90px;'><input style='font-weight: normal; width: 71px;' type='button' value='پیش ثبت' onclick='UpFilePersonel(\"{txtImage}\",\"{UpImage}\", {type},\"{loading}\");' /></td><td  id='{loading}'  align='right'></td></tr>";
    var tableEnd = "</table>"
    var temprow = "";
    var marrdiInfo = "";
    if ($.trim($("#ResaultInfoMarrid").html()) != "") {
        for (var i = 1; i <= (CounterRowMarrid - 1) ; i++) {
            temprow = rowMain.replaceAll("{title}", "شناسنامه همسر (" + $.trim($("#tdname" + i).html()) + " " + $.trim($("#tdfamily" + i).html()) + ") :");
            temprow = temprow.replaceAll("{txtImage}", "txtUpfileImageMarrid" + i);
            temprow = temprow.replaceAll("{UpImage}", "uploadFileImageMarrid" + i);
            temprow = temprow.replaceAll("{loading}", "loadingImageMarrid" + i);
            temprow = temprow.replaceAll("{type}", 5);
            marrdiInfo = marrdiInfo + temprow;
        }
    }

    temprow = "";
    var ChildInfo = "";
    if ($.trim($("#ResaultInfoChild").html()) != "") {
        for (var i = 1; i <= (CounterRowChild - 1) ; i++) {
            temprow = rowMain.replaceAll("{title}", "شناسنامه فرزند (" + $.trim($("#tdnameChild" + i).html()) + " " + $.trim($("#tdfamilyChild" + i).html()) + ") :");
            temprow = temprow.replaceAll("{txtImage}", "txtUpfileImageChild" + i);
            temprow = temprow.replaceAll("{UpImage}", "uploadFileImageChild" + i);
            temprow = temprow.replaceAll("{loading}", "loadingImageChild" + i);
            temprow = temprow.replaceAll("{type}", 6);
            ChildInfo = ChildInfo + temprow;
        }
    }

    temprow = "";
    var UniversityInfo = "";
    if ($.trim($("#trShowUniversityInfo").html()) != "") {
        for (var i = 1; i <= (CounterRowUniversity - 1) ; i++) {
            temprow = rowMain.replaceAll("{title}", "مدرک تحصیلی (" + $.trim($("#tdUniverName" + i).html()) + ") :");
            temprow = temprow.replaceAll("{txtImage}", "txtUpfileImageUniver" + i);
            temprow = temprow.replaceAll("{UpImage}", "uploadFileImageUniver" + i);
            temprow = temprow.replaceAll("{loading}", "loadingImageUniver" + i);
            temprow = temprow.replaceAll("{type}", 7);
            UniversityInfo = UniversityInfo + temprow;
        }
    }

    temprow = "";
    var DoreInfo = "";
    if ($.trim($("#trShowDoreInfo").html()) != "") {

        for (var i = 1; i <= (CounterRowDore - 1) ; i++) {
            if ($.trim($("#tdGovahiCheckId" + i).html()) == "1") {
                temprow = rowMain.replaceAll("{title}", "گواهینامه دوره (" + $.trim($("#tdGovahiName" + i).html()) + ") :");
                temprow = temprow.replaceAll("{txtImage}", "txtUpfileImageDore" + i);
                temprow = temprow.replaceAll("{UpImage}", "uploadFileImageDore" + i);
                temprow = temprow.replaceAll("{loading}", "loadingImageDore" + i);
                temprow = temprow.replaceAll("{type}", 9);
                DoreInfo = DoreInfo + temprow;
            }
        }
    }

    $("#tblUploadFiles").html(table + marrdiInfo + ChildInfo + UniversityInfo + DoreInfo + "<tr><td colspan='8' id='tdPreViewImageUpFile'></td></tr><tr> <td colspan='4'><hr /></td></tr><tr class='wizard-actions'><td colspan='4'>" +
                         "<button id='btnPrevPage8' class='btn btn-prev'><i class='ace-icon fa fa-arrow-right'></i>قبلی</button>" +
                         "<button id='btnNextPage8' data-last='Finish' class='btn btn-success btn-next'>بعدی<i class='ace-icon fa fa-arrow-left icon-on-left'></i>" +
                         "</button></td></tr>" + tableEnd);

    if (tempImageFileTemp != "") $("#tdPreViewImageUpFile").html(tempImageFileTemp);

    $("#btnPrevPage8").button();
    $("#btnNextPage8").button();
    $(":input[type=button]").button();


    $("#btnNextPage8").click(function () { ShowNextPage(8); return false; });
    $("#btnPrevPage8").click(function () { ShowPrevPage(8); return false; });
}
//=========================================================================================
function UpFilePersonel(txtName, upfilename, type, loading) {
    if (($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null)) {

        var fd = new FormData();
        if ($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null) {
            fd.append("UpFile", document.getElementById(upfilename).files[0]);
            fd.append("i", 3);
            fd.append("type", type);
        }

        if ($("#" + upfilename).val() != "" && $("#" + upfilename).val() != null) {
            $("#" + loading).html("<img src='images/loading.gif'/>");
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                processData: false,
                contentType: false,
                dataType: "json",
                data: fd,
                url: "PostBack/PBContractReg.ashx",
                success: function (data) {
                    var arrayResult = data.split('^');
                    if (arrayResult[0] == "1") {
                        $("#" + upfilename).val("");
                        $("#" + txtName).val("");
                        $("#" + loading).html("<img src='images/accept.png'/>");
                        setTimeout(function () { $("#" + loading).html('') }, 3000);

                        $("#tdPreViewImageUpFile").append("<div style='float:right;width:20%;margin-left:10px;margin-top:10px;'><a style='cursor:pointer;display:block;' href='Images/TempPersonelImge/" + arrayResult[1] + "' target='_blank'><img src='Images/TempPersonelImge/" + arrayResult[1] + "' style='width:100%;height:100%;'/></a></div>");
                    }
                    else if (data == "2") {
                        $("#" + loading).html("<font style='color:#ff0000;'>فرمت عکس ارسالی اشتباه می باشد!</font>");
                        setTimeout(function () { $("#" + loading).html('') }, 3000);
                    }
                }
            });
        }
    }
    else {
        $("#" + loading).html("<font style='color:#ff0000;'>ابتدا تصویر مورد نظر را بارگزاری نمایید!</font>");
        setTimeout(function () { $("#" + loading).html('') }, 3000);
    }
}
//---------------------------------------------------------------------------------
///==================== حذف عکس های temp==========================================
//---------------------------------------------------------------------------------
function DeleteImageTemp() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 4 },
        url: "PostBack/PBContractReg.ashx",
        success: function (data) {

        }
    });
}
//---------------------------------------------------------------------------------
///=========================== ایمیل چک===========================================
//---------------------------------------------------------------------------------
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};
//---------------------------------------------------------------------------------
///=========================== ملی کد چک===========================================
//---------------------------------------------------------------------------------
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
//---------------------------------------------------------------------------------
///=========================== گزارش اطلاعات پرسنل ===========================================
//---------------------------------------------------------------------------------
function GetReportInfoPersonel(vpage) {

    var personelcode = $.trim($("#txtReportPersonelCode").val());
    var name = $.trim($("#txtReportPersonelName").val());
    var mellicode = $.trim($("#txtReportPersonelMelliCode").val());
    var DateFrom = $("#yearlblDateFrom").val() + "/" + $("#monthlblDateFrom").val() + "/" + $("#daylblDateFrom").val();
    var DateTo = $("#yearlblDateTo").val() + "/" + $("#monthlblDateTo").val() + "/" + $("#daylblDateTo").val();

    $("#ResultDivPersonel").html("<img src='Images/progressindicator.gif' />");
    $("#ResultDivPersonel").show();
    var header = "<table class='MainTbl' style='border-collapse: collapse' border=1 cellpadding='2'>";
    var header2 = "<thead><tr><th align='center' width='50px'>ردیف</th><th align='center'>کد پرسنلی</th><th align='center'>نام و نام خانوادگی</th><th align='center'>نام پدر</th><th align='center'>کد ملی</th><th align='center'>شماره شناسنامه</th><th align='center'>تاریخ تولد</th><th>دین</th><th>مذهب</th><th>وضعیت تاهل</th><th>تاریخ ثبت</th><th></th></thead><tbody>";
    var mainrow = "<tr><td>{Row}</td><td>{personelcode}</td><td>{name}</td><td>{fathername}</td><td>{mellicode}</td><td>{shsh}</td><td>{datebrithday}</td><td>{din}</td><td>{mazhab}</td><td>{marrid}</td><td>{dateRegister}</td><td>{action}</td></tr>";
    var footer = "</table></td></tr><tr><td>";
    var footerPager = "<div><div class='pagerdiv'><div class='pageritem'><a onclick='GetReportInfoPersonel(1)'>" +
    "<img id='gridarrow_first' title='صفحه اول' src='images/gridarrow_first.jpg' />" +
    "</a></div><div class='pageritem'><a onclick='{link_prevPage}'>" +
    "<img id='gridarrow_prev' title='صفحه قبل' src='images/gridarrow_prev.jpg' />" +
    "</a></div><div class='pageritem'><img alt='' src='images/gridarrow_separator.jpg' />" +
    "</div><div class='pageritemlabel'>صفحه</div><div class='pageritemlabel'>" +
    "<input id='txtPagerPersonel' type='text' value='" + vpage + "' style='height: 16px; width: 30px;' />" +
    "</div><div class='pageritemlabel'>از</div><div id='divAllRecordCountPersonel1' class='pageritemlabel'>" +
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
        data: { i: 6, personelcode: personelcode, name: name, mellicode: mellicode, DateFrom: DateFrom, DateTo: DateTo, page: vpage, perpage: vperpage },
        url: "PostBack/PBContractReg.ashx",
        success: function (data) {
            AllRecordCount = data[1];
            $.each(data[0], function (index) {
                row = mainrow.replaceAll("{Row}", i);
                i = i + 1;
                row = row.replaceAll("{name}", this['PersonelName']);
                row = row.replaceAll("{fathername}", this['strFatherName']);
                row = row.replaceAll("{mellicode}", this['strMelliCode']);
                row = row.replaceAll("{shsh}", this['strNumberShenasname']);
                row = row.replaceAll("{datebrithday}", this['dateBrithdayDate']);
                row = row.replaceAll("{din}", $.trim(this['strReligionName']));
                row = row.replaceAll("{mazhab}", $.trim(this['strGilderName']));
                row = row.replaceAll("{marrid}", $.trim(this['strMarridName']));
                row = row.replaceAll("{dateRegister}", $.trim(this['dateRegisterDate']));
                row = row.replaceAll("{action}", "<div style='float:right;width:100%'><a style='cursor:pointer;display:block;' onclick='ShowInfoAllPersonel(\"{personelcode}\");'><img src='images/offline.png' /></a></div>");
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
                $("#divAllRecordCountPersonel1").html(allpage);
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
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function ShowInfoAllPersonel(personelCode) {
    $("#txtSearchPersonelCode").val(personelCode);
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();
    GetInfoByPersonelCode(2);
}
//---------------------------------------------------------------------------------
///=========================== نمایش اطلاعات بیمه=================================
//---------------------------------------------------------------------------------
//function ShowBimeBoxInfo() {
//    var value = $("#drpdwnBimeCheck").val();
//    if (value == "1") {
//        for (var i = 1; i <= 15; i++)
//            $("#tdbime" + i).show();
//    }
//    else {
//        for (var i = 1; i <= 15; i++)
//            $("#tdbime" + i).hide();
//    }

//    $("#txtNumberBimeh").val('');
//    $("#txtCodeGargah").val('');
//    $("#txtGargahName").val('');
//    $("#pcaldateStartBimeDate").val('');
//    $("#pcaldateEndBimeDate").val('');

//    $("#txtNewNumberBimeh").val('');
//    $("#txtNewCodeGargah").val('');
//    $("#txtNewGargahName").val('');
//    $("#pcaldateNewStartBimeDate").val('');
//    $("#pcaldateNewEndBimeDate").val('');
//}
//---------------------------------------------------------------------------------
///=========================== نمایش اطلاعات گواهینامه===========================
//---------------------------------------------------------------------------------
function GetGovahiNameInfo() {
    var value = $("#drpdwnGovahiCheck").val();
    if (value == "1") {
        $("#govahiname1").show();
        $("#govahiname2").show();
    }
    else {
        $("#govahiname1").hide();
        $("#govahiname2").hide();
    }

    $("#txtGovahiName").val('');
}

//================================================================
//================================================================
function PrintElem(elem) {
    Popup($(elem).html());
}

function Popup(data) {
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    mywindow.document.write('<html><head><title>my div</title>');
    mywindow.document.write('<link type="text/css" rel="stylesheet" href="Css/MasterPage.css"><link type="text/css" rel="stylesheet" href="Css/superfish.css"><link type="text/css" rel="stylesheet" href="Css/tbls.css">' +
    '<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>' +
    '<script type="text/javascript" src="js/jquery.li-scroller.1.0.js"></script>' +
    '<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>' +
    '<link type="text/css" rel="stylesheet" href="jscss_flick_ui/jquery-ui-1.8.16.custom.css">' +
    '<script type="text/javascript" src="jscss_flick_ui/jquery-ui-1.8.16.custom.min.js"></script>' +
    '<script type="text/javascript" src="js/MasterPage.js"></script>' +
    '<script type="text/javascript" src="js/public.js"></script>' +
    '<link type="text/css" rel="stylesheet" href="Css/MessageBox.css"><link rel="stylesheet" href="Css/News.css"><link rel="stylesheet" href="Css/animate.css">' +
    '<link rel="stylesheet" href="Css/ContractReg.css">' +
    '<link rel="stylesheet" href="Css/jspc-gray.css">' +
    '<script type="text/javascript" src="js/js-persian-cal.min.js"></script>' +
    '<script type="text/javascript" src="js/Pages/ContractReg.js"></script>' +
    '<link rel="stylesheet" href="Css/font-awesome1.css">');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body style="background-color:#ffffff !important;">');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}
