var $window = $(window);
var windowWidth = $window.width();
var transitionProperty = Modernizr.csstransforms ? "transform" : "left";
var RESIZE_THROTTLE_TIME = 200;
var resizeThrottleId;
var $root = $('.dashboard-params');

function createHtmlStructure(chartData) {
    var no_data = chartData.no_data;

    if ($(".dash-container").length === 0 ) {
        $(document.createElement("div")).addClass("dash-container").appendTo(".e-content");
    }

    $(".dash-container").empty();

    //Brand Totals
    $(document.createElement("div")).addClass("dash-section").addClass("brand-totals").addClass("circular-chart-wrapper").appendTo(".dash-container");
    $(document.createElement("div")).addClass("dash-section-header").addClass("brand-totals-header").text("Brand Totals").appendTo("div.brand-totals");
    $('<div class="spend-wrapper"></div>').appendTo(".brand-totals");
    $('<div class="total-spend number-display"><div class="data-label">Total BA Product Spend</div><div class="data-value"><span class="dollar-sign">$</span></div></div>').appendTo('div.spend-wrapper');
    $('<div class="average-spend number-display"><div class="data-label">Average Spend per Event</div><div class="data-value"><span class="dollar-sign">$</span></div></div>').appendTo('div.spend-wrapper');
    $(document.createElement("div")).addClass("events-completed").addClass("gauge-chart").appendTo("div.brand-totals");
    $(document.createElement("div")).addClass("samples-given").addClass("gauge-chart").appendTo("div.brand-totals");
    $(document.createElement("div")).addClass("customer-engagements").addClass("gauge-chart").appendTo("div.brand-totals");
    $(document.createElement("div")).addClass("impressions").addClass("gauge-chart").appendTo("div.brand-totals");



    if(no_data === false){
        //Featured photos
        var competitorPhotos = chartData['featured-photos']['competitor_photos'];
        var consumerPhotos = chartData['featured-photos']['consumer_photos'];
        var pDisplayPhotos = chartData['featured-photos']['product_display_photos'];

        if (consumerPhotos.length) {
            $(document.createElement("div")).addClass("dash-section").addClass("featured-photos consumer").attr('data-photo-type', 'consumer_photos').appendTo(".dash-container");
            $(document.createElement("div")).addClass("dash-section-header").addClass("featured-photos-header").text("Featured Consumer Photos").appendTo("div.consumer");
        }

        if (pDisplayPhotos.length) {
            $(document.createElement("div")).addClass("dash-section").addClass("featured-photos product-display").attr('data-photo-type', 'product_display_photos').appendTo(".dash-container");
            $(document.createElement("div")).addClass("dash-section-header").addClass("featured-photos-header").text("Featured Product Display Photos").appendTo("div.product-display");
        }

        if (competitorPhotos.length) {
            $(document.createElement("div")).addClass("dash-section").addClass("featured-photos competitor").attr('data-photo-type', 'competitor_photos').appendTo(".dash-container");
            $(document.createElement("div")).addClass("dash-section-header").addClass("featured-photos-header").text("Featured Competitor Photos").appendTo("div.competitor");
        }
    }

    //Campaign Status
    $('<div class="dash-section campaign-status"></div>').appendTo(".dash-container");
    $('<div class="dash-section-header campaign-status-header">Campaign Status</div>').appendTo('.campaign-status');
    $('<div class="number-active-events count-display"><div class="data-label">Active</div><div class="data-value"></div><div class="data-description">Events</div></div>').appendTo('.campaign-status');
    $('<div class="number-rescheduled-events count-display"><div class="data-label">Rescheduled </div><div class="data-value"></div><div class="data-description">Events</div></div>').appendTo('.campaign-status');
    $('<div class="number-ready-review-events count-display"><div class="data-label">Ready for Review</div><div class="data-value"></div><div class="data-description">Events</div></div>').appendTo('.campaign-status');
    $('<div class="number-completed-events count-display"><div class="data-label">Completed</div><div class="data-value"></div><div class="data-description">Events</div></div>').appendTo('.campaign-status');
    $('<div class="number-canceled-events count-display"><div class="data-label">Canceled</div><div class="data-value"></div><div class="data-description">Events</div></div>').appendTo('.campaign-status');

    //Price matrix
    $(document.createElement("div")).addClass("dash-section-container").addClass("price-matrix-recommend-account").appendTo(".dash-container");
    $('<div class="dash-section recommend-account pie-chart"></div>').appendTo(".price-matrix-recommend-account");
    $(document.createElement("div")).addClass("dash-section").addClass("price-matrix").appendTo(".price-matrix-recommend-account");

    //Consumer Insights
    $(document.createElement("div")).addClass("dash-section").addClass("multi-chart-wrapper").addClass("consumer-insights").appendTo(".dash-container");
    $(document.createElement("div")).addClass("dash-section-header").addClass("consumer-insights-header").text("Consumer Insights").appendTo("div.consumer-insights");
    $(document.createElement("div")).addClass("preferred-brand").addClass("pie-chart").appendTo("div.consumer-insights");
    $(document.createElement("div")).addClass("familiarity").addClass("pie-chart").appendTo("div.consumer-insights");
    $(document.createElement("div")).addClass("likely-purchase").addClass("pie-chart").appendTo("div.consumer-insights");
    $(document.createElement("div")).addClass("consumer-purchase-motivators").addClass("pie-chart").appendTo("div.consumer-insights");

    //Consumer Demographics
    $(document.createElement("div")).addClass("dash-section").addClass("consumer-demographics").addClass("circular-chart-wrapper").appendTo(".dash-container");
    $(document.createElement("div")).addClass("dash-section-header").addClass("consumer-demographics-header").text("Consumer Demographics").appendTo("div.consumer-demographics");
    $(document.createElement("div")).addClass("age").addClass("pie-chart").appendTo("div.consumer-demographics");
    $(document.createElement("div")).addClass("gender").addClass("pie-chart").appendTo("div.consumer-demographics");
    $(document.createElement("div")).addClass("language").addClass("pie-chart").appendTo("div.consumer-demographics");
    $(document.createElement("div")).addClass("background").addClass("pie-chart").appendTo("div.consumer-demographics");

    //Account Environment
    $(document.createElement("div")).addClass("dash-section").addClass("account-environment").addClass("circular-chart-wrapper").appendTo(".dash-container");
    $(document.createElement("div")).addClass("dash-section-header").addClass("account-environment-header").text("Account Environment").appendTo("div.account-environment");
    $(document.createElement("div")).addClass("easy-find-case-display").addClass("stacked-bar-chart").appendTo("div.account-environment");
    $('<div class="stacked-pies"></div>').appendTo("div.account-environment");
    $(document.createElement("div")).addClass("foot-traffic").addClass("pie-chart").appendTo("div.account-environment .stacked-pies");
    $(document.createElement("div")).addClass("optimal-time").addClass("pie-chart").appendTo("div.account-environment .stacked-pies");
    $(document.createElement("div")).addClass("was-expected-was-supportive").addClass("stacked-bar-chart").appendTo("div.account-environment");

}

