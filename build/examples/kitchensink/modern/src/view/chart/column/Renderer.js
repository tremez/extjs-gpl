/**
 * Demonstrates how to use Ext.chart.ColumnChart with a renderer function
 */
Ext.define('KitchenSink.view.chart.column.Renderer', {
    extend: 'Ext.Container',
    xtype: 'column-renderer',
    controller: 'column-renderer',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric',
        'Ext.draw.modifier.Highlight',
        'Ext.chart.axis.Time',
        'Ext.chart.interactions.ItemHighlight'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column/RendererController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pie.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: '0 10',
            insetPadding: '20 10',
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
                innerPadding: '0 10',
                insetPadding: '20 10',
                padding: undefined,
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
        innerPadding: '${innerPadding}',
        insetPadding: '${insetPadding}',
        store: {
            type: 'pie',
            numRecords: 10
        },
        series: [{
            type: 'bar',
            xField: 'name',
            yField: 'g1',
            renderer: 'seriesG1Renderer',
            style: {
                lineWidth: 2,
                maxBarWidth: 30,
                stroke: 'dodgerblue',
                fill: 'palegreen',
                opacity: 0.6
            }
        }, {
            type: 'bar',
            xField: 'name',
            yField: ['g2'],
            renderer: 'seriesG2Renderer',
            style: {
                lineWidth: 2,
                maxBarWidth: 12,
                stroke: 'tomato',
                fill: 'lightyellow',
                radius: 20
            }
        }],
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['g1', 'g2'],
            minimum: 0
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'name'
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
