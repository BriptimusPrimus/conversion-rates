//constants
var _publicApi = "https://openexchangerates.org/",
	_localStorage = "rates.txt",
	_defaultCurrencySymbol = "$",
	_defaultRootCurrencyCode = "USD",
	_defaultRootRate = 1,
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
			symbol : "\u5143", //"₹"
			rate : "61.62"
		},	
		"MXN" : { 
			currencyCode : "MXN",
			symbol : "$",
			rate : "10"
		},					
	},
	_defaultStorage = "custom";

//configurable variables
var _sourceStorage = "custom"; // "localStorage"/"public"/"custom"
	_ratesMap; // will be used when _sourceStorage is "custom" or "default"

function defaultValues(){
	// custom means use local ratesMap object for currency conversion
	_sourceStorage = _defaultStorage; 
	_ratesMap = _defaultRatesMap;
}

/* config = {
// 	source : "localStorage"/"public"/"custom"/"default",
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

	if(!_ratesMap[_defaultRootCurrencyCode]){
		_ratesMap[_defaultRootCurrencyCode] = {
			currencyCode : _defaultRootCurrencyCode,
			symbol : _defaultCurrencySymbol,
			rate : _defaultRootRate			
		}	
	}
}

//must return a currencyRatesMap, acording to current configuration
function resolveSource(){
	//TODO

	//mock functionality by returning default for now
	return _defaultRatesMap;
}

function getConversionRate(from,to){
	//TODO
}

function convertCurrency(amount,from,to){
	//TODO
}

function getSymbols(){
	//TODO
}