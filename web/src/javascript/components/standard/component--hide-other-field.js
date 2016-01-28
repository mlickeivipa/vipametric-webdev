jQuery(function($){
    var $editorCon = $(".vipametric-wrapper");
    var $metricGroups = $editorCon.find(".metric-group-container");
    var CSS_SHOW_CLASS = "show";

    $metricGroups.each(function(idx, metric){
        var $metric = $(metric);
        var $choiceMetric = $metric.find('.metric-container.choice-metric');
        $choiceMetric.find("span:contains('Other')").closest('.ctb').addClass("other");

        var $otherCheckbox = $choiceMetric.find('.ctb.other');
        var $otherString = $otherCheckbox.closest('.metric.choice-metric').siblings('.string-metric');

        $otherCheckbox.on('click', function(e){
            if ($otherCheckbox.find("input").is(':checked')) {
                $otherString.addClass(CSS_SHOW_CLASS);
            }
            else {
                $otherString.removeClass(CSS_SHOW_CLASS);
            }
        });

        if ($otherCheckbox.find("input").is(':checked')) {
            $otherString.addClass(CSS_SHOW_CLASS);
        }
        else {
            $otherString.removeClass(CSS_SHOW_CLASS);
        }
    });

});