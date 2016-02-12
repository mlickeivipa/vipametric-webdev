jQuery(function($){
   var $searchBar = $('.search-bar');

    $searchBar.each(function(idx, search){
        var $searchConstraints = $(search).find('.constraints');
        var $memberConstraints = $searchConstraints.find('.search-group-member');
        var $localeConstraints = $searchConstraints.find('.search-group-locale');
        var $eventConstraints = $searchConstraints.find('.search-group-event');
        var $wrapperDiv = $('<span class="wrapper"></span>');
        var $sectionLabel = $('<span class="section-label"></span>');

        $memberConstraints.wrapAll($wrapperDiv.clone().addClass("user"));
        $localeConstraints.wrapAll($wrapperDiv.clone().addClass("locale"));
        $eventConstraints.wrapAll($wrapperDiv.clone().addClass("event"));

        function setupLabels() {
            $('.wrapper.user').prepend($sectionLabel.clone().html("User"));
            $('.wrapper.locale').prepend($sectionLabel.clone().html("Locale"));
            $('.wrapper.event').prepend($sectionLabel.clone().html("Event"));
        };

        function setupClickHandlers() {
            var $toggles = $(".section-label");
            $toggles.on('click', function(evt){
                $(this).closest('.wrapper').toggleClass("shown");
            });
        }

        setupLabels();
        setupClickHandlers();
    });
});