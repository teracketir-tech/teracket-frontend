<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Contract.aspx.cs" Inherits="Contract" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="Css/ContractReg.css" rel="stylesheet" />
    <link href="Css/jspc-gray.css" rel="stylesheet" />
    <%--<script src="js/PersianCalPublic.js" type="text/javascript"></script>--%>
    <script src="js/js-persian-cal.min.js" type="text/javascript"></script>
    <script src="js/Pages/Contract.js" type="text/javascript"></script>
    <link href="Css/font-awesome1.css" rel="stylesheet" />
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1" id="titleEditInsertContract">تدوین</a></li>
            <li><a href="#tab_2">ویرایش/تایید قرارداد</a></li>
            <li><a href="#tab_3">گزارش</a></li>
        </ul>
        <div id="tab_1">
            <div id="divPersonelContractTadvin">
                <ul>
                    <%--<li><a href="#Morakhasi_1">ثبت</a></li>--%>
                    <li><a href="#contract_1">قرارداد جدید</a></li>
                    <li><a href="#contract_2">همکاری مجدد</a></li>
                </ul>
                <div id="contract_1" style="display: none;"></div>
                <div id="contract_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right; width: 100px;">
                                    <input id="txtCodeMelliForReContract" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right; width: 100px;">
                                    <input id="txtPersonelCodeForReContract" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>

                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnSearchPersonelCodeReContract" type="button" value="جستجو" />
                                    <input id="btnCheckPersonelEndContract" type="button" value="چک پایان قرارداد" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نوع قرارداد :
                                </td>
                                <td style="text-align: right; width: 100px;" id="tddrpdwnTamdidContractkind"></td>
                                <td style="text-align: left;">گروه کاری :
                                </td>
                                <td style="text-align: right; width: 100px;" id="tddrpdwnTamdidWorkgroup"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <table id="tblContractInfo0" style="width: 100%;">
                <tr>
                    <td colspan="6">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="6">عنوان قرارداد</td>
                </tr>
                <tr>
                    <td colspan="6">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="left">کارفرما :
                    </td>
                    <td align="right" id="DivEmployer">
                        <img src='images/loading.gif' alt="" />
                    </td>
                    <td align="left">نوع قرارداد :
                    </td>
                    <td align="right" id="divdrpdwnContractKind">
                        <img src='images/loading.gif' alt="" />
                    </td>
                    <td align="left">حالت قراردادی :
                    </td>
                    <td align="right" id="divdrpdwnStateContractkind">
                        <img src='images/loading.gif' alt="" />
                    </td>
                </tr>
            </table>
            <table id="tblContractInfo1" style="width: 100%; display: none;">
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">مشخصات کارگر</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo">
                    <td align="left">سمت شغلی :</td>
                    <td align="right" id="tddrpdwnorgpositionMovaghat"></td>
                </tr>
                <tr>
                    <td align="left">شخصیت :</td>
                    <td align="right">
                        <select id="drpdwnOwner" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnOwner');" onchange="GetInfoOwner();">
                            <option value="1" selected="selected">حقیقی</option>
                            <option value="2">حقوقی</option>
                        </select>
                    </td>
                </tr>
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
                        <input id="txtMelliCode" type="text" style="width: 170px;" maxlength="10" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtMelliCode');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">شماره شناسنامه :
                    </td>

                    <td align="right">
                        <input id="txtNumberShenasname" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtNumberShenasname');" />
                    </td>
                    <td align="left">محل صدور :
                    </td>
                    <td align="right">
                        <input id="txtExportCityRef" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtExportCityRef');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">تاریخ تولد :
                    </td>

                    <td align="right">
                        <input id="pcaldateBrithdayDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateBrithdayDate');" />
                    </td>

                    <td align="left">وضعیت تاهل :
                    </td>
                    <td align="right" id="divdrpdwnMarrid">
                        <img src='images/loading.gif' alt="" />
                    </td>

                </tr>
                <tr class="hideCompany">
                    <td align="left">نام شخص حقوقی :</td>
                    <td align="right">
                        <input id="txtCompayName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtCompayName');" />
                    </td>
                    <td align="left">شماره ثبت :</td>
                    <td align="right">
                        <input id="txtShomaresabt" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtShomaresabt');" />
                    </td>
                </tr>
                <tr class="hideCompany">
                    <td align="left">نوع شخص حقوقی :</td>
                    <td align="right">
                        <select id="drpdwnCompanyKind" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnCompanyKind');">
                            <option value="-1">انتخاب کنید ...</option>
                            <option value="1">شرکت با مسئولیت محدود</option>
                            <option value="2">شرکت سهامی خاص</option>
                            <option value="3">شرکت تعاونی</option>
                            <option value="4">شرکت تضامنی</option>
                            <option value="5">شرکت سهامی عام</option>
                            <option value="6">موسسه</option>
                        </select>
                    </td>
                    <td align="left">سمت طرف قرارداد :</td>
                    <td align="right">
                        <select id="drpdwnSematInCompany" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSematInCompany');">
                            <option value="-1">انتخاب کنید ...</option>
                            <option value="1">مدیر عامل</option>
                            <option value="2">رئیس هیئت مدیره</option>
                            <option value="3">غیره</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="left">آدرس کامل پستی :
                    </td>
                    <td align="right" colspan="4">
                        <input id="txtPersonelAddress" type="text" style="width: 532px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtPersonelAddress');" />
                    </td>

                </tr>
                <tr>
                    <td align="left">کد پستی :
                    </td>
                    <td align="right">
                        <input id="txtPostCode" type="text" style="width: 170px;" maxlength="10" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtPostCode');" />
                    </td>


                    <td align="left">تلفن ثابت :
                    </td>
                    <td align="right">
                        <input id="txtTel" type="text" style="width: 117px;" maxlength="15" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTel');" />-
                                <input id="txtTel1" type="text" style="width: 39px;" maxlength="5" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTel1');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">موبایل :
                    </td>
                    <td align="right">
                        <input id="txtMobile" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMobile');" />
                    </td>
                    <td align="left">جنسیت :
                    </td>
                    <td align="right" id="divdrpdwnJensiat">
                        <img src='images/loading.gif' alt="" />
                    </td>

                </tr>
                <tr id="trChildShow" style="display: none;">
                    <td align="left">تعداد فرزند :
                    </td>
                    <td align="right">
                        <select id="drpdwnCntChild" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnCntChild');" onchange="GetHaghOladFromHoghogh();">
                            <option value="-1" selected="selected">انتخاب نمایید...</option>
                            <option value="0">ندارد</option>
                            <option value="1">1</option>
                            <option value="2">2 یا بیشتر</option>
                        </select>
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">محل انجام کار</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr>
                    <td align="left" style="width: 115px;">استان :
                    </td>
                    <td align="right" id="divdrpdwnProvince">
                        <img src='images/loading.gif' alt="" />
                    </td>

                    <td align="left">شهر :
                    </td>
                    <td align="right" id="divdrpdwnCity">
                        <img src='images/loading.gif' alt="" />
                    </td>
                </tr>
                <tr class="hideAget" style="display: none;">
                    <td align="left" style="width: 115px;">نمایندگی :
                    </td>
                    <td align="right" id="tddrpdwnAgentMovaghat">
                        <img src='images/loading.gif' alt="" />
                    </td>

                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">معرف طرف قرارداد</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr>
                    <td align="left" style="width: 115px;">معرف :
                    </td>
                    <td align="right">
                        <select id="drpdwnMoaref" class="InputSelectRightToLeftText" style="width: 176px;" onchange="GetMoarefInfo();" onfocus="ResetErrorIconInput('drpdwnMoaref');">
                            <option value="0" selected="selected">ندارد</option>
                            <option value="1">دارد</option>
                        </select>
                    </td>

                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr id="trMoaref1" style="display: none;">
                    <td align="left" style="width: 115px;">نام :
                    </td>
                    <td align="right">
                        <input id="txtMoarefName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoarefName');" />
                    </td>

                    <td align="left">نام خانوادگی :
                    </td>
                    <td align="right">
                        <input id="txtMoarefFamily" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoarefFamily');" />
                    </td>
                </tr>
                <tr id="trMoaref2" style="display: none;">
                    <td align="left" style="width: 115px;">تلفن ثابت :
                    </td>
                    <td align="right">

                        <input id="txtMoarefTel" type="text" style="width: 117px;" maxlength="15" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoarefTel');" />-
                                <input id="txtMoarefTel1" type="text" style="width: 39px;" maxlength="5" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoarefTel1');" />

                    </td>

                    <td align="left">تلفن همراه :
                    </td>
                    <td align="right">
                        <input id="txtMoarefMobile" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoarefMobile');" />
                    </td>
                </tr>
                <tr id="trMoaref3" style="display: none;">
                    <td align="left" style="width: 115px;">نسبت معرف :
                    </td>
                    <td align="right">
                        <input id="txtMoarefNesbat" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoarefNesbat');" />
                    </td>
                    <td align="left">آدرس :
                    </td>
                    <td align="right">
                        <input id="txtMoarefAddress" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtMoarefAddress');" />
                    </td>
                </tr>

                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">نوع و مدت قرارداد</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;">نوع قرارداد :
                    </td>
                    <td align="right" id="divlblContractKind"></td>

                    <td align="left">مدت قرارداد :
                    </td>
                    <td align="right">
                        <div style="float: right; width: 38%;">
                            <input id="txtContractMonth" type="text" style="width: 50px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtContractMonth');" />
                            ماه
                        </div>
                        <div style="float: right; width: 50%;">
                            <input id="txtContractDay" type="text" style="width: 50px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtContractDay');" />
                            روز
                        </div>
                    </td>
                </tr>

                <tr>
                    <td align="left" style="width: 115px;">مدت قرارداد از :
                    </td>
                    <td align="right">
                        <input id="pcaldateContractFromDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateContractFromDate');" />
                    </td>

                    <td align="left">مدت قرارداد تا :
                    </td>
                    <td align="right">
                        <input id="pcaldateContractToDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateContractToDate');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">تاریخ عدم اعتبار قرارداد :
                    </td>
                    <td align="right">
                        <input id="pcaldateContractUnValidDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateContractUnValidDate');" />
                    </td>

                    <td align="left" style="width: 115px;">دوره آزمایشی :
                    </td>
                    <td align="right">
                        <select id="drpdwnDoreAzmaieshi" class="InputSelectRightToLeftText" style="width: 176px;" onchange="GetInfoDoreAzmaieshi();" onfocus="ResetErrorIconInput('drpdwnDoreAzmaieshi');">
                            <option value="0" selected="selected">ندارد</option>
                            <option value="1">دارد</option>
                        </select>
                    </td>
                </tr>
                <tr id="trDoreAzmaieshi1" style="display: none;">
                    <td align="left" style="width: 115px;">دوره آزمایشی از :
                    </td>
                    <td align="right">
                        <input id="pcaldateDoreFromDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateDoreFromDate');" />
                    </td>

                    <td align="left">دوره آزمایشی تا :
                    </td>
                    <td align="right">
                        <input id="pcaldateCDoreToDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateCDoreToDate');" />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 metrajMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 metrajMovaghathide">
                    <td align="center" colspan="4">متراژ محل کار</td>
                </tr>
                <tr class="hideLojesticInfo1 metrajMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 metrajMovaghathide">
                    <td align="left">متراژ دفتر نمایندگی :
                    </td>
                    <td align="right">
                        <input id="txtAgantMetraj" type="text" style="width: 170px;" maxlength="10" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtAgantMetraj');" />
                        متر
                    </td>
                    <td align="left">متراژ انبار :
                    </td>
                    <td align="right">
                        <input id="txtAnbarMetraj" type="text" style="width: 170px;" maxlength="10" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtAnbarMetraj');" />
                        متر
                    </td>
                </tr>

                <tr class="hideLojesticInfo1 zemanatMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 zemanatMovaghathide">
                    <td align="center" colspan="4">ضمانت</td>
                </tr>
                <tr class="hideLojesticInfo1 zemanatMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 zemanatMovaghathide">
                    <td align="left">نوع ضمانت نامه :
                    </td>
                    <td align="right">
                        <select id="drpdwnZemanatKind" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnZemanatKind');" onchange="getInfoZemanat();" multiple="multiple" size="5">
                            <%--<option value="0" selected="selected">ندارد</option>--%>
                            <option value="1">وجه نقد</option>
                            <option value="2">چک</option>
                            <option value="3">سفته</option>
                        </select>
                    </td>
                    <td align="left" class="zemanatprice">مبلغ ضمانت وجه نقد :
                    </td>
                    <td align="right" class="zemanatprice">
                        <input id="txtPriceZemanatNameh" type="text" style="width: 170px;" maxlength="15" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtPriceZemanatNameh');" />
                        ریال
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hidezemanatcheck zemanatMovaghathide">
                    <td colspan="4">
                        <hr style="border: 1px dotted #000" />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hidezemanatcheck zemanatMovaghathide">
                    <td align="left">تعداد فقره چک :</td>
                    <td align="right">
                        <input id="txtCountZemanatcheck" type="text" style="width: 170px;" maxlength="3" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtCountZemanatcheck');" onkeyup="createZemanatInfocheck();" />
                        عدد
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr class="hideLojesticInfo1 hidezemanatcheck zemanatMovaghathide" id="trzemanatInfocheck">
                </tr>
                <tr class="hideLojesticInfo1 hidezemanat zemanatMovaghathide">
                    <td colspan="4">
                        <hr style="border: 1px dotted #000" />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hidezemanat zemanatMovaghathide">
                    <td align="left">تعداد فقره سفته :</td>
                    <td align="right">
                        <input id="txtCountZemanatSafte" type="text" style="width: 170px;" maxlength="3" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtCountZemanatSafte');" onkeyup="createZemanatInfo();" />
                        عدد
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr class="hideLojesticInfo1 hidezemanat zemanatMovaghathide" id="trzemanatInfo">
                </tr>

                <tr class="hideLojesticInfo1 hidetransporterMovaghat">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hidetransporterMovaghat">
                    <td align="center" colspan="4">مشخصات وسیله نقلیه</td>
                </tr>
                <tr class="hideLojesticInfo1 hidetransporterMovaghat">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hidetransporterMovaghat">
                    <td align="left">نوع وسیله نقلیه :
                    </td>
                    <td align="right">
                        <select id="drpdwnTransportKind" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnTransportKind');" onchange="getInfoTransport(); ">
                            <option value="0" selected="selected">ندارد</option>
                            <option value="1">موتور سیکلت</option>
                            <option value="2">خودرو</option>
                        </select>
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hideItemsMovaghatTransport">
                    <td align="left" >نام و نام خانوادگی مالک :
                    </td>
                    <td align="right">
                        <input id="txtTransporterName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTransporterName');" />
                    </td>
                    <td align="left">مدل :
                    </td>
                    <td align="right">
                        <input id="txtTransportModel" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtTransportModel');" />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hideItemsMovaghatTransport">
                    <td align="left">رنگ :
                    </td>
                    <td align="right">
                        <input id="txtTransportColor" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtTransportColor');" />
                    </td>
                    <td align="left">شماره شهربانی :
                    </td>
                    <td align="right">
                        <input id="txtTransportShahrbani" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtTransportShahrbani');" />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hideItemsMovaghatTransport">
                    <td align="left">شماره شاسی :
                    </td>
                    <td align="right">
                        <input id="txtTransportShasi" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtTransportShasi');" />
                    </td>
                    <td align="left">شماره بدنه :
                    </td>
                    <td align="right">
                        <input id="txtTransportBadaneh" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtTransportBadaneh');" />
                    </td>
                </tr>


                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">حق السعی</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr>
                    <td align="left">مزد ماهانه :
                    </td>
                    <td align="right">
                        <input id="txtHoghogheSabet" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onkeyup="GetHaghOladFromHoghogh(); GetKolDaramad();" onfocus="ResetErrorIconInput('txtHoghogheSabet');" />
                        ریال
                    </td>
                    <td align="left" style="width: 115px;">حق اولاد :
                    </td>
                    <td align="right">
                        <input id="txtHaghOlad" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtHaghOlad');" disabled="disabled" />
                        ریال
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;">کمک هزینه مسکن :
                    </td>
                    <td align="right">
                        <input id="txtHaghMaskan" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" disabled="disabled" onfocus="ResetErrorIconInput('txtHaghMaskan');" />
                        ریال
                    </td>
                    <td align="left">مزایای رفاهی و انگیزشی :
                    </td>
                    <td align="right">
                        <input id="txtBonKharbar" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" disabled="disabled" onfocus="ResetErrorIconInput('txtBonKharbar');" />
                        ریال
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;">حق سنوات :
                    </td>
                    <td align="right">
                        <input id="txtSanavat" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" disabled="disabled" onfocus="ResetErrorIconInput('txtHaghMaskan');" />
                        ریال
                    </td>
                    <td align="left" style="width: 115px;">پاداش عملکرد :
                    </td>
                    <td align="right">
                        <input id="txtPadashAmalkard" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtPadashAmalkard');" onkeyup="GetKolDaramad();" />
                        ریال
                    </td>
                </tr>
                <tr>
                    <td align="left">حق مسئولیت :
                    </td>
                    <td align="right">
                        <input id="txtHaghMasoliatSaier" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtHaghMasoliatSaier');" onkeyup="GetKolDaramad();" />
                        ریال
                    </td>
                    <td align="left">کمک ایاب و ذهاب :
                    </td>
                    <td align="right">
                        <input id="txtAyabZahab" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtAyabZahab');" onkeyup="GetKolDaramad();" />
                        ریال
                    </td>
                </tr>
                <tr>
                    <td align="left">سایر :
                    </td>
                    <td align="right">
                        <input id="txtSaier" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaier');" onkeyup="GetKolDaramad();" />
                        ریال
                    </td>
                    <td align="left">مجموع حق السعی :
                    </td>
                    <td align="right" id="tdMajmoeKol">0 ریال
                    </td>

                </tr>
                <tr class="hideLojesticInfo1 hazinehMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hazinehMovaghathide">
                    <td align="center" colspan="4">هزینه های جاری</td>
                </tr>
                <tr class="hideLojesticInfo1 hazinehMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr class="hideLojesticInfo1 hazinehMovaghathide">
                    <td align="left">هزینه های جاری :
                    </td>
                    <td align="right">
                        <select id="drpdwnpricejari" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnpricejari');" onchange="GetChangeHazineJari();">
                            <option value="0">ندارد</option>
                            <option value="1">دارد</option>
                        </select>
                    </td>
                    <td align="left" class="hidejari">اجاره :
                    </td>
                    <td align="right" class="hidejari">
                        <input id="txtjariEjareh" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtjariEjareh');" />
                        ریال

                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hazinehMovaghathide">
                    <td align="left" class="hidejari">تلفن :
                    </td>
                    <td align="right" class="hidejari">
                        <input id="txtjariTel" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtjariTel');" />
                        ریال

                    </td>
                    <td align="left" class="hidejari">اینترنت :
                    </td>
                    <td align="right" class="hidejari">
                        <input id="txtjariNet" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtjariNet');" />
                        ریال

                    </td>
                </tr>
                <tr class="hideLojesticInfo1 hazinehMovaghathide">
                    <td align="left" class="hidejari">آب/برق/گاز :
                    </td>
                    <td align="right" class="hidejari">
                        <input id="txtjariAbogaz" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtjariAbogaz');" />
                        ریال
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>

                </tr>
                <tr class="hideLojesticInfo1 porsantMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 porsantMovaghathide">
                    <td align="center" colspan="4">پورسانت</td>
                </tr>
                <tr class="hideLojesticInfo1 porsantMovaghathide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 porsantMovaghathide">
                    <td align="left">پورسانت :
                    </td>
                    <td align="right">
                        <select id="drpdwnpricePorsant" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnpricePorsant');" onchange="GetChangePorsant();">
                            <option value="0">ندارد</option>
                            <option value="1">دارد</option>
                        </select>
                    </td>
                    <td align="left" class="hideporsant">پورسانت توزیع شده :
                    </td>
                    <td align="right" class="hideporsant">
                        <input id="txtPorsantToziShode" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtPorsantToziShode');" />
                        ریال
                    </td>
                </tr>
                <tr class="hideLojesticInfo1 porsantMovaghathide">
                    <td align="left" class="hideporsant">پورسانت خارج از محدوده :
                    </td>
                    <td align="right" class="hideporsant">
                        <input id="txtPorsantKharejMahdode" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtPorsantKharejMahdode');" />
                        ریال
                    </td>
                    <td align="left" class="hideporsant">حق الزحمه پرینت معادلی :
                    </td>
                    <td align="right" class="hideporsant">
                        <input id="txtPorsantMoadeli" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtPorsantMoadeli');" />
                        ریال
                    </td>
                </tr>


                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="left"></td>
                    <td align="right"></td>
                    <td align="left"></td>
                    <td align="right">
                        <input id="btnSaveInfoContract" type="button" value="ثبت اطلاعات قرارداد موقت" />
                        <input id="btnEditInfoContract" type="button" value="بروزرسانی اطلاعات قرارداد موقت" style="display: none;" />
                        <input id="btnCancelEditInfoContract" type="button" value="انصراف" style="display: none;" />
                    </td>
                </tr>

            </table>
            <table id="tblContractInfo2" style="width: 100%; display: none;">
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">مشخصات کارگر</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati">
                    <td align="left">سمت شغلی :</td>
                    <td align="right" id="tddrpdwnorgposition"></td>
                </tr>

                <tr>
                    <td align="left">شخصیت :</td>
                    <td align="right">
                        <select id="drpdwnSaatiOwner" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSaatiOwner');" onchange="GetInfoOwnerSaati();">
                            <option value="1" selected="selected">حقیقی</option>
                            <option value="2">حقوقی</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;">نام :
                    </td>
                    <td align="right">
                        <input id="txtSaatiName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiName');" />
                    </td>
                    <td align="left">نام خانوادگی :
                    </td>
                    <td align="right">
                        <input id="txtSaatiFamily" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiFamily');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">نام پدر :
                    </td>
                    <td align="right">
                        <input id="txtSaatiFatherName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiFatherName');" />
                    </td>

                    <td align="left">کد ملی :
                    </td>
                    <td align="right">
                        <input id="txtSaatiMelliCode" type="text" style="width: 170px;" maxlength="10" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiMelliCode');" />
                    </td>

                </tr>
                <tr>
                    <td align="left">شماره شناسنامه :
                    </td>

                    <td align="right">
                        <input id="txtSaatiNumberShenasname" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiNumberShenasname');" />
                    </td>
                    <td align="left">محل صدور :
                    </td>
                    <td align="right">
                        <input id="txtSaatiExportCityRef" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiExportCityRef');" />
                    </td>
                </tr>
                <tr class="hideCompanySaati">
                    <td align="left">نام شخص حقوقی :</td>
                    <td align="right">
                        <input id="txtSaatiCompayName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiCompayName');" />
                    </td>
                    <td align="left">شماره ثبت :</td>
                    <td align="right">
                        <input id="txtSaatiShomaresabt" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiShomaresabt');" />
                    </td>
                </tr>
                <tr class="hideCompanySaati">
                    <td align="left">نوع شخص حقوقی :</td>
                    <td align="right">
                        <select id="drpdwnSaatiCompanyKind" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSaatiCompanyKind');">
                            <option value="-1">انتخاب کنید ...</option>
                            <option value="1">شرکت با مسئولیت محدود</option>
                            <option value="2">شرکت سهامی خاص</option>
                            <option value="3">شرکت تعاونی</option>
                            <option value="4">شرکت تضامنی</option>
                            <option value="5">شرکت سهامی عام</option>
                            <option value="6">موسسه</option>
                        </select>
                    </td>
                    <td align="left">سمت طرف قرارداد :</td>
                    <td align="right">
                        <select id="drpdwnSaatiSematInCompany" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSaatiSematInCompany');">
                            <option value="-1">انتخاب کنید ...</option>
                            <option value="1">مدیر عامل</option>
                            <option value="2">رئیس هیئت مدیره</option>
                            <option value="3">غیره</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="left">آدرس کامل پستی :
                    </td>
                    <td align="right" colspan="4">
                        <input id="txtSaatiPersonelAddress" type="text" style="width: 540px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiPersonelAddress');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">تلفن ثابت :
                    </td>
                    <td align="right">
                        <input id="txtSaatiTel" type="text" style="width: 117px;" maxlength="15" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiTel');" />-
                                <input id="txtSaatiTel1" type="text" style="width: 39px;" maxlength="5" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiTel1');" />
                    </td>
                    <td align="left">موبایل :
                    </td>
                    <td align="right">
                        <input id="txtSaatiMobile" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiMobile');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">جنسیت :
                    </td>
                    <td align="right" id="divSaatidrpdwnJensiat">
                        <img src='images/loading.gif' alt="" />
                    </td>
                    <td class="trPriceSaati" align="left">وضعیت تاهل :
                    </td>
                    <td class="trPriceSaati" align="right" id="divSaatidrpdwnMarrid">
                        <img src='images/loading.gif' alt="" />
                    </td>
                </tr>
                <tr id="trsaatiChildShow" style="display: none;" class="trPriceSaati">
                    <td align="left">تعداد فرزند :
                    </td>
                    <td align="right">
                        <select id="drpdwnsaatiCntChild" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnsaatiCntChild');" onchange="GetHaghOladFromHoghoghsaati();">
                            <option value="-1" selected="selected">انتخاب نمایید...</option>
                            <option value="0">ندارد</option>
                            <option value="1">1</option>
                            <option value="2">2 یا بیشتر</option>
                        </select>
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">محل انجام کار</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr>
                    <td align="left" style="width: 115px;">استان :
                    </td>
                    <td align="right" id="divdrpdwnProvinceSaati">
                        <img src='images/loading.gif' alt="" />
                    </td>

                    <td align="left">شهر :
                    </td>
                    <td align="right" id="divdrpdwnCitySaati">
                        <img src='images/loading.gif' alt="" />
                    </td>
                </tr>
                <tr class="hideAgetproject" style="display: none;">
                    <td align="left" style="width: 115px;">نمایندگی :
                    </td>
                    <td align="right" id="tddrpdwnAgentProject">
                        <img src='images/loading.gif' alt="" />
                    </td>

                    <td align="left"></td>
                    <td align="right"></td>
                </tr>

                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">موضوع قرارداد</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr>
                    <td align="left" style="width: 115px;">خدمات :
                    </td>
                    <td align="right" colspan="3">
                        <textarea id="txtSaatiKhadamat" style="width: 429px; height: 60px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiKhadamat');"></textarea>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">نوع و مدت قرارداد</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;">نوع قرارداد :
                    </td>
                    <td align="right" id="divSaatilblContractKind"></td>

                    <td align="left">مدت قرارداد :
                    </td>
                    <td align="right">
                        <div style="float: right; width: 38%;">
                            <input id="txtSaatiContractMonth" type="text" style="width: 50px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiContractMonth');" maxlength="4" />
                            ماه
                        </div>
                        <div style="float: right; width: 50%;">
                            <input id="txtSaatiContractDay" type="text" style="width: 50px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiContractDay');" maxlength="4" />
                            روز
                        </div>
                    </td>
                </tr>

                <tr>
                    <td align="left" style="width: 115px;">مدت قرارداد از :
                    </td>
                    <td align="right">
                        <input id="pcalSaatidateContractFromDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcalSaatidateContractFromDate');" />
                    </td>

                    <td align="left">مدت قرارداد تا :
                    </td>
                    <td align="right">
                        <input id="pcalSaatidateContractToDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcalSaatidateContractToDate');" />
                    </td>
                </tr>
                <tr>
                    <td align="left">تاریخ توافق قرارداد :
                    </td>
                    <td align="right">
                        <input id="pcalSaatidateContractTavafoghDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcalSaatidateContractTavafoghDate');" />
                    </td>
                    <td align="left">حداقل کارکرد :
                    </td>
                    <td align="right">
                        <input id="txtSaatiContractTime" type="text" style="width: 36px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiContractTime');" maxlength="4" />
                        <select id="drpdwnTimeForMonth" class="InputSelectRightToLeftText" style="width: 57px;" onfocus="ResetErrorIconInput('drpdwnTimeForMonth');">
                            <option value="1">ساعت</option>
                            <option value="2" selected="selected">روز</option>
                        </select>
                        در
                          <select id="drpdwnWeekForMonth" class="InputSelectRightToLeftText" style="width: 57px;" onfocus="ResetErrorIconInput('drpdwnWeekForMonth');">
                              <option value="1">هفته</option>
                              <option value="2" selected="selected">ماه</option>
                          </select>
                    </td>
                </tr>

                <tr class="hideLojesticInfoSaati1 metrajprojecthide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 metrajprojecthide">
                    <td align="center" colspan="4">متراژ محل کار</td>
                </tr>
                <tr class="hideLojesticInfoSaati1 metrajprojecthide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 metrajprojecthide">
                    <td align="left">متراژ دفتر نمایندگی :
                    </td>
                    <td align="right">
                        <input id="txtSaatiAgantMetraj" type="text" style="width: 170px;" maxlength="10" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiAgantMetraj');" />
                        متر
                    </td>
                    <td align="left">متراژ انبار :
                    </td>
                    <td align="right">
                        <input id="txtSaatiAnbarMetraj" type="text" style="width: 170px;" maxlength="10" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiAnbarMetraj');" />
                        متر
                    </td>
                </tr>

                <tr class="hideLojesticInfoSaati1 zemanatprojecthide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 zemanatprojecthide">
                    <td align="center" colspan="4">ضمانت</td>
                </tr>
                <tr class="hideLojesticInfoSaati1 zemanatprojecthide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 zemanatprojecthide">
                    <td align="left">نوع ضمانت نامه :
                    </td>
                    <td align="right">
                        <select id="drpdwnSaatiZemanatKind" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSaatiZemanatKind');" onchange="getInfoZemanatSaati(); " multiple="multiple" size="5">
                            <%--  <option value="0" selected="selected">ندارد</option>--%>
                            <option value="1">وجه نقد</option>
                            <option value="2">چک</option>
                            <option value="3">سفته</option>
                        </select>
                    </td>
                    <td align="left" class="zemanatpriceSaati">مبلغ ضمانت وجه نقد :
                    </td>
                    <td align="right" class="zemanatpriceSaati">
                        <input id="txtSaatiPriceZemanatNameh" type="text" style="width: 170px;" maxlength="15" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiPriceZemanatNameh');" />
                        ریال
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidezemanatcheckSaati">
                    <td colspan="4">
                        <hr style="border: 1px dotted #000" />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidezemanatcheckSaati zemanatprojecthide">
                    <td align="left">تعداد فقره چک :</td>
                    <td align="right">
                        <input id="txtSaatiCountZemanatcheck" type="text" style="width: 170px;" maxlength="3" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiCountZemanatcheck');" onkeyup="createZemanatInfocheckSaati();" />
                        عدد
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidezemanatcheckSaati zemanatprojecthide" id="trzemanatInfocheckSaati">
                </tr>
                <tr class="hideLojesticInfoSaati1 hidezemanatSaati zemanatprojecthide">
                    <td colspan="4">
                        <hr style="border: 1px dotted #000" />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidezemanatSaati zemanatprojecthide">
                    <td align="left">تعداد فقره سفته :</td>
                    <td align="right">
                        <input id="txtSaatiCountZemanatSafte" type="text" style="width: 170px;" maxlength="3" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiCountZemanatSafte');" onkeyup="createZemanatInfoSaati();" />
                        عدد
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidezemanatSaati zemanatprojecthide" id="trzemanatInfoSaati">
                </tr>


                <tr class="hideLojesticInfoSaati1 hidetransporter">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidetransporter">
                    <td align="center" colspan="4">مشخصات وسیله نقلیه</td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidetransporter">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hidetransporter">
                    <td align="left">نوع وسیله نقلیه :
                    </td>
                    <td align="right">
                        <select id="drpdwnSaatiTransportKind" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSaatiTransportKind');" onchange="getInfoTransportSaati(); ">
                            <option value="0" selected="selected">ندارد</option>
                            <option value="1">موتور سیکلت</option>
                            <option value="2">خودرو</option>
                        </select>
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hideItemsTransport">
                    <td align="left" >نام و نام خانوادگی مالک :
                    </td>
                    <td align="right">
                        <input id="txtSaatiTransporterName" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiTransporterName');" />
                    </td>
                    <td align="left">مدل :
                    </td>
                    <td align="right">
                        <input id="txtSaatiTransportModel" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiTransportModel');" />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hideItemsTransport">
                    <td align="left">رنگ :
                    </td>
                    <td align="right">
                        <input id="txtSaatiTransportColor" type="text" style="width: 170px;" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiTransportColor');" />
                    </td>
                    <td align="left">شماره شهربانی :
                    </td>
                    <td align="right">
                        <input id="txtSaatiTransportShahrbani" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiTransportShahrbani');" />
                    </td>
                </tr>
                <tr class="hideLojesticInfoSaati1 hideItemsTransport">
                    <td align="left">شماره شاسی :
                    </td>
                    <td align="right">
                        <input id="txtSaatiTransportShasi" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiTransportShasi');" />
                    </td>
                    <td align="left">شماره بدنه :
                    </td>
                    <td align="right">
                        <input id="txtSaatiTransportBadaneh" type="text" style="width: 170px;" class="InputTextLeftToRightText" onfocus="ResetErrorIconInput('txtSaatiTransportBadaneh');" />
                    </td>
                </tr>

                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="center" colspan="4">حق السعی</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr style="display: none;">
                    <td align="left" style="width: 164px;">مبنای محاسبه بر حسب حقوق پایه  :
                    </td>
                    <td align="right" id="tdSalaryMainsaati">0 ریال
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>
                </tr>
                <tr class="trPriceSaati" style="display: none;">
                    <td align="left" style="width: 164px;">مزد ساعتی با احتساب تعطیلات هفتگی  :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceSalary" type="text" style="width: 100px;"  class="InputTextLeftToRightText setcamma" />
                        ریال
                        به ازای هر ساعت
                    </td>

                    <td align="left">كمك هزينه مسکن :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceHomeSalary" type="text" style="width: 100px;" disabled="disabled" class="InputTextLeftToRightText setcamma" />
                        ریال
                        به ازای هر ساعت
                    </td>
                </tr>
                <tr class="trPriceSaati" style="display: none;">
                    <td align="left">مزایای رفاهی و انگیزشی :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceBon" type="text" style="width: 100px;" class="InputTextLeftToRightText setcamma" disabled="disabled" />
                        ریال
                        به ازای هر ساعت
                    </td>

                    <td align="left">حق اولاد  :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceChildSalary" type="text" style="width: 100px;" class="InputTextLeftToRightText setcamma" disabled="disabled" />
                        ریال
                        به ازای هر ساعت
                    </td>
                </tr>
                <tr class="trPriceSaati" style="display: none;">
                    <td align="left">حق سنوات :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceSanavat" type="text" style="width: 100px;" class="InputTextLeftToRightText setcamma" disabled="disabled" />
                        ریال
                        به ازای هر ساعت
                    </td>

                    <td align="left">حق عیدی و پاداش :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceEydi" type="text" style="width: 100px;" class="InputTextLeftToRightText setcamma" disabled="disabled" />
                        ریال 
                        به ازای هر ساعت
                    </td>
                </tr>
                <tr class="trPriceSaati" style="display: none;">
                    <td align="left">مزد مرخصی بابت هر یک ساعت کار  :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceMorakhasi" type="text" style="width: 100px;" class="InputTextLeftToRightText setcamma" disabled="disabled" />
                        ریال
                        به ازای هر ساعت
                    </td>

                    <td align="left">پاداش عملکرد :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceContract2" type="text" onkeyup="GetKolDaramadsaati();" style="width: 100px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiPriceContract2');" />
                        ریال
                        به ازای هر ساعت
                    </td>
                </tr>
                <tr class="trPriceSaati" style="display: none;">
                    <td align="left">مجموع حق السعی :
                    </td>
                    <td align="right"><span id="tdMajmoeKolsaati">0</span><span>&nbsp;ریال به ازای هر ساعت</span></td>

                    <td align="left">کمک ایاب و ذهاب :
                    </td>
                    <td align="right">
                        <input id="txtSaatiAyabZahab" type="text" style="width: 100px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiAyabZahab');" />
                        ریال
                    </td>


                </tr>
                <%-- <tr id="trPriceproject1" style="display: none;">
                    <td align="left">حق مسئولیت :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceHaghMasoliat" type="text" style="width: 100px;" class="InputTextRightToLeftText setcamma" onfocus="ResetErrorIconInput('txtSaatiPriceHaghMasoliat');" />
                        ریال
                    </td>
                    <td align="left" style="width: 115px;"></td>
                    <td align="right">
                       
                    </td>
                </tr>--%>
                <tr id="trPriceproject" style="display: none;">
                    <td align="left">مبلغ قرارداد :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceContract" type="text" style="width: 100px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiPriceContract');" />
                        ریال
                        در پایان
                           <select id="drpdwnSaatiPriceEndKind" class="InputSelectRightToLeftText" style="width: 65px;" onfocus="ResetErrorIconInput('drpdwnSaatiPriceEndKind');">
                               <option value="1" selected="selected">هر روز</option>
                               <option value="2">هر هفته</option>
                               <option value="3">هر ماه</option>
                               <option value="4">پروژه</option>
                           </select>
                    </td>
                    <td align="left">حق مسئولیت :
                    </td>
                    <td align="right">
                        <input id="txtSaatiPriceHaghMasoliat" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiPriceHaghMasoliat');" />
                        ریال
                    </td>
                    <%--  <td align="left" style="width: 115px;">حق الزحمه فرآیند :</td>
                    <td align="right">
                        <select id="drpdwnSaatiPricePadashAvilable" class="InputSelectRightToLeftText" style="width: 65px;" onfocus="ResetErrorIconInput('drpdwnSaatiPricePadashAvilable');" onchange="GetChangePadashSaati();">
                            <option value="0" selected="selected">ندارد</option>
                            <option value="1">دارد</option>
                        </select>
                    </td>--%>
                </tr>
                <tr id="trPriceproject1" style="display: none;">
                    <td align="left">پاداش عملکرد :</td>
                    <td align="right">
                        <input id="txtProjectPadashAmalkard" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtProjectPadashAmalkard');" />
                        ریال
                    </td>

                    <td align="left">کمک ایاب و ذهاب :
                    </td>
                    <td align="right">
                        <input id="txtProjectAyabZahab" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtProjectAyabZahab');" />
                        ریال
                    </td>

                </tr>
                <%-- <tr id="trPadashSaati" style="display: none;">
                    <td align="left" style="width: 115px;">عنوان فرآیند :</td>
                    <td align="right">
                        <input id="txtSaatiTitlePadashContract" type="text" style="width: 222px;" value="0" class="InputTextRightToLeftText" onfocus="ResetErrorIconInput('txtSaatiTitlePadashContract');" />
                    </td>
                    <td align="left" style="width: 115px;">حق الزحمه فرآیند :</td>
                    <td align="right">
                        <input id="txtSaatiPricePadashContract" type="text" style="width: 170px;" value="0" class="InputTextRightToLeftText setcamma" onfocus="ResetErrorIconInput('txtSaatiPricePadashContract');" />
                        ریال
                    </td>
                </tr>--%>
                <tr class="trPriceproject1 hazinehprojecthide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr class="trPriceproject1 hazinehprojecthide">
                    <td align="left">هزینه های جاری :
                    </td>
                    <td align="right">
                        <select id="drpdwnSaatipricejari" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSaatipricejari');" onchange="GetChangeSaatiHazineJari();">
                            <option value="0">ندارد</option>
                            <option value="1">دارد</option>
                        </select>
                    </td>
                    <td align="left" class="hidejariSaati">اجاره :
                    </td>
                    <td align="right" class="hidejariSaati">
                        <input id="txtSaatijariEjareh" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatijariEjareh');" />
                        ریال
                    </td>
                </tr>
                <tr class="trPriceproject1 hazinehprojecthide">
                    <td align="left" class="hidejariSaati">تلفن :
                    </td>
                    <td align="right" class="hidejariSaati">
                        <input id="txtSaatijariTel" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatijariTel');" />
                        ریال
                    </td>
                    <td align="left" class="hidejariSaati">اینترنت :
                    </td>
                    <td align="right" class="hidejariSaati">
                        <input id="txtSaatijariNet" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatijariNet');" />
                        ریال
                    </td>
                </tr>
                <tr class="trPriceproject1 hazinehprojecthide">
                    <td align="left" class="hidejariSaati">آب/برق/گاز :
                    </td>
                    <td align="right" class="hidejariSaati">
                        <input id="txtSaatijariAbogaz" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatijariAbogaz');" />
                        ریال
                    </td>
                    <td align="left"></td>
                    <td align="right"></td>

                </tr>
                <tr class="trPriceproject1 porsantprojecthide">
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>
                <tr class="trPriceproject1 porsantprojecthide">
                    <td align="left">پورسانت :
                    </td>
                    <td align="right">
                        <select id="drpdwnSaatipricePorsant" class="InputSelectRightToLeftText" style="width: 176px;" onfocus="ResetErrorIconInput('drpdwnSaatipricePorsant');" onchange="GetChangeSaatiPorsant();">
                            <option value="0">ندارد</option>
                            <option value="1">دارد</option>
                        </select>
                    </td>
                    <td align="left" class="hideporsantSaati">پورسانت توزیع شده :
                    </td>
                    <td align="right" class="hideporsantSaati">
                        <input id="txtSaatiPorsantToziShode" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiPorsantToziShode');" />
                        ریال
                    </td>
                </tr>
                <tr class="trPriceproject1 porsantprojecthide">
                    <td align="left" class="hideporsantSaati">پورسانت خارج از محدوده :
                    </td>
                    <td align="right" class="hideporsantSaati">
                        <input id="txtSaatiPorsantKharejMahdode" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiPorsantKharejMahdode');" />
                        ریال
                    </td>
                    <td align="left" class="hideporsantSaati">حق الزحمه پرینت معادلی :
                    </td>
                    <td align="right" class="hideporsantSaati">
                        <input id="txtSaatiPorsantMoadeli" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onfocus="ResetErrorIconInput('txtSaatiPorsantMoadeli');" />
                        ریال
                    </td>
                </tr>
                <tr >
                    <td colspan="4">
                        <hr />
                    </td>
                </tr>

                <tr>
                    <td align="left"></td>
                    <td align="right"></td>
                    <td align="left"></td>
                    <td align="right">
                        <input id="btnSaatiSaveInfoContract" type="button" value="ثبت اطلاعات قرارداد ساعتی" />
                        <input id="btnProjectSaveInfoContract" type="button" value="ثبت اطلاعات قرارداد پیمانکاری" />
                        <input id="btnSaatiEditInfoContract" type="button" value="بروزرسانی قرارداد ساعتی" style="display: none; width: 125px;" />
                        <input id="btnSaatiCancelEditInfoContract" type="button" value="انصراف" style="display: none; width: 105px;" />
                        <input id="btnProjectEditInfoContract" type="button" value="بروزرسانی قرارداد پیمانکاری" style="display: none; width: 125px;" />
                        <input id="btnProjectCancelEditInfoContract" type="button" value="انصراف" style="display: none; width: 105px;" />
                    </td>
                </tr>

            </table>

            <div id="DivResultCheckContractEnd" style="padding: 10px 0; display: none;"></div>
            <div id="DivExcelCheckContractEnd" style="padding: 10px 0; display: none;">
                <input id="btnReContractEndAction" type="button" value="کپی از قرارداد فعلی و همکاری مجدد" />
                <input id="btnExcelContractEnd" type="button" value="خروجی اکسل" />
            </div>

            <div id="panelRecontractNew" style="display: none;">
                <table id="tblRecontractMovaghat" style="width: 100%; direction: rtl;">
                    <tr>
                        <td colspan="4">
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan="4">نوع و مدت قرارداد موقت</td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <hr />
                        </td>
                    </tr>
                    <tr>

                        <td align="right" colspan="2">
                            <div style="float: right; width: 18%; padding-right: 31px; padding-left: 5px; text-align: left;">
                                مدت قرارداد :
                            </div>
                            <div style="float: right; width: 18%;">
                                <input id="txtContractMonthNewFrmOld" type="text" style="width: 50px;" class="InputTextRightToLeftText" />
                                ماه
                            </div>
                            <div style="float: right; width: 50%;">
                                <input id="txtContractDayNewFrmOld" type="text" style="width: 50px;" class="InputTextRightToLeftText" />
                                روز
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" style="width: 115px;">مدت قرارداد از :
                        </td>
                        <td align="right">
                            <input id="pcaldateContractFromDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">مدت قرارداد تا :
                        </td>
                        <td align="right">
                            <input id="pcaldateContractToDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">تاریخ عدم اعتبار قرارداد :
                        </td>
                        <td align="right">
                            <input id="pcaldateContractUnValidDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">مبلغ قرارداد بر حسب :
                        </td>
                        <td align="right">
                            <select id="drpdwnGetPriceMain" class="InputSelectRightToLeftText" style="width: 175px;">
                                <option value="-1" selected="selected">انتخاب کنید...</option>
                                <option value="2">آخرین قرارداد</option>
                                <option value="1">سال مالی جاری</option>
                            </select>
                        </td>
                    </tr>
                </table>

                <br />
                <table id="tblRecontractSaati" style="width: 100%; direction: rtl;">
                    <tr>
                        <td colspan="4">
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan="4">نوع و مدت قرارداد ساعتی</td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">مدت قرارداد :
                        </td>
                        <td align="right">
                            <div style="float: right; width: 23%;">
                                <input id="txtSaatiContractMonthNewFrmOld" type="text" style="width: 50px;" class="InputTextRightToLeftText" maxlength="4" />
                                ماه
                            </div>
                            <div style="float: right; width: 50%;">
                                <input id="txtSaatiContractDayNewFrmOld" type="text" style="width: 50px;" class="InputTextRightToLeftText" maxlength="4" />
                                روز
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" style="width: 115px;">مدت قرارداد از :
                        </td>
                        <td align="right">
                            <input id="pcalSaatidateContractFromDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">مدت قرارداد تا :
                        </td>
                        <td align="right">
                            <input id="pcalSaatidateContractToDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">تاریخ توافق قرارداد :
                        </td>
                        <td align="right">
                            <input id="pcalSaatidateContractTavafoghDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">حداقل کارکرد :
                        </td>
                        <td align="right">
                            <input id="txtSaatiContractTimeNewFrmOld" type="text" style="width: 36px;" class="InputTextRightToLeftText" maxlength="4" />
                            <select id="drpdwnTimeForMonthNewFrmOld" class="InputSelectRightToLeftText" style="width: 57px;">
                                <option value="1">ساعت</option>
                                <option value="2" selected="selected">روز</option>
                            </select>
                            در
                          <select id="drpdwnWeekForMonthNewFrmOld" class="InputSelectRightToLeftText" style="width: 57px;">
                              <option value="1">هفته</option>
                              <option value="2" selected="selected">ماه</option>
                          </select>
                        </td>
                    </tr>
                </table>

                <br />
                <table id="tblRecontractProjei" style="width: 100%; direction: rtl;">
                    <tr>
                        <td colspan="4">
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan="4">نوع و مدت قرارداد پیمانکاری</td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">مدت قرارداد :
                        </td>
                        <td align="right">
                            <div style="float: right; width: 23%;">
                                <input id="txtProjeiContractMonthNewFrmOld" type="text" style="width: 50px;" class="InputTextRightToLeftText" maxlength="4" />
                                ماه
                            </div>
                            <div style="float: right; width: 50%;">
                                <input id="txtProjeiContractDayNewFrmOld" type="text" style="width: 50px;" class="InputTextRightToLeftText" maxlength="4" />
                                روز
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" style="width: 115px;">مدت قرارداد از :
                        </td>
                        <td align="right">
                            <input id="pcalProjeidateContractFromDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">مدت قرارداد تا :
                        </td>
                        <td align="right">
                            <input id="pcalProjeidateContractToDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">تاریخ توافق قرارداد :
                        </td>
                        <td align="right">
                            <input id="pcalProjeidateContractTavafoghDateNewFrmOld" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left">حداقل کارکرد :
                        </td>
                        <td align="right">
                            <input id="txtProjeiContractTimeNewFrmOld" type="text" style="width: 36px;" class="InputTextRightToLeftText" maxlength="4" />
                            <select id="drpdwnProjeiTimeForMonthNewFrmOld" class="InputSelectRightToLeftText" style="width: 57px;">
                                <option value="1">ساعت</option>
                                <option value="2" selected="selected">روز</option>
                            </select>
                            در
                          <select id="drpdwnProjeiWeekForMonthNewFrmOld" class="InputSelectRightToLeftText" style="width: 57px;">
                              <option value="1">هفته</option>
                              <option value="2" selected="selected">ماه</option>
                          </select>
                        </td>
                    </tr>
                </table>
            </div>

        </div>
        <div id="tab_2">
            <div id="EditdivPersonelTabs">
                <ul>
                    <li><a href="#edittab_1">قراردادهای تایید نشده</a></li>
                    <li><a href="#edittab_2">موزعین جدید فاقد قرارداد</a></li>
                </ul>
                <div id="edittab_1">

                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>

                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportPersonelNameContract" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>

                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportPersonelMelliCodeContract" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کارفرما :
                                </td>
                                <td style="text-align: right;" id="tddrpdwnSearchEmployerContract"></td>
                                <td style="text-align: left;">نوع قرارداد :
                                </td>
                                <td style="text-align: right;" id="tddrpdwnSearchContractKindContract"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">حالت قرارداد :</td>
                                <td style="text-align: right;" id="tddrpdwnSearchContractStateContract"></td>
                                <td></td>
                                <td style="text-align: right;">
                                    <input id="btnReportPersonelSearchContract" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، تاریخ ثبت می باشد</div>
                    <div id="ResultDivPersonelContract" style="display: none; padding: 10px 0;"></div>
                </div>
                <div id="edittab_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>

                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtPeikPersonelNameContract" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>

                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtPeikPersonelMelliCodeContract" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نمایندگی :
                                </td>
                                <td style="text-align: right;" id="tddrpdwnNamaiandegi"></td>
                                <td style="text-align: left;">نوع قرارداد :</td>
                                <td style="text-align: right;">
                                    <select id="drpdownContractKindStatus" class="InputSelectRightToLeftText" style="width: 154px;">
                                        <option value="-1" selected="selected">انتخاب نمایید ...</option>
                                        <option value="1">پورسانتی</option>
                                        <option value="2">حقوق بگیر</option>
                                        <option value="3">پورسانتی و حقوق بگیر</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style="text-align: right;">
                                    <input id="btnPeikPersonelSearchContract" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، تاریخ ثبت می باشد</div>
                    <div id="ResultDivPeikPersonelContract" style="display: none; padding: 10px 0;"></div>
                </div>
            </div>
        </div>
        <div id="tab_3">
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

                        <td style="text-align: left;">کارفرما :
                        </td>
                        <td style="text-align: right;" id="tddrpdwnSearchEmployer"></td>

                    </tr>
                    <tr>
                        <td style="text-align: left;">نوع قرارداد :
                        </td>
                        <td style="text-align: right;" id="tddrpdwnSearchContractKind"></td>
                        <td style="text-align: left;">حالت قرارداد :</td>
                        <td style="text-align: right;" id="tddrpdwnSearchContractState"></td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">وضعیت :
                        </td>
                        <td style="text-align: right;">
                            <select id="drpdwnRptStatusPersonel" class="InputSelectRightToLeftText" style="width: 154px;">
                                <option value="-1" selected="selected">همه وضعیت ها</option>
                                <option value="1">نیمه فعال</option>
                                <option value="2">فعال</option>
                                <option value="3">قطع همکاری</option>
                                <option value="-2">قرارداد غیر فعال</option>
                                <option value="4">معلق</option>
                            </select>
                        </td>
                        <td style="text-align: left;">گروه کاری :</td>
                        <td style="text-align: right;" id="tddrpdwnWorkGroupPersonelContract"></td>
                    </tr>
                    <tr>
                        <td style="text-align: left;"></td>
                        <td style="text-align: right;"></td>
                        <td></td>
                        <td style="text-align: right;">
                            <input id="btnReportPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                        </td>
                    </tr>
                </table>
            </div>
            <div align="right">* مرتب سازی براساس ، تاریخ شروع قرارداد می باشد</div>

            <div id="ResultDivPersonel" style="display: none; padding: 10px 0;"></div>
        </div>
    </div>
</asp:Content>

