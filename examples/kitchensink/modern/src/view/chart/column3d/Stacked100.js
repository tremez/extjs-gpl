/**
 * 100% stacked 3D columns are column charts where categories are stacked
 * on top of each other. The value of each category is recalculated, so that
 * it represents a share of the whole, which is the full stack and is equal
 * to 100 by default.
 */
Ext.define('KitchenSink.view.chart.column3d.Stacked100', {
    extend: 'Ext.Container',
    xtype: 'column-stacked-100-3d',
    controller: 'column-stacked-100-3d',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column3d/Stacked100Controller.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: '0 10 0 0',
            insetPadding: '10 20 0 0',
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
                innerPadding: '0 5 0 0',
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
        innerPadding: '${innerPadding}',
        insetPadding: '${insetPadding}',
        legend: {
            type: 'sprite'
        },
        store: {
            type: 'browsers'
        },
        interactions: ['itemhighlight'],
        axes: [{
            type: 'numeric3d',
            position: 'left',
            grid: true,
            fields: ['data1', 'data2', 'data3', 'data4', 'other' ],
            renderer: 'onAxisLabelRender',
            minimum: 0,
            maximum: 100
        }, {
            type: 'category3d',
            position: 'bottom',
            grid: true,
            fields: ['month'],
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'bar3d',
            fullStack: true,
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari', 'Others' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4', 'other' ],
            stacked: true,
            highlightCfg: {
                brightnessFactor: 1.2,
                saturationFactor: 1.5
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onTooltipRender'
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
