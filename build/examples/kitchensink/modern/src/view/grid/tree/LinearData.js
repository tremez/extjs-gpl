/**
 * This examples shows how heterogeneous models can be read into a TreeStore offering the
 * ability to have different entity types at different levels of a tree.
 *
 * This tree is loaded using a linear sequence of records which look just like the data
 * for a regular store. The tree structure is imposed by use of a parentId property in the node's data.
 *
 * The toolbar is aware of the type of the selected node and knows what kind of new entity
 * to add.
 */
Ext.define('KitchenSink.view.grid.tree.LinearData', {
    extend: 'Ext.grid.Tree',
    xtype: 'lineardata-tree',
    title: 'Linear Data Geographical Tree',
    controller: 'heterogeneous-tree',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/tree/HeterogeneousController.js'
    }, {
        type: 'Store',
        path: 'app/store/LinearGeoData.js'
    }, {
        type: 'Model',
        path: 'app/model/tree/Territory.js'
    }, {
        type: 'Model',
        path: 'app/model/tree/Country.js'
    }, {
        type: 'Model',
        path: 'app/model/tree/City.js'
    }, {
        type: 'Data',
        path: 'app/data/LinearGeoData.js'
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
    store: 'LinearGeoData',
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
    }, {
        text: 'Type',
        renderer: function(v, record) {
            return record.entityName;
        }
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
