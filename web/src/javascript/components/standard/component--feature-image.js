jQuery(function($){
    var $photoCon = $('.photo-metric');
    var FEATURED_CLASS = "featured";

    $photoCon.each(function(idx, con){
        var $con = $(con);
        var $images = $con.find(".image-metric-item");

        $images.on('click', '.featured-image label', function(evt){
            $(this)
                .closest('.image-metric-item')
                .addClass(FEATURED_CLASS)
                .find('input[type=checkbox]')
                .attr('checked');
        });
    });
});