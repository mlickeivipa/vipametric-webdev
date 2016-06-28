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

//Default highcharts render options.
var defaultOptions = {
    gaugeOptions: {

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
    },

    semiCircleDonutOptions: {
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
    },

    columnOptions: {
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
    },

    barOptions: {
        chart: {
            type: 'bar'
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
        }
    },

    pieWithLegendOptions: {
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
    }
};

/**
 * Will display a message to the user based on the message type you pass in. Will display nothing if null is passed in.
 *
 * @param messageType Message type to display.
 */
var displayMessage = function(messageType) {
    if(messageType == null)
    {
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
};

/**
 * Will hide all messages in the message container.
 *
 */
var hideAllMessages = function() {
    $MESSAGE_ERROR_GENERIC.removeClass(CLASSNAME_SHOW);
    $MESSAGE_ERROR_PERMISSIONS.removeClass(CLASSNAME_SHOW);
    $MESSAGE_NO_DATA.removeClass(CLASSNAME_SHOW);
};

/**
 * Will show the loading message and add it to the target container if needed.
 *
 * @param $target True/false value for showing the loading message.
 */
var addLoadingMessage = function($target) {
    if ($target) {
        var $loadingClone = $target.find(CLASSNAME_LOADING_CONTAINER);
        if(!$loadingClone.length) {
            $loadingClone = $loadingContainer.clone();
        }
        $target.prepend($loadingClone);
        $loadingClone.addClass(CLASSNAME_SHOW);
    }
};

/**
 * Will hide the loading message. WONT REMOVE THE
 *
 * @param $target
 */
var hideLoadingMessage = function($target) {
    if ($target) {
        var $loadingClone = $target.find(CLASSNAME_LOADING_CONTAINER);
        $loadingClone.removeClass(CLASSNAME_SHOW);
    }
};

var updateChartsAndTables = function(params) {
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
};

var updateData = function() {
    var searchParamPath = $searchParamsContainer.data("component-url");

    $.ajax(searchParamPath, {
        contentType: "application/json"
    }).done(function(data) {
        //start our next thing after processing the data given (should be params)
        var params = JSON.parse(data);
        updateChartsAndTables(params);
    }).fail(function() {
        //Welp
        //TODO move into finished listener
        addLoadingMessage(false);
        //TODO move into error listener
        displayMessage(MESSAGE_TYPE_ERROR_GENERIC);
    });
};

var init = function()
{
    $searchBtn.on('click', function () {
        displayMessage(null);
        updateData();
    });

    updateData();
};

init();