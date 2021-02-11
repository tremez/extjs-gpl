/**
 * Marked splines are multi-series splines displaying smooth curves across multiple
 * categories. Markers are placed at each connected point to clearly depict their position.
 */
Ext.define('KitchenSink.view.chart.line.MarkedSpline', {
    extend: 'Ext.Container',
    xtype: 'line-marked-spline',
    controller: 'line-marked-spline',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/line/MarkedSplineController.js'
    }, {
        type: 'Store',
        path: 'app/store/Spline.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '10 20 10 10',
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
                insetPadding: '10 20 10 10',
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
        insetPadding: '${insetPadding}',
        store: {
            type: 'spline'
        },
        legend: {
            type: 'sprite',
            docked: 'top',
            marker: {
                size: 16
            }
        },
        axes: [{
            type: 'numeric',
            fields: ['sin', 'cos', 'tan' ],
            position: 'left',
            grid: true,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            title: 'Theta',
            fields: 'theta',
            position: 'bottom',
            style: {
                textPadding: 0 // remove extra padding between labels to make sure no labels are skipped
            },
            grid: true,
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'line',
            xField: 'theta',
            yField: 'sin',
            smooth: true,
            style: {
                lineWidth: 2
            },
            marker: {
                radius: 4
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            }
        }, {
            type: 'line',
            xField: 'theta',
            yField: 'cos',
            smooth: true,
            style: {
                lineWidth: 2
            },
            marker: {
                radius: 4
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            }
        }, {
            type: 'line',
            xField: 'theta',
            yField: 'tan',
            smooth: true,
            style: {
                lineWidth: 2
            },
            marker: {
                radius: 4
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
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
        }]
    }]
});
