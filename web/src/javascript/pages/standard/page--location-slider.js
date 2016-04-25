$.mobile.autoInitializePage = false;

jQuery(function($) {
    var CSS_INACTIVE_CLASS = "inactive";
    var CSS_ACTIVE_CLASS = "active";
    var CSS_PREVIOUS_CLASS = "prev";
    var CSS_NEXT_CLASS = "next";
    var CSS_CURRENT_CLASS = "current";
    var CSS_FLIPPED_CLASS = "flipped";
    var CSS_WRAPPER_PADDING = 80;
    var CSS_TABLET_BREAKPOINT = 768;
    var transitionProperty = Modernizr.csstransforms ? "transform" : "left";
    var $window = $(window);
    var windowWidth = $window.width();
    var conWidth;
    var $tileCon = $('.site-grouped-metrics');
    var $tileColumn = $('<div class="group-metric-tile-column"></div>');
    var $flipWrapper = $('<div class="flip-wrapper"></div>');
    var $flipper = $('<div class="flipper"></div>');
    var RESIZE_THROTTLE_TIME = 200
    var resizeThrottleId;

    function init() {
        if (windowWidth >= CSS_TABLET_BREAKPOINT) {
            $tileCon.addClass(CSS_ACTIVE_CLASS);
        }

        $tileCon.each(function(){
            var $con = $(this);
            $con.addClass(CSS_ACTIVE_CLASS);
            $con.wrapInner('<div class="wrapper"></div>');
            var $wrapper = $(".wrapper");
            $wrapper.wrapInner('<div class="scrollpane"></div>');
            var $scrollPane = $(".scrollpane");
            var $tiles = $con.find('.group-metric');
            var $slides;
            var curSlideIdx = 0;
            var endSlideIdx;
            var visibleSlides;
            var slideColumnWidth = 175;
            var $nav = $('<ul class="nav" />');
            var $prev = $('<div class="navi prev"><span></span></div>').appendTo($nav);
            var $next = $('<div class="navi next"><span></span></div>').appendTo($nav);

            function setEndSlideIdx() {
                conWidth = $wrapper.width();
                endSlideIdx = curSlideIdx + (Math.round(conWidth/slideColumnWidth) - 1);
            }

            function groupBrandTiles() {
                for(var i = 0; i < $tiles.length; i+=2) {
                    $tiles.slice(i, i+2).wrapAll($tileColumn);
                }
            }

            function setupSlides() {
                $slides = $('.group-metric-tile-column');
                $con.addClass('rotating-slider');
                $nav.prependTo($con);
                $nav.wrap('<div class="nav_con" />');

                var curSlideIdx = 0;
                $con.eq(curSlideIdx).addClass('current');
                $scrollPane.width(slideColumnWidth * $slides.length);
                setEndSlideIdx();
                moveSlide();

                $con.on('swipeleft', function(evt){
                    nextSlide("left");
                });

                $con.on('swiperight', function(evt){
                    nextSlide("right");
                });

                $nav.on('click', '.navi.next', function(evt){
                    nextSlide("left");
                });

                $nav.on('click', '.navi.prev', function(evt){
                    nextSlide("right");
                });

                $con.on("movestart", function(e) {
                    // allows swipe up and down on mobile
                    if ((e.distX > e.distY && e.distX < -e.distY) ||
                        (e.distX < e.distY && e.distX > -e.distY)) {
                        e.preventDefault();
                    }
                });
            }

            function nextSlide(direction) {
                if (direction == "left" && (endSlideIdx + 1) < $slides.length) {
                    curSlideIdx++;
                    endSlideIdx++;
                }
                else if (direction == "right" && curSlideIdx > 0) {
                    curSlideIdx--;
                    endSlideIdx--;
                }

                moveSlide();

                setupNav();
            }

            function resizeWrapper() {
                var containerWidth = $tileCon.closest(".prop-group").width();
                visibleSlides = Math.floor((containerWidth - CSS_WRAPPER_PADDING)/slideColumnWidth);
                $wrapper.css('max-width', (visibleSlides * slideColumnWidth));
            }

            function moveSlide() {
                var transitionValue = -(slideColumnWidth*curSlideIdx);
                if (Modernizr.csstransforms) {
                    transitionValue = "translateX(" + transitionValue + "px)";
                }
                $scrollPane.css(transitionProperty, transitionValue);
            }

            function setupNav() {
                if ((endSlideIdx + 1) >= $slides.length) $next.addClass(CSS_INACTIVE_CLASS);
                else $next.removeClass(CSS_INACTIVE_CLASS);

                if (curSlideIdx == 0) $prev.addClass(CSS_INACTIVE_CLASS);
                else $prev.removeClass(CSS_INACTIVE_CLASS);
            }

            function addResizeWatcher() {
                $window.on('resize', function() {
                    clearTimeout(resizeThrottleId);
                    resizeThrottleId = setTimeout(function() {
                        windowWidth = $window.width();

                        setEndSlideIdx();
                        resizeWrapper();
                        moveSlide();

                    }, RESIZE_THROTTLE_TIME);
                });
            }

            if ($tiles.length) {
                groupBrandTiles();
                resizeWrapper();
                setupSlides();
                addResizeWatcher();
            }
        });
    }


    init();
});