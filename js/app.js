  //define global var
  var map;
  var infoWindow;

  var locations = [
      {
      title: "Evergreen Maritime Museum",
      lat: 25.038611,
      lng: 121.518889,
      streetAddress: "Zhongzheng District, ",
      cityAddress: "Taipei City, Taiwan 100"
      },
      {
      title: "The Peace Park",
      lat: 25.040363,
      lng: 121.515469,
      streetAddress: "No. 3, Ketagalan Blvd, Zhongzheng District,",
      cityAddress: "Taipei City, Taiwan 100"
      },
      {
      title: "The Taiwan Museum",
      lat: 25.038234,
      lng: 121.519291,
      streetAddress: "No. 1, Section 1, Xinyi Road",
      cityAddress: "Zhongzheng District, Taipei City, Taiwan 100"
      },
      {
      title: "Melange Café",
      lat: 25.049061,
      lng: 121.517478,
      streetAddress: "No. 23, Lane 16, Section 2, Zhongshan North Road,",
      cityAddress: " Zhongshan District, Taipei City, Taiwan 10491 "
      },
      {
      title: "starbucks",
      lat: 25.045162,
      lng: 121.505572,
      streetAddress: "No. 77, Section 2, Wuchang St, ",
      cityAddress: "Wanhua District, Taipei City, Taiwan 108"
      },
      {
      title: "Taipei Cinema Park",
      lat: 25.044722,
      lng: 121.503137,
      streetAddress: "No. 19, Kangding Road,",
      cityAddress: " Wanhua District, Taipei City, Taiwan 108"
      },
      {
      title: "hotel",
      lat: 25.046775,
      lng: 121.505803 ,
      streetAddress: "No. 46, Kunming Street",
      cityAddress: " Wanhua District, Taipei City, Taiwan 108"
      },
      {
      title: "hotel",
      lat: 25.042763,
      lng: 121.509436,
      streetAddress: "No. 4, Xiushan Street, ",
      cityAddress: "Zhongzheng District, Taipei City, Taiwan 100"
      },
      {
      title: "pizza ",
      lat: 25.049061,
      lng: 121.517478,
      streetAddress: "103, Taiwan, Taipei City,,",
      cityAddress: " Datong District, Section 1, Chengde Road"
      }
    ];

  // function loadScript() {
  // var script = document.createElement('script');
  // script.type = 'text/javascript';
  // script.src = 'https://maps.googleapis.com/maps/api/js?js?libraries=places,geometry&key=AIzaSyDbC-ePyIjHbJQePaosaWn8XAb3GGWhRDI' +
  //     '&&callback=initMap' ;
  // script.onerror = googleError();
  // document.body.appendChild(script);
  // }
  // window.onload = loadScript;
  //Initialize the map and its contents

  var Location = function(location){
      var self = this;
      self.title = ko.observable(location.title);
      self.lat = ko.observable(location.lat);
      self.lng = ko.observable(location.lng);
      self.active = ko.observable(false);

      // ajax callback
      self.getContent = function(callback){
        if(self.content){
          return self.content;
        }

      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.title() + '&format=json&callback=wikiCallback';

      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
      })
      .done(function(response){
        var wikiContent = '';
        if(response){
          if(typeof response[1] !== 'undefined' && typeof response[3] !== 'undefined'){
            for(var i = 0;i < 3;i++){
              if(typeof response[1][i] !== 'undefined' && response[3][i] !== 'undefined'){
                wikiContent += '<a href=">' + response[3][i] + '" target"_blank"' + response[1][i] + '</a><br>'
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
          //selectLocation(self);
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
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    map.bounds = new google.maps.LatLngBounds();
    //infoWindow
    infoWindow = new google.maps.InfoWindow({
      content:''
    })

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

    this.currentLocation = ko.observable(locationsList()[0]);

    // initialize searchTerm which is used to filter the list of locations displayed
    this.searchTerm = ko.observable('');

    // this function is used to reset any active state that may be set
    this.resetActiveState = function() {
        self.currentLocation().active(false);
        self.currentLocation().marker.setAnimation(null);
        infowindow.close();
    };

    this.filterLocation = ko.computed(function(){
      //reset active marker
      resetActiveState();

      return self.locationsList().filter(function(location){
        var display = true;
        if(self.searchTerm() !== ''){
          if(location().title().toLowerCase().index(self.searchTerm().toLowerCase()) !== -1){
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
    this.selectLocation = function(clickedlocation){
      if(self.currentLocation() = clickedlocation && self.currentLocation().active == true){
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

      // open infoWindow for the current location
      infoWindow.setContent('<h1>' + self.currentLocation().title() + '</h1>' + self.currentLocation.getContent(function(l){
        if(self.currentLocation() == l){
          infoWindow.setContent('<h1>' + self.currentLocation().name() + '</h1>' + l.content())
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









function getFouSquare(data) {
  var CLIENT_ID = 'TT0MKMIFGVNZT0J2VJL3C4PIDKUX15G5VQGEHL3UFP4AQ5JA';
  var CLIENT_SECRET = 'WD1PN1IS2JQDYYXITIWWPCZLKVBR1EJHMXOMYUTKFUFQC54N';

  $.ajax({
      type: "GET",
      dataType: 'json',
      cache: false,
      url: 'https://api.foursquare.com/v2/venues/explore?',
      data: 'limit=3&ll=' + data + '&radius=5000&venuePhotos=1&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160608&m=foursquare',
      async: true
    })
      .done(function (response) {
        var responseArr = response.response.groups[0].items;

        for (var i = 0; i < responseArr.length; i++) {

          var resArr = responseArr[i];
          var fsphotosArr;

          //self.fstitle(resArr.venue.name);
          //self.fscontent(resArr.tips[0].text ? resArr.tips[0].text : "No tips here!");
          fsphotosArr  = resArr.venue.photos.groups[0].items[0];
          fsphotoURL = fsphotosArr.prefix + '100x100' + fsphotosArr.suffix;
          //self.fsurl(resArr.tips[0].canonicalUrl);

        }

      })
      .fail(function (response) {
        //callback function if error - an alert will be activated to notify the user of the error
        var foursquareDisplay =
          '<p>Bummer!... Could not load data from Foursquare! Make sure you are connected to the Internet, or try again later.</p>';

        //foursquareElem.append(foursquareDisplay);
      });
  }
