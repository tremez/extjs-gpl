/**
 * Demonstrates how to use the 'boxplot' series.
 */
Ext.define('KitchenSink.view.chart.boxplot.BoxPlot', {
    extend: 'Ext.Container',
    xtype: 'boxplot-nobel',
    controller: 'boxplot',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.BoxPlot',
        'Ext.chart.series.Scatter'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/boxplot/BoxPlotController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/NobelBoxPlot.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/NobelOutlier.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '60 40 20 20',
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
                insetPadding: '60 40 20 20',
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
        captions: {
            title: {
                text: 'Age of Nobel Prize winners by field\n1901 to 2014',
                style: {
                    fontSize: 17
                }
            }
        },
        store: {
            type: 'nobel-outlier'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            minimum: 10,
            majorTickSteps: 8,
            grid: true,
            limits: [{
                value: 60,
                line: {
                    strokeStyle: 'red',
                    lineWidth: 2,
                    lineDash: [6, 3],
                    title: {
                        text: 'Theoretical mean: 60',
                        fontWeight: 'bold',
                        fillStyle: 'black',
                        fontSize: 14
                    }
                }
            }]
        }, {
            type: 'category',
            position: 'bottom'
        }],
        series: [{
            type: 'boxplot',
            xField: 'field',
            store: {
                type: 'nobel-boxplot'
            },
            highlight: true,
            style: {
                maxBoxWidth: 52,
                lineWidth: 2
            },
            renderer: 'onBoxPlotRender',
            tooltip: {
                trackMouse: true,
                renderer: 'onBoxPlotTooltip'
            }
        }, {
            type: 'scatter',
            xField: 'field',
            yField: 'age'
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
                }]
            }
        }]
    }]
});
