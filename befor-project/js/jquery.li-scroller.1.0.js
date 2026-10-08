jQuery.fn.liScroll = function (settings) {
    settings = jQuery.extend({
        travelocity: 0.07
    }, settings);
    return this.each(function () {
        var $strip = jQuery(this);
        $strip.addClass("newsticker")
        var stripWidth = 1;
        $strip.find("li").each(function (i) {
            stripWidth += jQuery(this, i).outerWidth(true); 
        });
        var temp = stripWidth;
        if (stripWidth < 740) stripWidth=740
        var $mask = $strip.wrap("<div class='mask'></div>");
        var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");
      //  var containerWidth = $strip.parent().parent().width();
        var containerWidth = 1000;
        if (stripWidth < 740) containerWidth = temp;
        $strip.width(stripWidth);
        var totalTravel = stripWidth + containerWidth;
        var defTiming = totalTravel / settings.travelocity;
        function scrollnews(spazio, tempo) {
            if ($("#ticker01").css("left") == "-900px") $strip.css("left", stripWidth);
            $strip.animate({ left: '-=' + spazio }, tempo, "linear", function () { $strip.css("left", stripWidth); scrollnews(totalTravel, defTiming); });
        }
        scrollnews(totalTravel, defTiming);
        $strip.hover(function () {
            jQuery(this).stop();
        },
				function () {
				    var offset = jQuery(this).offset();
				    var residualSpace = offset.left + stripWidth;
				    var residualTime = residualSpace / settings.travelocity;
				    scrollnews(residualSpace, residualTime);
				});
    });
};