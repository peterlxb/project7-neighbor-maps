
  var map;
  var markersArray = [];

  function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?js?libraries=places,geometry&key=AIzaSyDbC-ePyIjHbJQePaosaWn8XAb3GGWhRDI' +
      '&&callback=initMap';
  document.body.appendChild(script);
}
window.onload = loadScript;
  //Initialize the map and its contents
  function initMap() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(25.037394,121.5166),
        mapTypeControl: false,
        disableDefaultUI: true
    };
    // if($(window).width() <= 1080) {
    //     mapOptions.zoom = 13;
    // }
    // if ($(window).width() < 850 || $(window).height() < 595) {
    //     hideNav();
    // }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    setMarkers(markers);

    setAllMap();
  }

  //Determines if markers should be visible
  //This function is passed in the knockout viewModel function
  function setAllMap() {
    for (var i = 0; i < markers.length; i++) {
      if(markers[i].boolTest === true) {
      markers[i].holdMarker.setMap(map);
      } else {
      markers[i].holdMarker.setMap(null);
      }
    }
  }


  //Information about the different locations
  //Provides information for the markers
  var markers = [
      {
      title: "Evergreen Maritime Museum",
      lat: 25.038611,
      lng: 121.518889,
      streetAddress: "Zhongzheng District, ",
      cityAddress: "Taipei City, Taiwan 100",
      url: "www.nps.gov/thje/index.htm",
      id: "nav0",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "The Peace Park",
      lat: 25.040363,
      lng: 121.515469,
      streetAddress: "No. 3, Ketagalan Blvd, Zhongzheng District,",
      cityAddress: "Taipei City, Taiwan 100",
      url: "www.nps.gov/linc/index.htm",
      id: "nav1",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "The Taiwan Museum",
      lat: 25.038234,
      lng: 121.519291,
      streetAddress: "No. 1, Section 1, Xinyi Road",
      cityAddress: "Zhongzheng District, Taipei City, Taiwan 100",
      url: "www.nps.gov/wamo/index.htm",
      id: "nav2",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "Melange Café",
      lat: 25.049061,
      lng: 121.517478,
      streetAddress: "No. 23, Lane 16, Section 2, Zhongshan North Road,",
      cityAddress: " Zhongshan District, Taipei City, Taiwan 10491 ",
      url: "www.visitthecapitol.gov",
      id: "nav3",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "starbucks",
      lat: 25.045162,
      lng: 121.505572,
      streetAddress: "No. 77, Section 2, Wuchang St, ",
      cityAddress: "Wanhua District, Taipei City, Taiwan 108",
      url: "www.whitehouse.gov",
      id: "nav4",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "Taipei Cinema Park",
      lat: 25.044722,
      lng: 121.503137,
      streetAddress: "No. 19, Kangding Road,",
      cityAddress: " Wanhua District, Taipei City, Taiwan 108",
      url: "www.wwiimemorial.com/",
      id: "nav5",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "hotel",
      lat: 25.046775,
      lng: 121.505803 ,
      streetAddress: "No. 46, Kunming Street",
      cityAddress: " Wanhua District, Taipei City, Taiwan 108",
      url: "www.nga.gov/content/ngaweb.html",
      id: "nav6",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "hotel",
      lat: 25.042763,
      lng: 121.509436,
      streetAddress: "No. 4, Xiushan Street, ",
      cityAddress: "Zhongzheng District, Taipei City, Taiwan 100",
      url: "www.mnh.si.edu",
      id: "nav7",
      visible: ko.observable(true),
      boolTest: true
      },
      {
      title: "pizza ",
      lat: 25.049061,
      lng: 121.517478,
      streetAddress: "103, Taiwan, Taipei City,,",
      cityAddress: " Datong District, Section 1, Chengde Road",
      url: "www.si.edu/Museums/arts-and-industries-building",
      id: "nav8",
      visible: ko.observable(true),
      boolTest: true
      }
  ];

  var headingImageView = [5, 235, 55, 170, 190, 240, -10, 10, 190];
  var streetViewImage;
  var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

  function determineImage() {
      if (i === 3) {
          streetViewImage = streetViewUrl + '38.892052,-77.008888&fov=75&heading=' + headingImageView[i] + '&pitch=10';
        } else if (i === 4) {
          streetViewImage = streetViewUrl +
                        markers[i].streetAddress + ',' + markers[i].cityAddress +
                        '&fov=75&heading=' + headingImageView[i] + '&pitch=10';
                      } else {
                        streetViewImage = streetViewUrl +
                          markers[i].lat + ',' + markers[i].lng +
                          '&fov=75&heading=' + headingImageView[i] + '&pitch=10';
                        }
        }



    //Sets the markers on the map within the initialize function
    //Sets the infoWindows to each individual marker
    //The markers are inidividually set using a for loop
    function setMarkers(location) {

    for(i=0; i<location.length; i++) {
        // create marker attr holdMarker
        location[i].holdMarker = new google.maps.Marker({
          position: new google.maps.LatLng(location[i].lat, location[i].lng),
          map: map,
          title: location[i].title,
          icon: {
            url: 'img/marker.png',
            size: new google.maps.Size(25, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            },
          shape: {
            coords: [1,25,-40,-25,1],
            type: 'poly'
          }
        });

        //test
        //API Keys

        //function to place google street view images within info windows
        determineImage();

        //Binds infoWindow content to each marker
        location[i].contentString = '<img src="' + streetViewImage +
                                  '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' +
                                   location[i].title + '</strong><p>' +
                                    location[i].streetAddress + '<br>' +
                                    location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url +
                                    '" target="_blank">' + location[i].url + '</a>';

        var infowindow = new google.maps.InfoWindow({
            //content: markers[i].contentString
            content:markers[i].contentString
        });

        //Click marker to view infoWindow
        //zoom in and center location on click
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            var address = {lat:location[i].lat, lng:location[i].lng};
            // var panoramaOptions = {
            //   position: address,
            //   pov: {heading: 65, pitch: 0},
            //   zoom:15
            // };

            // var panorama = new google.maps.StreetViewPanorama(
            //   document.getElementById('pano'), panoramaOptions);

            infowindow.open(map,this);
            var windowWidth = $(window).width();
            if(windowWidth <= 1080) {
                map.setZoom(14);
            } else if(windowWidth > 1080) {
                map.setZoom(16);
            }
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
          };
        })(location[i].holdMarker, i));

        //Click nav element to view infoWindow
        //zoom in and center location on click
        var searchNav = $('#nav' + i);
        searchNav.click((function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            // var address = {lat:location[i].lat, lng:location[i].lng};
            // var panoramaOptions = {
            //   position: address,
            //   pov: {heading: 65, pitch: 0},
            //   zoom:15
            // };

            // var panorama = new google.maps.StreetViewPanorama(
            //   document.getElementById('pano'), panoramaOptions);
            infowindow.open(map,marker);
            map.setZoom(16);
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
          };
        })(location[i].holdMarker, i));
    }
}

    //Query through the different locations from nav bar with knockout.js
    //only display markers and nav elements that match query result
    var viewModel = {
      query: ko.observable(''),
    };

    viewModel.markers = ko.dependentObservable(function() {
      var self = this;
      //search 为输入框中的search value
      var search = self.query().toLowerCase();
      return ko.utils.arrayFilter(markers, function(marker) {
        //如果有匹配的就返回那个marker
        if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
          } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
          }
        });
      }, viewModel);

      ko.applyBindings(viewModel);

//show $ hide markers in sync with nav
  $("#input").keyup(function() {
    setAllMap();
  });
