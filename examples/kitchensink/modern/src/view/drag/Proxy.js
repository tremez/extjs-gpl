/**
 * This example shows options for using a proxy while dragging.
 */
Ext.define('KitchenSink.view.drag.Proxy', {
    extend: 'Ext.Component',
    xtype: 'drag-proxy',
    controller: 'drag-proxy',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/drag/ProxyController.js'
    }],

    profiles: {
        defaults: {
            height: 500,
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

    html: '<div class="proxy-none proxy-source">No proxy</div>' +
          '<div class="proxy-original proxy-source">Element as proxy with revert: true</div>' +
          '<div class="proxy-placeholder proxy-source">Placeholder</div>'
});
