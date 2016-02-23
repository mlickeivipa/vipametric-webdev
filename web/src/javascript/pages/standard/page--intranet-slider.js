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
    var $tileCon = $('.agency-brand-tiles');
    var $tileColumn = $('<div class="agency-brand-tile-column"></div>');
    var $flipWrapper = $('<div class="flip-wrapper"></div>');
    var $flipper = $('<div class="flipper"></div>');
    var RESIZE_THROTTLE_TIME = 200
    var resizeThrottleId;

    function init() {
        swapBrandLogo();

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
            var $tiles = $con.find('.agency-brand-tile');
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

                setupTileFlip();
            }

            function relinkMontejoLogo() {
                var $montejoTileLink = $tiles.eq(11).find(".brand-actions a span");
                $montejoTileLink.on('click', function(evt){
                    evt.preventDefault();
                    evt.stopPropagation();
                    window.location = "https://vipametric-qa.venturetech.net/cardenas/dashboard/5";
                });
            }

            function setupTileFlip() {
                $tiles.each(function(idx, tile){
                    var $tile = $(tile);
                    var $brandDataCon = $('<div class="brand-data"></div>');
                    var $img = $tile.find('img').clone();
                    var $brandLogo = $('<div class="img"></div>').append($img);
                    var $eventsCompleted = '<div class="title">Events Completed</div><div class="value">' + $tile.data('eventsCompletedCount') + '</div>';
                    var $campaignCount = '<div class="title">Campaign Count</div><div class="value">' + $tile.data('campaignCount') + '</div>';
                    $tile.wrap($flipWrapper);
                    $brandDataCon.append($brandLogo).append($eventsCompleted).append($campaignCount).insertAfter($tile);

                    $tile.closest('.flip-wrapper').wrapInner($flipper);
                });

                $('.flip-wrapper').on('click', function(evt){
                   $(this).toggleClass(CSS_FLIPPED_CLASS);
                });
            }

            function setupSlides() {
                $slides = $('.agency-brand-tile-column');
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

                //setOrderClasses();

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

            function setOrderClasses() {
                /*if ((curSlideIdx + 1) >= $slides.length) {
                    $slides.removeClass(CSS_NEXT_CLASS);
                }
                else {
                    $slides.eq(curSlideIdx + 1).addClass(CSS_NEXT_CLASS).siblings().removeClass(CSS_NEXT_CLASS);
                }

                if (curSlideIdx == 0) {
                    $slides.removeClass(CSS_PREVIOUS_CLASS);
                }
                else {
                    $slides.eq(curSlideIdx - 1).addClass(CSS_PREVIOUS_CLASS).siblings().removeClass(CSS_PREVIOUS_CLASS);
                }

                var curIndexes = [];
                curIndexes.push(curSlideIdx);
                for (var i = 1; i < visibleSlides; i++) {
                    curIndexes.push(curSlideIdx + i);
                }

                $slides.filter(function(index) {
                    if (curIndexes.indexOf(index) > -1) {
                        return $slides.eq(index);
                    }
                }).addClass(CSS_CURRENT_CLASS).siblings().removeClass(CSS_CURRENT_CLASS);*/
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

            relinkMontejoLogo();
            groupBrandTiles();
            resizeWrapper();
            setupSlides();
            addResizeWatcher();
        });
    }

    function swapBrandLogo() {
        $('.agency-brand-logo-editor').find("img").attr('src', "/_resources/dyn/files/2828036z484752a4/_fn/ai-logomark.png");
    }


    init();
});