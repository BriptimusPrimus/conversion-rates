// implements the interface:
// IStorage:
// 	function getMap(callback)
// 	function updateRates(updates)

var ratesMap = {
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
	}

function staticRatesMap(callback){
	callback(null, ratesMap);
}

function mockUpdate(updates){
	console.log(updates);
}

module.exports = {
	getMap: staticRatesMap,	
	updateRates: mockUpdate
};