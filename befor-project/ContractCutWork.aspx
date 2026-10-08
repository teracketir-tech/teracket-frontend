<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="ContractCutWork.aspx.cs" Inherits="ContractCutWork" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="Css/ContractReg.css" rel="stylesheet" />
    <link href="Css/jspc-gray.css" rel="stylesheet" />
    <script src="js/js-persian-cal.min.js" type="text/javascript"></script>
    <script src="js/Pages/ContractCutWork.js?v=100" type="text/javascript"></script>
    <link href="Css/font-awesome1.css" rel="stylesheet" />
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1">قطع همکاری</a></li>
            <li><a href="#tab_2">گزارش</a></li>
        </ul>
        <div id="tab_1">
            <div class="InputSearchBox">
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: left;">کد پرسنلی :
                        </td>
                        <td style="text-align: right; width: 100px;">
                            <input id="txtPersonelCodeForCutWork" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>
                        <td style="text-align: left;"></td>
                        <td style="text-align: right;">
                            <input id="btnSearchPersonelCodeCutWork" type="button" style="width: 148px;" value="جستجو" />
                        </td>
                    </tr>
                </table>
            </div>

            <div align="right">* توجه مهم1 : ابتدا بایستی کارکرد ماه قطع همکاری و مرخصی  پرسنل را آپلود نمایید.</div>
            <div align="right">* توجه مهم2 : تاریخ قطع همکاری همان تاریخ آخرین روز کارکرد پرسنل می باشد.</div>
            <div align="right">* توجه مهم3 : برای قطع همکاری افرادی که در ماه گذشته حقوق دریافت نکرده اند مجموع کارکرد های ماه گذشته و ماه فعلی را با هم محاسبه نمایید تا در این قسمت مورد استفاده قرار گیرد.</div>
            <div id="ResultDivCutWorkPersonelInfo" style="padding: 10px 0;"></div>
            <div id="ResultDivCutWorkTasviehPersonelInfo" style="padding: 10px 0;"></div>
        </div>
        <div id="tab_2">
            <div class="InputSearchBox">
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: left;">از تاریخ :
                        </td>
                        <td style="text-align: right;">
                            <asp:Label runat="server" ID="lblDateFrom"></asp:Label>
                        </td>
                        <td style="text-align: left;">تا تاریخ :
                        </td>
                        <td style="text-align: right;">
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
                        <td style="text-align: left;">گروه کاری :</td>
                        <td style="text-align: right;" id="tddrpdwnWorkGroupPersonelContract"></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-right:59px;" colspan="2">
                            <input type="checkbox" value="" id="chkIsCutwork" />
                            <label for="chkIsCutwork">در انتظار قطع همکاری </label>
                        </td>
                        <td style="text-align: left;">تعداد نمایش :
                        </td>
                        <td style="text-align: right;">
                            <select id="drpdwnShowRow" class="InputSelectRightToLeftText" style="width: 155px;">
                                <option value="-1">همه سطرها</option>
                                <option value="50" selected="selected">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                            </select>
                        </td>

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
            <div align="right">* مرتب سازی براساس ، تاریخ قطع همکاری می باشد</div>

            <div id="ResultDivPersonel" style="display: none; padding: 10px 0;"></div>
        </div>
    </div>
</asp:Content>

