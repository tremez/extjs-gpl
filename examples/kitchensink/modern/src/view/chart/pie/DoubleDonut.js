/**
 * A double donut chart is a variation on a donut chart, where two 'pie'
 * series are used instead of one. The inner series represents groups
 * of some components, and the outer series represents the components
 * themselves. Combined angular span of components in a group matches
 * the angular span of that group. This allows to easily see parent-child
 * relationships and their percentage in the whole.
 */
Ext.define('KitchenSink.view.chart.pie.DoubleDonut', {
    extend: 'Ext.Container',
    xtype: 'pie-double-donut',
    controller: 'pie-double-donut',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/pie/DoubleDonutController.js'
    }, {
        type: 'Store',
        path: 'app/store/DoubleDonut.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: 20,
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
                innerPadding: 20,
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
        innerPadding: '${innerPadding}',
        interactions: ['rotate', 'itemhighlight'],
        store: {
            type: 'double-donut',
            sorters: {
                property: 'type',
                direction: 'DESC'
            }
        },
        series: [{
            // Outer ring series.
            // Inner ring series is created in the controller.
            type: 'pie',
            angleField: 'usage',
            donut: 80,
            highlight: true,
            label: {
                field: 'provider'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onOuterSeriesTooltipRender'
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
