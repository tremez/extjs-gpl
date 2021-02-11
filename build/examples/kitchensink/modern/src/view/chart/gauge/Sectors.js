/**
 * Demonstrates how to use sectors with Ext.chart.series.Gauge
 */
Ext.define('KitchenSink.view.chart.gauge.Sectors', {
    extend: 'Ext.Container',
    xtype: 'gauge-sectors',
    controller: 'gauge-sectors',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/gauge/GaugeController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pie.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: 10,
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
                innerPadding: 10,
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
        xtype: 'polar',
        shadow: '${shadow}',
        reference: 'chart',
        innerPadding: '${innerPadding}',
        store: {
            type: 'pie'
        },
        series: [{
            type: 'gauge',
            angleField: 'g1',
            donut: 30,
            value: 60,
            minimum: 100,
            maximum: 800,
            needle: true,
            needleLength: 95,
            needleWidth: 8,
            totalAngle: Math.PI,
            renderer: 'seriesRenderer',
            label: {
                fontSize: 12,
                fontWeight: 'bold'
            },
            colors: ['maroon', 'blue', 'lightgray', 'red'],
            sectors: [{
                end: 300,
                label: 'Cold',
                color: 'dodgerblue'
            }, {
                end: 300,
                style: {
                    strokeStyle: 'black',
                    strokeOpacity: 1,
                    lineWidth: 4
                }
            }, {
                end: 600,
                label: 'Temp.',
                color: 'lightgray'
            }, {
                end: 600,
                style: {
                    strokeStyle: 'black',
                    strokeOpacity: 1,
                    lineWidth: 4
                }
            }, {
                end: 800,
                label: 'Hot',
                color: 'tomato'
            }, {
                start: 0,
                style: {
                    strokeStyle: 'gray',
                    strokeOpacity: 1,
                    lineWidth: 4,
                    fillOpacity: 0
                }
            }]
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
