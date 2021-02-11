/**
 * Demonstrates the functionality of the Ext.toast API.
 */
Ext.define('KitchenSink.view.window.Toast', {
    extend: 'Ext.Panel',
    xtype: 'toast-view',
    controller: 'toast-view',
    title: 'Ext.Toast',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/window/ToastController.js'
    }],

    profiles: {
        defaults: {
            width: 400
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    layout: {
        type: 'vbox',
        alight: 'stretch'
    },

    items: [{
        xtype: 'button',
        text: 'Simple Toast',
        handler: 'onToast1Click'
    }, {
        xtype: 'button',
        text: 'Toast 2 Lines',
        handler: 'onToast2Click'
    }, {
        xtype: 'button',
        text: 'Toast Long Text',
        handler: 'onToast3Click'
    }]
});
