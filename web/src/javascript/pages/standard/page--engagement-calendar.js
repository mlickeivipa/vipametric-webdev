$(document).ready(function() {
  var $calendar = $('.engagement-calendar');
  var $filters = $('.engagement-calendar-filters');
  var $loading = $('.engagement-calendar-loading');
  var firstRequest = true;

  // Parse client id as last digit in URL using relative URL
  // e.g. /calendar/1 => /calendar_feed/1
  var clientIdMatch = /calendar\/(\d+)/.exec(location.href);
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
      $calendar.toggleClass('engagement-calendar-loading', isLoading);
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
    $filters.empty()
    $.each(result.brands, function(i, brand){
      var $filterItem = $('<div/>');

      var $legendItem = $('<div/>').html('&nbsp;');
      $legendItem.height('1em').width('1em').css('background-color', brand.color);

      var $check = $('<input/>', {
        'type': 'checkbox',
        'data-brand-id': +brand.id,
        'checked': !!brand.selected
      });

      var $filterLabel = $("<label/>").text(brand.name);
      $filterLabel.prepend($check).prepend($legendItem);

      $filterItem.append($filterLabel).appendTo($filters);
    });
  }

  $filters.delegate('input:checkbox').change(function(){
    $calendar.fullCalendar('refetchEvents');
  });

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
});

