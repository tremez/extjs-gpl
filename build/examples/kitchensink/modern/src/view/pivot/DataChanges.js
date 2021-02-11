/**
 * This example shows that the pivot grid recalculates when store data has been changed.
 *
 * Use the buttons add/update/remove/clear store data.
 */
Ext.define('KitchenSink.view.pivot.DataChanges', {
    extend: 'Ext.Container',
    xtype: 'datachanges-pivot-grid',
    controller: 'datachangespivot',

    requires: [
        'Ext.pivot.Grid'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/pivot/DataChangesController.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Sale.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            width: 500
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
        matrix: {
            type: 'local',
            store: {
                autoLoad: true,
                autoDestroy: true,
                model: 'KitchenSink.model.Sale',
                proxy: {
                    // load using HTTP
                    type: 'memory',
                    // the return will be JSON, so lets set up a reader
                    reader: {
                        type: 'json'
                    }
                }
            },
            // Configure the aggregate dimensions. Multiple dimensions are supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Total',
                aggregator: 'sum'
            }, {
                dataIndex: 'value',
                header: 'Count',
                aggregator: 'count'
            }],
            // Configure the left axis dimensions that will be used to generate the
            // grid rows
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
