/**
 * This examples shows how heterogeneous models can be read into a TreeStore offering the
 * ability to have different entity types at different levels of a tree.
 *
 * The Model classes at each level of the tree are different types. So you can use associated
 * but different data types in your trees. The key to this is the `typeProperty` config on
 * the Proxy's Reader.
 *
 * A custom renderer is used to set the `glyph` property in the cell `metaData` to change
 * the icon depending upon the node type.
 *
 * The toolbar is aware of the type of the selected node and knows what kind of new entity
 * to add.
 */
Ext.define('KitchenSink.view.grid.tree.Heterogeneous', {
    extend: 'Ext.grid.Tree',
    xtype: 'heterogeneous-tree',
    title: 'Heterogeneous Geographical Tree',
    controller: 'heterogeneous-tree',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/tree/HeterogeneousController.js'
    }, {
        type: 'Store',
        path: 'app/store/GeoData.js'
    }, {
        type: 'Data',
        path: 'app/data/GeoData.js'
    }],

    profiles: {
        defaults: {
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
    rootVisible: false,
    store: 'GeoData',
    width: '${width}',

    selectable: {
        deselectable: true
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    columns: [{
        xtype: 'treecolumn',
        text: 'Name',
        dataIndex: 'name',
        flex: 1
    }],

    items: [{
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            xtype: 'textfield',
            reference: 'newName',
            listeners: {
                action: 'onFieldAction'
            }
        }, {
            reference: 'addButton',
            text: 'Add Territory',
            handler: 'addItem'
        }]
    }]
});
