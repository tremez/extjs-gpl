/**
 * A 3D column chart with negative values.
 * Tapping or hovering a column will highlight it.
 */
Ext.define('KitchenSink.view.chart.bar3d.Negative', {
    extend: 'Ext.Container',
    xtype: 'bar-negative-3d',
    controller: 'bar-negative-3d',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category3D',
        'Ext.chart.axis.Numeric3D',
        'Ext.chart.grid.HorizontalGrid3D',
        'Ext.chart.grid.VerticalGrid3D',
        'Ext.chart.series.Bar3D',
        'Ext.chart.theme.Muted'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/bar3d/NegativeController.js'
    }, {
        type: 'Store',
        path: 'app/store/Earnings.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: '8 0 0 0',
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
                innerPadding: '8 0 0 0',
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
        flipXY: true,
        insetPadding: '${insetPadding}',
        innerPadding: '${innerPadding}',
        theme: 'muted',
        store: {
            type: 'earnings'
        },
        interactions: ['itemhighlight'],
        animation: false,
        axes: [{
            type: 'numeric3d',
            position: 'bottom',
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
            position: 'left',
            fields: 'quarter',
            grid: true
        }],
        series: [{
            type: 'bar3d',
            xField: 'quarter',
            yField: 'gaming',
            highlightCfg: {
                saturationFactor: 0
            },
            label: {
                fillStyle: 'white',
                fontWeight: 'bold',
                field: 'gaming',
                display: 'insideEnd'
            },
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
