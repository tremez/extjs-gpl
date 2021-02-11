/**
 * Demonstrates how to use Ext.chart.series.Radar
 */
Ext.define('KitchenSink.view.chart.radar.Radar', {
    extend: 'Ext.Container',
    xtype: 'radar-filled',
    controller: 'chart',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/ChartController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/OrderItems.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            padding: 8,
            refreshText: 'Refresh',
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
        xtype: 'polar',
        shadow: '${shadow}',
        reference: 'chart',
        interactions: ['rotate'],
        legend: {
            type: 'sprite'
        },
        store: {
            type: 'orderitems',
            numRecords: 15
        },
        series: [{
            type: 'radar',
            title: 'G1',
            xField: 'id',
            yField: 'g1',
            style: {
                lineWidth: 4,
                fillOpacity: 0.3
            }
        }, {
            type: 'radar',
            title: 'G2',
            xField: 'id',
            yField: 'g2',
            style: {
                lineWidth: 4,
                fillOpacity: 0.3
            }
        }],
        axes: [{
            type: 'numeric',
            position: 'radial',
            fields: ['g1', 'g2'],
            grid: true,
            style: {
                estStepSize: 20
            },
            limits: {
                value: 500,
                line: {
                    strokeStyle: 'red',
                    lineDash: [6, 3],
                    title: {
                        text: 'Limit #1'
                    }
                }
            }
        }, {
            type: 'category',
            position: 'angular',
            margin: 20,
            fields: 'id',
            grid: true,
            style: {
                estStepSize: 2
            },
            limits: [{
                value: 12,
                line: {
                    strokeStyle: 'green',
                    lineWidth: 3,
                    lineDash: [6, 3],
                    title: {
                        text: 'Limit #2',
                        fontSize: 14
                    }
                }
            }, {
                value: 7,
                line: {
                    strokeStyle: 'green',
                    lineWidth: 3
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
        }, {
            text: '${refreshText}',
            iconCls: 'x-fa fa-sync',
            handler: 'onRefresh'
        }]
    }]
});
