/**
 * This example is the same as the basic tree sample, however it loads
 * from an XML data source.
 */
Ext.define('KitchenSink.view.grid.tree.Xml', {
    extend: 'Ext.grid.Tree',
    xtype: 'tree-xml',
    title: 'Files',

    requires: [
        'Ext.data.TreeStore'
    ],

    //<example>
    otherContent: [{
        type: 'Data',
        path: 'app/data/FileTree.js'
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
    width: '${width}',

    store: {
        type: 'tree',
        proxy: {
            type: 'ajax',
            url: '/xml-tree/get-nodes.php',
            reader: {
                type: 'xml',
                rootProperty: 'nodes',
                record: 'node'
            }
        },

        root: {
            text: 'Ext JS',
            id: 'src',
            expanded: true
        },

        folderSort: true,

        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]
    }
});
