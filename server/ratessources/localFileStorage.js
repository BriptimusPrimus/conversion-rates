// implements the interface:
// IStorage:
// 	function getMap()
// 	function updateRates(updates)

var _path = "rates.txt";
var fs = require('fs');

function parseArrayToRatesMap(arr){
	var result = {};
	var code, sym, val;
	for(k in arr){
		code = arr[k].slice(0,3); 
		sym = arr[k].slice(4,5); 
		rate = arr[k].slice(6); 
		result[code] = { 
			currencyCode : code,
			symbol : sym,
			rate : val			
		}
	}
	return result;	
}

function readFileContent(callback) {
    fs.readFile(_path, "utf-8", function (err, content) {
        if (err) 
        	return callback(err);
        callback(null, content);
    });
}

function readConversionRates(){
	// TODO
	readFileContent(function(err, content){
		if(err){
			console.log("Error trying to read file "+err.message);
			throw err; 
		}
		var arr = content.split('\n');
		return parseArrayToRatesMap(arr);
	});
}

function updateConversionRates(updates){
	//TODO
}

module.exports = {
	getMap: readConversionRates,	
	updateRates: updateConversionRates
};