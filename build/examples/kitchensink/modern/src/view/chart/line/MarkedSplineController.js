Ext.define('KitchenSink.view.chart.bar.MarkedSplineController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-marked-spline',

    onAxisLabelRender: function(axis, label, layoutContext) {
        return Ext.util.Format.number(label, '0.0');
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
