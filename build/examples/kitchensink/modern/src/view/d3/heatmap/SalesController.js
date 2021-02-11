Ext.define('KitchenSink.view.d3.heatmap.SalesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.heatmap-sales',

    onRefreshData: function() {
        var heatmap = this.lookup('heatmap'),
            store = heatmap.getStore();

        store.refreshData();
    },

    onRefreshDataAndSize: function() {
        var heatmap = this.lookup('heatmap'),
            store = heatmap.getStore();

        store.refreshDataAndSize();
    }
});
