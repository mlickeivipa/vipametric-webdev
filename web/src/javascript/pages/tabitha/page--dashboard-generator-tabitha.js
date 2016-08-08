jQuery(function($) {

    //These pull in the standard dashboard functionality that will be needed.
    //=include config/dashboard/dashboard--main-config.js
    //=include config/dashboard/dashboard--numeric-renderer.js

    function findAverageOfData(data)
    {
        var averageMapping = {};

        for(var dataIdx=0; dataIdx<data.length; dataIdx++)
        {
            var categoryData = data[dataIdx].data;

            for(var categoryIdx=0; categoryIdx<categoryData.length; categoryIdx++)
            {
                //Init if not already done
                if(averageMapping[categoryIdx] == null)
                {
                    averageMapping[categoryIdx] = 0;
                }

                averageMapping[categoryIdx] += categoryData[categoryIdx];

                if(dataIdx == data.length -1)
                {
                    averageMapping[categoryIdx] = averageMapping[categoryIdx] / (dataIdx+1);
                }
            }
        }

        return averageMapping;
    }

    function reformatSuggestionName(name)
    {
        switch (name) {
            case "Yes, improve communication":
                return "Improve communication";
            case "Yes, improve referral process":
                return "Improve referral process";
            case "Yes, improve customer service":
                return "Improve customer service";
            case "No, when we have referrals we choose Tabitha":
                return "No, refer Tabitha";
            case "No, our census is low/we have not had any referrals to any agency":
                return "No, low census";
            case "No, we prefer another agency":
                return "No, prefer another agency";
            default:
                return name;
        }
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

    function getPieReadyDataWithFormattedNames(data, formatter)
    {
        var valuesArr = [];

        $.each(Object.keys(data), function(idx, key)
        {
            var curVal = data[key];

            valuesArr.push([formatter(key), curVal]);
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

    function renderGeneralQuestionSummaryBox(data, $section, selectorStr)
    {
        var excellent = data["Excellent"],
            good = data["Good"],
            average = data["Average"],
            poor = data["Poor"],
            veryPoor = data["Very Poor"],
            formattedData = getColumnReadyData(data),
            total = formattedData.total;

        var $numberCont = $section.find('.excellent-percent');
        renderNumeric($numberCont,
            "Excellent",
            (excellent/total)*100,
            null,
            $numberCont.data("numeric-type")
        );

      	$numberCont = $section.find('.good-percent');
        renderNumeric($numberCont,
            "Good",
            (good/total)*100,
            null,
            $numberCont.data("numeric-type")
        );

        $numberCont = $section.find('.average-percent');
        renderNumeric($numberCont,
            "Average",
            (average/total)*100,
            null,
            $numberCont.data("numeric-type")
        );

        $numberCont = $section.find('.poor-percent');
        renderNumeric($numberCont,
            "Poor",
            (poor/total)*100,
            null,
            $numberCont.data("numeric-type")
        );

        $numberCont = $section.find('.very-poor-percent');
        renderNumeric($numberCont,
            "Very Poor",
            (veryPoor/total)*100,
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

    function renderM2DInteractionsPerRegion($section, data)
    {
        //Month to date
        $numberCont = $section.find('.interactions-m2d');
        renderNumeric($numberCont,
            "Month to Date",
            data["month-to-date"],
            "Interactions",
            $numberCont.data("numeric-type")
        );

        //Render graph
        $section.find(".m2d-interactions-per-region").highcharts(Highcharts.merge(defaultOptions.barOptions, {
            title: {
                text: ''
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Interactions Month To Date'
                }
            },
            xAxis: {
                categories: ["This Month"],
                labels: {
                    enabled: true
                }
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} Region Interactions: </td><td style="padding:0"><b>{point.y:.lf}</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: data["regions"]
        }));
    }

    function renderOverallExcellent($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            ".overall-answer-summary");
    }

    function renderReferralProcessSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            ".referral-answer-summary");
    }

    function renderCsReferralSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            ".cs-referral-answer-summary");
    }

    function renderCsClientSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            ".cs-client-answer-summary");
    }

    function renderOutreachLiaisonSummary($section, data)
    {
        renderGeneralQuestionSummaryBox(
            data,
            $section,
            ".outreach-liaison-answer-summary");
    }

    function renderRolesSummary($section, data)
    {
        $section.find(".interactions-roles-summary").highcharts(Highcharts.merge(defaultOptions.pieWithLegendOptions, {
            title: {
                text: ''
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: false
                }
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
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: false
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    type: 'pie',
                    name: 'Suggestions',
                    data: getPieReadyDataWithFormattedNames(data, reformatSuggestionName)
                }
            ]
        }));
    }

    function renderRegionalInteractionsOverTime($section, data)
    {
        var averageInteractions = findAverageOfData(data["regionalData"]);

        $section.find('.regional-interactions-over-time').highcharts(Highcharts.merge(defaultOptions.columnOptions, {
            title: {
                text: ""
            },
            yAxis: {
                title: {
                    text: "Interactions"
                }
            },
            xAxis: {
                categories: data["month-categories"],
                labels: {
                    enabled: true
                }
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} Interactions: </td><td style="padding:0"><b>{point.y:.lf}</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: data["regionalData"]
        }));
    }

    function renderRegionalExcellentOverTime($section, data)
    {
        $section.find('.regional-excellent-over-time').highcharts(Highcharts.merge(defaultOptions.columnOptions, {
            title: {
                text: ""
            },
            yAxis: {
                title: {
                    text: "# of Excellent Answers"
                }
            },
            xAxis: {
                categories: data["month-categories"],
                labels: {
                    enabled: true
                }
            },
            tooltip: {
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} Region: </td><td style="padding:0"><b>{point.y:.lf} Excellent Answers</b></td></tr>'
            },
            credits: {
                enabled: false
            },
            series: data["regionalData"]
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
                renderM2DInteractionsPerRegion($section, chartData[collectionName]);
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
                renderRegionalInteractionsOverTime($section, chartData[collectionName]);
                break;
            case "regional-excellent-over-time":
                renderRegionalExcellentOverTime($section, chartData[collectionName]);
                break;
            default :
                break;
        }
    }

});