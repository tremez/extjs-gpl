/**
 * The Navigator component is used to visually set the visible range of the x-axis
 * of a cartesian chart. Tap and pan in the navigator or the chart, both are linked
 * and synced, or drag the edges of the visible range rectangle to expand or shrink it.
 */
Ext.define('KitchenSink.view.chart.navigator.Line', {
    extend: 'Ext.Container',
    xtype: 'navigator-line',
    controller: 'navigator-line',

    requires: [
        'Ext.chart.navigator.Container'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/navigator/LineController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/Trig.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 10 10',
            padding: 8,
            panIcon: 'x-fa fa-arrows-alt',
            panText: 'Pan',
            segBtnWidth: 200,
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
                insetPadding: '10 5 0 0',
                padding: undefined,
                segBtnWidth: 75,
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

    listeners: {
        resize: 'onResize'
    },

    items: [{
        xtype: 'chartnavigator',
        reference: 'chartnavigator',
        chart: {
            bind: {
                theme: '{menuGroups.charttheme}'
            },
            xtype: 'cartesian',
            reference: 'chart',
            insetPadding: '${insetPadding}',
            interactions: [{
                type: 'panzoom',
                zoomOnPanGesture: false,
                axes: {
                    left: {
                        allowPan: false,
                        allowZoom: false
                    }
                },
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
                docked: 'right'
            },
            store: {
                type: 'trig'
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                grid: true
            }, {
                id: 'bottom',
                type: 'category',
                position: 'bottom',
                grid: true,
                renderer: 'axisRenderer',
                label: {
                    rotation: {
                        degrees: -90
                    }
                }
            }],
            series: [{
                type: 'line',
                title: 'sin',
                xField: 'x',
                yField: 'sin',
                marker: {
                    type: 'triangle',
                    animation: {
                        duration: 200,
                        easing: 'backOut'
                    }
                },
                highlight: {
                    scaling: 2
                }
            }, {
                type: 'line',
                title: 'cos',
                xField: 'x',
                yField: 'cos',
                marker: {
                    type: 'cross',
                    animation: {
                        duration: 200,
                        easing: 'backOut'
                    }
                },
                highlight: {
                    scaling: 2
                }
            }]
        },
        navigator: {
            axis: 'bottom'
        }
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
        }]
    }]
});
