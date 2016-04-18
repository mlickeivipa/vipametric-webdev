jQuery(function($){
  var ns = $.activationhub || ($.activationhub = {});
  var exports = ns.search || (ns.search = {});

  var geoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  var geoCodeAPIKey = 'AIzaSyAQeXkixnFvr30ofRTx8iuwF6vAlxW0KcI';

  var constraintField = {
    props: ['constraint', 'value'],
    template: '<span>{{constraint.label}} <input v-model="value" debounce="500"></span>'
  };

  var constraintChoice = {
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
  };

  var constraintZipCode = {
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
  };

  var constraintDateRange = {
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
  };

  var components = {
    constraintField: constraintField,
    constraintChoice: constraintChoice,
    constraintZipCode: constraintZipCode,
    constraintDateRange: constraintDateRange
  };
  exports.components = components;

  var componentTypes = {
    field: 'constraint-field',
    choice: 'constraint-choice',
    zipCode: 'constraint-zip-code',
    dateRange: 'constraint-date-range'
  };

  exports.createAdvancedConstraintList = createAdvancedConstraintList;
  function createAdvancedConstraintList(store, constraints){
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

    return {
      props: ['filters', 'constraints'],
      template: advancedConstraintTemplate,
      components: components
    };
  }


  exports.findCurrentZipCode = findCurrentZipCode;
  function findCurrentZipCode(){
    var dfd = $.Deferred();
    if(!navigator.geolocation){
      dfd.resolve(null);
    } else {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError,
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
          dfd.resolve(geoResultPostalCode(result));
        },
        geoError);
    }

    function geoError(err){
      dfd.resolve(null);
    }
    return dfd.promise();
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
