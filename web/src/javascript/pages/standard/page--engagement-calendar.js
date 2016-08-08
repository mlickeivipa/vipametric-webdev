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

            var $statusDropdown = $('<div class="filter status-filter"></div>').appendTo($filters),
                $statusLabel = $('<label class="status-filter-label filter-label" for="status-selector">Event Status</label>').appendTo($statusDropdown);
                $statusSelect = $('<select class="status-selector"></select>').appendTo($statusDropdown);
            $.each(result.statuses, function(idx, status) {
                var $statusOpt = $('<option/>', {
                    'value': status.name,
                    'text': status.displayName,
                    'selected': status.selected
                });

                $statusSelect.append($statusOpt);
            });

            var $brands = $('<div class="filter brand-filters"></div>').appendTo($filters),
                $brandsLabel = $('<div class="brand-filters-label filter-label">Brands</div>').appendTo($brands);
            $.each(result.brands, function(i, brand){
                var $legendItem = $('<div/>');
                $legendItem.addClass('color-key').css('background-color', brand.color ? brand.color : '#cccccc');

                var brandId = brand.id;
                var $check = $('<input/>', {
                    'type': 'checkbox',
                    'id': 'brand-'+ brandId,
                    'data-brand-id': +brandId,
                    'checked': !!brand.selected
                });

                var $filterLabel = $("<label for='brand-"+ brandId+"'/>").text(brand.name);
                var $filterCon = $('<div class="opt" />');
                $filterCon.prepend($check).prepend($legendItem).append($filterLabel);

                $filterCon.appendTo($brands);
            });

            var $brandAmbassadors = $('<div class="filter brand-ambassador-filter member-filter"></div>').appendTo($filters),
                $brandAmbassadorLabel = $('<div class="brand-ambassador-label filter-label">Brand Ambassadors</div>');
            $.each(result["brand-ambassadors"], function(idx, brandAmbassador) {
                if(brandAmbassador.first != null && brandAmbassador.last != null) {
                    var baId = brandAmbassador.id;

                    var $cb = $('<input/>', {
                        'type': 'checkbox',
                        'id': 'ba-'+baId,
                        'value': baId,
                        'checked': brandAmbassador.selected
                    });

                    var $label = $('<label for="ba-'+baId+'"/>').text(brandAmbassador.first + " " + brandAmbassador.last),
                        $filterCon = $('<div class="opt" />');
                    $filterCon.prepend($cb).append($label);
                    $filterCon.appendTo($brandAmbassadors);
                }
            });
        }

        function eventFilters(){
            var filters = {themeName: themeName, clientId: clientId};
            if(firstRequest){
                firstRequest = false;
            } else {
                // Filter by brand if not first request
                var brandIds = '';
                $filters.find('.brand-filters input:checkbox').each(function(){
                    var $check = $(this);
                    if($check.is(':checked')){
                        brandIds += $check.data('brandId');
                        brandIds += ';';
                    }
                });

                var memberIds = '';
                $filters.find('.member-filter input:checkbox:checked').each(function() {
                    var $this = $(this);
                    memberIds += $this.val();
                    memberIds += ';';
                });

                filters.status = $filters.find('.status-selector').val();
                filters.brandIds = brandIds;
                filters.memberIds = memberIds;
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


