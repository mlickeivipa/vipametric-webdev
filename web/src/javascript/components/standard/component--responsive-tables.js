jQuery(function($){
    var $forms = $("form");

    function init(context) {
        var $con = $(context);
        var $tables = $con.find('table.miwt-table');

        $tables.each(function(idx, table){
            $(table).stacktable();
        })
    }



    $forms.each(function() {
        if (!this.submit_options) {
            this.submit_options = {};
        }

        this.submit_options.postUpdate = function() {
            init(this);
        };
    });
});