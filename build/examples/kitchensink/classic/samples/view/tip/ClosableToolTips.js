/**
 * This view demonstrates how to configure ToolTips which stay displayed
 * until close using a click on a close tool.
 */
Ext.define('KitchenSink.view.tip.ClosableToolTips', {
    extend: 'Ext.Container',
    xtype: 'closable-tooltips',

    //<example>
    requires: [
        'KitchenSink.view.ClosableToolTipsController',
        'KitchenSink.data.ToolTips'
    ],

    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/tip/ClosableToolTipsController.js'
    }],
    //<example>

    controller: 'closable-tooltips',
    padding: 20,
    layout: {
        type: 'hbox',
        align: 'start',
        pack: 'center'
    },

    defaultType: 'button',
    defaults: {
        margin: '0 40 0 0',
        minWidth: 150
    },

    items: [{
        text: 'anchor: "right", rich content',
        reference: 'rich'
    }, {
        text: 'autoHide: false',
        reference: 'autoHide'
    }]
});
