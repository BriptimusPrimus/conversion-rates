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
	_defaultStorage = "custom";

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

function getRatesFromLocalStorage(){
	if (!_localStorage){
		_localStorage = _factory.loadStorageModule(_storageMock);
	}
	return _localStorage.getMap();
}

function getRatesFromPublicApi(){
    if (!_publicApi){
		_publicApi = _factory.loadProxyModule(_publicApiMock);    	
    }
    //this is needed because reading from the public API
    // results in updating parts of the local storage
	if (!_localStorage){
		_localStorage = _factory.loadStorageModule(_storageMock);
	}    

	var map = _publicApi.getMap();
	_localStorage.updateRates(map);

	return map;
}

//must return a currencyRatesMap, acording to current configuration
function resolveSource(){
	// resolve acording to _sourceStorage
	switch(_sourceStorage){
		case "localStorage":
			return getRatesFromLocalStorage();
		case "public":
			return getRatesFromPublicApi();
		case "custom":
			return _ratesMap;
		default:
			return _defaultRatesMap;
	}
}

function computeConversionRate(convertFrom,convertTo){ 
	var map = resolveSource(); 
	
	var a = map[convertFrom] 
		|| map[_defaultBaseCurrencyCode] 
		|| {rate : _defaultBaseRate};
	
	var b = map[convertTo] 
		|| map[_defaultBaseCurrencyCode]
		|| {rate : _defaultBaseRate};

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