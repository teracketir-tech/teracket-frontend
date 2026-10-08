<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="OfficeEstate.aspx.cs" Inherits="OfficeEstate" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="js/Pages/OfficeEstate.js" type="text/javascript"></script>
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divUser">
        <ul>
            <li><a href="#divUser_1" >تعریف اموال جدید</a></li>
            <li><a href="#divUser_2" >اموال در اختیار پرسنل</a></li>
            <li><a href="#divUser_3" >واگذاری اموال</a></li>
        </ul>
        <div id="divUser_1">
            <div id="divAmvalNew">
                <ul>
                    <li><a href="#divAmvalNew_1" >تعریف اموال</a></li>
                    <li><a href="#divAmvalNew_2" >گزارش</a></li>
                </ul>
                <div id="divAmvalNew_1">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">نام : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtAmvalNameInfo" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                                <td align="left" width="100">جنس :
                                </td>
                                <td align="right">
                                    <input id="txtJensInfo" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">قیمت واحد (ریال) :
                                </td>
                                <td align="right">
                                    <input id="txtPriceAmvalInfo" class="InputTextLeftToRightText setcamma" style="width: 150px" type="text" placeholder="قیمت روز اموال به ریال" />
                                </td>
                                <td align="left" width="100"></td>
                                <td align="right">
                                    <input id="btnSaveAmvalInfo" type="button" value="ثبت مشخصات اموال" style="width: 135px;" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div id="divResultAmvalInfo" style="padding: 10px 0; display: none;"></div>
                </div>
                <div id="divAmvalNew_2">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">نام : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtAmvalNameSrchInfo" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                                <td align="left" width="100">جنس :
                                </td>
                                <td align="right">
                                    <input id="txtJensSrchInfo" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                   <td align="left" width="100">قیمت واحد (ریال) :
                                </td>
                                <td align="right">
                                    <input id="txtPriceAmvalSrchInfo" class="InputTextLeftToRightText setcamma" style="width: 150px" type="text" placeholder="قیمت روز اموال به ریال" />
                                </td>
                                <td align="left" width="100"></td>
                                <td align="right">
                                    <input id="btnSearchAmvalInfo" type="button" value="جستجو اموال" style="width: 135px;" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div id="divResultAmvalSrchInfo" style="padding: 10px 0; display: none;"></div>
                    <div id="pnlEditAmvalInfo" style="display: none;">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">نام : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtAmvalNameSrchInfoEdit" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">جنس :
                                </td>

                                <td align="right">
                                    <input id="txtJensSrchInfoEdit" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                               <tr>
                                <td align="left" width="100">قیمت واحد (ریال) :
                                </td>
                                <td align="right">
                                    <input id="txtPriceAmvalSrchInfoEdit" class="InputTextLeftToRightText setcamma" style="width: 150px" type="text" placeholder="قیمت روز اموال به ریال" />
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <%--<div id="divUser_2">
            <div id="divAmvalHavaleh">
                <ul>
                    <li><a href="#divAmvalHavaleh_1" >ثبت حواله اموال</a></li>
                    <li><a href="#divAmvalHavaleh_2" >گزارش</a></li>
                </ul>
                <div id="divAmvalHavaleh_1">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">نوع حواله : 
                                </td>
                                <td align="right" width="150" id="tddrpdwnHavalehKind"></td>
                                <td align="left" width="100"></td>
                                <td align="right"></td>
                            </tr>

                            <tr>
                                <td align="left" width="100">اموال : 
                                </td>
                                <td align="right" width="150" id="tddrpdwnAmvalHavaleh"></td>
                                <td align="left" width="100">تعداد اموال :
                                </td>
                                <td align="right">
                                    <input id="txtCntAmvalHavaleh" class="InputTextRightToLeftText setcamma" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="110">قیمت واحد اموال (ریال) :
                                </td>
                                <td align="right">
                                    <input id="txtPriceAmvalIHavaleh" class="InputTextLeftToRightText setcamma" style="width: 150px" type="text" />
                                </td>
                                <td align="left" width="100">توضیحات :</td>
                                <td align="right">
                                    <textarea id="txtDescHavalehAmval" class="InputTextRightToLeftText" style="width: 150px; height: 35px;" cols="5" rows="5" placeholder="اختیاری"></textarea>
                                </td>
                            </tr>

                            <tr>
                                <td align="left" width="100"></td>
                                <td align="right"></td>
                                <td align="left" width="100"></td>
                                <td align="right">
                                    <input id="btnSaveAmvalHavaleh" type="button" value="ثبت حواله اموال" style="width: 135px;" />
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div id="divAmvalHavaleh_2">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">نام : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtAmvalNameSrchInfo" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                                <td align="left" width="100">جنس :
                                </td>
                                <td align="right">
                                    <input id="txtJensSrchInfo" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">قیمت واحد (ریال) :
                                </td>
                                <td align="right">
                                    <input id="txtPriceAmvalSrchInfo" class="InputTextLeftToRightText setcamma" style="width: 150px" type="text" placeholder="قیمت روز اموال به ریال" />
                                </td>
                                <td align="left" width="100"></td>
                                <td align="right">
                                    <input id="btnSearchAmvalInfo" type="button" value="جستجو اموال" style="width: 135px;" />
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div id="divResultAmvalSrchInfo" style="padding: 10px 0; display: none;"></div>
                    <div id="pnlEditAmvalInfo" style="display: none;">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">نام : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtAmvalNameSrchInfoEdit" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">جنس :
                                </td>

                                <td align="right">
                                    <input id="txtJensSrchInfoEdit" class="InputTextRightToLeftText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">قیمت واحد (ریال) :
                                </td>
                                <td align="right">
                                    <input id="txtPriceAmvalSrchInfoEdit" class="InputTextLeftToRightText setcamma" style="width: 150px" type="text" placeholder="قیمت روز اموال به ریال" />
                                </td>
                            </tr>

                        </table>
                    </div>
                </div>
            </div>
        </div>--%>
        <div id="divUser_2">
            <div id="divAmvalPersonel">
                <ul>
                    <li><a href="#divAmvalPersonel_1" >ثبت اموال پرسنل</a></li>
                    <li><a href="#divAmvalPersonel_2" >گزارش</a></li>
                </ul>
                <div id="divAmvalPersonel_1">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">کد پرسنلی : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtSearchUserCode" class="InputTextLeftToRightText" style="width: 150px" type="text" />
                                </td>
                                <td align="left" width="100">شماره برچسب :
                                </td>
                                <td align="right">
                                    <input id="txtBarchasb" class="InputTextLeftToRightText" style="width: 150px" type="text" placeholder="اختیاری" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">اموال در اختیار : 
                                </td>
                                <td align="right" width="150" id="tddrpdwnAmvalName"></td>
                                <td align="left" width="100">قیمت واحد (ریال) :
                                </td>
                                <td align="right">
                                    <input id="txtPriceAmval" class="InputTextLeftToRightText setcamma" disabled="disabled" style="width: 150px" type="text" placeholder="قیمت روز اموال به ریال" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">تعداد اموال : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtCountAmval" class="InputTextLeftToRightText setcamma" style="width: 150px" type="text" />
                                </td>
                                <td align="left" width="100">توضیحات : 
                                </td>
                                <td align="right">
                                    <textarea id="txtDescAmval" class="InputTextRightToLeftText" style="width: 150px; height: 35px;" cols="5" rows="5" placeholder="اختیاری"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100" colspan="2">
                                    <div id="divSumPreSave" style="display: none; float: right; text-align: right;">مجموع اموال پیش ثبت : <font id="sumPriceAmvalPersonel" style="color: #ff0000;">0 ریال</font></div>
                                </td>
                                <td align="left" width="100"></td>
                                <td align="right">
                                    <input id="btnPreSaveAmval" type="button" value="پیش ثبت" style="width: 75px;" />
                                    <input id="btnNewPewSaveAmval" type="button" value="جدید" style="width: 55px;" />
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div id="divResultInfoPersonelAmval" style="display: none; padding: 10px 0;"></div>
                </div>
                <div id="divAmvalPersonel_2">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" width="100">کد پرسنلی : 
                                </td>
                                <td align="right" width="150">
                                    <input id="txtUserCodesrch" class="InputTextLeftToRightText" style="width: 150px" type="text" />
                                </td>
                                <td align="left" width="100">گروه کاری : 
                                </td>
                                <td align="right" width="150" id="tddrpdwnWorkGroupsrch"></td>
                            </tr>
                            <tr>
                                <td align="left" width="100">بخش : 
                                </td>
                                <td align="right" width="150" id="tddrpdwnBakhshsrch"></td>
                                <td align="left" width="100">شماره برچسب :
                                </td>
                                <td align="right">
                                    <input id="txtBarchasbsrch" class="InputTextLeftToRightText" style="width: 150px" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" width="100">اموال در اختیار : 
                                </td>
                                <td align="right" width="150" id="tddrpdwnAmvalNamesrch"></td>

                                <td align="left" width="100"></td>
                                <td align="right">
                                    <input id="btnsrchInfoPersonelAmval" type="button" value="جستجو" style="width: 75px;" />
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div id="divsrchPersonelInfo" style="padding: 10px 0; text-align: center;"></div>
                </div>
            </div>
        </div>
        <div id="divUser_3">
            <div id="divAmvalVagozari">
                <ul>
                    <li><a href="#divAmvalVagozari_1" >واگذاری اموال</a></li>
                    <li><a href="#divAmvalVagozari_2" >گزارش</a></li>
                </ul>
                <div id="divAmvalVagozari_1">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                              <tr>
                                <td align="left"> انتقال از اموال : 
                                </td>
                                <td align="right" >
                                  <select id="drpdwnstatusVagozar" class="InputSelectRightToLeftText" style="width:120px;">
                                      <option value="-1">انتخاب کنید</option>
                                      <option value="1">در اختیار اصلی</option>
                                      <option value="2">واگذار شده</option>
                                  </select>
                                </td>
                                <td align="left" >
                                </td>
                                <td align="right">
                                </td>
                                <td align="right">
                                </td>
                            </tr>
                            <tr>
                                <td align="left">انتقال اموال از کد پرسنلی : 
                                </td>
                                <td align="right" >
                                    <input id="txtVagozarPersonelCodeFrom" class="InputTextLeftToRightText" style="width: 114px" type="text" />
                                </td>
                                <td align="left" >به کد پرسنلی :
                                </td>
                                <td align="right">
                                    <input id="txtVagozarPersonelCodeTo" class="InputTextLeftToRightText" style="width: 114px" type="text"  />
                                </td>
                                <td align="right">
                                    <input id="btnPreSaveAmvalVagozar" type="button" value="پیش ثبت" style="width: 75px;" />
                                    <input id="btnNewPewSaveAmvalVagozar" type="button" value="جدید" style="width: 55px;" />
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div id="divResultInfoPersonelAmvalVagozar" style="display: none; padding: 10px 0;"></div>
                </div>
                <div id="divAmvalVagozari_2">
                    <div class="InputSearchBox">
                        <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                            <tr>
                                <td align="left" >کد پرسنلی : 
                                </td>
                                <td align="right" style="width:150px;">
                                    <input id="txtUserCodesrchVagozar" class="InputTextLeftToRightText" style="width: 150px" type="text" />
                                </td>
                                <td align="left" > اموال واگذار :
                                </td>
                                 <td align="right"  id="tddrpdwnAmvalVagozar">
                                </td>
                                <td align="right"  >
                                    <input id="btnsrchInfoPersonelAmvalVagozar" type="button" value="جستجو" style="width: 75px;" />
                                </td>
                            </tr>
                         
                        </table>
                    </div>

                    <div id="divsrchPersonelInfoVagozar" style="padding: 10px 0; text-align: center;"></div>
                </div>
            </div>

        </div>


    </div>
</asp:Content>

