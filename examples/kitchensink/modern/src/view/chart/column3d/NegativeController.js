Ext.define('KitchenSink.view.chart.column3d.NegativeController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.column-negative-3d',

    onSeriesRender: function(sprite, config, data, index) {
        var isNegative = data.store.getAt(index).get('gaming') < 0;

        if (isNegative) {
            return {
                fillStyle: '#974144' // dark red
            };
        }
    }
});
