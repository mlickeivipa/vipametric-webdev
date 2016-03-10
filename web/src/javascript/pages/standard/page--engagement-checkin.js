jQuery(function($){
  var wsURL = '/ws/engagement/checkins';
  var idMatch = /.*\/(\d+)\/(\d+)/.exec(location.href);
  var clientId = +idMatch[1];
  var engagementId = +idMatch[2];

  var $container = $('.member-checkin-container');
  var $actions = $container.find('.member-checkin-actions');
  var $checkin = $actions.find('.member-checkin-checkin');
  var $checkout = $actions.find('.member-checkin-checkout');
  var $messages = $container.find('.member-checkin-messages');

  disableAll();

  if(!navigator.geolocation){
    $messages.text('Geolocation is not supported by your browser');
  } else {
    $messages.text('Loading…');
    checkStatus();
  }

  function disableAll(){
    $checkin.toggle(true);
    $checkin.prop('disabled', true);
    $checkout.toggle(false);
    $checkout.prop('disabled', true);
  }

  function enableCheckin(isCheckin){
    $checkin.toggle(isCheckin);
    $checkin.prop('disabled', !isCheckin);
    $checkout.toggle(!isCheckin);
    $checkout.prop('disabled', isCheckin);
  }

  $checkin.click(function(){
    $checkin.prop('disabled', true);
    $messages.text('Checking in…');
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError,
        {enableHighAccuracy: true, timeout: 2000, maximumAge: 0});
  });

  $checkout.click(function(){
    $checkout.prop('disabled', true);
    $messages.text('Checking out…');
    postUpdate({status: 'CheckedOut'}).then(updateStatus);
  });

  function checkStatus(){
    var data = {clientId: clientId, engagementId: engagementId};
    return $.ajax({
      type: 'GET',
      url: wsURL,
      data: data,
      dataType: 'json'
    }).then(updateStatus);
  }

  function postUpdate(data){
    data.clientId = clientId;
    data.engagementId = engagementId;
    return $.ajax({
      type: 'POST',
      url: wsURL,
      data: JSON.stringify(data),
      dataType: 'json'
    });
  }

  function updateStatus(data){
    if(data.status === 'NeverCheckedIn'){
      $messages.text('Please Check In'); 
      enableCheckin(true);
    } else if(data.status === 'CheckedIn'){
      $messages.text('Checked in '+moment(data.timestamp).fromNow()); 
      enableCheckin(false);
    } else if(data.status === 'CheckedOut'){
      $messages.text('Checked out '+moment(data.timestamp).fromNow());
      enableCheckin(true);
    } else {
      $messages.text('Error updating check-in');
      disableAll();
    }
  }

  function geoSuccess(position){
    var timestamp = position.timestamp;
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    var accuracy = position.coords.accuracy;
    postUpdate({
        status: 'CheckedIn',
        timestamp: position.timestamp,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        locationAccuracy: position.coords.accuracy
    }).then(updateStatus);
  }

  function geoError() {
    $messages.text('Unable to retrieve your location');
  }
});
