var assert = require('assert');
var curConv = require('./server/currencyConversion.js');
var localStorage = require('./server/ratessources/localFileStorage.js');
var publicApi = require('./server/ratessources/PublicApiProxy.js');


function testCurrencyConversion(){
	console.log("Test Currency Conversion Module:");
	console.log(" ");

	// initial setting in custom/mock mode
	curConv.setConfiguration({
	    source :"custom",
	    mock: true,
		customRates: {
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
				rate : "5"
			},
			"INR" : { 
				currencyCode : "INR",
				symbol : "\u20B9", //"₹"
				rate : "50"
			},	
			"MXN" : { 
				currencyCode : "MXN",
				symbol : "$",
				rate : "10"
			},					
		}        
	});	

	function currencySymbols(){
		console.log("Test getCurrencySymbols");
		curConv.getCurrencySymbols(function(err, symbols){
			assert.strictEqual(err, null, "Executes without error");
			assert.equal(symbols["USD"], "$", "American dollar symbol is $");
			assert.equal(symbols["INR"], "\u20B9", "Indian rupee symbol is \u20B9");
			assert.equal(symbols["EUR"], "\u20AC", "Euro symbol is \u20AC");
		    assert.equal(symbols["MXN"], "$", "Mexican peso symbol is $");
		    assert.deepEqual(symbols, { USD: '$', EUR: '€', CAD: '$', CNY: '元', INR: '₹', MXN: '$' }, "symbols key value pair is correct");
		});
		console.log("");		
	}

	function conversionRate(){
		console.log("Test getConversionRate");
		//empty currency code arguments
		curConv.getConversionRate("", "", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result, 1, "Conversion for empty currency codes is 1");
		});
		//unknown currency code arguments
		curConv.getConversionRate("HTML", "REST", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result, 1, "Conversion for unknown currency codes is 1");
		});	
		curConv.getConversionRate("USD", "EUR", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result, 0.5, "Conversion from American dollar to Euro is 0.50");
		});
		curConv.getConversionRate("EUR", "CAD", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result, 4, "Conversion from Euro to Canadian dollar is 4");
		});
		curConv.getConversionRate("MXN", "CAD", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result, 0.2, 
				"Conversion from Mexican peso to Canadian dollar is 0.20");
		});	
		curConv.getConversionRate("USD", "MXN", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result, 10, 
				"Conversion from American dollar to Mexican peso is 10");
		});										
		console.log("");
	}

	function convertCurrency(){
		console.log("Test convertFromAtoB");
		//empty currency code arguments
		curConv.convertFromAtoB(100, "", "", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result.convertedValue, 100, 
				"Converted value for unknown currency codes is same as input");
			assert.strictEqual(result.symbol, "$", 
				"Default symbol for unknown currency codes is $");
			assert.strictEqual(result.currencyCode, "", 
				"Currency code is empty string as currency argument");
		});
		curConv.convertFromAtoB(100, "USD", "INR", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result.convertedValue, 5000, 
				"100 American dollars convert to 5000 Indian rupees");
			assert.strictEqual(result.symbol, "\u20B9", "Indian rupee symbol is \u20B9");
			assert.strictEqual(result.currencyCode, 
				"INR", "Currency code for Indian rupee is INR");
		});
		curConv.convertFromAtoB(100, "MXN", "CNY", function(err, result){
			assert.strictEqual(err, null, "Executes without error");
			assert.strictEqual(result.convertedValue, 50, 
				"100 Mexican pesos convert to 50 Chinese yuan");
			assert.strictEqual(result.symbol, "\u5143", "Chinese yuan symbol is \u5143");
			assert.strictEqual(result.currencyCode, "CNY", 
				"Currency code for Chinese yuan is CNY");
			assert.strictEqual(typeof result.convertedValue == "number", true,
				"Converted values are numeric");
		});		
		console.log("");
	}

	currencySymbols();
	conversionRate();
	convertCurrency();
	console.log("");
}

function testLFileStorage(){
	console.log("Test File Storage Module:");
	console.log(" ");

	function getMap(){
		console.log("Test getMap");
		localStorage.getMap(function(err, map){
			assert.strictEqual(err, null, "Executes without error");
			assert.notEqual(map, null, "Finds currency rates map in local storage");
			assert.notEqual(map, undefined, "Finds currency rates map in local storage");
			assert.notDeepEqual(map, {}, 
				"Rates map found in local storage is not empty object");
		});
		console.log("");
	}

	// updateConversionRates should not be included in the tests 
	// because it changes the state of the application 

	getMap();
	console.log("");
}

// Warning: testing the public API Proxy consumes service requests, limited to a number a month
// function testPublicProxyApi(){
// 	console.log("Test Public Proxy API:");
// 	console.log(" ");

// 	function getMap(){
// 		//empty currency code arguments
// 		publicApi.getMap("", "", function(err, map){
// 			assert.strictEqual(err, null, "Executes without error");
// 			assert.strictEqual(Object.keys(map).length, 1, 
// 				"when currency codes are equal only one rate will be returned");
// 			assert.strictEqual(map[""].currencyCode, "", "Empty currency code");
// 			assert.strictEqual(map[""].rate, 1, "Default currency conversion rate is 1");
// 			assert.strictEqual(typeof map[""].rate == "number", true, 
// 				"Currency rates are numeric");
// 		});
// 		//well known currency codes
// 		publicApi.getMap("USD", "EUR", function(err, map){
// 			assert.strictEqual(err, null, "Executes without error");
// 			assert.strictEqual(Object.keys(map).length, 2, 
// 				"When currency codes are diferent two rates will be returned");
// 			assert.strictEqual(map["USD"].currencyCode, "USD", 
// 				"The first currency code is correct");
// 			assert.strictEqual(map["EUR"].currencyCode, "EUR", 
// 				"The second currency code is correct");			
// 			assert.strictEqual(typeof map["USD"].rate == "number", true, 
// 				"Currency rates are numeric");
// 		});		
// 		console.log("");
// 	}

// 	getMap();
// 	console.log("");	
// }

testCurrencyConversion();
testLFileStorage();
testPublicProxyApi();


