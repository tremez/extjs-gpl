Ext.define('KitchenSink.view.d3.heatmap.Pivot', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-heatmap-pivot',
    controller: 'heatmap-pivot',

    requires: [
        'KitchenSink.view.d3.heatmap.PivotController',
        'Ext.pivot.d3.HeatMap'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/d3/heatmap/PivotController.js'
    }],
    //</example>

    layout: 'fit',

    tbar: ['->', {
        iconCls: 'x-fa fa-sync',
        text: 'Refresh Data',
        handler: 'onRefreshData'
    }],

    profiles: {
        defaults: {
            padding: '20 30 70 120',
            xTitle: {
                attr: {
                    'font-size': '12px'
                }
            },
            yTitle: {
                attr: {
                    'font-size': '12px'
                }
            },
            legend: {
                docked: 'right',
                padding: 50,

                // Legend items are *not* Container items. This config is an object.
                items: {
                    count: 6,
                    slice: [1],
                    reverse: true,
                    size: {
                        x: 60,
                        y: 30
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

    items: [{
        xtype: 'pivotheatmap',
        reference: 'heatmap',

        matrix: {
            store: {
                type: 'salesperemployee'
            },
            leftAxis: {
                dataIndex: 'employee',
                header: 'Employee',
                sortable: false
            },
            topAxis: {
                dataIndex: 'day',
                sortIndex: 'dayNumber',
                header: 'Day'
            },
            aggregate: {
                dataIndex: 'sales',
                aggregator: 'sum'
            }
        },

        padding: '${padding}',

        xAxis: {
            title: '${xTitle}'
        },

        yAxis: {
            title: '${yTitle}'
        },

        colorAxis: {
            scale: {
                type: 'linear',
                range: ['#ffffd9', '#49b6c4', '#225ea8']
            }
        },

        legend: '${legend}',

        tooltip: {
            renderer: 'onTooltip'
        },

        platformConfig: {
            phone: {
                tiles: {
                    cls: 'phone-tiles'
                }
            },
            tablet: {
                tiles: {
                    cls: 'tablet-tiles'
                }
            }
        }
    }]
});
