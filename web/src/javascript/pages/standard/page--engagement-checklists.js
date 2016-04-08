jQuery(function($){
  var idMatch = /(\w+)\/.*\/(\d+)\/(\d+)/.exec(location.pathname);
  var themeName = idMatch[1];
  var clientId = idMatch[2];
  var engagementId = idMatch[3];
  var checklistsURL = '/ws/engagement/checklist';

  var store = {
    checklists: []
  };

  var template = '<div>'+
    '<div v-if="checklists.length" class="section checklists"> '+
    '  <div class="section-header">Checklists'+
    '   <div class="section-header-actions">'+
    '     <a href="#" @click.prevent="expandAll" class="expand-all first">Expand All</a>'+
    '     <a href="#" @click.prevent="collapseAll" class="collapse-all last">Collapse All</a>'+
    '   </div>'+
    '  </div>'+
    '    <div>'+
    '      <div class="sub-section">'+
    '        <div v-for="checklist in checklists" class="sub-section" :class="{complete: checklist.stats.complete}" track-by="id">'+
    '          <div class="sub-section-header">'+
    '            <span :class="{shown: checklist.shown}">'+
    '              <button class="btn trigger"  @click.prevent="toggleChecklist(checklist)"></button>'+
    '            </span>'+
    '            <span class="metric-set-value-count">'+
    '              <span class="metric-value-bar" :title="checklist.stats.title">'+
    '                <span class="metric-value-bar-progress" :style="{width: checklist.stats.progress}"></span>'+
    '              </span>'+
    '            </span>'+
    '            <span class="sub-section-heading">{{checklist.name}}</span>'+
    '          </div>'+
    '          <div class="content" v-if="checklist.shown">'+
    '            <ul class="checklist-items">'+
    '              <li v-for="item in checklist.items" track-by="id"'+
    '                  :class="{\'checklist-item-todo\': !item.done, \'checklist-item-done\': item.done}">'+
    '                <label><input type="checkbox" v-model="item.done"'+
    '                  :disabled="checklist.loading" @change="toggleItem(checklist, item)">'+
    '                {{item.name}}</label>'+
    '              </li>'+
    '            </ul>'+
    '            <div v-if="checklist.dirty">'+
    '              <button @click.prevent="save(checklist)" :disabled="checklist.loading" class="btn">Save</button>'+
    '              <button @click.prevent="cancel(checklist)" :disabled="checklist.loading" class="btn">Cancel</button>'+
    '            </div>'+
    '            <div v-if="checklist.actionMessage" class="checklist-action-message" :transition="checklist.actionTransition">'+
    '              {{checklist.actionMessage}}'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '      </div>'+
    '    </div>'+
    '  </div>'+
    '</div>';

  function load(){
    var data = {clientId: clientId, engagementId: engagementId, themeName: themeName};
    return $.ajax({
      type: 'GET',
      url: checklistsURL,
      data: data,
      dataType: 'json'
    }).then(function(result){
      result.checklists.forEach(function(checklist){
        checklist.shown = false;
        checklist.dirty = false;
        checklist.loading = false;
        checklist.actionMessage = '';
        checklist.actionTransition = 'none';
        checklist.stats = calculateStats(checklist);
      });
      store.checklists = result.checklists;
    });
  }

  function save(checklist){
    checklist.loading = true;
    checklist.actionMessage ='Saving…';
    var data = {
      clientId: clientId,
      engagementId: engagementId,
      checklistId: checklist.id,
      checklists: [checklist]
    };
    return $.ajax({
      type: 'POST',
      url: checklistsURL,
      data: JSON.stringify(data),
      dataType: 'json'
    }).then(function(result){
      onLoadChecklist(result);
      checklist.actionMessage ='Checklist Saved';
      fadeOutActionMessage(checklist);
    });
  }

  function cancel(checklist){
    checklist.loading = true;
    checklist.actionMessage ='Loading…';
    var data = {clientId: clientId, engagementId: engagementId, checklistId: checklist.id};
    return $.ajax({
      type: 'GET',
      url: checklistsURL,
      data: data,
      dataType: 'json'
    }).then(onLoadChecklist);
  }

  function onLoadChecklist(result){
    var i=0, len = store.checklists.length;
    var checklist;
    for(; i<len; i++){
      if(store.checklists[i].id === result.checklistId){
        checklist = store.checklists[i];
        break;
      }
    }
    if(checklist){
      checklist.items = result.checklists[0].items;
      checklist.dirty = false;
      checklist.loading = false;
      hideActionMessage(checklist);
      checklist.stats = calculateStats(checklist);
    }
  }

  function calculateStats(checklist){
    var count = 0;
    var total = checklist.items.length, i=0;
    for(; i<total; i++){
      if(checklist.items[i].done){
        count++;
      }
    }
    var percent = Math.floor((count / total) * 100);

    return  {
      title: count + '/' + total + ' Complete',
      count: count,
      total: total,
      percent: percent,
      progress: percent + '%',
      complete: percent >= 100
    };
  }

  function hideActionMessage(checklist){
    checklist.actionTransition = 'none';
    checklist.actionMessage = '';
  }

  function fadeOutActionMessage(checklist){
    checklist.actionTransition = 'fade-out';
    setTimeout(function(){
      if(!checklist.dirty && !checklist.loading){
        checklist.actionMessage = '';
      }
    }, 2000);
  }

  Vue.transition('fade-out', {
    // TODO change to CSS transition http://vuejs.org/guide/transitions.html
    css: false,
    enter: function(el, done){
      $(el).css('opacity', 1);
      done();
    },
    enterCancelled: function(el){
    },
    leave: function(el, done){
      $(el).css('opacity', 1).animate({opacity: 0}, 500, done);
    },
    leaveCancelled: function(el){
      $(el).stop();
    }
  });

  new Vue({
    el: '.checklists',
    template: template,
    data: store,
    methods: {
      expandAll: function(){
        store.checklists.forEach(function(checklist){
          checklist.shown = true;
        });
      },
      collapseAll: function(){
        store.checklists.forEach(function(checklist){
          checklist.shown = false;
        });
      },
      toggleChecklist: function(checklist){
        checklist.shown = !checklist.shown;
        if(!checklist.shown){
          hideActionMessage(checklist);
        }
      },
      toggleItem: function(checklist, item){
        checklist.dirty = true;
        checklist.stats = calculateStats(checklist);
        hideActionMessage(checklist);
      },
      save: save,
      cancel: cancel
    }
  });

  load();
});
