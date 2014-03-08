angular.module("Map", ["leaflet-directive"]);

angular.module("Map").controller("MapCtlr", function ($scope, $window, leafletEvents, WeatherService, leafletData) {

    var map;

    var featureGroup = L.featureGroup();

    leafletData.getMap().then(function (m) {
        map = m;
        featureGroup.addTo(map);
        $window.map = map;
    });

    $window.WeatherService = WeatherService;



    $scope.defaults = {
        maxZoom: 12,
        minZoom: 12
    };

    $scope.center = {
        lat: 37.74900069437069,
        lng: -122.44262695312501,
        zoom: 12
    };

    $scope.$on("leafletDirectiveMap.dblclick", function (event, args) {
        var lat = args.leafletEvent.latlng.lat;
        var lng = args.leafletEvent.latlng.lng;

        console.log("Double clicked", lat, lng);

        WeatherService.retrieve(lat, lng).then(function (json) {

            var windSpeed = json.wind_kph;
            var windDirection = json.wind_degrees;

            console.log("Wind " + windSpeed + " kph @ " + windDirection + " deg");

            var R = 0.01;
            var dlat = R*Math.sin(windDirection * Math.PI/180);
            var dlng = R*Math.cos(windDirection * Math.PI/180);

            var P1 = [lat, lng];
            var P2 = [lat + dlat, lng + dlng];

            var line_points = [
                P1,
                P2
            ];

            var circle_options = {
                  color: '#000',
                  opacity: 1,
                  weight: 8,
                  fillColor: '#000',
                  fillOpacity: 0.6
              };

            var circle = L.circle(P2, 20, circle_options).addTo(featureGroup);

            var polyline_options = {
                color: '#000',
                weight: 5
            };

            var polyline = L.polyline(line_points, polyline_options).addTo(featureGroup);

            var drawControl = new L.Control.Draw({
                edit: {
                  featureGroup: featureGroup
                }
              }).addTo(map);


            map.on('draw:created', function(e) {
//                featureGroup.addLayer(e.layer);
            });
        });
    });

});