function createHtmlStructure() {
	if ($(".dash-container").length === 0 ) {
		$(document.createElement("div")).addClass("dash-container").appendTo(".e-content");
	}

	$(".dash-container").empty();

	$(document.createElement("div")).addClass("dash-section").addClass("brand-totals").addClass("circular-chart-wrapper").appendTo(".dash-container");
	$(document.createElement("div")).addClass("dash-section-header").addClass("brand-totals-header").text("Brand Totals").appendTo("div.brand-totals");
	//$(document.createElement("div")).addClass("bottle-sales").addClass("gauge-chart").appendTo("div.brand-totals");
	$(document.createElement("div")).addClass("events-completed").addClass("gauge-chart").appendTo("div.brand-totals");
	//$(document.createElement("div")).addClass("samples-given").addClass("gauge-chart").appendTo("div.brand-totals");
	$(document.createElement("div")).addClass("impressions").addClass("gauge-chart").appendTo("div.brand-totals");

	$([
		'<div class="dash-section leads circular-chart-wrapper">',
		'<div class="dash-section-header">Leads</div>',
		'<div class="dash-section-content">',
		'<div class="gauge-chart lead-email"></div>',
		'<div class="gauge-chart lead-phone"></div>',
		'<div class="gauge-chart lead-social"></div>',
		'<div class="gauge-chart lead-address"></div>',
		'</div>',
		'</div>'
	].join(''))
		.insertAfter('.brand-totals');


	$(document.createElement("div")).addClass("dash-section").addClass("full-program-results-container").appendTo(".dash-container");
	$(document.createElement("div")).addClass("full-program-results").addClass("table-wrapper").appendTo("div.full-program-results-container");


	//$(document.createElement("div")).addClass("dash-section").addClass("price-matrix").appendTo(".dash-container");


	$(document.createElement("div")).addClass("dash-section").addClass("consumer-demographics").addClass("circular-chart-wrapper").appendTo(".dash-container");
	$(document.createElement("div")).addClass("dash-section-header").addClass("consumer-demographics-header").text("Consumer Demographics").appendTo("div.consumer-demographics");
	$(document.createElement("div")).addClass("age").addClass("pie-chart").appendTo("div.consumer-demographics");
	$(document.createElement("div")).addClass("gender").addClass("pie-chart").appendTo("div.consumer-demographics");
	$(document.createElement("div")).addClass("language").addClass("pie-chart").appendTo("div.consumer-demographics");
	$(document.createElement("div")).addClass("background").addClass("pie-chart").appendTo("div.consumer-demographics");


	$(document.createElement("div")).addClass("dash-section").addClass("multi-chart-wrapper").addClass("consumer-purchase-motivators-wrapper").appendTo(".dash-container");
	$(document.createElement("div")).addClass("consumer-purchase-motivators").addClass("column-chart").appendTo("div.consumer-purchase-motivators-wrapper");

	$(document.createElement("div")).addClass("right-account").addClass("pie-chart").appendTo("div.consumer-purchase-motivators-wrapper");
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
	colors: ['#4b93ad'],
	chart: {
		type: 'solidgauge'
	},

	title: null,

	credits: {
		enabled: false
	},

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
			[0, '#4b93ad'], // red
			[0.25, '#4b93ad'], // red
			[0.26, '#4b93ad'], // yellow
			[0.69, '#4b93ad'], // yellow
			[0.7, '#4b93ad'], // green
			[1, '#4b93ad'] // green
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
	credits: {
		enabled: false
	},
	title: {
		align: 'center',
		verticalAlign: 'middle',
		y: 65
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
	legend: {
		floating: true
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
	credits: {
		enabled: false
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
	credits: {
		enabled: false
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



var leadCharts = [
	{
		selector: '.lead-email',
		label: "Emails",
		suffix: ' Emails',
		data: {
			goal: 3000,
			value: 2321
		}
	},
	{
		selector: '.lead-phone',
		label: 'Phone Numbers',
		suffix: ' Phone Numbers',
		data: {
			goal: 3000,
			value: 2578
		}
	},
	{
		selector: '.lead-social',
		label: 'Social Accounts',
		suffix: ' Social Accounts',
		data: {
			goal: 3000,
			value: 1251
		}
	},
	{
		selector: '.lead-address',
		label: 'Addresses',
		suffix: ' Addresses',
		data: {
			goal: 1400,
			value: 324
		}
	}
];

function createCharts() {
	$("div.events-completed").highcharts(Highcharts.merge(gaugeOptions, {
		yAxis: {
			min: 0,
			max: 10,
			title: {
				text: "Events"
			}
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

	for (var i=0;i<leadCharts.length;i++) {
		var chartConfig = leadCharts[i];
		$(chartConfig.selector).highcharts(Highcharts.merge(gaugeOptions, {
			yAxis: {
				min: 0,
				max: 10,
				title: {
					text: chartConfig.label
				}
			},

			series: [
				{
					name: chartConfig.label,
					data: [0],
					dataLabels: {
						format: '<div style="text-align:center"><span style="font-size:25px;color:' + ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
						'<span style="font-size:12px;color:silver">' + chartConfig.label + '</span></div>'
					},
					tooltip: {
						valueSuffix:  chartConfig.suffix
					}
				}
			]
		}));
	}

	$("div.consumer-demographics div.age").highcharts(Highcharts.merge(semiCircleDonutOptions, {
		title: {
			text: "Age"
		}
	}));

	$("div.consumer-demographics div.gender").highcharts(Highcharts.merge(semiCircleDonutOptions, {
		title: {
			text: "Gender"
		}
	}));

	$("div.consumer-demographics div.language").highcharts(Highcharts.merge(semiCircleDonutOptions, {
		title: {
			text: "Language"
		}
	}));

	$("div.consumer-demographics div.background").highcharts(Highcharts.merge(semiCircleDonutOptions, {
		title: {
			text: "Background"
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
		series: []
	}));

	$("div.right-account").highcharts(Highcharts.merge(pieWithLegendOptions, {
		title: {
			text: 'Are we in the right accounts?'
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

		for (var i=0;i<leadCharts.length;i++) {
			var chartConfig = leadCharts[i];
			chart = $(chartConfig.selector).highcharts();
			chart.yAxis[0].setExtremes(0, chartConfig.data.goal);
			chart.series[0].points[0].update(chartConfig.data.value);
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
		$(document).trigger('vm:dashboard-loaded');
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
