jQuery(function($){
  var idMatch = /(\w+)\/.*\/(\d+)/.exec(location.pathname);
  var themeName = idMatch[1];
  var clientId = idMatch[2];
  var baseURL = '/ws/engagement/ambassador/search/';
  var eventsURL = baseURL + 'events';
  var constraintsURL = baseURL + 'constraints';
  var geoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  var geoCodeAPIKey = 'AIzaSyAQeXkixnFvr30ofRTx8iuwF6vAlxW0KcI';

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
    '<div> '+
    '   <constraint-field :constraint="constraints.name" :value.sync="filters.name">'+
    '   </constraint-field>'+
    '   <div v-if="advanced">'+
    '    <advanced-constraint-list :filters.sync="filters" :constraints="constraints">'+
    '    </advanced-constraint-list>'+
    '   </div>'+
    '   <div>'+
    '     <button @click="search">Search</button>'+
    '     <button @click="reset">Reset</button>'+
    '   </div>'+
    '   <div v-if="message"><h1>{{message}}</h1></div>'+
    '   <event-list :events="events"></event-list>'+
    '   <div v-if="!advanced">Cannot find your event? Try the'+
    '   <a href="#" @click="toggleAdvanced">Advanced Search</a></div>'+
    '</div>';

  Vue.component('event-list', {
    props: ['events'],
    template:
      '<div v-if="events.length">'+
      '<ul>'+
      '  <li v-for="event in events" track-by="id">'+
      '     <a :href="event.url"><h1>{{event.name}}</h1></a>'+
      '     {{event.campaignName}}<br>'+
      '     {{event.start}} - {{event.end}}<br>'+
      '     {{event.site.address}}<br>'+
      '     {{event.site.city}},'+
      '     {{event.site.state}}'+
      '     {{event.site.zip}}<br>'+
      '  </li>'+
      '</ul>'+
      '</div>'+
      '<div v-else>No Events Found</div>'
  });

  Vue.component('constraint-field', {
    props: ['constraint', 'value'],
    template: '<span>{{constraint.label}} <input v-model="value" debounce="500"></span>'
  });

  Vue.component('constraint-choice', {
    props: ['constraint', 'value'],
    ready: function(){
      var vm = this;
      if(vm.constraint.options.length > 10){
        $(vm.$els.choices).select2().on('change', function(){
          vm.value = $(this).val();
        });
      }
    },
    template: '<span>{{constraint.label}} <select v-model="value" v-el:choices>'+
      '  <option value="" selected>Any</option>'+
      '  <option v-for="option in constraint.options" :value="option.optionId">'+
      '    {{option.label}}'+
      '  </option>'+
      '</select></span>'
  });

  Vue.component('constraint-zip-code', {
    props: ['constraint', 'value'],
    data: function(){
      return {zipCode: '', milesWithin: '5'};
    },
    watch: {
      value: function(val){
        var parts = val.split(';');
        this.zipCode = parts[0];
        this.milesWithin = parts[1] || '5';
      },
      zipCode: function(zip){
        this.value = [zip, this.milesWithin].join(';');
      },
      milesWithin: function(miles){
        this.value = [this.zipCode, miles].join(';');
      }
    },
    ready: function(){
        var parts = this.value.split(';');
        this.zipCode = parts[0];
        this.milesWithin = parts[1] || '5';
    },
    template: '<span>{{constraint.label}} <input v-model="zipCode" debounce="500"></span>'+
      '<span>Miles Within<select v-model="milesWithin">'+
      '  <option v-for="option in constraint.options" :value="option.optionId">'+
      '    {{option.label}}'+
      '  </option>'+
      '</select></span>'
  });

  Vue.component('constraint-date-range', {
    props: ['constraint', 'value'],
    data: function(){
      return {
        operator: '',
        date1: '',
        date2: '',
        showDate1: false,
        showDate2: false
      };
    },
    watch: {
      value: function(val){
        var parts = val.split(';');
        this.operator = parts[0];
        this.date1 = parts[1] || '';
        this.date2 = parts[2] || '';
      },
      operator: function(op){
        this.value = [op, this.date1, this.date2].join(';');
        this.showDate1 = !(op === '' || op === 'today');
        this.showDate2 = op === 'between';
      },
      date1: function(date){
        this.value = [this.operator, date, this.date2].join(';');
      },
      date2: function(date){
        this.value = [this.operator, this.date1, date].join(';');
      }
    },
    ready: function(){
      $(this.$els.date1).datepicker();
      $(this.$els.date2).datepicker();

      var parts = this.value.split(';');
      this.operator = parts[0];
      this.date1 = parts[1] || '';
      this.date2 = parts[2] || '';
    },
    template: '<span>{{constraint.label}} <select v-model="operator">'+
      '  <option value="">Any</option>'+
      '  <option value="today">Today</option>'+
      '  <option value="until">Until</option>'+
      '  <option value="since">Since</option>'+
      '  <option value="between">Between</option>'+
      '</select></span>'+
      '<span v-show="showDate1"><input v-el:date1 v-model="date1" debounce="500"></span>'+
      '<span v-show="showDate2"> and <input v-el:date2 v-model="date2" debounce="500"></span>'
  });

  var componentTypes = {
    field: 'constraint-field',
    choice: 'constraint-choice',
    zipCode: 'constraint-zip-code',
    dateRange: 'constraint-date-range'
  };

  function createAdvancedConstraintList(constraints){
    var advancedConstraintTemplate = '';
    constraints.forEach(function(constraint){
      var name = constraint.name;
      var tag = componentTypes[constraint.componentType];
      store.filters[name] = '';
      store.constraints[name] = constraint;
        
      if(tag && name !== 'name'){
        advancedConstraintTemplate +=
          '<'+tag+' :constraint="constraints.'+name+'" :value.sync="filters.'+name+'"></'+tag+'>';
      }
    });

    Vue.component('advanced-constraint-list', {
      props: ['filters', 'constraints'],
      template: advancedConstraintTemplate
    });
  }

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
    createAdvancedConstraintList(data.constraints);

    var findMyEvent = new Vue({
      el: '#find-my-event',
      template: template,
      data: store,
      methods: {
        search: search,
        reset: reset,
        toggleAdvanced: toggleAdvanced
      },
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

  if(!navigator.geolocation){
    load();
  } else {
    navigator.geolocation.getCurrentPosition(geoSuccess, load,
        {enableHighAccuracy: true, timeout: 2000, maximumAge: 0});
  }

  function geoSuccess(position){
    var latlng = [position.coords.latitude, position.coords.longitude].join(',');
    var data = {
      key: geoCodeAPIKey,
      result_type: 'postal_code',
      latlng: latlng
    };

    return $.ajax({
      type: 'GET',
      url: geoCodeURL,
      data: data,
      dataType: 'json'
    }).then(
      function(result){
        initialFilters.zip = geoResultPostalCode(result);
        load();
      },
      load);
  }

  function geoResultPostalCode(result){
    if(result.status === 'OK'){
      var results = result.results, i=0, rLen = results.length;
      for(; i < rLen; i++){
        var components = results[i].address_components, j=0, cLen = components.length;
        for(; j < cLen; j++){
          if(components[j].types[0] === 'postal_code'){
            return components[j].short_name;
          }
        }
      }
    }
    return '';
  }
});
