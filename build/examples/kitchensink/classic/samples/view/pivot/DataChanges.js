/**
 *
 * This example shows that the pivot grid recalculates when store data
 * has been changed.
 *
 * Use the buttons add/update/remove/clear store data.
 */
Ext.define('KitchenSink.view.pivot.DataChanges', {
    extend: 'Ext.pivot.Grid',
    xtype: 'datachanges-pivot-grid',

    requires: [
        'KitchenSink.view.pivot.DataChangesController',
        'KitchenSink.model.pivot.Sale'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/pivot/DataChangesController.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/pivot/Sale.js'
    }],
    profiles: {
        classic: {
            width: 600,
            height: 550,
            columnLines: true
        },
        neptune: {
            width: 750,
            height: 600,
            columnLines: true
        },
        graphite: {
            width: 950,
            height: 600,
            columnLines: true
        },
        'classic-material': {
            width: 600,
            height: 600,
            columnLines: false
        }
    },
    //</example>

    controller: 'datachangespivot',

    title: 'Data changes',
    width: '${width}',
    height: '${height}',
    collapsible: true,
    multiSelect: true,
    columnLines: '${columnLines}',

    selModel: {
        type: 'spreadsheet'
    },

    matrix: {
        type: 'local',
        store: {
            autoLoad: true,
            autoDestroy: true,
            model: 'KitchenSink.model.pivot.Sale',

            proxy: {
                // load using HTTP
                type: 'memory',
                // the return will be JSON, so lets set up a reader
                reader: {
                    type: 'json'
                }
            }
        },
        // Configure the aggregate dimensions. Multiple dimensions
        // are supported.
        aggregate: [{
            dataIndex: 'value',
            header: 'Total',
            aggregator: 'sum'
        }, {
            dataIndex: 'value',
            header: 'Count',
            aggregator: 'count'
        }],

        // Configure the left axis dimensions that will be used to generate
        // the grid rows
        leftAxis: [{
            dataIndex: 'year',
            header: 'Year'
        }, {
            dataIndex: 'person',
            header: 'Person'
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
            dataIndex: 'country',
            header: 'Country'
        }]
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
