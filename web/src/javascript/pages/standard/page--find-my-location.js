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
    '   <result-list :results="results"></result-list>'+
    '   <div v-if="!advanced">Cannot find your location? Try the'+
    '   <a href="#" @click="toggleAdvanced">Advanced Search</a></div>'+
    '</div>';

  var resultList = {
    props: ['results'],
    template:
      '<div v-if="results.length">'+
      '<ul>'+
      '  <li v-for="site in results" track-by="id">'+
      '     <a :href="site.url">{{site.name}}</a><br>'+
      '     {{site.address}}<br>'+
      '     {{site.city}},'+
      '     {{site.state}}'+
      '     {{site.zip}}<br>'+
      '     <a v-if="site.formLink" :href="site.formLink">Add Event</a>'+
      '  </li>'+
      '</ul>'+
      '</div>'+
      '<div v-else>No Locations Found</div>'
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
