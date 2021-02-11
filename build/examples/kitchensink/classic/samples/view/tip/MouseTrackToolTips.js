/**
 * This view demonstrates how to configure ToolTips which track the mouse while
 * the mouse is over their target element.
 */
Ext.define('KitchenSink.view.tip.MouseTrackToolTips', {
    extend: 'Ext.Container',
    xtype: 'mousetrack-tooltips',

    //<example>
    requires: [
        'KitchenSink.view.MouseTrackToolTipsController',
        'KitchenSink.data.ToolTips'
    ],

    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/tip/MouseTrackToolTipsController.js'
    }],
    //<example>

    controller: 'mousetrack-tooltips',
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
        text: 'Mouse Track',
        reference: 'track'
    }, {
        text: 'Anchor with tracking',
        reference: 'trackAnchor'
    }]
});
