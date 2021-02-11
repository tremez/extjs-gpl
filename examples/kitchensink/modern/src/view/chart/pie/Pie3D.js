/**
 * Demonstrates how to use Ext.chart.series.Pie3D
 */
Ext.define('KitchenSink.view.chart.pie.Pie3D', {
    extend: 'Ext.Container',
    xtype: 'pie-3d',
    controller: 'chart',

    requires: [
        'Ext.chart.series.Pie3D',
        'Ext.chart.interactions.Rotate'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/ChartController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pie.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: 60,
            padding: 8,
            refreshText: 'Refresh',
            shadow: true,
            tbarPadding: '5 8',
            themeText: 'Theme',
            thickness: 60
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
                tbarPadding: '12 8',
                thickness: 40
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
        interactions: ['rotate'],
        animate: {
            duration: 500,
            easing: 'easeIn'
        },
        store: {
            type: 'pie'
        },
        series: [{
            type: 'pie3d',
            angleField: 'g1',
            donut: 30,
            distortion: 0.6,
            highlight: {
                margin: 40
            },
            thickness: '${thickness}',
            label: {
                field: 'name',
                calloutColor: 'rgba(0,0,0,0)',
                calloutLine: {
                    length: 1
                }
            },
            style: {
                strokeStyle: 'none'
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
        }, {
            text: '${refreshText}',
            iconCls: 'x-fa fa-sync',
            handler: 'onRefresh'
        }]
    }]
});
