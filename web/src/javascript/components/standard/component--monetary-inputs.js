jQuery(function($){
    var $moneyCon = $(".monetary-metric");

    $moneyCon.each(function(idx, con){
        var $con = $(con);
        var $inputs = $con.find("input[type=number]");

        $inputs.on("input", function(evt){
            var value = $(this).val();
            value = value.replace(".", "");
            value = parseFloat(value/100).toFixed(2);

            $(this).val(value).focus();
        });
    });
});