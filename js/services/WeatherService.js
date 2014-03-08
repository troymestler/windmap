angular.module("Map").factory("WeatherService", function () {
    var service = {};

    service.retrieve = function (lat, lng) {
        var deferred = Q.defer();
//        http://api.wunderground.com/api/5750fd860994d1b0/conditions/q/37.776289,-122.395234.json
        $.ajax({
            url: "http://api.wunderground.com/api/5750fd860994d1b0/conditions/q/" + lat + "," + lng + ".json",
            dataType: "jsonp",
            success: function (parsed_json) {
                deferred.resolve(parsed_json.current_observation);
            }
        });

        return deferred.promise;
    };

    return service;
});