/**
 * 100% stacked bars are bar charts where categories are stacked
 * on top of each other. The value of each category is recalculated so that
 * it represents a share of the whole, which is the full stack and is equal
 * to 100 by default.
 */
Ext.define('KitchenSink.view.chart.bar.Stacked100', {
    extend: 'Ext.Container',
    xtype: 'bar-stacked-100',
    controller: 'bar-stacked-100',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/bar/Stacked100Controller.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 20 0 10',
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
                insetPadding: '10 20 0 0',
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
        flipXY: true,
        legend: {
            type: 'sprite',
            docked: 'bottom'
        },
        store: {
            type: 'browsers'
        },
        axes: [{
            type: 'numeric',
            fields: 'data1',
            position: 'bottom',
            grid: true,
            minimum: 0,
            maximum: 100,
            majorTickSteps: 10,
            renderer: 'onAxisLabelRender',
            label: {
                fontSize: 14
            }
        }, {
            type: 'category',
            fields: 'month',
            position: 'left',
            grid: true,
            label: {
                fontSize: 14
            }
        }],
        series: [{
            type: 'bar',
            fullStack: true,
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari', 'Others' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4', 'other' ],
            axis: 'bottom',
            stacked: true,
            style: {
                opacity: 0.80
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
