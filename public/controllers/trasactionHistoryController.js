angular.module("currencyConversionRates")
    .constant("dataUrl", "transactions.json")
    .constant("symbolsUrl", "/symbols")
    .constant("convertUrl", "/paypal/currencyConversion")    
	.controller("trasactionHistoryCtrl", function($scope, $http, dataUrl, symbolsUrl, convertUrl){

        $scope.data = {};
        $scope.data.selectedItem = null;
        var previousCode = null;

        //assuming this data is provided the server the 
        //amounts are already rounded to two decimal points
        $http.get(dataUrl)
            .success(function(data) {
                $scope.data.transactions = data;
            })
            .error(function(error) {
                $scope.data.error = error || { status : 404 };                 
            });

        var symbolsMap = {};
        $scope.data.currencyCodes = [];
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
            })
            .finally(function() {
                for(code in symbolsMap){
                    $scope.data.currencyCodes.push(code);    
                }      
                console.log($scope.data.currencyCodes);
            });


        $scope.currencySymbol = function(code){
        	var result = "$" //default value
        	result = symbolsMap[code] || result;
        	return result;
        }

        $scope.selectItem = function(item){
            $scope.data.selectedItem = item;
            if(item)
                previousCode = item.currencyCode; 
        }

        $scope.convertCurrency = function(){

            var params = { 
                amount: $scope.data.selectedItem.amount,
                convertFrom: previousCode || $scope.data.selectedItem.currencyCode,
                convertTo: $scope.data.selectedItem.currencyCode
            }

            $http.get(convertUrl, {
                params : params
            })
            .success(function (data) {
                $scope.data.error = null;
                $scope.data.selectedItem.amount = data.convertedValue;
                $scope.selectItem(null);                   
            })
            .error(function (error) {
                $scope.data.error = error || { status : 404, message : "Server Not Found" };
                $scope.data.error.selectedId = $scope.data.selectedItem.id;
                $scope.data.selectedItem.currencyCode = previousCode;
                $scope.selectItem(null);
            });

        }

        $scope.showErrorMessage = function(id){            
            return $scope.data.error && 
                $scope.data.error.selectedId === id;   
        }

	});