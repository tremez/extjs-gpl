/**
 * The 'd3-heatmap' component is great for visualizing matrices
 * where the individual values are represented as colors.
 * This particual example shows how many customers spent a given amount of money on each day
 * during the week. The example also showcases the use of tooltips to show extra info.
 */
Ext.define('KitchenSink.view.d3.heatmap.Purchases', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-heatmap-purchases',
    controller: 'heatmap-heatmap',

    requires: [
        'Ext.d3.HeatMap'
    ],

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Controller',
            path: 'classic/samples/view/d3/heatmap/PurchasesController.js'
        },
        {
            type: 'Store',
            path: 'classic/samples/store/HeatMap.js'
        }
    ],
    //</example>

    profiles: {
        classic: {
            width: 960
        },
        neptune: {
            width: 960
        },
        graphite: {
            width: 1100
        },
        'classic-material': {
            width: 1100
        }
    },
    width: '${width}',
    height: 700,

    layout: 'fit',

    items: {
        xtype: 'd3-heatmap',
        store: {
            type: 'heatmap'
        },

        padding: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 90
        },

        xAxis: {
            axis: {
                orient: 'bottom',
                ticks: 'd3.timeDay',
                tickFormat: "d3.timeFormat('%b %d')"
            },
            scale: {
                type: 'time'
            },
            title: {
                text: 'Date'
            },
            field: 'date',
            step: 24 * 60 * 60 * 1000
        },

        yAxis: {
            axis: {
                orient: 'left',
                tickFormat: "d3.format('$d')"
            },
            scale: {
                type: 'linear'
            },
            title: {
                text: 'Total'
            },
            field: 'bucket',
            step: 100
        },

        colorAxis: {
            scale: {
                type: 'linear',
                range: ['white', 'green']
            },
            field: 'count',
            minimum: 0
        },

        tiles: {
            attr: {
                'stroke': 'green',
                'stroke-width': 1
            }
        },

        legend: {
            docked: 'bottom',
            padding: 60,
            items: {
                count: 7,
                slice: [1],
                size: {
                    x: 60,
                    y: 30
                }
            }
        },

        tooltip: {
            renderer: 'onTooltip'
        }
    }
});
