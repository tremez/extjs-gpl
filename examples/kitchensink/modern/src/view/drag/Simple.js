/**
 * This example shows how to setup a simple drag for an element.
 */
Ext.define('KitchenSink.view.drag.Simple', {
    extend: 'Ext.Component',
    xtype: 'drag-simple',
    controller: 'drag-simple',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/drag/SimpleController.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 500
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

    html: '<div class="simple-source">Drag Me!</div>'
});
