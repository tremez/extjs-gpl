/**
 * This example shows how to achieve "freeze pane" locking functionality similar to Excel.
 *
 * Columns may be locked or unlocked by dragging them across into the opposite side, or
 * by using the column's header menu.
 *
 * The "Price" column is not lockable, and may not be dragged into the locked side, or
 * locked using the header menu.
 *
 * It is not possible to lock all columns using the user interface. The unlocked side must
 * always contain at least one column.
 *
 * There is also an initially hidden "Tall Header" that shows wrapping header text.'
 */
Ext.define('KitchenSink.view.grid.LockingGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'locking-grid',
    controller: 'basicgrid',

    requires: [
        'Ext.grid.RowNumberer'
    ],

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
            gainColor: 'green',
            lossColor: 'red',
            percentageChangeWidth: 105
        },
        neptune: {
            gainColor: '#73b51e',
            lossColor: '#cf4c35',
            percentageChangeWidth: 105
        },
        graphite: {
            gainColor: 'unset',
            lossColor: 'unset',
            percentageChangeWidth: 135
        },
        'classic-material': {
            gainColor: 'unset',
            lossColor: 'unset',
            percentageChangeWidth: 150
        }
    },
    //</example>

    title: 'Locking Grid',
    height: 350,
    width: 600,

    store: 'Companies',
    columnLines: true,
    // There is no asymmetric data, we do not need to go to the expense of synching row heights
    syncRowHeight: false,
    signTpl: '<span style="' +
            'color:{value:sign(\'${lossColor}\',\'${gainColor}\')}"' +
        '>{text}</span>',

    columns: [{
        xtype: 'rownumberer'
    }, {
        text: 'Company Name',
        dataIndex: 'name',
        locked: true,

        width: 230,
        sortable: false
    }, {
        text: 'Price',
        dataIndex: 'price',
        lockable: false,

        width: 80,
        sortable: true,
        formatter: 'usMoney'
    }, {
        text: 'Tall<br>Header',
        dataIndex: 'rating',

        hidden: true,
        align: 'center',
        width: 70,
        sortable: false,
        innerCls: 'ks-font-larger',
        formatter: 'pick("Ⓐ","Ⓑ","Ⓒ")'
    }, {
        text: 'Change',
        dataIndex: 'priceChange',

        width: 90,
        sortable: true,
        renderer: 'renderChange'
    }, {
        text: '% Change',
        dataIndex: 'priceChangePct',

        width: '${percentageChangeWidth}',
        sortable: true,
        renderer: 'renderChange'
    }, {
        text: 'Last Updated',
        dataIndex: 'priceLastChange',

        width: 135,
        sortable: true,
        formatter: 'date("m/d/Y")'
    }]
});
