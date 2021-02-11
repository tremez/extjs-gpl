/**
 * A basic 3D bar chart is a chart with horizontal bars of lengths proportional to the
 * magnitudes of the data it represents. Basic 3D bars can be used in the same manner as the
 * 3D column charts. Categories are typically organized along the vertical axis and values
 * along the horizontal axis. Tapping or hovering a bar will highlight it.
 */
Ext.define('KitchenSink.view.chart.bar3d.Basic', {
    extend: 'Ext.Container',
    xtype: 'bar-basic-3d',
    controller: 'bar-basic-3d',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category3D',
        'Ext.chart.axis.Numeric3D',
        'Ext.chart.grid.HorizontalGrid3D',
        'Ext.chart.grid.VerticalGrid3D',
        'Ext.chart.series.Bar3D'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/bar3d/BasicController.js'
    }, {
        type: 'Store',
        path: 'app/store/EconomySectors.js'
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
        store: {
            type: 'economy-sectors'
        },
        axes: [{
            type: 'numeric3d',
            position: 'bottom',
            fields: 'ind',
            maximum: 4000000,
            renderer: 'onAxisLabelRender',
            title: 'Billions of USD'
        }, {
            type: 'category3d',
            position: 'left',
            fields: 'country'
        }],
        series: [{
            type: 'bar3d',
            xField: 'country',
            yField: 'ind'
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
