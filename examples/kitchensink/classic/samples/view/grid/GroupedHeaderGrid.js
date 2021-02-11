/**
 * This example shows how to create a grid with column headers which are nested within
 * category headers.
 *
 * Category headers do not reference Model fields via a `dataIndex`, rather they contain
 * child header definitions (which may themselves either contain a `dataIndex` or more
 * levels of headers).
 */
Ext.define('KitchenSink.view.grid.GroupedHeaderGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'grouped-header-grid',
    controller: 'basicgrid',

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
            changeColumnWidth: 80,
            lastUpdatedColumnWidth: 85,
            percentChangeColumnWidth: 75,
            gainColor: 'green',
            lossColor: 'red'
        },
        neptune: {
            width: 675,
            priceWidth: 75,
            changeColumnWidth: 80,
            lastUpdatedColumnWidth: 115,
            percentChangeColumnWidth: 100,
            gainColor: '#73b51e',
            lossColor: '#cf4c35'
        },
        'neptune-touch': {
            width: 720,
            priceWidth: 75,
            changeColumnWidth: 90,
            lastUpdatedColumnWidth: 125,
            percentChangeColumnWidth: 115
        },
        graphite: {
            width: 750,
            priceWidth: 85,
            changeColumnWidth: 110,
            lastUpdatedColumnWidth: 155,
            percentChangeColumnWidth: 135,
            gainColor: 'unset',
            lossColor: 'unset'
        },
        'classic-material': {
            width: 750,
            priceWidth: 85,
            changeColumnWidth: 110,
            lastUpdatedColumnWidth: 155,
            percentChangeColumnWidth: 135,
            gainColor: 'unset',
            lossColor: 'unset'
        }
    },
    //</example>

    title: 'Grouped Header Grid',
    width: '${width}',
    height: 350,

    columnLines: true,
    signTpl: '<span style="' +
            'color:{value:sign(\'${lossColor}\',\'${gainColor}\')}"' +
        '>{text}</span>',

    store: {
        type: 'companies',
        sorters: {
            property: 'name',
            direction: 'DESC'
        }
    },

    columns: [{
        text: 'Company',
        dataIndex: 'name',

        flex: 1,
        sortable: true
    }, {
        text: 'Stock Price',

        columns: [{
            text: 'Price',
            dataIndex: 'price',

            width: '${priceWidth}',
            sortable: true,
            formatter: 'usMoney'
        }, {
            text: 'Change',
            dataIndex: 'priceChange',

            width: '${changeColumnWidth}',
            sortable: true,
            renderer: 'renderChange'
        }, {
            text: '% Change',
            dataIndex: 'priceChangePct',

            width: '${percentChangeColumnWidth}',
            sortable: true,
            renderer: 'renderPercent'
        }]
    }, {
        text: 'Last Updated',
        dataIndex: 'priceLastChange',

        width: '${lastUpdatedColumnWidth}',
        sortable: true,
        formatter: 'date("m/d/Y")'
    }]
});
