Ext.define('KitchenSink.view.chart.combination.ParetoController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.combination-pareto',

    onAxisLabelRender: function(axis, label, layoutContext) {
        var total = axis.getRange()[1];

        return (label / total * 100).toFixed(0) + '%';
    },

    onBarSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('complaint') + ': ' +
            record.get('count') + ' responses.');
    },

    onLineSeriesTooltipRender: function(tooltip, record, item) {
        var store = record.store,
            i,
            complaints = [];

        for (i = 0; i <= item.index; i++) {
            complaints.push(store.getAt(i).get('complaint'));
        }

        tooltip.setHtml('<div style="text-align: center; font-weight: bold">' +
            record.get('cumpercent') + '%</div>' + complaints.join('<br>'));
    },

    onPercentRender: function(value) {
        return value + '%';
    },

    onDownload: function() {
        var chart = this.lookup('chart');

        if (Ext.is.Desktop) {
            chart.download({
                filename: 'Pareto Chart'
            });
        }
        else {
            chart.preview();
        }
    }
});
