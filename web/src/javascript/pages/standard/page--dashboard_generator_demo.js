jQuery(function($) {
    var $socialContainer;

    var API_KEY = 'a417ee49d987911d',
        TRACKER = 'vv8Vqk',
        HASHTAG = '#experientialmarketing';

    var pollCount = 0;

    function pollForSocial($counts) {
        setTimeout(function(){
            if ($(".social-analytics").length || pollCount > 500) {
                $socialContainer = $(".social-analytics");
                displayCounts($counts);
            }
            else {
                pollForSocial($counts);
            }
        },50);
        pollCount++;
    }

    function createHtmlStructure() {
        if ($(".dash-container").length === 0 ) {
            $(document.createElement("div")).addClass("dash-container").appendTo(".e-content");
        }

        $(".dash-container").empty();

        $(document.createElement("div")).addClass("dash-section").addClass("brand-totals").addClass("circular-chart-wrapper").appendTo(".dash-container");
        $(document.createElement("div")).addClass("dash-section-header").addClass("brand-totals-header").text("Brand Totals").appendTo("div.brand-totals");
        $(document.createElement("div")).addClass("dash-section-content").appendTo("div.brand-totals");
        //$(document.createElement("div")).addClass("bottle-sales").addClass("gauge-chart").appendTo("div.brand-totals");
        $(document.createElement("div")).addClass("events-completed").addClass("gauge-chart").appendTo("div.brand-totals .dash-section-content");
        //$(document.createElement("div")).addClass("samples-given").addClass("gauge-chart").appendTo("div.brand-totals .dash-section-content");
        $(document.createElement("div")).addClass("impressions").addClass("gauge-chart").appendTo("div.brand-totals .dash-section-content");

        $(document.createElement("div")).addClass("dash-section").addClass("social-analytics").appendTo(".dash-container");
        $(document.createElement("div")).addClass("dash-section-header").addClass("social-analytics-header").text("Social Analytics").appendTo("div.social-analytics");
        $(document.createElement("div")).addClass("dash-section-content").appendTo("div.social-analytics");
        $(document.createElement("div")).addClass("social-analytics-hashtag").text(HASHTAG).appendTo("div.social-analytics .dash-section-content");

        $(document.createElement("div")).addClass("dash-section").addClass("full-program-results-container").appendTo(".dash-container");
        $(document.createElement("div")).addClass("full-program-results").addClass("table-wrapper").appendTo("div.full-program-results-container");


        $(document.createElement("div")).addClass("dash-section").addClass("price-matrix").appendTo(".dash-container");

        $(document.createElement("div")).addClass("dash-section").addClass("consumer-demographics").addClass("circular-chart-wrapper").appendTo(".dash-container");
        $(document.createElement("div")).addClass("dash-section-header").addClass("consumer-demographics-header").text("Consumer Demographics").appendTo("div.consumer-demographics");
        $(document.createElement("div")).addClass("dash-section-content").appendTo("div.consumer-demographics");
        $(document.createElement("div")).addClass("age").addClass("pie-chart").appendTo("div.consumer-demographics .dash-section-content");
        $(document.createElement("div")).addClass("gender").addClass("pie-chart").appendTo("div.consumer-demographics .dash-section-content");
        $(document.createElement("div")).addClass("language").addClass("pie-chart").appendTo("div.consumer-demographics .dash-section-content");
        $(document.createElement("div")).addClass("background").addClass("pie-chart").appendTo("div.consumer-demographics .dash-section-content");

        $(document.createElement("div")).addClass("dash-section").addClass("multi-chart-wrapper").addClass("consumer-purchase-motivators-wrapper").appendTo(".dash-container");
        $(document.createElement("div")).addClass("dash-section-header").addClass("multi-chart-header").text("Additional Data").appendTo("div.consumer-purchase-motivators-wrapper");
        $(document.createElement("div")).addClass("dash-section-content").appendTo("div.consumer-purchase-motivators-wrapper");
        $(document.createElement("div")).addClass("consumer-purchase-motivators").addClass("column-chart").appendTo("div.consumer-purchase-motivators-wrapper .dash-section-content");

        $(document.createElement("div")).addClass("right-account").addClass("pie-chart").appendTo("div.consumer-purchase-motivators-wrapper .dash-section-content");
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
            return number;
        }
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

    var columnOptions = {
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

        $("div.consumer-purchase-motivators").highcharts(Highcharts.merge(columnOptions, {
            title: {
                text: "Consumer Purchase Motivators"
            },
            yAxis: {
                title: {
                    text: "Consumers"
                }
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.lf} Consumers</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: []
        }));

        $("div.right-account").highcharts(Highcharts.merge(pieWithLegendOptions, {
            title: {
                text: 'Are we in the right accounts?'
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Right Account?',
                    data: []
                }
            ]
        }));
    }

    function updateChartsAndTables(chartData) {
    var no_data = chartData.no_data;

    if(no_data === false)
    {
        var chart;

        chart = $("div.events-completed").highcharts();
        if (chart) {
            chart.yAxis[0].setExtremes(0, chartData.brand_totals.events_completed.goal);
            chart.series[0].points[0].update(chartData.brand_totals.events_completed.value);
        }


        chart = $("div.impressions").highcharts();
        if (chart) {
            chart.yAxis[0].setExtremes(0, chartData.brand_totals.impressions.goal);
            chart.series[0].points[0].update(chartData.brand_totals.impressions.value);
        }

        $("div.full-program-results").empty();
        $("div.full-program-results").mrjsontable({
            tableClass: "miwt-table full-program-results-table",
            pageSize: 20,
            columns: [
                new $.fn.mrjsontablecolumn({
                    heading: "Full Program Top Line Results",
                    data: "total_desc",
                    sortable: false
                }),
                new $.fn.mrjsontablecolumn({
                    heading: "To Date",
                    data: "total",
                    type: "int",
                    sortable: false
                }),
                new $.fn.mrjsontablecolumn({
                    heading: "Total Goal",
                    data: "goal",
                    type: "int",
                    sortable: false
                }),
                new $.fn.mrjsontablecolumn({
                    heading: "% to Goal",
                    data: "percent_to_goal",
                    type: "int",
                    sortable: false
                })
            ],
            data: chartData.brand_totals.full_program_results
        });

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

        chart = $("div.consumer-purchase-motivators").highcharts();
        if (chart) {
            $(chart.series).each(function (index, series) {
                series.remove();
            });

            $(chartData.consumer_purchase_motivators).each(function (index, seriesData) {
                chart.addSeries({
                    name: seriesData[0]
                }).addPoint(seriesData[1]);
            });
        }

        chart = $("div.right-account").highcharts();
        if (chart) {
            chart.series[0].setData(chartData.right_account);
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
                    createHtmlStructure();

                    createCharts();

                    updateChartsAndTables(result);

                    loadingDialog(false);

                    aggregateCounts(result.keyhole);
                },
                data: {
                    access_token: API_KEY,
                    track: TRACKER,
                    type: "timeline",
                    range: 30
                },
                error: function (xhr, status, error) {
                    console.log( "Ajax request failed." );

                    loadingDialog(false)
                }
            }
        );
    }


    noData();

    sendAjaxUpdateCharts();

    $('.vipametric .search-button.dashboard-search').on('click', function() {
        sendAjaxUpdateCharts();
    });

    function aggregateCounts(data) {
        var $counts = {};

        var instagramData = data.results.instagram;
        var twitterData = data.results.twitter;

        $counts.posts = parseNum(instagramData.total_tweets + twitterData.total_tweets);
        $counts.users = parseNum(instagramData.total_tweeters + twitterData.total_tweeters);
        $counts.reach = parseNum(instagramData.total_reach + twitterData.total_reach);
        $counts.impressions = parseNum(instagramData.total_impressions + twitterData.total_impressions);

        pollForSocial($counts);
    }

    function displayCounts(obj) {
        var $counts = obj;

        $.each($counts, function(key, value){
            key = key.charAt(0).toUpperCase() + key.slice(1);
            var $value = $("<div />").addClass("value").text(value);
            var $wrap = $('<div class="social-category"><div class="title">' + key + '</div>');
            $wrap.prepend($value);
            $socialContainer.append($wrap);
        });

        $('.social-category').wrapAll($("<div class='wrap'/>"));


        $(document.createElement("a")).addClass("more").attr('href', 'http://keyhole.co/realtime/' + TRACKER + '/' + HASHTAG).attr('target', '_blank').text('View All Data').appendTo("div.social-analytics");
    }

    function parseNum(num) {
        num += '';
        x = num.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
});