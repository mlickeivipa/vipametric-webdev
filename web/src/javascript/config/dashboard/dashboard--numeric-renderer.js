/**
 * Will friendly-fy the given number and post fix it with shorthand for the numbers size
 *
 * @param number Number to friendly-fy
 * @returns {*} A friendly-fied version of the number
 */
var friendlyNumberFormat = function(number) {
    if (number > 1000000000000) {
        return Math.round(number / 1000000000000) + 't';
    } else if (number > 1000000000) {
        return Math.round(number / 1000000000) + 'b';
    } else if (number > 1000000) {
        return Math.round(number / 1000000) + 'm';
    } else if (number > 1000) {
        return Math.round(number / 1000) + 'k';
    } else {
        return number;
    }
};

/**
 * Will render numeric in given container with given label, value, description, and as the type give. Gives a standard
 * rendering format.
 *
 * @param $container
 * @param label
 * @param value
 * @param description
 * @param numericType
 */
var renderNumeric = function($container, label, value, description, numericType) {
    var $label, $value, $description;
    $container.empty();

    switch (numericType) {
        case "percentage":
            $label = $('<div class="data-label">'+label+'</div>');
            $value = $('<div class="data-value">'+parseFloat(value).toFixed(2)+'<span class="percent-sign">%</span></div>');
            if(description != null)
                $description = $('<div class="data-description">'+description+'</div>');
            break;

        case "monetary":
            $label = $('<div class="data-label">'+label+'</div>');
            $value = $('<div class="data-value"><span class="monetary-sign">$</span>'+parseFloat(value).toFixed(2)+'</div>');
            if(description != null)
                $description = $('<div class="data-description">'+description+'</div>');
            break;

        case "integer":
        default :
            $label = $('<div class="data-label">'+label+'</div>');
            $value = $('<div class="data-value">'+value+'</div>');
            if(description != null)
                $description = $('<div class="data-description">'+description+'</div>');
            break;
    }

    $container.append($label, $value, $description);
};