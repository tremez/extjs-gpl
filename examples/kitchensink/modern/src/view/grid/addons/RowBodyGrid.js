/**
 * Grids often need to show extra details that may not fit
 * in a column's cell. A grid can accept a template that will
 * show this additional data in the body of the row and will
 * span the full width of all the grid columns.
 */
Ext.define('KitchenSink.view.grid.addons.RowBodyGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'row-body-grid',
    controller: 'rowbody-grid',
    title: 'Row Body Grid',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/RowBodyGridController.js'
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
    store: 'Companies',
    width: '${width}',

    // The template in our row body makes row height vary
    variableHeights: true,

    itemConfig: {
        collapsed: false,
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
