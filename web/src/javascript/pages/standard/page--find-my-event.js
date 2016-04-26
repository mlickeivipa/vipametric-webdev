jQuery(function($){
  var idMatch = /(\w+)\/.*\/(\d+)/.exec(location.pathname);
  var themeName = idMatch[1];
  var clientId = idMatch[2];
  var baseURL = '/ws/engagement/ambassador/search/';
  var eventsURL = baseURL + 'events';
  var constraintsURL = baseURL + 'constraints';
  var $search = $.activationhub.search; // component--search.js

  $('#find-my-event').text('Loading…');

  var initialFilters = {
    name: '',
    startDate: 'today',
    zip: ''
  };

  var store = {
    message: '',
    advanced: false,
    filters: {},
    constraints: {},
    events: []
  };

  function reset(filters){
    store.message = '';
    filters = filters || {};
    $.each(store.filters, function(name){
      store.filters[name] = filters[name] || '';
    });
  }

  function search(){
    var data = $.extend({clientId: clientId, themeName: themeName}, store.filters);
    return $.ajax({
      type: 'GET',
      url: eventsURL,
      data: data,
      dataType: 'json'
    }).then(updateEvents);
  }

  function updateEvents(data){
    store.events = data.events;
  }

  function toggleAdvanced(){
    store.advanced = !store.advanced;
    reset(store.advanced ? store.filters : {name: store.filters.name});
  }

  var template =
    '<div class="search"> '+
    '   <constraint-field :constraint="constraints.name" :value.sync="filters.name">'+
    '   </constraint-field>'+
    '   <div class="advanced" v-if="advanced">'+
    '    <advanced-constraint-list :filters.sync="filters" :constraints="constraints">'+
    '    </advanced-constraint-list>'+
    '   </div>'+
    '   <div class="actions">'+
    '     <button class="btn search" @click="search">Search</button>'+
    '     <button class="btn reset" @click="reset">Reset</button>'+
    '   </div>'+
    '   <div v-if="message"><h1>{{message}}</h1></div>'+
    '   <event-list :events="events"></event-list>'+
    '   <div v-if="!advanced">Cannot find your event? Try the'+
    '   <a href="#" @click="toggleAdvanced">Advanced Search</a></div>'+
    '</div>';

  var eventList = {
    props: ['events'],
    filters: {
      moment: function (date) {
        return moment(date).format('MMM DD, YYYY @ h:mm a');
      }
    },
    template:
      '<div class="event-results" v-if="events.length">'+
      '<ul>'+
      '  <li v-for="event in events" track-by="id">'+
      '     <a :href="event.url"><h1>{{event.name}}</h1></a>'+
      '     <span class="campaign-name">{{event.campaignName}}</span>'+
      '     <span class="campaign-dates">{{event.start | moment}} - {{event.end | moment}}</span>'+
      '     <span class="campaign-address">{{event.site.address}}</span>'+
      '     <span class="campaign-city">{{event.site.city}},</span>'+
      '     <span class="campaign-state">{{event.site.state}}</span>'+
      '     <span class="campaign-zip">{{event.site.zip}}</span>'+
      '  </li>'+
      '</ul>'+
      '</div>'+
      '<div class="none-found" v-else>No Events Found</div>'
  };

  function load(){
    var data = {clientId: clientId, themeName: themeName};
    return $.ajax({
      type: 'GET',
      url: constraintsURL,
      data: data,
      dataType: 'json'
    }).then(init);
  }

  function init(data){
    var findMyEvent = new Vue({
      el: '#find-my-event',
      template: template,
      data: store,
      methods: {
        search: search,
        reset: reset,
        toggleAdvanced: toggleAdvanced
      },
      components: $.extend({
        eventList: eventList,
        advancedConstraintList: $search.createAdvancedConstraintList(store, data.constraints)
      }, $search.components),
      watch: {
        filters: {deep:true, handler: search}
      }
    });

    if(initialFilters.zip){
      store.message = 'Events Near You Today';
      store.filters.startDate = initialFilters.startDate;
      store.filters.zip = initialFilters.zip;
    } else {
      store.message = 'Events Today';
      store.filters.startDate = initialFilters.startDate;
      store.filters.zip = initialFilters.zip;
    }

    search();
  }

  $search.findCurrentZipCode().then(function(zip){
    initialFilters.zip = zip || '';
    load();
  }, load);
});
