jQuery(function($){

    function initTimeUpdates() {
        var $timeSelect = $('select.ui-timepicker-select');

        if ($timeSelect.length && $timeSelect.closest('.sub-section-container').length) {
            $timeSelect.each(function(idx, select){
                var $select = $(select);
                $select.on('change', function(evt){
                    var time = moment($select.val(), "hh:ss a");
                    var formattedTime = time.format("HH:ss");
                    var $input = $select.closest('.sub-section-container').find("input[type=time]");
                    $input.val(formattedTime);
                });
            });
        }
    }

    function init() {
        $('input[type="time"]').timepicker({
            showDuration:  true,
            useSelect:  true,
            timeFormat: 'h:i a'
        });

        initTimeUpdates();
    }

    init();
});