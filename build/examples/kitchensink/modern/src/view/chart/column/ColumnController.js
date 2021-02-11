Ext.define('KitchenSink.view.chart.column.ColumnController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.column-basic',

    seriesRenderer: function(value) {
        return value.toFixed(1);
    },

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore();

        store.refreshData();
    }
});
