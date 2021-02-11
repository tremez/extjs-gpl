/**
 * Grouped 3D Columns are column charts where categories are grouped next to each
 * other. This is typically done to visually represent the total of all categories for a
 * given period or value.
 */
Ext.define('KitchenSink.view.chart.column3d.Grouped', {
    extend: 'Ext.Container',
    xtype: 'column-grouped-3d',
    controller: 'column-grouped-3d',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column3d/GroupedController.js'
    }, {
        type: 'Store',
        path: 'app/store/TwoYearSales.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            insetPadding: '10 40 0 10',
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
                insetPadding: '10 40 0 10',
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
        interactions: ['itemhighlight'],
        animation: {
            duration: 200
        },
        store: {
            type: 'two-year-sales'
        },
        legend: {
            type: 'sprite'
        },
        title: {
            text: 'Sales in Last Two Years'
        },
        subtitle: {
            text: 'Quarter-wise comparison',
            style: {
                'font-weight': 'normal'
            }
        },
        credits: {
            text: 'www.sencha.com',
            docked: 'bottom',
            style: {
                'font-weight': 'normal',
                'font-size': '12px'
            }
        },
        axes: [{
            type: 'numeric3d',
            position: 'left',
            fields: ['2013', '2014'],
            grid: true,
            title: 'Sales in USD',
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category3d',
            position: 'bottom',
            fields: 'quarter',
            title: 'Quarter',
            grid: true
        }],
        series: [{
            type: 'bar3d',
            stacked: false,
            title: ['Previous Year', 'Current Year'],
            xField: 'quarter',
            yField: ['2013', '2014'],
            label: {
                field: ['2013', '2014'],
                display: 'insideEnd',
                renderer: 'onSeriesLabelRender'
            },
            highlight: true
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
