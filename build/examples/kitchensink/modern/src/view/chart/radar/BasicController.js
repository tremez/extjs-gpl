Ext.define('KitchenSink.view.chart.radar.BasicController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.radar-basic',

    onDataRender: function(value) {
        return value + '%';
    },

    onAxisLabelRender: function(axis, label, layoutContext) {
        // Custom renderer overrides the native axis label renderer.
        // Since we don't want to do anything fancy with the value
        // ourselves except appending a '%' sign, but at the same time
        // don't want to loose the formatting done by the native renderer,
        // we let the native renderer process the value first.
        return layoutContext.renderer(label) + '%';
    },

    onMultiAxisLabelRender: function(axis, label, layoutContext) {
        return label === 'Jan' ? '' : label;
    },

    onSeriesLabelRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('month') + ': ' + record.get(item.field) + '%');
    },

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore();

        store.refreshData();
    }
});
