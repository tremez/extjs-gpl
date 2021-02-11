Ext.define('KitchenSink.view.chart.pie.DoubleDonutController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.pie-double-donut',

    init: function(view) {
        var dataMap = {},
            dataList = [],
            chart, series, outerSeries, store, rec;

        this.callParent([view]);

        chart = this.lookup('chart');
        series = chart.getSeries();
        outerSeries = series[0];
        store = outerSeries.getStore();

        store.each(function() {
            var type = this.get('type'),
                value = dataMap[type];

            if (!value) {
                dataMap[type] = value = {
                    type: type,
                    usage: 0
                };
            }

            value.usage += this.get('usage');
        });

        for (rec in dataMap) {
            dataList.push(dataMap[rec]);
        }

        chart.setSeries([{
            type: 'pie',
            angleField: 'usage',
            label: {
                field: 'type',
                display: 'inside'
            },
            store: {
                data: dataList
            },
            radiusFactor: 70,
            donut: 20,
            tooltip: {
                trackMouse: true,
                renderer: 'onInnerSeriesTooltipRender'
            }
        }, outerSeries]);
    },

    onDataRender: function(value) {
        return value + '%';
    },

    onOuterSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('provider') + ': ' + record.get('usage'));
    },

    onInnerSeriesTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(Ext.String.capitalize(record.get('type')) +
            ' sector: ' + record.get('usage'));
    }

});
