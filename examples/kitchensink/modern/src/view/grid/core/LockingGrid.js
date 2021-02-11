/**
 * This example shows how to create a grid from a store. The grid shows
 * how to use a column renderer and formatter and how to disable the
 * HTML encoding.
 *
 * This illustrates multi column sorting.
 */
Ext.define('KitchenSink.view.grid.core.LockingGrid', {
    extend: 'Ext.grid.locked.Grid',
    xtype: 'locking-grid',
    controller: 'basic-grid',
    title: 'Locked Grid',

    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.Editable'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/core/BasicGridController.js'
    }, {
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],

    profiles: {
        defaults: {
            green: '#73b51e',
            red: '#cf4c35',
            height: 400,
            width: 700
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    /**
     * We can pass any grid config or plugin we want to apply to 'gridDefaults'
     * This applies to all existing grid regions.
     */
    gridDefaults: {
        platformConfig: {
            desktop: {
                plugins: {
                    gridcellediting: true
                }
            },

            '!desktop': {
                plugins: {
                    grideditable: true
                }
            }
        }
    },
    height: '${height}',
    store: 'Companies',
    width: '${width}',

    columns: [{
        locked: true,
        text: 'Company',
        width: 200,
        dataIndex: 'name',
        minWidth: 100,
        menu: {
            customFirst: {
                text: 'Custom First',
                weight: -200,
                handler: 'onCustomFirst'
            },
            customLast: {
                text: 'Custom Last',
                separator: true,
                handler: 'onCustomLast'
            }
        }
    }, {
        locked: true,
        text: 'Price',
        width: 75,
        dataIndex: 'price',
        formatter: 'usMoney',
        editable: true,
        editor: {
            xtype: 'numberfield',
            required: true,
            validators: {
                type: 'number',
                message: 'Invalid price'
            }
        }
    }, {
        locked: 'left',
        width: 70,

        cell: {
            tools: {
                approve: {
                    iconCls: 'x-fa fa-check green',
                    handler: 'onApprove'
                },
                decline: {
                    iconCls: 'x-fa fa-ban red',
                    handler: 'onDecline',
                    weight: 1
                }
            }
        }
    }, {
        locked: 'right',
        text: 'Change',
        width: 120,
        renderer: 'renderChange',
        dataIndex: 'change',
        cell: {
            encodeHtml: false
        }
    }, {
        text: '% Change',
        width: 130,
        dataIndex: 'pctChange',
        renderer: 'renderPercent',
        cell: {
            encodeHtml: false
        }
    }, {
        text: 'Last Updated',
        width: 150,
        dataIndex: 'lastChange',
        formatter: 'date("m/d/Y")'
    }, {
        text: 'Industry',
        width: 150,
        dataIndex: 'industry'
    }],

    signTpl: '<span style="' +
        'color:{value:sign("${red}", "${green}")}"' +
        '>{text}</span>'
});
