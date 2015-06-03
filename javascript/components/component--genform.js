/**
 * Created by aokimi on 5/1/2015.
 */
jQuery(function($){

    function placeholderCheck() {
        var input = document.createElement('input');

        if ('placeholder' in input) {
            $('html').addClass('placeholder');
        } else {
            $('html').addClass('no-placeholder');
        }
    }

    var updateInputs = function(con) {
        var $con = $(con);

        $con.find(".value").each(function(){
            var $input = $(this).find("input");
            var $label = $(this).siblings('.label').find("label");

            $input.attr('placeholder', $label.text());
        });
    };

    //configure submit options
    $('.genform form').each(function(){
        var form = this;

        form.submit_options = {
            ajax: true,
            postUpdate: function() {
                updateInputs(form);
                $(window).trigger('vm:form-post-update');
            }
        };

        //run the form update at page load
        updateInputs(form);
    });
    placeholderCheck();
});