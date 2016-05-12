jQuery(function($){
  var idMatch = /(\w+)\/.*\/(\d+)/.exec(location.pathname);
  var themeName = idMatch[1];
  var clientId = idMatch[2];
  var addEventURL = '/'+themeName+'/engagements/add/'+clientId;
  var findMyEventURL = '/'+themeName+'/ambassador/events/search/'+clientId;

  $('.add-my-event').attr('href', addEventURL);
  $('.find-my-event').attr('href', findMyEventURL);
});
