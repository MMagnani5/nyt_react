// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require('axios');

// Helper Functions (in this case the only one is runQuery)
var helpers = {

	// This function serves our purpose of running the query to search articles. 
	runQuery: function(article){

		console.log(article);

		// NYT API
		var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		nytUrl += '?' + $.param({
		  'api-key': "af1815fdf5884c5cb5c5ea9fa52a5e7c",
		  'q': article
		});

		return axios.get(nytUrl)
			.then(function(response){

				console.log(response);
				// will need to look at the response data in order to write out the return below
//====================================================================================================
				return response.data;
		})

	},

	// This function hits our own server to retrieve the record of query results
	getHistory: function(){

		return axios.get('/api/saved')
			.then(function(response){

				console.log(response);
				return response;
			});
	},

	// This function posts new searches to our database.
	postHistory: function(title){

		return axios.post('/api/saved', {title: title})
			.then(function(results){

				console.log("Posted to MongoDB");
				return(results);
			})
	}

}


// We export the helpers function 
module.exports = helpers;