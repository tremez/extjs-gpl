/**
 * Demonstrates how to use Ext.chart.PlotChart
 */
Ext.define('KitchenSink.view.chart.line.Plot', {
    extend: 'Ext.Container',
    xtype: 'line-plot',
    controller: 'line-plot',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/line/PlotController.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '20 10',
            padding: 8,
            panIcon: 'x-fa fa-arrows-alt',
            panText: 'Pan',
            refreshText: 'Refresh',
            segBtnWidth: 200,
            shadow: true,
            tbarPadding: '5 8',
            themeText: 'Theme',
            zoomIcon: 'x-fa fa-search-plus',
            zoomText: 'Zoom'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                insetPadding: '20 10',
                padding: undefined,
                segBtnWidth: 75,
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
        store: {
            fields: ['x', 'y1', 'y2', 'y3', 'y4', 'y5']
        },
        interactions: [{
            type: 'panzoom',
            modeToggleButton: {
                width: '${segBtnWidth}',
                defaults: {
                    flex: 1,
                    ui: 'action'
                },
                items: [{
                    iconCls: '${panIcon}',
                    text: '${panText}',
                    value: 'pan'
                }, {
                    iconCls: '${zoomIcon}',
                    text: '${zoomText}',
                    value: 'zoom'
                }]
            }
        }],
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: 'y1',
            grid: true,
            minimum: -4,
            maximum: 4,
            title: {
                text: 'f(x)',
                fontSize: 16,
                fillStyle: 'rgb(255, 0, 136)'
            },
            floating: {
                value: 0,
                alongAxis: 1
            }
        }, {
            type: 'numeric',
            position: 'bottom',
            fields: 'x',
            grid: true,
            title: {
                text: 'x',
                fontSize: 16,
                fillStyle: 'rgb(255, 0, 136)'
            },
            floating: {
                value: 0,
                alongAxis: 0
            }
        }],
        series: [{
            type: 'line',
            xField: 'x',
            yField: 'y1',
            style: {
                lineWidth: 2,
                strokeStyle: 'rgb(0, 119, 204)'
            }
        }]
    }, {
        xtype: 'toolbar',
        reference: 'toolbar',
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
            margin: '0 10 0 0',
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
            margin: '0 10 0 0',
            handler: 'onRefresh'
        }]
    }]
});
