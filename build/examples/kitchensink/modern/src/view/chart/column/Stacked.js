/**
 * Demonstrates how to use stacked bar series.
 */
Ext.define('KitchenSink.view.chart.column.Stacked', {
    extend: 'Ext.Container',
    xtype: 'column-stacked',
    controller: 'column-stacked',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/column/StackedController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/OrderItems.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            groupIcon: 'x-far fa-chart-bar',
            insetPadding: '20 10',
            padding: 8,
            panIcon: 'x-fa fa-arrows-alt',
            panText: 'Pan',
            refreshText: 'Refresh',
            segBtnProp: 'text',
            segBtnWidth: 240,
            shadow: true,
            stackIcon: 'x-fa fa-bars',
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
                panText: undefined,
                refreshText: undefined,
                segBtnProp: 'tooltip',
                segBtnWidth: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                themeText: undefined,
                zoomText: undefined
            },
            ios: {
                segBtnWidth: 60,
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
        store: {
            type: 'orderitems',
            numRecords: 7
        },
        legend: true,
        interactions: [{
            type: 'panzoom',
            axes: {
                left: {
                    allowPan: false,
                    allowZoom: false
                },
                bottom: {
                    allowPan: true,
                    allowZoom: true
                }
            },
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
        series: [{
            type: 'bar',
            xField: 'name',
            yField: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
            title: ['Apples', 'Oranges', 'Bananas', 'Plums', 'Mangos', 'Pears'],
            stacked: true,
            style: {
                minGapWidth: 15
            }
        }],
        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'name'
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
        }, {
            xtype: 'segmentedbutton',
            width: '${segBtnWidth}',
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
