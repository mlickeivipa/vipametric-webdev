$(function () {
    setTotalMetricsValues();
});

var setTotalMetricsValues = function() {
    $(".metric-total").each(function (index, element) {
        var metricRef = $(this).attr("metric");
        var list = $(".metric-container[loose-total-metric='" + metricRef + "'] .val");
        var total = 0;
        var previousValue = 0;
        $(list).each(function (index, element) {
            var numVal = (parseFloat($(this).text()) || 0);
            if(index === 0) {
                previousValue = numVal;
                return;
            }
            total += Math.abs((numVal - previousValue));
        });
        $(this).find(".val").text(total);
    });
};