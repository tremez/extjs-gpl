/**
 * This example shows how data can be exchanged between
 * sources and targets.
 */
Ext.define('KitchenSink.view.drag.Data', {
    extend: 'Ext.Component',
    xtype: 'drag-data',
    controller: 'drag-data',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/drag/DataController.js'
    }],

    profiles: {
        defaults: {
            height: 350,
            width: 250
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

    html: '<div class="data-source">' +
              '<div data-days="2" class="handle">Overnight</div>' +
              '<div data-days="7" class="handle">Expedited</div>' +
              '<div data-days="21" class="handle">Standard</div>' +
          '</div>' +
          '<div class="data-target">Drop delivery option here</div>'
});
