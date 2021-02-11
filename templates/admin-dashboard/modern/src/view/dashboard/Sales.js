Ext.define('Admin.view.dashboard.Sales', {
    extend: 'Ext.Panel',
    xtype: 'sales',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar'
    ],

    cls: 'quick-graph-panel',
    height: 130,
    layout: 'fit',
    title: 'Sales',
    ui: 'light',

    header: {
        docked: 'bottom'
    },

    platformConfig: {
        '!phone': {
            iconCls: 'x-fa fa-briefcase'
        }
    },

    items: [{
        xtype: 'cartesian',
        animation : Ext.os.is.Desktop,
        background: '#8561c5',
        bind: '{quarterlyGrowth}',
        colors: [
            '#ffffff'
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
            type: 'bar',
            xField: 'xvalue',
            yField: 'yvalue'
        }],
        interactions: Ext.supports.Touch ? [{
            type: 'panzoom'
        }] : null
    }]
});
