/**
 * This example shows a treegrid using the "grideditable"
 * and "gridcellediting" plugins. The device type is used
 * to determine which user experience is appropriate.
 *
 * On desktop, double-clicking a cell displays and inline
 * editor, while on mobile devices, a form is shows on
 * the right with all the configured column editors.
 */
Ext.define('KitchenSink.view.grid.tree.Editable', {
    extend: 'Ext.grid.Tree',
    xtype: 'tree-editable',
    title: 'Editable Tree',

    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.Editable'
    ],

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

    platformConfig: {
        desktop: {
            plugins: {
                gridcellediting: true
            }
        },

        '!desktop': {
            plugins: {
                grideditable: true
            }
        }
    },

    columns: [{
        xtype: 'treecolumn',
        text: 'Name',
        flex: 1,
        dataIndex: 'text',
        editable: true
    }, {
        text: 'Class Name',
        flex: 1,
        dataIndex: 'className',
        editable: true
    }]
});
