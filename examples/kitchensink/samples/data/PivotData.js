Ext.define('KitchenSink.data.PivotData', {
    requires: [
        'KitchenSink.data.Init',
        'Ext.ux.ajax.PivotSimlet'
    ],

    statics: {
        rand: 37,
        companies: ['Google', 'Apple', 'Dell', 'Microsoft', 'Adobe'],
        countries: ['Belgium', 'Netherlands', 'United Kingdom',
                    'Canada', 'United States', 'Australia'],
        persons: ['John', 'Michael', 'Mary', 'Anne', 'Robert', 'Müller'],

        getRandomItem: function(data) {
            var rand = this.rand,
                k = rand % data.length;

            rand = rand * 1664525 + 1013904223;
            rand &= 0x7FFFFFFF;
            this.rand = rand;

            return data[k];
        },

        getRandomDate: function(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        },

        getRandomNumber: function(multiply) {
            return Math.random() * (multiply || 1000) + 1;
        },

        getRandomCompany: function() {
            return this.getRandomItem(this.companies);
        },

        getRandomCountry: function() {
            return this.getRandomItem(this.countries);
        },

        getRandomPerson: function() {
            return this.getRandomItem(this.persons);
        },

        getData: function(items) {
            var data = [],
                i;

            if (items == null) {
                items = 500;
            }

            for (i = 0; i < items; i++) {
                data.push({
                    company: this.getRandomCompany(),
                    country: this.getRandomCountry(),
                    person: this.getRandomPerson(),
                    date: this.getRandomDate(new Date(2012, 0, 1), new Date(2016, 11, 31)),
                    value: this.getRandomNumber(),
                    quantity: Math.floor(this.getRandomNumber(30))
                });
            }

            return data;
        }
    }
}, function(Pivot) {
    var data = Pivot.getData();

    Ext.ux.ajax.SimManager.init({
        defaultSimlet: null
    });

    Ext.ux.ajax.SimManager.register({
        '/KitchenSink/SalesData': {
            type: 'json',
            data: data
        }
    });
    Ext.ux.ajax.SimManager.register({
        '/KitchenSink/RemoteSalesData': {
            type: 'pivot',
            data: data
        }
    });

});
