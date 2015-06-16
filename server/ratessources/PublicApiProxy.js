//implements the interface:
// IPublicApiProxy:
// 	function getMap(convertFrom, convertTo, callback)

// "https://openexchangerates.org/"
// id = 8acbe931c9834a6d9a983165fe4b61f1
// https://openexchangerates.org/api/latest.json?app_id=8acbe931c9834a6d9a983165fe4b61f1

// NOTE: Better use an external module like request
// https://www.npmjs.com/package/request
var http = require('http');
var host = 'openexchangerates.org',
	path = '/api/latest.json?app_id=8acbe931c9834a6d9a983165fe4b61f1';


function getDataFromService(currency1, currency2, callback){

	console.log("request to: "+host+path);
    return http.get({
        host: host,
        path: path
    }, function(response) {
        // Continuously update stream with data
        var buf = '';
        response.on('data', function(d) {
            buf += d;
        });
        response.on('end', function() {
            // Data reception is done
            var parsed = JSON.parse(buf);
            var rates = parsed.rates;            
			var rate1 = rates[currency1] || "1",
				rate2 = rates[currency2] || "1";

			//convert to number and round
			rate1 = Math.round(parseFloat(rate1) * 100) / 100;
			rate2 = Math.round(parseFloat(rate2) * 100) / 100;

			var result = {};
			result[currency1] = {
				currencyCode : currency1,
				rate : rate1
			}
			result[currency2] = {
				currencyCode : currency2,
				rate : rate2
			}			

            callback(null, result);
        });
    });
}

function getConversionRates(currency1, currency2, callback){
	// TODO
	getDataFromService(currency1, currency2, function(err, result){
		if(err){
			console.log("Error sending GET request to public API");
			console.log(err.message);
			return callback(err);
		}

		callback(null, result);
	})
}

module.exports = {
	getMap: getConversionRates
};