var IntervalHasMsgMaster;
//-----------------------------------------------------------------------
$(document).ready(function () {
    $("#btnUpdateReport").click(function () { ReportChart(); return false; });
    $("#btnUpdateReport").button();
    $("#btnUpdateReport").css("font-family", "tahoma");
    $("#btnUpdateReport").css("font-weight", "normal");
    //$("#main").click(function () {
    //    $("#divsrch").fadeOut('slow');
    //});
    //GetOnlineUsers(2);
    //setInterval(function () {
    //    GetOnlineUsers(2);
    //}, 60 * 1000);
    //IntervalHasMsgMaster = setInterval("HasMdgMaster();", 60000);
    //HasMdgMaster();
    $("#ctl00_avatar_image").click(function () { Uploadimg(); return false; });

    CheckPersonelEndContract();
    CheckPersonelNoneWorkGroup();
    CheckPersonelNewPeik();
   
    
});
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
var flag = 0;
var ResetInterval;
var ResetInterval2;

var flag1 = 0;
var ResetInterval3;
var ResetInterval4;

var flag2 = 0;
var ResetInterval5;
var ResetInterval6;
function CheckPersonelEndContract() {
    $("#ResultRet2EndContract").html("<img src='images/loading.gif' style='width:15px;height:15px;'/>");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 12 },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            $("#ResultRet2EndContract").html(data);
            clearInterval(ResetInterval);
            clearInterval(ResetInterval2);
            ResetInterval2 = setInterval("CheckPersonelEndContract();", 600000); //ده دقیقه
            if (parseInt(data) > 0) ResetInterval = setInterval(function () {
                if (flag == 0){
                    $("#link2EndContract").css("color", "#ff0000").css("cursor", "pointer");
                    flag = 1;
                    $("#link2EndContract").attr("href", "Contract.aspx#contract_2");
                    $("#link2EndContract").attr("target", "_blank");
                }
                else{
                    $("#link2EndContract").css("color", "#000000");
                    flag = 0;
                    $("#link2EndContract").attr("href", "Contract.aspx#contract_2");
                    $("#link2EndContract").attr("target", "_blank");
                }
            }, 1000);

        }
    });
}
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
function CheckPersonelNoneWorkGroup() {
    $("#ResultRet2NoneWorkGroup").html("<img src='images/loading.gif' style='width:20px;height:20px;'/>");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 14 },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            $("#ResultRet2NoneWorkGroup").html(data);
            clearInterval(ResetInterval3);
            clearInterval(ResetInterval4);
            ResetInterval4 = setInterval("CheckPersonelNoneWorkGroup();", 600000); //ده دقیقه
            if (parseInt(data) > 0) ResetInterval3 = setInterval(function () {
                if (flag1 == 0) {
                    $("#link2NoneWorkgroup").css("color", "#ff0000").css("cursor", "pointer");
                    flag1 = 1;
                    $("#link2NoneWorkgroup").attr("href", "PersonelWorkGroup.aspx#workgroup_5");
                    $("#link2NoneWorkgroup").attr("target", "_blank");
                }
                else {
                    $("#link2NoneWorkgroup").css("color", "#000000");
                    flag1 = 0;
                    $("#link2NoneWorkgroup").attr("href", "PersonelWorkGroup.aspx#workgroup_5");
                    $("#link2NoneWorkgroup").attr("target", "_blank");
                }
            }, 1000);

        }
    });
}
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
function CheckPersonelNewPeik() {
    $("#ResultRet2NewPeik").html("<img src='images/loading.gif' style='width:20px;height:20px;'/>");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 17 },
        url: "PostBack/PBContract.ashx",
        success: function (data) {
            $("#ResultRet2NewPeik").html(data);
            clearInterval(ResetInterval5);
            clearInterval(ResetInterval6);
            ResetInterval6 = setInterval("CheckPersonelNewPeik();", 600000); //ده دقیقه
            if (parseInt(data) > 0) ResetInterval5 = setInterval(function () {
                if (flag2 == 0) {
                    $("#link2NewPeikRegister").css("color", "#ff0000").css("cursor", "pointer");
                    flag2 = 1;
                    $("#link2NewPeikRegister").attr("href", "Contract.aspx#tab_2");
                    $("#link2NewPeikRegister").attr("target", "_blank");
                }
                else {
                    $("#link2NewPeikRegister").css("color", "#000000");
                    flag2 = 0;
                    $("#link2NewPeikRegister").attr("href", "Contract.aspx#tab_2");
                    $("#link2NewPeikRegister").attr("target", "_blank");
                }
            }, 1000);

        }
    });
}
//-----------------------------------------------------------------------
function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop + 2;
        } while (obj = obj.offsetParent);
    }
    return [curleft, curtop];
}
//-----------------------------------------------------------------------
function ShowSrchDiv(e) {
    var unicode = e.keyCode ? e.keyCode : e.charCode
    var d = document.getElementById('divsrch');
    var t = document.getElementById('ctl00_txtSrch');
    if (unicode == 13) {
        d.style.left = findPos(t)[0] - 5 + 'px';
        d.style.top = findPos(t)[1] + 30 + 'px';
        d.style.display = 'block';
        updateSrchDiv();
        return false;
    }
    else {
        $("#divsrch").fadeOut('slow');
        return true;
    }
}
//-----------------------------------------------------------------------
function updateSrchDiv() {
    $("#divsrch").html("<img src='Images/loading.gif' />");
    var strOrdercode = document.getElementById('ctl00_txtSrch').value;
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 2, w: strOrdercode },
        url: "PostBack/PBMasterPage.ashx",
        success: function (data) {
            $("#divsrch").html(data.result);
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#divsrch").html("<p>" + "مرسوله ای یافت نشد" + "</p>");
        }
    });
}
//-----------------------------------------------------------------------
function disableEnterKey(e) {
    var key;
    if (window.event)
        key = window.event.keyCode; //IE
    else
        key = e.which; //firefox     
    return (key != 13);
}
//-----------------------------------------------------------------------
function ShowOrderDiv() {
    var d = document.getElementById('divOrder');
    var t = document.getElementById('ctl00_txtSrch');
    d.style.left = findPos(t)[0] - 5 + 'px';
    d.style.top = findPos(t)[1] + 30 + 'px';
    d.style.display = 'block';
    d.innerHTML = "<img src=\"Images/loading.gif\" />";
}
//-----------------------------------------------------------------------
function updateOrderDiv(ordercode) {
    $("#divOrder").html("<img src='Images/loading.gif' />");
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 3, w: ordercode },
        url: "PostBack/PBMasterPage.ashx",
        success: function (data) {
            $("#divOrder").html(data.result);
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#divOrder").html("<p onclick='HideOrderDiv();' src='images/delete.png'>" + "مرسوله ای یافت نشد" + "</p>");
        }
    });
}
//-----------------------------------------------------------------------
function HideOrderDiv() {
    $("#divOrder").fadeOut('slow');
}
//-----------------------------------------------------------------------
function BuyerHistory(OrderCode) {
    var w = 400;
    var h = 220;
    var wi = new Number(w);
    var he = new Number(h);
    wi = wi.valueOf() + 15;
    he = he.valueOf() + 15;
    remoteWindow = open("BuyerHistory.aspx?o=" + OrderCode, "_blank", "width=" + wi + ",height=" + he + ", resizable=no,scrollbars=yes,toolbar=no,menubar=no");
    remoteWindow.moveTo(screen.width / 2 - w / 2, screen.height / 2 - h / 2);
}
//-----------------------------------------------------------------------
function OrderLog(OrderCode) {
    var w = 400;
    var h = 220;
    var wi = new Number(w);
    var he = new Number(h);
    wi = wi.valueOf() + 15;
    he = he.valueOf() + 15;
    remoteWindow = open("OrderDatelog.aspx?o=" + OrderCode, "_blank", "width=" + wi + ",height=" + he + ", resizable=no,scrollbars=yes,toolbar=no,menubar=no");
    remoteWindow.moveTo(screen.width / 2 - w / 2, screen.height / 2 - h / 2);
}
//-----------------------------------------------------------------------
function GetOnlineUsers() {
    //    $("#divOnlineUsers").html("<img src='images/bigloading.gif' style='width: 20px;' />");
    var tblHead = "<table style='width:100%;'>";
    var tblMainRow = "<tr><td><div id='notif{Code}' align='center' class='notificationMaster' style='display:none;'></td><td id='tdAgcStat' align='center'><img src='/images/avatar_image_online.jpg' style='width:30px; cursor:pointer;' onclick='OpenMsg(\"{Code}\");'></td><td id='tdAgcName' >{AgcName}</td></tr>";
    var tblFooter = " </table>";
    var CopyRow = "";
    var AllRow = "";
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBMasterPage.ashx",
        success: function (data) {
            if (data[1] == "4" || data[1] == "3") $("#DivCmCheckOnline").hide();
            else $("#DivCmCheckOnline").show();
            $.each(data[0], function (index) {
                CopyRow = tblMainRow.replaceAll("{AgcName}", this['AgcName']);
                CopyRow = CopyRow.replaceAll("{Code}", this['PersonMelliCode']);
                AllRow = AllRow + CopyRow;
            });
            $("#divOnlineUsers").html(tblHead + AllRow + tblFooter);
        },
        error: function (xhr, textStatus, errorThrown) {

        }
    });
}
//---------------------------------------------------------------
function OpenMsg(Code) {
    var w = 550;
    var h = 360;
    var wi = new Number(w);
    var he = new Number(h);
    wi = wi.valueOf() + 15;
    he = he.valueOf() + 15;
    remoteWindow = open('SendMsg.aspx?c=' + Code, "_blank", "width=" + wi + ",height=" + he + ", resizable=no,scrollbars=yes,toolbar=no,menubar=no");
    remoteWindow.moveTo(screen.width / 2 - w / 2, screen.height / 2 - h / 2);
}
//---------------------------------------------------------------
function HasMdgMaster() {

    if ($('#chk_MessageCheck').is(":checked")) {
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            data: { i: 11 },
            url: "postback/PBAccount.ashx",
            success: function (data) {
                $.each(data, function (index) {
                    if (this['Cnt'] != '0') {
                        $("#notif" + this['strPersonMelliCode']).css("display", "block");
                        $("#notif" + this['strPersonMelliCode']).html(this['Cnt']);
                    }
                    else {
                        $("#notif" + this['strPersonMelliCode']).css("display", "none");
                    }
                });
            }
        });
    }
}
//---------------------------------------------------------------
function ChangeStatusByAdmin() {
    $("#PnlChangeStatus").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "تغییر وضعیت",
        width: 500,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "تغییر وضعیت": function () {
                ChangeStatusOrderByAdmin();
            },
            "انصراف": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#drpdwnChangeStatus").val("-1");
    $("#txtOrderCode").val("");
    $("#ResultMsg").html("");
    $("#ResultMsg").hide();
    $("#PnlChangeStatus").dialog("open");
}
//---------------------------------------------------------------
function ChangeStatusOrderByAdmin() {
    var strOrdercode = $("#txtOrderCode").val();
    var status = $("#drpdwnChangeStatus").val();
    if ($.trim(strOrdercode) != '') {
        if (status != '-1') {
            if (confirm("آیا تغییر وضعیت شود ؟")) {
                $("#ResultMsg").html("");
                $("#Loading").fadeIn();
                $("#CheckOut").fadeIn();
                if (strOrdercode != "" && strOrdercode.length >= 10) {
                    strOrdercode = convertOrderMayaToLtd(strOrdercode);
                }
                $.ajax({
                    type: "POST",
                    async: true,
                    cache: false,
                    dataType: "json",
                    data: { i: 4, strOrdercode: strOrdercode, status: status },
                    url: "PostBack/PBMasterPage.ashx",
                    success: function (data) {
                        $("#Loading").fadeOut();
                        $("#CheckOut").fadeOut();
                        $("#ResultMsg").html("<span style='color: #FF0000'>" + data.result + "</span>");
                        $("#ResultMsg").slideDown();
                    }
                });
            }
        }
        else {
            $("#ResultMsg").html('<span style="color: #FF0000">وضعیتی انتخاب نشده است</span>');
            $("#ResultMsg").slideDown();
        }
    }
    else {
        $("#ResultMsg").html('<span style="color: #FF0000">شناسه وارد نشده است</span>');
        $("#ResultMsg").slideDown();
    }
}
//---------------------------------------------------------------
function ToggleSlideThree() {
    if ($('#chk_MessageCheck').is(":checked")) {
        $('.slideThree').css('background', '#eee');
    } else {
        $('.slideThree').css('background', '#5fbeaa');

    }
}

