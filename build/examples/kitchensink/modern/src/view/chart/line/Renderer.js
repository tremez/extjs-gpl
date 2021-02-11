/**
 * Demonstrates how to use Ext.chart.series.Line with a renderer function
 */
Ext.define('KitchenSink.view.chart.line.Renderer', {
    extend: 'Ext.Container',
    xtype: 'line-renderer',
    controller: 'line-renderer',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/line/RendererController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pie.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            padding: 8,
            refreshText: 'Refresh',
            shadow: true,
            tbarPadding: '5 8'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                padding: undefined,
                refreshText: undefined,
                shadow: undefined,
                tbarPadding: '12 8'
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the chart's shadow
    shadow: false,
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'cartesian',
        shadow: '${shadow}',
        reference: 'chart',
        store: {
            type: 'pie',
            numRecords: 10
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['g1'],
            minimum: 0
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'name'
        }],
        series: [{
            type: 'line',
            xField: 'name',
            yField: 'g1',
            smooth: true,
            style: {
                strokeStyle: 'powderblue',
                fillStyle: 'aliceblue',
                lineWidth: 4
            },
            marker: {
                type: 'circle',
                radius: 10,
                lineWidth: 2
            },
            renderer: 'onSeriesRender'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: '${refreshText}',
            iconCls: 'x-fa fa-sync',
            handler: 'onRefresh'
        }]
    }]
});
