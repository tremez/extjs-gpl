Ext.define('KitchenSink.view.chart.column.MultiAxisController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.column-multi-axis',

    init: function() {
        var chart = this.lookup('chart'),
            highSeries = {
                type: 'bar',
                xField: 'month',
                yField: 'highF',
                yAxis: 'fahrenheit-axis',
                style: {
                    minGapWidth: 10,
                    strokeStyle: 'rgb(52, 52, 53)'
                },
                subStyle: {
                    fillStyle: 'url(#rainbow)'
                }
            },
            lowSeries = Ext.apply({}, {
                yField: ['lowF'],
                subStyle: {
                    fillStyle: 'none'
                }
            }, highSeries);

        chart.setSeries([
            highSeries,
            lowSeries
        ]);
    },

    onAxisRangeChange: function(axis, range) {
        var cAxis = axis.getChart().getAxis('celsius-axis');

        if (cAxis) {
            cAxis.setMinimum((range[0] - 32) / 1.8);
            cAxis.setMaximum((range[1] - 32) / 1.8);
        }
    },

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore();

        store.refreshData();
    }
});
