//Core Currency Converion Module

//constants
var _publicApi = null,
	_localStorage = null,
	_storageMock = false;
	_publicApiMock = false;
	_defaultCurrencySymbol = "$",
	_defaultBaseCurrencyCode = "USD",
	_defaultBaseRate = 1,
	_defaultRatesMap = {
		"USD" : { 
			currencyCode : "USD",
			symbol : "$",
			rate : "1"
		},
		"EUR" : { 
			currencyCode : "EUR",
			symbol : "\u20AC", // €
			rate : "0.5"
		},
		"CAD" : { 
			currencyCode : "CAD",
			symbol : "$",
			rate : "2"
		},
		"CNY" : { 
			currencyCode : "CNY",
			symbol : "\u5143", //"元"
			rate : "6.05"
		},
		"INR" : { 
			currencyCode : "CNY",
			symbol : "\u20B9", //"₹"
			rate : "61.62"
		},	
		"MXN" : { 
			currencyCode : "MXN",
			symbol : "$",
			rate : "10"
		},					
	},
	_defaultStorage = "custom",
	_cahedSymbols = null;

//configurable variables
var _sourceStorage = "custom", // "localStorage"/"public"/"custom"
	_ratesMap = {}; // will be used when _sourceStorage is "custom" or "default"

//Factory which loads external modules
var _factory = require('./currencyStorageFactory.js');	


function loadDependencies(){
	_localStorage = _factory.loadStorageModule(_storageMock);
	_publicApi = _factory.loadProxyModule(_publicApiMock);	
}

function defaultValues(){
	// custom means use local ratesMap object for currency conversion
	_sourceStorage = _defaultStorage; 
	_ratesMap = _defaultRatesMap;
	_storageMock = false;
	_publicApiMock = false;	
}

/* config = {
// 	source : "localStorage"/"public"/"custom"/"default",
//	mock: true/false
// 	customRates : {
// 		"USD" : { 
// 			currencyCode : "USD",
// 			symbol : "$",
// 			rate : "1"
// 		},
// 		"CAD" : { 
// 			currencyCode : "CAD",
// 			symbol : "$", 
// 			rate : "1.1"
// 		}		
// 	}
// }*/
function init(config){

	if (!config){
		defaultValues();
		return;
	}
		
	_sourceStorage = config.source || _sourceStorage;

	if (_sourceStorage === "custom"){
		_ratesMap = config.customRates || _defaultRatesMap;	
	}
	else if (_sourceStorage === "default"){
		_sourceStorage = _defaultStorage;
		_ratesMap = _defaultRatesMap;
	}

	if (!_ratesMap[_defaultBaseCurrencyCode]){
		_ratesMap[_defaultBaseCurrencyCode] = {
			currencyCode : _defaultBaseCurrencyCode,
			symbol : _defaultCurrencySymbol,
			rate : _defaultBaseRate			
		}	
	}

	if (config.mock){
		_storageMock = true;
		_publicApiMock = true;		
	}
	else {
		_storageMock = false;
		_publicApiMock = false;		
	}

	loadDependencies();
}

function getRatesFromLocalStorage(callback){
	if (!_localStorage){
		_localStorage = _factory.loadStorageModule(_storageMock);
	}
	_localStorage.getMap(function(err, result){
		if(err)
			return callback(err);

		callback(null, result);
	});
}

function getRatesFromPublicApi(convertFrom, convertTo, callback){
    if (!_publicApi){
		_publicApi = _factory.loadProxyModule(_publicApiMock);    	
    }
    //this is needed because reading from the public API
    // results in updating parts of the local storage
	if (!_localStorage){
		_localStorage = _factory.loadStorageModule(_storageMock);
	}    

	_publicApi.getMap(convertFrom, convertTo, function(err, map){
		if(err)
			return callback(err);

		_localStorage.updateRates(map);
		callback(null, map);
	});
}

//must return a currencyRatesMap, acording to current configuration
function resolveSource(convertFrom, convertTo, callback){
	// resolve acording to _sourceStorage
	switch(_sourceStorage){
		case "localStorage":
			getRatesFromLocalStorage(callback);
			break;
		case "public":
			getRatesFromPublicApi(convertFrom, convertTo, callback);
			break;
		case "custom":
			callback(_ratesMap);
			break;
		default:
			callback(_defaultRatesMap);
	}
}

function computeConversionRate(convertFrom, convertTo, callback){ 
	resolveSource(convertFrom, convertTo, function(err, map){
		if(err)
			return callback(err);

		var a = map[convertFrom] 
			|| map[_defaultBaseCurrencyCode] 
			|| {rate : _defaultBaseRate};
		
		var b = map[convertTo] 
			|| map[_defaultBaseCurrencyCode]
			|| {rate : _defaultBaseRate};

		var result = (1/a.rate) * b.rate;
		
		//round to two decimals
		result = Math.round(result * 100) / 100;
		callback(null, result);
	}); 	
}

function convertCurrency(amount, convertFrom, convertTo, callback){
	if(!amount)
		return callback(null, 0);

	//get the conversion rate in order to convert
	computeConversionRate(convertFrom, convertTo, function(err, rate){
		if(err)
			return callback(err);

		var converted = amount * rate;
		
		//round to two decimals
		converted = Math.round(converted * 100) / 100;

		//get the symbols
		getSymbols(function(err, symbols){
			var result = {
				convertedValue: converted,
				currencyCode: convertFrom,
				symbol: symbols[convertFrom] || _defaultCurrencySymbol
			};
			callback(null, result);
		});		
	});
}

function getSymbols(callback){
	//symbols are only in the file (no public api)

	if(_cahedSymbols){
		return callback(null, _cahedSymbols);
	}

	getRatesFromLocalStorage(function(err, map){
		if(err)
			return callback(err);

		var result = {};
		for(code in map){
			result[code] = map[code]["symbol"] || _defaultCurrencySymbol;
		}
		_cahedSymbols = result;
		callback(null, result);
	});
}

//API of Module 
module.exports = {
	setConfiguration: init,	
	getConversionRate: computeConversionRate,
	convertFromAtoB: convertCurrency,
	getCurrencySymbols: getSymbols
};