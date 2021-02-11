/**
 * Grids often need to show extra details that may not fit
 * in a column's cell, or a column's header.
 *
 * The application-wide tooltip singleton performs this task on all elements
 * which have the data-qoverflow attribute set and which have the
 * text-overflow:ellipsis style.
 *
 * The overflow tip is configured allowOver: true to indicate that mouseovering
 * the tip (or tapping it on touch platforms) cancels the auto dismiss timer
 * to give the user time to read long text.
 *
 * Grids set this property on text cells and column header titles.
 */
Ext.define('KitchenSink.view.grid.addons.CellOverflowTip', {
    extend: 'Ext.grid.Grid',
    xtype: 'cell-overflow-grid',
    controller: 'rowbody-grid',
    title: 'Cell Overflow Tip Grid',

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
        sortable: false, // Tap shows the tip
        text: 'Last Updated Date',
        width: '${lastUpdatedColumnWidth}',
        dataIndex: 'lastChange',
        formatter: 'date("m/d/Y")'
    }, {
        text: 'Description',
        flex: 1,
        minWidth: 100,
        dataIndex: 'desc'
    }]
});
