/**
 * Demonstrates the basic functionality of the Ext.Dialog class.
 */
Ext.define('KitchenSink.view.window.BasicDialog', {
    extend: 'Ext.Panel',
    xtype: 'basic-dialog',
    controller: 'basic-dialog',
    title: 'Basic Dialog',

    requires: [
        'Ext.Dialog'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/window/BasicDialogController.js'
    }],

    profiles: {
        defaults: {
            html: KitchenSink.DummyText.mediumText,
            maxDialogWidth: 200,
            width: 200
        },
        phone: {
            defaults: {
                maxDialogWidth: '80vw',
                width: undefined
            }
        }
    },
    //</example>

    // This is the config object used to create the
    // popup dialog in the controller.
    dialog: {
        xtype: 'dialog',
        title: 'Dialog',

        closable: true,
        defaultFocus: '#ok',
        maximizable: true,
        maskTapHandler: 'onCancel',

        bodyPadding: 20,
        maxWidth: '${maxDialogWidth}',
        html: '${html}',

        // We are using standard buttons on the button
        // toolbar, so their text and order are consistent.
        buttons: {
            ok: 'onOK',
            cancel: 'onCancel'
        }
    },

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    layout: {
        type: 'vbox',
        alight: 'stretch'
    },

    items: [{
        xtype: 'button',
        text: 'Show Dialog',
        handler: 'onShowDialog'
    }]
});
