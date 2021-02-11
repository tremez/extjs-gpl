/**
 * This example shows how to create a grid from XML data. The grid is stateful so you can
 * move or hide columns, reload the page, and come back to the grid in the same state you
 * left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('KitchenSink.view.grid.XmlGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'xml-grid',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/Books.js'
    }, {
        type: 'Model',
        path: 'app/model/grid/Book.js'
    }],
    profiles: {
        classic: {
            width: 600,
            tittleWidth: 180,
            manufacturerWidth: 115,
            productGroupWidth: 100
        },
        neptune: {
            width: 650,
            tittleWidth: 180,
            manufacturerWidth: 115,
            productGroupWidth: 100
        },
        graphite: {
            width: 900,
            tittleWidth: 300,
            manufacturerWidth: 170,
            productGroupWidth: 150
        },
        'classic-material': {
            width: 900,
            tittleWidth: 300,
            manufacturerWidth: 170,
            productGroupWidth: 150
        }
    },
    //</example>

    title: 'XML Grid',
    width: '${width}',
    height: 350,

    autoLoad: true, // wait for render to load the store
    stateful: true,
    collapsible: true,
    multiSelect: true,
    stateId: 'stateXmlGrid',

    store: {
        type: 'books',
        autoLoad: false // don't load on create (wait for render)
    },
    viewConfig: {
        enableTextSelection: true
    },

    columns: [{
        text: "Author",
        dataIndex: 'Author',
        flex: 1
    }, {
        text: "Title",
        dataIndex: 'Title',
        width: '${tittleWidth}'
    }, {
        text: "Manufacturer",
        dataIndex: 'Manufacturer',
        width: '${manufacturerWidth}'
    }, {
        text: "Product Group",
        dataIndex: 'ProductGroup',
        width: '${productGroupWidth}'
    }]
});
