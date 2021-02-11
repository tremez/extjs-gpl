/**
 * The 'd3-heatmap' component is great for visualizing matrices
 * where the individual values are represented as colors.
 * This particual example shows how many customers spent a given amount of money on each day
 * during the week. The example also showcases the use of tooltips to show extra info.
 */
Ext.define('KitchenSink.view.d3.heatmap.Purchases', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-heatmap-purchases',
    controller: 'heatmap-heatmap',

    requires: [
        'Ext.d3.HeatMap'
    ],

    //<example>
    otherContent: [
        {
            type: 'Controller',
            path: 'modern/src/view/d3/heatmap/PurchasesController.js'
        },
        {
            type: 'Store',
            path: 'modern/src/store/HeatMap.js'
        }
    ],

    profiles: {
        defaults: {
            padding: '40 40 20 80',
            xTitle: {
                text: 'Date'
            },
            yTitle: {
                text: 'Total'
            },
            legend: {
                docked: 'bottom',
                padding: 60,
                items: {
                    count: 7,
                    slice: [1],
                    reverse: true,
                    size: {
                        x: 90,
                        y: 20
                    }
                }
            }
        },
        phone: {
            defaults: {
                legend: undefined,
                padding: '20 20 40 60',
                xTitle: undefined,
                yTitle: undefined
            }
        }
    },
    //  </example>

    layout: 'fit',

    items: [{
        xtype: 'd3-heatmap',
        store: {
            type: 'heatmap'
        },
        padding: '${padding}',
        legend: '${legend}',

        xAxis: {
            field: 'date',
            step: 24 * 60 * 60 * 1000,
            title: '${xTitle}',
            axis: {
                ticks: 'd3.timeDay',
                tickFormat: "d3.timeFormat('%b %d')",
                orient: 'bottom'
            },
            scale: {
                type: 'time'
            }
        },

        yAxis: {
            field: 'bucket',
            step: 100,
            title: '${yTitle}',
            axis: {
                orient: 'left',
                tickFormat: "d3.format('$d')"
            },
            scale: {
                type: 'linear'
            }
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

        tooltip: {
            renderer: 'onTooltip'
        }
    }]
});