function noData() {
    if ($(".dash-container").length === 0 ) {
        $(document.createElement("div")).addClass("dash-container").appendTo(".e-content");
    }

    $(".dash-container").empty();
    $(document.createElement("div")).addClass("dash_message").addClass("no-data").text("Currently no Data").appendTo(".dash-container");
}

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
        return number + '';
    }
}

function getScaledMin(targetNumber) {
    return targetNumber - 100;
}

function doCountUpAction($target, number) {

    var min = getScaledMin(number);

    var friendlyNumber = friendlyNumberFormat(number);
    if(friendlyNumber)
        var postFix = friendlyNumber.match(/[a-z]/);

    if(postFix)
    {
        var $valueWrap = $('<span class="value-wrapper"></span>');
        $target.append($valueWrap, '<span class="post-fix-count">'+postFix+'</span>');
        $target = $valueWrap;
        number = parseInt(friendlyNumber.replace(postFix.toString(), ''));
        min = getScaledMin(number);
    }

    if(min < 0)
    {
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
            return [0,this.max];
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
            formatter: function() {
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
    },
    series: [
        {
            type: 'pie',
            name: 'Percent of Consumers',
            innerSize: '50%',
            data: []
        }
    ]
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

function createCharts() {
    $("div.product-spend").highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10,
            title: {
                text: "$ Product Spend <br /> (Amount BA Spend)"
            }
        },

        credits: {
            enabled: false
        },

        series: [
            {
                name: "Product Spend",
                data: [0],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">$</span><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">Spent</span></div>'
                },
                tooltip: {
                    valuePrefix: '$'
                }
            }
        ]
    }));

    $("div.customer-engagements").highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10,
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
                data: [0],
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

    $("div.events-completed").highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10,
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
                data: [0],
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

    $("div.samples-given").highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10,
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
                data: [0],
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

    $("div.impressions").highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10,
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
                data: [0],
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

    $("div.consumer-demographics div.age").highcharts(Highcharts.merge(semiCircleDonutOptions, {
        title: {
            text: "Age"
        },

        credits: {
            enabled: false
        }
    }));

    $("div.consumer-demographics div.gender").highcharts(Highcharts.merge(semiCircleDonutOptions, {
        title: {
            text: "Gender"
        },

        credits: {
            enabled: false
        }
    }));

    $("div.consumer-demographics div.language").highcharts(Highcharts.merge(semiCircleDonutOptions, {
        title: {
            text: "Language"
        },
        credits: {
            enabled: false
        }
    }));

    $("div.consumer-demographics div.background").highcharts(Highcharts.merge(semiCircleDonutOptions, {
        title: {
            text: "Background"
        },
        credits: {
            enabled: false
        }

    }));

    $("div.recommend-account").highcharts(Highcharts.merge(pieWithLegendOptions, {
        title: {
            text: "Recommend Account"
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
                data: []
            }
        ]
    }));

    $("div.consumer-purchase-motivators").highcharts(Highcharts.merge(pieWithLegendOptions, {
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
                data: []
            }
        ]
    }));

    $("div.familiarity").highcharts(Highcharts.merge(pieWithLegendOptions, {
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
                data: []
            }
        ]
    }));

    $("div.likely-purchase").highcharts(Highcharts.merge(pieWithLegendOptions, {
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
                data: []
            }
        ]
    }));

    $("div.preferred-brand").highcharts(Highcharts.merge(pieWithLegendOptions, {
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
                data: []
            }
        ]
    }));

    $("div.easy-find-case-display").highcharts(Highcharts.merge(stackedColumnOptions, {
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

    $("div.was-expected-was-supportive").highcharts(Highcharts.merge(stackedColumnOptions, {
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

    $("div.foot-traffic").highcharts(Highcharts.merge(pieWithLegendOptions, {
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
                data: []
            }
        ]
    }));

    $("div.optimal-time").highcharts(Highcharts.merge(pieWithLegendOptions, {
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
                data: []
            }
        ]
    }));
}

function updateChartsAndTables(chartData) {
    var no_data = chartData.no_data;

    if(no_data === false)
    {
        //Brand Totals
        var chart = $("div.events-completed").highcharts();
        if (chart) {
            chart.yAxis[0].setExtremes(0, 14000);
            chart.series[0].points[0].update(chartData.brand_totals.events_completed.value);
        }
        chart = $("div.samples-given").highcharts();

        if (chart) {
            chart.yAxis[0].setExtremes(0, chartData.brand_totals.samples_given.goal);
            chart.series[0].points[0].update(chartData.brand_totals.samples_given.value);
        }

        var totalSpend = chartData.brand_totals.product_spend;
        if(totalSpend)
        {
            $(".total-spend .data-value").append(totalSpend.value);
        }

        var averageSpend = chartData.brand_totals.average_product_spend;
        if(averageSpend)
        {
            $(".average-spend .data-value").append(averageSpend.value);
        }

        chart = $("div.customer-engagements").highcharts();
        if (chart) {
            chart.yAxis[0].setExtremes(0, chartData.brand_totals.customer_engagements.goal);
            chart.series[0].points[0].update(chartData.brand_totals.customer_engagements.value);
        }

        chart = $("div.impressions").highcharts();
        if (chart) {
            chart.yAxis[0].setExtremes(0, chartData.brand_totals.impressions.goal);
            chart.series[0].points[0].update(chartData.brand_totals.impressions.value);
        }

        //Featured Photos
        var $featuredPhotos = $("div.featured-photos");

        $featuredPhotos.each(function(idx, con){
            var $con = $(this);
            $con.addClass('active');
            var photoType = $con.data('photoType');
            var photos = chartData['featured-photos'][photoType];
            if (photos.length) {
                var photosSrc = "";
                photos.each(function(idx, photo){
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
                    var wrapperCenter = $wrapper.width()/2;
                    var photoCenter = slideWidth/2;

                    var transitionValue = -(slideWidth*curSlideIdx) + wrapperCenter - photoCenter;
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
                    $slides.on('click', function(evt) {
                        var newSlideIdx = $(this).index();
                        if (newSlideIdx !== curSlideIdx) {
                            activateSlideByIndex(newSlideIdx);
                            curSlideIdx = newSlideIdx;
                        }
                        $.fancybox.open($slides.find("img").clone(), {
                            index: curSlideIdx,
                            maxWidth: 800,
                            autoWidth:	true,
                            beforeClose: function() {
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

                $con.on('reorder-photos', function(evt){
                    moveSlide();
                });

                setupSlides();
                activateSlideByIndex(Math.round($slides.length/2)-1);
                initFancyBox();
            }
        });


        function addResizeWatcher() {
            $window.on('resize', function() {
                clearTimeout(resizeThrottleId);
                resizeThrottleId = setTimeout(function() {
                    windowWidth = $window.width();

                    $featuredPhotos.trigger('reorder-photos');

                }, RESIZE_THROTTLE_TIME);
            });
        }

        addResizeWatcher();

        //Campaign Status
        var activeEvents = chartData.campaign_status.active_events;
        if(activeEvents)
        {
            doCountUpAction($(".number-active-events .data-value"), activeEvents.value);
        }

        var rescheduledEvents = chartData.campaign_status.rescheduled_events;
        if(rescheduledEvents)
        {
            doCountUpAction($(".number-rescheduled-events .data-value"), rescheduledEvents.value);
        }

        var readyReviewEvents = chartData.campaign_status.ready_for_review_events;
        if(readyReviewEvents)
        {
            doCountUpAction($(".number-ready-review-events .data-value"), readyReviewEvents.value);
        }

        var completedEvents = chartData.campaign_status.completed_events;
        if(completedEvents)
        {
            doCountUpAction($(".number-completed-events .data-value"), completedEvents.value);
        }

        var canceled = chartData.campaign_status.canceled_events;
        if(canceled)
        {
            doCountUpAction($(".number-canceled-events .data-value"), canceled.value);
        }

        //Recommend Account
        chart = $("div.recommend-account").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.account_environment.recommend_account);
        }

        //Consumer insights
        //Preferred Brand
        chart = $("div.preferred-brand").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_insights.preferredBrand);
        }

        //Familiarity
        chart = $("div.familiarity").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_insights.familiarity);
        }

        //Purchase
        chart = $("div.likely-purchase").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_insights.likely_purchase);
        }

        //Purchase Motivators
        chart = $("div.consumer-purchase-motivators").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_insights.motivators);
        }

        if (chartData.price_matrix.length > 0) {
            $("div.price-matrix").empty();
            $(document.createElement("div")).addClass("dash-section-header").addClass("price-matrix-header").text("Price Matrix").appendTo("div.price-matrix");
            $(chartData.price_matrix).each(function (index, tableData) {
                var brand = tableData[0].brand.replace(/[^\w\d\-]+/, "").toLowerCase();
                $(document.createElement("div")).addClass("price-matrix-table").addClass(brand).addClass("table-wrapper").appendTo("div.price-matrix");
                $("div.price-matrix-table." + brand).mrjsontable({
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

        chart = $("div.consumer-demographics div.age").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_demographics.age);
        }

        chart = $("div.consumer-demographics div.gender").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_demographics.gender);
        }

        chart = $("div.consumer-demographics div.language").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_demographics.language);
        }

        chart = $("div.consumer-demographics div.background").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.consumer_demographics.background);
        }

        chart = $("div.right-account").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.right_account);
        }

        //Account Environment
        //Stacked Bar Graphs : Easy Find and Was Display
        chart = $("div.easy-find-case-display").highcharts();
        if (chart) {
            $(chart.series).each(function (index, series) {
                series.remove();
            });

            var data = [];
            data.push({
                name: 'Yes',
                data: [chartData.account_environment.easy_find[0][1],chartData.account_environment.was_display[0][1]]
            });

            data.push({
                name: 'No',
                data: [chartData.account_environment.easy_find[1][1],chartData.account_environment.was_display[1][1]]
            });

            $(data).each(function (index, seriesData) {
                chart.addSeries({name: seriesData.name, data: seriesData.data});
            });
        }

        chart = $("div.account-environment div.foot-traffic").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.account_environment.foot_traffic);
        }

        chart = $("div.account-environment div.optimal-time").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.account_environment.optimal_time_frame);
        }

        //Stacked Bar Graphs
        chart = $("div.was-expected-was-supportive").highcharts();
        if (chart) {
            $(chart.series).each(function (index, series) {
                series.remove();
            });

            var data = [];
            data.push({
                name: 'Yes',
                data: [chartData.account_environment.was_expected[0][1],chartData.account_environment.was_supportive[0][1]]
            });

            data.push({
                name: 'No',
                data: [chartData.account_environment.was_expected[1][1],chartData.account_environment.was_supportive[1][1]]
            });

            $(data).each(function (index, seriesData) {
                chart.addSeries({name: seriesData.name, data: seriesData.data});
            });
        }

    }
    else
    {
        noData();
    }
}

function loadingDialog(show) {
    if ( show ) {
        $(document.createElement("div")).addClass("miwt-ajax-progress").addClass("dashboard-ajax-loading").html('<div class="label">'
                +'Loading, Please Wait'
                +'</div>'
                +'<div id="miwt-loading-message-503" style="display: none;">' + '' + '</div>'
                +'<div class="progress-con"><span></span><progress></progress></div>')
            .css({
                position : 'fixed',
                display: 'block'
            }).appendTo("body");
    }
    else {
        $(".dashboard-ajax-loading").remove();
    }
}

function sendAjaxUpdateCharts() {
    loadingDialog(true);
    var url = $(location).attr('href');
    $.ajax(
        {
            url: url,
            contentType: "application/json",
            success: function (result, status, xhr) {
                createHtmlStructure(result);

                createCharts();

                updateChartsAndTables(result);

                loadingDialog(false)
            },
            error: function (xhr, status, error) {
                console.log( "Ajax request failed." );

                loadingDialog(false)
            }
        }
    );
}

jQuery(function($) {
    noData();

    sendAjaxUpdateCharts();

    $('.vipametric .search-button.dashboard-search').on('click', function() {
        sendAjaxUpdateCharts();
    });
});