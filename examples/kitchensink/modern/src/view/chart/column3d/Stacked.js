/**
 * Stacked 3D columns are column charts where categories are stacked on top of each other.
 * This is typically done to visually represent the total of all categories
 * for a given period or value.
 */
Ext.define('KitchenSink.view.chart.column3d.Stacked', {
    extend: 'Ext.Container',
    xtype: 'column-stacked-3d',
    controller: 'column-stacked-3d',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Time',
        'Ext.draw.modifier.Highlight',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.theme.*'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column3d/StackedController.js'
    }, {
        type: 'Store',
        path: 'app/store/EconomySectors.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            groupIcon: 'x-far fa-chart-bar',
            insetPadding: '40 20 10 10',
            padding: 8,
            shadow: true,
            segBtnProp: 'text',
            segBtnWidthProp: 'width',
            segBtnWidth: 200,
            stackIcon: 'x-fa fa-bars',
            tbarPadding: '5 8',
            themeText: 'Theme'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                insetPadding: '40 20 10 10',
                padding: undefined,
                shadow: undefined,
                segBtnProp: 'tooltip',
                segBtnWidthProp: 'minWidth',
                segBtnWidth: 75,
                themeText: undefined,
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
        captions: {
            title: {
                text: '2011 Major economies by GDP sector'
            }
        },
        legend: {
            type: 'sprite'
        },
        store: {
            type: 'economy-sectors'
        },
        interactions: ['itemhighlight'],
        axes: [{
            type: 'numeric3d',
            position: 'left',
            title: 'Billions of USD',
            renderer: 'onAxisLabelRender',
            grid: {
                odd: {
                    fillStyle: 'rgba(255, 255, 255, 0.06)'
                },
                even: {
                    fillStyle: 'rgba(0, 0, 0, 0.03)'
                }
            }
        }, {
            type: 'category3d',
            position: 'bottom',
            grid: true
        }],
        series: [{
            type: 'bar3d',
            xField: 'country',
            yField: ['agr', 'ind', 'ser'],
            title: ['Agriculture', 'Industry', 'Services'],
            highlight: true,
            tooltip: {
                trackMouse: true,
                renderer: 'onTooltipRender'
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
            xtype: 'segmentedbutton',
            '${segBtnWidthProp}': '${segBtnWidth}',
            defaults: {
                flex: 1,
                ui: 'action'
            },
            items: [{
                iconCls: '${stackIcon}',
                '${segBtnProp}': 'Stack',
                pressed: true
            }, {
                iconCls: '${groupIcon}',
                '${segBtnProp}': 'Group'
            }],
            listeners: {
                toggle: 'onStackedToggle'
            }
        }]
    }]
});
