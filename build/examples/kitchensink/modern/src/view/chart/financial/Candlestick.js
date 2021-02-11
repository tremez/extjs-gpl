/**
 * Demonstrates how to use Ext.chart.series.CandleStick
 */
Ext.define('KitchenSink.view.chart.financial.Candlestick', {
    extend: 'Ext.Container',
    xtype: 'financial-candlestick',
    controller: 'candlestick-financial',

    requires: [
        'Ext.chart.interactions.Crosshair',
        'Ext.chart.series.CandleStick'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/financial/CandlestickController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/StockPrice.js'
    }, {
        type: 'Model',
        path: 'app/model/StockPrice.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 10',
            padding: 8,
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
            type: 'stock-price'
        },
        interactions: [{
            type: 'panzoom',
            enabled: false,
            axes: {
                left: {
                    allowPan: false,
                    allowZoom: false
                },
                bottom: {
                    allowPan: true,
                    allowZoom: true
                }
            }
        }, {
            type: 'crosshair',
            axes: {
                label: {
                    fillStyle: 'white'
                },
                rect: {
                    fillStyle: '#344459',
                    opacity: 0.7,
                    radius: 5
                }
            }
        }],
        series: [{
            type: 'candlestick',
            xField: 'time',
            openField: 'open',
            highField: 'high',
            lowField: 'low',
            closeField: 'close',
            style: {
                barWidth: 10,
                opacity: 0.9,
                dropStyle: {
                    fill: 'rgb(237,123,43)',
                    stroke: 'rgb(237,123,43)'
                },
                raiseStyle: {
                    fill: 'rgb(55,153,19)',
                    stroke: 'rgb(55,153,19)'
                }
            }
        }],
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['open', 'high', 'low', 'close']
        }, {
            type: 'time',
            position: 'bottom',
            fields: 'time',
            visibleRange: [0.15, 0.45],
            dateFormat: 'M d',
            segmenter: {
                type: 'time',
                step: {
                    unit: Ext.Date.MONTH,
                    step: 1
                }
            }
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
            xtype: 'segmentedbutton',
            width: 300,
            defaults: {
                flex: 1,
                ui: 'action'
            },
            items: [{
                text: 'Crosshair',
                pressed: true,
                handler: 'onCrosshair'
            }, {
                text: 'Pan',
                handler: 'onPan'
            }, {
                text: 'Zoom',
                handler: 'onZoom'
            }]
        }]
    }]
});
