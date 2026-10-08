<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="PersonelWorkGroup.aspx.cs" Inherits="PersonelWorkGroup" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="Css/ContractReg.css" rel="stylesheet" />
    <link href="Css/jspc-gray.css" rel="stylesheet" />
    <script src="js/js-persian-cal.min.js" type="text/javascript" ></script>
    <script src="js/Pages/PersonelWorkGroup.js" type="text/javascript"></script>
    <link href="Css/font-awesome1.css" rel="stylesheet" />
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>

    <div id="tab_1">
        <div id="divPersonelWorkGroup">
            <ul>
                <li><a href="#workgroup_1">گروه کاری جدید</a></li>
                <li><a href="#workgroup_2">بخش گروه کاری</a></li>
                <li><a href="#workgroup_3">قسمت گروه کاری</a></li>
                <li><a href="#workgroup_4">عنوان گروه کاری</a></li>
                <%--<li><a href="#workgroup_5">سمت گروه کاری</a></li>--%>
                <li><a href="#workgroup_5">اختصاص گروه کاری ها</a></li>
                <li><a href="#workgroup_6">گزارش گروه کاری ها</a></li>
            </ul>
            <div id="workgroup_1">
                <div class="InputSearchBox">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left;">نام گروه کاری :
                            </td>
                            <td style="text-align: right; width: 100px;">
                                <input id="txtNameGroupCodeNew" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>

                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveNewWorkGroupCode" type="button" style="width: 148px;" value="ثبت گروه کاری" />
                            </td>
                        </tr>
                    </table>
                </div>

                <div id="ResultDivGroupCodeNew" style="padding: 10px 0;"></div>

                <div id="pnlEditWorkgroupCode" style="display: none;">
                    <div id="DivEditworkGroupCodeHide" style="display: none;"></div>
                    <table style="width: 100%; direction: rtl;">
                        <tr>
                            <td style="text-align: left;">نام گروه کاری :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtNameGroupCodeNewEdit" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div id="workgroup_2">
                <div class="InputSearchBox">
                    <table style="width: 100%;">
                        <tr>

                            <td style="text-align: left;">گروه کاری :
                            </td>
                            <td style="text-align: right; width: 100px;" id="DivdrpdwnGroupCode"></td>

                            <td style="text-align: left;">نام بخش گروه کاری :
                            </td>
                            <td style="text-align: right; width: 100px;">
                                <input id="txtNameBakhshGroupCodeNew" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>

                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveBakhshNewWorkGroupCode" type="button" style="width: 148px;" value="ثبت بخش گروه کاری" />
                            </td>
                        </tr>


                    </table>
                </div>

                <div id="ResultDivBakhshGroupCodeNew" style="padding: 10px 0;"></div>

                <div id="pnlEditBakhshWorkgroupCode" style="display: none;">
                    <div id="DivEditBakhshworkGroupCodeHide" style="display: none;"></div>
                    <table style="width: 100%; direction: rtl;">
                        <tr>
                            <td style="text-align: left;">گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnBakhshGroupCode"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">نام بخش گروه کاری :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtNameBakhshGroupCodeNewEdit" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div id="workgroup_3">
                <div class="InputSearchBox">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left; width: 100px;">گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnGhesmatGroupCode"></td>

                            <td style="text-align: left; width: 100px">بخش گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnGhesmatGroupCodeBakhsh"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left; width: 100px;">نام قسمت گروه کاری :</td>
                            <td style="text-align: right;">
                                <input id="txtNameGhesmatGroupCodeNew" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveGhesmatNewWorkGroupCode" type="button" style="width: 148px;" value="ثبت قسمت گروه کاری" />
                            </td>
                        </tr>
                    </table>
                </div>

                <div id="ResultDivGhesmatGroupCodeNew" style="padding: 10px 0;"></div>

                <div id="pnlEditGhesmatWorkgroupCode" style="display: none;">
                    <div id="DivEditGhesmatworkGroupCodeHide" style="display: none;"></div>
                    <table style="width: 100%; direction: rtl;">
                        <tr>
                            <td style="text-align: left;">گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnGhesmatGroupCodeEdit"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">بخش گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnGhesmatGroupCodeBakhshEdit"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">نام قسمت گروه کاری :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtNamGhesmatGroupCodeNewEdit" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>
                        </tr>
                    </table>
                </div>

            </div>
            <div id="workgroup_4">
                <div class="InputSearchBox">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left; width: 100px;">گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnOnvanGroupCode"></td>

                            <td style="text-align: left; width: 100px">بخش گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnOnvanGroupCodeBakhsh"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left; width: 100px;">قسمت گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnOnvanGroupCodeGhesmat"></td>

                            <td style="text-align: left; width: 100px">نام عنوان گروه کاری :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtNameOnvanGroupCodeNew" type="text" style="width: 148px;" class="InputTextRightToLeftText" />

                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; width: 100px;"></td>
                            <td style="text-align: right;"></td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveOnvanNewWorkGroupCode" type="button" style="width: 148px;" value="ثبت عنوان گروه کاری" />
                            </td>
                        </tr>
                    </table>
                </div>

                <div id="ResultDivOnvanGroupCodeNew" style="padding: 10px 0;"></div>

                <div id="pnlEditOnvanWorkgroupCode" style="display: none;">
                    <div id="DivEditOnvanworkGroupCodeHide" style="display: none;"></div>
                    <table style="width: 100%; direction: rtl;">
                        <tr>
                            <td style="text-align: left;">گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnOnvanGroupCodeEdit"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">بخش گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnOnvanGroupCodeBakhshEdit"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">قسمت گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnOnvanGroupCodeGhesmatEdit"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">نام عنوان گروه کاری :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtNamOnvanGroupCodeNewEdit" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <%--<div id="workgroup_5">
                <div class="InputSearchBox">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left; width: 100px;">گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnSematGroupCode"></td>

                            <td style="text-align: left; width: 100px">بخش گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnSematGroupCodeBakhsh"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left; width: 100px;">قسمت گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnSematGroupCodeGhesmat"></td>

                            <td style="text-align: left; width: 100px">عنوان گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnSematGroupCodeOnvan"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left; width: 100px;">نام سمت گروه کاری :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtNameSematGroupCodeNew" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>
                            <td style="text-align: left; width: 100px"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveSematNewWorkGroupCode" type="button" style="width: 148px;" value="ثبت سمت گروه کاری" />
                            </td>
                        </tr>

                    </table>
                </div>

                <div id="ResultDivSematGroupCodeNew" style="padding: 10px 0;"></div>

                <div id="pnlEditSematWorkgroupCode" style="display: none;">
                    <div id="DivEditSematworkGroupCodeHide" style="display: none;"></div>
                    <table style="width: 100%; direction: rtl;">
                        <tr>
                            <td style="text-align: left;">گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnSematGroupCodeEdit"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">بخش گروه کاری :
                            </td>
                            <td style="text-align: right;" id="DivdrpdwnSematGroupCodeBakhshEdit"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">نام قسمت گروه کاری :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtNamSematGroupCodeNewEdit" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                            </td>
                        </tr>
                    </table>
                </div>

            </div>--%>
            <div id="workgroup_5">
                <div class="InputSearchBox">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left;">کد پرسنلی :
                            </td>
                            <td style="text-align: right; width: 100px;">
                                <input id="txtPersonelCodeForWorkGroup" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                            </td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSearchPersonelCodeWorkGroupCode" type="button" style="width: 160px;" value="اختصاص گروه کاری انفرادی" />
                                <div style="margin: 5px 0; clear: both;"></div>
                                <input id="btnSearchPersonelCodeWorkGroupCodeAll" type="button" style="width: 160px;" value="اختصاص گروه کاری دسته جمعی" />
                            </td>

                        </tr>
                    </table>
                </div>

                <div id="ResultDivGroupCodePersonelInfo" style="padding: 10px 0;"></div>

            </div>
            <div id="workgroup_6">
                  <div class="InputSearchBox">
                <table style="width: 100%;">
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

                        <td style="text-align: left;">نوع قرارداد :
                        </td>
                        <td style="text-align: right;" id="tddrpdwnSearchContractKind"></td>

                    </tr>
                    <tr>
                        <td style="text-align: left;">گروه کاری :
                        </td>
                        <td style="text-align: right;" id="DivdrpdwnWorkGroupPersonelContract"></td>
                        <td style="text-align: left;">بخش گروه کاری :</td>
                        <td style="text-align: right;"  id="DivdrpdwnWorkGroupPersonelContractBakhsh">
                           
                        </td>
                    </tr>
                           <tr>
                        <td style="text-align: left;">قسمت گروه کاری :
                        </td>
                        <td style="text-align: right;" id="DivdrpdwnWorkGroupPersonelContractGhesmat"></td>
                        <td style="text-align: left;">عنوان گروه کاری :</td>
                        <td style="text-align: right;"  id="DivdrpdwnWorkGroupPersonelContractOnvan">
                           
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;"> تعداد نمایش :
                        </td>
                        <td style="text-align: right;">
                            <select id="drpdwnShowRow" class="InputSelectRightToLeftText" style="width:155px;">
                                <option value="-1" >همه سطرها</option>
                                <option value="50" selected="selected">50</option>
                                <option value="100" >100</option>
                                <option value="200" >200</option>
                                <option value="500" >500</option>
                            </select>
                        </td>
                        
                        <td></td>
                        <td style="text-align: right;">
                            <input id="btnReportWorkGroupPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                        </td>
                    </tr>
                </table>
            </div>
            <div align="right">* مرتب سازی براساس ، کد پرسنلی می باشد</div>

            <div id="ResultDivPersonelWorkGroup" style="display: none; padding: 10px 0;"></div>
            </div>
        </div>
    </div>

</asp:Content>

