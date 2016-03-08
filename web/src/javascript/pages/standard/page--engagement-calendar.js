$(document).ready(function() {
    var $calendar = $('.engagement-calendar');
    var $filters = $('.engagement-calendar-filters');
    var $loading = $('.engagement-calendar-loading');
    var firstRequest = true;

    // Parse client id as last digit in URL using relative URL
    // e.g. /calendar/1 => /calendar_feed/1
    var clientIdMatch = /calendar\/(\d+)/.exec(location.href);
    if(clientIdMatch == null)
    {
        clientIdMatch = /\/(\d+)/.exec(location.href);
    }
    var feedURL = '../calendar_feed/'+(clientIdMatch ? clientIdMatch[1] : -1);

    var $datePicker = $('<input/>', {type: 'hidden'});
    $datePicker.datepicker();

    $calendar.fullCalendar({
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
        eventRender: function(ev, element) {
            var timeZone = ev.eventTimeZone;
            if(timeZone){
                $(element).find('.fc-time').append(' '+timeZone);
            }
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
        if ($('select.filters').length) {
            $('select.filters').select2('destroy');
        }
        var $select = $('<select class="filters" multiple />');
        $.each(result.brands, function(i, brand){
            var $option = $('<option/>', {
                'data-brand-id': +brand.id,
                'id': +brand.id,
                'data-brand-color': brand.color,
                'selected': !!brand.selected,
                'class': "opt",
                'text': brand.name
            });

            $select.append($option);
        });
        $select.appendTo($filters);
        $('select.filters')
            .select2({theme: 'vm-multi', multiple: true, placeholder: 'Select'})
            .filter('[data-features~="watch"]');

        $('select.filters').change(function (e) {
            $calendar.fullCalendar('refetchEvents');
        });
    }


    function eventFilters(){
        var filters = {};
        if(firstRequest){
            firstRequest = false;
        } else {
            // Filter by brand if not first request
            var brandIds = '';
            $filters.find('option').each(function(){
                var $option = $(this);
                if($option.is(':selected')){
                    brandIds += $option.data('brandId');
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

