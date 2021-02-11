/**
 * This example demonstrates using a custom paging display.
 */
Ext.define('KitchenSink.view.grid.SlidingPager', {
    extend: 'Ext.grid.Panel',
    xtype: 'sliding-pager',
    controller: 'basicgrid',

    requires: [
        'Ext.toolbar.Paging',
        'Ext.ux.SlidingPager'
    ],

    //<example>
    otherContent: [{
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
            lossColor: 'red'
        },
        neptune: {
            width: 650,
            priceWidth: 75,
            pricechangeWidth: 80,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            gainColor: '#73b51e',
            lossColor: '#cf4c35'
        },
        graphite: {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: 'unset',
            lossColor: 'unset'
        },
        'classic-material': {
            width: 750,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 150,
            gainColor: 'unset',
            lossColor: 'unset'
        }
    },
    //</example>

    title: 'Sliding Pager',
    height: 460,
    width: '${width}',

    autoLoad: true,
    frame: true,
    store: {
        type: 'companies',
        pageSize: 10,
        remoteSort: true
    },
    signTpl: '<span style="' +
            'color:{value:sign(\'${lossColor}\',\'${gainColor}\')}"' +
        '>{text}</span>',

    columns: [{
        text: 'Company',
        dataIndex: 'name',

        sortable: true,
        flex: 1
    }, {
        text: 'Price',
        dataIndex: 'price',

        sortable: true,
        formatter: 'usMoney',
        width: '${priceWidth}'
    }, {
        text: 'Change',
        dataIndex: 'priceChange',

        sortable: true,
        renderer: 'renderChange',
        width: '${pricechangeWidth}'
    }, {
        text: '% Change',
        dataIndex: 'priceChangePct',

        sortable: true,
        renderer: 'renderPercent',
        width: '${percentChangeColumnWidth}'
    }, {
        text: 'Last Updated',
        dataIndex: 'priceLastChange',

        sortable: true,
        formatter: 'date("m/d/Y")',
        width: '${lastUpdatedColumnWidth}'
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        plugins: {
            'ux-slidingpager': true
        }
    }
});
