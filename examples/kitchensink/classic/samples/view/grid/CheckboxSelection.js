Ext.define('KitchenSink.view.grid.CheckboxSelection', {
    extend: 'Ext.panel.Panel',
    xtype: 'checkbox-selection',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],
    profiles: {
        classic: {
            width: 700,
            priceWidth: 100,
            pricechangeWidth: 100,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 120
        },
        neptune: {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 100,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 120
        },
        graphite: {
            width: 950,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 170
        },
        'classic-material': {
            width: 950,
            priceWidth: 150,
            pricechangeWidth: 150,
            percentChangeColumnWidth: 150,
            lastUpdatedColumnWidth: 170
        }
    },
    //</example>

    title: 'Grid with Checkbox Selection model',
    width: '${width}',
    height: 700,
    frame: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'grid',
        flex: 0.5,
        title: 'checkOnly: false',

        store: 'Companies',
        columnLines: true,
        selType: 'checkboxmodel',

        columns: [{
            text: "Company",
            dataIndex: 'name',
            flex: 1
        }, {
            text: "Price",
            dataIndex: 'price',
            width: '${priceWidth}',
            formatter: 'usMoney'
        }, {
            text: "Change",
            width: '${pricechangeWidth}',
            dataIndex: 'priceChange'
        }, {
            text: "% Change",
            width: '${percentChangeColumnWidth}',
            dataIndex: 'priceChangePct'
        }, {
            text: "Last Updated",
            width: '${lastUpdatedColumnWidth}',
            dataIndex: 'priceLastChange',

            formatter: 'date("m/d/Y")'
        }]
    }, {
        xtype: 'grid',
        flex: 0.5,
        title: 'checkOnly: true',

        store: 'Companies',
        columnLines: true,
        selModel: {
            type: 'checkboxmodel',
            checkOnly: true
        },

        columns: [{
            text: "Company",
            dataIndex: 'name',
            flex: 1
        }, {
            text: "Price",
            width: '${priceWidth}',
            dataIndex: 'price',

            formatter: 'usMoney'
        }, {
            text: "Change",
            width: '${pricechangeWidth}',
            dataIndex: 'priceChange'
        }, {
            text: "% Change",
            width: '${percentChangeColumnWidth}',
            dataIndex: 'priceChangePct'
        }, {
            text: "Last Updated",
            width: '${lastUpdatedColumnWidth}',
            dataIndex: 'priceLastChange',

            formatter: 'date("m/d/Y")'
        }]
    }]
});
