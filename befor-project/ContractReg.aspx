<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="ContractReg.aspx.cs" Inherits="ContractReg" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="Css/ContractReg.css" rel="stylesheet" />
    <link href="Css/jspc-gray.css" rel="stylesheet" />
    <script src="js/js-persian-cal.min.js" type="text/javascript"></script>
    <script src="js/Pages/ContractReg.js" type="text/javascript"></script>

    <%-- <script src="js/bootstrap.js" type="text/javascript"></script>
    <link href="Css/bootstrap.css" rel="stylesheet" />--%>
    <%--    <link href="Css/bootstrap-theme.css" rel="stylesheet" />
    <script src="js/bootstrap-select.js" type="text/javascript"></script>
    <link href="Css/bootstrap-select.css" rel="stylesheet" />--%>
    <link href="Css/font-awesome1.css" rel="stylesheet" />

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1">ثبت/ویرایش</a></li>
            <li><a href="#tab_2">گزارش</a></li>
        </ul>
        <div id="tab_1">
            <table style="width: 100%;">
                <tr>
                    <td align="left" style="width: 50px;">کدپرسنلی :
                    </td>
                    <td align="right" style="width: 175px;">
                        <input id="txtSearchPersonelCode" type="text" style="width: 170px;" class="InputTextRightToLeftText" placeholder="کدپرسنلی را وارد نمایید..." />
                    </td>
                    <td align="right" id="loadingSearchPersonelCode"></td>
                    <td align="right"></td>
                </tr>
                <tr id="hrInfoAllPersonel" style="display: none;">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr id="trInfoAllPersonel" style="display: none;">
                    <td colspan="4">
                        <div style="width: 100%;">
                            <ul class="steps">
                                <li class="active" id="step1">
                                    <span class="step">1</span>
                                    <span class="title">اطلاعات پایه</span>
                                </li>
                                <li id="step2" class="">
                                    <span class="step">2</span>
                                    <span class="title">اطلاعات تماس و سکونت</span>
                                </li>
                                <li id="step3" class="">
                                    <span class="step">3</span>
                                    <span class="title">سوابق تحصیلی</span>
                                </li>
                                <li id="step4" class="">
                                    <span class="step">4</span>
                                    <span class="title">دوره های آموزشی قبل از استخدام</span>
                                </li>

                                <li id="step5" class="">
                                    <span class="step">5</span>
                                    <span class="title">تسلط بر زبان خارجی</span>
                                </li>

                                <li id="step6" class="">
                                    <span class="step">6</span>
                                    <span class="title">توانایی و مهارت</span>
                                </li>
                                <li id="step7" class="">
                                    <span class="step">7</span>
                                    <span class="title">سوابق کار</span>
                                </li>
                              <%--  <li id="step8" class="">
                                    <span class="step">8</span>
                                    <span class="title">اطلاعات مالی و بیمه</span>
                                </li>--%>
                                <li id="step8" class="">
                                    <span class="step">8</span>
                                    <span class="title">بارگزاری مدارک</span>
                                </li>
                                <li id="step9" class="">
                                    <span class="step">9</span>
                                    <span class="title">پیش تاییدوثبت نهایی</span>
                                </li>

                            </ul>
                        </div>
                        <div style="width: 100%;">
                            <hr />
                        </div>
                        <div class="step-content pos-rel">
                            <div id="stepInfo1" class="step-pane active">
                                <table style="width: 100%;">
                                    <tr>
                                        <td align="left" style="width: 115px;">نام :
                                        </td>
                                        <td align="right">
                                            <input id="txtName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtName');" />
                                        </td>
                                        <td align="left">نام خانوادگی :
                                        </td>
                                        <td align="right">
                                            <input id="txtFamily" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtFamily');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">نام پدر :
                                        </td>
                                        <td align="right">
                                            <input id="txtFatherName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtFatherName');" />
                                        </td>
                                        <td align="left">کد ملی :
                                        </td>
                                        <td align="right">
                                            <input id="txtMelliCode" type="text" style="width: 170px;" maxlength="10" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMelliCode');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">شماره شناسنامه :
                                        </td>

                                        <td align="right">
                                            <input id="txtNumberShenasname" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNumberShenasname');" />
                                        </td>
                                        <td align="left">شماره سریال شناسنامه :
                                        </td>

                                        <td align="right">
                                            <div style="float: right; width: 30%;">
                                                <input id="txtMosalsalShenasname2" type="text" style="width: 50px;" maxlength="6" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMosalsalShenasname2');" />
                                                /
                                            </div>
                                            <div style="float: right; width: 23%;">
                                                <input id="txtMosalsalShenasname1" type="text" style="width: 30px;" maxlength="2" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMosalsalShenasname1');" />
                                                /

                                            </div>
                                            <div style="float: right; width: 20%;">
                                                <select id="drpdwnharf" class="InputSelectRightToLeftText">
                                                    <option value="الف" selected="selected">الف</option>
                                                    <option value="ب">ب</option>
                                                    <option value="ل">ل</option>
                                                    <option value="د">د</option>
                                                    <option value="ر">ر</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="9">9</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                </select>
                                            </div>
                                            <%--<input id="txtMosalsalShenasname" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMosalsalShenasname');" />--%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">تاریخ تولد :
                                        </td>

                                        <td align="right">
                                            <input id="pcaldateBrithdayDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateBrithdayDate');" />
                                        </td>

                                        <td align="left">محل تولد :
                                        </td>

                                        <td align="right">
                                            <input id="txtBrithdayCityRef" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtBrithdayCityRef');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">محل صدور :
                                        </td>

                                        <td align="right">
                                            <input id="txtExportCityRef" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtExportCityRef');" />
                                        </td>

                                        <td align="left">ملیت :
                                        </td>

                                        <td align="right">
                                            <%--<input id="txtMeliat" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMeliat');" />--%>
                                            <select id="drpdwnMeliat" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnMeliat');">
                                                <option value="-1" selected="selected">انتخاب نمایید...</option>
                                                <option value="1">ایرانی</option>
                                                <option value="2">غیرایرانی</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">جنسیت :
                                        </td>

                                        <td align="right" id="divdrpdwnJensiat">
                                            <img src='images/loading.gif' />

                                        </td>
                                        <td align="left">گروه خونی :
                                        </td>
                                        <td align="right" id="divdrpdwnBlod">
                                            <img src='images/loading.gif' />
                                        </td>

                                    </tr>
                                    <tr>
                                        <td align="left">دین :
                                        </td>

                                        <td align="right" id="divdrpdwnReligion">
                                            <img src='images/loading.gif' />
                                        </td>

                                        <td align="left">مذهب :
                                        </td>

                                        <td align="right">
                                            <input id="txtGilder" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtGilder');" />
                                        </td>
                                    </tr>
                                    <tr>

                                        <td align="left" id="titleStatusMilitary" style="display: none;">وضعیت خدمت :
                                        </td>
                                        <td align="right" id="divdrpdwnMilitary" style="display: none;">
                                            <img src='images/loading.gif' />
                                        </td>
                                        <td align="left">وضعیت تاهل :
                                        </td>
                                        <td align="right" id="divdrpdwnMarrid">
                                            <img src='images/loading.gif' />
                                        </td>
                                    </tr>
                                    <tr id="trMarridInfo" style="display: none;">
                                        <td align="center" colspan="4">
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td colspan="4">
                                                        <hr />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td align="left" style="width: 112px;">
                                                        <%--تاریخ ازدواج :--%>
                                                    </td>
                                                    <td align="right" style="width: 274px;">
                                                        <%--<input id="pcaldateMarridDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateMarridDate');" />--%>
                                                    </td>

                                                    <td align="left" style="width: 124px;">
                                                        <%--تعداد همسر :--%>

                                                    </td>
                                                    <td align="right">
                                                        <%--   <select id="drpdwnCntHasuband" class="InputSelectRightToLeftText" style="width: 176px;" onchange="showInputInfoMarrid();" onfocus="ResetErrorIconInput('drpdwnCntHasuband');">
                                            <option value="-1" selected="selected">انتخاب نمایید...</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>--%>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" style="width: 112px;">تعداد فرزند :
                                                    </td>
                                                    <td align="right" style="width: 274px;">
                                                        <select id="drpdwnCntChild" class="InputSelectRightToLeftText" style="width: 176px;" onchange="showInputInfoChild();" onfocus="ResetErrorIconInput('drpdwnCntChild');">
                                                            <option value="-1" selected="selected">انتخاب نمایید...</option>
                                                            <option value="0">ندارد</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </td>

                                                    <td align="left" style="width: 124px;"></td>
                                                    <td align="right"></td>
                                                </tr>
                                                <tr id="trShowInputInfoMarrid">
                                                    <td colspan="4">
                                                        <table style="width: 100%;" id="TableInputInfoMarrid">
                                                            <tr>
                                                                <td colspan="4">
                                                                    <hr />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="4" align="center">ثبت اطلاعات همسر</td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="4">
                                                                    <hr />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="width: 120px;">نام :
                                                                </td>
                                                                <td align="right">
                                                                    <input id="txtNameMarird" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNameMarird');" />
                                                                </td>
                                                                <td align="left">نام خانوادگی :
                                                                </td>
                                                                <td align="right">
                                                                    <input id="txtFamilyMarird" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtFamilyMarird');" />
                                                                </td>
                                                            </tr>
                                                            <tr>

                                                                <td align="left">کد ملی :
                                                                </td>
                                                                <td align="right">
                                                                    <input id="txtMelliCodeMarird" type="text" style="width: 170px;" maxlength="10" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMelliCodeMarird');" />
                                                                </td>

                                                                <td align="left">شماره شناسنامه :
                                                                </td>

                                                                <td align="right">
                                                                    <input id="txtNumberShenasnameMarird" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNumberShenasnameMarird');" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="width: 112px;">تاریخ تولد</td>
                                                                <td>
                                                                    <input id="pcaldateMarridBrithdayDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateMarridBrithdayDate');" />
                                                                </td>

                                                                <td align="left">تاریخ ازدواج :
                                                                </td>
                                                                <td align="right" style="width: 274px;">
                                                                    <input id="pcaldateMarridDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateMarridDate');" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left"></td>

                                                                <td align="right"></td>

                                                                <td></td>
                                                                <td align="right">
                                                                    <input id="btnSaveInfoMarrid" type="button" value="ثبت اطلاعات همسر" />
                                                                    <input id="btnSaveEditInfoMarrid" type="button" value="بروزرسانی اطلاعات همسر" style="display: none;" />
                                                                </td>
                                                            </tr>

                                                        </table>
                                                        <div style="width: 100%; display: none;" id="ResaultInfoMarrid">
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr id="trShowInputInfoChild" style="display: none;">
                                                    <td colspan="4">
                                                        <table style="width: 100%;" id="TableInputInfoChild">
                                                            <tr>
                                                                <td colspan="4">
                                                                    <hr />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="4" align="center">ثبت اطلاعات فرزند</td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="4">
                                                                    <hr />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="width: 120px;">نام :
                                                                </td>
                                                                <td align="right">
                                                                    <input id="txtNameChild" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNameChild');" />
                                                                </td>
                                                                <td align="left">نام خانوادگی :
                                                                </td>
                                                                <td align="right">
                                                                    <input id="txtFamilyChild" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtFamilyChild');" />
                                                                </td>
                                                            </tr>
                                                            <tr>

                                                                <td align="left">کد ملی :
                                                                </td>
                                                                <td align="right">
                                                                    <input id="txtMelliCodeChild" type="text" style="width: 170px;" maxlength="10" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMelliCodeChild');" />
                                                                </td>
                                                                <td align="left">شماره شناسنامه :
                                                                </td>
                                                                <td align="right">
                                                                    <input id="txtNumberShenasnameChild" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNumberShenasnameChild');" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="left" style="width: 112px;">تاریخ تولد</td>
                                                                <td>
                                                                    <input id="pcaldateChildBrithdayDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateChildBrithdayDate');" />
                                                                </td>
                                                                <td align="left">نوع فرزند :
                                                                </td>
                                                                <td align="right">
                                                                    <select id="drpdwnChildKind" class="InputSelectRightToLeftText" onfocus="ResetErrorIconInput('drpdwnChildKind');" style="width: 176px;">
                                                                        <option value="-1" selected="selected">انتخاب نمایید...</option>
                                                                        <option value="1">پسر</option>
                                                                        <option value="2">دختر</option>
                                                                    </select>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td align="left"></td>
                                                                <td align="right"></td>

                                                                <td></td>
                                                                <td align="right">
                                                                    <input id="btnSaveInfoChild" type="button" value="ثبت اطلاعات فرزند" />
                                                                    <input id="btnSaveEditInfoChild" type="button" value="بروزرسانی اطلاعات فرزند" style="display: none;" />
                                                                </td>
                                                            </tr>

                                                        </table>
                                                        <div style="width: 100%; display: none;" id="ResaultInfoChild">
                                                        </div>
                                                    </td>
                                                </tr>


                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4" align="left">
                                            <button id="btnPrevPage1" class="btn btn-prev" disabled="disabled">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage1" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                    <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div id="stepInfo2" class="step-pane">
                                <table style="width: 100%;">
                                    <tr>
                                        <td align="left" style="width: 115px;">استان :
                                        </td>
                                        <td align="right" id="divdrpdwnProvince">
                                            <img src='images/loading.gif' />
                                        </td>

                                        <td align="left">شهر :
                                        </td>
                                        <td align="right" id="divdrpdwnCity">
                                            <img src='images/loading.gif' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">آدرس محل زندگی :
                                        </td>
                                        <td align="right" colspan="4">
                                            <input id="txtPersonelAddress" type="text" style="width: 502px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtPersonelAddress');" />
                                        </td>

                                    </tr>
                                    <tr>
                                        <td align="left">وضعیت مسکن :
                                        </td>
                                        <td align="right" id="divdrpdwnHosing">
                                            <img src='images/loading.gif' />

                                        </td>
                                        <td align="left">کد پستی :
                                        </td>
                                        <td align="right">
                                            <input id="txtPostCode" type="text" style="width: 170px;" maxlength="10" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtPostCode');" />
                                        </td>

                                    </tr>
                                    <tr>
                                        <td align="left">تلفن ثابت :
                                        </td>
                                        <td align="right">
                                            <input id="txtTel" type="text" style="width: 117px;" maxlength="15" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTel');" />-
                                <input id="txtTel1" type="text" style="width: 39px;" maxlength="5" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTel1');" />
                                        </td>
                                        <td align="left">موبایل :
                                        </td>
                                        <td align="right">
                                            <input id="txtMobile" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMobile');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">تلفن ضروری :
                                        </td>
                                        <td align="right">
                                            <input id="txtTelNecessary" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTelNecessary');" />
                                        </td>

                                        <td align="left">ایمیل :
                                        </td>
                                        <td align="right">
                                            <input id="txtEmail" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtEmail');" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4">
                                            <button id="btnPrevPage2" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage2" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                                <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div id="stepInfo3" class="step-pane">
                                <table style="width: 100%;">
                                    <tr>
                                        <td align="left" style="width: 115px;">نام مرکز آموزشی :
                                        </td>
                                        <td align="right">
                                            <input id="txtUniversityName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtUniversityName');" />
                                        </td>

                                        <td align="left">مدرک تحصیلی :
                                        </td>
                                        <td align="right" id="divdrpdwnUniversitySection">
                                            <img src='images/loading.gif' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">رشته تحصیلی :
                                        </td>
                                        <td align="right">
                                            <input id="txtUniversityField" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtUniversityField');" />
                                        </td>

                                        <td align="left">گرایش :
                                        </td>
                                        <td align="right">
                                            <input id="txtUniversityOrientation" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtUniversityOrientation');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">تاریخ شروع تحصیل :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateStartUniversityDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateStartUniversityDate');" />

                                        </td>

                                        <td align="left">تاریخ پایان تحصیل :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateEndUniversityDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateEndUniversityDate');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">معدل مدرک دریافتی :
                                        </td>
                                        <td align="right">
                                            <input id="txtUniversityAvg" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtUniversityAvg');" />
                                        </td>
                                        <td></td>
                                        <td>
                                            <input id="btnSaveUnivercity" type="button" value="پیش ثبت" />
                                            <input id="btnEditUnivercity" type="button" value="بروزرسانی" style="display: none;" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="trShowUniversityInfo" style="display: none;"></td>

                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4">
                                            <button id="btnPrevPage3" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage3" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                                <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div id="stepInfo4" class="step-pane">
                                <table style="width: 100%;">
                                    <tr>
                                        <td align="left" style="width: 115px;">نام موسسه :
                                        </td>
                                        <td align="right">
                                            <input id="txtMoaseseName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoaseseName');" />
                                        </td>

                                        <td align="left">نام دوره :
                                        </td>
                                        <td align="right">
                                            <input id="txtDoreName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtDoreName');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 115px;">تاریخ شروع دوره :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateStartDoreDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateStartDoreDate');" />
                                        </td>

                                        <td align="left">تاریخ پایان دوره :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateEndDoreDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateEndDoreDate');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 115px;">مدت دوره :
                                        </td>
                                        <td align="right">
                                            <input id="txtTimeDore" type="text" style="width: 50px;height:26px;padding-top:2px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTimeDore');" />
                                         <select id="drpdwnTimeDore" class="InputSelectRightToLeftText" onfocus="ResetErrorIconInput('drpdwnTimeDore');" style="width: 117px;" >
                                                <option value="1">ساعت</option>
                                                <option value="2">روز</option>
                                                <option value="3">هفته</option>
                                                <option value="4">ماه</option>
                                            </select>
                                             </td>
                                        <td align="left" style="width: 115px;">گواهینامه :
                                        </td>
                                        <td align="right">
                                            <select id="drpdwnGovahiCheck" class="InputSelectRightToLeftText" onfocus="ResetErrorIconInput('drpdwnGovahiCheck');" style="width: 176px;" onchange="GetGovahiNameInfo();">
                                                <option value="0">ندارد</option>
                                                <option value="1">دارد</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 115px; display: none;" id="govahiname1">عنوان گواهینامه :
                                        </td>
                                        <td align="right" style="display: none;" id="govahiname2">
                                            <input id="txtGovahiName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtGovahiName');" />
                                        </td>
                                        <td align="left"></td>
                                        <td align="right">
                                            <input id="btnSaveDore" type="button" value="پیش ثبت" />
                                            <input id="btnEditDore" type="button" value="بروزرسانی" style="display: none;" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colspan="4" align="center" id="trShowDoreInfo" style="display: none;"></td>

                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4">
                                            <button id="btnPrevPage4" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage4" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                                <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div id="stepInfo5" class="step-pane">
                                <table style="width: 100%;">
                                    <tr>
                                        <td align="left" style="width: 115px;">زبان :
                                        </td>
                                        <td align="right" style="width: 195px;">
                                            <select id="drpdwnLangaugeName" class="InputSelectRightToLeftText" onfocus="ResetErrorIconInput('drpdwnLangaugeName');" style="width: 176px;" onchange="SetLangugeNameSaier();">
                                                <option value="-1" selected="selected">انتخاب نمایید...</option>
                                                <option value="1">انگلیسی</option>
                                                <option value="2">فرانسه</option>
                                                <option value="3">سایر</option>
                                            </select>

                                        </td>
                                        <td id="tdSetLangaugeName1" align="left" style="display: none;">نام زبان :
                                        </td>
                                        <td id="tdSetLangaugeName" align="right" style="display: none; width: 190px;">
                                            <input id="txtLangaugeName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtLangaugeName');" />
                                        </td>

                                        <td align="right">
                                            <input id="btnSaveLangauge" type="button" value="پیش ثبت" />
                                        </td>
                                        <td align="right"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" align="center" id="trShowLangugeInfo" style="display: none;"></td>

                                    </tr>
                                    <tr>
                                        <td colspan="5">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="5">
                                            <button id="btnPrevPage5" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage5" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                                <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div id="stepInfo6" class="step-pane">
                                <table style="width: 100%;">
                                    <tr>
                                        <td align="left" style="width: 115px;">عنوان مهارت :
                                        </td>
                                        <td align="right">
                                            <input id="txtMaharatName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMaharatName');" />
                                        </td>

                                        <td align="left" style="width: 115px;">سطح مهارت :
                                        </td>
                                        <td align="right">
                                            <select id="drpdwnLevelMaharat" class="InputSelectRightToLeftText" onfocus="ResetErrorIconInput('drpdwnLevelMaharat');" style="width: 176px;">
                                                <option value="-1" selected="selected">انتخاب نمایید...</option>
                                                <option value="1">ضعیف</option>
                                                <option value="2">متوسط</option>
                                                <option value="3">خوب</option>
                                                <option value="4">عالی</option>
                                            </select>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td align="left">توضیح مهارت :
                                        </td>
                                        <td align="right" style="width: 190px;">
                                            <textarea placeholder="" id="txtMaharatDesc" style="width: 170px; height: 60px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMaharatDesc');"></textarea>
                                        </td>

                                        <td align="left"></td>
                                        <td align="right">
                                            <input id="btnSaveMaharat" type="button" value="پیش ثبت" />
                                            <input id="btnEditMaharat" type="button" value="بروزرسانی" style="display: none;" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="trShowMaharatInfo" style="display: none;"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4">
                                            <button id="btnPrevPage6" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage6" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                                <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div id="stepInfo7" class="step-pane">
                                <table style="width: 100%;">
                                    <tr>
                                        <td align="left" style="width: 115px;">نام محل خدمت :
                                        </td>
                                        <td align="right">
                                            <input id="txtJobName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtJobName');" />
                                        </td>

                                        <td align="left">سمت :
                                        </td>
                                        <td align="right">
                                            <input id="txtMasoliatName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMasoliatName');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 115px;">مدت اشتغال از :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateStartJobDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateStartJobDate');" />
                                        </td>
                                          <td align="left" style="width: 115px;">مدت اشتغال تا :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateEndJobDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateEndJobDate');" />
                                        </td>
                                        
                                    </tr>
                                    <tr>
                                       <td align="left">شرح وظیفه :
                                        </td>
                                        <td align="right">
                                            <textarea placeholder="" id="txtJobDesc" style="width: 170px; height: 60px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtJobDesc');"></textarea>
                                        </td>

                                        <td align="left"></td>
                                        <td align="right">
                                            <input id="btnSaveJobHistory" type="button" value="پیش ثبت" />
                                            <input id="btnEditJobHistory" type="button" value="بروزرسانی" style="display: none;" />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="trShowJobHistoryInfo" style="display: none;"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4">
                                            <button id="btnPrevPage7" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage7" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                                <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <%--<div id="stepInfo8" class="step-pane">
                                <table style="width: 100%;">
                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" colspan="4">اطلاعات حساب جهت واریز حقوق</td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 118px;">نام بانک :
                                        </td>
                                        <td align="right">
                                            <input id="txtBankName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtBankName');" />
                                        </td>
                                        <td align="left">شماره حساب :
                                        </td>
                                        <td align="right">
                                            <input id="txtNumberAccont" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNumberAccont');" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 118px;">شماره شبا :
                                        </td>
                                        <td align="right">
                                            <input id="txtShebaBank7" type="text" style="width: 15px;" maxlength="2" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtShebaBank7');" />-
                                            <input id="txtShebaBank6" type="text" style="width: 25px;" maxlength="4" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtShebaBank6');" />-
                                            <input id="txtShebaBank5" type="text" style="width: 25px;" maxlength="4" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtShebaBank5');" />-
                                            <input id="txtShebaBank4" type="text" style="width: 25px;" maxlength="4" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtShebaBank4');" />-
                                            <input id="txtShebaBank3" type="text" style="width: 25px;" maxlength="4" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtShebaBank3');" />-
                                            <input id="txtShebaBank2" type="text" style="width: 25px;" maxlength="4" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtShebaBank2');" />-
                                            <input id="txtShebaBank1" type="text" style="width: 15px;" maxlength="2" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtShebaBank1');" />
                                            IR
                                        </td>
                                        <td align="left">شماره کارت :
                                        </td>
                                        <td align="right">
                                            <input id="txtCartNumberBank4" type="text" maxlength="4" style="width: 35px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtCartNumberBank4');" />-
                                            <input id="txtCartNumberBank3" type="text" maxlength="4" style="width: 35px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtCartNumberBank3');" />-
                                            <input id="txtCartNumberBank2" type="text" maxlength="4" style="width: 35px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtCartNumberBank2');" />-
                                            <input id="txtCartNumberBank1" type="text" maxlength="4" style="width: 35px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtCartNumberBank1');" />
                                        </td>
                                    </tr>
                                    <tr id="tdbime10" style="display: none;">
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr id="tdbime11" style="display: none;">
                                        <td align="center" colspan="4">سوابق بیمه قبل از استخدام در شرکت</td>
                                    </tr>
                                    <tr id="tdbime12" style="display: none;">
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 115px;">بیمه :
                                        </td>
                                        <td align="right">
                                            <select id="drpdwnBimeCheck" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnBimeCheck');" onchange="ShowBimeBoxInfo();">
                                                <option value="0" selected="selected">ندارد</option>
                                                <option value="1">دارد</option>
                                            </select>
                                        </td>

                                        <td align="left" style="width: 115px;"></td>
                                        <td align="right"></td>
                                    </tr>
                                    <tr id="tdbime3" style="display: none;">
                                        <td align="left" style="width: 115px; display: none;" id="tdbime1">شماره بیمه :
                                        </td>
                                        <td align="right" style="display: none;" id="tdbime2">
                                            <input id="txtNumberBimeh" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNumberBimeh');" />
                                        </td>

                                        <td align="left">کدکارگاه آخرین محل کار :
                                        </td>
                                        <td align="right">
                                            <input id="txtCodeGargah" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtCodeGargah');" />
                                        </td>

                                    </tr>
                                    <tr id="tdbime4" style="display: none;">
                                        <td align="left" style="width: 115px;">نام کارگاه آخرین محل کار :
                                        </td>
                                        <td align="right">
                                            <input id="txtGargahName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtGargahName');" />
                                        </td>
                                        <td align="left">سابقه بیمه از :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateStartBimeDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateStartBimeDate');" />
                                        </td>
                                    </tr>
                                    <tr id="tdbime5" style="display: none;">
                                        <td align="left" style="width: 115px;">سابقه بیمه تا :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateEndBimeDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateEndBimeDate');" />
                                        </td>
                                        <td align="left"></td>
                                        <td align="right">
                                            <input id="btnSaveBime" type="button" value="پیش ثبت" />
                                            <input id="btnEditBime" type="button" value="بروزرسانی" style="display: none;" />
                                        </td>
                                    </tr>
                                    <tr id="tdbime6" style="display: none;">
                                        <td colspan="4" align="center" id="trShowBimeInfo" style="display: none;"></td>
                                    </tr>
                                    <tr id="tdbime13" style="display: none;">
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr id="tdbime14" style="display: none;">
                                        <td align="center" colspan="4">سوابق بیمه بعد از استخدام در شرکت</td>
                                    </tr>
                                    <tr id="tdbime15" style="display: none;">
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr id="tdbime7" style="display: none;">
                                        <td align="left" style="width: 115px;">شماره بیمه :
                                        </td>
                                        <td align="right">
                                            <input id="txtNewNumberBimeh" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNewNumberBimeh');" />
                                        </td>

                                        <td align="left">کدکارگاه فعلی :
                                        </td>
                                        <td align="right">
                                            <input id="txtNewCodeGargah" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNewCodeGargah');" />
                                        </td>

                                    </tr>
                                    <tr id="tdbime8" style="display: none;">
                                        <td align="left" style="width: 115px;">نام کارگاه فعلی :
                                        </td>
                                        <td align="right">
                                            <input id="txtNewGargahName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtNewGargahName');" />
                                        </td>
                                        <td align="left">سابقه بیمه از :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateNewStartBimeDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateNewStartBimeDate');" />
                                        </td>
                                    </tr>
                                    
                                    <tr id="tdbime9" style="display: none;">
                                        <td align="left" style="width: 115px;">سابقه بیمه تا :
                                        </td>
                                        <td align="right">
                                            <input id="pcaldateNewEndBimeDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateNewEndBimeDate');" />
                                        </td>
                                        <td align="left"></td>
                                        <td align="right"></td>
                                    </tr>

                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4">
                                            <button id="btnPrevPage8" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnNextPage8" data-last="Finish" class="btn btn-success btn-next">
                                                بعدی
                                                <i class="ace-icon fa fa-arrow-left icon-on-left"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>--%>
                            <div id="stepInfo8" class="step-pane">
                                <table style="width: 100%;">
                                    <tr style="height: 40px;">
                                        <td align="left" style="width: 130px;">عکس پرسنلی :
                                        </td>
                                        <td align="right" style="width: 200px;">
                                            <div class="custom_file_upload" style="margin-right: 82px;">
                                                <input type="text" class="file" name="file_info" id="txtUpImagePersonel" disabled="disabled" />
                                                <div class="file_upload">
                                                    <input id="uploadFileImagePersonel" type="file" onchange="changeValueUpFile('txtUpImagePersonel','uploadFileImagePersonel');" />
                                                </div>
                                            </div>
                                        </td>
                                        <td align="right" style="width: 90px;">
                                            <input type="button" value="پیش ثبت" onclick="UpFilePersonel('txtUpImagePersonel', 'uploadFileImagePersonel', 1, 'loadingImagePersonel');" />
                                        </td>

                                        <td id="loadingImagePersonel" align="right"></td>
                                    </tr>
                                    <tr style="height: 40px;">
                                        <td align="left">امضای الکترونیکی :
                                        </td>
                                        <td align="right">
                                            <div class="custom_file_upload" style="margin-right: 82px;">
                                                <input type="text" class="file" name="file_info" id="txtUpfileImageEmza" disabled="disabled" />
                                                <div class="file_upload">
                                                    <input id="uploadFileImageEmza" type="file" onchange="changeValueUpFile('txtUpfileImageEmza','uploadFileImageEmza');" />
                                                </div>
                                            </div>
                                        </td>
                                        <td align="right" style="width: 90px;">
                                            <input type="button" value="پیش ثبت" onclick="UpFilePersonel('txtUpfileImageEmza', 'uploadFileImageEmza', 2, 'loadingImageEmza');" />
                                        </td>
                                        <td id="loadingImageEmza" align="right"></td>
                                    </tr>
                                    <tr style="height: 40px;">
                                        <td align="left">شناسنامه :
                                        </td>
                                        <td align="right">
                                            <div class="custom_file_upload" style="margin-right: 82px;">
                                                <input type="text" class="file" name="file_info" id="txtUpfileImageShenasname" disabled="disabled" />
                                                <div class="file_upload">
                                                    <input id="uploadFileImageShenasname" type="file" onchange="changeValueUpFile('txtUpfileImageShenasname','uploadFileImageShenasname');" />
                                                </div>
                                            </div>
                                        </td>
                                        <td align="right" style="width: 90px;">
                                            <input type="button" value="پیش ثبت" onclick="UpFilePersonel('txtUpfileImageShenasname', 'uploadFileImageShenasname', 3, 'loadingImageShenasname');" />
                                        </td>
                                        <td id="loadingImageShenasname" align="right"></td>
                                    </tr>
                                    <tr style="height: 40px;">
                                        <td align="left">کارت ملی :
                                        </td>
                                        <td align="right">
                                            <div class="custom_file_upload" style="margin-right: 82px;">
                                                <input type="text" class="file" name="file_info" id="txtUpfileImageMelliCart" disabled="disabled" />
                                                <div class="file_upload">
                                                    <input id="uploadFileImageMelliCart" type="file" onchange="changeValueUpFile('txtUpfileImageMelliCart','uploadFileImageMelliCart');" />
                                                </div>
                                            </div>
                                        </td>
                                        <td align="right" style="width: 90px;">
                                            <input type="button" value="پیش ثبت" onclick="UpFilePersonel('txtUpfileImageMelliCart', 'uploadFileImageMelliCart', 4, 'loadingImageMelliCart');" />
                                        </td>
                                        <td id="loadingImageMelliCart" align="right"></td>
                                    </tr>
                                    <tr style="height: 40px;">
                                        <td align="left">گواهی سلامت :
                                        </td>
                                        <td align="right">
                                            <div class="custom_file_upload" style="margin-right: 82px;">
                                                <input type="text" class="file" name="file_info" id="txtUpfileImageSalamat" disabled="disabled" />
                                                <div class="file_upload">
                                                    <input id="uploadFileImageSalamat" type="file" onchange="changeValueUpFile('txtUpfileImageSalamat','uploadFileImageSalamat');" />
                                                </div>
                                            </div>
                                        </td>
                                        <td align="right" style="width: 90px;">
                                            <input type="button" value="پیش ثبت" onclick="UpFilePersonel('txtUpfileImageSalamat', 'uploadFileImageSalamat', 8, 'loadingImageSalamat');" />
                                        </td>
                                        <td id="loadingImageSalamat" align="right"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="6">
                                            <div style="width: 100%;" id="tblUploadFiles"></div>
                                        </td>
                                    </tr>

                                </table>
                            </div>
                            <div id="stepInfo9" class="step-pane">
                                <table style="width: 100%;">

                                    <tr>
                                        <td align="left" style="width: 115px;">نام :
                                        </td>
                                        <td align="right" id="lblName" style="width: 250px;"></td>
                                        <td align="left" style="width: 150px;">نام خانوادگی :
                                        </td>
                                        <td align="right" id="lblFamily"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">نام پدر :
                                        </td>
                                        <td align="right" id="lblFatherName"></td>
                                        <td align="left">کد ملی :
                                        </td>
                                        <td align="right" id="lblMelliCode"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">شماره شناسنامه :
                                        </td>
                                        <td align="right" id="lblNumberShenasname"></td>
                                        <td align="left">شماره سریال شناسنامه :
                                        </td>
                                        <td align="right" id="lblMosalsalShenasname"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">تاریخ تولد :
                                        </td>
                                        <td align="right" id="lbldateBrithdayDate"></td>
                                        <td align="left">محل تولد :
                                        </td>
                                        <td align="right" id="lblBrithdayCityRef"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">محل صدور :
                                        </td>
                                        <td align="right" id="lblExportCityRef"></td>
                                        <td align="left">ملیت :
                                        </td>
                                        <td align="right" id="lblMeliat"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">جنسیت :
                                        </td>
                                        <td align="right" id="lblJensiat"></td>
                                        <td align="left">گروه خونی :
                                        </td>
                                        <td align="right" id="lblBlod"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">دین :
                                        </td>
                                        <td align="right" id="lblReligion"></td>
                                        <td align="left">مذهب :
                                        </td>
                                        <td align="right" id="lblGilder"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">وضعیت تاهل :
                                        </td>
                                        <td align="right" id="lblMarrid"></td>
                                        <td align="left" id="titleStatusMilitaryprint" style="display: none;">وضعیت خدمت :
                                        </td>
                                        <td align="right" id="lblMilitary" style="display: none;"></td>
                                    </tr>
                                    <tr id="lbltrMarridBaseInfo2" style="display: none;">
                                        <td align="left" style="width: 112px;">تعداد فرزند :
                                        </td>
                                        <td align="right" style="width: 274px;" id="lblCntChild"></td>

                                        <td align="left" style="width: 124px;"></td>
                                        <td align="right"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="lblResaultInfoMarrid"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="lblResaultInfoChild"></td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="width: 115px;">استان :
                                        </td>
                                        <td align="right" id="lblProvince"></td>
                                        <td align="left">شهر :
                                        </td>
                                        <td align="right" id="lblCity"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">آدرس :
                                        </td>
                                        <td align="right" id="lblPersonelAddress" colspan="3"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">وضعیت مسکن :
                                        </td>
                                        <td align="right" id="lblHosing"></td>
                                        <td align="left">کد پستی :
                                        </td>
                                        <td align="right" id="lblPostCode"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">تلفن ثابت :
                                        </td>
                                        <td align="right" id="lblTel"></td>
                                        <td align="left">موبایل :
                                        </td>
                                        <td align="right" id="lblMobile"></td>
                                    </tr>
                                    <tr>
                                        <td align="left">تلفن ضروری :
                                        </td>
                                        <td align="right" id="lblTelNecessary"></td>
                                        <td align="left">ایمیل :
                                        </td>
                                        <td align="right" id="lblEmail"></td>
                                    </tr>

                                    <tr>
                                        <td colspan="4" align="center" id="lblShowUniversityInfo"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="lblShowDoreInfo"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="lblShowLangugeInfo"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="lblShowMaharatInfo"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" align="center" id="lblShowJobHistoryInfo"></td>
                                    </tr>
                                                                     
                                     <tr>
                                        <td colspan="4" align="center" id="lblShowImageFile"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr class="wizard-actions">
                                        <td colspan="4">
                                            <button id="btnPrevPage9" class="btn btn-prev">
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                                قبلی
                                            </button>
                                            <button id="btnRegisterPersonel" class="btn btn-info" type="button">
                                                <i class="ace-icon fa fa-check bigger-110"></i>
                                                ثبت نهایی اطلاعات
                                            </button>
                                        </td>
                                    </tr>
                                </table>

                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="tab_2">
            <div class="InputSearchBox">
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: left;">از تاریخ :
                        </td>
                        <td style="text-align: right;">
                            <%--<input id="pcalReportdateFromDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />--%>
                            <asp:Label runat="server" ID="lblDateFrom"></asp:Label>
                        </td>
                        <td style="text-align: left;">تا تاریخ :
                        </td>
                        <td style="text-align: right;">
                            <%--<input id="pcalReportdateToDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />--%>
                            <asp:Label runat="server" ID="lblDateTo"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">کد پرسنلی :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>
                        <td style="text-align: left;">نام کارمند :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">کد ملی :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>
                        <td style="text-align: left;"></td>
                        <td style="text-align: right;">
                            <input id="btnReportPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                        </td>
                    </tr>
                </table>
            </div>
            <div align="right">* مرتب سازی براساس ، تاریخ ثبت می باشد</div>

            <div id="ResultDivPersonel" style="display: none; padding: 10px 0;"></div>
        </div>
    </div>

    <div id="pnlInfoPersonel" style="display:none;">
        <table  align="center" cellpadding="2" class="ui-accordion" dir="rtl" style="width:100%;">
            <tr>
                <td align="left" width="121px;">
                    کد پرسنلی :
                </td>
                 <td align="right" id="trPnlPersonelCodeInfo">

                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div id="trPnlPersonelAllInfo" align="center" style="max-height:400px;">

                    </div>
                </td>
            </tr>
        </table>
    </div>
</asp:Content>

