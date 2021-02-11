Ext.define('KitchenSink.view.chart.bar3d.NegativeController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.bar-negative-3d',

    onSeriesRender: function(sprite, config, data, index) {
        var isNegative = data.store.getAt(index).get('gaming') < 0;

        if (isNegative) {
            return {
                fillStyle: '#974144'
            };
        }
    }

});
