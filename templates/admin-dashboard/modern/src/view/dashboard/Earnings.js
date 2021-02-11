Ext.define('Admin.view.dashboard.Earnings', {
    extend: 'Ext.Panel',
    xtype: 'earnings',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Ext.chart.interactions.PanZoom'
    ],

    cls: 'quick-graph-panel',
    height: 130,
    layout: 'fit',
    title: 'Earnings',
    ui: 'light',

    header: {
        docked: 'bottom'
    },

    platformConfig: {
        '!phone': {
            iconCls: 'x-fa fa-dollar-sign'
        }
    },

    items: [{
        xtype: 'cartesian',
        animation : Ext.os.is.Desktop,
        background: '#35baf6',
        bind: '{earnings}',
        colors: [
            '#483D8B',
            '#94ae0a',
            '#a61120',
            '#ff8809',
            '#ffd13e',
            '#a61187',
            '#24ad9a',
            '#7c7474',
            '#a66111'
        ],
        axes: [{
            type: 'category',
            fields: 'xvalue',
            hidden: true,
            position: 'bottom'
        }, {
            type: 'numeric',
            fields: 'yvalue',
            hidden: true,
            position: 'left'
        }],
        series: [{
            type: 'line',
            xField: 'xvalue',
            yField: 'yvalue',
            style: {
                stroke: '#FFFFFF'
            }
        }],
        interactions: Ext.supports.Touch ? [{
            type: 'panzoom'
        }] : null
    }]
});
