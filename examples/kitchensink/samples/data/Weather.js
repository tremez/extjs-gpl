// Simulate a weather API JSONP Ajax request so demos
// will work offline, and not dependent on a 3rd party API.
Ext.define('KitchenSink.data.Weather', {
    requires: [
        'KitchenSink.data.Init'
    ]
}, function() {
    Ext.ux.ajax.SimManager.register({
        'weather.php': Ext.create('Ext.ux.ajax.JsonSimlet', {
            // rawData simulates the JSON data returned from
            // an actual weather API
            rawData: {
                "coord":
                    {
                        "lon": 22.97,
                        "lat": 58.56
                    },
                "weather": [
                    {
                        "id": 800,
                        "main": "Clear",
                        "description": "clear sky",
                        "icon": "01d"
                    }
                ],
                "base": "stations",
                "main": {
                    // temperatures are in kelvin!
                    "temp": 288.15,
                    "pressure": 1016,
                    "humidity": 51,
                    "temp_min": 280.15,
                    "temp_max": 288.15
                },
                "wind": {
                    "speed": 5.1,
                    "deg": 330
                },
                "clouds": {
                    "all": 0
                },
                "dt": new Date(),
                "sys": {
                    "type": 1,
                    "id": 5012,
                    "message": 0.0036,
                    "country": "EE",
                    "sunrise": 1499304699,
                    "sunset": 1499369611
                },
                "id": 7522364,
                "name": "Orissaare vald",
                "cod": 200
            },
            doGet: function(ctx) {
                var data = Ext.apply({}, this.rawData),
                    to = data.main.temp_max,
                    from = data.main.temp_min;

                // If you want to simulate more random or ctx param specific responses,
                // modify the data object.
                data.main.temp = Math.floor(Math.random() * (to - from + 1) + from);

                return {
                    responseText: JSON.stringify(data)
                };
            }
        })
    });
});

