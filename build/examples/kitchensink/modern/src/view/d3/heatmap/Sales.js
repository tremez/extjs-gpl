/**
 * Another use of heatmap to visualize sales per employee by day.
 * This example also shows off the use of a polylinear scale, where
 * three range colors are specified and the (automatically calculated)
 * domain is split into two equal size segments that correspond to
 * color subranges. One can also specify the domain manually if segments
 * of irregular size are desired.
 */
Ext.define('KitchenSink.view.d3.heatmap.Sales', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-heatmap-sales',
    controller: 'heatmap-sales',

    requires: [
        'Ext.d3.HeatMap'
    ],

    //<example>
    otherContent: [
        {
            type: 'Controller',
            path: 'modern/src/view/d3/heatmap/SalesController.js'
        },
        {
            type: 'Store',
            path: 'app/store/SalesPerEmployee.js'
        }
    ],
    //  </example>

    layout: 'vbox',
    shadow: true,

    items: [{
        xtype: 'toolbar',
        hidden: true,
        platformConfig: {
            '!phone': {
                hidden: false,
                items: [{
                    iconCls: 'x-fa fa-sync',
                    text: 'Refresh Data',
                    handler: 'onRefreshData'
                }, {
                    iconCls: 'x-fa fa-sync fa-table',
                    text: 'Refresh Size',
                    handler: 'onRefreshDataAndSize'
                }]
            }
        }
    }, {
        xtype: 'd3-heatmap',
        reference: 'heatmap',
        flex: 1,

        store: {
            type: 'salesperemployee'
        },

        padding: {
            top: 30,
            right: 30,
            bottom: 40,
            left: 100
        },

        platformConfig: {
            '!phone': {
                padding: {
                    top: 40,
                    right: 30,
                    bottom: 70,
                    left: 120
                },
                legend: {
                    docked: 'right',
                    padding: 50,
                    items: {
                        count: 10,
                        slice: [1],
                        reverse: true,
                        size: {
                            x: 60,
                            y: 30
                        }
                    }
                }
            }
        },

        xAxis: {
            platformConfig: {
                '!phone': {
                    title: {
                        text: 'Employee',
                        attr: {
                            'font-size': '14px'
                        }
                    }
                }
            },
            axis: {
                orient: 'bottom'
            },
            scale: {
                type: 'band'
            },
            field: 'employee'
        },

        yAxis: {
            platformConfig: {
                '!phone': {
                    title: {
                        text: 'Day',
                        attr: {
                            'font-size': '14px'
                        }
                    }
                }
            },
            axis: {
                orient: 'left'
            },
            scale: {
                type: 'band'
            },
            field: 'day'
        },

        colorAxis: {
            scale: {
                type: 'linear',
                range: ['#ffffd9', '#49b6c4', '#225ea8']
            },
            field: 'sales'
        },

        tiles: {
            attr: {
                'stroke': '#081d58',
                'stroke-width': 2
            }
        }
    }]

});
