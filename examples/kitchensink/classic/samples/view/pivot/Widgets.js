/**
 * This example shows how to use widgets in a pivot grid.
 */
Ext.define('KitchenSink.view.pivot.Widgets', {
    extend: 'Ext.pivot.Grid',
    xtype: 'widgets-pivot-grid',
    controller: 'pivotwidgets',

    requires: [
        'KitchenSink.store.pivot.Sales',
        'KitchenSink.view.pivot.WidgetsController'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/pivot/WidgetsController.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/pivot/Sale.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/pivot/Sales.js'
    }],
    profiles: {
        classic: {
            width: 600,
            height: 350,
            performanceWidth: 90
        },
        neptune: {
            width: 750,
            height: 350,
            performanceWidth: 90
        },
        graphite: {
            width: 750,
            height: 600,
            performanceWidth: 150
        },
        'classic-material': {
            width: 750,
            height: 600,
            performanceWidth: 150
        }
    },
    //</example>

    title: 'Widgets in pivot grid',
    width: '${width}',
    height: '${height}',
    collapsible: true,
    multiSelect: true,

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
            width: '${performanceWidth}',

            // Define here column specific configs for all columns
            // generated for this aggregate dimension
            column: {
                xtype: 'widgetcolumn',
                widget: {
                    xtype: 'sparklineline'
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
        // used. If multiple aggregation dimensions are defined then each top-axis
        // result will have in the end a column header with children columns for
        // each aggregate dimension defined.
        topAxis: [{
            dataIndex: 'year',
            header: 'Year'
        }]
    },

    listeners: {
        pivotgroupexpand: 'onPivotGroupExpand',
        pivotgroupcollapse: 'onPivotGroupCollapse'
    },

    tbar: [{
        text: 'Add data',
        handler: 'onAddData'
    }, {
        text: 'Update data',
        handler: 'onUpdateData'
    }, {
        text: 'Remove data',
        handler: 'onRemoveData'
    }, {
        text: 'Clear all data',
        handler: 'onClearData'
    }]
});
