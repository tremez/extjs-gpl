/**
 * This example demonstrates basic tree configuration.
 */
Ext.define('KitchenSink.view.grid.tree.Basic', {
    extend: 'Ext.grid.Tree',
    xtype: 'basic-trees',

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
    store: 'Files',
    title: 'Files'
});
