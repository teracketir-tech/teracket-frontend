
//var calculationRequest = null;

$(document).ready(function () {
    $(":button").button();
    $(":button").css("font-family", "tahoma");
    $(":button").css("font-weight", "normal");

    // IntervalHasMsgMaster = setInterval("GetNews();", 10000);
    //GetNews();

    $(".setcamma").keyup(function () { _Amount_onkeyup(this) });
    getsalmali();
});
//---------------------------------------------------------------
function isNumberKeyword(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
//---------------------------------------------------------------
String.prototype.replaceAll = function (strTarget, strSubString) {
    var strText = this;
    if (strText != undefined && strText != null && strText != "") {
        var intIndexOfMatch = strText.indexOf(strTarget);
        while (intIndexOfMatch != -1) {
            strText = strText.replace(strTarget, strSubString)
            intIndexOfMatch = strText.indexOf(strTarget);
        }
        return (strText);
    }
    else {
        return "";
    }
}
//-------------------------------------------------------
function ShowAlert(msg) {
    $("#divAlert").html(msg);
    $("#divAlert").dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        title: "پیام",
        width: 400,
        dialogClass: 'RightToLeftText'
    });
    $("#divAlert").dialog("open");
}
//-------------------------------------------------------
function isInt(n) {
    return (n.toString().search(/^-?[0-9]+$/) == 0); //n % 1 === 0;
}
//---------------------------------------------------------------
function doHighLightRowsOfTable(tableID) {
    "$(\"#" + tableID + " tr\").hover(function () {$(this).addClass(\"highlight\");}, function () {$(this).removeClass(\"highlight\");});";
}
//---------------------------------------------------------------
function split(val) {
    return val.split(/,\s*/);
}
//---------------------------------------------------------------
function extractLast(term) {
    return split(term).pop();
}
//---------------------------------------------------------------
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
//---------------------------------------------------------------
function InputLine(OrderCode) {
    OrderCode = $.trim(OrderCode);
    OrderCode = OrderCode.replaceAll("-", "");
    if (OrderCode != "" && OrderCode.length >= 10) {
        var output = [OrderCode.slice(0, 2), '-', OrderCode.slice(2)].join('');
        output = [output.slice(0, 7), '-', output.slice(7)].join('');
    }
    return output;
}
//-----------------------------------------------------------------------
function convertOrderMayaToLtd(OrderCode) {
    if ($.trim(OrderCode) != "") {
        OrderCode = OrderCode.substring(2, OrderCode.length);
        OrderCode = "13" + OrderCode.replaceAll("-", "");
        OrderCode = InputLine(OrderCode);
        return $.trim(OrderCode);
    }
    else return OrderCode;
}
//-----------------------------------------------------------------------
function convertOrderLtdToMaya(OrderCode) {
    if ($.trim(OrderCode) != "") {
        OrderCode = OrderCode.substring(2, OrderCode.length);
        OrderCode = "64" + OrderCode.replaceAll("-", "");
        return $.trim(OrderCode);
    }
    else return OrderCode;
}
//------------------------------------------------------------------------
function GetRowbgcolor(ErrorCode) {
    var result = "";
    switch (ErrorCode) {
        case 0:
            //صحیح  -- عدم صدور فاکتور
            result = "";
            break;
        case -1:
            // یافت نشد
            result = "class='bacgrundcolorErr2'";
            break;
        case -2:
            // تکراری
            result = "class='bacgrundcolorErr'";
            break;
        case 1:
            //  عدم مالکیت مرسوله
            result = "class='bacgrundcolorErr2'";
            break;
        case 2:
            //  وضعیت اشتباه
            result = "class='bacgrundcolorErr'";
            break;
        case 3:
            //  ارسال اشتباه
            return "class='bacgrundcolorErr'";
            break;
        case 4:
            //  کسری بسته
            return "class='bacgrundcolorErr2'";
            break;
        case 5:
            //  فاکتور اشتباه
            return "class='bacgrundcolorErr2'";
            break;
        case 6:
            //  شناسه دریافت نشد
            return "class='bacgrundcolorErr2'";
            break;
    }
    return result;
}
//------------------------------------------------------------------------
function getQuerystring(key, default_) {
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else
        return qs[1];
}
//-----------------------------------------------------------------------
jQuery.fn.forceNumeric = function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.which || e.keyCode;
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                         key >= 48 && key <= 57 ||
                         key >= 96 && key <= 105 ||
                        key == 8 || key == 9 || key == 13)
                return true;

            return false;
        });
    });
}
//-----------------------------------------------------------------------
String.prototype.splice = function (idx, rem, s) {
    return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
};
//-----------------------------------------------------------------------
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
//-----------------------------------------------------------------------
var lastColorUsed;
function NAC_ChangeBackColor(row, highlight, RowHighlightColor) {
    if (highlight) {
        lastColorUsed = row.style.backgroundColor;
        row.style.backgroundColor = RowHighlightColor;
    }
    else {
        row.style.backgroundColor = lastColorUsed;
    }
}
//-------------------------------------------------------------------------------
function DrpDwn(refkey, url, DivName, DrpName, DrpClass, DrpWidth, OnChangeAct, Multiple, PlaceHolder, WhatList) {
    $("#" + DivName).html("<img src='images/loading.gif' />");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: refkey, DrpName: DrpName, DrpClass: DrpClass, DrpWidth: DrpWidth, OnChangeAct: OnChangeAct, Multiple: Multiple, PlaceHolder: PlaceHolder, WhatList: WhatList },
        url: "PostBack" + "/" + url,
        success: function (data) {
            $("#" + DivName).html(data);
            if ($.trim(DrpName) == "drpdwnSearchStatus") $("#" + DrpName).append("<option value='-2'>تعیین تکلیف شده</option>");
            if (Multiple != "")
                $('#' + DrpName).multiselect({ noneSelectedText: 'انتخاب کنید... ' });
        }
    });
}
//-------------------------------------------------------------------------------
function PrintOrder(OrderCode) {
    var w = 550;
    var h = 360;
    var wi = new Number(w);
    var he = new Number(h);
    wi = wi.valueOf() + 15;
    he = he.valueOf() + 15;
    remoteWindow = open("GoPrint.aspx?b=2&o=" + OrderCode, "_blank", "width=" + wi + ",height=" + he + ", resizable=no,scrollbars=yes,toolbar=no,menubar=no");
    remoteWindow.moveTo(screen.width / 2 - w / 2, screen.height / 2 - h / 2);
}
//-----------------------------------------------------------------------
//function CheckProcess()
//{
//    if (calculationRequest != null) {
//        if (confirm("پردازشی در حال انجام است،آیا کنسل شود؟"))
//        {
//            if (calculationRequest != null) {
//                calculationRequest.abort();
//                return true;
//            }
//        }
//        else return false;
//    }
//}
//-----------------------------------------------------------------------
function DisablePageButtons() {
    $(":button").attr("disabled", "disabled");
    $(":button").addClass("DisabledBtnColor");
    $(".ui-multiselect").removeAttr("disabled");
    $(".ui-multiselect").removeClass("DisabledBtnColor");
}
//-------------------------------------------------------------------------------
function EnablePageButtons() {
    $(":button").removeAttr("disabled");
    $(":button").removeClass("DisabledBtnColor");
}
//-------------------------------------------------------------------------------
var CountNews = 0;
var check = 0;
var idCheck = "";
function GetNews() {
    var newsrowhead = "<ul id='ticker01'>";
    var newsmainrow = "<li style='cursor:pointer;' onclick='ShowPnlNews(\"{numNewsCode}\");'><span style='color:#ffabab;'>{registerdate}</span><span>{newstitle}</span><span><img src='images/maya.png' class='newsImg'></span></li>";
    var newsfooterrow = "</ul><div class='hedNews font-fa-small'>اطلاعیه جدید</div>";
    var allrow = "", copyrow = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 5 },
        url: "postback/AbnamaNews.ashx",
        success: function (data) {
            var cnt = 0;
            var strGetid = "";
            if (data[1] == "1") {
                $.each(data[0], function (index) {
                    copyrow = newsmainrow.replaceAll("{registerdate}", this['dateRegisterDate']);
                    copyrow = copyrow.replaceAll("{newstitle}", this['strTitleNews']);
                    copyrow = copyrow.replaceAll("{numNewsCode}", this['numId']);
                    allrow = allrow + copyrow;
                    cnt++;
                    strGetid = strGetid + this['numId'] + ",";
                });
                if (check == 0) CountNews = cnt;

                //if (cnt > CountNews) {
                //    //idCheck = strGetid;
                //    //$("#DivNewsPublic").html("<img src='images/loading.gif' />");
                //    //$("#DivNewsPublic").html(newsrowhead + allrow + newsfooterrow);
                //    //$("ul#ticker01").liScroll();
                //}
                //else
                if (cnt == CountNews && check == 0) {
                    idCheck = strGetid;
                    $("#DivNewsPublic").html(newsrowhead + allrow + newsfooterrow);
                    $(".NewsPublic").show();
                    $("#ticker01").liScroll();
                }
                //else if (cnt == CountNews && check == 1)
                //{
                //    if (idCheck != strGetid)
                //    {
                //        idCheck = strGetid;
                //        $("#DivNewsPublic").html("<img src='images/loading.gif' />");
                //        $("#DivNewsPublic").html(newsrowhead + allrow + newsfooterrow);
                //        $(".NewsPublic").show();
                //        $("ul#ticker01").liScroll();
                //    }
                //}

                if (check == 0) check = 1;
            }
            else {
                $("#DivNewsPublic").hide();
                $(".NewsPublic").hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $(".NewsPublic").hide();
            $("#DivNewsPublic").html("خطا در برقراری ارتباط با سرور !");
        }
    });
}
//------------------------------------------------------------------------------
function ShowPnlNews(code) {
    $("#descriptionbox").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "متن اطلاعیه",
        width: 500,
        dialogClass: 'RightToLeftText',
        buttons: {
            "انصراف": function () {
                $(this).dialog("close");
            },
        }
    });
    $("#descriptionbox").dialog("open");
    $("#descriptiondiv").html('<div align="center" style="padding:20px 0;"><img src="images/loading.gif"  /></div>');
    var tablediv = "<div align='right' style='padding:10px 10px 0 0; font-weight:bold; font-size:14px; color:green;'>{strTitle}</div><div style='clear:both;'><hr/></div><div style='clear:both; padding:10px 10px 0 0; font-wight:normal;font-size:13px; line-height:25px;'>{strDesc}</div>";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 6, c: code },
        url: "postback/AbnamaNews.ashx",
        success: function (data) {
            $.each(data, function (index) {
                tablediv = tablediv.replaceAll("{strTitle}", this['strTitleNews']);
                tablediv = tablediv.replaceAll("{strDesc}", this["strDescriptionNews"]);
            });
            $("#descriptiondiv").html(tablediv);
        }
    });
}
//------------------------------------------------------------------------------
function GetTabsDeActive(TabName) {
    var status = $("#ctl00_ContentPlaceHolder1_lblAccess").html();

    var array = status.split(',');
    for (var i = 0 ; i <= array.length ; i++) {
        if (array[i] != "") $("#" + TabName).tabs('remove', parseInt(array[i]));
    }

}
//------------------------------------------------------------------------------
function Getdrpdwn(Divid, drpid, width, Firstrowtitle,FirstrowValue, i, urlpostback, blankmsg, func) {
    $("#" + Divid).html("<img src='images/loading.gif' />");
    var Header = "<label class=\"Select\"><select id=\"" + drpid + "\" name=\"" + drpid + "\"  class='SelectCss' " +func+ " >";
    var option = "<option value=\"{value}\" dir=\"rtl\" >{item}</option>";
    var footer = "</select></label><span id='" + drpid + "Eror' class='ValidationEror' style='left: -2px;'>*</span>";
    var row = "";
    var allrow =$.trim(Firstrowtitle)=="" ?  "" :"<option value=\"{FirstrowValue}\" selected=\"selected\">" + Firstrowtitle + "</option>";
    var allrow2 = "<option value=\"-1\" selected=\"selected\">" + blankmsg + "</option>";
    var postservice = "";
    if (drpid == "drpdwnOstanName" && urlpostback == "PBAcceptUnit.ashx") { postservice = FirstrowValue; FirstrowValue = ""; }
    if (drpid == "DrpdwnForSendAgentName" && urlpostback == "PBAcceptUnit.ashx") { postservice = $("#drpdwnAganceResivePostService").val(); }
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: i, p: postservice },
        url: "PostBack/" + urlpostback,
        success: function (data) {
            var t = 0;
            var allValue = "";
            $.each(data, function (index) {
                row = option.replaceAll("{value}", $.trim(this["value"]));
                row = row.replaceAll("{item}", $.trim(this["item"]));
                allrow = allrow + row;
                if (allValue=="")
                    allValue = allValue + $.trim(this["value"]);
                else
                    allValue = allValue + ","+ $.trim(this["value"]) ;

                t = 1;
            });

            if (t == 1) {
                if ($.trim(FirstrowValue) == "") allrow = allrow.replaceAll("{FirstrowValue}", allValue);
                else allrow = allrow.replaceAll("{FirstrowValue}", -1);
                $("#" + Divid).html(Header + allrow + footer);

                if (drpid == "drpdwnOstanName" && urlpostback == "PBAcceptUnit.ashx") GetAgentNameForSendOrder("\"" + allValue + "\"", 0);
                if (drpid == "drpdwnAgentName" && urlpostback == "PBTravelUnit.ashx") GetReportAgentSendGroupCode($("#" + drpid).val());
            }
            else {
                $("#" + Divid).html(Header + allrow2 + footer);
            }

            $("#" + Divid).show();
            $("#" + drpid).css('width', width);
            $("#" + drpid).chosen({ width: "200px", no_results_text: "موردی يافت نشد" });

            //$('#drpdwnPostCenterStatus').jAutochecklist({
            //    'width': 150,
            //    'rtl': true,
            //    'textEmpty': "تمام مناطق پستی",
            //    'textSearch': "جستجو",
            //    'textNoResult': "نتیجه ای یافت نشد",
            //    'popup': false
            //});
        },
        error: function (xhr, textStatus, errorThrown) {
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
            $("#" + Divid).html("");
        }
    });
}
//------------------------------------------------------------------------------
//-------------------------------------گذاشتن کاما در فیلد های مبلغ-----------
//------------------------------------------------------------------------------
function _Amount_onkeyup(obj) {

    if (obj.value !== '') {
        obj.value = AmountMaskE2(obj.value);
    }
}
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
function AmountMaskE2(amount) {
    var i, j, mystring, flag;
    if (amount == '')
        return "";
    i = amount.length;
    mystring = "";
    for (j = 0; j < i; j++) {
        if (amount.substring(j, j + 1) == ",") {
            flag = true;
        }
    }
    if (flag == true) {
        amount = DAmountMaskE(amount);
    }
    i = amount.length;
    if (i > 3) {
        for (j = i; j > 0; j = j - 3) {

            if (j > 3) {
                mystring = "," + amount.substring(j - 3, j) + mystring;

            } else {
                mystring = amount.substring(0, j) + mystring;
            }
        }
        return mystring;
    } else {

        return amount;
    }
}
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
function DAmountMaskE(amount) {
    var i, j, mystring, str;
    i = amount.length;
    mystring = "";

    for (j = i; j >= 0; j -= 1) {
        str = amount.substring(j, j - 1);
        if (str != ",") {
            mystring = str + mystring;
        }
    }
    return mystring;
}
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
function getsalmali()
{
    $("#salmali").html("<img src='images/loading.gif' style='width:20px;'/>");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1,year:"-1" },
        url: "PostBack/PBSettingPrice.ashx",
        success: function (data) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();

            $.each(data, function (index) {
                $("#salmali").html(this["numYear"]);

                $("#yearlblKarkardPriceDate").val(this["numYear"]);
                $("#yearlblDateYearForMonth").val(this["numYear"]);
                $("#yearlblReportDescYear").val(this["numYear"]);
                $("#yearlblReportKosorYear").val(this["numYear"]);
                $("#yearlblDatePadashDate").val(this["numYear"]);
                $("#yearlblSearchPadashDate").val(this["numYear"]);
                $("#yearlblMosaedeDate").val(this["numYear"]);
                $("#yearlblSearchMosaedeDate").val(this["numYear"]);
                $("#yearlblFaraiandKarkardhDate").val(this["numYear"]);
                $("#yearlblMonthKarkardMahanehDate").val(this["numYear"]);
                $("#yearlblMorakhsiMonthDate").val(this["numYear"]);
                $("#yearlblDateEidi").val(this["numYear"]);
                $("#yearlblDateMorakhasi").val(this["numYear"]);

              //  $("#yearlblKarkardPriceDate,#yearlblDateYearForMonth,#yearlblReportDescYear,#yearlblReportKosorYear,#yearlblDatePadashDate,#yearlblSearchPadashDate,#yearlblMosaedeDate,#yearlblSearchMosaedeDate,#yearlblFaraiandKarkardhDate,#yearlblMonthKarkardMahanehDate,#yearlblMorakhsiMonthDate,#yearlblDateEidi,#yearlblDateMorakhasi").attr("disabled", "disabled");

            });
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}