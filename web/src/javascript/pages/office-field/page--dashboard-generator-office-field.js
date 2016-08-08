jQuery(function($) {

    //These pull in the standard dashboard functionality that will be needed.
    //=include config/dashboard/dashboard--main-config.js
    //=include config/dashboard/dashboard--numeric-renderer.js

    function renderBrandTotals($section, data){

        renderNumeric($section.find(".ba-chaser-spend"), "Total Chaser Spend", data["ba-chaser-spend"].value, null, "monetary");
        renderNumeric($section.find(".average-event-spend"), "Average Spend Per Event", data["average-product-spend"].value, null, "monetary");

        $section.find(".customer-engagements").highcharts(Highcharts.merge(defaultOptions.gaugeOptions, {
            yAxis: {
                min: 0,
                max: data["customer-engagements"].goal,
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
                    data: [data["customer-engagements"].value],
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

        $section.find(".events-completed").highcharts(Highcharts.merge(defaultOptions.gaugeOptions, {
            yAxis: {
                min: 0,
                max: data["events-completed"].goal,
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
                    data: [data["events-completed"].value],
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
                max: data["samples-given"].goal,
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
                    data: [data["samples-given"].value],
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

    function renderFullProgramResults($section, data) {
        $section.find(".full-program-results-container").empty();
        $section.find(".full-program-results-container").mrjsontable({
            tableClass: "miwt-table full-program-results-table",
            pageSize: 20,
            columns: [
                new $.fn.mrjsontablecolumn({
                    heading: "Full Program Top Line Results",
                    data: "total-desc",
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
                    data: "percent-to-goal",
                    type: "int",
                    sortable: false
                })
            ],
            data: data
        });
    }

    function renderCampaignStatus($section, data) {
        renderNumeric($section.find(".active-events"), "Active", data["active-events"].value, "Events", "integer");
        renderNumeric($section.find(".rescheduled-events"), "Rescheduled", data["rescheduled-events"].value, "Events", "integer");
        renderNumeric($section.find('.ready-for-review-events'), "Ready For Review", data["ready-for-review-events"].value, "Events", "integer");
        renderNumeric($section.find(".completed-events"), "Completed", data["completed-events"].value, "Events", "integer");
        renderNumeric($section.find(".canceled-events"), "Canceled", data["canceled-events"].value, "Events", "integer");
    }

    function renderPriceMatrix($section, data) {
        $section.find(".price-matrix-container").empty();
        $(data).each(function (index, tableData) {
            var brand = tableData[0].brand;
            var $matrixTable = $('<div class="price-matrix-table '+brand+' table-wrapper"></div>');
            $matrixTable.appendTo($section.find(".price-matrix-container"));
            $matrixTable.mrjsontable({
                tableClass: "miwt-table price-matrix-table-" + brand,
                pageSize: 20,
                columns: [
                    new $.fn.mrjsontablecolumn({
                        heading: "Brand",
                        data: "brand",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "Average Price",
                        data: "average-price",
                        type: "monetary",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "Sale Price Variance",
                        data: "sale-price-variance",
                        type: "monetary",
                        sortable: false
                    })
                ],
                data: tableData
            });
        });
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
                    data: data.age
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
                    data: data.gender
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
                    data: data.background
                }
            ],
            credits: {
                enabled: false
            }

        }));
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
                renderBrandTotals($section, chartData[collectionName]);
                break;
            case "full-program-results":
                renderFullProgramResults($section, chartData[collectionName]);
                break;
            case "campaign-status":
                renderCampaignStatus($section, chartData[collectionName]);
                break;
            case "price-matrix":
                renderPriceMatrix($section, chartData[collectionName]);
                break;
            case "consumer-demographics":
                renderConsumerDemographics($section, chartData[collectionName]);
            default:
                break;
        }
    }

});