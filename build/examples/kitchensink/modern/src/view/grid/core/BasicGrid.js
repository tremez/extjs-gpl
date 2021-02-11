/**
 * This example shows how to create a grid from a store. The grid shows
 * how to use a column renderer and formatter and how to disable the
 * HTML encoding.
 *
 * This illustrates multi column sorting.
 */
Ext.define('KitchenSink.view.grid.core.BasicGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'array-grid',
    controller: 'basic-grid',
    title: 'Basic Grid',

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

    height: '${height}',
    store: 'Companies',
    width: '${width}',
    multiColumnSort: true,

    columns: [{
        text: 'Company',
        flex: 1,
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
        text: 'Price',
        width: 75,
        dataIndex: 'price',
        formatter: 'usMoney'
    }, {
        text: 'Change',
        width: 90,
        renderer: 'renderChange',
        dataIndex: 'change',
        cell: {
            encodeHtml: false
        }
    }, {
        text: '% Change',
        width: 100,
        dataIndex: 'pctChange',
        renderer: 'renderPercent',
        cell: {
            encodeHtml: false
        }
    }, {
        text: 'Last Updated',
        width: 125,
        dataIndex: 'lastChange',
        formatter: 'date("m/d/Y")'
    }, {
        width: 70,
        hideable: false,

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
    }],

    signTpl: '<span style="' +
            'color:{value:sign("${red}", "${green}")}"' +
        '>{text}</span>'
});
