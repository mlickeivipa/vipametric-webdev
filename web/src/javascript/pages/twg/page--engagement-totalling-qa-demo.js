jQuery(function($){

    var $bottlePriceInput = $(".metric .BABottleCost .value-component"),
        $bottlesSoldInput = $(".metric .BABottlesUsed .value-component"),
        $calculatedTotalInput = $(".metric .BABottleSpend .value-component");

    function calculatedTotal(price, numSold)
    {
        return parseFloat(price) * parseFloat(numSold);
    }

    function init()
    {
        $calculatedTotalInput.text(calculatedTotal($bottlePriceInput.text(), $bottlesSoldInput.text()).toFixed(2));
    }

    init();

});