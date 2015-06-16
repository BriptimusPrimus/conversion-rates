angular.module("currencyConversionRates")
    .constant("dataUrl", "transactions.json")
    .constant("symbolsUrl", "/symbols")
	.controller("trasactionHistoryCtrl", function($scope, $http, dataUrl, symbolsUrl){

        $scope.data = {};

        //assuming this data is provided the server the 
        //amounts are already rounded to two decimal points
        $http.get(dataUrl)
            .success(function (data) {
                $scope.data.transactions = data;
            })
            .error(function (error) {
                $scope.data.error = error || { status : 404 };                 
            });

        var symbolsMap = {};
        $http.get(symbolsUrl)
            .success(function(data){ 
                symbolsMap = data;
            })
            .error(function(error){
                console.log("no symbols map on the server side, using defaults");
                symbolsMap = {
                    "USD" : "$",
                    "EUR" : "\u20AC", 
                    "CAD" : "$",
                    "CNY" : "\u5143",
                    "INR" : "\u20B9" 
                };
            });           


        $scope.currencySymbol = function (code) {
        	var result = "$" //default value
        	result = symbolsMap[code] || result;
        	return result;
        }		

	});