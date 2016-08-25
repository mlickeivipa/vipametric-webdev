jQuery(function($) {

    //These pull in the standard dashboard functionality that will be needed.
    //=include config/dashboard/dashboard--main-config.js
    //=include config/dashboard/dashboard--numeric-renderer.js

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

    function renderBrandTotals($section, data){
        renderNumeric($section.find(".ba-product-spend"), "Total Product Spend", data.product_spend.value, null, "monetary");
        renderNumeric($section.find(".average-event-spend"), "Average Spend Per Event", data.average_product_spend.value, null, "monetary");

        var $liftRate = $section.find(".lift-rate");
        renderNumeric($liftRate, "Average Lift Rate", data.lift_rate.value, null, $liftRate.data('numeric-type'));

        $section.find(".events-completed").highcharts(Highcharts.merge(defaultOptions.gaugeOptions, {
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

        $section.find(".samples-given").highcharts(Highcharts.merge(defaultOptions.gaugeOptions, {
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

        $section.find(".impressions").highcharts(Highcharts.merge(defaultOptions.gaugeOptions, {
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

    function renderConsumerDemographics($section, data) {
        $section.find(".age").highcharts(Highcharts.merge(defaultOptions.semiCircleDonutOptions, {
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

        $section.find(".gender").highcharts(Highcharts.merge(defaultOptions.semiCircleDonutOptions, {
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

        $section.find(".language").highcharts(Highcharts.merge(defaultOptions.semiCircleDonutOptions, {
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

        $section.find(".background").highcharts(Highcharts.merge(defaultOptions.semiCircleDonutOptions, {
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

    function renderConsumerPurchaseMotivators($section, data) {
        $section.find(".familiarity").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
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

        $section.find(".likely-purchase").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
            title: {
                text: "Likely to Purchase Estrella"
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

        $section.find(".preferred-brand").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
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

        $section.find(".consumer-purchase-motivators").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
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

    function renderCampaignStatus($section, data) {
        renderNumeric($section.find(".active-events"), "Active", data.active_events.value, "Events", "integer");
        renderNumeric($section.find(".rescheduled-events"), "Rescheduled", data.rescheduled_events.value, "Events", "integer");
        renderNumeric($section.find('.ready-for-review-events'), "Ready For Review", data.ready_for_review_events.value, "Events", "integer");
        renderNumeric($section.find(".completed-events"), "Completed", data.completed_events.value, "Events", "integer");
        renderNumeric($section.find(".canceled-events"), "Canceled", data.canceled_events.value, "Events", "integer");
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

        $section.find(".foot-traffic").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
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

        $section.find(".optimal-time").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
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

    function renderUnitsSoldSummary($section, data) {
        $section.find(".units-sold-summary-container").empty();
        var $matrixTable = $('<div class="units-sold-table table-wrapper"></div>');
        $matrixTable.appendTo($section.find(".units-sold-summary-container"));
        $matrixTable.mrjsontable({
            tableClass: "miwt-table price-matrix-table",
            pageSize: 10,
            columns: [
                new $.fn.mrjsontablecolumn({
                    heading: "Packaging",
                    data: "packaging",
                    sortable: false
                }),
                new $.fn.mrjsontablecolumn({
                    heading: "Packages Sold",
                    data: "packages_sold",
                    sortable: false
                }),
                new $.fn.mrjsontablecolumn({
                    heading: "Units Sold",
                    data: "units_sold",
                    sortable: false
                })
            ],
            data: data
        });
    }

    /**
     * This is the standard function that will be called when data is loaded for a section.
     *
     * @param $section The section we are rendering.
     * @param collectionName The collection name for the section.
     * @param chartData The data returned for the section.
     */
    function populateSection($section, collectionName, chartData) {
        switch (collectionName) {
            case "brand-totals":
                renderBrandTotals($section, chartData.brand_totals);
                break;
            case "consumer-demographics":
                renderConsumerDemographics($section, chartData);
                break;
            case "consumer-purchase-motivators":
                renderConsumerPurchaseMotivators($section, chartData.consumer_insights);
                break;
            case "campaign-status":
                renderCampaignStatus($section, chartData.campaign_status);
                break;
            case "account-environment":
                renderAccountEnvironment($section, chartData.account_environment);
                break;
            case "units-sold-summary":
                renderUnitsSoldSummary($section, chartData['units-sold-summary']);
                break;
            default :
                break;
        }
    }

});