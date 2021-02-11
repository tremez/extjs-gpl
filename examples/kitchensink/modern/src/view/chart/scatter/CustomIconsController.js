Ext.define('KitchenSink.view.chart.scatter.CustomIconsController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.scatter-custom-icons',

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore();

        store.refreshData();
    }

});
