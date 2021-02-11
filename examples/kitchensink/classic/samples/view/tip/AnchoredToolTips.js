/**
 * This view demonstrates how to configure ToolTips who's positions are
 * calculated with reference to their target element.
 */
Ext.define('KitchenSink.view.tip.AnchoredToolTips', {
    extend: 'Ext.Container',
    xtype: 'anchored-tooltips',

    //<example>
    requires: [
        'KitchenSink.view.AnchoredToolTipsController',
        'KitchenSink.data.ToolTips'
    ],

    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/tip/AnchoredToolTipsController.js'
    }],
    //<example>

    controller: 'anchored-tooltips',
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
        text: 'Basic Tip',
        reference: 'basicTip'
    }, {
        text: 'Ajax Tip',
        reference: 'ajax'
    }, {
        text: 'Anchor below',
        reference: 'center'
    }]
});
