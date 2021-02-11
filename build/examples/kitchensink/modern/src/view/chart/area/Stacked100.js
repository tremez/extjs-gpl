/**
 * 100% stacked area are multi-series area charts where categories are stacked (percentage
 * values) on top of each other, with an additional category 'Others' that is used to sum
 * up the various categories for each series to a perfect 100%.
 */
Ext.define('KitchenSink.view.chart.area.Stacked100', {
    extend: 'Ext.Container',
    xtype: 'area-stacked-100',
    controller: 'area-stacked-100',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/area/Stacked100Controller.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 10',
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
                insetPadding: '20 10',
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
            type: 'browsers'
        },
        legend: {
            type: 'sprite'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['data1', 'data2', 'data3', 'data4', 'other' ],
            grid: true,
            minimum: 0,
            maximum: 100,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'month',
            grid: true,
            label: {
                rotate: {
                    degrees: -90
                }
            }
        }],
        series: [{
            type: 'area',
            fullStack: true,
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari', 'Others' ],
            yField: [ 'data1', 'data2', 'data3', 'data4', 'other' ],
            xField: 'month',
            style: {
                opacity: 0.80
            },
            marker: {
                opacity: 0,
                scaling: 0.01,
                animation: {
                    duration: 200,
                    easing: 'easeOut'
                }
            },
            highlightCfg: {
                opacity: 1,
                scaling: 1.5
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
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
