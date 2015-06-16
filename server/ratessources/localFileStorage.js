// implements the interface:
// IStorage:
// 	function getMap()
// 	function updateRates(updates)

//path relative to server.js
var _path = "./server/ratessources/rates.txt";
var fs = require('fs');

function parseArrayToRatesMap(arr){
	var result = {};
	var code, sym, val;
	for(k in arr){
		code = arr[k].slice(0,3); 
		sym = arr[k].slice(4,5); 
		val = arr[k].slice(6); 
		result[code] = { 
			currencyCode : code,
			symbol : sym,
			rate : val			
		}
	}
	return result;	
}

function parseRateMapToStr(map){
	var str = "";
	for(code in map){
		str += code+"="+map[code].symbol+" "+map[code].toFixed(2)+"\n"
	}
	return str;
}

function writeContent(content, callback) {
    fs.writeFile(_path, content, function (err) {
        if (err) 
        	return callback(err);
        callback(null);
    })
}

function readConversionRates(){
	try {
		var content = fs.readFileSync(_path, "utf-8");
		var arr = content.split('\n');
		return parseArrayToRatesMap(arr);
	} catch (err) {
		if (err.code !== 'ENOENT') 
			throw err;
		console.log("File not found");
		return {};
	}	
}

function updateConversionRates(updates){
	var map = readConversionRates();
	//merge map with new fresh data (updates)	
	for(code in updates){
		map[code].symbol = updates[code].symbol;
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
}

module.exports = {
	getMap: readConversionRates,	
	updateRates: updateConversionRates
};