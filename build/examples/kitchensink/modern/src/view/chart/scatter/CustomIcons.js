/**
 * This example shows how to create a scatter chart with custom icons.
 * This example also uses the itemedit interaction meaning you can drag
 * an icon to edit it's value.
 */
Ext.define('KitchenSink.view.chart.scatter.CustomIcons', {
    extend: 'Ext.Container',
    xtype: 'scatter-custom-icons',
    controller: 'scatter-custom-icons',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/scatter/CustomIconsController.js'
    }, {
        type: 'Store',
        path: 'app/store/Pie.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 10',
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
        legend: {
            type: 'sprite'
        },
        store: {
            type: 'pie',
            numRecords: 25
        },
        interactions: [{
            type: 'itemedit',
            style: {
                strokeStyle: 'gray'
            }
        }],
        axes: [{
            type: 'numeric',
            position: 'left',
            label: {
                rotate: {
                    degrees: -30
                }
            }
        }, {
            type: 'category',
            position: 'bottom'
        }],
        series: [{
            type: 'scatter',
            xField: 'id',
            yField: 'g1',
            title: 'Group 1',
            highlight: true,
            marker: {
                type: 'path',
                scale: 10,
                lineWidth: 2,
                path: [
                    ['M', 0, 1],
                    ['L', 1, 0],
                    ['L', 0, -1],
                    ['L', -1, 0],
                    ['Z']
                ]
            }
        }, {
            type: 'scatter',
            xField: 'id',
            yField: 'g2',
            title: 'Group 2',
            highlight: true,
            marker: {
                type: 'path',
                scalingX: 0.1,
                scalingY: -0.1,
                path: [
                    ['M', 0, -145],
                    ['L', 48, -50],
                    ['L', 153, -36],
                    ['L', 76, 39],
                    ['L', 93, 143],
                    ['L', 0, 95],
                    ['L', -93, 143],
                    ['L', -76, 39],
                    ['L', -153, -36],
                    ['L', -48, -50],
                    ['Z']
                ]
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
