jQuery(function($) {

    var $window = $(window);
    var windowWidth = $window.width();
    var transitionProperty = Modernizr.csstransforms ? "transform" : "left";
    var RESIZE_THROTTLE_TIME = 200;
    var resizeThrottleId;

    //Class name constants
    var CLASSNAME_SHOW = "show",
        CLASSNAME_LOADING_CONTAINER = ".loading-container";

    //Things we need
    var $searchParamsContainer = $(".dashboard-params"),
        $dashboardContainer = $(".dashboard-container"),
        $messageContainer = $dashboardContainer.find(".dashboard-message-container"),
        $dashboardSections = $dashboardContainer.find(".dashboard-section"),
        $searchActions = $searchParamsContainer.find(".search-params-actions"),
        $searchBtn = $searchActions.find(".search-btn"),
        $resetBtn = $searchActions.find(".reset-btn"),
        $loadingContainer = $dashboardContainer.find(CLASSNAME_LOADING_CONTAINER);

    //Messages Constants
    var $MESSAGE_ERROR_GENERIC = $messageContainer.find(".error-generic"),
        $MESSAGE_ERROR_PERMISSIONS = $messageContainer.find(".error-permissions"),
        $MESSAGE_NO_DATA = $messageContainer.find(".no-data");

    //Message Type Constants
    var MESSAGE_TYPE_ERROR_GENERIC = "GENERIC_ERROR",
        MESSAGE_TYPE_ERROR_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
        MESSAGE_TYPE_NO_DATA = "NO_DATA";

    /**
     * Will display a message to the user based on the message type you pass in. Will display nothing if null is passed in.
     *
     * @param messageType Message type to display.
     */
    function displayMessage(messageType) {
        if (messageType == null) {
            hideAllMessages();
            return;
        }

        switch (messageType) {
            case MESSAGE_TYPE_NO_DATA:
                $MESSAGE_NO_DATA.addClass(CLASSNAME_SHOW);
                break;
            case MESSAGE_TYPE_ERROR_PERMISSIONS:
                $MESSAGE_ERROR_PERMISSIONS.addClass(CLASSNAME_SHOW);
                break;
            case MESSAGE_TYPE_ERROR_GENERIC:
                $MESSAGE_ERROR_GENERIC.addClass(CLASSNAME_SHOW);
                break;
            default:
                $MESSAGE_ERROR_GENERIC.addClass(CLASSNAME_SHOW);
                break;
        }
    }

    /**
     * Will hide all messages in the message container.
     *
     */
    function hideAllMessages() {
        $MESSAGE_ERROR_GENERIC.removeClass(CLASSNAME_SHOW);
        $MESSAGE_ERROR_PERMISSIONS.removeClass(CLASSNAME_SHOW);
        $MESSAGE_NO_DATA.removeClass(CLASSNAME_SHOW);
    }

    /**
     * Will show the loading message and add it to the target container if needed.
     *
     * @param $target True/false value for showing the loading message.
     */
    function addLoadingMessage($target) {
        if ($target) {
            var $loadingClone = $target.find(CLASSNAME_LOADING_CONTAINER);
            if (!$loadingClone.length) {
                $loadingClone = $loadingContainer.clone();
            }
            $target.prepend($loadingClone);
            $loadingClone.addClass(CLASSNAME_SHOW);
        }
    }

    /**
     * Will hide the loading message. WONT REMOVE THE
     *
     * @param $target
     */
    function hideLoadingMessage($target) {
        if ($target) {
            var $loadingClone = $target.find(CLASSNAME_LOADING_CONTAINER);
            $loadingClone.removeClass(CLASSNAME_SHOW);
        }
    }

    /**
     * Will friendly-fy the given number and post fix it with shorthand for the numbers size
     *
     * @param number Number to friendly-fy
     * @returns {*} A friendly-fied version of the number
     */
    function friendlyNumberFormat(number) {
        if (number > 1000000000000) {
            return Math.round(number / 1000000000000) + 't';
        } else if (number > 1000000000) {
            return Math.round(number / 1000000000) + 'b';
        } else if (number > 1000000) {
            return Math.round(number / 1000000) + 'm';
        } else if (number > 1000) {
            return Math.round(number / 1000) + 'k';
        } else {
            return number;
        }
    }

    function getScaledMin(targetNumber) {
        return targetNumber - 100;
    }

    function doCountUpAction($target, number) {

        var min = getScaledMin(number);

        var friendlyNumber = friendlyNumberFormat(number)+'';
        if (friendlyNumber)
            var postFix = friendlyNumber.match(/[a-z]/);

        if (postFix) {
            var $valueWrap = $('<span class="value-wrapper"></span>');
            $target.append($valueWrap, '<span class="post-fix-count">' + postFix + '</span>');
            $target = $valueWrap;
            number = parseInt(friendlyNumber.replace(postFix.toString(), ''));
            min = getScaledMin(number);
        }

        if (min < 0) {
            min = 0;
        }

        jQuery({ Counter: min }).animate({ Counter: number }, {
            duration: 1500,
            easing: 'swing',
            step: function () {
                $target.text(Math.ceil(this.Counter));
            }
        });

    }

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // red
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // green
            ],
            tickPositioner: function () {
                return [0, this.max];
            },
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16,
                useHTML: true,
                formatter: function () {
                    return friendlyNumberFormat(this.value);
                }
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    var semiCircleDonutOptions = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            align: 'center',
            verticalAlign: 'middle',
            y: 50
        },
        tooltip: {
            pointFormat: '<b>{point.y:.lf}</b>%'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                    distance: -15,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                showInLegend: true,
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        }
    };

    var basicColumnOptions = {
        chart: {
            type: 'column'
        },
        yAxis: {
            min: 0
        },
        xAxis: {
            labels: {
                enabled: false
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px"></span><table>',
            footerFormat: '</table>',
            shared: false,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        }
    };

    var stackedColumnOptions = {
        chart: {
            type: 'column'
        },
        yAxis: {
            min: 0
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px"></span><table>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointPadding: 0.2,
                borderWidth: 0
            }
        }
    };

    var pieWithLegendOptions = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y:.lf}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        }
    };

    function renderNumeric($container, label, value, description, numericType) {
        var $label, $value, $description;
        $container.empty();

        switch (numericType) {
            case "percentage":
                $label = $('<div class="data-label">'+label+'</div>');
                $value = $('<div class="data-value">'+value+'<span class="percent-sign">%</span></div>');
                if(description != null)
                    $description = $('<div class="data-description">'+description+'</div>');
                break;

            case "monetary":
                $label = $('<div class="data-label">'+label+'</div>');
                $value = $('<div class="data-value"><span class="monetary-sign">$</span>'+value+'</div>');
                if(description != null)
                    $description = $('<div class="data-description">'+description+'</div>');
                break;

            case "integer":
            default :
                $label = $('<div class="data-label">'+label+'</div>');
                $value = $('<div class="data-value">'+value+'</div>');
                if(description != null)
                    $description = $('<div class="data-description">'+description+'</div>');
                break;
        }

        $container.append($label, $value, $description);
    }

    function renderBrandTotals($section, data){
        renderNumeric($section.find(".ba-product-spend"), "Total BA Product Spend", data.product_spend.value, null, "monetary");
        renderNumeric($section.find(".average-event-spend"), "Average Spend Per Event", data.average_product_spend.value, null, "monetary");

        $section.find(".customer-engagements").highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: data.customer_engagements.goal,
                title: {
                    text: "Direct Engagements"
                }
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: "Direct Engagements",
                    data: [data.customer_engagements.value],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">Direct Engagements</span></div>'
                    },
                    tooltip: {
                        valueSuffix: ' Engagements'
                    }
                }
            ]
        }));

        $section.find(".events-completed").highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: data.events_completed.goal,
                title: {
                    text: "Events"
                }
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: "Completed",
                    data: [data.events_completed.value],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">Completed</span></div>'
                    },
                    tooltip: {
                        valueSuffix: ' Events'
                    }
                }
            ]
        }));

        $section.find(".samples-given").highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: data.samples_given.goal,
                title: {
                    text: "Samples"
                }
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: "Samples Given",
                    data: [data.samples_given.value],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">Samples Given</span></div>'
                    },
                    tooltip: {
                        valueSuffix: ' Samples'
                    }
                }
            ]
        }));

        $section.find(".impressions").highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: data.impressions.goal,
                title: {
                    text: "Impressions"
                }
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: "Impressions",
                    data: [data.impressions.value],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">Impressions</span></div>'
                    },
                    tooltip: {
                        valueSuffix: ' Impressions'
                    }
                }
            ]
        }));

    }

    function renderPriceMatrix($section, data) {
        $section.find(".price-matrix-container").empty();
        $(data.price_matrix).each(function (index, tableData) {
            var brand = tableData[0].brand.replace(/[^\w\d\-]+/, "").toLowerCase();
            var $matrixTable = $('<div class="price-matrix-table '+brand+' table-wrapper"></div>');
            $matrixTable.appendTo($section.find(".price-matrix-container"));
            $matrixTable.mrjsontable({
                tableClass: "miwt-table price-matrix-table-" + brand,
                pageSize: 10,
                columns: [
                    new $.fn.mrjsontablecolumn({
                        heading: "Brand",
                        data: "brand",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "6 Pack",
                        data: "six_pack",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "12 Pack",
                        data: "twelve_pack",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "24 Pack",
                        data: "twenty_four_pack",
                        sortable: false
                    })
                ],
                data: tableData
            });
        });
    }

    function renderConsumerDemographics($section, data) {
        $section.find(".age").highcharts(Highcharts.merge(semiCircleDonutOptions, {
            title: {
                text: "Age"
            },
            series: [
                {
                    type: 'pie',
                    innerSize: '50%',
                    data: data.consumer_demographics.age
                }
            ],
            credits: {
                enabled: false
            }
        }));

        $section.find(".gender").highcharts(Highcharts.merge(semiCircleDonutOptions, {
            title: {
                text: "Gender"
            },
            series: [
                {
                    type: 'pie',
                    innerSize: '50%',
                    data: data.consumer_demographics.gender
                }
            ],
            credits: {
                enabled: false
            }
        }));

        $section.find(".language").highcharts(Highcharts.merge(semiCircleDonutOptions, {
            title: {
                text: "Language"
            },
            series: [
                {
                    type: 'pie',
                    innerSize: '50%',
                    data: data.consumer_demographics.language
                }
            ],
            credits: {
                enabled: false
            }
        }));

        $section.find(".background").highcharts(Highcharts.merge(semiCircleDonutOptions, {
            title: {
                text: "Background"
            },
            series: [
                {
                    type: 'pie',
                    innerSize: '50%',
                    data: data.consumer_demographics.background
                }
            ],
            credits: {
                enabled: false
            }

        }));
    }

    function renderConsumerPurchaseMotivators($section, data, photoType) {
        $section.find(".familiarity").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: "Consumer Familiarity"
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Familiarity',
                    data: data.familiarity
                }
            ]
        }));

        $section.find(".likely-purchase").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: "Likely to Purchase Montejo"
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Likely',
                    data: data.likely_purchase
                }
            ]
        }));

        $section.find(".preferred-brand").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: 'Preferred Brand of Beer'
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Preferred',
                    data: data.preferredBrand
                }
            ]
        }));

        $section.find(".consumer-purchase-motivators").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: "Purchase Motivators"
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Motivation',
                    data: data.motivators
                }
            ]
        }));
    }

    function renderFeaturePhotos($section, data) {
        //Featured Photos
        var $featuredPhotos = $section.find('.photos-carousel');
        var photoType = $section.data("photo-type");

        $featuredPhotos.each(function (idx, con) {
            var $con = $(this);
            $con.empty();
            $con.addClass('active');
            var photos = data[photoType];
            if (photos.length) {
                var photosSrc = "";
                photos.each(function (idx, photo) {
                    photosSrc += '<div class="photo" data-photo-src"' + photo + '" data-fancybox-group="' + photoType + '"><img src="' + photo + '" alt="Featured" /></div>';
                });
                var $scrollpaneHtml = $('<div class="scrollpane"></div>').append($(photosSrc));
                var $wrapperHtml = $('<div class="wrapper"></div>').append($scrollpaneHtml);
                $con.append($wrapperHtml);
                var $wrapper = $con.find('.wrapper');
                var $scrollPane = $con.find(".scrollpane");
                var $slides = $con.find('.photo');
                var curSlideIdx = 0;
                var endSlideIdx;
                var slideWidth = 325;
                var $nav = $('<ul class="nav" />');
                var $prev = $('<div class="navi prev"><span></span></div>').appendTo($nav);
                var $next = $('<div class="navi next"><span></span></div>').appendTo($nav);

                function setupSlides() {
                    $nav.prependTo($con);
                    $nav.wrap('<div class="nav_con" />');

                    var curSlideIdx = 0;
                    $con.eq(curSlideIdx).addClass('current');
                    $scrollPane.width(slideWidth * $slides.length);

                    $nav.on('click', '.navi.next', function (evt) {
                        nextSlide("left");
                    });

                    $nav.on('click', '.navi.prev', function (evt) {
                        nextSlide("right");
                    });

                    $con.on("movestart", function (e) {
                        // allows swipe up and down on mobile
                        if ((e.distX > e.distY && e.distX < -e.distY) ||
                            (e.distX < e.distY && e.distX > -e.distY)) {
                            e.preventDefault();
                        }
                    });
                }

                function nextSlide(direction, idx) {
                    if (idx) {
                        curSlideIdx = idx;
                    }
                    else {
                        if (direction == "left" && (curSlideIdx + 1) < $slides.length) {
                            curSlideIdx++;
                        }
                        else if (direction == "right" && curSlideIdx > 0) {
                            curSlideIdx--;
                        }
                    }

                    moveSlide();

                    setOrderClasses();

                    setupNav();
                }

                function moveSlide() {
                    var wrapperCenter = $wrapper.width() / 2;
                    var photoCenter = slideWidth / 2;

                    var transitionValue = -(slideWidth * curSlideIdx) + wrapperCenter - photoCenter;
                    if (Modernizr.csstransforms) {
                        transitionValue = "translateX(" + transitionValue + "px)";
                    }
                    $scrollPane.css(transitionProperty, transitionValue);
                }

                function activateSlideByIndex(idx) {
                    nextSlide('left', idx);
                    $slides.eq(idx).addClass('current').siblings().removeClass('current');
                    setOrderClasses();
                    setupNav();
                }

                function setOrderClasses() {
                    if ((curSlideIdx + 1) >= $slides.length) $con.removeClass('next');
                    else $slides.eq(curSlideIdx + 1).addClass('next').siblings().removeClass('next');

                    if (curSlideIdx == 0) $con.removeClass('prev');
                    else $slides.eq(curSlideIdx - 1).addClass('prev').siblings().removeClass('prev');

                    $slides.eq(curSlideIdx).addClass('current').siblings().removeClass('current');
                }

                function setupNav() {
                    if ((curSlideIdx + 1) >= $slides.length) $next.addClass('inactive');
                    else $next.removeClass('inactive');

                    if (curSlideIdx == 0) $prev.addClass('inactive');
                    else $prev.removeClass('inactive');
                }

                function initFancyBox() {
                    $slides.on('click', function (evt) {
                        var newSlideIdx = $(this).index();
                        if (newSlideIdx !== curSlideIdx) {
                            activateSlideByIndex(newSlideIdx);
                            curSlideIdx = newSlideIdx;
                        }
                        $.fancybox.open($slides.find("img").clone(), {
                            index: curSlideIdx,
                            maxWidth: 800,
                            autoWidth: true,
                            beforeClose: function () {
                                activateSlideByIndex(this.index);
                                curSlideIdx = this.index;
                            },
                            helpers: {
                                overlay: {
                                    locked: false
                                }
                            }
                        });


                    });
                }

                $con.on('reorder-photos', function (evt) {
                    moveSlide();
                });

                setupSlides();
                activateSlideByIndex(Math.round($slides.length / 2) - 1);
                initFancyBox();
            }
        });


        function addResizeWatcher() {
            $window.on('resize', function () {
                clearTimeout(resizeThrottleId);
                resizeThrottleId = setTimeout(function () {
                    windowWidth = $window.width();

                    $featuredPhotos.trigger('reorder-photos');

                }, RESIZE_THROTTLE_TIME);
            });
        }

        addResizeWatcher();
    }

    function renderCampaignStatus($section, data) {
        renderNumeric($section.find(".active-events"), "Active", data.active_events.value, "Events", "integer");
        renderNumeric($section.find(".rescheduled-events"), "Rescheduled", data.rescheduled_events.value, "Events", "integer");
        renderNumeric($section.find('.ready-for-review-events'), "Ready For Review", data.ready_for_review_events.value, "Events", "integer");
        renderNumeric($section.find(".completed-events"), "Completed", data.completed_events.value, "Events", "integer");
        renderNumeric($section.find(".canceled-events"), "Canceled", data.canceled_events.value, "Events", "integer");
    }

    function renderRecommendAccount($section, data)
    {
        $section.find(".recommend-account-container").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.lf} %</b></td></tr>'
            },
            series: [
                {
                    type: 'pie',
                    name: 'Recommend',
                    data: data.recommend_account
                }
            ]
        }));
    }

    function renderAccountEnvironment($section, data)
    {
        $section.find(".easy-find-case-display").highcharts(Highcharts.merge(stackedColumnOptions, {
            title: {
                text: null
            },
            xAxis: {
                categories: ['Was the product easy to find?', 'Was there floor/case display/end cap?']
            },
            yAxis: {
                title: {
                    text: "Percentage"
                },
                max: 100
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.lf} %</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: []
        }));

        $section.find(".was-expected-was-supportive").highcharts(Highcharts.merge(stackedColumnOptions, {
            title: {
                text: null
            },
            xAxis: {
                categories: ['Were you expected?', 'Were the store staff supportive?']
            },
            yAxis: {
                title: {
                    text: "Percentage"
                },
                max: 100
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.lf} %</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: []
        }));

        $section.find(".foot-traffic").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: 'Foot Traffic'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.lf} %</b></td></tr>'
            },
            series: [
                {
                    type: 'pie',
                    name: 'Traffic',
                    data: data.foot_traffic
                }
            ]
        }));

        $section.find(".optimal-time").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: 'Optimal Time Frame'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.lf} %</b></td></tr>'
            },
            series: [
                {
                    type: 'pie',
                    name: 'Time Frame',
                    data: data.optimal_time_frame
                }
            ]
        }));

        //Stacked Bar Graphs
        var chart = $("div.was-expected-was-supportive").highcharts();
        if (chart) {
            $(chart.series).each(function (index, series) {
                series.remove();
            });

            var dataArr = [];
            dataArr.push({
                name: 'Yes',
                data: [data.was_expected[0][1], data.was_supportive[0][1]]
            });

            dataArr.push({
                name: 'No',
                data: [data.was_expected[1][1], data.was_supportive[1][1]]
            });

            $(dataArr).each(function (index, seriesData) {
                chart.addSeries({name: seriesData.name, data: seriesData.data});
            });
        }

        chart = $("div.easy-find-case-display").highcharts();
        if (chart) {
            $(chart.series).each(function (index, series) {
                series.remove();
            });

            var dataArr = [];
            dataArr.push({
                name: 'Yes',
                data: [data.easy_find[0][1], data.was_display[0][1]]
            });

            dataArr.push({
                name: 'No',
                data: [data.easy_find[1][1], data.was_display[1][1]]
            });

            $(dataArr).each(function (index, seriesData) {
                chart.addSeries({name: seriesData.name, data: seriesData.data});
            });
        }
    }

    function populateSection($section, collectionName, chartData) {
        switch(collectionName) {
            case "brand-totals":
                renderBrandTotals($section, chartData.brand_totals);
                break;
            case "consumer-demographics":
                renderConsumerDemographics($section, chartData);
                break;
            case "consumer-purchase-motivators":
                renderConsumerPurchaseMotivators($section, chartData.consumer_insights);
                break;
            case "featured-photos":
                renderFeaturePhotos($section, chartData["featured-photos"]);
                break;
            case "campaign-status":
                renderCampaignStatus($section, chartData.campaign_status);
                break;
            case "price-matrix":
                renderPriceMatrix($section, chartData);
                break;
            case "recommend-account":
                renderRecommendAccount($section, chartData.account_environment);
                break;
            case "account-environment":
                renderAccountEnvironment($section, chartData.account_environment);
                break;
            default :
                break;
        }
    }

