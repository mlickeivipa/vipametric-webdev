function createHtmlStructure() {
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
   
    //Featured photos
    $(document.createElement("div")).addClass("dash-section").addClass("featured-photos").appendTo(".dash-container");
    $(document.createElement("div")).addClass("dash-section-header").addClass("featured-photos-header").text("Featured Photos").appendTo("div.featured-photos");
    
    //Price matrix
    $(document.createElement("div")).addClass("dash-section").addClass("price-matrix").appendTo(".dash-container");

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
    $(document.createElement("div")).addClass("dash-section-header").addClass("account-environment-header").text("Consumer Demographics").appendTo("div.account-environment");
    $(document.createElement("div")).addClass("easy-find-case-display").addClass("stacked-bar-chart").appendTo("div.account-environment");
    $(document.createElement("div")).addClass("foot-traffic").addClass("pie-chart").appendTo("div.account-environment");
    $(document.createElement("div")).addClass("optimal-time").addClass("pie-chart").appendTo("div.account-environment");
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
            chart.yAxis[0].setExtremes(0, chartData.brand_totals.events_completed.goal);
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
            chart.yAxis[0].setExtremes(0, 20);
            chart.series[0].points[0].update(chartData.brand_totals.customer_engagements.value);
        }

        chart = $("div.impressions").highcharts();
        if (chart) {
            chart.yAxis[0].setExtremes(0, chartData.brand_totals.impressions.goal);
            chart.series[0].points[0].update(chartData.brand_totals.impressions.value);
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
                createHtmlStructure();
    
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
