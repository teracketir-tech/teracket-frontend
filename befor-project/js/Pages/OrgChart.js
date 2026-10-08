$(document).ready(function () {

    GetOrgchart();
});

//================================================================
function GetOrgchart() {
    $("#CheckOut").fadeIn();
    $("#Loading").fadeIn();

    $("#chart").html("<img src='Images/progressindicator.gif' />");
    $("#chart").show();

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        data: { i: 1 },
        url: "PostBack/PBOrgChart.ashx",
        success: function (data) {



            var li = "<li id='{id}' {class}>{node}";
            var endli = "</li>";
            var ul = "<ul>";
            var endul = "</ul>";

            var row = "", allrow = "", subrow = "";
            var t = 0;
            var orgcode = 0;
            var check = 0;
            //=============================== ijad node asli =================================
            $.each(data, function (index) {
                if (this['numOrgChartParentID'] == null) {
                    orgcode = this['numOrgChartCode'];
                    row = li.replaceAll("{node}", this['strOrgChartName']);
                    row = row.replaceAll("{class}", " class='long-name' ");
                    row = row.replaceAll("{id}", this['numOrgChartCode']);
                    allrow = allrow + row;
                    $.each(data, function (index) {
                        if (this['numOrgChartParentID'] == orgcode) {
                            row = li.replaceAll("{node}", this['strOrgChartName']);
                            row = row.replaceAll("{class}", " class='long-name' ");
                            row = row.replaceAll("{id}", this['numOrgChartCode']);
                            subrow = subrow + row;
                            check = 1;
                        }
                    });

                    if (check == 1) {
                        check = 0;
                        allrow = allrow + ul + subrow + endul;
                        subrow = "";
                    }
                    check = 2;
                }
            });
            //=================================== agar node asli dasht zir shaskheha ro bar asase on benevise
            if (check == 2) {
                allrow = allrow + endli;

                $("#chartsource").html(allrow);

                check = 0;
                $.each(data, function (index) {
                    if (this['numOrgChartParentID'] != null) {
                        orgcode =  this['numOrgChartCode'];
                        $.each(data, function (index) {
                            if (this['numOrgChartParentID'] == orgcode) {
                                row = li.replaceAll("{node}", this['strOrgChartName']);
                                row = row.replaceAll("{class}", " class='long-name' ");
                                row = row.replaceAll("{id}", this['numOrgChartCode']);
                                subrow = subrow + row;
                                check = 1;
                            }
                        });

                        if (check == 1) {
                            check = 0;
                            subrow= ul + subrow + endul;

                            var info = $("#" + orgcode.toString()).html().trim();
                            $("#" + orgcode.toString()).html("");
                            $("#" + orgcode.toString()).append(info + subrow);
                            subrow = "";
                        }
                    }
                    t = 1;
                });
            }

            //-------------------------------------------------------------------------------
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
            $("#chart").html("");
            $("#chart").show();
            if (t == 1) {
                //$("#chartsource").html(allrow);
                $("#chartsource").orgChart({ container: $("#chart") });
            }
            else {
                $("#chart").html("<table class='errorMsg' align='center' cellpadding='2' width='200' dir='rtl'><tr><td width='50'><img alt='خطا' src='Images/Notfound.png' /></td><td>اطلاعاتی یافت نشد</td></tr></table>");
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $("#CheckOut").fadeOut();
            $("#Loading").fadeOut();
            $("#chart").hide();
            $("#chart").html("");
            ShowAlert("خطا در بازیابی اطلاعات ، دوباره امتحان کنید");
        }
    });
}