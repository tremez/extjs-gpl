Ext.define('KitchenSink.view.chart.gauge.SectorsController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.gauge-sectors',

    init: function(view) {
        this.callParent([view]);
        this.onRefresh();
    },

    seriesRenderer: function(sprite, config, rendererData, index) {
        var chart = rendererData.series.getChart(),
            mainRect = chart.getMainRect(),
            width = mainRect[2],
            height = mainRect[3],
            bigChart = (width >= 250 && height >= 150),
            changes;

        // This renderer function draws the "Temp." label in big white letters,
        // the "Cold" label in blue, and the "Hot" label in red.
        if (config.type === "label") {
            changes = {
                x: config.x + 10,
                y: config.y + 10
            };

            if (index === 3) {
                Ext.apply(changes, {
                    fontSize: (bigChart ? 32 : 16),
                    strokeStyle: 'black'
                });
            }
            else {
                Ext.apply(changes, {
                    fontSize: (bigChart ? 24 : 12)
                });
            }

            switch (index) {
                case 1:
                    Ext.apply(changes, {
                        color: 'blue'
                    });
                    break;
                case 3:
                    Ext.apply(changes, {
                        color: 'white'
                    });
                    break;
                case 5:
                    Ext.apply(changes, {
                        color: 'darkred'
                    });
                    break;
            }

            return changes;
        }
    }
});
