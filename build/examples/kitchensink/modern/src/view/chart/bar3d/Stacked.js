/**
 * Stacked 3D bars are 3D bar charts where categories are stacked next to each
 * other. This is typically done to visually represent the total of all categories for a
 * given period or value.
 */
Ext.define('KitchenSink.view.chart.bar3d.Stacked', {
    extend: 'Ext.Container',
    xtype: 'bar-stacked-3d',
    controller: 'bar-stacked-3d',

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
        path: 'modern/src/view/chart/bar3d/StackedController.js'
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
        theme: 'muted',
        legend: {
            type: 'sprite',
            docked: 'bottom'
        },
        store: {
            type: 'browsers'
        },
        animation: {
            easing: 'backOut',
            duration: 500
        },
        axes: [{
            type: 'numeric3d',
            position: 'bottom',
            adjustByMajorUnit: true,
            grid: true,
            renderer: 'onAxisLabelRender',
            minimum: 0
        }, {
            type: 'category3d',
            position: 'left',
            grid: true
        }],
        series: [{
            type: 'bar3d',
            title: [ 'IE', 'Firefox', 'Chrome', 'Safari' ],
            xField: 'month',
            yField: [ 'data1', 'data2', 'data3', 'data4' ],
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
