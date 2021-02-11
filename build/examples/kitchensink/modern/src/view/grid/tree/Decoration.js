/**
 * This example demonstrates tree decoration configurations.
 */
Ext.define('KitchenSink.view.grid.tree.Decoration', {
    extend: 'Ext.tab.Panel',
    xtype: 'tree-decorations',

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
    width: '${width}',

    defaults: {
        xtype: 'tree',
        rootVisible: false,
        // Sharing the store synchronizes the views:
        store: 'Files'
    },

    items: [{
        title: 'Tree with Row Lines',
        rowLines: true
    }, {
        title: 'Only One Expanded Node',
        singleExpand: true
    }]
});
