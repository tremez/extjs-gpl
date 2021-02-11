/**
 * This example shows how to create a grid from a store with
 * the ViewOptions plugin. This plugin allows columns to be
 * shown or hidden as well as being reordered.
 *
 * Long press on a column header to show the options.
 */
Ext.define('KitchenSink.view.grid.addons.ViewOptionsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'view-options-grid',
    controller: 'viewoptions-grid',
    title: 'Grid with View Options',

    requires: [
        'Ext.grid.plugin.ViewOptions'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/ViewOptionsGridController.js'
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
        gridviewoptions: true
    },
    store: 'Companies',
    width: '${width}',

    signTpl: '<span style="' +
            'color:{value:sign("${red}", "${green}")}"' +
        '>{text}</span>',

    columns: [{
        text: 'Company',
        flex: 1,
        minWidth: 100,
        dataIndex: 'name',
        hideable: false
    }, {
        text: 'Phone',
        flex: 1,
        dataIndex: 'phone',
        hidden: true
    }, {
        text: 'Industry',
        flex: 1,
        dataIndex: 'industry',
        hidden: true
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
    }, {
        text: 'Rating',
        width: 75,
        dataIndex: 'rating',
        hidden: true
    }]
});
