/**
 * An area chart with negative values.
 */
Ext.define('KitchenSink.view.chart.area.Negative', {
    extend: 'Ext.Container',
    xtype: 'area-negative',
    controller: 'area-negative',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/area/NegativeController.js'
    }, {
        type: 'Store',
        path: 'app/store/Earnings.js'
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
            type: 'earnings'
        },
        legend: {
            type: 'sprite'
        },
        axes: [{
            type: 'numeric',
            adjustByMajorUnit: true,
            position: 'left',
            fields: ['consumer', 'gaming', 'phone', 'corporate'],
            grid: true,
            label: {
                fontSize: 14
            }
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'quarter',
            label: {
                fontSize: 14,
                rotate: {
                    degrees: -90
                }
            }
        }]
        // No 'series' config here,
        // as series are dynamically added in the controller.
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
