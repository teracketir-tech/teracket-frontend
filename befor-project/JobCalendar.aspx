<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="JobCalendar.aspx.cs" Inherits="JobCalendar" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="Css/timepicker.css" rel="stylesheet" />
    <script src="js/timePicker.js" type="text/javascript"></script>
    <script src="js/Pages/JobCalendar.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1">ثبت</a></li>
            <li><a href="#tab_2">گزارش</a></li>
        </ul>
        <div id="tab_1">
            <table style="width: 100%;">
                <tr>
                    <td align="left" style="width: 115px;">گروه کاری :
                    </td>
                    <td align="right" id="DivEmployer">
                        <img src='images/loading.gif' />
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;">ساعت ورود :
                    </td>
                    <td align="right">
                        <input id="txtTimeIn" type="text" style="width: 75px;" class="InputTextRightToLeftText" />
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;">ساعت خروج :
                    </td>
                    <td align="right">
                        <input id="txtTimeOut" type="text" style="width: 75px;" class="InputTextRightToLeftText" />
                    </td>
                </tr>

                <tr>
                    <td align="left" style="width: 115px;">تاخیر مجاز :
                    </td>
                    <td align="right">
                        <input id="txtTimeValid" type="text" style="width: 75px;" class="InputTextRightToLeftText" />
                    </td>
                </tr>
                <tr>
                    <td align="left" style="width: 115px;"></td>
                    <td align="right">
                        <input id="btnSaveTimeWork" type="button" value="ثبت " />
                    </td>
                </tr>

            </table>
        </div>
        <div id="tab_2">
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
                        <td style="text-align: left;"></td>
                        <td style="text-align: right;">
                            <input id="btnReportPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                        </td>
                    </tr>
                </table>
            </div>
            <div align="right">* مرتب سازی براساس ، کد پرسنلی می باشد</div>

            <div id="ResultDivPersonel" style="display: none; padding: 10px 0;"></div>
        </div>
    </div>
</asp:Content>

