Ext.define('KitchenSink.view.chart.line.SplineController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-spline',

    onAxisLabelRender: function(axis, label, layoutContext) {
        return Ext.util.Format.number(label, '0.00');
    }

});
