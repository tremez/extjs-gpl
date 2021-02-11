/**
 * This example shows how to specify handles. Only the child boxes inside
 * the main element can trigger a drag.
 */
Ext.define('KitchenSink.view.drag.Handle', {
    extend: 'Ext.Component',
    xtype: 'drag-handle',
    controller: 'drag-handle',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/drag/HandleController.js'
    }],

    profiles: {
        defaults: {
            height: 400,
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

    html: '<div class="handle-repeat handle-source">' +
              '<div class="handle">Foo</div>' +
              '<div class="handle">Bar</div>' +
              '<div class="handle">Baz</div>' +
          '</div>' +
          '<div class="handle-handles handle-source">' +
              '<div class="handle">Drag</div>' +
          '</div>'
});
