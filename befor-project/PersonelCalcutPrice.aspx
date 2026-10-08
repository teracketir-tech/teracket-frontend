<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="PersonelCalcutPrice.aspx.cs" Inherits="PersonelCalcutPrice" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="Css/jspc-gray.css" rel="stylesheet" />
    <script src="js/js-persian-cal.min.js" type="text/javascript"></script>
    <script src="js/Pages/PersonelCalcutPrice.js" type="text/javascript"></script>
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1">مساعده</a></li>
            <li><a href="#tab_2">وام</a></li>
            <li><a href="#tab_3">اضافه/کسر از حقوق</a></li>
            <li><a href="#tab_4">صورت حساب کلی حقوق و دستمزد</a></li>
            <li><a href="#tab_5">محاسبه فرآیند</a></li>
            <li><a href="#tab_6">گزارشات</a></li>

        </ul>
        <div id="tab_1">
            <div id="divPersonelMosaede">
                <ul>
                    <li><a href="#Mosaede_1">ثبت</a></li>
                    <li><a href="#Mosaede_2">گزارش</a></li>
                </ul>
                <div id="Mosaede_1">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left;">کد پرسنلی :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtMosaedePersonelCode" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                            <td style="text-align: left;">مبلغ مساعده :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtPriceMosaede" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" />
                                ریال 
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">ماه :</td>
                            <td style="text-align: right;">
                                <select id="drpdwnMosaedePriceJob" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                <asp:Label runat="server" ID="lblMosaedeDate"></asp:Label>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;"></td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveMosaede" type="button" value="ثبت مساعده" />
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="Mosaede_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">ماه :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnSearchMosaedePriceJob" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                    <asp:Label runat="server" ID="lblSearchMosaedeDate"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMosaedePersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMosaedePersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMosaedePersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">وضعیت :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnStatusMosaede" class="InputSelectRightToLeftText" style="width: 148px;">
                                        <option value="-1" selected="selected">همه وضعیت ها</option>
                                        <option value="0">تسویه نشده</option>
                                        <option value="1">تسویه شده</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportMosaedePersonelSearch" type="button" style="width: 148px;" value="جستجو" />

                                </td>
                            </tr>

                        </table>
                    </div>

                    <div align="right">* مرتب سازی براساس ، تاریخ ثبت می باشد</div>

                    <div id="ResultDivMosaedePersonel" style="display: none; padding: 10px 0;"></div>
                </div>
            </div>

        </div>
        <div id="tab_2">
            <div id="divPersonelVam">
                <ul>
                    <li><a href="#Vam_1">ثبت</a></li>
                    <%--<li><a href="#Vam_2">تسویه</a></li>--%>
                    <li><a href="#Vam_3">گزارش</a></li>
                </ul>
                <div id="Vam_1">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left;">کد پرسنلی :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtVamPersonelCode" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                            <td style="text-align: left;">مبلغ وام :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtPriceVam" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" onchange="GetPriceGhest();" />
                                ریال 
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">تعداد اقساط :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtVamAghsatMonth" type="text" style="width: 170px;" class="InputTextLeftToRightText" onchange="GetPriceGhest();" />
                                ماه
                            </td>
                            <td style="text-align: left;">مبلغ هر قسط :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtPriceVamMontly" type="text" style="width: 170px;" value="0" class="InputTextLeftToRightText setcamma" disabled="disabled" />
                                ریال 
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;"></td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveVam" type="button" value="ثبت وام" />
                            </td>
                        </tr>
                    </table>
                </div>
                <%--<div id="Vam_2">
                       <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left;">کد پرسنلی :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtGhestVamPersonelCode" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                            <td style="text-align: left;">مبلغ قسط :
                            </td>
                            <td style="text-align: right;" >
                                <input id="txtPriceGhestVam" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" /> ریال 
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">
                            </td>
                            <td style="text-align: right;">
                            </td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveGhestVam" type="button" value="ثبت  قسط وام" />
                            </td>
                        </tr>
                    </table>
                  </div>--%>
                <div id="Vam_3">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">از تاریخ :
                                </td>
                                <td style="text-align: right;">
                                    <asp:Label runat="server" ID="lblDateFromVam"></asp:Label>
                                </td>
                                <td style="text-align: left;">تا تاریخ :
                                </td>
                                <td style="text-align: right;">
                                    <asp:Label runat="server" ID="lblDateToVam"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportVamPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportVamPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportVamPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">وضعیت :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnStatusVam" class="InputSelectRightToLeftText" style="width: 148px;">
                                        <option value="-1" selected="selected">همه وضعیت ها</option>
                                        <option value="0">تسویه نشده</option>
                                        <option value="1">تسویه شده</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportVamPersonelSearch" type="button" style="width: 148px;" value="جستجو" />

                                </td>
                            </tr>

                        </table>
                    </div>

                    <div align="right">* مرتب سازی براساس ، تاریخ ثبت می باشد</div>

                    <div id="ResultDivVamPersonel" style="display: none; padding: 10px 0;"></div>
                </div>

            </div>
        </div>
        <div id="tab_3">
            <div id="divPersonelPadash">
                <ul>
                    <li><a href="#Padash_1">ثبت</a></li>
                    <li><a href="#Padash_2">گزارش</a></li>
                </ul>
                <div id="Padash_1">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left;">کد پرسنلی :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtPadashPersonelCode" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                            <td style="text-align: left;">نوع ثبت :
                            </td>
                            <td style="text-align: right;">
                                <select id="drpdwnPadashKind" class="InputSelectRightToLeftText" style="width: 170px;">
                                    <option value="-1">انتخاب نمایید...</option>
                                    <option value="1">پاداش</option>
                                    <option value="2">جریمه</option>
                                    <option value="3">معوقه</option>
                                    <option value="4">خرید از شرکت</option>
                                    <option value="5">کسور متفرقه</option>
                                    <option value="6">کمک ایاب ذهاب</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">مبلغ :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtPricePadash" type="text" style="width: 170px;" class="InputTextLeftToRightText setcamma" />
                                ریال 
                            </td>
                            <td style="text-align: left;">توضیحات :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtPadashDesc" type="text" style="width: 170px;" class="InputTextRightToLeftText" />
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">ماه :</td>
                            <td style="text-align: right;">
                                <select id="drpdwnPadashPriceJob" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                <asp:Label runat="server" ID="lblDatePadashDate"></asp:Label>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;"></td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSavePadash" type="button" value="ثبت" />
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="Padash_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">ماه :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnSearchPadashPriceJob" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                    <asp:Label runat="server" ID="lblSearchPadashDate"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportPadashPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportPadashPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportPadashPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">حالت :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnReportPadashKind" class="InputSelectRightToLeftText" style="width: 148px;">
                                        <option value="-1" selected="selected">همه حالت ها</option>
                                        <option value="1">پاداش</option>
                                        <option value="2">جریمه</option>
                                        <option value="3">معوقه</option>
                                        <option value="4">خرید از شرکت</option>
                                        <option value="5">کسور متفرقه</option>
                                    <option value="6">کمک ایاب ذهاب</option>

                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td style="text-align: left;">وضعیت :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnReportPadashStatus" class="InputSelectRightToLeftText" style="width: 148px;">
                                        <option value="-1" selected="selected">همه وضعیت ها</option>
                                        <option value="0">تسویه نشده</option>
                                        <option value="1">تسویه شده</option>
                                    </select>
                                </td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportPadashPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>

                        </table>
                    </div>

                    <div align="right">* مرتب سازی براساس ، تاریخ ثبت می باشد</div>

                    <div id="ResultDivPadashPersonel" style="display: none; padding: 10px 0;"></div>
                </div>

            </div>
        </div>
        <div id="tab_4">
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
                        <td style="text-align: left;">ماه :</td>
                        <td style="text-align: right;">
                            <select id="drpdwnKarkardPriceJob" class="InputSelectRightToLeftText" style="width: 154px;">
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
                            <asp:Label runat="server" ID="lblKarkardPriceDate"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">نوع قرارداد :
                        </td>
                        <td style="text-align: right;" id="divdrpdwnContractKind"></td>
                        <td style="text-align: left;"></td>
                        <td style="text-align: right;"></td>
                    </tr>
                    <tr>
                        <td style="text-align: right;" colspan="2">

                            <input id="btnPersonelPreInvoiceSearch" type="button" style="width: 125px; display: none;" value="مشاهده آخرین بررسی" />
                            <input id="btnPersonelGetAllInvoiceSearch" type="button" style="width: 100px;" value="سابقه واریز حقوق" />
                        </td>
                        <td style="text-align: left;" colspan="2">
                            <input type="checkbox" id="chkOnlyKarkard" /><label for="chkOnlyKarkard">فقط کارکرد محاسبه شود</label>
                            <input id="btnReportReportPricePersonelSearch" type="button" style="width: 100px;" value="محاسبه حقوق" />
                            <input id="btnReportCheckKarkardMonthlyPersonelSearch" type="button" style="width: 100px;" value="چک کردن کارکرد" />
                        </td>
                    </tr>
                </table>
            </div>
            <div align="right" id="titleSortHoghogh">* مرتب سازی براساس ، کد پرسنلی می باشد</div>
            <div id="ResultDivReportPricePersonel" style="display: none; padding: 10px 0; max-width: 735px; overflow: auto; max-height: 300px;"></div>
            <div id="DivbtnPreSavePrice" style="padding: 10px 0; text-align: center; display: none;">
                <input id="btnPreSaveHoghoghPersonel" type="button" value="پیش ثبت" />
                <input id="btnExcelReportVarizHoghogh1" type="button" style="width: 148px;" value="خروجی اکسل" />

            </div>
            <div id="DivbtnCheckKarkard" style="padding: 10px 0; text-align: center; display: none;">
                <input id="btnSetKarkardProjecti" type="button" style="width: 148px;" value="کارکرد صفر شود" />
                <input id="btnExcelCheckKarkardhoghgh" type="button" style="width: 148px;" value="خروجی اکسل" />
            </div>
            <div id="DivbtnSaveFinalPrice" style="padding: 10px 0; text-align: center; display: none;">
                <input id="DeleteCalcHoghogh" type="button" value="حذف محاسبه حقوق و دستمزد" style="margin-left: 10px;" />
                <input id="ReCalcHoghogh" type="button" value="محاسبه مجدد حقوق و دستمزد" style="margin-left: 10px;" />
                <input id="PrintAllHoghogh" type="button" value="پرینت صورت حساب" style="margin-left: 10px;" />
                <input id="btnExcelReportVarizHoghogh2" type="button" style="margin-left: 10px;" value="خروجی اکسل" />
                <input id="btnSaveFinalHoghoghPersonel" type="button" value="ثبت نهایی" />

            </div>
            <div id="DivbtnPrintFishHoghogh" style="padding: 10px 0; text-align: center; display: none;">
                <input id="PrintAllFishHoghogh" type="button" value="پرینت فیش حقوقی" style="margin-left: 10px;" />
                <input id="btnExcelReportVarizHoghogh3" type="button" style="margin-left: 10px;" value="خروجی اکسل" />
            </div>

        </div>
        <div id="tab_5">
            <div id="divPersonelFaraiand">
                <ul>
                    <li><a href="#Faraiand_1">بارگزاری فرآیند ها</a></li>
                    <li><a href="#Fariand_2">محاسبه فرآیند ها</a></li>
                </ul>
                <div id="Faraiand_1">

                    <div align="center" style="width: 100%">
                        فرآیند ماه :  
                            <select id="drpdwnFaraiandJobUpFile" class="InputSelectRightToLeftText" style="width: 155px;" onchange="FaraiandkarkardChange();">
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
                    </div>


                    <div id="divkarkardFaraiand" style="display: none;">

                        <div style="padding: 10px 0; margin-top: 20px; color: #ffffff; height: 70px; display: inline-block; width: 100%; background-color: #7266ba !important;">
                            <div style="float: right; margin-left: 20px; margin-right: 10px;">
                                فرآیند از تاریخ : 
                            <input id="pcaldateStartjobUpFile" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                            </div>
                            <div style="float: right; margin-left: 20px;">
                                تا تاریخ : 
                            <input id="pcaldateEndjobUpFile" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                            </div>
                            <br />
                            <div style="clear: both;"></div>
                            <div style="float: right; margin-top: 10px;">فایل اکسل را انتخاب نمایید :</div>
                            <div style="float: right; margin-top: 10px;">
                                <div class="custom_file_upload" style="margin-right: 82px;">
                                    <input type="text" class="file" name="file_info" id="txtUpkarkardPersonel" disabled="disabled" />
                                    <div class="file_upload">
                                        <input id="uploadFilekarkardPersonel" type="file" onchange="changeValueUpFile('txtUpkarkardPersonel','uploadFilekarkardPersonel');" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="DivbtnSaveKarkard" align="center" style="margin-top: 10px; display: none;">
                        <input type="button" value="ثبت فرآیند" onclick="UpFileKarkard();" style="width: 100px;" />
                    </div>

                    <div id="DivErrorKarkardFaraiand" style="margin-top: 10px; display: none;"></div>
                </div>
                <div id="Fariand_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">ماه :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnFaraiandKarkard" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                    <asp:Label runat="server" ID="lblFaraiandKarkardhDate"></asp:Label>
                                </td>
                            </tr>

                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKarkardPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKarkardPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKarkardPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">گروه کاری :</td>
                                <td style="text-align: right;" id="tddrpdwnSearchWorkJobKindFaraiand"></td>
                            </tr>

                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                            </tr>
                            <tr>
                                <td style="text-align: right;" colspan="2">
                                    <input id="btnPersonelPreFaraiandSearch" type="button" style="width: 125px; display: none;" value="مشاهده آخرین بررسی" />
                                    <input id="btnPersonelGetAllFaraiandSearch" type="button" style="width: 100px;" value="سابقه واریز فرآیند" />
                                </td>
                                <td style="text-align: left;" colspan="2">
                                    <input id="btnReportCalcShowFaraiand" type="button" style="width: 85px;" value="محاسبه فرآیند" />
                                    <input id="btnReportCheckFaraiandPersonelSearch" type="button" style="width: 116px;" value="لیست پرسنل فرآیندی" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، کد پرسنلی می باشد</div>

                    <div id="ResultDivKarkardPersonelFaraiand" style="display: none; padding: 10px 0;"></div>

                    <div id="DivbtnPreSavePriceFaraind" style="padding: 10px 0; text-align: center; display: none;">
                        <input id="btnPreSaveFaraindPersonel" type="button" value="پیش ثبت" />
                        <input id="btnExcelReportVarizFaraind1" type="button" style="width: 148px;" value="خروجی اکسل" />

                    </div>
                    <div id="DivbtnCheckKarkardFaraind" style="padding: 10px 0; text-align: center; display: none;">
                        <input id="btnExcelCheckKarkardFaraind" type="button" style="width: 148px;" value="خروجی اکسل" />
                    </div>
                    <div id="DivbtnSaveFinalPriceFaraind" style="padding: 10px 0; text-align: center; display: none;">
                        <input id="DeleteCalcFaraind" type="button" value="حذف محاسبه فرآیند" style="margin-left: 10px;" />
                        <input id="ReCalcFaraind" type="button" value="محاسبه مجدد فرآیند" style="margin-left: 10px;" />
                        <input id="PrintAllFaraind" type="button" value="پرینت صورت حساب فرآیند" style="margin-left: 10px;" />
                        <input id="btnExcelReportVarizFaraind2" type="button" style="margin-left: 10px;" value="خروجی اکسل" />
                        <input id="btnSaveFinalFaraindPersonel" type="button" value="ثبت نهایی" />

                    </div>
                    <div id="DivbtnPrintFishFaraind" style="padding: 10px 0; text-align: center; display: none;">
                        <%-- <input id="PrintAllFishFaraind" type="button" value="پرینت فیش حقوقی" style="margin-left: 10px;" />--%>
                        <input id="btnExcelReportVarizFaraind3" type="button" style="margin-left: 10px;" value="خروجی اکسل" />
                    </div>

                </div>
            </div>
        </div>
        <div id="tab_6">
            <div id="divPersonelrpt">
                <ul>
                    <li><a href="#tab_rpt1">دستمزد و جریمه کارکرد</a></li>
                    <li><a href="#tab_rpt2">شرح پرداخت</a></li>
                    <li><a href="#tab_rpt3">شرح کسور</a></li>
                </ul>
                <div id="tab_rpt1">
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
                                <td style="text-align: left;">گروه کاری :</td>
                                <td style="text-align: right;" id="tddrpdwnWorkJobKind"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnExcelReportPersonelSearch" type="button" style="width: 148px;" value="خروجی اکسل" />

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
                <div id="tab_rpt2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportDescPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportDescPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportDescPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">گروه کاری :</td>
                                <td style="text-align: right;" id="tddrpdwnWorkReportDescJobKind"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">ماه :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnReportDescPriceJob" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                    <asp:Label runat="server" ID="lblReportDescYear"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نوع قرارداد :
                                </td>
                                <td style="text-align: right;" id="divdrpdwnContractKindReportDesc"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnExcelReportDescPersonelSearch" type="button" style="width: 148px;" value="خروجی اکسل" />
                                </td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportReportDescPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، کد پرسنلی می باشد</div>
                    <div id="ResultDivReportDescPersonel" style="display: none; padding: 10px 0;"></div>
                </div>
                <div id="tab_rpt3">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKosorPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKosorPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKosorPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">گروه کاری :</td>
                                <td style="text-align: right;" id="tddrpdwnWorkReportKosorJobKind"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">ماه :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnReportKosorPriceJob" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                    <asp:Label runat="server" ID="lblReportKosorYear"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نوع قرارداد :
                                </td>
                                <td style="text-align: right;" id="divdrpdwnContractKindKosor"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnExcelReportKosorPersonelSearch" type="button" style="width: 148px;" value="خروجی اکسل" />

                                </td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportReportKosorPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، کد پرسنلی می باشد</div>
                    <div id="ResultDivReportKosorPersonel" style="display: none; padding: 10px 0;"></div>
                </div>
            </div>



        </div>
    </div>
</asp:Content>

