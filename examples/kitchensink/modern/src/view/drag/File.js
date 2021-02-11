/**
 * This example shows how to receive an HTML5 File Drop.
 */
Ext.define('KitchenSink.view.drag.File', {
    extend: 'Ext.Component',
    xtype: 'drag-file',
    controller: 'drag-file',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/drag/FileController.js'
    }],

    profiles: {
        defaults: {
            height: 200,
            width: 400
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    height: '${height}',
    padding: 5,
    width: '${width}',

    html: '<div class="drag-file-label">Drag a file from your computer here</div>' +
          '<div class="drag-file-icon"></div>'
});
