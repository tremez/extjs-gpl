/**
 * 100% stacked 3D bars are bar charts where categories are stacked
 * on top of each other. The value of each category is recalculated so that
 * it represents a share of the whole, which is the full stack and is equal
 * to 100 by default.
 */
Ext.define('KitchenSink.view.chart.bar3d.Stacked100', {
    extend: 'Ext.Container',
    xtype: 'bar-stacked-100-3d',
    controller: 'bar-stacked-100-3d',

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
        path: 'modern/src/view/chart/bar3d/Stacked100Controller.js'
    }, {
        type: 'Store',
        path: 'app/store/Browsers.js'
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
        flipXY: true,
        insetPadding: '${insetPadding}',
        theme: 'Muted',
        legend: {
            type: 'sprite',
            docked: 'bottom'
        },
        store: {
            type: 'browsers'
        },
        axes: [{
            type: 'numeric3d',
            position: 'bottom',
            grid: true,
            minimum: 0,
            maximum: 100,
            majorTickSteps: 10,
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category3d',
            position: 'left',
            grid: true
        }],
        series: [{
            type: 'bar3d',
            fullStack: true,
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari', 'Others' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4', 'other' ],
            axis: 'bottom',
            stacked: true,
            highlight: true,
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
