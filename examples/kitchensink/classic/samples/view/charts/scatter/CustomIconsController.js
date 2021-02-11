Ext.define('KitchenSink.view.charts.scatter.CustomIconsController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.scatter-custom-icons',

    onAfterRender: function() {
        this.onRefresh();
    }
});
