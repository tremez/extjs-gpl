Ext.define('KitchenSink.view.grid.FramingButtons', {
    extend: 'Ext.grid.Panel',
    xtype: 'framing-buttons',

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
            height: 300,
            priceWidth: 120,
            pricechangeWidth: 120,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 120
        },
        neptune: {
            width: 750,
            height: 300,
            priceWidth: 120,
            pricechangeWidth: 120,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 120
        },
        graphite: {
            width: 950,
            height: 400,
            priceWidth: 120,
            pricechangeWidth: 120,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150
        },
        'classic-material': {
            width: 950,
            height: 400,
            priceWidth: 120,
            pricechangeWidth: 120,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150
        }
    },
    //</example>

    title: 'Support for standard Panel features such as framing, buttons and toolbars',
    width: '${width}',
    height: '${height}',

    columnLines: true,
    frame: true,
    iconCls: 'framing-buttons-grid',
    store: 'Companies',
    viewModel: true,
    buttonAlign: 'center',

    bind: {
        selection: '{theRow}'
    },

    selModel: {
        type: 'checkboxmodel'
    },

    columns: [{
        text: "Company",
        dataIndex: 'name',

        flex: 1,
        sortable: true
    }, {
        text: "Price",
        dataIndex: 'price',

        width: '${priceWidth}',
        sortable: true,
        formatter: 'usMoney'
    }, {
        text: "Change",
        dataIndex: 'priceChange',
        width: '${pricechangeWidth}',
        sortable: true
    }, {
        text: "% Change",
        dataIndex: 'priceChangePct',

        width: '${percentChangeColumnWidth}',
        sortable: true
    }, {
        text: "Last Updated",
        dataIndex: 'priceLastChange',

        width: '${lastUpdatedColumnWidth}',
        sortable: true,
        formatter: 'date("m/d/Y")'
    }],

    tbar: [{
        text: 'Add Something',
        tooltip: 'Add a new row',
        iconCls: 'framing-buttons-add'
    }, '-', {
        text: 'Options',
        tooltip: 'Set options',
        iconCls: 'framing-buttons-option'
    }, '-', {
        text: 'Remove Something',
        tooltip: 'Remove the selected item',
        iconCls: 'framing-buttons-remove',
        disabled: true,

        bind: {
            disabled: '{!theRow}'
        }
    }],

    fbar: [{
        minWidth: 80,
        text: 'Save'
    }, {
        minWidth: 80,
        text: 'Cancel'
    }]
});
