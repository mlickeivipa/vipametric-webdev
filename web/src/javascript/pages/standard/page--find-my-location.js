jQuery(function($){
  var idMatch = /(\w+)\/.*\/(\d+)/.exec(location.pathname);
  var themeName = idMatch[1];
  var clientId = idMatch[2];
  var baseURL = '/ws/engagement/site/ambassador/search/';
  var resultsURL = baseURL + 'results';
  var constraintsURL = baseURL + 'constraints';
  var $search = $.activationhub.search; // component--search.js

  $('#find-my-site').text('Loading…');

  var initialFilters = {
    zip: ''
  };

  var store = {
    message: '',
    advanced: false,
    filters: {},
    constraints: {},
    results: []
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
      url: resultsURL,
      data: data,
      dataType: 'json'
    }).then(updateResults);
  }

  function updateResults(data){
    store.results = data.results;
  }

  function toggleAdvanced(){
    store.advanced = !store.advanced;
    reset(store.advanced ? store.filters : {});
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
    '     <button class="btn advanced-search" @click="toggleAdvanced">Toggle Advanced Search</button>'+
    '   </div>'+
    '   <div v-if="message"><h1>{{message}}</h1></div>'+
    '   <result-list :results="results"></result-list>'+
    '   <div class="toggle advanced" v-if="!advanced">Cannot find your location? Try the'+
    '   <a href="#" @click="toggleAdvanced">Advanced Search</a></div>'+
    '</div>';

  var resultList = {
    props: ['results'],
    template:
      '<div class="location-results" v-if="results.length">'+
      '<ul>'+
      '  <li v-for="site in results" track-by="id">'+
      '     <a :href="site.url"><h1>{{site.name}}</h1></a>'+
      '     <span class="address"{{site.address}}</span>'+
      '     <span class="city">{{site.city}},</span>'+
      '     <span class="state">{{site.state}}</span>'+
      '     <span class="zip">{{site.zip}}</span>'+
      '     <a class="btn add" v-if="site.formLink" :href="site.formLink">Add Event</a>'+
      '  </li>'+
      '</ul>'+
      '</div>'+
      '<div class="none-found" v-else>No Locations Found</div>'
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
    var findMySite = new Vue({
      el: '#find-my-site',
      template: template,
      data: store,
      methods: {
        search: search,
        reset: reset,
        toggleAdvanced: toggleAdvanced
      },
      components: $.extend({
        resultList: resultList,
        advancedConstraintList: $search.createAdvancedConstraintList(store, data.constraints)
      }, $search.components),
      watch: {
        filters: {deep:true, handler: search}
      }
    });

    if(initialFilters.zip){
      store.message = 'Locations Near You';
      store.filters.zip = initialFilters.zip+';5';
    } else {
      store.message = '';
      store.filters.zip = '';
    }

  }

  $search.findCurrentZipCode().then(function(zip){
    initialFilters.zip = zip || '';
    load();
  }, load);
});
