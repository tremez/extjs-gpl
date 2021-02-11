/**
 * This example shows how to create a line chart with images as markers. Line charts allow
 * to visualize the evolution of a value over time, or the ratio between any two values.
 */
Ext.define('KitchenSink.view.chart.line.ImageMarkers', {
    extend: 'Ext.Container',
    xtype: 'line-markers',
    controller: 'line-imagemarkers',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric',
        'Ext.draw.modifier.Highlight',
        'Ext.chart.axis.Time',
        'Ext.chart.interactions.ItemHighlight'
    ],
    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/charts/line/ImageMarkersController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pie.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 20 0 0',
            padding: 8,
            panIcon: 'x-fa fa-arrows-alt',
            panText: 'Pan',
            refreshText: 'Refresh',
            resetText: 'Reset pan/zoom',
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
                insetPadding: '20 20 0 0',
                padding: undefined,
                resetText: 'Reset',
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
        store: {
            type: 'pie'
        },
        interactions: ['itemhighlight', {
            type: 'panzoom',
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
            marker: {
                size: 20
            }
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['g1', 'g2', 'g3'],
            minimum: 0,
            listeners: {
                rangechange: 'onAxisRangeChange'
            }
        }, {
            type: 'category',
            position: 'bottom',
            visibleRange: [0, 0.75],
            fields: 'name'
        }],
        series: [{
            type: 'line',
            xField: 'name',
            yField: 'g1',
            fill: true,
            style: {
                smooth: true,
                miterLimit: 3,
                lineCap: 'miter',
                strokeOpacity: 1,
                fillOpacity: 0.7,
                lineWidth: 8
            },
            title: 'Square',
            highlight: {
                scale: 0.9
            },
            marker: {
                type: 'image',
                src: 'modern/resources/images/square.png',
                width: 48,
                height: 48,
                x: -24,
                y: -24,
                scale: 0.7,
                animation: {
                    duration: 200
                }
            }
        }, {
            type: 'line',
            xField: 'name',
            yField: 'g2',
            style: {
                opacity: 0.7,
                lineWidth: 8
            },
            title: 'Circle',
            highlight: {
                scale: 0.9
            },
            marker: {
                type: 'image',
                src: 'modern/resources/images/circle.png',
                width: 48,
                height: 48,
                x: -24,
                y: -24,
                scale: 0.7,
                animation: {
                    duration: 200
                }
            }
        }, {
            type: 'line',
            xField: 'name',
            yField: 'g3',
            style: {
                opacity: 0.7,
                lineWidth: 8
            },
            title: 'Pentagon',
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
        }, {
            text: '${resetText}',
            iconCls: 'x-fa fa-undo',
            handler: 'onPanZoomReset'
        }]
    }]
});
