// This is a simple script with the purpose of play with
// and test the currencyConversion module functionality

console.log("playing currencyConversion simple tests");

var curConv = require('./currencyConversion.js');
console.log("loaded currencyConversion module");


//use it without configuring
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



var config = {};