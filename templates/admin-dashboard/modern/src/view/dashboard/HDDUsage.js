Ext.define('Admin.view.dashboard.HDDUsage', {
    extend: 'Ext.Panel',
    xtype: 'hddusage',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Area',
        'Ext.chart.interactions.PanZoom'
    ],

    cls: 'quick-graph-panel',
    height: 130,
    layout: 'fit',
    title: 'HDD Usage',
    ui: 'light',

    header: {
        docked: 'bottom'
    },

    platformConfig: {
        '!phone': {
            iconCls: 'x-fa fa-database'
        }
    },

    items: [{
        xtype: 'cartesian',
        animation : Ext.os.is.Desktop,
        background: '#70bf73',
        bind: '{hddusage}',
        colors: [
            '#a9d9ab'
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
            type: 'area',
            useDarkerStrokeColor: false,
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
