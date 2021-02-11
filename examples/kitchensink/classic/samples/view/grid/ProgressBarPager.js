/**
 * This example demonstrates using a custom paging display.
 */
Ext.define('KitchenSink.view.grid.ProgressBarPager', {
    extend: 'Ext.grid.Panel',
    xtype: 'progress-bar-pager',
    controller: 'basicgrid',

    requires: [
        'Ext.toolbar.Paging',
        'Ext.ux.ProgressBarPager'
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
            width: 850,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 175,
            gainColor: 'unset',
            lossColor: 'unset'
        },
        'classic-material': {
            width: 850,
            priceWidth: 100,
            pricechangeWidth: 110,
            percentChangeColumnWidth: 120,
            lastUpdatedColumnWidth: 175,
            gainColor: 'unset',
            lossColor: 'unset'
        }
    },
    //</example>

    title: 'Progress Bar Pager',
    width: '${width}',
    height: 320,

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

        width: '${pricechangeWidth}',
        sortable: true,
        renderer: 'renderChange'
    }, {
        text: '% Change',
        dataIndex: 'priceChangePct',

        width: '${percentChangeColumnWidth}',
        sortable: true,
        renderer: 'renderPercent'
    }, {
        text: 'Last Updated',
        dataIndex: 'priceLastChange',

        width: '${lastUpdatedColumnWidth}',
        sortable: true,
        formatter: 'date("m/d/Y")'
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        plugins: {
            'ux-progressbarpager': true
        }
    }
});
