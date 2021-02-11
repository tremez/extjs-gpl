/**
 * Demonstrates how to use Ext.chart.series.Line with Markers
 */
Ext.define('KitchenSink.view.chart.line.LineWithMarker', {
    extend: 'Ext.Container',
    xtype: 'line-marked',
    controller: 'line-marked',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/ChartController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pie.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 20 0 10',
            padding: 8,
            panIcon: 'x-fa fa-arrows-alt',
            panText: 'Pan',
            refreshText: 'Refresh',
            segBtnWidth: 200,
            shadow: true,
            tbarPadding: '5 8',
            themeText: 'Theme',
            zoomIcon: 'x-fa fa-search-plus',
            zoomText: 'Zoom'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                insetPadding: '20 20 0 10',
                padding: undefined,
                segBtnWidth: 75,
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
        interactions: ['itemhighlight', {
            type: 'panzoom',
            zoomOnPanGesture: false,
            modeToggleButton: {
                width: '${segBtnWidth}',
                defaults: {
                    flex: 1,
                    ui: 'action'
                },
                items: [{
                    iconCls: '${panIcon}',
                    text: '${panText}',
                    value: 'pan'
                }, {
                    iconCls: '${zoomIcon}',
                    text: '${zoomText}',
                    value: 'zoom'
                }]
            }
        }],
        legend: {
            type: 'sprite',
            docked: 'bottom',
            marker: {
                size: 24
            }
        },
        store: {
            type: 'pie',
            numRecords: 10
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['g1', 'g2', 'g3'],
            minimum: 0
        }, {
            type: 'category',
            position: 'bottom',
            visibleRange: [0, 0.5],
            fields: 'name'
        }],
        series: [{
            type: 'line',
            xField: 'name',
            yField: 'g1',
            fill: true,
            title: 'Square',
            style: {
                smooth: true,
                miterLimit: 3,
                lineCap: 'miter',
                opacity: 0.7,
                lineWidth: 8
            },
            highlight: {
                scale: 0.9
            },
            marker: {
                type: 'image',
                src: 'modern/resources/images/square.png',
                width: 46,
                height: 46,
                x: -23,
                y: -23,
                scale: 0.7,
                animation: {
                    duration: 200
                }
            }
        }, {
            type: 'line',
            xField: 'name',
            yField: 'g2',
            title: 'Circle',
            style: {
                opacity: 0.7,
                lineWidth: 8
            },
            highlight: {
                scale: 0.9
            },
            marker: {
                type: 'image',
                src: 'modern/resources/images/circle.png',
                width: 46,
                height: 46,
                x: -23,
                y: -23,
                scale: 0.7,
                animation: {
                    duration: 200
                }
            }
        }, {
            type: 'line',
            xField: 'name',
            yField: 'g3',
            title: 'Polygon',
            style: {
                opacity: 0.7,
                lineWidth: 8
            },
            highlight: {
                scale: 0.9
            },
            marker: {
                type: 'image',
                src: 'modern/resources/images/pentagon.png',
                width: 48,
                height: 48,
                x: -24,
                y: -24,
                scale: 0.7,
                animation: {
                    duration: 200
                }
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
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: '${themeText}',
            iconCls: 'x-far fa-image',
            arrow: false,
            margin: '0 10 0 0',
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
            margin: '0 10 0 0',
            handler: 'onRefresh'
        }]
    }]
});
