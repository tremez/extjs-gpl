/**
 * This example shows how to create multiple active UI event handling widgets
 * from a single Action definition.
 *
 * Both Buttons and MenuItems can be created from the same Action instance.
 * Action's enable, disable, hide, show and setText methods affect every Component
 * created from that Action.
 *
 * In this example, the Action is disabled when there is no grid selection
 * (spacebar deselects), and this disables both Buttons and MenuItems.
 */
Ext.define('KitchenSink.view.grid.ActionsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'actions-grid',
    controller: 'actionsgrid',

    requires: [
        'Ext.Action'
    ],

    title: 'Actions Grid',
    store: 'Companies',
    width: '${width}',
    height: '${height}',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/ActionsGridController.js'
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
            height: 350,
            priceWidth: 75,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 75,
            lastUpdatedColumnWidth: 85,
            gainColor: 'green',
            lossColor: 'red'
        },
        neptune: {
            width: 700,
            height: 350,
            priceWidth: 95,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            gainColor: '#73b51e',
            lossColor: '#cf4c35'
        },
        graphite: {
            width: 750,
            height: 450,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: 'unset',
            lossColor: 'unset'
        },
        'classic-material': {
            width: 750,
            height: 450,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: 'unset',
            lossColor: 'unset'
        }
    },
    //</example>

    viewConfig: {
        listeners: {
            itemcontextmenu: 'onGridContextMenu',
            selectionchange: 'onSelectionChange'
        }
    },

    // Clearing selection disables the Actions.
    allowDeselect: true,
    defaultActionType: 'button',
    actions: {
        buy: {
            iconCls: 'array-grid-buy-col',
            text: 'Buy stock',
            disabled: true,
            handler: 'handleBuyAction'  // see Controller
        },
        sell: {
            iconCls: 'array-grid-sell-col',
            text: 'Sell stock',
            disabled: true,
            handler: 'handleSellAction'
        }
    },

    tbar: [
        // Actions can be converted into Buttons.
        '@buy', '@sell'
    ],

    columns: [{
        text: 'Company',
        flex: 1,
        sortable: false,
        dataIndex: 'name'
    }, {
        text: 'Price',
        width: '${priceWidth}',
        sortable: true,
        formatter: 'usMoney',
        dataIndex: 'price'
    }, {
        text: 'Change',
        width: '${pricechangeWidth}',
        sortable: true,
        renderer: 'renderChange',
        dataIndex: 'priceChange'
    }, {
        text: '% Change',
        width: '${percentChangeColumnWidth}',
        sortable: true,
        renderer: 'renderPctChange',
        dataIndex: 'priceChangePct'
    }, {
        text: 'Last Updated',
        width: '${lastUpdatedColumnWidth}',
        sortable: true,
        formatter: 'date("m/d/Y")',
        dataIndex: 'priceLastChange'
    }]
});
