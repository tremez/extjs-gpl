/**
 * Demonstrates a range of overlays ranging from alerts to action sheets
 */
Ext.define('KitchenSink.view.overlays.Overlays', {
    extend: 'Ext.Container',
    xtype: 'overlays',
    controller: 'overlays',

    requires: [
        'Ext.MessageBox',
        'Ext.ActionSheet',
        'Ext.picker.Picker',
        'Ext.Toast'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/overlays/OverlaysController.js'
    }],

    profiles: {
        defaults: {
            height: undefined,
            width: 300,
            overlayHeight: 400,
            overlayWidth: 350
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined,
                overlayHeight: 220,
                overlayWidth: 260
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    height: '${height}',
    padding: 20,
    scrollable: 'y',
    width: '${width}',
    autoSize: true,

    layout: {
        type: 'vbox',
        pack: 'top',
        align: 'stretch'
    },

    defaults: {
        xtype: 'button',
        cls: 'demobtn',
        margin: '10 0'
    },

    items: [{
        text: 'Alert',
        handler: 'showAlert'
    }, {
        text: 'Prompt',
        handler: 'showPrompt'
    }, {
        text: 'Confirm',
        handler: 'showConfirm'
    }, {
        text: 'Picker',
        handler: 'showPicker'
    }, {
        text: 'Toast',
        handler: 'showToast'
    }, {
        text: 'Action Sheet',
        handler: 'showActionSheet'
    }],

    actionsheet: {
        xtype: 'actionsheet',
        items: [{
            text: 'Delete draft',
            ui: 'decline'
        }, {
            text: 'Save draft',
            ui: 'confirm'
        }, {
            text: 'Cancel'
        }]
    },

    picker: {
        xtype: 'picker',
        slots: [{
            name: 'limit_speed',
            title: 'Speed',
            data: [
                { text: '50 KB/s', value: 50 },
                { text: '100 KB/s', value: 100 },
                { text: '200 KB/s', value: 200 },
                { text: '300 KB/s', value: 300 }
            ]
        }]
    }
});
