/**
 * This is an example of using the grid with a RowWidget plugin that
 * adds the ability to have a second row body which expands/contracts
 * and which contains a Component.
 *
 * The component in the expansion row is primed with the associated
 * grid row's record.
 *
 * The expand/contract behavior is configurable to react on clicking
 * of the column, double click of the row, and/or hitting enter while
 * a row is selected.
 */
Ext.define('KitchenSink.view.grid.RowWidget', {
    extend: 'Ext.grid.Panel',

    xtype: 'row-widget-grid',
    store: 'Companies',
    title: 'Expander rows to show company orders',

    columns: [{
        text: 'Id',
        dataIndex: 'id'
    }, {
        text: 'Name',
        dataIndex: 'name',
        flex: 1,
        hideable: false
    }, {
        width: 140,
        text: 'Phone',
        dataIndex: 'phone'
    }],
    width: '${width}',
    height: 450,
    leadingBufferZone: 8,
    trailingBufferZone: 8,

    //<example>
    profiles: {
        classic: {
            width: 750,
            orderWidth: 75,
            productCodeWidth: 265,
            quantityWidth: 100,
            dateColumnWidth: 120,
            shippedWidth: 75
        },
        neptune: {
            width: 750,
            orderWidth: 75,
            productCodeWidth: 265,
            quantityWidth: 100,
            dateColumnWidth: 120,
            shippedWidth: 75
        },
        graphite: {
            width: 900,
            orderWidth: 100,
            productCodeWidt: 350,
            quantityWidth: 150,
            dateColumnWidth: 150,
            shippedWidth: 100
        },
        'classic-material': {
            width: 900,
            orderWidth: 100,
            productCodeWidt: 350,
            quantityWidth: 150,
            dateColumnWidth: 150,
            shippedWidth: 100
        }
    },
    otherContent: [{
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }, {
        type: 'Model',
        path: 'app/model/Order.js'
    }],
    //</example>

    plugins: {
        rowwidget: {
            // The widget definition describes a widget to be rendered into the
            // expansion row. It has access to the application's ViewModel
            // hierarchy. Its immediate ViewModel contains a record and
            // recordIndex property. These, or any property of the record
            // (including association stores) may be bound to the widget.
            //
            // See the Order model definition with the association declared to
            // Company. Every Company record will be decorated with an "orders"
            // method which, when called yields a store containing associated
            // orders.
            widget: {
                xtype: 'grid',
                autoLoad: true,
                bind: {
                    store: '{record.orders}',
                    title: 'Orders for {record.name}'
                },
                columns: [{
                    text: 'Order Id',
                    dataIndex: 'id',
                    width: '${orderWidth}'
                }, {
                    text: 'Procuct code',
                    dataIndex: 'productCode',
                    width: '${productCodeWidth}'
                }, {
                    text: 'Quantity',
                    dataIndex: 'quantity',
                    xtype: 'numbercolumn',
                    width: '${quantityWidth}',
                    align: 'right'
                }, {
                    xtype: 'datecolumn',
                    format: 'Y-m-d',
                    width: '${dateColumnWidth}',
                    text: 'Date',
                    dataIndex: 'date'
                }, {
                    text: 'Shipped',
                    xtype: 'checkcolumn',
                    dataIndex: 'shipped',
                    width: '${shippedWidth}'
                }]
            }
        }
    }
});
