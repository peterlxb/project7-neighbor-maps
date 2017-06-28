/* this will hold the foursquare specific content in our infowindow */
    self.the4Sstring = '';

    /*
     * gets foursquare JSON data via AJAX based on a point and
     * parses some of it to our the4Sstring holder object.
     * will also call get4Stips() if tips are available for the point
     * @param  {point object} point [the point we want foursquare info for]
     */
    this.get4Sinfo = function(point){
        /* the foursquare api url */
        var url = 'https://api.foursquare.com/v2/venues/search?client_id=' +
            'NFLHHJ350PG5BFEFQB2AZY2CJ3TUCUYR3Q14QPL5L35JT4WR' +
            '&client_secret=WDNBZ4J3BISX15CF1MYOBHBP2RUSF2YSRLVPZ3F' +
            '4WZUYZGWR&v=20130815' + '&ll=' + point.lat() + ',' +
            point.long() + '&query=\'' + point.name + '\'&limit=1';

        /* perform the actual jquery request and get json in return
         * then use that to build out an html string that will be used
         * for the infowindow string as a substring
         */
        $.getJSON(url)
            .done(function(response){
                /* object */
                self.the4Sstring = '<p>Foursquare info:<br>';
                var venue = response.response.venues[0];
                /* venue id */
                var venueId = venue.id;

                var venueName = venue.name;
                if (venueName !== null && venueName !== undefined){
                    self.the4Sstring = self.the4Sstring + 'name: ' +
                        venueName + '<br>';
                }
                /* phone number */
                var phoneNum = venue.contact.formattedPhone;
                if (phoneNum !== null && phoneNum !== undefined){
                    self.the4Sstring = self.the4Sstring + 'phone: ' +
                        phoneNum + '<br>';
                }
                /* twitter */
                var twitterId = venue.contact.twitter;
                if (twitterId !== null && twitterId !== undefined){
                    self.the4Sstring = self.the4Sstring + 'twitter name: ' +
                        twitterId + '<br>';
                }
                /* address */
                var address = venue.location.formattedAddress;
                if (address !== null && address !== undefined){
                    self.the4Sstring = self.the4Sstring + 'address: ' +
                        address + '<br>';
                }
                /* category */
                var category = venue.categories.shortName;
                if (category !== null && category !== undefined){
                    self.the4Sstring = self.the4Sstring + 'category: ' +
                        category + '<br>';
                }
                /* checkins */
                var checkinCount = venue.stats.checkinsCount;
                if (checkinCount !== null && checkinCount !== undefined){
                    self.the4Sstring = self.the4Sstring + '# of checkins: ' +
                        checkinCount + '<br>';
                }
                /* tips */
                var tipCount = venue.stats.tipCount;
                if (tipCount > 0) {
                    self.get4Stips(venueId, point);
                }
                else{
                    /* only do this if we have no tips.  Otherise let the
                     * tip function do it
                     */
                    self.the4Sstring = self.the4Sstring + '</p>';
                    /* now that we have info, update the infowindow with it */
                    self.checkPano();
                }
            })
            .fail(function(){
                self.the4Sstring = 'Fouresquare data request failed';
                console.log('Fouresquare failed to load information' +
                    'attempting to load error  we can get into info window');
                /* update the infowindow anyway */
                self.checkPano();
            });

    };

    /*
     * gets foursquare tips JSON data via AJAX based on a point and
     * parses some of it into the the4Sstring holder object.
     * @param  {string} venueId [foursquare specific location id]
     * @param  {point object} point   [the point we are getting info for]
     */
    this.get4Stips = function(venueId, point){
        /* the foursquare tips api url */
        var url ='https://api.foursquare.com/v2/venues/' + venueId + '/tips' +
            '?client_id=NFLHHJ350PG5BFEFQB2AZY2CJ3TUCUYR3Q14QPL5L35JT4WR' +
            '&client_secret=WDNBZ4J3BISX15CF1MYOBHBP2RUSF2YSRLVPZ3F4WZUYZGWR&' +
            'v=20130815';

        /* perform the actual jquery request and get json in return
         * then use that to build out an html string that will be used
         * for the infowindow string as a substring
         */
        $.getJSON(url)
            .done(function(response){
                /* object */
                var tipCount = Math.min(self.max4Stips,
                    response.response.tips.count);
                /* tips */
                self.the4Sstring = self.the4Sstring + '<br>tips: <ul>';
                for(var i=0;i<tipCount;i++){
                    self.the4Sstring = self.the4Sstring + '<li>' +
                        response.response.tips.items[i].text + '</li>';
                }

                self.the4Sstring = self.the4Sstring + '</ul></p>';
                /* now that we have info, update the infowindow with it */
                self.checkPano();
            })
            .fail(function(){
                /* close up the string we started in the get4Sinfo function */
                self.the4Sstring = self.the4Sstring + '</p>';
                console.log('Fouresquare failed to loads tip information' +
                    ' attempting to load what we have into the infowindow');
                /* update the infowindow anyway */
                self.checkPano();
            });
    };
