<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true"
    CodeFile="UserManager.aspx.cs" Inherits="UserManager" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="js/Pages/UserManager.js" type="text/javascript"></script>
    <link href="jscss_multiSelect/multiselect.css" rel="stylesheet" type="text/css" />
    <script src="jscss_multiSelect/multiselect.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <asp:Label ID="lblAccess" runat="server" Text="" CssClass="Accesslbl_hide"></asp:Label>
    <div id="divUser">
        <ul>
            <li><a href="#divUser_1" style="font-family: Tahoma">کاربران</a></li>
            <li><a href="#divUser_2" style="font-family: Tahoma">نقش ها</a></li>
        </ul>
        <div id="divUser_1">
            <div class="InputSearchBox">
                <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                    <tr>
                        <td align="left" width="100">کد ملی کاربر :
                        </td>
                        <td align="right" width="150">
                            <input id="txtSearchUserCode" class="InputTextLeftToRightText" style="width: 150px"
                                type="text" />
                        </td>
                        <td align="left" width="100">وضعیت :
                        </td>
                        <td align="right">
                            <select id="drpdwnUserStatus" name="D2" style="width: 150px" class="InputSelectRightToLeftText">
                                <option value="-1">تمام وضعیت ها</option>
                                <option value="1">فعال</option>
                                <option value="0">غیر فعال</option>
                            </select>
                        </td>
                        <td align="right">
                            <input id="btnUserSearch" type="button" value="جستجو" style="width: 135px;" />
                        </td>
                        <td align="right">
                            <img alt="" src="Images/user_add.png" onclick="ShowInsertUserBox();" style="cursor: pointer" />
                        </td>
                    </tr>
                </table>
            </div>
            <div id="grdviwGetUser">
            </div>
            <div id="divUserInsertBox" style="display: none">
                <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                    <tr>
                        <td align="left" width="100">کد ملی کاربر :
                        </td>
                        <td align="right">
                            <input id="txtUserCode" class="InputTextLeftToRightText" style="width: 150px" type="text" />&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td align="left" width="100">نام کاربر :
                        </td>
                        <td align="right">
                            <input id="txtUserName" class="InputTextRightToLeftText" type="text" style="width: 150px" />
                        </td>
                    </tr>
                    <tr>
                        <td align="left" width="100">نقش :
                        </td>
                        <td align="right" id="DivdrpdwnRole"></td>
                    </tr>
                    <tr>
                        <td align="left" width="100">کلمه عبور :
                        </td>
                        <td align="right">
                            <input id="txtUserPass" class="InputTextLeftToRightText" type="text" style="width: 150px" />
                        </td>
                    </tr>
                </table>
                <div id="msgInsertNewUsers" align="center" style="padding: 10px 0; display: none;"></div>
            </div>
            <div id="divUserAccess" style="display: none">
                 <div id="UserID" style="display: none">
                    </div>
                <div id="grdviwGetFunc" dir="rtl" align="center">
                </div>
            </div>
        </div>
        <div id="divUser_2">
            <div class="InputSearchBox">
                <table align="center" cellpadding="2" class="ui-accordion" dir="rtl">
                    <tr>
                        <td align="left" width="100">نام نقش :
                        </td>
                        <td align="right" width="160">
                            <input id="txtRoleNames" type="text" value="" class="InputTextRightToLeftText" style="width: 150px;" />
                        </td>
                        <td align="right" width="120">
                            <input id="btnNewInsertRoles" type="button" value="ثبت نقش جدید" />
                        </td>
                        <td align="right" id="loadingInsertRoles"></td>
                    </tr>
                </table>

            </div>
            <div id="grdviwRoles">
            </div>
            <div id="divRoleBox" style="display: none">
                <div id="DivFuncCode" style="display: none">
                </div>
                <div id="grdviewRoleAccess" dir="rtl" align="center">
                </div>
            </div>
        </div>
    </div>
</asp:Content>
