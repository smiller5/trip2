//Firebase Link
var fireLink= new Firebase("https://travelproject.firebaseio.com/");

//sets sidebars state to close 
$(".sidebar.left").sidebar().trigger("sidebar:close");
//Clicking the search button triggers the geocoder function. The output of geoocder is used in all other ajax calls.

$(document).ready(function(){
//Sidebar open/close commands
	$("#sidebarButton").on('click', function(){
		$(".sidebar.left").sidebar().trigger("sidebar:open");
});
	$("#sidebarButtonClose").on('click', function(){
		$(".sidebar.left").sidebar().trigger("sidebar:close");
	});
	//the geocoder api takes a query and finds that location's lat, long, formatted address, etc.
	var geocoder = function (query){
		console.log(query)
		var query=query
		var query2=query.split(",");
		var query3=query2[1];
		console.log(query)
	var geocodeQueryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + query + '&key=AIzaSyAzBECPmc6z_ppq-pud2BgfA6bmZOnC25s';

		$.ajax({url: geocodeQueryURL, method: 'GET'})

			.done(function(response) {
			console.log("------GeoCoder!");

			var data = response.results[0];
			// results[0] pulls the FIRST result from geocoder API.
			
	 		console.log(response);
	 		var location = data.formatted_address;
			console.log('Location Query: ' + location);
			//changes header to city name
			$('#cityName').html(location);
			
			var place_id = data.place_id;
			console.log('GooglePlace ID: ' + place_id);

			var query1=data.formatted_address
			var query2=query.toLowerCase();

			var latitude = data.geometry.location.lat;
			console.log('Latitude: ' + latitude);

			var longitude = data.geometry.location.lng;
			console.log('Longitude: ' + longitude);

			var country = data.address_components[data.address_components.length - 1].long_name.trim();
			console.log('Country: ' + country);
			
			//Location and info display
			var showLocation = $('#infoDisplay');
			var showWeather = $('#weatherDisplay');
			var showLocationFill = $('<div class="row">');
			var headLoc = $('#headerLoc');


			//this clears the DIVs of all contents.
			showLocation.empty();
			showWeather.empty();
			headLoc.empty();

			

			headLoc.append(location);
			//this is the placeholder for the google map!

			showLocationFill.append('<div class="col-md-12" id="locationInfo"><h2><i class="glyphicon glyphicon-globe"></i> ' + location + ' <span class="text-smaller">('  + latitude.toFixed(2) + ' , ' + longitude.toFixed(2) + ')</span></h2></div>');


			showWeather.append(showLocationFill);
			 // showLocation.append(mapDisplay);

			// attempt at google map places library
			var mapOptions = {
				center: new google.maps.LatLng(latitude, longitude),
				zone: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

		

			var service = new google.maps.places.PlacesService(map);

			var request = {
			    location: {lat: latitude, lng: longitude},
			    radius: '5000',
			    query: '[(attraction)]',
			    rankBy: google.maps.places.RankBy.DISTANCE
		  	};

			function callback(results, status) {


			//access to google places, returning bars, resturants, POI.
				console.log("------Google Places Library!");
				var placeDisplay = $('#buzzDisplay');
				placeDisplay.empty();

		  		if (status == google.maps.places.PlacesServiceStatus.OK) {
			    	for (var i = 0; i < results.length; i++) {
				      	var place = results[i];
				      	var types = place.types.join(' &#9900; ').replace(/_/g, ' ');

				      	if(place.photos){
	      					var placePhoto = place.photos[0].getUrl({'maxWidth': 320, 'maxHeight': 200});
		      			} else {
		      				var placePhoto = "images/no-image-available.png";
		      			}

		     	 		var googleCredit = $('<img src="images/powered-by-google-on-white.png" alt="powered by google">');

			     		placeDisplay.append('<div class="media"><div class="media-left media-middle"><img class="media-object placePic" src="' + placePhoto + '" alt="' + location + '"></div><div class="media-body"><h4 class="media-heading">' + place.name + '</h4><p>Google Rating: ' + place.rating + '<br />' + place.formatted_address + '</p><p class="text-muted">' + types  + '</p></div></div>');

			      		placeDisplay.append('<hr />');
					      //required Google credit
					      
				      	console.log('#'+(i+1));
				      	console.log(place.name);
				      	console.log(place.formatted_address);
				      	console.log(place);
				      	console.log(placePhoto);
				      var N1= place.formatted_address;
				      var N2=N1.split(",");
				      var N3=N2[2];
				      var N4=N3.split(" ");
				      var N5=N4[1];
				      console.log(N5);
			    	}
			    	placeDisplay.append(googleCredit);
			  	}
			}

			service.textSearch(request, callback);
			// end of map stuff

			// openWeather API Key = b0b52307eaa0d845eca3022f719aae3d
			var openWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&APPID=b0b52307eaa0d845eca3022f719aae3d';

			$.ajax({url: openWeatherURL, method: 'GET'})
			.done(function(response) {
			
	 		console.log("------Open Weather!");
	 		console.log(response);

	 		var weatherDataNow = response.list[0];
	 		var weatherData12Hr = response.list[4];
	 		var weatherData24Hr = response.list[8];
	 		var weatherData36Hr = response.list[12];
	 		var weatherData48Hr = response.list[16];

	 		var weatherNow = {
	 			weatherData: response.list[0],
		 		tempK: weatherDataNow.main.temp,
		 		highTempK: weatherDataNow.main.temp_max,
		 		lowTempK: weatherDataNow.main.temp_min,
		 		condition: weatherDataNow.weather[0].description,
		 		windSpeed: weatherDataNow.wind.speed,
		 		windSpeedMPH: weatherDataNow.wind.speed * 0.62137,
		 		windDir: weatherDataNow.wind.deg,
		 		tempC: Math.round(weatherDataNow.main.temp - 273.15),
		 		tempF: Math.round((weatherDataNow.main.temp * 9/5) - 459.67),
		 		highTempC: Math.round(weatherDataNow.main.temp_max - 273.15),
		 		highTempF: Math.round((weatherDataNow.main.temp_max * 9/5) - 459.67),
		 		lowTempC: Math.round(weatherDataNow.main.temp_min - 273.15),
		 		lowTempF: Math.round((weatherDataNow.main.temp_min * 9/5) - 459.67)
	 		}

	 		var weather12Hrs = {
	 			weatherData: response.list[4],
		 		tempK: weatherData12Hr.main.temp,
		 		highTempK: weatherData12Hr.main.temp_max,
		 		lowTempK: weatherData12Hr.main.temp_min,
		 		condition: weatherData12Hr.weather[0].description,
		 		windSpeed: weatherData12Hr.wind.speed,
		 		windSpeedMPH: weatherData12Hr.wind.speed * 0.62137,
		 		windDir: weatherData12Hr.wind.deg,
		 		tempC: Math.round(weatherData12Hr.main.temp - 273.15),
		 		tempF: Math.round((weatherData12Hr.main.temp * 9/5) - 459.67),
		 		highTempC: Math.round(weatherData12Hr.main.temp_max - 273.15),
		 		highTempF: Math.round((weatherData12Hr.main.temp_max * 9/5) - 459.67),
		 		lowTempC: Math.round(weatherData12Hr.main.temp_min - 273.15),
		 		lowTempF: Math.round((weatherData12Hr.main.temp_min * 9/5) - 459.67)
	 		};

	 		var weather24Hrs = {
	 			weatherData: response.list[8],
		 		tempK: weatherData24Hr.main.temp,
		 		highTempK: weatherData24Hr.main.temp_max,
		 		lowTempK: weatherData24Hr.main.temp_min,
		 		condition: weatherData24Hr.weather[0].description,
		 		windSpeed: weatherData24Hr.wind.speed,
		 		windSpeedMPH: weatherData24Hr.wind.speed * 0.62137,
		 		windDir: weatherData24Hr.wind.deg,
		 		tempC: Math.round(weatherData24Hr.main.temp - 273.15),
		 		tempF: Math.round((weatherData24Hr.main.temp * 9/5) - 459.67),
		 		highTempC: Math.round(weatherData24Hr.main.temp_max - 273.15),
		 		highTempF: Math.round((weatherData24Hr.main.temp_max * 9/5) - 459.67),
		 		lowTempC: Math.round(weatherData24Hr.main.temp_min - 273.15),
		 		lowTempF: Math.round((weatherData24Hr.main.temp_min * 9/5) - 459.67)
	 		};

	 		var weather36Hrs = {
	 			weatherData: response.list[12],
		 		tempK: weatherData36Hr.main.temp,
		 		highTempK: weatherData36Hr.main.temp_max,
		 		lowTempK: weatherData36Hr.main.temp_min,
		 		condition: weatherData36Hr.weather[0].description,
		 		windSpeed: weatherData36Hr.wind.speed,
		 		windSpeedMPH: weatherData36Hr.wind.speed * 0.62137,
		 		windDir: weatherData36Hr.wind.deg,
		 		tempC: Math.round(weatherData36Hr.main.temp - 273.15),
		 		tempF: Math.round((weatherData36Hr.main.temp * 9/5) - 459.67),
		 		highTempC: Math.round(weatherData36Hr.main.temp_max - 273.15),
		 		highTempF: Math.round((weatherData36Hr.main.temp_max * 9/5) - 459.67),
		 		lowTempC: Math.round(weatherData36Hr.main.temp_min - 273.15),
		 		lowTempF: Math.round((weatherData36Hr.main.temp_min * 9/5) - 459.67)
	 		};

	 		var weather48Hrs = {
	 			weatherData: response.list[16],
		 		tempK: weatherData48Hr.main.temp,
		 		highTempK: weatherData48Hr.main.temp_max,
		 		lowTempK: weatherData48Hr.main.temp_min,
		 		condition: weatherData48Hr.weather[0].description,
		 		windSpeed: weatherData48Hr.wind.speed,
		 		windSpeedMPH: weatherData48Hr.wind.speed * 0.62137,
		 		windDir: weatherData48Hr.wind.deg,
		 		tempC: Math.round(weatherData48Hr.main.temp - 273.15),
		 		tempF: Math.round((weatherData48Hr.main.temp * 9/5) - 459.67),
		 		highTempC: Math.round(weatherData48Hr.main.temp_max - 273.15),
		 		highTempF: Math.round((weatherData48Hr.main.temp_max * 9/5) - 459.67),
		 		lowTempC: Math.round(weatherData48Hr.main.temp_min - 273.15),
		 		lowTempF: Math.round((weatherData48Hr.main.temp_min * 9/5) - 459.67)
	 		};
	 		//make a row for the weatherInfo
	 		var weatherInfo = $('<div class="row">')
	 		// console.log(tempF + "F , " + tempC + "C");

			// Today's Weather added to  layout.

			weatherInfo.append('<div class="col-md-12"><p><b>Right Now:</b> '+ weatherNow.tempF + '&#8457; <span class="text-smaller">(' + weatherNow.tempC + '&#8451;)</span>&nbsp;&nbsp;<span class="label label-info">' + weatherNow.condition + '</span>&nbsp;&nbsp;<span class="label label-default">High: ' + weatherNow.highTempF + '&#8457; <span class="text-smaller">(' + weatherNow.highTempC + '&#8451)</span></span>&nbsp;&nbsp;<span class="label label-success">Low: '  + weatherNow.lowTempF + '&#8457; <span class="text-smaller">(' + weatherNow.lowTempC + '&#8451;)</span></span><br />Wind Speed: ' + weatherNow.windSpeedMPH.toFixed(2) + ' mph <span class="text-smaller">(' + weatherNow.windSpeed.toFixed(2) + ' km/h)</span></span>&nbsp;&nbsp;Direction: ' + weatherNow.windDir.toFixed(0) + '&deg;</p>');
			weatherInfo.append('<hr>');

			//Weather in 12 Hours

			weatherInfo.append('<div class="col-md-12"><p><b>In 12 Hours:</b> '+ weather12Hrs.tempF + '&#8457; <span class="text-smaller">(' + weather12Hrs.tempC + '&#8451;)</span>&nbsp;&nbsp;<span class="label label-info">' + weather12Hrs.condition + '</span>&nbsp;&nbsp;<span class="label label-default">High: ' + weather12Hrs.highTempF + '&#8457; <span class="text-smaller">(' + weather12Hrs.highTempC + '&#8451)</span></span>&nbsp;&nbsp;<span class="label label-success">Low: '  + weather12Hrs.lowTempF + '&#8457; <span class="text-smaller">(' + weather12Hrs.lowTempC + '&#8451;)</span></span><br />Wind Speed: ' + weather12Hrs.windSpeedMPH.toFixed(2) + ' mph <span class="text-smaller">(' + weather12Hrs.windSpeed.toFixed(2) + ' km/h)</span></span>&nbsp;&nbsp;Direction: ' + weather12Hrs.windDir.toFixed(0) + '&deg;</p>');
			weatherInfo.append('<hr>');

			//Weather in 24 Hours

			weatherInfo.append('<div class="col-md-12"><p><b>In 24 Hours:</b> '+ weather24Hrs.tempF + '&#8457; <span class="text-smaller">(' + weather24Hrs.tempC + '&#8451;)</span>&nbsp;&nbsp;<span class="label label-info">' + weather24Hrs.condition + '</span>&nbsp;&nbsp;<span class="label label-default">High: ' + weather24Hrs.highTempF + '&#8457; <span class="text-smaller">(' + weather24Hrs.highTempC + '&#8451)</span></span>&nbsp;&nbsp;<span class="label label-success">Low: '  + weather24Hrs.lowTempF + '&#8457; <span class="text-smaller">(' + weather24Hrs.lowTempC + '&#8451;)</span></span><br />Wind Speed: ' + weather24Hrs.windSpeedMPH.toFixed(2) + ' mph <span class="text-smaller">(' + weather24Hrs.windSpeed.toFixed(2) + ' km/h)</span></span>&nbsp;&nbsp;Direction: ' + weather24Hrs.windDir.toFixed(0) + '&deg;</p>');
			weatherInfo.append('<hr>');

			// Weather in 36 Hours

			weatherInfo.append('<div class="col-md-12"><p><b>In 36 Hours:</b> '+ weather36Hrs.tempF + '&#8457; <span class="text-smaller">(' + weather36Hrs.tempC + '&#8451;)</span>&nbsp;&nbsp;<span class="label label-info">' + weather36Hrs.condition + '</span>&nbsp;&nbsp;<span class="label label-default">High: ' + weather36Hrs.highTempF + '&#8457; <span class="text-smaller">(' + weather36Hrs.highTempC + '&#8451)</span></span>&nbsp;&nbsp;<span class="label label-success">Low: '  + weather36Hrs.lowTempF + '&#8457; <span class="text-smaller">(' + weather36Hrs.lowTempC + '&#8451;)</span></span><br />Wind Speed: ' + weather36Hrs.windSpeedMPH.toFixed(2) + ' mph <span class="text-smaller">(' + weather36Hrs.windSpeed.toFixed(2) + ' km/h)</span></span>&nbsp;&nbsp;Direction: ' + weather36Hrs.windDir.toFixed(0) + '&deg;</p>');
			weatherInfo.append('<hr>');

			//Weather In 48 Hours

			weatherInfo.append('<div class="col-md-12"><p><b>In 48 Hours:</b> '+ weather48Hrs.tempF + '&#8457; <span class="text-smaller">(' + weather48Hrs.tempC + '&#8451;)</span>&nbsp;&nbsp;<span class="label label-info">' + weather48Hrs.condition + '</span>&nbsp;&nbsp;<span class="label label-default">High: ' + weather48Hrs.highTempF + '&#8457; <span class="text-smaller">(' + weather48Hrs.highTempC + '&#8451)</span></span>&nbsp;&nbsp;<span class="label label-success">Low: '  + weather48Hrs.lowTempF + '&#8457; <span class="text-smaller">(' + weather48Hrs.lowTempC + '&#8451;)</span></span><br />Wind Speed: ' + weather48Hrs.windSpeedMPH.toFixed(2) + ' mph <span class="text-smaller">(' + weather48Hrs.windSpeed.toFixed(2) + ' km/h)</span></span>&nbsp;&nbsp;Direction: ' + weather48Hrs.windDir.toFixed(0) + '&deg;</p>');



			weatherInfo.append('<div class="clearfix">');

			$('#locationInfo').append(weatherInfo);
		});
	
		//this AJAX call makes a Flickr photo from the location into the backgorund of the jumbotron. It also increases the jumbotrom height to show more of the picture.

		var photoQueryURL ='https://api.flickr.com/services/rest/?&method=flickr.photos.search&lat=' + latitude + '&lon=' + longitude +'&tags=landscape&accuracy=11&extras=url_c&has_geo=1&per_page=5&format=json&nojsoncallback=1&api_key=883c01db966eed32014011db7cb741de';

		$.ajax({url: photoQueryURL, method: 'GET'})
			.done(function(response) {
			//generates random photo from the top 4 geolocated photos 
			var rand= Math.floor(Math.random() * (4 - 0)) + 0;
			var photo = response.photos.photo[rand].url_c;
			console.log('------Flickr Photos!');
			// console.log(response);
			console.log(photo);
			$('.jumbotron').css({'background-image': 'url('+photo+')'});

			
		}); 
			//this api generate Location sensitive news 
			  var allInfo='http://api.nytimes.com/svc/search/v2/articlesearch.json?callback=svc_search_v2_articlesearch&fq='+query3+'&api-key=fea2e65bcce7e69cb921100d950ff299%3A0%3A74812644';
   $.ajax({url: allInfo, method: 'GET'})
            .done(function(respons) {
               console.log(respons);
               console.log(respons.response.docs[1].headline.main)
               console.log(respons.response.docs[1].snippet) //url
               console.log(respons.response.docs[1].web_url);

               var title=respons.response.docs[1].headline;
               var snippet=respons.response.docs[1].snippet;
               var url=respons.response.docs[1].web_url;
                var newLink="www.getyourinfo.com";
			

				// 	var title1=response.results[0].article_list.results[1].title;
				// 	var title2=response.results[0].article_list.results[2].title;
				// 	var title3=response.results[0].article_list.results[3].title;
				// 	var title4=response.results[0].article_list.results[4].title;
				// 	var title5=response.results[0].article_list.results[5].title;
				// 	var title6=response.results[0].article_list.results[6].title;
				// 	var title7=response.results[0].article_list.results[7].title;
				// 	var title8=response.results[0].article_list.results[8].title;
				// 	var title9=response.results[0].article_list.results[9].title;
					
				// 	//links
				// 	var a=newLink.link(response.results[0].article_list.results[1].url)
				// 	var b=newLink.link(response.results[0].article_list.results[2].url)
				// 	var c=newLink.link(response.results[0].article_list.results[3].url)
				// 	var d=newLink.link(response.results[0].article_list.results[4].url)
				// 	var e=newLink.link(response.results[0].article_list.results[5].url)
				// 	var f=newLink.link(response.results[0].article_list.results[6].url)
				// 	var g=newLink.link(response.results[0].article_list.results[7].url)
				// 	var h=newLink.link(response.results[0].article_list.results[8].url)
				// 	var i=newLink.link(response.results[0].article_list.results[9].url)
					
				// 	//console.log($('#newsDisplay').append('<p>3: ' +title+'</p>'));
				$('#newsDisplay').empty();
				 	
			
				   $('#newsDisplay').append('<p>1: ' +title+'</p>'+ snippet+ '<p>'+url);
				//   $('#newsDisplay').append('<p>2: ' +title2+'</p>'+b);
				//   $('#newsDisplay').append('<p>3: ' +title3+'</p>'+c);
				//   $('#newsDisplay').append('<p>4: ' +title4+'</p>'+d);
				//   $('#newsDisplay').append('<p>5: ' +title5+'</p>'+e);
				//   $('#newsDisplay').append('<p>6: ' +title6+'</p>'+f);
				//   $('#newsDisplay').append('<p>7: ' +title7+'</p>'+g);
				//   $('#newsDisplay').append('<p>8: ' +title8+'</p>'+h);
				//   $('#newsDisplay').append('<p>9: ' +title9+'</p>'+i);
				 	

		}); 
			
		}); 

		
	};



	//on click, search and make AJAX ca;;s.
	$('#submit').on('click',function(){
		var query = $('#search').val().trim();
		//pushes all searches to Firebase
		fireLink.push({destination: query});
		geocoder(query);
		//default background photo (if not photo available)
		$('.jumbotron').css({'background-image': 'url(images/mapBG01.jpg)'});

		$('#search').val('');

		return false;
	});

	$(window).keyup(function(e) { 
	  if(e.keyCode == 13){
	  	var query = $('#search').val().trim();

	    geocoder(query);
	    $('.jumbotron').css({'background-image': 'url(images/mapBG01.jpg)'});
			$('#search').val('');

			return false;
		};
	  });
	//everytime a var is added to firebase a button is created
	fireLink.on("child_added", function(childSnapshot, prevChildKey){
				var dest = childSnapshot.val().destination;
				a = $('<button>')
		    	a.addClass('destButtons');
		    	a.attr('id', dest);
		    	a.text(dest);
		    	$('.buttonDiv').append(a);
		    	console.log(a);
		    	console.log(dest);
		 //when sidebar button is clicked, geocoder runs 
		$('.destButtons').off().click(function(){
			var queryOne=(this).id;
			console.log("This is a new query" +queryOne);
			geocoder(queryOne);
			});
			
		});	
			
	});



