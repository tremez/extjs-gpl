/**
 * This example shows how to create a grid from a store.
 *
 * The grid is stateful so you can move or hide columns,
 * reload the page, and come back to the grid in the same
 * state you left it in.
 *
 * Cell text is selectable due to use of the `enableTextSelection`.
 *
 * It uses an ActionColumn to display clickable icons
 * which are linked to controller methods.
 */
Ext.define('KitchenSink.view.grid.BasicGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'array-grid',
    controller: 'basicgrid',

    requires: [
        'Ext.grid.column.Action'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/BasicGridController.js'
    }, {
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],
    profiles: {
        classic: {
            width: 600,
            priceWidth: 75,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 75,
            lastUpdatedColumnWidth: 85,
            gainColor: 'green',
            lossColor: 'red',
            headerBorder: false,
            actionColumnWidth: 50
        },
        neptune: {
            width: 750,
            priceWidth: 95,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            gainColor: '#73b51e',
            lossColor: '#cf4c35',
            headerBorder: false,
            actionColumnWidth: 50
        },
        graphite: {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: 'unset',
            lossColor: 'unset',
            headerBorder: false,
            actionColumnWidth: 50
        },
        'classic-material': {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: '#4caf50',
            lossColor: '#f44336',
            headerBorder: true,
            actionColumnWidth: 80
        }
    },
    //</example>

    title: 'Basic Grid',
    width: '${width}',
    height: 350,

    store: 'Companies',
    stateful: true,
    collapsible: true,
    multiSelect: true,
    stateId: 'stateGrid',
    headerBorders: '${headerBorder}',

    viewConfig: {
        enableTextSelection: true
    },

    columns: [{
        text: 'Company',
        flex: 1,
        dataIndex: 'name'
    }, {
        text: 'Price',
        width: '${priceWidth}',
        formatter: 'usMoney',
        dataIndex: 'price'
    }, {
        text: 'Change',
        width: '${pricechangeWidth}',
        renderer: 'renderChange',
        dataIndex: 'priceChange'
    }, {
        text: '% Change',
        width: '${percentChangeColumnWidth}',
        renderer: 'renderPercent',
        dataIndex: 'priceChangePct'
    }, {
        text: 'Last Updated',
        width: '${lastUpdatedColumnWidth}',
        formatter: 'date("m/d/Y")',
        dataIndex: 'priceLastChange'
    }, {
        xtype: 'actioncolumn',
        width: '${actionColumnWidth}',
        menuDisabled: true,
        sortable: false,
        items: [{
            iconCls: 'x-fa fa-check green icon-margin',
            handler: 'onApprove'
        }, {
            iconCls: 'x-fa fa-ban red',
            handler: 'onDecline'
        }]
    }],

    signTpl: '<span style="' +
        'color:{value:sign(\'${lossColor}\',\'${gainColor}\')}"' +
        '>{text}</span>'
});
