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

        var idMatch = /(\w+)\/.*\/(\d+)/.exec(location.pathname);
        var themeName = idMatch[1];
        var clientId = idMatch[2];
        var feedURL = '/ws/engagement/calendar';

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
            var position = [offset.left, offset.top + $el.outerHeight()];
            $datePicker.datepicker('dialog', date, gotoDate,
                {dateFormat: 'yy-mm-dd'}, position);
        }

        function gotoDate(date){
            $calendar.fullCalendar('gotoDate', moment(date));
        }

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

        $filters.delegate('input:checkbox').change(function(){
            $calendar.fullCalendar('refetchEvents');
        });
    }

});


