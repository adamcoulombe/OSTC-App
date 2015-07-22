var currentTransition = "shrink-down";
var routeChanged = false;
window.app = {
    Views: {},
    Extensions: {},
    Models: {},
    Collections: {},
    Data: {},
    Router: null,

    init: function () {
      var self=this;
      
      tpl.loadTemplates(['home', 'on-the-boat', 'category', 'location', 'location-map'], function() {
          self.instance = new app.Views.App();
          Backbone.history.start();
      });

    }
  };

tpl = {
 
    // Hash of preloaded templates for the app
    templates: {},
 
    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment:
    // All the template files should be concatenated in a single file.
    loadTemplates: function(names, callback) {
 
        var that = this;
 
        var loadTemplate = function(index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('html/' + name + '.html', function(data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }
 
        loadTemplate(0);
    },
 
    // Get template by name from hash of preloaded templates
    get: function(name) {
        return this.templates[name];
    }
 
};
var Models = {};
var Collections = {};

var pre = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1&& document.URL.indexOf( 'file:///' ) === -1;
      if ( app ) {
        document.addEventListener("deviceready", onDeviceReady, false);
      } else {
        this.onDeviceReady(); //this is the browser
      }
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        $(function() {
            FastClick.attach(document.body);
        });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        window.app.init();

        // navigator.geolocation.getCurrentPosition(function(position){
        //     $("#location").html(position.coords.latitude+', '+position.coords.longitude);

        // },function(err){})


    },
    // Update DOM on a Received Event

};






  app.Router = Backbone.Router.extend({

    routes: {
      ':sectionID': 'section',
      '': 'home',
      ':sectionID/:categoryID': 'category',
      ':sectionID/:categoryID/:locationID': 'location',
      ':sectionID/:categoryID/:locationID/map': 'locationMap'
    },

    home: function () {
      var view = new app.Views.Home();
      app.instance.goto(view);
    },

    section: function () {
      var view = new app.Views.OnTheBoat();
      app.instance.goto(view);
    },

    category: function (sectionID,categoryID) {
      //alert(categoryName);
      console.log(Models);
      var myCategory = Models[sectionID][categoryID];
      
      var view = new app.Views.Category( { model: myCategory } );

      app.instance.goto(view);
    },

    location: function (sectionID,categoryID,locationID) {
      //alert(categoryName);
      var myLocation = Collections[sectionID][categoryID].get(locationID);
      myLocation.set({sectionID:sectionID, categoryID:categoryID});
      var view = new app.Views.Location( { model: myLocation } );
      app.instance.goto(view);
    },
    locationMap: function (sectionID,categoryID,locationID) {
      //alert(categoryName);
      var myLocation = Collections[sectionID][categoryID].get(locationID);
      myLocation.set({sectionID:sectionID, categoryID:categoryID});
      var view = new app.Views.LocationMap( { model: myLocation } );
      app.instance.goto(view);
    }

  });

  app.Extensions.View = Backbone.View.extend({

    initialize: function () {
      this.router = new app.Router();
      this.router.on('route',function(r,p){
        routeChanged=true;
      });
    },

    render: function(options) {

      options = options || {};

      if (options.page === true) {
        this.$el.addClass('view');
      }
      var $cacheMap = $('<div id="cache-map" />');
      var $status = $('<div id="status" />').hide();
      $('body').append($cacheMap);
      $('body').append($status);

      return this;

    },

    transitionIn: function (callback) {

      var view = this,
          delay

      if(currentTransition=="push"){
        view.$el.css({ x: '100vw' });
        view.$el.transition({
          x: '0px',
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="pop"){
        view.$el.css({ x: '-100vw' });
        view.$el.transition({
          x: '0px',
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="shrink-down"){
        view.$el.css({ scale: 1.5, opacity:0 });
        view.$el.transition({
          scale: 1,
          opacity:1,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-from-top"){
        view.$el.css({ y:'-100vh','z-index':2  });
        view.$el.transition({
          y: '0px',
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-away-top"){
        view.$el.css({ scale:0.8, opacity:0.5,'z-index':1 });
        view.$el.transition({
          scale: 1,
          opacity:1,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-from-bottom"){
        view.$el.css({ y:'100vh','z-index':2  });
        view.$el.transition({
          y: '0px',
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-away-bottom"){
        view.$el.css({ scale:0.8, opacity:0.5,'z-index':1 });
        view.$el.transition({
          scale: 1,
          opacity:1,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
     // var transitionIn = function () {

        /*view.$el.addClass('current');
        view.$el.one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
          if (_.isFunction(callback)) {
            callback();
          }
        })*/
      //};

      //_.delay(transitionIn, 20);

    },

    transitionOut: function (callback) {

      var view = this;
      if(currentTransition=="push"){
        view.$el.transition({ 
          x: '-100vw',
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });
      }
      if(currentTransition=="pop"){
        view.$el.transition({ 
          x: '100vw',
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });
      }
      if(currentTransition=="shrink-down"){
        view.$el.transition({
          scale: 0.5,
          opacity:0.5,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-from-top"){
        view.$el.css({ 'z-index':1  });
        view.$el.transition({
          scale: 0.8,
          opacity:0,
          duration: 600,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-away-top"){

        view.$el.css({
          'z-index':2
        }).transition({
          y: '-100vh',
          duration: 400,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-from-bottom"){
        view.$el.css({ 'z-index':1  });
        view.$el.transition({
          scale: 0.8,
          duration: 600,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
      if(currentTransition=="slide-away-bottom"){

        view.$el.css({
          'z-index':2
        }).transition({
          y: '100vh',
          duration: 400,
          complete: function() {
            if (_.isFunction(callback)) {
              callback();
            }              
          }
        });          
      }
     /* view.$el.removeClass('current');
      view.$el.addClass('previous');
      view.$el.one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
        if (_.isFunction(callback)) {
          callback();
        };
        view.$el.removeClass('previous');
      });*/

    }

  });



  //Views 

  app.Views.App = app.Extensions.View.extend({

    el: 'body',
    events: {
        "click [data-transition=back]" : "transitionBack",
        "click [data-transition=forward]" : "transitionForward",
        "click [data-transition=slide-from-top]" : "transitionSlideFromTop",
        "click [data-transition=slide-away-top]" : "transitionSlideAwayTop",
        "click [data-transition=slide-from-bottom]" : "transitionSlideFromBottom",
        "click [data-transition=slide-away-bottom]" : "transitionSlideAwayBottom",
        "click .back-link" : "goBack",
        "click .menu-link" : "menuLinkClicked"
    },
    transitionBack:function(){
       currentTransition = "pop";
    },
    transitionForward:function(){
        
        currentTransition = "push";
    },
    transitionSlideFromTop:function(){
        currentTransition = "slide-from-top";
    },
    transitionSlideAwayTop:function(){
        currentTransition = "slide-away-top";
    },
    transitionSlideFromBottom:function(){
        currentTransition = "slide-from-bottom";
    },
    transitionSlideAwayBottom:function(){
        currentTransition = "slide-away-bottom";
    },
    goto: function (view) {

      var previous = this.currentPage || null;
      var next = view;

      if (previous) {
        previous.transitionOut(function () {
          previous.remove();
        });
      }

      next.render({ page: true });
      this.$el.append( next.$el );
      next.transitionIn();
      this.currentPage = next;

    },
    goBack:function(){
      window.history.back();
    }

  });

  app.Views.Home = app.Extensions.View.extend({

    className: 'home',
    events: {
      "click .close-link" : "goBack" 
    },
    goBack:function(){
      window.history.back();
    },

    render: function () {
      var template = _.template( tpl.get('home') );
      this.$el.html(template());
      if ( routeChanged == true ) {
        this.$el.find('.close-link').show();
      } else {
        this.$el.find('.close-link').hide();
        startMap();
      }
      
      return app.Extensions.View.prototype.render.apply(this, arguments);
    }


  });

  app.Views.OnTheBoat = app.Extensions.View.extend({

    className: 'on-the-boat',

    render: function () {
      var template = _.template( tpl.get('on-the-boat') );
      this.$el.html(template());
      return app.Extensions.View.prototype.render.apply(this, arguments);
    }

  });

  app.Views.Category = app.Extensions.View.extend({

    className: 'category',
    render: function () {
     var template = _.template( tpl.get('category') );
    console.log(this.model.toJSON());
     this.$el.html(template(this.model.toJSON()));
     return app.Extensions.View.prototype.render.apply(this, arguments);
    }

  });

  app.Views.Location = app.Extensions.View.extend({

    className: 'location',

    render: function () {
      var template = _.template( tpl.get('location') );
      this.$el.html(template(this.model.toJSON()));
      return app.Extensions.View.prototype.render.apply(this, arguments);
    }

  });

  var locationMapObj,
  currentLocationMarkerObj;
  app.Views.LocationMap = app.Extensions.View.extend({

    className: 'location-map',
    events: {
      "click .close-link" : "goBack",
      "click .locate" : "locateMe"
    },
  
    goBack: function(){
      window.history.back();
    },

    locateMe : function(){
      locationMapObj.locate({setView: true, maxZoom: CACHE_ZOOM_MAX});
      locationMapObj.on('locationfound',function(e){
        
        currentLocationMarkerObj.setLatLng(e.latlng).update();
      });
    },

    render: function () {
      var template = _.template( tpl.get('location-map') );
      this.$el.html(template(this.model.toJSON()));
      //startMap('map');


      navigator.geolocation.getCurrentPosition(function(position){
          locationMapObj =  L.map('map', {
              minZoom:CACHE_ZOOM_MIN,
              maxZoom:CACHE_ZOOM_MAX,
              zoomControl:false
          });

          MAP = locationMapObj;


          try {
              BASE = L.tileLayerCordova('https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png', {
                  minZoom:CACHE_ZOOM_MIN,
                  maxZoom: CACHE_ZOOM_MAX,
                  folder: 'LTileLayerCordovaExample',
                  name:   'example',
                  detectRetina: true,
                  debug:   true
              }, function() {
                
                //callback
                currentLocationMarkerObj = L.marker([LAT, LNG],{ icon: markers["current-location"] }).addTo(MAP);
                L.marker([LAT, LNG],{ icon: markers["purple"] }).addTo(MAP); //.bindPopup('A pretty CSS3 popup.<br> Easily customizable.').openPopup();
                

              }).addTo(MAP);

              

          } catch (e) {
              alert(e);
          }

          MAP.setView([LAT,LNG],ZOOM);
          MAP.on('moveend', function () {
              //updateStatus();
          }).fire('moveend');
      },function(err){});





      return app.Extensions.View.prototype.render.apply(this, arguments);

    }

  });




  app.Models.Location = Backbone.Model.extend({
    defaults: {
      id: 'some-place-one',
      title: 'Some Place One',
      description: "Sample traditional foods harvested from the lands of Manitoulin.",
      cost: '$40 Per Person',
      hours: "MON-WED 8AM-4PM",
      phone: "(705) 377-5778",
      website: "www.acornroadhouse.com",
      address: "5373 Canterbury Court<br> Tobermory, ON<br> N0H 2T0"
    }
  });

  //Collections
  app.Collections.Category = Backbone.Collection.extend({
    model: app.Models.Location
  });

  // Data



  // Models

  app.Models.Category = Backbone.Model.extend({
    defaults: {
      id:'land',
      title: 'Land',
      rootSection: 'on-the-boat'
    }
  });


app.Src = {
  "on-the-boat" : {
    title: "On The Boat",
    collection : [
      {
          id:"land",
          title : "Land",
          collection : [
            {title:'Saome Place One', id:'some-place-one'},
            {title:'Soame Place Two', id:'some-place-two'}
          ]

      },
      {
          id:"water",
          title : "Water",
          collection : [
            {title:'Saome Place One', id:'some-place-one'},
            {title:'Soame Place Two', id:'some-place-two'}
          ]

      }
    ]
  }
}


_.each(app.Src,function(sectionNode,sectionID){
  Models[sectionID] = {}
  Collections[sectionID] = {}
  console.log(sectionNode.collection.length);
  $.each(sectionNode.collection ,function(i,category){
    console.log('hey');

    Collections[sectionID][category.id] = new app.Collections.Category(category.collection);
    Models[sectionID][category.id] = new app.Models.Category({
      sectionID: sectionID,
      categoryID: category.id,
      collection: Collections[sectionID][category.id].toJSON()
    });
  });
});

app.Data.OnTheBoat = {
  "land" : new app.Collections.Category([
      {title:'Saome Place One', id:'some-place-one'},
      {title:'Soame Place Two', id:'some-place-two'}
  ])
}



$.fn.removeClassPrefix = function(prefix) {
    this.each(function(i, el) {
        var classes = el.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        el.className = $.trim(classes.join(" "));
    });
    return this;
};