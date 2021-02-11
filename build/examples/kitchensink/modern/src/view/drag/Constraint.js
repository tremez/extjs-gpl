/**
 * This example shows various options for constraining draggable items.
 */
Ext.define('KitchenSink.view.drag.Constraint', {
    extend: 'Ext.Component',
    xtype: 'drag-constraint',
    controller: 'drag-constraint',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/drag/ConstraintController.js'
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

    html: '<div class="constrain-drag-ct">' +
              '<div class="constrain-parent constrain-source">To parent</div>' +
          '</div>' +
          '<div class="constrain-vertical constrain-source">Vertical</div>' +
          '<div class="constrain-horizontal constrain-source">Horizontal</div>' +
          '<div class="constrain-snap constrain-source">snap: 60,50</div>'
});
