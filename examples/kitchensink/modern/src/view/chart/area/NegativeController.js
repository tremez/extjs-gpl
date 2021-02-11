Ext.define('KitchenSink.view.chars.area.NegativeController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.area-negative',

    init: function(view) {
        var me = this,
            chart = me.lookup('chart');

        me.callParent([view]);

        chart.setSeries([
            me.getSeriesConfig('phone', 'Phone Hardware'),
            me.getSeriesConfig('consumer', 'Consumer Licensing'),
            me.getSeriesConfig('gaming', 'Gaming Hardware'),
            me.getSeriesConfig('corporate', 'Corporate and Other')
        ]);
    },

    getSeriesConfig: function(field, title) {
        return {
            type: 'area',
            title: title,
            xField: 'quarter',
            yField: field,
            style: {
                opacity: 0.60
            },
            marker: {
                opacity: 0,
                scaling: 0.01,
                animation: {
                    duration: 200,
                    easing: 'easeOut'
                }
            },
            highlightCfg: {
                opacity: 1,
                scaling: 1.5
            },
            tooltip: {
                trackMouse: true,
                renderer: 'tooltipRenderer'
            }
        };
    },

    tooltipRenderer: function(tooltip, record, item) {
        tooltip.setTitle(item.series.getTitle());

        tooltip.setHtml(record.get('quarter') + ': ' + record.get(item.field));
    }

});
