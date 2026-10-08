<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="OrgChart.aspx.cs" Inherits="OrgChart" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <link href="Css/orgchart.css" rel="stylesheet" />
    <script src="js/orgchart-r2l.js" type="text/javascript"></script>
    <script src="js/orgchart-main.js" type="text/javascript"></script>
    <style type="text/css">
        .long-name {
            font-size: 12px;
        }

        div.orgChart div.node.level0,
        div.orgChart div.node.level2 {
            background-color: rgb(244, 227, 116);
        }

        .hide {
            display: none;
        }
    </style>
    <script src="js/Pages/OrgChart.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <ul id="chartsource" class="hide">
        <li>Initech
                        <ul>
                            <li>Bill Lumbergh
                        <ul>
                            <li>Software
                        <ul>
                            <li>Peter Gibbons</li>
                            <li>Michael Bolton</li>
                            <li class="long-name">Samir Nagheenanajar</li>
                        </ul>
                            </li>
                            <li>Collation
                        <ul>
                            <li>Milton Waddams</li>
                        </ul>
                            </li>
                            <li>Consultants
                        <ul>
                            <li>Bob Slydell</li>
                            <li>Bob Porter</li>
                        </ul>
                            </li>
                        </ul>
                            </li>
                        </ul>
        </li>

    </ul>
    <div id="chart">
    </div>

</asp:Content>

