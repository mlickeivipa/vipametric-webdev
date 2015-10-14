var React = require('react');

var Metric = React.createClass({
	render: function() {
		var metricNodes;

		switch (this.props.type) {
			case 'textarea':
				metricNodes = ('<Metric.textarea />');
				break;
			case 'percentage':
				metricNodes = ('<Metric.percentage />');
				break;
		}

		return (
			<div class="metric">
				{metricNodes}
			</div>
		);
	}
});

Metric.textarea = React.createClass({
	render: function() {
		return (
			<textarea />
		);
	}
});

Metric.percentage = React.createClass({
	render: function() {
		return (
			<div className="metric-capture">
				<span className="metric-label">{this.props.label}</span>
				<span className="metric-value"><input type="text" /></span>
				<span classNAme="metric-type-ident">%</span>
			</div>
		);
	}
});

var MetricGroup = React.createClass({
	render: function() {
		var metricContentNodes;
		switch (this.props.type) {
			case 'textarea':
				metricContentNodes = (<MetricGroup.textarea />);
				break;
			case 'percentage-distribution':
				metricContentNodes = (<MetricGroup.percentageDistribution />);
				break;
			default:
				metricContentNodes = this.props.metrics.map(function(metric) {

				});
		}

		return (
			<div className="metric-group">
				<div className="metric-group-heading">{this.props.label}</div>
				<div className="metric-group-content">
					{metricContentNodes}
				</div>
			</div>
		);
	}
});

MetricGroup.textarea = React.createClass({
	render: function() {
		return (
			<Metric type='textarea' />
		);
	}
});


MetricGroup.percentageDistribution = React.createClass({
	render: function() {
		var percentageNodes = this.props.metrics.map(function(metric) {
			return (
				<Metric type='percentage' />
			);
		});
		return (
			<div class="metric-content">
				{percentageNodes}
			</div>
		);
	}
});

var EngagementDemoUI = React.createClass({
	render: function() {
		var groupNodes = this.props.groups.map(function(group) {
			return (
				<MetricGroup type={group.type} metrics={group.metrics} label={group.label} />
			);
		});

		return (
			<div className="metrics">
				{groupNodes}
			</div>
		);
	}
});