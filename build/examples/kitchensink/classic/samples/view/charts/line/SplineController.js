Ext.define('KitchenSink.view.charts.line.SplineController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.line-spline',

    onAxisLabelRender: function(axis, label, layoutContext) {
        return Ext.util.Format.number(label, '0.00');
    },

    onPreview: function() {
        var chart;

        if (Ext.isIE8) {
            Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');

            return;
        }

        chart = this.lookup('chart');

        chart.preview();
    }

});
