<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="PersonelOperation.aspx.cs" Inherits="PersonelOperation" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="Css/jspc-gray.css" rel="stylesheet" />
    <script src="js/js-persian-cal.min.js" type="text/javascript"></script>
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
    <link href="Css/bootstraptimepicker.css" rel="stylesheet" />
    <script src="js/bootstrap.js" type="text/javascript"></script>
    <script src="js/bootstrapTimepicker.js" type="text/javascript"></script>
    <link href="jscss_flick_ui/jquery-ui-1.8.16.custom.css" rel="stylesheet" type="text/css" />
    <script src="jscss_flick_ui/jquery-ui-1.8.16.custom.min.js" type="text/javascript"></script>
    <script src="js/Pages/PersonelOperation.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>

    <div id="divPersonelTabs">
        <ul>
            <li><a href="#tab_1">کارکرد روزانه</a></li>
            <li><a href="#tab_2">تبدیل کارکرد/مرخصی روزانه به ماهیانه</a></li>
            <li><a href="#tab_3">کارکرد ماهانه</a></li>
            <li><a href="#tab_4">مرخصی</a></li>
            <li><a href="#tab_5">ماموریت</a></li>
        </ul>
        <div id="tab_1">
            <div id="divPersonelKarKardRozane">
                <ul>
                    <li><a href="#RozaneKarKard_1">گزارش</a></li>
                    <li><a href="#RozaneKarKard_2">بارگزاری</a></li>
                </ul>
                <div id="RozaneKarKard_1">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">از تاریخ :
                                </td>
                                <td style="text-align: right;">
                                    <asp:Label runat="server" ID="lblDateFromRozane"></asp:Label>
                                </td>
                                <td style="text-align: left;">تا تاریخ :
                                </td>
                                <td style="text-align: right;">
                                    <asp:Label runat="server" ID="lblDateToRozane"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKarkardPersonelCodeRozane" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKarkardPersonelNameRozane" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportKarkardPersonelMelliCodeRozane" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">گروه کاری :</td>
                                <td style="text-align: right;" id="tddrpdwnSearchWorkJobKindRozane"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">وضعیت :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnstatusDailyjob" class="InputSelectRightToLeftText" style="width: 153px;">
                                        <option value="-1" selected="selected">همه وضعیت ها...</option>
                                        <option value="0">محاسبه نشده</option>
                                        <option value="1">محاسبه شده</option>
                                    </select>
                                </td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportKarkardPersonelSearchRozane" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، تاریخ کارکرد روزانه می باشد</div>

                    <div id="ResultDivKarkardPersonelRozane" style="display: none; padding: 10px 0;"></div>
                </div>
                <div id="RozaneKarKard_2" class="hidetab">
                    <div style="padding: 10px 0; margin-top: 20px; color: #ffffff; height: 70px; display: inline-block; width: 100%; background-color: #7266ba !important;">
                        <div style="float: right; margin-left: 20px; margin-right: 10px;">
                            کارکرد تاریخ : 
                            <input id="pcaldateStartjobUpFileRozane" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                        </div>
                        <div style="clear: both;"></div>
                        <div style="float: right; margin-top: 10px;">فایل اکسل را انتخاب نمایید :</div>
                        <div style="float: right; margin-top: 10px;">
                            <div class="custom_file_upload" style="margin-right: 82px;">
                                <input type="text" class="file" name="file_info" id="txtUpkarkardPersonelRozane" disabled="disabled" />
                                <div class="file_upload">
                                    <input id="uploadFilekarkardPersonelRozane" type="file" onchange="changeValueUpFile('txtUpkarkardPersonelRozane','uploadFilekarkardPersonelRozane');" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div id="DivbtnSaveKarkardRozane" align="center" style="margin-top: 10px;">
                        <input type="button" value="ثبت کارکرد روزانه" onclick="UpFileKarkardRozane();" style="width: 100px;" />
                    </div>

                    <div id="DivErrorKarkardRozaneh" style="margin-top: 10px; display: none;"></div>

                    <div id="DivButtonErrorKarkardRozaneh" style="padding: 10px 0; display: none;">
                        <input id="btnExcelErrorKarkarRozaneh" type="button" value="خروجی اکسل" />
                    </div>


                </div>

            </div>
        </div>
        <div id="tab_2">
            <div align="center" style="width: 43%; padding-top: 10px; margin-left: 33px;">
                کد پرسنلی : 
                                    <input id="txtPersonelCodejobCalcRozaneh" type="text" style="width: 200px;" class="InputTextLeftToRightText" placeholder="جهت محاسبه کارکرد انفرادی،یک پرسنل وارد شود" />
            </div>
            <div align="center" style="width: 100%; padding: 10px 0;">
                از تاریخ : 
                            <input id="pcaldateStartjobCalcRozaneh" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
            </div>
            <div align="center" style="width: 100%; padding-bottom: 10px;">
                تا تاریخ : 
                            <input id="pcaldateEndjobCalcRozaneh" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
            </div>
            <div align="center" style="width: 100%; padding-bottom: 10px;">
                ماه :  
                            <select id="drpdwnMonthJobCalcRozaneh" class="InputSelectRightToLeftText" style="width: 107px;">
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
            <div align="center" style="width: 100%; padding-bottom: 10px;">
                <input id="chkKarkardRozaneh" type="checkbox" checked="checked" />
                <label for="chkKarkardRozaneh">تبدیل کارکرد روزانه به ماهیانه ؟</label>
            </div>
            <div align="center" style="width: 100%; padding-bottom: 10px;">

                <input id="chkMorakhasidRozaneh" type="checkbox" checked="checked" />
                <label for="chkMorakhasidRozaneh">تبدیل مرخصی روزانه به ماهیانه ؟</label>
            </div>
            <div align="center" style="width: 100%; padding-right: 22px;">
                <input type="button" value="محاسبه و ثبت کارکرد/مرخصی ماهانه" onclick="CalcJobMonthlyFromDaily();" />
            </div>

            <div id="DivErrorCalcKarkardMahane" style="display: none; padding-top: 10px; text-align: center;"></div>

        </div>
        <div id="tab_3">
            <div id="divPersonelKarKard">
                <ul>
                    <li><a href="#KarKard_1">گزارش</a></li>
                    <li><a href="#KarKard_2">بارگزاری</a></li>
                </ul>
                <div id="KarKard_1">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">ماه :</td>
                                <td style="text-align: right;">
                                    <select id="drpdwnMonthKarkardMahaneh" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                    <asp:Label runat="server" ID="lblMonthKarkardMahanehDate"></asp:Label>
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
                                <td style="text-align: right;" id="tddrpdwnSearchWorkJobKind"></td>
                            </tr>

                            <tr>
                                <td style="text-align: left;">نوع قرارداد :</td>
                                <td style="text-align: right;" id="tddrpdwnSearchContractKind"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportKarkardPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، سال و ماه ثبت می باشد</div>

                    <div id="ResultDivKarkardPersonel" style="display: none; padding: 10px 0;"></div>
                </div>
                <div id="KarKard_2" class="hidetab">
                    <div align="center" id="DivdrpdwnContractKind" style="padding-bottom: 10px; width: 100%">
                        <img src="Images/progressindicator.gif" />
                    </div>
                    <div align="center" style="width: 100%">
                        کارکرد ماه :  
                            <select id="drpdwnMonthJobUpFile" class="InputSelectRightToLeftText" style="width: 155px;" onchange="monthkarkardChange();">
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

                    <div id="divkarkardMonthEsfand" style="display: none;">
                        <div style="display: none; padding: 10px 0; margin-top: 20px; color: #ffffff; display: inline-block; width: 100%; height: 70px; background-color: #7266ba !important;">
                            <div style="float: right; margin-left: 20px; margin-right: 10px;">
                                کارکرد اسفند سال قبل از تاریخ : 
                            <input id="pcaldateStartjobUpFileEsfand" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                            </div>
                            <div style="float: right; margin-left: 20px;">
                                تا تاریخ : 
                            <input id="pcaldateEndjobUpFileEsfand" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />
                            </div>
                            <br />
                            <div style="clear: both;"></div>
                            <div style="float: right; margin-top: 10px;">فایل اکسل اسفند سال قبل را انتخاب نمایید :</div>
                            <div style="float: right; margin-top: 10px;">
                                <div class="custom_file_upload" style="margin-right: 82px;">
                                    <input type="text" class="file" name="file_info" id="txtUpkarkardPersonelEsfand" disabled="disabled" />
                                    <div class="file_upload">
                                        <input id="uploadFilekarkardPersonelEsfand" type="file" onchange="changeValueUpFile('txtUpkarkardPersonelEsfand','uploadFilekarkardPersonelEsfand');" />
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div id="divkarkardMonth" style="display: none;">

                        <div style="padding: 10px 0; margin-top: 20px; color: #ffffff; height: 70px; display: inline-block; width: 100%; background-color: #7266ba !important;">
                            <div style="float: right; margin-left: 20px; margin-right: 10px;">
                                کارکرد از تاریخ : 
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
                        <input type="button" value="ثبت کارکرد ماهانه" onclick="UpFileKarkard();" style="width: 100px;" />
                    </div>

                    <div id="DivErrorKarkardMahane" style="margin-top: 10px; display: none;"></div>
                </div>

            </div>
        </div>
        <div id="tab_4">
            <div id="divPersonelMorakhsi">
                <ul>
                    <%--<li><a href="#Morakhasi_1">ثبت</a></li>--%>
                    <li><a href="#Morakhasi_1">ثبت نوع مرخصی</a></li>
                    <li><a href="#Morakhasi_2">مرخصی روزانه</a></li>
                    <li><a href="#Morakhasi_3">مرخصی ماهیانه</a></li>
                </ul>

                <div id="Morakhasi_1">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">نوع مرخصی :
                                </td>
                                <td style="text-align: right; width: 100px;">
                                    <input id="txtNamekindMorakhasi" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>

                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnSaveNewMorakhasiKind" type="button" style="width: 148px;" value="ثبت نوع مرخصی" />
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div id="ResultDivMorakhasiKindNew" style="padding: 10px 0;"></div>

                    <div id="pnlEditMorakhasiKindCode" style="display: none;">
                        <div id="DivEditMorakhasiKindHide" style="display: none;"></div>
                        <table style="width: 100%; direction: rtl;">
                            <tr>
                                <td style="text-align: left;">نوع مرخصی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtNameMorakhasiKindNewEdit" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div id="Morakhasi_2">
                    <div id="divPersonelMorakhsiRozaneh">
                        <ul>
                            <li><a href="#MorakhasiRozaneh_1">گزارش</a></li>
                            <li><a href="#MorakhasiRozaneh_2">بارگزاری</a></li>
                        </ul>
                        <div id="MorakhasiRozaneh_1">
                            <div class="InputSearchBox">
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="text-align: left;">از تاریخ :
                                        </td>
                                        <td style="text-align: right;">
                                            <asp:Label runat="server" ID="lblDateFromMorakhasiRozaneh"></asp:Label>
                                        </td>
                                        <td style="text-align: left;">تا تاریخ :
                                        </td>
                                        <td style="text-align: right;">
                                            <asp:Label runat="server" ID="lblDateToMorakhasiRozaneh"></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: left;">کد پرسنلی :
                                        </td>
                                        <td style="text-align: right;">
                                            <input id="txtReporthPersonelCodeMorakhasiRozane" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                        </td>
                                        <td style="text-align: left;">نام کارمند :
                                        </td>
                                        <td style="text-align: right;">
                                            <input id="txtReportdPersonelNameMorakhasiRozane" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: left;">کد ملی :
                                        </td>
                                        <td style="text-align: right;">
                                            <input id="txtReportPersonelMelliCodeMorakhasiRozane" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                        </td>
                                        <td style="text-align: left;">گروه کاری :</td>
                                        <td style="text-align: right;" id="tddrpdwnSearchWorkJobKindMorakhasiRozane"></td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: left;">نوع مرخصی :</td>
                                        <td style="text-align: right;" id="tddrpdwnSearchMorakhsiKindRozane"></td>
                                        <td style="text-align: left;"></td>
                                        <td style="text-align: right;">
                                            <input id="btnReportPersonelSearchMorakhasiRozane" type="button" style="width: 148px;" value="جستجو" />
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div align="right">* مرتب سازی براساس ، تاریخ مرخصی روزانه می باشد</div>

                            <div id="ResultDivPersonelMorakhasiRozane" style="display: none; padding: 10px 0;"></div>
                        </div>
                        <div id="MorakhasiRozaneh_2" class="hidetab">
                            <div align="center" style="width: 100%;">
                                تاریخ مرخصی :  
                            <input id="pcaldateMorakhasiRozaneh" type="text" style="width: 100px;" class="InputTextRightToLeftText pdate" />

                            </div>
                            <div align="center" style="width: 100%; padding: 10px 0;" id="DivdrpdwnStatusMorakhasiRozaneh">
                            </div>

                            <div id="divMorakhasiRozaneh" style="display: none;">

                                <div style="padding: 10px 0; margin-top: 20px; color: #ffffff; height: 45px; display: inline-block; width: 100%; background-color: #7266ba !important;">
                                    <div style="clear: both;"></div>
                                    <div style="float: right; margin-top: 10px;">فایل اکسل را انتخاب نمایید :</div>
                                    <div style="float: right; margin-top: 10px;">
                                        <div class="custom_file_upload" style="margin-right: 82px;">
                                            <input type="text" class="file" name="file_info" id="txtUpMorakhasiRozanehPersonel" disabled="disabled" />
                                            <div class="file_upload">
                                                <input id="uploadFileMorakhasiRozanehPersonel" type="file" onchange="changeValueUpFile('txtUpMorakhasiRozanehPersonel','uploadFileMorakhasiRozanehPersonel');" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="DivbtnSaveMorakhasiRozaneh" align="center" style="margin-top: 10px; display: none;">
                                <input type="button" value="ثبت مرخصی روزانه" onclick="UpFileMorakhasiRozaneh();" style="width: 100px;" />
                            </div>

                            <div id="DivErrorKarkardMorakhasiRozaneh" style="margin-top: 10px; display: none;"></div>
                        </div>
                    </div>
                </div>
                <div id="Morakhasi_3">
                    <div id="divPersonelMorakhsiMahianeh">
                        <ul>
                            <li><a href="#MorakhasiMahianeh_1">گزارش</a></li>
                            <li><a href="#MorakhasiMahianeh_2">بارگزاری</a></li>
                        </ul>
                        <div id="MorakhasiMahianeh_1">
                            <div class="InputSearchBox">
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="text-align: left;">ماه :</td>
                                        <td style="text-align: right;">
                                            <select id="drpdwnMonthMorakhasiMahaneh" class="InputSelectRightToLeftText" style="width: 154px;">
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
                                            <asp:Label runat="server" ID="lblMorakhsiMonthDate"></asp:Label>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="text-align: left;">کد پرسنلی :
                                        </td>
                                        <td style="text-align: right;">
                                            <input id="txtReportMorakhasiPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                        </td>
                                        <td style="text-align: left;">نام کارمند :
                                        </td>
                                        <td style="text-align: right;">
                                            <input id="txtReportMorakhasiPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: left;">کد ملی :
                                        </td>
                                        <td style="text-align: right;">
                                            <input id="txtReportMorakhasiPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                        </td>
                                        <td style="text-align: left;">نوع مرخصی :</td>
                                        <td style="text-align: right;" id="tddrpdwnSearchMorakhsiKind"></td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: left;">گروه کاری :</td>
                                        <td style="text-align: right;" id="tddrpdwnSearchMorakhasiWorkGroupKind"></td>
                                        <td style="text-align: left;"></td>
                                        <td style="text-align: right;">
                                            <input id="btnReportMorakhasiPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div align="right">* مرتب سازی براساس ، سال و ماه ثبت می باشد</div>

                            <div id="ResultDivMorakhasiPersonel" style="display: none; padding: 10px 0;"></div>
                        </div>
                        <div id="MorakhasiMahianeh_2" class="hidetab">
                            <div align="center" style="width: 100%;">
                                مرخصی ماه :  
                            <select id="drpdwnMonthMorakhasiUpFile" class="InputSelectRightToLeftText" style="width: 150px;" onchange="monthMorakhasiChange();">
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
                            <div align="center" style="width: 100%; padding: 10px 0;" id="DivdrpdwnStatusMorakhasi">
                            </div>

                            <div id="divMorakhasiMonth" style="display: none;">

                                <div style="padding: 10px 0; margin-top: 20px; color: #ffffff; height: 45px; display: inline-block; width: 100%; background-color: #7266ba !important;">
                                    <div style="clear: both;"></div>
                                    <div style="float: right; margin-top: 10px;">فایل اکسل را انتخاب نمایید :</div>
                                    <div style="float: right; margin-top: 10px;">
                                        <div class="custom_file_upload" style="margin-right: 82px;">
                                            <input type="text" class="file" name="file_info" id="txtUpMorakhasiPersonel" disabled="disabled" />
                                            <div class="file_upload">
                                                <input id="uploadFileMorakhasiPersonel" type="file" onchange="changeValueUpFile('txtUpMorakhasiPersonel','uploadFileMorakhasiPersonel');" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="DivbtnSaveMorakhasi" align="center" style="margin-top: 10px; display: none;">
                                <input type="button" value="ثبت مرخصی ماهانه" onclick="UpFileMorakhasi();" style="width: 100px;" />
                            </div>
                            <div id="DivErrorKarkardMorakhasi" style="margin-top: 10px; display: none;"></div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        <div id="tab_5">
            <div id="divPersonelMisson">
                <ul>
                    <li><a href="#Misson_1">ثبت</a></li>
                    <li><a href="#Misson_2">گزارش</a></li>
                </ul>
                <div id="Misson_1">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: left;">کد پرسنلی :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtMamoriatPersonelCode" type="text" style="width: 170px;" class="InputTextLeftToRightText" />
                            </td>
                            <td style="text-align: left;">نوع ماموریت :
                            </td>
                            <td style="text-align: right;" id="TddrpdwnMamoriatKind">
                                <img src='images/loading.gif' />
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">تاریخ شروع :
                            </td>
                            <td style="text-align: right;">
                                <input id="pcaldateStartMamoriatDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateStartMorakhasiDate');" />
                            </td>
                            <td style="text-align: left;">تاریخ پایان :
                            </td>
                            <td style="text-align: right;">
                                <input id="pcaldateEndMamoriatDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" onfocus="ResetErrorIconInput('pcaldateEndMorakhasiDate');" />
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">ساعت شروع :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtStartTimeMamoriat" type="text" style="width: 76px;" class="InputTextLeftToRightText" />
                            </td>
                            <td style="text-align: left;">ساعت پایان :
                            </td>
                            <td style="text-align: right;">
                                <input id="txtEndTimeMamoriat" type="text" style="width: 76px;" class="InputTextLeftToRightText" />
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">توضیحات :
                            </td>
                            <td style="text-align: right;">
                                <textarea id="txtMamoriatDescription" style="width: 170px; height: 60px;" class="InputTextRightToLeftText"></textarea>
                            </td>
                            <td style="text-align: left;"></td>
                            <td style="text-align: right;">
                                <input id="btnSaveMamoriat" type="button" value="ثبت ماموریت" />
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="Misson_2">
                    <div class="InputSearchBox">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: left;">از تاریخ :
                                </td>
                                <td style="text-align: right;">
                                    <%--<input id="pcalReportdateFromDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />--%>
                                    <asp:Label runat="server" ID="lblMissonDateFrom"></asp:Label>
                                </td>
                                <td style="text-align: left;">تا تاریخ :
                                </td>
                                <td style="text-align: right;">
                                    <%--<input id="pcalReportdateToDate" type="text" style="width: 170px;" class="InputTextRightToLeftText pdate" />--%>
                                    <asp:Label runat="server" ID="lblMissonDateTo"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد پرسنلی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMissonPersonelCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نام کارمند :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMissonPersonelName" type="text" style="width: 148px;" class="InputTextRightToLeftText" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: left;">کد ملی :
                                </td>
                                <td style="text-align: right;">
                                    <input id="txtReportMissonPersonelMelliCode" type="text" style="width: 148px;" class="InputTextLeftToRightText" />
                                </td>
                                <td style="text-align: left;">نوع ماموریت :</td>
                                <td style="text-align: right;" id="tddrpdwnSearchMissonKind"></td>
                            </tr>
                            <tr>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;"></td>
                                <td style="text-align: left;"></td>
                                <td style="text-align: right;">
                                    <input id="btnReportMissonPersonelSearch" type="button" style="width: 148px;" value="جستجو" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div align="right">* مرتب سازی براساس ، تاریخ ثبت می باشد</div>

                    <div id="ResultDivMissonPersonel" style="display: none; padding: 10px 0;"></div>
                </div>
            </div>

        </div>

    </div>
    <div id="pnlEditKarkardRozaneh" style="display: none;">
        <table style="width: 100%; direction: rtl;">

            <tr>
                <td style="text-align: left; width: 100px;">کد پرسنلی :
                </td>
                <td style="text-align: right;" id="RozanehCodeEdit"></td>
            </tr>
            <tr>
                <td style="text-align: left;">نام کارمند :
                </td>
                <td style="text-align: right;" id="RozanehNameEdit"></td>
            </tr>
            <tr>
                <td style="text-align: left;">گروه کاری :
                </td>
                <td style="text-align: right;" id="RozanehWorkGroupEdit"></td>
            </tr>
            <tr id="trMonthYearRozaneh">
                <td style="text-align: left;">ماه/سال :
                </td>
                <td style="text-align: right;" id="RozanehMonthYearEdit"></td>
            </tr>
            <tr id="trdateKarardRozaneh">
                <td style="text-align: left;">تاریخ کارکرد :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="pcaldateKarardEdit" class="InputTextLeftToRightText pdate" />
                </td>
            </tr>
            <tr id="trStartKarardRozaneh">
                <td style="text-align: left;">ساعت شروع کارکرد :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtStartKarardEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr id="trEndKarardRozaneh">
                <td style="text-align: left;">ساعت پایان کارکرد :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtEndKarardEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr id="trSumKarardRozaneh">
                <td style="text-align: left;">مجموع ساعت کارکرد :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtSumKarardEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">اضافه کار :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtEzafekarEdit" class="InputTextLeftToRightText" />

                </td>
            </tr>
            <tr>
                <td style="text-align: left;">اضافه کار ویژه:
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtEzafekarVijehEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">اضافه کار در ماموریت:
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtEzafekarInMissionEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">جمعه کار :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtJomehkarEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">تعطیل کار :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtTatilkarEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">تاخیر :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtTakhirEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>

            <tr>
                <td style="text-align: left;">تعجیل :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtTajilEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr id="trGhibatRozaneh">
                <td style="text-align: left;">غیبت :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtGhibatEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr id="trGhibatMonthly">
                <td style="text-align: left;">غیبت :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtGhibatMonthlyEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr id="trMamoriatRozaneh">
                <td style="text-align: left;">ماموریت :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtMamoriatEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr id="trMamoriatMonthly">
                <td style="text-align: left;">ماموریت :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtMamoriatMonthlyEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">خروج غیرمجاز :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtExitJobEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>
            <tr id="trCountFaraiandMonthly">
                <td style="text-align: left;">تعداد فرآیند :
                </td>
                <td style="text-align: right;">
                    <input type="text" id="txtCountFaraiandMonthlyEdit" class="InputTextLeftToRightText" />
                </td>
            </tr>

        </table>
    </div>
</asp:Content>

