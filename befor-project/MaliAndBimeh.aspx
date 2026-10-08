<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="MaliAndBimeh.aspx.cs" Inherits="MaliAndBimeh" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="js/Pages/MaliAndBimeh.js" type="text/javascript"></script>
    <link href="Css/jspc-gray.css" rel="stylesheet" />
    <script src="js/js-persian-cal.min.js" type="text/javascript"></script>
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divPersonelMaliAndBimehTabs">
        <ul>
            <li><a href="#tab_1">ثبت حساب</a></li>
            <li><a href="#tab_2">ثبت بیمه</a></li>
            <li><a href="#tab_3">ثبت پرداختی حق بیمه</a></li>
        </ul>
        <div id="tab_1">
            <div id="DivtabMali">
                <ul>
                    <li><a href="#mali_1">اطلاعات حساب</a></li>
                    <li><a href="#mali_2">گزارش</a></li>
                </ul>
                <div id="mali_1">

                    <table style="width: 100%; direction: rtl;">
                        <tr>
                            <td align="left">کد پرسنلی :
                            </td>
                            <td align="right">
                                <input id="txtCodePersoneliMali" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                            <td align="left"></td>
                            <td align="right"></td>
                        </tr>
                        <tr>
                            <td align="left">نام بانک :
                            </td>
                            <td align="right">
                                <select id="drpdwnBankName" class="InputSelectRightToLeftText" style="width: 176px;">
                                    <option value="-1">انتخاب کنید...</option>
                                    <option value="ملی">ملی</option>
                                    <option value="ملت">ملت</option>
                                    <option value="سپه">سپه</option>
                                    <option value="تجارت">تجارت</option>
                                    <option value="صادرات">صادرات</option>
                                    <option value="کشاورزی">کشاورزی</option>
                                    <option value="پاسارگارد">پاسارگارد</option>
                                    <option value="سامان">سامان</option>
                                    <option value="پارسیان">پارسیان</option>
                                    <option value="اقتصادنوین">اقتصادنوین</option>
                                    <option value="تات">تات</option>
                                    <option value="دی">دی</option>
                                    <option value="آینده">آینده</option>
                                    <option value="مهراقتصاد">مهراقتصاد</option>
                                    <option value="قوامین">قوامین</option>
                                    <option value="سرمایه">سرمایه</option>
                                    <option value="انصار">انصار</option>
                                    <option value="رفاه کارگران">رفاه کارگران</option>
                                </select>
                            </td>
                            <td align="left">شماره حساب :
                            </td>
                            <td align="right">
                                <input id="txtNumberAccont" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                        </tr>
                        <tr>
                            <td align="left">شماره شبا :
                            </td>
                            <td align="right">
                                <input id="txtShebaBank7" type="text" style="width: 15px;" maxlength="2" class="InputTextLeftToRightText" />-
                                            <input id="txtShebaBank6" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtShebaBank5" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtShebaBank4" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtShebaBank3" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtShebaBank2" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtShebaBank1" type="text" style="width: 15px;" maxlength="2" class="InputTextLeftToRightText" />
                                IR
                            </td>
                            <td align="left">شماره کارت :
                            </td>
                            <td align="right">
                                <input id="txtCartNumberBank4" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />-
                                            <input id="txtCartNumberBank3" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />-
                                            <input id="txtCartNumberBank2" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />-
                                            <input id="txtCartNumberBank1" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />
                            </td>
                        </tr>

                        <tr>
                            <td align="left"></td>
                            <td align="right"></td>
                            <td align="left"></td>
                            <td align="right">
                                <input id="btnSaveMaliInfo" type="button" value="ثبت اطلاعات حساب" />
                            </td>
                        </tr>
                    </table>

                </div>
                <div id="mali_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <%--   <tr>
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
                    </tr>--%>
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMaliPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>

                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMaliPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMaliPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>

                                <td style="text-align: left;">گروه کاری :
                                </td>
                                <td style="text-align: right;" id="tddrpdwnWorkGroupPersonelMaliInfo"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnCheckReportMaliPersonelSearch" type="button" style="width: 148px;" value="چک کردن شماره حساب" />

                                </td>
                                <td></td>
                                <td style="text-align: right;">
                                    <input id="btnReportMaliPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right" id="titleMali">* مرتب سازی براساس ،کد پرسنلی می باشد</div>

                    <div id="ResultDivPersonelMali" style="display: none; padding: 10px 0;"></div>
                    <div style="padding: 10px 0; display: none;" id="DivExcelMali">
                        <input type="button" value="خروجی اکسل" id="btnReportExcelCheckMali" />
                    </div>
                    <div id="pnlEDitBankInfo" style="display: none;">
                        <table style="width: 100%; direction: rtl;">
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelcodeBank"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نام و نام خانوادگی پرسنل :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelnameBank"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">گروه کاری :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelworkGroupBank"></td>
                            </tr>
                            <tr>
                                <td align="left">نام بانک :
                                </td>
                                <td align="right">
                                    <select id="drpdwnEditBankName" class="InputSelectRightToLeftText" style="width: 176px;">
                                        <option value="ملی">ملی</option>
                                        <option value="ملت">ملت</option>
                                        <option value="سپه">سپه</option>
                                        <option value="تجارت">تجارت</option>
                                        <option value="صادرات">صادرات</option>
                                        <option value="کشاورزی">کشاورزی</option>
                                        <option value="پاسارگارد">پاسارگارد</option>
                                        <option value="سامان">سامان</option>
                                        <option value="پارسیان">پارسیان</option>
                                        <option value="اقتصادنوین">اقتصادنوین</option>
                                        <option value="تات">تات</option>
                                        <option value="دی">دی</option>
                                        <option value="آینده">آینده</option>
                                        <option value="مهراقتصاد">مهراقتصاد</option>
                                        <option value="قوامین">قوامین</option>
                                        <option value="سرمایه">سرمایه</option>
                                        <option value="انصار">انصار</option>
                                        <option value="رفاه کارگران">رفاه کارگران</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td align="left">شماره حساب :
                                </td>
                                <td align="right">
                                    <input id="txtEditNumberAccont" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left">شماره شبا :
                                </td>
                                <td align="right">
                                    <input id="txtEditShebaBank7" type="text" style="width: 15px;" maxlength="2" class="InputTextLeftToRightText" />-
                                            <input id="txtEditShebaBank6" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtEditShebaBank5" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtEditShebaBank4" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtEditShebaBank3" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtEditShebaBank2" type="text" style="width: 25px;" maxlength="4" class="InputTextLeftToRightText" />-
                                            <input id="txtEditShebaBank1" type="text" style="width: 15px;" maxlength="2" class="InputTextLeftToRightText" />
                                    IR
                                </td>
                            </tr>
                            <tr>
                                <td align="left">شماره کارت :
                                </td>
                                <td align="right">
                                    <input id="txtEditCartNumberBank4" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />-
                                            <input id="txtEditCartNumberBank3" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />-
                                            <input id="txtEditCartNumberBank2" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />-
                                            <input id="txtEditCartNumberBank1" type="text" maxlength="4" style="width: 35px;" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id="tab_2">
            <div id="DivtabBimeh">
                <ul>
                    <li><a href="#Bimeh_1">اطلاعات بیمه</a></li>
                    <li><a href="#Bimeh_2">گزارش</a></li>
                </ul>
                <div id="Bimeh_1">
                    <table style="width: 100%;">
                        <tr id="tdbime10">

                            <td align="left">نوع بیمه :</td>
                            <td align="right">
                                <select id="drpdwnBimehKind" class="InputSelectRightToLeftText" style="width: 176px;" onchange="GetDateBimehInfo();">
                                    <option value="-1">انتخاب کنید...</option>
                                    <option value="1">قبل از استخدام در شرکت</option>
                                    <option value="2">بعد از استخدام در شرکت</option>
                                </select>

                            </td>
                            <td align="left"></td>
                            <td align="right"></td>
                        </tr>
                        <tr id="tdbime7">
                            <td align="left">کد پرسنلی :
                            </td>
                            <td align="right">
                                <input id="txtPersonelCodeBimeh" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>

                            <td align="left">شماره بیمه :
                            </td>
                            <td align="right">
                                <input id="txtNewNumberBimeh" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                        </tr>
                        <tr id="tdbime8">
                            <td align="left">کدکارگاه :
                            </td>
                            <td align="right">
                                <input id="txtNewCodeGargah" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>

                            <td align="left">نام کارگاه  :
                            </td>
                            <td align="right">
                                <input id="txtNewGargahName" type="text" style="width: 170px;" class="InputTextRightToLeftText" />
                            </td>

                        </tr>
                        <tr id="tdbime9" style="display: none;">
                            <td align="left">سابقه بیمه از :
                            </td>
                            <td align="right">
                                <input id="pcaldateNewStartBimeDate" type="text" style="width: 170px;" class="InputTextLeftToRightText pdate" />
                            </td>
                            <td align="left" id="TddateTobimehTitle">سابقه بیمه تا :
                            </td>
                            <td align="right" id="TddateTobimehValue">
                                <input id="pcaldateNewEndBimeDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />
                            </td>

                        </tr>
                        <tr>
                            <td align="left"></td>
                            <td align="right"></td>
                            <td align="left"></td>
                            <td align="right">
                                <input id="btnSaveBimehInfo" type="button" value="ثبت اطلاعات بیمه" />
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="Bimeh_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportBimehPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportBimehMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نام کارمند :</td>
                                <td style="text-align: right;">
                                    <input id="txtReportBimehPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                                <td style="text-align: left;">گروه کاری :
                                </td>
                                <td style="text-align: right;" id="tddrpdwnWorkGroupPersonelBimehInfo"></td>

                            </tr>
                            <tr>

                                <td style="text-align: left;">نوع بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <select id="drpdwnBimehKindSearch" class="InputSelectRightToLeftText" style="width: 154px;">
                                        <option value="-1">هردوحالت</option>
                                        <option value="1">قبل از استخدام در شرکت</option>
                                        <option value="2">بعد از استخدام در شرکت</option>
                                    </select>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnCheckReportBimehPersonelSearch" type="button" style="width: 148px;" value="چک کردن بیمه" />

                                </td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportBimehPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right" id="titleBimeh">* مرتب سازی براساس ،کد پرسنلی می باشد</div>
                    <div id="ResultDivPersonelBimeh" style="display: none; padding: 10px 0;"></div>
                    <div style="padding: 10px 0; display: none;" id="DivExcelBimeh">
                        <input type="button" value="خروجی اکسل" id="btnReportExcelCheckBimeh" />
                    </div>

                    <div id="pnlEDitBimeInfo" style="display: none;">
                        <table style="width: 100%; direction: rtl;">
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelcode"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نام و نام خانوادگی پرسنل :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelname"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">گروه کاری :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelworkGroup"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">شماره بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtEditBimehNumber" type="text" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نام کارگاه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtEditCargahName" type="text" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد کارگاه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtEditCodeGargah" type="text" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">تاریخ شروع بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="pcaldateStartBimehEdit" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">تاریخ پایان بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="pcaldateEndBimehEdit" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نوع بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <select id="drpdwnBimehKindEdit" class="InputSelectRightToLeftText" style="width: 140px;">
                                        <option value="1">قبل از استخدام در شرکت</option>
                                        <option value="2">بعد از استخدام در شرکت</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div id="tab_3">
            <div id="DivtabBimehPrice">
                <ul>
                    <li><a href="#BimehPrice_1">ثبت حق بیمه</a></li>
                    <li><a href="#BimehPrice_2">گزارش</a></li>
                </ul>
                <div id="BimehPrice_1">
                    <table style="width: 100%;">
                        <tr>
                            <td align="left">ماه واریز :
                            </td>
                            <td align="right">
                                <select id="drpdwnBimePriceMonth" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                <asp:Label runat="server" ID="lblBimehPriceDateYear"></asp:Label>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">مبلغ واریزی :</td>
                            <td style="text-align: right;">
                                <input id="txtPersonelNameBimehPrice" type="text" style="width: 148px;" class="InputTextLeftToRightText setcamma" />&nbsp; ریال
                            </td>
                            <td align="left"></td>
                            <td align="right">
                                <input id="btnSaveBimehPriceInfo" type="button" value="ثبت اطلاعات حق بیمه" />

                            </td>
                        </tr>

                    </table>
                </div>
                <div id="BimehPrice_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                                <tr>
                            <td align="left">ماه :
                            </td>
                            <td align="right">
                                <select id="drpdwnBimePriceSrchMonth" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                <asp:Label runat="server" ID="lblBimePriceSrchDateYear"></asp:Label>
                            </td>
                        </tr>

                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportBimehPricePersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right" id="titleBimehPrice">* مرتب سازی براساس ،کد پرسنلی می باشد</div>
                    <div id="ResultDivPersonelBimehPrice" style="display: none; padding: 10px 0;"></div>
                    <div style="padding: 10px 0; display: none;" id="DivExcelBimehPrice">
                        <input type="button" value="خروجی اکسل" id="btnReportExcelCheckBimehPrice" />
                    </div>

                    <div id="pnlEDitBimePriceInfo" style="display: none;">
                        <table style="width: 100%; direction: rtl;">
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelcodePrice"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نام و نام خانوادگی پرسنل :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelnamePrice"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">گروه کاری :
                                </td>
                                <td style="text-align: right;" id="tdeditpersonelworkGroupPrice"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">شماره بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtEditBimehNumberPrice" type="text" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نام کارگاه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtEditCargahNamePrice" type="text" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد کارگاه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtEditCodeGargahPrice" type="text" class="InputTextLeftToRightText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">تاریخ شروع بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="pcaldateStartBimehEditPrice" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">تاریخ پایان بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <input id="pcaldateEndBimehEditPrice" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">نوع بیمه :
                                </td>
                                <td style="text-align: right;">
                                    <select id="drpdwnBimehKindEditPrice" class="InputSelectRightToLeftText" style="width: 140px;">
                                        <option value="1">قبل از استخدام در شرکت</option>
                                        <option value="2">بعد از استخدام در شرکت</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>
</asp:Content>

