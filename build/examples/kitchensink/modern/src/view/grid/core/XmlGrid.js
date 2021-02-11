/**
 * This example shows how to create a grid from XML data.
 */
Ext.define('KitchenSink.view.grid.core.XmlGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'xml-grid',
    title: 'XML Grid',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/Books.js'
    }, {
        type: 'Model',
        path: 'app/model/grid/Book.js'
    }],

    profiles: {
        defaults: {
            height: 450,
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
    width: '${width}',

    store: {
        type: 'books',
        autoLoad: true
    },

    columns: [{
        text: 'Author',
        dataIndex: 'Author',
        flex: 1
    }, {
        text: 'Title',
        dataIndex: 'Title',
        flex: 1
    }, {
        text: 'Manufacturer',
        dataIndex: 'Manufacturer',
        width: 125
    }, {
        text: 'Product Group',
        dataIndex: 'ProductGroup',
        width: 125
    }]
});
