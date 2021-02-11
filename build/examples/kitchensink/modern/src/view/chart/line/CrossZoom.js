/**
 * This example shows how to create a line chart. Line charts allow to visualize the
 * evolution of a value over time, or the ratio between any two values.
 *
 * This example also highlights data aggregation to effortlessly display over 1000 points.
 */
Ext.define('KitchenSink.view.chart.line.CrossZoom', {
    extend: 'Ext.Container',
    xtype: 'line-crosszoom',
    controller: 'line-crosszoom',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/line/CrossZoomController.js'
    }, {
        type: 'Store',
        path: 'app/store/USD2EUR.js'
    }, {
        type: 'Model',
        path: 'app/model/USD2EUR.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 10 0 0',
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            themeText: 'Theme'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                insetPadding: '20 10 0 0',
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
        bind: {
            theme: '{menuGroups.charttheme}'
        },
        xtype: 'cartesian',
        shadow: '${shadow}',
        reference: 'chart',
        insetPadding: '${insetPadding}',
        store: {
            type: 'USD2EUR'
        },
        interactions: [{
            type: 'crosszoom',
            zoomOnPanGesture: false
        }],
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['value'],
            titleMargin: 12,
            title: {
                text: 'USD to Euro'
            }
        }, {
            type: 'time',
            dateFormat: 'Y-m-d',
            visibleRange: [0, 1],
            position: 'bottom',
            fields: ['time'],
            titleMargin: 12,
            title: {
                text: 'Date'
            }
        }],
        series: [{
            type: 'line',
            xField: 'time',
            yField: 'value',
            fill: true,
            style: {
                lineWidth: 2,
                fillOpacity: 0.6,
                miterLimit: 3,
                lineCap: 'miter'
            }
        }]
    }, {
        xtype: 'toolbar',
        reference: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 10 0 0',
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: '${themeText}',
            iconCls: 'x-far fa-image',
            arrow: false,
            menu: {
                bind: {
                    groups: '{menuGroups}'
                },
                defaults: {
                    xtype: 'menuradioitem',
                    group: 'charttheme'
                },
                items: [{
                    text: 'Default',
                    checked: true
                }, {
                    text: 'Midnight'
                }, {
                    text: 'Green'
                }, {
                    text: 'Muted'
                }, {
                    text: 'Purple'
                }, {
                    text: 'Sky'
                }]
            }
        }]
    }]
});
