/**
 * This example shows how to use widgets in a pivot grid.
 */
Ext.define('KitchenSink.view.pivot.Widgets', {
    extend: 'Ext.Container',
    xtype: 'widgets-pivot-grid',
    controller: 'pivotwidgets',

    requires: [
        'Ext.pivot.Grid'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/pivot/WidgetsController.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Sale.js'
    }, {
        type: 'Store',
        path: 'modern/src/store/Sales.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            width: 600
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                height: undefined,
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the grid's shadow
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'pivotgrid',
        shadow: '${shadow}',
        reference: 'pivotgrid',
        selModel: {
            type: 'cellmodel'
        },
        matrix: {
            type: 'local',
            store: {
                type: 'sales'
            },
            // change the text of the column generated for all left axis dimensions
            textRowLabels: 'Custom header',
            // change the width of the column generated for all left axis dimensions
            compactViewColumnWidth: 210,
            viewLayoutType: 'compact',
            // Configure the aggregate dimensions. Multiple dimensions are supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Performance',
                aggregator: 'getPerformance',
                width: 90,
                // Define here column specific configs for all columns
                // generated for this aggregate dimension
                column: {
                    cell: {
                        xtype: 'widgetcell',
                        forceWidth: true,
                        widget: {
                            xtype: 'sparklineline'
                        }
                    }
                }
            }, {
                dataIndex: 'value',
                header: 'Count',
                aggregator: 'count'
            }],
            // Configure the left axis dimensions that will be used to generate rows
            leftAxis: [{
                dataIndex: 'person',
                header: 'Person'
            }, {
                dataIndex: 'company',
                header: 'Company',
                sortable: false
            }, {
                dataIndex: 'country',
                header: 'Country'
            }],
            // Configure the top axis dimensions that will be used to generate the
            // columns. When columns are generated the aggregate dimensions are also
            // used. If multiple aggregation dimensions are defined then each
            // top-axis result will have in the end a column header with children
            // columns for each aggregate dimension defined.
            topAxis: [{
                dataIndex: 'year',
                header: 'Year'
            }]
        },
        listeners: {
            pivotgroupexpand: 'onPivotGroupExpand',
            pivotgroupcollapse: 'onPivotGroupCollapse'
        }
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
            text: 'Change data',
            menu: [{
                text: 'Add',
                iconCls: 'x-fa fa-plus',
                handler: 'onAddData'
            }, {
                text: 'Update',
                iconCls: 'x-fa fa-edit',
                handler: 'onUpdateData'
            }, {
                text: 'Remove',
                iconCls: 'x-fa fa-minus',
                handler: 'onRemoveData'
            }, {
                text: 'Clear all',
                iconCls: 'x-fa fa-trash-alt',
                handler: 'onClearData'
            }]
        }]
    }]
});
