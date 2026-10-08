<%@ Page Language="C#" AutoEventWireup="true" CodeFile="login.aspx.cs" Inherits="login" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="description" content="سیستم جامع اداری شرکت پایگان" />
    <meta name="keywords" content="سامانه اداری پایگان" />
    <link rel="icon" href="images/favicon.ico" sizes="32x32" />
    <link type="text/css" rel="stylesheet" href="Css/materialize.min.css" media="screen,projection" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style type="text/css">
        html,
        body {
            height: 100%;
        }

        html {
            display: table;
            margin: auto;
        }

        body {
            display: table-cell;
            vertical-align: middle;
        }
    </style>

</head>
<body class="cyan loaded" >
    <form id="form2" runat="server">
        <div id="loader-wrapper">
            <div id="loader"></div>
            <div class="loader-section section-left"></div>
            <div class="loader-section section-right"></div>
        </div>
        <!-- End Page Loading -->
        <div id="login-page" class="row">
            <div class="col s12 z-depth-4 card-panel">
                <form class="login-form">
                    <div class="row">
                        <div class="input-field col s12 center">
                            <img src="images/logopayegan.png" class="circle responsive-img valign profile-image-login" alt="پایگان" />
                            <p class="center login-form-text">سامانه اداری پایگان</p>
                        </div>
                    </div>
                    <div class="row margin">
                        <div class="input-field col s12">
                            <i class="Small material-icons prefix">perm_identity</i>
                            <input id="UserName" type="text" />
                            <label for="UserName">نام کاربری</label>
                        </div>
                    </div>
                    <div class="row margin">
                        <div class="input-field col s12">
                            <i class="Small material-icons prefix">lock_outline</i>
                            <input id="Password" type="password" />
                            <label for="Password">رمز عبور</label>
                        </div>
                    </div>
                    <div class="row margin">
                        <div class="input-field col s6">
                            <asp:Image ID="Image3" runat="server" ImageUrl="~/CImage.aspx" Width="145" Height="60" />
                        </div>
                        <div class="input-field col s6">
                            <i class="Small material-icons prefix">visibility</i>
                            <input id="txtCaptcha" type="text" />
                            <label for="txtCaptcha" class="">متن تصویر</label>
                        </div>
                        
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <a id="submitlogin" class="waves-effect waves-light btn col s12">ورود به سامانه</a>
                        </div>
                    </div>
                    <div class="row">
                        <div id="DivError" class="input-field col s12 center-align dir-rtl" style="display: none; direction: rtl;">
                        </div>
                        <div id="DivLoading" class="input-field col s12 center-align" style="display: none;">
                            <div class="progress">
                                <div class="indeterminate"></div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>

        <div class="hiddendiv common"></div>

    </form>
    <script src="js/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/materialize.min.js"></script>
    <script src="js/Pages/Login.js" type="text/javascript"></script>
</body>

</html>
