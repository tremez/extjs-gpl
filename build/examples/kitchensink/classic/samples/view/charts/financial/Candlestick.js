/**
 * This example shows how to create a Candlestick chart. Candlestick charts are financial
 * charts that allow to visualize the open/high/low/close values of a stock.
 *
 * The example makes use of two interactions: 'crosshair' (default) and 'panzoom'. The
 * gear icon can be used to switch between the two.
 */
Ext.define('KitchenSink.view.charts.financial.Candlestick', {
    extend: 'Ext.Panel',
    xtype: 'financial-candlestick',
    controller: 'financial-candlestick',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric',
        'Ext.draw.modifier.Highlight',
        'Ext.chart.axis.Time',
        'Ext.chart.interactions.ItemHighlight'
    ],

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/financial/CandlestickController.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/StockPrice.js'
    }],
    //</example>
    layout: 'fit',
    width: '${width}',

    profiles: {
        classic: {
            width: 650
        },
        neptune: {
            width: 650
        },
        graphite: {
            width: 900
        },
        'classic-material': {
            width: 900
        }
    },

    tbar: [
        '->',
        {
            text: 'Refresh',
            handler: 'onRefresh'
        },
        {
            text: 'Download',
            handler: 'onDownload'
        }
    ],

    items: {
        xtype: 'chartnavigator',
        reference: 'chartnavigator',

        chart: {
            xtype: 'cartesian',
            reference: 'chart',
            width: '100%',
            height: 500,
            insetPadding: 20,

            store: {
                type: 'stock-price'
            },

            interactions: {
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
            },
            series: {
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
            },
            axes: [
                {
                    type: 'numeric',
                    position: 'left',
                    fields: ['open', 'high', 'low', 'close']
                },
                {
                    id: 'bottom',
                    type: 'time',
                    position: 'bottom',
                    fields: ['time']
                }
            ]
        },

        navigator: {
            axis: 'bottom'
        }
    }

});
