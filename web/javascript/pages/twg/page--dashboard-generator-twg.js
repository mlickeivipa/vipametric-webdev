jQuery(function($) {

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
        if(messageType == null)
        {
            hideAllMessages();
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
            if(!$loadingClone.length) {
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
        $("div.bottle-sales").highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 10,
                title: {
                    text: "Bottle Sales"
                }
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: "Bottle Sales",
                    data: [0],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">Bottles</span></div>'
                    },
                    tooltip: {
                        valueSuffix: ' Bottles'
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

    function renderNumeric($container, label, value, description, numericType) {
        switch (numericType) {
            case "percentage":
                var $label = $('<div class="data-label">'+label+'</div>'),
                    $value = $('<div class="data-value">'+value+'<span class="percent-sign">%</span></div>'),
                    $description = $('<div class="data-description">'+description+'</div>');
                $container.append($label,$value,$description);
                break;
            default :
                break;
        }
    }

    function renderBrandTotals($section, data){

        var $numericCont = $section.find(".conversion-rate");
        renderNumeric($numericCont, "Conversion Rate", data.conversion_rate.value * 100, "Total Sales / Impressions", $numericCont.data("numeric-type"));

        $section.find(".bottle-sales").highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: data.bottle_sales.goal,
                title: {
                    text: "Bottle Sales"
                }
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: "Bottle Sales",
                    data: [data.bottle_sales.value],
                    dataLabels: {
                        format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                            '<span style="font-size:12px;color:silver">Bottles</span></div>'
                    },
                    tooltip: {
                        valueSuffix: ' Bottles'
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

    function populateSection($section, collectionName, chartData) {
        switch(collectionName) {
            case "brand-totals":
                renderBrandTotals($section, chartData.brand_totals);
                break;
            case "full-program-results":

                break;
            case "price-matrix":

                break;
            case "consumer-demographics":

                break;
            case "consumer-purchase-motivators":

                break;
            default :
                break;
        }
    }

    function updateChartsAndTables(params) {
        $dashboardSections.each(function() {
            var $section = $(this);

            //Add the section we are loading as a param
            var collectionName = $section.data("collection-name");
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

//        if (no_data === false) {
//            var chart = $("div.bottle-sales").highcharts();
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, chartData.brand_totals.bottle_sales.goal);
//                chart.series[0].points[0].update(chartData.brand_totals.bottle_sales.value);
//            }
//
//            chart = $("div.events-completed").highcharts();
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, chartData.brand_totals.events_completed.goal);
//                chart.series[0].points[0].update(chartData.brand_totals.events_completed.value);
//            }
//
//            chart = $("div.samples-given").highcharts();
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, chartData.brand_totals.samples_given.goal);
//                chart.series[0].points[0].update(chartData.brand_totals.samples_given.value);
//            }
//
//            chart = $("div.impressions").highcharts();
//            if (chart) {
//                chart.yAxis[0].setExtremes(0, chartData.brand_totals.impressions.goal);
//                chart.series[0].points[0].update(chartData.brand_totals.impressions.value);
//            }
//
//            var conversionRate = chartData.brand_totals.conversion_rate;
//            if (conversionRate) {
//                $(".conversion-rate .data-value").prepend(conversionRate.value * 100);
//            }
//
//            $("div.full-program-results").empty();
//            $("div.full-program-results").mrjsontable({
//                tableClass: "miwt-table full-program-results-table",
//                pageSize: 20,
//                columns: [
//                    new $.fn.mrjsontablecolumn({
//                        heading: "Full Program Top Line Results",
//                        data: "total_desc",
//                        sortable: false
//                    }),
//                    new $.fn.mrjsontablecolumn({
//                        heading: "To Date",
//                        data: "total",
//                        type: "int",
//                        sortable: false
//                    }),
//                    new $.fn.mrjsontablecolumn({
//                        heading: "Total Goal",
//                        data: "goal",
//                        type: "int",
//                        sortable: false
//                    }),
//                    new $.fn.mrjsontablecolumn({
//                        heading: "% to Goal",
//                        data: "percent_to_goal",
//                        type: "int",
//                        sortable: false
//                    })
//                ],
//                data: chartData.brand_totals.full_program_results
//            });
//
//            if (chartData.price_matrix.length > 0) {
//                $("div.price-matrix").empty();
//                $(document.createElement("div")).addClass("dashboard-section-header").addClass("price-matrix-header").text("Price Matrix").appendTo("div.price-matrix");
//                $(chartData.price_matrix).each(function (index, tableData) {
//                    var brand = tableData[0].brand.replace(/[^\w\d\-]+/, "").toLowerCase();
//                    $(document.createElement("div")).addClass("price-matrix-table").addClass(brand).addClass("table-wrapper").appendTo("div.price-matrix");
//                    $("div.price-matrix-table." + brand).mrjsontable({
//                        tableClass: "miwt-table price-matrix-table-" + brand,
//                        pageSize: 10,
//                        columns: [
//                            new $.fn.mrjsontablecolumn({
//                                heading: "Brand(size 750ml)",
//                                data: "brand",
//                                sortable: false
//                            }),
//                            new $.fn.mrjsontablecolumn({
//                                heading: "Reg Price",
//                                data: "reg_price",
//                                sortable: false
//                            }),
//                            new $.fn.mrjsontablecolumn({
//                                heading: "Sales Price",
//                                data: "sales_price",
//                                sortable: false
//                            }),
//                            new $.fn.mrjsontablecolumn({
//                                heading: "Reg Price Variance",
//                                data: "reg_price_variance",
//                                sortable: false
//                            }),
//                            new $.fn.mrjsontablecolumn({
//                                heading: "Sales Price Variance",
//                                data: "sale_price_variance",
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
//            chart = $("div.consumer-purchase-motivators").highcharts();
//            if (chart) {
//                $(chart.series).each(function (index, series) {
//                    series.remove();
//                });
//
//                $(chartData.consumer_purchase_motivators).each(function (index, seriesData) {
//                    chart.addSeries({
//                        name: seriesData[0]
//                    }).addPoint(seriesData[1]);
//                });
//            }
//
//            chart = $("div.right-account").highcharts();
//            if (chart) {
//                chart.series[0].setData(chartData.right_account);
//            }
//        }
//        else {
//            displayMessage();
//        }
    }

    function updateData() {
        var searchParamPath = $searchParamsContainer.data("component-url");

        $.ajax(searchParamPath, {
            contentType: "application/json"
        }).done(function(data) {
                //start our next thing after processing the data given (should be params)
            var params = JSON.parse(data);
            updateChartsAndTables(params);
        })
            .fail(function() {
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
