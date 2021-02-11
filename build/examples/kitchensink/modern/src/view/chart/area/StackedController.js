Ext.define('KitchenSink.view.chart.area.StackedController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.area-stacked',

    onAxisLabelRender: function(axis, label) {
        return label.toFixed(label < 10 ? 1 : 0) + '%';
    },

    onSeriesTooltipRender: function(tooltip, record, item) {
        var fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field),
            browser = item.series.getTitle()[fieldIndex];

        tooltip.setHtml(browser + ' on ' + record.get('month') + ': ' +
            record.get(item.field) + '%');
    },

    onColumnRender: function(v) {
        return v + '%';
    }

});
