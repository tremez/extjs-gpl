/**
 * This example shows how to create a pivot grid and edit the results.
 *
 * DblClick a cell to open the RangeEditor view that helps you update the
 * pivot cell records.
 */
Ext.define('KitchenSink.view.pivot.RangeEditor', {
    extend: 'Ext.Container',
    xtype: 'rangeeditor-pivot-grid',
    controller: 'pivot',

    requires: [
        'Ext.pivot.Grid',
        'Ext.pivot.plugin.RangeEditor'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/pivot/PivotController.js'
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
        plugins: {
            pivotrangeeditor: true
        },
        matrix: {
            type: 'local',
            store: {
                type: 'sales'
            },
            // Configure the aggregate dimensions. Multiple dimensions are supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Total',
                aggregator: 'sum',
                width: 120
            }],
            // Configure the left axis dimensions that will be used to generate the grid rows
            leftAxis: [{
                dataIndex: 'company',
                header: 'Company',
                width: 120
            }, {
                dataIndex: 'country',
                header: 'Country',
                direction: 'DESC',
                width: 150
            }],
            /**
             * Configure the top axis dimensions that will be used to generate
             * the columns.
             *
             * When columns are generated the aggregate dimensions are also used.
             * If multiple aggregation dimensions are defined then each top axis
             * result will have in the end a column header with children columns
             * for each aggregate dimension defined.
             */
            topAxis: [{
                dataIndex: 'year',
                header: 'Year'
            }, {
                dataIndex: 'month',
                header: 'Month',
                labelRenderer: 'monthLabelRenderer'
            }]
        },
        // These events are fired by the RangeEditor plugin
        listeners: {
            pivotbeforeupdate: 'onPivotBeforeUpdate',
            pivotupdate: 'onPivotUpdate'
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
            text: 'Expand all',
            handler: 'expandAll'
        }, {
            text: 'Collapse all',
            handler: 'collapseAll'
        }]
    }]
});
