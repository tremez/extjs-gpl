/**
 * Demonstrates how to make a buble chart using Ext.chart.series.Scatter.
 *
 * This example also uses the panzoom and itemhighlight interactions.
 */
Ext.define('KitchenSink.view.chart.scatter.Bubble', {
    extend: 'Ext.Container',
    xtype: 'scatter-bubble',
    controller: 'scatter-bubble',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/ChartController.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
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
        insetPadding: '${insetPadding}',
        store: {
            fields: ['id', 'g1', 'g2', 'g3', 'g4', 'g5']
        },
        interactions: ['itemhighlight'],
        series: [{
            type: 'scatter',
            xField: 'id',
            yField: 'g2',
            highlight: {
                scale: 1.5,
                lineWidth: 4,
                fill: 'gold',
                fillOpacity: 1
            },
            marker: {
                type: 'circle',
                radius: 5,
                stroke: 'gray',
                lineWidth: 2,
                animation: {
                    duration: 200
                }
            },
            style: {
                renderer: 'seriesStyleRenderer'
            }
        }],
        axes: [{
            type: 'numeric',
            position: 'left',
            minimum: 0,
            style: {
                estStepSize: 20
            },
            label: {
                rotate: {
                    degrees: -30
                }
            }
        }, {
            type: 'numeric',
            position: 'bottom'
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
