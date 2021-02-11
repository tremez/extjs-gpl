Ext.define('KitchenSink.view.charts.pie.DonutController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.pie-donut',

    onDataRender: function(value) {
        return value + '%';
    },

    onSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('os') + ': ' + record.get('data1') + '%');
    },

    onResize: function(view, width, height) {
        var chart = this.lookup('chart'),
            legend = chart.getLegend();

        if (width > height) {
            legend.setDocked('right');
        }
        else {
            legend.setDocked('top');
        }
    }

});
