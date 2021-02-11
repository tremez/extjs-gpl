Ext.define('KitchenSink.view.data.JSONPController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.jsonp',

    cachedConfig: {
        tpl: '<div class="demo-weather">' +
            '<tpl for=".">' +
                '<div class="day">' +
                    '<div class="date">{date}</div>' +
                    '<tpl for="weatherIconUrl">' +
                        '<img src="{value}">' +
                    '</tpl>' +
                    '<div class="temp">{temperature}&deg;</div>' +
                    '<div class="temp_low">' +
                        '<div>high: {maxTemp}&deg;</div>' +
                        '<div>low: {minTemp}&deg;</div>' +
                    '</div>' +
                '</div>' +
            '</tpl>' +
        '</div>'
    },

    applyTpl: function(tpl) {
        return Ext.XTemplate.get(tpl);
    },

    onLoad: function() {
        this.getView().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        Ext.data.JsonP.request({
            scope: this,
            callback: this.loadCallback,
            url: 'weather.php',
            callbackKey: 'callback',
            params: {
                q: '94301', // Palo Alto
                format: 'json'
            }
        });
    },

    kelvinToFahrenheit: function(k) {
        return Math.round(9 / 5 * (k - 273) + 32);
    },

    loadCallback: function(success, result) {
        var weather = success && result,
            format = this.kelvinToFahrenheit,
            data;

        if (weather) {
            data = {
                weatherIconUrl: {
                    value: 'resources/' + weather.weather[0].icon + '.png'
                },
                temperature: format(weather.main.temp),
                minTemp: format(weather.main.temp_min),
                maxTemp: format(weather.main.temp_max),
                date: new Date(weather.dt).toLocaleDateString()
            };

            this.lookup('results').updateHtml(this.getTpl().applyTemplate(data));

        }
        else {
            Ext.Msg.alert('Error', 'There was an error retrieving the weather.');
        }

        this.getView().unmask();
    }
});
