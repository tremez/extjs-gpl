/**
 * The RowExpander grid plugin allows for extra data to be displayed
 * in the row's body. This extra data is hidden when the row is collapsed
 * but when you click on the first column to expand the row, the row body
 * will then be shown.
 */
Ext.define('KitchenSink.view.grid.addons.RowExpanderGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'row-expander-grid',
    controller: 'rowexpander-grid',
    title: 'Row Expander Grid',

    requires: [
        'Ext.grid.plugin.RowExpander'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/RowExpanderGridController.js'
    }, {
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],

    profiles: {
        defaults: {
            priceWidth: 75,
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
    plugins: {
        rowexpander: true
    },
    store: 'Companies',
    width: '${width}',

    itemConfig: {
        body: {
            tpl: '<div>Industry: {industry}</div>' +
                 '<div>Last Updated: {lastChange:date("Y-m-d g:ia")}</div>' +
                 '<div style="margin-top: 1em;">{desc}</div>'
        }
    },

    signTpl: '<span style="' +
            'color:{value:sign("${red}", "${green}")}"' +
        '>{text}</span>',

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
});
