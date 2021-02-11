/**
 * A basic donut chart functions precisely like a pie chart. The only difference is that
 * the center is blank. This is typically done to increase the readability of the data
 * labels that may be around. The example makes use of two interactions: 'itemhighlight'
 * and 'rotate'. To use the first one, hover over or tap on a pie sector. To use the
 * second one, click or tap and then drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.chart.pie.Donut', {
    extend: 'Ext.Container',
    xtype: 'pie-donut',
    controller: 'pie-donut',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/pie/DonutController.js'
    }, {
        type: 'Store',
        path: 'app/store/MobileOS.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: 50,
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
                insetPadding: 50,
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

    listeners: {
        resize: 'onResize'
    },

    items: [{
        bind: {
            theme: '{menuGroups.charttheme}'
        },
        xtype: 'polar',
        shadow: '${shadow}',
        reference: 'chart',
        insetPadding: '${insetPadding}',
        store: {
            type: 'mobile-os'
        },
        legend: {
            type: 'sprite',
            marker: {
                size: 16
            }
        },
        interactions: ['rotate', 'itemhighlight'],
        series: [{
            type: 'pie',
            angleField: 'data1',
            donut: 50,
            highlight: true,
            label: {
                field: 'os'
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
