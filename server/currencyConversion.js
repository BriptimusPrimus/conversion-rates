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
var _sourceStorage = "custom", // "localStorage"/"public"/"custom"
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

function computeConversionRate(convertFrom,convertTo){ 
	var map = resolveSource(); 
	var a = map[convertFrom] || map[_defaultRootRate];
	var b = map[convertTo] || map[_defaultRootRate];
	var result = (1/a.rate) * b.rate;
	
	//round to two decimals
	result = Math.round(result * 100) / 100;
	return result;
}

function convertCurrency(amount,convertFrom,convertTo){
	if(!amount)
		return 0;

	var rate = computeConversionRate(convertFrom,convertTo);
	var result = amount * rate;
	
	//round to two decimals
	result = Math.round(result * 100) / 100;
	return result;	
}

function getSymbols(){
	var result = {},
		map = resolveSource();
	for(code in map){
		result[code] = map[code]["symbol"];
	}

	return result;
}

//API of Module 
module.exports = {
	setConfiguration: init,	
	getConversionRate: computeConversionRate,
	convertFromAtoB: convertCurrency,
	getCurrencySymbols: getSymbols
};