//    function updateChartsAndTables(chartData) {
//        var no_data = chartData.no_data;
//
//        if (no_data === false) {
//            //Brand Totals
//            var chart = $("div.events-completed").highcharts();
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, 14000);
//                chart.series[0].points[0].update(chartData.brand_totals.events_completed.value);
//            }
//            chart = $("div.samples-given").highcharts();
//
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, chartData.brand_totals.samples_given.goal);
//                chart.series[0].points[0].update(chartData.brand_totals.samples_given.value);
//            }
//
//            var totalSpend = chartData.brand_totals.product_spend;
//            if (totalSpend) {
//                $(".total-spend .data-value").append(totalSpend.value);
//            }
//
//            var averageSpend = chartData.brand_totals.average_product_spend;
//            if (averageSpend) {
//                $(".average-spend .data-value").append(averageSpend.value);
//            }
//
//            chart = $("div.customer-engagements").highcharts();
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, chartData.brand_totals.customer_engagements.goal);
//                chart.series[0].points[0].update(chartData.brand_totals.customer_engagements.value);
//            }
//
//            chart = $("div.impressions").highcharts();
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, chartData.brand_totals.impressions.goal);
//                chart.series[0].points[0].update(chartData.brand_totals.impressions.value);
//            }
//
//            //Campaign Status
//            var activeEvents = chartData.campaign_status.active_events;
//            if (activeEvents) {
//                doCountUpAction($(".number-active-events .data-value"), activeEvents.value);
//            }
//
//            var rescheduledEvents = chartData.campaign_status.rescheduled_events;
//            if (rescheduledEvents) {
//                doCountUpAction($(".number-rescheduled-events .data-value"), rescheduledEvents.value);
//            }
//
//            var readyReviewEvents = chartData.campaign_status.ready_for_review_events;
//            if (readyReviewEvents) {
//                doCountUpAction($(".number-ready-review-events .data-value"), readyReviewEvents.value);
//            }
//
//            var completedEvents = chartData.campaign_status.completed_events;
//            if (completedEvents) {
//                doCountUpAction($(".number-completed-events .data-value"), completedEvents.value);
//            }
//
//            var canceled = chartData.campaign_status.canceled_events;
//            if (canceled) {
//                doCountUpAction($(".number-canceled-events .data-value"), canceled.value);
//            }
//
//            //Recommend Account
//            chart = $("div.recommend-account").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.account_environment.recommend_account);
//            }
//
//            //Consumer insights
//            //Preferred Brand
//            chart = $("div.preferred-brand").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_insights.preferredBrand);
//            }
//
//            //Familiarity
//            chart = $("div.familiarity").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_insights.familiarity);
//            }
//
//            //Purchase
//            chart = $("div.likely-purchase").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_insights.likely_purchase);
//            }
//
//            //Purchase Motivators
//            chart = $("div.consumer-purchase-motivators").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_insights.motivators);
//            }
//
//            if (chartData.price_matrix.length > 0) {
//                $("div.price-matrix").empty();
//                $(document.createElement("div")).addClass("dash-section-header").addClass("price-matrix-header").text("Price Matrix").appendTo("div.price-matrix");
//                $(chartData.price_matrix).each(function (index, tableData) {
//                    var brand = tableData[0].brand.replace(/[^\w\d\-]+/, "").toLowerCase();
//                    $(document.createElement("div")).addClass("price-matrix-table").addClass(brand).addClass("table-wrapper").appendTo("div.price-matrix");
//                    $("div.price-matrix-table." + brand).mrjsontable({
//                        tableClass: "miwt-table price-matrix-table-" + brand,
//                        pageSize: 10,
//                        columns: [
//                            new $.fn.mrjsontablecolumn({
//                                heading: "Brand",
//                                data: "brand",
//                                sortable: false
//                            }),
//                            new $.fn.mrjsontablecolumn({
//                                heading: "6 Pack",
//                                data: "six_pack",
//                                sortable: false
//                            }),
//                            new $.fn.mrjsontablecolumn({
//                                heading: "12 Pack",
//                                data: "twelve_pack",
//                                sortable: false
//                            }),
//                            new $.fn.mrjsontablecolumn({
//                                heading: "24 Pack",
//                                data: "twenty_four_pack",
//                                sortable: false
//                            })
//                        ],
//                        data: tableData
//                    });
//                });
//            }
//
//            chart = $("div.consumer-demographics div.age").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_demographics.age);
//            }
//
//            chart = $("div.consumer-demographics div.gender").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_demographics.gender);
//            }
//
//            chart = $("div.consumer-demographics div.language").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_demographics.language);
//            }
//
//            chart = $("div.consumer-demographics div.background").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.consumer_demographics.background);
//            }
//
//            chart = $("div.right-account").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.right_account);
//            }
//
//            //Account Environment
//            //Stacked Bar Graphs : Easy Find and Was Display
//            chart = $("div.easy-find-case-display").highcharts();
//            if (chart) {
//                $(chart.series).each(function (index, series) {
//                    series.remove();
//                });
//
//                var data = [];
//                data.push({
//                    name: 'Yes',
//                    data: [chartData.account_environment.easy_find[0][1], chartData.account_environment.was_display[0][1]]
//                });
//
//                data.push({
//                    name: 'No',
//                    data: [chartData.account_environment.easy_find[1][1], chartData.account_environment.was_display[1][1]]
//                });
//
//                $(data).each(function (index, seriesData) {
//                    chart.addSeries({name: seriesData.name, data: seriesData.data});
//                });
//            }
//
//            chart = $("div.account-environment div.foot-traffic").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.account_environment.foot_traffic);
//            }
//
//            chart = $("div.account-environment div.optimal-time").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.account_environment.optimal_time_frame);
//            }
//
//            //Stacked Bar Graphs
//            chart = $("div.was-expected-was-supportive").highcharts();
//            if (chart) {
//                $(chart.series).each(function (index, series) {
//                    series.remove();
//                });
//
//                var data = [];
//                data.push({
//                    name: 'Yes',
//                    data: [chartData.account_environment.was_expected[0][1], chartData.account_environment.was_supportive[0][1]]
//                });
//
//                data.push({
//                    name: 'No',
//                    data: [chartData.account_environment.was_expected[1][1], chartData.account_environment.was_supportive[1][1]]
//                });
//
//                $(data).each(function (index, seriesData) {
//                    chart.addSeries({name: seriesData.name, data: seriesData.data});
//                });
//            }
//
//        }
//        else {
//            noData();
//        }
//    }

    function updateChartsAndTables(params) {
        $dashboardSections.each(function() {
            var $section = $(this);

            //Add the section we are loading as a param
            var collectionName = $section.data("collection-name");

            if(collectionName == "consumer-photos" || collectionName == "product-display-photos")
            {
                collectionName = "featured-photos";
            }

            params.dataSet = collectionName;

            addLoadingMessage($section.find(".dashboard-section-content"));
            $.getJSON("/ws/dashboard-feed", params)
                .done(function (wsData) {
                    populateSection($section, collectionName, wsData);
                })
                .fail(function () {
                    displayMessage(MESSAGE_TYPE_ERROR_GENERIC);
                })
                .always(function () {
                    hideLoadingMessage($section);
                });
        });
    }

    function updateData() {
        var searchParamPath = $searchParamsContainer.data("component-url");

        $.ajax(searchParamPath, {
            contentType: "application/json"
        }).done(function(data) {
            //start our next thing after processing the data given (should be params)
            var params = JSON.parse(data);
            updateChartsAndTables(params);
            displayMessage(null);
        }).fail(function() {
            //Welp
            //TODO move into finished listener
            addLoadingMessage(false);
            //TODO move into error listener
            displayMessage(MESSAGE_TYPE_ERROR_GENERIC);
        });
    }

    function init()
    {
        $searchBtn.on('click', function () {
            displayMessage(null);
            updateData();
        });

        updateData();
    }

    init();

});