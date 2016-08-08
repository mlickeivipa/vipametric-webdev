jQuery(function($){

    function initTimeUpdates() {
        var $timeSelect = $('select.ui-timepicker-select');

        if ($timeSelect.length && $timeSelect.closest('.sub-section-container').length) {
            $timeSelect.each(function(idx, select){
                var $select = $(select);
                if ($select.val() !== "Time...") {
                    var formattedTime = formatTime($select.val());
                    var $input = $select.closest('.sub-section-container').find("input[type=time]");
                    $input.val(formattedTime);
                }

                $select.on('change', function(evt){
                    var formattedTime = formatTime($select.val());
                    var $input = $select.closest('.sub-section-container').find("input[type=time]");
                    $input.val(formattedTime);
                });
            });
        }
    }

    function formatTime(value) {
        var time = moment(value, "hh:ss a");
        return time.format("HH:ss");
    }

    function init() {
        $('input[type="time"]').timepicker({
            showDuration:  true,
            useSelect:  true,
            timeFormat: 'h:i a',
            step: 5,
            noneOption: true
        });

        initTimeUpdates();
    }

    $(window).on('vm:form-post-update', function() {
        init();
    });

    init();
});