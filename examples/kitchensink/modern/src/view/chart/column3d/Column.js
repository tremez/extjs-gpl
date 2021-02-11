/**
 * Demonstrates how to use Ext.chart.ColumnChart3D
 */
Ext.define('KitchenSink.view.chart.column3d.Column', {
    extend: 'Ext.Container',
    xtype: 'column-basic-3d',
    controller: 'chart',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/ChartController.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/OrderItems.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            innerPadding: '0 10 0 0',
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
                innerPadding: '0 10 0 0',
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
        innerPadding: '${innerPadding}',
        insetPadding: '${insetPadding}',
        store: {
            type: 'orderitems',
            numRecords: 15
        },
        axes: [{
            type: 'numeric3d',
            position: 'left',
            fields: 'g1'
        }, {
            type: 'category3d',
            position: 'bottom',
            fields: 'name'
        }],
        series: [{
            type: 'bar3d',
            xField: 'name',
            yField: 'g1'
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
