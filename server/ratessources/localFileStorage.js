// implements the interface:
// IStorage:
// 	function getMap(callback)
// 	function updateRates(updates)

//path relative to server.js
var _path = "./server/ratessources/rates.txt";
var fs = require('fs');

function parseArrayToRatesMap(arr){
	var result = {};
	var code, sym, val;
	for(k in arr){
		if(arr[k].trim()){ //string in index might be empty
			code = arr[k].slice(0,3); // "USD"
			sym = arr[k].slice(4,5); // "$"
			val = arr[k].slice(6); // 1.00
			val = Math.round(parseFloat(val) * 100) / 100;
			result[code] = { 
				currencyCode : code,
				symbol : sym,
				rate : val						
			}
		}
	}
	return result;	
}

function parseRateMapToStr(map){
	var str = "";
	for(code in map){
		//add a line		
		str += code+"="+map[code].symbol+" "+map[code].rate.toFixed(2)+"\n"
	}
	return str;
}

//write to file
function writeContent(content, callback) {
    fs.writeFile(_path, content, function (err) {
        if (err) 
        	return callback(err);
        callback(null);
    })
}

//read from file
function readContent(callback) {
    fs.readFile(_path, "utf-8", function (err, content) {
        if (err) 
        	return callback(err);
        callback(null, content);
    })
}

function readConversionRates(callback){
	readContent(function(err, content){
		if(err){
			console.log("Error reading file "+err.message);
			callback(err);			
		}

		//split lines into an array
		var arr = content.trim().split('\n');
		var result = parseArrayToRatesMap(arr);
		callback(null, result);		
	});	
}

function updateConversionRates(updates){
	readConversionRates(function(err, map){
		//merge map with new fresh data (updates)
		for(code in updates){
			map[code] = map[code] || {};
			map[code].code = code;
			map[code].symbol = updates[code].symbol || map[code].symbol || "$";
			map[code].rate = updates[code].rate;
		}
		//transform map object to string
		var content = parseRateMapToStr(map);

		//write formated string to file
		writeContent(content, function(err){
			if(err){
				console.log(err);
			}
		});
	});	
}

module.exports = {
	getMap: readConversionRates,	
	updateRates: updateConversionRates
};