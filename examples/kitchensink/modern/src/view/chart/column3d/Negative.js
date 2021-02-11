/**
 * A 3D column chart with negative values.
 * Tapping or hovering a column will highlight it.
 */
Ext.define('KitchenSink.view.chart.column3d.Negative', {
    extend: 'Ext.Container',
    xtype: 'column-negative-3d',
    controller: 'column-negative-3d',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column3d/NegativeController.js'
    }, {
        type: 'Store',
        path: 'app/store/Earnings.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: '0 10 0 0',
            insetPadding: '40 20',
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
                innerPadding: '0 10 0 0',
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
        innerPadding: '${innerPadding}',
        insetPadding: '${insetPadding}',
        store: {
            type: 'earnings'
        },
        interactions: ['itemhighlight'],
        animation: {
            easing: 'backOut',
            duration: 500
        },
        axes: [{
            type: 'numeric3d',
            position: 'left',
            fields: 'gaming',
            grid: {
                odd: {
                    fillStyle: 'rgba(255, 255, 255, 0.06)'
                },
                even: {
                    fillStyle: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }, {
            type: 'category3d',
            position: 'bottom',
            fields: 'quarter',
            grid: true,
            label: {
                rotate: {
                    degrees: -60
                }
            }
        }],
        series: [{
            type: 'bar3d',
            xField: 'quarter',
            yField: 'gaming',
            highlight: true,
            renderer: 'onSeriesRender'
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
