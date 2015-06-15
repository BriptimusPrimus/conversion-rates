angular.module("currencyConversionRates")
	.constant("ratesUrl", "/paypal/conversionRate")
	.controller("conversionRateCtrl", function($scope, $http, ratesUrl){

		$scope.model = {"rate" : 0};

		$scope.getConversionRate = function(){
			$scope.model.convertFrom = $scope.model.convertFrom || "";
			$scope.model.convertTo = $scope.model.convertTo || "";

        	var params = { 
        		convertFrom: $scope.model.convertFrom,
        		convertTo: $scope.model.convertTo
        	}
        	
	        $http.get(ratesUrl, {
	        	params : params
	        })
	            .success(function (data) {
	                $scope.model.rate = data.conversionRate;
	            })
	            .error(function (error) {
	                $scope.model.error = error || { status : 404 };
	                $scope.model.rate = "Unable to find conversion rate";
	            });			
		}

	});