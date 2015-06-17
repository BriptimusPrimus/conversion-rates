angular.module("customFilters", [])
    .filter("capitalize", function() {
        return function(input) {
        	if (angular.isString(input)) {
	            input = input.toLowerCase();
	            return input.substring(0,1).toUpperCase()+input.substring(1);        		
        	}
        	else{
        		return input;
        	}
        }
    }); 