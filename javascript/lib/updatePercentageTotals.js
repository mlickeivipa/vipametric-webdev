$(function () {
    $("input.metric-bucket.value-component").bind("change paste keyup", function () {
        var parent = $(this).attr("parent");
        var list = $("input.metric-bucket.value-component[parent='" + parent + "']");
        var total = 0;
        $(list).each(function (index, element) {
            var value = $(this).val();
            
            total += (parseFloat(value) || 0);
        });
        $("span.percent-total[parent='" + parent + "']").text(total);
    });
});