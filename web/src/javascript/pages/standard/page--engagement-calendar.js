$(document).ready(function() {
    var firstRequest = true;
    var $calendar;

    var overrideTabMethods = {
        showElement: function(el) {
            this.loadElement(el);
            el.style.display = 'block';
            el.setAttribute('aria-hidden', 'false');
            var tabShown = $.Event('tabShown');
            $(el).trigger(tabShown);
            if ($(el).find("#calendar")) {
                if (firstRequest) {
                    init();
                }
                else {
                    $calendar.fullCalendar('refetchEvents');
                }
            }

        },
        hideElement: function(el) {
            el.style.display = 'none';
            el.setAttribute('aria-hidden', 'true');
            var tabHidden = $.Event('tabHidden');
            $(el).trigger(tabHidden);
        }
    };

    if (!cms.tabcontainers) {
        init();
        return;
    }

    for (var i = 0, tc; cms.tabcontainers.length > i; i++) {
        tc = cms.tabcontainers[i];
        if (tc.container.id == 'manage_tabs') {
            tc = $.extend(tc, overrideTabMethods);
        }
    }



    function init() {
        $calendar = $('.engagement-calendar');
        var $filters = $('.engagement-calendar-filters');
        var $loading = $('.engagement-calendar-loading');

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

        function eventFilters(){
            var filters = {};
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

        $filters.delegate('input:checkbox').change(function(){
            $calendar.fullCalendar('refetchEvents');
        });
    }

});

