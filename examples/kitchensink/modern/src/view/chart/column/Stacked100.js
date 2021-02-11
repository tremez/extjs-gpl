/**
 * 100% stacked 3D columns are column charts where categories are stacked
 * on top of each other. The value of each category is recalculated, so that
 * it represents a share of the whole, which is the full stack and is equal
 * to 100 by default.
 */
Ext.define('KitchenSink.view.chart.column.Stacked100', {
    extend: 'Ext.Container',
    xtype: 'column-stacked-100',
    controller: 'column-stacked-100',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column/Stacked100Controller.js'
    }, {
        type: 'Store',
        path: 'app/store/Cars.js'
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
        insetPadding: '${insetPadding}',
        legend: {
            type: 'sprite',
            docked: 'bottom',
            marker: {
                type: 'square'
            },
            border: {
                radius: 0
            }
        },
        store: {
            type: 'cars'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            grid: true,
            fields: [ 'to', 'gm', 'vw', 'hy', 'fo' ],
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'year',
            label: {
                rotate: {
                    degrees: -45
                }
            }
        }],
        series: [{
            type: 'bar',
            stacked: true,
            fullStack: true,
            title: [ 'Toyota', 'GM', 'Volkswagen', 'Hyundai', 'Ford' ],
            xField: 'year',
            yField: [ 'to', 'gm', 'vw', 'hy', 'fo' ],
            tooltip: {
                trackMouse: true,
                renderer: 'onBarTipRender'
            },
            style: {
                minGapWidth: 10
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
