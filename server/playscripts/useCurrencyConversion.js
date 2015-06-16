// This is a simple script with the purpose of play with
// and test the currencyConversion module functionality

console.log("playing currencyConversion simple tests");

var curConv = require('../currencyConversion.js');
console.log("loaded currencyConversion module");


function useModuleApi(){
	console.log("get currency symbols: ");
	var symbols = curConv.getCurrencySymbols();
	console.log(symbols);
	console.log(" ");

	console.log("get conversion rates: ");
	console.log("USD -> EUR: ");
	console.log(curConv.getConversionRate("USD","EUR"));
	console.log("EUR -> USD: ");
	console.log(curConv.getConversionRate("EUR","USD"));
	console.log("USD -> MXN: ");
	console.log(curConv.getConversionRate("USD","MXN"));
	console.log("MXN -> USD: ");
	console.log(curConv.getConversionRate("MXN", "USD"));
	console.log("EUR -> MXN: ");
	console.log(curConv.getConversionRate("EUR","MXN"));
	console.log("MXN -> EUR: ");
	console.log(curConv.getConversionRate("MXN", "EUR"));
	console.log(" ");

	console.log("perform converions: ");
	console.log("100 USD -> EUR: ");
	console.log(curConv.convertFromAtoB(100,"USD","EUR"));
	console.log("100 EUR -> USD: ");
	console.log(curConv.convertFromAtoB(100,"EUR","USD"));
	console.log("100 USD -> MXN: ");
	console.log(curConv.convertFromAtoB(100,"USD","MXN"));
	console.log("100 MXN -> USD: ");
	console.log(curConv.convertFromAtoB(100,"MXN","USD"));
	console.log("100 EUR -> MXN: ");
	console.log(curConv.convertFromAtoB(100,"EUR","MXN"));
	console.log("100 MXN -> EUR: ");
	console.log(curConv.convertFromAtoB(100,"MXN","EUR"));	
	console.log(" ");

};

//use it without configuring
useModuleApi();

//add configuration
var config = {
	source : "localStorage",
	mock: false
};
console.log("add configuration ");
console.log(config);
curConv.setConfiguration(config);
useModuleApi();

// //add configuration with custom map
// var config = {
// 	source : "custom",
// 	mock: true,
// 	customRates : {
// 		"USD" : { 
// 			currencyCode : "USD",
// 			symbol : "$",
// 			rate : "1"
// 		},
// 		"EUR" : { 
// 			currencyCode : "EUR",
// 			symbol : "\u20AC", // €
// 			rate : "0.75"
// 		},
// 		"CAD" : { 
// 			currencyCode : "CAD",
// 			symbol : "$",
// 			rate : "1.1"
// 		}
// 	}	
// };
// console.log("add configuration ");
// console.log(config);
// curConv.setConfiguration(config);
// useModuleApi();