/**
 * Demnonstrates the functionality of the Ext.Toast class.
 */
Ext.define('KitchenSink.view.window.Toast', {
    extend: 'Ext.panel.Panel',
    xtype: 'toast-view',

    //<example>
    exampleTitle: 'Toast',
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/window/ToastController.js'
    }],
    //</example>
    layout: {
        type: 'vbox',
        alight: 'stretch'
    },
    controller: 'toast-controller',
    width: 400,
    title: 'Ext.Toast',
    bodyPadding: 15,

    items: [
        {
            xtype: 'button',
            text: 'Simple Toast',
            handler: 'onToast1Click'
        },
        {
            xtype: 'button',
            text: 'Toast 2 Lines',
            handler: 'onToast2Click'
        },
        {
            xtype: 'button',
            text: 'Toast Very Long Text',
            handler: 'onToast3Click'
        }
    ]
});