//---------------------------------------------------------------

(function (window, $) {
    $(function () {
        $('input[type=button]').on('click', function (event) {
            event.preventDefault();

            var $div = $('<div/>'),
                btnOffset = $(this).offset(),
                  xPos = event.pageX - btnOffset.left,
                  yPos = event.pageY - btnOffset.top;

            $div.addClass('ripple-effect');
            var $ripple = $(".ripple-effect");

            $ripple.css("height", $(this).height());
            $ripple.css("width", $(this).height());
            $div
              .css({
                  top: yPos - ($ripple.height() / 2),
                  left: xPos - ($ripple.width() / 2),
                  background: $(this).data("ripple-color")
              })
              .appendTo($(this));

            window.setTimeout(function () {
                $div.remove();
            }, 2000);
        });

    });
})(window, jQuery);
//---------------------------------------------------------------
function Uploadimg() {
    $("#tdalarm").html('');
    $("#uploadFile").val('');
    $("#divImgUpload").dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        title: "تغییر عکس پنل کاربری",
        width: 500,
        dialogClass: 'RightToLeftText',
        closeOnEscape: true,
        buttons: {
            "بروزرسانی": function () {
                UploadImgFile();
            },
            "انصراف": function () {
                $(this).dialog("close");
                $("#tdalarm").html('');
                $("#uploadFile").val('');
            }
        }
    });
    $("#divImgUpload").dialog("open");
}
//-----------------------------------------------------
function CheckImagPaneleFormatSize(fupid) {
    $("#tdalarm").html('');
    var val = $("#" + fupid).val();
    s = ~~(val.size / 1024) + 'KB';
    if (val != "") {
        switch (val.substring(val.lastIndexOf('.') + 1).toLowerCase()) {
            case 'jpg':
                document.getElementById("uploadFile").value = val;
                break;
            default:
                $("#" + fupid).val('');
                $("#tdalarm").html("فرمت فایل نامعتبر است!");
                return false;
                break;
        }
        if (s > 500) {
            $("#" + fupid).val('');
            $("#tdalarm").html("حجم فایل زیاد است لطفا عکس با حجم کمتری انتخاب کنید!");
        }
    }
}
//--------------------------------------------------
function UploadImgFile() {
    var UploadFile = $("#uploadFile").val();
    if (UploadFile == '') {
        $("#tdalarm").html('عکس مورد نظر را انتخاب کنید.');
    }
    else {
        $("#tdalarm").html("<img src='Images/loading.gif' />");
        var fd = new FormData();
        fd.append("file", document.getElementById('uploaderImg').files[0]);

        fd.append("i", 5);
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json",
            data: fd,
            url: "PostBack/PBMasterPage.ashx",
            success: function (data) {
                if (data[0] == 1) {
                    $("#tdalarm").html('لطفا دوباره تلاش کنید');
                }
                else {
                    $("#ctl00_avatar_image").attr("src", '');
                    $("#ctl00_avatar_image").attr("src", "Images/UploadImg/" + data[1] + "");
                    $("#tdalarm").html("با موفقیت بروزرسانی شد");
                    $("#Loading").fadeOut();
                    $("#ImgUpload").fadeOut();
                }

            }
        });
    }
}
