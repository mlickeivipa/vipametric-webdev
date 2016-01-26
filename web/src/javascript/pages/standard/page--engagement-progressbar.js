jQuery(function ($) {
    function tempUpdates(context) {
        var $context = $(context);

        $context.find('.sub-section-header').each(function(idx) {
            var $con = $(this);

            $con.find('.metric-set-value-count').each(function (idx, el) {
                var $metricSetValue = $(el);
                var count = parseInt($metricSetValue.data('valueCount'));
                var total = parseInt($metricSetValue.data('completedCount'));
                var percent = Math.floor((count / total) * 100);

                if (percent == 100) {
                    $metricSetValue.closest('.sub-section').addClass('complete');
                }

                $metricSetValue
                    .empty()
                    .append('<span class="metric-value-bar" title="'+ count + '/' + total + ' Complete"><span class="metric-value-bar-progress" style="width: ' + percent + '%;" /></span>');
            });
        });
    }

    $('.miwt-form').each(function () {
        var form = this;

        if (!form.submit_options) {
            form.submit_options = {};
        }

        var oldPostUpdate = form.submit_options.postUpdate ? form.submit_options.postUpdate : $.noop;

        form.submit_options.postUpdate = function () {
            oldPostUpdate();
            tempUpdates(form);
        };

        tempUpdates(form);
    });
});