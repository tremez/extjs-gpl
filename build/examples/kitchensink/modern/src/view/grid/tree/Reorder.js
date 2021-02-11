/**
 * This example shows basic drag and drop node moving in a tree. In this implementation
 * there are no restrictions and anything can be dropped anywhere except appending to nodes
 * marked "leaf" (the files).
 *
 * In order to demonstrate drag and drop insertion points, sorting is not enabled.
 *
 * The data for this tree is asynchronously loaded through a TreeStore and AjaxProxy.
 */
Ext.define('KitchenSink.view.grid.tree.Reorder', {
    extend: 'Ext.grid.Tree',
    xtype: 'tree-reorder',
    controller: 'tree-reorder',

    requires: [
        'Ext.data.TreeStore',
        'Ext.grid.plugin.TreeDragDrop'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/tree/ReorderController.js'
    }],

    profiles: {
        defaults: {
            title: 'Files',
            overflowScroller: undefined
        },
        phone: {
            defaults: {
                title: undefined,
                overflowScroller: {
                    overflow: 'scroller'
                }
            }
        }
    },
    //</example>

    title: '${title}',
    height: 400,
    width: 350,
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        reference: 'tbar',
        layout: '${overflowScroller}',
        items: [{
            text: 'Expand All',
            handler: 'onExpandAllClick'
        }, {
            text: 'Collapse All',
            handler: 'onCollapseAllClick'
        }, {
            text: 'Reset',
            handler: 'onResetClick'
        }]
    }],

    store: {
        type: 'tree',
        proxy: {
            type: 'ajax',
            url: '/tree/get-nodes.php'
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
    },

    plugins: {
        treedragdrop: true
    }
});
