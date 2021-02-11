Ext.define('KitchenSink.view.grid.tree.CellEditing', {
    extend: 'Ext.grid.Tree',
    xtype: 'tree-cell-editing',
    title: 'Cell Editing Tree',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'modern/src/store/Files.js'
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
    store: 'Files',
    width: '${width}',

    plugins: {
        gridcellediting: true
    },

    columns: [{
        xtype: 'treecolumn',
        text: 'Name',
        flex: 1,
        dataIndex: 'text',
        editable: true
    }]
});
