

var nyTimes='http://api.nytimes.com/svc/semantic/v2/geocodes/query.json?feature_class=A&nearby='+latitude+'%2C'+longitude+'&api-key=c8dc23a4e2f98d9891f7e3630911c4f3%3A4%3A74812644';
			$.ajax({url: nyTimes, method: 'GET'})
			.done(function(response) {
				//$(this).addClass('active');
			var results=response.results;
			console.log(results.country_name);

			});
		