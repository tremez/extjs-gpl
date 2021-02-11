Ext.define('KitchenSink.store.StockPrice', {
    extend: 'Ext.data.Store',
    model: 'KitchenSink.model.StockPrice',
    alias: 'store.stock-price',

    generateData: function(count) {
        var first = {
                time: Ext.Date.now(),
                close: 100
            },
            records = [],
            previous, i;

        for (i = 0; i < count; i++) {
            previous = records[i - 1] || first;
            records.push(Ext.apply({
                time: previous.time + 24 * 60 * 60 * 1000 // day interval
            }, this.getNextPrice(previous.close)));
        }

        return records;
    },

    getNextPrice: function(previousClose) {
        var open = previousClose - 2 + Math.random() * 8,
            high = open + Math.random() * 2,
            close = open - Math.random() * 4,
            low = close - Math.random() * 2,
            min = Math.min(open, high, low, close);

        if (min < 0) {
            open -= min;
            high -= min;
            low -= min;
            close -= min;
        }

        return {
            open: open,
            high: high,
            low: low,
            close: close
        };
    },

    refreshData: function() {
        this.setData(this.generateData(2 * 365));
    },

    constructor: function(config) {

        config = Ext.apply({
            data: this.generateData(2 * 365)
        }, config);

        this.callParent([config]);

    }
});
