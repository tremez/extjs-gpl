/**
 * Multi-series radar chart displaying trends across multiple categories.
 * Markers are placed at each point to clearly depict their position.
 *
 * The example makes use of the 'rotate' interaction. To use it, click or tap and then
 * drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.chart.radar.Marked', {
    extend: 'Ext.Container',
    xtype: 'radar-marked',
    controller: 'radar-basic',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/radar/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: 25,
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
                insetPadding: 25,
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
        insetPadding: '${insetPadding}',
        legend: {
            type: 'sprite'
        },
        animation: {
            duration: 200
        },
        store: {
            type: 'browsers'
        },
        interactions: ['rotate'],
        axes: [{
            type: 'numeric',
            position: 'radial',
            minimum: 0,
            maximum: 50,
            majorTickSteps: 9
        }, {
            type: 'category',
            position: 'angular',
            grid: true
        }],
        series: [{
            type: 'radar',
            title: 'IE',
            angleField: 'month',
            radiusField: 'data1',
            style: {
                lineWidth: 2,
                fillStyle: 'none'
            },
            marker: true,
            highlightCfg: {
                radius: 6,
                fillStyle: 'yellow'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesLabelRender'
            }
        }, {
            type: 'radar',
            title: 'Firefox',
            angleField: 'month',
            radiusField: 'data2',
            marker: true,
            style: {
                lineWidth: 2,
                fillStyle: 'none'
            },
            highlight: {
                radius: 6,
                fillStyle: 'yellow'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesLabelRender'
            }
        }, {
            type: 'radar',
            title: 'Chrome',
            angleField: 'month',
            radiusField: 'data3',
            marker: true,
            style: {
                lineWidth: 2,
                fillStyle: 'none'
            },
            highlight: {
                radius: 6,
                fillStyle: 'yellow'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesLabelRender'
            }
        }, {
            type: 'radar',
            title: 'Safari',
            angleField: 'month',
            radiusField: 'data4',
            style: {
                lineWidth: 2,
                fillStyle: 'none'
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
