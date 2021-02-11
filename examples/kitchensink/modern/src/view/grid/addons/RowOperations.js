/**
 * The RowOperations grid plugin allows for multiple rows to be selected
 * and manipulated by adding buttons to the grid header.
 */
Ext.define('KitchenSink.view.grid.addons.RowOperations', {
    extend: 'Ext.Container',
    xtype: 'rowoperations-grid',
    controller: 'rowoperations-grid',

    requires: [
        'Ext.grid.Grid',
        'Ext.grid.plugin.RowOperations'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/RowOperationsController.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }, {
        type: 'Store',
        path: 'app/store/Companies.js'
    }],

    profiles: {
        defaults: {
            priceWidth: 90,
            changeColumnWidth: 90,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 125,
            green: '#73b51e',
            red: '#cf4c35',
            height: 400,
            width: 600
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    width: '${width}',
    layout: 'fit',

    items: [{
        xtype: 'grid',
        title: 'Row Operations',
        reference: 'operations-grid',

        store: 'Companies',

        plugins: {
            rowoperations: {
                // This config replaces the default "Delete" button
                // provided by the plugin.
                operation: {
                    text: 'Operations',
                    ui: 'alt',

                    menu: [{
                        text: 'Archive',
                        iconCls: 'x-fa fa-archive',
                        handler: 'onArchive'
                    }, {
                        text: 'Delete',
                        iconCls: 'x-fa fa-trash-alt',
                        handler: 'onDelete'
                    }]
                }
            }
        },

        columns: [{
            text: 'Company',
            flex: 1,
            minWidth: 100,
            dataIndex: 'name'
        }, {
            text: 'Price',
            width: '${priceWidth}',
            dataIndex: 'price',
            formatter: 'usMoney'
        }, {
            text: 'Change',
            width: '${changeColumnWidth}',
            dataIndex: 'change',
            renderer: 'renderChange',
            cell: {
                encodeHtml: false
            }
        }, {
            text: '% Change',
            width: '${percentChangeColumnWidth}',
            dataIndex: 'pctChange',
            renderer: 'renderPercent',
            cell: {
                encodeHtml: false
            }
        }, {
            text: 'Last Updated',
            width: '${lastUpdatedColumnWidth}',
            dataIndex: 'lastChange',
            formatter: 'date("m/d/Y")'
        }]
    }],

    signTpl: '<span style="' +
            'color:{value:sign("${red}", "${green}")}"' +
        '>{text}</span>'
});
