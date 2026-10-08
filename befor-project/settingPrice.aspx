<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="SettingPrice.aspx.cs" Inherits="SettingPrice" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="js/Pages/SettingPrice.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1">تنظیمات مالی</a></li>
            <li><a href="#tab_2">روز کاری در ماه</a></li>
        </ul>
        <div id="tab_1">
            <div style="text-align: right; padding: 10px 0;">* توجه مهم : شما فقط یک بار امکان تنظیم مبالغ تعیین شده را دارید بعد از محاسبه شدن این مبالغ در صورت حساب ها امکان حذف / ویرایش آن وجود ندارد .</div>
            <div>
                <table style="direction: rtl;">
                    <tr>
                        <td style="text-align: left;">سال مالی :
                        </td>
                        <td style="text-align: right; width: 100px;">
                            <asp:Label runat="server" ID="lblSettingDate"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">حقوق ثابت (ریال):
                        </td>
                        <td style="text-align: right; width: 100px;">
                            <input id="txtPersonelSalary" type="text" style="width: 148px;" class="InputTextLeftToRightText setcamma" placeholder="0" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">بن خواربار (ریال):
                        </td>
                        <td style="text-align: right; width: 100px;">
                            <input id="txtPersonelBonSalary" type="text" style="width: 148px;" class="InputTextLeftToRightText setcamma" placeholder="0" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">حق مسکن (ریال):
                        </td>
                        <td style="text-align: right; width: 100px;">
                            <input id="txtPersonelHomeSalary" type="text" style="width: 148px;" class="InputTextLeftToRightText setcamma" placeholder="0" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;"></td>
                        <td style="text-align: right; width: 100px;">
                            <input id="btnAllSetting" type="button" value="نمایش همه" />
                            <input id="btnresetSetting" type="button" value="جدید" />
                            <input id="btnSrchSetting" type="button" value="جستجو" />
                            <input id="btnSaveSetting" type="button" value="ثبت تنظیمات" style="width: 83px;" />
                        </td>
                    </tr>
                </table>
            </div>
            <div id="ResultSetting" style="padding: 10px 0;">
            </div>
        </div>
        <div id="tab_2">
            <div class="InputSearchBox">
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: left;">ماه :</td>
                        <td style="text-align: right;">
                            <select id="drpdwnCountDayIntoMonth" class="InputSelectRightToLeftText" style="width: 154px;">
                                <option value="-1" selected="selected">انتخاب نمایید...</option>
                                <option value="1">فروردین</option>
                                <option value="2">اردیبهشت</option>
                                <option value="3">خرداد</option>
                                <option value="4">تیر</option>
                                <option value="5">مرداد</option>
                                <option value="6">شهریور</option>
                                <option value="7">مهر</option>
                                <option value="8">آبان</option>
                                <option value="9">آذر</option>
                                <option value="10">دی</option>
                                <option value="11">بهمن</option>
                                <option value="12">اسفند</option>
                            </select>
                        </td>
                        <td style="text-align: left;">سال :</td>
                        <td style="text-align: right;">
                            <asp:Label runat="server" ID="lblDateYearForMonth"></asp:Label>
                        </td>
                    </tr>
                    <tr>

                        <td style="text-align: left;">تعداد روز در ماه :
                        </td>
                        <td style="text-align: right;">
                            <input id="txtCountDayInMonth" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                        </td>

                        <td style="text-align: left;"></td>
                        <td style="text-align: right;">
                            <input id="btnSaveCountDayInMonth" type="button" style="width: 148px;" value="ثبت" />
                        </td>
                    </tr>
                </table>
            </div>
            <div id="ResultDivDayIntoMonthInfo" style="padding: 10px 0;"></div>

        </div>
    </div>
</asp:Content>

