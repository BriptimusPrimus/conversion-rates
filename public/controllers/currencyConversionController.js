angular.module("currencyConversionRates")
	.constant("convertUrl", "/paypal/currencyConversion")
	.controller("currencyConversionCtrl", function($scope, $http, convertUrl){
		
		$scope.model = {"convertedVal" : 0};
		$scope.model.amount = 1;

		$scope.convertCurrency = function(){
			$scope.model.amount = $scope.model.amount;
			$scope.model.convertFrom = $scope.model.convertFrom || "";
			$scope.model.convertTo = $scope.model.convertTo || "";	

        	var params = { 
        		amount: $scope.model.amount,
        		convertFrom: $scope.model.convertFrom,
        		convertTo: $scope.model.convertTo
        	}

	        $http.get(convertUrl, {
	        	params : params
	        })
            .success(function (data) {
                $scope.model.convertedVal = data.convertedValue;
            })
            .error(function (error) {
                $scope.model.error = error || { status : 404 };
                $scope.model.convertedVal = "Unable to find conversion rate";
            });        						

		}
	});