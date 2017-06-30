  //define global var
  var map;
  var infoWindow;

  var locations = [
      {
      title: "taipei",
      lat: 25.038611,
      lng: 121.518889,
      streetAddress: "No. 3, Ketagalan Blvd, Zhongzheng District ",
      cityAddress: "Taipei City, Taiwan 100"
      },
      {
      title: "taipei",
      lat: 25.040363,
      lng: 121.515469,
      streetAddress: "No. 3, Ketagalan Blvd, Zhongzheng District,",
      cityAddress: "Taipei City, Taiwan 100"
      },
      {
      title: "taipei",
      lat: 25.038234,
      lng: 121.519291,
      streetAddress: "No. 1, Section 1, Xinyi Road",
      cityAddress: "Zhongzheng District, Taipei City, Taiwan 100"
      },
      {
      title: "taipei",
      lat: 25.049061,
      lng: 121.517478,
      streetAddress: "No. 23, Lane 16, Section 2, Zhongshan North Road,",
      cityAddress: " Zhongshan District, Taipei City, Taiwan 10491 "
      },
      {
      title: "taipei",
      lat: 25.045162,
      lng: 121.505572,
      streetAddress: "No. 77, Section 2, Wuchang St, ",
      cityAddress: "Wanhua District, Taipei City, Taiwan 108"
      },
      {
      title: "Taipei",
      lat: 25.044722,
      lng: 121.503137,
      streetAddress: "No. 19, Kangding Road,",
      cityAddress: " Wanhua District, Taipei City, Taiwan 108"
      },
      {
      title: "taipei",
      lat: 25.042763,
      lng: 121.509436,
      streetAddress: "No. 4, Xiushan Street, ",
      cityAddress: "Zhongzheng District, Taipei City, Taiwan 100"
      },
      {
      title: "taipei",
      lat: 25.049061,
      lng: 121.517478,
      streetAddress: "103, Taiwan, Taipei City",
      cityAddress: " Datong District, Section 1, Chengde Road"
      }
    ];


  var Location = function(location){
      var self = this;
      self.title = ko.observable(location.title);
      self.lat = ko.observable(location.lat);
      self.lng = ko.observable(location.lng);
      self.streetAddress = ko.observable(location.streetAddress);
      self.cityAddress = ko.observable(location.cityAddress);
      self.active = ko.observable(false);

      // ajax callback
      self.getContent = function(callback){
        if(self.content){
          return self.content;
        }

      var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.title() + '&format=json&callback=wikiCallback';

      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        jsonp: 'callback'
      })
      .done(function(response){
        var articleList = response[1];
        console.log(articleList);
        var wikiContent = '';
        if(response){
          if(typeof response[1] !== 'undefined' && typeof response[3] !== 'undefined'){
            for(var i = 0;i < 3;i++){
              if(typeof response[1][i] !== 'undefined' && response[3][i] !== 'undefined'){
                wikiContent += '<a href="https://en.wikipedia.org/wiki/>' + response[1][i] + '" target"_blank"'  + '</a><br>'
              }
            }
          }
        }
        if(wikiContent != ''){
          self.content = ko.observable('<h4>Wikipedia results for "' + self.title() + '"</h4><p>' + wikiContent + '</p>');
        } else {
          self.content = ko.observable('<h4>Wikipedia results for "' + self.title() + '"</h4><p>There was a problem reaching wikipedia</p>');
        }
      })
      .fail(function() {
        console.log("There is a error when call wiki api");
        self.content = ko.observable('<h4>Wikipedia results for "' + self.title() + '"</h4><p>There was a problem reaching wikipedia</p>');
      })
      // return a spinner for while the external API is still loading
      return '<h4>Wikipedia results for "' + self.title() + '"</h4><p><span class="spinner"></span></p>';
      }

      self.createMarker = (function(){
        self.marker = new google.maps.Marker({
          position: {lat:self.lat(), lng: self.lng()},
          map:map,
          title: self.title()
        })

        map.bounds.extend(self.marker.position);
        // add click event listener to marker
        self.marker.addListener('click',function(){
          selectLocation(self);
        })

      })();
}

  //define Google map
  function initMap() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(25.037394,121.5166),
        mapTypeControl: false,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    map.bounds = new google.maps.LatLngBounds();
    //infoWindow
    infoWindow = new google.maps.InfoWindow({
      content:''
    });

    google.maps.event.addListener(infoWindow, 'closeclick', function(){
        resetActiveState();
    });

    // add eventlistener to resize map when the browser resizes
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(map.bounds);
    });

  }

  //define VM to bind model and view
  var ViewModel = function(){
    self = this;
    // show ui if map loaded properly
    this.mapNotLoaded = ko.observable(false);
    this.locationsList = ko.observableArray([]);
    // add location objects to the locationsList
    locations.forEach(function(item){
      self.locationsList.push(new Location(item))
    });
    // fit map to new bounds
    map.fitBounds(map.bounds);

    //set currentLocation
    this.currentLocation = ko.observable(locationsList()[0]);

    // initialize searchTerm which is used to filter the list of locations displayed
    this.searchTerm = ko.observable('');

    // this function is used to reset any active state that may be set
    this.resetActiveState = function() {
        self.currentLocation().active(false);
        self.currentLocation().marker.setAnimation(null);
        infoWindow.close();
    };

    this.filteredLocations = ko.computed(function(){
      //reset active marker
      resetActiveState();

      return self.locationsList().filter(function(location){
        var display = true;
        if(self.searchTerm() !== ''){
          if(location.title().toLowerCase().indexOf(self.searchTerm().toLowerCase()) !== -1){
            display= true;
          } else {
            display = false;
          }
        }
        location.marker.setVisible(display);
        return display;
      });
    });

    // click handler for when a location is clicked
    this.selectLocation = function(clickedLocation){
      if(self.currentLocation() == clickedLocation && self.currentLocation().active === true){
        resetActiveState();
        return;
      };

      // reset any active state
      resetActiveState();

      // update currentLocation
      self.currentLocation(clickedLocation);

      self.currentLocation().active(true);

      // bounce marker
      self.currentLocation().marker.setAnimation(google.maps.Animation.BOUNCE);

      infoWindow.setContent('<h1>' + self.currentLocation().title() + '</h1>' + self.currentLocation().getContent(function(l){
             // This is a call back function passed to Location.getContent()
             // When Location has finished getting info from external API it will call this function
             // check if infoWindow is still open for the location calling this call back function
            if (self.currentLocation() == l){
                 infoWindow.setContent('<h1>' + self.currentLocation().title() + '</h1>' + l.content());
             }
         }));
         infoWindow.open(map, self.currentLocation().marker);

      // center map on current marker
      map.panTo(self.currentLocation().marker.position);

    };
    // hide nav initially on mobile
    this.hideNav = ko.observable( window.innerWidth < 640 );

    this.toggleNav = function() {
      self.hideNav(! self.hideNav());
      google.maps.event.trigger(map, 'resize');
      map.fitBounds(map.bounds);
    };
};

// This is called by the maps api as a callback
var app = function() {
  initMap();

  ko.applyBindings(ViewModel);
};


// Fallback for Google Maps Api
function googleError(){
    console.log('Error: Google maps API has not loaded');
    $('body').prepend('<p id="map-error">Sorry we are having trouble loading google maps API, please try again in a moment.</p>');
};
