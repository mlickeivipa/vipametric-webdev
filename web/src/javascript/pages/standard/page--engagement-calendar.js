$(document).ready(function() {
    var $calendar = $('.engagement-calendar');
    var $filters = $('.engagement-calendar-filters');
    var $loading = $('.engagement-calendar-loading');
    var firstRequest = true;

    var idMatch = /(\w+)\/.*\/(\d+)/.exec(location.pathname);
    var themeName = idMatch[1];
    var clientId = idMatch[2];
    var feedURL = '/ws/engagement/calendar';

    var $datePicker = $('<input/>', {type: 'hidden'});
    $datePicker.datepicker();

    $calendar.fullCalendar({
        timezone: 'local',
        eventLimit: true,
        eventLimitClick: 'day',
        displayEventEnd: true,
        views: {
            basicDay: {
                eventLimit: false
            }
        },
        customButtons: {
            datePicker: {
                text: 'date',
                click: showDatePicker
            }
        },
        header: {
            left: 'today,datePicker prev,next',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        loading: function(isLoading){
            $calendar.toggleClass('loading', isLoading);
            $loading.toggle(isLoading);
        },
        events: {
            url: feedURL,
            data: eventFilters,
            success: function(result){
                loadFilters(result);
                return result.events;
            },
            statusCode: {
                401: function(){
                    // session may have timed out or user logged out
                    // refresh to login page.
                    location.reload();
                }
            }
        }
    });

    function loadFilters(result){
        $filters.empty();
        $.each(result.brands, function(i, brand){
            var $legendItem = $('<div/>');
            $legendItem.addClass('color-key').css('background-color', brand.color ? brand.color : '#cccccc');

            var $check = $('<input/>', {
                'type': 'checkbox',
                'data-brand-id': +brand.id,
                'checked': !!brand.selected
            });

            var $filterLabel = $("<label/>").text(brand.name);
            var $filterCon = $('<div class="opt" />');
            $filterCon.prepend($check).prepend($legendItem).append($filterLabel);

            $filterCon.appendTo($filters);
        });
    }

    $filters.delegate('input:checkbox').change(function(){
        $calendar.fullCalendar('refetchEvents');
    });

    function eventFilters(){
        var filters = {themeName: themeName, clientId: clientId};
        if(firstRequest){
            firstRequest = false;
        } else {
            // Filter by brand if not first request
            var brandIds = '';
            $filters.find('input:checkbox').each(function(){
                var $check = $(this);
                if($check.is(':checked')){
                    brandIds += $check.data('brandId');
                    brandIds += ';';
                }
            });
            filters.brandIds = brandIds;
        }
        return filters;
    }

    function showDatePicker(ev){
        var $el = $(ev.target);
        var offset = $el.offset();
        var date = $calendar.fullCalendar('getDate').format('YYYY-MM-DD');
        var position = [offset.left, offset.top + $el.height()];
        $datePicker.datepicker('dialog', date, gotoDate,
            {dateFormat: 'yy-mm-dd'}, position);
    }

    function gotoDate(date){
        $calendar.fullCalendar('gotoDate', moment(date));
    }
});

