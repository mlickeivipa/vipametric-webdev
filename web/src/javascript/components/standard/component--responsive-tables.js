jQuery(function($){
    var $tables = $('table.miwt-table');

    function init() {
        $tables.each(function(idx, table){
            $(table).stacktable();
        })
    }

    init();
});