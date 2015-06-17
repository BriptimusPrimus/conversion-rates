angular.module("currencyConversionRates", ["customFilters", "ngRoute"])
.config(function ($routeProvider) {

    $routeProvider.when("/activity", {
        templateUrl: "views/activity.html"
    });

    $routeProvider.when("/currencyConversion", {
        templateUrl: "views/currencyConversion.html"
    });

    $routeProvider.when("/conversionRate", {
        templateUrl: "views/conversionRate.html"
    });          

    $routeProvider.otherwise({
        templateUrl: "views/activity.html"
    });
});