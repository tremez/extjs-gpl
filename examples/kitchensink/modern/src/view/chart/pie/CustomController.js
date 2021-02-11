Ext.define('KitchenSink.view.charts.pie.CustomController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.pie-custom',

    onDataRender: function(value) {
        return value + '%';
    },

    onSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('os') + ': ' + record.get('data1') + '%');
    }

});
