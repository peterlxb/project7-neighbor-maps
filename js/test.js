 self.the4Sstring = '';

 this.get4Sinfo = function(location) {
   /* the foursquare api url */
        var url = 'https://api.foursquare.com/v2/venues/search?client_id=' +
            'NFLHHJ350PG5BFEFQB2AZY2CJ3TUCUYR3Q14QPL5L35JT4WR' +
            '&client_secret=WDNBZ4J3BISX15CF1MYOBHBP2RUSF2YSRLVPZ3F' +
            '4WZUYZGWR&v=20130815' + '&ll=' + location.lat + ',' +
            location.lng + '&query=\'' + location.title + '\'&limit=1';

        $.getJSON(url)
            .done(function(response){
              self.the4Sstring = '<p>Foursquare info: <br>';
              var venue = response.response.venues[0];
              var venueId = venue.id;

              var venueName = venue.name;
              if(venueName !== null && venueName !== undefined) {
                self.the4Sstring  = self.the4Sstring + 'name: ' + venueName + "<br>";
              }

              var phonoNum = venue.contact.formattedPhone;
              if(phonoNum !== null && phoneNum !== undefined) {
                self.the4Sstring = self.the4Sstring + 'phone: ' + phonoNum + '<br>';
              }

              var address = venue.location.formattedAddress;
              if (address !== null && addrsss !== undefined){
                self.the4Sstring = self.the4Sstring + 'address: ' + address + '<br>';
              }

              var category = venue.categories.shortName;
              if(category !== null && category !== undefined){
                self.the4Sstring = self.the4Sstring + 'category: ' + category + '<br>';
              }

              var tipCount = venue.stats.tipCount;
              if(tipCount > 0){
                self.get4Stips(venueId,point);
              } else {
                self.the4Sstring = self.the4Sstring + '</p>';
                //
                self.checkPano();
              }
        }).fail(function(){
          self.the4Sstring = 'Fouresquare data request failed';
          console.log('Fouresquare failed to load information' +
                    'attempting to load error  we can get into info window');
          self.checkPano();
        })
 }
