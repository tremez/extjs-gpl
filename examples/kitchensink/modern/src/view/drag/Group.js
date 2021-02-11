/**
 * This example shows drag groups.
 */
Ext.define('KitchenSink.view.drag.Group', {
    extend: 'Ext.Component',
    xtype: 'drag-group',
    controller: 'drag-group',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/drag/GroupController.js'
    }],

    profiles: {
        defaults: {
            height: 300,
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

    html: '<div class="group1">' +
            '<div class="group-source-group1 group-source">group1</div>' +
            '<div class="group-source-group2 group-source">group2</div>' +
            '<div class="group-source-both group-source">group1, group2</div>' +
          '</div>' +

          '<div class="group2">' +
            '<div class="group-target-group1 group-target">group1</div>' +
            '<div class="group-target-group2 group-target">group2</div>' +
            '<div class="group-target-both group-target">group1, group2</div>' +
          '</div>'
});
