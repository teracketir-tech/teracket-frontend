<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="EndYears.aspx.cs" Inherits="EndYears" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="js/Pages/EndYears.js" type="text/javascript"></script>
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1">تسویه حساب عیدی</a></li>
            <li><a href="#tab_2">بازخرید مانده مرخصی</a></li>
        </ul>
        <div id="tab_1">
            <div class="InputSearchBox">
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: left;">کد پرسنلی :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPricePersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>
                        <td style="text-align: left;">نام کارمند :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPricePersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">کد ملی :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPricePersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>
                        <td style="text-align: left;">گروه کاری :</td>
                        <td style="text-align: right;" id="tddrpdwnWorkReportPriceJobKind"></td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">نوع قرارداد :</td>
                        <td style="text-align: right;" id="divdrpdwnContractKind"></td>
                        <td style="text-align: left;">تعداد نمایش :</td>
                        <td style="text-align: right;">
                            <select id="drpdwnShowRow" class="InputSelectRightToLeftText" style="width:155px;">
                                <option value="-1" selected="selected">همه سطرها</option>
                                <option value="50" >50</option>
                                <option value="100" >100</option>
                                <option value="200" >200</option>
                                <option value="500" >500</option>
                            </select>
                        </td>
                    </tr>
                      <tr>
                        <td style="text-align: left;">سال :</td>
                        <td style="text-align: right;" >
                            <asp:Label runat="server" ID="lblDateEidi"></asp:Label>
                        </td>
                        <td style="text-align: left;">واریز :</td>
                        <td style="text-align: right;">
                            <select id="drpdwnvarizLevel" class="InputSelectRightToLeftText" style="width:155px;">
                                <option value="1">به صورت کامل</option>
                                <option value="2">دو مرحله ای</option>
                                <option value="3">سه مرحله ای</option>
                                <option value="4">چهار مرحله ای</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;" colspan="2">
                            <input id="btnPersonelPreInvoiceSearch" type="button" style="width: 125px; display: none;" value="مشاهده آخرین بررسی" />
                            <input id="btnPersonelGetAllInvoiceSearch" type="button" style="width: 114px;" value="سابقه محاسبات عیدی" />
                        </td>
                        <td style="text-align: left;" colspan="2">
                            <input id="btnReportReportPricePersonelSearch" type="button" style="width: 100px;" value="محاسبه عیدی" />
                            <%--<input id="btnReportCheckKarkardMonthlyPersonelSearch" type="button" style="width: 100px;" value="چک کردن کارکرد" />--%>
                        </td>
                    </tr>
                </table>
            </div>
            <div align="right" id="titleSortHoghogh">* مرتب سازی براساس ، کد پرسنلی می باشد</div>
            <div id="ResultDivReportPricePersonel" style="display: none; padding: 10px 0;"></div>
            <div id="ResultDivReportPricePersonel2" style="display: none; padding: 10px 0;"></div>
        </div>
        <div id="tab_2">
             <div class="InputSearchBox">
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: left;">کد پرسنلی :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPricePersonelCodeMorakhsi" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>
                        <td style="text-align: left;">نام کارمند :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPricePersonelNameMorakhsi" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">کد ملی :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtReportPricePersonelMelliCodeMorakhsi" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>
                        <td style="text-align: left;">گروه کاری :</td>
                        <td style="text-align: right;" id="tddrpdwnWorkReportPriceJobKindMorakhsi"></td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">نوع قرارداد :</td>
                        <td style="text-align: right;" id="divdrpdwnContractKindMorakhsi"></td>
                        <td style="text-align: left;">تعداد نمایش :</td>
                        <td style="text-align: right;">
                            <select id="drpdwnShowRowMorakhsi" class="InputSelectRightToLeftText" style="width:155px;">
                                <option value="-1" selected="selected">همه سطرها</option>
                                <option value="50" >50</option>
                                <option value="100" >100</option>
                                <option value="200" >200</option>
                                <option value="500" >500</option>
                            </select>
                        </td>
                    </tr>
                       <tr>
                        <td style="text-align: left;">سال :</td>
                        <td style="text-align: right;" >
                            <asp:Label runat="server" ID="lblDateMorakhasi"></asp:Label>
                        </td>
                        <td style="text-align: left;"></td>
                        <td style="text-align: right;">
                            
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;" colspan="2">
                            <input id="btnPersonelPreInvoiceSearchMorakhsi" type="button" style="width: 125px; display: none;" value="مشاهده آخرین بررسی" />
                            <input id="btnPersonelGetAllInvoiceSearchMorakhsi" type="button" style="width: 120px;" value="سابقه باز خرید مرخصی" />
                        </td>
                        <td style="text-align: left;" colspan="2">
                            <input id="btnReportReportPricePersonelSearchMorakhsi" type="button" style="width: 123px;" value="محاسبه بازخرید مرخصی" />
                            <%--<input id="btnReportCheckKarkardMonthlyPersonelSearch" type="button" style="width: 100px;" value="چک کردن کارکرد" />--%>
                        </td>
                    </tr>
                </table>
            </div>
            <div align="right" id="titleSortHoghoghMorakhsi">* مرتب سازی براساس ، کد پرسنلی می باشد</div>
            <div id="ResultDivReportPricePersonelMorakhsi" style="display: none; padding: 10px 0;"></div>
        </div>
    </div>
</asp:Content>

