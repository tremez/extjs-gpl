/**
 * This example shows how to use multiple floating axes in a polar chart. Similar to the
 * Plot Line Chart example, floating axes don't have a fixed position, instead they track
 * a specified value on another axis that is running in the opposite direction.
 *
 * The example makes use of the 'rotate' interaction. To use it, click or tap and then
 * drag anywhere on the chart.
 */
Ext.define('KitchenSink.view.chart.radar.MultiAxis', {
    extend: 'Ext.Container',
    xtype: 'radar-multi-axis',
    controller: 'radar-basic',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/radar/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/Climate.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: 25,
            padding: 8,
            refreshText: 'Refresh',
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
        store: {
            type: 'climate'
        },
        interactions: ['rotate'],
        axes: [{
            type: 'category',
            position: 'angular',
            id: 'main-angular-axis',
            grid: true,
            style: {
                majorTickSize: 20,
                strokeStyle: 'rgb(73,112,142)'
            }
        }, {
            type: 'category',
            position: 'angular',
            linkedTo: 'main-angular-axis',
            renderer: 'onMultiAxisLabelRender',
            floating: {
                value: 20,
                alongAxis: 'radial-axis'
            }
        }, {
            type: 'numeric',
            id: 'radial-axis',
            position: 'radial',
            label: {
                fontWeight: 'bold'
            },
            floating: {
                value: 'Jan',
                alongAxis: 'main-angular-axis'
            }
        }],
        series: [{
            type: 'radar',
            angleField: 'month',
            radiusField: 'high',
            style: {
                globalAlpha: 0.7
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
