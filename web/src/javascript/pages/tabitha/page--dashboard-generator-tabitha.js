jQuery(function($) {

    //=require ../../dashboard/dashboard--main-config.js
    //=require ../../dashboard/dashboard--numeric-renderer.js

    function renderFullProgramResults($section, data) {
        $section.find(".full-program-results-container").empty();
        $section.find(".full-program-results-container").mrjsontable({
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
            data: data.full_program_results
        });
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
                        heading: "Brand(size 750ml)",
                        data: "brand_name",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "Reg Price",
                        data: "reg_price",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "Sales Price",
                        data: "sales_price",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "Reg Price Variance",
                        data: "reg_price_variance",
                        sortable: false
                    }),
                    new $.fn.mrjsontablecolumn({
                        heading: "Sales Price Variance",
                        data: "sale_price_variance",
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
                    name: 'Percent of Consumers',
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
                    name: 'Percent of Consumers',
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
                    name: 'Percent of Consumers',
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
                    name: 'Percent of Consumers',
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
        $section.find(".consumer-purchase-motivators").highcharts(Highcharts.merge(defaultOptions.columnOptions, {
            title: {
                text: "Consumer Purchase Motivators"
            },
            yAxis: {
                title: {
                    text: "Consumers"
                }
            },
            xAxis: {
                categories: ['Purchase Motivators']
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.lf} Consumers</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: data.consumer_purchase_motivators
        }));

        $section.find(".right-account").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
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
                    data: data.right_account
                }
            ]
        }));
    }

    function getPieReadyData(data)
    {
        var valuesArr = [];

        $.each(Object.keys(data), function(idx, key)
        {
            var curVal = data[key];

            valuesArr.push([key, curVal]);
        });

        return valuesArr;
    }

    function getColumnReadyData(data)
    {
        var total = 0;

        var valuesArr = [];
        $.each(Object.keys(data), function(idx, key)
        {
            var curVal = data[key];
            total += curVal;

            valuesArr.push(curVal);
        });

        return {
            total: total,
            data: [{
                name: "This Months Scores",
                data: valuesArr
            }]
        };
    }

    function renderGeneralQuestionSummaryBox(data, $section, numSelectorStr, selectorStr)
    {
        var excellent = data["Excellent"],
            formattedData = getColumnReadyData(data),
            total = formattedData.total;

        var $numberCont = $section.find(numSelectorStr);
        renderNumeric($numberCont,
            "% Excellent",
            (excellent/total)*100,
            null,
            $numberCont.data("numeric-type")
        );

        $section.find(selectorStr).highcharts(Highcharts.merge(defaultOptions.columnOptions, {
            title: {
                text: "Month to Date Summary"
            },
            yAxis: {
                title: {
                    text: "# of Times Selected"
                }
            },
            xAxis: {
                categories: Object.keys(data),
                labels: {
                    enabled: true
                }
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} Answers: </td><td style="padding:0"><b>{point.y:.lf}</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: formattedData.data
        }));
    }

    function renderTotalInteractions($section, data)
    {
        var $numberCont = $section.find('.interactions-m2d');

        //Month to date
        renderNumeric($numberCont,
            "Month to Date",
            data["month-to-date"],
            "Interactions",
            $numberCont.data("numeric-type")
        );

        //Last Month
        $numberCont = $section.find('.interactions-last-month');
        renderNumeric($numberCont,
            "Last Month",
            data["last-month"],
            "Interactions",
            $numberCont.data("numeric-type")
        );

        //Last Quarter
        $numberCont = $section.find('.interactions-last-quarter');
        renderNumeric($numberCont,
            "Last Quarter",
            data["last-quarter"],
            "Interactions",
            $numberCont.data("numeric-type")
        );

        //Last Month
        $numberCont = $section.find('.interactions-ytd');
        renderNumeric($numberCont,
            "Year to Date",
            data["year-to-date"],
            "Interactions",
            $numberCont.data("numeric-type")
        );
    }

    function renderOverallExcellent($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            '.overall-excellent-percent',
            ".overall-answer-summary");
    }

    function renderReferralProcessSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            '.referral-excellent-percent',
            ".referral-answer-summary");
    }

    function renderCsReferralSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            '.cs-referral-excellent-percent',
            ".cs-referral-answer-summary");
    }

    function renderCsClientSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            '.cs-client-excellent-percent',
            ".cs-client-answer-summary");
    }

    function renderOutreachLiaisonSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            '.outreach-liaison-excellent-percent',
            ".outreach-liaison-answer-summary");
    }

    function renderRolesSummary($section, data)
    {
        $section.find(".interactions-roles-summary").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Submissions Per Role',
                    data: getPieReadyData(data)
                }
            ]
        }));
    }

    function renderSuggestionsSummary($section, data)
    {
        $section.find(".referral-suggestions-summary").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Suggestions',
                    data: getPieReadyData(data)
                }
            ]
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
        switch(collectionName) {
            case "total-interactions":
                renderTotalInteractions($section, chartData[collectionName]);
                break;
            case "interactions-per-region":

                break;
            case "overall-summary":
                renderOverallExcellent($section, chartData[collectionName]);
                break;
            case "referral-process-summary":
                renderReferralProcessSummary($section, chartData[collectionName]);
                break;
            case "cs-referral-summary":
                renderCsReferralSummary($section, chartData[collectionName]);
                break;
            case "cs-client-summary":
                renderCsClientSummary($section, chartData[collectionName]);
                break;
            case "outreach-liaison-summary":
                renderOutreachLiaisonSummary($section, chartData[collectionName]);
                break;
            case "roles-summary":
                renderRolesSummary($section, chartData[collectionName]);
                break;
            case "suggestions-summary":
                renderSuggestionsSummary($section, chartData[collectionName]);
                break;
            case "regional-interactions-over-time":

                break;
            case "regional-excellent-over-time":

                break;
            default :
                break;
        }
    }

});